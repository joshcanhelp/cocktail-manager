/* globals module, process, require, console */
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

var UserSchema = mongoose.Schema({
	role : String,
	localAuth: {
		email: String,
		password: String
	}
});

UserSchema.methods.generateHash = function (password) {

	return bcrypt.hashSync(password, bcrypt.genSaltSync(6), null);
};

UserSchema.methods.validPassword = function (password) {

	return bcrypt.compareSync(password, this.localAuth.password);
};

module.exports = mongoose.model('User', UserSchema);

