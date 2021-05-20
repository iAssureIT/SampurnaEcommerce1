const express 			= require("express");
const router 			= express.Router();
const checkAuth 		= require('../middlerware/check-auth.js');
const vendorList	    = require('./ControllerVendorList');

router.post('/post/vendor/list', 	vendorList.getVendorList);

module.exports = router;