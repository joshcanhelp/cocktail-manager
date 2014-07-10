/* globals module, app, process, require, console */

var mongoose = require('mongoose');
var nodeEnv = process.env.NODE_ENV || 'production';

// Set DB URI based on NODE_ENV
var dbLocations = {
	production : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/cocktail-manager',
	development: 'mongodb://localhost/cocktail-manager',
	test       : 'mongodb://localhost/cocktail-manager-test'
};

// Connect when this file is required
module.exports = mongoose.connect(dbLocations[nodeEnv], function (err) {
	"use strict";

	if (err) {
		console.log('ERROR connecting to: ' + dbLocations[nodeEnv] + '. ' + err);
	} else {
		console.log('Succeeded connecting to: ' + dbLocations[nodeEnv]);
	}
});