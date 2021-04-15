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
        this.setState({
            selectedWeekYear : moment().format('Y')+'-'+moment().format('w')+'W',
            selectedWeek : moment().format('w'),
            startDate   : moment().year(moment().format('Y')).week(moment().format('W')).startOf('week').format('YYYY-MM-DD'),
            endDate     : moment().year(moment().format('Y')).week(moment().format('W')).endOf('week').format('YYYY-MM-DD')
            },
            ()=>{
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
            console.log('error', error);
        })
    }
    getData(startRange,limitRange){
        var formvalues = {
          startDate : this.state.startDate,
          endDate   : this.state.endDate
        }
        var userDetails = (localStorage.getItem('userDetails'));
        var userData = JSON.parse(userDetails);
        // console.log("userData.companyID===>",userData.companyID)
        axios.get("/api/entitymaster/get/companyName/"+userData.companyID)
        .then((resdata)=>{
            axios.post("/api/orders/get/report/"+resdata.data._id+'/'+startRange+'/'+limitRange, formvalues)
            .then((response)=>{
            this.setState({ 
                tableData : response.data
            },()=>{ 
              //  console.log("tableData",this.state.tableData);
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
    

	previousWeek(event){
		event.preventDefault();
        
        var startDate = moment(this.state.startDate).subtract(1, "week").format('YYYY-MM-DD');

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
    dataTableList(){
        // var weekNumFromSess = Session.get("selectedWeek");
        
        // var mondayInWeek = moment(weekNumFromSess).day("Monday").week(weekNumFromSess).format();

        // var mondayInWeekDt = new Date(mondayInWeek);
        // var sundayOfWeek = moment(mondayInWeek).add(7,"days").format();
        // var sundayOfWeekDt = new Date(sundayOfWeek);
        
        // var reportData = [];
        // if(this.props.selectedCategory){
        //     if(this.props.selectedSubCategory){
        //         reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory, subCategory: this.props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
        //     }else{
        //         reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
        //     }
        // }else{
        //     reportData =  Orders.find({'createdAt':{$gte : mondayInWeekDt, $lt : sundayOfWeekDt }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
        // }
        // this.setState({
        //     reportData : reportData
        // });

    }
    
    getSearchText(searchText, startRange, limitRange){
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
                                <div className="reports-select-date-Title">Weekly Reports</div>
                                <div className="input-group">
                                    <span  onClick={this.previousWeek.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                                    <input  onChange={this.handleChange} name="inputweekpicker" value={this.state.selectedWeekYear}  type="text" className="reportsDateRef inputweekpicker form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="inputweekpicker"  />
                                    <span onClick={this.nextWeek.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
                                </div>
                            </div>
                        </div>

                        <div className="report-list-downloadMain">
                            
                            {
                            <IAssureTable 
                                tableHeading={this.state.tableHeading}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                dataCount={this.state.dataCount}
                                tableData={this.state.tableData}
                                getData={this.getData.bind(this)}
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