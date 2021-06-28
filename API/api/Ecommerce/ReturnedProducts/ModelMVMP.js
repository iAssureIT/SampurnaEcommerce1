const mongoose = require('mongoose');

const returnedProductsSchema = mongoose.Schema({
	_id			       		: mongoose.Schema.Types.ObjectId,
	order_id                : { type: mongoose.Schema.Types.ObjectId, ref: 'orders' },
	orderID                	: Number,
	user_id                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	vendor_id 				: { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },
	vendorLocatoin_id 		: { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },
	product_id              : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
	productCode 			: String,
	itemCode                : String ,
	reasonForReturn         : String, 
	adminComment 			: String,
	vendorComment 			: String,     
	originalPrice           : Number,
	discountPercent         : Number,
	discountedPrice         : Number,
	modeOfPayment           : String, 
	dateOfPurchase          : Date,
	dateOfReturn            : Date,
	pickedupBy              : String,  
	returnStatus            : [{
								status 	: String,
								date 	: Date
							}],
	refund                  : [{
								bankName        : String,
								bankAccountNo   : String,
								IFSCCode        : String,
								amount          : Number
							}],
	createdBy               : String,
	createdAt               : Date
});

module.exports = mongoose.model('returnedProducts',returnedProductsSchema);