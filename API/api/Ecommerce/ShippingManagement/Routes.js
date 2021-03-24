const express 	= require("express");
const router 	= express.Router();

const shippingController = require('./Controller');

router.post('/post', shippingController.insert_shipping);

router.get('/get/list',shippingController.get_Shipping);

router.get('/get/list-with-limits/:startRange/:limitRange',shippingController.get_Shipping_with_limits);

router.get('/get/count',shippingController.count_section);

router.get('/get/one/:shippingID',shippingController.get_single_Shipping);

router.get('/get/get_megamenu_list',shippingController.get_megamenu_list);

router.patch('/patch', shippingController.update_shipping);

router.delete('/delete/:shippingID',shippingController.delete_shipping);

module.exports = router; 