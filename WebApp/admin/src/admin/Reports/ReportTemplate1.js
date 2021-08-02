import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import moment                   from 'moment';
import _                        from 'underscore';
import IAssureTable           	from "../../coreadmin/IAssureTable/IAssureTable.jsx";
import 'bootstrap/js/tab.js';


class UserReport extends Component {
     
    constructor(props) {
        super(props);
        this.state = {
        	'currentActiveTab'    	: props.currentActiveTab,
        	'reportTitle' 			: props.reportTitle,
			'showDateWiseFilters' 	: props.showDateWiseFilters,
			'filterObject' 			: props && props.filterObject ? props.filterObject : {}, 	
			'showCustomizedFilters' : props.showCustomizedFilters,
			'customizedFiltersArray': props && props.customizedFiltersArray && props.customizedFiltersArray.length > 0 ? props.customizedFiltersArray : [], 	
			'tableDatas'        	: [],
			'reportData'        	: {},
			'tableData'         	: [],
			"startRange"        	: 0,
			"limitRange"        	: 10,
			"dataApiUrl"        	: props && props.dataApiUrl ? props.dataApiUrl : "",		
		  	// "currentView" 			: props.currentTabView,
		  	"dataCount"				: props && props.dataCount ? props.dataCount : [],
		  	"tableData"				: props && props.tableData ? props.tableData : [],
		  	"tableName"				: props && props.tableName ? props.tableName : [],
		  	"tableHeading"			: props && props.tableHeading ? props.tableHeading : {},
		  	"twoLevelHeader"		: props && props.twoLevelHeader ? props.twoLevelHeader : {},
		  	"tableObjects"			: props && props.tableObjects ? props.tableObjects : {},
		  	"deleteMethod"			: props && props.deleteMethod ? props.deleteMethod : {},	  
		  	"startRange"			: 0,
		  	"limitRange"			: 10,
		  	// "normalData"			: true,
		  	// "printhideArray"		: [],
		  	// selectedWeekYear       	: '',
     //      	selectedWeek           	: '',
          	// startDate             	: '',
          	// endDate               	: '',

          // currentActiveTab   : 'Custom',
          // bookingStatus    : "",
          selector:{},
          reset:false,
          gmapsLoaded: false,
          company:"",
          search:"",
          // "startRange": 0,
          // "limitRange": 10,
          originatingCity:"",
          destinationCity:"",
          date:"",
          vendor_name:"",
          todayDate     : '--',
          newDateOne    : '',
          weekdays      : '--',
          monthlyState  : '--',
          fromdate      : (moment(new Date()).subtract(1, 'M')).add(1, "days").format("YYYY-MM-DD"), 
          todate        : moment(new Date()).format("YYYY-MM-DD"),
          booking_id        : '',

          currentYear  : moment().format('YYYY'),
          // tableHeading:{
          //   fullName:"Full Name",
          //   companyName:"Comapny Name",
          //   gender:"Gender",
          //   age:"Age",
          //   email:"Email",
          //   phone:"Phone",
          //   state:"State",
          //   city:"City",
          //   status:"Status",
          //   registeredOn:"Registered On",
          //   lastLogin:"Last Login",
          // },
          // RecordsCount:'',
          RecordsTable:[],
          companyNames:[],
          stateArrayList:[],
          cityArrayList:[],
          statusArrayList:[],
          RecordsTableforWeek:[],
          RecordsTableforMonth:[],
          RecordsTableforYear:[],
          RecordsTableforCustom:[],
          tableObjects : {
            paginationApply : true,
            searchApply     : false,
            downloadApply   : true
          }
        };
        this.handleChange = this.handleChange.bind(this);
        this.showData = this.showData.bind(this);
    }


    componentDidMount() {
      var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        }
        if(mm<10){
            mm='0'+mm;
        }
        var today = yyyy+'-'+mm+'-'+dd;

        this.setState({
          todayDate : today,
        },()=>{this.getData(this.state.startRange,this.state.limitRange)});

        var weeknumber = moment(today).week();
        if(weeknumber<=9){
          weeknumber="0"+weeknumber;
        }
        var yyyy = moment(today).format("YYYY");
        var weekVal = yyyy+"-W"+weeknumber;
        this.setState({
          weekdays:weekVal,
        },()=>{this.getData(this.state.startRange,this.state.limitRange)});

        var yyyy = moment(today).format("YYYY");
        var monthNum = moment(today).format("MM");
        var currentMonth = yyyy+"-"+monthNum;
        this.setState({
          monthlyState:currentMonth,
        },()=>{this.getData(this.state.startRange,this.state.limitRange)});

        // var fromDt = new Date();
        // var toDt = new Date(moment(fromDt).add(1,'d'));

        // var fromDt = (moment(new Date()).subtract(1, 'M')).add(1, "days").format("YYYY-MM-DD"); 
        // var toDt = moment(new Date()).format("YYYY-MM-DD");

         var fromDt = moment(new Date()).format("YYYY-MM-DD");
        var toDt = (moment(new Date()).add(1, 'M')).format("YYYY-MM-DD");

        this.setState({
          fromdate : fromDt,
          toDate: toDt
        },()=>{this.getData(this.state.startRange,this.state.limitRange)})

        var currentYear = moment().format('YYYY');

        this.setState({
          currentYear : currentYear
        },()=>{this.getData(this.state.startRange,this.state.limitRange)})
        var entity = localStorage.getItem("company_Id")
        this.setState({
          entityid : 1
        })

    }

    handleChange(event) {
      const target = event.target;
      const name = target.name;

      this.setState({
          [name]: event.target.value
      },()=>{
        if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange, this.state.limitRange)}else{this.getBookingData(this.state.selector,this.state.startRange, this.state.limitRange)}
      });  
    }
    handleChangeFilter(event){
    if (event.target.value) {
      var currentSelection =  event.target.name;
          var selector = {};

          if (currentSelection === 'corporate') {
              selector.company = event.target.value;
          }
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

  handleDateChange(event) {
    const target = event.target;
    const name = target.name;

    this.onSelectedItemsChange("date",event.target.value)

    this.setState({
        date: event.target.value
    });   
  }

  handleCityChange(event) {
    const target = event.target;
    const name = target.name;

    //this.onSelectedItemsChange([name],event.target.value)

    this.setState({
        [name]: event.target.value
    });   
  }

  searchData(){
    var formValues ={
          str : this.state.search,
          company_id: this.state.company_id,
          startDate   : "",
          endDate     : "",
          status    : ['Vendor Rejected','Manager Approved','Edited Manager Approved','Change Request','PR Admin Edited','Driver Rejected','Vendor Accepted']
      }
      var currentActiveTab = this.state.currentActiveTab;
      if(currentActiveTab === "Daily"){
          var todayDateSelected = this.state.todayDate;
          var startDate = moment(todayDateSelected).startOf('day'); // set to 12:00 am today
          var endDate = moment(todayDateSelected).endOf('day'); // set to 23:59 pm today
          formValues.startDate    = new Date(startDate);
          formValues.endDate      = new Date(endDate);
      }else if(currentActiveTab === "Weekly"){
          var weekData = this.state.weekdays;
          var mondayInWeek = moment(weekData).day("Monday").week(weekData).format();
          var mondayInWeekDt = new Date(mondayInWeek);
          var sundayOfWeek = moment(mondayInWeek).add(7,"days").format();
          var sundayOfWeekDt = new Date(sundayOfWeek);
          formValues.startDate = mondayInWeekDt;
          formValues.endDate   = sundayOfWeekDt;
      }else if(currentActiveTab === "Monthly"){
          var selectedMonth = this.state.monthlyState;
          var monthDateStart = new Date(moment(selectedMonth).month("YYYY-MM"));//Find out first day of month with selectedMonth
          var monthDateEnd = new Date(moment(selectedMonth).add(1,"M"));
          formValues.startDate = monthDateStart;
          formValues.endDate   = monthDateEnd;
      }else if(currentActiveTab === "Yearly"){
          var selectedYear = this.state.currentYear;
          var yearDateStart = new Date("1/1/" + selectedYear);
          var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);
          formValues.startDate = yearDateStart;
          formValues.endDate   = yearDateEnd;
      }else if(currentActiveTab === "Custom"){
          var fromDate = this.state.fromdate;
          var todate    = this.state.todate;
          formValues.startDate = new Date(fromDate);
          formValues.endDate   = new Date(todate);
      }
      var status = this.state.status;
      
      if(status === "New"){
          formValues.status = ['Vendor Rejected','Manager Approved','Edited Manager Approved','Change Request','PR Admin Edited','Driver Rejected','Vendor Accepted'];
      }else if(status === "Allocated"){
          formValues.status = ['Trip Allocated To Driver','Driver Accepted','Allocated To Vendor'];
      }else if(status === "Running"){
          formValues.status = ['Started From Garage','Reached Pickup Location','Start From Pickup','Intermediate Stop','Reached Destination', 'Reached Drop Location','Reached Garage','Expense Submitted'];
      }else if(status === "Unpaid"){
          formValues.status = ['Ready To Bill', 'Invoice Unpaid']
      }else if(status === "Paid"){
          formValues.status = ["Invoice Paid"]
      }else if(status === "PendingManagerApproval"){
          formValues.status = ['New','Edited']
      }else if(status === "Cancelled"){
          formValues.status = ['Cancelled By Vendor','Cancelled By User','Manager Rejected','Edited Manager Rejected']
      }
      axios.post('/api/bookingmaster/get/getcorporateSearchBookings',formValues)
    .then((response) => {
      var tableData = response.data.map((a, i)=>{
        var status = "";
        if(a.statusValue == "New" || a.statusValue == "Edited" || a.statusValue == "Allocated To Vendor" || a.statusValue == "Trip Allocated To Driver" || a.statusValue == "Running" || a.statusValue == "Started From Garage" || a.statusValue == "Ready To Bill" || a.statusValue == "Start From Pickup" || a.statusValue == "Intermediate Stop" || a.statusValue == "Change Request"){
         status = '<span class="label label-info">'+a.statusValue+'</span>'
        }else if(a.statusValue == "Manager Approved" || a.statusValue == "Edited Manager Approved" || a.statusValue == "Driver Accepted" || a.statusValue == "Reached Pickup Location" || a.statusValue == "Start OTP Verified" || a.statusValue == "Reached Destination" || a.statusValue == "End OTP Verified" || a.statusValue == "Reached Drop Location" || a.statusValue == "Reached Garage" || a.statusValue == "Expense Submitted"){
          status = '<span class="label label-success">'+a.statusValue+'</span>'
        }else if(a.statusValue == "Manager Rejected" || a.statusValue == "Edited Manager Rejected" || a.statusValue == "Driver Rejected"){
          status = '<span class="label label-danger">'+a.statusValue+'</span>'
        }else if(a.statusValue == "Driver Changed By Vendor" || a.statusValue == "Cancelled By Vendor" || a.statusValue == "Cancelled By User"){
          status = '<span class="label label-warning">'+a.statusValue+'</span>'
        }else{
          status = '<span class="label label-info">'+a.statusValue+'</span>'
        }

      return{
            BookingID:'<div class="label label-primary btn btn-link" onclick=window.showUserDetails("' +a._id +'") data-toggle="modal" data-target="#showProfile" title="Show Booking Details">'+a.bookingId+'</div><br><div><i '+(a.person[0].gender == "Male" ? 'class="fa fa-male fa-lg faGender"' : 'class="fa fa-female fa-lg faGender"')+' aria-hidden="true"></i></div>',
            Company:"<a  title='View company profile'  target='_blank' href='/company-profile/"+(a.corporateId)+"'>"+a.company[0].companyName +" (" +a.company[0].companyID+")"+"</a>",
            EmpIDName:"<b>Name :</b> "+"<a  title='View profile' target='_blank' href='/employee-profile/"+(a.employeeId)+"'>"+a.person[0].firstName + " " + a.person[0].lastName+"</a>" + " <br><b>Emp ID :</b> " + (a.person[0].employeeId? a.person[0].employeeId :"- NA -" )+'<br><b>Category : </b>'+a.person[0].empCategory+'<br><b>Priority : </b>'+(a.person[0].empPriority == "1" ? "★" : a.person[0].empPriority == "2" ? "★ ★" : "★ ★ ★"),
            Status:status,
            statusValue:a.statusValue,
            BookingDateTime:moment(a.createdAt).format('DD/MM/YYYY,hh:mm'),
            Date:moment(a.pickupDate).format('DD/MM/YYYY'),
            vendor:a.vendor[0] ? a.vendor[0].companyName : 'NA',
            vendor_id:a.vendor[0] ? a.vendor[0]._id : '',
            id:a._id,
            token:'D'
      }
    })
        this.setState({RecordsTable:tableData})
    })
    .catch((error) =>{
        console.log("ERROR : ", error); 
    })
  }
  handleChangeStatus(event) {
      const target = event.target;
      const name = target.name;

      this.setState({
          bookingStatus: event.target.value,
      });   
  }

  selectFilter(event){
    $(".bookingfilterWrapper").toggle();
  }

  resetFilter(event) {
    event.preventDefault();
    this.setState({
      company:"",
      originatingCity:"",
      destinationCity:"",
      date:"",
      search:"",
      vendor_name:"",
      reset:true,
      selector:{}
    },()=>{
     this.getData(this.state.startRange,this.state.limitRange)
    })
  }

  onSelectedItemsChange(filterType, selecteditems){
    var selector=this.state.selector;
    this.setState({
      reset:false
    });
    
    if(filterType === 'company'){
        selector.company_name  = selecteditems; 
    }
    if(filterType === 'originatingCity'){
      selector.originatingCity  = selecteditems; 
    }
    if(filterType === 'destinationCity'){
      selector.destinationCity  = selecteditems; 
    }
    if(filterType === 'date'){
      selector.date  = selecteditems; 
      var todayDateSelected = selecteditems;
      var startDate = moment(todayDateSelected).startOf('day'); // set to 12:00 am today
      var endDate = moment(todayDateSelected).endOf('day'); // set to 23:59 pm today
      selector.from    = new Date(startDate);
      selector.to      = new Date(endDate);
    }
    if(filterType === 'vendor_name'){
        selector.vendor_name  = selecteditems; 
    }

    
    this.setState({ selector: selector },()=>{
      this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange);
    })
  }


  nextWeek(event){
    event.preventDefault();
    var selectedWeek = $("input#weekpicker").val();
    console.log("selectedWeek => ",selectedWeek)

    var newWeekDt = moment(selectedWeek).add(1, 'week').format("YYYY-MM-DD");
    var newWeekNumber = moment(newWeekDt).week();
    //Construct the WeekNumber string as '2017-W01'
    console.log("newWeekDt => ",newWeekDt)

    console.log("newWeekNumber => ",newWeekNumber)
    if(newWeekNumber <= 9){
      newWeekNumber = '0'+newWeekNumber;
    }
    var yearNum=moment(newWeekDt).format("YYYY");
    var newWeek = yearNum+"-W"+newWeekNumber;
    this.setState({
      weekdays:newWeek,
    },()=>{
      if(this.state.search){this.searchData()}else{
      if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
      }
    });
  }

  previousWeek(event){
    event.preventDefault();
    var selectedWeek = $("input#weekpicker").val();
    console.log("selectedWeek => ",selectedWeek)
    var newWeekDt = moment(selectedWeek).subtract(1, 'weeks').format("YYYY-MM-DD");
    var newWeekNumber = moment(newWeekDt).week();
    console.log("newWeekDt => ",newWeekDt)

    console.log("newWeekNumber => ",newWeekNumber)

    //Construct the WeekNumber string as '2017-W01'
    if(newWeekNumber <= 9){
      newWeekNumber = '0'+newWeekNumber;
    }else if(newWeekNumber === 53){
      newWeekNumber = 52;
    }
    var yearNum=moment(newWeekDt).format("YYYY");
    var newWeek = yearNum+"-W"+newWeekNumber;
    this.setState({
        weekdays:newWeek,
    },()=>{
      if(this.state.search){
        this.searchData()
      }else{
        if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
      }
    });
  }

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
      if(this.state.search){
        this.searchData()
      }else{
        if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
      }
    });
  }

  previousDate(event){
    event.preventDefault();
    var selectedDate1 = $("input#todayDate").val();
    var selectedDate = selectedDate1.replace(/-/g, '\/');
    var newDate1 = new Date(selectedDate);
    var newDate2 = new Date(newDate1.getTime() - (24*60*60*1000) );
    // Session.set('newDate', newDate2);
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
      if(this.state.search){
        this.searchData()
      }else{
        if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
      }
    });
  }

  nextMonth(event){
    event.preventDefault();
    var selectedMonth = $("input#monthlyValue").val();
    var newMonthDt = moment(selectedMonth).add(1, 'months').format("YYYY-MM-DD");
    var newMonthNumber = moment(newMonthDt).format("MM");
    //Construct the WeekNumber string as 'YYYY-MM'
    var yearNum=moment(newMonthDt).format("YYYY");
    var newMonth = yearNum+"-"+newMonthNumber;
    this.setState({
        monthlyState:newMonth,
    },()=>{
      if(this.state.search){
        this.searchData()
      }else{
        if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
      }
    });
  }

  previousMonth(event){
    event.preventDefault();
    var selectedMonth = $("input#monthlyValue").val();

    var newMonthDt = moment(selectedMonth).subtract(1, 'months').format("YYYY-MM-DD");
    var newMonthNumber = moment(newMonthDt).format("MM");
    //Construct the WeekNumber string as 'YYYY-MM'
    var yearNum=moment(newMonthDt).format("YYYY");
    var newMonth = yearNum+"-"+newMonthNumber;
    this.setState({
        monthlyState:newMonth,
    },()=>{
      if(this.state.search){
        this.searchData()
      }else{
        if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
      }
    });
  }

  fromdates(event){
    var selectedDate1 = $("input#fromdate").val();
    
    var dd = new Date(selectedDate1).getDate();
    var mm = new Date(selectedDate1).getMonth()+1; //January is 0!
    var yyyy = new Date(selectedDate1).getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    var Fromdate = yyyy+'-'+mm+'-'+dd;
    this.setState({
        fromdate:Fromdate,
    },()=>{
      if(this.state.search){
        this.searchData()
      }else{
        if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
      }
    });
  }

  todates(event){
    var selectedDate2 = $("input#todate").val();
    var dd       = new Date(selectedDate2).getDate();
    var mm       = new Date(selectedDate2).getMonth()+1; //January is 0!
    var yyyy     = new Date(selectedDate2).getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    var Todate = yyyy+'-'+mm+'-'+dd;
   var dateCompare =  moment(Todate).isAfter(this.state.fromdate);
   if(dateCompare === true){
    this.setState({
        todate:Todate,
    },()=>{
      if(this.state.search){
        this.searchData()
      }else{
        if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
      }
    });
   }else{
    swal('From date should not be less than To date')
    this.setState({
      todate:this.state.fromdate
    },()=>{
      if(this.state.search){
        this.searchData()
      }else{
        if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
      }
    })
   }
  }

  nextYear(event){
    event.preventDefault();
    var currentYear = this.state.currentYear;
    var newYear = moment(currentYear).add(1,'years').format('YYYY');
    this.setState({currentYear: newYear},()=>{
        if(this.state.search){
          this.searchData()
        }else{
          if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
        }
    })
  }

  previousYear(event){
    event.preventDefault();
    var currentYear = this.state.currentYear;
    var newYear = moment(currentYear).subtract(1,'years').format('YYYY');
    this.setState({currentYear: newYear},()=>{
        if(this.state.search){
          this.searchData()
        }else{
          if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
        }
    })
  }

  changeTab(value,event){
      this.setState({currentActiveTab:value},()=>{
        if(this.state.search){
          this.searchData()
        }else{
          if(Object.keys(this.state.selector).length == 0){this.getData(this.state.startRange,this.state.limitRange)}else{this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)}
        }
      })
  }

   getFilteredProducts(selector,startRange,limitRange){
    var formValues ={
            startDate   : "",
            endDate     : "",
            startRange  : startRange,
            limitRange  : limitRange,
            selector
        }
        var currentActiveTab = this.state.currentActiveTab;
        if(currentActiveTab === "Daily"){
            var todayDateSelected = this.state.todayDate;
            var startDate = moment(todayDateSelected).startOf('day'); // set to 12:00 am today
            var endDate = moment(todayDateSelected).endOf('day'); // set to 23:59 pm today
            formValues.startDate    = new Date(startDate);
            formValues.endDate      = new Date(endDate);
        }else if(currentActiveTab === "Weekly"){
            var weekData = this.state.weekdays;
            var mondayInWeek = moment(weekData).day("Monday").week(weekData).format();
            var mondayInWeekDt = new Date(mondayInWeek);
            var sundayOfWeek = moment(mondayInWeek).add(7,"days").format();
            var sundayOfWeekDt = new Date(sundayOfWeek);
            formValues.startDate = mondayInWeekDt;
            formValues.endDate   = sundayOfWeekDt;
        }else if(currentActiveTab === "Monthly"){
            var selectedMonth = this.state.monthlyState;
            var monthDateStart = new Date(moment(selectedMonth).month("YYYY-MM"));//Find out first day of month with selectedMonth
            var monthDateEnd = new Date(moment(selectedMonth).add(1,"M"));
            formValues.startDate = monthDateStart;
            formValues.endDate   = monthDateEnd;
        }else if(currentActiveTab === "Yearly"){
            var selectedYear = this.state.currentYear;
            var yearDateStart = new Date("1/1/" + selectedYear);
            var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);
            formValues.startDate = yearDateStart;
            formValues.endDate   = yearDateEnd;
        }else if(currentActiveTab === "Custom"){
            var fromDate = this.state.fromdate;
            var todate    = this.state.todate;
            formValues.startDate = new Date(fromDate);
            formValues.endDate   = new Date(todate);
        }
      axios.post('/api/reports/get/filtereduserlist',formValues)
      .then((response) => {
        console.log("response",response);
         var tableData = response.data.map((a, i)=>{
          var calculatedAge = a.person.length > 0 ?( a.person[0].DOB ? parseInt(moment(new Date).format('YYYY') - moment(a.person[0].DOB).format("YYYY") ) : " - "):"-";
          return{
             
                fullName:a.profile.fullName,
                companyName:a.profile.companyName ? a.profile.companyName : " - ",//a.vendor[0] ? a.vendor[0].companyName : 'NA',
                gender:a.person.length > 0 ? (a.person[0].gender ? a.person[0].gender : " - ") : " - ",
                age: calculatedAge,
                email:a.profile.email,
                phone:a.profile.mobile,
                state:a.person.length > 0 ? (a.person[0].address && a.person[0].address.length > 0 ? a.person[0].address[0].state :"-") : "-",
                city:a.person.length > 0 ? (a.person[0].address && a.person[0].address.length > 0 ? a.person[0].address[0].city :"-") : "-",
                status:a.profile.status,
                registeredOn:moment(a.createdAt).format('DD/MM/YYYY'),
                lastLogin:moment(a.createdAt).format('DD/MM/YYYY'),
          }
        })
          this.setState({RecordsTable:tableData})
      })
      .catch((error) =>{
          console.log("ERROR : ", error); 
      })
  }


  	/*=========== getData() ===========*/
  	getData(startRange,limitRange){ 

    	this.setState({reset:false})
        
        var companyNames 	= [];
        var stateArray 		= [];
        var companyNamesALL = [];
        var stateArrayAll 	= [];
        var cityArrayAll 	= [];
        var cityArray 		= [];
        var statusArray 	= [];
        var statusArrayAll 	= [];
        
        var formValues ={
            startDate   : "",
            endDate     : "",
            startRange  : startRange,
            limitRange  : limitRange
        }
        var currentActiveTab = this.state.currentActiveTab;
        
        if(currentActiveTab === "Daily"){
            var todayDateSelected 	= this.state.todayDate;
            var startDate 			= moment(todayDateSelected).startOf('day'); // set to 12:00 am today
            var endDate 			= moment(todayDateSelected).endOf('day'); // set to 23:59 pm today
            formValues.startDate    = new Date(startDate);
            formValues.endDate      = new Date(endDate);

        }else if(currentActiveTab === "Weekly"){
            var weekData 			= this.state.weekdays;
            var mondayInWeek 		= moment(weekData).day("Monday").week(weekData).format();
            var mondayInWeekDt 		= new Date(mondayInWeek);
            var sundayOfWeek 		= moment(mondayInWeek).add(7,"days").format();
            var sundayOfWeekDt 		= new Date(sundayOfWeek);
            formValues.startDate 	= mondayInWeekDt;
            formValues.endDate   	= sundayOfWeekDt;

        }else if(currentActiveTab === "Monthly"){
            var selectedMonth 		= this.state.monthlyState;
            var monthDateStart 		= new Date(moment(selectedMonth).month("YYYY-MM"));//Find out first day of month with selectedMonth
            var monthDateEnd 		= new Date(moment(selectedMonth).add(1,"M"));
            formValues.startDate 	= monthDateStart;
            formValues.endDate   	= monthDateEnd;

        }else if(currentActiveTab === "Yearly"){
            var selectedYear 		= this.state.currentYear;
            var yearDateStart 		= new Date("1/1/" + selectedYear);
            var yearDateEnd 		= new Date (yearDateStart.getFullYear(), 11, 31);
            formValues.startDate 	= yearDateStart;
            formValues.endDate   	= yearDateEnd;

        }else if(currentActiveTab === "Custom"){
            var fromDate 			= this.state.fromdate;
            var todate    			= this.state.todate;
            formValues.startDate 	= new Date(fromDate);
            formValues.endDate   	= new Date(todate);
        }

        var status = this.state.status;
        console.log("formValues",formValues)
        
        // axios.post('/api/reports/get/userlist',formValues)
        axios.post(this.state.dataApiUrl,formValues)
      	.then((response) => {
	        console.log("response=>",response)
	        
	        var tableData = response.data.map((a, i)=>{
	           	statusArrayAll.push(a.profile.status);
	           	statusArray = Array.from(new Set(statusArrayAll))

	          	if(a.profile.companyName){
	            	companyNamesALL.push(a.profile.companyName);
	            	companyNames = Array.from(new Set(companyNamesALL));
	          	}

	          	if(a.person.length > 0 && a.person[0].address ){
		            if( a.person[0].address.length > 0 && a.person[0].address[0].state!==undefined ){
		              stateArrayAll.push(a.person[0].address[0].state)
		              cityArrayAll.push(a.person[0].address[0].city)
		              stateArray = Array.from(new Set(stateArrayAll))
		              cityArray = Array.from(new Set(cityArrayAll))
		            }
	        	}
        		var calculatedAge = a.person.length > 0 ?( a.person[0].DOB ? parseInt(moment(new Date).format('YYYY') - moment(a.person[0].DOB).format("YYYY") ) : " - "):"-";
        		return{           
	              fullName:a.profile.fullName,
	              companyName:a.profile.companyName ? a.profile.companyName : " - ",//a.vendor[0] ? a.vendor[0].companyName : 'NA',
	              gender:a.person.length > 0 ? (a.person[0].gender ? a.person[0].gender : " - ") : " - ",
	              age: calculatedAge,
	              email:a.profile.email,
	              phone:a.profile.mobile,
	              state:a.person.length > 0 ? (a.person[0].address && a.person[0].address.length > 0 ? a.person[0].address[0].state :"-") : "-",
	              city:a.person.length > 0 ? (a.person[0].address && a.person[0].address.length > 0 ? a.person[0].address[0].city :"-") : "-",
	              status:a.profile.status,
	              registeredOn:moment(a.createdAt).format('DD/MM/YYYY'),
	              lastLogin:moment(a.createdAt).format('DD/MM/YYYY'),
        		}
      		})
          	
          	this.setState({RecordsTable:tableData,companyNames: companyNames,stateArrayList:stateArray,cityArrayList:cityArray,statusArrayList:statusArray})
      	})
      	.catch((error) =>{
          	console.log("ERROR : ", error); 
      	})
    }

  	/*=========== getData() ===========*/
    getCity(data){
      	this.setState(data)
    }

    /*=========== getData() ===========*/
    getCompanyData(data){
      	this.setState(data)
    }

    /*=========== getData() ===========*/
  	showData(){
      	if(Object.keys(this.state.selector).length == 0){
        	this.getData(this.state.startRange,this.state.limitRange)
      	}else{
        	this.getFilteredProducts(this.state.selector,this.state.startRange,this.state.limitRange)
      	}
  	}

    
    getCity(data){
      this.setState(data)
    }

    getCompanyData(data){
      this.setState(data)
    }
    getEntity() {
    var entity = localStorage.getItem("company_Id")
    this.setState({
      entityid : entity
    })

    axios.get('/api/entitymaster/get/' +entity)
      .then((response) => {
        this.setState({
          entityArray: response.data,
        })
      })
      .catch((error) => {

      })
    }


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
		                                      							name 		= "fromDate" 
		                                      							id 			= "fromdate" 
		                                      							type 		= "date" 
		                                      							className 	= "textAlignCenter boxHeight36 form-control" 
		                                      							onChange 	= {this.fromdates.bind(this)}
		                                      							value 		= {this.state.fromdate} 
		                                      						/>
		                                    					</label>
		                                    					<label className="col-lg-6 col-md-6 col-sm-12 col-xs-12 boxBorder">To
		                                      						<input 
		                                      							name 		= "toDate" 
		                                      							id 			= "todate" 
		                                      							type 		= "date" 
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
                      				{this.state.showCustomizedFilters
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
		                    					{/*<div className="form-margin col-lg-3 col-md-6 col-sm-12 col-xs-12 driver employee" >
		                      						<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">State</label>
		                      						<select id="state" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.state} ref="state" name="state" onChange={this.handleChangeFilter.bind(this)}>
		                        						<option selected={true} disabled={true}>{"-- Select --"}</option>
		                        						{this.state.stateArrayList && this.state.stateArrayList.length > 0 
		                        							?
								                                this.state.stateArrayList.map((data, i) => {
								                                  	return (
								                                    	<option >{data}</option>
								                                  	);
								                                })
								                            :
								                                null
								                        }
		                      						</select>
		                    					</div>*/}
		                    					{/*<div className="form-margin col-lg-3 col-md-6 col-sm-12 col-xs-12 driver employee" >
		                      						<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">City</label>
		                      						<select id="city" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.city} ref="city" name="city" onChange={this.handleChangeFilter.bind(this)}>
		                        						<option selected={true} disabled={true}>{"-- Select --"}</option>
		                        						{this.state.cityArrayList && this.state.cityArrayList.length > 0 
		                        							?
								                                this.state.cityArrayList.map((data, i) => {
								                                  	return (
								                                    	<option  value={data}>{data}</option>
								                                  	);
								                                })
		                            						:
		                            							null
		                        						}
		                      						</select>
		                    					</div>
		                      					<div className="form-margin col-lg-3 col-md-6 col-sm-12 col-xs-12 driver employee" >
		                      						<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Status</label>
		                      						<select id="status" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.status} ref="status" name="status" onChange={this.handleChangeFilter.bind(this)}>
		                        						<option selected={true} disabled={true}>-- Select --</option>
		                        						{this.state.statusArrayList && this.state.statusArrayList.length > 0 
		                        							?
							                                	this.state.statusArrayList.map((data, i) => {
							                                  		return (
							                                    		<option value={data}>{data}</option>
							                                  		);
							                                	})
							                                :
							                                	null
							                            }
		                      						</select>
		                    					</div>*/}
		                  					</div>
		                  				:
		                  					null
		                  			}
                  					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                      					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                          					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                              					<IAssureTable
			                                      	tableHeading 	= {this.state.tableHeading}
			                                      	twoLevelHeader 	= {this.state.twoLevelHeader}
			                                      	id 				= {this.state.entityid}
			                                      	dataCount 		= {this.state.RecordsCount}
			                                      	tableData 		= {this.state.RecordsTable}
			                                      	tableObjects 	= {this.state.tableObjects}
			                                      	tableName 		= {this.state.reportTitle}
			                                      	getData 		= {this.getData.bind(this)}
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

