;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator({ validators: gc.validatorDefinitions.Text }),
        _escapeChar = "\\",
        _wordSplitRegEx = "[ \t]",
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
            speed       : 0,
            pauseOn     : ",、.。"
            pauseLength : 1000
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
    var VERSION = "0.2.1";

    ///////////////////////////
    // STATIC PUBLIC METHODS //
    ///////////////////////////

    /**
     * Set the escape string that triggers an action
     *
     * @param  {String} [str="\\"] String preceding the name of the action
     *
     * @public
     * @memberOf gc.Text
     */
    function setEscapeChar(str) {
        var i;

        _escapeChar = str | "\\";

        // regenerate the _escapeRegEx
        _escapeRegEx = undefined;
        for(i in _escapedActions) {
            registerAction(i, _escapedActions[i]);
        }
    }

    /**
     * Get the string that precedes the name of the actions
     *
     * @return {String} escape string
     *
     * @public
     * @memberOf gc.Text
     */
    function getEscapeChar() {
        return _escapeChar;
    }

    /**
     * Set the regular expression to split words for line wrapping
     *
     * @param  {String} [regExpSource="[ \t]" source for the regexp as string, not regExp
     *
     * @public
     * @memberOf gc.Text
     */
    function setWordSplitRegExp(regExpSource) {
        _wordSplitRegEx = regExpSource | "[ \t]";
    }

    /**
     * Get the regular expression to split words for line wrapping
     *
     * @return  {String} source for the regexp as string
     *
     * @public
     * @memberOf gc.Text
     */
    function getWordSplitRegExp() {
        return _wordSplitRegEx;
    }

    /**
     * Register an action associated to an escape string and prepares a RegExp for future later processing
     *
     * @param  {String} escapeString Escape String without the {@link gc.Text#getEscapeChar}. I.e "s1" would be used with \s1
     * @param  {Object} options      Options of the action
     *
     * @public
     * @memberOf gc.Text
     */
    function registerAction(escapeString, options) {
        var re = _escapeRegEx ? _escapeRegEx.source : "",
            i;

        _validator.reset()
                  .textStyle("options", options);

        if(_validator.errors()) {
            throw new gc.exception.WrongDataException(_validator.errors());
        }

        _escapedActions[escapeString] = _validator.valid().options;

        re = (_escapeRegEx ? _escapeRegEx.source +"|(" :  "(") + (_escapeChar === "\\" ? _escapeChar + _escapeChar : _escapeChar) + escapeString + ")";

        _escapeRegEx = new RegExp(re, "g");
    }

    /**
     * Get metrics information about a font (with style).
     * The result is cached for the font:testText pair
     *
     * @param  {String} font              Font style (the same that ctx.font)
     * @param  {String} [testText="Hg達"]  Alphabetic text to get the metrics from
     * @return {Object}                   Font information as {
     *                                        ascent,
     *                                        descent,
     *                                        height
     *                                    }
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

    /**
     * Extend the default options to use when creating a new Text instance
     *
     * @param {Object} options set or subset of options as specified in {@gc.Text}
     *
     * @public
     * @memberOf gc.Text
     */
    function setDefaultOptions(options) {
        _defaultOptions = gc.util.extend(true, _defaultOptions, options);
    }

    /**
     * Class to write formatted text and cache it in Images
     *
     * @param {String}  text                         Formatted text to draw
     * @param {Object}  options                      Options to define the Text behavior
     * @param {Integer} [options.marginTop=0]        Margin between the text and the top of the limits
     * @param {Integer} [options.marginRight=0]      Margin between the text and the right of the limits
     * @param {Integer} [options.marginBottom=0]     Margin between the text and the bottom of the limits
     * @param {Integer} [options.marginLeft=0]       Margin between the text and the left of the limits
     * @param {Integer} [options.width=0]            If specified, the text will break lines to this width
     * @param {Integer} [options.height=0]           If specified, the text will be limited to this height
     * @param {Integer} [options.limit=null]         Number of printable characters to draw
     * @param {Integer} [options.delay=0]            Delay before start drawing
     * @param {Integer} [options.speed=0]            Speed to draw the text or 0 to draw it all at once.
     * @param {String}  [options.pauseOn=",.、。"]     Make a pause when find one of this characters
     * @param {Integer} [options.pauseLength=1000]   Length of the pause (in ms.) done after drawing a character in {@link options.pauseOn}
     * @param {Object}  [options.style]              Style options
     * @param {String}  [options.style.font]         Style to use for the font
     * @param {boolean} [options.style.fill=true]    true to fill the text
     * @param {String}  [options.style.fillStyle]    Style to apply to the text when filled
     * @param {boolean} [options.style.stroke=false] true to stroke the text
     * @param {String}  [options.style.strokeStyle]  Style to apply to the text when stroked
     * @param {Integer} [options.style.lineMargin]   Extra margin to add between lines in px.
     * @param {Canvas}  [canvas]                     Canvas to use as a buffer background
     *
     * @requires gc.Util
     * @requires gc.Validator
     * @requires gc.Canvas2D
     * @requires gc.Drawable
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 0.2.1
     * @author @danikaze
     */
    var Text = function(text, options, canvas) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _drawable,
            _originalText,  // original text string
            _text,          // processed text object with all the parameters needed to render
            _fbo,           // canvas context used as cache for the rendered text
            _fullTextSize,  // size of the full text as { width, height }
            _options,       // behavior options (see gc.Text constructor)
            _state;         // rendering state properties (see gc.Text.resetState)

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
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
                      .intPositive("options.limit", _options.limit)
                      .intPositive("options.delay", _options.delay)
                      .floatPositive("options.speed", _options.speed)
                      .str("options.pauseOn", _options.pauseOn)
                      .floatPositive("options.pauseLength", _options.pauseLength)
                      .textStyle(options.style);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            _options = _validator.valid(_options);
            // data validation :end

            if(newCanvas) {
                canvas = document.createElement("canvas");
            }

            _fbo = new gc.Canvas2D(canvas).getContext();

            _originalText = text;
            _text = _processText(text);

            textSize = this.getFullTextSize(true);

            if(newCanvas) {
                canvas.width = _options.width || textSize.width;
                _options.width = canvas.width;
                canvas.height = _options.height || textSize.height;
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
            _drawable = new gc.Drawable(canvas);
            _drawable.drawable(this);
        };

        /**
         * Reset the state of rendering to start from the begining
         *
         * @private
         */
        function _resetState() {
            _state = {
                fill        : true,
                stroke      : false,
                lineMargin  : _options.style.lineMargin,
                line        : 0,
                token       : 0,
                character   : 0,
                textMetrics : getTextMetrics(_options.style.font),
                pause       : 0
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
            if(action.pause) {
                _state.pause += action.pause;
            }
        }

        /**
         * Prepare the text into an object for faster drawing
         * Note: it modifies the current state of the object: _state
         *
         * @param  {String} text Formated text to draw
         * @return {Array}  List of lines as res[lines]. Each line having properties and a list of tokens as:
         *                    res.y       y-position of the line
         *                    res[] = {
         *                        x       x-position of the line
         *                        text    text to draw at (res[].x, res.y)
         *                        action  action to apply after drawing the token text
         *                    }
         * @private
         */
        function _processText(text)
        {
            /*
             * Get the escape strings from a formatted text, as [{text,escape}]
             */
            function getEscapeStrings(txt) {
                var res = [],
                    m,
                    i = 0;

                if(_escapeRegEx) {
                    while(m = _escapeRegEx.exec(txt)) {
                        res.push({
                            txt   : txt.substring(i, m.index),
                            action: m[0].substring(_escapeChar.length)
                        });
                        i = m.index + m[0].length;
                    }
                }
                if(i < txt.length) {
                    res.push({ txt: txt.substring(i) });
                }

                return res;
            }

             /*
             * Split a text to fit in certain size, and fill the needed variables with the new subwords
             */
            function fitWord(txt, txtWidth, availableWidth, wi, words, separators) {
                var i = Math.floor((txt.length - 1) * (availableWidth / txtWidth)),
                    word = txt.substring(0, i),
                    tryWord,
                    width = _fbo.measureText(word).width,
                    searching = true;

                // try to guess the correct i, and then correct it to fit the maximum available space
                while(searching) {
                    if(width < availableWidth) {
                        tryWord = word + txt[i];
                        for(;;) {
                            width = _fbo.measureText(tryWord).width;
                            if(width > availableWidth) {
                                words.splice(wi+1, 0, word);
                                separators.splice(wi, 0, "");
                                searching = false;
                                break;
                            }
                            word = tryWord;
                            tryWord += txt[i++];
                        }

                    } else {
                        for(;;) {
                            word = word.substring(0, i-1);
                            width = _fbo.measureText(word).width;
                            if(width < availableWidth) {
                                words.splice(wi+1, 0, word);
                                separators.splice(wi, 0, "");
                                searching = false;
                                break;
                            }
                            i--;
                        }
                    }
                }

                words.splice(wi+2, 0, txt.substring(word.length));
                separators.splice(wi, 0, separators[wi]);
            }

            /*
             * Given a unformatted text, pushes tokens while splitting it into lines if needed
             */
            function tokenizeString(txt, action) {
                var word, wordWidth,
                    re = new RegExp(_wordSplitRegEx, "g"),
                    words = txt.split(re),
                    separators = [],
                    separator,
                    tokenText = "",
                    xx = x,
                    i;

                while(i = re.exec(txt)) {
                    separators.push(i[0])
                }

                for(i=0; i<words.length; i++) {
                    word = words[i];
                    separator = separators[i] ? separators[i] : "";
                    wordWidth = _fbo.measureText(word).width;

                    // if the word can't be splitted... just put as much as fits
                    if(wordWidth > availableWidth) {
                        fitWord(word, wordWidth, availableWidth, i, words, separators);
                        continue;
                    }

                    // if the word still fits the line, keep pushing
                    if(xx + wordWidth < maxX) {
                        tokenText += word + separator;
                        xx += wordWidth + _fbo.measureText(separator).width;

                    // if the word doesn't fits the line
                    } else {
                        // put whatever fits
                        token = {
                            x     : x,
                            txt   : tokenText
                        };
                        res[line].push(token);
                        // put the rest in the next line
                        text.splice(line+1, 0, txt.substring(tokenText.length));
                        // and set the variables as starting to the next line
                        y += lineHeight;
                        res[line].y = y;
                        res.push([]);
                        line++;
                        y += _state.lineMargin;
                        _fullTextSize.width = Math.max(_fullTextSize.width, xx - _options.marginLeft);
                        tokenText = word + separator;
                        x = _options.marginLeft;
                        xx = x + wordWidth + _fbo.measureText(separator).width;
                    }
                }
                // and put the final part, which doesn't break
                token = {
                    x     : x,
                    txt   : tokenText,
                    action: action
                };
                res[line].push(token);
                x = xx;
            }

            //////////////////
            // _processText //
            //////////////////
            var res = [],
                line,
                e, escaped, nEscaped,
                token,
                x,
                maxX = _options.width != 0 ? _options.width - _options.marginRight : Infinity,
                availableWidth = maxX - _options.marginLeft,
                y = _options.marginTop,
                lineHeight;

            // first, split it in lines by new-lines characters
            text = text.split("\n");
            _resetState();
            lineHeight = _state.textMetrics.height;
            _fullTextSize = {
                width: 0,
                height: 0
            };

            // then, split each line into an array of parts that can be drawn all at once
            for(line=0; line<text.length; line++) {
                res[line] = [];
                x = _options.marginLeft;
                lineHeight;

                escaped = getEscapeStrings(text[line]);

                for(e=0, nEscaped=escaped.length; e<nEscaped; e++) {
                    tokenizeString(escaped[e].txt, escaped[e].action);

                    if(escaped[e].action) {
                        _applyAction(escaped[e].action);
                        lineHeight = Math.max(lineHeight, _state.textMetrics.height);
                    }
                }

                y += lineHeight;
                res[line].y = y;

                _fullTextSize.width = Math.max(_fullTextSize.width, x - _options.marginLeft);
            }

            _fullTextSize.height = y - _options.marginTop;

            return res;
        }

        /**
         * Render the text according to the behavior into the FBO
         * It modifies the _state of the Text object (of course)
         *
         * @private
         */
        function _renderText() {
            var nLines,
                nTokens,
                token;

            _resetState();

            // for each line apply the actions to see how to draw the last token
            for(_state.line=0, nLines=_text.length; _state.line<nLines; _state.line++) {
                for(_state.token=0, nTokens=_text[_state.line].length; _state.token<nTokens; _state.token++) {
                    token = _text[_state.line][_state.token];

                    if(_state.fill) {
                        _fbo.fillText(token.txt, token.x, _text[_state.line].y);
                    }
                    if(_state.stroke) {
                        _fbo.strokeText(token.txt, token.x, _text[_state.line].y);
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

        /**
         * Get the size that the text would have without limits, but with format
         *
         * @param  {boolean} includeMargins if true, the margins will be included in the result
         * @return {Object}                 Object as {width, height}
         *
         * @public
         */
        this.getFullTextSize = function getFullTextSize(includeMargins) {
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

        /**
         * Get an option.
         * If the requested option doesn't exist, it will trigger an exception.
         *
         * @param  {String} key Name of the option to get
         * @return {mixed}      Value of the requested option.
         *
         * @public
         */
        this.getOption = function getOption(key) {
            if(typeof _options[key] === "undefined") {
                throw new gc.exception.WrongDataException("Option " + key + " is not defined");
            }

            return _options[key];
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
    gc.Text.setEscapeChar       = setEscapeChar;
    gc.Text.getEscapeChar       = getEscapeChar;
    gc.Text.setWordSplitRegExp  = setWordSplitRegExp;
    gc.Text.getWordSplitRegExp  = getWordSplitRegExp;
    gc.Text.registerAction      = registerAction;
    gc.Text.getTextMetrics      = getTextMetrics;
    gc.Text.setDefaultOptions   = setDefaultOptions;

} (window, window.gc));
