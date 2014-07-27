/* globals module, app, process, require, console */

var mongoose = require('mongoose');
var nodeEnv = process.env.NODE_ENV || 'production';

var dbName = nodeEnv === 'test' ? 'cocktail-manager-test' : 'cocktail-manager';
var dbUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.OPENSHIFT_MONGODB_DB_URL;

if (!dbUrl) {
	dbUrl = 'mongodb://localhost/';
}

// Connect when this file is required
module.exports = mongoose.connect(dbUrl + dbName, function (err) {
	"use strict";

	if (err) {
		console.log('ERROR connecting to: ' + dbUrl + dbName + '. ' + err);
	} else {
		console.log('Succeeded connecting to: ' + dbUrl + dbName);
	}

});