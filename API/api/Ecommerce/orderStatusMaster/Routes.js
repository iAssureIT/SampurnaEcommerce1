const express 	= require("express");
const router 	= express.Router();

const orderStatusMaster = require('./Controllers.js');

router.post('/post', orderStatusMaster.insertOrderStatus);

router.post('/get/list', orderStatusMaster.fetchOrderStatus);

router.get('/get/list', orderStatusMaster.getAllOrderStatus);

router.get('/get/count', orderStatusMaster.countOrderStatus);

router.get('/get/one/:fieldID', orderStatusMaster.fetchSingleOrderStatus);

router.get('/search/:str', orderStatusMaster.searchOrderStatus);

router.patch('/patch', orderStatusMaster.updateOrderStatus);

router.post('/bulkuploadorderstatus',orderStatusMaster.orderBulkUpload);

 router.post('/get/files', orderStatusMaster.fetch_file); 

 router.get('/get/filedetails/:fileName', orderStatusMaster.filedetails);

router.delete('/delete/:fieldID', orderStatusMaster.deleteOrderStatus);

module.exports = router;