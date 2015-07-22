;(function(window, document, undefined) {
    "use strict";

    /**
     * performance.now
     * https://gist.github.com/paulirish/5438650
     */
    if ("performance" in window == false) {
          window.performance = {};
    }
      
    Date.now = (Date.now || function () {  // thanks IE8
        return new Date().getTime();
    });
     
    if ("now" in window.performance == false){
        
        var nowOffset = Date.now();
        
        if (performance.timing && performance.timing.navigationStart){
            nowOffset = performance.timing.navigationStart
        }
     
        window.performance.now = function now(){
            return Date.now() - nowOffset;
        }
    }

    /**
     * requestAnimationFrame
     */
    if(!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback){
                window.setTimeout(function() {
                    callback(window.performance.now());
                }, 1000 / 60);
            };
    }

} (window, document));

(function (doc) {
    "use strict";

    /**
     * Fullscreen API
     * https://github.com/neovov/Fullscreen-API-Polyfill/blob/master/fullscreen-api-polyfill.js
     */

    function noop() {};

    var pollute = true,
        api,
        vendor,
        apis = {
            // http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
            w3: {
                enabled: "fullscreenEnabled",
                element: "fullscreenElement",
                request: "requestFullscreen",
                exit:    "exitFullscreen",
                events: {
                    change: "fullscreenchange",
                    error:  "fullscreenerror"
                }
            },
            webkit: {
                enabled: "webkitIsFullScreen",
                element: "webkitCurrentFullScreenElement",
                request: "webkitRequestFullScreen",
                exit:    "webkitCancelFullScreen",
                events: {
                    change: "webkitfullscreenchange",
                    error:  "webkitfullscreenerror"
                }
            },
            moz: {
                enabled: "mozFullScreenEnabled",
                element: "mozFullScreenElement",
                request: "mozRequestFullScreen",
                exit:    "mozCancelFullScreen",
                events: {
                    change: "mozfullscreenchange",
                    error:  "mozfullscreenerror"
                }
            },
            ms: {
                enabled: "msFullscreenEnabled",
                element: "msFullscreenElement",
                request: "msRequestFullscreen",
                exit:    "msExitFullscreen",
                events: {
                    change: "MSFullscreenChange",
                    error:  "MSFullscreenError"
                }
            }
        },
        w3 = apis.w3;

    // Loop through each vendor's specific API
    for (vendor in apis) {
        // Check if document has the "enabled" property
        if (apis[vendor].enabled in doc) {
            // It seems this browser support the fullscreen API
            api = apis[vendor];
            break;
        }
    }

    function dispatch( type, target ) {
        var event = doc.createEvent( "Event" );

        event.initEvent( type, true, false );
        target.dispatchEvent( event );
    } // end of dispatch()

    function handleChange( e ) {
        // Recopy the enabled and element values
        doc[w3.enabled] = doc[api.enabled];
        doc[w3.element] = doc[api.element];

        dispatch( w3.events.change, e.target );
    } // end of handleChange()

    function handleError( e ) {
        dispatch( w3.events.error, e.target );
    } // end of handleError()

    // Pollute only if the API doesn't already exists
    if(pollute) {
        if(!(w3.enabled in doc)) {
            if(api) {
                // Add listeners for fullscreen events
                doc.addEventListener( api.events.change, handleChange, false );
                doc.addEventListener( api.events.error,  handleError,  false );

                // Copy the default value
                doc[w3.enabled] = doc[api.enabled];
                doc[w3.element] = doc[api.element];

                // Match the reference for exitFullscreen
                doc[w3.exit] = doc[api.exit];

                // Add the request method to the Element's prototype
                Element.prototype[w3.request] = function () {
                    return this[api.request].apply( this, arguments );
                };

            // if there's no API available, set the methods as noop so there's no error
            } else {
                Element.prototype[w3.enabled] = noop;
                Element.prototype[w3.element] = noop;
                Element.prototype[w3.request] = noop;
                Element.prototype[w3.exit] = noop;
            }
        }
    }

    // Return the API found (or undefined if the Fullscreen API is unavailable)
    return api;

}( document ));
