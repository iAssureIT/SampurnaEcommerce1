const express 	= require("express");
const router 	= express.Router();

const adminPOController = require('./Controller');

router.post('/post', adminPOController.insert_adminPO);

router.get('/get/one/purchaseorder/:purchaseorder_id',adminPOController.one_adminPO);

router.patch('/patch/purchaseorder',adminPOController.update_adminPO);

router.delete('/delete/purchaseorder/:purchaseorder_id',adminPOController.delete_adminPO);


module.exports = router;