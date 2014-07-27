/* globals module, app, process, require, console, express */

// Module includes
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

module.exports = function (app, express, passport) {
	"use strict";

	// Basic setup
	app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
	app.set('views', 'views');
	app.set('view engine', 'jade');

	// Set static folder
	app.use(express.static('dist'));

	// Parse incoming POST requests and outgoing API requests
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	// Used for session authentication
	app.use(cookieParser('c9179023350f09f9e8ecfa1ab0507160'));
	app.use(session({
		secret: process.env.SECRET || 'c9179023350f09f9e8ecfa1ab0507160',
		cookie: {
			maxAge: (60 * 60 * 24 * 7) // one week
		},
		resave: true,
		saveUninitialized: true
	}));

	// Required to initialize Passport
	app.use(passport.initialize());

	// Persistent login sessions
	app.use(passport.session());

	// Flash messages on system actions
	app.use(flash());

};