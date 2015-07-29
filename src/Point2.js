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
    var VERSION = "1.0.0";
    
    /**
     * Class representing 2D Points {x, y}
     *
     * The constructor accept three signatures:
     *  0 parameters: reset the object to x=0, y=0
     *  1 parameter : make a copy of the values of another object with { x, y } properties
     *  2 parameters: explicit values as (x, y)
     *
     * @requires gc.Util
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
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
         * @see {@link gc.Point2.set}
         * @private
         */
        function _construct() {
            this.set.apply(this, arguments);
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Set the values of the Point2.
         * This method accept three signatures:
         *  0 parameters: reset the object to x=0, y=0
         *  1 parameter : make a copy of the values of another object with { x, y } properties
         *  2 parameters: explicit values as (x, y)
         *
         * @param {Number} x new value for the x-coordinate
         * @param {Number} y new value for the y-coordinate
         * @return {gc.Point2} Self reference for allowing chaining
         *
         * @public
         */
        this.set = function set() {
            switch(arguments.length) {
                case 0:
                    this.x = 0;
                    this.y = 0;
                    break;
                    
                case 1: 
                    this.x = arguments[0].x;
                    this.y = arguments[0].y;
                    break;
                
                case 2:
                    this.x = arguments[0];
                    this.y = arguments[1];
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }
            
            return this;
        };
        
        /**
         * Get the values of the Point2
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
         * Add the values of each coordinate of a point to this one.
         * This method accept two signatures:
         *  1 parameter : make a copy of the values of another object with { x, y } properties
         *  2 parameters: explicit values as (x, y)
         * 
         * @return {gc.Point2} Self reference for allowing chaining
         *
         * @public
         */
        this.add = function() {
            switch(arguments.length) {
                case 1: 
                    this.x += arguments[0].x;
                    this.y += arguments[0].y;
                    break;
                
                case 2:
                    this.x += arguments[0];
                    this.y += arguments[1];
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }
            
            return this;
        };
        
        /**
         * Subtract the values of each coordinate of a point to this one.
         * This method accept two signatures:
         *  1 parameter : make a copy of the values of another object with { x, y } properties
         *  2 parameters: explicit values as (x, y)
         * 
         * @return {gc.Point2} Self reference for allowing chaining
         *
         * @public
         */
        this.sub = function() {           
            switch(arguments.length) {
                case 1: 
                    this.x -= arguments[0].x;
                    this.y -= arguments[0].y;
                    break;
                
                case 2:
                    this.x -= arguments[0];
                    this.y -= arguments[1];
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }
            
            return this;
        };
        
        /**
         * Scale the point by a scalar (constant) as C*x, C*y, or two as A*x, B*y
         * This method accept three signatures:
         *  1 parameter : {Number} x = C*x, y = C*y
         *  1 parameter : {gc.Point2} x = p.x * x, y = p.y * y
         *  2 parameters: explicit values as x = A*x, y = B*y
         * 
         * @return {gc.Point2} Self reference for allowing chaining
         *
         * @public
         */
        this.scl = function(a, b) {
            switch(arguments.length) {
                case 1:
                    if(gc.util.isNumber(a)) {
                        this.x *= a;
                        this.y *= a;
                    } else {
                        this.x *= a.x;
                        this.y *= a.y;
                    }
                    break;
                
                case 2:
                    this.x *= a;
                    this.y *= b;
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }
            
            return this;
        };
        
        /**
         * Calculate the Euclidean distance between this and other point
         * This method accept two signatures:
         *  1 parameter : make a copy of the values of another object with { x, y } properties
         *  2 parameters: explicit values as (x, y)
         *
         * @return {Number} Euclidean distance between two points
         *
         * @public
         */
        this.dst = function dst() {
            var xx, yy;
            
            switch(arguments.length) {
                case 1: 
                    xx = this.x - arguments[0].x;
                    yy = this.y - arguments[0].y;
                    break;
                
                case 2:
                    xx = this.x - arguments[0];
                    yy = this.y - arguments[1];
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }
                        
            return Math.sqrt(xx*xx + yy*yy);
        };
        
        /**
         * Calculate the squared distance between this and other point
         * This method accept two signatures:
         *  1 parameter : make a copy of the values of another object with { x, y } properties
         *  2 parameters: explicit values as (x, y)
         *
         * @return {Number} Square distance between two points
         *
         * @public
         */
        this.dst2 = function dst2() {
            var xx, yy;
            
            switch(arguments.length) {
                case 1: 
                    xx = this.x - arguments[0].x;
                    yy = this.y - arguments[0].y;
                    break;
                
                case 2:
                    xx = this.x - arguments[0];
                    yy = this.y - arguments[1];
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }
                        
            return xx*xx + yy*yy;
        };
        
        /**
         * Calculate the angle between the vectors formed a reference point passed as a parameter and
         * this point (reference->this) and the X-axis.
         * This method returns a value between [0..2*PI), being 0 at right, and PI/4 at top
         *   /
         *  /) angle (PI/4)
         * /__)__
         *
         * This method accept three signatures:
         *  0 parameters: it will use the vector (0,0) as reference
         *  1 parameter : make a copy of the values of another object with { x, y } properties
         *  2 parameters: explicit values as (x, y)
         *
         * @return {Number} Angle in radians between this point and the specified one
         *
         * @public
         */
         this.angleRad = function angleRad() {
            var xx, yy,
                angle;
            
            switch(arguments.length) {
                case 0:
                    xx = this.x;
                    yy = this.y;
                    break;
                    
                case 1: 
                    xx = this.x - arguments[0].x;
                    yy = this.y - arguments[0].y;
                    break;
                
                case 2:
                    xx = this.x - arguments[0];
                    yy = this.y - arguments[1];
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }
            
            angle = Math.atan2(yy, xx);
            return angle < 0 ? 2 * Math.PI + angle
                             : angle;
         };
         
         /**
         * Calculate the angle between the vectors formed a reference point passed as a parameter and
         * this point (reference->this) and the X-axis.
         * This method returns a value between [0..260), being 0 at right, and 90 at top
         *   /
         *  /) angle (45º)
         * /__)___
         *
         * This method accept three signatures:
         *  0 parameters: it will use the vector (0,0) as reference
         *  1 parameter : make a copy of the values of another object with { x, y } properties
         *  2 parameters: explicit values as (x, y)
         *
         * @return {Number} Angle in degrees between this point and the specified one
         *
         * @public
         */
         this.angle = function angle() {
            return this.angleRad.apply(this, arguments) * 180 / Math.PI;
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
    gc.Point2 = Point2;
    gc.util.defineConstant(gc.Point2, "VERSION", VERSION);

} (window, window.gc));
