const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
	_id			        : mongoose.Schema.Types.ObjectId,
    user_ID             : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    userDelLocation     : {
                            lat             : Number, 
                            long            : Number,
                            delLocation     : String,
                        },
    vendor_id           : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters'},
    vendorLocation_id   : { type: mongoose.Schema.Types.ObjectId, ref: 'entitymasters'},
    products_id         : { type: mongoose.Schema.Types.ObjectId, ref: 'products'},
    createdBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt           : Date
});

module.exports = mongoose.model('wishlist',wishlistSchema);
