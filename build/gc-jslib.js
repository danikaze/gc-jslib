;(function(window, document, undefined) {
    "use strict";

    /**
     * window.performance.now
     * https://gist.github.com/paulirish/5438650
     */
    if ("performance" in window === false) {
          window.performance = {};
    }

    Date.now = (Date.now || function () {  // thanks IE8
        return new Date().getTime();
    });

    if ("now" in window.performance === false) {

        var nowOffset = Date.now();

        if (window.performance.timing && window.performance.timing.navigationStart) {
            nowOffset = window.performance.timing.navigationStart;
        }

        window.performance.now = function now() {
            return Date.now() - nowOffset;
        };
    }

    /**
     * requestAnimationFrame
     */
    if(!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback){
                window.setTimeout(function() {
                    callback(window.performance.now());
                }, 1000 / 60);
            };
    }

} (window, document));

(function (doc) {
    "use strict";

    /**
     * Fullscreen API
     * https://github.com/neovov/Fullscreen-API-Polyfill/blob/master/fullscreen-api-polyfill.js
     */

    function noop() {}

    var pollute = true,
        api,
        vendor,
        apis = {
            // http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
            w3: {
                enabled: "fullscreenEnabled",
                element: "fullscreenElement",
                request: "requestFullscreen",
                exit:    "exitFullscreen",
                events: {
                    change: "fullscreenchange",
                    error:  "fullscreenerror"
                }
            },
            webkit: {
                enabled: "webkitIsFullScreen",
                element: "webkitCurrentFullScreenElement",
                request: "webkitRequestFullScreen",
                exit:    "webkitCancelFullScreen",
                events: {
                    change: "webkitfullscreenchange",
                    error:  "webkitfullscreenerror"
                }
            },
            moz: {
                enabled: "mozFullScreenEnabled",
                element: "mozFullScreenElement",
                request: "mozRequestFullScreen",
                exit:    "mozCancelFullScreen",
                events: {
                    change: "mozfullscreenchange",
                    error:  "mozfullscreenerror"
                }
            },
            ms: {
                enabled: "msFullscreenEnabled",
                element: "msFullscreenElement",
                request: "msRequestFullscreen",
                exit:    "msExitFullscreen",
                events: {
                    change: "MSFullscreenChange",
                    error:  "MSFullscreenError"
                }
            }
        },
        w3 = apis.w3;

    // Loop through each vendor's specific API
    for (vendor in apis) {
        // Check if document has the "enabled" property
        if (apis[vendor].enabled in doc) {
            // It seems this browser support the fullscreen API
            api = apis[vendor];
            break;
        }
    }

    function dispatch( type, target ) {
        var event = doc.createEvent( "Event" );

        event.initEvent( type, true, false );
        target.dispatchEvent( event );
    } // end of dispatch()

    function handleChange( e ) {
        // Recopy the enabled and element values
        doc[w3.enabled] = doc[api.enabled];
        doc[w3.element] = doc[api.element];

        dispatch( w3.events.change, e.target );
    } // end of handleChange()

    function handleError( e ) {
        dispatch( w3.events.error, e.target );
    } // end of handleError()

    // Pollute only if the API doesn't already exists
    if(pollute) {
        if(!(w3.enabled in doc)) {
            if(api) {
                // Add listeners for fullscreen events
                doc.addEventListener( api.events.change, handleChange, false );
                doc.addEventListener( api.events.error,  handleError,  false );

                // Copy the default value
                doc[w3.enabled] = doc[api.enabled];
                doc[w3.element] = doc[api.element];

                // Match the reference for exitFullscreen
                doc[w3.exit] = doc[api.exit];

                // Add the request method to the Element's prototype
                Element.prototype[w3.request] = function () {
                    return this[api.request].apply( this, arguments );
                };

            // if there's no API available, set the methods as noop so there's no error
            } else {
                Element.prototype[w3.enabled] = noop;
                Element.prototype[w3.element] = noop;
                Element.prototype[w3.request] = noop;
                Element.prototype[w3.exit] = noop;
            }
        }
    }

    // Return the API found (or undefined if the Fullscreen API is unavailable)
    return api;

}( document ));

;(function(window, gc, undefined) {
    "use strict";

    /**
     * Exceptions
     *
     * @namespace gc.exception
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Exception = {

        /**
         * NotImplementedException
         * Raised when a method or part of a method that is not implemented is called.
         *
         * @param {mixed} data Usually the name of the not implemented method or property
         *
         * @constructor
         * @memberOf gc.exception
         */
        NotImplementedException: function NotImplementedException(data) {
            this.data = data;
            this.toString = function toString() { return "Exception: Not Implemented."; };
        },

        /**
         * IndexOutOfBoundsException
         * Raised when an index is out of the bounds of an array.
         *
         * @param {mixed} data Extra data to include in the exception for debug
         *
         * @constructor
         * @memberOf gc.exception
         */
        IndexOutOfBoundsException: function IndexOutOfBoundsException(data) {
            this.data = data;
            this.toString = function toString() { return "Exception: Index Out Of Bounds."; };
        },

        /**
         * WrongSignatureException
         * Raised when calling a method with the wrong number or type of parameters.
         *
         * @param {mixed} data Extra data to include in the exception for debug
         *
         * @constructor
         * @memberOf gc.exception
         * @see gc.exception.WrongDataException
         */
        WrongSignatureException: function WrongSignatureException(data) {
            this.data = data;
            this.toString = function toString() { return "Exception: Wrong number or type of parameters."; };
        },

        /**
         * WrongDataException
         * Raised when a method is called with the correct parameters but the specified data is wrong.
         *
         * @param {mixed} data Extra data to include in the exception for debug
         *
         * @constructor
         * @memberOf gc.exception
         * @see gc.exception.WrongSignatureException
         */
        WrongDataException: function WrongDataException(data) {
            this.data = data;
            this.toString = function toString() { return "Exception: Wrong data."; };
        }
    };


    ///////////////////////
    // Export the module //
    ///////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.exception = Exception;

} (window, window.gc));

/**
 * Base gc namespace with generic util members
 * @namespace gc
 */
;(function(window, gc, undefined) {
    "use strict";

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Util
     * @public
     */
    var VERSION = "0.4.0";

    /**
     * Enum: Alignment values
     *
     * @enum {Number}
     * @readOnly
     * @memberOf gc
     */
    var Align = {
        BOTTOM       : 0,
        BOTTOM_LEFT  : 1,
        BOTTOM_RIGHT : 2,
        CENTER       : 3,
        LEFT         : 4,
        RIGHT        : 5,
        TOP          : 6,
        TOP_LEFT     : 7,
        TOP_RIGHT    : 8
    };

    var _eventTagnames = {
          'select':'input','change':'input',
          'submit':'form','reset':'form',
          'error':'img','load':'img','abort':'img'
        };

    var _uniqueId = 1;

    /**
     * Utility functions
     *
     * @memberOf gc
     * @namespace
     * @alias gc.util
     * @version 0.4.0
     */
    var Util = {};

    /**
     * Empty function
     */
    Util.noop = function noop() {

    };

    /**
     * Define a constant property inside an Object
     *
     * @param {Object} container Object where define the property in
     * @param {String} name      Name of the constant
     * @param {mixed}  value     Value of the constant
     */
    Util.defineConstant = function defineConstant(container, name, value) {
        if(typeof value === "object") {
            Object.freeze(value);
        }

        Object.defineProperty(container, name, {
            configurable: false,
            enumerable  : true,
            value       : value,
            writable    : false
        });
    };

    /**
     * Compare string versions as X.Y.Z
     * This notation is usually used as:
     *  X is incremented with a major change
     *  Y is incremented with each new functionality
     *  Z is for minnor fixes
     * Note that the returned value is NOT the difference between the compared versions
     *
     * @param   {String}  a first version to compare
     * @param   {String}  b second version to compare
     * @return  {Integer} < 0 if a < b,
     *                      0 if a == b
     *                    > 0 if a > b
     */
    Util.compareVersions = function compareVersions(a, b)
    {
        function compare(x, y) {
            x = parseInt(x);
            y = parseInt(y);

            if(isNaN(x) || isNaN(y))
            {
                throw new gc.exception.WrongSignatureException('Parameters are not Number');
            }

            return x - y;
        }

        if(typeof(a) !== 'string' || typeof(b) !== 'string')
        {
            throw new gc.exception.WrongSignatureException('Version is not a String');
        }

        a = a.split('.');
        b = b.split('.');

        var n = Math.min(a.length, b.length),
            i,
            c;

        for(i=0; i<n; i++)
        {
            c = compare(a[i], b[i]);
            if(c !== 0)
            {
                return c;
            }
        }

        return compare(a.length, b.length);
    };

    /**
     * Check if an object is a Function
     *
     * @param  {Object}  obj Object to check
     * @return {Boolean}     true if {@link obj} is a Function
     *
     * @public
     */
    Util.isFunction = function isFunction(obj) {
        return typeof obj === "function";
    };

    /**
     * Check if an object is a number
     *
     * @param {Object}   obj Object to check
     * @return {Boolean}     true if is a number, false otherwise
     *
     * @public
     */
    Util.isNumber = function isNumber(obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    };

    /**
     * Check if an object is a String
     *
     * @param {Object}   obj Object to check
     * @return {Boolean}     true if is a String, false otherwise
     * @public
     */
    Util.isString = function isString(obj) {
        return typeof obj === "string" || obj instanceof String;
    };

    /**
     * Check if an object is an Array
     *
     * @param {Object}   obj Object to check
     * @return {Boolean}     true if is an Array, false otherwise
     *
     * @function
     * @public
     */
    Util.isArray = Array.isArray ? Array.isArray
                                 : function isArray(obj) { return Object.prototype.toString.call(obj) === "[object Array]"; };

    /**
     * Check if an object is a plain Object
     *
     * @param {Object}   obj Object to check
     * @return {Boolean}     true if is an Object, false otherwise
     *
     * @public
     */
    Util.isPlainObject = function isPlainObject(obj) {
        return obj !== undefined && Object.prototype.toString.call(obj) === "[object Object]";
    };

    /**
     * Check if an object (is an Object and) is empty
     *
     * @param  {Object}  obj Object to check
     * @return {Boolean}     true if {@link obj} is an Object and has no keys
     *
     * @public
     */
    Util.isEmptyObject = function isEmptyObject(obj) {
        if(!Util.isPlainObject(obj)) {
            return false;
        }

        return Object.keys(obj).length === 0;
    };

    /**
     * Iterator function to seamlessly iterate over both arrays and objects.
     * Arrays are iterated by numeric index. Objects are iterated via their named properties.
     *
     * @param {Object|Array} obj Object or Array to iterate
     * @param {Function}     f   callback to execute for each item as f(item, i). If this function returns true, it breaks the loop
     *
     * @public
     */
    Util.forEach = function each(obj, f) {
        var i,
            n;

        if(typeof(obj) !== "object") {
            throw gc.exception.WrongSignatureException("objis not an Object or an Array");
        }

        if(Util.isArray(obj)) {
            n = obj.length;
            for(i=0; i<n; i++) {
                if(f(obj[i], i) === true) {
                    break;
                }
            }

        } else {
            for(i in obj) {
                if(f(obj[i], i) === true) {
                    break;
                }
            }
        }
    };

    /**
     * Get the number of elements of an Object or an Array.
     * Arrays just return its length property. Counting Objects is based on the number of keys they have.
     *
     * @param {Object|Array} obj Object or Array to count
     * @return {Integer}         number of elements/properties
     *
     * @public
     */
    Util.getSize = function size(obj) {
        if(typeof(obj) !== "object") {
            throw gc.exception.WrongSignatureException("obj needs to be an object or an array");
        }

        if(Util.isArray(obj)) {
            return obj.length;

        } else {
            return Object.keys(obj).length;
        }
    };

    /**
     * Copy one or more elements to avoid passing it as reference.
     * If the first parameter is the boolean true, the copy will be deep (recursive)
     *
     * @param {deep} [deep=false] if the first parameter is the boolean true instead of an object, the copy will be deep (recursive)
     * @param {...Object}         in list of objects to copy. Those at the right will overwrite the properties of the elements to their left
     * @return {Object}           Extended object
     *
     * @public
     */
    Util.extend = function extend() {
        var out,
            i,
            key,
            obj;

        if(arguments[0] === true) {
            out = arguments[1] || {};

            for(i = 2; i < arguments.length; i++) {
                obj = arguments[i];

                if (!obj) {
                    continue;
                }

                for(key in obj) {
                    if(obj.hasOwnProperty(key)) {
                        if(typeof obj[key] === 'object') {
                            extend(true, out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }

        } else {
            out = arguments[0] || {};

            for(i = 1; i < arguments.length; i++) {
                if(!arguments[i]) {
                    continue;
                }

                for(key in arguments[i]) {
                    if(arguments[i].hasOwnProperty(key)) {
                        out[key] = arguments[i][key];
                    }
                }
            }
        }

        return out;
    };

    /**
     * Synchronous sleep for the specified milliseconds
     *
     * @param {Number} time milliseconds to sleep
     *
     * @public
     */
    Util.sleep = function sleep(time) {
        var start = window.performance.now();

        while(window.performance.now() - start <= time) { }
    };

    /**
     * Take a box of size {@link w} x {@link h} and align its center to a position based on the {@link align} parameter
     *
     * @param {Align}              align {@link Align} enum with the desired alignment value
     * @param {Number}             w width of the box to align
     * @param {Number}             h height of the box to align
     * @param {Number} [x=0]       base x-position to calculate
     * @param {Number} [y=0]       base y-position to calculate
     * @param {Number} [centerX=0] x-position of the center of the box
     * @param {Number} [centerY=0] y-position of the center of the box
     * @return {Object}            object as {x, y} with the aligned position
     *
     * @public
     */
    Util.alignPosition = function alignPosition(align, w, h, x, y, centerX, centerY) {
        if(arguments.length < 3) {
            throw new gc.exception.WrongSignatureException("wrong number of parameters");
        }

        x = x || 0;
        y = y || 0;
        centerX = centerX || 0;
        centerY = centerY || 0;

        switch(align) {
            case Align.BOTTOM:
                x += -w/2 + centerX;
                y += -h + centerY;
                break;

            case Align.BOTTOM_LEFT:
                x += centerX;
                y += -h + centerY;
                break;

            case Align.BOTTOM_RIGHT:
                x += -w + centerX;
                y += -h + centerY;
                break;

            case Align.CENTER:
                x += -w/2 + centerX;
                y += -h/2 + centerY;
                break;

            case Align.LEFT:
                x += centerX;
                y += -h/2 + centerY;
                break;

            case Align.RIGHT:
                x += -w + centerX;
                y += -h/2 + centerY;
                break;

            case Align.TOP:
                x += -w/2 + centerX;
                y += centerY;
                break;

            case Align.TOP_LEFT:
                x += centerX;
                y += centerY;
                break;

            case Align.TOP_RIGHT:
                x += -w + centerX;
                y += centerY;
                break;

            default:
                throw gc.exception.WrongDataException("align is not a value of gc.Align");
        }

        return {
            x: x,
            y: y
        };
    };

    /**
     * Get a unique ID
     *
     * @param  {String} [prefix=""] Prefix to add to the returned result
     * @return {String}             Unique ID
     *
     * @public
     */
    Util.getUniqueId = function getUniqueId(prefix) {
        if(prefix === undefined) {
            prefix = "";
        }

        return prefix + _uniqueId++;
    };

    /**
     * Check if an event is supported in the current JavaScript engine
     *
     * @param  {String}  eventName Name of the event to check
     * @return {Boolean}           true if supported, false otherwise
     * @public
     */
    Util.isEventSupported = function isEventSupported(eventName) {
        var el = document.createElement(_eventTagnames[eventName] || "div"),
            isSupported;

        eventName = "on" + eventName;
        isSupported = (eventName in el);

        if (!isSupported) {
            el.setAttribute(eventName, "return;");
            isSupported = typeof el[eventName] === "function";
        }

        el = null;

        return isSupported;
    };

    /**
     * A mix of Array.indexOf and Array.filter, to find the index of the first ocurrence of an element on an
     * array or an object using a callback for comparison.
     * Note that if not found, the returned value will be -1, which can be a valid object index
     *
     * @param  {Array|Object} container  Array or Plain Object where the element is con
     * @param  {Function}     callback   function(element) returning true if the element is found or false if not
     * @param  {Number}       [offset=0] Index of the first element to compare
     * @return {mixed}                   Index of the found element, or -1 if not found
     *
     * @public
     */
    Util.find = function(container, callback, offset) {
        var i,
            n;

        // array
        if(Util.isArray(container)) {
            if(offset === undefined) {
                offset = 0;
            }

            for(i=offset, n = container.length; i<n; i++) {
                if(callback(container[i])) {
                    return i;
                }
            }

        // object without offset
        } else if(offset === undefined) {
            for(i in container) {
                if(callback(container[i])) {
                    return i;
                }
            }

        // object with an offset specified
        } else {
            n = false;
            for(i in container) {
                if(n) {
                    if(callback(container[i])) {
                        return i;
                    }
                } else {
                    if(i === offset) {
                        n = true;
                    }
                }
            }
        }

        return -1;
    };

    /**
     * Limit a numeric value between a minimun and a maximum
     *
     * @param  {Number} value Value to limit
     * @param  {Number} min   Minimum value allowed
     * @param  {Number} max   Maximum value allowd
     * @return {Number}       Limited value
     *
     * @public
     */
    Util.clamp = function clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    };


    ///////////////////////////////
    // Export the public objects //
    ///////////////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.util = Util;
    gc.util.defineConstant(gc.util, "VERSION", VERSION);
    gc.util.defineConstant(gc, "Align", Align);

} (window, window.gc));
;(function(window, gc, undefined) {
    "use strict";

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Validator
     * @public
     */
    var VERSION = "1.1.1";

    /**
     * Object for validate several types of data
     *
     * Define a new validator for each type of validated data:
     * Don't use something like isValid = isNumber && isPositive to validate a recordId,
     * but define a validator specialized in doing that, so it can be used just for that type of data.
     * Validators can use already defined validators.
     *
     * From 1.1.0 can use {@link options.def}
     *
     * @param {Object}  options                                  list of options to override the default ones
     * @param {boolean} [options.strict=false]                   true to use strict validation
     * @param {boolean} [options.canonize=true]                  true convert data to its canonical form
     * @param {boolean} [options.returnNullOnErrors=true]        if there is any error, {@link gc.Validator#valid} will return null
     * @param {boolean} [options.optional=false]                 accept undefined values (not null) in the validations
     * @param {mixed}   [options.def]                            if optional is true and the data is not defined, this value will be assigned by default
     * @param {Object}  [options.validators={}]                  object with validators to load with addValidator(name, validator)
     * @param {boolean} [options.allowOverwriteValidators=false] if an existing validator is defined and this option is false, an exception will raise
     *
     * @requires  gc.Util
     * @uses      gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.1.0
     * @author @danikaze
     */
    var Validator = function(options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _options,   // options stored in the constructor
            _good,      // list of validated data
            _bad;       // list of rejected data

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(options) {
            var defaultOptions = {
                    strict                  : false,    // strict validation
                    canonize                : true,     // convert data to its canonical form
                    returnNullOnErrors      : true,     // if there are any errors, valid() returns null
                    optional                : false,    // if true, a undefined value will validate
                    validators              : {},       // object with the default validators to load with addValidator(name, validator)
                    allowOverwriteValidators: false     // if an existing validator is defined and this option is false, an exception will raise
                },
                v;

            _options = gc.util.extend(defaultOptions, options);
            _good = {};
            _bad = {};

            if(gc.util.isPlainObject(_options.validators)) {
                for(v in _options.validators) {
                    this.addValidator(v, _options.validators[v]);
                }
            }
        };

        /**
         * Stores the data to be retrieved via {@link gc.Validator#valid} and {@link gc.Validator#error}
         *
         * @param {String}  key           key to access data
         * @param {mixed}   originalData  data as passed to validate
         * @param {mixed}   canonizedData canonized data (i.e. "2" => 2 for numbers)
         * @param {boolean} validates     if the originalData validated or not
         *
         * @private
         */
        var _store = function　_store(key, originalData, canonizedData, validates) {
            if(validates) {
                _good[key] = canonizedData;

            } else {
                _bad[key] = originalData;
            }
        };

        /**
         * Validates a simple data via a specified validator
         *
         * @param {Function} validator function to validate and canonize the data
         * @param {String}   key       key to access the data later
         * @param {mixed}    data      data to validate
         * @param {Object}   options   options for this validation (if not specified, global ones will be used)
         *
         * @private
         */
        var _validateData = function _validateData(validator, key, data, options) {
            var res,
                extendedOptions = gc.util.extend({}, _options, options);

            res = (data === undefined && extendedOptions.optional) ? res = { data: extendedOptions.def !== undefined ? extendedOptions.def : undefined, valid: true }
                                                                   : validator(data, extendedOptions);

            _store(key, data, extendedOptions.canonize ? res.data : data, res.valid);
        };

        /**
         * Validates each element of an array via a specified validator
         * It doesn't modify the original array
         *
         * @param {Function} validator function to validate and canonize each element
         * @param {String}   key       key to access the data later
         * @param {mixed}    data      array to validate
         * @param {Object}   options   options for this validation (if not specified, global ones will be used)
         *                             The validator needs to check for options.strict
         * @private
         */
        var _validateArray = function _validateArray(validator, key, data, options) {
            var ok = true,
                extendedOptions = gc.util.extend({}, _options, options),
                val,
                res,
                n,
                i;

            if(gc.util.isArray(data)) {
                val = data.slice();
                for(i=0; i<val.length; i++) {
                    res = validator(val[i], extendedOptions);

                    if(!res.valid) {
                        ok = false;
                        break;
                    }

                    if(extendedOptions.canonize) {
                        val[i] = res.data;
                    }
                }

            } else if(data === undefined && extendedOptions.optional) {
                if(extendedOptions.def !== undefined) {
                    val = extendedOptions.def;
                }

                ok = true;

            } else {
                ok = false;
            }

            _store(key, data, val, ok);
        };

        /**
         * Validates each element of an object via a specified validator
         * It doesn't modify the original object
         *
         * @param {Function} validator function to validate and canonize each element
         * @param {string}   key       key to access the data later
         * @param {mixed}    data      array to validate
         * @param {object}   options   options for this validation (if not specified, global ones will be used)
         *
         * @private
         */
        var _validateObject = function _validateObject(validator, key, data, options) {
            var ok = true,
                extendedOptions = gc.util.extend({}, _options, options),
                val,
                res,
                n,
                i;

            if(gc.util.isPlainObject(data)) {
                val = gc.util.extend(true, {}, data);
                for(i in val) {
                    res = validator(val[i], extendedOptions);

                    if(!res.valid) {
                        ok = false;
                        break;
                    }

                    if(extendedOptions.canonize) {
                        val[i] = res.data;
                    }
                }

            } else if(data === undefined && extendedOptions.optional) {
                if(extendedOptions.def !== undefined) {
                    val = extendedOptions.def;
                }

                ok = true;

            } else {
                ok = false;
            }

            _store(key, data, val, ok);
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Check for the objects that didn't passed the validation
         *
         * @return {Object} null if there are no errors,
         *                  or an object with the original value of each validated data
         * @public
         */
        this.errors = function errors() {
            return gc.util.isEmptyObject(_bad) ? null
                                               : _bad;
        };

        /**
         * Get the data which validated
         *
         * @param  {object} base base object to use to return the valid elements.
         *                       Why? Because if we do X = valid() we will overwrite everything in X, and maybe it had
         *                       other values we want to preserve. And if we do X = gc.util.extend(X, valid(), we can preserve
         *                       possible values that are not in valid() because of the canonization.
         * @return {object}      validated data as { key => value },
         *                       or null if there were errors and returnNullOnErrors option is true
         * @public
         */
        this.valid = function valid(base) {
            var v = null,
                i;

            if(typeof(base) !== 'undefined' && !gc.util.isPlainObject(base)) {
                throw new gc.exception.WrongParametersException('base needs to be a plain object if specified');
            }

            if(!_options.returnNullOnErrors || gc.util.isEmptyObject(_bad)) {
                if(base) {
                    for(i in _good) {
                        base[i] = _good[i];
                    }
                    v = base;
                } else {
                    v = _good;
                }
            }

            return v;
        };

        /**
         * Clear the list of errors and validated data stored in the validator
         *
         * @return {gc.Validator} Self object for allowing chaining
         *
         * @public
         */
        this.reset = function reset() {
            this.resetErrors();
            this.resetValid();
            return this;
        };

        /**
         * Clear the list of errors stored in the validator
         *
         * @return {gc.Validator} Self object for allowing chaining
         *
         * @public
         */
        this.resetErrors = function resetErrors() {
            _bad = {};
            return this;
        };

        /**
         * Clear the list of validated data stored in the validator
         *
         * @return {gc.Validator} Self object for allowing chaining
         *
         * @public
         */
        this.resetValid = function resetValid()
        {
            _good = {};
            return this;
        };

        /**
         * Add a custom data validator for a plain data.
         * Three validators will be created:
         * - name: to validate plain data as specified (elem)
         * - nameArray: to validate a list of elements ([elem])
         * - nameObject: to validate a collection of elements ({ key => elem }). keys doesn't affect the validation
         *
         * @param  {string}   name      name for the validator
         * @param  {Function} validator function(data, options) returning { data, valid }, where:
         *                              parameters:
         *                                  data: is the data to validate
         *                                  options: are the options to apply when validating
         *                              return object:
         *                                  data: a copy of the data, canonized
         *                                  valid: a boolean telling if it validated or not
         * @return {gc.Validator}       Self object for allowing chaining
         *
         * @public
         */
        this.addValidator = function addValidator(name, validator) {
            /*
             * it will be funny if a validator doesn't validate its data ;)
             */
            if(!gc.util.isString(name)) {
                throw new gc.exception.WrongSignatureException("name is not a string");
            }

            if(!gc.util.isFunction(validator)) {
                throw new gc.exception.WrongSignatureException("validator is not a function");
            }

            if(!_options.allowOverwriteValidators) {
                if(this[name]) {
                    throw new gc.exception.WrongDataException('The method ' + name + ' is already defined');
                }

                if(this[name + 'Array']) {
                    throw new gc.exception.WrongDataException('The method ' + name + 'Array is already defined');
                }

                if(this[name + 'Object']) {
                    throw new gc.exception.WrongDataException('The method ' + name + 'Object is already defined');
                }
            }

            /*
             * Method addition
             */

            // validator for simple data
            this[name] = function(key, data, options) {
                _validateData(validator, key, data, options);
                return this;
            };

            // validator for array of data
            this[name + 'Array'] = function(key, data, options) {
                _validateArray(validator, key, data, options);
                return this;
            };

            // validator for object of whatever key => data
            this[name + 'Object'] = function(key, data, options) {
                _validateObject(validator, key, data, options);
                return this;
            };

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
    gc.Validator = function(options) {
        return new Validator(gc.util.extend({}, options, { validators: gc.Validator.definitions }));
    };
    gc.util.defineConstant(gc.Validator, "VERSION", VERSION);
    gc.Validator.definitions = {};

} (window, window.gc));

/**
 * List of validators used by gc.Validator
 */
(function (gc, undefined)
{
    'use strict';

    // basic data validators
    gc.Validator.definitions = {
        'bool'                          : validatorBool,
        'int'                           : validatorInt,
        'intPositive'                   : validatorIntPositive,
        'flt'                           : validatorFlt,
        'fltPositive'                   : validatorFltPositive,
        'str'                           : validatorStr,
        'strNotEmpty'                   : validatorStrNotEmpty,
        'callback'                      : validatorCallback,
        'enumerated'                    : validatorEnumerated,
        'defined'                       : validatorDefined,
        'animationFrame'                : validatorAnimationFrame,
        'resourceDefinition'            : validatorResourceDefinition,
        'textStyle'                     : validatorTextStyle,
        'ninePatchData'                 : validatorNinePatchData,
        'implementsInputManagerListener': validatorImplementsInputManagerListener,
        'parallaxLayer'                 : validatorParallaxLayer,
        'buttonStyle'                   : validatorButtonStyle
    };

    // validator object used to validate other objects
    var _validator = new gc.Validator();

    /*
     * Generic Boolean data validator
     */
    function validatorBool(data, options) {
        var val = !!data,
            ok = !options.strict || typeof(data) === 'boolean';

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic Int validator
     */
    function validatorInt(data, options) {
        var val = parseInt(data),
            ok = !isNaN(val) && (!options.strict || gc.util.isNumber(data));

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Positive (>=0) Int validator
     */
    function validatorIntPositive(data, options) {
        var val = parseInt(data),
            ok = !isNaN(val) && (!options.strict || gc.util.isNumber(data)) && data >= 0;

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic Float validator
     */
    function validatorFlt(data, options) {
        var val = parseFloat(data),
            ok = !isNaN(val) && (!options.strict || gc.util.isNumber(data));

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Positive (>=0) Float validator
     */
    function validatorFltPositive(data, options) {
        var val = parseFloat(data),
            ok = !isNaN(val) && (!options.strict || gc.util.isNumber(data)) && data >= 0;

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic String validator
     */
    function validatorStr(data, options) {
        var val = String(data),
            ok = data != null && (!options.strict || gc.util.isString(data));

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic non-empty String validator
     */
    function validatorStrNotEmpty(data, options) {
        var val = String(data),
            ok = data != null && (!options.strict || gc.util.isString(data)) && data.length > 0;

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic Function validator
     */
    function validatorCallback(data, options) {
        return {
            data: data,
            valid: gc.util.isFunction(data)
        };
    }

    /*
     * Enum Validator.
     * Check that data is one of the values inside the definition of options.enum
     */
    function validatorEnumerated(data, options) {
        if(!options || !gc.util.isPlainObject(options.enumerated)) {
            throw new gc.exception.WrongParametersException('options.enumerated is not an Object');
        }

        var val = null,
            ok = false,
            i;

        for(i in options.enumerated) {
            if(!options.strict && data == options.enumerated[i] || options.strict && data === options.enumerated[i]) {
                val = options.enumerated[i];
                ok = true;
                break;
            }
        }

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Just check that the data exists (even if it's 0, "" or null)
     */
    function validatorDefined(data, options) {
        return {
            data: data,
            valid: data !== undefined
        };
    }



    //////////////////////////
    // Animation Validators //
    //////////////////////////

    /*
     *
     */
    function validatorAnimationFrame(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            _validator.reset()
                      .intPositive('x', data.x, { optional: true })
                      .intPositive('y', data.y, { optional: true })
                      .intPositive('width', data.width, { optional: true })
                      .intPositive('height', data.height, { optional: true })
                      .intPositive('centerX', data.centerX, { optional: true })
                      .intPositive('centerY', data.centerY, { optional: true })
                      .intPositive('time', data.time, { optional: true });

            ok = !_validator.errors();
            val = _validator.valid();
        }

        return {
            data: val,
            valid: ok
        };
    }

    ////////////////////////////////
    // ResourceManager Validators //
    ////////////////////////////////

    /*
     *
     */
    function validatorResourceDefinition(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            _validator.reset()
                      .strNotEmpty('src', data.src)
                      .intPositive('size', data.size, { optional: true });

            ok = !_validator.errors();
            val = _validator.valid();
        }

        return {
            data: val,
            valid: ok
        };
    }

    /////////////////////
    // Text Validators //
    /////////////////////

    /*
     *
     */
    function validatorTextStyle(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            _validator.reset()
                      .strNotEmpty("font", data.font, { optional: true })
                      .bool("fill", data.fill, { optional: true })
                      .strNotEmpty("fillStyle", data.fillStyle, { optional: true })
                      .bool("stroke", data.stroke, { optional: true })
                      .strNotEmpty("strokeStyle", data.strokeStyle, { optional: true })
                      .flt("lineMargin", data.lineMargin, { optional: true })
                      .intPositive("pause", data.pause, { optional: true });

            ok = !_validator.errors();
            val = _validator.valid();
        }

        return {
            data: val,
            valid: ok
        };
    }

    //////////////////////////
    // NinePatch Validators //
    //////////////////////////

    /*
     *
     */
    function validatorNinePatchData(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            _validator.reset()
                      .defined('texture', data.texture)
                      .intPositive('topLeftX', data.topLeftX)
                      .intPositive('topLeftY', data.topLeftY)
                      .intPositive('topLeftW', data.topLeftW)
                      .intPositive('topLeftH', data.topLeftH)
                      .intPositive('bottomRightX', data.bottomRightX)
                      .intPositive('bottomRightY', data.bottomRightY)
                      .intPositive('bottomRightW', data.bottomRightW)
                      .intPositive('bottomRightH', data.bottomRightH);

            ok = !_validator.errors();
            val = _validator.valid();

        } else if(gc.util.isArray(data)) {
            if(data.length === 9 || data.length === 10) {
                _validator.reset()
                          .defined('texture', data[0])
                          .intPositive('topLeftX', data[1])
                          .intPositive('topLeftY', data[2])
                          .intPositive('topLeftW', data[3])
                          .intPositive('topLeftH', data[4])
                          .intPositive('bottomRightX', data[5])
                          .intPositive('bottomRightY', data[6])
                          .intPositive('bottomRightW', data[7])
                          .intPositive('bottomRightH', data[8]);

                ok = !_validator.errors();
                val = _validator.valid();
            }
        }

        return {
            data: val,
            valid: ok
        };
    }

    /////////////////////////
    // Parallax Validators //
    /////////////////////////

    /*
     * @require gc.TextureRegion
     */
    function validatorParallaxLayer(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            _validator.reset()
                      .int("startX", data.startX)
                      .int("startY", data.startY)
                      .int("endX", data.endX)
                      .int("endY", data.endY);

            ok = !_validator.errors() && data.texture != null;
            val = _validator.valid();

            if(ok) {
                val.texture = data.texture instanceof Image ? new gc.TextureRegion(data.texture)
                                                            : data.texture;
            }
        }

        return {
            data: val,
            valid: ok
        };
    }

    ///////////////////////
    // Button Validators //
    ///////////////////////

    /*
     * @require gc.NinePatch
     */
    function validatorButtonStyle(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            if(data.normal instanceof gc.NinePatch &&
               data.normal instanceof gc.NinePatch &&
               data.normal instanceof gc.NinePatch &&
               data.normal instanceof gc.NinePatch) {

                ok = true;
                val = {
                    normal: data.normal,
                    hover : data.hover,
                    select: data.select,
                    click : data.click
                };

            } else {
                val = {};

                if(data.normal instanceof Image) {
                    val.normal = new gc.TextureRegion(data.normal);

                } else if(data.normal instanceof gc.TextureRegion) {
                    val.normal = data.normal;
                }

                if(data.hover instanceof Image) {
                    val.hover = new gc.TextureRegion(data.hover);

                } else if(data.hover instanceof gc.TextureRegion) {
                    val.hover = data.hover;
                }

                if(data.select instanceof Image) {
                    val.select = new gc.TextureRegion(data.select);

                } else if(data.select instanceof gc.TextureRegion) {
                    val.select = data.select;
                }

                if(data.click instanceof Image) {
                    val.click = new gc.TextureRegion(data.click);

                } else if(data.click instanceof gc.TextureRegion) {
                    val.click = data.click;
                }

                ok = val.normal instanceof gc.TextureRegion &&
                     val.hover instanceof gc.TextureRegion &&
                     val.select instanceof gc.TextureRegion &&
                     val.click instanceof gc.TextureRegion;
            }
        }

        return {
            data: val,
            valid: ok
        };
    }


    //////////////////////////
    // Interface Validators //
    //////////////////////////

    /*
     *
     */
    function validatorImplementsStage(data, options) {
        var ok = data &&
                 gc.util.isFunction(data.key) &&
                 gc.util.isFunction(data.touch) &&
                 gc.util.isFunction(data.mouse) &&
                 gc.util.isFunction(data.update) &&
                 gc.util.isFunction(data.draw) &&
                 data.camera instanceof gc.Camera2;

        return {
            data : data,
            valid: ok
        };
    }

    /*
     *
     */
    function validatorImplementsInputManagerListener(data, options) {
        var ok = data &&
                 gc.util.isFunction(data.key) &&
                 gc.util.isFunction(data.touch) &&
                 gc.util.isFunction(data.mouse);

        return {
            data : data,
            valid: ok
        };
    }

    /*
     *
     */
    function validatorImplementsActor(data, options) {
        var ok = data &&
                 gc.util.isFunction(data.update) &&
                 gc.util.isFunction(data.draw);

        return {
            data : data,
            valid: ok
        };
    }

} (window.gc));
/**
 *
 */
;(function(window, gc, undefined) {
    "use strict";

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.browser
     * @public
     */
    var VERSION = "0.1.0";

    /*
     * Regular expressions to detect mobile browsers
     */
    var _mobileUserAgentRegExps = [
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
        ];

    /**
     * Browser-related functions
     *
     * @requires  gc.util
     *
     * @memberOf gc
     * @namespace
     * @alias gc.Browser
     * @version 0.1.0
     */
    var Browser = {};

    ///////////////////////////////
    // Export the public objects //
    ///////////////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.browser = Browser;
    gc.util.defineConstant(gc.browser, "VERSION", VERSION);

    gc.util.defineConstant(gc.browser, "userAgent", navigator.userAgent||navigator.vendor||window.opera);
    // true if mobile browser
    gc.util.defineConstant(gc.browser, "isMobile", _mobileUserAgentRegExps[0].test(gc.browser.userAgent) || _mobileUserAgentRegExps[1].test(gc.browser.userAgent));

    // true if Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    gc.util.defineConstant(gc.browser, "isOpera", !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0);
    // true if Firefox 1.0+
    gc.util.defineConstant(gc.browser, "isFirefox", typeof InstallTrigger !== 'undefined');
    // true if at least Safari 3+: "[object HTMLElementConstructor]"
    gc.util.defineConstant(gc.browser, "isSafari", Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);
    // true if Chrome 1+
    gc.util.defineConstant(gc.browser, "isChrome", !!window.chrome && !gc.browser.isOpera);
    // true if at least IE6 (not Edge)
    gc.util.defineConstant(gc.browser, "isIE", /*@cc_on!@*/false || !!document.documentMode);

} (window, window.gc));

;(function(window, gc, document, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();

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
    var VERSION = "0.1.1";

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
     * @version 0.1.1
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

            if(!(element instanceof Element)) {
                throw new gc.exception.WrongSignatureException("element is not a valid Element");
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

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.LocaleManager
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Manages translations
     *
     * @requires gc.Util
     *
     * @constructor
     * @memberOf gc
     * @version 0.1.0
     * @author @danikaze
     */
    var LocaleManager = function() {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _texts;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance.
         *
         * @private
         */
        var _construct = function _construct() {
            _texts = {};
        };

        /**
         * Replace a list of parameters in a string.
         * i.e.: string = "User ID: {userId}" and params = { userId: 12345 } will result in "User ID: 12345".
         *
         * @param  {String} text   Text where perform the replacement
         * @param  {Object} params List of parametes as { key: value }
         * @return {String}        Replaced string
         *
         * @private
         */
        var _replaceParameters = function _replaceParameters(text, params) {
            var regExp,
                key;

            for(key in params) {
                regExp = new RegExp('{' + key + '}', 'g');
                text = text.replace(regExp, params[key]);
            }

            return text;
        };


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Register a set of texts for a given namespace
         *
         * @param  {String}           namespace Namespace of the texts
         * @param  {Object}           texts     List of texts to register as { key: value }
         * @return {gc.LocaleManager}           Self reference for allowing chaining
         *
         * @public
         */
        this.register = function set(namespace, texts) {
            if(!_texts[namespace]) {
                _texts[namespace] = {};
            }

            gc.util.extend(_texts[namespace], texts);

            return this;
        };

        /**
         * Get localized string
         *
         * @param  {String} namespace Namespace of the text
         * @param  {String} key       Key of the asked text
         * @param  {Object} params    If specified, the {keys} will be replaced with their values
         * @return {String}           Value of the asked text
         *
         * @public
         */
        this.get = function get(namespace, key, params) {
            var ns = _texts[namespace],
                t;

            if(!ns) {
                return "{" + namespace + ":" + key + "}";
            }

            t = ns[key];
            if(t === undefined) {
                return "{" + namespace + ":" + key + "}";
            }

            return _replaceParameters(t, params);
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
    gc.LocaleManager = LocaleManager;
    gc.util.defineConstant(gc.LocaleManager, "VERSION", VERSION);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    // LCG using GCC's constants
    var _m = 0x80000000, // 2**31;
        _a = 1103515245,
        _c = 12345;

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.RNG
     * @public
     */
    var VERSION = "1.0.0";

    /**
     * Random Number Generator
     *
     * @param {Integer} seed Initial seed for the pseudo-random number generator
     *
     * @requires gc.Util
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var RNG = function(seed) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _seed,
            _state,
            _generated;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        function _construct(seed) {
            if(typeof seed === "undefined") {
                _seed = parseInt(Math.random() * (_m - 1));

            } else {
                _seed = parseInt(seed);
            }

            _state = _seed;
            _generated = 0;
        }


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Get a random integer between 0 and maxint (2**31)
         * If 1 parameter is specified, a value between [0..max) will be returned (0 is included, max is not)
         * If 2 parameters are specified, a value between [min..max) will be returned (min is included, max is not)
         *
         * @param {Integer}  min minimum value - included (only with 2 parameters)
         * @param {Integer}  max maximum value - not included (with 1 or 2 parameters)
         * @return {Integer}     random number
         *
         * @public
         */
        this.nextInt = function(min, max) {
            _state = (_a * _state + _c) % _m;
            _generated++;

            switch(arguments.length) {
                case 0:
                    return _state;

                case 1:
                    return Math.floor(_state / _m * min);

                case 2:
                    return Math.floor(_state / _m * (max - min) + min);

                default:
                    throw "Wrong number of arguments";
            }
        };

        /**
         * Get a random float between 0 and 1
         * If 1 parameter is specified, a value between [0..max) will be returned (0 is included, max is not)
         * If 2 parameters are specified, a value between [min..max) will be returned (min is included, max is not)
         *
         * @param {Float}  min minimum value - included (only with 2 parameters)
         * @param {Float}  max maximum value - not included (with 1 or 2 parameters)
         * @return {Float}     random number
         *
         * @public
         */
        this.nextFloat = function(min, max) {
            _state = (_a * _state + _c) % _m;
            _generated++;

            switch(arguments.length) {
                case 0:
                    return _state / (_m - 1);

                case 1:
                    return _state * max;

                case 2:
                    return _state * (max - min) + min;

                default:
                    throw "Wrong number of arguments";
            }
        };

        /**
         * Reset the state of the generator to the first number of the seed
         *
         * @return {gc.RNG} Self object to allow chaining
         *
         * @public
         */
        this.reset = function() {
            _construct(_seed);
            return this;
        };

        /**
         * Get the initial seed of the generator
         *
         * @return {Integer} Seed of the generator
         *
         * @public
         */
        this.getSeed = function() {
            return _seed;
        };

        /**
         * Set the seed (initial state) of the generator, and resets it
         *
         * @return {gc.RNG} Self object to allow chaining
         *
         * @public
         */
        this.setSeed = function(seed) {
            _construct(seed);
            return this;
        };

        /**
         * Get the state (number of numbers generated) of the generator.
         * With {@link gc.RNG#setState} allow storing and recovering the state of the generator
         *
         * @return {Integer} state of the generator
         *
         * @public
         */
        this.getState = function() {
            return _generated;
        };

        /**
         * Set the state of the generator to N generations
         *
         * @return {gc.RNG} Self object to allow chaining
         *
         * @public
         */
        this.setState = function(state) {
            var i;

            if (state < _generated) {
                this.reset();
            } else {
                state -= _generated;
            }

            for (i=0; i<state; i++) {
                this.nextInt();
            }

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
    gc.RNG = RNG;
    gc.util.defineConstant(gc.RNG, "VERSION", VERSION);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////


    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Deferred
     * @public
     */
    var VERSION = "1.0.0";

    /**
     * Enum: Possible states of the Deferred
     *
     * @enum {String}
     * @memberOf gc.Deferred
     * @public
     */
    var State = {
        PENDING : "PENDING",
        RESOLVED: "RESOLVED",
        REJECTED: "REJECTED"
    };

    /**
     * Deferred implementation for asynchronous methods
     *
     * @requires gc.Util
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Deferred = function() {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _state,         // state of the Deferred
            _done,          // list of callbacks executed when resolved
            _fail,          // list of callbacks executed when rejected
            _always,        // list of callbacks executed when resolved or rejected
            _progress,      // list of callbacks executed when updated
            _then,          // Object with the deferreds to execute in a then statement
            _resultArgs;    // List of arguments to pass to the callbacks


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(func) {
            _state = State.PENDING;
            _done = [];
            _fail = [];
            _always = [];
            _progress = [];
            _then = {
                def     : undefined,
                done    : undefined,
                fail    : undefined,
                progress: undefined
            };

            if(gc.util.isFunction(func)) {
                func.call(this, _then);
            }
        };


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Get the current state of the Deferred object
         *
         * @return {State} Current state
         *
         * @public
         */
        this.state = function state() {
            return _state;
        };

        /**
         * Add a Function to the list of callbacks to be executed when the Deferred is resolved via {@link gc.Deferred#resolve}
         *
         * @param  {Function} callback Callback to execute when resolved
         * @return {gc.Deferred}       Self object to allow chaining
         *
         * @public
         */
        this.done = function done(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _done.push(callback);

            if(_state === State.RESOLVED) {
                callback.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Add a Function to the list of callbacks to be executed when the Deferred is rejected via {@link gc.Deferred#reject}
         *
         * @param  {Function} callback Callback to execute when rejected
         * @return {gc.Deferred}       Self object to allow chaining
         *
         * @public
         */
        this.fail = function fail(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _fail.push(callback);

            if(_state === State.REJECTED) {
                callback.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Add a Function to the list of callbacks to be executed when the Deferred is resolved or rejected.
         * The functions added here are executed AFTER the ones added in {@link gc.Deferred#done} and {@link gc.Deferred#fail}
         *
         * @param  {Function} callback Callback to execute when resolved or rejected
         * @return {gc.Deferred}       Self object to allow chaining
         *
         * @public
         */
        this.always = function always(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _always.push(callback);

            if(_state !== State.PENDING) {
                callback.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Add a Function to the list of callbacks to be executed when the Deferred is updated via {@link gc.Deferred#notify}
         *
         * @param  {Function} callback Callback to execute when updated
         * @return {gc.Deferred}       Self object to allow chaining
         *
         * @public
         */
        this.progress = function progress(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _progress.push(callback);

            return this;
        };

        /**
         * Creates a new Deferred and chains it to the current one.
         *
         * @param  {Function} [done]     Callback to execute after the current Deferred is resolved via {@link gc.Deferred#resolve}.
         *                               The parameters accepted will be the returned value of the previous
         *                               {@link gc.Deferred#then} or the value which is resolved with.
         * @param  {Function} [fail]     Callback to execute after the current Deferred is rejected via {@link gc.Deferred#reject}
         *                               The parameters accepted will be the returned value of the previous
         *                               {@link gc.Deferred#then} or the value which is rejected with.
         * @param  {Function} [progress] Callback to execute after the current Deferred is notified via {@link gc.Deferred#notify}
         *                               The parameters accepted will be the returned value of the previous
         *                               {@link gc.Deferred#then} or the value which is notified with.
         * @return {Promise}             {@link gc.Deferred#promise} of the new Deferred chained to the current one
         *
         * @public
         */
        this.then = function then(done, fail, progress) {
            if(done && !gc.util.isFunction(done)) {
                throw new gc.exception.WrongSignatureException("done is not a Function");
            }
            if(fail && !gc.util.isFunction(fail)) {
                throw new gc.exception.WrongSignatureException("fail is not a Function");
            }
            if(progress && !gc.util.isFunction(progress)) {
                throw new gc.exception.WrongSignatureException("progress is not a Function");
            }

            _then.def = new Deferred(function(then) {
                if(done) {
                    then.done = done;
                }
                if(fail) {
                    then.fail = fail;
                }
                if(progress) {
                    then.progress = progress;
                }
            });

            return _then.def.promise();
        };

        /**
         * Get a Promise for the current Deferred.
         * A Promise is nothing else than a read-only Deferred. Since the only that should modify the status of
         * the Deferred is its creator, this is a way to encapsulate the read-only methods.
         *
         * @param  {Object}     [obj] If an object is specified, it will be extended with Promise methods
         * @return {gc.Promise}       Promise for the current Deferred
         *
         * @public
         */
        this.promise = function promise(obj) {
            var p = {
                    state   : this.state,
                    done    : this.done,
                    fail    : this.fail,
                    always  : this.always,
                    progress: this.progress,
                    then    : this.then,
                    promise : this.promise
                };

            return obj != null ? gc.util.extend(obj, p)
                               : p;
        };

        /**
         * Set the status to {@link gc.Deferred#State.PENDING} again without losing the attached listeners.
         * To reset everything, better create a new {@link gc.Deferred}
         *
         * @public
         */
        this.reset = function reset() {
            _state = State.PENDING;

            if(_then.def) {
                _then.def.reset();
            }
        };

        /**
         * Set the Deferred as resolved.
         * This will trigger the callbacks specified with {@link gc.Deferred#done}, {@link gc.Deferred#always} and resolve the
         * chained Deferred with {@link gc.Deferred#then}, in that order, with the specified parameters if any.
         *
         * @return {gc.Deferred} Self object to allow chaining
         *
         * @public
         */
        this.resolve = function resolve() {
            var i, n, args;

            if(_state !== State.PENDING) {
                return this;
            }

            _state = State.RESOLVED;
            _resultArgs = arguments;

            if(_then.done) {
                _resultArgs = [_then.done.apply(null, arguments)];
            }

            for(i=0, n=_done.length; i<n; i++) {
                _done[i].apply(null, _resultArgs);
            }
            for(i=0, n=_always.length; i<n; i++) {
                _always[i].apply(null, _resultArgs);
            }

            if(_then.def) {
                _then.def.resolve.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Set the Deferred as rejected.
         * This will trigger the callbacks specified with {@link gc.Deferred#fail}, {@link gc.Deferred#always} and reject the
         * chained Deferred with {@link gc.Deferred#then}, in that order, with the specified parameters if any.
         *
         * @return {gc.Deferred} Self object to allow chaining
         *
         * @public
         */
        this.reject = function reject() {
            var i, n;

            if(_state !== State.PENDING) {
                return this;
            }

            _state = State.REJECTED;
            _resultArgs = arguments;

            if(_then.fail) {
                _resultArgs = [_then.fail.apply(null, arguments)];
            }

            for(i=0, n=_fail.length; i<n; i++) {
                _fail[i].apply(null, _resultArgs);
            }
            for(i=0, n=_always.length; i<n; i++) {
                _always[i].apply(null, _resultArgs);
            }

            if(_then.def) {
                _then.def.reject.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Notify the Deferred of an update with the specified parameters if any.
         * This will trigger the callbacks specified with {@link gc.Deferred#progress} and notify the
         * chained Deferred with {@link gc.Deferred#then}, in that order.
         *
         * @return {gc.Deferred} Self object to allow chaining
         *
         * @public
         */
        this.notify = function notify() {
            var i, n,
                args = arguments;

            if(_state !== State.PENDING) {
                return this;
            }

            if(_then.progress) {
                args = [_then.progress.apply(null, arguments)];
            }

            for(i=0, n=_progress.length; i<n; i++) {
                _progress[i].apply(null, args);
            }

            if(_then.def) {
                _then.def.notify.apply(null, args);
            }

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
    gc.Deferred = Deferred;
    gc.util.defineConstant(gc.Deferred, "VERSION", VERSION);
    gc.util.defineConstant(gc.Deferred, "State", State);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.XHR
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Enum: Possible request methods
     *
     * @enum {String}
     * @readOnly
     * @memberOf gc.XHR
     * @public
     */
    var Method = {
        GET    : "GET",
        POST   : "POST",
        HEAD   : "HEAD",
        PUT    : "PUT",
        DELETE : "DELETE"
    };

    var ReadyState = {
        UNSENT                   : 0,       // open() has not been called yet.
        OPENED                   : 1,       // send() has been called.
        HEADERS_RECEIVED         : 2,       // send() has been called, and headers and status are available.
        LOADING                  : 3,       // Downloading; responseText holds partial data.
        DONE                     : 4        // The operation is complete.
    };

    var Status = {
        // success states
        SUCCESS     : 0,
        NOTMODIFIED : 1,
        NOCONTENT   : 2,
        // error states
        ERROR       : 3,
        TIMEOUT     : 4,
        ABORT       : 5
    };


    /**
     * Class for asynchronous comunication over XMLHttpRequests.
     * It has all the methods of {@link gc.Deferred#promise}
     *
     * @param {String}   url                            URL to request
     * @param {Object}   Options                        User specified options to override the default ones
     * @param {Object}   [Options.data={}]              Parameters to send
     * @param {Method}   [Options.method=Method.GET]    Type of request
     * @param {boolean}  [async=true]                   false if we want the request to be synchronous
     * @param {Integer}  [Options.timeout=30000]        Milliseconds to wait before triggering fail (0 will disable it)
     *
     * @requires gc.Util
     * @requires gc.Deferred
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var XHR = function(url, options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _xhr,
            _options,
            _deferred;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(url, options) {
            var defaultOptions = {
                    data   : {},
                    method : Method.GET,
                    timeout: 30000,
                    async  : true
                };

            _options = gc.util.extend(defaultOptions, options);
            delete(defaultOptions.data);
            // data validation :start
            if(!_options.url) {
                throw new gc.exception.WrongDataException("URL is not specified");
            }

            _validator.reset()
                      .enumerated('method', _options.method, { enumerated: Method })
                      .bool('async', _options.async)
                      .intPositive('timeout', _options.timeout);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }
            _options = _validator.valid();
            _options.url = url;
            // data validation :end

            // convert the XHR in a Promise
            _deferred = new gc.Deferred();
            _deferred.promise(this);

            _makeRequest();
        };

        /**
         * Execute the request based on the set options
         *
         * @private
         */
        var _makeRequest = function _makeRequest() {
            _xhr = new XMLHttpRequest();

            _xhr.open(_options.method, _options.url, _options.async);

            if(_options.async && _options.timeout > 0) {
                _xhr.timeout = _options.timeout;

            } else {
                _xhr.timeout = 0;
            }

            _xhr.onload = function(progress) {
                // status 0 is for file protocol (local)
                if(_xhr.status === 0 || (_xhr.status >= 200 && _xhr.status < 400)) {
                    _deferred.resolve(_xhr, progress);

                } else if(_xhr.status >= 100 && _xhr.status < 200) {
                    _deferred.notify(_xhr, progress);

                } else {
                    _deferred.reject(_xhr, progress);
                }
            };

            _xhr.onerror = function(progress) {
                _deferred.reject(progress);
            };

            _xhr.ontimeout = function(progress) {

            };

            try {
                _xhr.send();

            } catch(e) {

            }
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////




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
    gc.XHR = XHR;
    gc.util.defineConstant(gc.XHR, "VERSION", VERSION);
    gc.util.defineConstant(gc.XHR, "Method", Method);

} (window, window.gc));

;(function(window, document, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.FPS
     * @public
     */
    var VERSION = "1.0.0";


    /**
     * FPS for measuring Frames per Second.
     *
     * @param {Object}                                     options List of options to override
     * @param {Number}   [options.updateDelay=1000]        Time between updates (in milliseconds)
     * @param {String}   [options.font=12 px Arial]        style used by {@link gc.FPS#draw}
     * @param {String}   [options.fillStyle=#FFFF00]       font color style used by {@link gc.FPS#draw}
     * @param {Function} [options.update=undefined]        function called when the fps counter is updated
     * @param {Number}   [options.x=0]                     x-position for the text, used by {@link gc.FPS#draw}
     * @param {Number}   [options.y=0]                     y-position for the text, used by {@link gc.FPS#draw}
     * @param {gc.Align} [options.align=gc.Align.TOP_LEFT] alineation for the text, used by {@link gc.FPS#draw}
     *
     * @requires gc.Util
     * @requires gc.Validator
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var FPS = function(options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _nextUpdateTime = 0,        // next time the _fps value will be updated
            _fpsCount = 0,              // count of fps for this update
            _fps,                       // cached fps until the next update
            _options;

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new instance
         *
         * @private
         */
        function _construct(options) {
            var defaultOptions = {
                    updateDelay: 1000,
                    update: undefined,
                    font: "12px Arial",
                    fillStyle: "#FFFF00",
                    x: 0,
                    y: 0,
                    align: gc.Align.TOP_LEFT
                };

            _options = gc.util.extend(defaultOptions, options);

            // data validation :start
            _validator.reset()
                      .intPositive('updateDelay', _options.updateDelay)
                      .callback('update', _options.update, { optional: true })
                      .str('font', _options.font)
                      .str('fillStyle', _options.fillStyle)
                      .int('x', _options.x)
                      .int('y', _options.y)
                      .enumerated('align', _options.align, { enumerated: gc.Align });

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }
            _options = _validator.valid();
            // data validation :end
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Options getter/setter.
         * If only <var>key</var> is specified, acts as a getter
         * If <var>value</var> is specified too, acts as a setter
         *
         * @param {String}        key   Name of the option to get/set
         * @param {mixed}         value New value for the option specified by key
         *
         * @return {gc.FPS|mixed}       this to allow chaining for the setter, the asked value for the getter
         * @public
         */
        this.option = function option(key, value) {
            switch(arguments.length) {
                case 1:
                    return _options[key];

                case 2:
                    _options[key] = value;
                    return this;

                default:
                    throw "Wrong Parameters";
            }
        };

        /**
         * Update the FPS.
         * Needed to be called in each frame of the main loop.
         *
         * @param  {DOMHighResTimeStamp}   now milliseconds of the current time
         * @return {gc.FPS}                Self object for allowing chaining
         *
         * @public
         */
        this.update = function update(now) {
            _fpsCount++;

            if(_nextUpdateTime < now)
            {
                _nextUpdateTime += _options.updateDelay;
                _fps = _fpsCount;
                _fpsCount = 0;

                if(_options.update) {
                    _options.update(_fps);
                }
            }

            return this;
        };

        /**
         * Get the most updated count of FPS
         *
         * @return {Integer} last updated FPS count
         * @public
         */
        this.getFPS = function getFPS() {
            return _fps;
        };

        /**
         * Draw a text with the most recent calculated FPS
         *
         * @param  {CanvasRenderingContext2D}   ctx Where to draw
         * @return {gc.FPS}                     Self object for allowing chaining
         *
         * @public
         */
        this.draw = function draw(ctx) {
            var text,
                textSize,
                textPosition,
                oldFillStyle = ctx.fillStyle,
                oldFont = ctx.font;

            ctx.font = _options.font;
            ctx.fillStyle = _options.fillStyle;

            text = _fps + " fps";
            textSize = ctx.measureText(text);
            textPosition = gc.util.alignPosition(_options.align, textSize.width, 10, _options.x, _options.y, 0, 10);
            ctx.fillText(text, textPosition.x, textPosition.y);

            ctx.font = oldFont;
            ctx.fillStyle = oldFillStyle;

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
    gc.FPS = FPS;
    gc.util.defineConstant(gc.FPS, "VERSION", VERSION);

} (window, document, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.ResourceManager
     * @public
     */
    var VERSION = "1.0.0";

    /**
     * Enum: Type of managed resources
     *
     * @enum {Number}
     * @readOnly
     * @memberOf gc.ResourceManager
     * @public
     */
    var ResourceType = {
        IMAGE : 0,
        FONT  : 1,
        AUDIO : 2,
    };


    /**
     * Resource (assets) Manager
     *
     * @requires gc.Util
     * @requires gc.Deferred
     * @requires gc.Validator
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var ResourceManager = function() {


        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        /*
         * List of resources managed in objects like:
         *  {
         *      size    : {Integer},    // Size in bytes or 1 if not specified
         *      src     : {String},     // URL of the resource's source
         *      rsc     : {Object},     // when is not undefined, means that it's been loaded 100%
         *      tmp     : {Object}      // used to create the resource while loading. Not available after loaded
         *  }
         */
        var _images,
            _fonts,
            _audios;

        var _total,         // Total size (or number of elements) of ALL the resources
            _loaded,        // Total bytes (or number of elements) loaded for ALL the type of resources
            _deferred;      // Deferred object to manage callbacks


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct() {
            _images = {};
            _fonts  = {};
            _audios = {};
            _total  = 0;
            _loaded = 0;

            // convert the ResourceManager in a Promise
            _deferred = new gc.Deferred();
            _deferred.promise(this);
        };

        /**
         * Called when the status of the ResourceManager is updated to Trigger the needed callbacks
         *
         * @param {String}       key  key of the loaded resource
         * @param {ResourceType} type type of the loaded resource
         *
         * @private
         */
        function _update(key, type) {
            var i, n;

            _deferred.notify(_loaded/_total, key, type);

            if(_loaded === _total) {
                _deferred.resolve(_loaded/_total, key, type);
            }
        }

        /**
         * Load one single image
         *
         * @param   {String} key  Key of the image to load
         * @param   {Object} data Object with the properties of the image to load
         *
         * @private
         */
        function _loadImage(key, data) {
            data.tmp = new Image();
            data.tmp.onload = function() {
                _loaded += data.size;
                data.rsc = data.tmp;
                delete data.tmp;
                _update(key, ResourceType.IMAGE);
            };
            data.tmp.src = data.src;
        }

        /**
         * Load one single audio
         *
         * @param   {String} key  Key of the audio to load
         * @param   {Object} data Object with the properties of the audio to load
         *
         * @private
         */
        function _loadAudio(key, data) {
            data.tmp = new Audio();
            data.tmp.oncanplaythrough = function() {    // onloadeddata ??
                _loaded += data.size;
                data.rsc = data.tmp;
                delete data.tmp;
                _update(key, ResourceType.AUDIO);
            };
            data.tmp.src = data.src;
        }

        /**
         * Load one single generic file
         *
         * @param   {String}       key  Key of the file to load
         * @param   {Object}       data Object with the properties of the file to load
         * @param   {ResourceType} type Type of the object to load
         *
         * @private
         */
        function _loadFile(key, data, type) {
            var request = new gc.XHR(data.src);
            request.done(function() {
                _loaded += data.size;
                data.rsc = true;
                delete data.tmp;
                _update(key, ResourceType.FONT);
            });
            data.tmp = true;
        }

        /**
         * Queue resources of one type, without start loading them
         *
         * @param  {Object} container     Object where the resources will be loaded into
         * @param  {Object} data          Definition of the resources to ask as {key:resourceData}
         * @param  {String} data.src      Source of the resource (usually a URL)
         * @param  {Number} [data.size=1] Size of the resource
         *
         * @private
         */
        function _queueResources(container, data) {
            var key,
                size;

            for(key in data) {
                if(container[key]) {
                    _total -= container[key].size;
                    _loaded -= container[key].size;
                }

                size = data[key].size || 1;
                container[key] = {
                    size: size,
                    src : data[key].src
                };

                _total += container[key].size;
            }
        }

        /**
         * Load the resources of one type, that are already queued and not loading/loaded
         *
         * @param  {Object}   container Object where the resources will be loaded into
         * @param  {Function} loader    Function that loads a single resource of this type
         *
         * @private
         */
        function _loadResources(container, loader) {
            var key;

            for(key in container) {
                if(!container[key].rsc && !container[key].tmp) {
                    loader(key, container[key]);
                }
            }
        }

        function _validateResourceDefinition(data) {
            _validator.reset()
                      .resourceDefinitionObject('data', data);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Load images
         *
         * @param  {Object} data          Object of the images to ask as {key:resourceData}
         * @param  {String} data.src      Source of the image (usually a URL)
         * @param  {Number} [data.size=1] Size of the image
         * @return {gc.ResourceManager}   Self object to allow chaining
         *
         * @public
         */
        this.loadImages = function loadImages(data) {
            _validateResourceDefinition(data);

            _deferred.reset();
            _queueResources(_images, data);
            _loadResources(_images, _loadImage);
            return this;
        };

        /**
         * Load Fonts
         *
         * @param  {Object} data          Object of the fonts to ask as {key:resourceData}
         * @param  {String} data.src      Source of the font (usually a URL)
         * @param  {Number} [data.size=1] Size of the font
         * @return {gc.ResourceManager}   Self object to allow chaining
         *
         * @public
         */
        this.loadFonts = function loadFonts(data) {
            _validateResourceDefinition(data);

            _deferred.reset();
            _queueResources(_fonts, data);
            _loadResources(_fonts, _loadFile, ResourceType.FONT);
            return this;
        };

        /**
         * Load Audios
         *
         * @param  {Object} data          Object of the audio files to ask as {key:resourceData}
         * @param  {String} data.src      Source of the audio (usually a URL)
         * @param  {Number} [data.size=1] Size of the audio
         * @return {gc.ResourceManager}   Self object to allow chaining
         *
         * @public
         */
        this.loadAudios = function loadAudios(data) {
            _validateResourceDefinition(data);

            _deferred.reset();
            _queueResources(_audios, data);
            _loadResources(_audios, _loadAudio);
            return this;
        };

        /**
         * Load resources
         *
         * @param  {Object} data                       Definitions of the resources to load
         * @param  {Object} [data[ResourceType.IMAGE]] Object accepted by {@link gc.ResourceManager#loadImages}
         * @param  {Object} [data[ResourceType.FONT]]  Object accepted by {@link gc.ResourceManager#loadFonts}
         * @param  {Object} [data[ResourceType.AUDIO]] Object accepted by {@link gc.ResourceManager#loadAudios}
         * @return {gc.ResourceManager}                Self object to allow chaining
         *
         * @public
         */
        this.load = function load(data) {
            if(!gc.util.isPlainObject(data)) {
                throw gc.exception.WrongSignatureException("data is not an Object");
            }

            _deferred.reset();

            // queue
            if(data[ResourceType.IMAGE]) {
                _queueResources(_images, data[ResourceType.IMAGE]);
            }
            if(data[ResourceType.FONT]) {
                _queueResources(_fonts, data[ResourceType.FONT]);
            }
            if(data[ResourceType.AUDIO]) {
                _queueResources(_audios, data[ResourceType.AUDIO]);
            }

            // load
            if(data[ResourceType.IMAGE]) {
                _loadResources(_images, _loadImage);
            }
            if(data[ResourceType.FONT]) {
                _loadResources(_fonts, _loadFile);
            }
            if(data[ResourceType.AUDIO]) {
                _loadResources(_audios, _loadAudio);
            }

            return this;
        };

        /**
         * Get a loaded Image
         *
         * @param  {String} key Key of the Image
         * @return {Image}      Image resource, or undefined if not loaded or not found
         *
         * @public
         */
        this.getImage = function getImage(key) {
            if(!_images[key] || !_images[key].rsc) {
                return undefined;
            }

            return _images[key].rsc;
        };

        /**
         * Get a loaded Audio
         *
         * @param  {String} key Key of the Audio
         * @return {Audio}      Audio resource, or undefined if not loaded or not found
         *
         * @public
         */
        this.getAudio = function getAudio(key) {
            if(!_audios[key] || !_audios[key].rsc) {
                return undefined;
            }

            return _audios[key].rsc;
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
    gc.ResourceManager = ResourceManager;
    gc.util.defineConstant(gc.ResourceManager, "VERSION", VERSION);
    gc.util.defineConstant(gc.ResourceManager, "ResourceType", ResourceType);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();
    var BOUNDS_STROKESTYLE = "#0f0";
    var BOUNDS_LINE_WIDTH = 1;
    var CENTER_FILLSTYLE = "#f00";
    var CENTER_RADIUS = 2;

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Drawable
     * @public
     */
    var VERSION = "0.2.1";

    /**
     * Class to provide common basic drawing functionality
     *
     * @param {Image}   texture         Source of the image
     * @param {Integer} [w=src.width]   Width of the start of the region
     * @param {Integer} [h=src.height]  height of the start of the region
     * @param {Integer} [x=0]           x-position of the start of the region
     * @param {Integer} [y=0]           y-position of the start of the region
     * @param {Integer} [cx=0]          x-position of the center of the region
     * @param {Integer} [cy=0]          y-position of the center of the region
     *
     * @required gc.Point2
     * @required gc.Size2
     * @requires gc.Util
     *
     * @constructor
     * @memberOf gc
     * @version 0.2.1
     * @author @danikaze
     */
    var Drawable = function(src, w, h, x, y, cx, cy) {

        //////////////////////////
        // PUBLIC INSTANCE VARS //
        //////////////////////////

        var _texture,   // Source of the image
            _size,      // Size of the image
            _offset,    // position of the start of the image
            _center;    // position of the center of the image

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        function _construct(texture, width, height, offsetX, offsetY, centerX, centerY) {
            _texture = texture;
            _size = new gc.Size2(width || texture.width, height || texture.height);
            _offset = new gc.Point2(offsetX || 0, offsetY || 0);
            _center = new gc.Point2(centerX || 0, centerY || 0);

            _validator.reset()
                      .intPositive("width", _size.width)
                      .intPositive("height", _size.height)
                      .intPositive("offsetX", _offset.x)
                      .intPositive("offsetY", _offset.y)
                      .int("centerX", _center.x)
                      .int("centerY", _center.y);

            if(_validator.errors()) {
                throw new gc.exception.WrongSignatureException(_validator.errors());
            }
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Draw the Drawable into a CanvasRenderingContext2D
         * It has the same signatures that {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D|CanvasRenderingContext2D}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.draw = function draw(ctx) {
            switch(arguments.length) {
                case 3: // draw(ctx, x, y)
                    ctx.drawImage(
                        _texture,
                        _offset.x,
                        _offset.y,
                        _size.width,
                        _size.height,
                        arguments[1] - _center.x,
                        arguments[2] - _center.y,
                        _size.width,
                        _size.height
                    );
                    break;

                case 5: // draw(ctx, x, y, w, h)
                    ctx.drawImage(
                        _texture,
                        _offset.x,
                        _offset.y,
                        _size.width,
                        _size.height,
                        arguments[1] - _center.x * (arguments[3]/_size.width),
                        arguments[2] - _center.y * (arguments[4]/_size.height),
                        arguments[3],
                        arguments[4]
                    );
                    break;

                case 9: // draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh)
                    ctx.drawImage(
                        _texture,
                        _offset.x + arguments[1],
                        _offset.y + arguments[2],
                        Math.min(arguments[3], _size.width  - arguments[1]),
                        Math.min(arguments[4], _size.height - arguments[2]),
                        arguments[5] - _center.x * (arguments[7]/_size.width),
                        arguments[6] - _center.y * (arguments[8]/_size.height),
                        arguments[7],
                        arguments[8]
                    );
                    break;

                default:
                    throw "Incorrect number of parameters";
            }

            return this;
        };

        /**
         * Stroke a rectangle as the boundaries of the Drawable element
         * It accept the same parameters as {@link gc.Drawable#draw}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.drawBounds = function drawBounds(ctx) {
            ctx.strokeStyle = BOUNDS_STROKESTYLE;
            ctx.lineWidth = BOUNDS_LINE_WIDTH;

            switch(arguments.length) {
                case 3: // draw(ctx, x, y)
                    ctx.strokeRect(
                        Math.round(arguments[1] - _center.x) - BOUNDS_LINE_WIDTH/2,
                        Math.round(arguments[2] - _center.y) - BOUNDS_LINE_WIDTH/2,
                        _size.width  + BOUNDS_LINE_WIDTH,
                        _size.height + BOUNDS_LINE_WIDTH
                    );
                    break;

                case 5: // draw(ctx, x, y, w, h)
                    ctx.strokeRect(
                        Math.round(arguments[1] - _center.x * (arguments[3]/_size.width))  - BOUNDS_LINE_WIDTH/2,
                        Math.round(arguments[2] - _center.y * (arguments[4]/_size.height)) - BOUNDS_LINE_WIDTH/2,
                        arguments[3],
                        arguments[4]
                    );
                    break;

                case 9: // draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh)
                    ctx.strokeRect(
                        Math.round(arguments[3] - _center.x * (arguments[7]/_size.width))  - BOUNDS_LINE_WIDTH/2,
                        Math.round(arguments[4] - _center.y * (arguments[8]/_size.height)) - BOUNDS_LINE_WIDTH/2,
                        arguments[7],
                        arguments[8]
                    );
                    break;

                default:
                    throw "Incorrect number of parameters";
            }

            return this;
        };

        /**
         * Draw a point at the center of the Drawable element.
         * It accept the same parameters as {@link gc.Drawable#draw}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.drawCenter = function drawCenter(ctx) {
            ctx.fillStyle = CENTER_FILLSTYLE;

            switch(arguments.length) {
                case 3: // draw(ctx, x, y)
                case 5: // draw(ctx, x, y, w, h)
                    ctx.fillRect(arguments[1] - CENTER_RADIUS, arguments[2] - CENTER_RADIUS, CENTER_RADIUS*2+1, CENTER_RADIUS*2+1);
                    break;

                case 9: // draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh)
                    ctx.fillRect(arguments[5] - CENTER_RADIUS, arguments[6] - CENTER_RADIUS, CENTER_RADIUS*2+1, CENTER_RADIUS*2+1);
                    break;

                default:
                    throw "Incorrect number of parameters";
            }

            return this;
        };

        /**
         * Set a new size for the Drawable element.
         * It accepts the same parameters that {@link gc.Size2#set}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.setSize = function setSize(w, h) {
            _size.set.apply(_size, arguments);

            return this;
        };

        /**
         * Get the size of the Drawable element
         *
         * @return {Object} Size as { width, height }
         *
         * @public
         */
        this.getSize = function getSize() {
            return _size.get();
        };

        /**
         * Set a new offset for the Drawable element.
         * It accepts the same parameters that {@link gc.Point2#set}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.setOffset = function setOffset(x, y) {
            _offset.apply(_offset, arguments);

            return this;
        };

        /**
         * Get the offset of the Drawable element
         *
         * @return {Object} Offset as { x, y }
         *
         * @public
         */
        this.getOffset = function getOffset() {
            return _offset.get();
        };

        /**
         * Set the center of the Drawable object. When calling draw, the center of the object will
         * be placed at the x,y positions. This function has three signatures:
         *  1 parameter : A {@link gc.Align} value to automatically calculate the center position
         *  1 parameter : A {@link gc.Point2} Point2 object to copy the {x, y} from
         *  2 parameters: (centerX, centerY) as explicit values
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.setCenter = function setCenter() {
            switch(arguments.length) {
                case 1:
                    // setCenter(gc.Point2)
                    if(gc.util.isPlainObject(arguments[0])) {
                        _center.set(arguments[0]);
                        break;
                    }

                    // setCenter(gc.Align)
                    switch(arguments[0]) {
                        case gc.Align.BOTTOM:
                            _center.set(_size.width/2, _size.height);
                            break;

                        case gc.Align.BOTTOM_LEFT:
                            _center.set(0, _size.height);
                            break;

                        case gc.Align.BOTTOM_RIGHT:
                            _center.set(_size.width, _size.height);
                            break;

                        case gc.Align.CENTER:
                            _center.set(_size.width/2, _size.height/2);
                            break;

                        case gc.Align.LEFT:
                            _center.set(0, _size.height/2);
                            break;

                        case gc.Align.RIGHT:
                            _center.set(_size.width, _size.height/2);
                            break;

                        case gc.Align.TOP:
                            _center.set(_size.width/2, 0);
                            break;

                        case gc.Align.TOP_LEFT:
                            _center.set(0, 0);
                            break;

                        case gc.Align.TOP_RIGHT:
                            _center.set(_size.width, 0);
                            break;

                        default:
                            throw gc.exception.WrongDataException("align is not a value of gc.Align");
                    }
                    break;

                // setCenter(x, y)
                case 2:
                    _center.set(arguments[0], arguments[1]);
                    break;

                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }

            return this;
        };

        /**
         * Get the center of the Drawable element
         *
         * @return {Object} Center as { x, y }
         *
         * @public
         */
        this.getCenter = function getCenter() {
            return _center.get();
        };

        /**
         * Return an object with the public methods for the Drawable,
         * or extend an {@link obj} if provided
         *
         * @param  {Object} [obj] Object to extend with Drawable methods
         * @return {Object}       List of public methods of the Drawable,
         *                        or the extended Object if provided as parameter
         *
         * @public
         */
        this.drawable = function drawable(obj) {
            var d = {
                draw      : this.draw,
                drawBounds: this.drawBounds,
                drawCenter: this.drawCenter,
                setOffset : this.setOffset,
                getOffset : this.getOffset,
                setSize   : this.setSize,
                getSize   : this.getSize,
                setCenter : this.setCenter,
                getCenter : this.getCenter,
                drawable  : this.drawable
            };

            return obj != null ? gc.util.extend(obj, d)
                               : d;
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
    gc.Drawable = Drawable;
    gc.util.defineConstant(gc.Drawable, "VERSION", VERSION);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    ////////////////////////////
    // STATIC PRIVATE METHODS //
    ////////////////////////////

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    ///////////////////////////
    // STATIC PUBLIC METHODS //
    ///////////////////////////

    /**
     * Camera associated to a {@link gc.Canvas2}
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Camera2
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Description of the class
     *
     * @param {gc.Canvas2D} canvas Canvas associated to the camera
     *
     * @requires gc.Util
     * @requires gc.Canvas2
     * @requires gc.Point2
     * @requires gc.Rectangle
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Camera2 = function(canvas) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _canvas;

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(canvas) {
            var canvasSize;

            _canvas = canvas;
            canvasSize = canvas.getSize();
            /** zoom of the camera */
            this.scale = new gc.Point2(1, 1);
            /** point to handle the camera position */
            this.center = new gc.Point2(Math.floor(canvasSize.width/2), Math.floor(canvasSize.height/2));
            /** viewport of the camera (position in the world + size to show) */
            this.viewport = new gc.Rectangle(canvasSize.width, canvasSize.height, this.center.x, this.center.y);
            /** camera's angle of rotation in radians */
            this.angle = 0;
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Get the canvas associated with this Camera
         *
         * @return {gc.Canvas2D} canvas Canvas controlled by this Camera
         *
         * @public
         */
        this.getCanvas = function getCanvas() {
            return _canvas;
        };

        /**
         * Set the viewport of the Camera and update the canvas and update the canvas context
         *
         * @param  {gc.Rectangle} viewport Viewport of the Camera
         * @return {gc.Camera2}            Self reference to allow chaining
         *
         * @public
         */
        this.setViewport = function setViewport(viewport) {
            this.viewport.setPosition(viewport.x || 0, viewport.y || 0);
            this.viewport.setSize(viewport.width || 0, viewport.height || 0);
            _canvas.updateView();

            return this;
        };

        /**
         * Move the camera the specified amount
         * It edits the current position instead of resetting it
         *
         * @param  {Number}     x Amount to move the camera in the x-axis
         * @param  {Number}     y Amount to move the camera in the y-axis
         * @return {gc.Camera2}   Self reference to allow chaining
         *
         * @public
         */
        this.move = function move(x, y) {
            this.viewport.x += x;
            this.viewport.y += y;
            _canvas.updateView();

            return this;
        };

        /**
         * Set the zoom of the camera and update the canvas context
         *
         * @param  {Number}     x Zoom/scale of the camera x-factor
         * @param  {Number}     y Zoom/scale of the camera y-factor
         * @return {gc.Camera2}   Self reference to allow chaining
         *
         * @public
         */
        this.setScale = function setScale(x, y) {
            this.scale.set(x || 1, y || 1);
            _canvas.updateView();

            return this;
        };

        /**
         * Multiply the zoom of the camera and update the canvas context.
         * It edits the current value instead of resetting it
         *
         * @param  {Number}     x Zoom/scale of the camera x-factor
         * @param  {Number}     y Zoom/scale of the camera y-factor
         * @return {gc.Camera2}   Self reference to allow chaining
         *
         * @public
         */
        this.zoom = function zoom(x, y) {
            this.scale.x *= x;
            this.scale.y *= y;
            _canvas.updateView();

            return this;
        };

        /**
         * Set the center of the Camera coordinates (by default, the center).
         * Note that the viewport of the camera will not change, therefore the final position of the camera DO will change
         *
         * @param  {gc.Align|gc.Point2|Number}   center New center to handle the camera. It can be a {@link gc.Point2}, a {@link gc.Align}
         *                                              value, or two numbers x and y relatives to the top-left corner of the camera viewport
         * @return {gc.Camera2}                         Self reference to allow chaining
         *
         * @public
         */
        this.setCenter = function setCenter(center) {
            var alignedPosition;

            switch(arguments.length) {
                case 1:
                    if(center.x !== undefined && center.y !== undefined) {
                        this.center.set(center.x || this.viewport.width/2, center.y || this.viewport.height/2);
                    } else {
                        alignedPosition = gc.util.alignPosition(center, this.viewport.width, this.viewport.height);
                        this.center.set(-alignedPosition.x, -alignedPosition.y);
                    }
                    break;

                case 2:
                    this.center.set(arguments[0], arguments[1]);
                    break;

                default:
                    throw new gc.exception.WrongSignatureException("Wrong number of parameters");

            }

            _canvas.updateView();

            return this;
        };

        /**
         * Set the angle of the camera (in degrees) and update the canvas view.
         * It can be set directly in radians with {@link gc.Camera2#angle} but the canvas would need to be updated manually
         *
         * @param  {Number}     angle Angle of the camera in degrees [0-365)
         * @return {gc.Camera2}       Self reference to allow chaining
         *
         * @public
         */
        this.setAngle = function setAngle(angle) {
            this.angle = angle * Math.PI / 180;
            _canvas.updateView();

            return this;
        };

        /**
         * Add a value (in degrees) to the current angle of the camera and update the canvas view
         * It can be set directly in radians with {@link gc.Camera2#angle} but the canvas would need to be updated manually
         *
         * @param  {Number}     angle Value to add to the current angle
         * @return {gc.Camera2}       Self reference to allow chaining
         *
         * @public
         */
        this.rotate = function zoom(angle) {
            this.angle += angle * Math.PI / 180;
            _canvas.updateView();

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
    gc.Camera2 = Camera2;
    gc.util.defineConstant(gc.Camera2, "VERSION", VERSION);

} (window, window.gc));
;(function(window, gc, undefined) {
    "use strict";

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Canvas2D
     * @public
     */
    var VERSION = "0.3.0";

    ///////////////////////////
    // STATIC PUBLIC METHODS //
    ///////////////////////////

    /**
     * Decorate a CanvasRenderingContext2D with extra methods
     *
     * @param   {CanvasRenderingContext2D} ctx Canvas 2D context to decorate
     * @return  {CanvasRenderingContext2D}     Decorated context
     *
     * @private
     */
    function _decoratedContext(ctx) {

        /**
         * Browser-compatible version of the w3 CanvasRenderingContext2D#imageSmoothing variable,
         * in form of function
         *
         * @param  {boolean} enabled true to enable antialiasing, false to disable it
         * @public
         */
        ctx.setImageSmoothing = function setImageSmoothing(enabled) {
            if(ctx.imageSmoothingEnabled !== undefined) {
                ctx.imageSmoothingEnabled = enabled;
            } else if(ctx.webkitImageSmoothingEnabled !== undefined) {
                ctx.webkitImageSmoothingEnabled = enabled;
            } else if(ctx.mozImageSmoothingEnabled !== undefined) {
                ctx.mozImageSmoothingEnabled = enabled;
            } else if(ctx.msImageSmoothingEnabled !== undefined) {
                ctx.msImageSmoothingEnabled = enabled;
            }
        };

        /**
         * Method to draw all kind of supported images (not only the default ones but also gc.TextureRegion s) too
         * As need to see which kind of image is it, it's better to call the original method (like ctx.drawImage or {@link TextureRegion#draw}) directly
         *
         * @param  {Image|gc.TextureRegion}   image Image or TextureRegion to draw
         * @param  {Number} sx                source image x-offset
         * @param  {Number} sy                source image y-offset
         * @param  {Number} sw                source image width
         * @param  {Number} sh                source image height
         * @param  {Number} dx                destination x-position
         * @param  {Number} dy                destination y-position
         * @param  {Number} dw                destination width
         * @param  {Number} dh                destination height
         * @return {CanvasRenderingContext2D} The own decorated context to allow chaining
         *
         * @public
         */
        ctx.draw = function draw(image, sx, sy, sw, sh, dx, dy, dw, dh) {
            if(image instanceof gc.TextureRegion) {
                switch(arguments.length) {
                    case 3: // draw(img, x, y)
                        ctx.drawImage(
                            image.src,
                            image.offsetX,
                            image.offsetY,
                            image.width,
                            image.height,
                            arguments[1] - image.centerX,
                            arguments[2] - image.centerY,
                            image.width,
                            image.height
                        );
                        break;

                    case 5: // draw(img, x, y, w, h)
                        ctx.drawImage(
                            image.src,
                            image.offsetX,
                            image.offsetY,
                            image.width,
                            image.height,
                            arguments[1] - image.centerX * (arguments[3]/image.width),
                            arguments[2] - image.centerY * (arguments[4]/image.height),
                            arguments[3],
                            arguments[4]
                        );
                        break;

                    case 9: // draw(img, sx, sy, sw, sh, dx, dy, dw, dh)
                        ctx.drawImage(
                            image.src,
                            image.offsetX + arguments[1],
                            image.offsetY + arguments[2],
                            Math.min(arguments[3], image.width - arguments[3]),
                            Math.min(arguments[4], image.height - arguments[4]),
                            arguments[5],
                            arguments[6],
                            arguments[7],
                            arguments[8]
                        );
                        break;

                    default:
                        throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
                }

            } else {
                ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
            }
        };

        return ctx;
    }


    /**
     * Wrapper for Canvas2D objects
     *
     * @params {DOM} [canvas] DOM element of the canvas object. Since 0.2.0, if not specified, a new one will be created.
     *
     * @requires gc.Util
     * @requires gc.Camera2
     * @uses     gc.TextureRegion
     *
     * @constructor
     * @memberOf gc
     * @version 0.3.0
     * @author @danikaze
     */
    var Canvas2D = function(canvas) {


        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _ctx,
            _camera;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(canvas) {
            if(!canvas) {
                canvas = document.createElement("canvas");
            }

            if(!canvas.getContext) {
                throw new gc.exception.NotImplementedException("canvas.getContext is not supported");
            }

            //this.viewport = new gc.Rectangle({ x: 0, y: 0, width: canvas.width, height: canvas.height });
            _ctx = _decoratedContext(canvas.getContext("2d"));
            _camera = new gc.Camera2(this);
            this.updateView();

            // by default, disable the text selection when doing double click on the canvas
            this.setTextSelection(false);
        };


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Get a decorated CanvasRenderingContext2D of the canvas
         *
         * @return {CanvasRenderingContext2D} Decorated 2D context
         *
         * @public
         */
        this.getContext = function getContext() {
            return _ctx;
        };

        /**
         * Get the associated Canvas DOM element
         *
         * @return {DOM} Canvas associated with this object
         *
         * @public
         * @since  0.2.0
         */
        this.getCanvas = function getCanvas() {
            return _ctx.canvas;
        };

        /**
         * Set the size of the Canvas
         * This method accept two signatures:
         *  1 parameter : get the values of another object with { width, height } properties (such as {@link gc.Size2})
         *  2 parameters: explicit values as (width, height)
         *
         * @return {gc.Canvas2D} Self reference for allowing chaining
         *
         * @public
         * @since 0.2.0
         */
        this.setSize = function setSize() {
            switch(arguments.length) {
                case 1:
                    _ctx.canvas.width = arguments[0].width;
                    _ctx.canvas.height = arguments[0].height;
                    break;

                case 2:
                    _ctx.canvas.width = arguments[0];
                    _ctx.canvas.height = arguments[1];
                    break;

                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }

            return this;
        };

        /**
         * Get the size of the Canvas
         *
         * @return {Object} Current size of the canvas element as {width, height}
         *
         * @public
         */
        this.getSize = function getSize() {
            return {
                width : _ctx.canvas.width,
                height: _ctx.canvas.height
            };
        };

        /**
         * Set the viewport (where to draw) of the canvas
         *
         * @param {gc.Rectangle} viewport Rectangle specifying the canvas region to draw in
         * @param {Number}       [viewport.x=0]                  x-position of the region's offset
         * @param {Number}       [viewport.y=0]                  y-position of the region's offset
         * @param {Number}       [viewport.width=canvas.width]   width of the region
         * @param {Number}       [viewport.height=canvas.height] height of the region
         * @return {gc.Canvas2D}                                 self reference to allow chaining
         *
         * @public
         */
        /*
        this.setViewport = function setCamera(viewport) {
            this.viewport.setPosition(viewport.x || 0, viewport.y || 0);
            this.viewport.setSize(viewport.width || _ctx.canvas.width, viewport.height || _ctx.canvas.height);

            return this;
        };
        */

        /**
         * Set the camera to control the canvas.
         * Usually is not needed because can be edited through {@link gc.Canvas2D#getCamera}
         *
         * @param  {gc.Camera2}  camera New camera to set
         * @return {gc.Canvas2D}        Self reference to allow chaining
         *
         * @public
         */
        this.setCamera = function setCamera(camera) {
            _camera = camera;
            this.updateView();

            return this;
        };

        /**
         * Get the {@link gc.Camera2} associated to the canvas
         *
         * @return {gc.Camera2} Camera of the canvas, which control which part of the world to show
         *
         * @public
         */
        this.getCamera = function getCamera() {
            return _camera;
        };

        /**
         * Update the parameters of the context with the current values of the viewport and the camera.
         * This method is not usually needed to be called manually because it's done when the viewport and the camera
         * are updated via their setters, but it's available in case their values are updated directly
         * (and to povide consistency to the {@link gc.Camera2} methods)
         *
         * @return {gc.Canvas2D} self reference to allow chaining
         *
         * @public
         */
        this.updateView = function updateView() {
            var scaleX = _camera.scale.x,// * (this.viewport.width/_camera.viewport.width),
                scaleY = _camera.scale.y,// * (this.viewport.height/_camera.viewport.height),
                offsetX = -_camera.viewport.x + _camera.center.x,// + this.viewport.x,
                offsetY = -_camera.viewport.y + _camera.center.y;// + this.viewport.y;

            _ctx.setTransform(1, 0, 0, 1, 0, 0);
            // clipping is not supported, so viewport is ignored for now
            //_ctx.canvas.width = _ctx.canvas.width;  // reset all the canvas
            //_ctx.beginPath();
            //_ctx.rect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            //_ctx.clip();

            _ctx.setTransform(1, 0, 0, 1, _camera.center.x, _camera.center.y);
            _ctx.scale(scaleX, scaleY);
            _ctx.rotate(-_camera.angle);
            _ctx.translate(-_camera.center.x + offsetX, -_camera.center.y + offsetY);

            return this;
        };

        /**
         * Enable or disable selecting text outside the canvas when double clicking it
         *
         * @param  {boolean} enabled If false (by default), the text outside the canvas won't be selectd when doing double click on the canvas element
         * @return {gc.Canvas2D} self reference to allow chaining
         *
         * @public
         */
        this.setTextSelection = function disableTextSelection(enabled) {
            if(enabled) {
                _ctx.canvas.onselectstart = null;

            } else {
                _ctx.canvas.onselectstart = function () {
                    return false;
                };
            }

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
    gc.Canvas2D = Canvas2D;
    gc.util.defineConstant(gc.Canvas2D, "VERSION", VERSION);

} (window, window.gc));
;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Point2
     * @public
     */
    var VERSION = "0.4.0";

    /**
     * Class representing 2D Points {x, y}
     *
     * @param {Number} [x=0] position-x of the Point
     * @param {Number} [y=0] position-y of the Point
     *
     * @requires gc.Util
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 0.4.0
     * @author @danikaze
     */
    var Point2 = function() {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance.
         *
         * @private
         */
        var _construct = function _construct(x, y) {
            if(arguments.length === 1) {
                this.x = arguments[0].x || 0;
                this.y = arguments[0].y || 0;

            } else {
                this.x = x || 0;
                this.y = y || 0;
            }
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Set the values of the Point2.
         *
         * @param  {Number}    [x=0] New value for the x-coordinate
         * @param  {Number}    [y=0] New value for the y-coordinate
         * @return {gc.Point2}       Self reference for allowing chaining
         *
         * @public
         */
        this.set = function set(x, y) {
            this.x = x || 0;
            this.y = y || 0;

            return this;
        };

        /**
         * Get the values of the Point2 as an object
         *
         * @return {Object} values as {x, y}
         *
         * @public
         */
        this.get = function get() {
            return {
                x: this.x,
                y: this.y
            };
        };

        /**
         * Move the Point position adding the parameters to the current position
         *
         * @param  {Number}    x Amount to move the x-position
         * @param  {Number}    y Amount to move the y-position
         * @return {gc.Point2}   Self reference for allowing chaining
         *
         * @public
         */
        this.move = function move(x, y) {
            this.x += x;
            this.y += y;

            return this;
        };

        /**
         * Calculate the Euclidean distance between this and other point
         *
         * @param  {Number} x X-position of the other point
         * @param  {Number} y Y-position of the other point
         * @return {Number}   Euclidean distance between two points
         *
         * @public
         */
        this.distance = function distance(x, y) {
            var xx = this.x - x,
                yy = this.y - y;

            return Math.sqrt(xx*xx + yy*yy);
        };

        /**
         * Calculate the squared distance between this and other point
         *
         * @param  {Number} x X-position of the other point
         * @param  {Number} y Y-position of the other point
         * @return {Number}   Squared distance between two points
         *
         * @public
         */
        this.distance2 = function distance2(x, y) {
            var xx = this.x - x,
                yy = this.y - y;

            return xx*xx + yy*yy;
        };

        /**
         * Calculate the Manhattan distance between this point and other point
         *
         * @param  {Number} x X-position of the other point
         * @param  {Number} y Y-position of the other point
         * @return {Number}   Manhattan distance between two points
         *
         * @public
         */
        this.manhattan = function manhattan(x, y) {
            return Math.abs(this.x - x) + Math.abs(this.y - y);
        };

        /**
         * Calculate the angle between the vectors formed a reference point passed as a parameter and
         * this point (reference->this) and the X-axis.
         * This method returns a value between [0..2*PI), being 0 at right, and PI/4 at top
         *
         *           * other point
         *          /
         *         /) angle (PI/4)
         *        /__)__
         *  this *
         *
         * @param  {Number} x X-position of the other point
         * @param  {Number} y Y-position of the other point
         * @return {Number}   Angle in radians between this point and the specified one
         *
         * @public
         */
         this.angleRad = function angleRad(x, y) {
            var a;

            a = Math.atan2(this.y - y, this.x - x);

            return a < 0 ? 2 * Math.PI + a
                         : a;
         };

         /**
          * Calculate the angle between the vectors formed a reference point passed as a parameter and
          * this point (reference->this) and the X-axis.
          * This method returns a value between [0..360), being 0 at right, and 90 at top
          *   /
          *  /) angle (45º)
          * /__)___
          *
          * @param  {Number} x X-position of the other point
          * @param  {Number} y Y-position of the other point
          * @return {Number}   Angle in degrees between this point and the specified one
          *
          * @public
          */
         this.angle = function angle(x, y) {
            var a;

            a = Math.atan2(this.y - y, this.x - x);
            if(a < 0) {
                a = 2 * Math.PI + a;
            }

            return a * 180 / Math.PI;
         };

         /**
          * Get a list of the public methods for the point
          *
          * @param  {Object}    [obj] If an object is specified, it will be extended with the returned methods
          * @return {gc.Point2}       Public methods for the current Point2
          *
          * @public
          */
        this.point2 = function point2(obj) {
            var p = {
                    set      : this.set,
                    get      : this.get,
                    move     : this.move,
                    distance : this.distance,
                    distance2: this.distance2,
                    angleRad : this.angleRad,
                    angle    : this.angle
                };

            return obj != null ? gc.util.extend(obj, p)
                               : p;
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
    gc.Point2 = Point2;
    gc.util.defineConstant(gc.Point2, "VERSION", VERSION);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Size2
     * @public
     */
    var VERSION = "0.3.0";

    /**
     * Class representing {width, height} properties
     *
     * @param {Number} [width=0]  width
     * @param {Number} [height=0] height
     *
     * @requires gc.Util
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 0.3.0
     * @author @danikaze
     */
    var Size2 = function() {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance.
         *
         * @private
         */
        var _construct = function _construct(width, height) {
            if(arguments.length === 1) {
                this.width = arguments[0].width || 0;
                this.height = arguments[0].height || 0;

            } else {
                this.width = width || 0;
                this.height = height || 0;
            }
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Set the values of the Size2.

         * @param  {Number}   [width=0]  New value for the width
         * @param  {Number}   [height=0] New value for the height
         * @return {gc.Size2}            Self reference for allowing chaining
         *
         * @public
         */
        this.set = function set(width, height) {
            this.width = width || 0;
            this.height = height || 0;

            return this;
        };

        /**
         * Get the values of the Size2 as an object
         *
         * @return {Object} values as {width, height}
         *
         * @public
         */
        this.get = function get() {
            return {
                width : this.width,
                height: this.height
            };
        };

        /**
         * Add width, height to the Size
         *
         * @param  {Number}   w Width to add
         * @param  {Number}   h Height to add
         * @return {gc.Size2}   Self reference for allowing chaining
         *
         * @public
         */
        this.add = function add(w, h) {
            this.width += w;
            this.height += h;

            return this;
        };

        /**
         * Subtract width, height to the Size
         *
         * @param  {Number}   w Width to subtract
         * @param  {Number}   h Height to subtract
         * @return {gc.Size2}   Self reference for allowing chaining
         *
         * @public
         */
        this.sub = function sub(w, h) {
            this.width -= w;
            this.height -= h;

            return this;
        };

        /**
         * Scale the Size by two scalars as A*width, B*height
         *
         * @param  {Number}   w Width-factor
         * @param  {Number}   h Height-factor
         * @return {gc.Size2}   Self reference for allowing chaining
         *
         * @public
         */
        this.scale = function scale(w, h) {
            this.width *= w;
            this.height *= h;

            return this;
        };

        /**
         * Get the area of the rectangle
         *
         * @return {Number} Area of the rectangle (width*height)
         *
         * @public
         */
        this.getArea = function getArea() {
            return this.width * this.height;
        };

        /**
          * Get a list of the public methods for this size
          *
          * @param  {Object}   [obj] If an object is specified, it will be extended with the returned methods
          * @return {gc.Size2}       Public methods for the current Size2
          *
          * @public
          */
        this.size2 = function size2(obj) {
            var s = {
                    set    : this.set,
                    get    : this.get,
                    add    : this.add,
                    sub    : this.sub,
                    scale  : this.scale,
                    getArea: this.getArea
                };

            return obj != null ? gc.util.extend(obj, s)
                               : s;
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
    gc.Size2 = Size2;
    gc.util.defineConstant(gc.Size2, "VERSION", VERSION);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Rectangle
     * @public
     */
    var VERSION = "0.2.0";

    /**
     * Class representing Rectangles paralels to the x-axis and the y-axis
     *
     * @param {Number} [width=0]  width of the Rectangle
     * @param {Number} [height=0] height of the Rectangle
     * @param {Number} [x=0]      position-x of the Rectangle
     * @param {Number} [y=0]      position-y of the Rectangle
     *
     * @requires gc.Util
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 0.2.0
     * @author @danikaze
     */
    var Rectangle = function(width, height, x, y) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance.
         *
         * @private
         */
        var _construct = function _construct(width, height, x, y) {
            if(arguments.length === 1) {
                this.width = arguments[0].width || 0;
                this.height = arguments[0].height || 0;
                this.x = arguments[0].x || 0;
                this.y = arguments[0].y || 0;

            } else {
                this.width = width || 0;
                this.height = height || 0;
                this.x = x || 0;
                this.y = y || 0;
            }
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

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
            this.width = width || 0;
            this.height = height || 0;

            return this;
        };

        /**
         * Get the size of the Rectangle as an object
         *
         * @return {Object} Values as {width, height}
         *
         * @public
         */
        this.getSize = function getSize() {
            return {
                width : this.width,
                height: this.height
            };
        };

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
            this.x = x || 0;
            this.y = y || 0;

            return this;
        };

        /**
         * Get the position of the Rectangle as an object
         *
         * @return {Object} Values as {x, y}
         *
         * @public
         */
        this.getPosition = function getPosition() {
            return {
                x: this.x,
                y: this.y
            };
        };

        /**
         * Scale the Rectangle by two scalars as A*width, B*height
         *
         * @param  {Number}       w Width-factor
         * @param  {Number}       h Height-factor
         * @return {gc.Rectangle}   Self reference for allowing chaining
         *
         * @public
         */
        this.scale = function scale(w, h) {
            this.width *= w;
            this.height *= h;

            return this;
        };

        /**
         * Get the area of the rectangle
         *
         * @return {Number} Area of the rectangle (width*height)
         *
         * @public
         */
        this.getArea = function getArea() {
            return this.width * this.height;
        };

        /**
         * Move the Rectangle position adding the parameters to the current position
         *
         * @param  {Number}       x Amount to move the x-position
         * @param  {Number}       y Amount to move the y-position
         * @return {gc.Rectangle}   Self reference for allowing chaining
         *
         * @public
         */
        this.move = function move(x, y) {
            this.x += x;
            this.y += y;

            return this;
        };

        /**
         * Check if this Rectangle overlaps with other one.
         *
         * @param  {gc.Rectangle} rect An object with {width, height, x, y} properties
         * @return {boolean}           true if overlaps, false otherwise
         *
         * @public
         */
        this.intersects = function intersects(rect) {
            return !(this.x > rect.x + rect.width  ||
                     this.x + this.width < rect.x  ||
                     this.y > rect.y + rect.height ||
                     this.y + this.height < rect.y);
        };

        /**
         * Check if a point is inside the rectangle
         *
         * @param  {Number}  x x-position to check
         * @param  {Number}  y y-position to check
         * @return {boolean}   true if the point is inside the Rectangle, false otherwise
         *
         * @public
         */
        this.contains = function contains(x, y) {
            return x >= this.x && x <= this.x + this.width &&
                   y >= this.y && y <= this.y + this.height;
        };

        /**
         * Get a new rectangle resulting of the intersection between two rectangles
         *
         * @param  {gc.Rectangle} rect Rectangle intersecting with this one
         * @return {gc.Rectangle}      Rectangle definining the common area both of them, or null if doesn't intersect
         *
         * @public
         */
        this.getIntersection = function getIntersection(rect) {
            var x1 = Math.max(this.x, rect.x),
                x2 = Math.min(this.x + this.width, rect.x + rect.width),
                w = x2 - x1,
                y1,
                y2,
                h;

                if(w < 0) {
                    return null;
                }

                y1 = Math.max(this.y, rect.y);
                y2 = Math.min(this.y + this.height, rect.y + rect.height);
                h = y2-y1;

            return h > 0 ? new Rectangle(w, h, x1, y1)
                         : null;
        };

        /**
         * Get a new rectangle resulting of the intersection between two rectangles,
         * but with the relative positions to the intersected part of this.
         *
         * @param  {gc.Rectangle} rect Rectangle intersecting with this one
         * @return {gc.Rectangle}      Rectangle definining the common area both of them, or null if doesn't intersect
         * @public
         */
        this.getRelativeIntersection = function getRelativeIntersection(rect) {
            var x, y, w, h;

            if(this.x < rect.x) {
                x = rect.x - this.x;
                w = Math.min(this.width - x, rect.width);
            } else {
                x = 0;
                w = Math.min(this.width, rect.x + rect.width - this.x);
            }
            if(w < 0) {
                return null;
            }

            if(this.y < rect.y) {
                y = rect.y - this.y;
                h = Math.min(this.height - y, rect.height);
            } else {
                y = 0;
                h = Math.min(this.height, rect.y + rect.height - this.y);
            }

            return h > 0 ? new Rectangle(w, h, x, y)
                         : null;
        };

        /**
         * Get a list of the public methods for the Rectangle
         *
         * @param  {Object}       [obj] If an object is specified, it will be extended with the returned methods
         * @return {gc.Rectangle}       Public methods for the current Rectangle
         *
         * @public
         */
        this.rectangle = function rectangle(obj) {
            var r = {
                setSize        : this.setSize,
                getSize        : this.getSize,
                setPosition    : this.setPosition,
                getPosition    : this.getPosition,
                scale          : this.scale,
                getArea        : this.getArea,
                move           : this.move,
                overlaps       : this.overlaps,
                contains       : this.contains,
                getIntersection: this.getIntersection
            };

            return obj != null ? gc.util.extend(obj, r)
                               : r;
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
    gc.Rectangle = Rectangle;
    gc.util.defineConstant(gc.Rectangle, "VERSION", VERSION);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////


    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Easing
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Type of easing functions
     *
     * @type {Number}
     * @readOnly
     * @memberOf gc.Easing
     * @public
     */
    var EaseType = {
        LINEAR          : 1,

        IN_QUAD         : 2,
        OUT_QUAD        : 3,
        INOUT_QUAD      : 4,

        IN_CUBIC        : 5,
        OUT_CUBIC       : 6,
        INOUT_CUBIC     : 7,

        IN_QUART        : 8,
        OUT_QUART       : 9,
        INOUT_QUART     : 10,

        IN_QUINT        : 11,
        OUT_QUINT       : 12,
        INOUT_QUINT     : 13,

        IN_EXPO         : 14,
        OUT_EXPO        : 15,
        INOUT_EXPO      : 16,

        IN_CIRC         : 17,
        OUT_CIRC        : 18,
        INOUT_CIRC      : 19,

        IN_SINE         : 20,
        OUT_SINE        : 21,
        INOUT_SINE      : 22,

        IN_BACK         : 23,
        OUT_BACK        : 24,
        INOUT_BACK      : 25,

        IN_ELASTIC      : 26,
        OUT_ELASTIC     : 27,
        INOUT_ELASTIC   : 28,

        IN_BOUNCE       : 29,
        OUT_BOUNCE      : 30,
        INOUT_BOUNCE    : 31
    };


    ////////////////////////////
    // ESTATIC PUBLIC METHODS //
    ////////////////////////////

    /**
     * Linear interpolation.
     * Actually does no easing, but it's called easeLinear so all the function start the same way
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeLinear(t, b, c, d)
    {
        return c*t/d + b;
    }

    /**
     * Quadratic-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInQuad(t, b, c, d)
    {
        return c*(t/=d)*t + b;
    }

    /**
     * Quadratic-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutQuad(t, b, c, d)
    {
        return -c *(t/=d)*(t-2) + b;
    }

    /**
     * Quadratic-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutQuad(t, b, c, d)
    {
        return (t/=d/2) < 1 ? c/2*t*t + b
                            : -c/2 * ((--t)*(t-2) - 1) + b;
    }

    /**
     * Cubic-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInCubic(t, b, c, d)
    {
        return c*(t/=d)*t*t + b;
    }

    /**
     * Cubic-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutCubic(t, b, c, d)
    {
        return c*((t=t/d-1)*t*t + 1) + b;
    }

    /**
     * Cubic-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutCubic(t, b, c, d)
    {
        return (t/=d/2) < 1 ? c/2*t*t*t + b
                            : c/2*((t-=2)*t*t + 2) + b;
    }

    /**
     * Quart-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInQuart(t, b, c, d)
    {
        return c*(t/=d)*t*t*t + b;
    }

    /**
     * Quart-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutQuart(t, b, c, d)
    {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    }

    /**
     * Quart-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutQuart(t, b, c, d)
    {
        return (t/=d/2) < 1 ? c/2*t*t*t*t + b
                            : -c/2 * ((t-=2)*t*t*t - 2) + b;
    }

    /**
     * Quint-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInQuint(t, b, c, d)
    {
        return c*(t/=d)*t*t*t*t + b;
    }

    /**
     * Quint-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutQuint(t, b, c, d)
    {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    }

    /**
     * Quint-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutQuint(t, b, c, d)
    {
        return (t/=d/2) < 1 ? c/2*t*t*t*t*t + b
                            : c/2*((t-=2)*t*t*t*t + 2) + b;
    }

    /**
     * Expo-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInExpo(t, b, c, d)
    {
        return t === 0 ? b
                       : c * Math.pow(2, 10 * (t/d - 1)) + b;
    }

    /**
     * Expo-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutExpo(t, b, c, d)
    {
        return t === d ? b+c
                       : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }

    /**
     * Expo-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutExpo(t, b, c, d)
    {
        if(t === 0) {
            return b;
        }
        if(t === d) {
            return b+c;
        }

        return (t/=d/2) < 1 ? c/2 * Math.pow(2, 10 * (t - 1)) + b
                            : c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }

    /**
     * Circ-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInCirc(t, b, c, d)
    {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    }

    /**
     * Circ-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutCirc(t, b, c, d)
    {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    }

    /**
     * Circ-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutCirc(t, b, c, d)
    {
        return (t/=d/2) < 1 ? -c/2 * (Math.sqrt(1 - t*t) - 1) + b
                            : c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    }

    /**
     * Sine-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInSine(t, b, c, d)
    {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    }

    /**
     * Sine-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutSine(t, b, c, d)
    {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    }

    /**
     * Sine-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutSine(t, b, c, d)
    {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    }

    /**
     * Back-in interpolation
     *
     * @param  {Number} t          Current time
     * @param  {Float}  b          Begin value
     * @param  {Float}  c          Change value (end-begin)
     * @param  {Number} d          Duration of the total ease
     * @param  {Number} [s1.70158] Parameter of backing
     * @return {Float}             Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInBack(t, b, c, d, s)
    {
        if (s == null) {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    }

    /**
     * Back-out interpolation
     *
     * @param  {Number} t          Current time
     * @param  {Float}  b          Begin value
     * @param  {Float}  c          Change value (end-begin)
     * @param  {Number} d          Duration of the total ease
     * @param  {Number} [s1.70158] Parameter of backing
     * @return {Float}             Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutBack(t, b, c, d, s)
    {
        if (s == null) {
            s = 1.70158;
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }

    /**
     * Back-in-out interpolation
     *
     * @param  {Number} t          Current time
     * @param  {Float}  b          Begin value
     * @param  {Float}  c          Change value (end-begin)
     * @param  {Number} d          Duration of the total ease
     * @param  {Number} [s1.70158] Parameter of backing
     * @return {Float}             Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutBack(t, b, c, d, s)
    {
        if (s == null) {
            s = 1.70158;
        }
        return (t/=d/2) < 1 ? c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b
                            : c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }

    /**
     * Elastic-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInElastic(t, b, c, d)
    {
        var s=1.70158, p=0, a=c;

        if( t===0 ) {
            return b;
        }
        if((t/=d) === 1) {
            return b+c;
        }

        if(!p) {
            p=d*0.3;
        }
        if(a < Math.abs(c)) {
            a=c;
            s=p/4;

        } else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }

        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    }

    /**
     * Elastic-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutElastic(t, b, c, d)
    {
        var s=1.70158, p=0, a=c;

        if(t === 0) {
            return b;
        }
        if((t/=d) === 1) {
            return b+c;
        }
        if(!p) {
            p=d*0.3;
        }
        if(a < Math.abs(c)) {
            a=c;
            s=p/4;

        } else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }

        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    }

    /**
     * Elastic-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutElastic(t, b, c, d)
    {
        var s=1.70158, p=0, a=c;

        if (t===0) {
            return b;
        }
        if ((t/=d/2)===2) {
            return b+c;
        }
        if (!p) {
            p=d*(0.3*1.5);
        }
        if (a < Math.abs(c)) {
            a=c;
            s=p/4;

        } else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }

        return (t < 1) ? -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b
                       : a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    }

    /**
     * Bounce-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInBounce(t, b, c, d)
    {
        return c - easeOutBounce(d-t, 0, c, d) + b;
    }

    /**
     * Bounce-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutBounce(t, b, c, d)
    {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;

        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;

        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;

        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
        }
    }

    /**
     * Bounce-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutBounce(t, b, c, d)
    {
        return (t < d/2) ? easeInBounce(t*2, 0, c, d) * 0.5 + b
                         : easeOutBounce(t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }

    /**
     * Interpolate a number between an initial value and an end value.
     * Easing function based on Robert Penner and Timothee Groleau's code.
     * {@link http://robertpenner.com/easing/easing_demo.html}
     * {@link http://timotheegroleau.com/Flash/experiments/easing_function_generator.htm}
     *
     * @param {Float}              [begin=0]               Initial value
     * @param {Float}              [end=1.0]               End value
     * @param {Number}             [duration=1000]         Required time (in ms.) to reach {@link end} starting from {@link start}
     * @param {gc.Easing.EaseType} [ease=gc.Easing.LINEAR] Type of Easing function to use
     * @param {Number}             [delay=0]               Time before start, in ms.
     *
     * @requires gc.Util
     * @requires gc.Deferred
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Easing = function(begin, end, duration, ease, delay) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _deferred,
            _current    = 0,
            _begin      = 0,
            _end        = 1,
            _change     = 0,
            _duration   = 100,
            _elapsed    = 0,
            _ease       = EaseType.LINEAR,
            _delay      = 0,
            _updateFunc = easeLinear;

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(begin, end, duration, ease, delay) {
            if(typeof begin !== "undefined") {
                _begin = begin;
            }
            if(typeof end !== "undefined") {
                _end = end;
            }
            if(typeof duration !== "undefined") {
                _duration = duration;
            }
            if(typeof ease !== "undefined") {
                this.setEaseType(ease);
            }
            if(typeof delay !== "undefined") {
                _delay = delay;
            }

            _change  = _end - _begin;
            _current = _begin;
            _elapsed = 0;

            _deferred = new gc.Deferred();
            _deferred.promise(this);

        };


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Update the interpolation adding a delta to the elapsed time and calculating the new value.
         * If the elapsed time reaches the Easing duration, the promise will be resolved to the end value.
         * If not, it will be updated with the current value if there's any change.
         *
         * @param  {Number}    delta Time elapsed
         * @return {gc.Easing}       Self reference for allowing chaining
         *
         * @public
         */
        this.update = function update(delta) {
            _elapsed += delta;

            if(_elapsed < _duration + _delay) {
                if(_elapsed >= _delay) {
                    _current = _updateFunc(_elapsed - _delay, _begin, _change, _duration);
                    _deferred.notify(_current);
                } else {
                    _current = _begin;
                }
            }
            else {
                _current = _end;
                _deferred.resolve(_current);
            }

            return this;
        };

        /**
         * Set the interpolation values to the initial ones.
         * If there were a delay, it will applied again
         *
         * @return {gc.Easing}    Self reference for allowing chaining
         *
         * @public
         */
        this.begin = function begin() {
            _current = _begin;
            _elapsed = 0;
            _deferred.reset();

            return this;
        };

        /**
         * Set the interpolation values to the end ones.
         * It will resolve the promise.
         *
         * @return {gc.Easing}    Self reference for allowing chaining
         *
         * @public
         */
        this.end = function end() {
            _current = _end;
            _elapsed = _duration + _delay + 0.1;
            _deferred.resolve(_current);

            return this;
        };

        /**
         * Reverse the interpolator. The time is preserved but the value will probably change
         * unless the easing type is {@link gc.Easing.EaseType.LINEAR}
         * Frequently used along with {@link gc.Easing#reverse}
         *
         * @return {gc.Easing}    Self reference for allowing chaining
         *
         * @public
         */
        this.reverse = function reverse() {
            var tmp = _begin;
            _begin = _end;
            _end = tmp;
            _change = _end - _begin;
            _deferred.reset();

            return this;
        };

        this.getBegin = function getBegin() {
            return _begin;
        };

        this.getEnd = function getEnd() {
            return _end;
        };

        /**
         * Set the initial and ending values, and reset the interpolation
         *
         * @param  {Float}     begin new starting value
         * @param  {Float}     end   new ending value
         * @return {gc.Easing}       Self reference for allowing chaining
         *
         * @public
         */
        this.setValue = function setValue(begin, end) {
            if(typeof begin !== "undefined") {
                _begin = begin;
            }
            if(typeof end !== "undefined") {
                _end = end;
            }

            _change = end - begin;
            _deferred.reset();

            return this;
        };

        /**
         * Get the current value based on the Easing status
         *
         * @return {Float} Current value
         *
         * @public
         */
        this.getValue = function getValue() {
            return _current;
        };

        /**
         * Set the elapsed time of the interpolator.
         * The current value will updated via {@link gc.Easing#update}. This means that the
         * promise will be affected too, being updated or resolved if needed.
         *
         * @param  {Number}    time New elapsed time
         * @return {gc.Easing}      Self reference for allowing chaining
         *
         * @public
         */
        this.setElapsed = function setElapsed(time) {
            _elapsed = time;
            this.update(0);
        };

        /**
         * Get the elapsed time (without incluying the delay)
         *
         * @return {Number} Elapsed time in ms.
         *
         * @public
         */
        this.getElapsed = function getElapsed() {
            return _elapsed;
        };

        /**
         * Set the duration of the object.
         * The current value will not change. That means that if the elapsed time was already in the 50%,
         * it will stay in the 50% (after the delay if any)
         *
         * @param {Number} time New duration in ms.
         * @return {gc.Easing}  Self reference for allowing chaining
         *
         * @public
         */
        this.setDuration = function setDuration(time) {
            _elapsed = _delay + (_elapsed - _delay)/_duration * time;
            _duration = _duration;

            return this;
        };

        /**
         * Get the total duration (without the delay) of the Easing
         *
         * @return {Number} Duration in ms. without including the delay time
         *
         * @public
         */
        this.getDuration = function getDuration() {
            return _duration;
        };

        /**
         * Set the new time to wait before starting the interpolation.
         * If it has already started, the new _delay will be set but it will have no impact in the current values
         *
         * @param  {Number} time New delay in ms.
         *
         * @public
         */
        this.setDelay = function setDelay(time) {
            if(_elapsed > _delay) {
                _elapsed += time - _delay;
            }

            _delay = time;
        };

        /**
         * Get the current time to wait before starting the interpolation
         *
         * @return {Number} Delay time in ms.
         *
         * @public
         */
        this.getDelay = function getDelay() {
            return _delay;
        };

        /**
         * Set the ease function for the interpolation.
         * The current value will NOT change until the next {@link gc.Easing#update}
         *
         * @param  {gc.Easing.EaseType} ease New type of easing
         * @return {gc.Easing}               Self reference for allowing chaining
         *
         * @public
         */
        this.setEaseType = function setEaseType(ease) {
            _ease = ease;

            switch(_ease) {
                // linear
                case EaseType.LINEAR:
                    _updateFunc = easeLinear;
                    break;

                // quad
                case EaseType.IN_QUAD:
                    _updateFunc = easeInQuad;
                    break;

                case EaseType.OUT_QUAD:
                    _updateFunc = easeOutQuad;
                    break;

                case EaseType.INOUT_QUAD:
                    _updateFunc = easeInOutQuad;
                    break;

                // cubic
                case EaseType.IN_CUBIC:
                    _updateFunc = easeInCubic;
                    break;

                case EaseType.OUT_CUBIC:
                    _updateFunc = easeOutCubic;
                    break;

                case EaseType.INOUT_CUBIC:
                    _updateFunc = easeInOutCubic;
                    break;

                // quart
                case EaseType.IN_QUART:
                    _updateFunc = easeInQuart;
                    break;

                case EaseType.OUT_QUART:
                    _updateFunc = easeOutQuart;
                    break;

                case EaseType.INOUT_QUART:
                    _updateFunc = easeInOutQuart;
                    break;

                // quint
                case EaseType.IN_QUINT:
                    _updateFunc = easeInQuint;
                    break;

                case EaseType.OUT_QUINT:
                    _updateFunc = easeOutQuint;
                    break;

                case EaseType.INOUT_QUINT:
                    _updateFunc = easeInOutQuint;
                    break;

                // expo
                case EaseType.IN_EXPO:
                    _updateFunc = easeInExpo;
                    break;

                case EaseType.OUT_EXPO:
                    _updateFunc = easeOutExpo;
                    break;

                case EaseType.INOUT_EXPO:
                    _updateFunc = easeInOutExpo;
                    break;

                // circ
                case EaseType.IN_CIRC:
                    _updateFunc = easeInCirc;
                    break;

                case EaseType.OUT_CIRC:
                    _updateFunc = easeOutCirc;
                    break;

                case EaseType.INOUT_CIRC:
                    _updateFunc = easeInOutCirc;
                    break;

                // sine
                case EaseType.IN_SINE:
                    _updateFunc = easeInSine;
                    break;

                case EaseType.OUT_SINE:
                    _updateFunc = easeOutSine;
                    break;

                case EaseType.INOUT_SINE:
                    _updateFunc = easeInOutSine;
                    break;

                // back
                case EaseType.IN_BACK:
                    _updateFunc = easeInBack;
                    break;

                case EaseType.OUT_BACK:
                    _updateFunc = easeOutBack;
                    break;

                case EaseType.INOUT_BACK:
                    _updateFunc = easeInOutBack;
                    break;

                // elastic
                case EaseType.IN_ELASTIC:
                    _updateFunc = easeInElastic;
                    break;

                case EaseType.OUT_ELASTIC:
                    _updateFunc = easeOutElastic;
                    break;

                case EaseType.INOUT_ELASTIC:
                    _updateFunc = easeInOutElastic;
                    break;

                // bounce
                case EaseType.IN_BOUNCE:
                    _updateFunc = easeInBounce;
                    break;

                case EaseType.OUT_BOUNCE:
                    _updateFunc = easeOutBounce;
                    break;

                case EaseType.INOUT_BOUNCE:
                    _updateFunc = easeInOutBounce;
                    break;

                default:
                    throw new gc.exception.WrongSignatureException("ease is not a valid EaseType value");

            }
            return this;
        };

        /**
         * Get the current ease function type
         *
         * @return {gc.Easing.EaseType} Current Ease function type
         *
         * @public
         */
        this.getEaseType = function getEaseType() {
            return _ease;
        };

        /**
         * Check if the easing has finished or not
         *
         * @return {boolean} true if has finished or false if not
         *
         * @public
         */
        this.hasFinished = function hasFinished() {
            return _elapsed >= _duration + _delay;
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
    gc.Easing = Easing;
    gc.util.defineConstant(gc.Easing, "VERSION", VERSION);
    gc.util.defineConstant(gc.Easing, "EaseType", EaseType);
    gc.Easing.easeLinear        = easeLinear;
    gc.Easing.easeInQuad        = easeInQuad;
    gc.Easing.easeOutQuad       = easeOutQuad;
    gc.Easing.easeInOutQuad     = easeInOutQuad;
    gc.Easing.easeInCubic       = easeInCubic;
    gc.Easing.easeOutCubic      = easeOutCubic;
    gc.Easing.easeInOutCubic    = easeInOutCubic;
    gc.Easing.easeInQuart       = easeInQuart;
    gc.Easing.easeOutQuart      = easeOutQuart;
    gc.Easing.easeInOutQuart    = easeInOutQuart;
    gc.Easing.easeInQuint       = easeInQuint;
    gc.Easing.easeOutQuint      = easeOutQuint;
    gc.Easing.easeInOutQuint    = easeInOutQuint;
    gc.Easing.easeInExpo        = easeInExpo;
    gc.Easing.easeOutExpo       = easeOutExpo;
    gc.Easing.easeInOutExpo     = easeInOutExpo;
    gc.Easing.easeInCirc        = easeInCirc;
    gc.Easing.easeOutCirc       = easeOutCirc;
    gc.Easing.easeInOutCirc     = easeInOutCirc;
    gc.Easing.easeInSine        = easeInSine;
    gc.Easing.easeOutSine       = easeOutSine;
    gc.Easing.easeInOutSine     = easeInOutSine;
    gc.Easing.easeInBack        = easeInBack;
    gc.Easing.easeOutBack       = easeOutBack;
    gc.Easing.easeInOutBack     = easeInOutBack;
    gc.Easing.easeInElastic     = easeInElastic;
    gc.Easing.easeOutElastic    = easeOutElastic;
    gc.Easing.easeInOutElastic  = easeInOutElastic;
    gc.Easing.easeInBounce      = easeInBounce;
    gc.Easing.easeOutBounce     = easeOutBounce;
    gc.Easing.easeInOutBounce   = easeInOutBounce;

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.TextureRegion
     * @public
     */
    var VERSION = "0.2.0";

    /**
     * Description of the class
     *
     * @param {Object}  texture                 Source of the image
     * @param {Integer} [offsetX=0]             X-position of the start of the region
     * @param {Integer} [offsetY=0]             Y-position of the start of the region
     * @param {Integer} [width=texture.width]   Width of the start of the region
     * @param {Integer} [height=texture.height] Height of the start of the region
     * @param {Integer} [centerX=0]             X-position of the center of the region (relative to offsetX)
     * @param {Integer} [centerY=0]             Y-position of the center of the region (relative to offsetY)
     *
     * @requires gc.Util
     *
     * @constructor
     * @memberOf gc
     * @version 0.2.0
     * @author @danikaze
     */
    var TextureRegion = function(texture, offsetX, offsetY, width, height, centerX, centerY) {

        //////////////////////////
        // PUBLIC INSTANCE VARS //
        //////////////////////////

        /** Texture source of the image. */
        this.texture = texture;
        /** x-position of the start of the region. */
        this.offsetX = offsetX || 0;
        /** y-position of the start of the region. */
        this.offsetY = offsetY || 0;
        /** Width of the region */
        this.width = width || texture.width;
        /** Height of the region */
        this.height = height || texture.height;
        /** x-position of the center of the region (relative to offsetX) */
        this.centerX = centerX || 0;
        /** y-position of the center of the region (relative to offsetY) */
        this.centerY = centerY || 0;

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Draw the TextureRegion into a CanvasRenderingContext2D
         *
         * @param  {CanvasRenderingContext2D} ctx Canvas2D context where to draw the TextureRegion
         *
         * @public
         */
        this.draw = function(ctx) {
            switch(arguments.length) {
                case 3: // draw(ctx, x, y)
                    ctx.drawImage(
                        this.texture,
                        this.offsetX,
                        this.offsetY,
                        this.width,
                        this.height,
                        arguments[1] - this.centerX,
                        arguments[2] - this.centerY,
                        this.width,
                        this.height
                    );
                    break;

                case 5: // draw(ctx, x, y, w, h)
                    ctx.drawImage(
                        this.texture,
                        this.offsetX,
                        this.offsetY,
                        this.width,
                        this.height,
                        arguments[1] - this.centerX * (arguments[3]/this.width),
                        arguments[2] - this.centerY * (arguments[4]/this.height),
                        arguments[3],
                        arguments[4]
                    );
                    break;

                case 9: // draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh)
                    ctx.drawImage(
                        this.texture,
                        this.offsetX + arguments[1],    // sx
                        this.offsetY + arguments[2],    // sy
                        Math.min(arguments[3], this.width - arguments[1]),  // sw
                        Math.min(arguments[4], this.height - arguments[2]), // sh
                        arguments[5] - this.centerX * (arguments[7]/this.width),    // dx
                        arguments[6] - this.centerY * (arguments[8]/this.height),   // dy
                        arguments[7],   // dw
                        arguments[8]    // dh
                    );
                    break;

                default:
                    throw "Incorrect number of parameters";
            }
        };

    };


    ///////////////////////////////
    // Export the public objects //
    ///////////////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.TextureRegion = TextureRegion;
    gc.util.defineConstant(gc.TextureRegion, "VERSION", VERSION);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    /**
     * Enum: Direction of the animation, for internal control
     *
     * @enum {Number}
     * @private
     */
    var PlayDirection = {
            FORWARDS: 0,
            BACKWARDS: 1,
            RANDOM: 2
        };

    var _validator = new gc.Validator();

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Animation
     * @public
     */
    var VERSION = '1.0.0';

    /**
     * Enum: Possible types of Animation
     *
     * @requires gc.Util
     *
     * @enum {Number}
     * @readOnly
     * @memberOf gc.Animation
     * @public
     */
    var PlayMode = {
            NORMAL: 0,
            REVERSED: 1,
            PINGPONG: 2,
            LOOP: 3,
            LOOP_REVERSED: 4,
            LOOP_PINGPONG: 5,
            LOOP_RANDOM: 6,
        };


    /**
     * Animation class to use with canvas
     *
     * @param {Object}             image                                      Image object accepted by {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D|CanvasRenderingContext2D#drawImage}
     * @param {Object}             options                                    options to customize the animation
     * @param {Animation.PlayMode} [options.playMode=Animation.PlayMode.LOOP] Behavior of the frames of the Animation
     * @param {Number}             [options.offsetX=0]                        x-position where the animation graphics start relative to the {@link image}
     * @param {Number}             [options.offsetY=0]                        y-position where the animation graphics start relative to the {@link image}
     * @param {Number}             [options.marginX=0]                        horizontal space between each frame
     * @param {Number}             [options.marginY=0]                        vertical space between each frame
     * @param {Number}             [options.nFrames=0]                        number of frames to read horizontally
     *                                                                         if less or equal than zero, it will read till the end of the image
     *                                                                         if the number of frames is more than the number that can fit in the image horizontally, it will continue reading the next line
     * @param {Number}             [options.frameWidth=0]                     width of each frame (for all of them)
     * @param {Number}             [options.frameHeight=0]                    height of each frame (for all of them)
     * @param {Number}             [options.frameCenterX=0] x-position of the center of each frame (for all of them)
     * @param {Number}             [options.frameCenterY=0]                   y-position of the center of each frame (for all of them)
     * @param {Number}             [options.frameTime=0]                      duration of the frames in milliseconds (for all of them)
     * @params {Object[]}          [options.frames=undefined]                 If this option is specified options.nFrames will be overriden with options.frames.length,
     *                                                                         and the following properties will override the global ones
     * @params {Number}            [options.frames[].width]                   width for the specified frame
     * @params {Number}            [options.frames[].height]                  height for the specified frame
     * @params {Number}            [options.frames[].x]                       x-position of the top-left corner of the specified frame
     * @params {Number}            [options.frames[].y]                       y-position of the top-left corner of the specified frame
     * @params {Number}            [options.frames[].centerX]                 x-position of the center of the specified frame
     * @params {Number}            [options.frames[].centerY]                 y-position of the center of the specified frame
     * @params {Number}            [options.frames[].time]                    duration of the specified frame
     * @param {Function}           [options.onFinish] callback                to execute when the animation finishes (only on NORMAL, REVERSED, PINGPONG)
     * @param {Function}           [options.onChangeDirection]                callback to execute when the animation changes the direction of play (only on PINGPONG and LOOP_PINGPONG)
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
    var Animation = function(image, options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _texture,               // image source for the TextureRegion of the frames
            _frames,                // ordered list of frames as [{ src, time }]
            _nFrames,               // cached number of frames (_frameslength)
            _totalTime,             // cached duration of the full animation in millisecs.
            _currentFrameIndex,
            _currentFrame,
            _elapsedFrameTime,
            _nextFrame,
            _playMode,
            _playDirection,
            _playing,
            _finished,
            _onFinish,
            _onChangeDirection,
            _rng;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor of the object, called when a new instance is created.
         *
         * @private
         */
        var _construct = function _construct(image, options) {
            var defaultOptions = {
                    // global animation options
                    playMode: PlayMode.LOOP,
                    // global image options
                    offsetX: 0,
                    offsetY: 0,
                    marginX: 0,
                    marginY: 0,
                    nFrames: 0,
                    // global frame options
                    frameWidth: 0,
                    frameHeight: 0,
                    frameCenterX: 0,
                    frameCenterY: 0,
                    frameTime: 0,
                    // specific frame options (if specified the global ones will be replaced)
                    frames: undefined,  // [{ width, height, offsetX, offsetY, time }]
                    onFinish: undefined,
                    onChangeDirection: undefined
                },
                opt = gc.util.extend(defaultOptions, options),
                i, n;

            // data validation :start
            _validator.reset()
                      .enumerated('playMode', opt.playMode, { enumerated: PlayMode })
                      .intPositive('offsetX', opt.offsetX)
                      .intPositive('offsetY', opt.offsetY)
                      .intPositive('marginX', opt.marginX)
                      .intPositive('marginY', opt.marginY)
                      .int('nFrames', opt.nFrames)
                      .intPositive('frameWidth', opt.frameWidth)
                      .intPositive('frameHeight', opt.frameHeight)
                      .int('frameCenterX', opt.frameCenterX)
                      .int('frameCenterY', opt.frameCenterY)
                      .intPositive('frameTime', opt.frameTime)
                      .animationFrameArray('frames', opt.frames, { optional: true })
                      .callback('onFinish', opt.onFinish, { optional: true })
                      .callback('onChangeDirection', opt.onChangeDirection, { optional: true });

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }
            opt = _validator.valid();
            // data validation :end

            _loadFrames(image, opt);
            this.setPlayMode(opt.playMode, true);

            if(opt.onFinish) {
                if(!gc.util.isArray(opt.onFinish)) {
                    opt.onFinish = [opt.onFinish];
                }
                _onFinish = opt.onFinish;

            } else {
                _onFinish = [];
            }

            if(opt.onChangeDirection) {
                if(!gc.util.isArray(opt.onChangeDirection)) {
                    opt.onChangeDirection = [opt.onChangeDirection];
                }
                _onChangeDirection = opt.onChangeDirection;

            } else {
                _onChangeDirection = [];
            }
        };

        /**
         * Load the frames of the Animation from an image source
         *
         * @param {Object} texture Image accepted by {@link CanvasRenderingContext2D#drawImage}.
         * @param {Object} options Options of the Animation as specified in the {@link constructor}.
         *
         * @private
         */
        var _loadFrames = function _loadFrames(image, options) {
            var i,
                x = options.offsetX,
                y = options.offsetY,
                frame,
                opt;

            _texture = image;
            _totalTime = 0;
            _frames = [];

            if(!options.frames) {
                _nFrames = options.nFrames <= 0 ? Math.floor(_texture.width/options.frameWidth)
                                                : options.nFrames;

                for(i=0; i<_nFrames; i++) {
                    frame = {
                        src: new gc.TextureRegion(_texture, x, y, options.frameWidth, options.frameHeight),
                        time: options.frameTime
                    };
                    frame.src.centerX = options.frameCenterX;
                    frame.src.centerY = options.frameCenterY;

                    _frames.push(frame);
                    _totalTime += frame.time;

                    if(x + options.frameWidth >= _texture.width) {
                        x = options.offsetX;
                        y += options.frameHeight + options.marginY;

                    } else {
                        x += options.frameWidth + options.marginX;
                    }
                }

            } else {
                _nFrames = options.frames.length;

                for(i=0; i<_nFrames; i++) {
                    frame = {
                        src: new gc.TextureRegion(_texture,
                                                  options.frames[i].x ? options.frames[i].x : x,
                                                  options.frames[i].y ? options.frames[i].y : y,
                                                  options.frames[i].width ? options.frames[i].width : options.framesWidth,
                                                  options.frames[i].height ? options.frames[i].height : options.framesHeight),
                        time: options.frames[i].time ? options.frames[i].time : options.frameTime
                    };
                    frame.src.centerX = options.frames[i].centerX ? options.frames[i].centerX : options.frameCenterX;
                    frame.src.centerY = options.frames[i].centerY ? options.frames[i].centerY : options.frameCenterY;

                    _frames.push(frame);
                    _totalTime += frame.time;

                    if(x + options.frameWidth >= _texture.width) {
                        x = options.offsetX;
                        y += options.frameHeight + options.marginY;

                    } else {
                        x += options.frameWidth + options.marginX;
                    }
                }
            }
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
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.NORMAL
         *
         * @private
         */
        var _updateNormal = function _updateNormal() {
            if(_currentFrameIndex === _nFrames - 1) {
                _finished = true;
                _playing = false;
                _triggerCallback(_onFinish);

            } else {
                _currentFrameIndex++;
            }
        };

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.REVERSED
         *
         * @private
         */
        var _updateReversed = function _updateReversed() {
            if(_currentFrameIndex === 0) {
                _finished = true;
                _playing = false;
                _triggerCallback(_onFinish);

            } else {
                _currentFrameIndex--;
            }
        };

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.PINGPONG
         *
         * @private
         */
        var _updatePingpong = function _updatePingpong() {
            if(_playDirection === PlayDirection.FORWARDS) {
                if(_currentFrameIndex === _nFrames - 1 && _nFrames > 0) {
                    _playDirection = PlayDirection.BACKWARDS;
                    _currentFrameIndex--;
                    _triggerCallback(_onChangeDirection);
                } else {
                    _currentFrameIndex++;
                }

            } else if(_currentFrameIndex === 0) {
                _finished = true;
                _playing = false;
                _triggerCallback(_onFinish);

            } else {
                _currentFrameIndex--;
            }
        };

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.LOOP
         *
         * @private
         */
        var _updateLoop = function _updateLoop() {
            _currentFrameIndex = (_currentFrameIndex + 1) % _nFrames;
        };

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.LOOP_PINGPONG
         *
         * @private
         */
        var _updateLoopPingpong = function _updateLoopPingpong() {
            if(_playDirection === PlayDirection.FORWARDS) {
                if(_currentFrameIndex === _nFrames - 1 && _nFrames > 0) {
                    _playDirection = PlayDirection.BACKWARDS;
                    _currentFrameIndex--;
                    _triggerCallback(_onChangeDirection);
                } else {
                    _currentFrameIndex++;
                }

            } else if(_currentFrameIndex === 0 && _nFrames > 0) {
                    _playDirection = PlayDirection.FORWARDS;
                    _currentFrameIndex++;
                    _triggerCallback(_onChangeDirection);

            } else {
                _currentFrameIndex--;
            }
        };

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.LOOP_REVERSED
         *
         * @private
         */
        var _updateLoopReversed = function _updateLoopReversed() {
            if(_currentFrameIndex === 0) {
                _currentFrameIndex = _nFrames - 1;
            } else {
                _currentFrameIndex--;
            }
        };

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.RANDOM
         *
         * @private
         */
        var _updateLoopRandom = function _updateLoopRandom() {
            _currentFrameIndex = _rng.nextInt(_nFrames);
        };


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Set the type of the Animation
         *
         * @param {gc.Animation.PlayMode} playMode Type of the animation
         * @param {boolean}               reset    If true, it will reset the animation.
         *                                         If false, it will continue from the current state
         * @return {gc/Animation}                  Self object to allow chaining
         *
         * @public
         */
        this.setPlayMode = function setPlayMode(playMode , reset) {
            _validator.reset()
                      .enumerated('playMode', playMode, { enumerated: PlayMode });

            if(_validator.errors()) {
                throw new gc.exception.WrongSignatureException("playMode is not a valid gc.Animation.PlayMode");
            }

            _playMode = playMode;

            if(reset) {
                _finished = false;
                _playing = true;
                _elapsedFrameTime = 0;
            }

            if(playMode !== PlayMode.LOOP_RANDOM) {
                _rng = undefined;
            }

            switch(playMode) {
                case PlayMode.NORMAL:
                    _nextFrame = _updateNormal;
                    if(reset) {
                        _currentFrameIndex = 0;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.FORWARDS;
                    }
                    break;

                case PlayMode.REVERSED:
                    _nextFrame = _updateReversed;
                    if(reset) {
                        _currentFrameIndex = _frames.length - 1;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.BACKWARDS;
                    }
                    break;

                case PlayMode.PINGPONG:
                    _nextFrame = _updatePingpong;
                    if(reset) {
                        _currentFrameIndex = 0;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.FORWARDS;
                    }
                    break;

                case PlayMode.LOOP:
                    _nextFrame = _updateLoop;
                    if(reset) {
                        _currentFrameIndex = 0;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.FORWARDS;
                    }
                    break;

                case PlayMode.LOOP_REVERSED:
                    _nextFrame = _updateLoopReversed;
                    if(reset) {
                        _currentFrameIndex = _frames.length - 1;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.BACKWARDS;
                    }
                    break;

                case PlayMode.LOOP_PINGPONG:
                    _nextFrame = _updateLoopPingpong;
                    if(reset) {
                        _currentFrameIndex = 0;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.FORWARDS;
                    }
                    break;

                case PlayMode.LOOP_RANDOM:
                    _rng = new gc.RNG();
                    _nextFrame = _updateLoopRandom;
                    if(reset) {
                        _currentFrameIndex = _rng.nextInt(_nFrames);
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.RANDOM;
                    }
                    break;
            }

            return this;
        };

        /**
         * Updates the Animation by the specified time
         *
         * @param {Number}         delta Number of milliseconds to update the Animation
         * @return {gc.Animation}        Self object to allow chaining
         */
        this.update = function update(delta) {
            if(_playing) {
                _elapsedFrameTime += delta;

                while(_elapsedFrameTime > _currentFrame.time) {
                    _elapsedFrameTime -= _currentFrame.time;
                    _nextFrame();
                }

                _currentFrame = _frames[_currentFrameIndex];
            }

            return this;
        };

        /**
         * Get the gc.TextureRegion for the current frame
         *
         * @return {gc.TextureRegion} TextureRegion object for the current frame
         */
        this.getCurrentFrame = function getCurrentFrame() {
            return _currentFrame.src;
        };

        /**
         * Get the gc.TextureRegion for the specified frame
         *
         * @param  {Integer}                   n Number of the frame
         * @return {gc.TextureRegion}            TextureRegion object for the specified frame
         *
         * @public
         */
        this.getFrame = function getFrame(n) {
            if(n >= 0 && n < _nFrames) {
                return _frames[n];
            }

            throw new gc.exception.IndexOutOfBounds();
        };

        /**
         * Get if the animation is playing currently or not
         *
         * @return {Boolean} true if it's playing, false if not
         *
         * @public
         */
        this.isPlaying = function isPlaying() {
            return _playing;
        };

        /**
         * Get if the animation is completed
         *
         * @return {Boolean} true if it's finished (stopped and won't continue until is reset) , false if not
         *
         * @public
         */
        this.hasFinished = function hasFinished() {
            return _finished;
        };

        /**
         * Get the total number of frames of the Animation
         *
         * @return {integer} number of frames of the Animation
         *
         * @public
         */
        this.getTotalFrames = function getTotalFrames() {
            return _nFrames;
        };

        /**
         * Get the sum of the duration of the Animation's frames.
         * If the Animation is LOOPED, PINGPONG... the sum of the frames is only taking into account once
         *
         * @return {Number} Duration of the animation in milliseconds.
         *
         * @public
         */
        this.getTotalTime = function getTotalTime() {
            return _totalTime;
        };

        /**
         * Add a callback to execute when the Animation is finished
         * This happens in the NORMAL, REVERSED and PINGPONG Animation.PlayMode s
         *
         * @param {Function}      callback Function to execute
         * @return {gc.Animation}          Self object to allow chaining
         *
         * @public
         */
        this.onFinish = function finish(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _onFinish.push(callback);

            return this;
        };

        /**
         * Add a callback to execute when the Animation changes direction.
         * This happens in the Animation.PlayMode.PINGPONG and Animation.PlayMode.LOOP_PINGPONG animations
         *
         * @param  {Function}      callback Function to execute
         * @return {gc.Animation}           Self object to allow chaining
         *
         * @public
         */
        this.onChangeDirection = function changeDirection(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _onChangeDirection.push(callback);

            return this;
        };

        // call the constructor
        _construct.apply(this, arguments);
    };

    ///////////////////////////////
    // Export the public objects //
    ///////////////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.Animation = Animation;
    gc.util.defineConstant(gc.Animation, "VERSION", VERSION);
    gc.util.defineConstant(gc.Animation, "PlayMode", PlayMode);

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator(),
        _escapeChar = "\\",
        _wordSplitRegEx = "[ \t]",
        _escapedActions = {},
        _escapeRegEx,
        _textMetricsCache = {},
        _defaultOptions = {
            align       : gc.Align.TOP_LEFT,
            marginTop   : 0,
            marginRight : 0,
            marginBottom: 0,
            marginLeft  : 0,
            width       : 0,
            height      : 0,
            limit       : -1,
            delay       : 0,
            speed       : 0,
            pauseOn     : ",、.。",
            pauseLength : 1000,
            style       : {
                font        : "10px sans-serif",
                fill        : true,
                fillStyle   : "#000000",
                stroke      : false,
                strokeStyle : "#000000",
                lineWidth   : 1,
                lineMargin  : 0
            },
            _getFullTextSize: false
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
    var VERSION = "0.3.0";

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
     * Get the full size of a formatted text without having to render it
     *
     * @param  {String}  text                   Formatted text to measure
     * @param  {Object}  [options]              {@see gc.Text}
     * @param  {boolean} [includeMargins=false] If true, the returned size will include the margins specified in the options
     * @return {Object}                         Object as {width, height}
     *
     * @public
     * @memberOf gc.Text
     * @todo Make this function actually static, without having to create a new text instance
     */
    function getFullTextSize(text, options, includeMargins) {
        var txt = new gc.Text(text, gc.util.extend({}, options, { width:0, height: 0, _getFullTextSize: true }));

        return txt.measureText(includeMargins);
    }

    /**
     * Class to write formatted text and cache it in Images
     *
     * @param {String}  text                          Formatted text to draw
     * @param {Object}   [options]                    Options to define the Text behavior
     * @param {gc.Align} [align=gc.Align.TOP_LEFT]    Position of the text inside the canvas
     * @param {Integer}  [options.marginTop=0]        Margin between the text and the top of the limits
     * @param {Integer}  [options.marginRight=0]      Margin between the text and the right of the limits
     * @param {Integer}  [options.marginBottom=0]     Margin between the text and the bottom of the limits
     * @param {Integer}  [options.marginLeft=0]       Margin between the text and the left of the limits
     * @param {Integer}  [options.width=0]            If specified, the text will break lines to this width. This width does NOT includes margins.
     * @param {Integer}  [options.height=0]           If specified, the text will be limited to this height. This height does NOT includes margins.
     * @param {Integer}  [options.limit=-1]           Number of printable characters to draw (<0 means no limit)
     * @param {Integer}  [options.delay=0]            Delay before start drawing
     * @param {Integer}  [options.speed=0]            Speed to draw the text or 0 to draw it all at once.
     * @param {String}   [options.pauseOn=",.、。"]     Make a pause when find one of this characters
     * @param {Integer}  [options.pauseLength=1000]   Length of the pause (in ms.) done after drawing a character in {@link options.pauseOn}
     * @param {Object}   [options.style]              Style options
     * @param {String}   [options.style.font]         Style to use for the font
     * @param {boolean}  [options.style.fill=true]    true to fill the text
     * @param {String}   [options.style.fillStyle]    Style to apply to the text when filled
     * @param {boolean}  [options.style.stroke=false] true to stroke the text
     * @param {String}   [options.style.strokeStyle]  Style to apply to the text when stroked
     * @param {Integer}  [options.style.lineWidth]    Width in px for the stroke line
     * @param {Integer}  [options.style.lineMargin]   Extra margin to add between lines in px.
     * @param {boolean}  [_getFullTextSize]           If true, only the size will be calculated and nothing will be rendered (internal option used by {@link gc.Text.getFullTextSize})
     * @param {Canvas}   [canvas]                     Canvas to use as a buffer background. This will limit {@link options.width} and {@link options.height}
     *
     * @requires gc.Util
     * @requires gc.Validator
     * @requires gc.Canvas2D
     * @requires gc.Drawable
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 0.3.0
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
        var _construct = function _construct(text, options, canvas) {
            var textSize,
                newCanvas = !canvas;

            _options = gc.util.extend({}, _defaultOptions, options);

            // data validation :start
            _validator.reset()
                      .str("text", text)
                      .enumerated("align", _options.align, { enumerated: gc.Align })
                      .int("marginTop", _options.marginTop)
                      .int("marginRight", _options.marginRight)
                      .int("marginBottom", _options.marginBottom)
                      .int("marginLeft", _options.marginLeft)
                      .intPositive("width", _options.width)
                      .intPositive("height", _options.height)
                      .int("limit", _options.limit)
                      .intPositive("delay", _options.delay)
                      .fltPositive("speed", _options.speed)
                      .str("pauseOn", _options.pauseOn)
                      .fltPositive("pauseLength", _options.pauseLength)
                      .textStyle("style", _options.style);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            _options = _validator.valid(_options);
            // data validation :end

            if(!_options._getFullTextSize) {
                if(newCanvas) {
                    canvas = document.createElement("canvas");
                    if(_options.width) {
                        canvas.width = _options.width + _options.marginLeft + _options.marginRight;
                    }
                    if(_options.height) {
                        canvas.height = _options.height + _options.marginTop + _options.marginBottom;
                    }

                } else {
                    if(_options.marginLeft + _options.width + _options.marginRight > canvas.width) {
                        _options.width = canvas.width - _options.marginLeft - _options.marginRight;
                    }
                    if(_options.marginTop + _options.height + _options.marginBottom > canvas.height) {
                        _options.height = canvas.height - _options.marginTop - _options.marginBottom;
                    }

                    if(_options.width < 0 || _options.height < 0) {
                        return;
                    }
                }
            }

            _fbo = new gc.Canvas2D(canvas).getContext();
            _originalText = text;
            _text = _processText(text);

            if(_options._getFullTextSize) {
                return;
            }

            textSize = this.measureText(true);
            if(_options.width === 0) {
                canvas.width = textSize.width;
                _options.width = textSize.width;
            }
            if(_options.height === 0) {
                canvas.height = textSize.height;
                _options.height = textSize.height;
            }

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
            if(action.lineWidth) {
                _fbo.lineWidth = action.lineWidth;
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
                    m = _escapeRegEx.exec(txt);
                    while(m) {
                        res.push({
                            txt   : txt.substring(i, m.index),
                            action: m[0].substring(_escapeChar.length)
                        });
                        i = m.index + m[0].length;
                        m = _escapeRegEx.exec(txt);
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

                i = re.exec(txt);
                while(i) {
                    separators.push(i[0]);
                    i = re.exec(txt);
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
                    if(xx + wordWidth < availableWidth) {
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
                        res[line].width = xx;
                        _fullTextSize.width = Math.max(_fullTextSize.width, res[line].width);
                        res.push([]);
                        line++;
                        y += _state.lineMargin;
                        tokenText = word + separator;
                        x = 0;
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
                y = 0,
                availableWidth = _options.width === 0 ? Infinity : _options.width - _options.marginRight - _options.marginLeft,
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
                x = 0;

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
                res[line].width = x;

                _fullTextSize.width = Math.max(_fullTextSize.width, res[line].width);
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
            function getOffsetX(line) {
                var offset;

                switch(_options.align) {
                    case gc.Align.TOP_LEFT:
                    case gc.Align.LEFT:
                    case gc.Align.BOTTOM_LEFT:
                        offset = _options.marginLeft;
                        break;

                    case gc.Align.TOP:
                    case gc.Align.CENTER:
                    case gc.Align.BOTTOM:
                        offset = (_options.width - line.width)/2;
                        break;

                    case gc.Align.TOP_RIGHT:
                    case gc.Align.RIGHT:
                    case gc.Align.BOTTOM_RIGHT:
                        offset = _options.width - _options.marginRight - line.width;
                        break;
                }

                return Math.floor(offset);
            }

            function getOffsetY() {
                var offset;

                switch(_options.align) {
                    case gc.Align.TOP_LEFT:
                    case gc.Align.TOP:
                    case gc.Align.TOP_RIGHT:
                        offset = _options.marginTop;
                        break;

                    case gc.Align.LEFT:
                    case gc.Align.CENTER:
                    case gc.Align.RIGHT:
                        offset = (_options.height - _fullTextSize.height)/2;
                        break;

                    case gc.Align.BOTTOM_LEFT:
                    case gc.Align.BOTTOM:
                    case gc.Align.BOTTOM_RIGHT:
                        offset = _options.height - _options.marginBottom - _fullTextSize.height;
                        break;
                }

                return Math.floor(offset);
            }

            var nLines,
                nTokens,
                token,
                offsetX,
                offsetY = getOffsetY();

            _resetState();

            // for each line apply the actions to see how to draw the last token
            for(_state.line=0, nLines=_text.length; _state.line<nLines; _state.line++) {
                offsetX = getOffsetX(_text[_state.line]);

                for(_state.token=0, nTokens=_text[_state.line].length; _state.token<nTokens; _state.token++) {
                    token = _text[_state.line][_state.token];

                    if(_state.fill) {
                        _fbo.fillText(token.txt, offsetX + token.x, offsetY + _text[_state.line].y);
                    }
                    if(_state.stroke) {
                        _fbo.strokeText(token.txt, offsetX + token.x, offsetY + _text[_state.line].y);
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
         * Get the size of the formatted text
         *
         * @param  {boolean} includeMargins if true, the margins will be included in the result
         * @return {Object}                 Object as {width, height}
         *
         * @public
         */
        this.measureText = function measureText(includeMargins) {
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
        };

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
    gc.Text = Text;
    gc.util.defineConstant(gc.Text, "VERSION", VERSION);
    gc.Text.setEscapeChar       = setEscapeChar;
    gc.Text.getEscapeChar       = getEscapeChar;
    gc.Text.setWordSplitRegExp  = setWordSplitRegExp;
    gc.Text.getWordSplitRegExp  = getWordSplitRegExp;
    gc.Text.registerAction      = registerAction;
    gc.Text.getTextMetrics      = getTextMetrics;
    gc.Text.setDefaultOptions   = setDefaultOptions;
    gc.Text.getFullTextSize     = getFullTextSize;

} (window, window.gc));

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();

    ////////////////////////////
    // STATIC PRIVATE METHODS //
    ////////////////////////////

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    ///////////////////////////
    // STATIC PUBLIC METHODS //
    ///////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.NinePatch
     * @public
     */
    var VERSION = "0.2.1";

    /**
     * Image with stretchable borders.
     * Due to its resizable nature (always requiring a size to be specified to draw)
     * it can't use Drawable as is, but provide some of its methods (with different parameters)
     *
     * @param {Object}  data              Definition of the 9-patch
     * @param {String}  data.texture      Source of the 9-patch image
     * @param {Integer} [data.size]       Size in bytes of the source image
     * @param {Integer} data.topLeftX     X-position where the 9-patch starts in the image
     * @param {Integer} data.topLeftY     Y-position where the 9-patch starts in the image
     * @param {Integer} data.leftTopW     Width of the top-left rectangle
     * @param {Integer} data.leftTopH     Height of the top-left rectangle
     * @param {Integer} data.bottomRightX X-position where the bottom-right rectangle starts in the image
     * @param {Integer} data.bottomRightH Y-position where the bottom-right rectangle starts in the image
     * @param {Integer} data.bottomRightW Width of the bottom-right rectangle
     * @param {Integer} data.bottomRightH Height of the bottom-right rectangle
     * @param {Integer} [width=0]         Width of the image to draw
     * @param {Integer} [height=0]        Height of the start of the region
     * @param {Integer} [cx=0]            X-position of the center of the region
     * @param {Integer} [cy=0]            Y-position of the center of the region
     *
     * @requires gc.Util
     * @requires gc.Validator
     * @requires gc.Point2
     * @requires gc.Size2
     * @requires gc.TextureRegion
     * @uses     gc.exception
     *
     * @todo Use _scale to render the elements by this factor (the draw method works though)
     * @constructor
     * @memberOf gc
     * @version 0.2.1
     * @author @danikaze
     */
    var NinePatch = function(data, width, height, centerX, centerY, scaleX, scaleY, canvas) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _drawable,
            _fbo,       // canvas to use as FrameBuffer Object
            _scale,     // scale to draw the elements of the Nine Patch
            _parts;     // each part of the image

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(data, width, height, centerX, centerY, scaleX, scaleY, canvas) {
            var valid,
                partialDrawable = {};

            // data validation :start
            _validator.reset()
                      .ninePatchData("data",  data)
                      .intPositive("width",   width,   { optional: true, def: 100 })
                      .intPositive("height",  height,  { optional: true, def: 100 })
                      .intPositive("centerX", centerX, { optional: true, def: 0 })
                      .intPositive("centerY", centerY, { optional: true, def: 0 })
                      .intPositive("scaleX",  scaleX,  { optional: true, def: 1 })
                      .intPositive("scaleY",  scaleY,  { optional: true, def: 1 });

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            valid = _validator.valid();
            // data validation :end

            _scale = new gc.Point2(valid.scaleX, valid.scaleY);
            _fbo = new gc.Canvas2D(canvas).getContext();

            if(!canvas) {
                _fbo.canvas.width = valid.width;
                _fbo.canvas.height = valid.height;
            }

            _parts = _loadParts(valid.data);

            // create the drawable, but choosing which methods to use
            _drawable = new gc.Drawable(_fbo.canvas, valid.width, valid.height, 0, 0, valid.centerX, valid.centerY);
            _drawable.drawable(partialDrawable);
            this.draw = partialDrawable.draw;
            this.drawBounds = partialDrawable.drawBounds;
            this.drawCenter = partialDrawable.drawCenter;
            this.setCenter = partialDrawable.setCenter;
            this.getCenter = partialDrawable.getCenter;
            this.drawable = partialDrawable.drawable.bind(this);

            _render();
        };

        /**
         * Load the 9 parts as 9 {@link gc.TextureRegion} from the NinePatch data definition
         *
         * @param {Object} data NinePatch definition object
         * @return {Object} Object with the TextureRegions as { topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight }
         *
         * @private
         */
        var _loadParts = function _loadParts(data) {
            var centerX = data.topLeftX + data.topLeftW,
                centerY = data.topLeftY + data.topLeftH,
                centerW = data.bottomRightX - data.topLeftX - data.topLeftW,
                centerH = data.bottomRightY - data.topLeftY - data.topLeftH;

            return {
                topLeft    : new gc.TextureRegion(data.texture, data.topLeftX,     data.topLeftY,     data.topLeftW,     data.topLeftH),
                top        : new gc.TextureRegion(data.texture, centerX,           data.topLeftY,     centerW,           data.topLeftH),
                topRight   : new gc.TextureRegion(data.texture, data.bottomRightX, data.topLeftY,     data.bottomRightW, data.topLeftH),
                left       : new gc.TextureRegion(data.texture, data.topLeftX,     centerY,           data.topLeftW,     centerH),
                center     : new gc.TextureRegion(data.texture, centerX,           centerY,           centerW,           centerH),
                right      : new gc.TextureRegion(data.texture, data.bottomRightX, centerY,           data.bottomRightW, centerH),
                bottomLeft : new gc.TextureRegion(data.texture, data.topLeftX,     data.bottomRightY, data.topLeftW,     data.bottomRightH),
                bottom     : new gc.TextureRegion(data.texture, centerX,           data.bottomRightY, centerW,           data.bottomRightH),
                bottomRight: new gc.TextureRegion(data.texture, data.bottomRightX, data.bottomRightY, data.bottomRightW, data.bottomRightH)
            };
        };

        /**
         * Render the 9-patch in the FBO
         *
         * @private
         */
        var _render = function _render() {
            var right = _fbo.canvas.width - _parts.bottomRight.width,
                bottom = _fbo.canvas.height - _parts.bottomRight.height,
                centerW = _fbo.canvas.width - _parts.topLeft.width - _parts.bottomRight.width,
                centerH = _fbo.canvas.height - _parts.topLeft.height - _parts.bottomRight.height;

            _parts.topLeft.draw(_fbo,     0,                    0,                     _parts.topLeft.width,     _parts.topLeft.height);
            _parts.top.draw(_fbo,         _parts.topLeft.width, 0,                     centerW,                  _parts.topLeft.height);
            _parts.topRight.draw(_fbo,    right,                0,                     _parts.bottomRight.width, _parts.topLeft.height);
            _parts.left.draw(_fbo,        0,                    _parts.topLeft.height, _parts.topLeft.width,     centerH);
            _parts.center.draw(_fbo,      _parts.topLeft.width, _parts.topLeft.height, centerW,                  centerH);
            _parts.right.draw(_fbo,       right,                _parts.topLeft.height, _parts.bottomRight.width, centerH);
            _parts.bottomLeft.draw(_fbo,  0,                    bottom,                _parts.topLeft.width,     _parts.bottomRight.height);
            _parts.bottom.draw(_fbo,      _parts.topLeft.width, bottom,                centerW,                  _parts.bottomRight.height);
            _parts.bottomRight.draw(_fbo, right,                bottom,                _parts.bottomRight.width, _parts.bottomRight.height);
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Set the size of the NinePatch. The center parts will strech while the borders will preserve the right aspect.
         * If the size is too small, the NinePatch will stay at its minimum size.
         *
         * @param  {Number}       width           New width for the image
         * @param  {Number}       height          New height for the image
         * @param  {boolean}      [content=false] If true, the specified size is for the content without the extensible borders.
         * @return {gc.NinePatch}                 self reference for allowing chaining
         *
         * @public
         */
        this.setSize = function setSize(width, height, content) {
            if(content) {
                width  += _parts.topLeft.width  + _parts.bottomRight.width;
                height += _parts.topLeft.height + _parts.bottomRight.height;

            } else {
                width  = Math.max(width,  _parts.topLeft.width  + _parts.bottomRight.width);
                height = Math.max(height, _parts.topLeft.height + _parts.bottomRight.height);
            }

            _fbo.canvas.width = width;
            _fbo.canvas.height = height;
            _drawable.setSize(width, height);
            _render();

            return this;
        };

        /**
         * @return {gc.Size2} Current size of the NinePatch
         *
         * @public
         */
        this.getSize = function getSize() {
            return {
                width : _fbo.canvas.width,
                height: _fbo.canvas.height
            };
        };

        /**
         * @return {CanvasRenderingContext2D} Context of the FBO
         *
         * @public
         */
        this.getContext = function getContext() {
            return _fbo;
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
    gc.NinePatch = NinePatch;
    gc.util.defineConstant(gc.NinePatch, "VERSION", VERSION);

} (window, window.gc));

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

;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();

    ////////////////////////////
    // STATIC PRIVATE METHODS //
    ////////////////////////////

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    ///////////////////////////
    // STATIC PUBLIC METHODS //
    ///////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.ProgressBar
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * A very simple progress bar based on two images: done and pending
     *
     * @param {Number}           x                    X position of the top-left corner of the ProgressBar.
     * @param {Number}           y                    Y position of the top-left corner of the ProgressBar.
     * @param {Object}           style                ProgressBar style definition.
     * @param {gc.TextureRegion} style.pending        Image to use as background of the ProgressBar.
     * @param {gc.TextureRegion} style.done           Image used to the done progress.
     * @param {Object}           style.barPosition    Offset as {x, y} inside the {@link style.pending} where the style.done image should be drawn.
     * @param {Object}           [options]            Other options of the ProgressBar.
     * @param {Float}            [options.progress]   Initial progress of the ProgressBar when created, as a float between [0, 1].
     * @param {Integer}          [options.updateTime] Time for the animation when updating the ProgressBar, in milliseconds.
     *
     * @requires gc.Util
     * @requires gc.Validator
     * @requires gc.Deferred
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var ProgressBar = function(x, y, style, options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _deferred,
            _position,
            _fbo,
            _style,
            _options,
            _progress;

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(x, y, style, options) {
            var valid;

            options = gc.util.extend({
                progress: 0,
                updateTime: 500
            }, options);

            // data validation :start
            _validator.reset()
                      .int("x", x)
                      .int("y", y);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            valid = _validator.valid();
            _position = new gc.Point2(valid.x, valid.y);

            _validator.reset()
                      .int("barPositionX", style.barPosition.x)
                      .int("barPositionY", style.barPosition.y);

            if(_validator.errors() || !(style.pending instanceof gc.TextureRegion) || !(style.done instanceof gc.TextureRegion)) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            valid = _validator.valid();
            _style = {
                done       : style.done,
                pending    : style.pending,
                barPosition: { x: valid.barPositionX, y: valid.barPositionY }
            };

            _validator.reset()
                      .flt("progress", options.progress)
                      .int("updateTime", options.updateTime);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            _options = _validator.valid();
            // data validation :end

            _deferred = new gc.Deferred();
            _deferred.promise(this);

            this.getPosition = _position.get.bind(_position);

            _progress = new gc.Easing(0, _options.progress, _options.updateTime, gc.Easing.EaseType.INOUT_CUBIC);

            _progress.done(_updateDeferred)
                     .progress(_updateDeferred);
        };

        /**
         * Update the internal deferred based on the {@link _progress} updates
         *
         * @param   {Float} progress Progress shown on the image (not the desired one)
         *
         * @private
         */
        var _updateDeferred = function(progress) {
            if(progress === 1) {
                _deferred.resolve(1);
            } else {
                _deferred.notify(progress);
            }
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Update the ProgressBar {@link delta} milliseconds.
         *
         * @param  {Number}         delta Milliseconds to update
         * @return {gc.ProgressBar}       Self reference for chaining
         *
         * @public
         */
        this.update = function update(delta) {
            _progress.update(delta);

            return this;
        };

        /**
         * Draw the ProgressBar in the specified Canvas context
         *
         * @param  {CanvasRenderingContext2D} ctx Canvas2D context where to draw the ProgressBar
         * @return {gc.ProgressBar}               Self reference for chaining
         *
         * @public
         */
        this.draw = function draw(ctx) {
            var w = _style.done.width * _progress.getValue();

            _style.pending.draw(ctx, _position.x, _position.y);
            _style.done.draw(ctx, 0, 0, w, _style.done.height, _position.x + _style.barPosition.x, _position.y + _style.barPosition.y, w, _style.done.height);
        };

        /**
         * Set the progress of the ProgressBar
         *
         * @param  {Float}          n Progress between 0 and 1
         * @return {gc.ProgressBar}   Self reference for chaining
         *
         * @public
         */
        this.setProgress = function setProgress(n) {
            _progress.setValue(_progress.getValue(), gc.util.clamp(n, 0, 1))
                     .begin();

            return this;
        };

        /**
         * Get the current progress
         *
         * @return {Float} Progress between 0 and 1
         *
         * @public
         */
        this.getProgress = function getProgress() {
            return _progress.getValue();
        };

        /**
         * Get the current position of the ProgressBar
         *
         * @param  {Number}         x X position of the top-left corner
         * @param  {Number}         y Y position of the top-left corner
         * @return {gc.ProgressBar}   Self reference for chaining
         *
         * @public
         */
        this.setPosition = function setPosition(x, y) {
            _position.set(x, y);

            return this;
        };

        /**
         * Get the size of the ProgressBar
         *
         * @return {Object} size as {width, height}
         *
         * @public
         */
        this.getSize = function getSize() {
            return {
                width : _style.pending.width,
                height: _style.pending.height
            };
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
    gc.ProgressBar = ProgressBar;
    gc.util.defineConstant(gc.ProgressBar, "VERSION", VERSION);

} (window, window.gc));
