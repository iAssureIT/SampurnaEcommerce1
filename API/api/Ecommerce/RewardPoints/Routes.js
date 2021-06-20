const express 			= require("express");
const router 			= express.Router();
const checkAuth 		= require('../../coreAdmin/middlerware/check-auth.js');

const rewardPointsController = require('./Controller');

router.post('/post', 	rewardPointsController.add_reward_points);

router.get('/get', 	    rewardPointsController.get_reward_points);

module.exports = router;