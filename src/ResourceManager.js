;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////


    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Enum: Type of managed resources
     *
     * @property {Number} IMAGE
     * @property {Number} FONT
     * @property {Number} SOUND
     *
     * @enum {Number}
     * @readOnly
     * @memberOf gc.ResourceManager
     */
    var ResourceType = Object.freeze({
        IMAGE : 0,
        FONT  : 1,
        SOUND : 2,
    });

    var version = "1.0.0";

    /**
     * Description of the class
     *
     * @params
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var ResourceManager = function() {


        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        /*
         * List of resources, sources, loading status...
         * Managed in objects like:
         *  {
         *      total   : {Integer},        // sum of all the items' sizes
         *      loaded  : {Integer},        // total "sizes" loaded
         *      useSize : {boolean},        // true if the size is specified for ALL the objects
         *      items   : {
         *          size    : {Integer},    // Size in bytes or 1 if not specified
         *          src     : {String},     // URL of the resource's source
         *          rsc     : {Object},     // when is not undefined, means that it's been loaded 100%
         *          tmp     : {Object}      // used to create the resource while loading
         *      }
         *  }
         */
        var _images,
            _fonts;

        var _total,
            _loaded,
            _onUpdate,
            _onFinish;

        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        function _construct() {

            _images = {};
            _fonts = {};
            _total = 0;
            _loaded = 0;
            _onUpdate = [];
            _onFinish = [];

        };

        /**
         * Called when the status of the ResourceManager is updated to Trigger the needed callbacks
         *
         * @param {String}       key  key of the loaded resource
         * @param {ResourceType} type type of the loaded resource
         *
         * @private
         */
        function _update(key, type) {
            var i, n;

            for(i=0, n=_onUpdate.length; i<n; i++) {
                _onUpdate[i](_loaded/_total, key, type);
            };

            if(_loaded === _total) {
                for(i=0, n=_onUpdate.length; i<n; i++) {
                    _onFinish[i](_loaded/_total, key, type);
                };
            }
        }

        /**
         * Load one single image
         *
         * @param   {String} key  Key of the image to load
         * @param   {Object} data Object with the properties of the image to load
         *
         * @private
         */
        function _loadImage(key, data) {
            data.tmp =  new Image();
            data.tmp.src = data.src;

            data.tmp.onload = function() {
                _loaded += data.size;
                data.rsc = data.tmp;
                delete data.tmp;
                _update(key, ResourceType.IMAGE);
            };
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Add a callback to be executed on a status update
         *
         * @param  {Function} callback Function to execute
         * @return {this}              Self object to allow chaining
         *
         * @public
         */
        this.update = function update(callback) {

            if(!gc.util.isFunction(callback)) {
                throw gc.exception.WrongSignatureException("callback is not a Function");
            }

            _onUpdate.push(callback);

            return this;
        };

        /**
         * Add a callback to be executed when all the resources are loaded
         * This can happen more than once (i.e. loading more resources after the first batch is loaded)
         *
         * @param  {Function} callback Function to execute
         * @return {this}              Self object to allow chaining
         *
         * @public
         */
        this.finish = function finish(callback) {

            if(!gc.util.isFunction(callback)) {
                throw gc.exception.WrongSignatureException("callback is not a Function");
            }

            _onFinish.push(callback);

            return this;
        };

        /**
         * Load images
         *
         * @param  {Object}                  sources Object of the images to ask as {key:resourceData}
         * @param  {String}                  sources.src Source of the resource (usually a URL)
         * @param  {Number} [sources.size=1] Size of the resource
         * @return {this}                    Self object to allow chaining
         *
         * @public
         */
        this.loadImages = function loadImages(data) {
            var key,
                size;

            if(!gc.util.isPlainObject(data)) {
                throw gc.exception.WrongSignatureException("data is not an Object");
            }

            // first, we create the object for all the passed images
            for(key in data) {
                size = data[key].size || 1;
                _images[key] = {
                    size: size,
                    src : data[key].src
                };
                _total += size;
            }

            // and then, we start loading them
            for(key in _images) {
                _loadImage(key, _images[key]);
            };

            return this;
        };

        /**
         * Get a loaded image
         *
         * @param  {String} key Key of the image
         * @return {Image}      Image resource, or undefined if not loaded or not found
         *
         * @public
         */
        this.image = function image(key) {
            if(!_images[key] || !_images[key].rsc) {
                return undefined;
            }

            return _images[key].rsc;
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
    gc.ResourceManager = ResourceManager;
    gc.ResourceManager.version = version;
    gc.ResourceManager.ResourceType = ResourceType;

} (window, window.gc));
