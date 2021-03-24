const express 	= require("express");
const router 	= express.Router();

const orderController = require('./Controller');

router.post('/post', orderController.insert_orders);

router.post('/pgcall/post', orderController.paymentgatewaycall);

router.patch('/', orderController.update_order);

router.patch('/paymentorder/:order_ID', orderController.update_order_payment);

router.patch('/patch/updateDeliveryStatus', orderController.updateDeliveryStatus);

router.patch('/patch/changeToPreviousStatus', orderController.changeToPreviousStatus);

router.get('/get/list',orderController.list_order);

router.get('/get/franchisewise/list/:franchiseID',orderController.list_franchise_order);

router.post('/get/vendorwiselist/:vendorID',orderController.vendor_order_list);

router.get('/get/orderlist/:status',orderController.list_orderby_status);

router.get('/get/orderlist/:status/:franchiseID',orderController.list_orderby_status_franchisewise);

router.post('/get/vendororderstatuslist/:vendorID',orderController.vendor_orderlistby_status);

router.get('/get/count',orderController.count_order);

router.get('/get/vendorwisecount/:vendorID',orderController.vendor_order_count);

router.get('/get/list/:userID',orderController.list_order_by_user);

router.post('/get/list',orderController.list_order_with_limits);

router.get('/get/one/:orderID', orderController.fetch_order);

router.delete('/delete/:orderID',orderController.delete_order);

router.patch('/patch/dispatchOrder',orderController.dispatchOrder);

router.get('/get/listbyba/:ba_ID',orderController.list_order_by_ba);

router.patch('/get/cancelOrder',orderController.cancelOrder);
 
router.patch('/get/returnOrder',orderController.returnOrder);

router.post('/get/report-count',orderController.get_reports_count);

router.post('/get/report/:startRange/:limitRange',orderController.get_reports);

router.post('/get/report/:franchiseID/:startRange/:limitRange',orderController.get_reports_franchise);

router.post('/get/category-wise-report-count',orderController.get_category_reports_count);

router.post('/get/category-wise-report/:startRange/:limitRange',orderController.get_category_reports);

router.get('/get/ytdorders',orderController.ytdorders);

router.get('/get/mtdorders',orderController.mtdorders);

router.get('/get/mtdorders',orderController.mtdorders);

router.get('/get/neworderscount',orderController.neworderscount);

router.get('/get/totalOrdersByPeriod/:startTime',orderController.totalOrdersByPeriod);

router.get('/get/totalOrdersByState',orderController.totalOrdersByState);

router.get('/get/sectionRevenue',orderController.sectionRevenue);

router.get('/get/categoryRevenue',orderController.categoryRevenue);

router.get('/get/subCategoryRevenue',orderController.subCategoryRevenue);

router.get('/get/vendorWiseOrder',orderController.subCategoryRevenue);

router.post('/get/get_orders',orderController.get_orders_with_filters);

//code by madhuri ghute start

router.post('/get/getBillsByUser/',orderController.list_bill_by_user);

router.patch('/patch/allocateOrderToFranchise', orderController.allocateOrderToFranchise);

router.get('/get/franchisewisecount',orderController.franchise_order_count);

router.get('/get/topFranchiseSale',orderController.top_franchise_sale);

router.get('/get/franchiseCategoryRevenue/:franchiseID',orderController.franchiseCategoryRevenue);

router.get('/get/franchiseSectionRevenue/:franchiseID',orderController.franchiseSectionRevenue);

router.post('/get/getMonthwiseOrders',orderController.getMonthwiseOrders);

router.get('/get/franchiseTopProductsSale/:franchiseID/:startDate/:endDate',orderController.franchiseTopProductsSale);

router.get('/get/digitalytdorders/:franchiseID',orderController.franchise_digital_order_counts);

router.get('/get/totalSale/',orderController.total_sale_cost);

router.get('/get/franchise-daily-orders-count/:franchiseID/:startDate/:endDate',orderController.franchise_daily_orders_count);

router.get('/get/inStoreBillCounts/:franchiseID',orderController.franchise_bill_counts);

router.delete('/get/deleteAllOrders',orderController.deleteAllOrders);

//code by madhuri ghute end

module.exports = router; 