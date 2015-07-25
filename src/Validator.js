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
    var VERSION = "1.0.0";

    /**
     * Object for validate several types of data
     *
     * Define a new validator for each type of validated data:
     * Don't use something like isValid = isNumber && isPositive to validate a recordId,
     * but define a validator specialized in doing that, so it can be used just for that type of data.
     * Validators can use already defined validators
     *
     * @param {Object}  options                                  list of options to override the default ones
     * @param {boolean} [options.strict=false]                   true to use strict validation
     * @param {boolean} [options.canonize=true]                  true convert data to its canonical form
     * @param {boolean} [options.returnNullOnErrors=true]        if there is any error, {@link valid} will return null
     * @param {boolean} [options.optional=false]                 accept undefined values (not null) in the validations
     * @param {Object}  [options.validators={}]                  object with validators to load with addValidator(name, validator)
     * @param {boolean} [options.allowOverwriteValidators=false] if an existing validator is defined and this option is false, an exception will raise
     *
     * @requires  gc.Util
     * @uses      gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
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
        function _construct(options) {
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
         * Stores the data to be retrieved via {@link valid} and {@link error}
         *
         * @param {String}  key           key to access data
         * @param {mixed}   originalData  data as passed to validate
         * @param {mixed}   canonizedData canonized data (i.e. "2" => 2 for numbers)
         * @param {boolean} validates     if the originalData validated or not
         *
         * @private
         */
        function　_store(key, originalData, canonizedData, validates) {
            if(validates) {
                _good[key] = canonizedData;

            } else {
                _bad[key] = originalData;
            }
        }

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
        function _validateData(validator, key, data, options) {
            var res,
                extendedOptions = gc.util.extend({}, _options, options);

            res = (data === undefined && options.optional) ? res = { data: undefined, valid: true }
                                                           : validator(data, extendedOptions);

            _store(key, data, extendedOptions.canonize ? res.data : data, res.valid);
        }

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
        function _validateArray(validator, key, data, options) {
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

            } else if(data === undefined && options.optional) {
                ok = true;

            } else {
                ok = false;
            }

            _store(key, data, val, ok);
        }

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
        function _validateObject(validator, key, data, options) {
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

            } else if(data === undefined && options.optional) {
                ok = true;

            } else {
                ok = false;
            }

            _store(key, data, val, ok);
        }

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
            var valid = null,
                i;

            if(typeof(base) !== 'undefined' && !gc.util.isPlainObject(base)) {
                throw new gc.exception.WrongParametersException('base needs to be a plain object if specified');
            }

            if(!_options.returnNullOnErrors || gc.util.isEmptyObject(_bad)) {
                if(base) {
                    for(i in _good) {
                        base[i] = _good[i];
                    }
                    valid = base;
                } else {
                    valid = _good;
                }
            }

            return valid;
        };

        /**
         * Clear the list of errors and validated data stored in the validator
         *
         * @return {this} Self object for allowing chaining
         *
         * @public
         */
        this.reset = function reset() {
            this.clearErrors();
            this.clearValid();
            return this;
        };

        /**
         * Clear the list of errors stored in the validator
         *
         * @return {this} Self object for allowing chaining
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
         * @return {this} Self object for allowing chaining
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
         * @return {this}               Self object for allowing chaining
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
    gc.Validator = Validator;
    gc.util.defineConstant(gc.Validator, "VERSION", VERSION);

} (window, window.gc));
