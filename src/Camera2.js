;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

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
     * Camera associated to a {@link gc.Canvas2}
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Camera2
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Description of the class
     *
     * @param {gc.Canvas2D} canvas Canvas associated to the camera
     *
     * @requires gc.Util
     * @requires gc.Canvas2
     * @requires gc.Point2
     * @requires gc.Rectangle
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Camera2 = function(canvas) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _canvas;

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(canvas) {
            var canvasSize;

            _canvas = canvas;
            canvasSize = canvas.getSize();
            this.scale = new gc.Point2(1, 1);
            this.center = new gc.Point2(Math.floor(canvasSize.width/2), Math.floor(canvasSize.height/2));
            this.viewport = new gc.Rectangle(canvasSize.width, canvasSize.height, this.center.x, this.center.y);
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Get the canvas associated with this Camera
         *
         * @return {gc.Canvas2D} canvas Canvas controlled by this Camera
         *
         * @public
         */
        this.getCanvas = function getCanvas() {
            return _canvas;
        };

        /**
         * Set the viewport of the Camera and update the canvas and update the canvas context
         *
         * @param  {gc.Rectangle} viewport Viewport of the Camera
         * @return {gc.Camera2}            Self reference to allow chaining
         *
         * @public
         */
        this.setViewport = function setViewport(viewport) {
            this.viewport.setPosition(viewport.x || 0, viewport.y || 0);
            this.viewport.setSize(viewport.width || 0, viewport.height || 0);
            _canvas.updateView();

            return this;
        };

        /**
         * Set the zoom of the camera and update the canvas context
         *
         * @param  {gc.Point2}   scale Zoom/scale of the camera
         * @return {gc.Camera2}        Self reference to allow chaining
         *
         * @public
         */
        this.setScale = function setScale(scale) {
            this.scale.set(scale.x || 1, scale.y || 1);
            _canvas.updateView();

            return this;
        };

        /**
         * Set the center of the Camera coordinates (by default, the center).
         * Note that the viewport of the camera will not change, therefore the final position of the camera DO will change
         *
         * @param  {gc.Align|gc.Point2|Number}   center New center to handle the camera. It can be a {@link gc.Point2}, a {@link gc.Align}
         *                                              value, or two numbers x and y relatives to the top-left corner of the camera viewport
         * @return {gc.Camera2}                         Self reference to allow chaining
         *
         * @public
         */
        this.setCenter = function setCenter(center) {
            var alignedPosition;

            switch(arguments.length) {
                case 1:
                    if(center.x !== undefined && center.y !== undefined) {
                        this.center.set(center.x || this.viewport.width/2, center.y || this.viewport.height/2);
                    } else {
                        alignedPosition = gc.util.alignPosition(center, this.viewport.width, this.viewport.height);
                        this.center.set(-alignedPosition.x, -alignedPosition.y);
                    }
                    break;

                case 2:
                    this.center.set(arguments[0], arguments[1]);
                    break;

                default:
                    throw new gc.exception.WrongSignatureException("Wrong number of parameters");

            }

            _canvas.updateView();

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
    gc.Camera2 = Camera2;
    gc.util.defineConstant(gc.Camera2, "VERSION", VERSION);

} (window, window.gc));
