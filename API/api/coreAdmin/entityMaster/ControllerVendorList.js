const mongoose          = require("mongoose");
const Products          = require('../../Ecommerce/products/Model');
const Sections          = require('../../Ecommerce/sections/Model');
const EntityMaster      = require('./ModelEntityMaster');
const StorePreferences  = require('../../Ecommerce/StorePreferences/Model.js');
const haversine         = require('haversine-distance')
var ObjectId 		    = require('mongodb').ObjectID;


exports.getVendorList = (req,res,next)=>{
    console.log("req.body => ", req.body);
    Sections.find({"sectionUrl" : req.body.sectionUrl})
    .exec()
    .then(sectiondata=>{
        console.log("sectiondata => ",sectiondata)
        var section_ID  = sectiondata[0]._id;
        var sectionName = sectiondata[0].section;
        console.log("sectiondata => ",sectiondata[0]._id);
        if(sectiondata && sectiondata.length > 0){
        Products.distinct("vendor_ID", {section_ID : section_ID} )
        .then(uniqueVendors =>{  
            if(uniqueVendors && uniqueVendors.length >0){
                EntityMaster.find({"_id" : {$in : uniqueVendors} }, {locations:1, companyName:1, companyLogo : 1})              
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
                                    for(let j=0; j<vendorDetails[i].locations.length; j++){
                                        var vendor_ID   = vendorDetails[i]._id;
                                        var vendorLogo  = vendorDetails[i].companyLogo[0];
                                        var vendorName  = vendorDetails[i].companyName;
                                        var address     = vendorDetails[i].locations[j].addressLine1;
                                        var vendorLat   = vendorDetails[i].locations[j].latitude;
                                        var vendorLong  = vendorDetails[i].locations[j].longitude;
                                        
                                        if(userLat !== "" && userLat !== undefined && userLong !== "" && userLong !== undefined){
                                            var vendorDist = await calcUserVendorDist(vendorLat,vendorLong, userLat, userLong);
                                        }
                                        
                                        vendorDetails[i].locationsj = {
                                                                            // ...vendorDetails[i].locations[j]._doc, 
                                                                            "vendorLogo"        : vendorLogo,
                                                                            "vendor_ID"         : vendor_ID, 
                                                                            "vendorName"        : vendorName, 
                                                                            "vendorAddress"     : address,
                                                                            "vendorDistance"    : vendorDist ? vendorDist.toFixed(2) : ''
                                                                        };
                                        // console.log("vendorLocations => ",vendorDetails[i].locationsj);
                                        vendorLocations.push(vendorDetails[i].locationsj);
                                    }
                                }
                            }
                            if(i >= vendorDetails.length){
                                var distanceLimit = await getDistanceLimit();
                                
                                if(vendorLocations && vendorLocations.length > 0){
                                    const key = 'vendor_ID';
                                    if(userLat && userLong){
                                        if(distanceLimit){
                                            var FinalVendorLocations = [...new Map(vendorLocations.filter(vendorLocation => vendorLocation.vendorDistance <= distanceLimit).sort((a, b) => a.vendorDistance - b.vendorDistance).map(item =>[item[key], item])).values()];
                                        }else{
                                            var FinalVendorLocations =  [...new Map(vendorLocations.sort((a, b) => a.vendorDistance - b.vendorDistance).map(item =>[item[key], item])).values()];
                                        }
                                    }else{
                                        var FinalVendorLocations = [...new Map(vendorLocations.sort((a, b) => a.vendorName.localeCompare(b.vendorName)).map(item =>[item[key], item])).values()];
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
            console.log ("error = ",error);
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
        console.log("err => ",err);
        res.status(500).json({
            error : err
        });
    }); 
};

/**=========== calcUserVendorDist() ===========*/
function calcUserVendorDist(vendorLat,vendorLong, userLat, userLong){
    return new Promise(function(resolve,reject){
        //First point User Location
        var userLocation = { lat: userLat, lng: userLong }

        //Second point Vendor Location
        var vendorLocation = { lat: vendorLat, lng: vendorLong }        
        
        //Distance in meters (default)
        var distance_m = haversine(userLocation, vendorLocation);

        //Distance in kilometers
        var distance_km = distance_m /1000; 
        
        resolve(distance_km);
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