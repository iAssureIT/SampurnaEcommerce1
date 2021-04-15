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
import { withTracker }      from 'meteor/react-meteor-data';
// import { UserSubscriptions } from '/imports/website/contactUs/api/SubscriptionMaster.js';
import { Category }         from '/imports/StoreManagement/product/categoryManagement/component/CategoryMaster.js';
import CategoryWiseReportsDailyList from '/imports/StoreManagement/reports/component/CategoryWiseSalesReport/CategoryWiseDailyReports.jsx';
import CategoryWiseReportsWeeklyList from '/imports/StoreManagement/reports/component/CategoryWiseSalesReport/CategoryWiseWeeklyReports.jsx';
import CategoryWiseReportsMonthlyList from '/imports/StoreManagement/reports/component/CategoryWiseSalesReport/CategoryWiseMonthlyReports.jsx';
import CategoryWiseReportsYearlyList from '/imports/StoreManagement/reports/component/CategoryWiseSalesReport/CategoryWiseYearlyReports.jsx';
import CategoryWiseReportsCustomisedList from '/imports/StoreManagement/reports/component/CategoryWiseSalesReport/CategoryWiseCostomizedReports.jsx';

class CategoryWiseReportsList extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            'currentTabView': "Daily",
            'selectedCategory'  :'',
            'selectedSubCategory'  :'',
            'subCategory' : [],
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
    selectCategory(event){
      event.preventDefault();
      var category = this.refs.category.value;

      const categoryData = Category.findOne({"category":category});
      // console.log('category',category,category.subCategory);
      this.setState({
        selectedCategory    : categoryData.category,
        subCategory         : categoryData.subCategory,
        selectSubCategory   : ''
      });
    }
    selectSubCategory(event){
      event.preventDefault();
      this.setState({
        selectSubCategory : this.refs.selectSubCategory.value
      });
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
                                   <h4 className="weighttitle">Category Wise Sales Report</h4>
                              </div>                                                               
                            </div>
                            <div className="col-md-12">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                               <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                 <select className="form-control" id="category" ref="category" name="category" onChange={this.selectCategory.bind(this)}>
                                   <option disabled selected>Select Category</option>
                                   {
                                    this.props.category && this.props.category.length > 0 ?
                                      this.props.category.map((data, index)=>{
                                        return(
                                          <option key={index} value={data.category}>{data.category}</option>
                                        );
                                      })
                                    :
                                    null
                                   }
                                 </select>
                               </div>

                               <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                 <select className="form-control" onChange={this.selectSubCategory.bind(this)} ref="selectSubCategory" name="selectSubCategory" id="selectSubCategory">
                                   <option disabled selected value=''>Select Sub Category</option>
                                   {
                                    this.state.subCategory && this.state.subCategory.length > 0 ?
                                      this.state.subCategory.map((data, index)=>{
                                        return(
                                          <option key={index} value={data.subCategoryTitle}>{data.subCategoryTitle}</option>
                                        );
                                      })
                                    :
                                    null
                                   }
                                 </select>
                               </div>

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
                                  <div className="sales-report-main-class">
                                    <div className="sales-report-commonpre">
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Daily" className={this.state.currentTabView === "Daily" ? "sales-report-common sales-report-today report-currentlyActive" : "sales-report-common sales-report-today"}>
                                          Today
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Weekly"  className={this.state.currentTabView === "Weekly" ? "sales-report-common sales-report-thisweek report-currentlyActive" : "sales-report-common sales-report-thisweek"}>
                                        This Week
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Monthly"  className={this.state.currentTabView === "Monthly" ? "sales-report-common sales-report-thismonth report-currentlyActive" : "sales-report-common sales-report-thismonth"}>
                                        This Month
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Yearly"  className={this.state.currentTabView === "Yearly" ? "sales-report-common sales-report-thisyear report-currentlyActive" : "sales-report-common sales-report-thisyear"}>
                                        This Year
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Customised"  className={this.state.currentTabView === "Customised" ? "sales-report-common sales-report-costomised report-currentlyActive" : "sales-report-common sales-report-costomised"}>
                                        Customised
                                        </div>
                                    </div>
                                  </div>
                                </div>

                                
                                {
                                  this.state.currentTabView === "Daily" ? <CategoryWiseReportsDailyList selectedCategory={this.state.selectedCategory} selectedSubCategory={this.state.selectSubCategory}/> : 
                                  this.state.currentTabView === "Weekly" ? <CategoryWiseReportsWeeklyList selectedCategory={this.state.selectedCategory} selectedSubCategory={this.state.selectSubCategory}/> : 
                                  this.state.currentTabView === "Monthly" ? <CategoryWiseReportsMonthlyList selectedCategory={this.state.selectedCategory} selectedSubCategory={this.state.selectSubCategory}/> : 
                                  this.state.currentTabView === "Yearly" ? <CategoryWiseReportsYearlyList selectedCategory={this.state.selectedCategory} selectedSubCategory={this.state.selectSubCategory}/> : 
                                  <CategoryWiseReportsCustomisedList selectedCategory={this.state.selectedCategory} selectedSubCategory={this.state.selectSubCategory}/>  
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
export default reportContainer = withTracker(props=>{
  const categoryHandle    = Meteor.subscribe("category");
  const category          = Category.find().fetch();
  const loading           = !categoryHandle.ready();

  return{
    category
  };
})(CategoryWiseReportsList);