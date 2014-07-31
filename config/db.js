/* globals module, app, process, require, console */
'use strict';

var mongoose = require('mongoose');

var nodeEnv = process.env.NODE_ENV || 'production';
var dbName = 'cocktail-manager';
var dbUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/';

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
	dbUrl = process.env.OPENSHIFT_MONGODB_DB_URL;
	dbName = 'cocktails';
} else if (nodeEnv === 'test') {
	dbName = 'cocktail-manager-test';
}

// Connect when this file is required
module.exports = mongoose.connect(dbUrl + dbName, function (err) {

	if (err) {
		console.log('ERROR connecting to: ' + dbUrl + dbName + '. ' + err);
	} else {
		console.log('Succeeded connecting to: ' + dbUrl + dbName);
	}

});
