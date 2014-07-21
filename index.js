/* globals module, app, process, require, console */

var express = require('express');
var passport = require('passport');

// Initialize & configure express app
var app = express();

// Configure Passport
require('./config/passport')(passport);

// Configure Express
require('./config/config')(app, express, passport);

// Mongoose and MongoDB
require('./config/db');

// All URL routes
require('./backend/routes')(app, passport);

// Start server
app
	.listen(app.get('port'), function () {
		console.log('The server is running on ' + app.get('port'));
	})
	.on('error', function () {
		console.log('ERROR! Shutting down server...');
		this.close();
	});
