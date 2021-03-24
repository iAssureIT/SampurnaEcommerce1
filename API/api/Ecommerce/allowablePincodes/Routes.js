const express 	= require("express");
const router 	= express.Router();

const allowablePincodeController = require('./Controller');

//route for allowable pincodes
router.post('/post', allowablePincodeController.add_allowablePincodes);
router.get('/get', allowablePincodeController.get_allowablePincodes);
router.get('/checkpincode/:pincode', allowablePincodeController.check_delivery);
router.get('/get/:franchiseID', allowablePincodeController.get_allowablePincodes_franchise);


module.exports = router;