const express 		= require("express");
const router 		= express.Router();
const checkAuth 	= require('../../coreAdmin/middlerware/check-auth.js');

const categoryController = require('../categories/Controller');

router.post('/post', 													checkAuth, categoryController.insert_category);

router.patch('/patch', 													checkAuth, categoryController.update_category);

router.get('/get/list', 												 categoryController.list_section);

router.get('/get/list/:section_ID', 								checkAuth, categoryController.list_category);

router.get('/get/count', 												checkAuth, categoryController.count_category);

router.post('/get/list', 												checkAuth, categoryController.list_category_with_limits);


router.get('/get/one/:categoryID', 									checkAuth, categoryController.fetch_category);

router.get('/get/:sectionID', 										checkAuth, categoryController.fetch_categories_by_section);

router.post('/searchCategory', 										checkAuth, categoryController.searchCategory);

router.post('/searchCategoryCount', 								checkAuth, categoryController.searchCategoryCount);

//router.get('/get/one/:sectionID/:categoryID', categoryController.fetch_category);

router.delete('/delete/:categoryID', 								checkAuth, categoryController.delete_category);

// router.delete('/',categoryController.deleteall_category);

router.delete('/get/deleteAllCategories', 						checkAuth, categoryController.deleteAllCategories);

router.get('/get/list-with-limits/:startRange/:limitRange', checkAuth, categoryController.get_Category_with_limits);

module.exports = router;