/* globals module, app, process, require, console, express */

var cocktailsGet = require('./cocktails-get');
var cocktailsPost = require('./cocktails-post');

module.exports = function (app) {
	"use strict";

	// Homepage
	app.get('/', cocktailsGet.all);

	// Login
	app.post('/login', function (req, res) {
		return res.send(200, 'Todo');
	});

	// Add cocktail
	app.post('/', cocktailsPost.add);

	// View cocktail
	app.get('/view/:id', cocktailsGet.view);

	// Edit cocktail
	app.get('/edit/:id', cocktailsGet.edit);
	app.post('/edit/:id', cocktailsPost.add);

	// Remove cocktail
	app.get('/remove/:id', cocktailsGet.remove);

};
