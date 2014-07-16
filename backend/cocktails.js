/* globals require, module, console */

// Grab libraries
var _ = require('underscore');
var async = require('async');

// Grab Mongoose models
var Tag = require('./models/Tag');
var Cocktail = require('./models/Cocktail');

// Get all cocktails for the homepage
module.exports.get = function (req, res) {
	"use strict";

	// Array for async functions
	var asyncLoader = [];

	// Jade template variables
	var pageVars = {};

	// Get all cocktails
	asyncLoader.push( function (callback) {

		Cocktail.find({}, {}, {
				sort: { date: -1 }
			},
			function (err, result) {
				if (err) {
					callback(err);
				}
				pageVars.cocktails = result;
				callback(null);
			}
		);

	});

	// Get all tags for filtering
	asyncLoader.push(function (callback) {

		Tag.find({}, {}, {
				sort: {
					slug: 1
				}
			},
			function (err, result) {
				if (err) {
					callback(err);
				}
				pageVars.tags = result;
				callback(null);
			}
		);
	});

	// Run the functions as a series, serve the page when complete
	async.series(asyncLoader, function () {
		pageVars.pageTitle = 'Cocktail Manager';
		pageVars.isAdmin = true;
		// console.log(pageVars);
		return res.render('home', pageVars);
	});

};

module.exports.view = function (req, res) {
	"use strict";

	Cocktail.findOne({_id: req.param('id')}, function (err, cocktail) {
		if (err) {
			throw err;
		}

		if (cocktail.tags.length) {
			Tag.find({slug: {$in: cocktail.tags}}, function (err, tags) {
				if (err) {
					throw err;
				}

				cocktail.tags = tags;

				return res.render('view', {
					pageTitle: cocktail.name,
					cocktail : cocktail,
					isAdmin  : true
				});

			});
		} else {
			return res.render('view', {
				pageTitle: cocktail.name,
				cocktail : cocktail,
				isAdmin  : true
			});
		}
	});

};

module.exports.add = function (req, res) {
	"use strict";

	var addCocktail = {
		name       : req.body.cocktailName,
		description: req.body.cocktailDesc,
		date       : new Date(),
		steps: req.body['cocktailStep[]'],
		ingredients: prepareIngredients(req.body),
		tags       : []
	};

	var asyncLoader = [];

	_.each(req.body.cocktailTags.split(','), function (el, index, list) {

		var tagName = el.toString().trim();
		var tagSlug = createSlug(tagName);

		asyncLoader.push(
			function (callback) {
				Tag.findOne({slug: tagSlug}, function (err, tag) {
					if (err) {
						callback(err);
					}

					if (tag) {
						addCocktail.tags.push(tagSlug);
						callback(null);
					} else {
						Tag.create({
								name: tagName,
								slug: tagSlug
							}, function (err, tag) {
							if (err) {
								callback(err);
							}
							addCocktail.tags.push(tagSlug);
							callback(null);
						});
					}
				});
			}
		);
	});

	asyncLoader.push(
		function (callback) {

			// Editing
			if (req.param('id')) {
				Cocktail.update({_id: req.param('id')}, addCocktail, function (err, result) {
					if (err) {
						callback(err);
					}
					callback(null);
				});

			// Adding
			} else {
				Cocktail.create(addCocktail, function (err, result) {
					if (err) {
						callback(err);
					}
					callback(null);
				});
			}
		}
	);

	async.series(asyncLoader, function () {
		return res.redirect('/#view-all');
	});
};

module.exports.edit = function (req, res) {
	"use strict";

	var asyncLoader = [];
	var cocktail;

	asyncLoader.push(function (callback) {
		Cocktail.findOne({_id: req.param('id')}, function (err, result) {
			if (err) {
				callback(err);
			}
			cocktail = result;
			callback(null);
		});
	});

	asyncLoader.push(function (callback) {
		if (cocktail.tags.length) {
			Tag.find({slug: {$in: cocktail.tags}}, function (err, tags) {
				if (err) {
					callback(err);
				}
				cocktail.tagNames = _.map(tags, function (value, key, list) {
					return value.name;
				});
				callback(null);
			});
		}
	});


	async.series(asyncLoader, function () {
		return res.render('edit', {
			pageTitle: 'Edit ' + cocktail.name,
			cocktail : cocktail,
			isAdmin  : true,
			isEdit   : true
		});
	});

};

// Formats incoming ingredients for storage.
// Deals with body-parser using both string and arrays for multiple values.
function prepareIngredients(body) {
	"use strict";

	var ingredients = [];

	if (typeof body['cocktailPartsAmount[]'] === "string") {
		ingredients.push({
			amount: body['cocktailPartsAmount[]'],
			unit  : body['cocktailPartsUnit[]'],
			name  : body['cocktailPartsName[]']
		});
	} else {
		_.each(body['cocktailPartsAmount[]'], function (el, index, list) {
			if (!el.length) {
				return;
			}
			ingredients.push({
				amount: el.trim(),
				unit  : body['cocktailPartsUnit[]'][index],
				name  : body['cocktailPartsName[]'][index]
			});
		});
	}

	return ingredients;
}

// Create a slug from a name
function createSlug(text) {
	"use strict";

	return text
			.toLowerCase()
			.replace(/[^\w ]+/g, '')
			.replace(/ +/g, '-');
}