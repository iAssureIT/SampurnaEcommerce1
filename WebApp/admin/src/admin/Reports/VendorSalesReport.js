import React, { Component } 	from 'react';
import $                    	from 'jquery';
import ReportsTemplate     	from './ReportsTemplate.js';
import axios                  from 'axios';
import "./Reports.css";
import 'font-awesome/css/font-awesome.min.css';

class VendorSalesReport extends Component{ 
	constructor(props){
		super(props);
		this.state = {
			vendorArray 					: [],
			showDateWiseFilters 			: true, // to show DateWise filters set true else set false
			filterObject         		: {
													'dailyFilter' 				: true, // to show Daily Filter set true else set false
													'weeklyFilter' 			: true, // to show Weekly Filter set true else set false
													'monthlyFilter' 			: true, // to show Monthly Filter set true else set false
													'yearlyFilter' 			: true, // to show Yearly Filter set true else set false
													'customizedDateFilter' 	: true // to show Customized Date Filter set true else set false
			},
			showCustomizedFilters 		: true, // to add other customized filters set true else set false
			
			customizedFiltersArray  	: [
														//Array to add different customized filters
													// {
													// 	'inputLabel' 			: "Status", 			
													// 	'inputType' 			: "select",
													// 	'inputDefaultValue' 	: "--Select--",
													// 	'inputPlaceholder' 	: "",
													// 	'inputName' 			: "status",
													// 	'inputArray' 			: [
													// 										{ name : 'status', value: 'New', label: 'New' },
													// 								  		{ name : 'status', value: 'Processing', label: 'Processing' },
													// 								  		{ name : 'status', value: 'Ready to Dispatch', label: 'Ready to Dispatch' },
													// 								  		{ name : 'status', value: 'On The Way', label: 'On The way' },
													// 								  		{ name : 'status', value: 'Delivered', label: 'Delivered' },
													// 								  		{ name : 'status', value: 'Cancelled', label: 'Cancelled' }
													// 								  ],
													// 	'apiUrl' 				: "/api/"
													// }
													{
														'inputLabel' 			: "Vendor", 			
														'inputType' 			: "select",
														'inputDefaultValue' 	: "--Select--",
														'inputPlaceholder' 	: "",
														'inputName' 			: "vendor",
														'inputArray' 			: [],
														'apiUrl' 				: "/api/"
													},
													{
														'inputLabel' 			: "Section", 			
														'inputType' 			: "select",
														'inputDefaultValue' 	: "--Select--",
														'inputPlaceholder' 	: "",
														'inputName' 			: "section",
														'inputArray' 			: [],
														'apiUrl' 				: "/api/",
														'onChangeMethod' 		: "this.props.getCategories(this.state[name].value)"
													},
													{
														'inputLabel' 			: "Category", 			
														'inputType' 			: "select",
														'inputDefaultValue' 	: "--Select--",
														'inputPlaceholder' 	: "",
														'inputName' 			: "category",
														'inputArray' 			: [],
														'apiUrl' 				: "/api/",
														
													},
													{
														'inputLabel' 			: "SubCategory", 			
														'inputType' 			: "select",
														'inputDefaultValue' 	: "--Select--",
														'inputPlaceholder' 	: "",
														'inputName' 			: "subCategory",
														'inputArray' 			: [],
														'apiUrl' 				: "/api/"
													}
													
			],
			'currentActiveTab' 		: "Daily", //If showDateWiseFilters is true then set cuttentActiveTab 'Daily' or 'Weekly' or 'Monthly' or 'Yearly' or 'Customize' or leave it ""
			'reportTitle' 				: "Vendor Sales Reports", // Title or Heading of report
			'tableName' 				: "Vendor_Sales_Reports", // Title or Heading of report
			'tableDatas'        		: [],
			'reportData'        		: {},
			'tableData'         		: [],
			"startRange"        		: 0,
			"limitRange"        		: 10,
			"dataApiUrl"        		: "/api/orders/reports/vendor_sales",			
			"tableHeading"      		: {
													productName         	: 'Product Name', 
													vendorName    			: 'Vendor Name',
													section    				: 'Section',
													category    			: 'Category',
													subCategory    		: 'SubCategory',
													orderDate       		: 'Order Date',
													numberOfOrders 		: 'Number of Orders',
													productQuantity 		: 'Product Quantity',
													totalAmount 			: 'Total Amount'
			},
      	tableObjects      		: {
							        paginationApply 			: true,
							        searchApply     			: true,
							        excelReportExport 			: false,
							        searchApplyPlaceholder 	: "Search by vendor name, section,category,subcategory etc ..",
      	},
		}
		window.scrollTo(0, 0);
  	}
  	componentDidMount() {
      
      axios.get("/api/entitymaster/get/filter/vendor")
      .then(response =>{
      	console.log("vendors => ",response.data)      	
      	if (response.data && response.data.length > 0) {
      		var vendorArray = [];
      		for (var i = 0; i < response.data.length; i++) {
      			vendorArray.push({
      				name 	: "vendor",
      				label : response.data[i].companyName,
      				value : response.data[i]._id
      			})
      		}
      		if (i >= response.data.length) {
      			var customizedFiltersArray = this.state.customizedFiltersArray;
      			customizedFiltersArray[0].inputArray = vendorArray;
      			this.setState({
      				customizedFiltersArray : customizedFiltersArray
      			},()=>{
      				console.log("customizedFiltersArray => ",this.state.customizedFiltersArray)
      			})
      		}
      	}else{
      		this.setState({
      			vendorArray : []
      		})
      	}
      })
     	.catch(error=>{
       	console.log("Error => ", error);
     	})

     	axios.get("/api/sections/get/filter/sections")
      .then(response =>{
      	console.log("sections => ",response.data)      	
      	if (response.data && response.data.length > 0) {
      		var sectionArray = [];
      		for (var i = 0; i < response.data.length; i++) {
      			sectionArray.push({
      				name : "section",
      				label : response.data[i].section,
      				value : response.data[i]._id
      			})
      		}
      		if (i >= response.data.length) {
      			var customizedFiltersArray = this.state.customizedFiltersArray;
      			customizedFiltersArray[1].inputArray = sectionArray;
      			this.setState({
      				customizedFiltersArray : customizedFiltersArray
      			},()=>{
      				console.log("customizedFiltersArray => ",this.state.customizedFiltersArray)
      			})
      		}
      	}else{
      		this.setState({
      			sectionArray : []
      		})
      	}
      })
     	.catch(error=>{
       	console.log("Error => ", error);
     	})         
   }

   getCategories(section_id){
   	console.log("iiiiiiiiii => ",section_id)
   	axios.get("/api/category/get/filter/categories/"+section_id)
      .then(response =>{
      	console.log("categories => ",response.data)      	
      	if (response.data && response.data.length > 0) {
      		var categoryArray = [];
      		for (var i = 0; i < response.data.length; i++) {
      			categoryArray.push({
      				name : "category",
      				label : response.data[i].category,
      				value : response.data[i]._id
      			})
      		}
      		if (i >= response.data.length) {
      			var customizedFiltersArray = this.state.customizedFiltersArray;
      			customizedFiltersArray[2].inputArray = categoryArray;
      			this.setState({
      				categories 				 	: response.data,
      				customizedFiltersArray 	: customizedFiltersArray
      			},()=>{
      				console.log("customizedFiltersArray => ",this.state.customizedFiltersArray)
      			})
      		}
      	}else{
      		this.setState({
      			categoryArray : []
      		})
      	}
      })
     	.catch(error=>{
       	console.log("Error => ", error);
     	}) 
   }

   getSubCategories(category_id){
   	console.log("category_id => ",category_id)
   	
      	if (this.state.categories && this.state.categories.length > 0) {
	      	var subCategoryArray = [];
	      	var selectedcategory = this.state.categories.filter(category => String(category._id) === String(category_id))
	      	if (selectedcategory && selectedcategory.length > 0 && selectedcategory[0].subCategory && selectedcategory[0].subCategory.length > 0) {
	      		var subCategories = selectedcategory[0].subCategory;
	      		for (var i = 0; i < subCategories.length; i++) {
	      			subCategoryArray.push({
	      				name : "subCategory",
	      				label : subCategories[i].subCategoryTitle,
	      				value : subCategories[i]._id
	      			})
	      		}
	      		if (i >= subCategories.length) {
	      			var customizedFiltersArray = this.state.customizedFiltersArray;
	      			customizedFiltersArray[3].inputArray = subCategoryArray;
	      			this.setState({
	      				customizedFiltersArray 	: customizedFiltersArray
	      			},()=>{
	      				console.log("customizedFiltersArray => ",this.state.customizedFiltersArray)
	      			})
	      		}
	      	}else{

	      	}
      	}else{
      		this.setState({
      			subCategoryArray : []
      		})
      	}
      
   }


	render(){
		return(  
		  	// <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">			
			  	<ReportsTemplate 
			  		tableHeading 				= {this.state.tableHeading} 
			  		tableObjects 				= {this.state.tableObjects} 
			  		showDateWiseFilters 		= {this.state.showDateWiseFilters}
			  		filterObject 				= {this.state.filterObject}
			  		showCustomizedFilters 	= {this.state.showCustomizedFilters}
			  		customizedFiltersArray 	= {this.state.customizedFiltersArray}
			  		currentActiveTab 			= {this.state.currentActiveTab}
			  		reportTitle 				= {this.state.reportTitle}
			  		dataApiUrl 					= {this.state.dataApiUrl}
			  		getCategories 				= {this.getCategories.bind(this)}
			  		getSubCategories 			= {this.getSubCategories.bind(this)}
			  		dataApiUrl 					= {this.state.dataApiUrl}
			  	/>  
		  	// </div>
		);
  	}
}

export default VendorSalesReport