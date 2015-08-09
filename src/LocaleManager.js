;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.LocaleManager
     * @public
     */
    var VERSION = "0.1.0";

    /**
     * Manages translations
     *
     * @requires gc.Util
     *
     * @constructor
     * @memberOf gc
     * @version 0.1.0
     * @author @danikaze
     */
    var LocaleManager = function() {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _texts;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance.
         *
         * @private
         */
        var _construct = function _construct() {
            _texts = {};
        };

        /**
         * Replace a list of parameters in a string.
         * i.e.: string = "User ID: {userId}" and params = { userId: 12345 } will result in "User ID: 12345".
         *
         * @param  {String} text   Text where perform the replacement
         * @param  {Object} params List of parametes as { key: value }
         * @return {String}        Replaced string
         *
         * @private
         */
        var _replaceParameters = function _replaceParameters(text, params) {
            var regExp,
                key;

            for(key in params) {
                regExp = new RegExp('{' + key + '}', 'g');
                text = text.replace(regExp, params[key]);
            }

            return text;
        };


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Register a set of texts for a given namespace
         *
         * @param  {String}           namespace Namespace of the texts
         * @param  {Object}           texts     List of texts to register as { key: value }
         * @return {gc.LocaleManager}           Self reference for allowing chaining
         *
         * @public
         */
        this.register = function set(namespace, texts) {
            if(!_texts[namespace]) {
                _texts[namespace] = {};
            }

            gc.util.extend(_texts[namespace], texts);

            return this;
        };

        /**
         * Get localized string
         *
         * @param  {String} namespace Namespace of the text
         * @param  {String} key       Key of the asked text
         * @param  {Object} params    If specified, the {keys} will be replaced with their values
         * @return {String}           Value of the asked text
         *
         * @public
         */
        this.get = function get(namespace, key, params) {
            var ns = _texts[namespace],
                t;

            if(!ns) {
                return "{" + namespace + ":" + key + "}";
            }

            t = ns[key];
            if(t === undefined) {
                return "{" + namespace + ":" + key + "}";
            }

            return _replaceParameters(t, params);
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
    gc.LocaleManager = LocaleManager;
    gc.util.defineConstant(gc.LocaleManager, "VERSION", VERSION);

} (window, window.gc));
