import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';

export default class ListOfSupplierFilter extends TrackerReact(Component) {

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
	        {/* Content Wrapper. Contains page content */}
	        <div className="content-wrapper">
	               {/*<section className="content-header">
		            <h1>Supplier Onboarding Form</h1>
		           </section>*/}
		           <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="boxMinHeight">
		                    <div className="box-header with-border">
					           	<h3 className="box-title">List Of Suppliers</h3>
					        </div>
					        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					           	<h3 className="box-title1 col-lg-2 col-md-11 col-sm-11 col-xs-12"></h3>
					           	<h5 className="box-title2 col-lg-3 col-md-11 col-sm-11 col-xs-12">Total Suppliers:836</h5>
					           	<h5 className="box-title2 col-lg-3 col-md-11 col-sm-11 col-xs-12">Total Suppliers:836</h5>

					        	 <input type="text" className="searchbox col-lg-1 col-md-2 col-sm-2 col-xs-12 pull-right" placeholder="Search..."/>		        	
					        </div>
					        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					        	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					        	<h5><i className="fa fa-filter" aria-hidden="true"></i>&nbsp;&nbsp;Select Filter</h5>
					        	<hr/>
					        	</div>
					        </div>
					        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					        	<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12">
					        		<button type="button" className="reset col-lg-12 col-md-12 col-sm-12 col-xs-12">RESET FILTER</button>
					        	</div>
					        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
							        	<select className="formcontrola resetinp">
							        	<option value="-">- Country -</option>
							        	</select>
					        	</div>
					        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
							        	<select className="form-control resetinp">
							        	<option value="-">- State -</option>
							        	</select>
					        	</div>
					        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
							        	<select className="form-control resetinp">
							        	<option value="-">- City -</option>
							        	</select>
					        	</div>
					        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
							        	<select className="form-control resetinp">
							        	<option value="-">- Category -</option>
							        	</select>
					        	</div>
					        	<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
							        	<select className="form-control resetinp">
							        	<option value="-">- Status -</option>
							        	</select>
					        	</div>
					        </div>

					        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					        	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 alphabate">
					        	<button type="button" className="btn alphab filterallalphab">All</button>
					        	<button type="button" className="btn alphab">A</button>
					        	<button type="button" className="btn alphab">B</button>
					        	<button type="button" className="btn alphab">C</button>
					        	<button type="button" className="btn alphab">D</button>
					        	<button type="button" className="btn alphab">E</button>
					        	<button type="button" className="btn alphab">F</button>
					        	<button type="button" className="btn alphab">G</button>
					        	<button type="button" className="btn alphab">H</button>
					        	<button type="button" className="btn alphab">I</button>
					        	<button type="button" className="btn alphab">J</button>
					        	<button type="button" className="btn alphab">K</button>
					        	<button type="button" className="btn alphab">L</button>
					        	<button type="button" className="btn alphab">M</button>
					        	<button type="button" className="btn alphab">N</button>
					        	<button type="button" className="btn alphab">O</button>
					        	<button type="button" className="btn alphab">P</button>
					        	<button type="button" className="btn alphab">Q</button>
					        	<button type="button" className="btn alphab">R</button>
					        	<button type="button" className="btn alphab">S</button>
					        	<button type="button" className="btn alphab">T</button>
					        	<button type="button" className="btn alphab">U</button>
					        	<button type="button" className="btn alphab">V</button>
					        	<button type="button" className="btn alphab">W</button>
					        	<button type="button" className="btn alphab">X</button>
					        	<button type="button" className="btn alphab">Y</button>
					        	<button type="button" className="btn alphab">Z</button>
					        	</div>
					        </div>

					        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					        	<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
					        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist">
						        		<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 logoamey">
						        		</div>
						        		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
						        			<h5 className="titleprofile">Ameya Industrial Suppliers</h5>
						        			<ul className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
						        				<li><i className="fa fa-user-o" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-map-marker" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-arrows" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-globe" aria-hidden="true"></i></li>
						        			</ul>
						        			<ul className="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">
						        				<li>Mr.Mahesh Shinde</li>
						        				<li>Pune, Maharashtra,411028</li>
						        				<li>Category: Lorem Ipsum</li>
						        				<li>www.ameygroup.co.in</li>
						        			</ul>					        		
						        		</div>
					        		</div>

					        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist brdtop">
						        		<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 logoamey">
						        		</div>
						        		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
						        			<h5 className="titleprofile">Balaji Enterprises</h5>
						        			<ul className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
						        				<li><i className="fa fa-user-o" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-map-marker" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-arrows" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-globe" aria-hidden="true"></i></li>
						        			</ul>
						        			<ul className="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">
						        				<li>Mr.Mahesh Shinde</li>
						        				<li>Pune, Maharashtra,411028</li>
						        				<li>Category: Lorem Ipsum</li>
						        				<li>www.ameygroup.co.in</li>
						        			</ul>					        		
						        		</div>
					        		</div>

					        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist brdtop">
						        		<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 logoamey">
						        		</div>
						        		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
						        			<h5 className="titleprofile">Global Traders</h5>
						        			<ul className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
						        				<li><i className="fa fa-user-o" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-map-marker" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-arrows" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-globe" aria-hidden="true"></i></li>
						        			</ul>
						        			<ul className="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">
						        				<li>Mr.Mahesh Shinde</li>
						        				<li>Pune, Maharashtra,411028</li>
						        				<li>Category: Lorem Ipsum</li>
						        				<li>www.ameygroup.co.in</li>
						        			</ul>					        		
						        		</div>
					        		</div>

					        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist brdtop">
						        		<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 logoamey">
						        		</div>
						        		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
						        			<h5 className="titleprofile">SSS Services</h5>
						        			<ul className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
						        				<li><i className="fa fa-user-o" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-map-marker" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-arrows" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-globe" aria-hidden="true"></i></li>
						        			</ul>
						        			<ul className="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">
						        				<li>Mr.Mahesh Shinde</li>
						        				<li>Pune, Maharashtra,411028</li>
						        				<li>Category: Lorem Ipsum</li>
						        				<li>www.ameygroup.co.in</li>
						        			</ul>					        		
						        		</div>
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