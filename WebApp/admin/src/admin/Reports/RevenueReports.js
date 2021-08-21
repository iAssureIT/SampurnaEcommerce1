import React, { Component } 	from 'react';
import $                    	from 'jquery';
import ReportsTemplate     	from './ReportsTemplate.js';
import "./Reports.css";
import 'font-awesome/css/font-awesome.min.css';

class SalesReports extends Component{ 
	constructor(props){
		super(props);
		this.state = {
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
														'inputArray' 			: [{ name : 'status',value: 'chocolate', label: 'Chocolate' },
											  { name : 'status', value: 'strawberry', label: 'Strawberry' },
											  { name : 'status', value: 'vanilla', label: 'Vanilla' }],
														'apiUrl' 				: "/api/"
													},
													{
														'inputLabel' 			: "Vendor", 			
														'inputType' 			: "select",
														'inputDefaultValue' 	: "--Select--",
														'inputPlaceholder' 	: "",
														'inputName' 			: "vendor",
														'inputArray' 			: [{ name : 'vendor', value: 'chocolate', label: 'Chocolate' },
											  { name : 'vendor', value: 'strawberry', label: 'Strawberry' },
											  { name : 'vendor', value: 'vanilla', label: 'Vanilla' }],
														'apiUrl' 				: "/api/"
													}
			],
			'currentActiveTab' 		: "Daily", //If showDateWiseFilters is true then set cuttentActiveTab 'Daily' or 'Weekly' or 'Monthly' or 'Yearly' or 'Customize' or leave it ""
			'reportTitle' 				: "Revenue Reports", // Title or Heading of report
			'tableDatas'        		: [],
			'reportData'        		: {},
			'tableData'         		: [],
			"startRange"        		: 0,
			"limitRange"        		: 10,
			"dataApiUrl"        		: "/api/orders/reports/revenue",			
			"tableHeading"      		: {
													orderID    				: 'Order ID',
													orderDate         	: 'Order Date', 
													vendorName    			: 'vendor Name',
													orderAmount       	: 'Order Amount',
													commissionPercentage : 'Commission Percentage',
													commissionAmount 		: 'Commission Amount',
													deliveryCharges 		: 'Delivery Charges',
													totalAmount 			: 'Total Amount'
			},
      	tableObjects      		: {
							        paginationApply 	: true,
							        searchApply     	: true,
							        excelReportExport 	: true
      	},
		}
		window.scrollTo(0, 0);
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

export default SalesReports