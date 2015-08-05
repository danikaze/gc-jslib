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
     * @memberOf gc.Deferred
     * @public
     */
    var VERSION = "1.0.0";

    /**
     * Enum: Possible states of the Deferred
     *
     * @enum {String}
     * @memberOf gc.Deferred
     * @public
     */
    var State = {
        PENDING : "PENDING",
        RESOLVED: "RESOLVED",
        REJECTED: "REJECTED"
    };

    /**
     * Deferred implementation for asynchronous methods
     *
     * @requires gc.Util
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Deferred = function() {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var _state,         // state of the Deferred
            _done,          // list of callbacks executed when resolved
            _fail,          // list of callbacks executed when rejected
            _always,        // list of callbacks executed when resolved or rejected
            _progress,      // list of callbacks executed when updated
            _then,          // Object with the deferreds to execute in a then statement
            _resultArgs;    // List of arguments to pass to the callbacks


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor called when creating a new object instance
         *
         * @private
         */
        var _construct = function _construct(func) {
            _state = State.PENDING;
            _done = [];
            _fail = [];
            _always = [];
            _progress = [];
            _then = {
                def     : undefined,
                done    : undefined,
                fail    : undefined,
                progress: undefined
            };

            if(gc.util.isFunction(func)) {
                func.call(this, _then);
            }
        };


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Get the current state of the Deferred object
         *
         * @return {State} Current state
         *
         * @public
         */
        this.state = function state() {
            return _state;
        };

        /**
         * Add a Function to the list of callbacks to be executed when the Deferred is resolved via {@link gc.Deferred#resolve}
         *
         * @param  {Function} callback Callback to execute when resolved
         * @return {gc.Deferred}       Self object to allow chaining
         *
         * @public
         */
        this.done = function done(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _done.push(callback);

            if(_state === State.RESOLVED) {
                callback.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Add a Function to the list of callbacks to be executed when the Deferred is rejected via {@link gc.Deferred#reject}
         *
         * @param  {Function} callback Callback to execute when rejected
         * @return {gc.Deferred}       Self object to allow chaining
         *
         * @public
         */
        this.fail = function fail(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _fail.push(callback);

            if(_state === State.REJECTED) {
                callback.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Add a Function to the list of callbacks to be executed when the Deferred is resolved or rejected.
         * The functions added here are executed AFTER the ones added in {@link gc.Deferred#done} and {@link gc.Deferred#fail}
         *
         * @param  {Function} callback Callback to execute when resolved or rejected
         * @return {gc.Deferred}       Self object to allow chaining
         *
         * @public
         */
        this.always = function always(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _always.push(callback);

            if(_state !== State.PENDING) {
                callback.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Add a Function to the list of callbacks to be executed when the Deferred is updated via {@link gc.Deferred#notify}
         *
         * @param  {Function} callback Callback to execute when updated
         * @return {gc.Deferred}       Self object to allow chaining
         *
         * @public
         */
        this.progress = function progress(callback) {
            if(!gc.util.isFunction(callback)) {
                throw new gc.exception.WrongSignatureException("callback is not a Function");
            }

            _progress.push(callback);

            return this;
        };

        /**
         * Creates a new Deferred and chains it to the current one.
         *
         * @param  {Function} [done]     Callback to execute after the current Deferred is resolved via {@link gc.Deferred#resolve}.
         *                               The parameters accepted will be the returned value of the previous
         *                               {@link gc.Deferred#then} or the value which is resolved with.
         * @param  {Function} [fail]     Callback to execute after the current Deferred is rejected via {@link gc.Deferred#reject}
         *                               The parameters accepted will be the returned value of the previous
         *                               {@link gc.Deferred#then} or the value which is rejected with.
         * @param  {Function} [progress] Callback to execute after the current Deferred is notified via {@link gc.Deferred#notify}
         *                               The parameters accepted will be the returned value of the previous
         *                               {@link gc.Deferred#then} or the value which is notified with.
         * @return {Promise}             {@link gc.Deferred#promise} of the new Deferred chained to the current one
         *
         * @public
         */
        this.then = function then(done, fail, progress) {
            if(done && !gc.util.isFunction(done)) {
                throw new gc.exception.WrongSignatureException("done is not a Function");
            }
            if(fail && !gc.util.isFunction(fail)) {
                throw new gc.exception.WrongSignatureException("fail is not a Function");
            }
            if(progress && !gc.util.isFunction(progress)) {
                throw new gc.exception.WrongSignatureException("progress is not a Function");
            }

            _then.def = new Deferred(function(then) {
                if(done) {
                    then.done = done;
                }
                if(fail) {
                    then.fail = fail;
                }
                if(progress) {
                    then.progress = progress;
                }
            });

            return _then.def.promise();
        };

        /**
         * Get a Promise for the current Deferred.
         * A Promise is nothing else than a read-only Deferred. Since the only that should modify the status of
         * the Deferred is its creator, this is a way to encapsulate the read-only methods.
         *
         * @param  {Object}  [obj] If an object is specified, it will be extended with Promise methods
         * @return {Promise}       Promise for the current Deferred
         *
         * @public
         */
        this.promise = function promise(obj) {
            var p = {
                    state   : this.state,
                    done    : this.done,
                    fail    : this.fail,
                    always  : this.always,
                    progress: this.progress,
                    then    : this.then,
                    promise : this.promise
                };

            return obj != null ? gc.util.extend(obj, p)
                               : p;
        };

        /**
         * Set the status to {@link gc.Deferred#State.PENDING} again without losing the attached listeners.
         * To reset everything, better create a new {@link gc.Deferred}
         *
         * @public
         */
        this.reset = function reset() {
            _state = State.PENDING;

            if(_then.def) {
                _then.def.reset();
            }
        };

        /**
         * Set the Deferred as resolved.
         * This will trigger the callbacks specified with {@link gc.Deferred#done}, {@link gc.Deferred#always} and resolve the
         * chained Deferred with {@link gc.Deferred#then}, in that order, with the specified parameters if any.
         *
         * @return {gc.Deferred} Self object to allow chaining
         *
         * @public
         */
        this.resolve = function resolve() {
            var i, n, args;

            if(_state !== State.PENDING) {
                return this;
            }

            _state = State.RESOLVED;
            _resultArgs = arguments;

            if(_then.done) {
                _resultArgs = [_then.done.apply(null, arguments)];
            }

            for(i=0, n=_done.length; i<n; i++) {
                _done[i].apply(null, _resultArgs);
            }
            for(i=0, n=_always.length; i<n; i++) {
                _always[i].apply(null, _resultArgs);
            }

            if(_then.def) {
                _then.def.resolve.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Set the Deferred as rejected.
         * This will trigger the callbacks specified with {@link gc.Deferred#fail}, {@link gc.Deferred#always} and reject the
         * chained Deferred with {@link gc.Deferred#then}, in that order, with the specified parameters if any.
         *
         * @return {gc.Deferred} Self object to allow chaining
         *
         * @public
         */
        this.reject = function reject() {
            var i, n;

            if(_state !== State.PENDING) {
                return this;
            }

            _state = State.REJECTED;
            _resultArgs = arguments;

            if(_then.fail) {
                _resultArgs = [_then.fail.apply(null, arguments)];
            }

            for(i=0, n=_fail.length; i<n; i++) {
                _fail[i].apply(null, _resultArgs);
            }
            for(i=0, n=_always.length; i<n; i++) {
                _always[i].apply(null, _resultArgs);
            }

            if(_then.def) {
                _then.def.reject.apply(null, _resultArgs);
            }

            return this;
        };

        /**
         * Notify the Deferred of an update with the specified parameters if any.
         * This will trigger the callbacks specified with {@link gc.Deferred#progress} and notify the
         * chained Deferred with {@link gc.Deferred#then}, in that order.
         *
         * @return {gc.Deferred} Self object to allow chaining
         *
         * @public
         */
        this.notify = function notify() {
            var i, n,
                args = arguments;

            if(_state !== State.PENDING) {
                return this;
            }

            if(_then.progress) {
                args = [_then.progress.apply(null, arguments)];
            }

            for(i=0, n=_progress.length; i<n; i++) {
                _progress[i].apply(null, args);
            }

            if(_then.def) {
                _then.def.notify.apply(null, args);
            }

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
    gc.Deferred = Deferred;
    gc.util.defineConstant(gc.Deferred, "VERSION", VERSION);
    gc.util.defineConstant(gc.Deferred, "State", State);

} (window, window.gc));
