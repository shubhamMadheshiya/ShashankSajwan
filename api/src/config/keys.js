const isProduction = process.env.NODE_ENV === 'production';
console.log("isProduction", isProduction)

module.exports = {
	app: {
		name: 'Sajawan',
		apiURL: isProduction ? process.env.BASE_API_URL_PRO : process.env.BASE_API_URL_DEV,
		adminURL: isProduction ? process.env.ADMIN_URL_PRO : process.env.ADMIN_URL_DEV, // Use localhost for development
		clientURL: isProduction ? process.env.CLIENT_URL_PRO : process.env.CLIENT_URL_DEV, // Adjust if needed
		adminDomain: isProduction ? process.env.ADMIN_DOMAIN_PRO : process.env.ADMIN_DOMAIN_DEV
	},
	port: process.env.PORT || 5000,
	database: {
		url: process.env.MONGO_URI
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		tokenLife: '30d'
	},
	mailchimp: {
		key: process.env.MAILCHIMP_KEY,
		listKey: process.env.MAILCHIMP_LIST_KEY
	},
	mailgun: {
		key: process.env.MAILGUN_KEY,
		domain: process.env.MAILGUN_DOMAIN,
		sender: process.env.MAILGUN_EMAIL_SENDER
	},
	google: {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL
	},
	facebook: {
		clientID: process.env.FACEBOOK_CLIENT_ID,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		callbackURL: process.env.FACEBOOK_CALLBACK_URL
	},
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
		bucketName: process.env.AWS_BUCKET_NAME
	},
	razorpay: {
		accessKeyId: process.env.RAZORPAY_KEY_ID,
		secretAccessKey: process.env.RAZORPAY_SECRET_ACCESS_KEY
	}
};
