const mongoose	                = require("mongoose");
var ObjectId                    = require('mongodb').ObjectID;
const RewardPointsPolicy              = require('./Model');

/*=========== Add Reward Points Policy ===========*/
exports.insert_reward_points_policy = (req, res, next) => {
	RewardPointsPolicy.findOne()
	.exec()
	.then(data =>{
		if(data && data !== null){
			RewardPointsPolicy.updateOne(
				{ _id : ObjectId(data._id)},  
				{
					$set:{
						"purchaseAmount"        : req.body.purchaseAmount,
						"rewardPoint"           : req.body.rewardPoint,
						"rewardPointValue"      : req.body.rewardPointValue
					}
				}
			)
			.exec()
			.then(data=>{
				res.status(200).json({
					"message": "Reward Point Policy Updated Successfully."
				});
			})
			.catch(err =>{
				console.log("Failed to Update Reward Point Policy");
				res.status(500).json({
					error: err
				});
			});
		}else{    
			const rewardPointsPolicy = new RewardPointsPolicy({
				"_id"                   : mongoose.Types.ObjectId(),      
				"purchaseAmount"        : req.body.purchaseAmount,
				"rewardPoint"           : req.body.rewardPoint,
				"rewardPointValue"      : req.body.rewardPointValue,
				"createdAt"             : new Date()
			});            
			rewardPointsPolicy.save()
			.then(rewardPointsPolicyData=>{
				res.status(200).json({
					"message"   : "Reward Point Policy Saved Successfully.",
					"data"      : rewardPointsPolicyData
				});
			})
			.catch(err =>{
				console.log("Failed to Save Reward Point Policy");				
				res.status(500).json({
					error: err
				});
			});
		}
	})
	.catch(err =>{
		console.log("Failed to Find Reward Point Policy");				
		res.status(500).json({
			error: err
		});
	});
};

/*=========== Get reward points policy data ===========*/
exports.get_reward_points_policy = (req, res, next) => {
	RewardPointsPolicy.find()
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

