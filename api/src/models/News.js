const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
	{
		imageUrl: {
			type: String,
			required: [true, 'Image is required.']
		},
		imageKey: {
			type: String,
			required: [true, 'Image is required.']
		},
		driveLink: {
			type: String,
			required: [true, 'Drive Link is required.'],
			unique: [true, 'This drive link is already present.']
		},
		customDate: {
			type: Date,
			required: [true, 'Date is required.'],
			validate: {
				validator: function (val) {
					// Ensure the customDate is a valid date
					if (isNaN(new Date(val).getTime())) {
						throw new Error('Invalid date format.');
					}

					// Ensure the date is not in the future
					const inputDate = new Date(val).setHours(0, 0, 0, 0);
					const currentDate = new Date().setHours(0, 0, 0, 0);
					if (inputDate > currentDate) {
						throw new Error('Custom date cannot be in the future.');
					}

					return true;
				}
			}
		}
	},
	{ timestamps: true }
);

// Pre-save middleware to check for unique driveLink and customDate
newsSchema.pre('save', async function (next) {
	const news = this;

	try {
		// Check if a news entry with the same driveLink already exists
		const existingNewsWithLink = await mongoose.models.News.findOne({ driveLink: news.driveLink });
		if (existingNewsWithLink && existingNewsWithLink._id.toString() !== news._id.toString()) {
			return next(new Error('A news entry with this drive link already exists.'));
		}

		// Check if a news entry with the same date (ignoring time) already exists
		const startOfDay = new Date(news.customDate).setHours(0, 0, 0, 0);
		const endOfDay = new Date(news.customDate).setHours(23, 59, 59, 999);

		const existingNewsWithDate = await mongoose.models.News.findOne({
			customDate: { $gte: startOfDay, $lte: endOfDay }
		});

		if (existingNewsWithDate && existingNewsWithDate._id.toString() !== news._id.toString()) {
			return next(new Error('A news entry already exists for this date.'));
		}

		next();
	} catch (err) {
		next(err);
	}
});

// Handle Mongoose unique constraint error
newsSchema.post('save', function (error, doc, next) {
	if (error.name === 'MongoServerError' && error.code === 11000) {
		// Handle duplicate key error for unique fields
		if (error.keyValue && error.keyValue.driveLink) {
			return next(new Error('Drive link must be unique.'));
		}
	}
	next(error);
});

// newsSchema.pre(/^find/, function (next) {
// 	this.find();

// 	this.start = Date.now();
// 	next();
// });

const News = mongoose.model('News', newsSchema);

module.exports = News;
