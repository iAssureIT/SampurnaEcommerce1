import React, { Component }   from 'react';
import $                      from 'jquery';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';

class VendorOnboardingForm extends Component{
   
	componentDidMount(){
		$("html,body").scrollTop(0);
  	}

	
  render() {
    return (

    	<div>
	        <div className="">
	               
		        <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                  <div className="">
		                    <div className="box-header with-border">
					           	<h4 className="MasterBudgetTitle">Vendor Onboarding Form</h4>
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
export default VendorOnboardingForm;
