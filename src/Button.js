;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();

    ////////////////////////////
    // STATIC PRIVATE METHODS //
    ////////////////////////////

    /**
     * Possible events of the buttons
     *
     * @enum {Number}
     * @readOnly
     * @private
     * @memberOf gc.Button
     */
    var State = {
        NORMAL  : 0,
        HOVER   : 1,
        CLICK   : 2,
        SELECT  : 3
    };


    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Possible behaviors for the button
     *
     * @enum {Number}
     * @readOnly
     * @public
     * @memberOf gc.Button
     */
    var Behavior = {
        DESKTOP     : 0,
        MOBILE      : 1,
        SELECT_FIRST: 2
    };

    ///////////////////////////
    // STATIC PUBLIC METHODS //
    ///////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Button
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Clickable button.
     * Implements the Actor interface (update, draw) and the InputListener interface (key, touch, mouse)
     *
     * @param {Number}                              x                                             X-Position of the button
     * @param {Number}                              y                                             Y-Position of the button
     * @param {Object}                              style                                         Style definition for the button
     * @param {gc.NinePatch|gc.TextureRegion|Image} style.normal                                  Background for the normal state
     * @param {gc.NinePatch|gc.TextureRegion|Image} style.hover                                   Background for the hover state
     * @param {gc.NinePatch|gc.TextureRegion|Image} style.select                                  Background for the selected state
     * @param {gc.NinePatch|gc.TextureRegion|Image} style.click                                   Background for the clicked state
     * @param {Object}                              [options]                                     Extra options for the Button behavior
     * @param {String}                              [options.text]                                Text to draw in the button by default
     * @param {String}                              [options.textHover=options.text]              Text to draw in the button when the state is {@link gc.Button.State.HOVER}
     * @param {String}                              [options.textClick=options.text]              Text to draw in the button when the state is {@link gc.Button.State.CLICK}
     * @param {String}                              [options.textSelect=options.text]             Text to draw in the button when the state is {@link gc.Button.State.SELECT}
     * @param {Object}                              [options.textOptions]                         Options to use when creating a text
     * @param {gc.Align}                            [options.textOptions.align=gc.Align.CENTER]   Align of the text in the button
     * @param {Integer}                             [options.textOptions.marginTop=0]             Margin between the text and the top of the limits
     * @param {Integer}                             [options.textOptions.marginRight=0]           Margin between the text and the right of the limits
     * @param {Integer}                             [options.textOptions.marginBottom=0]          Margin between the text and the bottom of the limits
     * @param {Integer}                             [options.textOptions.marginLeft=0]            Margin between the text and the left of the limits
     * @param {CanvasRenderingContext2D}            [options.ctx=false]                           If a Canvas context is specified, {@link gc.Button#draw} will be called automatically on a state change
     * @param {boolean}                             [options.clearRect=true]                      If true, it will call options.ctx.clearRect before drawing on the region of the button) if {@link options.ctx} is specified
     * @param {boolean}                             [options.behavior=gc.Button.Behavior.DESKTOP] Type of behavior for the touch/mouse events
     * @param {Number}                              [options.width]                               Forzed width of the button. If not specified it will take it from the text+styles or the size of the image if not text.
     * @param {Number}                              [options.height]                              Forzed height of the button. If not specified it will take it from the text+styles or the size of the image if not text.
     *
     * @requires gc.Util
     * @requires gc.Validator
     * @requires gc.Text
     * @requires gc.Rectangle
     * @requires gc.NinePatch
     * @requires gc.TextureRegion
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 0.1.0
     * @author @danikaze
     */
    var Button = function(x, y, style, options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _self,
            _options,
            _style,
            _onHover,
            _onClick,
            _onBlur,
            _onRelease,
            _state,
            _bounds,
            _imgs,
            _ctx,
            _clearRect;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(x, y, style, options) {
            var valid,
                size;

            _options = gc.util.extend({
                text        : "",
                ctx         : null,
                clearRect   : true,
                behavior    : Behavior.DESKTOP,
                textOptions : {
                    align         : gc.Align.CENTER,
                    marginTop     : 0,
                    marginRight   : 0,
                    marginBottom  : 0,
                    marginLeft    : 0
                }
            }, options);

            // data validation :start
            _validator.reset()
                      .int("x", x)
                      .int("y", y)
                      .buttonStyle("style", style);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            valid = _validator.valid();

            // data validation :end

            _self = this;
            _style = valid.style;
            _onHover   = [];
            _onClick   = [];
            _onBlur    = [];
            _onRelease = [];
            _state = State.NORMAL;
            _ctx = _options.ctx;
            _clearRect = _options.clearRect;

            switch(_options.behavior) {
                case Behavior.DESKTOP:
                    this.touch = _touchDesktop;
                    break;

                case Behavior.MOBILE:
                    this.touch = _touchMobile;
                    this.mouse = gc.util.noop;
                    break;

                case Behavior.SELECT_FIRST:
                    this.touch = _touchSelectFirst;
                    this.mouse = gc.util.noop;
                    break;
            }

            size = _createImages();
            _bounds = new gc.Rectangle(size.width, size.height, valid.x, valid.y);

            this.getPosition = _bounds.getPosition.bind(_bounds);
            this.getSize = _bounds.getSize.bind(_bounds);
        };

        /**
         * Create the images needed for each state based on the specified options
         *
         * @private
         */
        var _createImages = function _createImages() {
            function canvasFromTextureRegion(tr, w, h) {
                var canvas = document.createElement("canvas");

                canvas.width = w;
                canvas.height = h;
                tr.draw(canvas.getContext("2d"), 0, 0, w, h);

                return canvas;
            }

            var size = new gc.Size2(),
                textSize,
                textOptions,
                text;

            _imgs = [];
            _imgs[State.NORMAL] = _style.normal;
            _imgs[State.HOVER]  = _style.hover;
            _imgs[State.CLICK]  = _style.click;
            _imgs[State.SELECT] = _style.select;

            if(_options.text) {
                size = gc.Text.getFullTextSize(_options.text, _options.textOptions, true);

                if(_options.textHover) {
                    textSize = gc.Text.getFullTextSize(_options.text, _options.textOptions, true);
                    size.width = Math.max(size.width, textSize.width);
                    size.height = Math.max(size.height, textSize.height);
                }

                if(_options.textClick) {
                    textSize = gc.Text.getFullTextSize(_options.textClick, _options.textOptions, true);
                    size.width = Math.max(size.width, textSize.width);
                    size.height = Math.max(size.height, textSize.height);
                }

                if(_options.textSelect) {
                    textSize = gc.Text.getFullTextSize(_options.textSelect, _options.textOptions, true);
                    size.width = Math.max(size.width, textSize.width);
                    size.height = Math.max(size.height, textSize.height);
                }

                if(_imgs[State.NORMAL] instanceof gc.NinePatch) {
                    _imgs[State.NORMAL].setSize(size.width, size.height, true);
                    _imgs[State.HOVER].setSize(size.width, size.height, true);
                    _imgs[State.CLICK].setSize(size.width, size.height, true);
                    _imgs[State.SELECT].setSize(size.width, size.height, true);

                    size = _imgs[State.NORMAL].getSize();

                    textOptions = gc.util.extend({ width: size.width, height: size.height }, _options.textOptions);
                    new gc.Text(_options.text, textOptions, _imgs[State.NORMAL].getContext().canvas);
                    new gc.Text(_options.textHover || _options.text, textOptions, _imgs[State.HOVER].getContext().canvas);
                    new gc.Text(_options.textClick || _options.text, textOptions, _imgs[State.CLICK].getContext().canvas);
                    new gc.Text(_options.textSelect || _options.text, textOptions, _imgs[State.SELECT].getContext().canvas);

                } else {
                    size.width = _options.width || _imgs[State.NORMAL].width;
                    size.height = _options.height || _imgs[State.NORMAL].height;
                    textOptions = gc.util.extend({ width: size.width, height: size.height }, _options.textOptions);

                    _imgs[State.NORMAL] = new gc.TextureRegion(canvasFromTextureRegion(_imgs[State.NORMAL], size.width, size.height));
                    _imgs[State.HOVER] = new gc.TextureRegion(canvasFromTextureRegion(_imgs[State.HOVER], size.width, size.height));
                    _imgs[State.CLICK] = new gc.TextureRegion(canvasFromTextureRegion(_imgs[State.CLICK], size.width, size.height));
                    _imgs[State.SELECT] = new gc.TextureRegion(canvasFromTextureRegion(_imgs[State.SELECT], size.width, size.height));

                    new gc.Text(_options.text, textOptions, _imgs[State.NORMAL].texture);
                    new gc.Text(_options.textHover || _options.text, textOptions, _imgs[State.HOVER].texture);
                    new gc.Text(_options.textClick || _options.text, textOptions, _imgs[State.CLICK].texture);
                    new gc.Text(_options.textSelect || _options.text, textOptions, _imgs[State.SELECT].texture);
                }

            // no text
            } else {
                if(_options.width && _options.height) {
                    size.width  = _options.width;
                    size.height = _options.height;

                    if(_imgs[State.NORMAL] instanceof gc.NinePatch) {
                        _imgs[State.NORMAL].setSize(size.width, size.height);
                        _imgs[State.HOVER].setSize(size.width, size.height);
                        _imgs[State.CLICK].setSize(size.width, size.height);
                        _imgs[State.SELECT].setSize(size.width, size.height);
                    }

                } else {
                    if(_imgs[State.NORMAL] instanceof gc.NinePatch) {
                        size = _imgs[State.NORMAL].getSize();
                        size = { x: size.x, y: size.y };

                    } else {
                        size.width  = _imgs[State.NORMAL].width;
                        size.height = _imgs[State.NORMAL].height;
                    }
                }
            }

            return size;
        };

        /**
         * Call the registered triggers when needed
         *
         * @param {Object[]} callbacks list of functions to call
         *
         * @private
         */
        var _triggerCallback = function _triggerCallback(callbacks) {
            var i, n;

            for(i=0, n=callbacks.length; i<n; i++) {
                callbacks[i]();
            }
        };

        /**
         * Change the state of the Button
         *
         * @param   {gc.Button.State} state [description]
         *
         * @private
         */
        var _setState = function _setState(state, callback) {
            _state = state;

            if(callback) {
                _triggerCallback(callback);
            }

            if(_ctx) {
                if(_clearRect) {
                    _ctx.clearRect(_bounds.x, _bounds.y, _bounds.width, _bounds.height);
                }
                _self.draw(_ctx);
            }
        };

        /**
         * Callback to process touch events from the associated {@link gc.InputListener}.
         * This function makes the buton behave like a normal button for a Desktop application
         *
         * @param  {Number} buttonId  Id of the button. Usually 0 for the left click of the mouse or the first finger
         * @param  {Object} touchData Object with the updated touch information
         * @return {boolean}          If false, the event will stop propagating
         *
         * @private
         */
        var _touchDesktop = function _touchDesktop(touchId, touchData) {
            var continueEventPropagation = true;

            if(touchId !== 0) {
                return;
            }

            if(_state === State.HOVER && touchData.state === gc.InputManager.State.CLICK) {
                continueEventPropagation = false;
                _setState(State.CLICK, _onClick);

            } else if(touchData.state === gc.InputManager.State.RELEASE) {
                if(_state === State.CLICK) {
                    continueEventPropagation = false;
                    _setState(State.NORMAL, _onRelease);

                } else if(_state === State.SELECT) {
                    continueEventPropagation = false;
                    _setState(State.NORMAL, _onBlur);
                }
            }

            return continueEventPropagation;
        };

        /**
         * Callback to process touch events from the associated {@link gc.InputListener}.
         * This function makes the buton behave like a normal button but for mobile application (no hover)
         *
         * @param  {Number} buttonId  Id of the button. Usually 0 for the left click of the mouse or the first finger
         * @param  {Object} touchData Object with the updated touch information
         * @return {boolean}          If false, the event will stop propagating
         *
         * @private
         */
        var _touchMobile = function _touchMobile(touchId, touchData) {
            var continueEventPropagation = true,
                inside = _bounds.contains(touchData.x, touchData.y);

            if(touchData.state === gc.InputManager.State.CLICK) {
                if(inside) {
                    continueEventPropagation = false;
                    if(_state === State.NORMAL) {
                        _setState(State.CLICK, _onClick);
                    }
                }

            } else if(touchData.state === gc.InputManager.State.RELEASE) {
                continueEventPropagation = _state === State.NORMAL;

                if(inside) {
                    _setState(State.NORMAL, _onRelease);

                } else {
                    _setState(State.NORMAL, _onBlur);
                }

            } else {
                if(_state === State.CLICK) {
                    continueEventPropagation = false;
                    if(!inside) {
                        _setState(State.SELECT);
                    }

                } else if(_state === State.SELECT) {
                    continueEventPropagation = false;
                    if(inside) {
                        _setState(State.CLICK);
                    }
                }
            }

            return continueEventPropagation;
        };

        /**
         * Callback to process touch events from the associated {@link gc.InputListener}.
         * This function makes a button for mobile devides, requiring two clicks to select a button.
         *
         * @param  {Number} buttonId  Id of the button. Usually 0 for the left click of the mouse or the first finger
         * @param  {Object} touchData Object with the updated touch information
         * @return {boolean}          If false, the event will stop propagating
         *
         * @private
         */
        var _touchSelectFirst = function _touchSelectFirst(touchId, touchData) {
            var continueEventPropagation = true,
                inside = _bounds.contains(touchData.x, touchData.y);

            if(touchData.state === gc.InputManager.State.CLICK) {
                if(_state === State.NORMAL && inside) {
                    continueEventPropagation = false;
                    _setState(State.CLICK, _onClick);

                } else if(_state === State.CLICK && touchData.state === gc.InputManager.State.CLICK) {
                    continueEventPropagation = false;
                    if(inside) {
                        _setState(State.NORMAL, _onRelease);

                    } else {
                        _setState(State.NORMAL, _onBlur);
                    }
                }
            }

            return continueEventPropagation;
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Update the button {@link delta} milliseconds.
         *
         * @param  {Number} delta Milliseconds to update the Button
         * @return {gc.Button}     Self reference for chaining
         *
         * @public
         */
        this.update = function update(delta) {
            return this;
        };

        /**
         * Draw the button in the specified Canvas, with the specified camera
         *
         * @param  {CanvasRenderingContext2D} ctx Canvas2D context where to draw the Button
         * @return {gc.Button}                    Self reference for chaining
         *
         * @public
         */
        this.draw = function draw(ctx) {

            _imgs[_state].draw(ctx, _bounds.x, _bounds.y, _bounds.width, _bounds.height);

            return this;
        };

        /**
         * Callback to process key events from the associated {@link gc.InputListener}.
         *
         * @param  {Number} keyCode Key Code of the affected key
         * @param  {Object} keyData Data of the updated key
         * @return {boolean}        If false, the event will stop propagating
         *
         * @public
         */
        this.key = function key(keyCode, keyData) {
            return true;
        };

        /**
         * Callback to process touch events from the associated {@link gc.InputListener}.
         *
         * @param  {Number} buttonId  Id of the button. Usually 0 for the left click of the mouse or the first finger
         * @param  {Object} touchData Object with the updated touch information
         * @return {boolean}          If false, the event will stop propagating
         *
         * @public
         */
        this.touch = gc.util.noop;

        /**
         * Callback to process mouse events from the associated {@link gc.InputListener}.
         *
         * @param  {Object} mousePosition Object with the last mouse position { x, y }
         * @return {boolean}              If false, the event will stop propagating
         *
         * @public
         */
        this.mouse = function mouse(mouseData) {
            var continueEventPropagation = true;

            if(_bounds.contains(mouseData.x, mouseData.y)) {
                if(_state === State.NORMAL) {
                    _setState(State.HOVER, _onHover);
                    continueEventPropagation = false;

                } else if(_state === State.SELECT) {
                    _setState(State.CLICK);
                    continueEventPropagation = false;
                }

            } else {
                if(_state === State.HOVER) {
                    _setState(State.NORMAL, _onBlur);
                    continueEventPropagation = false;

                } else if(_state === State.CLICK) {
                    _setState(State.SELECT);
                    continueEventPropagation = false;
                }
            }

            return continueEventPropagation;
        };

        /**
         * Add a callback to execute when the Button is hovered
         *
         * @param  {Function}  callback Function to execute
         * @return {gc.Button}          Self object to allow chaining
         *
         * @public
         */
        this.onHover = function onHover(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _onHover.push(callback);

            return this;
        };

        /**
         * Add a callback to execute when the Button is clicked
         *
         * @param  {Function}  callback Function to execute
         * @return {gc.Button}          Self object to allow chaining
         *
         * @public
         */
        this.onClick = function onClick(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _onClick.push(callback);

            return this;
        };

        /**
         * Add a callback to execute when the mouse exits the Button, or released when the mouse is not over the Button
         *
         * @param  {Function}  callback Function to execute
         * @return {gc.Button}          Self object to allow chaining
         *
         * @public
         */
        this.onBlur = function onBlur(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _onBlur.push(callback);

            return this;
        };

        /**
         * Add a callback to execute when the Button is clicked and released while the mouse is still over the Button
         *
         * @param  {Function}  callback Function to execute
         * @return {gc.Button}          Self object to allow chaining
         *
         * @public
         */
        this.onRelease = function onRelease(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _onRelease.push(callback);

            return this;
        };

        /**
         * Set the size of the Rectangle
         *
         * @param  {Number}       [width=0]  New value for the width
         * @param  {Number}       [height=0] New value for the height
         * @return {gc.Rectangle}            Self reference for allowing chaining
         *
         * @public
         */
        this.setSize = function setSize(width, height) {
            var size;

            _options.width = width;
            _options.height = height;

            if(_options.text || _imgs[State.NORMAL] instanceof gc.NinePatch) {
                size = _createImages();
            }
            _bounds.setSize(size.width, size.height);

            return this;
        };

        /**
         * Get the size of the Rectangle as an object
         *
         * @return {Object} Values as {width, height}
         *
         * @public
         */
        //this.getSize = function _bounds.getSize;

        /**
         * Set the position of the Rectangle
         *
         * @param  {Number}       [x=0] New value for the x-coordinate
         * @param  {Number}       [y=0] New value for the y-coordinate
         * @return {gc.Rectangle}       Self reference for allowing chaining
         *
         * @public
         */
        this.setPosition = function setPosition(x, y) {
            _bounds.setPosition(x, y);

            return this;
        };

        /**
         * Get the position of the Rectangle as an object
         *
         * @return {Object} Values as {x, y}
         *
         * @public
         */
        //this.getPosition = _bounds.getPosition;


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
    gc.Button = Button;
    gc.util.defineConstant(gc.Button, "VERSION", VERSION);
    gc.util.defineConstant(gc.Button, "Behavior", Behavior);

} (window, window.gc));
