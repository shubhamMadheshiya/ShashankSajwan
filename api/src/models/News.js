const mongoose = require('mongoose');
const { ROLES, EMAIL_PROVIDER, ACCOUNTS } = require('../constants/index');

const newsSchema = new mongoose.Schema(
	{
		imageUrl: {
			type: String
		},
		imageKey: {
			type: String
		},
        driveLink:{
            type: String,
            required:true
        }
	},
	{ timestamps: true }
);



const News = mongoose.model('News', newsSchema);

module.exports = News;
