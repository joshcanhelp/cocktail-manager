/* globals require, module, console */

var _ = require('underscore');
var Cocktail = require('./models/Cocktail');

module.exports.get = function (req, res) {
	"use strict";

	Cocktail.find({}, function (err, result) {
		if (err) {
			throw err;
		}
		return res.render('index', {
			pageTitle: 'Home Page!',
			cocktails: result
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
		ingredients: [],
		steps: req.body['cocktailStep[]']
	};

	var addTags = _.map(req.body.cocktailTags.split(','), function (val, key, list) {
		return val.trim();
	});

	_.each(req.body['cocktailPartsAmount[]'], function (el, index, list) {
		if (!el.length) {
			return;
		}
		addCocktail.ingredients.push({
			amount: el.trim(),
			unit: req.body['cocktailPartsUnit[]'][index].trim(),
			name: req.body['cocktailPartsName[]'][index].trim()
		});
	});

	Cocktail.create(addCocktail, function (err, result) {
		if (err) {
			throw err;
		}
		return res.redirect('/?saved=1');
	});
};