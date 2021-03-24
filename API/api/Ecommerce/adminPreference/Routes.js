const express 	= require("express");
const router 	= express.Router();

const adminPreferenceController = require('../adminPreference/Controller');

//route for website model
router.post('/post', adminPreferenceController.insert_preferences);
router.get('/get', adminPreferenceController.get_preferences);

module.exports = router;