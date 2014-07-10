/* globals module, app, process, require, console */

var express = require('express');
var bodyParser = require('body-parser');

// Initialize & configure express app
var app = express();

// Configure Express
require('./config/config.js')(app);

// Mongoose and MongoDB
require('./config/db.js');

// All URL routes
require('./backend/routes.js')(app);

// Start server
app
	.listen(app.get('port'), function () {
		console.log('The server is running on ' + app.get('port'));
	})
	.on('error', function () {
		console.log('ERROR! Shutting down server...');
		this.close();
	});
