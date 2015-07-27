;(function(window, gc, undefined) {
    "use strict";

    /**
     * Exceptions
     *
     * @namespace gc.exception
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Exception = {

        /**
         * NotImplementedException
         * Raised when a method or part of a method that is not implemented is called.
         *
         * @param {mixed} data Usually the name of the not implemented method or property
         *
         * @constructor
         * @memberOf gc.exception
         */
        NotImplementedException: function NotImplementedException(data) {
            this.data = data;
            this.toString = function toString() { return "Exception: Not Implemented."; };
        },

        /**
         * IndexOutOfBoundsException
         * Raised when an index is out of the bounds of an array.
         *
         * @param {mixed} data Extra data to include in the exception for debug
         *
         * @constructor
         * @memberOf gc.exception
         */
        IndexOutOfBoundsException: function IndexOutOfBoundsException(data) {
            this.data = data;
            this.toString = function toString() { return "Exception: Index Out Of Bounds."; };
        },

        /**
         * WrongSignatureException
         * Raised when calling a method with the wrong number or type of parameters.
         *
         * @param {mixed} data Extra data to include in the exception for debug
         *
         * @constructor
         * @memberOf gc.exception
         * @see gc.exception.WrongDataException
         */
        WrongSignatureException: function WrongSignatureException(data) {
            this.data = data;
            this.toString = function toString() { return "Exception: Wrong number or type of parameters."; };
        },

        /**
         * WrongDataException
         * Raised when a method is called with the correct parameters but the specified data is wrong.
         *
         * @param {mixed} data Extra data to include in the exception for debug
         *
         * @constructor
         * @memberOf gc.exception
         * @see gc.exception.WrongSignatureException
         */
        WrongDataException: function WrongDataException(data) {
            this.data = data;
            this.toString = function toString() { return "Exception: Wrong data."; };
        }
    };


    ///////////////////////
    // Export the module //
    ///////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.exception = Exception;

} (window, window.gc));
