/* globals require, module, console */
'use strict';

// Module includes
var _ = require('underscore');
var async = require('async');

// App includes
var Tag = require('./models/Tag');
var Cocktail = require('./models/Cocktail');

/**
 * Remove a cocktail
 *
 * @param req
 * @param res
 */
module.exports.remove = function (req, res) {

	// Array for async functions
	var asyncLoader = [];

	// Set scope for tag
	var tag;

	// Get the tag to remove
	asyncLoader.push(function (callback) {
		Tag.findOne({_id: req.param('id')}, function (err, result) {
			if (err) {
				callback(err);
			}
			tag = result;
			callback();
		});
	});

	// Delete the tag if it exists
	asyncLoader.push(function (callback) {
		if (!tag) {
			callback();
		}

		Tag.remove({_id: tag._id}, function (err) {
			if (err) {
				callback(err);
			}
			callback();
		});
	});

	// Run all functions and redirect to the homepage
	async.series(asyncLoader, function (err) {

		if (err) {
			console.log(err);
		}

		// Find cocktails assigned to this tag
		Cocktail.find({tags: tag.slug}, function (err, cocktails) {
			if (err) {
				throw(err);
			}

			// For each cocktail, run the function to remove the tag
			async.eachSeries(cocktails, function (cocktail, callback) {

				//console.log(cocktail.tags.indexOf(tag.slug));
				//callback();
				cocktail.tags.splice(cocktail.tags.indexOf(tag.slug), 1);

				// Update cocktail with new tag array
				Cocktail.update(
					{_id: cocktail._id},
					{tags: cocktail.tags},
					{},
					function (err) {
						callback(err ? err : null);
					}
				);

			}, function (err) {
				if (err) {
					throw err;
				}
				return res.redirect('/#tags');
			});
		});
	});
};
