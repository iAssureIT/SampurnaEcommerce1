import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TempSupplierLogoImage = new Mongo.Collection('tempSupplierLogoImage');
// import { CompanySettings } from './CompanySettingMaster.js';

if(Meteor.isServer){
  Meteor.publish('tempSupplierLogoImage',function tempSupplierLogoImage(){
      return TempSupplierLogoImage.find({});
  });
  

Meteor.methods({
 'tempLogoImageUploads':function(fileName, fileData){
    var image = TempSupplierLogoImage.findOne({});
    // // console.log("image ====>",image);
    if(image){
      TempSupplierLogoImage.update({"_id" : image._id},
        {
          $set:{
          'createdAt'     : new Date(),
          'logoFilename'  : fileName,
          'tempLogoImg'   : fileData, 
          } //End of set
        },(error, result)=>{ 
      });
    }else{
      TempSupplierLogoImage.insert(
        {
          'createdAt'     : new Date(),
          'logoFilename'  : fileName,
          'tempLogoImg'   : fileData, 
        }, function(error,result){
          // // console.log(error,result);
          if(error) {
              return error;
          } else {
              return result;
          }
        }
      );
    }
  },

  'tempLogoImageDeletes':function(imgId){
    // TempLogoImage.remove(
    //     {
    //         'logoFilename'  : fileName,
    //     }, function(error,result){
    //               // // console.log(error,result);
    //               if(error) {
    //                   return error;
    //               } else {
    //                   return result;
    //               }
    //           }
    //     );
     TempSupplierLogoImage.remove({'_id': imgId});
  },
  
});
}
