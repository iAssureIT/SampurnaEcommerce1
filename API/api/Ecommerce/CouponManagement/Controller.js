const mongoose  = require("mongoose");
const Coupen    = require('./Model');
const Order     = require('../orders/Model');

/**=========== insert_coupon ===========*/
exports.insert_coupon = (req, res, next) => {
    // console.log("req.body => ",req.body);

    const CoupenObj = new Coupen({
        _id                 : new mongoose.Types.ObjectId(),
        section 			: req.body.section_ID,
        category 			: req.body.category_ID,
        subCategory 		: req.body.subCategory_ID,
        coupontitle         : req.body.coupontitle,
        couponcode          : req.body.couponcode,
        coupenin            : req.body.coupenin,
        coupenvalue         : req.body.coupenvalue,
        minPurchaseAmount   : req.body.minPurchaseAmount,
        maxDiscountAmount   : req.body.maxDiscountAmount,
        couponLimit         : req.body.numOfOrders,
        status              : req.body.status,
        startdate           : req.body.startdate, 
        enddate             : req.body.enddate,
        coupenImage         : req.body.coupenImage,
        createdBy           : req.body.createdBy,
        createdAt           : new Date()
    });
    CoupenObj
    .save()
    .then(data => {
        res.status(200).json({
            "message": "Coupen is submitted successfully."
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

/**=========== get_coupon ===========*/
exports.get_coupon = (req, res, next) => {
    Coupen.find({})
    .sort({createdAt : -1})
    .exec()
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

/**=========== get_coupon ===========*/
exports.get_coupon_by_couponcode = (req, res, next) => {
    // console.log("params => ",req.params.couponCode);
    Coupen.findOne({"couponcode" : req.params.couponCode, 'startdate': { $lte : new Date()},'enddate': {$gte : new Date()}})
    .exec()
    .then(coupen => {
        if(coupen){
            Order.find({coupen_id:coupen._id}).count()
            .then(count=>{
                res.status(200).json(coupen);
            })
            .catch(err=>{
                console.log("err",err)
            })
        }else{
            res.status(200).json({message : "This promotional code you entered is not valid...!"});
        }    
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

/**=========== get_single_coupon ===========*/
exports.get_single_coupon = (req, res, next) => {
    // console.log("params => ",req.params.couponID);
    Coupen.findOne({ _id: req.params.couponID })
    .exec()
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

/**=========== update_coupon ===========*/
exports.update_coupon = (req, res, next) => {
    console.log("Update Body = ", req.body);
    Coupen.updateOne(
        { _id: req.body.couponID },
        {
            $set: {
                section 			: req.body.section_ID,
                category 			: req.body.category_ID,
                subCategory 		: req.body.subCategory_ID,
                coupontitle         : req.body.coupontitle,
                couponcode          : req.body.couponcode,
                coupenin            : req.body.coupenin,
                coupenvalue         : req.body.coupenvalue,
                minPurchaseAmount   : req.body.minPurchaseAmount,
                maxDiscountAmount   : req.body.maxDiscountAmount,
                couponLimit         : req.body.numOfOrders,
                status              : req.body.status,
                startdate           : req.body.startdate, 
                enddate             : req.body.enddate,
                coupenImage         : req.body.coupenImage
            }
        }
    )
    .exec()
    .then(data => {
        console.log("data => ",data);
        res.status(200).json({
            "message": "Coupon Updated Successfully."
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

/**=========== couponBulkAction ===========*/
exports.couponBulkAction = (req, res, next) => {
    var action = req.body.selectedAction;
    // console.log('action =>', action);
    switch (action) {
        case 'Active':
            Coupen.updateMany(
                {"_id": { "$in": req.body.selectedProducts}},
                {$set:{"status":"Active"}}
            )
            .exec()
            .then(data => {
                return res.status(200).json({
                    "msg": 'Selected Coupen are Active.',
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        break;
        case 'Inactive':
            Coupen.updateMany(
                {"_id": { "$in": req.body.selectedProducts}},
                {$set:{"status":"Inactive"}}
            )
            .exec()
            .then(data => {
                return res.status(200).json({
                    "msg": 'Selected Coupen are Inactive.',
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        break ;
        
        case 'delete':
            Coupen.deleteMany(
                {"_id": { "$in": req.body.selectedProducts}}
                )
            .exec()
            .then(data => {
                return res.status(200).json({
                    "msg": 'Selected Coupen are deleted.',
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    }
};

/**=========== delete_coupon ===========*/
exports.delete_coupon = (req, res, next) => {
    Coupen.deleteOne({ _id: req.params.couponID })
    .exec()
    .then(data => {
        res.status(200).json({
            "message": "Coupen Deleted Successfully."
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

/**=========== count_discount ===========*/
exports.count_discount = (req, res, next) => {
    Coupen.find({})
    .exec()
    .then(data => {
        res.status(200).json({ "dataCount": data.length });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

/**=========== get_discounts_with_limits ===========*/
exports.get_discounts_with_limits = (req, res, next) => {
    // console.log("params => ",req.params);
    Coupen.find()
    .skip(parseInt(req.params.startRange))
    .limit(parseInt(req.params.limitRange))
    .exec()
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};
