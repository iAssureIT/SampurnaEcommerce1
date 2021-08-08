const mongoose          = require("mongoose");
const Products          = require('../../Ecommerce/products/Model');
const Sections          = require('../../Ecommerce/sections/Model');
const EntityMaster      = require('./ModelEntityMaster');
const AdminPreferences  = require('../../Ecommerce/adminPreference/Model.js');
const StorePreferences  = require('../../Ecommerce/StorePreferences/Model.js');
const haversine         = require('haversine-distance')
var ObjectId 		    = require('mongodb').ObjectID;


exports.getVendorList = (req,res,next)=>{
    // console.log("req.body => ", req.body);
    
    Sections.find({"sectionUrl" : req.body.sectionUrl})
    .exec()
    .then(sectiondata=>{
        var section_ID  = sectiondata[0]._id;
        var sectionName = sectiondata[0].section;
        
        if(sectiondata && sectiondata.length > 0){
           
            Products.distinct("vendor_ID", {section_ID : section_ID} )
            .then(uniqueVendors =>{ 
                if(uniqueVendors && uniqueVendors.length > 0){
                    
                    EntityMaster.find({"_id" : {$in : uniqueVendors} }, {locations:1, companyName:1, companyLogo : 1, shopImage : 1})              
                    .exec()
                    .then(vendorDetails=>{
                        
                        if(vendorDetails && vendorDetails.length > 0){
                            var vendorLocations = [];
                            const userLat       = req.body.latitude; 
                            const userLong      = req.body.longitude; 

                            getVendorDistArray();
                            async function getVendorDistArray() {
                                for(var i=0; i<vendorDetails.length; i++){
                                    // console.log("vendorDetails => ",vendorDetails[i])
                                    if(vendorDetails[i].locations && vendorDetails[i].locations.length > 0){
                                        
                                        for(var j = 0; j < vendorDetails[i].locations.length; j++){
                                            var vendor_ID           = vendorDetails[i]._id;
                                            var vendorLogo          = vendorDetails[i].companyLogo[0];
                                            var vendorShopImage     = vendorDetails[i].shopImage;
                                            var vendorName          = vendorDetails[i].companyName;
                                            var address             = vendorDetails[i].locations[j].addressLine1;
                                            var vendorLocation_id   = vendorDetails[i].locations[j]._id;
                                            var vendorLat           = vendorDetails[i].locations[j].latitude;
                                            var vendorLong          = vendorDetails[i].locations[j].longitude;
                                            
                                            if(userLat !== "" && userLat !== undefined && userLong !== "" && userLong !== undefined){
                                                var vendorDist = await calcUserVendorDist(vendorLat,vendorLong, userLat, userLong);
                                            }
                                            
                                            vendorDetails[i].locationsj = {
                                                                                // ...vendorDetails[i].locations[j]._doc, 
                                                                                "vendorLogo"            : vendorLogo,
                                                                                "vendorShopImage"       : vendorShopImage,
                                                                                "vendor_ID"             : vendor_ID, 
                                                                                "vendorName"            : vendorName, 
                                                                                "vendorAddress"         : address,
                                                                                "vendorLocation_id"     : vendorLocation_id,
                                                                                "vendorDistance"        : vendorDist ? vendorDist.toFixed(2) : '',
                                                                                "expectedDiliveryTime"  : (parseInt(30) + parseInt((60/20) * vendorDist))
                                                                            };
                                            // console.log("vendorLocations => ",vendorDetails[i].locationsj);
                                            vendorLocations.push(vendorDetails[i].locationsj);
                                        }
                                    }
                                }
                                if(i >= vendorDetails.length){
                                    var distanceLimit = await getDistanceLimit();
                                    // console.log("distanceLimit=>",distanceLimit)
                                    // console.log("vendorLocations=>",vendorLocations)
                                    if(vendorLocations && vendorLocations.length > 0){
                                        const key = 'vendor_ID';
                                        if(userLat && userLong){
                                            if(distanceLimit){
                                                var FinalVendorLocations = [...new Map(vendorLocations.filter(vendorLocation => vendorLocation.vendorDistance <= distanceLimit).sort((b, a) => a.vendorDistance - b.vendorDistance).map(item =>[item[key], item])).values()];
                                                // console.log("FinalVendorLocations 1 =>",FinalVendorLocations)
                                            }else{                                            
                                                var FinalVendorLocations = [...new Map(vendorLocations.sort((b, a) => a.vendorDistance - b.vendorDistance).map(item =>[item[key], item])).values()];
                                                // console.log("FinalVendorLocations 2 =>",FinalVendorLocations)
                                            }
                                        }else{
                                            var FinalVendorLocations = [...new Map(vendorLocations.sort((a, b) => a.vendorName.localeCompare(b.vendorName)).map(item =>[item[key], item])).values()];
                                            // console.log("FinalVendorLocations 3 =>",FinalVendorLocations)
                                        }
                                        res.status(200).json(FinalVendorLocations);
                                    }                            
                                }
                            }
                        }else{
                            res.status(200).json({
                                message : "200 Vendors Locations not found for Vendors of section  : "+sectionName, 
                            });    
                        }
                    })
                    .catch(err =>{
                        console.log("Error while finding vendor's data => ",error);
                        res.status(500).json({
                            message : "500 Vendors Locations not found.",
                            error   : err,
                        });
                    });
                }else{
                    res.status(200).json({
                        message : "200 Unique Vendors not found for Section : "+sectionName, 
                    });
                }
            })
            .catch(error =>{
                console.log ("Error While finding distinct products for selected vendor = ",error);
                res.status(500).json({
                    message : "500 Some problem occurred while finding Vendors for Section : "+sectionName,        
                    error   : error
                });
            });
        }else{
            res.status(200).json({
                message : "200 Section not found : "+sectionName, 
            });
        }
    })
    .catch(err =>{
        console.log("Error while finding Section Data => ",err);
        res.status(500).json({
            error : err
        });
    }); 
};

exports.getProductWiseVendorList = (req,res,next)=>{
    // console.log("req.body => ", req.body);
    Products.findOne({"_id" : req.body.product_ID})
    .then(productData=>{  
        // console.log("productData => ",productData);

        Products.find({section_ID : productData.section_ID, universalProductCode : productData.universalProductCode} )
        .then(productsData =>{ 
            // console.log("productsData => ",productsData);
            if(productsData && productsData.length > 0){
                const uniqueVendors = [...new Set(productsData.map(item => item.vendor_ID))];
                EntityMaster.find({"_id" : {$in : uniqueVendors} }, {locations : 1, companyName : 1, companyLogo : 1, shopImage : 1})              
                .exec()
                .then(vendorDetails=>{
                    
                    if(vendorDetails && vendorDetails.length > 0){
                        var vendorLocations = [];
                        const userLat       = req.body.latitude; 
                        const userLong      = req.body.longitude; 

                        getVendorDistArray();
                        async function getVendorDistArray() {
                            for(var i=0; i<vendorDetails.length; i++){
                                // console.log("vendorDetails => ",vendorDetails[i])
                                if(vendorDetails[i].locations && vendorDetails[i].locations.length > 0){
                                    var product = productsData.find(product => String(product.vendor_ID) === String(vendorDetails[i]._id))
                                    // console.log("Product => ", product);
                                    
                                    for(var j = 0; j < vendorDetails[i].locations.length; j++){
                                        var vendor_ID           = vendorDetails[i]._id;
                                        var vendorLogo          = vendorDetails[i].companyLogo[0];
                                        var vendorShopImage     = vendorDetails[i].shopImage;
                                        var vendorName          = vendorDetails[i].companyName;
                                        var address             = vendorDetails[i].locations[j].addressLine1;
                                        var vendorLocation_id   = vendorDetails[i].locations[j]._id;
                                        var vendorLat           = vendorDetails[i].locations[j].latitude;
                                        var vendorLong          = vendorDetails[i].locations[j].longitude;
                                        var productName         = product.productName;
                                        var productPrice        = product.discountedPrice;
                                        var productAvailableQuantity = product.availableQuantity;
                                        
                                        if(userLat !== "" && userLat !== undefined && userLong !== "" && userLong !== undefined){
                                            var vendorDist = await calcUserVendorDist(vendorLat,vendorLong, userLat, userLong);
                                        }
                                        vendorDetails[i].locationsj = {
                                                                            // ...vendorDetails[i].locations[j]._doc, 
                                                                            "vendorLogo"                : vendorLogo,
                                                                            "vendorShopImage"           : vendorShopImage,
                                                                            "vendor_ID"                 : vendor_ID, 
                                                                            "vendorName"                : vendorName, 
                                                                            "vendorAddress"             : address,
                                                                            "vendorLocation_id"         : vendorLocation_id,
                                                                            "vendorDistance"            : vendorDist ? vendorDist.toFixed(2) : '',
                                                                            "expectedDiliveryTime"      : (parseInt(30) + parseInt((60/20) * vendorDist)),
                                                                            "productName"               : product.productName,
                                                                            "productPrice"              : product.discountedPrice,
                                                                            "productAvailableQuantity"  : product.availableQuantity,
                                                                        };
                                        // console.log("vendorLocations => ",vendorDetails[i].locationsj);
                                        vendorLocations.push(vendorDetails[i].locationsj);
                                    }
                                }
                            }
                            if(i >= vendorDetails.length){
                                var distanceLimit = await getDistanceLimit();
                                // console.log("distanceLimit=>",distanceLimit)
                                // console.log("vendorLocations=>",vendorLocations)
                                if(vendorLocations && vendorLocations.length > 0){
                                    const key = 'vendor_ID';
                                    if(userLat && userLong){
                                        if(distanceLimit){
                                            var FinalVendorLocations = [...new Map(vendorLocations.filter(vendorLocation => vendorLocation.vendorDistance <= distanceLimit).sort((b, a) => a.vendorDistance - b.vendorDistance).map(item =>[item[key], item])).values()];
                                            // console.log("FinalVendorLocations 1 =>",FinalVendorLocations)
                                        }else{                                            
                                            var FinalVendorLocations = [...new Map(vendorLocations.sort((b, a) => a.vendorDistance - b.vendorDistance).map(item =>[item[key], item])).values()];
                                            // console.log("FinalVendorLocations 2 =>",FinalVendorLocations)
                                        }
                                    }else{
                                        var FinalVendorLocations = [...new Map(vendorLocations.sort((a, b) => a.vendorName.localeCompare(b.vendorName)).map(item =>[item[key], item])).values()];
                                        // console.log("FinalVendorLocations 3 =>",FinalVendorLocations)
                                    }
                                    res.status(200).json(FinalVendorLocations);
                                }                            
                            }
                        }
                    }else{
                        res.status(200).json({
                            message : "200 Vendors Locations not found for Vendors of section  : "+sectionName, 
                        });    
                    }
                })
                .catch(err =>{
                    console.log("Error while finding vendor's data => ",error);
                    res.status(500).json({
                        message : "500 Vendors Locations not found.",
                        error   : err,
                    });
                });
            }else{
                res.status(200).json({
                    message : "200 Unique Vendors not found for Section : "+sectionName, 
                });
            }
        })
        .catch(error =>{
            console.log ("Error While finding distinct products for selected vendor = ",error);
            res.status(500).json({
                message : "500 Some problem occurred while finding Vendors for Section : "+sectionName,        
                error   : error
            });
        });
    })
    .catch(err =>{
        console.log("Error while finding Section Data => ",err);
        res.status(500).json({
            error : err
        });
    }); 
};

/**=========== calcUserVendorDist() ===========*/
function calcUserVendorDist(vendorLat,vendorLong, userLat, userLong){
    return new Promise(function(resolve,reject){
        processDistance()

        async function processDistance(){
            //First point User Location
            var userLocation = { lat: userLat, lng: userLong }

            //Second point Vendor Location
            var vendorLocation = { lat: vendorLat, lng: vendorLong }        
            
            //Distance in meters (default)
            var distance_m = haversine(userLocation, vendorLocation);

            //Distance in miles
            var distance_miles = distance_m * 0.00062137119;

            //Distance in kilometers
            var distance_km = distance_m /1000; 
            
            //get unit of distance
            var unitOfDistance = await getAdminPreferences();
            if(unitOfDistance.toLowerCase() === "mile"){
                resolve(distance_miles);
            }else{
                resolve(distance_km);
            }            
        }
    });
}

/**=========== getDistanceLimit() ===========*/
function getDistanceLimit(){
    return new Promise(function(resolve,reject){
        StorePreferences.findOne({},{"maxRadius" : 1})
        .exec()
        .then(storePreferences=>{
            if(storePreferences && storePreferences.maxRadius){
                resolve(parseInt(storePreferences.maxRadius));
            }else{
                resolve(0);
            }            
        })
        .catch(err =>{
            console.log("Error => ",err);
            reject(err)
        });
    });
 }


/**=========== getAdminPreferences() ===========*/
function getAdminPreferences(){
    return new Promise(function(resolve,reject){
        AdminPreferences.findOne()
        .exec()
        .then(adminPreferences=>{
            if(adminPreferences !== null){
                resolve(adminPreferences.unitOfDistance);
            }else{
                resolve(adminPreferences);
            }            
        })
        .catch(err =>{
            console.log("Error while fetching admin preferences => ",err);
            reject(err)
        });
    });
 }