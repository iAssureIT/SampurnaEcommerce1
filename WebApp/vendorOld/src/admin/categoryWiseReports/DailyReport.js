import React, { Component }   from 'react';
import axios                  from 'axios';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
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
    this.getData(event.currentTarget.value, this.state.startRange, this.state.limitRange, $('#section').val(), $('#category').val(), $('#subcategory').val()); 
    })
  }
       
  getData(startDate,startRange,limitRange,section,category, subcategory){
    var formValues={
      "startTime" : startDate,
      "endTime"   : startDate,
      "section"   : section,
      "category"  : category,
      "subcategory" : subcategory
    }
    
    this.setState({formValues : formValues},()=>{
        this.getTableData(startRange,limitRange);
    });
  }
  getTableData(startRange,limitRange){
    
    axios.post("/api/orders/get/category-wise-report/"+startRange+'/'+limitRange, this.state.formValues)
    .then((response)=>{
      this.setState({ 
        tableData : response.data
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }
  getCount(){
    axios.post("/api/orders/get/category-wise-report-count", this.state.formValues)
    .then((response)=>{
      this.setState({ 
        dataCount : response.data.dataCount
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }
  componentWillReceiveProps(nextProps){
    
  }

  componentDidMount() {
     
    axios.get("/api/sections/get/list/")
    .then((response)=>{
      this.setState({ sections : response.data })
    })
    .catch((error)=>{
        console.log('error', error);
    })
    document.getElementsByClassName('reportsDateRef').value = moment().startOf('day').format("DD/MM/YYYY") ;
    
    
    this.setState({ currentDate:moment().startOf('day').format("YYYY-MM-DD") },()=>{
      var formValues={
          "startTime" : this.state.currentDate,
          "endTime"   : this.state.currentDate,
          "section"   : null,
          "category"  : null,
          "subcategory" : null
        }
        this.setState({ formValues : formValues} ,()=>{ this.getCount();  });
        
        this.getData(this.state.currentDate, this.state.startRange, this.state.limitRange, null, null, null); 
    });
  }

  
  previousDate(event){
    event.preventDefault();

    var selectedDate1 = $(".reportsDayRef").val();

    this.setState({currentDate: moment(selectedDate1).subtract(1, "days").format("YYYY-MM-DD")}, () => {
        this.getData(this.state.currentDate, this.state.startRange, this.state.limitRange, $('#section').val(), $('#category').val(), $('#subcategory').val());
    }) 
  }
  nextDate(event){
    event.preventDefault();

    var selectedDate1 = $(".reportsDayRef").val();

    this.setState({currentDate: moment(selectedDate1).add(1, "days").format("YYYY-MM-DD")}, () => {
        this.getData(this.state.currentDate, this.state.startRange, this.state.limitRange, $('#section').val(), $('#category').val(), $('#subcategory').val());
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
  handleSection(event){
    this.getData(this.state.currentDate, this.state.startRange, this.state.limitRange, event.target.value, null, null);
    axios.get("/api/category/get/list/"+event.target.value)
    .then((response)=>{
      this.setState({ 
        categories : response.data
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }
  handleCategory(event){
    this.getData(this.state.currentDate, this.state.startRange, this.state.limitRange, $('#section').val(), event.target.value, null);
    axios.get("/api/category/get/one/"+event.target.value)
    .then((response)=>{
      this.setState({ 
        subcategories : response.data.subCategory
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }

  handleSubCategory(event){
    event.preventDefault();
    this.getData(this.state.currentDate, this.state.startRange, this.state.limitRange, $('#section').val(), $('#category').val(), event.target.value);
  }
  render() {
    
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }

    return (
      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 sales-report-main-class">
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
          <br/>
          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Section 
            </label>
            <select id="section" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" 
              ref="section" name="section" onChange={this.handleSection.bind(this)} >
              <option selected={true} disabled={true}>-- Select --</option>
              {
                this.state.sections && this.state.sections.map((data,index)=>{
                  return(<option value={data._id}>{data.section}</option>);
                })
              }
            </select>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Category 
            </label>
            <select id="category" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" 
              ref="category" name="category" onChange={this.handleCategory.bind(this)} >
              <option selected={true} disabled={true}>-- Select --</option>
              {
                this.state.categories && this.state.categories.map((data,index)=>{
                  return(<option value={data._id}>{data.category}</option>);
                })
              }
            </select>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Subcategory 
            </label>
            <select id="subcategory" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" 
              ref="subcategory" name="subcategory" onChange={this.handleSubCategory.bind(this)} >
              <option selected={true} disabled={true}>-- Select --</option>
              {
                this.state.subcategories && this.state.subcategories.map((data,index)=>{
                  return(<option value={data._id}>{data.subCategoryTitle}</option>);
                })
              }
            </select>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt" >
            <div className="row tablebg">  
              {<IAssureTable 
                tableHeading={this.state.tableHeading}
                twoLevelHeader={this.state.twoLevelHeader} 
                dataCount={this.state.dataCount}
                tableData={this.state.tableData}
                getData={this.getTableData.bind(this)}
                tableObjects={this.state.tableObjects}
              />}
            </div>
          </div> 
      </div>
    );
  }
}
export default DailyReport
