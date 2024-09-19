const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const { s3Upload, s3Delete } = require('../utils/storage');
const News = require('../models/News');
const auth = require('../middleware/auth');
const router = express.Router();

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
// POST: Add news
router.post('/', auth, upload.single('image'), async (req, res) => {
	const { driveLink } = req.body;

	// Check if the driveLink is present
	if (!driveLink) {
		return res.status(400).json({ error: 'Drive Link is required.' });
	}

	// Check if the image file is present
	if (!req.file) {
		return res.status(400).json({ error: 'Image is required.' });
	}

	try {
		// Upload the image to S3 or another storage service
		const { imageUrl, imageKey } = await s3Upload(req.file);

		// Create a new news entry with the uploaded image and drive link
		const news = new News({ imageUrl, imageKey, driveLink });
		await news.save();

		res.status(201).json({
			success: true,
			message: 'News has been added successfully!',
			data: news
		});
	} catch (error) {
		res.status(500).json({ error: 'Server error, please try again later.' });
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

	try {
		const query = {}; // Empty filter query object

		// Filter by month and year if provided
		if (month && year) {
			const startDate = new Date(year, month - 1, 1); // First day of the month
			const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the month

			// Add date range to the query filter
			query.createdAt = {
				$gte: startDate,
				$lt: endDate
			};
		} else if (year) {
			// Filter by year if only year is provided
			const startDate = new Date(year, 0, 1); // First day of the year
			const endDate = new Date(year, 11, 31, 23, 59, 59); // Last day of the year

			query.createdAt = {
				$gte: startDate,
				$lt: endDate
			};
		}

		// Execute the query with pagination
		const newses = await News.find(query)
			.sort('-createdAt') // Sort by newest first
			.limit(limit * 1) // Limit the number of results
			.skip((page - 1) * limit); // Skip records for pagination

		const count = await News.countDocuments(query); // Get total count with the applied filters

		res.status(200).json({
			success: true,
			data: newses,
			totalPages: Math.ceil(count / limit),
			currentPage: Number(page),
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
