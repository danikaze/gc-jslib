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
            _state;

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
            var val;
            _state = (_a * _state + _c) % _m;
            val = _state / (_m - 1);

            switch(arguments.length) {
                case 0:
                    return val;

                case 1:
                    return val * min;

                case 2:
                    return val * (max - min) + min;

                default:
                    throw "Wrong number of arguments";
            }
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
        this.setSeed = function(seed, state) {
            switch(arguments.length) {
            case 0:
                _seed = parseInt(Math.random() * (_m - 1));
                _state = _seed;
                break;

            case 1:
                _seed = parseInt(seed);
                _state = _seed;
                break;

            case 2:
                _seed = parseInt(seed);
                _state = state;
                break;

            default:
                throw "Wrong number of arguments";
        }

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
            return _state;
        };

        /**
         * Set the state of the generator to N generations
         *
         * @return {gc.RNG} Self object to allow chaining
         *
         * @public
         */
        this.setState = function(state) {
            _state = state;

            return this;
        };

        /**
         * Reset the state of the generator to the first number of the seed
         *
         * @return {gc.RNG} Self object to allow chaining
         *
         * @public
         */
        this.reset = function() {
            return this.setSeed(_seed);
        };

        // call the constructor after setting all the methods
        this.setSeed.apply(this, arguments);
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
