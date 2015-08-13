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
     * @memberOf gc.Canvas2D
     * @public
     */
    var VERSION = "0.2.0";

    ///////////////////////////
    // STATIC PUBLIC METHODS //
    ///////////////////////////

    /**
     * Decorate a CanvasRenderingContext2D with extra methods
     *
     * @param   {CanvasRenderingContext2D} ctx Canvas 2D context to decorate
     * @return  {CanvasRenderingContext2D}     Decorated context
     *
     * @private
     */
    function _decoratedContext(ctx) {

        /**
         * Browser-compatible version of the w3 CanvasRenderingContext2D#imageSmoothing variable,
         * in form of function
         *
         * @param  {boolean} enabled true to enable antialiasing, false to disable it
         * @public
         */
        ctx.setImageSmoothing = function setImageSmoothing(enabled) {
            if(ctx.imageSmoothingEnabled !== undefined) {
                ctx.imageSmoothingEnabled = enabled;
            } else if(ctx.webkitImageSmoothingEnabled !== undefined) {
                ctx.webkitImageSmoothingEnabled = enabled;
            } else if(ctx.mozImageSmoothingEnabled !== undefined) {
                ctx.mozImageSmoothingEnabled = enabled;
            } else if(ctx.msImageSmoothingEnabled !== undefined) {
                ctx.msImageSmoothingEnabled = enabled;
            }
        };

        /**
         * Method to draw all kind of supported images (not only the default ones but also gc.TextureRegion s) too
         * As need to see which kind of image is it, it's better to call the original method (like ctx.drawImage or {@link TextureRegion#draw}) directly
         *
         * @param  {Image|gc.TextureRegion}   image Image or TextureRegion to draw
         * @param  {Number} sx                source image x-offset
         * @param  {Number} sy                source image y-offset
         * @param  {Number} sw                source image width
         * @param  {Number} sh                source image height
         * @param  {Number} dx                destination x-position
         * @param  {Number} dy                destination y-position
         * @param  {Number} dw                destination width
         * @param  {Number} dh                destination height
         * @return {CanvasRenderingContext2D} The own decorated context to allow chaining
         *
         * @public
         */
        ctx.draw = function draw(image, sx, sy, sw, sh, dx, dy, dw, dh) {
            if(image instanceof gc.TextureRegion) {
                switch(arguments.length) {
                    case 3: // draw(img, x, y)
                        ctx.drawImage(
                            image.src,
                            image.offsetX,
                            image.offsetY,
                            image.width,
                            image.height,
                            arguments[1] - image.centerX,
                            arguments[2] - image.centerY,
                            image.width,
                            image.height
                        );
                        break;

                    case 5: // draw(img, x, y, w, h)
                        ctx.drawImage(
                            image.src,
                            image.offsetX,
                            image.offsetY,
                            image.width,
                            image.height,
                            arguments[1] - image.centerX * (arguments[3]/image.width),
                            arguments[2] - image.centerY * (arguments[4]/image.height),
                            arguments[3],
                            arguments[4]
                        );
                        break;

                    case 9: // draw(img, sx, sy, sw, sh, dx, dy, dw, dh)
                        ctx.drawImage(
                            image.src,
                            image.offsetX + arguments[1],
                            image.offsetY + arguments[2],
                            Math.min(arguments[3], image.width - arguments[3]),
                            Math.min(arguments[4], image.height - arguments[4]),
                            arguments[5],
                            arguments[6],
                            arguments[7],
                            arguments[8]
                        );
                        break;

                    default:
                        throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
                }

            } else {
                ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
            }
        };

        return ctx;
    }


    /**
     * Wrapper for Canvas2D objects
     *
     * @params {DOM} [canvas] DOM element of the canvas object. Since 0.2.0, if not specified, a new one will be created.
     *
     * @requires gc.Util
     * @requires gc.Camera2
     * @uses     gc.TextureRegion
     *
     * @constructor
     * @memberOf gc
     * @version 0.2.0
     * @author @danikaze
     */
    var Canvas2D = function(canvas) {


        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _ctx,
            _camera;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(canvas) {
            if(!canvas) {
                canvas = document.createElement("canvas");
            }

            if(!canvas.getContext) {
                throw new gc.exception.NotImplementedException("canvas.getContext is not supported");
            }

            //this.viewport = new gc.Rectangle({ x: 0, y: 0, width: canvas.width, height: canvas.height });
            _ctx = _decoratedContext(canvas.getContext("2d"));
            _camera = new gc.Camera2(this);
            this.updateView();
        };


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Get a decorated CanvasRenderingContext2D of the canvas
         *
         * @return {CanvasRenderingContext2D} Decorated 2D context
         *
         * @public
         */
        this.getContext = function getContext() {
            return _ctx;
        };

        /**
         * Get the associated Canvas DOM element
         *
         * @return {DOM} Canvas associated with this object
         *
         * @public
         * @since  0.2.0
         */
        this.getCanvas = function getCanvas() {
            return _ctx.canvas;
        };

        /**
         * Set the size of the Canvas
         * This method accept two signatures:
         *  1 parameter : get the values of another object with { width, height } properties (such as {@link gc.Size2})
         *  2 parameters: explicit values as (width, height)
         *
         * @return {gc.Canvas2D} Self reference for allowing chaining
         *
         * @public
         * @since 0.2.0
         */
        this.setSize = function setSize() {
            switch(arguments.length) {
                case 1:
                    _ctx.canvas.width = arguments[0].width;
                    _ctx.canvas.height = arguments[0].height;
                    break;

                case 2:
                    _ctx.canvas.width = arguments[0];
                    _ctx.canvas.height = arguments[1];
                    break;

                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }

            return this;
        };

        /**
         * Get the size of the Canvas
         *
         * @return {Object} Current size of the canvas element as {width, height}
         *
         * @public
         */
        this.getSize = function getSize() {
            return {
                width : _ctx.canvas.width,
                height: _ctx.canvas.height
            };
        };

        /**
         * Set the viewport (where to draw) of the canvas
         *
         * @param {gc.Rectangle} viewport Rectangle specifying the canvas region to draw in
         * @param {Number}       [viewport.x=0]                  x-position of the region's offset
         * @param {Number}       [viewport.y=0]                  y-position of the region's offset
         * @param {Number}       [viewport.width=canvas.width]   width of the region
         * @param {Number}       [viewport.height=canvas.height] height of the region
         * @return {gc.Canvas2D}                                 self reference to allow chaining
         *
         * @public
         */
        /*
        this.setViewport = function setCamera(viewport) {
            this.viewport.setPosition(viewport.x || 0, viewport.y || 0);
            this.viewport.setSize(viewport.width || _ctx.canvas.width, viewport.height || _ctx.canvas.height);

            return this;
        };
        */

        /**
         * Set the camera to control the canvas.
         * Usually is not needed because can be edited through {@link gc.Canvas2D#getCamera}
         *
         * @param  {gc.Camera2}  camera New camera to set
         * @return {gc.Canvas2D}        Self reference to allow chaining
         *
         * @public
         */
        this.setCamera = function setCamera(camera) {
            _camera = camera;
            this.updateView();

            return this;
        };

        /**
         * Get the {@link gc.Camera2} associated to the canvas
         *
         * @return {gc.Camera2} Camera of the canvas, which control which part of the world to show
         *
         * @public
         */
        this.getCamera = function getCamera() {
            return _camera;
        };

        /**
         * Update the parameters of the context with the current values of the viewport and the camera.
         * This method is not usually needed to be called manually because it's done when the viewport and the camera
         * are updated via their setters, but it's available in case their values are updated directly
         * (and to povide consistency to the {@link gc.Camera2} methods)
         *
         * @return {gc.Canvas2D} self reference to allow chaining
         *
         * @public
         */
        this.updateView = function updateView() {
            var scaleX = _camera.scale.x,// * (this.viewport.width/_camera.viewport.width),
                scaleY = _camera.scale.y,// * (this.viewport.height/_camera.viewport.height),
                offsetX = -_camera.viewport.x + _camera.center.x,// + this.viewport.x,
                offsetY = -_camera.viewport.y + _camera.center.y;// + this.viewport.y;

            _ctx.setTransform(1, 0, 0, 1, 0, 0);
            // clipping is not supported, so viewport is ignored for now
            //_ctx.canvas.width = _ctx.canvas.width;  // reset all the canvas
            //_ctx.beginPath();
            //_ctx.rect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            //_ctx.clip();

            _ctx.setTransform(1, 0, 0, 1, _camera.center.x, _camera.center.y);
            _ctx.scale(scaleX, scaleY);
            _ctx.rotate(-_camera.angle);
            _ctx.translate(-_camera.center.x + offsetX, -_camera.center.y + offsetY);

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
    gc.Canvas2D = Canvas2D;
    gc.util.defineConstant(gc.Canvas2D, "VERSION", VERSION);

} (window, window.gc));