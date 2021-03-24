const express 	= require("express");
const router 	= express.Router();

const customerQueryController = require('./Controller');

router.post('/post', customerQueryController.query_mail);

module.exports = router;