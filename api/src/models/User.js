const mongoose = require('mongoose');
const { ROLES, EMAIL_PROVIDER, ACCOUNTS } = require('../constants/index');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true
	},
	lastName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		required: () => {
			return this.provider !== 'email' ? false : true;
		},
		unique: true,
		trim: true
	},
	phoneNumber: {
		type: String,
		trim: true
	},
	password: {
		type: String,
		trim: true
	},

	provider: {
		type: String,
		required: true,
		default: EMAIL_PROVIDER.Email
	},
	googleId: {
		type: String
	},
	facebookId: {
		type: String
	},
	avatar: {
		type: String
	},
	avatarKey: {
		type: String
	},

	role: {
		type: String,
		required: true,
		default: ROLES.User,
		enum: [ROLES.Admin, ROLES.User, ROLES.Merchant]
	},
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date },
	updated: Date,
	created: {
		type: Date,
		default: Date.now
	}
});



const User = mongoose.model('User', userSchema);

module.exports = User;
