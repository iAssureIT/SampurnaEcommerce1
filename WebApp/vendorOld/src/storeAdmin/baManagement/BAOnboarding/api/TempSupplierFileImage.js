import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TempSupplierFileImage = new Mongo.Collection('tempSupplierFileImage');
// import { CompanySettings } from './CompanySettingMaster.js';

if(Meteor.isServer){
  Meteor.publish('tempSupplierFileImage',function tempSupplierFileImage(){
      return TempSupplierFileImage.find({});
  });
  

Meteor.methods({

  'tempfileImageDeletes':function(imgId){
     TempSupplierFileImage.remove({'_id': imgId});
  },
  
});
}
