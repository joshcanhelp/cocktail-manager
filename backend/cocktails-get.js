/* globals require, module, console */

// Grab libraries
var _ = require('underscore');
var async = require('async');

// Grab Mongoose models
var Tag = require('./models/Tag');
var Cocktail = require('./models/Cocktail');

/**
 * Get all cocktails and tags for display on the homepage
 *
 * @param req
 * @param res
 */
module.exports.all = function (req, res) {
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
		return res.render('home', pageVars);
	});

};

/**
 * Show a single cocktail
 *
 * @param req
 * @param res
 */
module.exports.view = function (req, res) {
	"use strict";

	Cocktail.findOne({_id: req.param('id')}, function (err, cocktail) {
		if (err) {
			throw err;
		}

		// If we have tags, need the full name for each
		if (cocktail.tags.length) {
			Tag.find({slug: {$in: cocktail.tags}}, function (err, tags) {
				if (err) {
					throw err;
				}

				cocktail.tags = _.map(tags, function (value, key, list) {
					return value.name;
				});

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

/**
 * Show the edit cocktail form
 *
 * @param req
 * @param res
 */
module.exports.edit = function (req, res) {
	"use strict";

	var asyncLoader = [];
	var cocktail;

	// Get the cocktail to edit
	asyncLoader.push(function (callback) {
		Cocktail.findOne({_id: req.param('id')}, function (err, result) {
			if (err) {
				callback(err);
			}
			cocktail = result;
			callback(null);
		});
	});

	// Get all tags for the cocktail and format the display
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