const mongoose = require('mongoose');

const sectionsSchema = mongoose.Schema({
	_id			          	: mongoose.Schema.Types.ObjectId,
    section               	: String,
    sectionUrl           	: String,
    sectionRank             : Number,
    sectionImage            : String,
    status                  : String,
    createdBy               : String,
    createdAt               : Date
    });

module.exports = mongoose.model('sections',sectionsSchema);