;(function(window, document, gc, undefined) {
    "use strict";

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.FPS
     * @public
     */
    var VERSION = "1.0.0";


    /**
     * FPS for measuring Frames per Second.
     *
     * @param {Object}                                     options List of options to override
     * @param {Number} [options.updateDelay=1000]          Time between updates (in milliseconds)
     * @param {String} [options.font=12 px Arial]          style used by {@link FPS#draw}
     * @param {String} [options.fillStyle=#FFFF00]         font color style used by {@link draw}
     * @param {Function} [options.update=undefined]        function called when the fps counter is updated
     * @param {Number} [options.x=0]                       x-position for the text, used by {@link draw}
     * @param {Number} [options.y=0]                       y-position for the text, used by {@link draw}
     * @param {gc.Align} [options.align=gc.Align.TOP_LEFT] alineation for the text, used by {@link draw}
     *
     * @requires gc.Util
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var FPS = function(options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _nextUpdateTime = 0,        // next time the _fps value will be updated
            _fpsCount = 0,              // count of fps for this update
            _fps,                       // cached fps until the next update
            _options = {                // {@see constructor}
                updateDelay: 1000,
                update: undefined,
                font: "12px Arial",
                fillStyle: "#FFFF00",
                x: 0,
                y: 0,
                align: gc.Align.TOP_LEFT
            };

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new instance
         *
         * @private
         */
        function _construct(options) {
            gc.util.extend(_options, options);
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Options getter/setter.
         * If only <var>key</var> is specified, acts as a getter
         * If <var>value</var> is specified too, acts as a setter
         *
         * @param {String} key   Name of the option to get/set
         * @param {mixed}  value New value for the option specified by key
         *
         * @return {this|mixed} this to allow chaining for the setter, the asked value for the getter
         * @public
         */
        this.option = function option(key, value) {
            switch(arguments.length) {
                case 1:
                    return _options[key];
                    break;

                case 2:
                    _options[key] = value;
                    return this;
                    break;

                default:
                    throw "Wrong Parameters";
                    break;
            }
        };

        /**
         * Update the FPS.
         * Needed to be called in each frame of the main loop.
         *
         * @param  {DOMHighResTimeStamp} now milliseconds of the current time
         * @return {this}                Self object for allowing chaining
         *
         * @public
         */
        this.update = function update(now) {
            _fpsCount++;

            if(_nextUpdateTime < now)
            {
                _nextUpdateTime += _options.updateDelay;
                _fps = _fpsCount;
                _fpsCount = 0;

                if(_options.update) {
                    _options.update(_fps);
                }
            }

            return this;
        };

        /**
         * Get the most updated count of FPS
         *
         * @return {Integer} last updated FPS count
         * @public
         */
        this.getFPS = function getFPS() {
            return _fps;
        };

        /**
         * Draw a text with the most recent calculated FPS
         *
         * @param  {CanvasRenderingContext2D} ctx Where to draw
         * @return {this}                     Self object for allowing chaining
         *
         * @public
         */
        this.draw = function draw(ctx) {
            var text,
                textSize,
                textPosition,
                oldFillStyle = ctx.fillStyle,
                oldFont = ctx.font;

            ctx.font = _options.font;
            ctx.fillStyle = _options.fillStyle;

            text = _fps + " fps";
            textSize = ctx.measureText(text);
            textPosition = gc.util.alignPosition(_options.align, textSize.width, 10, _options.x, _options.y, 0, 10);
            ctx.fillText(text, textPosition.x, textPosition.y);

            ctx.font = oldFont;
            ctx.fillStyle = oldFillStyle;

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
    gc.FPS = FPS;
    gc.util.defineConstant(gc.FPS, "VERSION", VERSION);

} (window, document, window.gc));
