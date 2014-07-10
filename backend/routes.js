/* globals module, app, process, require, console, express */

module.exports = function (app) {
	"use strict";

	// Homepage
	app.get('/', function (req, res) {
		return res.render('../dist/index.jade', {
			pageTitle: 'Home Page!'
		});
	});

};
