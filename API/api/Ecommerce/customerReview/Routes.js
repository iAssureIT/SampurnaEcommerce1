const express 		= require("express");
const router 		= express.Router();
const checkAuth 	= require('../../coreAdmin/middlerware/check-auth.js');

const customerReviewController = require('../customerReview/Controller');

router.post('/post', 														checkAuth, customerReviewController.insertCustomerReview);

router.post('/search/post', 												checkAuth, customerReviewController.searchCustomerReview);

router.patch('/patch', 														checkAuth, customerReviewController.updateCustomerReview);

router.patch('/admin/review', 											checkAuth, customerReviewController.add_admin_comment);

router.get('/get/list/:productID', 										checkAuth, customerReviewController.listCustomerReview);

router.put('/status', 														checkAuth, customerReviewController.update_review_status);

// router.get('/get/published/list',customerReviewController.list_customer_reviews);

router.get('/get/count', 													checkAuth, customerReviewController.count_review);

router.get('/get/vendorwisecount/:vendorID', 						checkAuth, customerReviewController.vendor_review_count);

router.post('/get/list', 													checkAuth, customerReviewController.list_review);

router.post('/get/vendorwiselist', 										checkAuth, customerReviewController.vendor_review_list);

router.get('/get/user/list/:customerID', 								checkAuth, customerReviewController.listCustomerReviewbucustomerid);

router.get('/get/order/list/:customerID/:orderID/:productID', 	checkAuth, customerReviewController.listCustomerProductReview);

router.get('/get/avg/:productID', 										checkAuth, customerReviewController.customerReviewAvg);

router.delete('/delete/:reviewID', 										checkAuth, customerReviewController.delete_review);

router.get('/get/ytdreviews', 											checkAuth, customerReviewController.ytdreviews);

router.get('/get/mtdreviews', 											checkAuth, customerReviewController.mtdreviews);

router.get('/get/todayscount', 											checkAuth, customerReviewController.count_todaysreview);

router.get('/get/UnpublishedCount', 									checkAuth, customerReviewController.UnpublishedCount);

router.get('/get/count', 													checkAuth, customerReviewController.count_review);


module.exports = router;