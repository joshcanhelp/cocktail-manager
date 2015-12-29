/* globals module, app, process, require, console, express */

// Module includes
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var path = require('path');
var MongoStore = require('connect-mongo')(session);

module.exports = function (app, express, passport, dbConnection) {
	"use strict";

	var oneWeek = 60 * 60 * 24 * 7 * 1000;

	// Basic setup
	app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
	app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'jade');

	// Set static folder
	app.use(express.static('dist'));

	// Parse incoming POST requests and outgoing API requests
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	// Used for session authentication
	app.use(cookieParser('c9179023350f09f9e8ecfa1ab0507160'));
	app.use(session({
		secret           : process.env.SECRET || 'c9179023350f09f9e8ecfa1ab0507160',
		cookie           : {
			expires: new Date(Date.now() + oneWeek),
			maxAge: oneWeek
		},
		resave           : true,
		saveUninitialized: true,
		store            : new MongoStore(
			{ db: dbConnection.connections[0].name }
		)
	}));
	// Required to initialize Passport
	app.use(passport.initialize());

	// Persistent login sessions
	app.use(passport.session());

	// Flash messages on system actions
	app.use(flash());

};