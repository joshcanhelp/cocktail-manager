/* globals module, app, process, require, console, express */

var cocktails = require('./cocktails');

module.exports = function (app) {
	"use strict";

	// Homepage
	app.get('/', cocktails.get);

	// Login
	app.post('/login', function (req, res) {
		return res.send(200, 'Todo');
	});

	// Add cocktail
	app.post('/', cocktails.add);

	// View cocktail
	app.get('/view/:id', cocktails.view);

	// Edit cocktail
	app.get('/edit/:id', function (req, res) {
		return res.send(200, 'Todo');
	});

	// Remove cocktail
	app.get('/remove/:id', function (req, res) {
		return res.send(200, 'Todo');
	});

};
