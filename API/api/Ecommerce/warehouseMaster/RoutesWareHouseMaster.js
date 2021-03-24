const express 	= require("express");
const router 	= express.Router();

const wareHouseMaster = require('./ControllerWareHouseMaster.js');

router.post('/post', wareHouseMaster.insertWarehouse);

router.post('/get/list', wareHouseMaster.fetchWareHouseMaster);

router.get('/get/count', wareHouseMaster.countWarehouseMaster);

router.get('/get/one/:fieldID', wareHouseMaster.fetchSingleWareHouseMaster);

router.get('/search/:str', wareHouseMaster.searchWareHouseMaster);

router.patch('/patch', wareHouseMaster.updateWareHouseMaster);

router.delete('/delete/:fieldID', wareHouseMaster.deleteWarehouseMaster);

module.exports = router;