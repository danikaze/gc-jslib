;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator({ validators: gc.Validator.definitions.Drawable });
    var BOUNDS_STROKESTYLE = "#0f0";
    var BOUNDS_LINE_WIDTH = 1;
    var CENTER_FILLSTYLE = "#f00";
    var CENTER_RADIUS = 2;

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Drawable
     * @public
     */
    var VERSION = "0.2.1";

    /**
     * Class to provide common basic drawing functionality
     *
     * @param {Image}   texture         Source of the image
     * @param {Integer} [w=src.width]   Width of the start of the region
     * @param {Integer} [h=src.height]  height of the start of the region
     * @param {Integer} [x=0]           x-position of the start of the region
     * @param {Integer} [y=0]           y-position of the start of the region
     * @param {Integer} [cx=0]          x-position of the center of the region
     * @param {Integer} [cy=0]          y-position of the center of the region
     *
     * @required gc.Point2
     * @required gc.Size2
     * @requires gc.Util
     *
     * @constructor
     * @memberOf gc
     * @version 0.2.1
     * @author @danikaze
     */
    var Drawable = function(src, w, h, x, y, cx, cy) {

        //////////////////////////
        // PUBLIC INSTANCE VARS //
        //////////////////////////

        var _texture,   // Source of the image
            _size,      // Size of the image
            _offset,    // position of the start of the image
            _center;    // position of the center of the image

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        function _construct(texture, width, height, offsetX, offsetY, centerX, centerY) {
            _texture = texture;
            _size = new gc.Size2(width || texture.width, height || texture.height);
            _offset = new gc.Point2(offsetX || 0, offsetY || 0);
            _center = new gc.Point2(centerX || 0, centerY || 0);

            _validator.reset()
                      .intPositive("width", _size.width)
                      .intPositive("height", _size.height)
                      .intPositive("offsetX", _offset.x)
                      .intPositive("offsetY", _offset.y)
                      .int("centerX", _center.x)
                      .int("centerY", _center.y);

            if(_validator.errors()) {
                throw new gc.exception.WrongSignatureException(_validator.errors());
            }
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Draw the Drawable into a CanvasRenderingContext2D
         * It has the same signatures that {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D|CanvasRenderingContext2D}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.draw = function draw(ctx) {
            switch(arguments.length) {
                case 3: // draw(ctx, x, y)
                    ctx.drawImage(
                        _texture,
                        _offset.x,
                        _offset.y,
                        _size.width,
                        _size.height,
                        arguments[1] - _center.x,
                        arguments[2] - _center.y,
                        _size.width,
                        _size.height
                    );
                    break;

                case 5: // draw(ctx, x, y, w, h)
                    ctx.drawImage(
                        _texture,
                        _offset.x,
                        _offset.y,
                        _size.width,
                        _size.height,
                        arguments[1] - _center.x * (arguments[3]/_size.width),
                        arguments[2] - _center.y * (arguments[4]/_size.height),
                        arguments[3],
                        arguments[4]
                    );
                    break;

                case 9: // draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh)
                    ctx.drawImage(
                        _texture,
                        _offset.x + arguments[1],
                        _offset.y + arguments[2],
                        Math.min(arguments[3], _size.width  - arguments[1]),
                        Math.min(arguments[4], _size.height - arguments[2]),
                        arguments[5] - _center.x * (arguments[7]/_size.width),
                        arguments[6] - _center.y * (arguments[8]/_size.height),
                        arguments[7],
                        arguments[8]
                    );
                    break;

                default:
                    throw "Incorrect number of parameters";
            }

            return this;
        };

        /**
         * Stroke a rectangle as the boundaries of the Drawable element
         * It accept the same parameters as {@link gc.Drawable#draw}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.drawBounds = function drawBounds(ctx) {
            ctx.strokeStyle = BOUNDS_STROKESTYLE;
            ctx.lineWidth = BOUNDS_LINE_WIDTH;

            switch(arguments.length) {
                case 3: // draw(ctx, x, y)
                    ctx.strokeRect(
                        Math.round(arguments[1] - _center.x) - BOUNDS_LINE_WIDTH/2,
                        Math.round(arguments[2] - _center.y) - BOUNDS_LINE_WIDTH/2,
                        _size.width  + BOUNDS_LINE_WIDTH,
                        _size.height + BOUNDS_LINE_WIDTH
                    );
                    break;

                case 5: // draw(ctx, x, y, w, h)
                    ctx.strokeRect(
                        Math.round(arguments[1] - _center.x * (arguments[3]/_size.width))  - BOUNDS_LINE_WIDTH/2,
                        Math.round(arguments[2] - _center.y * (arguments[4]/_size.height)) - BOUNDS_LINE_WIDTH/2,
                        arguments[3],
                        arguments[4]
                    );
                    break;

                case 9: // draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh)
                    ctx.strokeRect(
                        Math.round(arguments[3] - _center.x * (arguments[7]/_size.width))  - BOUNDS_LINE_WIDTH/2,
                        Math.round(arguments[4] - _center.y * (arguments[8]/_size.height)) - BOUNDS_LINE_WIDTH/2,
                        arguments[7],
                        arguments[8]
                    );
                    break;

                default:
                    throw "Incorrect number of parameters";
            }

            return this;
        };

        /**
         * Draw a point at the center of the Drawable element.
         * It accept the same parameters as {@link gc.Drawable#draw}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.drawCenter = function drawCenter(ctx) {
            ctx.fillStyle = CENTER_FILLSTYLE;

            switch(arguments.length) {
                case 3: // draw(ctx, x, y)
                case 5: // draw(ctx, x, y, w, h)
                    ctx.fillRect(arguments[1] - CENTER_RADIUS, arguments[2] - CENTER_RADIUS, CENTER_RADIUS*2+1, CENTER_RADIUS*2+1);
                    break;

                case 9: // draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh)
                    ctx.fillRect(arguments[5] - CENTER_RADIUS, arguments[6] - CENTER_RADIUS, CENTER_RADIUS*2+1, CENTER_RADIUS*2+1);
                    break;

                default:
                    throw "Incorrect number of parameters";
            }

            return this;
        };

        /**
         * Set a new size for the Drawable element.
         * It accepts the same parameters that {@link gc.Size2#set}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.setSize = function setSize(w, h) {
            _size.set.apply(_size, arguments);

            return this;
        };

        /**
         * Get the size of the Drawable element
         *
         * @return {Object} Size as { width, height }
         *
         * @public
         */
        this.getSize = function getSize() {
            return _size.get();
        };

        /**
         * Set a new offset for the Drawable element.
         * It accepts the same parameters that {@link gc.Point2#set}
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.setOffset = function setOffset(x, y) {
            _offset.apply(_offset, arguments);

            return this;
        };

        /**
         * Get the offset of the Drawable element
         *
         * @return {Object} Offset as { x, y }
         *
         * @public
         */
        this.getOffset = function getOffset() {
            return _offset.get();
        };

        /**
         * Set the center of the Drawable object. When calling draw, the center of the object will
         * be placed at the x,y positions. This function has three signatures:
         *  1 parameter : A {@link gc.Align} value to automatically calculate the center position
         *  1 parameter : A {@link gc.Point2} Point2 object to copy the {x, y} from
         *  2 parameters: (centerX, centerY) as explicit values
         *
         * @return {gc.Drawable} Self reference for allowing chaining
         *
         * @public
         */
        this.setCenter = function setCenter() {
            switch(arguments.length) {
                case 1:
                    // setCenter(gc.Point2)
                    if(gc.util.isPlainObject(arguments[0])) {
                        _center.set(arguments[0]);
                        break;
                    }

                    // setCenter(gc.Align)
                    switch(arguments[0]) {
                        case gc.Align.BOTTOM:
                            _center.set(_size.width/2, _size.height);
                            break;

                        case gc.Align.BOTTOM_LEFT:
                            _center.set(0, _size.height);
                            break;

                        case gc.Align.BOTTOM_RIGHT:
                            _center.set(_size.width, _size.height);
                            break;

                        case gc.Align.CENTER:
                            _center.set(_size.width/2, _size.height/2);
                            break;

                        case gc.Align.LEFT:
                            _center.set(0, _size.height/2);
                            break;

                        case gc.Align.RIGHT:
                            _center.set(_size.width, _size.height/2);
                            break;

                        case gc.Align.TOP:
                            _center.set(_size.width/2, 0);
                            break;

                        case gc.Align.TOP_LEFT:
                            _center.set(0, 0);
                            break;

                        case gc.Align.TOP_RIGHT:
                            _center.set(_size.width, 0);
                            break;

                        default:
                            throw gc.exception.WrongDataException("align is not a value of gc.Align");
                    }
                    break;

                // setCenter(x, y)
                case 2:
                    _center.set(arguments[0], arguments[1]);
                    break;

                default:
                    throw new gc.exception.WrongSignatureException("Incorrect number of parameters");
            }

            return this;
        };

        /**
         * Get the center of the Drawable element
         *
         * @return {Object} Center as { x, y }
         *
         * @public
         */
        this.getCenter = function getCenter() {
            return _center.get();
        };

        /**
         * Return an object with the public methods for the Drawable,
         * or extend an {@link obj} if provided
         *
         * @param  {Object} [obj] Object to extend with Drawable methods
         * @return {Object}       List of public methods of the Drawable,
         *                        or the extended Object if provided as parameter
         *
         * @public
         */
        this.drawable = function drawable(obj) {
            var d = {
                draw      : this.draw,
                drawBounds: this.drawBounds,
                drawCenter: this.drawCenter,
                setOffset : this.setOffset,
                getOffset : this.getOffset,
                setSize   : this.setSize,
                getSize   : this.getSize,
                setCenter : this.setCenter,
                getCenter : this.getCenter,
                drawable  : this.drawable
            };

            return obj != null ? gc.util.extend(obj, d)
                               : d;
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
    gc.Drawable = Drawable;
    gc.util.defineConstant(gc.Drawable, "VERSION", VERSION);

} (window, window.gc));
