const express 	= require("express");
const router 	= express.Router();

const CouponManagementController = require('./Controller');

router.post('/post', CouponManagementController.insert_coupon);

router.get('/get/list',CouponManagementController.get_coupon);

router.get('/get/list-with-limits/:startRange/:limitRange',CouponManagementController.get_discounts_with_limits);

router.get('/get/count',CouponManagementController.count_discount);

router.get('/get/one/:couponID',CouponManagementController.get_single_coupon);

router.patch('/patch', CouponManagementController.update_coupon);

router.patch('/patch/couponBulkAction', CouponManagementController.couponBulkAction);

router.delete('/delete/:couponID',CouponManagementController.delete_coupon);

module.exports = router; 