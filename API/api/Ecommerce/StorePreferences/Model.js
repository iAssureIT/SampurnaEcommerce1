const mongoose = require('mongoose');

const storePreferenceSchema = mongoose.Schema({
	_id			              : mongoose.Schema.Types.ObjectId,    
    maxRadius                 : String,
    minOrderValue             : String,
    defaultServiceCharges     : String,
    serviseChargesByDistance  : [
                                    {
                                        minDistance     : Number,
                                        maxDistance     : Number
                                    }
    ],
    createdAt                 : Date
});

module.exports = mongoose.model('storepreference',storePreferenceSchema);
