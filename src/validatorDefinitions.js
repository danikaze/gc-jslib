/**
 * List of validators used by gc.Validator
 */
(function (gc, undefined)
{
    'use strict';

    // basic data validators
    gc.Validator.definitions = {
        'bool'                          : validatorBool,
        'int'                           : validatorInt,
        'intPositive'                   : validatorIntPositive,
        'flt'                           : validatorFlt,
        'fltPositive'                   : validatorFltPositive,
        'str'                           : validatorStr,
        'strNotEmpty'                   : validatorStrNotEmpty,
        'callback'                      : validatorCallback,
        'enumerated'                    : validatorEnumerated,
        'defined'                       : validatorDefined,
        'animationFrame'                : validatorAnimationFrame,
        'resourceDefinition'            : validatorResourceDefinition,
        'textStyle'                     : validatorTextStyle,
        'ninePatchData'                 : validatorNinePatchData,
        'implementsInputManagerListener': validatorImplementsInputManagerListener,
        'parallaxLayer'                 : validatorParallaxLayer,
        'buttonStyle'                   : validatorButtonStyle
    };

    // validator object used to validate other objects
    var _validator = new gc.Validator();

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
    function validatorFlt(data, options) {
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
    function validatorFltPositive(data, options) {
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
        if(!options || !gc.util.isPlainObject(options.enumerated)) {
            throw new gc.exception.WrongParametersException('options.enumerated is not an Object');
        }

        var val = null,
            ok = false,
            i;

        for(i in options.enumerated) {
            if(!options.strict && data == options.enumerated[i] || options.strict && data === options.enumerated[i]) {
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

    /*
     * Just check that the data exists (even if it's 0, "" or null)
     */
    function validatorDefined(data, options) {
        return {
            data: data,
            valid: data !== undefined
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
                      .flt("lineMargin", data.lineMargin, { optional: true })
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
                      .defined('texture', data.texture)
                      .intPositive('topLeftX', data.topLeftX)
                      .intPositive('topLeftY', data.topLeftY)
                      .intPositive('topLeftW', data.topLeftW)
                      .intPositive('topLeftH', data.topLeftH)
                      .intPositive('bottomRightX', data.bottomRightX)
                      .intPositive('bottomRightY', data.bottomRightY)
                      .intPositive('bottomRightW', data.bottomRightW)
                      .intPositive('bottomRightH', data.bottomRightH);

            ok = !_validator.errors();
            val = _validator.valid();

        } else if(gc.util.isArray(data)) {
            if(data.length === 9 || data.length === 10) {
                _validator.reset()
                          .defined('texture', data[0])
                          .intPositive('topLeftX', data[1])
                          .intPositive('topLeftY', data[2])
                          .intPositive('topLeftW', data[3])
                          .intPositive('topLeftH', data[4])
                          .intPositive('bottomRightX', data[5])
                          .intPositive('bottomRightY', data[6])
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

    /////////////////////////
    // Parallax Validators //
    /////////////////////////

    /*
     * @require gc.TextureRegion
     */
    function validatorParallaxLayer(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            _validator.reset()
                      .int("startX", data.startX)
                      .int("startY", data.startY)
                      .int("endX", data.endX)
                      .int("endY", data.endY);

            ok = !_validator.errors() && data.texture != null;
            val = _validator.valid();

            if(ok) {
                val.texture = data.texture instanceof Image ? new gc.TextureRegion(data.texture)
                                                            : data.texture;
            }
        }

        return {
            data: val,
            valid: ok
        };
    }

    ///////////////////////
    // Button Validators //
    ///////////////////////

    /*
     * @require gc.NinePatch
     */
    function validatorButtonStyle(data, options) {
        var val = null,
            ok = false;

        if(gc.util.isPlainObject(data)) {
            if(data.normal instanceof gc.NinePatch &&
               data.normal instanceof gc.NinePatch &&
               data.normal instanceof gc.NinePatch &&
               data.normal instanceof gc.NinePatch) {

                ok = true;
                val = {
                    normal: data.normal,
                    hover : data.hover,
                    select: data.select,
                    click : data.click
                };

            } else {
                val = {};

                if(data.normal instanceof Image) {
                    val.normal = new gc.TextureRegion(data.normal);

                } else if(data.normal instanceof gc.TextureRegion) {
                    val.normal = data.normal;
                }

                if(data.hover instanceof Image) {
                    val.hover = new gc.TextureRegion(data.hover);

                } else if(data.hover instanceof gc.TextureRegion) {
                    val.hover = data.hover;
                }

                if(data.select instanceof Image) {
                    val.select = new gc.TextureRegion(data.select);

                } else if(data.select instanceof gc.TextureRegion) {
                    val.select = data.select;
                }

                if(data.click instanceof Image) {
                    val.click = new gc.TextureRegion(data.click);

                } else if(data.click instanceof gc.TextureRegion) {
                    val.click = data.click;
                }

                ok = val.normal instanceof gc.TextureRegion &&
                     val.hover instanceof gc.TextureRegion &&
                     val.select instanceof gc.TextureRegion &&
                     val.click instanceof gc.TextureRegion;
            }
        }

        return {
            data: val,
            valid: ok
        };
    }


    //////////////////////////
    // Interface Validators //
    //////////////////////////

    /*
     *
     */
    function validatorImplementsStage(data, options) {
        var ok = data &&
                 gc.util.isFunction(data.key) &&
                 gc.util.isFunction(data.touch) &&
                 gc.util.isFunction(data.mouse) &&
                 gc.util.isFunction(data.update) &&
                 gc.util.isFunction(data.draw) &&
                 data.camera instanceof gc.Camera2;

        return {
            data : data,
            valid: ok
        };
    }

    /*
     *
     */
    function validatorImplementsInputManagerListener(data, options) {
        var ok = data &&
                 gc.util.isFunction(data.key) &&
                 gc.util.isFunction(data.touch) &&
                 gc.util.isFunction(data.mouse);

        return {
            data : data,
            valid: ok
        };
    }

    /*
     *
     */
    function validatorImplementsActor(data, options) {
        var ok = data &&
                 gc.util.isFunction(data.update) &&
                 gc.util.isFunction(data.draw);

        return {
            data : data,
            valid: ok
        };
    }

} (window.gc));