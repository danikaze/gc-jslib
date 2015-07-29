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
    var VERSION = "1.0.0";
    
    /**
     * Class representing {width, height} properties
     *
     * The constructor accept three signatures:
     *  0 parameters: reset the object to width=0, width=0
     *  1 parameter : make a copy of the values of another object with { width, height } properties
     *  2 parameters: explicit values as (w, h)
     *
     * @requires gc.Util
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
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
         * @see {@link gc.Size2.setSize}
         * @private
         */
        function _construct() {
            this.set.apply(this, arguments);
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Set the values of the Size2.
         * This method accept three signatures:
         *  0 parameters: reset the object to width=0, width=0
         *  1 parameter : make a copy of the values of another object with { width, height } properties
         *  2 parameters: explicit values as (w, h)
         *
         * @return {gc.Size2} Self reference for allowing chaining
         *
         * @public
         */
        this.set = function set() {
            switch(arguments.length) {
                case 0:
                    this.width  = 0;
                    this.height = 0;
                    break;
                    
                case 1: 
                    this.width = arguments[0].width;
                    this.height = arguments[0].height;
                    break;
                
                case 2:
                    this.width = arguments[0];
                    this.height = arguments[1];
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }
            
            return this;
        };
        
        /**
         * Get the values of the Size2
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
         * Add the values of each coordinate of a point to this one.
         * This method accept two signatures:
         *  1 parameter : make a copy of the values of another object with { width, height } properties
         *  2 parameters: explicit values as (w, h)
         * 
         * @return {gc.Size2} Self reference for allowing chaining
         *
         * @public
         */
        this.add = function() {
            switch(arguments.length) {
                case 1: 
                    this.width += arguments[0].width;
                    this.height += arguments[0].height;
                    break;
                
                case 2:
                    this.width += arguments[0];
                    this.height += arguments[1];
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Number of parameters incorrect");
            }
            
            return this;
        };
        
        /**
         * Subtract the values of each coordinate of a point to this one.
         * This method accept two signatures:
         *  1 parameter : make a copy of the values of another object with { width, height } properties
         *  2 parameters: explicit values as (w, h)
         * 
         * @return {gc.Size2} Self reference for allowing chaining
         *
         * @public
         */
        this.sub = function(x, y) {
            switch(arguments.length) {
                case 1: 
                    this.width -= arguments[0].width;
                    this.height -= arguments[0].height;
                    break;
                
                case 2:
                    this.width -= arguments[0];
                    this.height -= arguments[1];
                    break;
                
                default:
                    throw new gc.exception.WrongSignatureException("Number of parameters incorrect");
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
    gc.Size2 = Size2;
    gc.util.defineConstant(gc.Size2, "VERSION", VERSION);

} (window, window.gc));
