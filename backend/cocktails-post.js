/* globals require, module, console */
'use strict';

// Module includes
var _ = require('underscore');
var async = require('async');

// App includes
var Tag = require('./models/Tag');
var Cocktail = require('./models/Cocktail');

module.exports.add = function (req, res) {

	// Basic cocktail fields
	var addCocktail = {
		name       : req.body.cocktailName,
		description: req.body.cocktailDesc,
		date       : new Date(),
		steps      : req.body['cocktailStep[]'],
		ingredients: prepareIngredients(req.body),
		tags       : []
	};

	// Array for async functions
	var asyncLoader = [];

	// Pull apart the incoming tags list
	_.each(req.body.cocktailTags.split(','), function (el, index, list) {

		// Make sure we have a string, trim whitespace, and prepare
		var tagName = el.toString().trim();
		var tagSlug = createSlug(tagName);

		asyncLoader.push( function (callback) {

			// Make sure we have something to store
			if (tagSlug) {

				// If that tag exists already, no need to add
				Tag.findOne({slug: tagSlug}, function (err, tag) {
					if (err) {
						callback(err);
					}

					// Associate the tag with the cocktail and continue
					if (tag) {
						addCocktail.tags.push(tagSlug);
						callback(null);

					// Otherwise, create the tag
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
			} else {
				callback(null);
			}
		});
	});

	asyncLoader.push( function (callback) {

		// Editing
		if (req.param('id')) {
			Cocktail.update({_id: req.param('id')}, addCocktail, function (err, result) {
				if (err) {
					callback(err);
				}
				addCocktail.id = req.param('id');
				callback(null);
			});

		// Adding
		} else {
			Cocktail.create(addCocktail, function (err, result) {
				if (err) {
					callback(err);
				}
				addCocktail.id = result._id;
				callback(null);
			});
		}
	});

	// Run all functions and redirect to the View page
	async.series(asyncLoader, function () {
		return res.redirect('/view/' + addCocktail.id);
	});
};

// Formats incoming ingredients for storage.
// Deals with body-parser using both string and arrays for multiple values.
function prepareIngredients(body) {

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

	return text
			.toLowerCase()
			.replace(/[^\w ]+/g, '')
			.replace(/ +/g, '-');
}
