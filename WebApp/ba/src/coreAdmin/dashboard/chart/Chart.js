import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import html2canvas from 'html2canvas';
import Chart from 'chart.js';
import './Chart.css';

// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class Charts extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
  }
   
  componentDidMount(){
    var ctx = document.getElementById('myChart');
    var data = {
      datasets: [{
          data: [30, 40, 20, 10]
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'New',
          'Dispatched',
          'Pending',
          'Returned'
      ]
    };
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data
    });

    var ctx2 = document.getElementById('myChart2');
    var data2 = {
      datasets: [
                {
                    data: [20, 40, 30, 10]
                }
                ],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Credit Card',
          'Debit Card',
          'COD',
          'Pending'
      ]
    };
    var myPieChart2 = new Chart(ctx2, {
      type: 'pie',
      data: data2,
      options:{color: [
                    'red',    // color for data at index 0
                    'blue',   // color for data at index 1
                    'green',  // color for data at index 2
                    'black',  // color for data at index 3
                    //...
                ]}
    });

    var ctx3 = document.getElementById('myBarChart');
    var data3 = {
      datasets: [
                {
                    data: [20, 40, 30, 10]
                }
                ],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Grocery',
          'Clothes',
          'Accessories',
          'Furniture'
      ]
    };

    var myBarChart = new Chart(ctx3, {
        type: 'bar',
        data: data3,  
    });

    var ctx4 = document.getElementById('myBarChart2');
    var data4 = {
      datasets: [
                {
                    data: [20, 40, 30, 10]
                }
                ],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Area 1',
          'Area 2',
          'Area 3',
          'Area 4'
      ]
    };

    var myBarChart2 = new Chart(ctx4, {
        type: 'bar',
        data: data4,  
    });
  }

    
  render(){ 
    return(
      <div>
      <div className="row">
        <div className="col-lg-12">
            <div className="col-lg-6">
              <div className="box2">
                  <div className="box1a">
                    <h4>Order Dispatch Summary</h4>
                    <canvas id="myChart"></canvas>
                  </div>
              </div>
            </div>
            <div className="col-lg-6" style={{paddingLeft:'0px'}}>
              <div className="box2">
                  <div className="box1a">
                    <h4>Payment Model - Distribution</h4>
                    <canvas id="myChart2"></canvas>
                  </div>
              </div>
            </div>
        </div>
      </div>  
        <br/>
      <div className="row">
        <div className="col-lg-12">
          <div className="col-lg-6">
            <div className="box2">
                <div className="box1a">
                  <h4> Productwise - Dispatch Status (IN NOS)</h4>
                  <canvas id="myBarChart"></canvas>
                </div>
            </div>
          </div>
          <div className="col-lg-6" style={{paddingLeft:'0px'}}>
            <div className="box2">
                <div className="box1a">
                  <h4>Areawise Customer Distribution (IN NOS) </h4>
                  <canvas id="myBarChart2"></canvas>
                </div>
            </div>
          </div>
        </div>
      </div>
        
      </div>
      );
  }
}
