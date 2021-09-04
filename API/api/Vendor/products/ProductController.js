const mongoose             = require("mongoose");
var ObjectId               = require('mongodb').ObjectID;
const Product             = require('../../Ecommerce/products/Model');


exports.list_product_with_limits = (req,res,next)=>{
	// Products.find()
	// .sort({ "createdAt": -1 })
	// .exec()
	// .then(data=>{
	// 	var allData = data.map((x, i)=>{
	// 		// console.log("allData x",x)
	// 		var productNameRlang = x.productNameRlang ? "<br><span class='RegionalFont'>"+x.productNameRlang+"</span>" : '';
	// 		var categoryNameRlang = x.categoryNameRlang ? "<br><span class='RegionalFont'>"+x.categoryNameRlang+"</span>" : '';
	// 		return {
	// 			"_id"                   : x._id,
	// 			"vendorName"            : x.vendorName,
	// 			"productNameBasic"      : x.productName + "<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
	// 			"productNameRlang"      : x.productNameRlang,
	// 			"productName"           : "<span>"+(x.productName +productNameRlang)+"<br></span>"+"Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
	// 			"section"               : x.section,
	// 			"category"              : x.category +categoryNameRlang,
	// 			"subCategory"           : x.subCategory,
	// 			"originalPrice"         : "<span class='textAlignRight'>"+"<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.originalPrice+"</span>",
	// 			"discountPercent"       : "<span class='textAlignRight'>"+x.discountPercent+"%"+"</span>",
	// 			"discountedPrice"       : "<span class='textAlignRight'>"+"<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.discountedPrice+"</span>",
	// 			"availableQuantity"     : x.availableQuantity,
	// 			"featured"              : x.featured,
	// 			"exclusive"             : x.exclusive,
	// 			"status"                : x.status
	// 		}
	// 	})
	// 	res.status(200).json(allData.slice(req.body.startRange, req.body.limitRange));
	// })
	// .catch(err =>{
	// 	console.log(err);
	// 	res.status(500).json({
	// 		error: err
	// 	});
	// });
};