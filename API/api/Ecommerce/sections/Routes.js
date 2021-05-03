const express 		= require("express");
const router 		= express.Router();
const checkAuth 	= require('../../coreAdmin/middlerware/check-auth.js');

const sectionsController = require('./Controller');

router.post('/post', 													checkAuth, sectionsController.insert_section);

router.get('/get/list', 												checkAuth, sectionsController.get_sections);

router.get('/get/list-with-limits/:startRange/:limitRange', checkAuth, sectionsController.get_sections_with_limits);

router.get('/get/count', 												checkAuth, sectionsController.count_section);

router.get('/get/one/:sectionID', 									checkAuth, sectionsController.get_single_section);

router.get('/get/get_megamenu_list', 							   sectionsController.get_megamenu_list);

router.patch('/patch', 													checkAuth, sectionsController.update_section);

router.delete('/delete/:sectionID', 								checkAuth, sectionsController.delete_section);

router.delete('/get/deleteAllSections', 							checkAuth, sectionsController.deleteAllSections);

module.exports = router; 