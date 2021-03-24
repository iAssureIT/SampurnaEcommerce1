import React, { Component }     from 'react';
import IAssureTable             from "../../coreadmin/IAssureTable/IAssureTable.jsx";
import moment from 'moment';
import $ from 'jquery';
import axios                  from 'axios';

export default class WeeklyReport extends Component{
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
          selectedWeekYear       : '',
          selectedWeek           : '',
          startDate             : '',
          endDate               : '',
          dataCount             : 0
        } 
    }

    componentDidMount(){
        
        axios.get("/api/sections/get/list/")
        .then((response)=>{
          this.setState({ sections : response.data })
        })
        .catch((error)=>{
            console.log('error', error);
        })
        this.setState({
            selectedWeekYear : moment().format('Y')+'-'+moment().format('w')+'W',
            selectedWeek : moment().format('w'),
            startDate   : moment().year(moment().format('Y')).week(moment().format('W')).startOf('week').format('YYYY-MM-DD'),
            endDate     : moment().year(moment().format('Y')).week(moment().format('W')).endOf('week').format('YYYY-MM-DD')
            },
            ()=>{

            var formValues={
                "startTime" : this.state.startDate,
                "endTime"   : this.state.endDate,
                "section"   : null,
                "category"  : null,
                "subcategory" : null
              }
            this.setState({ formValues : formValues} ,()=>{ this.getCount();  });  
 
            this.getData(this.state.startDate, this.state.endDate, this.state.startRange, this.state.limitRange, null, null, null )    
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
    getData(startDate,endDate, startRange,limitRange,section ,category, subcategory){
        var formValues={
              "startTime" : startDate,
              "endTime"   : endDate,
              "section"   : section,
              "category"  : category,
              "subcategory" : subcategory
            }
        this.setState({formValues : formValues},()=>{

            this.getTableData(startRange,limitRange);
        });    
    }
    getTableData(startRange,limitRange){
      axios.post("/api/orders/get/category-wise-report/"+startRange+'/'+limitRange,this.state.formValues)
            .then((response)=>{
              this.setState({ 
                tableData : response.data
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
	previousWeek(event){
		event.preventDefault();
        
        var startDate = moment(this.state.startDate).subtract(1, "week").format('YYYY-MM-DD');

        this.setState({
            selectedWeekYear: moment(startDate).format('Y')+'-'+moment(startDate).format('w')+'W',
            selectedWeek    : moment(startDate).format('w'), 
            startDate       : startDate,
            endDate         : moment(startDate).add(1, "week").format('YYYY-MM-DD')
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.startRange, this.state.limitRange, $('#section').val(), $('#category').val(), $('#subcategory').val() )   
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
            this.getData(this.state.startDate, this.state.endDate, this.state.startRange, this.state.limitRange, $('#section').val(), $('#category').val(), $('#subcategory').val() )   
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
    
    getSearchText(searchText, startRange, limitRange){
        this.setState({
            tableData : []
        });
    }
    handleSection(event){
      this.getData(this.state.startDate, this.state.endDate, this.state.startRange, this.state.limitRange, event.target.value, null, null);
    
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
        this.getData(this.state.startDate, this.state.endDate, this.state.startRange, this.state.limitRange, $('#section').val(), event.target.value, null);
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
      this.getData(this.state.startDate, this.state.endDate, this.state.startRange, this.state.limitRange, $('#section').val(), $('#category').val(), event.target.value);
    }
    render(){
        if(!this.props.loading){
            return( 
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 sales-report-main-class">
                    <div className="reports-select-date-boxmain">
                            <div className="reports-select-date-boxsec">
                                <div className="reports-select-date-Title">Weekly Reports</div>
                                <div className="input-group">
                                    <span  onClick={this.previousWeek.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                                    <input  onChange={this.handleChange} name="inputweekpicker" value={this.state.selectedWeekYear}  type="text" className="reportsDateRef inputweekpicker form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="inputweekpicker"  />
                                    <span onClick={this.nextWeek.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
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
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                            <div className="row tablebg">   
                            {
                            <IAssureTable 
                                tableHeading={this.state.tableHeading}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                dataCount={this.state.dataCount}
                                tableData={this.state.tableData}
                                getData={this.getTableData.bind(this)}
                                tableObjects={this.state.tableObjects}
                            />
                            }
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
// export default WeeklyListContainer = withTracker(props =>{
// var weekNumFromSess = Session.get("selectedWeek");
        
// var mondayInWeek = moment(weekNumFromSess).format();

// var mondayInWeekDt = new Date(mondayInWeek);
// var sundayOfWeek = moment(mondayInWeek).add(7,"days").format();
// var sundayOfWeekDt = new Date(sundayOfWeek);

// const reportHandle = Meteor.subscribe("OrdersData");
// var reportData = [];
// if(props.selectedCategory){
//     if(props.selectedSubCategory){
//         reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory, subCategory: props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
//     }else{
//         reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid',  "products": { $elemMatch: { category: props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
//     }
// }else{
//     reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
// }
// const loading = !reportHandle.ready();
// return{
//     loading,
//     reportData,
// };
// })(CategoryWiseReportsWeeklyList);