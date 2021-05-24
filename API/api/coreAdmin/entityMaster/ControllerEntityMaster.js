const mongoose  = require("mongoose");

const EntityMaster = require('./ModelEntityMaster');
const PersonMaster = require('../personMaster/ModelPersonMaster.js');
var ObjectId 					= require('mongodb').ObjectID;
// var request = require('request-promise');
// const gloabalVariable = require('../../nodemon.js');
var   ObjectID          = require('mongodb').ObjectID;

exports.insertEntity = (req,res,next)=>{
    insertEntityFun();
    async function insertEntityFun(){
        var getnext = await getNextSequence(req.body.entityType)
        // if(req.body.entityType == 'corporate'){var str = "C"+parseInt(getnext)}else if(req.body.entityType == 'vendor'){var str = "V"+parseInt(getnext)}else{var str = 1}

        EntityMaster.findOne({  
                            companyName               : req.body.companyName,
                            groupName                 : req.body.groupName,
                            companyEmail              : req.body.companyEmail, 
                            companyPhone              : req.body.companyPhone,
                            website                   : req.body.website   
                            })
        .exec()
        .then(data=>{
            if (data) {
                res.status(200).json({ duplicated : true });
            }else{
                const entity = new EntityMaster({
                    _id                       : new mongoose.Types.ObjectId(),
                    supplierOf                : req.body.supplierOf ? req.body.supplierOf : null,
                    entityType                : req.body.entityType,
                    profileStatus             : req.body.profileStatus,
                    companyNo                 : getnext ? getnext : 1,
                    // companyID                 : str ? str : 1, 
                    companyID                 : getnext ? getnext : 1, 
                    companyName               : req.body.companyName,
                    groupName                 : req.body.groupName,
                    CIN                       : req.body.CIN,   
                    COI                       : req.body.COI,
                    TAN                       : req.body.TAN,
                    companyLogo               : req.body.companyLogo,
                    website                   : req.body.website,
                    companyPhone              : req.body.companyPhone,
                    companyEmail              : req.body.companyEmail,
                    userID                    : req.body.userID,  
                    createdBy                 : req.body.createdBy ? req.body.createdBy : null,
                    createdAt                 : new Date()
                })
                entity.save()
                .then(data=>{
                    res.status(200).json({ created : true, entityID : data._id ,companyID : data.companyID});
                })
                .catch(err =>{
                    res.status(500).json({ error: err }); 
                });
            }
        })
        .catch(err =>{
            res.status(500).json({ error: err }); 
        });
        
    }
    
};

function getNextSequence(entityType) {
    return new Promise((resolve,reject)=>{
    EntityMaster.findOne({entityType:entityType})    
        .sort({companyNo : -1})   
        .exec()
        .then(data=>{
            if (data) { 
                var seq = data.companyNo;
                seq = seq+1;
                resolve(seq) 
            }else{
               resolve(1)
            }
            
        })
        .catch(err =>{
            reject(0)
        });
    });
}

exports.listEntity = (req,res,next)=>{
    EntityMaster.find({entityType:req.params.entityType}).sort({createdAt : -1})    
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
exports.listEntity_franchise = (req,res,next)=>{
    EntityMaster.find({entityType:req.params.entityType,_id:req.params.franchiseId}).sort({createdAt : -1})    
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

exports.listSupplier = (req,res,next)=>{
    EntityMaster.find({entityType:req.params.entityType,supplierOf:req.params.company_id}).sort({createdAt : -1})    
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

exports.countEntity = (req,res,next)=>{
    EntityMaster.find({entityType:req.params.entityType}).count()       
        .exec()
        .then(data=>{
            res.status(200).json({count: data});
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.companyNamewiseData=(req,res,next)=>{

    // console.log("req.body.companyName",req.params.companyName);

    EntityMaster.find({"companyName"    : req.params.companyName})
         .exec()
       
          .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
                //  console.log("err for company",err);
        });
};

exports.singleEntity = (req,res,next)=>{
    EntityMaster.findOne({_id : req.params.entityID})
    .exec()
    .then(data=>{
        main();
        async function main(){
            var k = 0 ;
            var returnData = [];
            if(data){
            if(data.contactPersons && data.contactPersons.length > 0){
                var contactData = [];
                for(k = 0 ; k < data.contactPersons.length ; k++){
                    var manager1Details = {
                        Name   : "",
                        Department  : "",
                        Designation    : "",
                        contactNo   : "",
                        EmpID   : "",
                    };
                     var manager2Details = {
                        Name   : "",
                        Department  : "",
                        Designation    : "",
                        contactNo   : "",
                        EmpID   : "",
                    };
                     var manager3Details = {
                        Name   : "",
                        Department  : "",
                        Designation    : "",
                        contactNo   : "",
                        EmpID   : "",
                    };
                    // if(data.contactPersons[k].bookingApprovalRequired == 'Yes'){

                      
                    manager1Details = await getManagerDetails(data.contactPersons[k].approvingAuthorityId1,data.companyID)
                    
                   
                    manager2Details = await getManagerDetails(data.contactPersons[k].approvingAuthorityId2,data.companyID)
                    
                   
                    manager3Details = await getManagerDetails(data.contactPersons[k].approvingAuthorityId3,data.companyID)

                       
                    // }
                    contactData.push({
                        "_id"                    : data.contactPersons[k]._id,
                        branchCode               : data.contactPersons[k].branchCode,
                        branchName               : data.contactPersons[k].branchName,
                        firstName                : data.contactPersons[k].firstName,
                        workLocationId           : data.contactPersons[k].workLocationId,
                        addEmployee              : data.contactPersons[k].addEmployee,
                        personID                 : data.contactPersons[k].personID,
                        lastName                 : data.contactPersons[k].lastName,
                        departmentName           : data.contactPersons[k].departmentName,
                        designationName          : data.contactPersons[k].designationName,
                        phone                    : data.contactPersons[k].phone,
                        email                    : data.contactPersons[k].email,
                        employeeID               : data.contactPersons[k].employeeID,
                        role                     : data.contactPersons[k].role,
                        bookingApprovalRequired  : data.contactPersons[k].bookingApprovalRequired,
                        profilePhoto             : data.contactPersons[k].profilePhoto,
                        middleName               : data.contactPersons[k].middleName,
                        DOB                      : data.contactPersons[k].DOB,
                        altPhone                 : data.contactPersons[k].altPhone,
                        gender                   : data.contactPersons[k].gender,
                        whatsappNo               : data.contactPersons[k].whatsappNo,
                        department               : data.contactPersons[k].department,
                        empCategory              : data.contactPersons[k].empCategory,
                        empPriority              : data.contactPersons[k].empPriority,
                        designation              : data.contactPersons[k].designation,
                        address                  : data.contactPersons[k].address,
                        createUser               : data.contactPersons[k].createUser,
                        approvingAuthorityId1    : data.contactPersons[k].approvingAuthorityId1,
                        approvingAuthorityId2    : data.contactPersons[k].approvingAuthorityId2,
                        approvingAuthorityId3    : data.contactPersons[k].approvingAuthorityId3,
                        preApprovedKilometer     : data.contactPersons[k].preApprovedKilometer,
                        preApprovedAmount        : data.contactPersons[k].preApprovedAmount,
                        preApprovedRides         : data.contactPersons[k].preApprovedRides,

                        manager1Details           : manager1Details,
                        manager2Details           : manager2Details,
                        manager3Details           : manager3Details,

                    })
                }
                    
            }
            returnData.push({
                        _id                     : data._id,
                        supplierOf              : data.supplierOf,
                        companyID               : data.companyID,
                        companyName             : data.companyName,
                        companyPhone            : data.companyPhone,
                        companyEmail            : data.companyEmail,
                        locations               : data.locations,
                        entityType              : data.entityType,
                        profileStatus           : data.profileStatus,
                        groupName               : data.groupName,
                        CIN                     : data.CIN,   
                        COI                     : data.COI,
                        TAN                     : data.TAN,
                        companyLogo             : data.companyLogo,
                        website                 : data.website,
                        userID                  : data.userID,  
                        contactData             : contactData
                    })
            }//data
            res.status(200).json(returnData);
            
        }
        
        
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};



function getManagerDetails(ID,companyID){
   return new Promise(function(resolve,reject){
        PersonMaster.findOne({"employeeId" : ID,"companyID":companyID},{firstName:1,middleName:1,lastName:1,contactNo:1,designation:1,department:1,employeeId:1})
             .populate('designationId')
             .populate('departmentId')
             .exec()
             .then(managerDetails=>{
                resolve(managerDetails);
             })
            .catch(err =>{
                res.status(500).json({
                    message : "manager not found.",
                    error: err
                   });
            });
    });
}
exports.getCompany = (req,res,next)=>{
    EntityMaster.findOne({companyID : req.params.companyID})
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

exports.entityDetails = (req,res,next)=>{
    EntityMaster.findOne({"contactPersons.userID" : req.params.userID})
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

exports.fetchLocationEntities = (req, res, next)=>{
    EntityMaster.findOne({_id : req.body.entityID})
        .sort({createdAt : -1})
        .skip(req.body.startRange)
        .limit(req.body.limitRange)
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.fetchContactEntities = (req, res, next)=>{
    EntityMaster.findOne({_id : req.body.entityID})
        .sort({createdAt : -1})
        .skip(req.body.startRange)
        .limit(req.body.limitRange)
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.getWorkLocation = (req, res, next)=>{
    // console.log("body=>",req.body)
    var selector = {};
    if(req.body.company_id){
        selector = {'_id':ObjectID(req.body.company_id)}
    }else{
        selector = {"entityType":req.body.entityType} 
    }
    // console.log("selector",selector);
    EntityMaster.aggregate([
        { $match :selector},
        { $unwind: "$locations" }
        ])
        .exec()
        .then(data=>{
            var locations = data.map((a, i)=>{
                return a.locations
             })   
            res.status(200).json({locations});
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};


exports.companyName = (req,res,next)=>{
    EntityMaster.findOne({companyID : req.params.companyID})
    .exec()
    .then(data=>{
        // console.log("req.params.companyID==>",data);
        if(data){
            res.status(200).json(data);
        }else{
            res.status(200).json({message:"COMPANY_NOT_FOUND"})
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.get_companyName = (req,res,next)=>{
    EntityMaster.findOne({companyID : req.body.companyID},{companyName:1,companyLogo:1})
    .exec()
    .then(data=>{
        // console.log("req.params.companyID==>",data);
        if(data){
            res.status(200).json(data);
        }else{
            res.status(200).json({message:"COMPANY_NOT_FOUND"})
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.companyNameType = (req,res,next)=>{
    EntityMaster.findOne({companyID : req.params.companyID,entityType : req.params.type},{companyID:1,companyName:1})
    .exec()
    .then(data=>{
        if(data){
            res.status(200).json(data);
        }else{
            res.status(200).json({message:"COMPANY_NOT_FOUND"})
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.branchCodeLocation = (req,res,next)=>{
    EntityMaster.findOne({_id : req.params.entityID, 'locations.branchCode' : req.params.branchCode})
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
exports.updateEntity = (req,res,next)=>{
    EntityMaster.updateOne(
            { _id:req.body.entityID},  
            {
                $set:   {  
                            'companyName'               : req.body.companyName,
                            'groupName'                 : req.body.groupName,
                            'companyEmail'              : req.body.companyEmail,
                            'CIN'                       : req.body.CIN,   
                            'COI'                       : req.body.COI,
                            'TAN'                       : req.body.TAN,
                            'companyLogo'               : req.body.companyLogo,
                            'website'                   : req.body.website,
                            'companyPhone'              : req.body.companyPhone
                        }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                EntityMaster.updateOne(
                { _id:req.body.entityID},
                {
                    $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                updatedBy      : req.body.updatedBy 
                                            }] 
                            }
                } )
                .exec()
                .then(data=>{
                    res.status(200).json({ updated : true });
                })
            }else{
                res.status(200).json({ updated : false });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.updateProfileStatus = (req,res,next)=>{
    EntityMaster.updateOne(
            { _id:req.body.entityID},  
            {
                $set:   { 
                            'profileStatus':req.body.status
                        }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                EntityMaster.updateOne(
                { _id:req.body.entityID},
                {
                    $push:  { 'updateLog' : [{  updatedAt      : new Date(),
                                                updatedBy      : req.body.updatedBy 
                                            }] 
                            }
                } )
                .exec()
                .then(data=>{
                    res.status(200).json({ updated : true });
                })
            }else{
                res.status(200).json({ updated : false });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.addLocation = (req,res,next)=>{
    var locationdetails = req.body.locationDetails;
    
    insertLocationdetails();
    async function insertLocationdetails() {
        // var data = await updateDocInLoc(req.body.entityID,locationdetails)
        // console.log('data====>',data)
         var getData = await fetchLocData(req.body.entityID,locationdetails);
        if (getData.length > 0) {
            res.status(200).json({ duplicated : true });
        }else{
            if(locationdetails.GSTIN || locationdetails.PAN){
                var compare = await updateSameStateDocuments(req.body.entityID,locationdetails)
            }
            var getnext = await getNextBranchCode(req.body.entityID)
            locationdetails.branchCode = getnext;
            EntityMaster.updateOne(
                    { _id: ObjectID(req.body.entityID) },  
                    {
                        $push:  { 'locations' : locationdetails }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified == 1){
                        res.status(200).json({ created : true });
                    }else{
                        res.status(401).json({ created : false });
                    }
                })
                .catch(err =>{
                    res.status(500).json({ error: err });
                });
        }
    }
};

function fetchLocData(entityID,locationdetails){
    return new Promise((resolve,reject)=>{
        EntityMaster.find(
        {_id: entityID,"locations.locationType":locationdetails.locationType, "locations.addressLine1": locationdetails.addressLine1},{ 'locations.$': 1 })
        .exec()
        .then(data=>{
            resolve(data)
        })
        .catch(err =>{
            reject(0)
        });
    })
}

function getNextBranchCode(entityID) {
    return new Promise((resolve,reject)=>{
    EntityMaster.findOne({"_id" : entityID }).sort({"locations.branchCode":-1})       
        .exec()
        .then(data=>{
            if (data.locations.length > 0 ) { 
                var seq = data.locations[data.locations.length - 1].branchCode;
                seq = seq+1;
                resolve(seq) 
            }else{
               resolve(1)
            }
            
        })
        .catch(err =>{
            reject(0)
        });
    });
}

function updateSameStateDocuments(entityID,locationdetails){
    return new Promise((resolve,reject)=>{
        EntityMaster.updateMany({"_id":entityID, "locations.state":locationdetails.state},
            {
                $set:   { 
                          'locations.$[].GSTIN'        : locationdetails.GSTIN,
                          'locations.$[].GSTDocument'  : locationdetails.GSTDocument,
                          'locations.$[].PAN'          : locationdetails.PAN,
                          'locations.$[].PANDocument'  : locationdetails.PANDocument
                        }
            },{ multi: true }
        )
        .exec()
        .then(data=>{
            resolve(data)
        })
        .catch(err =>{
            reject(0)
        });
    })
}

exports.updateDocInLoc= (req,res,next)=>{
    EntityMaster.find({"_id":req.body.entityID, "locations.state":req.body.state},{_id: 0, 'locations.$': 1})
    .exec()
    .then(data=>{
        //  console.log('results====>',JSON.stringify(data[0].locations[0].GSTIN)) 
         // EntityMaster.updateOne({"_id":entityID, "locations._id":})
//              const category = await Category.findOne({ _id:req.params.categoryId });
// const lastIndex: number = category.items.length - 1;

// console.log(category.items[lastIndex]);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
}

exports.singleLocation = (req,res,next)=>{
    EntityMaster.find({"_id" : req.body.entityID, "locations._id":req.body.locationID },
        {"locations.$" : 1})
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
exports.updateSingleLocation = (req,res,next)=>{
    var locationdetails = req.body.locationDetails;
    insertLocationdetails();
    async function insertLocationdetails() {
    // var getData = await fetchLocData(req.body.entityID,locationdetails);
    //     if (getData.length > 0) {
    //         res.status(200).json({ duplicated : true });
    //     }else{
            if(locationdetails.GSTIN || locationdetails.PAN){
                var compare = await updateSameStateDocuments(req.body.entityID,locationdetails)
            }
    
           EntityMaster.updateOne(
                { "_id":req.body.entityID, "locations._id": req.body.locationID},  
                {
                    $set:   { 'locations.$.locationType' : locationdetails.locationType,
                              'locations.$.branchCode'   : locationdetails.branchCode,
                              'locations.$.addressLine1' : locationdetails.addressLine1,
                              'locations.$.addressLine2' : locationdetails.addressLine2,
                              'locations.$.countryCode'  : locationdetails.countryCode,
                              'locations.$.country'      : locationdetails.country,
                              'locations.$.stateCode'    : locationdetails.stateCode,
                              'locations.$.state'        : locationdetails.state,
                              'locations.$.district'     : locationdetails.district,
                              'locations.$.city'         : locationdetails.city,
                              'locations.$.area'         : locationdetails.area,
                              'locations.$.pincode'      : locationdetails.pincode,
                              'locations.$.latitude'     : locationdetails.latitude,
                              'locations.$.longitude'    : locationdetails.longitude,
                              'locations.$.GSTIN'        : locationdetails.GSTIN,
                              'locations.$.GSTDocument'  : locationdetails.GSTDocument,
                              'locations.$.PAN'          : locationdetails.PAN,
                              'locations.$.PANDocument'  : locationdetails.PANDocument
                            }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json({ updated : true });
                }else{
                    res.status(200).json({ updated : false });
                }
            })
            .catch(err =>{
                res.status(500).json({ error: err });
            });
        // }
    }
};

exports.addContact = (req,res,next)=>{
    var contactdetails = req.body.contactDetails;
    EntityMaster.find({"contactPersons.email": contactdetails.email,"contactPersons._id" : {$ne : req.body.entityID}})
    .then((datas)=>{
        if(datas.length > 0){
            res.status(200).json({ duplicated : true });
        }else{
            EntityMaster.updateOne(
                { _id:req.body.entityID},  
                {
                    $push:  { 'contactPersons' : contactdetails }
                }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json({ created : true });
                }else{
                    res.status(200).json({ created : false });
                }
            })
            .catch(err =>{
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch((err)=>{
        res.status(500).json({
            error: err
        });
    })
    
};
exports.singleContact = (req,res,next)=>{
    EntityMaster.findOne({"_id" : req.body.entityID, "contactPersons._id":req.body.contactID,"contactPersons.employeeID" : {$ne : req.body.employeeID}  },
        {"contactPersons.$" : 1})
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

function camelCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

exports.getAllVendors = (req,res,next)=>{
    var city = req.params.city;
    var city1 = camelCase(city);
    var city2 = city.toUpperCase();
    var city3 = city.toLowerCase();
    EntityMaster.find({"entityType":"vendor","locations.city":{$in:
          [city,city1,city2,city3]}})
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

exports.getAdminCompany = (req,res,next)=>{
    EntityMaster.find({"entityType":"appCompany"})
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

exports.getAllEntities = (req,res,next)=>{
    EntityMaster.find({})
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


exports.updateSingleContact = (req,res,next)=>{
    var contactdetails = req.body.contactDetails;
    // console.log('contactdetails', contactdetails, contactdetails.createUser);
    EntityMaster.find({"contactPersons.email": contactdetails.email, _id: { $ne: req.body.entityID}, "contactPersons._id" : {$ne : req.body.contactID},"contactPersons.employeeID" : {$ne : req.body.employeeID} })
    .then((datas)=>{
        if(datas.length > 0){
            res.status(200).json({ duplicated : true });
        }else{
            EntityMaster.updateOne(
            { "_id":req.body.entityID, "contactPersons._id": req.body.contactID},  
            {
                $set:   { 'contactPersons.$.branchCode' : contactdetails.branchCode,
                          'contactPersons.$.branchName' : contactdetails.branchName,
                          'contactPersons.$.profilePhoto': contactdetails.profilePhoto,
                          'contactPersons.$.firstName'  : contactdetails.firstName,
                          'contactPersons.$.middleName' : contactdetails.middleName,
                          'contactPersons.$.lastName'   : contactdetails.lastName,
                          'contactPersons.$.DOB'        : contactdetails.DOB,
                          'contactPersons.$.employeeID' : contactdetails.employeeID,
                          'contactPersons.$.phone'      : contactdetails.phone,
                          'contactPersons.$.altPhone'   : contactdetails.altPhone,
                          'contactPersons.$.whatsappNo' : contactdetails.whatsappNo,
                          'contactPersons.$.email'      : contactdetails.email,
                          'contactPersons.$.gender'     : contactdetails.gender,
                          'contactPersons.$.department' : contactdetails.department,
                          'contactPersons.$.empCategory' : contactdetails.empCategory,
                          'contactPersons.$.empPriority' : contactdetails.empPriority,
                          'contactPersons.$.designationName'    : contactdetails.designationName,
                          'contactPersons.$.designation'        : contactdetails.designation,
                          'contactPersons.$.departmentName'     : contactdetails.departmentName,
                          'contactPersons.$.address'            : contactdetails.address,
                          'contactPersons.$.role'               : contactdetails.role,
                          'contactPersons.$.createUser'         : contactdetails.createUser,
                          'contactPersons.$.bookingApprovalRequired'    : contactdetails.bookingApprovalRequired,
                          'contactPersons.$.approvingAuthorityId1'      : contactdetails.approvingAuthorityId1,
                          'contactPersons.$.approvingAuthorityId2'      : contactdetails.approvingAuthorityId2,
                          'contactPersons.$.approvingAuthorityId3'      : contactdetails.approvingAuthorityId3,
                          'contactPersons.$.preApprovedKilometer'       : contactdetails.preApprovedKilometer,
                          'contactPersons.$.preApprovedAmount'  : contactdetails.preApprovedAmount,
                          'contactPersons.$.preApprovedRides'  : contactdetails.preApprovedRides,
                        }
            }
            )
            .exec()
            .then(data=>{
                if(data.nModified == 1){
                    res.status(200).json({ updated : true });
                }else{
                    res.status(200).json({ updated : false });
                }
            })
            .catch(err =>{
                res.status(500).json({ error: err });
            });
        }
    })
    .catch((err)=>{
        res.status(500).json({
            error: err
        });
    })
};

exports.deleteEntity = (req,res,next)=>{
    EntityMaster.deleteOne({_id:req.params.entityID})
    .exec()
    .then(data=>{
        res.status(200).json({ deleted : true });
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
};


exports.deleteLocation = (req,res,next)=>{   
    EntityMaster.updateOne(
            { _id:req.params.entityID},  
            {
                $pull: { 'locations' : {_id:req.params.locationID}}
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({ deleted : true });
            }else{
                res.status(401).json({ deleted : false });
            }
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        });
};

exports.deleteContact = (req,res,next)=>{   
    EntityMaster.updateOne(
            { _id:req.params.entityID},  
            {
                $pull: { 'contactPersons' : {_id:req.params.contactID}}
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({ deleted : true });
            }else{
                res.status(200).json({ deleted : false });
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.filterEntities = (req,res,next)=>{
    // var selector = {
    //         "locations":{ $elemMatch: { stateCode : "MH" }}, 
    //         "locations":{ $elemMatch: { district : "Pune" }},
    //         "companyName" :  {$regex : "^i",$options: "i"} 
    //     };


    var selector = {}; 
    selector['$and']=[];

    selector["$and"].push({ entityType : { $regex : req.body.entityType,$options: "i"} })
    //selector.entityType = {$regex : req.body.entityType,$options: "i"}  
    if (req.body.stateCode) {
        selector["$and"].push({ locations : { $elemMatch: { stateCode : req.body.stateCode } }  })
        //selector.locations = { $elemMatch: { stateCode : req.body.stateCode } }     
    }
    if (req.body.district) {
        selector["$and"].push({ locations : { $elemMatch: { district : { $regex : req.body.district, $options: "i"} } }  })
    }
    if (req.body.initial && req.body.initial != 'All') {
        //selector.companyName = {$regex : "^"+req.body.initial,$options: "i"} 
        selector["$and"].push({ companyName : { $regex : "^"+req.body.initial,$options: "i"}   })
    }
    if (req.body.searchStr && req.body.searchStr != '') {
        selector['$or']=[];
        if (req.body.initial && req.body.initial != 'All') {
            selector["$and"].push({ companyName : { $regex : "^"+req.body.initial,$options: "i"}   })
        }
        
        selector["$or"].push({ companyName : { $regex : req.body.searchStr, $options: "i"}  })
        selector["$or"].push({ groupName   : { $regex : req.body.searchStr, $options: "i"}  })
        selector["$or"].push({ locations   : { $elemMatch: { addressLine1 : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { area : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { district : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { stateCode : { $regex : req.body.searchStr, $options: "i"} } }  })
    }

    EntityMaster.find(selector)
    .sort({createdAt : -1})
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
exports.filterEntities_grid = (req,res,next)=>{
    
    var selector = {}; 
    selector['$and']=[];

    selector["$and"].push({ entityType : { $regex : req.body.entityType,$options: "i"} })
    if (req.body.stateCode) {
        selector["$and"].push({ locations : { $elemMatch: { stateCode : req.body.stateCode } }  })
    }
    if (req.body.district) {
        selector["$and"].push({ locations : { $elemMatch: { district : { $regex : req.body.district, $options: "i"} } }  })
    }
    if (req.body.initial && req.body.initial != 'All') {
        selector["$and"].push({ companyName : { $regex : "^"+req.body.initial,$options: "i"}   })
    }
    if (req.body.searchStr && req.body.searchStr != '') {
        selector['$or']=[];
        if (req.body.initial && req.body.initial != 'All') {
            selector["$and"].push({ companyName : { $regex : "^"+req.body.initial,$options: "i"}   })
        }
        
        selector["$or"].push({ companyName : { $regex : req.body.searchStr, $options: "i"}  })
        selector["$or"].push({ groupName   : { $regex : req.body.searchStr, $options: "i"}  })
        selector["$or"].push({ locations   : { $elemMatch: { addressLine1 : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { area : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { district : { $regex : req.body.searchStr, $options: "i"} } }  })
        selector["$or"].push({ locations   : { $elemMatch: { stateCode : { $regex : req.body.searchStr, $options: "i"} } }  })
    }

    EntityMaster.find(selector)
    .sort({createdAt : -1})
    .skip(req.body.startRange)
    .limit(req.body.limitRange)
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

exports.fetchEntities = (req, res, next)=>{
    EntityMaster.find({entityType:req.body.type})
        .sort({createdAt : -1})
        .skip(req.body.startRange)
        .limit(req.body.limitRange)
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};
exports.CompanyfromEntities = (req, res, next)=>{
    EntityMaster.find({})
        .sort({createdAt : -1})
        .select("companyName")
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({ error: err });
        }); 
};

exports.countContacts = (req,res,next)=>{
    EntityMaster.aggregate([
        { "$match": { entityType:req.params.entityType } },
        {
          $group: {
            _id: "$entityType",
            total: { $sum: { $size: "$contactPersons"} }
          }
        }
    ])
    .exec()
    .then(data=>{
        if(data[0]){
            var count = data[0].total
        }else{
            var count = 0
        }

            res.status(200).json({count:count});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.appCompanyDetails = (req,res,next)=>{
    EntityMaster.findOne({companyID :1})
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

exports.getVendorList = (req,res,next)=>{
    console.log("req.body => ", req.body);

    Products.distinct("vendor_ID", {section_ID : req.body.sectionID} )
            .then( uniqueVendors =>{
                res.status(200).json(uniqueVendors);
            } )
            .catch(error =>{
                console.log ("error = ",error);
            });


/*
    var selector        = {}; 
    selector['$and']    = [];

    selector["$and"].push({ entityType : "vendor" });
    if (!req.body.latitude || !req.body.longitude) {
        var sortVar = {"companyName" : 1}
    }else{
        var sortVar = {"companyName" : 1}
    }
    if (req.body.section_ID) {
        selector["$and"].push({"productdetails.section_ID" : ObjectId(req.body.section_ID)})
    }

    EntityMaster.aggregate([
        { $lookup :            
            {
                from            : 'products',
                localField      : '_id',
                foreignField    : 'vendor_ID',
                as              : 'productdetails'
            }
        },
        {$match     : selector},
        {$project   : {
                    _id         : 1,
                    companyName : 1,
                    companyLogo : 1, 
                    companyID   : 1              
                }
        }
    ])
    .sort(sortVar)
    .skip(req.body.startRange)
    .limit(req.body.limitRange)
    .exec()
    .then(data=>{
        console.log("data => ",data)
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });

 */

};


/*Bulk upload*/

exports.bulkUploadEntity = (req, res, next) => {
    var entity = req.body.data;
    console.log("entity...",entity);
    var validData       = [];
    var validObjects    = [];
    var invalidData     = [];
    var invalidObjects  = [];
    var remark          = '';
    var failedRecords   = [];
    var Count           = 0;
    var DuplicateCount  = 0;

    processData();
    async function processData() {
        for (var k = 0; k < entity.length; k++) {
            if (entity[k].EntityType == '-') {
                remark += "entityType not found, ";
            }
            if (entity[k].CompanyName == '-') {
                remark += "companyName not found, ";
            }
            if (entity[k].GroupName == '-') {
                remark += "groupName not found, ";
            }
            if (entity[k].CompanyEmail == '-') {
                remark += "companyEmail not found, ";
            }
            if (entity[k].CompanyPhone == '-') {
                remark += "companyPhone not found, ";
            }

            if (remark == '') {
                var getnext = await getNextSequence(entity[k].EntityType)
                if(entity[k].EntityType == 'corporate'){
                    var str = "C"+parseInt(getnext)
                }else if(entity[k].EntityType == 'vendor'){
                   var str = "V"+parseInt(getnext)
                }else if(entity[k].EntityType == 'supplier'){ 
                    var str = "S"+parseInt(getnext)
                }else{var str = 1}

               validData.companyNo  = getnext ? getnext : 1;
               validData.companyID  = str ? str : 1;

                var departmentId, designationId;
                if(entity[k].Department != '-'){
                    // departmentId1 = departmentExists1[0]._id;
                     var deptData = {
                        companyID           : validData.companyID,
                        department          : entity[k].Department,
                        createdBy           : req.body.reqdata.createdBy
                    }
                   departmentId = await insertCompanywiseDepartment(deptData)
                }

                if(entity[k].Designation != '-'){
                    var desigData= {
                        companyID           : validData.companyID,
                        designation          : entity[k].Designation,
                        createdBy           : req.body.reqdata.createdBy
                    
                    }
                    designationId = await insertCompanywiseDesignation(desigData)
                }                

                var allEntities = await fetchAllEntities(req.body.reqdata.entityType);
                var employeeExists = allEntities.filter((data) => {
                    if (data.entityType == entity[k].EntityType
                        && data.companyName == entity[k].CompanyName
                        && data.companyEmail == entity[k].CompanyEmail) {
                        return data;
                    }
                })
                validObjects.fileName       = req.body.fileName;
                if (employeeExists.length == 0) {   
                  
                   
                     var latlong = await getLatLong(entity[k].AddressLine2); 
                     var lat=latlong[0].latitude;
                     var lng=latlong[0].longitude;

                     var  locations =[

                                   {
                                        locationType        : entity[k].Location1Type,
                                        addressLine1        : entity[k].Address1flatNo,
                                        addressLine2        : entity[k].Address1Line2,
                                        country             : entity[k].Country1,
                                        state               : entity[k].State1,
                                        district            : entity[k].District1,
                                        city                : entity[k].City1,
                                        area                : entity[k].Area1,
                                        pincode             : entity[k].Pincode1,
                                        latitude            : lat,
                                        longitude           : lng,
                                        
                                     }
                                 ]
                             let locationdetails = [];
                                for( var a=0; a<locations.length; a++){
                                    if((locations[a].locationType != 'null' || locations[a].addressLine1 != 'null' || locations[a].addressLine2 != 'null' ))
                                      {
                                       
                                        locationdetails.push(locations[a]);
                                            
                                        }
                                    }  
                           var contactPersons      =[

                                                    {

                                                        branchName                : entity[k].BranchName,
                                                        firstName                 : entity[k].FirstName,
                                                        lastName                  : entity[k].LastName,
                                                        phone                     : entity[k].Phone1,
                                                        altPhone                  : entity[k].AltPhone,
                                                        email                     : entity[k].Email,
                                                        department                : entity[k].Department,
                                                        designation               : entity[k].Designation,
                                                        employeeID                : entity[k].EmployeeID,
                                                        role                      : entity[k].Role,
                                                        createUser                : entity[k].LoginCredential != '-' && (entity[k].LoginCredential).toLowerCase() === 'yes' ? true : false,
                       
                                                      }
                                                   ]
                                        // console.log("contactPersons",contactPersons);           
                                        let contactdetails = [];
                                            for( var a=0; a<contactPersons.length; a++){
                                                if((contactPersons[a].branchName != null || contactPersons[a].firstName != null || 
                                                    contactPersons[a].lastName != null || contactPersons[a].empCategory != null || contactPersons[a].empPriority != null || contactPersons[a].phone != null || contactPersons[a].altPhone != null || contactPersons[a].email != null ||
                                                     contactPersons[a].department != null || contactPersons[a].designation != null || contactPersons[a].employeeID != null ))
                                                    
                                                    {

                                                    if(contactPersons[a].branchName !== 'null'){
                                                            contactPersons[a].branchName=0;    

                                                    contactdetails.push(contactPersons[a]);
                                                     }
                                                        
                                                    }
                                                } 
                                             
                                                  
                                     var users = await fetchAllUsers((entity[k].Email).toLowerCase());
                                     // console.log("users1----",users1);
                                     
                                      if(users){
                                        var userID = users._id
                                      }else{
                                         var userDetails = {

                                            firstname               : entity[k].FirstName != '-'  ? entity[k].FirstName : null,
                                            lastname                : entity[k].LastName != '-'  ? entity[k].LastName : null,
                                            mobNumber               : entity[k].Phone != '-'  ? entity[k].Phone : null,
                                            email                   : entity[k].Email != '-'  ? entity[k].Email : null,
                                            companyID               : validData.companyID,
                                            companyName             : entity[k].CompanyName != '-'  ? entity[k].CompanyName : null,
                                            designation             : entity[k].Designation != '-'  ? entity[k].Designation : null,
                                            department              : entity[k].Department != '-'  ? entity[k].Department : null,
                                            pwd                     : "welcome123",
                                            role                    : [  entity[k].Role != '-'  ? entity[k].Role : null],
                                            status                    : 'blocked',
                                            entityType              : entity[k].EntityType,
                                            // "status"                :  entity[k].role1 ==="corporateadmin" || entity[k].role1 ==="vendoradmin" || entity[k].role1 === "admin" ? "active" :"blocked",
                                            "emailSubject"  : "Email Verification",
                                            "emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
                                        }
                                         if( (userDetails.Email != '-') && ((entity[k].LoginCredential1).toLowerCase() === 'yes')){
                                              var userID = await createUser(userDetails);
                                             }
                                              // var userID1=await createUser(userDetails);;
                                              // console.log("userID----",userID);
                                               let Personcontactdetails = [];
                                                var person = await fetchAllPersons((entity[k].Email).toLowerCase());
                                               if (person){}else{
                                               var personDetails= {
                                                        profileStatus             :"New",
                                                        company_Id                : null,
                                                        supplierOf                : null,
                                                        companyID                 : validData.companyID,
                                                        companyName               : entity[k].GroupName,
                                                        type                      : "employee",
                                                        entityType                : entity[k].EntityType,
                                                        branchName                : entity[k].BranchName,
                                                        firstName                 : entity[k].FirstNam,
                                                        lastName                  : entity[k].LastName1,
                                                        // empCategory               : entity[k].empCategory1,
                                                        empPriority               : entity[k].EmpPriority,
                                                        contactNo                 : entity[k].Phone,
                                                        altContactNo              : entity[k].AltPhone,
                                                        email                     : entity[k].Email,
                                                        departmentId              : departmentId,
                                                        designationId             : designationId,
                                                        employeeId                : entity[k].EmployeeID,
                                                        loginCredential           : entity[k].LoginCredential,
                                                        userId                    : userID
                                                      }
                                                    // console.log("personDetails---",personDetails);
                                                    } 
                                                      // var entityTypeP=entity[k].EntityType;
                                                      var personData=await savePerson(personDetails);
                                        }
                                        
                                           
                                     
                                  
                                               
                                                        validObjects = {
                                                        fileName                  : req.body.fileName,   
                                                        entityType                : entity[k].EntityType,
                                                        companyName               : entity[k].CompanyName,
                                                        groupName                 : entity[k].GroupName,
                                                        CIN                       : entity[k].CIN,   
                                                        COI                       : [],
                                                        TAN                       : entity[k].TAN,
                                                        website                   : entity[k].Website,
                                                        companyPhone              : entity[k].CompanyPhone,
                                                        companyEmail              : entity[k].CompanyEmail,
                                                        country                   : entity[k].Country,
                                                        statutoryDetails          : finalstatutorydetails,
                                                        locations                 : locationdetails,
                                                        contactPersons            : contactdetails,
                                                        contactPersons            : contactdetails,
                                                        contactPersons            : contactdetails,
                             
                                }

                                validData.push(validObjects);

                            } else {

                    remark += "data already exists.";

                    invalidObjects = entity[k];
                    invalidObjects.failedRemark = remark;
                    invalidData.push(invalidObjects);
                }

            } else {

              
                invalidObjects = entity[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            remark = '';
        }
        //console.log("validData",validData);
        EntityMaster.insertMany(validData)
            .then(data => {

            })
            .catch(err => {
                console.log(err);
            });

        failedRecords.FailedRecords = invalidData;
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;

        await insertFailedRecords(failedRecords, req.body.updateBadData);

        res.status(200).json({
            "message": "Bulk upload process is completed successfully!",
            "completed": true
        });
    }
};