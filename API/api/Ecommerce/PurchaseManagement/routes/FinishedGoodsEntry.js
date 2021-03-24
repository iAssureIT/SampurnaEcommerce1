const express 	= require("express");
const router 	= express.Router();

const FinishedGoodsEntryController = require('../controllers/FinishedGoodsEntry');

router.post('/post', FinishedGoodsEntryController.insert_FinishedGoodsEntry);

router.post('/post/list',FinishedGoodsEntryController.list_FinishedGoodsEntry);

router.get('/get/one/:fetchId'       , FinishedGoodsEntryController.fetch_one);

router.patch('/update/:purchaseID'    , FinishedGoodsEntryController.update_FinishedGoodsEntry);

router.delete('/delete/:purchaseID',FinishedGoodsEntryController.delete_FinishedGoodsEntry);

router.get('/get/TotalOutward/:itemcode'       , FinishedGoodsEntryController.get_total_outward);

router.get('/get/ProductList',FinishedGoodsEntryController.list_Products);


/* Bulk upload code by madhuri */
router.post('/finishedGoodsBulkUpload' ,FinishedGoodsEntryController.finished_goods_bulk_upload);

router.get('/get/filedetails/:fileName' ,FinishedGoodsEntryController.filedetails);

router.post('/post/getReportOfFinishedGoods',FinishedGoodsEntryController.get_finished_goods_report);

router.post('/post/getProductCurrentStockReport',FinishedGoodsEntryController.get_product_current_stock_report);
/* Bulk upload code end */

router.get('/get/totalFinishBalance' ,FinishedGoodsEntryController.get_total_finish_balance);



/*
router.get('/get/list/:section_ID',PurchaseEntryController.list_category);

router.get('/get/count',PurchaseEntryController.count_category);

router.post('/get/list',PurchaseEntryController.list_category_with_limits);

router.get('/get/one/:categoryID', PurchaseEntryController.fetch_category);

router.get('/get/:sectionID', PurchaseEntryController.fetch_categories_by_section);

router.post('/searchCategory', PurchaseEntryController.searchCategory);

router.post('/searchCategoryCount', PurchaseEntryController.searchCategoryCount);
*/



 


module.exports = router;