const express 		= require("express");
const router 		= express.Router();
const checkAuth 	= require('../../coreAdmin/middlerware/check-auth.js');

const cartController = require('./Controller');

router.post('/post', 								 cartController.insert_cartid);

// router.post('/paymentgatewaypinepg/post', cartController.paymentgatewaypinepg);

router.get('/get/list/:user_ID', 				checkAuth, cartController.list_cart);

router.get('/get/cartproductlist/:user_ID', 	 cartController.list_cart_product);

router.get('/get/list', 							checkAuth, cartController.all_list_cart);

router.get('/get/one/:user_ID', 					checkAuth, cartController.user_cart);

router.get('/get/count/:user_ID', 				checkAuth, cartController.count_cart);

router.patch('/remove', 							checkAuth, cartController.remove_cart_items);

router.patch('/quantity', 							checkAuth, cartController.change_cart_item_quantity);

router.patch('/address', 							checkAuth, cartController.add_address_to_cart);

router.patch('/payment', 							checkAuth, cartController.add_paymentmethod_to_cart);

//route for remove product from cart if that product get unpublish
router.patch('/removeproductfromcart', 		checkAuth, cartController.remove_product_from_cart);

//code by madhuri ghute

router.patch('/updateCart', 						checkAuth, cartController.update_cart_item);


module.exports = router;