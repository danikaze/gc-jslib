;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();

    ////////////////////////////
    // STATIC PRIVATE METHODS //
    ////////////////////////////

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    ///////////////////////////
    // STATIC PUBLIC METHODS //
    ///////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.ProgressBar
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * A very simple progress bar based on two images: done and pending
     *
     * @param {Number}           x                    X position of the top-left corner of the ProgressBar.
     * @param {Number}           y                    Y position of the top-left corner of the ProgressBar.
     * @param {Object}           style                ProgressBar style definition.
     * @param {gc.TextureRegion} style.pending        Image to use as background of the ProgressBar.
     * @param {gc.TextureRegion} style.done           Image used to the done progress.
     * @param {Object}           style.barPosition    Offset as {x, y} inside the {@link style.pending} where the style.done image should be drawn.
     * @param {Object}           [options]            Other options of the ProgressBar.
     * @param {Float}            [options.progress]   Initial progress of the ProgressBar when created, as a float between [0, 1].
     * @param {Integer}          [options.updateTime] Time for the animation when updating the ProgressBar, in milliseconds.
     *
     * @requires gc.Util
     * @requires gc.Validator
     * @requires gc.Deferred
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var ProgressBar = function(x, y, style, options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _deferred,
            _position,
            _fbo,
            _style,
            _options,
            _progress;

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(x, y, style, options) {
            var valid;

            options = gc.util.extend({
                progress: 0,
                updateTime: 500
            }, options);

            // data validation :start
            _validator.reset()
                      .int("x", x)
                      .int("y", y);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            valid = _validator.valid();
            _position = new gc.Point2(valid.x, valid.y);

            _validator.reset()
                      .int("barPositionX", style.barPosition.x)
                      .int("barPositionY", style.barPosition.y);

            if(_validator.errors() || !(style.pending instanceof gc.TextureRegion) || !(style.done instanceof gc.TextureRegion)) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            valid = _validator.valid();
            _style = {
                done       : style.done,
                pending    : style.pending,
                barPosition: { x: valid.barPositionX, y: valid.barPositionY }
            };

            _validator.reset()
                      .flt("progress", options.progress)
                      .int("updateTime", options.updateTime);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            _options = _validator.valid();
            // data validation :end

            _deferred = new gc.Deferred();
            _deferred.promise(this);

            this.getPosition = _position.get.bind(_position);

            _progress = new gc.Easing(0, _options.progress, _options.updateTime, gc.Easing.EaseType.INOUT_CUBIC);

            _progress.done(_updateDeferred)
                     .progress(_updateDeferred);
        };

        /**
         * Update the internal deferred based on the {@link _progress} updates
         *
         * @param   {Float} progress Progress shown on the image (not the desired one)
         *
         * @private
         */
        var _updateDeferred = function(progress) {
            if(progress === 1) {
                _deferred.resolve(1);
            } else {
                _deferred.notify(progress);
            }
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Update the ProgressBar {@link delta} milliseconds.
         *
         * @param  {Number}         delta Milliseconds to update
         * @return {gc.ProgressBar}       Self reference for chaining
         *
         * @public
         */
        this.update = function update(delta) {
            _progress.update(delta);

            return this;
        };

        /**
         * Draw the ProgressBar in the specified Canvas context
         *
         * @param  {CanvasRenderingContext2D} ctx Canvas2D context where to draw the ProgressBar
         * @return {gc.ProgressBar}               Self reference for chaining
         *
         * @public
         */
        this.draw = function draw(ctx) {
            var w = _style.done.width * _progress.getValue();

            _style.pending.draw(ctx, _position.x, _position.y);
            _style.done.draw(ctx, 0, 0, w, _style.done.height, _position.x + _style.barPosition.x, _position.y + _style.barPosition.y, w, _style.done.height);
        };

        /**
         * Set the progress of the ProgressBar
         *
         * @param  {Float}          n Progress between 0 and 1
         * @return {gc.ProgressBar}   Self reference for chaining
         *
         * @public
         */
        this.setProgress = function setProgress(n) {
            _progress.setValue(_progress.getValue(), gc.util.clamp(n, 0, 1))
                     .begin();

            return this;
        };

        /**
         * Get the current progress
         *
         * @return {Float} Progress between 0 and 1
         *
         * @public
         */
        this.getProgress = function getProgress() {
            return _progress.getValue();
        };

        /**
         * Get the current position of the ProgressBar
         *
         * @param  {Number}         x X position of the top-left corner
         * @param  {Number}         y Y position of the top-left corner
         * @return {gc.ProgressBar}   Self reference for chaining
         *
         * @public
         */
        this.setPosition = function setPosition(x, y) {
            _position.set(x, y);

            return this;
        };

        /**
         * Get the size of the ProgressBar
         *
         * @return {Object} size as {width, height}
         *
         * @public
         */
        this.getSize = function getSize() {
            return {
                width : _style.pending.width,
                height: _style.pending.height
            };
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
    gc.ProgressBar = ProgressBar;
    gc.util.defineConstant(gc.ProgressBar, "VERSION", VERSION);

} (window, window.gc));
