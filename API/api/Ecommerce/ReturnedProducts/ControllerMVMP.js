const mongoose			= require("mongoose");
const ReturnedProducts 	= require('./ModelMVMP');
const Orders 			= require('../orders/ModelMVMP');
const CreditPoints 		= require('../CreditPoints/Model.js');
const moment           	= require('moment-timezone');
var ObjectId            = require('mongodb').ObjectID;


exports.get_returned_products = (req,res,next)=>{
	ReturnedProducts.aggregate([
		{ $lookup:
			{
				from 			: 'products',
				localField 		: 'product_id',
				foreignField 	: '_id',
				as 				: 'productDetails'
			} 
		},
		{ $lookup : 
			{
				from 				: 'entitymasters',
				localField 			: 'vendor_id',
				foreignField 		: '_id',
				as 					: 'vendorDetails'
			}
		},
		{ $lookup : {
				from 				: 'users',
				localField 			: 'user_id',
				foreignField 		: '_id',
				as 					: 'userDetails'
			}
		},		
		{$sort: 
			{
				"createdAt": -1
			}
		}
	])
	.skip(parseInt(req.body.startRange))
	.limit(parseInt(req.body.limitRange))
	.then(data=>{
		// console.log("data = > ",data)
		res.status(200).json(data);
	})
	.catch(err =>{
		res.status(500).json({error: err});
	});
};

/*=========== Get Single Returned Product ===========*/
exports.get_single_returned_product = (req,res,next)=>{
	// console.log("req.params.return_id => ",req.params.return_id)
	ReturnedProducts.findOne({"_id" : ObjectId(req.params.return_id)})
	.populate("product_id")
	.populate("vendor_id")
	.populate("user_id")
	.exec()
	.then(async(data)=>{
		// console.log("data => ",data)
		var vendorLocation 	= await data.vendor_id.locations.find(location => String(location._id) === String(data.vendorLocation_id));
		var vendorContact 	= vendorLocation && vendorLocation !== undefined 
							  ?
							  	data.vendor_id.contactPersons.find(contactPerson => contactPerson.branchCode === vendorLocation.branchCode)
							  :
							  	null
		if(data && data !== undefined){
			var returnData = {
				product_id 				: data.product_id._id,
				productName 			: data.product_id.productName,
				productCode 			: data.product_id.productCode,
				vendor_id 				: data.vendor_id._id,
				vendorName 				: data.vendor_id.companyName,
				vendorLocation_id 		: data.vendorLocation_id,
				vendorLocation 			: vendorLocation,
				vendorContact  			: vendorContact,
				dateOfPurchase 			: data.dateOfPurchase, 
				dateOfReturnRequested 	: data.createdAt,
				adminComment 			: data.adminComment,
				vendorComment 			: data.vendorComment,
				user_id 				: data.user_id._id,
				customerName 			: data.user_id.profile.fullName,
				customerEmail 			: data.user_id.profile.email,
				customerMobile 			: data.user_id.profile.mobile,
				customerComment     	: data.customerComment,
				reasonForReturn 		: data.reasonForReturn,
				returnProductImages 	: data.returnProductImages,
				returnStatus 			: data.returnStatus,
				returnStatusLog 		: data.returnStatusLog
			}
			res.status(200).json(returnData);
		}else{
			res.status(200).json(data);
		}	
		// console.log("returnData => ",returnData)	
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
};

/*=========== Change Review Status ===========*/
exports.return_status_update = (req, res, next) => {	
	console.log("req.body => ",req.body);
	
	/**----------- 1. Update return status of product  -----------*/
	ReturnedProducts.updateOne(
		{ _id : ObjectId(req.body.return_id)},
		{
			$set :{
				returnStatus : req.body.returnStatus
			},
			$push : {
				returnStatusLog :{
					status 		: req.body.returnStatus,
					statusBy 	: req.body.user_id,
					date 		: new Date()
				}
			}			
		}
	)
	.exec()
	.then(async(data) => {
		console.log("data => ",data)
		if(data.nModified === 1){
			
			/**----------- 2. Find Product in Return Collection  -----------*/
			var returnProductData = await ReturnedProducts.findOne({"_id" : ObjectId(req.body.return_id)},{order_id : 1, product_id : 1, vendor_id : 1});            
			console.log("returnProductData => ",returnProductData)
			
			/**----------- 3. Find Order in Order Collection  -----------*/
			Orders.findOne({ _id: ObjectId(returnProductData.order_id)})
			.then(async(orderdata) => {	

				var order_beforeDiscountTotal   = orderdata.paymentDetails.beforeDiscountTotal;
				var order_afterDiscountTotal    = orderdata.paymentDetails.afterDiscountTotal;
				var order_discountAmount        = orderdata.paymentDetails.discountAmount;
				var order_taxAmount             = orderdata.paymentDetails.taxAmount;
				var order_numberOfProducts 		= orderdata.order_numberOfProducts;
				var order_quantityOfProducts 	= orderdata.order_quantityOfProducts;
				var afterDiscountCouponAmount 	= orderdata.paymentDetails.afterDiscountCouponAmount;
				var order_shippingCharges       = 0;
				/**---------------------------------- */
				var maxServiceCharges           = 0; 
				var netPayableAmount 			= 0;
				var couponCancelMessage 		= "";
				
				// var maxServiceChargesData = await StorePreferences.findOne({},{maxServiceCharges : 1});            
				// if(maxServiceChargesData !== null){
				// 	maxServiceCharges = maxServiceChargesData.maxServiceCharges;
				// }
				
				for (var i = 0; i < orderdata.vendorOrders.length; i++) {				
					order_shippingCharges = order_shippingCharges + orderdata.vendorOrders[i].vendor_shippingCharges;
					console.log("1 => ", orderdata.vendorOrders[i].vendor_id)
					console.log("2 => ", returnProductData.vendor_id)
					console.log("Condition => ",(String(orderdata.vendorOrders[i].vendor_id) === String(returnProductData.vendor_id)))
					if(String(orderdata.vendorOrders[i].vendor_id) === String(returnProductData.vendor_id)){
						var vendor_numberOfProducts 	= orderdata.vendorOrders[i].vendor_numberOfProducts;
						var vendor_quantityOfProducts 	= orderdata.vendorOrders[i].vendor_quantityOfProducts;
						var vendor_beforeDiscountTotal 	= orderdata.vendorOrders[i].vendor_beforeDiscountTotal;
						var vendor_afterDiscountTotal 	= orderdata.vendorOrders[i].vendor_afterDiscountTotal;
						var vendor_discountAmount 		= orderdata.vendorOrders[i].vendor_discountAmount;
						var vendor_taxAmount 			= orderdata.vendorOrders[i].vendor_taxAmount;

						for (let j = 0; j < orderdata.vendorOrders[i].products.length; j++) {
							if(String(orderdata.vendorOrders[i].products[j].product_ID) === String(returnProductData.product_id)){
								order_beforeDiscountTotal   -= (orderdata.vendorOrders[i].products[j].originalPrice * orderdata.vendorOrders[i].products[j].quantity);
								order_afterDiscountTotal    -= (orderdata.vendorOrders[i].products[j].discountedPrice * orderdata.vendorOrders[i].products[j].quantity);
								order_discountAmount        -= (orderdata.vendorOrders[i].products[j].originalPrice - orderdata.vendorOrders[i].products[j].discountedPrice) * orderdata.vendorOrders[i].products[j].quantity;
								order_taxAmount             -= orderdata.vendorOrders[i].products[j].taxAmount ? (orderdata.vendorOrders[i].products[j].taxAmount * orderdata.vendorOrders[i].products[j].quantity) : 0;
								order_shippingCharges 		-= 0;
								order_numberOfProducts 		-= 1;
								order_quantityOfProducts 	-= orderdata.vendorOrders[i].products[j].quantity;
								netPayableAmount 			-= (orderdata.vendorOrders[i].products[j].discountedPrice * orderdata.vendorOrders[i].products[j].quantity);
								
								if(orderdata.vendorOrders[i].products.length > 1){
									vendor_numberOfProducts 	-= 1;
									vendor_quantityOfProducts 	-= orderdata.vendorOrders[i].products[j].quantity;
									vendor_beforeDiscountTotal 	-= (orderdata.vendorOrders[i].products[j].originalPrice * orderdata.vendorOrders[i].products[j].quantity);
									vendor_afterDiscountTotal 	-= (orderdata.vendorOrders[i].products[j].discountedPrice * orderdata.vendorOrders[i].products[j].quantity);
									vendor_discountAmount 		-= (orderdata.vendorOrders[i].products[j].originalPrice - orderdata.vendorOrders[i].products[j].discountedPrice) * orderdata.vendorOrders[i].products[j].quantity;
									vendor_taxAmount 			-= orderdata.vendorOrders[i].products[j].taxAmount ? (orderdata.vendorOrders[i].products[j].taxAmount * orderdata.vendorOrders[i].products[j].quantity) : 0;													
								}								
							}
						}
						// order_beforeDiscountTotal   -=  orderdata.vendorOrders[i].vendor_beforeDiscountTotal;
						// order_afterDiscountTotal    -=  orderdata.vendorOrders[i].vendor_afterDiscountTotal;
						// order_discountAmount        -=  orderdata.vendorOrders[i].vendor_discountAmount;
						// order_taxAmount             -=  orderdata.vendorOrders[i].vendor_taxAmount;
						// order_shippingCharges 		-= (orderdata.vendorOrders[i].vendor_shippingCharges).toFixed(2);
						// order_numberOfProducts 		-= (orderdata.vendorOrders[i].vendor_numberOfProducts).toFixed(2);
						// order_quantityOfProducts 	-= (orderdata.vendorOrders[i].vendor_quantityOfProducts).toFixed(2);

						// var vendor_order_afterDiscountTotal = orderdata.vendorOrders[i].vendor_afterDiscountTotal;
						// var vendor_order_shippingCharges 	= orderdata.vendorOrders[i].vendor_shippingCharges;
						// var vendor_netPayableAmount 		= orderdata.vendorOrders[i].vendor_afterDiscountTotal;					
					}				
				}
				// if(i >= orderdata.vendorOrders.length){
				// 	/*----------- Apply Shipping charges not greter than max Shipping Charges -----------*/
				// 	order_shippingCharges   = (maxServiceCharges && maxServiceCharges > 0 
				// 								? 
				// 									maxServiceCharges > order_shippingCharges 
				// 									? 
				// 										order_shippingCharges
				// 									: 
				// 										maxServiceCharges 
				// 								: 
				// 									order_shippingCharges);
					
				// 	if (orderdata.paymentDetails.disocuntCoupon_id && orderdata.paymentDetails.disocuntCoupon_id !== undefined) {
						
				// 		var isCouponValid  	= await fetchCouponData(orderdata.paymentDetails.disocuntCoupon_id); 
				// 		// console.log("isCouponValid => ",isCouponValid)                   
						
				// 		if (isCouponValid.code === "FAILED") {
				// 			couponCancelMessage         = isCouponValid.message;
				// 			netPayableAmount            = (order_afterDiscountTotal + order_taxAmount + order_shippingCharges).toFixed(2);			
				// 			afterDiscountCouponAmount   = 0;
				// 		}else{ 
				// 			/*---- Check for Min Puchase amount for Coupon to be applied ----*/
				// 			if(parseFloat(order_afterDiscountTotal) > parseFloat(isCouponValid.dataObj.minPurchaseAmount)){
		
				// 				if ((isCouponValid.dataObj.couponin).toLowerCase() === "percent") {
				// 					var discountInPercent   = (order_afterDiscountTotal * isCouponValid.dataObj.couponvalue) / 100;								
									
				// 					/*------  Check for Applicable Maximum Discount Amount -------*/
				// 					var discoutAfterCouponApply     =   isCouponValid.dataObj.maxDiscountAmount 
				// 														? 
				// 															discountInPercent < isCouponValid.dataObj.maxDiscountAmount 
				// 															? 
				// 																discountInPercent 
				// 															:   
				// 																isCouponValid.dataObj.maxDiscountAmount 
				// 														: 
				// 															discountInPercent;
				// 					afterDiscountCouponAmount   	= (discoutAfterCouponApply).toFixed(2);
				// 					netPayableAmount            	= ((order_afterDiscountTotal - discoutAfterCouponApply) + order_taxAmount + order_shippingCharges).toFixed(2);                       
		
				// 				}else if((isCouponValid.dataObj.couponin).toLowerCase() === "amount"){
									
				// 					/*------  Check for Applicable Maximum Discount Amount -------*/
				// 					var discoutAfterCouponApply     =   isCouponValid.dataObj.maxDiscountAmount 
				// 														? 
				// 															isCouponValid.dataObj.couponvalue < isCouponValid.dataObj.maxDiscountAmount 
				// 															? 
				// 																(isCouponValid.dataObj.couponvalue).toFixed(2) 
				// 															: 
				// 																isCouponValid.dataObj.maxDiscountAmount 
				// 														: 
				// 															(isCouponValid.dataObj.couponvalue).toFixed(2);
							
				// 					afterDiscountCouponAmount   	= (discoutAfterCouponApply).toFixed(2);
				// 					netPayableAmount    			= ((order_afterDiscountTotal - discoutAfterCouponApply) + order_taxAmount + order_shippingCharges).toFixed(2);	
				// 				}    
				// 			}else{
				// 				netPayableAmount            = (order_afterDiscountTotal + order_taxAmount + order_shippingCharges).toFixed(2);							
				// 				afterDiscountCouponAmount   = 0;
				// 				couponCancelMessage 		= "This Coupon Code is Only Applicable if Minimum Cart Amount is "+ isCouponValid.dataObj.minPurchaseAmount	
				// 			}	
				// 		}			
				// 	}else{
				// 		netPayableAmount = (order_afterDiscountTotal + order_taxAmount + order_shippingCharges).toFixed(2);						
				// 	}
				// }			
				console.log("order_beforeDiscountTotal => ",order_beforeDiscountTotal);
				console.log("order_afterDiscountTotal => ",order_afterDiscountTotal);
				console.log("order_discountAmount => ",order_discountAmount);
				console.log("order_taxAmount => ",order_taxAmount);
				console.log("netPayableAmount => ",netPayableAmount);		
				console.log("afterDiscountCouponAmount => ",afterDiscountCouponAmount);
				console.log("order_shippingCharges => ",order_shippingCharges);
				console.log("maxServiceCharges => ",maxServiceCharges);
				console.log("order_numberOfProducts => ",order_numberOfProducts);
				console.log("order_quantityOfProducts => ",order_quantityOfProducts);
				console.log("couponCancelMessage => ",couponCancelMessage);			
				
				console.log("vendor_numberOfProducts => ",vendor_numberOfProducts);			
				console.log("vendor_quantityOfProducts => ",vendor_quantityOfProducts);			
				console.log("vendor_beforeDiscountTotal => ",vendor_beforeDiscountTotal);			
				console.log("vendor_afterDiscountTotal => ",vendor_afterDiscountTotal);			
				console.log("vendor_discountAmount => ",vendor_discountAmount);			
				console.log("vendor_taxAmount => ",vendor_taxAmount);

				Orders.updateOne(
				{ _id: ObjectId(returnProductData.order_id), 'vendorOrders.vendor_id' : ObjectId(returnProductData.vendor_id)},		
				{
					$set:{						
						"paymentDetails.beforeDiscountTotal" 		: order_beforeDiscountTotal,
						"paymentDetails.discountAmount" 			: order_discountAmount,
						"paymentDetails.afterDiscountTotal" 		: order_afterDiscountTotal,
						"paymentDetails.taxAmount" 					: order_taxAmount,
						"paymentDetails.afterDiscountCouponAmount" 	: afterDiscountCouponAmount,
						"paymentDetails.netPayableAmount" 			: netPayableAmount,
						"vendorOrders.$.order_numberOfProducts" 	: order_numberOfProducts,
						"vendorOrders.$.order_quantityOfProducts" 	: order_quantityOfProducts,
						"vendorOrders.$.vendor_numberOfProducts" 	: vendor_numberOfProducts,
						"vendorOrders.$.vendor_quantityOfProducts" 	: vendor_quantityOfProducts,
						"vendorOrders.$.vendor_beforeDiscountTotal" : vendor_beforeDiscountTotal,
						"vendorOrders.$.vendor_afterDiscountTotal"  : vendor_afterDiscountTotal,
						"vendorOrders.$.vendor_discountAmount" 		: vendor_discountAmount,
						"vendorOrders.$.vendor_taxAmount" 			: vendor_taxAmount						
					}
				})
				.then(async(updatedata) => {
					console.log("updatedata => ",updatedata);
					if (updatedata.nModified === 1) {
						// console.log(" => ",req.body.order_id, " ",orderdata.user_ID," ",orderdata.createdAt," ",vendor_order_afterDiscountTotal," ",vendor_order_shippingCharges," ", vendor_netPayableAmount," ")
						console.log("returnProductData.order_id => ",returnProductData.order_id);
						console.log("returnProductData.user_id => ",returnProductData.user_id);

						var isOrderCreditAvailable = await CreditPoints.findOne({user_id : ObjectId(returnProductData.user_id), 'transactions.order_id' : ObjectId(returnProductData.order_id), "transactions.typeOfTransaction" : "Original Order"},{'transactions.$' : 1});
						// var isOrderCreditAvailable = await CreditPoints.findOne({"user_id" : ObjectId(returnProductData.user_id), "transactions.order_id" : ObjectId(returnProductData.order_id), "transactions.order_id" });
						console.log("isOrderCreditAvailable => ",isOrderCreditAvailable)
						if(isOrderCreditAvailable !== null){
							var returnProduct = await Orders.findOne({"_id" : ObjectId(returnProductData.order_id), "vendorOrders.vendor_id" : ObjectId(returnProductData.vendor_id), "vendorOrders.products.product_ID" : ObjectId(returnProductData.product_id)},{ 'vendorOrders.$.products.$': 1 });
							console.log("returnProduct => ",returnProduct)
							// await addCreditPoints(returnProductData.order_id, returnProductData.user_id, (returndata.discountedPrice * returndata.productQuantity), 0, (returndata.discountedPrice * returndata.productQuantity), "Return Product Credit", "minus");
						}	

						// var addCreditPoint = await addCreditPoints(orderdata._id, orderdata.user_ID, vendor_order_afterDiscountTotal, vendor_order_shippingCharges, vendor_netPayableAmount, "Vendor Order Cancelled", "minus");
						// console.log("addCreditPoint => ",addCreditPoint)		
						res.status(200).json({
							"message"	: "Order cancelled successfully."
						});
					} else {
						console.log("Failed to update Order")
						// res.status(200).json({
						// 	"message": "Order Not Found"
						// });
					}
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({
						error: err
					});
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
			// ==============

			res.status(200).json({
				message : req.body.returnStatus + ' Successfully.'
			});
		}else{
			res.status(200).json({
				message : req.body.returnStatus + ' Already '
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
	ReturnedProducts.updateOne(
		{ _id: req.body.return_id},
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


exports.returnStatusUpdate = (req,res,next)=>{
	ReturnedProducts.updateOne(
		{ _id: req.body.id},  
		{
			$push:  { 'returnStatus' : {status : req.body.status, date: new Date()} }
		}
	)
	.exec()
	.then(data=>{
		res.status(200).json({"message":req.body.status+" Successfully!"});
	})
	.catch(err =>{
		res.status(500).json({error: err});
	});
};

exports.returnPickeupInitiated = (req,res,next)=>{
	ReturnedProducts.updateOne({ _id: req.body.id}, 
						{ $push:  { 'returnStatus' : {status : "Return Pickup Initiated", date: new Date()} } ,    
						  $set : { pickedupBy : req.body.pickupby } 
						})
	.exec()
	.then(data=>{
		res.status(200).json({"message":"Return Initiated Successfully!"});
	})
	.catch(err =>{
		res.status(500).json({error: err});
	});
};

exports.returnedCount = (req,res,next)=>{
	ReturnedProducts.find({}).count()
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

exports.PendingCount = (req,res,next)=>{
	ReturnedProducts.aggregate([
	{ "$match": { 
			"returnStatus.status" :  "Return Approval Pending" 
		}
	},
	{ "$redact":
		{
			"$cond": {
			   "if": { "$eq": [ { "$arrayElemAt": [ "$returnStatus.status", -1 ] }, "Return Approval Pending" ] },
			   "then": "$$KEEP",
			   "else": "$$PRUNE"
			}
		}
	},
	{
	  $count: "count"
	}
	])     
		.exec()
		.then(data=>{
		  if (data.length==0) {
			res.status(200).json({ "dataCount": 0 });
		  }else{
			res.status(200).json({ "dataCount": data[0].count });
		  }
		  
		  
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};