const mongoose = require('mongoose');

const orderStatusSchema = mongoose.Schema({
    _id                       : mongoose.Schema.Types.ObjectId,
    orderStatus               : String,
    companyID                 : String,
    createdBy                 : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt                 : Date,
    fileName                  : String,
    updateLog                 : [
                                {
                                    updatedAt           : Date,
                                    updatedBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
                                }
                                ]
});

module.exports = mongoose.model('orderStatusSchema',orderStatusSchema);