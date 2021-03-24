const express 	= require("express");
const router 	= express.Router();

const distributionController = require('./Controller');

// console.log("abc");

router.post('/post', distributionController.insert_franchise_goods);

router.get('/get/franchiseDeliveryChallan/:id', distributionController.get_delivery_challan);

router.get('/get/totalFranchiseStock/:franchise_id', distributionController.total_franchise_stock);

module.exports = router; 