const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../config/keys');
const { secret, tokenLife } = keys.jwt;

router.get(
	'/google',
	passport.authenticate('google', {
		session: false,
		scope: ['profile', 'email'],
		accessType: 'offline',
		approvalPrompt: 'force'
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: `${keys.app.adminURL}/login`,
		session: false
	}),
	(req, res) => {
		const payload = {
			id: req.user.id
		};
		const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
		const jwtToken = `Bearer ${token}`;
		res.redirect(`${keys.app.adminURL}/auth/success?token=${jwtToken}`);
	}
);

module.exports = router;
