import React, { Component }   from 'react';
import axios                  from 'axios';
import IAssureTable           from "../../coreadmin/IAssureTable/IAssureTable.jsx";
import moment from 'moment';
import $ from 'jquery';
// axios.defaults.baseURL = 'http://gangaapi.iassureit.com';
// axios.defaults.headers.post['Content-Type'] = 'application/json';


class DailyReport extends Component{
  
  constructor(props){
    super(props); 
   
    this.state = {
      shown                 : true,
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
      currentDate           : '',
      dataCount             : 0
    }
  }
 
  getReport(event){
    event.preventDefault(); 
    this.setState({currentDate : event.currentTarget.value},()=>{
      this.getData(this.state.startRange, this.state.limitRange);  
    })
    
  }
       
  getData(startRange,limitRange){
    var formvalues = {
      startDate : this.state.currentDate,
      endDate   : this.state.currentDate
    }
    var userDetails = (localStorage.getItem('userDetails'));
    var userData = JSON.parse(userDetails);
    //console.log("userData.companyID===>",userData.companyID)
    axios.get("/api/entitymaster/get/companyName/"+userData.companyID)
    .then((resdata)=>{
      axios.post("/api/orders/get/report/"+resdata.data._id+'/'+startRange+'/'+limitRange, formvalues)
      .then((response)=>{
        var tableData = response.data.map((a, i)=>{
          return {
              "orderID"                    : a.orderID,
              "cratedAt"                   : a.createdAt,
              "userFullName"               : a.userFullName,
              "totalAmount"                : '<i className="fa fa-inr"></i>'+ a.total,
              "deliveryStatus"             : a.status +' '+ a.deliveryStatus[0].status,
  
          }
      })

      })
      .catch((error)=>{
          console.log('error', error);
      })
      })
    .catch((error)=>{
        console.log('error', error);
    })
  }
  getCount(){
        
        var formvalues = {
          startDate : this.state.currentDate,
          endDate   : this.state.currentDate
        }
        //console.log('formvalues', formvalues);

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
  componentWillReceiveProps(nextProps){
    
  }

  componentDidMount() {
    document.getElementsByClassName('reportsDateRef').value = moment().startOf('day').format("DD/MM/YYYY") ;
    this.setState({ currentDate:moment().startOf('day').format("YYYY-MM-DD") },()=>{
      this.getCount();  
      this.getData(this.state.startRange, this.state.limitRange);
    });
  }

  
  previousDate(event){
    event.preventDefault();

    var selectedDate1 = $(".reportsDayRef").val();

    this.setState({currentDate: moment(selectedDate1).subtract(1, "days").format("YYYY-MM-DD")}, () => {
        this.getData(this.state.startRange, this.state.limitRange);
    }) 
  }
  nextDate(event){
    event.preventDefault();

    var selectedDate1 = $(".reportsDayRef").val();

    this.setState({currentDate: moment(selectedDate1).add(1, "days").format("YYYY-MM-DD")}, () => {
        this.getData(this.state.startRange, this.state.limitRange);
    }) 
  }
  
  currentDate(){
   //       var setDate = Session.get('newDate');

    // if(setDate){
    //  var today = new Date(setDate);
    // }else{
    //  var today = new Date();
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
    //  var today = yyyy+'-'+mm+'-'+dd;

    // return today;

  }

  render() {
    
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }

    return (
      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
        <div className="sales-report-main-class">
          <div className="reports-select-date-boxmain">
            <div className="reports-select-date-boxsec">
              <div className="reports-select-date-Title">Daily Reports</div>
              <div className="input-group">
                <span onClick={this.previousDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                <input onChange={this.getReport.bind(this)} defaultValue={this.state.currentDate} name="reportsDayRef" type="date" className="reportsDateRef reportsDayRef form-control" 
                ref="reportsDayRef"  />
               
                <span onClick={this.nextDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
              </div>
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >
            <div className="row">  
              {<IAssureTable 
                tableHeading={this.state.tableHeading}
                twoLevelHeader={this.state.twoLevelHeader} 
                dataCount={this.state.dataCount}
                tableData={this.state.tableData}
                getData={this.getData.bind(this)}
                tableObjects={this.state.tableObjects}
              />}
            </div>
          </div> 
        </div>
      </div>
    );
  }
}
export default DailyReport
