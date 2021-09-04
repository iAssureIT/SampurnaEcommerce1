import React, { Component } 	from 'react';
import $                    	from 'jquery';
import ReportsTemplate     	from './ReportsTemplate.js';
import axios                  from 'axios';
import "./Reports.css";
import 'font-awesome/css/font-awesome.min.css';

class DeliveryDriversReport extends Component{ 
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
													{
														'inputLabel' 			: "Status", 			
														'inputType' 			: "select",
														'inputDefaultValue' 	: "--Select--",
														'inputPlaceholder' 	: "",
														'inputName' 			: "status",
														'inputArray' 			: [
																							{ name : 'status', value: 'New', label: 'New' },
																					  		{ name : 'status', value: 'Processing', label: 'Processing' },
																					  		{ name : 'status', value: 'Ready to Dispatch', label: 'Ready to Dispatch' },
																					  		{ name : 'status', value: 'On The Way', label: 'On The way' },
																					  		{ name : 'status', value: 'Delivered', label: 'Delivered' },
																					  		{ name : 'status', value: 'Cancelled', label: 'Cancelled' }
																					  ],
														'apiUrl' 				: "/api/"
													}
													
			],
			'currentActiveTab' 		: "Daily", //If showDateWiseFilters is true then set cuttentActiveTab 'Daily' or 'Weekly' or 'Monthly' or 'Yearly' or 'Customize' or leave it ""
			'reportTitle' 				: "Delivery Driver Reports", // Title or Heading of report
			'tableName' 				: "Delivery_Driver_Reports", // Title or Heading of report
			'tableDatas'        		: [],
			'reportData'        		: {},
			'tableData'         		: [],
			"startRange"        		: 0,
			"limitRange"        		: 10,
			"dataApiUrl"        		: "/api/orders/reports/delivery_drivers",			
			"tableHeading"      		: {
													driverID    				: 'Driver ID',
													driverName    				: 'Driver Name',
													orderID    					: 'Order ID',
													orderDate         		: 'Order Date', 
													vendorName    				: 'Vendor Name',
													customerName    			: 'Customer Name',
													pickupDateAndTime    	: 'Pickup Date And Time',
													deliveryDateAndTime  	: 'Delivery Date And Time',
													timeRequiredForDelivery : 'Time Required For Delivery',
													paymentMethod 				: 'Payment Method',
													cashCollected 				: 'Cash Collected',
													totalAmount 				: 'Total Amount'
			},
      	tableObjects      		: {
							        paginationApply 			: true,
							        searchApply     			: true,
							        excelReportExport 			: false,
							        searchApplyPlaceholder 	: "Search by vendor name, driver name, customer name, order ID..",
      	},
		}
		window.scrollTo(0, 0);
  	}
  	componentDidMount() {
      
      axios.get("/api/entitymaster/get/vendor")
      .then(response =>{
      	console.log("vendors => ",response.data)      	
      	if (response.data && response.data.length > 0) {
      		var vendorArray = [];
      		for (var i = 0; i < response.data.length; i++) {
      			vendorArray.push({
      				name : "vendor",
      				label : response.data[i].companyName,
      				value : response.data[i]._id
      			})
      		}
      		if (i >= response.data.length) {
      			var customizedFiltersArray = this.state.customizedFiltersArray;
      			customizedFiltersArray.push({
														'inputLabel' 			: "Vendor", 			
														'inputType' 			: "select",
														'inputDefaultValue' 	: "--Select--",
														'inputPlaceholder' 	: "",
														'inputName' 			: "vendor",
														'inputArray' 			: vendorArray,
														'apiUrl' 				: "/api/"
													})
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
			  	/>  
		  	// </div>
		);
  	}
}

export default DeliveryDriversReport