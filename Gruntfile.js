/* globals module, grunt, require */

module.exports = function (grunt) {
	'use strict';

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var watchFiles = [
		'assets/sass/**/*.sass',
		'assets/sass/**/*.scss',
		'assets/js/*.js',
		'Gruntfile.js'
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean     : ['dist'],
		copy      : {
			main: {
				files: [
					{
						expand : true,
						cwd    : 'assets/js',
						src    : ['bootstrap.min.js'],
						dest   : 'dist/js',
						flatten: false,
						filter : 'isFile'
					},
					{
						expand : true,
						cwd    : 'assets/fonts',
						src    : ['*.*'],
						dest   : 'dist/css/bootstrap',
						flatten: false,
						filter : 'isFile'
					}
				]
			}
		},
		browserify: {
			backbone: {
				files  : {
					'dist/js/main.js': 'assets/js/backbone/**/*.js'
				}
			},
			jquery  : {
				files  : {
					'dist/js/main.js': 'assets/js/jquery/**/*.js'
				},
				options: {
					transform: ['uglifyify']
				}
			},
			options: {
				debug    : true
			}

		},
		sass      : {
			all: {
				files  : {
					'dist/css/style.css': 'assets/sass/style.sass'
				},
				options: {
					style: 'compressed'
				}
			}
		},
		watch     : {
			jquery: {
				scripts: {
					files: watchFiles.push('assets/js/jquery/**/*.js'),
					tasks: ['build']
				}
			}
		}
	});// end grunt.initConfig

	grunt.registerTask('default', []);
	grunt.registerTask('build-jq', ['clean', 'copy', 'sass', 'browserify:jquery']);
	grunt.registerTask('build-bb', ['clean', 'copy', 'sass', 'browserify:backbone']);
	grunt.registerTask('serve', ['build', 'watch']);

};