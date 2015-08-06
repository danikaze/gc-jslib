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
    var VERSION = "0.3.0";

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
     * @version 0.3.0
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
