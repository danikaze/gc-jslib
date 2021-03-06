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
     * @memberOf gc.TextureRegion
     * @public
     */
    var VERSION = "0.2.0";

    /**
     * Description of the class
     *
     * @param {Object}  texture                 Source of the image
     * @param {Integer} [offsetX=0]             X-position of the start of the region
     * @param {Integer} [offsetY=0]             Y-position of the start of the region
     * @param {Integer} [width=texture.width]   Width of the start of the region
     * @param {Integer} [height=texture.height] Height of the start of the region
     * @param {Integer} [centerX=0]             X-position of the center of the region (relative to offsetX)
     * @param {Integer} [centerY=0]             Y-position of the center of the region (relative to offsetY)
     *
     * @requires gc.Util
     *
     * @constructor
     * @memberOf gc
     * @version 0.2.0
     * @author @danikaze
     */
    var TextureRegion = function(texture, offsetX, offsetY, width, height, centerX, centerY) {

        //////////////////////////
        // PUBLIC INSTANCE VARS //
        //////////////////////////

        /** Texture source of the image. */
        this.texture = texture;
        /** x-position of the start of the region. */
        this.offsetX = offsetX || 0;
        /** y-position of the start of the region. */
        this.offsetY = offsetY || 0;
        /** Width of the region */
        this.width = width || texture.width;
        /** Height of the region */
        this.height = height || texture.height;
        /** x-position of the center of the region (relative to offsetX) */
        this.centerX = centerX || 0;
        /** y-position of the center of the region (relative to offsetY) */
        this.centerY = centerY || 0;

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Draw the TextureRegion into a CanvasRenderingContext2D
         *
         * @param  {CanvasRenderingContext2D} ctx Canvas2D context where to draw the TextureRegion
         *
         * @public
         */
        this.draw = function(ctx) {
            switch(arguments.length) {
                case 3: // draw(ctx, x, y)
                    ctx.drawImage(
                        this.texture,
                        this.offsetX,
                        this.offsetY,
                        this.width,
                        this.height,
                        arguments[1] - this.centerX,
                        arguments[2] - this.centerY,
                        this.width,
                        this.height
                    );
                    break;

                case 5: // draw(ctx, x, y, w, h)
                    ctx.drawImage(
                        this.texture,
                        this.offsetX,
                        this.offsetY,
                        this.width,
                        this.height,
                        arguments[1] - this.centerX * (arguments[3]/this.width),
                        arguments[2] - this.centerY * (arguments[4]/this.height),
                        arguments[3],
                        arguments[4]
                    );
                    break;

                case 9: // draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh)
                    ctx.drawImage(
                        this.texture,
                        this.offsetX + arguments[1],    // sx
                        this.offsetY + arguments[2],    // sy
                        Math.min(arguments[3], this.width - arguments[1]),  // sw
                        Math.min(arguments[4], this.height - arguments[2]), // sh
                        arguments[5] - this.centerX * (arguments[7]/this.width),    // dx
                        arguments[6] - this.centerY * (arguments[8]/this.height),   // dy
                        arguments[7],   // dw
                        arguments[8]    // dh
                    );
                    break;

                default:
                    throw "Incorrect number of parameters";
            }
        };

    };


    ///////////////////////////////
    // Export the public objects //
    ///////////////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.TextureRegion = TextureRegion;
    gc.util.defineConstant(gc.TextureRegion, "VERSION", VERSION);

} (window, window.gc));
