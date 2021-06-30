const express 		= require("express");
const router 		= express.Router();
const checkAuth 	= require('../../coreAdmin/middlerware/check-auth.js');

const returnedProductsController = require('./ControllerMVMP');

// router.post('/post', 						    checkAuth, returnedProductsController.add_returned_product);

router.get('/get/list', 						returnedProductsController.get_returned_products);

router.patch('/returnStatusUpdate', 		    checkAuth, returnedProductsController.returnStatusUpdate);

router.patch('/returnPickeupInitiated', 	    checkAuth, returnedProductsController.returnPickeupInitiated);

router.get('/get/count', 						checkAuth, returnedProductsController.returnedCount);

router.get('/get/PendingCount', 				checkAuth, returnedProductsController.PendingCount);

module.exports = router;