const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');



router.get('/',auth, async (req, res) => {
   
	try {
		const user = await User.findById(req.user._id)
		if (!user) {
			return res.status(404).json({ error: 'No User found' });
		}
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		res.status(500).json({ error: 'Server error, please try again later.' });
	}
});


module.exports = router;