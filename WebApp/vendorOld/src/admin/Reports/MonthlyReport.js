import React, { Component } from 'react';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import moment from 'moment';
import $ from 'jquery';
import axios                  from 'axios';


export default class MonthlyReport extends Component{
	constructor(props){
        super(props); 
        this.state = {
           "twoLevelHeader"     : {
            apply               : false,
          },
          "tableHeading"        : {
            orderID                    : "Order ID",
            cratedAt                   : "Order Date",
            userFullName               : "Customer Name",
            totalAmount                : "Amount",
            deliveryStatus             : "Delivery Status",

          },
          "tableData"           : [],
          "tableObjects"        : {
            apiLink             : '/api/annualPlans/',
            editUrl             : '/Plan/',
            paginationApply     : true,
          },
          "startRange"          : 0,
          "limitRange"          : 10,
          fields                : {},
          errors                : {},
          selectedYearMonth     : '',
          selectedMonth         : '',
          startDate             : '',
          endDate               : '',
          dataCount             : 0
        }
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount(){
        
        this.setState({
            selectedYearMonth : moment().format('Y')+'-'+moment().format('M'),
            startDate   : moment().startOf('month').format('YYYY-MM-DD'),
            endDate     : moment().endOf('month').format('YYYY-MM-DD')
            },
            ()=>{
            console.log('month',this.state.selectedYearMonth);
            console.log('startDate',this.state.startDate);
            console.log('endDate',this.state.endDate);
            this.getCount();
            this.getData(this.state.startRange, this.state.limitRange )    
        })  
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.reportData){
            this.setState({
                reportData : nextProps.reportData
            });
        }
    }
    handleChange(event){
    event.preventDefault();
       const target = event.target;
       const name = target.name;

       this.setState({
           [name] : event.target.value,
       });
    }
    getCount(){
        var formvalues = {
          startDate : this.state.startDate,
          endDate   : this.state.endDate
        }
        axios.post("/api/orders/get/report-count", formvalues)
        .then((response)=>{
          this.setState({ 
            dataCount : response.data.dataCount
          },()=>{ 
          })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    getData(startRange,limitRange){
        var formvalues = {
          startDate : this.state.startDate,
          endDate   : this.state.endDate
        }
        axios.post("/api/orders/get/report/"+startRange+'/'+limitRange, formvalues)
        .then((response)=>{
          this.setState({ 
            tableData : response.data
          },()=>{ 
            console.log("tableData",this.state.tableData);
          })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    currentMonth(){
        var d = new Date();
        var currentMonth = d.getFullYear()+' - '+d.getMonth();
		return currentMonth;
	}

	previousMonth(event){
		event.preventDefault();
        var startDate = moment(this.state.startDate).subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        
		this.setState({
            selectedYearMonth : moment(startDate).format('Y')+'-'+moment(startDate).format('M'),
            startDate   : startDate,
            endDate     : moment(startDate).endOf('month').format('YYYY-MM-DD')
            },
            ()=>{
            this.getData(this.state.startRange, this.state.limitRange )    
        }) 
	}

	nextMonth(event){
		event.preventDefault();
        var startDate = moment(this.state.startDate).add(1, 'months').startOf('month').format('YYYY-MM-DD');
        
        this.setState({
            selectedYearMonth : moment(startDate).format('Y')+'-'+moment(startDate).format('M'),
            startDate   : startDate,
            endDate     : moment(startDate).endOf('month').format('YYYY-MM-DD')
            },
            ()=>{
            console.log('month',this.state.selectedYearMonth);
            console.log('startDate',this.state.startDate);
            console.log('endDate',this.state.endDate);
            this.getData(this.state.startRange, this.state.limitRange )    
        }) 
	}
   


    dataTableList(){
		// var monthDateFromSess = Session.get("selectedMonth");

  //       var monthDateStart = new Date(moment(monthDateFromSess).month("YYYY-MM"));//Find out first day of month with selectedMonth
  //       var monthDateToEnd = new Date(moment(monthDateFromSess).add(1,"M"));

		// var reportData = [];
  //       if(this.props.selectedCategory){
  //           if(this.props.selectedSubCategory){
  //               reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory, subCategory: this.props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
  //           }else{
  //               reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
  //           }
  //       }else{
  //           reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
  //       }
		// this.setState({
  //           reportData : reportData
  //       });
    }
    
    
    getSearchText(searchText, startRange, limitRange){
        console.log(searchText, startRange, limitRange);
        this.setState({
            tableData : []
        });
    }
    render(){
        if(!this.props.loading){
            return( 
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="sales-report-main-class">
                        <div className="reports-select-date-boxmain">
                            <div className="reports-select-date-boxsec">
                                <div className="reports-select-date-Title">Monthly Reports</div>
                                <div className="input-group">
                                    <span onClick={this.previousMonth.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                                    <input onChange={this.handleChange}  value={this.state.selectedYearMonth} name="inputmonthlyValue" type="text" className="inputmonthlyValue reportsDateRef form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="inputmonthlyValue"  />
                                    <span onClick={this.nextMonth.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
                                </div>
                            </div>
                        </div>

                        <div className="report-list-downloadMain">
                            <IAssureTable 
                                tableHeading={this.state.tableHeading}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                dataCount={this.state.dataCount}
                                tableData={this.state.tableData}
                                getData={this.getData.bind(this)}
                                tableObjects={this.state.tableObjects}
                            />
                            
                        </div>
                    </div>
                </div>            
            );
        }else{
            return(
                <div className="col-sm-12 col-xs-12 col-lg-8 col-lg-offset-4 col-md-12 loadingImg loaderDiv"><img className="ldrImageforbulk" src="/images/loadersglms.gif" alt="loading"/></div>
            );
        } 
    }
}
// export default MonthlyListContainer = withTracker(props =>{
//     var monthDateFromSess = Session.get("selectedMonth");
//     var monthDateStart = new Date(moment(monthDateFromSess).month("YYYY-MM"));
//     var monthDateToEnd = new Date(moment(monthDateFromSess).add(1,"M"));

//     const reportHandle = Meteor.subscribe("OrdersData");
//     var reportData = [];
//     if(props.selectedCategory){
//         if(props.selectedSubCategory){
//             reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory, subCategory: props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
//         }else{
//             reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
//         }
//     }else{
//         reportData =  Orders.find({'createdAt':{$gte : monthDateStart, $lt : monthDateToEnd }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
//     }
//     const loading = !reportHandle.ready();
// return{
//     loading,
//     reportData,
// };
// })(CategoryWiseReportsMonthlyList);