import React, { Component } 	from 'react';
import $                    	from 'jquery';
import DailyReport          	from './DailyReport.js';
import WeeklyReport         	from './WeeklyReport.js';
import MonthlyReport        	from './MonthlyReport.js';
import YearlyReport         	from './YearlyReport.js';
import CustomisedReport     	from './CustomisedReport.js';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import IAssureTable           from "../../coreadmin/IAssureTable/IAssureTable.jsx";
import moment 						from 'moment';

import "./Reports.css";
import 'font-awesome/css/font-awesome.min.css';

class Reports extends Component{ 
	constructor(props){
		super(props);
		this.state = {
			'currentTabView'    	: props.currentTabView,
			'showDateWiseFilters': props.showDateWiseFilters,
			'filterObject' 		: props && props.filterObject ? props.filterObject : {}, 	
			'tableDatas'        	: [],
			'reportData'        	: {},
			'tableData'         	: [],
			"startRange"        	: 0,
			"limitRange"        	: 10,
			"dataApiUrl"        	: props && props.dataApiUrl ? props.dataApiUrl : "",		
		  	"currentView" 			: props.currentTabView,
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
		  	"selectedWeekYear"   : '',
       	"selectedWeek"       : '',
       	"startDate"          : '',
       	"endDate"            : '',
		}
		window.scrollTo(0, 0);
	}
  
	/*===========  ===========*/
	/*=========== componentDidMount() ===========*/
  	componentDidMount(){
  		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
	    var token         = userDetails.token;
	    axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

	    this.getDateValues(this.state.currentTabView);


  		// document.getElementsByClassName('reportsDateRef').value = moment().startOf('day').format("DD/MM/YYYY");
    	
  	}

  	getDateValues(currentTabView){
  		console.log("currentTabView ===> ",currentTabView)
  		if (currentTabView === "Daily") {
	    	this.setState({ 
	    		startDate : moment().startOf('day').format("YYYY-MM-DD") 
	    	},()=>{
	    		this.getData(this.state.startRange, this.state.limitRange)
	    		console.log("startDate => ",this.state.startDate)
	    	});
	    }else if(currentTabView === "Weekly"){
	    	this.setState({
	            selectedWeekYear 	: moment().format('Y')+'-'+moment().format('w')+'W',
	            selectedWeek 		: moment().format('w'),
	            startDate   		: moment().year(moment().format('Y')).week(moment().format('W')).startOf('week').format('YYYY-MM-DD'),
	            endDate     		: moment().year(moment().format('Y')).week(moment().format('W')).endOf('week').format('YYYY-MM-DD')
	        },()=>{
	        	console.log("selectedWeekYear => ",this.state.selectedWeekYear);
	        	console.log("selectedWeek => ",this.state.selectedWeek);
	        	console.log("startDate => ",this.state.startDate);
	        	console.log("endDate => ",this.state.endDate);
	        	this.getData(this.state.startRange, this.state.limitRange)
	        })
	    }

  	}
  
  	/*=========== changeReportComponent() ===========*/
  	changeReportComponent(event){
		var currentComp = $(event.currentTarget).attr('id');

		this.setState({
	  		'currentTabView': currentComp,
		},()=>{
			console.log("currentTabView => ",this.state.currentTabView)
			this.getDateValues(this.state.currentTabView);
		})
  	}

  	/*=========== getData() ===========*/
  	getData(startRange,limitRange){
	   var formvalues = {
      	startDate : this.state.startDate,
      	endDate   : this.state.startDate
	   }

		console.log("formvalues => ",formvalues)

	    axios.post(this.state.dataApiUrl, formvalues)
	    .then((response)=>{
	      	console.log("DailyReports response---",response);
	      	var tableData = response.data.map((a, i)=>{
		        return {
		            "orderID"                    : a.orderID,
		            "cratedAt"                   : moment(a.createdAt).format("DD/MM/YYYY hh:mm a"),
		            "userFullName"               : a.userFullName,
		            "totalAmount"                : '&#x20b9;'+ a.total,
		            "deliveryStatus"             : a.status +' '+ a.deliveryStatus[0].status,
		        }
	      	})

	      	this.setState({ 
	        	tableData : tableData
	      	},()=>{ 
	        	console.log("tableData tableData",tableData);
	      	})
	    })
	    .catch((error)=>{
	        console.log("error => ",error);
	        if(error.message === "Request failed with status code 401"){
	          	var userDetails =  localStorage.removeItem("userDetails");
	          	localStorage.clear();
	          	swal({  
	              	title : "Your Session is expired.",                
	              	text  : "You need to login again. Click OK to go to Login Page"
	          	})
	            .then(okay => {
		            if (okay) {
		                window.location.href = "/login";
		            }
	            });
	        }
	    })
  	}

	/*=========== previousDate() ===========*/
	previousDate(event){
	    event.preventDefault();

	    var selectedDate1 = $(".reportsDayRef").val();

	    this.setState({
	    	startDate : moment(selectedDate1).subtract(1, "days").format("YYYY-MM-DD")
	    }, () => {
	        this.getData(this.state.startRange, this.state.limitRange);
	    }) 
	}

  	/*=========== nextDate() ===========*/
	nextDate(event){
	    event.preventDefault();

	    var selectedDate1 = $(".reportsDayRef").val();

	    this.setState({
	    	startDate : moment(selectedDate1).add(1, "days").format("YYYY-MM-DD")
	    }, () => {
	        this.getData(this.state.startRange, this.state.limitRange);
	    }) 
	}

	/*=========== getReport ===========*/
  	getReport(event){
    	event.preventDefault(); 
    	this.setState({
    		startDate : event.currentTarget.value
    	},()=>{
      		this.getData(this.state.startRange, this.state.limitRange);  
    	})    
  	}

  	previousWeek(event){
		event.preventDefault();
        console.log("event => ",event)
        var startDate = moment(this.state.startDate).subtract(1, "week").format('YYYY-MM-DD');
        console.log("startDate => ",startDate)
        this.setState({
            selectedWeekYear: moment(startDate).format('Y')+'-'+moment(startDate).format('w')+'W',
            selectedWeek    : moment(startDate).format('w'), 
            startDate       : startDate,
            endDate         : moment(startDate).add(1, "week").format('YYYY-MM-DD')
        },()=>{
            this.getData(this.state.startRange, this.state.limitRange )   
        })
	}

	nextWeek(event){
		event.preventDefault();
        
        var startDate = moment(this.state.startDate).add(1, "week").format('YYYY-MM-DD');

        this.setState({
            selectedWeekYear: moment(startDate).format('Y')+'-'+moment(startDate).format('w')+'W',
            selectedWeek    : moment(startDate).format('w'), 
            startDate       : startDate,
            endDate         : moment(startDate).add(1, "week").format('YYYY-MM-DD')
        },()=>{
            this.getData(this.state.startRange, this.state.limitRange )   
        })
    }
    
    handleChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;

        this.setState({
           [name] : event.target.value,
        });
    }

  	/*=========== render() ===========*/
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
									{this.state.showDateWiseFilters
									?
									  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
										  		<div className="sales-report-main-class">
													<div className="sales-report-commonpre">
														{this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject !== null && this.state.filterObject.dailyFilter 
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
											</div>
											{this.state.currentTabView === "Daily"   
											?
												<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
							        				<div className="sales-report-main-class">
							          					<div className="reports-select-date-boxmain">
							            					<div className="reports-select-date-boxsec">
							              						<div className="reports-select-date-Title">Daily Reports</div>
						              							<div className="input-group">
						                							<span onClick={this.previousDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
						                							<input 
						                								onChange 		= {this.getReport.bind(this)} 
						                								defaultValue 	= {this.state.startDate} 
						                								name 				= "reportsDayRef" 
						                								type 				= "date" 
						                								className 		= "reportsDateRef reportsDayRef form-control" 
						                								ref 				= "reportsDayRef"  
						                							/>						               
						                							<span onClick={this.nextDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
						              							</div>
						            						</div>
						          						</div>						            
						          					</div>
						          				</div>
						          			:
						          				this.state.currentTabView === "Weekly"   
						          			?
						          				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								                    <div className="sales-report-main-class">
								                        <div className="reports-select-date-boxmain">
								                            <div className="reports-select-date-boxsec">
								                                <div className="reports-select-date-Title">Weekly Reports</div>
								                                <div className="input-group">
								                                    <span  onClick={this.previousWeek.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
								                                    <input  
								                                    	className 			= "reportsDateRef inputweekpicker form-control" 
								                                    	aria-describedby 	= "basic-addon1" ref="inputweekpicker" placeholder = "" aria-label  = "Brand" 
								                                    	name 					= "inputweekpicker" 
								                                    	type 					= "text" 
								                                    	value 				= {this.state.selectedWeekYear}  
								                                    	onChange 			= {this.handleChange} 
								                                    />
								                                    <span onClick={this.nextWeek.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
								                                </div>
								                            </div>
								                        </div>
						                            </div>
						                        </div>
						                    :
						                    	null
						                    }

												{/*{
												  this.state.currentTabView === "Daily"   ? <DailyReport   twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} dataApiUrl={this.state.dataApiUrl} /> :
												  this.state.currentTabView === "Weekly"  ? <WeeklyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
												  this.state.currentTabView === "Monthly" ? <MonthlyReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> :  
												  this.state.currentTabView === "Yearly"  ? <YearlyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
												  this.state.currentTabView === "Customised"  ? <CustomisedReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> :
												  ""
												}*/}							
					  					</div>
					 				:
					 					null
									}
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother reportTable" >
							            <div className="row">  
							              	<IAssureTable 
							                	tableHeading 	= {this.state.tableHeading}
							                	twoLevelHeader = {this.state.twoLevelHeader} 
							                	dataCount 		= {this.state.dataCount}
							                	tableData 		= {this.state.tableData}
							                	getData 			= {this.getData.bind(this)}
							                	tableObjects 	= {this.state.tableObjects}
							                 	tableName 		= {this.state.tableName}
							              	/>
							            </div>
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