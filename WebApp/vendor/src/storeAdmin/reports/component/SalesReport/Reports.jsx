import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';
import { browserHistory } from 'react-router';

// import { UserSubscriptions } from '/imports/website/contactUs/api/SubscriptionMaster.js';

import ReportsDailyList from '/imports/StoreManagement/reports/component/SalesReport/DailyReports.jsx';
import ReportsWeeklyList from '/imports/StoreManagement/reports/component/SalesReport/WeeklyReports.jsx';
import ReportsMonthlyList from '/imports/StoreManagement/reports/component/SalesReport/MonthlyReports.jsx';
import ReportsYearlyList from '/imports/StoreManagement/reports/component/SalesReport/YearlyReports.jsx';
import ReportsCustomisedList from '/imports/StoreManagement/reports/component/SalesReport/CostomizedReports.jsx';

export default class ReportsList extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            'currentTabView': "Daily",
        }
        window.scrollTo(0, 0);
        
    }

    componentDidMount(){
        this.contactTracker = Tracker.autorun(()=>{
        //    var handle= Meteor.subscribe('usersubscriptionPublish');
       
        //    if(handle.ready()){
                
        //     }
        });
    }

    changeReportComponent(event){
      var currentComp = $(event.currentTarget).attr('data-currentComp');

      this.setState({
        'currentTabView': currentComp,
      })
    }
   
    render(){
        return( 
            <div className="content-wrapper">
              <div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
                <section className="content">
                  <div className="row">
                    <div className="addrol col-lg-12 col-md-12 col-xs-12 col-sm-12">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxtop">


                        <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
                          <div className="NOpadding col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <div className="with-border box-header col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <div className="col-lg-9 col-md-9 col-sm-9 col-sm-8 pdcls">
                                   <h4 className="weighttitle">Sales Report</h4>
                              </div>                                                               
                            </div>
                            <div className="col-md-12">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                               {/* <h1 className="reportTitleName">Sales Report</h1>
                                <hr/>*/}

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="sales-report-main-class">
                                    <div className="sales-report-commonpre">
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Daily" className={this.state.currentTabView == "Daily" ? "sales-report-common sales-report-today report-currentlyActive" : "sales-report-common sales-report-today"}>
                                          Today
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Weekly"  className={this.state.currentTabView == "Weekly" ? "sales-report-common sales-report-thisweek report-currentlyActive" : "sales-report-common sales-report-thisweek"}>
                                        This Week
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Monthly"  className={this.state.currentTabView == "Monthly" ? "sales-report-common sales-report-thismonth report-currentlyActive" : "sales-report-common sales-report-thismonth"}>
                                        This Month
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Yearly"  className={this.state.currentTabView == "Yearly" ? "sales-report-common sales-report-thisyear report-currentlyActive" : "sales-report-common sales-report-thisyear"}>
                                        This Year
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Customised"  className={this.state.currentTabView == "Customised" ? "sales-report-common sales-report-costomised report-currentlyActive" : "sales-report-common sales-report-costomised"}>
                                        Customised
                                        </div>
                                    </div>
                                  </div>
                                </div>

                                
                                {
                                  this.state.currentTabView == "Daily" ? <ReportsDailyList /> : 
                                  this.state.currentTabView == "Weekly" ? <ReportsWeeklyList /> : 
                                  this.state.currentTabView == "Monthly" ? <ReportsMonthlyList /> : 
                                  this.state.currentTabView == "Yearly" ? <ReportsYearlyList /> : 
                                  <ReportsCustomisedList />  
                                }
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
      
              </div>
            
        );
    }
}