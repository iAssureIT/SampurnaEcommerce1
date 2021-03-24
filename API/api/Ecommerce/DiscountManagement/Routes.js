const express 	= require("express");
const router 	= express.Router();

const DiscountManagementController = require('./Controller');

router.post('/post', DiscountManagementController.insert_discount);

router.get('/get/list',DiscountManagementController.get_discounts);

router.get('/get/list-with-limits/:startRange/:limitRange',DiscountManagementController.get_discounts_with_limits);

router.get('/get/count',DiscountManagementController.count_discount);

router.get('/get/one/:discountID',DiscountManagementController.get_single_discount);

router.patch('/patch', DiscountManagementController.update_discount);

router.delete('/delete/:discountID',DiscountManagementController.delete_discount);

module.exports = router; 