const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const { s3Upload, s3Delete } = require('../utils/storage');
const News = require('../models/News');
const auth = require('../middleware/auth');
const router = express.Router();
const { isValid, isBefore } = require('date-fns');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
		}
	}
});

// Helper function to remove image from S3
const removeImage = async (imageKey) => {
	if (imageKey) {
		await s3Delete([imageKey]);
	}
};

// // GET: Fetch news by ID
// router.get('/:id', async (req, res) => {
// 	try {
// 		const news = await News.findById(req.params.id).select('-imageKey');
// 		if (!news) {
// 			return res.status(404).json({ error: 'No news found' });
// 		}
// 		res.status(200).json({ success: true, data: news });
// 	} catch (error) {
// 		res.status(500).json({ error: 'Server error, please try again later.' });
// 	}
// });

// POST: Add news
router.post('/', auth, upload.single('image'), async (req, res) => {
	const { driveLink, customDate } = req.body;
	let imgKey; // Initialize imgKey variable

	try {
		// Validate if file is present
		if (!req.file) {
			return res.status(400).json({ error: 'Image file is required.' });
		}

		// Upload the image to S3 or another storage service
		const { imageUrl, imageKey } = await s3Upload(req.file);
		imgKey = imageKey; // Store the image key

		// Create a new news entry with the uploaded image, drive link, and custom date
		const news = new News({ imageUrl, imageKey, driveLink, customDate });
		await news.save();

		return res.status(201).json({
			success: true,
			message: 'News has been added successfully!',
			data: news
		});
	} catch (error) {
		// If there is an error and imgKey exists, remove the image from S3
		if (imgKey) {
			await removeImage(imgKey); // Ensure this function handles deletion correctly
		}

		// Handle Mongoose validation errors
		if (error.name === 'ValidationError') {
			const errorMessages = Object.values(error.errors).map((e) => e.message);
			return res.status(400).json({ error: errorMessages.join(', ') });
		}

		// Handle duplicate key errors
		if (error.code === 11000) {
			const duplicateField = Object.keys(error.keyPattern)[0];
			return res.status(409).json({ error: `${duplicateField} already exists.` });
		}

		// General server error
		console.error('Server error:', error);
		return res.status(500).json({ error: error.message });
	}
});

// PUT: Update news by ID
router.put('/:id', auth, upload.single('image'), async (req, res) => {
	const { driveLink } = req.body;
	const newsId = req.params.id;

	try {
		const news = await News.findById(newsId);
		if (!news) {
			return res.status(404).json({ error: 'News not found.' });
		}

		const updateData = {};
		if (driveLink) updateData.driveLink = driveLink;

		if (req.file) {
			await removeImage(news.imageKey);
			const { imageUrl, imageKey } = await s3Upload(req.file);
			updateData.imageUrl = imageUrl;
			updateData.imageKey = imageKey;
		}

		const updatedNews = await News.findByIdAndUpdate(newsId, updateData, { new: true });
		// console.log(updatedNews);
		res.status(200).json({
			success: true,
			message: 'News has been updated successfully!',
			data: updatedNews
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Server error, please try again later.' });
	}
});

// DELETE: Delete news by ID
router.delete('/:id', auth, async (req, res) => {
	const newsId = req.params.id;

	try {
		const news = await News.findByIdAndDelete(newsId);
		if (!news) {
			return res.status(404).json({ error: 'News not found.' });
		}

		await removeImage(news.imageKey);

		res.status(200).json({
			success: true,
			message: 'News has been deleted successfully!'
		});
	} catch (error) {
		res.status(500).json({ error: 'Server error, please try again later.' });
	}
});

router.get('/', async (req, res) => {
	const { page = 1, limit = 12, month, year } = req.query;

	// Validate page and limit
	const pageNumber = parseInt(page, 10);
	const limitNumber = parseInt(limit, 10);

	if (isNaN(pageNumber) || pageNumber < 1) {
		return res.status(400).json({ error: 'Invalid page number.' });
	}
	if (isNaN(limitNumber) || limitNumber < 1) {
		return res.status(400).json({ error: 'Invalid limit number.' });
	}

	try {
		const query = {}; // Empty filter query object

		// Filter by month and year if provided
		if (month && year) {
			const monthNumber = parseInt(month, 10);
			const yearNumber = parseInt(year, 10);

			if (monthNumber < 1 || monthNumber > 12 || isNaN(yearNumber)) {
				return res.status(400).json({ error: 'Invalid month or year.' });
			}

			const startDate = new Date(yearNumber, monthNumber - 1, 1); // First day of the month
			const endDate = new Date(yearNumber, monthNumber, 0, 23, 59, 59); // Last day of the month

			query.customDate = {
				$gte: startDate,
				$lt: endDate
			};
		} else if (year) {
			const yearNumber = parseInt(year, 10);
			if (isNaN(yearNumber)) {
				return res.status(400).json({ error: 'Invalid year.' });
			}
			const startDate = new Date(yearNumber, 0, 1); // First day of the year
			const endDate = new Date(yearNumber, 11, 31, 23, 59, 59); // Last day of the year

			query.customDate = {
				$gte: startDate,
				$lt: endDate
			};
		}

		// Execute the query with pagination
		const newses = await News.find(query)
			.sort('-customDate') // Sort by newest first
			.limit(limitNumber) // Limit the number of results
			.skip((pageNumber - 1) * limitNumber); // Skip records for pagination

		const count = await News.countDocuments(query); // Get total count with the applied filters
		
		res.status(200).json({
			success: true,
			data: newses,
			totalPages: Math.ceil(count / limitNumber),
			currentPage: pageNumber,
			totalItems: count
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: 'Internal server error. Please try again later.'
		});
	}
});

module.exports = router;
