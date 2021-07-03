const mongoose = require('mongoose');

const customerReviewSchema = mongoose.Schema({
	_id			         	: mongoose.Schema.Types.ObjectId,
	customer_id          	: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	customerName         	: String,
	customerReview       	: String,
	reviewProductImages 	: Array,
	vendor_id            	: { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' },
	vendorLocation_id    	: { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters' }, 
	order_id          		: { type: mongoose.Schema.Types.ObjectId, ref: 'orders' },
	product_id           	: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
	rating               	: Number,
	status               	: String,
	adminComment         	: String,
	vendorComment        	: String,
	createdAt            	: Date
});

module.exports = mongoose.model('customerReview' ,customerReviewSchema);