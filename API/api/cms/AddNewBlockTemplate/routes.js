const express = require('express');
const router  = express.Router();

const blocktemplateMasterController = require("./controllers.js");

router.post("/post", 		                    blocktemplateMasterController.insertBlockTemplate);
router.get("/get/list", 	 	 	            blocktemplateMasterController.getBlockTemplateList);
router.get("/get/searchlist/:searchTxt",	    blocktemplateMasterController.getSearchList);
router.get("/get/:blockTemp_id",          	blocktemplateMasterController.getBlockTemplate);
router.get("/getcompname/:compName",          	    blocktemplateMasterController.getBlockTemplateByName);
router.put("/update/",                        blocktemplateMasterController.updateBlockTemplate); 	 		            
router.delete("/del/:blockTemp_id",  	 		blocktemplateMasterController.delBlockTemplate);
router.get("/blocktemplatebyblocktype/get/:blockType",      blocktemplateMasterController.getBlockTemplateByBlockType);

module.exports = router;