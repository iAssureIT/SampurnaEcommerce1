import React, { Component } from 'react';
import axios                from 'axios';
import moment               from 'moment';
import Link                 from 'next/link';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import BreadCrumbs          from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';
import {ntc}                from '../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';
import Style                from './index.module.css';
import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';


class Payment extends Component{
	constructor(props){
    	super(props);
		this.state = {
			"orderData"		: {},
			"companyInfo"	: [],
			externalData	: null,
			loading 		: true,
		};
	}

	componentDidMount(){
    	var pageUrl 	= window.location.pathname;
    	let a 			= pageUrl ? pageUrl.split('/') : "";
    	const urlParam 	= a[2];
		if(urlParam){
			this.setState({
				orderID : urlParam
			},async()=>{
				if(this.state.orderID){
					await axios.get("/api/orders/get/one/" + this.state.orderID)
								.then((response) => {
									this.setState({
										orderData: response.data,
										loading : false,
									})
								})
								.catch((error) => {
									console.log('order id error', error);
								})
				}
			})
		}

		var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
		var currency = sampurnaWebsiteDetails.preferences.currency;
		var userDetails  = JSON.parse(localStorage.getItem('userDetails'));

		this.setState({
			user_ID 	: userDetails.user_id,
			email   	: userDetails.email,
			fullName	: userDetails.firstName +" "+userDetails.lastName ,   
			mobile  	: userDetails.mobile,   
			currency    : currency,
		})
	}
	
	render(){
		return(
			<div className="col-12">
        		<div className="row">
        			<Header />
					{this.props.loading ?
                                <Loader classNmae="d-block"type="fullpageloader" />
                                :
							<div className="container h-100 mb-5">
								<div className="col-12 NOpadding h-100">
            						<div className={"col-12 col-md-10 offset-md-1 mt-5 m-b-5 "+Style.paymentMainWrapper}>
              							<div className="row">
											<div className={"col-12 col-lg-4 "+Style.paymentLeftSideWrapper}>
												<div className={"alert text-center mt-2 "+Style.paymentAlertWrapper}>
													<img src="/images/eCommerce/Check.svg" alt="Check"></img> <br/>
                   									<h6>Thank you your order has been received.</h6> 
                								</div>
												<div className={"mx-4 "+Style.paymentAlertWrapper}>
													<h6>Receipt From</h6>
													<h6 className="mx-4 font-weight-bold">Knock Knock</h6>
												</div>
												<div className={"mx-4 mt-4 "+Style.paymentLockWrapper}>
													<h6>
													<img src="/images/eCommerce/wallet.svg" alt="Wallet"></img>&nbsp; Amount :
													</h6>
													<h6 className="mx-4">
														{this.state.currency}&nbsp;{this.state.orderData.paymentDetails ? this.state.orderData.paymentDetails.netPayableAmount : null} /-
													</h6>
												</div>
												<div className={"mx-4 mt-4 "+Style.paymentLockWrapper}>
													<h6>
													<img src="/images/eCommerce/calendar.svg" alt="Wallet"></img>&nbsp; Date :
													</h6>
													<h6 className="mx-4">
														{moment(this.state.orderData.createdAt).format("DD MMMM")}
													</h6>
												</div>
												{/* <div className={"mx-4 mt-4 "+Style.paymentLockWrapper}>
													<h6>
														<i className="fa fa-sort-numeric-up-alt"></i>&nbsp; OrderID :
													</h6>
													<h6 className="mx-4">
														{this.state.orderData.orderID}&nbsp;{this.state.orderData.shippingtime ? <span className="pull-right hidden-xs">Shipping Time : {this.state.orderData.shippingtime}</span> : null}
													</h6>
												</div> */}
												{/* <div className={"mx-4 mt-2 "+Style.paymentLockWrapper}>
													<i className="fa fa-clipboard"></i>&nbsp;&nbsp;Confirmation No <br/>
													<p className="mt-2 mx-3">12345678989784554</p>
												</div> */}
							                </div>
											<div className={"col-12 col-lg-8 "+Style.paymentRightSideWrapper}>
												<img src="/images/eCommerce/trollymart-black.png" className={"float-right mt-3 "+Style.paymentLogoWrapper} alt="Trollymart Logo" />
												<img src="/images/eCommerce/Face.png" className={" m-auto "+Style.paymentBgWrapper} alt="Trollymart Logo" />
								                <div className="col-12 mt-5 pt-5">
									                {
														this.state.orderData && this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length> 0
														?
															<div className="row">
																<div className="col-12 mb-3">
                          											<div className="row">
                           												<span className="col-6">Order No : </span> 
																		<p className="col-6 text-right invoiceOrderTotal"> 
																			{this.state.orderData.orderID} 
                            											</p>
																	</div>
																</div>
																{
																	this.state.email
																	&&
																	<div className="col-12 mb-3">
																		<div className="row">
																			<span className="col-12 col-sm-4">Email :</span> 
																			<p className="col-12 col-sm-8 text-right invoiceOrderTotal"> 
																				{this.state.email}
																			</p>
																		</div>
																	</div>
											                    }
                    											{
																	this.state.orderData.deliveryAddress.mobileNumber
																	&&
																	<div className="col-12 mb-3">
																		<div className="row">
																			<span className="col-6">Mobile No. :</span> 
																			<p className="col-6 text-right invoiceOrderTotal"> 
																				{this.state.orderData.deliveryAddress.mobileNumber}
																			</p>
																		</div>
																	</div>
											                    }
																<div className="col-12 mb-3">
                          											<div className="row">
                           												<span className="col-6">Total : </span> 
																		<p className="col-6 text-right invoiceOrderTotal"> 
																			<i className={"fa fa-" + this.state.orderData.currency}></i>
																			{(this.state.orderData.paymentDetails.netPayableAmount).toFixed(2)} &nbsp;
																			{this.state.currency}&nbsp;
                            											</p>
																	</div>
																</div>
																<div className="col-12 mb-3">
																	<div className="row">
																		<span className="col-6">Payment Method : </span>
																		<p className="col-6 text-right invoiceOrderTotal"> 
																			{
																				this.state.orderData.paymentDetails.paymentMethod === "cod"
																				?
																					"Cash on Delivery"
																				:
																					this.state.orderData.paymentDetails.paymentMethod
																			}
																		</p>
																	</div>
																</div>
																<div className={"backtoMyOrdersDiv col-12 mb-3 mt-4 text-center "+Style.backtoMyOrdersDivWrapper}>
																	<Link href="/my-account#v-pills-settings-tab">
																		<a><img src="/images/eCommerce/view.svg" alt="View"></img><u>View My Orders</u></a>
																	</Link>
																</div>
																<div className={"backtoMyOrdersDiv col-12 text-center "+Style.backtoMyOrdersDivWrapper}>
																	<Link href="/">
																		<a><img src="/images/eCommerce/backArrow.svg" alt="BackButton"></img> <u>Go Back To HomePage</u></a>
																	</Link>
																</div>
															</div>
														:
														<Loader classNmae="d-block"type="fullpageloader" />
													}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						
			        }
        			<Footer />
		        </div>
        	</div>
    	);
  	}
}

export default Payment;