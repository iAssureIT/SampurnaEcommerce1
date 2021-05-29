const mongoose	= require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const Wishlists = require('./Model');

exports.insert_wishlist = (req,res,next)=>{
    console.log("check insert_wishlist");
	Wishlists.find({user_ID:req.body.user_ID, product_ID:req.body.product_ID})
		.exec()
		.then(data =>{ 
            // console.log('data.length', data, data.length);
            if(data && data.length>0){
                Wishlists.deleteOne({user_ID:req.body.user_ID,product_ID:req.body.product_ID})
                .exec()
                .then(data=>{
                    res.status(200).json({
                        "message": "Product removed from wishlist successfully."
                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            }else{
                const wishlists = new Wishlists({
                    _id                   : new mongoose.Types.ObjectId(),                    
                    user_ID               : req.body.user_ID,
                    product_ID            : req.body.product_ID,
                    createdAt             : new Date()
                });
                wishlists.save()
                .then(datas=>{
                    Wishlists.find({user_ID:req.body.user_ID}).countDocuments()
                    .exec()
                    .then(wishlist=>{
                        res.status(200).json({
                            "message": "Product added in wishlist successfully.",
                            "wishlistCount": wishlist
                        });
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            "message": "Product already in wishlist.",
                            error: err
                        });
                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        "message": "Product already in wishlist.",
                        error: err
                    });
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

exports.list_wishlist = (req,res,next)=>{
    Wishlists.find()       
        .exec()
        .then(data=>{
            res.status(200).json(data);
            // console.log("res.data",data)
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.get_wishlist = (req,res,next)=>{
    Wishlists.find({user_ID:req.params.user_ID})
        .exec()
        .then(data=>{
                // console.log("wishlist res.data",data);
                res.status(200).json(data);
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.get_user_wishlist = (req,res,next)=>{
    Wishlists.find({user_ID:req.params.user_ID}) 
        .populate("product_ID")      
        .exec()
        .then(data=>{
                console.log("wishlist res.data",data);
                var allData = data.map((x, i)=>{
                return {
                    "_id"              : x.product_ID._id,
                    "productName"      : x.product_ID.productName,
                    "productNameRlang" : x.product_ID.productNameRlang,
                    "brandNameRlang"   : x.product_ID.brandNameRlang,
                    "productUrl"       : x.product_ID.productUrl,
                    "originalPrice"    : x.product_ID.originalPrice,
                    "availableQuantity": x.product_ID.availableQuantity,
                    "size"             : x.product_ID.size,
                    "shortDescription" : x.product_ID.shortDescription,
                    "unit"             : x.product_ID.unit, 
                    "bestSeller"       : x.product_ID.bestSeller,
                    "brand"            : x.product_ID.brand,
                    "category"         : x.product_ID.category,
                    "currency"         : x.product_ID.currency,
                    "discountPercent"  : x.product_ID.discountPercent,
                    "discountedPrice"  : x.product_ID.discountedPrice,
                    "productCode"      : x.product_ID.productCode,
                    "productImage"     : x.product_ID.productImage,
                    "product_ID"       : x.product_ID._id,
                    "wishlist_ID"      : x._id,
                    "isWish"           : true
                }
            });            
            console.log("allData===",allData);
            res.status(200).json(allData);
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.list_wishlist_with_limits = (req,res,next)=>{
    Wishlists.find()
    .exec()
    .then(data=>{
        // var allData = data.map((x, i)=>{
        //     return {
        //         "_id"                   : x._id,
        //         "wishlistCode"           : x.wishlistID,
        //         "wishlistName"           : x.wishlistName,
        //         "featured"              : x.featured,
        //         "exclusive"             : x.exclusive,
        //         "status"                : x.status
        //     }
        // })
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.count_wishlist = (req,res,next)=>{
    Wishlists.find({})
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

exports.usercount_wishlist = (req,res,next)=>{
    Wishlists.find({"user_ID": req.params.user_ID}).countDocuments()
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

exports.fetch_wishlist = (req,res,next)=>{
    Wishlists.find({_id : req.params.wishID})
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
exports.fetch_wishlist_product = (req,res,next)=>{
    Wishlists.findOne({"user_ID" : req.params.userID, "product_ID": req.params.productID})
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
exports.delete_wishlist = (req,res,next)=>{
    // console.log("req.params.wishlist_ID",req.params.wishlist_ID);
    Wishlists.deleteOne({_id :ObjectID(req.params.wishlist_ID)})
    .exec()
    .then(data=>{
        // console.log("data => ",data);
        if(data.deletedCount === 1){
            res.status(200).json({
                "message": "Product removed from wishlist successfully."
            });
        }else{
            res.status(200).json({
                "message": "Product not removed from wishlist."
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