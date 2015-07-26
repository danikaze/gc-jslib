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
    var VERSION = "1.0.0";

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
         * @param  {Image|gc.TextureRegion} image Image or TextureRegion to draw
         * @param  {Number} sx              source image x-offset
         * @param  {Number} sy              source image y-offset
         * @param  {Number} sw              source image width
         * @param  {Number} sh              source image height
         * @param  {Number} dx              destination x-position
         * @param  {Number} dy              destination y-position
         * @param  {Number} dw              destination width
         * @param  {Number} dh              destination height
         * @return {this}                   The own decorated context to allow chaining
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
                        ctx.drawImage(frame.src, frame.offsetX, frame.offsetY, frame.width/2, frame.height,
                            charX-frame.centerX*2, charY-frame.centerY*2, frame.width, frame.height*2);
                        break;

                    default:
                        throw "Incorrect number of parameters"
                        break;
                }

            } else {
                ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
            }
        }

        return ctx;
    };


    /**
     * Wrapper for Canvas2D objects
     *
     * @params {DOM} canvas DOM element of the canvas object
     *
     * @requires gc.Util
     * @uses     gc.TextureRegion
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Canvas2D = function(canvas) {


        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _ctx;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        function _construct(canvas) {
            if(!canvas) {
                throw new gc.exception.WrongSignatureException("canvas is not specified");
            }

            if(!canvas.getContext) {
                throw new gc.exception.NotImplementedException("canvas.getContext is not supported");
            }

            _ctx = canvas.getContext("2d");
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
            return _decoratedContext(_ctx);
        };


        // call the constructor after setting all the methods
        _construct.apply(this, arguments);
    }


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
