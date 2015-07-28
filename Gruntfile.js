module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean : {
            docs: ['docs'],
            build: ['build']
        },

        jsdoc : {
            build : {
                src: [
                    'src/*.js',
                    'README.md',
                    '!src/_template_.js',
                    '!src/polyfill.js'
                ],
                options: {
                    destination: 'docs',
                    configure: 'jsdoc-config.json'
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
                        'src/*.js',
                        '!src/_template_.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['clean:docs', 'jsdoc', 'uglify']);
};