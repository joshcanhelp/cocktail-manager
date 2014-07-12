/* globals module, require */
var mongoose = require('mongoose');

module.exports = mongoose.model('Tag', mongoose.Schema({
	name: String
}));