/* globals module, app, process, require, console, express */

var cocktails = require('./cocktails');

module.exports = function (app) {
	"use strict";

	// Homepage
	app.get('/', cocktails.get);

	// Add cocktail
	app.post('/', cocktails.add);
};
