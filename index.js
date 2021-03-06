/* globals module, app, process, require, console */
'use strict';

// Module includes
var express = require('express');
var passport = require('passport');

// Initialize & configure express app
var app = express();

// Configure Passport
require('./config/passport')(passport);

// Mongoose and MongoDB
var dbConnection = require('./config/db');

// Configure Express
require('./config/config')(app, express, passport, dbConnection);

// All URL routes
require('./backend/routes')(app, passport);

// Start server
app.listen(app.get('port'), app.get('ipaddress'), function () {

		console.log('The server is running on ' + app.get('port'));
	})
	.on('error', function (err) {
		console.log('ERROR! Shutting down server...');
		throw err;
	});
