const mongoose = require('mongoose');

const storePreferenceSchema = mongoose.Schema({
	_id			                : mongoose.Schema.Types.ObjectId,    
    maxRadius                   : String,
    minOrderValue               : String,
    maxServiceCharges           : String,
    serviseChargesByDistance    : [
                                    {
                                        minDistance     : Number,
                                        maxDistance     : Number,
                                        serviceCharges  : Number
                                    }
    ],
    createdAt                   : Date
});

module.exports = mongoose.model('storepreference',storePreferenceSchema);
