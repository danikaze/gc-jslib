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

    var VERSION = "1.0.0";

    /**
     * Random Number Generator
     *
     * @param {Integer} seed Initial seed for the pseudo-random number generator
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
        };


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
        this.nextInt = function() {
            _state = (_a * _state + _c) % _m;
            _generated++;

            switch(arguments.length) {
                case 0:
                    return _state;
                    break;

                case 1:
                    return Math.floor(_state / _m * arguments[0]);
                    break;

                case 2:
                    return Math.floor(_state / _m * arguments[1]) + arguments[0];
                    break;

                default:
                    throw "Wrong number of arguments";
                    break;
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
                    break;

                case 1:
                    return _state * max;
                    break;

                case 2:
                    return _state * (max - min) + min;
                    break;

                default:
                    throw "Wrong number of arguments";
                    break;
            }
        };

        /**
         * Reset the state of the generator to the first number of the seed
         *
         * @return {this} Self object to allow chaining
         *
         * @public
         */
        this.reset = function() {
            _construct(_seed);
            return this;
        }

        /**
         * Get the initial seed of the generator
         *
         * @return {Integer} Seed of the generator
         *
         * @public
         */
        this.getSeed = function() {
            return _seed;
        }

        /**
         * Set the seed (initial state) of the generator, and resets it
         *
         * @return {this} Self object to allow chaining
         *
         * @public
         */
        this.setSeed = function(seed) {
            _construct(seed);
            return this;
        }

        /**
         * Get the state (number of numbers generated) of the generator.
         * With {@link setState} allow storing and recovering the state of the generator
         *
         * @return {Integer} state of the generator
         *
         * @public
         */
        this.getState = function() {
            return _generated;
        }

        /**
         * Set the state of the generator to N generations
         *
         * @return {this} Self object to allow chaining
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
    gc.RNG = RNG;
    gc.util.defineConstant(gc.RNG, "VERSION", VERSION);

} (window, window.gc));
