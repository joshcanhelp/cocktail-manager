/* globals require, module, console */

var _ = require('underscore');
var async = require('async');

var Tag = require('./models/Tag');
var Cocktail = require('./models/Cocktail');

module.exports.get = function (req, res) {
	"use strict";

	Cocktail.find({}, function (err, result) {
		if (err) {
			throw err;
		}
		return res.render('home', {
			pageTitle: 'Home Page!',
			cocktails: result,
			isadmin: true
		});
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
			isadmin  : true
		});
	});

};

module.exports.add = function (req, res) {
	"use strict";

	console.log(req.body);

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

		el = el.toString().trim();

		asyncLoader.push(
			function (callback) {
				Tag.findOne({name: el}, function (err, tag) {
					if (err) {
						callback(err);
					}

					if (tag) {
						addCocktail.tags.push({
							id  : tag._id,
							name: tag.name
						});
						callback(null);
					} else {
						Tag.create({name: el}, function (err, tag) {
							if (err) {
								callback(err);
							}
							addCocktail.tags.push({
								id: tag._id,
								name: tag.name
							});
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