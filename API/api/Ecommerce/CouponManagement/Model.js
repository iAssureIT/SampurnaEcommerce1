const mongoose = require('mongoose');

const coupenSchema = mongoose.Schema({
			_id			        : mongoose.Schema.Types.ObjectId,
			section 			: String,
			category 			: String,
			subCategory 		: String,
       		coupontitle  		: String,
       		couponcode  		: String,
			coupenin  			: String,
			coupenvalue  		: Number,
			status  			: String,
			startdate      		: Date,
			enddate        		: Date,
			coupenImage        	: String,
			createdBy  			: String,
			createdAt 			: Date,
			updateLog 			: [{
									updatedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
									updatedAt : Date
			}]
			// availablefor  		:  String,
			//    couponcodeusage  	:  Number,
			//    maxdiscountvalue  	:  Number,
			//    selectedCategory    :  Array,
			//    selectedBrand       :  Array,
			//    selectedProducts    :  Array,
			//    description       	:  String ,
			//    termscondition      :  String,
			//    coupentype  		:  String,
    });

module.exports = mongoose.model('coupen',coupenSchema);