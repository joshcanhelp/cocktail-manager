/* globals module, process, require, console */

// Module includes
var LocalStrategy = require('passport-local').Strategy;

// App includes
var User = require('../backend/models/User');

module.exports = function (passport) {
	"use strict";

	// Serialize user instances to the session
	// http://passportjs.org/guide/configure/ - "Sessions"
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// Deserialize user instances from the session
	// http://passportjs.org/guide/configure/ - "Sessions"
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// Registration process
	passport.use('local-register', new LocalStrategy(
		{
			usernameField    : 'loginEmail',
			passwordField    : 'loginPassword',
			passReqToCallback: true
		},
		function (req, email, password, done) {

			process.nextTick( function () {

				// Only one user allowed on this site
				User.findOne({}, function(err, user) {

					if (err) {
						return done(err);
					}

					// Already have a user so no registration allowed
					if (user) {
						return done(null, false, req.flash('signupMessage', 'No more signups allowed.'));

					// No user so let's add one
					} else {

						var newUser = new User();

						newUser.localAuth.email = email;
						newUser.localAuth.password = newUser.generateHash(password);

						newUser.save(function (err) {
							if (err) {
								return done(err);
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

			// Only one user allowed on this site
			User.findOne({}, function (err, user) {

				if (err) {
					return done(err);
				}

				// Wrong email or password
				if (!user || !user.validPassword(password)) {
					return done(null, false, req.flash('loginMessage', 'Incorrect. Try again.'));
				}

				return done(null, user);
			});

	}));

};