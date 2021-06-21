const express 			= require("express");
const router 			= express.Router();
const checkAuth 		= require('../../coreAdmin/middlerware/check-auth.js');

const creditPointsController = require('./Controller');

router.post('/post', 	creditPointsController.add_credit_points);

router.get('/get/:customer_id', 	    creditPointsController.get_credit_points);

module.exports = router;