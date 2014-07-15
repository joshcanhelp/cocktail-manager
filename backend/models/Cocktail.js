/* globals module, require */
var mongoose = require('mongoose');

module.exports = mongoose.model('Cocktail', mongoose.Schema({
	name: String,
	description: String,
	date: Date,
	ingredients: [{
		amount: String,
		unit: String,
		name: String
	}],
	steps: [],
	tags: []
}));