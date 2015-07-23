/**
 * Base gc namespace with generic util members
 * @namespace gc
 */
;(function(window, gc, undefined) {
    "use strict";

    /**
     * Enum: Alignment values
     *
     * @property {Number} BOTTOM
     * @property {Number} BOTTOM_LEFT
     * @property {Number} BOTTOM_RIGHT
     * @property {Number} CENTER
     * @property {Number} LEFT
     * @property {Number} RIGHT
     * @property {Number} TOP
     * @property {Number} TOP_LEFT
     * @property {Number} TOP_RIGHT
     *
     * @enum {Number}
     * @readOnly
     * @memberOf gc
     */
    var Align = Object.freeze({
        BOTTOM       : 0,
        BOTTOM_LEFT  : 1,
        BOTTOM_RIGHT : 2,
        CENTER       : 3,
        LEFT         : 4,
        RIGHT        : 5,
        TOP          : 6,
        TOP_LEFT     : 7,
        TOP_RIGHT    : 8
    });

    /**
     * Utility functions
     *
     * @memberOf gc
     * @namespace
     * @alias gc.util
     * @version 1.0.0
     */
    var Util = {};

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
        return !isNaN(parseFloat(n)) && isFinite(n);
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
                                 : function isArray(obj) { return Object.prototype.toString.call( someVar ) === "[object Array]"; };

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
    Util.each = function each(obj, f) {
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
    Util.size = function size(obj) {
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
        var recursive = false,
            i = 1,
            base = 0,
            n = arguments.length,
            base,
            o,
            p;

        if(arguments[0] === true) {
            recursive = true;
            i++;
            base = arguments[1];
        } else {
            base = arguments[0];
        }

        for(; i<n; i++) {
            o = arguments[i];
            if(Util.isPlainObject(o)) {
                for(p in o) {
                    if(o[p] !== undefined) {
                        if(recursive) {
                            Util.extend(true, base[p], o[p]);
                        } else {
                            base[p] = o[p];
                        }
                    }
                }
            }
        }

        return base;
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
        x = x || 0;
        y = y || 0;
        centerX = centerX || 0;
        centerY = centerY || 0;

        switch(align) {
            case Align.BOTTOM:
                x += w/2;
                y += h - centerY;
                break;

            case Align.BOTTOM_LEFT:
                x += w + centerX;
                y += h - centerY;
                break;

            case Align.BOTTOM_RIGHT:
                x += -w + centerX;
                y += h - centerY;
                break;

            case Align.CENTER:
                x += w/2 + centerX;
                y += h/2 - centerX;
                break;

            case Align.LEFT:
                x += w + centerX;
                y += h/2 - centerX;
                break;

            case Align.RIGHT:
                x += -w + centerX;
                y += h/2 - centerX;
                break;

            case Align.TOP:
                x += w/2 + centerX;
                y += centerY;
                break;

            case Align.TOP_LEFT:
                x += w + centerX;
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


    ///////////////////////////////
    // Export the public objects //
    ///////////////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.Align = Align;
    gc.util = Util;

} (window, window.gc));
