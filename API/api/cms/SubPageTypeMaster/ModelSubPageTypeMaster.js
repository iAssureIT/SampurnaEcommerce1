const mongoose = require('mongoose');


const SubPageTypeSchema = mongoose.Schema({
    _id             : mongoose.Schema.Types.ObjectId,
    subPageType     : String,
    iconUrl         : String,  
    createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt       : Date,
    updateLog       : [
        {
            updatedAt : Date,
            updatedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
        }
    ]
});


module.exports = mongoose.model('SubPageTypeMaster',SubPageTypeSchema);