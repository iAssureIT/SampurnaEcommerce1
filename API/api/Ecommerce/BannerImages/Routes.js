const express 	= require("express");
const router 	= express.Router();

const BannerImagesController = require('../BannerImages/Controller.js');

router.post('/post',BannerImagesController.insert_image);

router.get('/get',BannerImagesController.fetch_bannerimgs);

router.patch('/remove/:imageId',BannerImagesController.delete_image);


module.exports = router;