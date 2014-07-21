/* globals module, process, require, console */

var LocalStrategy = require('passport-local').Strategy;

var User = require('../backend/models/User');

module.exports = function (passport) {
	"use strict";

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use('local-register', new LocalStrategy(
			{
				usernameField    : 'loginEmail',
				passwordField    : 'loginPassword',
				passReqToCallback: true
			},
			function (req, email, password, done) {

				process.nextTick( function () {

						User.findOne({}, function (err, user) {
							if (err) {
								return done(err);
							}

							if (user) {
								return done(null, false, req.flash('signupMessage', 'No more signups allowed.'));
							} else {

								var newUser = new User();

								newUser.localAuth.email = email;
								newUser.localAuth.password = newUser.generateHash(password);

								newUser.save(function (err) {
									if (err) {
										throw err;
									}
									return done(null, newUser);
								});

							}
						});

				});
			}
	));

	passport.use('local-login', new LocalStrategy(
		{
			usernameField    : 'loginEmail',
			passwordField    : 'loginPassword',
			passReqToCallback: true
		},
		function (req, email, password, done) {

			User.findOne({ 'localAuth.email': email }, function (err, user) {

				if (err) {
					return done(err);
				}

				if (!user || !user.validPassword(password)) {
					return done(null, false, req.flash('loginMessage', 'Incorrect. Try again.'));
				}

				return done(null, user);
			});

	}));

};