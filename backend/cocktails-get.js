/* globals require, module, console */

// Grab libraries
var _ = require('underscore');
var async = require('async');

// Grab Mongoose models
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
	// Do we have a user?
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
				});

			});
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
		} else {
			cocktail.tagNames = [];
			callback(null);
		}
	});


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

	var asyncLoader = [];
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

		Cocktail.remove({_id: cocktail._id}, function (err, result) {
			if (err) {
				callback(err);
			}
			callback(null);
		});
	});

	// Run all functions and redirect to the homepage
	async.series(asyncLoader, function () {

		// Iterate through the tags to delete empty ones
		async.eachSeries(cocktail.tags, function (item, callback) {

			Cocktail.find({tags: item}, function (err, result) {
				if (err) {
					callback(err);
				}
				if (!result.length) {
					Tag.remove({slug: item}, function (err, result) {
						if (err) {
							callback(err);
						}
						callback(null);
					});
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