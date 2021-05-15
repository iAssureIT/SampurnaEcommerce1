const mongoose	        = require("mongoose");
const StorePreference   = require('./Model');

exports.insert_preferences = (req, res, next) => {
    console.log("Store Preferences => ",req.body);
	StorePreference.findOne()
		.exec()
		.then(data =>{
            console.log("data => ",data);
			if(data){
            //   console.log("data:",data);
                StorePreference.updateOne(
                    { _id:data._id},  
                    {
                        $set:{
                            "maxRadius"                 : req.body.maxRadius,
                            "minOrderValue"             : req.body.minOrderValue,
                            "defaultServiseCharges"     : req.body.defaultServiseCharges,
                            "serviseChargesByDistance"  : req.body.serviseChargesByDistance
                        }
                    }
                )
                .exec()
                .then(data=>{
                    res.status(200).json({
                        "message": "Store Preferences Updated Successfully."
                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
			}else{                
            const storePreference = new StorePreference({
                "_id"                       : mongoose.Types.ObjectId(),      
                "maxRadius"                 : req.body.maxRadius,
                "minOrderValue"             : req.body.minOrderValue,
                "defaultServiseCharges"     : req.body.defaultServiseCharges,
                "serviseChargesByDistance"  : req.body.serviseChargesByDistance,
                "createdAt"                 : new Date()
            });            
            storePreference.save(
                function(err){
                    if(err){
                        // console.log("error:",err);
                        return  res.status(500).json({
                            error: err
                        });          
                    }else{
                        res.status(200).json({ 
                            message: 'Preferences Saved Successfully.',
                            data: adminpreference
                        });
                    }
                }
            );
        }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.get_preferences = (req, res, next) => {
    StorePreference.find()
    .exec()
    .then(data=>{
        //console.log("=============data found===========",data);
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });   
}

