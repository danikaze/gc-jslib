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
                y1 = Math.max(this.y, rect.y),
                y2 = Math.min(this.y + this.height, rect.y + rect.height),
                w = x2-x1,
                h = y2-y1;

            return w > 0 && h > 0 ? new Rectangle(w, h, x1, y1)
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
                w = this.width - x;
            } else {
                x = 0;
                w = rect.x + rect.width - this.x;
            }
            if(w < 0) {
                return null;
            }

            if(this.y < rect.y) {
                y = rect.y - this.y;
                h = this.height - x;
            } else {
                y = 0;
                h = rect.y + rect.height - this.y;
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
