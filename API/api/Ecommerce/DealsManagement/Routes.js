const express 		= require("express");
const router 		= express.Router();
const checkAuth 	= require('../../coreAdmin/middlerware/check-auth.js');

const DealsManagementController = require('./Controller');

router.post('/post',                              		 DealsManagementController.insert_deals);

router.post('/get/list',                                 DealsManagementController.get_deals);

router.get('/get/list/:startRange/:limitRange',	         DealsManagementController.get_deals_with_limits);

// router.get('/get/count',                                    	checkAuth, DealsManagementController.count_deals);

// router.get('/get/one/:dealID',                          	checkAuth, DealsManagementController.get_single_deals);

// router.patch('/patch',                                   DealsManagementController.update_deals);

router.delete('/delete/:dealID',                         DealsManagementController.delete_deals);

module.exports = router; 