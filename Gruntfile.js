module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            docs: ['docs'],
            build: ['build']
        },

        jsdoc: {
            build: {
                src: [
                    'src/*.js',
                    'README.md',
                    '!src/_template_.js',
                    '!src/_Stage_.js',
                    '!src/polyfill.js'
                ],
                options: {
                    destination: 'docs',
                    configure: 'jsdoc-config.json'
                }
            }
        },

        jshint: {
            build: {
                src: [
                    'src/*js',
                    '!src/_template_.js',
                    '!src/_Stage_.js'
                ],
                options: {
                    eqnull: true,           // Use '===' to compare with 'null'.
                    curly: true,            // force {}
                    browser: true,          // declare browser global variables
                    futurehostile: true,    // don't allow future reserved words
                    undef: true             // don't allow using undefined vars
                }
            }
        },

        uglify: {
            options: {
                screwIE8: true,
                sourceMap: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */'
            },
            build: {
                files: {
                    'build/<%= pkg.name %>.min.js': [
                        'src/polyfill.js',
                        'src/exception.js',
                        'src/util.js',
                        'src/Validator.js',
                        'src/validatorDefinitions.js',
                        'src/browser.js',
                        'src/InputManager.js',
                        'src/LocaleManager.js',
                        'src/RNG.js',
                        'src/Deferred.js',
                        'src/XHR.js',
                        'src/FPS.js',
                        'src/ResourceManager.js',
                        'src/Drawable.js',
                        'src/Camera2.js',
                        'src/Canvas2D.js',
                        'src/Point2.js',
                        'src/Size2.js',
                        'src/Rectangle.js',
                        'src/Easing.js',
                        'src/TextureRegion.js',
                        'src/Animation.js',
                        'src/Text.js',
                        'src/NinePatch.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    grunt.registerTask('default', ['clean:docs', 'jsdoc', 'jshint', 'uglify']);
};