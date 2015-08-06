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
