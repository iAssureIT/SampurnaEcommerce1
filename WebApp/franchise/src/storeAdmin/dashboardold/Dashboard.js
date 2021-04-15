import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Chart from 'chart.js';

import GoogleChart from 'react-google-charts';

import StatusComponent from './StatusComponent/StatusComponent.js'
import ChartComponent  from './chart/Chart.js'
import UpdateComponent from './UpdateComponent/UpdateComponent.js'
import TableComponent  from './TableComponent/TableComponent.js'
import Productlist     from './productlist/Productlist.js'
import Visitorreport   from './Visitorreport/Visitorreport.js'
import Infocomponent   from './Infocomponent/Infocomponent.js'
import './chart/Chart.css';
import moment from 'moment';
import $ from 'jquery';
import axios                  from 'axios';

// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class Dashboard extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      "currentTabView"  : "Today",
      "userCount"       : 0,
      "onlineUserCount" : 0,
      "categoriesCount" : 0,
      "productCount"    : 0,
      "ytdorders"       : 0,
      "mtdorders"       : 0,
      "ytdreviews"      : 0,
      "mtdreviews"      : 0,
      "totalorders"     : 0,
      "neworderscount" : 0,
      "ReturnPendingCount" : 0,
      "returnCount" : 0,
      "outofstock"      : 0,
      "ReviewCount": 0,
      "UnpublishedReviewCount": 0,
      "sectionLables"   : [],
      "catLables"       : [],
      "subCatLables"    : [],
      stateData         : []
    }
  }
   
  componentDidMount(){
    var userDetails = (localStorage.getItem('userDetails'));
    var userData = JSON.parse(userDetails);
    // console.log('userData==>>>', userData);


    axios.get("/api/users/get/count")
    .then((response)=>{
      this.setState({ 
        userCount : response.data.dataCount
      },()=>{
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/users/get/activeuserscount")
    .then((response)=>{
      this.setState({ 
        onlineUserCount : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })
    
    axios.get("/api/category/get/count")
    .then((response)=>{
      this.setState({ 
        categoriesCount : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/products/get/count")
    .then((response)=>{
      this.setState({ 
        productCount : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/orders/get/ytdorders")
    .then((response)=>{
      this.setState({ 
        ytdorders : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/orders/get/mtdorders")
    .then((response)=>{
      this.setState({ 
        mtdorders : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })


    axios.get("/api/customerReview/get/ytdreviews")
    .then((response)=>{
      this.setState({ 
        ytdreviews : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/customerReview/get/mtdreviews")
    .then((response)=>{
      this.setState({ 
        mtdreviews : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    
    axios.get("/api/orders/get/count")
    .then((response)=>{
      this.setState({ 
        totalorders : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/orders/get/neworderscount")
    .then((response)=>{
      this.setState({ 
        neworderscount : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/returnedProducts/get/count")
    .then((response)=>{
      this.setState({ 
        returnCount : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })


    axios.get("/api/returnedProducts/get/PendingCount")
    .then((response)=>{
      this.setState({ 
        ReturnPendingCount : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/products/get/outofstockproducts")
    .then((response)=>{
      this.setState({ 
        outofstock : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/customerReview/get/count")
    .then((response)=>{
      this.setState({ 
        ReviewCount : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    axios.get("/api/customerReview/get/UnpublishedCount")
    .then((response)=>{
      this.setState({ 
        UnpublishedReviewCount : response.data.dataCount
      },()=>{ 
      })
    })
    .catch((error)=>{
        console.log('error', error);
    })

    /* totalOrdersByPeriod bar chart */
    this.setState({ currentDate:moment().startOf('day').format("YYYY-MM-DD") },()=>{
      $('#myBarChartWeeklyDiv').hide();
      $('#myBarChartMonthlyDiv').hide();
      $('#myBarChartYearlyDiv').hide();
      $('#myBarChart2YearlyDiv').hide();
      $('#myBarChart3YearlyDiv').hide();
      $('#myBarChart5YearlyDiv').hide();
      this.getBarChart(this.state.currentDate, 'myBarCharDaily');
      this.getBarChart(moment().startOf('Week').format("YYYY-MM-DD"), 'myBarChartWeekly');
      this.getBarChart(moment().startOf('Month').format("YYYY-MM-DD"), 'myBarChartMonthly');
      this.getBarChart(moment().startOf('Year').format("YYYY-MM-DD") , 'myBarChartYearly');
      this.getBarChart(moment(moment().startOf('Year')).subtract(1, 'year'), 'myBarChart2Yearly');
      this.getBarChart(moment(moment().startOf('Year')).subtract(2, 'year'), 'myBarChart3Yearly');
      this.getBarChart(moment(moment().startOf('Year')).subtract(4, 'year'), 'myBarChart5Yearly');
    });

    /*totalOrdersByState horizontal bar chart */
    axios.get("/api/orders/get/totalOrdersByState")
    .then((response)=>{

      var orderByStatesLables = [];
      var orderByStatesData = [];
      var stateData = [];

      stateData.push(["State","Orders"]);

      if (response.data.length > 0) {
        response.data.map((data,index)=>{
        if (data._id) {
          orderByStatesLables.push(data._id);
          orderByStatesData.push(data.count);
          stateData.push([data._id,data.count]);
        }
        })
        
      }else{
        orderByStatesLables = ['Maharashtra', 'Uttar Pradesh', 'Kerala'];
        orderByStatesData = [500, 1000, 200];
        stateData.push(['Maharashtra',500], ['Uttar Pradesh',1000], ['Kerala',200]);
      }
       
      this.setState({stateData:stateData})

      var ordersByStatesctx = document.getElementById("ordersByStates").getContext("2d");
      var ordersByStatesChartData = {
          labels: orderByStatesLables,
          datasets: [{
              label: orderByStatesLables,
              data: orderByStatesData,
              backgroundColor: [ "rgb(40, 167, 69, 1)","rgb(221, 75, 57, 1)", "rgb(0, 123, 255, 1)", "rgb(255, 193, 7,1)", "rgb(108, 117, 125,1)", "rgb(23, 162, 184,1)","rgb(52, 58, 64,1)"],
              borderColor : ['#28a745', "#dd4b39", "#007bff", "#ffc107", "#6c757d", "#17a2b8"],
              borderWidth: 2,
              hoverBackgroundColor: [ "rgb(40, 167, 69, 0.50)","rgb(221, 75, 57, 0.5)", "rgb(0, 123, 255, 0.5)", "rgb(255, 193, 7, 0.5)", "rgb(108, 117, 125,0.5)", "rgb(23, 162, 184,0.5)","rgb(52, 58, 64,0.5)"]
          }],
          options: {
                    responsive: true,
                    legend: {
                        display:false
                    },
                    
                    scales: {
                    xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Total Orders'
                            }
                        }],
                    yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
             
                  } 
      };

      var MeSeChart = new Chart(ordersByStatesctx, {
          type: 'horizontalBar',
          data: ordersByStatesChartData,
          options: {
              scales: {
                  xAxes: [{
                        barThickness: 20,  // number (pixels) or 'flex'
                        maxBarThickness: 30,
                      ticks: {
                      min: 2
                      }
                  }],
                  yAxes: [{
                    barThickness: 20,  // number (pixels) or 'flex'
                    maxBarThickness: 30,
                  }]
              }

          }
      });
      

    })
    .catch((error)=>{
        console.log('error', error);
    })

    
    /* section Revenue Pie chart */
    axios.get("/api/orders/get/sectionRevenue")
    .then((response)=>{
      var sectionLables = [];
      var sectionRevenue = [];
      if (response.data.length > 0) {
        response.data.map((data,index)=>{
          if (data._id) {
            sectionLables.push(data._id);
            sectionRevenue.push(data.revenue);
          }
        })
      }else{
        sectionLables = ["Electronics", "Fashion", "Grocery"];
        sectionRevenue = [1000,500,700];
      }
      
      var sectctx = document.getElementById('SectionChart');
      var sectdata = {
        datasets: [{
            data: sectionRevenue,
            backgroundColor: [ "rgb(40, 167, 69, 1)","rgb(221, 75, 57, 1)", "rgb(0, 123, 255, 1)", "rgb(255, 193, 7, 1)", "rgb(108, 117, 125,1)", "rgb(23, 162, 184,1)","rgb(52, 58, 64,1)"],
            borderColor : ['#28a745', "#dd4b39", "#007bff", "#ffc107", "#6c757d", "#17a2b8"],
            borderWidth: 2,
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: sectionLables
      };
      var myPieChart = new Chart(sectctx, {
        type: 'pie',
        data: sectdata
      });
  })
    /* CategoryRevenue Pie chart */
    axios.get("/api/orders/get/categoryRevenue")
    .then((response)=>{
      var catLables = [];
      var catRevenue = [];
      response.data.map((data,index)=>{
        if (data._id) {
          catLables.push(data._id);
          catRevenue.push(data.revenue);
        }
      })

        var CatChartctx = document.getElementById('CatChart');
        var catdata = {
          datasets: [{
              data: catRevenue,
              backgroundColor: [ "rgb(40, 167, 69, 1)","rgb(221, 75, 57, 1)", "rgb(0, 123, 255, 1)", "rgb(255, 193, 7, 1)", "rgb(108, 117, 125,1)", "rgb(23, 162, 184,1)","rgb(52, 58, 64,1)"],
              borderColor : ['#28a745', "#dd4b39", "#007bff", "#ffc107", "#6c757d", "#17a2b8"],
              borderWidth: 2,
          }],
          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: catLables
        };
        var myPieChart = new Chart(CatChartctx, {
          type: 'pie',
          data: catdata
        });

      })
    /* subCategoryRevenue Pie chart */
    axios.get("/api/orders/get/subCategoryRevenue")
    .then((response)=>{
      var subCatLables = [];
      var subCatRevenue = [];
      response.data.map((data,index)=>{
        if (data._id) {
          subCatLables.push(data._id);
          subCatRevenue.push(data.revenue);
        }
      })

      var SubcatChartctx = document.getElementById('SubcatChart');
      var subcatdata = {
        datasets: [{
            data: subCatRevenue,
            backgroundColor: [ "rgb(40, 167, 69, 1)","rgb(221, 75, 57, 1)", "rgb(0, 123, 255, 1)", "rgb(255, 193, 7, 1)", "rgb(108, 117, 125,1)", "rgb(23, 162, 184,1)","rgb(52, 58, 64,1)"],
            borderColor : ['#28a745', "#dd4b39", "#007bff", "#ffc107", "#6c757d", "#17a2b8"],
            borderWidth: 2,
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: subCatLables
      };
      var myPieChart = new Chart(SubcatChartctx, {
        type: 'pie',
        data: subcatdata
      });
      
    })
    .catch((error)=>{
        console.log('error', error);
    })
    
  }
  changeTab(event){
    event.preventDefault();
    var currentTab = $(event.currentTarget).attr('id');

    this.setState({
      'currentTabView': currentTab,
    });

    if (currentTab === "Today") {
        $('#myBarCharDailyDiv').show();
        $('#myBarChartWeeklyDiv').hide();
        $('#myBarChartMonthlyDiv').hide();
        $('#myBarChartYearlyDiv').hide();
        $('#myBarChart2YearlyDiv').hide();
        $('#myBarChart3YearlyDiv').hide();
        $('#myBarChart5YearlyDiv').hide();
    }
    else if(currentTab === "Week"){
        $('#myBarCharDailyDiv').hide();
        $('#myBarChartWeeklyDiv').show();
        $('#myBarChartMonthlyDiv').hide();
        $('#myBarChartYearlyDiv').hide();
        $('#myBarChart2YearlyDiv').hide();
        $('#myBarChart3YearlyDiv').hide();
        $('#myBarChart5YearlyDiv').hide();
    }
    else if(currentTab === "Month"){
        $('#myBarCharDailyDiv').hide();
        $('#myBarChartWeeklyDiv').hide();
        $('#myBarChartMonthlyDiv').show();
        $('#myBarChartYearlyDiv').hide();
        $('#myBarChart2YearlyDiv').hide();
        $('#myBarChart3YearlyDiv').hide();
        $('#myBarChart5YearlyDiv').hide();
    }
    else if(currentTab === "Year"){
        $('#myBarCharDailyDiv').hide();
        $('#myBarChartWeeklyDiv').hide();
        $('#myBarChartMonthlyDiv').hide();
        $('#myBarChartYearlyDiv').show();
        $('#myBarChart2YearlyDiv').hide();
        $('#myBarChart3YearlyDiv').hide();
        $('#myBarChart5YearlyDiv').hide();
    }
    else if(currentTab === "2Year"){
      var currentDate = moment(moment().startOf('Year')).subtract(1, 'year');

        $('#myBarCharDailyDiv').hide();
        $('#myBarChartWeeklyDiv').hide();
        $('#myBarChartMonthlyDiv').hide();
        $('#myBarChartYearlyDiv').hide();
        $('#myBarChart2YearlyDiv').show();
        $('#myBarChart3YearlyDiv').hide();
        $('#myBarChart5YearlyDiv').hide();
    }
    else if(currentTab === "3Year"){
      var currentDate = moment(moment().startOf('Year')).subtract(2, 'year');

        $('#myBarCharDailyDiv').hide();
        $('#myBarChartWeeklyDiv').hide();
        $('#myBarChartMonthlyDiv').hide();
        $('#myBarChartYearlyDiv').hide();
        $('#myBarChart2YearlyDiv').hide();
        $('#myBarChart3YearlyDiv').show();
        $('#myBarChart5YearlyDiv').hide();
    }
    else if(currentTab === "5Year"){
      var currentDate = moment(moment().startOf('Year')).subtract(4, 'year');

        $('#myBarCharDailyDiv').hide();
        $('#myBarChartWeeklyDiv').hide();
        $('#myBarChartMonthlyDiv').hide();
        $('#myBarChartYearlyDiv').hide();
        $('#myBarChart2YearlyDiv').hide();
        $('#myBarChart3YearlyDiv').hide();
        $('#myBarChart5YearlyDiv').show();
    }
  }
  getBarChart(currentDate, chartId){
      var ctx3 = document.getElementById(chartId);
      return;
      // axios.get("/api/orders/get/totalOrdersByPeriod/"+currentDate)
      // .then((response)=>{
      //     console.log('response.data',response.data.length)
      //     if (response.data.length > 0) {
      //       var barChartData = [];
      //       var barChartLable = [];
      //       response.data.map((data,index)=>{
      //         if (data._id) {
      //           barChartLable.push(data._id);
      //           barChartData.push(data.count);
      //         }
              
      //       })
            
      //       var data3 = {
      //         datasets: [
      //                   {
      //                     label: 'Total Orders',
      //                     data: barChartData,
      //                     backgroundColor: [ "rgb(40, 167, 69, 1)","rgb(221, 75, 57, 1)", "rgb(0, 123, 255,1)", "rgb(255, 193, 7, 1)", "rgb(108, 117, 125,1)", "rgb(23, 162, 184,1)","rgb(52, 58, 64,1)"],
      //                     borderColor : ['#28a745', "#dd4b39", "#007bff", "#ffc107", "#6c757d", "#17a2b8"],
      //                     borderWidth: 2
      //                   }
      //                   ],
      //         // These labels appear in the legend and in the tooltips when hovering different arcs
      //         labels: barChartLable
      //       };

      //       var myBarChart = new Chart(ctx3, {
      //           type: 'bar',
      //           fillOpacity: .3, 
      //           data: data3, 
      //           options: {
      //               responsive: true,
      //               legend: {
      //                   display:false
      //               },
                    
      //               scales: {
      //               xAxes: [{
      //                       display: true,
      //                       barThickness: 20,  // number (pixels) or 'flex'
      //                       maxBarThickness: 30,
      //                       scaleLabel: {
      //                           display: true,
      //                           labelString: 'Categories'
      //                       }
      //                   }],
      //               yAxes: [{
      //                       display: true,
      //                       barThickness: 20,  // number (pixels) or 'flex'
      //                       maxBarThickness: 30, 
      //                       ticks: {
      //                           beginAtZero: true
      //                       }
      //                   }]
      //               },
             
      //             } 
      //       });
      //     }
      //     else{
      //       var data3 = {
      //       datasets: [
      //                 {
      //                   label: 'Total Orders',
      //                   data: [1000,700,900],
      //                   backgroundColor: [ "rgb(40, 167, 69, 1)","rgb(221, 75, 57, 1)", "rgb(0, 123, 255, 1)", "rgb(255, 193, 7, 1)", "rgb(108, 117, 125,1)", "rgb(23, 162, 184,1)","rgb(52, 58, 64,1)"],
      //                   borderColor : ['#28a745', "#dd4b39", "#007bff", "#ffc107", "#6c757d", "#17a2b8"],
      //                   borderWidth: 2
      //                 }
      //                 ],
      //       // These labels appear in the legend and in the tooltips when hovering different arcs
      //       labels: ["Electronics", "Fashion", "Grocery"]
      //     };
      //     var myBarChart = new Chart(ctx3, {
      //             type: 'bar',
      //             // fillOpacity: .2, 
      //             data: data3, 
      //             options: {
      //               responsive: true,
      //               legend: {
      //                   display:false
      //               },
                    
      //               scales: {
      //               xAxes: [{
      //                       display: true,
      //                       barThickness: 20,  // number (pixels) or 'flex'
      //                       maxBarThickness: 30,
      //                       scaleLabel: {
      //                           display: true,
      //                           labelString: 'Categories'
      //                       }
      //                   }],
      //               yAxes: [{
      //                       display: true,
      //                       barThickness: 20,  // number (pixels) or 'flex'
      //                       maxBarThickness: 30,
      //                       ticks: {
      //                           beginAtZero: true
      //                       }
      //                   }]
      //               },
             
      //             } 
      //     });
      //   }
      // })
      // .catch((error)=>{
      //     console.log('error', error);
      // })
  }   
 
  render(){
    
    return(
      <div className="col-lg-10 col-lg-offset-2">
        <div className="row">
        <br/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <h2>Dashboard</h2>
          </div>
          
          <div className="col-lg-3">     
            <div className="dash-box" >
              <span className="infoboxicon bg-aqua"><i className="fa fa-user"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Users</span>
                <span className="info-box-number">{this.state.userCount}</span>
                <span className="info-box-text">Online Users</span>
                <span className="info-box-number">{this.state.onlineUserCount}</span>
              </div>
            </div>
          </div>
          <div className="col-lg-3">     
            <div className="dash-box">
              <span className="infoboxicon bg-redcolor"><i className="fa fa-tag"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Categories</span>
                <span className="info-box-number">{this.state.categoriesCount}</span>
                <span className="info-box-text">Total Products</span>
                <span className="info-box-number">{this.state.productCount}</span>
              </div>
            </div>
          </div> 
          <div className="col-lg-3">  
            <div className="dash-box">
                <span className="infoboxicon bg-green"><i className="fa fa-shopping-cart"></i></span>
                <div className="info-box-content">
                  <span className="info-box-text">YTD Orders</span>
                  <span className="info-box-number">{this.state.ytdorders}</span>
                  <span className="info-box-text">MTD Orders</span>
                  <span className="info-box-number">{this.state.mtdorders}</span>
                </div>
            </div> 
          </div>
          <div className="col-lg-3">     
            <div className="dash-box">
                <span className="infoboxicon bg-yellow"><i className="fa fa-pencil"></i></span>
                <div className="info-box-content">
                  <span className="info-box-text">YTD Reviews</span>
                  <span className="info-box-number">{this.state.ytdreviews}</span>
                  <span className="info-box-text">MTD Reviews</span>
                  <span className="info-box-number">{this.state.mtdreviews}</span>
                </div>
            </div>
          </div>
        </div>
        </div>

        <div className="row">
        <br/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
              <h4>Orders By Categories</h4>
            </div> 
            <div className="box1a box2">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="commonpre">
                  <div id="Today" className= { this.state.currentTabView === "Today" ? "charttab currentlyActive" : "charttab"} onClick={this.changeTab.bind(this)}>
                    Today
                  </div>
                  <div id="Week" className= { this.state.currentTabView === "Week" ? "charttab currentlyActive" : "charttab"} onClick={this.changeTab.bind(this)}>
                    Week
                  </div>
                  <div id="Month" className= { this.state.currentTabView === "Month" ? "charttab currentlyActive" : "charttab"} onClick={this.changeTab.bind(this)}>
                    Month
                  </div>
                  <div id="Year" className= { this.state.currentTabView === "Year" ? "charttab currentlyActive" : "charttab"} onClick={this.changeTab.bind(this)}>
                    1 Year
                  </div>
                  <div id="2Year" className= { this.state.currentTabView === "2Year" ? "charttab currentlyActive" : "charttab"} onClick={this.changeTab.bind(this)}>
                    2 Year
                  </div>
                  <div id="3Year" className= { this.state.currentTabView === "3Year" ? "charttab currentlyActive" : "charttab"} onClick={this.changeTab.bind(this)}>
                    3 Year
                  </div>
                  <div id="5Year" className= { this.state.currentTabView === "5Year" ? "charttab currentlyActive" : "charttab"} onClick={this.changeTab.bind(this)}>
                    5 Year
                  </div>
                </div>
                <br/>
              </div>
              
              <div id="myBarCharDailyDiv">
                <canvas id="myBarCharDaily"></canvas>
              </div>
              <div id="myBarChartWeeklyDiv">
                <canvas id="myBarChartWeekly"></canvas>
              </div>
              <div id="myBarChartMonthlyDiv">
              <canvas id="myBarChartMonthly" ></canvas>
              </div>
              <div id="myBarChartYearlyDiv">
              <canvas id="myBarChartYearly"></canvas>
              </div>
              <div id="myBarChart2YearlyDiv">
              <canvas id="myBarChart2Yearly"></canvas>
              </div>
              <div id="myBarChart3YearlyDiv">
              <canvas id="myBarChart3Yearly"></canvas>
              </div>
              <div id="myBarChart5YearlyDiv">
              <canvas id="myBarChart5Yearly"></canvas>
              </div>
            </div>
          <br/>
          </div>

          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 NoPadding">
          <div className="info-box bg-yellow">
            <div className="">
              <span className="boxicon"><i className="fa fa-shopping-cart"></i></span>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 NoPadding">
              <div className="boxcontent">
                <span className="info-box-text">New Orders</span>
                <span className="info-box-number">{this.state.neworderscount}/ {this.state.totalorders}</span>
                <div className="progress">
                  <div className="progress-bar" style={{ width: (this.state.neworderscount/ this.state.totalorders)*100+"%" }}></div>
                </div>
              </div>
            </div>  
          </div>

          <div className="info-box bg-green">
            <div className="">
              <span className="boxicon"><i className="fa fa-shopping-bag"></i></span>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 NoPadding">
              <div className="boxcontent">
                <span className="info-box-text">Return Products</span>
                <span className="info-box-number">{this.state.ReturnPendingCount}/ {this.state.returnCount}</span>
                <div className="progress">
                  <div className="progress-bar" style={{ width: (this.state.ReturnPendingCount/ this.state.returnCount)*100+"%" }}></div>
                </div>
              </div>
            </div>  
          </div>  

          <div className="info-box bg-redcolor">
            <div className="">
              <span className="boxicon"><i className="fa fa-shopping-bag"></i></span>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 NoPadding">
              <div className="boxcontent">
                <span className="info-box-text">Out of Stock</span>
                <span className="info-box-number">{this.state.outofstock}/ {this.state.productCount}</span>
                <div className="progress">
                  <div className="progress-bar" style={{ width: (this.state.outofstock/ this.state.productCount)*100+"%" }}></div>
                </div>
              </div>
            </div>  
          </div>

          <div className="info-box bg-aqua">
            <div className="">
              <span className="boxicon"><i className="fa fa-pencil"></i></span>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 NoPadding">
              <div className="boxcontent">
                <span className="info-box-text">Reviews</span>
                <span className="info-box-number">{this.state.UnpublishedReviewCount}/ {this.state.ReviewCount}</span>
                <div className="progress">
                  <div className="progress-bar" style={{ width: (this.state.UnpublishedReviewCount/ this.state.ReviewCount)*100+"%" }}></div>
                </div>
              </div>
            </div>  
          </div>
            
          </div>
        </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <div className="box1a box2">
              <h4>Orders by Region</h4>
                <GoogleChart
                width={"100%"}
                height={'300px'}
                chartType="GeoChart"
                data={this.state.stateData}
                responsive= {true}

                /*data={[
                  ['City', 'Popularity'],
                  ['Pune', 700],
                  ['Aurangabad', 300],
                  ['Mumbai', 400]
                  
                ]}*/
                options={{
                  responsive: true,
                  region: 'IN',
                  displayMode: 'regions',
                  resolution: 'provinces',
                  colorAxis: {
                    colors: ["#343a40", "#17a2b8","#6c757d", "#ffc107","#007bff", "#dd4b39", "#28a745"]
                  } 
                 
                }}
                // Note: you will need to get a mapsApiKey for your project.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                mapsApiKey="AIzaSyD1hOxDqrgk8V82oEYXU6W2p_U0-kvvu38"
                rootProps={{ 'data-testid': '1' }}
              />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
              <div className="box1a box2" style={{height:"340px"}}>
              <h4>Top 10 States</h4>
                <canvas id="ordersByStates"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
         <br/>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBottomCss">
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div className="box1a box2">
                <h4>Section Revenue</h4> 
                <canvas id="SectionChart"></canvas>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div className="box1a box2">
                <h4>Category Revenue</h4> 
                <canvas id="CatChart"></canvas>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div className="box1a box2">
                <h4>Subcategory Revenue</h4> 
                <canvas id="SubcatChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <br/>
      </div>  

    );
  }
}
