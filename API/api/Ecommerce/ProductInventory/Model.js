const mongoose = require('mongoose');

const productInventorySchema = mongoose.Schema({
    _id			              : mongoose.Schema.Types.ObjectId,
    vendor_ID                 : { type: mongoose.Schema.Types.ObjectId, ref: 'vendors' },
    universalProductCode      : String,
    productCode               : String,
    itemCode                  : String,
    productName               : String,
    shortDescription          : String,
    currentQuantity           : Number, 
    originalPrice             : Number,
    discountPercent           : Number,
    discountedPrice           : Number,   
    inwardDetails             : [ 
                                    {
                                        date            : Date,
                                        qty             : Number,
                                        originalPrice   : Number,
                                        discountPercent : Number,
                                        discountedPrice : Number,   
                                        addedBy         : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                                    }
    ],
    fileName                 : String,
    createdBy                : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                : Date,
    updateLog                : [{
                                date        : Date,
                                updatedBy   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    }]
});

module.exports = mongoose.model('productinventory',productInventorySchema);