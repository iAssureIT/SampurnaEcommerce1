import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import moment                   from 'moment';
import _                        from 'underscore';
import IAssureTable             from "./ReportsTable.js";
import Select 							from 'react-select';
import 'bootstrap/js/tab.js';


class UserReport extends Component {	  
	constructor(props) {
		super(props);
		this.state = {
			'currentActiveTab'    	: props.currentActiveTab,
			'reportTitle' 				: props.reportTitle,
			'showDateWiseFilters' 	: props.showDateWiseFilters,
			'filterObject' 			: props && props.filterObject ? props.filterObject : {}, 	
			'showCustomizedFilters' : props.showCustomizedFilters,
			'customizedFiltersArray': props && props.customizedFiltersArray && props.customizedFiltersArray.length > 0 ? props.customizedFiltersArray : [], 	
			"dataApiUrl"        		: props && props.dataApiUrl ? props.dataApiUrl : "",		
			"tableName"					: props && props.tableName ? props.tableName : "",
			"tableHeading"				: props && props.tableHeading ? props.tableHeading : {},
			"tableObjects"				: props && props.tableObjects ? props.tableObjects : {},
			RecordsTable 				: [],
			"startRange"        		: 0,
			"limitRange"        		: 10,
			"dataCount"					: 0,
			selector 					: {},
			reset 						: false,
			search 						: "",
			date 							: "",
			todayDate     				: '--',
			newDateOne    				: '',
			weekdays      				: '--',
			monthlyState  				: '--',
			fromdate      				: (moment(new Date()).subtract(1, 'M')).add(1, "days").format("YYYY-MM-DD"), 
			todate        				: moment(new Date()).format("YYYY-MM-DD"),
			currentYear  				: moment().format('YYYY'),
			selectedOption 			: null
		}

	  	this.handleChange 	= this.handleChange.bind(this);
	};

	/*===========  ===========*/
	componentDidMount() {
		// Setstate values of customize filters

		if (this.props.customizedFiltersArray && this.props.customizedFiltersArray.length > 0) {
			for (var i = 0; i < this.props.customizedFiltersArray.length; i++) {
				var name = this.props.customizedFiltersArray[i].inputName;
				this.setState({
					[name] : ""
				})
			}
		}

		this.setDefaultValues();
	}

	setDefaultValues(){
		var today 	= new Date();
		var dd 		= today.getDate();
		var mm 		= today.getMonth()+1; //January is 0!
		var yyyy 	= today.getFullYear();
		
		if(dd<10){
			dd = '0'+ dd;
		}
	  	if(mm<10){
			mm = '0'+ mm;
		}

		var today = yyyy+'-'+mm+'-'+dd;

	  	this.setState({
		 	todayDate : today,
	  	},()=>{this.getData(this.state.search, this.state.startRange,this.state.limitRange)});

	  	// var weeknumber = moment(new Date()).week() - 1;
	  	var weeknumber = moment(today).isoWeek();
	  
	  	console.log("weeknumber => ",weeknumber)
	  	if(weeknumber<=9){
		 	weeknumber = "0"+weeknumber;
	  	}
	  	var yyyy 	= moment(today).format("YYYY");
	  	var weekVal = yyyy+"-W"+weeknumber;

	  	console.log("yyyy => ",yyyy)
	  	console.log("weekVal => ",weekVal)

	  	this.setState({
		 	weekdays:weekVal,
	  	},()=>{this.getData(this.state.search, this.state.startRange,this.state.limitRange)});

	  	var yyyy 			= moment(today).format("YYYY");
	  	var monthNum 		= moment(today).format("MM");
	  	var currentMonth 	= yyyy+"-"+monthNum;
	  	this.setState({
		 	monthlyState:currentMonth,
	  	},()=>{this.getData(this.state.search, this.state.startRange,this.state.limitRange)});

	  	// var fromDt = new Date();
	  	// var toDt = new Date(moment(fromDt).add(1,'d'));

	  	// var fromDt = (moment(new Date()).subtract(1, 'M')).add(1, "days").format("YYYY-MM-DD"); 
	  	// var toDt = moment(new Date()).format("YYYY-MM-DD");

		var fromDt 	= moment(new Date()).format("YYYY-MM-DD");
	  	var toDt 	= (moment(new Date()).add(1, 'M')).format("YYYY-MM-DD");

	  	this.setState({
		 	fromdate : fromDt,
		 	toDate 	: toDt
	  	},()=>{this.getData(this.state.search, this.state.startRange,this.state.limitRange)})

	  	var currentYear = moment().format('YYYY');

	  	this.setState({
		 	currentYear : currentYear
	  	},()=>{this.getData(this.state.search, this.state.startRange,this.state.limitRange)})
	  	
	  	var entity = localStorage.getItem("company_Id")
	  	this.setState({
		 	entityid : 1
	  	})
	}

	/*===========  ===========*/
	handleChange(event) {
		const target 	= event.target;
		const name 		= target.name;

		this.setState({
			[name]: event.target.value
		},()=>{
		  	if(Object.keys(this.state.selector).length == 0){this.getData(this.state.search, this.state.startRange, this.state.limitRange)}else{this.getBookingData(this.state.selector,this.state.startRange, this.state.limitRange)}
		});  
	}

	/*===========  ===========*/
	handleChangeFilter(event){
	 	if (event.target.value) {
			var currentSelection =  event.target.name;
			var selector 			= {};
			
			if (currentSelection === 'status') {
				selector.status = event.target.value;
			}
			if (currentSelection === 'city') {
				selector.city = event.target.value;
			}
			if (currentSelection === 'state') {
				selector.state = event.target.value;
			}
			
			this.setState({ selector: selector },()=>{
			  	this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange);
			})        
		}
	}

	/*=========== handleDateChange() ===========*/
  	handleDateChange(event) {
	 	const target 	= event.target;
	 	const name 		= target.name;

	 	this.onSelectedItemsChange("date",event.target.value)

	 	this.setState({
		  	date : event.target.value
	 	});   
  	}

  	/*=========== selectFilter() ===========*/
  	selectFilter(event){
	 	$(".bookingfilterWrapper").toggle();
  	}

  	/*=========== resetFilter() ===========*/
  	resetFilter(event) {
	 	event.preventDefault();
	 	this.setState({
			search 				: "",
			reset 				: true
	 	},()=>{
	  		this.getData(this.state.search, this.state.startRange,this.state.limitRange)
	 	})
  	}

  	/*=========== nextWeek() ===========*/
  	nextWeek(event){
	 	event.preventDefault();
	 	var selectedWeek = $("input#weekpicker").val();
	 	console.log("selectedWeek => ",selectedWeek)

	 	var newWeekDt 		= moment(selectedWeek).add(0, 'weeks').format("YYYY-MM-DD");
	 	var newWeekNumber = moment(newWeekDt).week();
	 	//Construct the WeekNumber string as '2017-W01'
	 	console.log("newWeekDt => ",newWeekDt)

	 	console.log("newWeekNumber => ",newWeekNumber)
	 	if(newWeekNumber <= 9){
			newWeekNumber = '0'+newWeekNumber;
	 	}
	 	var yearNum=moment(newWeekDt).format("YYYY");
	 	var newWeek = yearNum + "-W" + newWeekNumber;
	 	this.setState({
			weekdays:newWeek,
	 	},()=>{
			this.getData(this.state.search, this.state.startRange,this.state.limitRange)		
		});
  	}

  	/*=========== previousWeek() ===========*/
  	previousWeek(event){
	 	event.preventDefault();
	 	var selectedWeek 	= $("input#weekpicker").val();
	 	var newWeekDt 		= moment(selectedWeek).subtract(2, 'weeks').format("YYYY-MM-DD");
	 	var newWeekNumber = moment(newWeekDt).week();
	 	
	 	console.log("selectedWeek => ",selectedWeek)
	 	console.log("newWeekDt => ",newWeekDt)
	 	console.log("newWeekNumber => ",newWeekNumber)

	 	//Construct the WeekNumber string as '2017-W01'
	 	if(newWeekNumber <= 9){
			newWeekNumber = '0'+newWeekNumber;
	 	}else if(newWeekNumber === 53){
			newWeekNumber = 52;
	 	}
	 	var yearNum = moment(newWeekDt).format("YYYY");
	 	console.log("yearNum => ",yearNum)
	 	var newWeek = yearNum + "-W" + newWeekNumber;
	 	console.log("newWeek => ",newWeek)
	 	this.setState({
		  	weekdays : newWeek,
	 	},()=>{
	  		this.getData(this.state.search, this.state.startRange,this.state.limitRange)
	  	});
	}

	/*=========== nextDate() ===========*/
  	nextDate(event){
	 	event.preventDefault();
	 	var selectedDate1 = $("input#todayDate").val();
	 	var selectedDate = selectedDate1.replace(/-/g, '\/');

	 	var newDate1 = new Date(selectedDate);
	 	var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) );
	 	var newDate3 = new Date(newDate2);
	 	var dd = newDate3.getDate();
	 	var mm = newDate3.getMonth()+1; //January is 0!
	 	var yyyy = newDate3.getFullYear();
	 	if(dd<10){
		  	dd='0'+dd;
	 	}
	 	if(mm<10){
		  	mm='0'+mm;
	 	}
	 	var newDate3 = yyyy+'-'+mm+'-'+dd;

	 	this.setState({
		  	todayDate : newDate3,
	 	},()=>{
			this.getData(this.state.search, this.state.startRange,this.state.limitRange)
	 	});
  	}

  	/*=========== previousDate() ===========*/
  	previousDate(event){
	 	event.preventDefault();
	 	var selectedDate1 = $("input#todayDate").val();
	 	var selectedDate 	= selectedDate1.replace(/-/g, '\/');
	 	var newDate1 		= new Date(selectedDate);
	 	var newDate2 		= new Date(newDate1.getTime() - (24*60*60*1000) );
	 	// Session.set('newDate', newDate2);
	 	var newDate3 		= new Date(newDate2);
	 	var dd 				= newDate3.getDate();
	 	var mm 				= newDate3.getMonth()+1; //January is 0!
	 	var yyyy 			= newDate3.getFullYear();
	 	if(dd<10){
		  	dd = '0'+dd;
	 	}
	 	if(mm<10){
		  	mm='0'+mm;
	 	}
	 	var newDate3 = yyyy+'-'+mm+'-'+dd;
	 	this.setState({
			todayDate : newDate3,
	 	},()=>{
			this.getData(this.state.search, this.state.startRange,this.state.limitRange)
		});
  	}

  	/*=========== nextMonth() ===========*/
  	nextMonth(event){
	 	event.preventDefault();
	 	var selectedMonth 	= $("input#monthlyValue").val();
	 	var newMonthDt 		= moment(selectedMonth).add(1, 'months').format("YYYY-MM-DD");
	 	var newMonthNumber 	= moment(newMonthDt).format("MM");

	 	//Construct the WeekNumber string as 'YYYY-MM'
	 	var yearNum 	= moment(newMonthDt).format("YYYY");
	 	var newMonth 	= yearNum+"-"+newMonthNumber;
	 	this.setState({
		  	monthlyState : newMonth,
	 	},()=>{
	 		this.getData(this.state.search, this.state.startRange,this.state.limitRange)
	 	});
  	}

  	/*=========== previousMonth() ===========*/
  	previousMonth(event){
	 	event.preventDefault();
	 	var selectedMonth = $("input#monthlyValue").val();

	 	var newMonthDt 		= moment(selectedMonth).subtract(1, 'months').format("YYYY-MM-DD");
	 	var newMonthNumber 	= moment(newMonthDt).format("MM");
	 	//Construct the WeekNumber string as 'YYYY-MM'
	 	var yearNum 			= moment(newMonthDt).format("YYYY");
	 	var newMonth 			= yearNum+"-"+newMonthNumber;
	 	this.setState({
		  	monthlyState : newMonth,
	 	},()=>{
			this.getData(this.state.search, this.state.startRange,this.state.limitRange)
		});
  	}

  	/*=========== fromdates() ===========*/
  	fromdates(event){
	 	var selectedDate1 = $("input#fromdate").val();	 
		var dd 				= new Date(selectedDate1).getDate();
		var mm 				= new Date(selectedDate1).getMonth()+1; //January is 0!
		var yyyy 			= new Date(selectedDate1).getFullYear();
	 
	 	if(dd<10){
		  	dd='0'+dd;
	 	}
	 	if(mm<10){
		  	mm='0'+mm;
	 	}
	 	var Fromdate = yyyy+'-'+mm+'-'+dd;
	 	this.setState({
		  	fromdate : Fromdate,
	 	},()=>{
			this.getData(this.state.search, this.state.startRange,this.state.limitRange)
		});
  	}

  	/*=========== todates() ===========*/
  	todates(event){
	 	var selectedDate2 = $("input#todate").val();
	 	var dd       		= new Date(selectedDate2).getDate();
	 	var mm       		= new Date(selectedDate2).getMonth() + 1; //January is 0!
	 	var yyyy     		= new Date(selectedDate2).getFullYear();
	 	
	 	if(dd<10){
		  	dd='0'+dd;
	 	}
	 	if(mm<10){
		  	mm='0'+mm;
	 	}

	 	var Todate 			= yyyy+'-'+mm+'-'+dd;
		var dateCompare 	=  moment(Todate).isAfter(this.state.fromdate);
		
		if(dateCompare === true){
	 		this.setState({
		  		todate:Todate,
	 		},()=>{		
				this.getData(this.state.search, this.state.startRange,this.state.limitRange)
			});
		}else{
	 		swal('From date should not be less than To date')
	 		this.setState({
				todate:this.state.fromdate
	 		},()=>{
	 			this.getData(this.state.search, this.state.startRange,this.state.limitRange)
	 		})
		}
  	}

  	/*=========== nextYear() ===========*/
  	nextYear(event){
	 	event.preventDefault();
	 	var currentYear 	= this.state.currentYear;
	 	var newYear 		= moment(currentYear).add(1,'years').format('YYYY');
	 	
	 	this.setState({currentYear: newYear},()=>{
	 		this.getData(this.state.search, this.state.startRange,this.state.limitRange)
	 	})
  	}

  	/*=========== previousYear() ===========*/
  	previousYear(event){
	 	event.preventDefault();
	 	var currentYear 	= this.state.currentYear;
	 	var newYear 		= moment(currentYear).subtract(1,'years').format('YYYY');
	 	
	 	this.setState({currentYear: newYear},()=>{
		  	this.getData(this.state.search, this.state.startRange,this.state.limitRange)
		})
  	}

  	/*=========== changeTab() ===========*/
  	changeTab(value,event){
		this.setState({currentActiveTab:value},()=>{
		  	this.getData(this.state.search, this.state.startRange,this.state.limitRange)
		})
  	}

  	/*=========== getFilteredProducts() ===========*/
	getFilteredProducts(){}

	/*=========== getData() ===========*/
	getData(search, startRange, limitRange){ 

		this.setState({reset:false})

	  	var formValues ={
			startDate   : "",
			endDate     : "",
			searchText	: search,
			startRange  : startRange,
			limitRange  : limitRange
	  	}
	  	if (this.state.customizedFiltersArray && this.state.customizedFiltersArray.length > 0) {
			for (var i = 0; i < this.props.customizedFiltersArray.length; i++) {
				var name = this.state.customizedFiltersArray[i].inputName;
				formValues.[name] = this.state[name] && this.state[name] !== "" ? this.state[name].value : this.state[name];
			}
		}
		var currentActiveTab = this.state.currentActiveTab;
		  
	  	if(currentActiveTab === "Daily"){
			var todayDateSelected 	= this.state.todayDate;
			var startDate 				= moment(todayDateSelected).startOf('day'); // set to 12:00 am today
			var endDate 				= moment(todayDateSelected).endOf('day'); // set to 23:59 pm today
			formValues.startDate    = new Date(startDate);
			formValues.endDate      = new Date(endDate);

	  	}else if(currentActiveTab === "Weekly"){
			var weekData 				= this.state.weekdays;
			var mondayInWeek 			= moment(weekData).day("Monday").week(weekData).format();
			var mondayInWeekDt 		= new Date(mondayInWeek);
			var sundayOfWeek 			= moment(mondayInWeek).add(7,"days").format();
			var sundayOfWeekDt 		= new Date(sundayOfWeek);
			formValues.startDate 	= mondayInWeekDt;
			formValues.endDate   	= sundayOfWeekDt;

	  	}else if(currentActiveTab === "Monthly"){
			var selectedMonth 		= this.state.monthlyState;
			var monthDateStart 		= new Date(moment(selectedMonth).month("YYYY-MM"));//Find out first day of month with selectedMonth
			var monthDateEnd 			= new Date(moment(selectedMonth).add(1,"M"));
			formValues.startDate 	= monthDateStart;
			formValues.endDate   	= monthDateEnd;

	  	}else if(currentActiveTab === "Yearly"){
			var selectedYear 			= this.state.currentYear;
			var yearDateStart 		= new Date("1/1/" + selectedYear);
			var yearDateEnd 			= new Date (yearDateStart.getFullYear(), 11, 31);
			formValues.startDate 	= yearDateStart;
			formValues.endDate   	= yearDateEnd;

	  	}else if(currentActiveTab === "Custom"){
			var fromDate 				= this.state.fromdate;
			var todate    				= this.state.todate;
			formValues.startDate 	= new Date(fromDate);
			formValues.endDate   	= new Date(todate);
	  	}

		var status = this.state.status;
		console.log("formValues",formValues)
		  
		// axios.post('/api/reports/get/userlist',formValues)
		axios.post(this.state.dataApiUrl,formValues)
			.then((response) => {
			  	console.log("response=>",response)			  
			 //  	var tableData = response.data.map((a, i)=>{					
				// 	return{           
				// 	  	orderID    			: a.orderID,
				// 		customerName    	: a.customerName,
				// 		orderDate         : moment(a.createdAt).format('DD/MM/YYYY'),
				// 		orderAmount       : a.orderAmount,
				// 	}
				// })
				
				this.setState({
					RecordsTable 	: response.data.data,
					dataCount 		: response.data.dataCount
				})
			})
			.catch((error) =>{
				console.log("ERROR : ", error); 
			})
	}

	handleChangeFilters(event){		
		var name 	= event.name;
		var value 	= event.value;
    	this.setState({ 
    		[name]  : event
    	},()=>{
    		if (this.state.customizedFiltersArray && this.state.customizedFiltersArray.length) {
    			var customFilter = this.state.customizedFiltersArray.filter(filter => filter.inputName === name);
    			console.log("customFilter => ",customFilter);
    			// if (customFilter && customFilter.length > 0) {
    			// console.log("customFilter[0].onChangeMethod => ",customFilter[0].onChangeMethod);
    			// 	if (customFilter[0].onChangeMethod !== undefined) {
    			// 		console.log("In.....");
    			// 		var callMethod = customFilter[0].onChangeMethod;
    			// 	}
    			// }
    			if (name === "section") {
	    			this.props.getCategories(this.state[name].value)
    			}
    			if (name === "category") {
	    			this.props.getSubCategories(this.state[name].value)
    			}
    		}
    		this.getData(this.state.search, this.state.startRange,this.state.limitRange)
    		console.log(`Option selected:`, name, " => ",this.state[name]);
    	});
  	};

  	/*======== showMoreFilters() ========*/
    showMoreFilters(event){
        event.preventDefault();
        var filterBtn = event.target;
        var element   = document.getElementById(this.state.tableName + "-" + this.state.currentActiveTab + "-Filters");
        console.log("element => ",element)
        console.log("element.style.display => ",element.style.display)
        if (element) {
            $("#" + this.state.tableName + "-" + this.state.currentActiveTab + "-Filters").toggle();
        }
        if ((element.style.display) === "none") {
            filterBtn.innerHTML   = "<i class='fa fa-sliders' aria-hidden='true'></i> More Filters";
        } else {
            filterBtn.innerHTML   = "<i class='fa fa-sliders' aria-hidden='true'></i> Hide Filters";
        }
    }

	/*=========== render() ===========*/
	render() {
		return (
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
				<section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding content">   
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pageContent">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOPadding topMargin box-header with-border">
									<h4 className="col-lg-12 col-md-12 col-xs-12 col-sm-12 weighttitle NOPadding">{this.state.reportTitle}</h4>
								</div>
							</div>
							<section className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
									<div className="reportWrapper col-lg-12 NOPadding"> 
										{/*{ this.state.showDateWiseFilters
									? */}                 				
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dateTabsWrapper">
													<div className="col-lg-12 nav-center col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
															<ul className="nav nav-pills navTabList">
															 {this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject !== null && this.state.filterObject.dailyFilter 
													?															  	        
																	<li className="navListItem">
																		 <a href="#Daily" data-toggle="tab" className={"navTab " + (this.state.currentActiveTab === "Daily" ? "active" : "")} value="Daily" onClick={this.changeTab.bind(this,'Daily')}>
																				Daily
																		 </a>
																	</li>
															  :
																null
															 }
															 { this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject.weeklyFilter 
													?
																	<li className="navListItem">
																		 <a href="#Weekly" data-toggle="tab" className={"navTab " + (this.state.currentActiveTab === "Weekly" ? "active" : "")} value="Weekly" onClick={this.changeTab.bind(this,'Weekly')}>
																				Weekly
																		 </a>
																	</li>
															  :
																null
															 }
															 { this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject.monthlyFilter 
													?
																	<li className="navListItem">
																		 <a href="#Monthly" data-toggle="tab" className={"navTab " + (this.state.currentActiveTab === "Monthly" ? "active" : "")} value="Monthly" onClick={this.changeTab.bind(this,'Monthly')} >
																				Monthly
																		 </a>
																	</li>
															  :
																null
															 }
															 { this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject.yearlyFilter 
													?
																	<li className="navListItem">
																		 <a href="#Yearly" data-toggle="tab" className={"navTab " + (this.state.currentActiveTab === "Yearly" ? "active" : "")} value="Yearly" onClick={this.changeTab.bind(this,'Yearly')}>
																				Yearly
																		 </a>
																	</li>
															  :
																null
															 }
															 { this.state.filterObject && this.state.filterObject !== "undefined" && this.state.filterObject.customizedDateFilter 
													? 
																	 <li className="navListItem">
																		 <a href="#Custom" data-toggle="tab" className={"navTab " + (this.state.currentActiveTab === "Custom" ? "active" : "")} value="Custom" onClick={this.changeTab.bind(this,'Custom')}>
																				Date Range
																		 </a>
																	</li>
															  :
																null
															 }			                  
															</ul>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tab-content">
															<div className={"tab-pane " + (this.state.currentActiveTab === "Daily" ? "active" : "")} id="Daily">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginStyle NOPadding">
																	<div className="col-lg-6 col-lg-offset-3 col-md-6  col-lg-offset-3 col-sm-12 col-xs-12 NOPadding">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reports-select-date-Title">Daily {this.state.reportTitle}</div>
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 custom-date input-group">
																	<span className="commonReportArrowPoiner input-group-addon" id="previousDate" onClick={this.previousDate.bind(this)} ><i className="fa fa-chevron-circle-left" id="fromdate-arrow-left" aria-hidden="true"></i></span>
																	<input 
																		name 		= "todayDate" 
																		id 			= "todayDate" 
																		ref 		= "todayDate"  
																		type 		= "date" 
																		className 	= "textAlignCenter boxHeight36 form-control" 
																		onChange 	= {this.handleChange.bind(this)} 
																		value 		= {this.state.todayDate}
																	/>	
																	<span className="commonReportArrowPoiner input-group-addon" id="nextDate" onClick={this.nextDate.bind(this)} ><i className="fa fa-chevron-circle-right" id="fromdate-arrow-right" aria-hidden="true"></i></span>
																				{/*<span className="input-group-addon custom-date-icon-left" id="previousDate" onClick={this.previousDate.bind(this)}><img src="/billingManagement/left-arrow.png" id="fromdate-arrow-left"/></span>*/}
																				{/*<input className="form-control" type="date" name="todayDate" id="todayDate" onChange={this.handleChange.bind(this)} value={this.state.todayDate}/>*/}
																				{/*<span className="input-group-addon custom-date-icon-right" id="nextDate" onClick={this.nextDate.bind(this)}><img src="/billingManagement/right-arrow.png" id="fromdate-arrow-right"/></span>                            */}
																		</div>
																</div>
																</div>
															</div>
															<div className={"tab-pane " + (this.state.currentActiveTab === "Weekly" ? "active" : "")} id="Weekly">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginStyle NOPadding">
																	<div className="col-lg-6 col-lg-offset-3 col-md-6  col-lg-offset-3 col-sm-12 col-xs-12 NOPadding">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reports-select-date-Title">Weekly {this.state.reportTitle}</div>
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 custom-date input-group">
																	<span className="commonReportArrowPoiner input-group-addon" id="previousDate" onClick={this.previousWeek.bind(this)} ><i className="fa fa-chevron-circle-left" id="fromdate-arrow-left" aria-hidden="true"></i></span>
																			<input  
																				name 		= "weekdays" 
																				id 			= "weekpicker" 
																				ref 		= "weekdays" 
																				type 		= "week" 
																				className 	= "textAlignCenter boxHeight36 form-control" 
																				value 		= {this.state.weekdays}  
																				onChange 	= {this.handleChange.bind(this)}
																			/>
																			<span className="commonReportArrowPoiner input-group-addon" id="nextDate"  onClick={this.nextWeek.bind(this)} ><i className="fa fa-chevron-circle-right"  id="fromdate-arrow-right" aria-hidden="true"></i></span>
																				{/*<span className="input-group-addon custom-date-icon-left" id="previousDate" onClick={this.previousWeek.bind(this)}><img src="/billingManagement/left-arrow.png" id="fromdate-arrow-left"/></span>
																				<input className="form-control" type="week" name="weekdays" id="weekpicker" onChange={this.handleChange.bind(this)} value={this.state.weekdays}/>
																				<span className="input-group-addon custom-date-icon-right" id="nextDate" onClick={this.nextWeek.bind(this)}><img src="/billingManagement/right-arrow.png" id="fromdate-arrow-right"/></span>                            */}
																		</div>
																</div>
																</div>
															</div>
														<div className={"tab-pane " + (this.state.currentActiveTab === "Monthly" ? "active" : "")} id="Monthly">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginStyle NOPadding">
																	<div className="col-lg-6 col-lg-offset-3 col-md-6  col-lg-offset-3 col-sm-12 col-xs-12 NOPadding">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reports-select-date-Title">Monthly {this.state.reportTitle}</div>
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 custom-date input-group">
																	<span className="commonReportArrowPoiner input-group-addon" id="previousMonth" onClick={this.previousMonth.bind(this)} ><i className="fa fa-chevron-circle-left" id="fromdate-arrow-left" aria-hidden="true"></i></span>
																			<input 
																				name 		= "monthlyValue" 
																				id 			= "monthlyValue" 
																				ref 		= "monthlyValue"  
																				type 		= "month" 
																				className 	= "textAlignCenter boxHeight36 form-control"
																				value 		= {this.state.monthlyState} 
																				onChange 	= {this.handleChange.bind(this)}  
																			/>
																			<span className="commonReportArrowPoiner input-group-addon" id="nextMonth" onClick={this.nextMonth.bind(this)}><i className="fa fa-chevron-circle-right" id="fromdate-arrow-right" aria-hidden="true"></i></span>

																	{/*<span className="input-group-addon custom-date-icon-left" id="previousMonth" onClick={this.previousMonth.bind(this)}><img src="/billingManagement/left-arrow.png" id="fromdate-arrow-left"/></span>*/}
																				{/*<input className="form-control" type="month" name="monthlyValue" id="monthlyValue" onChange={this.handleChange.bind(this)} value={this.state.monthlyState}/>*/}
																				{/*<span className="input-group-addon custom-date-icon-right" id="nextMonth" onClick={this.nextMonth.bind(this)}><img src="/billingManagement/right-arrow.png" id="fromdate-arrow-right"/></span>*/}                            
																		</div>
																</div>
																</div>
															</div>
															<div className={"tab-pane " + (this.state.currentActiveTab === "Yearly" ? "active" : "")} id="Yearly">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginStyle NOPadding">
																	<div className="col-lg-6 col-lg-offset-3 col-md-6  col-lg-offset-3 col-sm-12 col-xs-12 NOPadding">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reports-select-date-Title">Yearly {this.state.reportTitle}</div>
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 custom-date input-group">
																	<span className="commonReportArrowPoiner input-group-addon" id="previousYear" onClick={this.previousYear.bind(this)}><i className="fa fa-chevron-circle-left" id="fromdate-arrow-left" aria-hidden="true"></i></span>
																			<input 
																				name 		= "currentYear" 
																				id 			= "currentYear" 
																				ref 		= "currentYear"  
																				type 		= "text" 
																				className 	= "textAlignCenter boxHeight36 form-control" 
																				onChange 	= {this.handleChange.bind(this)} 
																				value 		= {this.state.currentYear} 
																			/>
																			<span className="commonReportArrowPoiner input-group-addon" id="nextYear" onClick={this.nextYear.bind(this)}><i className="fa fa-chevron-circle-right" id="fromdate-arrow-right" aria-hidden="true"></i></span>

																	{/*<span className="input-group-addon custom-date-icon-left" id="previousYear" onClick={this.previousYear.bind(this)}><img src="/billingManagement/left-arrow.png" id="fromdate-arrow-left"/></span>*/}
																				{/*<input className="textAlignCenter boxHeight36 form-control" type="text" name="currentYear" id="currentYear" onChange={this.handleChange.bind(this)} value={this.state.currentYear}/>
																				<span className="input-group-addon custom-date-icon-right" id="nextYear" onClick={this.nextYear.bind(this)}><img src="/billingManagement/right-arrow.png" id="fromdate-arrow-right"/></span>*/}                            
																		</div>
																</div>
																</div>
															</div>
															<div className={"tab-pane " + (this.state.currentActiveTab === "Custom" ? "active" : "")} id="Custom">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginStyle NOPadding">
																	<div className="col-lg-6 col-lg-offset-3 col-md-6  col-lg-offset-3 col-sm-12 col-xs-12 NOPadding">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reports-select-date-Title">{this.state.reportTitle}</div>
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 custom-date input-group">
																	<label className="col-lg-6 col-md-6 col-sm-12 col-xs-12 boxBorder">From
																				<input 
																					name 			= "fromDate" 
																					id 			= "fromdate" 
																					type 			= "date" 
																					className 	= "textAlignCenter boxHeight36 form-control" 
																					onChange 	= {this.fromdates.bind(this)}
																					value 		= {this.state.fromdate} 
																				/>
																			</label>
																			<label className="col-lg-6 col-md-6 col-sm-12 col-xs-12 boxBorder">To
																				<input 
																					name 			= "toDate" 
																					id 			= "todate" 
																					type 			= "date" 
																					className 	= "textAlignCenter boxHeight36 form-control" 
																					onChange 	= {this.todates.bind(this)}
																					value 		= {this.state.todate} 
																				/>
																			</label>
																		</div>
																	</div>
															</div>
															</div>
													</div>
												</div>
											{/*:
												null
											}*/}
											{/*{this.state.showCustomizedFilters
												?
													<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOPadding">   
														{this.state.customizedFiltersArray && this.state.customizedFiltersArray.length > 0
															?
																this.state.customizedFiltersArray.map((filtersdata, i) => {
																				return (
																			<div key={i} className="form-margin col-lg-3 col-md-6 col-sm-12 col-xs-12 driver employee" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">{filtersdata.inputLabel}</label>
																					{filtersdata.inputType === "select"
																					?
																						<select id={filtersdata.inputName} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state[filtersdata.inputName]} ref={filtersdata.inputName} name={filtersdata.inputName} onChange={this.handleChangeFilter.bind(this)}>
																							 <option selected={true} disabled={true}>{filtersdata.inputDefaultValue}</option>
																							 {this.state[filtersdata.inputName+"Array"] && this.state[filtersdata.inputName+"Array"].length > 0 
																								?
																									  this.state[filtersdata.inputName+"Array"].map((data, index) => {
																											return (
																												<option value={data}>{data}</option>
																											);
																									  })
																								  :
																									null
																							 }
																						</select>
																				  :
																						null
																				  }
																			</div>								                                    	
																				);
																		  })
														:
															null
													}
													</div>
												:
													null
											}*/}
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding marginTop17">
												<button className="btn button3" id="btnCheck" 
						                    onClick={this.showMoreFilters.bind(this)} >
						                    <i className="fa fa-sliders"></i> More Filters 
						                  </button>
						                  <button className="btn button3" id="btnCheck" 
						                    onClick={this.resetFilter.bind(this)} >
						                    <i className="fa fa-refresh"></i> Reset Filters 
						                  </button>
											</div>
											{this.state.showCustomizedFilters
												?
													<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 filtersDiv" id={this.state.tableName + "-" + this.state.currentActiveTab + "-Filters"}>   
														{this.state.customizedFiltersArray && this.state.customizedFiltersArray.length > 0
															?
																this.state.customizedFiltersArray.map((filtersdata, i) => {
																	return (
																		<div key={i} className="form-margin col-lg-3 col-md-6 col-sm-12 col-xs-12" >
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">{filtersdata.inputLabel}</label>
																			{/*{console.log("filtersdata.inputName => ",filtersdata.inputName)}*/}
																			{console.log("this.state => ",this.state[filtersdata.inputName])}
																			{filtersdata.inputType === "select"
																			?
																				<Select
																		        	value 		= {this.state[filtersdata.inputName]}
																		        	name 			= {filtersdata.inputName}
																		        	onChange 	= {this.handleChangeFilters.bind(this)}
																		        	options 		= {filtersdata.inputArray}
																		      />
																		  :
																				null
																		  }
																		</div>								                                    	
																	);
															  })
														:
															null
													}
													</div>
												:
													null
											}
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
															<IAssureTable
																tableHeading 	= {this.state.tableHeading}
																twoLevelHeader = {this.state.twoLevelHeader}
																id 				= {this.state.tableId}
																dataCount 		= {this.state.dataCount}
																tableData 		= {this.state.RecordsTable}
																tableObjects 	= {this.state.tableObjects}
																tableName 		= {this.state.reportTitle}
																getData 			= {this.getData.bind(this)}

															/>
													</div>
												</div>
											</div>
									</div>
								</div>
							</section>
						</div>
				</section>
				</div>
		);
	}
}

export default UserReport;