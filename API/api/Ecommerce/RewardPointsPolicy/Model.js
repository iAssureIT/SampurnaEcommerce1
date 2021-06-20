const mongoose = require('mongoose');

const rewardPointsPolicySchema = mongoose.Schema({
	_id			                : mongoose.Schema.Types.ObjectId,    
    purchaseAmount              : Number,
    rewardPoint                 : Number,
    rewardPointValue            : Number,
    createdAt                   : Date
});

module.exports = mongoose.model('rewardpointspolicy',rewardPointsPolicySchema);
