const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const keys = require('./keys');
const { EMAIL_PROVIDER, ADMIN_EMAILS } = require('../constants');
const User = require('../models/User'); // Adjust the path if necessary

const { google } = keys;
const secret = keys.jwt.secret;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

passport.use(
	new JwtStrategy(opts, (payload, done) => {
		User.findById(payload.id)
			.then((user) => {
				if (user) {
					return done(null, user);
				}
				return done(null, false);
			})
			.catch((err) => {
				return done(err, false);
			});
	})
);

const googleAuth = () => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: google.clientID,
				clientSecret: google.clientSecret,
				callbackURL: '/api/auth/google/callback',
				scope: ['profile', 'email']
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					// Check if the email is allowed for login
					const userEmail = profile.email;
					if (!ADMIN_EMAILS.includes(userEmail)) {
						return done(null, false, { message: 'Unauthorized: Email not allowed for admin login' });
					}

					// Check if the user exists
					let user = await User.findOne({ email: userEmail });
					if (user) {
						return done(null, user);
					}

					// Create a new user if they don't exist
					const name = profile.displayName.split(' ');
					const newUser = new User({
						provider: EMAIL_PROVIDER.Google,
						googleId: profile.id,
						email: userEmail,
						firstName: name[0],
						lastName: name[1],
						avatar: profile.picture,
						password: null
					});

					user = await newUser.save();
					return done(null, user);
				} catch (err) {
					return done(err, false);
				}
			}
		)
	);
};

module.exports = {
	initializePassport: (app) => {
		app.use(passport.initialize());
		googleAuth(); // Initialize only Google authentication
	},
	passport
};
