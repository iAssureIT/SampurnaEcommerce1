const mongoose	                = require("mongoose");
var ObjectId                    = require('mongodb').ObjectID;
const CreditPoints              = require('./Model');

/*=========== Get credit points policy data ===========*/
exports.get_credit_points = (req, res, next) => {
	CreditPoints.findOne({user_id : ObjectId(req.params.customer_id)})
	.populate('transactions.order_id', 'orderID')
	.then(creditpointsdata=>{
		console.log("creditpointsdata => ",creditpointsdata)
		if(creditpointsdata !== null){
			var returnData = {
				_id 			: creditpointsdata._id,
				user_id 		: creditpointsdata.user_id,
				totalPoints 	: creditpointsdata.totalPoints,
				transactions 	: creditpointsdata.transactions && creditpointsdata.transactions.length > 0
									? 
										(creditpointsdata.transactions.map((a, i)=>{				
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
			res.status(200).json("You haven't earned any credit points yet");
		}
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});   
}

