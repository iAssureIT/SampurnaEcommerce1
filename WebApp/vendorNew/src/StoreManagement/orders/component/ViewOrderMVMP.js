import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from "moment";
import _                      from 'underscore';
import swal                   from 'sweetalert';
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
		var orderID 	= this.props.match.params.orderID;
		var ordersPath = this.props.match.params.orderStatus;
		this.getOneOrder(orderID);
		this.getCompanyDetails(); 
		this.getAdminPreferences();
	}

	//======= Admin Preferences ==========
	getAdminPreferences(){
		axios.get("/api/adminpreference/get")
		.then(preferences =>{
			if(preferences.data){
				this.setState({
					'websiteModel'     	: preferences.data[0].websiteModel,
					'askPincodeToUser' 	: preferences.data[0].askPincodeToUser,
					'showLoginAs'      	: preferences.data[0].showLoginAs,
					'showInventory'    	: preferences.data[0].showInventory,
					'showDiscount'    	: preferences.data[0].showDiscount,
					'showCoupenCode'    : preferences.data[0].showCoupenCode,
					'showOrderStatus'   : preferences.data[0].showOrderStatus,
					'currency' 			: preferences.data[0].currency,
					'unitOfDistance' 	: preferences.data[0].unitOfDistance
				})									
			}
		})
		.catch(error=>{
			console.log("Error in preferences = ", error);
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
								<a href={"/orders-list/"+(this.props.match.params.orderStatus).replace(/\s+/g, '-').toLowerCase()} className="backtoMyOrders"><i class="fa fa-chevron-circle-left"></i> Back to Orders</a>
							</div>
				  			<h4 className="weighttitle table-caption">Order Details</h4>
			  				{ this.state.orderData &&  this.state.orderData !== 'undefined'
			  				?			  				
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerbox">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 orderedOn">
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
											Ordered on <span className="orderedOnDate">{moment(this.state.orderData.createdAt).format("DD MMMM YYYY, HH:mm a")}</span>   
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 orderNumberDiv">	
											Order Number : <span className="orderNumber"> {this.state.orderData.orderID}</span>
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 orderSummary">
										<div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
											<strong class="box-title orderDetailTitles">
												<p>Shipping Address <br /></p>
											</strong>
											<div className="box-content"> 
											{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress !== "undefined" 
	                              ?
	                                 <div className=""> 
	                                    {this.state.orderData.deliveryAddress.name !== "undefined" && this.state.orderData.deliveryAddress.name !== null ? this.state.orderData.deliveryAddress.name : "Guest" } <br/>
	                                    {this.state.orderData.deliveryAddress.addressLine1 && this.state.orderData.deliveryAddress.addressLine1 !== "undefined" && this.state.orderData.deliveryAddress.addressLine1 !== null ? this.state.orderData.deliveryAddress.addressLine1 + ", " : ""}
	                                    {this.state.orderData.deliveryAddress.addressLine2 && this.state.orderData.deliveryAddress.addressLine2 !== "undefined" && this.state.orderData.deliveryAddress.addressLine2 !== null ? this.state.orderData.deliveryAddress.addressLine2 + ", " : "" } 
	                                    {/*this.state.orderData.deliveryAddress.state && this.state.orderData.deliveryAddress.state !== "undefined" && this.state.orderData.deliveryAddress.state !== null ? this.state.orderData.deliveryAddress.state + ", " : "" +*/}
	                                    {this.state.orderData.deliveryAddress.pincode && this.state.orderData.deliveryAddress.pincode !== "undefined" && this.state.orderData.deliveryAddress.pincode !== null ? this.state.orderData.deliveryAddress.pincode + ", " : "" } <br/>
	                                    {this.state.orderData.deliveryAddress.country && this.state.orderData.deliveryAddress.country !== "undefined" && this.state.orderData.deliveryAddress.country !== null ? this.state.orderData.deliveryAddress.country : "" } <br/>
	                                 </div>
	                              :
	                                 "No Shipping Address found..."
	                          		}
											</div>						
											<p><strong class="box-title"> Mobile : </strong> <span className="box-content">{this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.mobileNumber ? this.state.orderData.deliveryAddress.mobileNumber : "No Mobile Number"}</span></p>						
										</div>
										{this.state.orderData.customerShippingTime 
										? 
											<div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
												<strong class="box-title orderDetailTitles">
													<p>Shipping Time</p>
												</strong>
												<div className="box-content">{ this.state.orderData.customerShippingTime }</div>
											</div>
										: 
											null
										}
										<div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
											<strong class="box-title orderDetailTitles">
												<p>Payment Method</p>
											</strong>
											<div className="box-content">{this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.paymentMethod ? this.state.orderData.paymentDetails.paymentMethod : "No Payment Method"}</div>
										</div>
										<div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
											<strong class="box-title orderDetailTitles">
												<p>Order Summary</p>
											</strong>
											<div className="box-content"> 
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span><b>Total Amount </b></span>  </div>
													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><b><span>{this.state.currency + " "} {(this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.afterDiscountTotal ? this.state.orderData.paymentDetails.afterDiscountTotal : 0).toFixed(2)}</span></b> </div> 
												</div>
												{(this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingChargesBeforeDiscount && this.state.orderData.paymentDetails.shippingCharges !== this.state.orderData.paymentDetails.shippingChargesBeforeDiscount) 
												?
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span><b>Shipping Charges  </b></span></div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><b><span style={{textDecoration : "line-through"}}> {this.state.currency + " "} {(this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.shippingChargesBeforeDiscount ? this.state.orderData.paymentDetails.shippingChargesBeforeDiscount : 0).toFixed(2)}</span></b></div>
													</div>
												:	
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span><b>Shipping Charges  </b></span></div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><b><span> {this.state.currency + " "} {(this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.shippingCharges ? this.state.orderData.paymentDetails.shippingCharges : 0).toFixed(2)}</span></b></div>
													</div>
												}
												{(this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingChargesBeforeDiscount && this.state.orderData.paymentDetails.shippingCharges !== this.state.orderData.paymentDetails.shippingChargesBeforeDiscount) 
												?
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span><b>Discounted Shipping Charges </b></span></div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><b><span> {this.state.currency + " "} {(this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.shippingCharges ? this.state.orderData.paymentDetails.shippingCharges : 0).toFixed(2)}</span></b></div>
													</div>
												:
													null
												}
	                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
	                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span><b>Tax Amount  </b></span></div>
	                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">
	                                        <b><span>{this.state.currency + " "} { (this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.taxAmount ? this.state.orderData.paymentDetails.taxAmount : 0).toFixed(2) }</span> </b>
	                                    </div>
	                                </div>
	                                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span><b>Net Payable Amount </b></span></div>
													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">									
														<b><span>{this.state.currency + " "} { (this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.netPayableAmount ? this.state.orderData.paymentDetails.netPayableAmount : 0).toFixed(2) }</span></b>
													</div>
												</div>
											</div>
										</div>							 	
									</div> 
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 orderReviews NOPadding table-responsive">
	                           	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
	                               	<table className="table table-borderless orderTable">
	                                   	<thead>
                                       	<tr>
															<th className="productImageTH">Products Image</th>
															<th>Products Name</th>
															<th className="textAlignRight">Price</th>
															<th className="textAlignCenter">Quantity</th>
															<th className="textAlignRight">SubTotal</th>
														</tr>
	                                		</thead>
	                                 	<tbody>
	                                    	{this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length > 0 
														?												
		                                     	this.state.orderData.vendorOrders.map((vendorWiseData, index) => {
		                                         	return (
		                                             <div className="tableRowWrapper" key={index}>                                                                
																		<tr className="vendorNameRow">
																			<th colSpan="5">
																				<div className="textAlignLeft pull-left">Vendor : <span className="vendorName">{vendorWiseData.vendor_id.companyName}</span></div> 
																				<div className="textAlignRight pull-right">Status : <span className={"vendorStatus " + ((vendorWiseData.orderStatus ? vendorWiseData.orderStatus : "").replace(/\s+/g, '_').toLowerCase())}>{vendorWiseData.orderStatus}</span></div>
																			</th>
																		</tr>                                                                        
																		{ vendorWiseData.products && vendorWiseData.products.length > 0
																		?
																			vendorWiseData.products.map((productData, index) => {
																				return(
																					<tr>
																						<td><img className="img orderImg" src={productData.productImage[0] ? productData.productImage[0] : "/images/notavailable.jpg"} /></td>
																						<td>
																							<a href={"/productdetails/" + productData}>
																							{/* {productData.productNameRlang?
																								<h5 className="RegionalFont">{productData.productNameRlang}</h5>
																							: */}
																								<h5 className="productName">{productData.productName}</h5>
																							 {/* } */}
																							</a>

																							{productData.discountedPrice 
																							?
																								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">                                                                                                
																									<div className="discountedPrice"><span className="currencyStyle">{this.state.currency + " "}</span>{productData.discountedPrice ? (productData.discountedPrice).toFixed(2) + "  " : (0).toFixed(2)}</div>
																									{ productData.discountPercent > 0 
																									?	
																										<div className="beforeDiscount">
																											<span className="oldProductPrice">{this.state.currency + " "} {productData.originalPrice ? (productData.originalPrice).toFixed(2) : (0).toFixed(2)}</span> &nbsp; &nbsp;
																											<span className="productDiscountPercent"> {(productData.discountPercent)} % Off  </span>																								
																										</div>
																									:
																										<span></span>
																									}

																								</div>
																							:
																								<span className="price">{this.state.currency}&nbsp;{productData.originalPrice ? (productData.originalPrice).toFixed(2) : (0).toFixed(2)}</span>
																							}
																							<div>
																								{productData.color ? <span className="cartColor">Color : <span style={{ backgroundColor: productData.color, padding: '0px 5px' }}>&nbsp;</span> </span> : null}
																								{productData.size ? <span className="cartColor">Size : {productData.size} &nbsp; {productData.unit}</span> : null}
																							</div>
																						</td>
																						<td className="textAlignRight">
																							{
																								productData.discountedPrice 
																								?
																									// <span className="productPrize textAlignRight"><i className={"fa fa-" + productData.currency}></i> &nbsp;{parseInt(productData.discountedPrice).toFixed(2)}</span>
																									<span className="productPrize textAlignRight">{this.state.currency + " "}{parseInt(productData.discountedPrice).toFixed(2)}</span>
																								:
																									<span>-</span>
																							}
																						</td>
																						<td className="textAlignCenter">
																							{
																								productData.quantity 
																								?
																									<span className=" textAlignRight">{productData.quantity}</span>
																								:
																									<span className="textAlignCenter sold">0</span>
																							}
																						</td>
																						<td className="textAlignRight">
																							{
																								productData.discountedPrice
																								?
																									<span className="productPrize textAlignRight">
																										{this.state.currency + " "}{(productData.discountedPrice * productData.quantity).toFixed(2)}
																									</span>
																								:
																									<span>-</span>
																							}
																						</td>
																					</tr>
																				)
																			})
																		:
																			null
																		}
																		<tr className="tableRow vendorTotalRows">
																			{vendorWiseData.vendor_shippingCharges && vendorWiseData.vendor_shippingChargesAfterDiscount && vendorWiseData.vendor_shippingCharges !== vendorWiseData.vendor_shippingChargesAfterDiscount
																			?		
																				<td colSpan="2" rowSpan="6" className="totals">                                                                        
																					<div className="finalTotal">{vendorWiseData.vendorName}&nbsp; Total</div>
																				</td>
																			:

																				<td colSpan="2" rowSpan="5" className="totals">                                                                        
																					<div className="finalTotal">{vendorWiseData.vendorName}&nbsp; Total</div>
																				</td>
																			}
																			<td colSpan="2">                                                                        
																				<div className="vendorTotalTitle">Before Discount Total</div>
																			</td>
																			<td>
																				<div className="vendorTotalAmount">{this.state.currency + " "}{vendorWiseData.vendor_beforeDiscountTotal ? (vendorWiseData.vendor_beforeDiscountTotal).toFixed(2) : (0).toFixed(2)} </div>	
																			</td>																	
																		</tr>
																		<tr className="vendorTotalRows">
																			<td colSpan="2">                                                                        
																				<div className="vendorTotalTitle">Discount Amount</div>
																			</td>
																			<td>
																				<div className="vendorTotalAmount">{this.state.currency + " "}{vendorWiseData.vendor_discountAmount ? (vendorWiseData.vendor_discountAmount).toFixed(2) : (0).toFixed(2)} </div>	
																			</td>
																		</tr>
																		<tr className="vendorTotalRows">
																			<td colSpan="2">                                                                        
																				<div className="vendorTotalTitle">Shipping Charges</div>
																			</td>
																			{vendorWiseData.vendor_shippingCharges && vendorWiseData.vendor_shippingChargesAfterDiscount && vendorWiseData.vendor_shippingCharges !== vendorWiseData.vendor_shippingChargesAfterDiscount
																			?																
																				<td>
																					<div className="vendorTotalAmount" style={{textDecoration : "line-through"}}>{this.state.currency + " "}{vendorWiseData.vendor_shippingCharges ? (vendorWiseData.vendor_shippingCharges).toFixed(2) : (0).toFixed(2)} </div>	
																				</td>
																			:
																				<td>
																					<div className="vendorTotalAmount">{this.state.currency + " "}{vendorWiseData.vendor_shippingCharges ? (vendorWiseData.vendor_shippingCharges).toFixed(2) : (0).toFixed(2)} </div>	
																				</td>
																			}
																		</tr>
																		{vendorWiseData.vendor_shippingCharges && vendorWiseData.vendor_shippingChargesAfterDiscount && vendorWiseData.vendor_shippingCharges !== vendorWiseData.vendor_shippingChargesAfterDiscount
																		?	
																			<tr className="vendorTotalRows">
																				<td colSpan="2">                                                                        
																					<div className="vendorTotalTitle">Discounted Shipping Charges</div>
																				</td>
																				<td>
																					<div className="vendorTotalAmount">{this.state.currency + " "}{vendorWiseData.vendor_shippingChargesAfterDiscount ? (vendorWiseData.vendor_shippingChargesAfterDiscount).toFixed(2) : (0).toFixed(2)} </div>	
																				</td>
																			</tr>
																		:
																			null
																		}
																		<tr className="vendorTotalRows">
																			<td colSpan="2">                                                                        
																				<div className="vendorTotalTitle">Tax Amount</div>
																			</td>
																			<td>
																				<div className="vendorTotalAmount">{this.state.currency + " "}{vendorWiseData.vendor_taxAmount ? (vendorWiseData.vendor_taxAmount).toFixed(2) : (0).toFixed(2)} </div>	
																			</td>
																		</tr> 
																		<tr className="vendorTotalRows">
																			<td colSpan="2">                                                                        
																				<div className="vendorTotalTitle">Total Amount</div>
																			</td>
																			<td>
																				<div className="vendorTotalAmount">{this.state.currency + " "}{vendorWiseData.vendor_afterDiscountTotal ? (vendorWiseData.vendor_afterDiscountTotal).toFixed(2) : (0).toFixed(2)} </div>	
																			</td>
																		</tr>                                                                
		                                             </div> 
		                                         	);
		                                     	})					
								
			                                 :
			                                     null
			                                 }	
														<tr className="tableRow orderTotalRows">
															{(this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingChargesBeforeDiscount && this.state.orderData.paymentDetails.shippingCharges !== this.state.orderData.paymentDetails.shippingChargesBeforeDiscount) 
															?
																<td colSpan="2" rowSpan="5" className="totals"> 
																	<div className="finalTotal">Final Order Total</div>
																</td> 
															:                                                                      
																<td colSpan="2" rowSpan="4" className="totals"> 
																	<div className="finalTotal">Final Order Total</div>
																</td> 
															}	
															<td colSpan="2">                                                                        
																<div className="vendorTotalTitle">Final Total Amount</div>
															</td>
															<td>
																<div className="vendorTotalAmount">{this.state.currency + " "}{this.state.orderData.paymentDetails.afterDiscountTotal ? (this.state.orderData.paymentDetails.afterDiscountTotal).toFixed(2) : (0).toFixed(2)} </div>	
															</td>
														</tr>
														<tr className="orderTotalRows">
															<td colSpan="2">                                                                        
																<div className="vendorTotalTitle">Total Tax Amount</div>
															</td>
															<td>
																<div className="vendorTotalAmount">{this.state.currency + " "}{this.state.orderData.paymentDetails.taxAmount ? (this.state.orderData.paymentDetails.taxAmount).toFixed(2) : (0).toFixed(2)} </div>	
															</td>
														</tr>
														<tr className="orderTotalRows">
															<td colSpan="2">                                                                        
																<div className="vendorTotalTitle">Shipping Charges</div>
															</td>
															{(this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingChargesBeforeDiscount && this.state.orderData.paymentDetails.shippingCharges !== this.state.orderData.paymentDetails.shippingChargesBeforeDiscount) 
															?
																<td>
																	<div className="vendorTotalAmount" style={{textDecoration : "line-through"}}>{this.state.currency + " "}{this.state.orderData.paymentDetails.shippingChargesBeforeDiscount ? (this.state.orderData.paymentDetails.shippingChargesBeforeDiscount).toFixed(2) : (0).toFixed(2)} </div>	
																</td>
															:
																<td>
																	<div className="vendorTotalAmount">{this.state.currency + " "}{this.state.orderData.paymentDetails.shippingCharges ? (this.state.orderData.paymentDetails.shippingCharges).toFixed(2) : (0).toFixed(2)} </div>	
																</td>
															}
														</tr>
														{(this.state.orderData && this.state.orderData.paymentDetails && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingCharges && this.state.orderData.paymentDetails.shippingChargesBeforeDiscount && this.state.orderData.paymentDetails.shippingCharges !== this.state.orderData.paymentDetails.shippingChargesBeforeDiscount) 
														?
															<tr className="orderTotalRows">
																<td colSpan="2">                                                                        
																	<div className="vendorTotalTitle">Discounted Shipping Charges</div>
																</td>
																<td>
																	<div className="vendorTotalAmount">{this.state.currency + " "}{this.state.orderData.paymentDetails.shippingCharges ? (this.state.orderData.paymentDetails.shippingCharges).toFixed(2) : (0).toFixed(2)} </div>	
																</td>
															</tr>
														:
															null
														}
														<tr className="orderTotalRows">
															<td colSpan="2">                                                                        
																<div className="vendorTotalTitle"> Net Payable Amount</div>
															</td>
															<td>
																<div className="vendorTotalAmount">{this.state.currency + " "}{this.state.orderData.paymentDetails.netPayableAmount ? (this.state.orderData.paymentDetails.netPayableAmount).toFixed(2) : (0).toFixed(2)} </div>	
															</td>
														</tr>											
	                             			</tbody>                                         
												</table>
	                    				</div>
	                 				</div>
	             				</div>
								</div>
							  : 
					  			null
				  			}
			 			</div>
					</div>
			 	</section>		   
			</div>
		);
	}
}

export default viewOrder
