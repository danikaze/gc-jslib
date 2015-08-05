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
    var VERSION = "1.0.0";

    /**
     * Description of the class
     *
     * @param {Object}  texture Source of the image
     * @param {Integer} x       x-position of the start of the region
     * @param {Integer} y       y-position of the start of the region
     * @param {Integer} w       Width of the start of the region
     * @param {Integer} h       height of the start of the region
     *
     * @requires gc.Util
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var TextureRegion = function(texture, x, y, w, h) {

        //////////////////////////
        // PUBLIC INSTANCE VARS //
        //////////////////////////

        /** Texture source of the image. */
        this.texture = texture;
        /** x-position of the start of the region. */
        this.offsetX = x;
        /** y-position of the start of the region. */
        this.offsetY = y;
        /** Width of the region */
        this.width = w;
        /** Height of the region */
        this.height = h;
        /** x-position of the center of the region */
        this.centerX = 0;
        /** y-position of the center of the region */
        this.centerY = 0;

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
                        this.offsetX + arguments[1],
                        this.offsetY + arguments[2],
                        Math.min(arguments[3], this.width - arguments[1]),
                        Math.min(arguments[4], this.height - arguments[2]),
                        arguments[5] - this.centerX * (arguments[7]/this.width),
                        arguments[6] - this.centerY * (arguments[8]/this.height),
                        arguments[7],
                        arguments[8]
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
