const express 	= require("express");
const router 	= express.Router();

const unitOfMeasurmentMaster = require('./ControllerUnitOfMeasurment.js');

router.post('/post', unitOfMeasurmentMaster.insertUnitOfMeasurment);

router.post('/get/list', unitOfMeasurmentMaster.fetchUnitOfMeasurment);

router.get('/get/list', unitOfMeasurmentMaster.getAllUnitOfMeasurment);

router.get('/get/count', unitOfMeasurmentMaster.countUnitOfMeasurment);

router.get('/get/one/:fieldID', unitOfMeasurmentMaster.fetchSingleUnitOfMeasurment);

router.get('/search/:str', unitOfMeasurmentMaster.searchUnitOfMeasurment);

router.patch('/patch', unitOfMeasurmentMaster.updateUnitOfMeasurment);

// router.post('/bulkUploadDepartment',unitOfMeasurmentMaster.bulkUploadUnitOfMeasurment);

router.post('/get/files', unitOfMeasurmentMaster.fetch_file); 

router.get('/get/filedetails/:fileName', unitOfMeasurmentMaster.filedetails);

router.delete('/delete/:fieldID', unitOfMeasurmentMaster.deleteUnitOfMeasurment);

// router.delete('/get/deleteAllUnits',unitOfMeasurmentMaster.deleteAllUnits);
router.delete('/get/deleteAllUnits',unitOfMeasurmentMaster.deleteAllUnits);
module.exports = router;