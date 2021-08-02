import React, { Component } from 'react';
import $                    from 'jquery';
import ReportsTemplate     	from './ReportTemplate1.js';
import "./Reports.css";
import 'font-awesome/css/font-awesome.min.css';

class SalesReports extends Component{ 
	constructor(props){
		super(props);
		this.state = {
			showDateWiseFilters 			: true,
			filterObject         			: {
												'dailyFilter' 			: true,
												'weeklyFilter' 			: true,
												'monthlyFilter' 		: true,
												'yearlyFilter' 			: true,
												'customizedDateFilter' 	: true
			},
			showCustomizedFilters 		: true,
			customizedFiltersArray  	: [{
												'inputLabel' 			: "Status",
												'inputType' 			: "select",
												'inputDefaultValue' 	: "--Select--",
												'inputPlaceholder' 		: "",
												'inputName' 			: "status"
			}],
			'currentActiveTab' 		: "Daily",
			'reportTitle' 			: "Sales Report",
			'tableDatas'        	: [],
			'reportData'        	: {},
			'tableData'         	: [],
			"startRange"        	: 0,
			"limitRange"        	: 10,
			"dataApiUrl"        	: "/api/orders/reports/sales",			
			"tableHeading"      	: {
										orderID    			: 'Order ID',
										customerName    	: 'Customer Name',
										orderDate         	: 'Order Date', 
										orderAmount        	: 'Order Amount',
			},
	      	tableObjects      		: {
								        paginationApply : false,
								        searchApply     : false,
	      	},
		}
		window.scrollTo(0, 0);
  	}
  	
	render(){
		return(  
		  	// <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">			
			  	<ReportsTemplate 
			  		tableHeading 			= {this.state.tableHeading} 
			  		tableObjects 			= {this.state.tableObjects} 
			  		showDateWiseFilters 	= {this.state.showDateWiseFilters}
			  		filterObject 			= {this.state.filterObject}
			  		showCustomizedFilters 	= {this.state.showCustomizedFilters}
			  		customizedFiltersArray 	= {this.state.customizedFiltersArray}
			  		currentActiveTab 		= {this.state.currentActiveTab}
			  		reportTitle 			= {this.state.reportTitle}
			  		dataApiUrl 				= {this.state.dataApiUrl}
			  	/>  
		  	// </div>
		);
  	}
}

export default SalesReports