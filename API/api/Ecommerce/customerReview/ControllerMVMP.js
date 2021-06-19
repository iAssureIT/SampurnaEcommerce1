const mongoose          = require("mongoose");
const Products          = require('../products/Model');
const CustomerReview    = require('./ModelMVMP');
var ObjectId            = require('mongodb').ObjectID;
const moment            = require('moment-timezone');

/*=========== Insert Customer Review ===========*/
exports.insertCustomerReview = (req,res,next)=>{
	console.log("req body customer Review => ", req.body);	
	const customerReview = new CustomerReview({
		_id             		: new mongoose.Types.ObjectId(),                    
		customer_id     		: req.body.customer_id,
		customerName    		: req.body.customerName,
		order_id        		: req.body.order_id,
		product_id      		: req.body.product_id,
		vendor_id 				: req.body.vendor_id,
		vendorLocation_id 	: req.body.vendorLocation_id,
		rating          		: req.body.rating,
		customerReview  		: req.body.customerReview,
		status          		: 'New',
		createdAt       		: new Date()
	});
	customerReview.save()
	.then(data=>{
		res.status(200).json({
			"message" : "Thanks for your review."
		});
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});		
};

/*=========== Get Review List ===========*/
exports.list_review = (req,res,next)=>{
	// console.log("req body get All Reviews => ", req.body)
	 CustomerReview.aggregate([
	{ $lookup:{
			from 			: 'products',
			localField 		: 'product_id',
			foreignField 	: '_id',
			as 				: 'productDetails'
		}
	},
	{ $lookup : {
			from 				: 'entitymasters',
			localField 			: 'vendor_id',
			foreignField 		: '_id',
			as 					: 'vendorDetails'
		}
	},	
	{ $sort: {
		createdAt : -1
	}
},
{
	$project: {
		customer_id 					: 1,
		customerName    				: 1,
		order_id        				: 1,
		product_id      				: 1,
		vendor_id 						: 1,
		vendorLocation_id 				: 1,
		rating          				: 1,
		customerReview  				: 1,
		status          				: 1,
		createdAt       				: 1,
		"productDetails.productName"	: 1,
		"productDetails.productCode" 	: 1,
		"vendorDetails.companyName"		: 1
	}
}
])
.skip(parseInt(req.body.startRange))
.limit(parseInt(req.body.limitRange))
.exec()
.then(data=>{
	// console.log("data => ",data)
	res.status(200).json(data);
})
.catch(err =>{
	console.log(err);
	res.status(500).json({
		error: err
	});
});
};

/*=========== Get Single Review ===========*/
exports.get_single_review = (req,res,next)=>{
	// console.log("req.params.review_id => ",req.params.review_id)
	CustomerReview.findOne({"_id" : ObjectId(req.params.review_id)})
	.populate("product_id")
	.populate("vendor_id")
	.populate("customer_id")
	.exec()
	.then(async(data)=>{
		var vendorLocation 	= await data.vendor_id.locations.find(location => String(location._id) === String(data.vendorLocation_id));
		var vendorContact 	= vendorLocation && vendorLocation !== undefined 
							  ?
							  	data.vendor_id.contactPersons.find(contactPerson => contactPerson.branchCode === vendorLocation.branchCode)
							  :
							  	{}
		if(data && data !== undefined){
			var returnData = {
				product_id 			: data.product_id._id,
				productName 		: data.product_id.productName,
				productCode 		: data.product_id.productCode,
				vendor_id 			: data.vendor_id._id,
				vendorName 			: data.vendor_id.companyName,
				vendorLocation_id 	: data.vendorLocation_id,
				vendorLocation 		: vendorLocation,
				vendorContact  		: vendorContact,
				reviewDate 			: data.createdAt,
				adminComment 		: data.adminComment,
				vendorComment 		: data.vendorComment,
				vendorComment 		: data.vendorComment,
				customer_id 		: data.customer_id._id,
				customerName 		: data.customer_id.profile.fullName,
				customerEmail 		: data.customer_id.profile.email,
				customerMobile 		: data.customer_id.profile.mobile,
				customerReview      : data.customerReview,
				rating 				: data.rating,
				status 				: data.status
			}
			res.status(200).json(returnData);
		}else{
			res.status(200).json(data);
		}		
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
};

/*=========== Add admin or vendor comment ===========*/
exports.add_admin_or_vendor_comment = (req, res, next) => {
	// console.log("req.body => ",req.body);
	// console.log("req.body => ",req.body.vendorComment);
	if(req.body.adminComment && req.body.adminComment !== undefined){
		var comment = {adminComment : req.body.adminComment}
	}else if(req.body.vendorComment && req.body.vendorComment !== undefined){
		var comment = {vendorComment : req.body.vendorComment}
	}
	// console.log("comment => ",comment);
	CustomerReview.updateOne(
		{ _id: req.body.review_id},
		{
			$set: comment
		}
	)
	.exec()
	.then(data => {
		res.status(200).json({
			message : 'Comment added successfully.'
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
};

/*=========== Change Review Status ===========*/
exports.change_review_status = (req, res, next) => {	
	// console.log("req.body => ",req.body);
	CustomerReview.updateOne(
		{ _id: req.body.review_id},
		{
			$set: {status : req.body.status}
		}
	)
	.exec()
	.then(data => {
		// console.log("data => ",data)
		if(data.nModified === 1){
			res.status(200).json({
				message : 'Review ' + req.body.status + ' successfully.'
			});
		}else{
			res.status(200).json({
				message : 'Failed to Update Status.'
			});
		}		
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
};

exports.listCustomerReview = (req,res,next)=>{
	CustomerReview.find({"product_id" : req.params.product_id, "status": "Publish"})
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
};
exports.listCustomerProductReview = (req,res,next)=>{
	 // console.log('param', req.params);
	 CustomerReview.findOne({"customerID": ObjectId(req.params.customerID),  "product_id" : ObjectId(req.params.product_id), "orderID": ObjectId(req.params.orderID)})
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
};
exports.list_customer_reviews = (req,res,next)=>{
	 CustomerReview.find()
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
};
exports.update_review_status = (req,res,next)=>{
	 CustomerReview.updateOne(
		  { _id:req.body.review_ID},  
		  {
				$set:{
					 "status" : req.body.status,
				}
		  }
	 )
	 .exec()
	 .then(data=>{
		  if(data.nModified == 1){
				res.status(200).json({
					 "message": "Success",
				});
		  }else{
				res.status(401).json({
					 "message": "Product Not Found"
				});
		  }
	 })
	 .catch(err =>{
		  console.log(err);
		  res.status(500).json({
				error: err
		  });
	 });
};
exports.customerReviewAvg = (req,res,next)=>{
	 CustomerReview.aggregate([
		  {$match:
				{"product_id" : ObjectId(req.params.product_id)} 
		  },
		  { $group: { _id : ObjectId(req.params.product_id), "reviewAvg" : { "$avg": "$rating" } } }
	 ])
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
};
exports.listCustomerReviewbucustomerid = (req,res,next)=>{
	 CustomerReview.aggregate([
		  {$match:
				{"customerID" : ObjectId(req.params.customerID)} 
		  },
		  { $lookup:
				{
				 from: 'products',
				 localField: 'product_id',
				 foreignField: '_id',
				 as: 'productDetails'
				}
		  },
		  {
				$sort: {
				  "reviewlist.createdAt": -1
				}
		  }
	 ])
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
};
exports.delete_review = (req,res,next)=>{
	 CustomerReview.deleteOne({_id:req.params.reviewID})
	 .exec()
	 .then(data=>{
		  res.status(200).json({
				"message": "Review Deleted Successfully."
		  });
	 })
	 .catch(err =>{
		  console.log(err);
		  res.status(500).json({
				error: err
		  });
	 });
};
exports.updateCustomerReview = (req, res, next) => {
	 // console.log('rating', req.body);
	 CustomerReview.updateOne(
		  { _id: req.body.rating_ID},
		  {
				$set: {
					 "rating"                    : req.body.rating,
					 "customerReview"           : req.body.customerReview,
				}
		  }
	 )
	 .exec()
	 .then(data => {
		  res.status(200).json({
				"message": "Your review updated successfully."
		  });
	 })
	 .catch(err => {
		  console.log(err);
		  res.status(500).json({
				error: err
		  });
	 });
};

exports.add_admin_comment = (req, res, next) => {
	 CustomerReview.updateOne(
		  { _id: req.body.rating_ID},
		  {
				$set: {
					 "adminComment"           : req.body.adminComment,
				}
		  }
	 )
	 .exec()
	 .then(data => {
		  res.status(200).json({
				message : 'Comment added successfully.'
		  });
	 })
	 .catch(err => {
		  console.log(err);
		  res.status(500).json({
				error: err
		  });
	 });
};

exports.vendor_review_list = (req,res,next)=>{
	 CustomerReview.aggregate([
		  { $lookup:
			  {
				from: 'products',
				localField: 'product_id',
				foreignField: '_id',
				as: 'productDetails'
			  }
		  },
		  { $unwind : "$productDetails" },
		  { $match : { "productDetails.vendor_ID" : ObjectId(req.body.vendor_ID) } },
		  {
			  $sort: {
				 "reviewlist.createdAt": -1
			  }
		  }
	 ])
	 .skip(parseInt(req.body.startRange))
	 .limit(parseInt(req.body.limitRange))
	 .exec()
	 .then(data=>{
		  var tableData = data.map((a, i)=>{
				return{
				  "_id"           : a._id,
				  "productName"   : a.productDetails ? (a.productDetails.productName+" "+"("+a.productDetails.productCode)+")" : "-",
				  "productImages" : a.productDetails ? a.productDetails.productImage : [],
				  "customerName"  : a.customerName,
				  "customerReview": a.customerReview,                
				  "adminComment"  : a.adminComment ? a.adminComment : "-",
				  "orderID"       : a.orderID,
				  "product_id"     : a.product_id,
				  "rating"        : a.rating ? a.rating : 0,
				  "reviewlist"    : a.reviewlist,
				  "status"        : a.status
				};
			 })
		  res.status(200).json(tableData);
	 })
	 .catch(err =>{
		  console.log(err);
		  res.status(500).json({
				error: err
		  });
	 });
};

exports.vendor_review_count = (req,res,next)=>{
	 CustomerReview.aggregate([
		  { $lookup:
			  {
				from: 'products',
				localField: 'product_id',
				foreignField: '_id',
				as: 'productDetails'
			  }
		  },
		  { $match : { "productDetails.vendor_ID" : ObjectId(req.params.vendorID) } },
		  {   
				"$count": "dataCount"
		  },
	 ])
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
};

exports.count_review = (req,res,next)=>{
	 CustomerReview.find({})
	 .exec()
	 .then(data=>{
		  res.status(200).json({"dataCount":data.length});
	 })
	 .catch(err =>{
		  console.log(err);
		  res.status(500).json({
				error: err
		  });
	 });
};

exports.searchCustomerReview = (req, res, next)=>{
	 var searchText = req.body.searchText;
	 CustomerReview.aggregate([
		 { $lookup:
			  {
				from: 'products',
				localField: 'product_id',
				foreignField: '_id',
				as: 'productDetails'
			  }
		 },
		 { $match: { $or: [ 
						  {"customerReview"    : {'$regex' : '^'+searchText, $options: "i"}},
						  {"customerName"      : {'$regex' : '^'+searchText, $options: "i"}},
						  {"rating"            : {'$regex' : '^'+searchText, $options: "i"}},
						  { "productDetails"   : { $elemMatch: { "section"    : {'$regex' : '^'+searchText, $options: "i"} } } },
						  { "productDetails"   : { $elemMatch: { "category"   : {'$regex' : '^'+searchText, $options: "i"} } } },
						  { "productDetails"   : { $elemMatch: { "subCategory": {'$regex' : '^'+searchText, $options: "i"} } } },
						  { "productDetails"   : { $elemMatch: { "productName": {'$regex' : '^'+searchText, $options: "i"} } } },
					 ]
			  } 
		 },
		 {
			  $sort: {
				 "reviewlist.createdAt": -1
			  }
		 }
	 ])
	 .skip(parseInt(req.body.startRange))
	 .limit(parseInt(req.body.limitRange))
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
};


exports.ytdreviews = (req,res,next)=>{
	 //console.log('year',moment().tz('Asia/Kolkata').startOf('year'));
	 //console.log('day',moment().tz('Asia/Kolkata').endOf('day'));

	 CustomerReview.find({
		createdAt: {
		  $gte:  moment().tz('Asia/Kolkata').startOf('year'),
		  $lte:  moment().tz('Asia/Kolkata').endOf('day')
		}
	 }).count()     
		  .exec()
		  .then(data=>{
			 res.status(200).json({ "dataCount": data });
		  })
		  .catch(err =>{
				console.log(err);
				res.status(500).json({
					 error: err
				});
		  });
};


exports.mtdreviews = (req,res,next)=>{

	 CustomerReview.find({
		createdAt: {
		  $gte:  moment().tz('Asia/Kolkata').startOf('month'),
		  $lte:  moment().tz('Asia/Kolkata').endOf('day')
		}
	 }).count()      
		  .exec()
		  .then(data=>{
			 res.status(200).json({ "dataCount": data });
		  })
		  .catch(err =>{
				console.log(err);
				res.status(500).json({
					 error: err
				});
		  });
};

exports.count_todaysreview = (req,res,next)=>{
	 CustomerReview.find({ "createdAt": {$gte:  moment().tz('Asia/Kolkata').startOf('day')} }).count()
	 .exec()
	 .then(data=>{
		  res.status(200).json({ "dataCount": data });
	 })
	 .catch(err =>{
		  console.log(err);
		  res.status(500).json({
				error: err
		  });
	 });
};

exports.UnpublishedCount = (req,res,next)=>{
	 CustomerReview.find({ "status" : "Unpublish" }).count()
	 .exec()
	 .then(data=>{
		  res.status(200).json({ "dataCount": data });
	 })
	 .catch(err =>{
		  console.log(err);
		  res.status(500).json({
				error: err
		  });
	 });
};
