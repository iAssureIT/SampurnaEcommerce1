const express 		= require("express");
const router 		= express.Router();
const checkAuth 	= require('../../coreAdmin/middlerware/check-auth.js');

const categoryController = require('../categories/Controller');

router.get('/get/list', 					categoryController.list_section);

router.get('/get/list/:section_ID', 		categoryController.list_category);

router.get('/get/count', 					categoryController.count_category);

router.post('/get/list', 					categoryController.list_category_with_limits);

router.get('/get/one/:categoryID', 			categoryController.fetch_category);

router.get('/get/:sectionID', 				categoryController.fetch_categories_by_section);

router.post('/searchCategory', 				categoryController.searchCategory);

router.post('/searchCategoryCount', 		categoryController.searchCategoryCount);

router.get('/get/list-with-limits/:startRange/:limitRange', categoryController.get_Category_with_limits);



router.post('/post', 					    checkAuth, categoryController.insert_category);

router.patch('/patch', 						checkAuth, categoryController.update_category);

router.delete('/delete/:categoryID', 		checkAuth, categoryController.delete_category);

router.delete('/get/deleteAllCategories', 	checkAuth, categoryController.deleteAllCategories);

module.exports = router;