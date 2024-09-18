const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const passport = require('passport');
const User = require('../models/User');
const { authorizeRole } = require('../middleware/authorizeRole');
const { ROLES, ADMIN_EMAILS } = require('../constants/index');

// Bring in Models & Helpers

const keys = require('../config/keys');
const { EMAIL_PROVIDER, JWT_COOKIE } = require('../constants/index');

const { secret, tokenLife } = keys.jwt;

router.get(
	'/google',
	passport.authenticate('google', {
		session: false,
		scope: ['profile', 'email'],
		accessType: 'offline',
		approvalPrompt: 'force'
		// prompt: 'select_account'
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: `${keys.app.clientURL}/login`,
		session: false
	}),
	(req, res) => {
		// const userId = req.user.userId;
		const payload = {
			id: req.user.id
		};

		// TODO find another way to send the token to frontend
		const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
		const jwtToken = `Bearer ${token}`;

		// if (!userId) {
		// 	return res.redirect(`${keys.app.clientURL}/auth/userId?token=${jwtToken}`);
		// }

		// res.redirect(`${keys.app.clientURL}/dashboard`)
		res.redirect(`${keys.app.clientURL}/auth/success?token=${jwtToken}`);
	}
);

router.get(
	'/facebook',
	passport.authenticate('facebook', {
		session: false,
		scope: ['public_profile', 'email']
	})
);

router.get(
	'/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: `${keys.app.clientURL}/login`,
		session: false
	}),
	(req, res) => {
		const payload = {
			id: req.user.id
		};
		const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
		const jwtToken = `Bearer ${token}`;
		res.redirect(`${keys.app.clientURL}/auth/success?token=${jwtToken}`);
	}
);

module.exports = router;
