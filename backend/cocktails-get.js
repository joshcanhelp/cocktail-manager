/* globals require, module, console */

// Module includes
var _ = require('underscore');
var async = require('async');

// App includes
var Tag = require('./models/Tag');
var Cocktail = require('./models/Cocktail');
var User = require('./models/User');

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

		// Get all cocktails, sorted newest to oldest
		Cocktail.find({}, {},
			{ sort: { date: -1 } },
			function (err, result) {
				if (err) {
					callback(err);
				}
				pageVars.cocktails = result;
				callback(null);
			}
		);

	});

	// All tags for on-page filtering
	asyncLoader.push(function (callback) {

		// Get all tags sorted alpha by slug
		Tag.find({}, {},
			{ sort: {	slug: 1	}	},
			function (err, result) {
				if (err) {
					callback(err);
				}
				pageVars.tags = result;
				callback(null);
			}
		);
	});

	// Check for a user to build the auth form
	asyncLoader.push(function (callback) {

		User.findOne({}, function (err, result) {
				if (err) {
					callback(err);
				}
				pageVars.hasUser = result ? true : false;
				callback(null);
			}
		);
	});

	// Run the functions as a series, serve the page when complete
	async.series(asyncLoader, function () {
		pageVars.pageTitle = 'Cocktail Manager';
		pageVars.isAdmin = req.isAuthenticated();
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

	Cocktail.findOne(
		{_id: req.param('id')},
		function (err, cocktail) {

			if (err) {
				throw err;
			}

			// If we have tags, need the full name for each
			if (cocktail.tags.length) {
				Tag.find(
					{ slug: { $in: cocktail.tags } },
					function (err, tags) {

						if (err) {
							throw err;
						}

						cocktail.tags = _.map(tags, function (value, key, list) {
							return value.name;
						});

						return res.render('view', {
							pageTitle: cocktail.name,
							cocktail : cocktail
						});

					});

			// No tags so just serve the page
			} else {
				return res.render('view', {
					pageTitle: cocktail.name,
					cocktail : cocktail,
					isAdmin: req.isAuthenticated()
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

	// Array for async functions
	var asyncLoader = [];

	// Set scope for cocktail
	var cocktail;

	// Get the cocktail to edit
	asyncLoader.push(function (callback) {

		Cocktail.findOne(
			{ _id: req.param('id') },
			function (err, result) {
				if (err) {
					callback(err);
				}
				cocktail = result;
				callback(null);
			});

	});

	// Get all tags for the cocktail and format the display
	asyncLoader.push(function (callback) {

		// If we have tags, get and format
		if (cocktail.tags.length) {

			Tag.find(
				{ slug: { $in: cocktail.tags } },
				function (err, tags) {

					if (err) {
						callback(err);
					}

					// Get all the tag name so they're displayed properly
					cocktail.tagNames = _.map(tags, function (value) {
						return value.name;
					});

					callback(null);
				});

		// No tags to display
		} else {
			cocktail.tagNames = [];
			callback(null);
		}

	});

	// Run all functions in series and render the page
	async.series(asyncLoader, function () {
		return res.render('edit', {
			pageTitle: 'Edit ' + cocktail.name,
			cocktail : cocktail,
			isEdit   : true
		});
	});

};

/**
 * Remove a cocktail
 *
 * @param req
 * @param res
 */
module.exports.remove = function (req, res) {
	"use strict";

	// Array for async functions
	var asyncLoader = [];

	// Set scope for cocktail
	var cocktail;

	// Get the cocktail to remove
	asyncLoader.push(function (callback) {
		Cocktail.findOne({_id: req.param('id')}, function (err, result) {
			if (err) {
				callback(err);
			}
			cocktail = result;
			callback(null);
		});
	});

	// Delete the cocktail if it exists
	asyncLoader.push(function (callback) {
		if (!cocktail) {
			callback(null);
		}

		Cocktail.remove({_id: cocktail._id}, function (err) {
			if (err) {
				callback(err);
			}
			callback(null);
		});
	});

	// Run all functions and redirect to the homepage
	async.series(asyncLoader, function () {

		// For each tag, run the function to check for associated cocktails
		async.eachSeries(cocktail.tags, function (item, callback) {

			// Find a cocktail, if any
			Cocktail.findOne({tags: item}, function (err, result) {
				if (err) {
					callback(err);
				}

				// No cocktails? Remove the tag
				if (!result.length) {
					Tag.remove({slug: item}, function (err, result) {
						if (err) {
							callback(err);
						}
						callback(null);
					});

				// Otherwise, continue
				} else {
					callback(null);
				}

			});
		}, function (err) {
			if (err) {
				throw err;
			}
			return res.redirect('/#view-all');
		});

	});
};