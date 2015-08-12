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
    var VERSION = "0.2.0";

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
     * @version 0.2.0
     */
    var Util = {};

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