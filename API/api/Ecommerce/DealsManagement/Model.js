const mongoose = require('mongoose');

const dealsSchema = mongoose.Schema({
	_id			          : mongoose.Schema.Types.ObjectId,
    section               : String,
    category              : String, 
    subCategory           : String,
    dealInPercentage      : Number,
    updateAllProductPrice : Boolean,
    updateLimittedProducts: Boolean,
    dealImg               : String,
    startdate             : Date,
    enddate               : Date,
    createdAt             : Date,
    });

module.exports = mongoose.model('deals',dealsSchema);