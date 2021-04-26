const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../middlerware/check-auth.js');


const entityMaster = require('./ControllerEntityMaster');

router.post('/post', entityMaster.insertEntity);

router.get('/get/:entityType',entityMaster.listEntity);

router.get('/countContacts/:entityType',entityMaster.countContacts);

router.get('/getCompany/:companyID',entityMaster.getCompany);

router.get('/get/count/:entityType',entityMaster.countEntity);

router.post('/get/filterEntities',entityMaster.filterEntities);

router.get('/get/list/:entityType/:company_id',entityMaster.listSupplier);

router.post('/get/gridfilterEntities',entityMaster.filterEntities_grid);

router.get('/get/getAllVendors/:city',entityMaster.getAllVendors);

router.post('/get/getAdminCompany',entityMaster.getAdminCompany);

router.get('/get/one/:entityID', entityMaster.singleEntity);

router.get('/get/one/:entityType/:franchiseId', entityMaster.listEntity_franchise);

router.get('/get/one/entity/:userID', entityMaster.entityDetails);

// router.post('/get/one/companyName/:companyID', entityMaster.companyName);
router.post('/get/company_name/:companyID', entityMaster.get_companyName);

router.post('/get/one/companyName', entityMaster.get_companyName);

router.get('/get/companyName/:companyID', entityMaster.companyName);

router.get('/get/one/companyNameType/:companyID/:type', entityMaster.companyNameType);

router.get('/get/singlelocation/:entityID/:branchCode',entityMaster.branchCodeLocation);

router.get('/get/companywiseData/:companyName',entityMaster.companyNamewiseData);

router.patch('/patch', entityMaster.updateEntity);

router.patch('/patch/profileStatus', entityMaster.updateProfileStatus);

router.patch('/patch/addLocation', entityMaster.addLocation);
 
router.post('/post/singleLocation',entityMaster.singleLocation);

router.post('/getAll',entityMaster.fetchEntities);

router.get('/getAllcompany',entityMaster.CompanyfromEntities);

router.get('/getAllEntities',entityMaster.getAllEntities);

router.post('/getAllLocation',entityMaster.fetchLocationEntities);

router.post('/getAllContact',entityMaster.fetchContactEntities);

router.post('/get_worklocation',entityMaster.getWorkLocation);

router.patch('/patch/updateSingleLocation', entityMaster.updateSingleLocation);

router.patch('/patch/addContact', entityMaster.addContact);

router.post('/post/singleContact',entityMaster.singleContact);

router.patch('/patch/updateSingleContact', entityMaster.updateSingleContact);

// router.get('/get/checkBAExists/:emailID', baController.check_ba_exists);

router.delete('/delete/:entityID',entityMaster.deleteEntity);

router.delete('/deleteLocation/:entityID/:locationID',entityMaster.deleteLocation);

router.delete('/deleteContact/:entityID/:contactID',entityMaster.deleteContact);


//API Mobile App - Rushikesh Salunkhe
//Get details to display contact details
router.get('/get/one', entityMaster.appCompanyDetails);

module.exports = router;