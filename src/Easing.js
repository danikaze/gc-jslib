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
     * @memberOf gc.Easing
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Type of easing functions
     *
     * @type {Number}
     * @readOnly
     * @memberOf gc.Easing
     * @public
     */
    var EaseType = {
        LINEAR          : 1,

        IN_QUAD         : 2,
        OUT_QUAD        : 3,
        INOUT_QUAD      : 4,

        IN_CUBIC        : 5,
        OUT_CUBIC       : 6,
        INOUT_CUBIC     : 7,

        IN_QUART        : 8,
        OUT_QUART       : 9,
        INOUT_QUART     : 10,

        IN_QUINT        : 11,
        OUT_QUINT       : 12,
        INOUT_QUINT     : 13,

        IN_EXPO         : 14,
        OUT_EXPO        : 15,
        INOUT_EXPO      : 16,

        IN_CIRC         : 17,
        OUT_CIRC        : 18,
        INOUT_CIRC      : 19,

        IN_SINE         : 20,
        OUT_SINE        : 21,
        INOUT_SINE      : 22,

        IN_BACK         : 23,
        OUT_BACK        : 24,
        INOUT_BACK      : 25,

        IN_ELASTIC      : 26,
        OUT_ELASTIC     : 27,
        INOUT_ELASTIC   : 28,

        IN_BOUNCE       : 29,
        OUT_BOUNCE      : 30,
        INOUT_BOUNCE    : 31
    };


    ////////////////////////////
    // ESTATIC PUBLIC METHODS //
    ////////////////////////////

    /**
     * Linear interpolation.
     * Actually does no easing, but it's called easeLinear so all the function start the same way
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeLinear(t, b, c, d)
    {
        return c*t/d + b;
    }

    /**
     * Quadratic-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInQuad(t, b, c, d)
    {
        return c*(t/=d)*t + b;
    }

    /**
     * Quadratic-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutQuad(t, b, c, d)
    {
        return -c *(t/=d)*(t-2) + b;
    }

    /**
     * Quadratic-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutQuad(t, b, c, d)
    {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    }

    /**
     * Cubic-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInCubic(t, b, c, d)
    {
        return c*(t/=d)*t*t + b;
    }

    /**
     * Cubic-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutCubic(t, b, c, d)
    {
        return c*((t=t/d-1)*t*t + 1) + b;
    }

    /**
     * Cubic-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutCubic(t, b, c, d)
    {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    }

    /**
     * Quart-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInQuart(t, b, c, d)
    {
        return c*(t/=d)*t*t*t + b;
    }

    /**
     * Quart-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutQuart(t, b, c, d)
    {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    }

    /**
     * Quart-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutQuart(t, b, c, d)
    {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    }

    /**
     * Quint-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInQuint(t, b, c, d)
    {
        return c*(t/=d)*t*t*t*t + b;
    }

    /**
     * Quint-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutQuint(t, b, c, d)
    {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    }

    /**
     * Quint-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutQuint(t, b, c, d)
    {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    }

    /**
     * Expo-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInExpo(t, b, c, d)
    {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    }

    /**
     * Expo-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutExpo(t, b, c, d)
    {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }

    /**
     * Expo-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutExpo(t, b, c, d)
    {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }

    /**
     * Circ-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInCirc(t, b, c, d)
    {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    }

    /**
     * Circ-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutCirc(t, b, c, d)
    {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    }

    /**
     * Circ-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutCirc(t, b, c, d)
    {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    }

    /**
     * Sine-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInSine(t, b, c, d)
    {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    }

    /**
     * Sine-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutSine(t, b, c, d)
    {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    }

    /**
     * Sine-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutSine(t, b, c, d)
    {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    }

    /**
     * Back-in interpolation
     *
     * @param  {Number} t          Current time
     * @param  {Float}  b          Begin value
     * @param  {Float}  c          Change value (end-begin)
     * @param  {Number} d          Duration of the total ease
     * @param  {Number} [s1.70158] Parameter of backing
     * @return {Float}             Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInBack(t, b, c, d, s)
    {
        if (s == null) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    }

    /**
     * Back-out interpolation
     *
     * @param  {Number} t          Current time
     * @param  {Float}  b          Begin value
     * @param  {Float}  c          Change value (end-begin)
     * @param  {Number} d          Duration of the total ease
     * @param  {Number} [s1.70158] Parameter of backing
     * @return {Float}             Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutBack(t, b, c, d, s)
    {
        if (s == null) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }

    /**
     * Back-in-out interpolation
     *
     * @param  {Number} t          Current time
     * @param  {Float}  b          Begin value
     * @param  {Float}  c          Change value (end-begin)
     * @param  {Number} d          Duration of the total ease
     * @param  {Number} [s1.70158] Parameter of backing
     * @return {Float}             Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutBack(t, b, c, d, s)
    {
        if (s == null) s = 1.70158;
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }

    /**
     * Elastic-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInElastic(t, b, c, d)
    {
        var s=1.70158, p=0, a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    }

    /**
     * Elastic-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutElastic(t, b, c, d)
    {
        var s=1.70158, p=0, a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    }

    /**
     * Elastic-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutElastic(t, b, c, d)
    {
        var s=1.70158, p=0, a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    }

    /**
     * Bounce-in interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInBounce(t, b, c, d)
    {
        return c - easeOutBounce(d-t, 0, c, d) + b;
    }

    /**
     * Bounce-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeOutBounce(t, b, c, d)
    {
        if ((t/=d) < (1/2.75))   return c*(7.5625*t*t) + b;
        else if (t < (2/2.75))   return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        else if (t < (2.5/2.75)) return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        else                     return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }

    /**
     * Bounce-in-out interpolation
     *
     * @param  {Number} t Current time
     * @param  {Float}  b Begin value
     * @param  {Float}  c Change value (end-begin)
     * @param  {Number} d Duration of the total ease
     * @return {Float}    Value of the interpolation for that time
     *
     * @public
     * @memberOf gc.Easing
     */
    function easeInOutBounce(t, b, c, d)
    {
        if (t < d/2) return easeInBounce(t*2, 0, c, d) * .5 + b;
        else         return easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }

    /**
     * Interpolate a number between an initial value and an end value.
     * Easing function based on Robert Penner and Timothee Groleau's code.
     * {@link http://robertpenner.com/easing/easing_demo.html}
     * {@link http://timotheegroleau.com/Flash/experiments/easing_function_generator.htm}
     *
     * @param {Float}              [begin=0]               Initial value
     * @param {Float}              [end=1.0]               End value
     * @param {Number}             [duration=1000]         Required time (in ms.) to reach {@link end} starting from {@link start}
     * @param {gc.Easing.EaseType} [ease=gc.Easing.LINEAR] Type of Easing function to use
     * @param {Number}             [delay=0]               Time before start, in ms.
     *
     * @requires gc.Util
     * @requires gc.Deferred
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Easing = function(begin, end, duration, ease, delay) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _deferred,
            _current    = 0,
            _begin      = 0,
            _end        = 1,
            _change     = 0,
            _duration   = 100,
            _elapsed    = 0,
            _ease       = EaseType.LINEAR,
            _delay      = 0,
            _updateFunc = easeLinear;

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        function _construct(begin, end, duration, ease, delay) {
            if(typeof begin !== "undefined") {
                _begin = begin;
            }
            if(typeof end !== "undefined") {
                _end = end;
            }
            if(typeof duration !== "undefined") {
                _duration = duration;
            }
            if(typeof ease !== "undefined") {
                this.setEaseType(ease);
            }
            if(typeof delay !== "undefined") {
                _delay = delay;
            }

            _change  = _end - _begin;
            _current = _begin;
            _elapsed = 0;

            _deferred = new gc.Deferred();
            _deferred.promise(this);

        };


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Update the interpolation adding a delta to the elapsed time and calculating the new value.
         * If the elapsed time reaches the Easing duration, the promise will be resolved to the end value.
         * If not, it will be updated with the current value if there's any change.
         *
         * @param  {Number}    delta Time elapsed
         * @return {gc.Easing}       Self reference for allowing chaining
         *
         * @public
         */
        this.update = function update(delta) {
            _elapsed += delta;

            if(_elapsed < _duration + _delay) {
                if(_elapsed >= _delay) {
                    _current = _updateFunc(_elapsed - _delay, _begin, _change, _duration);
                    _deferred.notify(_current);
                } else {
                    _current = _begin;
                }
            }
            else {
                _current = _end;
                _deferred.resolve(_current);
            }

            return this;
        };

        /**
         * Set the interpolation values to the initial ones.
         * If there were a delay, it will applied again
         *
         * @return {gc.Easing}    Self reference for allowing chaining
         *
         * @public
         */
        this.begin = function begin() {
            _current = _begin;
            _elapsed = 0;
            _deferred.reset();

            return this;
        };

        /**
         * Set the interpolation values to the end ones.
         * It will resolve the promise.
         *
         * @return {gc.Easing}    Self reference for allowing chaining
         *
         * @public
         */
        this.end = function end() {
            _current = _end;
            _elapsed = _duration + _delay + 0.1;
            _deferred.resolve(_current);

            return this;
        };

        /**
         * Reverse the interpolator. The time is preserved but the value will probably change
         * unless the easing type is {@link gc.Easing.EaseType.LINEAR}
         * Frequently used along with {@link gc.Easing#reverse}
         *
         * @return {gc.Easing}    Self reference for allowing chaining
         *
         * @public
         */
        this.reverse = function reverse() {
            var tmp = _begin;
            _begin = _end;
            _end = tmp;
            _change = _end - _begin;
            _deferred.reset();

            return this;
        };

        this.getBegin = function getBegin() {
            return _begin;
        };

        this.getEnd = function getEnd() {
            return _end;
        };

        /**
         * Set the initial and ending values, and reset the interpolation
         *
         * @param  {Float}     begin new starting value
         * @param  {Float}     end   new ending value
         * @return {gc.Easing}       Self reference for allowing chaining
         *
         * @public
         */
        this.setValue = function setValue(begin, end) {
            if(typeof begin !== "undefined") {
                _begin = begin;
            }
            if(typeof end !== "undefined") {
                _end = end;
            }

            _change = end - begin;
            _deferred.reset();

            return this;
        };

        /**
         * Get the current value based on the Easing status
         *
         * @return {Float} Current value
         *
         * @public
         */
        this.getValue = function getValue() {
            return _current;
        };

        /**
         * Set the elapsed time of the interpolator.
         * The current value will updated via {@link gc.Easing#update}. This means that the
         * promise will be affected too, being updated or resolved if needed.
         *
         * @param  {Number}    time New elapsed time
         * @return {gc.Easing}      Self reference for allowing chaining
         *
         * @public
         */
        this.setElapsed = function setElapsed(time) {
            _elapsed = time;
            this.update(0);
        };

        /**
         * Get the elapsed time (without incluying the delay)
         *
         * @return {Number} Elapsed time in ms.
         *
         * @public
         */
        this.getElapsed = function getElapsed() {
            return _elapsed;
        };

        /**
         * Set the duration of the object.
         * The current value will not change. That means that if the elapsed time was already in the 50%,
         * it will stay in the 50% (after the delay if any)
         *
         * @param {Number} time New duration in ms.
         * @return {gc.Easing}  Self reference for allowing chaining
         *
         * @public
         */
        this.setDuration = function setDuration(time) {
            _elapsed = _delay + (_elapsed - _delay)/_duration * time;
            _duration = _duration;

            return this;
        };

        /**
         * Get the total duration (without the delay) of the Easing
         *
         * @return {Number} Duration in ms. without including the delay time
         *
         * @public
         */
        this.getDuration = function getDuration() {
            return _duration;
        };

        /**
         * Set the new time to wait before starting the interpolation.
         * If it has already started, the new _delay will be set but it will have no impact in the current values
         *
         * @param  {Number} time New delay in ms.
         *
         * @public
         */
        this.setDelay = function setDelay(time) {
            if(_elapsed > _delay) {
                _elapsed += time - _delay;
            }

            _delay = time;
        }

        /**
         * Get the current time to wait before starting the interpolation
         *
         * @return {Number} Delay time in ms.
         *
         * @public
         */
        this.getDelay = function getDelay() {
            return _delay;
        }

        /**
         * Set the ease function for the interpolation.
         * The current value will NOT change until the next {@link gc.Easing#update}
         *
         * @param  {gc.Easing.EaseType} ease New type of easing
         * @return {gc.Easing}               Self reference for allowing chaining
         *
         * @public
         */
        this.setEaseType = function setEaseType(ease) {
            _ease = ease;

            switch(_ease) {
                // linear
                case EaseType.LINEAR:
                    _updateFunc = easeLinear;
                    break;

                // quad
                case EaseType.IN_QUAD:
                    _updateFunc = easeInQuad;
                    break;

                case EaseType.OUT_QUAD:
                    _updateFunc = easeOutQuad;
                    break;

                case EaseType.INOUT_QUAD:
                    _updateFunc = easeInOutQuad;
                    break;

                // cubic
                case EaseType.IN_CUBIC:
                    _updateFunc = easeInCubic;
                    break;

                case EaseType.OUT_CUBIC:
                    _updateFunc = easeOutCubic;
                    break;

                case EaseType.INOUT_CUBIC:
                    _updateFunc = easeInOutCubic;
                    break;

                // quart
                case EaseType.IN_QUART:
                    _updateFunc = easeInQuart;
                    break;

                case EaseType.OUT_QUART:
                    _updateFunc = easeOutQuart;
                    break;

                case EaseType.INOUT_QUART:
                    _updateFunc = easeInOutQuart;
                    break;

                // quint
                case EaseType.IN_QUINT:
                    _updateFunc = easeInQuint;
                    break;

                case EaseType.OUT_QUINT:
                    _updateFunc = easeOutQuint;
                    break;

                case EaseType.INOUT_QUINT:
                    _updateFunc = easeInOutQuint;
                    break;

                // expo
                case EaseType.IN_EXPO:
                    _updateFunc = easeInExpo;
                    break;

                case EaseType.OUT_EXPO:
                    _updateFunc = easeOutExpo;
                    break;

                case EaseType.INOUT_EXPO:
                    _updateFunc = easeInOutExpo;
                    break;

                // circ
                case EaseType.IN_CIRC:
                    _updateFunc = easeInCirc;
                    break;

                case EaseType.OUT_CIRC:
                    _updateFunc = easeOutCirc;
                    break;

                case EaseType.INOUT_CIRC:
                    _updateFunc = easeInOutCirc;
                    break;

                // sine
                case EaseType.IN_SINE:
                    _updateFunc = easeInSine;
                    break;

                case EaseType.OUT_SINE:
                    _updateFunc = easeOutSine;
                    break;

                case EaseType.INOUT_SINE:
                    _updateFunc = easeInOutSine;
                    break;

                // back
                case EaseType.IN_BACK:
                    _updateFunc = easeInBack;
                    break;

                case EaseType.OUT_BACK:
                    _updateFunc = easeOutBack;
                    break;

                case EaseType.INOUT_BACK:
                    _updateFunc = easeInOutBack;
                    break;

                // elastic
                case EaseType.IN_ELASTIC:
                    _updateFunc = easeInElastic;
                    break;

                case EaseType.OUT_ELASTIC:
                    _updateFunc = easeOutElastic;
                    break;

                case EaseType.INOUT_ELASTIC:
                    _updateFunc = easeInOutElastic;
                    break;

                // bounce
                case EaseType.IN_BOUNCE:
                    _updateFunc = easeInBounce;
                    break;

                case EaseType.OUT_BOUNCE:
                    _updateFunc = easeOutBounce;
                    break;

                case EaseType.INOUT_BOUNCE:
                    _updateFunc = easeInOutBounce;
                    break;

                default:
                    throw new gc.exception.WrongSignatureException("ease is not a valid EaseType value");
                    break;

            }
            return this;
        };

        /**
         * Get the current ease function type
         *
         * @return {gc.Easing.EaseType} Current Ease function type
         *
         * @public
         */
        this.getEaseType = function getEaseType() {
            return _ease;
        };

        /**
         * Check if the easing has finished or not
         *
         * @return {boolean} true if has finished or false if not
         *
         * @public
         */
        this.hasFinished = function hasFinished() {
            return _elapsed >= _duration + _delay;
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
    gc.Easing = Easing;
    gc.util.defineConstant(gc.Easing, "VERSION", VERSION);
    gc.util.defineConstant(gc.Easing, "EaseType", EaseType);
    gc.Easing.easeLinear        = easeLinear;
    gc.Easing.easeInQuad        = easeInQuad;
    gc.Easing.easeOutQuad       = easeOutQuad;
    gc.Easing.easeInOutQuad     = easeInOutQuad;
    gc.Easing.easeInCubic       = easeInCubic;
    gc.Easing.easeOutCubic      = easeOutCubic;
    gc.Easing.easeInOutCubic    = easeInOutCubic;
    gc.Easing.easeInQuart       = easeInQuart;
    gc.Easing.easeOutQuart      = easeOutQuart;
    gc.Easing.easeInOutQuart    = easeInOutQuart;
    gc.Easing.easeInQuint       = easeInQuint;
    gc.Easing.easeOutQuint      = easeOutQuint;
    gc.Easing.easeInOutQuint    = easeInOutQuint;
    gc.Easing.easeInExpo        = easeInExpo;
    gc.Easing.easeOutExpo       = easeOutExpo;
    gc.Easing.easeInOutExpo     = easeInOutExpo;
    gc.Easing.easeInCirc        = easeInCirc;
    gc.Easing.easeOutCirc       = easeOutCirc;
    gc.Easing.easeInOutCirc     = easeInOutCirc;
    gc.Easing.easeInSine        = easeInSine;
    gc.Easing.easeOutSine       = easeOutSine;
    gc.Easing.easeInOutSine     = easeInOutSine;
    gc.Easing.easeInBack        = easeInBack;
    gc.Easing.easeOutBack       = easeOutBack;
    gc.Easing.easeInOutBack     = easeInOutBack;
    gc.Easing.easeInElastic     = easeInElastic;
    gc.Easing.easeOutElastic    = easeOutElastic;
    gc.Easing.easeInOutElastic  = easeInOutElastic;
    gc.Easing.easeInBounce      = easeInBounce;
    gc.Easing.easeOutBounce     = easeOutBounce;
    gc.Easing.easeInOutBounce   = easeInOutBounce;

} (window, window.gc));
