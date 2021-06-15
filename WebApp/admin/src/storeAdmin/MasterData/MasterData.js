import React, {Component} 			from 'react';
import {render}           			from 'react-dom';
import $                  			from "jquery";
import jQuery from 'jquery';
import axios              			from 'axios';
import swal                 		from 'sweetalert';

import Section            			from './sectionManagement/component/SectionManagementNew.js';
import ShippingManagement     		from './shippingManagement/component/ShippingManagement.js';
import TimeManagement         		from './timeManagement/component/TimeManagement.js';
import Category           			from './categoryManagement/component/NewCategoryManagement.js';
import TaxName            			from './TaxName/TaxName.js';
import TaxRate            			from './TaxRate/TaxRate.js';
// import UnitOfMeasurment   		from './UnitOfMeasurment/UnitOfMeasurmentMaster.js';
import UnitOfMeasurment   			from './UnitOfMeasurment/UnitOfMeasurmentMaster.js';
import PhotoGallery       			from './Gallery/component/Gallery.js';
import OrderStatus   				from './orderStatusManagement/OrderStatusMaster.js';
import BannerImages       			from './BannerImages/component/BannerImages.js';
import DistanceRange       			from './DistanceRange/DistanceRange.js';
import OrderDeliveryPolicy      	from './OrderDeliveryPolicy/OrderDeliveryPolicy.js';
import OrderCancellationPolicy      from './OrderCancellationPolicy/OrderCancellationPolicy.js';


// import '../../coreadmin/companysetting/css/CompanySetting.css';

 class MasterData extends Component{
		constructor(props) {
		super(props)

		this.state = {
			companyinformation				: "Company Information",
			// profileCreated            : false,
			editType                  : "",
			editId                    : "",
			oneFieldEditId            : ""
		}
	
	}
	componentDidMount() {
		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
		var token       = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;   

		axios.get("/api/adminPreference/get")
							.then(preference =>{
								console.log("preference = ",preference.data);
								this.setState({
									websiteModel          : preference.data[0].websiteModel,
									showOrderStatus       : preference.data[0].showOrderStatus,
								});
							})
							.catch(error=>{
								console.log("Error in getting adminPreference = ", error);
								if(error.message === "Request failed with status code 401"){
							var userDetails =  localStorage.removeItem("userDetails");
							localStorage.clear();
							swal({  
									title : "Your Session is expired.",                
									text  : "You need to login again. Click OK to go to Login Page"
							})
							.then(okay => {
							if (okay) {
									window.location.href = "/login";
							}
							});
						}
							}) 

			

		if(this.props.match){
			if(this.props.match.params.editId && this.props.match.params.editId !== 'undefined'){
				// console.log("this.props.match.params.editId = ",this.props.match.params.editId);
				this.setState({editId : this.props.match.params.editId},
											()=>{
												console.log("project componentDidMount editId = ",this.state.editId);
											});
			}

			if(this.props.match.params.oneFieldEditId && typeof this.props.match.params.oneFieldEditId !== 'undefined'){
				// console.log("this.props.match.params.oneFieldEditId = ",this.props.match.params.oneFieldEditId);
				this.setState({oneFieldEditId : this.props.match.params.oneFieldEditId},
											()=>{
												// console.log("project componentDidMount oneFieldEditId = ",this.state.oneFieldEditId);
											});

			}
		}


	}
 
	componentDidUpdate(prevProps) {
		if(this.props.match.params.editId !== this.state.editId){
			this.setState({editId : this.props.match.params.editId},
										()=>{
											console.log("global componentDidUpdate editId = ",this.state.editId);
										});
		}
		if(this.props.match.params.oneFieldEditId !== this.state.oneFieldEditId){
			this.setState({oneFieldEditId : this.props.match.params.oneFieldEditId},
										()=>{
											// console.log("project componentDidUpdate oneFieldEditId = ",this.state.oneFieldEditId);
										});
		}
	}

	render() {
		return (
			<div className="container-fluid NOpadding">

					<div className="formWrapper NOpadding">
						<section className="content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
								<div className="row">
									<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact NOpadding">
										<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right ">
												<h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Master Data</h4>
										</div>
									</div>     
									<div className="boxMinHeight boxMinHeighttab addMarginTop">
											<div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 noPadding"> 
												<ul className="nav nav-tabs tabs-left sideways">
													<li className="active col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#Section" data-toggle="tab">  Section Master        </a></li>
													<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#Category" data-toggle="tab">        Category Master      </a></li>
													{/* <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#TaxName" data-toggle="tab">         Tax Name         </a></li>
													<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#TaxRate" data-toggle="tab">         Tax Rate         </a></li> */}
													<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#UnitOfMeasurment" data-toggle="tab">Unit of Measurement Master</a></li>
													{/* <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#distanceRange" data-toggle="tab">Distance Range</a></li> */}
													{/* <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#ShippingManagement" data-toggle="tab">Shipping Master </a></li> */}
													<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#TimeManagement" data-toggle="tab">Time Master </a></li>
													{ this.state.showOrderStatus !== "No" ? <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#OrderStatus" data-toggle="tab">Order Status Master</a></li> : null } 
													<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#OrderDeliveryPolicy" data-toggle="tab">Order Delivery Policy </a></li>
													<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#OrderCancellationPolicy" data-toggle="tab">Order Cancellation Policy </a></li>
													<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#PhotoGallery" data-toggle="tab">Photo Gallery Master</a></li>
													<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#BannerImages" data-toggle="tab">Mobile Banner Images </a></li>
												</ul>   
											</div>                      
											<div className="tab-content col-lg-9 col-md-9 col-xs-12 col-sm-12">   
												<div className="tab-pane active" id="Section">    	<Section            	editId={this.state.editId}/>  </div>
												<div className="tab-pane" id="Category">          	<Category           	editId={this.state.editId} history={this.props.history}/>  </div>
												<div className="tab-pane" id="UnitOfMeasurment">  	<UnitOfMeasurment   	editId={this.state.editId}/>  </div>  
												{/* <div className="tab-pane" id="distanceRange">  		<DistanceRange   		editId={this.state.editId}/>  </div>   */}
												{/* <div className="tab-pane" id="ShippingManagement"> <ShippingManagement 	editId={this.state.editId}/>  </div>   */}
												<div className="tab-pane" id="TimeManagement">    	<TimeManagement     	editId={this.state.editId}/>  </div>  
												<div className="tab-pane" id="PhotoGallery">      	<PhotoGallery       	editId={this.state.editId}/>  </div>  
												{/* {console.log("this.state.websiteModel",this.state.websiteModel)} */}
												{ this.state.showOrderStatus !== "No" ?<div className="tab-pane" id="OrderStatus"><OrderStatus editId={this.state.editId}/></div>  :null}
												{/* <div className="tab-pane" id="TaxName">         <TaxName           editId={this.state.editId}/>  </div>
												<div className="tab-pane" id="TaxRate">         <TaxRate           editId={this.state.editId}/>  </div> */}
												{/* <div className="tab-pane" id="UnitOfMeasurment"><UnitOfMeasurment  editId={this.state.editId}/>  </div>   */}
												<div className="tab-pane" id="BannerImages"><BannerImages editId={this.state.editId}/>  </div>  
												<div className="tab-pane" id="OrderDeliveryPolicy"><OrderDeliveryPolicy editId={this.state.editId}/>  </div> 												
												<div className="tab-pane" id="OrderCancellationPolicy"><OrderCancellationPolicy editId={this.state.editId}/>  </div> 												
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
export default MasterData;