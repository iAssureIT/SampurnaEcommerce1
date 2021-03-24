import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import BasicInfo from '/imports/StoreManagement/SupplierManagement/supplierOnboarding/basicInfo/BasicInfo.jsx';
import ContactDetails from '/imports/StoreManagement/SupplierManagement/supplierOnboarding/contactDetails/ContactDetails.jsx';
import LocationDetails from '/imports/StoreManagement/SupplierManagement/supplierOnboarding/locationDetails/LocationDetails.jsx';
import Product_Services from '/imports/StoreManagement/SupplierManagement/supplierOnboarding/productServices/Product_Services.jsx';

export default class SupplierOnboardingForm extends TrackerReact(Component) {
   
	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		$("html,body").scrollTop(0);
  	}
  	
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
	
  render() {
    return (

    	<div>
	        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	               
		        <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                  <div className="">
		                    <div className="box-header with-border">
					           	<h4 className="MasterBudgetTitle">Supplier Onboarding Form</h4>
					        </div>
		                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                      <div className="reportWrapper">
		                        <div id="parkingreport" className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                          <ul className="nav nav-pills nav-pillss">
		                            <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls btn1">
								    	<a data-toggle="pill" href="#basicinfo" className="pillss">
								    	<i className="fa fa-info-circle" aria-hidden="true"></i>
								    		Basic Info 
								    	</a>
								    </li>
								    <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls btn2">
								    	<a data-toggle="pill" href="#locationdetails" className="pillss">
								    	<i className="fa fa-map-marker" aria-hidden="true"></i>
								    		Location Details
								    	</a>
								    </li>
								    <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls btn3">
								    	<a data-toggle="pill" href="#contactdetails" className="pillss">
								    	<i className="fa fa-phone" aria-hidden="true"></i>
								    		Contact Details
								    	</a>
								    </li>
								    <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls btn4">
								    	<a data-toggle="pill" href="#productservice" className="pillss">
								    	<i className="fa fa-cube" aria-hidden="true"></i>
								    		Product Service
								    	</a>
								    </li>
		                          </ul>
		                        </div>
		                      </div>
		                    </div>
	                  	  </div>
	                	</div>
	                  </div>
	                </div>
	            </section>
	        </div>
	    </div>
	);
  } 
}