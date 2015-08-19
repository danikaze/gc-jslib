;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    var _validator = new gc.Validator();

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.ResourceManager
     * @public
     */
    var VERSION = "1.0.0";

    /**
     * Enum: Type of managed resources
     *
     * @enum {Number}
     * @readOnly
     * @memberOf gc.ResourceManager
     * @public
     */
    var ResourceType = {
        IMAGE : 0,
        FONT  : 1,
        AUDIO : 2,
    };


    /**
     * Resource (assets) Manager
     *
     * @requires gc.Util
     * @requires gc.Deferred
     * @requires gc.Validator
     * @uses     gc.exception
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
         * List of resources managed in objects like:
         *  {
         *      size    : {Integer},    // Size in bytes or 1 if not specified
         *      src     : {String},     // URL of the resource's source
         *      rsc     : {Object},     // when is not undefined, means that it's been loaded 100%
         *      tmp     : {Object}      // used to create the resource while loading. Not available after loaded
         *  }
         */
        var _images,
            _fonts,
            _audios;

        var _total,         // Total size (or number of elements) of ALL the resources
            _loaded,        // Total bytes (or number of elements) loaded for ALL the type of resources
            _deferred;      // Deferred object to manage callbacks


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct() {
            _images = {};
            _fonts  = {};
            _audios = {};
            _total  = 0;
            _loaded = 0;

            // convert the ResourceManager in a Promise
            _deferred = new gc.Deferred();
            _deferred.promise(this);
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

            _deferred.notify(_loaded/_total, key, type);

            if(_loaded === _total) {
                _deferred.resolve(_loaded/_total, key, type);
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
            data.tmp = new Image();
            data.tmp.onload = function() {
                _loaded += data.size;
                data.rsc = data.tmp;
                delete data.tmp;
                _update(key, ResourceType.IMAGE);
            };
            data.tmp.src = data.src;
        }

        /**
         * Load one single audio
         *
         * @param   {String} key  Key of the audio to load
         * @param   {Object} data Object with the properties of the audio to load
         *
         * @private
         */
        function _loadAudio(key, data) {
            data.tmp = new Audio();
            data.tmp.oncanplaythrough = function() {    // onloadeddata ??
                _loaded += data.size;
                data.rsc = data.tmp;
                delete data.tmp;
                _update(key, ResourceType.AUDIO);
            };
            data.tmp.src = data.src;
        }

        /**
         * Load one single generic file
         *
         * @param   {String}       key  Key of the file to load
         * @param   {Object}       data Object with the properties of the file to load
         * @param   {ResourceType} type Type of the object to load
         *
         * @private
         */
        function _loadFile(key, data, type) {
            var request = new gc.XHR(data.src);
            request.done(function() {
                _loaded += data.size;
                data.rsc = true;
                delete data.tmp;
                _update(key, ResourceType.FONT);
            });
            data.tmp = true;
        }

        /**
         * Queue resources of one type, without start loading them
         *
         * @param  {Object} container     Object where the resources will be loaded into
         * @param  {Object} data          Definition of the resources to ask as {key:resourceData}
         * @param  {String} data.src      Source of the resource (usually a URL)
         * @param  {Number} [data.size=1] Size of the resource
         *
         * @private
         */
        function _queueResources(container, data) {
            var key,
                size;

            for(key in data) {
                if(container[key]) {
                    _total -= container[key].size;
                    _loaded -= container[key].size;
                }

                size = data[key].size || 1;
                container[key] = {
                    size: size,
                    src : data[key].src
                };

                _total += container[key].size;
            }
        }

        /**
         * Load the resources of one type, that are already queued and not loading/loaded
         *
         * @param  {Object}   container Object where the resources will be loaded into
         * @param  {Function} loader    Function that loads a single resource of this type
         *
         * @private
         */
        function _loadResources(container, loader) {
            var key;

            for(key in container) {
                if(!container[key].rsc && !container[key].tmp) {
                    loader(key, container[key]);
                }
            }
        }

        function _validateResourceDefinition(data) {
            _validator.reset()
                      .resourceDefinitionObject('data', data);

            if(_validator.errors()) {
                throw new gc.exception.WrongDataException(_validator.errors());
            }
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Load images
         *
         * @param  {Object} data          Object of the images to ask as {key:resourceData}
         * @param  {String} data.src      Source of the image (usually a URL)
         * @param  {Number} [data.size=1] Size of the image
         * @return {gc.ResourceManager}   Self object to allow chaining
         *
         * @public
         */
        this.loadImages = function loadImages(data) {
            _validateResourceDefinition(data);

            _deferred.reset();
            _queueResources(_images, data);
            _loadResources(_images, _loadImage);
            return this;
        };

        /**
         * Load Fonts
         *
         * @param  {Object} data          Object of the fonts to ask as {key:resourceData}
         * @param  {String} data.src      Source of the font (usually a URL)
         * @param  {Number} [data.size=1] Size of the font
         * @return {gc.ResourceManager}   Self object to allow chaining
         *
         * @public
         */
        this.loadFonts = function loadFonts(data) {
            _validateResourceDefinition(data);

            _deferred.reset();
            _queueResources(_fonts, data);
            _loadResources(_fonts, _loadFile, ResourceType.FONT);
            return this;
        };

        /**
         * Load Audios
         *
         * @param  {Object} data          Object of the audio files to ask as {key:resourceData}
         * @param  {String} data.src      Source of the audio (usually a URL)
         * @param  {Number} [data.size=1] Size of the audio
         * @return {gc.ResourceManager}   Self object to allow chaining
         *
         * @public
         */
        this.loadAudios = function loadAudios(data) {
            _validateResourceDefinition(data);

            _deferred.reset();
            _queueResources(_audios, data);
            _loadResources(_audios, _loadAudio);
            return this;
        };

        /**
         * Load resources
         *
         * @param  {Object} data                       Definitions of the resources to load
         * @param  {Object} [data[ResourceType.IMAGE]] Object accepted by {@link gc.ResourceManager#loadImages}
         * @param  {Object} [data[ResourceType.FONT]]  Object accepted by {@link gc.ResourceManager#loadFonts}
         * @param  {Object} [data[ResourceType.AUDIO]] Object accepted by {@link gc.ResourceManager#loadAudios}
         * @return {gc.ResourceManager}                Self object to allow chaining
         *
         * @public
         */
        this.load = function load(data) {
            if(!gc.util.isPlainObject(data)) {
                throw gc.exception.WrongSignatureException("data is not an Object");
            }

            _deferred.reset();

            // queue
            if(data[ResourceType.IMAGE]) {
                _queueResources(_images, data[ResourceType.IMAGE]);
            }
            if(data[ResourceType.FONT]) {
                _queueResources(_fonts, data[ResourceType.FONT]);
            }
            if(data[ResourceType.AUDIO]) {
                _queueResources(_audios, data[ResourceType.AUDIO]);
            }

            // load
            if(data[ResourceType.IMAGE]) {
                _loadResources(_images, _loadImage);
            }
            if(data[ResourceType.FONT]) {
                _loadResources(_fonts, _loadFile);
            }
            if(data[ResourceType.AUDIO]) {
                _loadResources(_audios, _loadAudio);
            }

            return this;
        };

        /**
         * Get a loaded Image
         *
         * @param  {String} key Key of the Image
         * @return {Image}      Image resource, or undefined if not loaded or not found
         *
         * @public
         */
        this.getImage = function getImage(key) {
            if(!_images[key] || !_images[key].rsc) {
                return undefined;
            }

            return _images[key].rsc;
        };

        /**
         * Get a loaded Audio
         *
         * @param  {String} key Key of the Audio
         * @return {Audio}      Audio resource, or undefined if not loaded or not found
         *
         * @public
         */
        this.getAudio = function getAudio(key) {
            if(!_audios[key] || !_audios[key].rsc) {
                return undefined;
            }

            return _audios[key].rsc;
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
    gc.ResourceManager = ResourceManager;
    gc.util.defineConstant(gc.ResourceManager, "VERSION", VERSION);
    gc.util.defineConstant(gc.ResourceManager, "ResourceType", ResourceType);

} (window, window.gc));
