/* globals module, app, process, require, console, express */

var cocktailsGet = require('./cocktails-get');
var cocktailsPost = require('./cocktails-post');

module.exports = function (app, passport) {
	"use strict";

	// Homepage
	app.get('/', cocktailsGet.all);

	// Login, register, logout
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/#login',
		failureFlash   : true
	}));

	app.post('/register', passport.authenticate('local-register', {
		successRedirect : '/',
		failureRedirect : '/#login',
		failureFlash : true
	}));

	app.get('/logout', isAdmin, function (req, res) {
		req.logout();
		res.redirect('/');
	});

	// Add cocktail
	app.post('/', isAdmin, cocktailsPost.add);

	// View cocktail
	app.get('/view/:id', cocktailsGet.view);

	// Edit cocktail
	app.get('/edit/:id', isAdmin, cocktailsGet.edit);
	app.post('/edit/:id', isAdmin, cocktailsPost.add);

	// Remove cocktail
	app.get('/remove/:id', isAdmin, cocktailsGet.remove);

};

function isAdmin(req, res, next) {
	"use strict";

	if (req.isAuthenticated()) {
		return next();
	}

	return res.redirect('/#login');
}