import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { TempSupplierLogoImage } from './TempSupplierLogoImage.js';
import { TempSupplierFileImage } from './TempSupplierFileImage.js';
import { VendorLogo } from '/imports/StoreManagement/SupplierManagement/supplierOnboarding/ServerFiles/VendorLogo.js';
import { MasterData } from '/imports/admin/masterData/masterDataEntry/apimasterDataEntry.js';

export const Suppliers = new Mongo.Collection('suppliers');

// import {TempImage} from '/imports/s3/api/ClientImageCall.js';
if(Meteor.isServer){
  Meteor.publish('suppliers',function suppliers(id){
      return Suppliers.find({'createdBy':id});
  });  
  Meteor.publish('supplierList',function supplierList(){
      return Suppliers.find({createdBy:this.userId});

  });

  Meteor.publish('supplierListt',function supplierList(){
      return Suppliers.find({});

  });
  Meteor.publish('allSupplierList',function supplierList(){
      return Suppliers.find({});

  });

   Meteor.publish('supplierListByID',function supplierListByID(id){
      return Suppliers.find({'_id':id});
  });

Meteor.methods({

  'addsuppliers' : function(formValues) { 
    // // console.log(formValues);
    var templogo = TempSupplierLogoImage.findOne({}); 
    if(templogo){
      var logoLink = templogo.image;  
      var logo = logoLink;
    }else{
      var logo = '/images/imgNotFound.jpg';

    }
    var tempFile    = TempSupplierFileImage.find({}).fetch();
    var filearr     = [];

    for (var i = 0; i < tempFile.length; i++) { 
        if(tempFile){
         filearr.push({
            'name'          : tempFile[i].name,
            'extension'     : tempFile[i].extension,
            'logo'          : tempFile[i].logo,

          });  
        }
    }

        var id = Suppliers.insert({     
            'createdBy'        : Meteor.userId(),
            'typeOptions'      : formValues.typeOptions,
            'companyname'      : formValues.companyname,
            'pan'              : formValues.pan,
            'tin'              : formValues.tin,
            'website'          : formValues.website,
            'gstno'            : formValues.gstno,
            'category'         : formValues.category,
            'coino'            : formValues.coino,
            'mfg'              : formValues.mfg,
            'score'            : formValues.score,
            'Evaluation'       : formValues.Evaluation,
            'logo'             : logo,
            'attachedDocuments': filearr,
            'locationDetails'  : [],  
            'contactDetails'   : [],
            'productsServices' : [],
            'createdAt'        : new Date(),
            'changedOn'        : [],  
            'vendorId'         : Math.floor(Math.random() * 1000) + 1,   
            'OwnerId'          : Meteor.userId(),
          });                                                   
      TempSupplierLogoImage.remove({});
      TempSupplierFileImage.remove({});
      return id;
    
  },
   'removeImageTempRender':function(){
      TempSupplierLogoImage.remove({});
      TempSupplierFileImage.remove({});
  },
  'updatesuppliersBasic':function(formValues,supplierId){
    var basic = Suppliers.findOne({'_id':supplierId});
    var tempFile    = TempSupplierFileImage.find({}).fetch();
    var filearr     = [];

    for (var i = 0; i < tempFile.length; i++) { 
        if(tempFile){
         filearr.push({
            'name'          : tempFile[i].name,
            'extension'     : tempFile[i].extension,
            'logo'          : tempFile[i].logo,

          });  
        }
    }
    var attachmentfiles = formValues.attachedDocuments
    if (attachmentfiles) {
      var filearr = attachmentfiles;
    }

    if (basic) {
       Suppliers.update({'_id':supplierId},
          {$set:{
              
                  'createdBy'        : Meteor.userId(),
                  'typeOptions'      : formValues.typeOptions,
                  'companyname'      : formValues.companyname,
                  'pan'              : formValues.pan,
                  'tin'              : formValues.tin,
                  'website'          : formValues.website,
                  'gstno'            : formValues.gstno,
                  'category'         : formValues.category,
                  'coino'            : formValues.coino,
                  'mfg'              : formValues.mfg,
                  'logo'             : formValues.logo,
                  'attachedDocuments': filearr,
                  'OwnerId'          : Meteor.userId(),
            }
          }
        );
    }


  },
  'updatesuppliers':function(formValues,supplierId,locationOffice,contact_id){
    var contact = Suppliers.findOne({'_id':supplierId,"contactDetails.Location":formValues.Location});
    if (contact) {
      var lengthData = contact.contactDetails.length;
      var contactIndex = lengthData - 1;
      var lengthDataLevel = contact.contactDetails[lengthData-1].LocationLevel.length;
      var levelIndex = lengthDataLevel-1;
      var contactID = contact.contactDetails[lengthData-1].LocationLevel[lengthDataLevel-1].contact_id
      if (levelIndex != formValues.levelIndex) {
        Suppliers.update({'_id':supplierId,"contactDetails.Location":formValues.Location},
          {$push:{
              "contactDetails.$.LocationLevel"    : {
                                                  
                                                  'contact_id'        : contact_id,
                                                  'Location'          : formValues.Location,
                                                  'Designation'       : formValues.Designation,
                                                  'ContactLevel'      : formValues.ContactLevel,
                                                  'Phone'             : formValues.Phone,
                                                  'Email'             : formValues.Email,
                                                  'Name'              : formValues.Name,
                                                  'Reportinmanager'   : formValues.Reportinmanager,
                                                  'AltPhone'          : formValues.AltPhone,
                                                  'Landing'           : formValues.Landing,

                                        
                                            }

                                    ,
            }
          }
        );
      }else{
        Suppliers.update({'_id':supplierId},
        {$set :{
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Designation"]      : formValues.Designation,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".ContactLevel"]     : formValues.ContactLevel,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Phone"]            : formValues.Phone,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Email"]            : formValues.Email,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Name"]             : formValues.Name,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Reportinmanager"]  : formValues.Reportinmanager,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".AltPhone"]         : formValues.AltPhone,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Landing"]          : formValues.Landing,   
              }
          }
      )

      }
      
    }else{
      
      Suppliers.update({'_id':supplierId},
        {$push:{

            "contactDetails"    : {           
                                        Location: formValues.Location,
                                              

                                              LocationLevel :[{
                                                'contact_id'        : contact_id,
                                                'Location'          : formValues.Location,
                                                'Designation'       : formValues.Designation,
                                                'ContactLevel'      : formValues.ContactLevel,
                                                'Phone'             : formValues.Phone,
                                                'Email'             : formValues.Email,
                                                'Name'              : formValues.Name,
                                                'Reportinmanager'   : formValues.Reportinmanager,
                                                'AltPhone'          : formValues.AltPhone,
                                                'Landing'           : formValues.Landing,
                                              }]
                                          }

                                  ,
          }
        }

      );
      
    }
    // Suppliers.update({'_id':"supplierId","contactDetails.Location":"Head Officce"},{$push:{'contactDetails.$.LocationLevel':{"x":9,"y":7}}})
  },
  'editUpdatecontactDetails':function(formValues){
    // // console.log('formValues',formValues);
      var contactDetailsId = formValues._id;
      var levelId   = formValues.levelId;

      Suppliers.update({'_id':contactDetailsId},
        {$set :{
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Designation"]      : formValues.Designation,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".ContactLevel"]     : formValues.ContactLevel,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Phone"]            : formValues.Phone,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Email"]            : formValues.Email,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Name"]             : formValues.Name,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Reportinmanager"]  : formValues.Reportinmanager,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".AltPhone"]         : formValues.AltPhone,   
                ["contactDetails."+formValues.contactIndex+".LocationLevel."+formValues.levelIndex+".Landing"]          : formValues.Landing,   
              }
          }
      )
  }, 
  'removelevel':function(id,contactIndex,levelIndex,idlevele){
      Suppliers.update({'_id': id}, {$unset : {["contactDetails."+contactIndex+".LocationLevel."+levelIndex] : 1}});
      Suppliers.update({'_id': id}, {$pull : {["contactDetails."+contactIndex+".LocationLevel"] : null}});
  },

  'editUpdatelocationDetails':function(formValues){
    // // console.log('formValues===>',formValues);
    var suppliersId = formValues.uderscoreId;
    var suppliersindex = formValues.indexOneValue;
    Suppliers.update({'_id':suppliersId},
        {$set:{

                ['locationDetails.'+suppliersindex+'.locationType']   : formValues.locationType,
                ['locationDetails.'+suppliersindex+'.addressLineone'] : formValues.addressLineone,
                ['locationDetails.'+suppliersindex+'.city']           : formValues.city,
                ['locationDetails.'+suppliersindex+'.states']         : formValues.states,
                ['locationDetails.'+suppliersindex+'.area']           : formValues.area,
                ['locationDetails.'+suppliersindex+'.addressLinetwo'] : formValues.addressLinetwo,
                ['locationDetails.'+suppliersindex+'.pincode']        : formValues.pincode,
                ['locationDetails.'+suppliersindex+'.country']        : formValues.country,
          }
        }

      );
    
  },
/*  'addsuppliersUpdate':function(formValues){
    var templogo = TempSupplierLogoImage.findOne({}); 
    // // console.log(templogo);   
    if(templogo){
      var logo = templogo.logo;
    }else{
      var logo = '';

    }
    var tempFile    = TempSupplierFileImage.find({}).fetch();
      var filearr     = [];
      // var tempfileimg = '/images/attchfile.png'
    // // console.log('tempFile===>',tempFile);
    for (var i = 0; i < tempFile.length; i++) { 
        if(tempFile){
         filearr.push({
            'name'          : tempFile[i].name,
            'extension'     : tempFile[i].extension,
            'logo'          : tempFile[i].logo,

          });  
        }
    }
    Suppliers.update({'createdBy':Meteor.userId()},
        {$set:{

                'companyname'      : formValues.companyname,
                'pan'              : formValues.pan,
                'tin'              : formValues.tin,
                'website'          : formValues.website,
                'gstno'            : formValues.gstno,
                'category'         : formValues.category,
                'coino'            : formValues.coino,
                'mfg'              : formValues.mfg,
                'logo'             : logo,
                'attachedDocuments': filearr,
              }
        }

      );
    
  },*/
  'updatelocationDetails':function(formValues,supplierId){
      Suppliers.update({'_id':supplierId},
        {$push:{

            "locationDetails"    : {
                                            'locationType'     : formValues.locationType,
                                            'addressLineone'   : formValues.addressLineone,
                                            'city'             : formValues.city,
                                            'states'           : formValues.states,
                                            'area'             : formValues.area,
                                            'addressLinetwo'   : formValues.addressLinetwo,
                                            'pincode'          : formValues.pincode,
                                            'country'          : formValues.country,
                                    },
          }
        }

      );
  },
  'updateproduct':function(formValues,supplierId){
      Suppliers.update({'_id':supplierId},
        {$push:{

            "productsServices"    : {
                                            'product'     : formValues.product,
                                    },
          }
        }

      );
  },
  'Addproduct':function(formValues,supplierId){
        Suppliers.update( {'_id':supplierId},
          {$push:{

              "productsServices"    : {
                                              'product'     : formValues.product,
                                      },
            }
          }

        );
    },


  'UpSupplierLogoFile': function(fileObjpath,fileobjID,userId){
    var profileObj = VendorLogo.findOne({'_id':fileobjID});
      if(profileObj){
        var imgLink = profileObj.link();
        var image = TempSupplierLogoImage.findOne({});
        if (image) {
           TempSupplierLogoImage.update({'userId': Meteor.userId()},
          {
            'image': imgLink,
            'userId' : userId,

          }); 
        }else{

          TempSupplierLogoImage.insert(
          {
            'userId' : userId,
            'image'  : imgLink,
          });        
        }
      }

    
  },

    'uploadedAttachmentFile': function(fileObjpath,fileobjID,name){
      var imageData = VendorLogo.findOne({'_id':fileobjID});
      if(imageData){
            TempSupplierFileImage.insert({
              "name"      : imageData.name,
              "extension" : imageData.extension,
              "logo"      : imageData.link(), 
              "userId"    :Meteor.userId(),                  
            }, (error,result)=>{
                if(error){
                  return error;
                }else{
                  return result;
                }
            });
        }
    },
    
    'removeAttachment':function(id){
      TempSupplierFileImage.remove(
          {'_id':id},
        );
    },
    'removeLocationList':function(idOne,indexValue){
      Suppliers.update({'_id': idOne}, {$unset : {["locationDetails."+indexValue] : 1}});
        Suppliers.update({'_id': idOne}, {$pull : {["locationDetails"] : null}});
      // Suppliers.update(
      //   {'_id':idOne},
      //   { $pop : { 'locationDetails': indexValue }}
      //   );
    },
    'removeProduct':function(indexValue,routerId){
      // // console.log(indexValue,routerId);
        Suppliers.update({'_id': routerId}, {$unset : {["productsServices."+indexValue] : 1}});
        Suppliers.update({'_id': routerId}, {$pull : {["productsServices"] : null}});
  
    },

    'getSupplierSearchResult':function(value){
      var userData = Suppliers.find({ 'companyname': value}).fetch();
      if(userData && userData.length > 0){
        var userArray = [];
        for(var i=0; i<userData.length; i++){
          var _id        = userData[i]._id;
          var companyname = userData[i].companyname;          
          var category = userData[i].typeOptions;  
          var gst = userData[i].gstno;        
          var index      = i;
          userArray.push({_id, companyname,category,gst,index});
        } 
      }else{
        var userArray = [];
      }
      return userArray;
      }
    
  
});

}
