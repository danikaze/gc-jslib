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

        var _self,
            _state,         // state of the Deferred
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
        function _construct(func) {
            _self = this;
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
         * Add a Function to the list of callbacks to be executed when the Deferred is resolved via {@link resolve}
         *
         * @param  {Function} callback Callback to execute when resolved
         * @return {this}              Self object to allow chaining
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
         * Add a Function to the list of callbacks to be executed when the Deferred is rejected via {@link reject}
         *
         * @param  {Function} callback Callback to execute when rejected
         * @return {this}              Self object to allow chaining
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
         * The functions added here are executed AFTER the ones added in {@link done} and {@link fail}
         *
         * @param  {Function} callback Callback to execute when resolved or rejected
         * @return {this}              Self object to allow chaining
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
         * Add a Function to the list of callbacks to be executed when the Deferred is updated via {@link notify}
         *
         * @param  {Function} callback Callback to execute when updated
         * @return {this}              Self object to allow chaining
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
         * @param  {Function} [done=undefined]     Callback to execute after the current Deferred is resolved via {@link resolve}.
         *                                         The parameters accepted will be the returned value of the previous
         *                                         {@link Deferred#then} or the value which is resolved with.
         * @param  {Function} [fail=undefined]     Callback to execute after the current Deferred is rejected via {@link reject}
         *                                         The parameters accepted will be the returned value of the previous
         *                                         {@link Deferred#then} or the value which is rejected with.
         * @param  {Function} [progress=undefined] Callback to execute after the current Deferred is notified via {@link notify}
         *                                         The parameters accepted will be the returned value of the previous
         *                                         {@link Deferred#then} or the value which is notified with.
         * @return {Promise}                       {@link promise} of the new Deferred chained to the current one
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
         * @param  {Object} [obj] If an object is specified, it will be extended with Promise methods
         * @return {Promise}      Promise for the current Deferred
         *
         * @public
         */
        this.promise = function promise(obj) {
            var promise = {
                    state   : _self.state,
                    done    : _self.done,
                    fail    : _self.fail,
                    always  : _self.always,
                    progress: _self.progress,
                    then    : _self.then,
                    promise : _self.promise
                };

            return obj != null ? gc.util.extend(obj, promise)
                               : promise;
        };

        /**
         * Set the status to {@link State.PENDING} again without losing the attached listeners.
         * To reset everything, better create a new {@gc.Deferred}
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
         * This will trigger the callbacks specified with {@link done}, {@link always} and resolve the
         * chained Deferred with {@link then}, in that order, with the specified parameters if any.
         *
         * @return {this} Self object to allow chaining
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
         * This will trigger the callbacks specified with {@link fail}, {@link always} and reject the
         * chained Deferred with {@link then}, in that order, with the specified parameters if any.
         *
         * @return {this} Self object to allow chaining
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
         * This will trigger the callbacks specified with {@link progress} and notify the
         * chained Deferred with {@link then}, in that order.
         *
         * @return {this} Self object to allow chaining
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
