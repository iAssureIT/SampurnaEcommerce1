const express 			= require("express");
const router 			= express.Router();
const checkAuth 		= require('../../coreAdmin/middlerware/check-auth.js');

const rewardPointsController = require('./Controller');

router.post('/post', 	rewardPointsController.insert_reward_points_policy);

router.get('/get', 	    rewardPointsController.get_reward_points_policy);

module.exports = router;