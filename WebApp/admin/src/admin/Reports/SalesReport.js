import React, { Component } from 'react';
import $                    from 'jquery';
import ReportsTemplate     	from './ReportsTemplate.js';
import "./Reports.css";
import 'font-awesome/css/font-awesome.min.css';

class SalesReports extends Component{ 
	constructor(props){
		super(props);
		this.state = {
			showDateWiseFilters 	: true,
			filterObject         	: {
										'dailyFilter' 			: false,
										'weeklyFilter' 			: false,
										'monthlyFilter' 		: false,
										'yearlyFilter' 			: false,
										'customizedDateFilter' 	: false
			},
			'currentTabView' 		: "Daily",
			'tableDatas'        	: [],
			'reportData'        	: {},
			'tableData'         	: [],
			"startRange"        	: 0,
			"limitRange"        	: 10,
			"dataApiUrl"        	: "/api/orders/reports/sales",			
			"tableHeading"      	: {
										templateType    	: 'Template Type',
										templateName    	: 'Template Name',
										subject         	: 'Subject', 
										contents        	: 'Content',
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
			  		tableHeading 		= {this.state.tableHeading} 
			  		tableObjects 		= {this.state.tableObjects} 
			  		showDateWiseFilters = {this.state.showDateWiseFilters}
			  		currentTabView 		= {this.state.currentTabView}
			  		filterObject 		= {this.state.filterObject}
			  	/>  
		  	// </div>
		);
  	}
}

export default SalesReports