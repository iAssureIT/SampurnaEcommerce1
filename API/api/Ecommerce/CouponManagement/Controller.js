const mongoose  = require("mongoose");
const Coupen    = require('./Model');


exports.insert_coupon = (req, res, next) => {
    console.log("req.body => ",req.body);

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
        numOfOrders         : req.body.numOfOrders,
        status              : req.body.status,
        startdate           : req.body.startdate, 
        enddate             : req.body.enddate,
        coupenImage         : req.body.coupenImage,
        createdBy           : req.body.createdBy,
        createdAt           : new Date()
        // maxdiscountvalue    :  req.body.maxdiscountvalue,
        // coupentype          :  req.body.coupentype  ,
        // couponcodeusage     :  req.body.couponcodeusage,
        // availablefor        :  req.body.availablefor,
        // selectedCategory    :  req.body.selectedCategory   ,
        // discounttype: req.body.discounttype,
        // selectedBrand       :  req.body.selectedBrand   ,
        // selectedProducts    :  req.body.selectedProducts   ,
        // description         :  req.body.description   ,
        // termscondition      :  req.body.termscondition ,
    });
    console.log("CoupenObj===>", CoupenObj);
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

exports.get_coupon = (req, res, next) => {
    // console.log("<><><><><><><><><><><><><>");
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

exports.get_single_coupon = (req, res, next) => {
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

exports.update_coupon = (req, res, next) => {
    // console.log("Update Body = ", req.body);
    Coupen.updateOne(
        { _id: req.body.couponID },
        {
            $set: {
            coupontitle         :  req.body.coupontitle  ,
            couponcode          :  req.body.couponcode  ,
            coupentype          :  req.body.coupentype  ,
            couponcodeusage     :  req.body.couponcodeusage,
            coupenin            :  req.body.coupenin ,
            coupenvalue         :  req.body.coupenvalue ,
            maxdiscountvalue    :  req.body.maxdiscountvalue ,
            status              :  req.body.status ,
            availablefor        :  req.body.availablefor,
            startdate           :  req.body.startdate  , 
            enddate             :  req.body.enddate   ,
            selectedCategory    :  req.body.selectedCategory   ,
            selectedBrand       :  req.body.selectedBrand   ,
            selectedProducts    :  req.body.selectedProducts   ,
            description         :  req.body.description   ,
            termscondition      :  req.body.termscondition ,
            coupenImage         :  req.body.coupenImage  ,
            }
        }
    )
        .exec()
        .then(data => {
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

exports.couponBulkAction = (req, res, next) => {
    var field = req.body.selectedAction;
    // console.log('field', field);
    switch (field) {
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

exports.get_discounts_with_limits = (req, res, next) => {
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
