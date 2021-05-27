const mongoose	    = require("mongoose");
var ObjectId        = require('mongodb').ObjectID;
const Carts         = require('./ModelNew');
const Products      = require('../products/Model');
const Orders        = require('../orders/Model');
const Wishlists     = require('../wishlist/Model');
const _             = require('underscore');    
// import axios from 'axios';


exports.insert_cartid = (req,res,next)=>{

    console.log("req.body===",req.body);

	Carts.findOne({"user_ID": req.body.user_ID})
    .exec()
    .then(cartData =>{
        if(cartData !== null){
            console.log("When Cart data is available")  
            Carts.findOne({"user_ID": req.body.user_ID, 'vendorOrders.vendor_id' : req.body.vendor_ID})
            .exec()
            .then(productDataForVendor =>{
                var vendorCartItem = {
                    vendor_id   : req.body.vendor_ID,
                    vendorName  : req.body.vendorName,
                    cartItems   : [
                        {
                            product_ID          : req.body.product_ID,
                            quantity            : req.body.quantity,
                            totalWeight         : req.body.totalWeight,
                            productRate         : req.body.productRate,
                            discountPercent     : req.body.discountPercent,
                            discountedPrice     : req.body.discountedPrice,
                        }
                    ]
                }  
                if(productDataForVendor !== null){ 
                    console.log("When some Products are already added for same vendor")  
                    // var filteredVendorProducts = productDataForVendor.vendorOrders.filter(function(vendor){
                    //     return String(vendor.vendor_id) === String(req.body.vendor_ID);
                    // });
                    Carts.findOne({"user_ID": req.body.user_ID, 'vendorOrders.vendor_id' : req.body.vendor_ID, 'vendorOrders.cartItems.product_ID' : req.body.product_ID})
                    .exec()
                    .then(productData =>{                        
                        var filteredVendorProducts = productDataForVendor.vendorOrders.filter(function(vendor){
                            return String(vendor.vendor_id) === String(req.body.vendor_ID);
                        });
                        // console.log(" filteredProduct => ",filteredProduct)

                        if(productData !== null){
                            console.log("When same Product is already Available")  
                            console.log("condition => ",(filteredVendorProducts && filteredVendorProducts.length > 0))
                            if (filteredVendorProducts && filteredVendorProducts.length > 0) {
                                console.log("filteredVendorProducts=> ",filteredVendorProducts)
                                console.log("filteredVendorProducts[0].vendor_quantityOfProducts =>",filteredVendorProducts[0].vendor_quantityOfProducts)
                                var vendor_quantityOfProducts  = parseInt(filteredVendorProducts[0].vendor_quantityOfProducts) + parseInt(req.body.quantity);
                            }else{
                                var vendor_quantityOfProducts = 0;
                            }
                            var order_quantityOfProducts = productData.order_quantityOfProducts ? parseInt(productData.order_quantityOfProducts) + parseInt(req.body.quantity) : 0;
                            console.log("vars => ",vendor_quantityOfProducts)
                            Carts.updateOne(
                                {'_id' : cartData._id, 'vendorOrders.vendor_id' : req.body.vendor_ID},
                                // {$set : {
                                //     'order_quantityOfProducts'                  : 3,
                                //     'vendorOrders.$.vendor_quantityOfProducts'  : 5
                                // }},
                                {$inc:
                                    {
                                        'vendorOrders.$[outer].cartItems.$[inner].quantity'         : req.body.quantity,
                                        // 'vendorOrders.$[outer].cartItems.$[inner].totalWeight'    : req.body.totalWeight,
                                    } 
                                },
                                {arrayFilters: [
                                    { 'outer.vendor_id': req.body.vendor_ID}, 
                                    { 'inner.product_ID': req.body.product_ID }
                                ]},
                            )
                            .exec()
                            .then(data=>{
                                console.log("updated data => ", productData)
                                if(data.nModified == 1){
                                    Carts.updateOne(
                                        {'_id' : cartData._id, 'vendorOrders.vendor_id' : req.body.vendor_ID},
                                        {$set : {
                                            'order_quantityOfProducts'                  : order_quantityOfProducts,
                                            'vendorOrders.$.vendor_quantityOfProducts'  : vendor_quantityOfProducts
                                        }},
                                    )
                                    .exec()
                                    .then(updateone=>{
                                        console.log("updateone => ",updateone)
                                    })
                                    .catch(err =>{
                                        console.log('1',err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });
                                    res.status(200).json({
                                        "message": "Product added to cart successfully.",
                                    });
                                }else{
                                    res.status(401).json({
                                        "message": "Cart Not Found 1"
                                    });
                                }
                            })
                            .catch(err =>{
                                console.log('1',err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                        }else{       
                            console.log("When same Product Not Available")
                            if (filteredVendorProducts && filteredVendorProducts.length > 0) {
                                // console.log("filteredVendorProducts=> ",filteredVendorProducts)
                                console.log("filteredVendorProducts[0].vendor_quantityOfProducts =>",filteredVendorProducts[0].vendor_quantityOfProducts)
                                console.log("req.body.quantity =>",req.body.quantity)
                                var vendor_quantityOfProducts  = parseInt(filteredVendorProducts[0].vendor_quantityOfProducts) + parseInt(req.body.quantity);
                                console.log("vendor_quantityOfProducts =>",vendor_quantityOfProducts)
                                var vendor_numberOfProducts    = parseInt(filteredVendorProducts[0].vendor_numberOfProducts + 1);
                                console.log("vendor_numberOfProducts =>",vendor_numberOfProducts)
                                console.log("productData =>",productData)
                            }else{
                                var vendor_quantityOfProducts = 0;
                                var vendor_numberOfProducts = 0;
                            }
                            var order_quantityOfProducts = productDataForVendor.order_quantityOfProducts ? parseInt(productDataForVendor.order_quantityOfProducts) + parseInt(req.body.quantity) : 0;
                            var order_numberOfProducts   = productDataForVendor.order_numberOfProducts ? parseInt(productDataForVendor.order_numberOfProducts) + 1 : 0;
                            console.log("d =>>>>>>>> ",vendor_quantityOfProducts, vendor_numberOfProducts, order_quantityOfProducts, order_numberOfProducts)
                            var product = {
                                
                                    product_ID          : req.body.product_ID,
                                    quantity            : req.body.quantity,
                                    totalWeight         : req.body.totalWeight,
                                    productRate         : req.body.productRate,
                                    discountPercent     : req.body.discountPercent,
                                    discountedPrice     : req.body.discountedPrice,
                                
                            }                                 
                            Carts.updateOne(
                                {'_id' : cartData._id, 'vendorOrders.vendor_id' :  req.body.vendor_ID},
                                {
                                    $push:{
                                        'vendorOrders.$.cartItems' : product                                   
                                    },
                                    $set: { 
                                        'vendorOrders.$.vendor_numberOfProducts'    : vendor_numberOfProducts, 
                                        'vendorOrders.$.vendor_quantityOfProducts'  : vendor_quantityOfProducts,
                                        'order_numberOfProducts'                    : order_numberOfProducts,
                                        'order_quantityOfProducts'                  : order_quantityOfProducts
                                    }
                                },
                            )
                            .exec()
                            .then(updatedvendordata=>{
                                console.log("updatedvendordata => ", updatedvendordata)
                                if(updatedvendordata.nModified == 1){
                                    res.status(200).json({
                                        "message": "Product added to cart successfully.",
                                    });
                                }else{
                                    res.status(401).json({
                                        "message": "Cart Not Found 1"
                                    });
                                }
                            })
                            .catch(err =>{
                                console.log('1',err);
                                res.status(500).json({
                                    error: err
                                });
                            }); 
                        }
                    })
                    .catch(err =>{
                        // console.log('3',err);
                        res.status(500).json({
                            error: err
                        });
                    });                      
                }else{   
                    console.log("When no Products availabe for same vendor")  
                    Carts.updateOne(
                        {'_id' : cartData._id},
                        {
                            $push:{
                                'vendorOrders' : vendorCartItem,
                            },
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log("else updated => ",data)
                        if(data.nModified == 1){
                            res.status(200).json({
                                "message": "Product added to cart successfully.",
                            });
                        }else{
                            res.status(401).json({
                                "message": "Cart Not Found 1"
                            });
                        }
                    })
                    .catch(err =>{
                        console.log('2',err);
                        res.status(500).json({
                            error: err
                        });
                    });
                } 
            })
            .catch(err =>{
                console.log('3',err);
                res.status(500).json({
                    error: err
                });
            });
        }else{
            console.log("When some No cart data available")  
            var vendorCartItem = {
                vendor_id   : req.body.vendor_ID,
                vendorName  : req.body.vendorName,
                cartItems   : [
                    {
                        product_ID          : req.body.product_ID,
                        quantity            : req.body.quantity,
                        totalWeight         : req.body.totalWeight,
                        productRate         : req.body.productRate,
                        discountPercent     : req.body.discountPercent,
                        discountedPrice     : req.body.discountedPrice,
                    }
                ],
                vendor_numberOfProducts   : 1, 
                vendor_quantityOfProducts : req.body.quantity
            }  
            console.log("vendorCartItem => ",vendorCartItem);        
            
            const cartDetails = new Carts({
                _id                         : new mongoose.Types.ObjectId(),
                "user_ID"                   : req.body.user_ID,
                "vendorOrders"              : vendorCartItem,
                "order_numberOfProducts"    : 1, 
                "order_quantityOfProducts"  : req.body.quantity
            });
            cartDetails.save()
            .then(saveddata=>{
                console.log("saveddata => ",saveddata);
                res.status(200).json({
                    "message"   : "Product added to cart successfully.",
                    "cartCount" : 1
                });
            })
            .catch(err =>{
                console.log('4',err);
                res.status(500).json({
                    error: err
                });
            });
            return true;
        }		
	})
	.catch(err =>{
        console.log('5',err);
		res.status(500).json({
			error: err
		});
	});
};


exports.list_cart = (req,res,next)=>{
    Carts.find({"user_ID": req.params.user_ID})       
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};
// exports.list_cart_product = (req,res,next)=>{
//     // console.log(req.params.user_ID);
//     Carts.aggregate([
//         { "$match" : { "user_ID" : ObjectId(req.params.user_ID) } },
//         { "$unwind": "$cartItems" },
//         { "$lookup": {
//             "from": "products",
//             "as": "cartItems.productDetail",
//             "localField": "cartItems.product_ID",
//             "foreignField": "_id"
//         }},
//         { "$unwind": "$cartItems.productDetail" },
//         {
//             "$addFields": {
//                 "cartItems.subTotal": { "$sum": { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.discountedPrice" ] } },
//                 "cartItems.saving":  { "$divide": [{ "$multiply": [ { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.originalPrice" ] }, "$cartItems.productDetail.discountPercent" ]}, 100] } ,
//             }
//         },
//         { "$group": {
//             "_id": "$_id",
//             "paymentMethod":{ "$first": "$paymentMethod" },
//             "deliveryAddress":{ "$first": "$deliveryAddress" },
//             "cartItems": { "$push": "$cartItems" },
//             "cartTotal": { "$sum": { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.originalPrice" ] } },
//             "discount": { "$sum":{ "$divide": [{ "$multiply": [ { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.originalPrice" ] }, "$cartItems.productDetail.discountPercent" ]}, 100] }},
//             "total": { "$sum": { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.discountedPrice" ] } },
//             "cartQuantity":{ "$sum": "$cartItems.quantity" },
//             }
//         },
            
//     ])
//     .exec()
//     .then(data=>{
//         console.log("data",data);
//         if(data && data.length> 0 && data[0].cartItems){
//             for (let k = 0; k < data[0].cartItems.length; k++) {
//                 data[0].cartItems[k] = {...data[0].cartItems[k], isWish:false};
//             }
//             console.log("data[0].cartItems[k]",data[0]);
//             if(req.params.user_ID!=='null'){
//                 Wishlists.find({user_ID:req.params.user_ID})
//                 .then(wish=>{
//                     if(wish.length > 0){
//                         for(var i=0; i<wish.length; i++){
//                             for(var j=0; j<data[0].cartItems.length; j++){
//                                 if(String(wish[i].product_ID) === String(data[0].cartItems[j].product_ID)){
//                                     data[0].cartItems[j]= {...data[0].cartItems[j], isWish:true};
//                                     break;
//                                 }
//                             }
//                         }   
//                         if(i >= wish.length){
//                             res.status(200).json(data);
//                         }       
//                     }else{
//                         res.status(200).json(data);
//                     }
//                  })
//                  .catch(err =>{
//                     console.log(err);
//                     res.status(500).json({
//                         error: err
//                     });
//                 });
//             }else{
//                 res.status(200).json(data);
//             }    
//         }else{
//             res.status(200).json(data);
//         }
//     })
//     .catch(err =>{
//         console.log("err",err);
//         res.status(500).json({
//             error: err
//         });
//     });
// };


exports.list_cart_product = (req,res,next)=>{
    // console.log(req.params.user_ID);
    Carts.aggregate([
        { "$match" : { "user_ID" : ObjectId(req.params.user_ID) } },
        { "$unwind": "$cartItems" },
        { "$lookup": {
            "from": "products",
            "as": "cartItems.productDetail",
            "localField": "cartItems.product_ID",
            "foreignField": "_id"
        }},
        { "$unwind": "$cartItems.productDetail" },
        {
            "$addFields": {
                "cartItems.subTotal": { "$sum": { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.discountedPrice" ] } },
                "cartItems.saving":  { "$divide": [{ "$multiply": [ { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.originalPrice" ] }, "$cartItems.productDetail.discountPercent" ]}, 100] } ,
            }
        },
        { "$group": {
            "_id":"$cartItems.productDetail.vendor_ID",
            "vendorName": { "$first": "$cartItems.productDetail.vendorName" },
            "paymentMethod":{ "$first": "$paymentMethod" },
            "deliveryAddress":{ "$first": "$deliveryAddress" },
            "cartItems": { "$push": "$cartItems" },
            "cartTotal": { "$sum": { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.originalPrice" ] } },
            "discount": { "$sum":{ "$divide": [{ "$multiply": [ { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.originalPrice" ] }, "$cartItems.productDetail.discountPercent" ]}, 100] }},
            "total": { "$sum": { "$multiply": [ "$cartItems.quantity", "$cartItems.productDetail.discountedPrice" ] } },
            "cartQuantity":{ "$sum": "$cartItems.quantity" },
            }
        },
    ])
    .exec()
    .then(data=>{
        console.log("data",data);

        if(data && data.length> 0 && data[0].cartItems){
            for (let k = 0; k < data[0].cartItems.length; k++) {
                data[0].cartItems[k] = {...data[0].cartItems[k], isWish:false};
            }
            console.log("data[0].cartItems[k]",data[0]);
            if(req.params.user_ID!=='null'){
                Wishlists.find({user_ID:req.params.user_ID})
                .then(wish=>{
                    if(wish.length > 0){
                        for(var i=0; i<wish.length; i++){
                            for(var j=0; j<data[0].cartItems.length; j++){
                                if(String(wish[i].product_ID) === String(data[0].cartItems[j].product_ID)){
                                    data[0].cartItems[j]= {...data[0].cartItems[j], isWish:true};
                                    break;
                                }
                            }
                        }   
                        if(i >= wish.length){
                            res.status(200).json(data);
                        }       
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
            }else{
                res.status(200).json(data);
            }    
        }else{
            res.status(200).json(data);
        }
    })
    .catch(err =>{
        console.log("err",err);
        res.status(500).json({
            error: err
        });
    });
};



exports.all_list_cart = (req,res,next)=>{
    Carts.find()       
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.count_cart = (req,res,next)=>{
    Carts.aggregate([
        {$match:{"user_ID": req.params.user_ID}},
        { 
            "$project": { 
                "size": { "$sum": { "$map": { "input": "$vendorOrders", "as": "l", "in": { "$size": "$$l.cartItems" } } } } 
            } 
        }
    ])
    .exec()
    .then(data=>{
        res.status(200).json(data.cartItems.length);
    })
    .catch(err =>{
        console.log("err",err);
        res.status(500).json({
            error: err
        });
    });
};

exports.remove_cart_items = (req, res, next)=>{
    // console.log('r', req.body);
    Carts.updateOne(
        {"user_ID": req.body.user_ID},
        {
			$pull: { "cartItems": { "_id": req.body.cartItem_ID } }
		}
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({
                "message": "Product removed from cart successfully.",
            });
        }else{
            res.status(401).json({
                "message": "Cart Not Found 1"
            });
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.remove_product_from_cart = (req, res, next)=>{
    // console.log("selected products=",req.body.selectedProducts.length);
    for(let i=0;i<=req.body.selectedProducts;i++){
    Carts.update(
        // {"cartItems.$.product_ID": req.body.selectedProducts[0]},
        {},
        {
            '$pull':{ 'cartItems':{'product_ID': req.body.selectedProducts[0] }},
            
			// $pull: { "cartItems": { "product_ID": req.body.selectedProducts[0] } }
        },
        {new:true,multi:true},
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({
                "message": "Product removed from cart successfully.",
            });
        }else{
            res.status(401).json({
                "message": "Cart Not Found"
            });
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
}
}

exports.change_cart_item_quantity = (req, res, next)=>{
    Carts.updateOne(
        {"user_ID":req.body.user_ID,'cartItems.product_ID':req.body.product_ID},
        {
            $set:{
                'cartItems.$.quantity'   : parseInt(req.body.quantityAdded),
                'cartItems.$.totalWeight': req.body.totalWeight,
            },
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({
                "message": "Product quantity changed successfully."
            });
        }else{
            res.status(401).json({
                "message": "Cart Not Found 1"
            });
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};
exports.add_address_to_cart = (req, res, next)=>{
    Carts.findOne({"user_ID": req.body.user_ID})       
        .exec()
        .then(cartData=>{
            if(cartData){
                Carts.updateOne({ "_id" : cartData._id },
                { $set : 
                    {
                        deliveryAddress : {
                            "name"            : req.body.name,
                            "email"           : req.body.email,
                            "addressLine1"    : req.body.addressLine1,
                            "addressLine2"    : req.body.addressLine2,
                            "pincode"         : req.body.pincode,
                            "city"            : req.body.city,
                            "stateCode"       : req.body.stateCode,
                            "state"           : req.body.state,
                            "district"        : req.body.district,
                            "mobileNumber"    : req.body.mobileNumber,
                            "countryCode"     : req.body.countryCode,
                            "country"         : req.body.country,
                            "addType"         : req.body.addType,
                            "latitude"        : req.body.latitude,
                            "longitude"       : req.body.longitude,
                        }
                    }
                }) 
                .exec()
                .then(data=>{
                    // if(data.nModified == 1){
                        res.status(200).json({
                            "message": "Address added to cart successfully."
                        });
                    // }else{
                    //     res.status(401).json({
                    //         "message": "Cart Not Found"
                    //     });
                    // }
                })
                .catch(err =>{
                    res.status(500).json({
                        error: err
                    });
                });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.list_cart=(req , res , next)=>{

    Carts.find({"user_ID": req.params.user_ID})
    .exec()
    .then(data =>{
        res.status(200).json(data);       
    })
    .catch(error =>{
        res.status(500).json({
            error:error
        })

    })

}
exports.user_cart=(req , res , next)=>{

    Carts.findOne({"user_ID": req.params.user_ID})
    .exec()
    .then(data =>{
        res.status(200).json(data);       
    })
    .catch(error =>{
        res.status(500).json({
            error:error
        })

    })

}
exports.add_paymentmethod_to_cart = (req, res, next)=>{
    Carts.updateOne({"user_ID": req.body.user_ID},
    { $set : 
        {
            "paymentMethod" : req.body.payMethod,
        }
    }) 
    .exec()
    .then(data=>{
        // if(data.nModified == 1){
            res.status(200).json({
                "message": "Payment Method added successfully."
            });
        // }else{
        //     res.status(401).json({
        //         "message": "Cart Not Found"
        //     });
        // }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};


//code by madhuri ghute

//Update products cart 
exports.update_cart_item = (req, res, next)=>{
    Carts.updateOne(
        {"user_ID":req.body.user_ID,'cartItems.product_ID':req.body.product_ID},
        {
            $set:{
                'cartItems.$.rate'              : req.body.rate,
                'cartItems.$.quantity'          : req.body.quantity,
                'cartItems.$.discountPercent'   : req.body.discountPercent,
                'cartItems.$.discountedPrice'   : req.body.discountedPrice,
            },
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({
                "message": "Cart Product changed successfully."
            });
        }else{
            res.status(401).json({
                "message": "Cart Not Found 1"
            });
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};




// ===================== Server side Api call =============
// exports.paymentgatewaypinepg=(req , res , next)=>{
//     // const redirecturl = 'https://uat.pinepg.in/api/PaymentURL/CreatePaymentURL?';
//     // const paymentdetails = 'MERCHANT_ID=9445&MERCHANT_ACCESS_CODE=dc53e787-3e81-427d-9e94-19220eec39ef&REFERENCE_NO=EQWEWEE149&AMOUNT=200&CUSTOMER_MOBILE_NO=8087679825&CUSTOMER_EMAIL_ID=omkar.ronghe@iassureit.com&PRODUCT_CODE=testing';
//     // console.log("paymentdetails==>",paymentdetails)

//     // fetch.post(redirecturl+paymentdetails)
//     //             .then(reponse => {
//     //                console.log("paymentgatewaypinepg==>",reponse)
//     //                res.status(200).json({
//     //                 "message": "Test successfully."
//     //                 });
//     //             })
//     //             .catch(err => {
//     //                 console.log('Errr', err);
//     //             });
//     const paymentdetails = 'MERCHANT_ID=9445&MERCHANT_ACCESS_CODE=dc53e787-3e81-427d-9e94-19220eec39ef&REFERENCE_NO=EQWEWEE149&AMOUNT=200&CUSTOMER_MOBILE_NO=8087679825&CUSTOMER_EMAIL_ID=omkar.ronghe@iassureit.com&PRODUCT_CODE=testing';
//     const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json','Accept':'application/json'},
//         params: {
//                 MERCHANT_ID: 9445,
//                 MERCHANT_ACCESS_CODE: "dc53e787-3e81-427d-9e94-19220eec39ef",
//                 REFERENCE_NO: "hsjfhsfjk1433",
//                 AMOUNT: 200,
//                 PRODUCT_CODE: "testing",
//                 CUSTOMER_MOBILE_NO: "8087679825",
//                 CUSTOMER_EMAIL_ID: "omkar.ronghe@iassureit.com",
//             }
//     };
//     console.log("before post==>",requestOptions)


//     let pg = fetch('https://uat.pinepg.in/api/PaymentURL/CreatePaymentURL', requestOptions);

//         // .then(reponse => {
//            console.log("Response from api==>",pg)
//         //    res.status(200).json({
//         //     "message": "Test successfully."
//         //     });
//         // })
//         // .catch(err =>{
//         //     res.status(500).json({
//         //     "message": "Test NOT successfully.",
//         //         error: err
//         //     });
//         // });

// }
