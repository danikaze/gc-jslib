;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator({ validators: gc.validatorDefinitions.Text }),
        _escapedActions = {},
        _escapeRegEx,
        _textMetricsCache = {},
        _defaultOptions = {
            marginTop   : 0,
            marginRight : 0,
            marginBottom: 0,
            marginLeft  : 0,
            width       : 0,
            height      : 0,
            limit       : null,
            delay       : 0,
            style       : {
                font        : "10px sans-serif",
                fill        : true,
                fillStyle   : "#000000",
                stroke      : false,
                strokeStyle : "#000000",
                lineMargin  : 0
            }
        };


    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @public
     * @memberOf gc.Text
     */
    var VERSION = "1.0.0";

    /**
     * Character to detect a escape sequence
     *
     * @type {String}
     * @readOnly
     * @public
     * @memberOf gc.Text
     */
    var ESCAPE_CHAR = "\\";


    ///////////////////////////
    // STATIC PUBLIC METHODS //
    ///////////////////////////

    /**
     * Register an action associated to an escape string and prepares a RegExp for future later processing
     *
     * @param  {String} escapeString Escape String without the ESCAPE_CHAR. I.e "s1" would be used with \s1
     * @param  {Object} options      Options of the action
     *
     * @public
     * @memberOf gc.Text
     */
    function registerAction(escapeString, options) {
        var regExpEscapedStrings = ["bBcdDfnrsStvwWxu0123456789"],
            re = _escapeRegEx ? _escapeRegEx.source : "",
            i;

        _escapedActions[escapeString] = options;

        re = (_escapeRegEx ? _escapeRegEx.source +"|(" :  "(") + ESCAPE_CHAR + ESCAPE_CHAR + escapeString + ")";

        _escapeRegEx = new RegExp(re, "g");
    }

    /**
     * Get metrics information about a font (with style)
     *
     * @param  {String} font                  Font style (the same that ctx.font)
     * @param  {String} [alphabeticText="Hg"] Alphabetic text to get the metrics from
     * @param  {String} [ideographicText="達"] Ideographic text to get the metrics from
     * @return {Object}                       Font information as {
     *                                            ascent,
     *                                            descent,
     *                                            height
     *                                        }
     *
     * @public
     * @memberOf gc.Text
     */
    function getTextMetrics(font, testText) {
        var text, block, div, body,
            cacheKey,
            result = {};

        if(!testText) {
            testText = "Hg達";
        }
        cacheKey = font + ":" + text;

        if(_textMetricsCache[cacheKey]) {
            return _textMetricsCache[cacheKey];
        }

        text = document.createElement("span");
        text.innerText = testText;
        text.style.font = font;

        block = document.createElement("div");
        block.style.display = "inline-block";
        block.style.width = "1px";
        block.style.height = "0";

        div = document.createElement("div");
        div.appendChild(text);
        div.appendChild(block);

        body = document.body;
        body.appendChild(div);

        try {
            block.style.verticalAlign = "baseline";
            result.ascent = block.offsetTop - text.offsetTop;

            block.style.verticalAlign = "bottom";
            result.height = block.offsetTop - text.offsetTop;

            result.descent = result.height - result.ascent;

        } finally {
            div.parentNode.removeChild(div);
        }

        _textMetricsCache[cacheKey] = result;

        return result;
    }

    function setDefaultOptions(options) {
        _defaultOptions = gc.util.extend(_defaultOptions, options);
    }

    /**
     * Class to write formatted text and cache it in Images
     *
     * @param
     *
     * @requires gc.Util
     * @requires gc.Validator
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Text = function(text, options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _originalText,  // original text string
            _text,          // processed text object with all the parameters needed to render
            _fbo,           // canvas used as cache for the rendered text
            _fullTextSize,  // size of the full text
            _options,       // behavior options
            _state;         // rendering state properties

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @param {String} text     text to draw
         * @param {Object} options  options to modify the behavior of the Text
         * @param {canvas} [canvas] if specified, it will store a reference and draw over this canvas instead of creating a new one
         *
         * @private
         */
        function _construct(text, options, canvas) {
            var textSize,
                newCanvas = !canvas;

            _options = gc.util.extend({}, _defaultOptions, options);

            // data validation :start
            _validator.reset()
                      .str("text", text)
                      .int("marginTop", _options.marginTop)
                      .int("marginRight", _options.marginRight)
                      .int("marginBottom", _options.marginBottom)
                      .int("marginLeft", _options.marginLeft)
                      .intPositive("width", _options.width)
                      .intPositive("height", _options.height);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            _options = _validator.valid(_options);
            // data validation :end

            if(newCanvas) {
                canvas = document.createElement('canvas');
            }

            _fbo = new gc.Canvas2D(canvas).getContext();

            _originalText = text;
            _text = _processText(text);

            _fullTextSize = this.fullTextSize(true);

            if(newCanvas) {
                canvas.width = _options.width || _fullTextSize.width;
                _options.width = canvas.width;
                canvas.height = _options.height || _fullTextSize.height;
                _options.height = canvas.height;
            }

            if(_options.marginLeft + _options.width + _options.marginRight > canvas.width) {
                _options.width = canvas.width - _options.marginLeft;
            }
            if(_options.marginTop + _options.height + _options.marginBottom > canvas.height) {
                _options.height = canvas.height - _options.marginTop;
            }

            _resetState();
            _renderText();
        };

        /**
         * Reset the state of rendering to start from the begining
         *
         * @private
         */
        function _resetState() {
            _state = {
                x           : _options.x,
                y           : _options.y,
                fill        : true,
                stroke      : false,
                lineMargin  : _options.style.lineMargin,
                line        : 0,
                token       : 0,
                character   : 0,
                textMetrics : getTextMetrics(_options.style.font)
            };

            _fbo.font = _options.style.font;
            _fbo.fillStyle = _options.style.fillStyle;
            _fbo.strokeStyle = _options.style.strokeStyle;
            _fbo.textBaseline = "bottom";
        }

        /**
         * Apply one of the actions based on its parameters
         *
         * @param   {String} key Escaped string used as key for the action
         *
         * @private
         */
        function _applyAction(key) {
            var action = _escapedActions[key];

            if(action.font) {
                _fbo.font = action.font;
                _state.textMetrics = getTextMetrics(action.font);
            }
            if(action.fillStyle) {
                _fbo.fillStyle = action.fillStyle;
            }
            if(action.strokeStyle) {
                _fbo.strokeStyle = action.strokeStyle;
            }
            if(action.lineMargin) {
                _state.lineMargin = action.lineMargin;
            }
            if(typeof action.fill !== undefined) {
                _state.fill = action.fill;
            }
            if(typeof action.stroke !== undefined) {
                _state.stroke = action.stroke;
            }
        }
        /**
         * Prepare the text into an object for faster drawing
         * Note: it modifies the current state of the object: _state
         *
         * @param  {String} text Formated text to draw
         * @return {Array}  List of lines as res[lines]. Each line having properties and a list of tokens as:
         *                    res.y                 - y-position of the line
         *                    res[] = {
         *                        x           - x-position of the line
         *                        text        - text to draw at (res[].x, res.y)
         *                        action      - action to apply after drawing the token text
         *                    }
         * @private
         */
        function _processText(text)
        {
            function getEscapeStrings(txt) {
                var res = [],
                    m;

                if(_escapeRegEx) {
                    while(m = _escapeRegEx.exec(txt)) {
                        res.push({
                            index: m.index,
                            str  : m[0].substring(ESCAPE_CHAR.length)
                        });
                    }
                }

                return res;
            }

            var res = [],
                line, nLines,
                escaped, nEscaped,
                e, offset,
                token,
                x,
                y = 0,
                lineHeight;

            // first, split it in lines by new-lines characters
            text = text.split("\n");
            _resetState();
            _fullTextSize = {
                width: 0,
                height: 0
            };

            // then, split each line into an array of parts that can be drawn all at once
            for(line=0, nLines=text.length; line<nLines; line++) {
                res[line] = [];
                x = 0;
                lineHeight = _state.textMetrics.height;

                escaped = getEscapeStrings(text[line]);
                offset = 0;

                for(e=0, nEscaped=escaped.length; e<nEscaped; e++) {
                    token = {
                        x     : x,
                        txt   : text[line].substring(offset, escaped[e].index),
                        action: escaped[e].str
                    };
                    res[line].push(token);

                    offset = escaped[e].index + ESCAPE_CHAR.length + escaped[e].str.length;
                    x += _fbo.measureText(token.txt).width;

                    _applyAction(escaped[e].str);
                    lineHeight = Math.max(lineHeight, _state.textMetrics.height);
                }

                token = {
                    x  : x,
                    txt: text[line].substring(offset)
                };

                x += _fbo.measureText(token.txt).width;
                y += lineHeight;

                res[line].push(token);
                res[line].y = y;

                _fullTextSize.width = Math.max(_fullTextSize.width, x);
            }

            _fullTextSize.height = y;

            return res;
        }

        /**
         * Render the text according to the behavior into the FBO
         * It modifies the _state of the Text object (of course)
         *
         * @private
         */
        function _renderText() {
            var i, nLines,
                t, nTokens,
                token;

            _resetState();

            // for each line apply the actions to see how to draw the last token
            for(i=0, nLines=_text.length; i<nLines; i++) {
                for(t=0, nTokens=_text[i].length; t<nTokens; t++) {
                    token = _text[i][t];

                    if(_state.fill) {
                        _fbo.fillText(token.txt, token.x, _text[i].y);
                    }
                    if(_state.stroke) {
                        _fbo.strokeText(token.txt, token.x, _text[i].y);
                    }

                    if(token.action) {
                        _applyAction(token.action);
                    }
                }
            }
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////


        this.draw = function draw(ctx) {
            switch(arguments.length) {
                case 3: // draw(img, x, y)
                    ctx.drawImage(_fbo.canvas, arguments[1], arguments[2]);
                    break;
            }
        }

        this.fullTextSize = function fullTextSize(includeMargins) {
            var width  = _fullTextSize.width,
                height = _fullTextSize.height;

            if(includeMargins) {
                width  += _options.marginLeft + _options.marginRight;
                height += _options.marginTop  + _options.marginBottom;
            }

            return {
                width : Math.ceil(width),
                height: Math.ceil(height)
            };
        }

        // call the constructor after setting all the methods
        _construct.apply(this, arguments);
    };


    ///////////////////////////////
    // Export the public objects //
    ///////////////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.Text = Text;
    gc.util.defineConstant(gc.Text, "VERSION", VERSION);
    gc.util.defineConstant(gc.Text, "ESCAPE_CHAR", ESCAPE_CHAR);
    gc.Text.registerAction = registerAction;
    gc.Text.getTextMetrics = getTextMetrics;
    gc.Text.setDefaultOptions = setDefaultOptions;

} (window, window.gc));
