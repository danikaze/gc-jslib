;(function(window, gc, undefined) {
    "use strict";

    /////////////////////////
    // STATIC PRIVATE VARS //
    /////////////////////////

    /**
     * Enum: Direction of the animation, for internal control
     *
     * @enum {Number}
     * @private
     */
    var PlayDirection = {
            FORWARDS: 0,
            BACKWARDS: 1,
            RANDOM: 2
        };


    ////////////////////////
    // STATIC PUBLIC VARS //
    ////////////////////////

    /**
     * Current version of this object
     *
     * @type {String}
     * @readOnly
     * @memberOf gc.Animation
     * @public
     */
    var VERSION = '1.0.0';

    /**
     * Enum: Possible types of Animation
     *
     * @requires gc.Util
     *
     * @enum {Number}
     * @readOnly
     * @memberOf gc.Animation
     * @public
     */
    var PlayMode = {
            NORMAL: 0,
            REVERSED: 1,
            PINGPONG: 2,
            LOOP: 3,
            LOOP_REVERSED: 4,
            LOOP_PINGPONG: 5,
            LOOP_RANDOM: 6,
        };


    /**
     * Animation class to use with canvas
     *
     * @param {Object} image Image object accepted by CanvasRenderingContext2D#drawImage()
     * @param {Object} options options to customize the animation
     * @param {Animation.PlayMode} [options.playMode=Animation.PlayMode.LOOP] Behavior of the frames of the Animation
     * @param {Number} [options.offsetX=0] x-position where the animation graphics start relative to the {@link image}
     * @param {Number} [options.offsetY=0] y-position where the animation graphics start relative to the {@link image}
     * @param {Number} [options.marginX=0] horizontal space between each frame
     * @param {Number} [options.marginY=0] vertical space between each frame
     * @param {Number} [options.nFrames=0] number of frames to read horizontally
     *                                     if less or equal than zero, it will read till the end of the image
     *                                     if the number of frames is more than the number that can fit in the image horizontally, it will continue reading the next line
     * @param {Number} [options.frameWidth=0] width of each frame (for all of them)
     * @param {Number} [options.frameHeight=0] height of each frame (for all of them)
     * @param {Number} [options.frameCenterX=0] x-position of the center of each frame (for all of them)
     * @param {Number} [options.frameCenterY=0] y-position of the center of each frame (for all of them)
     * @param {Number} [options.frameTime=0] duration of the frames in milliseconds (for all of them)
     * @params {Object[]} [options.frames=undefined] If this option is specified options.nFrames will be overriden with options.frames.length,
     *                                               and the following properties will override the global ones
     * @params {Number} [options.frames[].width] width for the specified frame
     * @params {Number} [options.frames[].height] height for the specified frame
     * @params {Number} [options.frames[].centerX] x-position of the center of the specified frame
     * @params {Number} [options.frames[].centerY] y-position of the center of the specified frame
     * @params {Number} [options.frames[].time] duration of the specified frame
     * @param {Function} [options.onFinish] callback to execute when the animation finishes (only on NORMAL, REVERSED, PINGPONG)
     * @param {Function} [options.onChagneDirection] callback to execute when the animation changes the direction of play (only on PINGPONG and LOOP_PINGPONG)
     *
     * @requires gc.Util
     * @uses     gc.exception
     *
     * @constructor
     * @memberOf gc
     * @version 1.0.0
     * @author @danikaze
     */
    var Animation = function(image, options) {

        ///////////////////////////
        // PRIVATE INSTANCE VARS //
        ///////////////////////////

        var self,                   // reference to use the public methods from the private ones
            _texture,               // image source for the TextureRegion of the frames
            _frames,                // ordered list of frames as [{ src, time }]
            _nFrames,               // cached number of frames (_frameslength)
            _totalTime,             // cached duration of the full animation in millisecs.
            _currentFrameIndex,
            _currentFrame,
            _elapsedFrameTime,
            _nextFrame,
            _playMode,
            _playDirection,
            _playing,
            _finished,
            _onFinish,
            _onChangeDirection,
            _rng;


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////

        /**
         * Constructor of the object, called when a new instance is created.
         *
         * @private
         */
        function _construct(image, options) {
            var defaultOptions = {
                    // global animation options
                    playMode: PlayMode.LOOP,
                    // global image options
                    offsetX: 0,
                    offsetY: 0,
                    marginX: 0,
                    marginY: 0,
                    nFrames: 0,
                    // global frame options
                    frameWidth: 0,
                    frameHeight: 0,
                    frameCenterX: 0,
                    frameCenterY: 0,
                    frameTime: 0,
                    // specific frame options (if specified the global ones will be replaced)
                    frames: undefined,  // [{ width, height, offsetX, offsetY, time }]
                    onFinish: undefined,
                    onChangeDirection: undefined
                },
                opt = gc.util.extend(defaultOptions, options),
                i, n;

            self = this;

            _loadFrames(image, opt);
            self.setPlayMode(opt.playMode, true);

            if(opt.onFinish) {
                if(!gc.util.isArray(opt.onFinish)) {
                    opt.onFinish = [opt.onFinish];
                }
                _onFinish = opt.onFinish;

            } else {
                _onFinish = [];
            }

            if(opt.onChangeDirection) {
                if(!gc.util.isArray(opt.onChangeDirection)) {
                    opt.onChangeDirection = [opt.onChangeDirection];
                }
                _onChangeDirection = opt.onChangeDirection;

            } else {
                _onChangeDirection = [];
            }

        }

        /**
         * Load the frames of the Animation from an image source
         *
         * @param {Object} texture Image accepted by {@link CanvasRenderingContext2D#drawImage}.
         * @param {Object} options Options of the Animation as specified in the {@link constructor}.
         *
         * @private
         */
        function _loadFrames(image, options) {
            var i,
                x = options.offsetX,
                y = options.offsetY,
                frame,
                opt;

            _texture = image
            _totalTime = 0;
            _frames = [];

            if(!options.frames) {
                _nFrames = options.nFrames <= 0 ? Math.floor(_texture.width/options.frameWidth)
                                                : options.nFrames;

                for(i=0; i<_nFrames; i++) {
                    frame = {
                        src: new gc.TextureRegion(_texture, x, y, options.frameWidth, options.frameHeight),
                        time: options.frameTime
                    };
                    frame.src.centerX = options.frameCenterX;
                    frame.src.centerY = options.frameCenterY;

                    _frames.push(frame);
                    _totalTime += frame.time;

                    if(x + options.frameWidth >= _texture.width) {
                        x = options.offsetX;
                        y += options.frameHeight + options.marginY;

                    } else {
                        x += options.frameWidth + options.marginX;
                    }
                }

            } else {
                _nFrames = options.frames.length;

                for(i=0; i<_nFrames; i++) {
                    frame = {
                        src: new gc.TextureRegion(_texture,
                                                  options.frames[i].x ? options.frames[i].x : x,
                                                  options.frames[i].y ? options.frames[i].y : y,
                                                  options.frames[i].width ? options.frames[i].width : options.framesWidth,
                                                  options.frames[i].height ? options.frames[i].height : options.framesHeight),
                        time: options.frames[i].time ? options.frames[i].time : options.frameTime
                    };
                    frame.src.centerX = options.frames[i].centerX ? options.frames[i].centerX : options.frameCenterX,
                    frame.src.centerY = options.frames[i].centerY ? options.frames[i].centerY : options.frameCenterY

                    _frames.push(frame);
                    _totalTime += frame.time;

                    if(x + options.frameWidth >= _texture.width) {
                        x = options.offsetX;
                        y += options.frameHeight + options.marginY;

                    } else {
                        x += options.frameWidth + options.marginX;
                    }
                }
            }
        }

        /**
         * Call the registered triggers when needed
         *
         * @param {Object[]} callbacks list of functions to call
         *
         * @private
         */
        function _triggerCallback(callbacks) {
            var i, n;

            for(i=0, n=callbacks.length; i<n; i++) {
                callbacks[i]();
            }
        }

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.NORMAL
         *
         * @private
         */
        function _updateNormal() {
            if(_currentFrameIndex === _nFrames - 1) {
                _finished = true;
                _playing = false;
                _triggerCallback(_onFinish);

            } else {
                _currentFrameIndex++;
            }
        }

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.REVERSED
         *
         * @private
         */
        function _updateReversed() {
            if(_currentFrameIndex === 0) {
                _finished = true;
                _playing = false;
                _triggerCallback(_onFinish);

            } else {
                _currentFrameIndex--;
            }
        }

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.PINGPONG
         *
         * @private
         */
        function _updatePingpong() {
            if(_playDirection === PlayDirection.FORWARDS) {
                if(_currentFrameIndex === _nFrames - 1 && _nFrames > 0) {
                    _playDirection = PlayDirection.BACKWARDS;
                    _currentFrameIndex--;
                } else {
                    _currentFrameIndex++;
                }

            } else if(_currentFrameIndex === 0) {
                _finished = true;
                _playing = false;
                _triggerCallback(_onFinish);

            } else {
                _currentFrameIndex--;
            }
        }

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.LOOP
         *
         * @private
         */
        function _updateLoop() {
            _currentFrameIndex = (_currentFrameIndex + 1) % _nFrames;
        }

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.LOOP_PINGPONG
         *
         * @private
         */
        function _updateLoopPingpong() {
            if(_playDirection === PlayDirection.FORWARDS) {
                if(_currentFrameIndex === _nFrames - 1 && _nFrames > 0) {
                    _playDirection = PlayDirection.BACKWARDS;
                    _currentFrameIndex--;
                } else {
                    _currentFrameIndex++;
                }

            } else if(_currentFrameIndex === 0 && _nFrames > 0) {
                    _playDirection = PlayDirection.FORWARDS;
                    _currentFrameIndex++;

            } else {
                _currentFrameIndex--;
            }
        }

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.LOOP_REVERSED
         *
         * @private
         */
        function _updateLoopReversed() {
            if(_currentFrameIndex === 0) {
                _currentFrameIndex = _nFrames - 1;
            } else {
                _currentFrameIndex--;
            }
        }

        /**
         * Update the _currentFrameIndex with the next frame and set the internal control variables
         * when the _playMode is PlayMode.RANDOM
         *
         * @private
         */
        function _updateLoopRandom() {
            _currentFrameIndex = _rng.nextInt(_nFrames);
        }


        ////////////////////
        // PUBLIC METHODS //
        ////////////////////

        /**
         * Set the type of the Animation
         *
         * @param {Animation.PlayMode} playMode Type of the animation
         * @param {boolean}            reset    If true, it will reset the animation.
         *                                      If false, it will continue from the current state
         * @return {this}                       Self object to allow chaining
         *
         * @public
         */
        this.setPlayMode = function setPlayMode(playMode , reset) {
            _playMode = playMode;

            if(reset) {
                _finished = false;
                _playing = true;
                _elapsedFrameTime = 0;
            }

            if(playMode !== PlayMode.LOOP_RANDOM) {
                _rng = undefined;
            }

            switch(playMode) {
                case PlayMode.NORMAL:
                    _nextFrame = _updateNormal;
                    if(reset) {
                        _currentFrameIndex = 0;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.FORWARDS;
                    }
                    break;

                case PlayMode.REVERSED:
                    _nextFrame = _updateReversed;
                    if(reset) {
                        _currentFrameIndex = _frames.length - 1;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.BACKWARDS;
                    }
                    break;

                case PlayMode.PINGPONG:
                    _nextFrame = _updatePingpong;
                    if(reset) {
                        _currentFrameIndex = 0;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.FORWARDS;
                    }
                    break;

                case PlayMode.LOOP:
                    _nextFrame = _updateLoop;
                    if(reset) {
                        _currentFrameIndex = 0;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.FORWARDS;
                    }
                    break;

                case PlayMode.LOOP_REVERSED:
                    _nextFrame = _updateLoopReversed;
                    if(reset) {
                        _currentFrameIndex = _frames.length - 1;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.BACKWARDS;
                    }
                    break;

                case PlayMode.LOOP_PINGPONG:
                    _nextFrame = _updateLoopPingpong;
                    if(reset) {
                        _currentFrameIndex = 0;
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.FORWARDS;
                    }
                    break;

                case PlayMode.LOOP_RANDOM:
                    _rng = new gc.RNG();
                    _nextFrame = _updateLoopRandom;
                    if(reset) {
                        _currentFrameIndex = _rng.nextInt(_nFrames);
                        _currentFrame = _frames[_currentFrameIndex];
                        _playDirection = PlayDirection.RANDOM;
                    }
                    break;
            }

            return this;
        };

        /**
         * Updates the Animation by the specified time
         *
         * @param {Number} delta Number of milliseconds to update the Animation
         * @return {this}        Self object to allow chaining
         */
        this.update = function update(delta) {
            if(_playing) {
                _elapsedFrameTime += delta;

                while(_elapsedFrameTime > _currentFrame.time) {
                    _elapsedFrameTime -= _currentFrame.time;
                    _nextFrame();
                }

                _currentFrame = _frames[_currentFrameIndex];
            }

            return this;
        };

        /**
         * Get the gc.TextureRegion for the current frame
         *
         * @return {gc.TextureRegion} TextureRegion object for the current frame
         */
        this.getCurrentFrame = function getCurrentFrame() {
            return _currentFrame.src;
        };

        /**
         * Get the gc.TextureRegion for the specified frame
         *
         * @param  {Integer}                   n Number of the frame
         * @return {gc.TextureRegion}            TextureRegion object for the specified frame
         *
         * @throws {IndexOutOfBoundsException}   n must be inside 0..getTotalFrames()-1
         * @public
         */
        this.getFrame = function getFrame(n) {
            if(n < 0 || n >= _nFrames) {
                throw new gc.exception.IndexOutOfBounds();
            }
            return _frames[n];
        };

        /**
         * Get if the animation is playing currently or not
         *
         * @return {Boolean} true if it's playing, false if not
         *
         * @public
         */
        this.isPlaying = function isPlaying() {
            return _playing;
        };

        /**
         * Get if the animation is completed
         *
         * @return {Boolean} true if it's finished (stopped and won't continue until is reset) , false if not
         *
         * @public
         */
        this.isFinished = function isFinished() {
            return _finished;
        };

        /**
         * Get the total number of frames of the Animation
         *
         * @return {integer} number of frames of the Animation
         *
         * @public
         */
        this.getTotalFrames = function getTotalFrames() {
            return _nFrames;
        };

        /**
         * Get the sum of the duration of the Animation's frames.
         * If the Animation is LOOPED, PINGPONG... the sum of the frames is only taking into account once
         *
         * @return {Number} Duration of the animation in milliseconds.
         *
         * @public
         */
        this.getTotalTime = function getTotalTime() {
            return _totalTime;
        };

        /**
         * Add a callback to execute when the Animation is finished
         * This happens in the NORMAL, REVERSED and PINGPONG Animation.PlayMode s
         *
         * @param {Function} callback Function to execute
         * @return {this}             Self object to allow chaining
         *
         * @public
         */
        this.onFinish = function finish(callback) {
            _onFinish.push(callback);

            return this;
        };

        /**
         * Add a callback to execute when the Animation changes direction.
         * This happens in the Animation.PlayMode.PINGPONG and Animation.PlayMode.LOOP_PINGPONG animations
         *
         * @param  {Function} callback Function to execute
         * @return {this}     Self object to allow chaining
         *
         * @public
         */
        this.onChangeDirection = function changeDirection(callback) {
            _onChangeDirection.push(callback);
        };

        // call the constructor
        _construct.apply(this, arguments);
    };

    ///////////////////////////////
    // Export the public objects //
    ///////////////////////////////

    if(!window.gc) {
        window.gc = {};
        gc = window.gc;
    }
    gc.Animation = Animation;
    gc.util.defineConstant(gc.Animation, "VERSION", VERSION);
    gc.util.defineConstant(gc.Animation, "PlayMode", PlayMode);

} (window, window.gc));
