exports.resetEmail = (host, resetToken) => {
	const message = {
		subject: 'Reset Password',
		text:
			`${
				'You are receiving this because you have requested to reset your password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'https://'
			}${host}/reset-password/${resetToken}\n\n` +
			`If you did not request this, please ignore this email and your password will remain unchanged.\n`
	};

	return message;
};

exports.merchantReject = (name, sender) => {
	const message = {
		subject: 'Application Rejection AnyTru',
		text: `Dear ${name}, \n
We regret to inform you that your merchant application has been rejected. For further details, please contact our support team at ${sender}.\n
Best regards,
AnyTru`
	};

	return message;
};

exports.confirmResetPasswordEmail = () => {
	const message = {
		subject: 'Password Changed',
		text:
			`You are receiving this email because you changed your password. \n\n` +
			`If you did not request this change, please contact us immediately.`
	};

	return message;
};

exports.merchantSignup = (host, { resetToken, email }) => {
	const message = {
		subject: 'Merchant Registration',
		text: `${
			'Congratulations! Your application has been accepted. Please complete your Merchant account signup by clicking on the link below. \n\n' +
			'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			'https://'
		}${host}/merchant-signup/${resetToken}?email=${email}\n\n`
	};

	return message;
};

exports.merchantWelcome = (name, sender) => {
	const message = {
		subject: 'Welcome to AnyTru',
		text:
			`Hi ${name}! Congratulations! Your application for merchant account has been accepted. \n\n` +
			`It looks like you already have a member account with us. Please sign in with your member credentials and you will be able to see your merchant account.
      for further query contact us on ${sender}`
	};

	return message;
};

exports.signupEmail = (name) => {
	const message = {
		subject: 'Account Registration',
		text: `Hi ${name.firstName} ! Thank you for creating an account with us!.`
	};

	return message;
};

exports.newsletterSubscriptionEmail = () => {
	const message = {
		subject: 'Newsletter Subscription',
		text:
			`You are receiving this email because you subscribed to our newsletter. \n\n` +
			`If you did not request this change, please contact us immediately.`
	};

	return message;
};

exports.contactEmail = () => {
	const message = {
		subject: 'Contact Us',
		text: `We received your message! Our team will contact you soon. \n\n`
	};

	return message;
};

exports.merchantApplicationEmail = () => {
	const message = {
		subject: 'Registation AnyTru',
		text: `We received your request! Our team will contact you soon. \n\n`
	};

	return message;
};

exports.merchantDeactivateAccount = () => {
	const message = {
		subject: 'Merchant account on AnyTru',
		text: `Your merchant account has been disabled. \n\n` + `Please contact admin to request access again.`
	};

	return message;
};

exports.orderConfirmationEmail = (order) => {
	const message = {
		subject: `Order Confirmation ${order.orderId || ''}`,
		text:
			`Hi ${order.user.firstName || ''}! Thank you for your order!. \n\n` +
			`We've received your order and will contact you as soon as your package is shipped. \n\n`
	};
	return message;
};

exports.orderConfirmationVendorEmail = (order) => {
	try {
		const message = {
			subject: `Order Confirmation ${order.orderId}`,
			text:
				`Hi ${order.vendor.user.firstName || ''}! You received a new order.\n\n` +
				`${order.user.firstName || ''} has placed a new order with the following details:\n` +
				`Product Name: ${order.product.name}\n` +
				`Category: ${order.product.category.join(', ')}\n` +
				`Image: ${order.product.imageUrl}\n` +
				`Dispatch Days: ${order.dispatchDay}\n` +
				`Price per Product: ${order.pricePerProduct}\n` +
				`Total Quantity: ${order.quantity}\n` +
				`Total Amount: ${order.totalAmount}\n` +
				`Address: ${order.address.address}, ${order.address.city}, ${order.address.state}, ${order.address.country}, Pincode: ${order.address.pinCode}\n`
		};
		return message;
	} catch (error) {
		console.error(error);
	}
};

