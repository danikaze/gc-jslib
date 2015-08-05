;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator({ validators: gc.validatorDefinitions.NinePatch });

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
     * @memberOf gc.NinePatch
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Image with stretchable borders.
     * Due to its resizable nature (always requiring a size to be specified to draw)
     * it can't use Drawable as is, but provide some of its methods (with different parameters)
     *
     * @param {Object}  data              Definition of the 9-patch
     * @param {String}  data.texture      Source of the 9-patch image
     * @param {Integer} [data.size]       Size in bytes of the source image
     * @param {Integer} data.topLeftX     X-position where the 9-patch starts in the image
     * @param {Integer} data.topLeftY     Y-position where the 9-patch starts in the image
     * @param {Integer} data.leftTopW     Width of the top-left rectangle
     * @param {Integer} data.leftTopH     Height of the top-left rectangle
     * @param {Integer} data.bottomRightX X-position where the bottom-right rectangle starts in the image
     * @param {Integer} data.bottomRightH Y-position where the bottom-right rectangle starts in the image
     * @param {Integer} data.bottomRightW Width of the bottom-right rectangle
     * @param {Integer} data.bottomRightH Height of the bottom-right rectangle
     * @param {Integer} [width=0]         Width of the image to draw
     * @param {Integer} [height=0]        Height of the start of the region
     * @param {Integer} [cx=0]            X-position of the center of the region
     * @param {Integer} [cy=0]            Y-position of the center of the region
     *
     * @requires gc.Util
     * @requires gc.Validator
     * @requires gc.Point2
     * @requires gc.Size2
     * @requires gc.TextureRegion
     * @uses     gc.exception
     *
     * @todo Use _scale to render the elements by this factor (the draw method works though)
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var NinePatch = function(data, width, height, centerX, centerY, scaleX, scaleY, canvas) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _drawable,
            _fbo,       // canvas to use as FrameBuffer Object
            _scale,     // scale to draw the elements of the Nine Patch
            _parts;     // each part of the image

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        function _construct(data, width, height, centerX, centerY, scaleX, scaleY, canvas) {
            var valid,
                partialDrawable = {};

            // data validation :start
            _validator.reset()
                      .ninePatchData("data",  data)
                      .intPositive("width",   width,   { optional: true, def: 100 })
                      .intPositive("height",  height,  { optional: true, def: 100 })
                      .intPositive("centerX", centerX, { optional: true, def: 0 })
                      .intPositive("centerY", centerY, { optional: true, def: 0 })
                      .intPositive("scaleX",  scaleX,  { optional: true, def: 1 })
                      .intPositive("scaleY",  scaleY,  { optional: true, def: 1 });

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }

            valid = _validator.valid();
            // data validation :end

            _scale = new gc.Point2(valid.scaleX, valid.scaleY);
            _fbo = new gc.Canvas2D(canvas).getContext();

            if(!canvas) {
                _fbo.canvas.width = valid.width;
                _fbo.canvas.height = valid.height;
            }

            _parts = _loadParts(valid.data);

            // create the drawable, but choosing which methods to use
            _drawable = new gc.Drawable(_fbo.canvas, valid.width, valid.height, 0, 0, valid.centerX, valid.centerY);
            _drawable.drawable(partialDrawable);
            this.draw = partialDrawable.draw;
            this.drawBounds = partialDrawable.drawBounds;
            this.drawCenter = partialDrawable.drawCenter;
            this.setCenter = partialDrawable.setCenter;
            this.getCenter = partialDrawable.getCenter;
            this.drawable = partialDrawable.drawable.bind(this);

            _render();
        };

        /**
         * Load the 9 parts as 9 {@link gc.TextureRegion} from the NinePatch data definition
         *
         * @param {Object} data NinePatch definition object
         * @return {Object} Object with the TextureRegions as { topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight }
         *
         * @private
         */
        function _loadParts(data) {
            var centerX = data.topLeftX + data.topLeftW,
                centerY = data.topLeftY + data.topLeftH,
                centerW = data.bottomRightX - data.topLeftX - data.topLeftW,
                centerH = data.bottomRightY - data.topLeftY - data.topLeftH;

            return {
                topLeft    : new gc.TextureRegion(data.texture, data.topLeftX,     data.topLeftY,     data.topLeftW,     data.topLeftH),
                top        : new gc.TextureRegion(data.texture, centerX,           data.topLeftY,     centerW,           data.topLeftH),
                topRight   : new gc.TextureRegion(data.texture, data.bottomRightX, data.topLeftY,     data.bottomRightW, data.topLeftH),
                left       : new gc.TextureRegion(data.texture, data.topLeftX,     centerY,           data.topLeftW,     centerH),
                center     : new gc.TextureRegion(data.texture, centerX,           centerY,           centerW,           centerH),
                right      : new gc.TextureRegion(data.texture, data.bottomRightX, centerY,           data.bottomRightW, centerH),
                bottomLeft : new gc.TextureRegion(data.texture, data.topLeftX,     data.bottomRightY, data.topLeftW,     data.bottomRightH),
                bottom     : new gc.TextureRegion(data.texture, centerX,           data.bottomRightY, centerW,           data.bottomRightH),
                bottomRight: new gc.TextureRegion(data.texture, data.bottomRightX, data.bottomRightY, data.bottomRightW, data.bottomRightH)
            };
        }

        /**
         * Render the 9-patch in the FBO
         *
         * @private
         */
        function _render() {
            var right = _fbo.canvas.width - _parts.bottomRight.width,
                bottom = _fbo.canvas.height - _parts.bottomRight.height,
                centerW = _fbo.canvas.width - _parts.topLeft.width - _parts.bottomRight.width,
                centerH = _fbo.canvas.height - _parts.topLeft.height - _parts.bottomRight.height;

            _parts.topLeft.draw(_fbo,     0,                    0,                     _parts.topLeft.width,     _parts.topLeft.height);
            _parts.top.draw(_fbo,         _parts.topLeft.width, 0,                     centerW,                  _parts.topLeft.height);
            _parts.topRight.draw(_fbo,    right,                0,                     _parts.bottomRight.width, _parts.topLeft.height);
            _parts.left.draw(_fbo,        0,                    _parts.topLeft.height, _parts.topLeft.width,     centerH);
            _parts.center.draw(_fbo,      _parts.topLeft.width, _parts.topLeft.height, centerW,                  centerH);
            _parts.right.draw(_fbo,       right,                _parts.topLeft.height, _parts.bottomRight.width, centerH);
            _parts.bottomLeft.draw(_fbo,  0,                    bottom,                _parts.topLeft.width,     _parts.bottomRight.height);
            _parts.bottom.draw(_fbo,      _parts.topLeft.width, bottom,                centerW,                  _parts.bottomRight.height);
            _parts.bottomRight.draw(_fbo, right,                bottom,                _parts.bottomRight.width, _parts.bottomRight.height);
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Set the size of the NinePatch. The center parts will strech while the borders will preserve the right aspect.
         * If the size is too small, the NinePatch will stay at its minimum size.
         * This method accepts two signatures:
         *     1 argument : a {@link gc.Size2} object
         *     2 arguments: width and height
         *
         * @return {gc.NinePatch} self reference for allowing chaining
         *
         * @public
         */
        this.setSize = function setSize(width, height) {
            if(typeof width === "undefined") {
                throw new gc.exception.WrongSignatureException("width is undefined");
            }

            if(typeof height === "undefined") {
                height = width.height;
                width = width.width;
            }

            width  = Math.max(width,  _parts.topLeft.width  + _parts.bottomRight.width);
            height = Math.max(height, _parts.topLeft.height + _parts.bottomRight.height);

            _fbo.canvas.width = width;
            _fbo.canvas.height = height;
            _drawable.setSize(width, height);
            _render();

            return this;
        };

        /**
         * @return {gc.Size2} Current size of the NinePatch
         *
         * @public
         */
        this.getSize = function getSize() {
            return {
                width : _fbo.canvas.width,
                height: _fbo.canvas.height
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
    gc.NinePatch = NinePatch;
    gc.util.defineConstant(gc.NinePatch, "VERSION", VERSION);

} (window, window.gc));
