const mongoose = require('mongoose');

const reasonOfReturnSchema = mongoose.Schema({
	_id           	: mongoose.Schema.Types.ObjectId,
	reasonOfReturn  : String,
	createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	createdAt       : Date,
	updateLog       : [
						{
							updatedAt   : Date,
							updatedBy   : { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
						}
					]
});

module.exports = mongoose.model('reasonsofreturn',reasonOfReturnSchema);