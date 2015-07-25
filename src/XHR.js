;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////


    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Enum: Possible request methods
     *
     * @enum {String}
     * @memberOf gc.XHR
     * @public
     */
    var Method = {
        GET    : "GET",
        POST   : "POST",
        HEAD   : "HEAD",
        PUT    : "PUT",
        DELETE : "DELETE"
    };

    var Status = {
        // success states
        SUCCESS     : 0,
        NOTMODIFIED : 1,
        NOCONTENT   : 2,
        // error states
        ERROR       : 3,
        TIMEOUT     : 4,
        ABORT       : 5
    };

    var VERSION = "1.0.0";

    /**
     * Class for asynchronous comunication over XMLHttpRequests
     *
     * @param {String}   url                            URL to request
     * @param {Object}   Options                        User specified options to override the default ones
     * @param {Object}   [Options.data={}]              Parameters to send
     * @param {Method}   [Options.method=Method.GET]    Type of request
     * @param {boolean}  [async=true]                   false if we want the request to be synchronous
     * @param {Integer}  [Options.timeout=30000]        Milliseconds to wait before triggering fail (0, null, false... will disable it)
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var XHR = function(url, options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _xhr,
            _timeoutTimer,
            _options,
            _deferred;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        function _construct(url, options) {
            var defaultOptions = {
                    data   : {},
                    method : Method.GET,
                    timeout: 30000,
                    async  : true
                };

            _options = gc.util.extend(defaultOptions, options);

            if(!_options.url) {
                throw new gc.exception.WrongDataException("URL is not specified");
            }

            // convert the XHR in a Promise
            _deferred = new gc.Deferred();
            _deferred.promise(this);

            _makeRequest();
        };

        /**
         * Execute the request based on the set options
         *
         * @private
         */
        function _makeRequest() {
            _xhr = new XMLHttpRequest();

            _xhr.open(_options.method, _options.url, _options.async);

            _xhr.onload = function(progress) {
                // status 0 is for file protocol (local)
                if(_xhr.status === 0 || (_xhr.status >= 200 && _xhr.status < 400)) {
                    _deferred.resolve(_xhr, progress);

                } else if(_xhr.status >= 100 && _xhr.status < 200) {
                    _deferred.notify(_xhr, progress);

                } else {
                    _deferred.reject(_xhr, progress);
                }
            };

            _xhr.onerror = function(progress) {
                _deferred.reject(progress);
            };

            try {
                _xhr.send();

            } catch(e) {

            }
        };

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////




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
    gc.XHR = XHR;
    gc.util.defineConstant(gc.XHR, "VERSION", VERSION);
    gc.util.defineConstant(gc.XHR, "Method", Method);

} (window, window.gc));
