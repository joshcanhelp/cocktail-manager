/* globals module, app, process, require, console, express */

module.exports = function (app) {
	"use strict";

	// Homepage
	app.get('/', function (req, res) {
		return res.render('index', {
			pageTitle: 'Home Page!',
			cocktails: [
				{
					id: 1,
					name: 'Perfect Margarita',
					tags: ['margarita', 'summer', 'lime']
				},
				{
					id: 2,
					name: 'Classic Manhattan',
					tags: ['vintage', 'whisky', 'fall']
				}
			]
		});
	});

	// Add cocktail
	app.post('/', function (req, res) {
		return res.json(req.body);
	});
};
