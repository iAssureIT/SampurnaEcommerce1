import React,{Component} from 'react';
import { render } from 'react-dom';
import moment     from 'moment';
import axios                  from 'axios';
import jQuery, { isNumeric, data } from 'jquery';
import $ from 'jquery';
import Statistics     from './StatisticsBox/Statistics.js'
import PieChart       from './Charts/PieChart.js'
import BarChart       from './Charts/BarChart.js'
import GoogleMapChart from './Charts/GoogleMapChart.js'
import HorizontalBar  from './Charts/HorizontalBarChart.js'
import Report         from './Reports/Report.js'
import ProgressBlock  from './ProgressBlock/ProgressBlock.js'

export default class Dashboard extends Component{
	constructor(props) {
	   super(props);
	    this.state = {
	      monthStart       : "",
	      monthEnd         : "",
	      yearStart        : "",
        yearEnd          : "",
        fromToDateObj    : {}, 
        yearObj          : {},
        orderFilterData  : {},
        franchiseID      : '',
        franchiseName    : '',
        franchiseLatLong : '',
        todayDate        : moment(new Date()).format('YYYY-MM-DD'),
        startOfWeek      : "",
        endOfWeek        : ""
	    }
  }
  
	componentDidMount(){
    $('.dashboard-component').removeClass('BM-dashbord');
    $('.dashboard-component').removeClass('billTable');
    var userDetails = (localStorage.getItem('userDetails'));
    var userData = JSON.parse(userDetails);
    axios.get("/api/entitymaster/getCompany/"+userData.companyID)
      .then((resdata)=>{
      var orderFilterData= {};
      orderFilterData.franchiseID = resdata.data._id;
      this.setState({
        franchiseID     : resdata.data._id,
        orderFilterData : orderFilterData,
        franchiseName   : resdata.data.companyName,
        franchiseLatLong : resdata.data.locations
      })
     // console.log("franchiseLatLong",this.state.franchiseLatLong)
     })
    var yyyy = moment().format("YYYY");
    var monthNum = moment().format("MM");
    var currentMonth = yyyy+"-"+monthNum;

    var monthDateStart = new Date(moment(currentMonth).month("YYYY-MM"));//Find out first day of month with currentMonth
    var monthDateEnd = new Date(moment(currentMonth).add(1,"M"));
    this.setState({
      monthStart:moment(monthDateStart).format('YYYY-MM-DD'),
      monthEnd:moment(monthDateEnd).format('YYYY-MM-DD'),
      fromToDateObj : {'startDate':monthDateStart,'endDate':monthDateEnd}
    });

    var currentYear = moment().format('YYYY');
    var yearDateStart = new Date("1/1/" + currentYear);
    var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);
    var startDate = new Date(yearDateStart);
    var endDate = new Date(yearDateEnd);
    var startDateString = moment(startDate).format('YYYY-MM-DD'); // 2016-07-15
    var endDateString = moment(endDate).format('YYYY-MM-DD'); // 2016-07-15

    var startOfWeek = moment().startOf('week').toDate();
    var endOfWeek   = moment().endOf('week').toDate();
  //  console.log("startOfWeek",startOfWeek,"endOfWeek",endOfWeek);
    this.setState({
      yearStart   : startDateString,
      yearEnd     : endDateString,
      yearObj     : {'startDate':yearDateStart,'endDate':yearDateEnd},
      startOfWeek : moment(startOfWeek).format('YYYY-MM-DD'),
      endOfWeek   : moment(endOfWeek).format('YYYY-MM-DD')
    },()=>{
    })
  }


  render(){
    return(
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
            <section class="content-header">
              <h1>
                Dashboard
                <small></small>
              </h1>
              <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
                <li class="active">Dashboard</li>
              </ol>
           </section>
           <section className="content">
           	<div className="row">
	           	<Statistics 
                display={true}
	           		bgColor="bg-aqua"
	           		faIcon="fa-user"
                firstField={{"Field":"Total Users","method":"get","path":"/api/billingmaster/get/count/contactPersons/"+this.state.franchiseID}}
                secondField={{"Field":"Total Customers","method":"get","path":"/api/billingmaster/get/customersCount/"+this.state.franchiseID}} 
				      />
            
	           	<Statistics 
                display={true}
	           		bgColor="bg-red"
                faIcon="fa-book"
                firstField={{"Field":"Total Categories","method":"get","path":"/api/category/get/count"}}
	           		secondField={{"Field":"Total Products","method":"get","path":"/api/sections/get/count"}}
	           	/>
	           	<Statistics
                display={true}
	           		bgColor="bg-green"
                faIcon="fa fa-building"
                firstField={{"Field":"Digital Orders","method":"get","path":"/api/orders/get/digitalytdorders/"+this.state.franchiseID}}
                secondField={{"Field":"In-store Orders","method":"get","path":"/api/orders/get/inStoreBillCounts/"+this.state.franchiseID}} 
	           	/>
	           	<Statistics 
                display={true}
	           		bgColor="bg-yellow"
	           		faIcon="fa-file"
	           		firstField={{"Field":"Total PO","method":"get","path":"/api/franchisepo/get/count/"+this.state.franchiseID}}
	           		secondField={{"Field":"Total Stock","method":"get","path":"/api/franchisegoods/get/totalFranchiseStock/"+this.state.franchiseID,"showUnit":true}} 
	            />
           	</div>
            <div className="row">
              <Report
                display={true}
                tableHeading={["Order Id","Item","Distance","Amount","Status"]}
                boxColor="box-primary"
                title="Latest Orders"
                api={{"method":"post","path":"/api/orders/get/get_orders","PostData":this.state.orderFilterData,"address":this.state.franchiseLatLong[0]}}
                redirectlink="/allorders" />
              <div className="row">
                <ProgressBlock 
                  display={true}
                  bgColor="bg-yellow"
                  faIcon="fa-calendar-check-o"
                  Field={{"FieldName":"Daily Orders","method":"get","path":"/api/orders/get/franchise-daily-orders-count/"+this.state.franchiseID+'/'+this.state.todayDate+'/'+this.state.todayDate}}
                  compairField={{"method":"get","path":"/api/orders/get/franchise-daily-orders-count/"+this.state.franchiseID+'/'+this.state.startOfWeek+'/'+this.state.endOfWeek}}
                />
                <ProgressBlock 
                  display={true}
                  bgColor="bg-green"
                  faIcon="fa-calendar-check-o"
                  Field={{"FieldName":"Weekly Orders","method":"get","path":"/api/orders/get/franchise-daily-orders-count/"+this.state.franchiseID+'/'+this.state.startOfWeek+'/'+this.state.endOfWeek}}
                  compairField={{"method":"get","path":"/api/orders/get/franchise-daily-orders-count/"+this.state.franchiseID+'/'+this.state.monthStart+'/'+this.state.monthEnd}}
                />
                {/* <ProgressBlock 
                  display={true}
                  bgColor="bg-red"
                  faIcon="fas fa-ban"
                  Field={{"FieldName":"Out of Stock","method":"get","path":"/api/products/get/outofstockproducts"}}
                  compairField={{"method":"get","path":"/api/products/get/count"}}
                /> */}
                <ProgressBlock 
                  display={true}
                  bgColor="bg-red"
                  faIcon="fa-calendar-check-o"
                  Field={{"FieldName":"Monthly Orders","method":"get","path":"/api/orders/get/franchise-daily-orders-count/"+this.state.franchiseID+'/'+this.state.monthStart+'/'+this.state.monthEnd}}
                  compairField={{"method":"get","path":"/api/orders/get/franchise-daily-orders-count/"+this.state.franchiseID+'/'+this.state.yearStart+'/'+this.state.yearEnd}}
                />
                <ProgressBlock 
                  display={true}
                  bgColor="bg-aqua"
                  faIcon="fa-envelope"
                  Field={{"FieldName":"Reviews","method":"get","path":"/api/customerReview/get/UnpublishedCount"}}
                  compairField={{"method":"get","path":"/api/customerReview/get/count"}}
                />
              </div>
            </div>
           	<div className="row">
           	  <BarChart
                display={true}
           			boxColor="box-warning"
           			title="Monthwise Sale"
                 api={{"method":"post","path":"/api/orders/get/getMonthwiseOrders/" ,"PostData":{"startDate":this.state.yearStart,"endDate":this.state.yearEnd,"franchiseID":this.state.franchiseID}}}/>
              <PieChart
                display={true}
           			boxColor="box-success"
           			title="Sectionwise Sale"
                api={{"method":"get","path":"/api/orders/get/franchiseSectionRevenue/"+this.state.franchiseID}} />
           	</div>
             <div className="row">
           
              <HorizontalBar
                display={true}
           			boxColor="box-success"
           			title="Monthwise Top 10 Products Sale"
                api={{"method":"get","path":"/api/orders/get/franchiseTopProductsSale/"+this.state.franchiseID+'/'+this.state.monthStart+'/'+this.state.monthEnd}} />
              <PieChart
                display={true}
           			boxColor="box-danger"
           			title="Categorywise Sale"
                api={{"method":"get","path":"/api/orders/get/franchiseCategoryRevenue/"+this.state.franchiseID}} />
           	</div>
           </section>
        </div>
   );
  }
}




