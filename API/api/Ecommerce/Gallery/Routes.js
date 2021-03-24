const express 	= require("express");
const router 	= express.Router();

const galleryController = require('../Gallery/Controller');

router.post('/post',galleryController.insert_image);

router.get('/get',galleryController.fetch_gallery);

router.patch('/remove/:imageId',galleryController.delete_image);


module.exports = router;