import React, { Component } from 'react';
import IAssureTable         from "../../coreadmin/IAssureTable/IAssureTable.jsx";
import $ from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import moment from 'moment';
import './CustomisedReport.css';
import 'font-awesome/css/font-awesome.min.css';

export default class CustomisedReport extends Component{
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
            downloadApply       : true
          },
          "startRange"          : 0,
          "limitRange"          : 10,
          fields                : {},
          errors                : {},
          startDate             : '',
          endDate               : '',
          dataCount             : 0,
          "tableName"           :"Customised"
            
        }
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        
    }

    componentDidMount(){
        var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
        var token         = userDetails.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
        
        this.setState({
            startDate : moment().subtract(1, 'week').format('YYYY-MM-DD'),
            endDate   : moment().format('YYYY-MM-DD')
        },()=>{
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
    getData(startRange,limitRange){
        var formvalues = {
          startDate : this.state.startDate,
          endDate   : this.state.endDate
        }
        axios.post("/api/orders/get/report/"+startRange+'/'+limitRange, formvalues)
        .then((response)=>{
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
    handleFromChange(event){
    event.preventDefault();
       this.setState({
            startDate : moment(event.target.value).format('YYYY-MM-DD')
        },()=>{
            this.getData(this.state.startRange, this.state.limitRange )
        })
    }
    handleToChange(event){
    event.preventDefault();
       this.setState({
            endDate : moment(event.target.value).format('YYYY-MM-DD')
        },()=>{
            this.getData(this.state.startRange, this.state.limitRange )
        })
    }

    currentFromDate(){
        // if(Session.get('newFromDate')){
        //     var today = Session.get('newFromDate');
        // } else {
        //     var today = new Date();
        // }
        // var dd = today.getDate();
        // var mm = today.getMonth()+1; //January is 0!
        // var yyyy = today.getFullYear();
        // if(dd<10){
        //     dd='0'+dd;
        // }
        // if(mm<10){
        //     mm='0'+mm;
        // }
        // var today = yyyy+'-'+mm+'-'+dd;
        // var today = yyyy+'-'+mm+'-'+dd;

        // return today;
    }

    currentToDate(){
        // if(Session.get('newToDate')){
        //     var today = Session.get('newToDate');
        // } else {
        //     var today = new Date();
        // }
        // // var today = new Date();
        // var dd = today.getDate();
        // var mm = today.getMonth()+1; //January is 0!
        // var yyyy = today.getFullYear();
        // if(dd<10){
        //     dd='0'+dd;
        // }
        // if(mm<10){
        //     mm='0'+mm;
        // }
        // var today = yyyy+'-'+mm+'-'+dd;
        // var today = yyyy+'-'+mm+'-'+dd;

        // return today;
    }

    dataTableList(){
		
        
  //       var selectedDateFrom = Session.get('newFromDate');
		// if(selectedDateFrom){
		// 	var newDateFrom  = new Date(selectedDateFrom);
		// }else{
		// 	var newDateFrom  = new Date();
		// }

  //       var selectedDateTo = Session.get('newToDate');
		// if(selectedDateTo){
		// 	var newDateTo  = new Date(selectedDateTo);
		// }else{
		// 	var newDateTo  = new Date();
  //       }
        
		// var reportData = [];
  //       if(this.props.selectedCategory){
  //           if(this.props.selectedSubCategory){
  //               reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory, subCategory: this.props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
  //           }else{
  //               reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
  //           }
  //       }else{
  //           reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
  //       }
  //       this.setState({
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
                                <div className="reports-select-date-Title">Customized Sales Report</div>
                                <div className="reports-select-date-fromto">
                                    <div className="reports-select-date-from1">
                                        <div className="reports-select-date-from2">
                                            From
                                        </div>
                                        <div className="reports-select-date-from3">
                                            <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" 
                                            value={this.state.startDate} type="date" className="reportsDateRef form-control" placeholder=""  />
                                        </div>
                                    </div>
                                    <div className="reports-select-date-to1">
                                        <div className="reports-select-date-to2">
                                            To
                                        </div>
                                        <div className="reports-select-date-to3">
                                            <input onChange={this.handleToChange} name="toDateCustomised" ref="toDateCustomised" 
                                            value={this.state.endDate} min={this.state.startDate} type="date" className="reportsDateRef form-control" placeholder=""   />
                                        </div>
                                    </div>
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
                                tableName ={this.state.tableName}
                            />
                        </div>
                    </div>
                </div>
                
            );
        }else{
            return(
                <div className="col-sm-12 col-xs-12 col-lg-8 col-lg-offset-4 col-md-12 loadingImg LoaderDiv"><img className="ldrImageforbulk" src="/images/Loadersglms.gif" alt="loading"/></div>
            );
        }
    }
}
// CustomisedList = withTracker(props =>{
//     var selectedDateFrom = Session.get('newFromDate');
//     if(selectedDateFrom){
//         var newDateFrom  = new Date(selectedDateFrom);
//     }else{
//         var newDateFrom  = new Date();
//     }

//     var selectedDateTo = Session.get('newToDate');
//     if(selectedDateTo){
//         var newDateTo  = new Date(selectedDateTo);
//     }else{
//         var newDateTo  = new Date();
//     }
        
//     const reportHandle = Meteor.subscribe("OrdersData");
//     var reportData = [];
//     if(props.selectedCategory){
//         if(props.selectedSubCategory){
//             reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory, subCategory: props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
//         }else{
//             reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
//         }
//     }else{
//         reportData =  Orders.find({'createdAt':{$gte : newDateFrom, $lt : newDateTo }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
//     }
//     const loading = !reportHandle.ready();
// return{
//     loading,
//     reportData,
// };
// })(CategoryWiseReportsCustomisedList);