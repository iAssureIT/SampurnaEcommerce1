const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
	createdAt	: {type:Date},
	createdBy	: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	services	: {
		password:{
					bcrypt:String
				  },
		resume: {
			loginTokens:[
				{
					loginTimeStamp: {type:Date},
					logoutTimeStamp: {type:Date},
					ValidateTill: {type:Date},
					hashedToken : String
				}
			]
		}
	},
	username	: {type:String},
	profile 	:
					{
						company_id 				: { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },
						companyID 				: Number,
						companyName  			: String,
						firstname 				: String,
						lastname  				: String,
						fullName  				: String,
						mobile 		 			: String,
						image 					: String,
						otpMobile	  			: String,
						pincode	  				: String,
						mobileVerified			: Boolean,
						email 					: String,
						otpEmail	  			: String,
						emailVerified			: Boolean,
						mobileVerified			: Boolean,
						status					: String,
						createdOn 				: String,
					},
	roles       : [String],
	deliveryAddress : [
		
		{
			"user_ID"      : String,
			"name"         : String,
			"email"        : String,
			"addressLine1" : String,
			"addressLine2" : String,
			"pincode"      : String,
			"district"     : String,
			"city"         : String,
			"stateCode"    : String,
			"state"        : String,
			"countryCode"  : String,
			"country" 	   : String,
			"mobileNumber" : String,
			"addType"	   : String,
			"latitude"     : Number,
			"longitude"    : Number,
		}	

],
	statusLog   : [
	                {
	                	status 				: String,
	                    updatedAt           : Date,
	                    updatedBy           : String,
	                }
	            ]
});

module.exports = mongoose.model('users',userSchema);
