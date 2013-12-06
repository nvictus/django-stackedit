module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-bump');

    /***************************************************************************
     * Configuration
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                curly: true,
                browser: true,
                devel: true,
                indent: 4,
                latedef: true,
                undef: true,
                unused: true,
                expr: true,
                globals: {
                    "define": false,
                    "require": false,
                },
                ignores: [
                    'node_modules/**/*.js',
                    'static/stackedit/libs/**/*.js',
                    'static/stackedit/res/libs/**/*.js',
                    'static/stackedit/res/bower-libs/**/*.js',
                    'static/stackedit/res-min/**/*.js'
                ]
            },
            client: ['static/stackedit/**/*.js'],
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "static/stackedit/res",
                    name: "main",
                    out: "static/stackedit/res-min/main.js",
                    mainConfigFile: 'static/stackedit/res/main.js',
                    optimize: "uglify2",
                    inlineText: true,
                    uglify2: {
                        output: {
                            beautify: true,
                            indent_level: 1,
                        },
                    },
                    excludeShallow: [
                        'css/css-builder',
                        'less/lessc-server',
                        'less/lessc'
                    ],
                }
            }
        },
        less: {
            compile: {
                files: [
                    {
                        expand: true,
                        cwd: 'static/stackedit/res/themes',
                        src: [
                            '*.less'
                        ],
                        dest: 'static/stackedit/res-min/themes',
                        ext: '.css',
                    }
                ]
            },
            compress: {
                options: {
                    compress: true,
                    paths: 'static/stackedit/res/styles'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'static/stackedit/res-min/themes',
                        src: [
                            '*.css'
                        ],
                        dest: 'static/stackedit/res-min/themes',
                    }
                ]
            },
        },
        'string-replace': {
            'css-import': {
                files: {
                    './': 'static/stackedit/res-min/themes/*.css',
                },
                options: {
                    replacements: [
                        {
                            pattern: /@import /g,
                            replacement: '@import (less) '
                        },
                    ]
                }
            },
            'font-parameters': {
                files: {
                    './': 'static/stackedit/res-min/themes/*.css',
                },
                options: {
                    replacements: [
                        {
                            pattern: /(font\/fontello\.\w+)\?\w+/g,
                            replacement: '$1'
                        }
                    ]
                }
            },
            'constants': {
                files: {
                    'static/stackedit/res/constants.js': 'static/stackedit/res/constants.js'
                },
                options: {
                    replacements: [
                        {
                            pattern: /constants\.VERSION = .*/,
                            replacement: 'constants.VERSION = "<%= pkg.version %>";'
                        },
                    ]
                }
            },
            'cache-manifest': {
                files: {
                    'static/stackedit/cache.manifest': 'static/stackedit/cache.manifest'
                },
                options: {
                    replacements: [
                        {
                            pattern: /(#Date ).*/,
                            replacement: '$1<%= grunt.template.today() %>'
                        },
                        {
                            pattern: /(#DynamicResourcesBegin\n)[\s\S]*(\n#DynamicResourcesEnd)/,
                            replacement: '$1<%= resources %>$2'
                        },
                    ]
                }
            },
        },
        copy: {
            resources: {
                files: [
                    // Fonts
                    {
                        expand: true,
                        cwd: 'static/stackedit/res/font',
                        src: [
                            '**'
                        ],
                        dest: 'static/stackedit/res-min/font/'
                    },
                    {
                        expand: true,
                        cwd: 'static/stackedit/res/libs/fontello/font',
                        src: [
                            '**'
                        ],
                        dest: 'static/stackedit/res-min/font/'
                    },
                    // Images
                    {
                        expand: true,
                        cwd: 'static/stackedit/res/img',
                        src: [
                            '**'
                        ],
                        dest: 'static/stackedit/res-min/img/'
                    },
                    // Libraries
                    {
                        expand: true,
                        cwd: 'static/stackedit/res/bower-libs/requirejs',
                        src: [
                            'require.js'
                        ],
                        dest: 'static/stackedit/res-min/'
                    },
                ]
            }
        },
        // Inject bower dependencies into RequireJS configuration
        bower: {
            target: {
                rjsConfig: 'static/stackedit/res/main.js'
            }
        },
        bump: {
            options: {
                files: [
                    'package.json',
                    'bower.json'
                ],
                updateConfigs: [
                    'pkg'
                ],
                commitFiles: [
                    '-a'
                ],
                pushTo: 'origin'
            }
        },
    });

    /***************************************************************************
     * Clean
     */
    grunt.registerTask('clean', function() {

        // Remove static/stackedit/res-min folder
        grunt.file['delete']('static/stackedit/res-min');

    });

    /***************************************************************************
     * Build JavaScript
     */
    grunt.registerTask('build-js', function() {

        // JSHint validation
        grunt.task.run('jshint');

        // Run r.js optimization
        grunt.task.run('requirejs');

    });

    /***************************************************************************
     * Build CSS
     */
    grunt.registerTask('build-css', function() {

        // First compile less files
        grunt.task.run('less:compile');
        // Then force evaluation of CSS imports
        grunt.task.run('string-replace:css-import');
        // Run less another time with CSS evaluation and compression
        grunt.task.run('less:compress');
        // Remove fontello checksum arguments
        grunt.task.run('string-replace:font-parameters');

    });

    /***************************************************************************
     * Resources
     */
    grunt.registerTask('build-res', function() {

        // Copy some resources (images, fonts...)
        grunt.task.run('copy:resources');

        // List resources and inject them in cache.manifest
        var resFolderList = [
            'static/stackedit/res-min',
            'static/stackedit/libs/dictionaries',
            'static/stackedit/libs/MathJax/extensions',
            'static/stackedit/libs/MathJax/fonts/HTML-CSS/TeX/woff',
            'static/stackedit/libs/MathJax/jax/element',
            'static/stackedit/libs/MathJax/jax/output/HTML-CSS/autoload',
            'static/stackedit/libs/MathJax/jax/output/HTML-CSS/fonts/TeX',
            'static/stackedit/libs/MathJax/jax/output/HTML-CSS/fonts/STIX'
        ];
        grunt.task.run('list-res:' + resFolderList.join(':'));
        grunt.task.run('string-replace:cache-manifest');

    });

    grunt.registerTask('list-res', function() {
        var resourceList = [];
        grunt.util.recurse(arguments, function(arg) {
            grunt.log.writeln('Listing resources: ' + arg);
            grunt.file.recurse(arg, function(abspath) {
                resourceList.push(abspath.replace(/^static\/stackedit\//, ''));
            });
        });
        grunt.config.set('resources', resourceList.join('\n'));
    });

    /***************************************************************************
     * Default task
     */
    grunt.registerTask('default', function() {
        grunt.task.run('clean');
        grunt.task.run('build-js');
        grunt.task.run('build-css');
        grunt.task.run('build-res');
    });

    /***************************************************************************
     * Tag task
     */
    grunt.registerTask('tag', function(versionType) {
        grunt.task.run('bump-only:' + (versionType || 'patch'));
        grunt.task.run('string-replace:constants');
        grunt.task.run('default');
        grunt.task.run('bump-commit');
    });
};
