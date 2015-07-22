/**
 * List of validators used by gc.Validator
 */
(function (gc, undefined)
{
    'use strict';

    gc.validatorDefinitions = {
        'bool'      : validatorBool,
        'num'       : validatorNum,
        'str'       : validatorStr,
        'callback'  : validatorCallback,
        'enumerated': validatorEnumerated
    };

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
     * Generic Number validator
     */
    function validatorNum(data, options) {
        var val = parseInt(data),
            ok = !isNaN(val) && (!options.strict || typeof(data) === 'number');

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
            ok = data != null && (!options.strict || typeof(data) === 'string');

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
            valid: typeof(data) === 'function'
        };
    }

    /*
     * Enum Validator.
     * Check that data is one of the values inside the definition of options.enum
     */
    function validatorEnumerated(data, options) {
        if(!options || !$.isPlainObject(options.enumerated))
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


} (window.gc));
