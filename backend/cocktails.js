/* globals require, module, console */

// Grab libraries
var _ = require('underscore');
var async = require('async');

// Grab Mongoose models
var Tag = require('./models/Tag');
var Cocktail = require('./models/Cocktail');

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

	async.series(asyncLoader, function () {
		pageVars.pageTitle = 'Cocktail Manager';
		pageVars.isAdmin = true;
		// console.log(pageVars);
		return res.render('home', pageVars);
	});

};

module.exports.view = function (req, res) {
	"use strict";

	Cocktail.findOne({_id: req.param('id')}, function (err, result) {
		if (err) {
			throw err;
		}
		return res.render('view', {
			pageTitle: result.name,
			cocktail : result,
			isAdmin  : true
		});
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
			Cocktail.create(addCocktail, function (err, result) {
				if (err) {
					callback(err);
				}
				callback(null);
			});
		}
	);

	async.series(asyncLoader, function () {
		return res.redirect('/#view-all');
	});
};

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

function createSlug(text) {
	"use strict";

	return text
			.toLowerCase()
			.replace(/[^\w ]+/g, '')
			.replace(/ +/g, '-');
}