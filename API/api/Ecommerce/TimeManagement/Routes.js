const express 	= require("express");
const router 	= express.Router();

const TimeController = require('./Controller');

router.post('/post', TimeController.insert_Time);

router.get('/get/list',TimeController.get_Time);

router.get('/get/list-with-limits/:startRange/:limitRange',TimeController.get_Time_with_limits);

router.get('/get/count',TimeController.count_section);

router.get('/get/one/:TimeID',TimeController.get_single_Time);

router.get('/get/get_megamenu_list',TimeController.get_megamenu_list);

router.patch('/patch', TimeController.update_Time);

router.delete('/delete/:TimeID',TimeController.delete_Time);

module.exports = router; 