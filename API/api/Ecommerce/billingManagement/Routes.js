const express 	= require("express");
const router 	= express.Router();

const billController = require('./Controller');

//get product list by category
router.get('/get/listbycategory/:categoryID/:franchiseId',billController.list_products_by_category);

//get product list by section
router.get('/get/list/:sectionID/:franchiseId',billController.list_product_by_section);

//generate bill number
router.get('/get/generateBillNumber/:companyId', billController.generate_bill_number);

//product list by franchise
router.get('/get/list/:franchiseId',billController.list_product);

//get franchise details
router.get('/getCompany/:companyID',billController.getCompany);

//list bills
router.get('/get/billnumberlist/:franchise_id',billController.getListBill);

//return products in order
router.get('/get/OrderwiseReturnedProducts/:orderID',billController.returned_products);

//return products
router.patch('/returnProducts',billController.save_returned_products);

//add customer
router.post('/saveCustomer',billController.save_customer);

//get customers list
router.get('/get/customers/:franchise_id',billController.get_customers);

router.get('/get/customersCount/:franchise_id',billController.customers_count);

router.get('/get/count/contactPersons/:franchise_id',billController.contact_persons_count);


module.exports = router;