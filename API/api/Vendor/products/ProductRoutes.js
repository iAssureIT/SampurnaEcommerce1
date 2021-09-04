const express 		        = require("express");
const router 		        = express.Router();
// const checkAuth 	        = require('../../coreAdmin/middlerware/check-auth');
const productsController 	= require('./ProductController.js');




router.post('/get/list',        productsController.list_product_with_limits);

module.exports = router;