const mongoose	                = require("mongoose");
var ObjectId                    = require('mongodb').ObjectID;
const CreditPoints              = require('./Model');

/*=========== Add Credit Points Policy ===========*/
exports.add_credit_points = (req, res, next) => {
	CreditPoints.findOne()
	.exec()
	.then(data =>{
		if(data && data !== null){
			CreditPoints.updateOne(
				{ _id : ObjectId(data._id)},  
				{
					$set:{
						"purchaseAmount"        : req.body.purchaseAmount,
						"creditPoint"           : req.body.creditPoint,
						"creditPointValue"      : req.body.creditPointValue
					}
				}
			)
			.exec()
			.then(data=>{
				res.status(200).json({
					"message": "Credit Point Policy Updated Successfully."
				});
			})
			.catch(err =>{
				console.log("Failed to Update Credit Point Policy");
				res.status(500).json({
					error: err
				});
			});
		}else{    
			const creditPoints = new CreditPoints({
				"_id"                   : mongoose.Types.ObjectId(),      
				"purchaseAmount"        : req.body.purchaseAmount,
				"creditPoint"           : req.body.creditPoint,
				"creditPointValue"      : req.body.creditPointValue,
				"createdAt"             : new Date()
			});            
			creditPoints.save()
			.then(creditPoints=>{
				res.status(200).json({
					"message"   : "Credit Point Policy Saved Successfully.",
					"data"      : creditPoints
				});
			})
			.catch(err =>{
				console.log("Failed to Save Credit Point Policy");				
				res.status(500).json({
					error: err
				});
			});
		}
	})
	.catch(err =>{
		console.log("Failed to Find Credit Point Policy");				
		res.status(500).json({
			error: err
		});
	});
};

/*=========== Get credit points policy data ===========*/
exports.get_credit_points = (req, res, next) => {
	CreditPoints.find()
	.exec()
	.then(data=>{
		res.status(200).json(data);
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});   
}

