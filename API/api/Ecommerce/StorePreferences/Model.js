const mongoose = require('mongoose');

const storePreferenceSchema = mongoose.Schema({
	_id			                : mongoose.Schema.Types.ObjectId,    
    maxRadius                 : String,
    minOrderValue             : String,
    defaultServiseCharges     : String,
    serviseChargesByDistance  : String,
    createdAt                 : Date
});

module.exports = mongoose.model('storepreference',storePreferenceSchema);
