const mongoose = require('mongoose');

const rewardPointsSchema = mongoose.Schema({
	_id			                : mongoose.Schema.Types.ObjectId,    
    user_id                     : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    totalPoints                 : Number,
    transactions                : [{
                                    order_id            : { type: mongoose.Schema.Types.ObjectId, ref: 'orders' },
                                    orderDate           : Date,
                                    purchaseAmount      : Number,
                                    shippingCharges     : Number,
                                    totalAmount         : Number,
                                    earnedPoints        : Number,
                                    typeOfTransaction   : String
                                }],
    createdAt                   : Date
});

module.exports = mongoose.model('rewardpoints',rewardPointsSchema);
