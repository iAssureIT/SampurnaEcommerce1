const mongoose = require('mongoose');

const coupenSchema = mongoose.Schema({
			_id			        : mongoose.Schema.Types.ObjectId,
       		coupontitle  		:  String,
       		couponcode  		:  String,
	        coupentype  		:  String,
	        couponcodeusage  	:  Number,
	        coupenin  			:  String,
	        coupenvalue  		:  Number,
	        maxdiscountvalue  	:  Number,
	        status  			:  String,
	        availablefor  		:  String,
	        startdate      		:  Date,
	        enddate        		:  Date,
	        selectedCategory    :  Array,
	        selectedBrand       :  Array,
	        selectedProducts    :  Array,
	        description       	:  String ,
	        termscondition      :  String,
	        coupenImage        	:  String,
	        createdBy  			:  String
    });

module.exports = mongoose.model('coupen',coupenSchema);