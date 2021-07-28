import React, { Component } from 'react';
import $                    from 'jquery';
import DailyReport          from './DailyReport.js';
import WeeklyReport         from './WeeklyReport.js';
import MonthlyReport        from './MonthlyReport.js';
import YearlyReport         from './YearlyReport.js';
import CustomisedReport     from './CustomisedReport.js';
import "./Reports.css";
import 'font-awesome/css/font-awesome.min.css';

class Reports extends Component{ 
	constructor(props){
		super(props);
		this.state = {
			'currentTabView'    	: props.currentTabView,
			'showDateWiseFilters' 	: props.showDateWiseFilters,
			'filterObject' 			: props && props.filterObject ? props.filterObject : {}, 	
			'tableDatas'        	: [],
			'reportData'        	: {},
			'tableData'         	: [],
			"startRange"        	: 0,
			"limitRange"        	: 10,
			"dataApiUrl"        	: props && props.dataApiUrl ? props.dataApiUrl : "",		
		  	"currentView" 			: props.currentView,
		  	"dataCount"				: props && props.dataCount ? props.dataCount : [],
		  	"tableData"				: props && props.tableData ? props.tableData : [],
		  	"tableName"				: props && props.tableName ? props.tableName : [],
		  	"tableHeading"			: props && props.tableHeading ? props.tableHeading : {},
		  	"twoLevelHeader"		: props && props.twoLevelHeader ? props.twoLevelHeader : {},
		  	"tableObjects"			: props && props.tableObjects ? props.tableObjects : {},
		  	"deleteMethod"			: props && props.deleteMethod ? props.deleteMethod : {},	  
		  	"startRange"			: 0,
		  	"limitRange"			: 10,
		  	"normalData"			: true,
		  	"printhideArray"		: [],
		}
		window.scrollTo(0, 0);
	}
  

  	componentDidMount(){
  		console.log("****",this.props)
  		this.setState({
  		  			'filterObject' 		: this.props && this.props.filterObject ? this.props.filterObject : {}, 	
  		  		})
  	}
  
  	changeReportComponent(event){
		var currentComp = $(event.currentTarget).attr('id');

		this.setState({
	  		'currentTabView': currentComp,
		})
  	}

  	render(){
		return( 
		  	// <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12 NOPadding">
				<div className="row">
			  		<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			  		<div className="formWrapper">
						{/*<section className="content">*/}
				  			<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
								<div className="row">
					  <div className="">
						<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
						  <h4 className="weighttitle NOpadding-right">Reports</h4>
						</div>
					  
						  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
							{this.stateshowDateWiseFilters
								?
							  <div className="sales-report-main-class">
								<div className="sales-report-commonpre">
								{this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject.dailyFilter 
									?
									  	<div onClick={this.changeReportComponent.bind(this)} id="Daily" className={this.state.currentTabView === "Daily" ? "sales-report-common sales-report-today report-currentlyActive" : "sales-report-common sales-report-today"}>
											Daily 
									  	</div>
									:
										null
								}
								{ this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject.weeklyFilter 
									?
										<div onClick={this.changeReportComponent.bind(this)} id="Weekly"  className={this.state.currentTabView === "Weekly" ? "sales-report-common sales-report-thisweek report-currentlyActive" : "sales-report-common sales-report-thisweek"}>
											Weekly
									 	</div>
									:
										null
								}
								{ this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject.monthlyFilter 
									?  
										<div onClick={this.changeReportComponent.bind(this)} id="Monthly"  className={this.state.currentTabView === "Monthly" ? "sales-report-common sales-report-thismonth report-currentlyActive" : "sales-report-common sales-report-thismonth"}>
											Monthly
										</div>
									:
										null
								}
								{ this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject.yearlyFilter 
									?  
										<div onClick={this.changeReportComponent.bind(this)} id="Yearly"  className={this.state.currentTabView === "Yearly" ? "sales-report-common sales-report-thisyear report-currentlyActive" : "sales-report-common sales-report-thisyear"}>
											Yearly
										</div>
									:
										null
								}
								{ this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject.customizedDateFilter 
									? 
									  	<div onClick={this.changeReportComponent.bind(this)} id="Customised"  className={this.state.currentTabView === "Customised" ? "sales-report-common sales-report-costomised report-currentlyActive" : "sales-report-common sales-report-costomised"}>
	  										Customised Dates
	  								  	</div>
  								  	:
										null
  								}	
								</div>
							  </div>
							 :
							 	null
							 }
							</div>
							
							{
							  this.state.currentTabView === "Daily"   ? <DailyReport   twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} dataApiUrl={this.state.dataApiUrl} /> :
							  this.state.currentTabView === "Weekly"  ? <WeeklyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
							  this.state.currentTabView === "Monthly" ? <MonthlyReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> :  
							  this.state.currentTabView === "Yearly"  ? <YearlyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
							  <CustomisedReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} />  
							}
							
						  </div>
						</div>
					</div>
				  </div>
				{/*</section>*/}
				</div>
			  </div>
			</div>
		  // </div>        
		);
	  }
}

export default Reports