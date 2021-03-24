const express 	= require("express");
const router 	= express.Router();

const unitofmeasurment = require('./ControllerUnitofmeasurmen.js');

router.post('/post', unitofmeasurment.insertDepartment);

router.post('/get/list', unitofmeasurment.fetchDepartments);

router.get('/get/list', unitofmeasurment.getAllDepartments);

router.get('/get/count', unitofmeasurment.countDepartments);

router.get('/get/one/:fieldID', unitofmeasurment.fetchSingleDepartment);

router.get('/search/:str', unitofmeasurment.searchDepartment);

router.patch('/patch', unitofmeasurment.updateDepartment);

router.post('/bulkUploadDepartment',unitofmeasurment.bulkUploadDepartment);

router.post('/get/files', unitofmeasurment.fetch_file); 

router.get('/get/filedetails/:fileName', unitofmeasurment.filedetails);

router.delete('/delete/:fieldID', unitofmeasurment.deleteDepartment);

router.delete('/get/deleteAllUnits',unitofmeasurment.deleteAllUnits);


module.exports = router;