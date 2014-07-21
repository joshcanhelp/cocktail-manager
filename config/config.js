/* globals module, app, process, require, console, express */

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

module.exports = function (app, express, passport) {
	"use strict";

	app.set('port', process.env.PORT || 3000);
	app.set('views', 'views');
	app.set('view engine', 'jade');

	app.use(express.static('dist'));

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use(cookieParser('c9179023350f09f9e8ecfa1ab0507160'));

	app.use(session({
		secret: process.env.SECRET || 'c9179023350f09f9e8ecfa1ab0507160',
		cookie: {
			maxAge: (60 * 60 * 24 * 7) // one week
		},
		resave: true,
		saveUninitialized: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
};