;(function(window, gc, document, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator({ validators: gc.validatorDefinitions.InputManager });

    ////////////////////////////
    // STATIC PRIVATE METHODS //
    ////////////////////////////

    function _nextButtonState(current, pressed) {
        switch(current) {
            case undefined:
            case State.NORMAL:
                return pressed ? State.CLICK
                               : State.NORMAL;

            case State.CLICK:
                return pressed ? State.PRESS
                               : State.RELEASE;

            case State.PRESS:
                return pressed ? State.PRESS
                               : State.RELEASE;

            case State.RELEASE:
                return pressed ? State.CLICK
                               : State.NORMAL;
        }
    }

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Possible events to listen
     *
     * @enum {Number}
     * @readOnly
     * @public
     * @memberOf gc.InputManager
     */
    var Event = {
        MOUSE_MOVE          : 0,
        TOUCH_DOWN          : 1,
        TOUCH_UP            : 2,
        KEY_UP              : 10,
        KEY_DOWN            : 11
    };

    /**
     * Possible events of the buttons
     *
     * @enum {Number}
     * @readOnly
     * @public
     * @memberOf gc.InputManager
     */
    var State = {       // pressed: ░░░▓▓▓▓░░░░
        NORMAL  : 0,    //          ▓▓▓░░░░░▓▓▓
        CLICK   : 1,    //          ░░░▓░░░░░░░
        PRESS   : 2,    //          ░░░░▓▓▓░░░░
        RELEASE : 3     //          ░░░░░░░▓░░░
    };


    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.InputManager
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Manage mouse, key and touch input.
     * It uses {@link gc.Stage}, which should be an Interface, but there is nothing to specify formal interfaces,
     * so when talking about {@link gc.Stage} is just an object that validates {@link gc.Validator#implementsInterface},
     * that is, with the following functions: key, touch, mouse, draw, update
     *
     * @param {DOM}     [element=document]        Element to listen to
     * @param {Object}  [options]                 Custom options
     * @param {boolean} [options.boundMouse=true] If true, the mouse and touch events will only be triggered when INSIDE the provided {@link element}
     * @param {Number}  [options.trackTouch=1]    Max number of buttons to track for the mouse or fingers at the same time
     *                                            (usually mouse.left=0, mouse.right=2, mouse.middle=1)
     *
     * @requires gc.Util
     * @requires gc.Validator
     *
     * @constructor
     * @memberOf gc
     * @version 0.1.0
     * @author @danikaze
     */
    var InputManager = function(element, options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _keyFilter,
            _listeners,
            _bounds,
            _offset,
            _options;

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance.
         *
         * @private
         */
        var _construct = function _construct(element, options) {
            var i,
                updateKey = _updateKey.bind(this),
                updateTouch,
                style,
                rect;

            _options = gc.util.extend({
                boundMouse: true,
                trackTouch: 1
            }, options);

            if(!element) {
                element = document;
            }

            _listeners = [];

            /** state of the tracked keys */
            this.keys = {};
            /** state of the tracked buttons */
            this.touch = [];
            /** last position of the mouse */
            this.mouse = {
                x: 0,
                y: 0,
            };
            /** state of the modifier keys */
            this.mod = {
                alt  : false,
                ctrl : false,
                shift: false
            };

            for(i=0; i<_options.trackTouch; i++) {
                this.touch.push({});
            }

            style = getComputedStyle(element);
            rect = element.getBoundingClientRect();
            _offset = new gc.Point2(rect.left + parseInt(style.getPropertyValue("border-left-width")) + parseInt(style.getPropertyValue("padding-left")),
                                    rect.top  + parseInt(style.getPropertyValue("border-top-width"))  + parseInt(style.getPropertyValue("padding-top")));
            _bounds = new gc.Rectangle(rect.right  - _offset.x - parseInt(style.getPropertyValue("border-right-width"))  - parseInt(style.getPropertyValue("padding-right")),
                                       rect.bottom - _offset.y - parseInt(style.getPropertyValue("border-bottom-width")) - parseInt(style.getPropertyValue("padding-bottom")));

            // even an element is provided, it's better to register the listener in the global document
            // (and the key events don't work on canvas or divs...)
            document.addEventListener("keydown",   updateKey);
            document.addEventListener("keyup",     updateKey);
            if(gc.util.isEventSupported("touchmove")) {
                document.addEventListener("touchmove", _updateTouchMove.bind(this));
            } else {
                document.addEventListener("mousemove", _updateMouseMove.bind(this));
            }
            if(gc.util.isEventSupported("touchstart")) {
                updateTouch = _updateTouch.bind(this);
                document.addEventListener("touchstart", updateTouch);
                document.addEventListener("touchend",   updateTouch);
            } else {
                updateTouch = _updateMouseClick.bind(this);
                document.addEventListener("mousedown", updateTouch);
                document.addEventListener("mouseup",   updateTouch);
            }

        };

        /**
         * Update variables and notify the listeners after a key event
         *
         * @param   {Object} event Event object
         *
         * @private
         */
        var _updateKey = function _updateKey(event) {
            var key;

            if(!_keyFilter || _keyFilter.indexOf(event.keyCode) !== -1) {
                key = this.keys[event.keyCode];
                if(!key) {
                    key = this.keys[event.keyCode] = {};
                }

                this.mod.alt   = event.altKey;
                this.mod.ctrl  = event.ctrlKey;
                this.mod.shift = event.shiftKey;

                key.pressed    = event.type === "keydown";
                key.state      = _nextButtonState(key.state, key.pressed);

                _notifyChange("key", event.keyCode, key);

                if(key.state === State.CLICK || key.state === State.RELEASE) {
                    key.state = _nextButtonState(key.state, key.pressed);
                    _notifyChange("key", event.keyCode, key);
                }
            }
        };

        /**
         * Update variables and notify listeners after a touch event via mousedown and mouseup
         *
         * @param   {Object} event Event object
         *
         * @private
         */
        var _updateMouseClick = function _updateMouseClick(event) {
            var touch = this.touch[event.button],
                x = event.clientX - _offset.x,
                y = event.clientY - _offset.y;

            if(event.button < this.touch.length && (!_options.boundMouse || _bounds.contains(x, y))) {
                this.mod.alt   = event.altKey;
                this.mod.ctrl  = event.ctrlKey;
                this.mod.shift = event.shiftKey;

                touch.x       = x;
                touch.y       = y;
                touch.pressed = event.type === "mousedown";
                touch.state   = _nextButtonState(touch.state, touch.pressed);

                _notifyChange("touch", event.button, touch);

                if(touch.state === State.CLICK || touch.state === State.RELEASE) {
                    touch.state = _nextButtonState(touch.state, touch.pressed);
                    _notifyChange("touch", event.button, touch);
                }
            }
        };

        /**
         * Update variables and notify listeners after a touch event via touchstart and touchend
         * Right now only supports one finger.
         *
         * @param   {Object} event Event object
         *
         * @private
         */
        var _updateTouch = function _updateTouch(event) {
            var touch = this.touch[0],
                eventTouch = event.changedTouches[0],
                x = eventTouch.clientX - _offset.x,
                y = eventTouch.clientY - _offset.y;

            if(!_options.boundMouse || _bounds.contains(x, y)) {
                this.mod.alt   = event.altKey;
                this.mod.ctrl  = event.ctrlKey;
                this.mod.shift = event.shiftKey;

                touch.x       = x;
                touch.y       = y;
                touch.pressed = event.type === "touchstart";
                touch.state   = _nextButtonState(touch.state, touch.pressed);

                _notifyChange("touch", 0, touch);

                if(touch.state === State.CLICK || touch.state === State.RELEASE) {
                    touch.state = _nextButtonState(touch.state, touch.pressed);
                    _notifyChange("touch", 0, touch);
                }
            }
        };

        /**
         * Update variables and notify listeners after a mousemove event
         *
         * @param   {Object} event Event object
         *
         * @private
         */
        var _updateMouseMove = function _updateMouseMove(event) {
            var x = event.clientX - _offset.x,
                y = event.clientY - _offset.y;

            if(!_options.boundMouse || _bounds.contains(x, y)) {
                this.mouse.x = x;
                this.mouse.y = y;

                _notifyChange("mouse", this.mouse);
            }
        };

        /**
         * Update variables and notify listeners after a touchmove event
         *
         * @param   {Object} event Event object
         *
         * @private
         */
        var _updateTouchMove = function _updateTouchMove(event) {
            var touch = event.changedTouches[0],
                x = touch.clientX - _offset.x,
                y = touch.clientY - _offset.y;

            if(!_options.boundMouse || _bounds.contains(x, y)) {
                this.mouse.x = x;
                this.mouse.y = y;

                _notifyChange("mouse", this.mouse);
            }
        };

        /**
         * Check if a modifier definition matches the current state
         *
         * @param   {Object} def Required state for each modifier (alt, ctrl, shift) or null if not required
         *
         * @private
         */
        var _matchModifiers = function _matchModifiers(def) {
            return !def ||
               (def.altKey == null   || def.altKey === this.altKey &&
                def.ctrlKey == null  || def.ctrlKey === this.ctrlKey &&
                def.shiftKey == null || def.shiftKey === this.shiftKey);
        };

        /**
         * Notify the listeners about a change processing the notification queue.
         * If the listener callback returns false, it won't notify the rest of the listeners
         *
         * @param   {String} type Type of event
         * @param   {mixed}  a
         * @param   {mixed}  [b]
         *
         * @private
         */
        var _notifyChange = function _notifyChange(type, a, b) {
            var i,
                nListeners,
                res;

            for(i=0, nListeners=_listeners.length; i<nListeners; i++) {
                res = _listeners[i][type](a, b);
                if(res === false) {
                    break;
                }
            }
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Add a key to track
         *
         * @param  {Number} keyCode Key Code of the Key to track
         * @return {gc.InputManager}          Self reference for chaining
         *
         * @public
         */
        this.addFilteredKey = function addFilteredKey(keyCode) {
            if(!_keyFilter) {
                _keyFilter = [];
            }

            if(_keyFilter.indexOf(keyCode) === -1) {
                _keyFilter.push(keyCode);

                if(!this.keys[event.keyCode]) {
                    this.keys[event.keyCode] = {
                        pressed: false,
                        state  : State.NORMAL
                    };
                }
            }

            return this;
        };

        /**
         * Register a listener to get notified on input changes.
         * The order the listeners are registered in, matters when processing the notification queue.
         * First listeners added will be notified first.
         *
         * @param  {gc.Stage}        listener Stage to notify via {@link key}, {@link touch} and {@link mouse} methods.
         *                                    If this methods return false, it will stop the notification queue
         * @return {gc.InputManager}          Self reference for chaining
         *
         * @public
         */
        this.addListener = function addListener(listener) {
            _validator.reset()
                      .implementsInputManagerListener('listener', listener);

            if(_validator.errors()) {
                throw new gc.exception.WrongSignatureException("listener doesn't implements the InputManagerListener interface");
            }

            _listeners.push(listener);

            return this;
        };

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
    gc.InputManager = InputManager;
    gc.util.defineConstant(gc.InputManager, "VERSION", VERSION);
    gc.util.defineConstant(gc.InputManager, "Event", Event);
    gc.util.defineConstant(gc.InputManager, "State", State);

} (window, window.gc, document));
