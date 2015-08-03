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
            'strNotEmpty'   : validatorStrNotEmpty,
            'callback'      : validatorCallback,
            'enumerated'    : validatorEnumerated,
            'textStyle'     : validatorTextStyle,
            'ninePatchData' : validatorNinePatchData
        };

    // declare the different validators object used by each class
    gc.validatorDefinitions = {
        Animation: gc.util.extend({
                'animationFrame': validatorAnimationFrame
            }, basicValidators),
        FPS: basicValidators,
        ResourceManager: gc.util.extend({
                'resourceDefinition': validatorResourceDefinition
            }),
        XHR: basicValidators,
        Text: gc.util.extend({
            'textStyle': validatorTextStyle
        }, basicValidators),
        Drawable: basicValidators,
        NinePatch: gc.util.extend({
            'ninePatchData': validatorNinePatchData
        }, basicValidators)
    };

    // validator object used to validate other objects
    var _validator = new gc.Validator({ validators: basicValidators });

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
    function validatorStrNotEmpty(data, options) {
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
            _validator.reset()
                      .intPositive('x', data.x, { optional: true })
                      .intPositive('y', data.y, { optional: true })
                      .intPositive('width', data.width, { optional: true })
                      .intPositive('height', data.height, { optional: true })
                      .intPositive('centerX', data.centerX, { optional: true })
                      .intPositive('centerY', data.centerY, { optional: true })
                      .intPositive('time', data.time, { optional: true });

            ok = !_validator.errors();
            val = _validator.valid();
        }

        return {
            data: val,
            valid: ok
        };
    }

    ////////////////////////////////
    // ResourceManager Validators //
    ////////////////////////////////

    /*
     *
     */
    function validatorResourceDefinition(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            _validator.reset()
                      .strNotEmpty('src', data.src)
                      .intPositive('size', data.size, { optional: true });

            ok = !_validator.errors();
            val = _validator.valid();
        }

        return {
            data: val,
            valid: ok
        };
    }

    /////////////////////
    // Text Validators //
    /////////////////////

    /*
     *
     */
    function validatorTextStyle(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            _validator.reset()
                      .strNotEmpty("font", data.font, { optional: true })
                      .bool("fill", data.fill, { optional: true })
                      .strNotEmpty("fillStyle", data.fillStyle, { optional: true })
                      .bool("stroke", data.stroke, { optional: true })
                      .strNotEmpty("strokeStyle", data.strokeStyle, { optional: true })
                      .intPositive("lineMargin", data.lineMargin, { optional: true })
                      .intPositive("pause", data.pause, { optional: true });

            ok = !_validator.errors();
            val = _validator.valid();
        }

        return {
            data: val,
            valid: ok
        };
    }

    //////////////////////////
    // NinePatch Validators //
    //////////////////////////

    /*
     *
     */
    function validatorNinePatchData(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            _validator.reset()
                      .strNotEmpty('src', data.src)
                      .intPositive('size', data.size, { optional: true })
                      .intPositive('topLeftX', data.topLeftX)
                      .intPositive('topLeftY', data.topLeftY)
                      .intPositive('topLeftW', data.topLeftW)
                      .intPositive('topLeftH', data.topLeftH)
                      .intPositive('bottomRightX', data.bottomRightX)
                      .intPositive('bottomRightH', data.bottomRightH)
                      .intPositive('bottomRightW', data.bottomRightW)
                      .intPositive('bottomRightH', data.bottomRightH);

            ok = !_validator.errors();
            val = _validator.valid();

        } else if(gc.util.isArray(data)) {
            if(data.length === 9 || data.length === 10) {
                _validator.reset()
                          .strNotEmpty('src', data[0])
                          .intPositive('size', data[9], { optional: true })
                          .intPositive('topLeftX', data[1])
                          .intPositive('topLeftY', data[2])
                          .intPositive('topLeftW', data[3])
                          .intPositive('topLeftH', data[4])
                          .intPositive('bottomRightX', data[5])
                          .intPositive('bottomRightH', data[6])
                          .intPositive('bottomRightW', data[7])
                          .intPositive('bottomRightH', data[8]);

                ok = !_validator.errors();
                val = _validator.valid();
            }
        }

        return {
            data: val,
            valid: ok
        };
    }


} (window.gc));
