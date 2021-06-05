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
							// <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerbox">
							// 	<p>Ordered on {moment(this.state.orderData.createdAt).format("DD MMMM YYYY")}  | Order {this.state.orderData.orderID}</p>
					 		// 	<div className="col-lg-3 col-md-4 col-sm-4 col-xs-4">
							// 		<strong class="box-title orderDetailTitles">
							//  			<p>Shipping Address <br /></p>
							// 		</strong>
							// 		<div className="box-content"> 
							// 			{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.name } <br/>
							// 			{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.addressLine1 } <br/>
							// 			{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.addressLine2 } <br/>
							// 			{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.district + ', ' +  this.state.orderData.deliveryAddress.state +', ' + this.state.orderData.deliveryAddress.pincode } <br/>
							// 			{ this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.country } <br/>
							// 		</div>						
							// 		<p><strong class="box-title"> Mobile Number :</strong> <span className="box-content">{this.state.orderData.deliveryAddress.mobilenum}</span></p>						
					 		// 	</div>
							// 	{this.state.orderData.customerShippingTime 
							// 	? 
							// 		<div className="col-lg-3 col-md-3 col-sm-4 col-xs-6">
							// 			<strong class="box-title orderDetailTitles">
							// 				<p>Shipping Time</p>
							// 			</strong>
							// 			<div className="box-content">{ this.state.orderData.customerShippingTime }</div>
							// 		</div>
							// 	: 
							// 		null
							// 	}
							// 	<div className="col-lg-3 col-md-4 col-sm-4 col-xs-6">
							// 		<strong class="box-title orderDetailTitles">
							// 			<p>Payment Method</p>
							// 		</strong>
							// 		<div className="box-content">{this.state.orderData.paymentDetails.paymentMethod}</div>
							// 	</div>
					 		// 	<div className="col-lg-3 col-md-3 col-sm-4 col-xs-6">
							// 		<strong class="box-title orderDetailTitles">
							// 			<p>Order Summary</p>
							// 		</strong>
							// 		<div className="box-content"> 
							// 			<div>
							// 				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Subtotal :</span>  </div>
							// 				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><span><i className={"fa fa-"+this.state.orderData.paymentDetails.currency}>{this.state.orderData.paymentDetails.currency + " "} {(this.state.orderData.paymentDetails.afterDiscountTotal).toFixed(2)}</i></span> </div> 
							// 			</div>
							// 			<div>
							// 				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Shipping :  </span></div>
							// 				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><span><i className={"fa fa-"+this.state.orderData.paymentDetails.currency}> {this.state.orderData.paymentDetails.currency + " "} {(this.state.orderData.paymentDetails.shippingCharges).toFixed(2)}</i></span> </div>
							// 			</div>
						  	// 		</div>
							// 		<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Tax Amount :  </span></div>
							// 		<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">
							// 			<span><i className={"fa fa-"+this.state.orderData.currency}> {this.state.orderData.paymentDetails.currency + " "} { (this.state.orderData.paymentDetails.taxAmount).toFixed(2) } </i></span> 
							// 		</div>
							// 		<div> 
							// 			<div>
							// 				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Total : </span></div>
							// 				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">									
							// 					<span><i className={"fa fa-"+this.state.orderData.currency}>{this.state.orderData.paymentDetails.currency + " "} { parseInt(this.state.orderData.paymentDetails.netPayableAmount).toFixed(2) }</i></span>
							// 				</div>
							// 			</div>
							// 		</div>
							// 	</div>
							// 	{/* </div> */}
							// 	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerbox">
							// 		{this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length > 0 
							// 		?
							// 			this.state.orderData.vendorOrders.map((vendordata, i)=>{
							// 				return(
							// 					<div key={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 vendorOrderDetails">
							// 						<h4 className="weighttitle table-caption">{vendordata.vendorName}</h4>
							// 						{vendordata.products && vendordata.products.length > 0 
							// 						?
							// 							vendordata.products.map((productdata, index)=>{
							// 								return(
							// 									<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" style={{marginBottom:"10px"}}>
							// 										<div className="col-lg-3 col-md-2 col-sm-2 col-xs-2">
							// 											<img src={productdata.productImage ? productdata.productImage : ""} style={{width:"100%"}}/>
							// 										</div>
							// 										<div className="col-lg-9 col-md-10 col-sm-10 col-xs-10">
							// 											<strong class="box-title">
							// 												<a href={"/product-details/"+productData} className="productname">{productdata.productName}</a><br/>
							// 											</strong>
							// 											<br/>
							// 											<div className="box-content"> 
							// 												<div>
							// 													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Original Price :</span>  </div>
							// 													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><span>{this.state.orderData.paymentDetails.currency + " "} {(productdata.originalPrice).toFixed(2)}</span></div> 
							// 												</div>
							// 												<div>
							// 													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Discount :</span></div>
							// 													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">{productdata.discountPercent} %</div>
							// 												</div>
							// 												<div>
							// 													<div className="col-lg-8 col-md-8 col-sm-8 col-xs-6 NOpadding"><span>Discounted Price :</span></div>
							// 													<div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 NOpadding text-right"> {this.state.orderData.paymentDetails.currency + " "} {(productdata.discountedPrice).toFixed(2)}</div>
							// 												</div>
							// 												<div>
							// 													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Quantity :</span></div>
							// 													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">{productdata.quantity}</div>
							// 												</div>
							// 												<div>
							// 													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Total :</span></div>
							// 													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">{this.state.orderData.paymentDetails.currency + " "} {(productdata.quantity * productdata.discountedPrice).toFixed(2)}</div>
							// 												</div>
							// 											</div>
							// 										</div>
							// 									</div>
							// 								);
							// 							})
							// 							:
							// 							null
							// 						}
							// 						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							// 						<hr/>
							// 						<div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 pull-right">
							// 							<div className="box-content"> 
							// 								<div>
							// 									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Subtotal :</span>  </div>
							// 									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><span><i className={"fa fa-"+this.state.orderData.paymentDetails.currency}> {this.state.orderData.paymentDetails.currency + " "} {(vendordata.vendor_afterDiscountTotal).toFixed(2)}</i></span> </div> 
							// 								</div>
							// 							</div>
							// 							<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Tax Amount :  </span></div>
							// 							<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">
							// 								<span><i className={"fa fa-"+this.state.orderData.currency}> {this.state.orderData.paymentDetails.currency + " "} { vendordata.vendor_taxAmount ? (vendordata.vendor_taxAmount).toFixed(2) : (0).toFixed(2) } </i></span> 
							// 							</div>
							// 							<div> 
							// 								<div>
							// 									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Total : </span></div>
							// 									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right">									
							// 										<span><i className={"fa fa-"+this.state.orderData.currency}> {this.state.orderData.paymentDetails.currency + " "} { parseInt(vendordata.vendor_afterDiscountTotal).toFixed(2) }</i></span>
							// 									</div>
							// 								</div>
							// 							</div>
							// 						</div></div>																							
							// 					</div>
							// 				);
							// 			})
							// 		: 
							// 			null
							// 		}					 
							// 	</div>							
							// 	<hr/>
							// </div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 orderReviews NoPadding table-responsive">
                                    {/* <div className="col-12 eCommTitle orderReviewsTitle">ORDER REVIEWS</div> */}
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <table className="table table-borderless orderTable">
                                            <thead>
                                                <tr>
                                                    <th>Products Image</th>
                                                    <th>Products Name</th>
                                                    <th className="textAlignRight">Price</th>
                                                    <th className="textAlignRight">Quantity</th>
                                                    <th className="textAlignRight">SubTotal</th>
                                                </tr>
                                            </thead>
                                             <tbody>
                                                {this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length > 0 ?
                                                        this.state.orderData.vendorOrders.map((vendorWiseData, index) => {
                                                            return (
                                                                <div className="tableRowWrapper" key={'productData' + index}>
                                                                <tr  className="">
                                                                    <td colspan="5">
                                                                        <table className="table ">
                                                                        <thead>
                                                                            <tr>
                                                                                <th colSpan="5">{vendorWiseData.vendor_id.companyName}</th>
                                                                            </tr>
                                                                        </thead>
																		<tbody>
                                                                        {vendorWiseData.products && vendorWiseData.products.map((productData, index) => {
                                                                            return(
                                                                                <tr>
                                                                                    <td><img className="img orderImg" src={productData.productImage[0] ? productData.productImage[0] : "images/eCommerce/notavailable.jpg"} /></td>
                                                                                    <td>
                                                                                        <a href={"/productdetails/" + productData}>
                                                                                        {productData.productNameRlang?
                                                                                            <h5 className="RegionalFont">{productData.productNameRlang}</h5>
                                                                                        :
                                                                                            <h5 className="productName">{productData.productName}</h5>
                                                                                        }
                                                                                        </a>

                                                                                        {productData.discountPercent ?
                                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                                                                                <span className="cartOldprice">{this.state.currency} &nbsp;{productData.originalPrice}</span>&nbsp;
                                                                                            <span className="cartPrice">{this.state.currency}&nbsp;{productData.discountedPrice}</span> &nbsp; &nbsp;
                                                                                            <span className="cartDiscountPercent">( {Math.floor(productData.discountPercent)}% Off ) </span>
                                                                                            </div>
                                                                                            :
                                                                                            <span className="price">{this.state.currency}&nbsp;{productData.originalPrice}</span>
                                                                                        }
                                                                                        <div>
                                                                                            {productData.color ? <span className="cartColor">Color : <span style={{ backgroundColor: productData.color, padding: '0px 5px' }}>&nbsp;</span> </span> : null}
                                                                                            {productData.size ? <span className="cartColor">Size : {productData.size} &nbsp; {productData.unit}</span> : null}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="textAlignLeft">
                                                                                        {
                                                                                            productData.availableQuantity > 0 ?
                                                                                                // <span className="productPrize textAlignRight"><i className={"fa fa-" + productData.currency}></i> &nbsp;{parseInt(productData.discountedPrice).toFixed(2)}</span>
                                                                                                <span className="productPrize textAlignRight">{this.state.currency}&nbsp;{parseInt(productData.discountedPrice).toFixed(2)}</span>
                                                                                                :
                                                                                                <span>-</span>
                                                                                        }
                                                                                    </td>
                                                                                    <td className="textAlignCenter">
                                                                                        {
                                                                                            productData.availableQuantity > 0 ?
                                                                                                <span className=" textAlignRight">{productData.quantity}</span>
                                                                                                :
                                                                                                <span className="textAlignCenter sold">SOLD OUT</span>
                                                                                        }
                                                                                    </td>
                                                                                    <td className="textAlignRight">
                                                                                        {
                                                                                            productData.availableQuantity > 0 ?
                                                                                                <span className="productPrize textAlignRight">
                                                                                                    {this.state.currency}
                                                                                                    {/* {productData.currency} */}
                                                                                                    &nbsp;{productData.discountedPrice}</span>
                                                                                                :
                                                                                                <span>-</span>
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                        }
																		</tbody>
                                                                    </table>
                                                                    </td>
                                                                </tr>
                                                                <tr className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tableRow">
                                                                    <td colSpan="5"> 
                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <span className="col-lg-8 col-md-8 col-sm-8 col-xs-12 title">{vendorWiseData.vendorName}&nbsp; Total</span>
                                                                            <span className="col-lg-4 col-md-4 col-sm-4 col-xs-12 textAlignRight title NoPadding">&nbsp; 
                                                                                {/* {this.state.currency} &nbsp;{vendorWiseData.vendor_beforeDiscountTotal ? (vendorWiseData.vendor_netPayableAmount).toFixed(2) : (0).toFixed(2)}  */}
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <span className="col-8 title">You Saved&nbsp;</span>
                                                                            <span className="col-4 textAlignRight title NoPadding">&nbsp; 
                                                                                {this.state.currency} &nbsp;{vendorWiseData.total > 0 ? vendorWiseData.vendor_discountAmount : 0.00} 
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <span className="col-8 title">Tax &nbsp;</span>
                                                                            <span className="col-4 textAlignRight title NoPadding">&nbsp; 
                                                                                {this.state.currency} &nbsp;{vendorWiseData.vendor_taxAmount > 0 ? vendorWiseData.vendor_taxAmount : 0.00} 
                                                                            </span>
                                                                        </div>                                                                        
                                                                    </td>
                                                                </tr>
                                                                
                                                            </div>
                                                                
                                                                
                                                            );
                                                        })
                                                        :
                                                        null
                                                }
                                            </tbody>                                         
										</table>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 checkOutTerms">
                                        <div className="row">
                                        {this.props.recentproductData?
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <div className="row">
                                                    <span className="col-md-6 col-12">Final Total Amount :</span><span className="col-md-6 col-12 textAlignRight">{this.state.currency} &nbsp; {this.props.recentproductData.paymentDetails? (this.props.recentproductData.paymentDetails.afterDiscountTotal).toFixed(2) : 0.00 }</span>
                                                    <span className="col-md-6 col-12">Total Saving Amount :</span><span className="col-md-6 col-12 textAlignRight">{this.state.currency} &nbsp; {this.props.recentproductData.paymentDetails.discountAmount>0 ? this.props.recentproductData.paymentDetails.discountAmount : "0.00"}</span>
                                                    <span className="col-md-6 col-12">Total Tax :</span><span className="col-md-6 col-12 textAlignRight">{this.state.currency} &nbsp; {this.props.recentproductData.paymentDetails.taxAmount>0 ? this.props.recentproductData.paymentDetails.taxAmount : "0.00"}</span>
                                                    
                                                    <div className="col-12 mb-2 mt-2">
                                                        <div className="row">
                                                            <div className="form-group col-7">
                                                                <input type="text" className="form-control couponCode" ref="couponCode" id="couponCode" name="couponCode" placeholder="Enter Discount Coupon Here..." />
                                                            </div>
                                                            <div className="col-2">
                                                                <button type="button" className="col-12 btn btn-primary pull-right cuponBtn" onClick={this.applyCoupon.bind(this)}>Apply</button>
                                                            </div>
                                                            <div className="col-3 text-right"> {this.state.currency}&nbsp; {this.state.couponAmount>0? this.state.couponAmount : 0.00}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 mt15">
                                                        <div className="col-12 checkoutBorder"></div>
                                                    </div>
                                                    <div className="col-12 grandTotal mt-4 mb-2">
                                                        <div className="row">
                                                            <span className="col-6 orderTotalText">Grand Total</span>
                                                            <span className="col-6 textAlignRight orderTotalPrize globalTotalPrice">{this.state.currency} &nbsp;
                                                                {(this.props.recentproductData.paymentDetails.netPayableAmount).toFixed(2) }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                        :null
                                        } 

                                        </div>  
                                    </div>

                                    {/* <div className="col-12">
                                    {
                                        !this.state.paymethods ?
                                        <button className=" globaleCommBtn eCommTitle col-xl-3 offset-xl-9 col-md-2 offset-md-10 col-12" onClick={this.placeOrder.bind(this)}>Place Order</button>
                                        :
                                        <div className="col-xl-3 offset-xl-9 col-md-2 offset-md-10 col-12" >
                                                <Loaderspinner
                                                type="ThreeDots"
                                                color="#80b435"
                                                height={40}
                                                width={40}
                                                // timeout={5000} //3 secs
                                            />
                                        </div>
                                    }
                                        
                                    </div> */}
                                </div>
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
