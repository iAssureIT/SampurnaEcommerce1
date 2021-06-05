import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from "moment";
import _                      from 'underscore';
import '../css/viewOrder.css';

class viewOrder extends Component{
	constructor(props) {
		super(props);
		if(!this.props.loading){
			this.state = {
				//  "orderData":[],
				companyInfo:[]
				// "notificationData" :Meteor.subscribe("notificationTemplate"),
			};
		}else{
			this.state = {
				//  "orderData":[],
				companyInfo:[]
			};
		}
		window.scrollTo(0, 0);
	}

	componentDidMount() {
		// console.log('orderID',this.props.match.params.orderID);
		var orderID = this.props.match.params.orderID;
		this.getOneOrder(orderID);
		this.getCompanyDetails(); 
	}

	getOneOrder(orderID){
		axios.get("/api/orders/get/one/"+orderID)
		.then((response)=>{
			console.log('response.data orderID ====>',response.data);
			this.setState({
				orderData : response.data,
				// mobilenum : response.data.deliveryAddress.mobileNumber,
			},()=>{
				console.log("this.state.orderdata => ",this.state.orderData)
			})
		})
		.catch((error)=>{
			console.log('error', error);
		})
	}

	getCompanyDetails() {		  
		axios.get("/api/companysettings/list")
		.then((response) => {
			this.setState({
				companyInfo: response.data[0]
			})
		})
		.catch((error) => {
			console.log('error', error);
		})
	}

	componentWillUnmount() {
		$("body").find("script[src='/js/adminLte.js']").remove();
		if(this.basicPageTracker)
			this.basicPageTracker.stop();
	}

	 
	 
	isEmpty(obj) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	render(){		
		return(         
		  	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			 	<section className="col-lg-12 col-md-12 col-xs-12 col-sm-12 content">
			 		<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent"><br/><br/>
					 	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				  		<div className="backtoMyOrdersDiv">
					 		<a href="/allorders" className="backtoMyOrders"><i class="fa fa-chevron-circle-left"></i> Back to Orders</a>
				 		</div>
				  		<h4 className="weighttitle table-caption">Order Details</h4>
		  
		  				{ this.state.orderData &&  this.state.orderData !== 'undefined'
		  				?			  				
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerbox">
								<p>Ordered on {moment(this.state.orderData.createdAt).format("DD MMMM YYYY")}  | Order {this.state.orderData.orderID}</p>
					 			<div className="col-lg-3 col-md-4 col-sm-4 col-xs-4">
									<strong class="box-title orderDetailTitles">
							 			<p>Shipping Address <br /></p>
									</strong>
									<div className="box-content"> 
										{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.name } <br/>
										{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.addressLine1 } <br/>
										{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.addressLine2 } <br/>
										{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.district + ', ' +  this.state.orderData.deliveryAddress.state +', ' + this.state.orderData.deliveryAddress.pincode } <br/>
										{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.country } <br/>
									</div>						
									<p><strong class="box-title"> Mobile Number :</strong> <span className="box-content">{this.state.orderData.deliveryAddress.mobilenum}</span></p>						
					 			</div>
								{this.state.orderData.customerShippingTime 
								? 
									<div className="col-lg-3 col-md-3 col-sm-4 col-xs-6">
										<strong class="box-title orderDetailTitles">
											<p>Shipping Time</p>
										</strong>
										<div className="box-content">{ this.state.orderData.customerShippingTime }</div>
									</div>
								: 
									null
								}
								<div className="col-lg-3 col-md-4 col-sm-4 col-xs-6">
									<strong class="box-title orderDetailTitles">
										<p>Payment Method</p>
									</strong>
									<div className="box-content">{this.state.orderData.paymentDetails.paymentMethod}</div>
								</div>
					 			<div className="col-lg-3 col-md-3 col-sm-4 col-xs-6">
									<strong class="box-title orderDetailTitles">
										<p>Order Summary</p>
									</strong>
									<div className="box-content"> 
										<div>
											<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Subtotal :</span>  </div>
											<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><span><i className={"fa fa-"+this.state.orderData.paymentDetails.currency}>{this.state.orderData.paymentDetails.currency + " "} {(this.state.orderData.paymentDetails.afterDiscountTotal).toFixed(2)}</i></span> </div> 
										</div>
										<div>
											<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Shipping :  </span></div>
											<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><span><i className={"fa fa-"+this.state.orderData.paymentDetails.currency}> {this.state.orderData.paymentDetails.currency + " "} {(this.state.orderData.paymentDetails.shippingCharges).toFixed(2)}</i></span> </div>
										</div>
						  			</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Tax Amount :  </span></div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">
										<span><i className={"fa fa-"+this.state.orderData.currency}> {this.state.orderData.paymentDetails.currency + " "} { (this.state.orderData.paymentDetails.taxAmount).toFixed(2) } </i></span> 
									</div>
									<div> 
										<div>
											<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Total : </span></div>
											<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">									
												<span><i className={"fa fa-"+this.state.orderData.currency}>{this.state.orderData.paymentDetails.currency + " "} { parseInt(this.state.orderData.paymentDetails.netPayableAmount).toFixed(2) }</i></span>
											</div>
										</div>
									</div>
								</div>
								{/* </div> */}
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerbox">
									{this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length > 0 
									?
										this.state.orderData.vendorOrders.map((vendordata, i)=>{
											return(
												<div key={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 vendorOrderDetails">
													<h4 className="weighttitle table-caption">{vendordata.vendorName}</h4>
													{vendordata.products && vendordata.products.length > 0 
													?
														vendordata.products.map((productdata, index)=>{
															return(
																<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" style={{marginBottom:"10px"}}>
																	<div className="col-lg-3 col-md-2 col-sm-2 col-xs-2">
																		<img src={productdata.productImage ? productdata.productImage : ""} style={{width:"100%"}}/>
																	</div>
																	<div className="col-lg-9 col-md-10 col-sm-10 col-xs-10">
																		<strong class="box-title">
																			<a href={"/product-details/"+productdata.product_ID} className="productname">{productdata.productName}</a><br/>
																		</strong>
																		<br/>
																		<div className="box-content"> 
																			<div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Original Price :</span>  </div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><span>{this.state.orderData.paymentDetails.currency + " "} {(productdata.originalPrice).toFixed(2)}</span></div> 
																			</div>
																			<div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Discount :</span></div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">{productdata.discountPercent} %</div>
																			</div>
																			<div>
																				<div className="col-lg-8 col-md-8 col-sm-8 col-xs-6 NOpadding"><span>Discounted Price :</span></div>
																				<div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 NOpadding text-right"> {this.state.orderData.paymentDetails.currency + " "} {(productdata.discountedPrice).toFixed(2)}</div>
																			</div>
																			<div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Quantity :</span></div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">{productdata.quantity}</div>
																			</div>
																			<div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Total :</span></div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">{this.state.orderData.paymentDetails.currency + " "} {(productdata.quantity * productdata.discountedPrice).toFixed(2)}</div>
																			</div>
																		</div>
																	</div>
																</div>
															);
														})
														:
														null
													}
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													<hr/>
													<div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 pull-right">
														<div className="box-content"> 
															<div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Subtotal :</span>  </div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><span><i className={"fa fa-"+this.state.orderData.paymentDetails.currency}> {this.state.orderData.paymentDetails.currency + " "} {(vendordata.vendor_afterDiscountTotal).toFixed(2)}</i></span> </div> 
															</div>
														</div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Tax Amount :  </span></div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">
															<span><i className={"fa fa-"+this.state.orderData.currency}> {this.state.orderData.paymentDetails.currency + " "} { vendordata.vendor_taxAmount ? (vendordata.vendor_taxAmount).toFixed(2) : (0).toFixed(2) } </i></span> 
														</div>
														<div> 
															<div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Total : </span></div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">									
																	<span><i className={"fa fa-"+this.state.orderData.currency}> {this.state.orderData.paymentDetails.currency + " "} { parseInt(vendordata.vendor_afterDiscountTotal).toFixed(2) }</i></span>
																</div>
															</div>
														</div>
													</div></div>																							
												</div>
											);
										})
									: 
										null
									}					 
								</div>							
								<hr/>
							</div>
				  		: 
				  			null
			  			}
			 		</div></div>
			 	</section>		   
			</div>
		);
	}
}

export default viewOrder
