/**
 * List of validators used by gc.Validator
 */
(function (gc, undefined)
{
    'use strict';

        // basic data validators
    var basicValidators = {
            'bool'          : validatorBool,
            'int'           : validatorInt,
            'intPositive'   : validatorIntPositive,
            'float'         : validatorFloat,
            'floatPositive' : validatorFloatPositive,
            'str'           : validatorStr,
            'strNonEmpty'   : validatorStrNonEmpty,
            'callback'      : validatorCallback,
            'enumerated'    : validatorEnumerated
        },
        // Animation validators
        AnimationValidators = gc.util.extend({
            'animationFrame': validatorAnimationFrame
        }, basicValidators);

    // declare the different validators object used by each class
    gc.validatorDefinitions = {
        Animation: AnimationValidators
    };

    // validator object used to validate other objects
    var validator = new gc.Validator({ validators: basicValidators });

    /*
     * Generic Boolean data validator
     */
    function validatorBool(data, options) {
        var val = !!data,
            ok = !options.strict || typeof(data) === 'boolean';

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic Int validator
     */
    function validatorInt(data, options) {
        var val = parseInt(data),
            ok = !isNaN(val) && (!options.strict || gc.util.isNumber(data));

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Positive (>=0) Int validator
     */
    function validatorIntPositive(data, options) {
        var val = parseInt(data),
            ok = !isNaN(val) && (!options.strict || gc.util.isNumber(data)) && data >= 0;

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic Float validator
     */
    function validatorFloat(data, options) {
        var val = parseFloat(data),
            ok = !isNaN(val) && (!options.strict || gc.util.isNumber(data));

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Positive (>=0) Float validator
     */
    function validatorFloatPositive(data, options) {
        var val = parseFloat(data),
            ok = !isNaN(val) && (!options.strict || gc.util.isNumber(data)) && data >= 0;

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic String validator
     */
    function validatorStr(data, options) {
        var val = String(data),
            ok = data != null && (!options.strict || gc.util.isString(data));

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic non-empty String validator
     */
    function validatorStrNonEmpty(data, options) {
        var val = String(data),
            ok = data != null && (!options.strict || gc.util.isString(data)) && data.length > 0;

        return {
            data: val,
            valid: ok
        };
    }

    /*
     * Generic Function validator
     */
    function validatorCallback(data, options) {
        return {
            data: data,
            valid: gc.util.isFunction(data)
        };
    }

    /*
     * Enum Validator.
     * Check that data is one of the values inside the definition of options.enum
     */
    function validatorEnumerated(data, options) {
        if(!options || !gc.util.isPlainObject(options.enumerated))
        {
            throw new P.exceptions.WrongParametersException('options.enumerated is not an Object');
        }

        var val = null,
            ok = false,
            i;

        for(i in options.enumerated)
        {
            if(!options.strict && data == options.enumerated[i] || options.strict && data === options.enumerated[i])
            {
                val = options.enumerated[i];
                ok = true;
                break;
            }
        }

        return {
            data: val,
            valid: ok
        };
    }


    //////////////////////////
    // Animation Validators //
    //////////////////////////

    /*
     *
     */
    function validatorAnimationFrame(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            validator.reset()
                     .intPositive('x', data.x, { optional: true })
                     .intPositive('y', data.y, { optional: true })
                     .intPositive('width', data.width, { optional: true })
                     .intPositive('height', data.height, { optional: true })
                     .intPositive('centerX', data.centerX, { optional: true })
                     .intPositive('centerY', data.centerY, { optional: true })
                     .intPositive('time', data.time, { optional: true });

            ok = !validator.errors();
            val = validator.valid();
        }

        return {
            data: val,
            valid: ok
        };
    }


} (window.gc));
