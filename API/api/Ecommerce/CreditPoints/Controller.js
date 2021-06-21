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
	CreditPoints.findOne({user_id : ObjectId(req.params.customer_id)})
	.populate('transactions.order_id', 'orderID')
	.then(creditpointsdata=>{
		if(creditpointsdata !== null){
			var returnData = {
				_id 			: creditpointsdata._id,
				user_id 		: creditpointsdata.user_id,
				totalPoints 	: creditpointsdata.totalPoints,
				transactions 	: creditpointsdata.transactions && creditpointsdata.transactions.length > 0
									? 
										(creditpointsdata.transactions.map((a, i)=>{
											console.log("a ",a)										
											return {
												_id                 : a._id,
												order_id    		: a.order_id._id,
												orderID    			: a.order_id.orderID,
												orderDate     		: a.orderDate,
												purchaseAmount    	: a.purchaseAmount,
												shippingCharges     : a.shippingCharges,
												totalAmount         : a.totalAmount,
												earnedPoints 		: a.earnedPoints,
												typeOfTransaction 	: a.typeOfTransaction
											}																				
										}))
									:
										[],
			}
			res.status(200).json(returnData);
		}else{			
			res.status(200).json(creditpointsdata);
		}
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});   
}

