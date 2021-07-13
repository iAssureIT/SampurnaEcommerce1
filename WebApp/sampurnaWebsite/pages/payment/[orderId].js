import React, { Component } from 'react';
import axios                from 'axios';
import moment               from 'moment';
import Link                 from 'next/link';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import BreadCrumbs          from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';
import {ntc}                from '../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';
import Style                  from './index.module.css';

class Payment extends Component {
  constructor(props) {
    super(props);
      this.state = {
        "orderData": {},
		    "companyInfo": [],
        externalData: null,
      };
  }

  componentDidMount() {
    var pageUrl = window.location.pathname;
    let a = pageUrl ? pageUrl.split('/') : "";
    const urlParam =a[2];
    // console.log("urlParam",urlParam);
    if(urlParam){
      this.setState({
        orderID : urlParam
      },async()=>{
        if(this.state.orderID){
          await axios.get("/api/orders/get/one/" + this.state.orderID)
          .then((response) => {
            console.log('orderData response', response.data)
            this.setState({
              orderData: response.data
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
      // console.log("userDetails===",userDetails);
      this.setState({
          user_ID : userDetails.user_id,
          email   : userDetails.email,
          fullName: userDetails.firstName +" "+userDetails.lastName ,   
          mobile  : userDetails.mobile,   
          currency     : currency,
      })
      
      
  }
  render() {
    console.log("this.state.orderData.vendorOrders===",this.state.orderData);
    return (
      <div className="col-12 ">
        <div className="row">
        <Header />
        {this.state.orderData?
          <div className="container h-100 mb-5">
            <div className="col-12 col-xl-12 col-sm-12 col-xs-12  NOpadding h-100">
            <div className={"col-xl-10 offset-xl-1 col-md-10 offset-md-1 col-sm-12 col-xs-12 col-12  mt-5 m-b-5 "+Style.paymentMainWrapper}>
              <div className="row">
                <div className={"col-4 "+Style.paymentLeftSideWrapper}>
                <div className={"alert text-center mt-2 "+Style.paymentAlertWrapper}>
                  <i className="fa fa-check"></i> <br/>
                   <h6>Thank you your order has been received.</h6> 
                </div>
                <div className={"mx-4 "+Style.paymentAlertWrapper}>
                  <h6>Receipt From
                  <h6 className="mx-4 mt-2">Knock Knock</h6></h6><hr/>
                </div>
                <div className={"mx-4 mt-2 "+Style.paymentLockWrapper}>
                  <i className="fa fa-lock"></i>&nbsp;&nbsp;Amount : {this.state.currency}&nbsp;{this.state.orderData.paymentDetails? this.state.orderData.paymentDetails.netPayableAmount:null} <br/><hr/>
                </div>
                <div className={"mx-4 mt-2 "+Style.paymentLockWrapper}>
                  <i className="fa fa-calendar"></i>&nbsp;&nbsp;Date <br/>
                  <p className="mt-2 mx-3">{moment(this.state.orderData.createdAt).format("DD MMMM")}  | OrderID -  {this.state.orderData.orderID}    {this.state.orderData.shippingtime?<span className="pull-right hidden-xs">Shipping Time : {this.state.orderData.shippingtime}</span>:null}</p><hr/>

                </div>
                {/* <div className={"mx-4 mt-2 "+Style.paymentLockWrapper}>
                  <i className="fa fa-clipboard"></i>&nbsp;&nbsp;Confirmation No <br/>
                  <p className="mt-2 mx-3">12345678989784554</p>
                </div> */}
                </div>
                <div className={"col-8 "+Style.paymentRightSideWrapper}>
                <img src="/images/eCommerce/trollymart-black.png" className={"float-right mt-3 "+Style.paymentLogoWrapper} alt="Trollymart Logo" />
                <img src="/images/eCommerce/Face.png" className={" m-auto "+Style.paymentBgWrapper} alt="Trollymart Logo" />

                <div className="col-12 mt-5 pt-5">
                
              
                {this.state.orderData && this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length>0?
                <div className="row">
                  <div className="col-12 mb-3 ">
                          <div className="row">
                           <span className="col-6">Order No : </span> 
                            <p className="col-6 text-right invoiceOrderTotal"> 
                              {this.state.orderData.orderID} 
                            </p>
                          </div>
                    </div>
                    {this.state.email &&
                    <div className="col-12 mb-3">
                          <div className="row">
                           <span className="col-6">Email :</span> 
                            <p className="col-6 text-right invoiceOrderTotal"> 
                               {this.state.email}
                            </p>
                          </div>
                    </div>
                    }
                    {this.state.orderData.deliveryAddress.mobileNumber &&
                    <div className="col-12 mb-3">
                          <div className="row">
                           <span className="col-6">Mobile No. :</span> 
                            <p className="col-6 text-right invoiceOrderTotal"> 
                               {this.state.orderData.deliveryAddress.mobileNumber}
                            </p>
                          </div>
                    </div>
                    }
                    <div className="col-12 mb-3 ">
                          <div className="row">
                           <span className="col-6">Payment Method : </span> 
                            <p className="col-6 text-right invoiceOrderTotal"> 
                            {
                              this.state.orderData.paymentDetails.paymentMethod === "cod"? "Cash on Delivery" : this.state.orderData.paymentDetails.paymentMethod
                            }
                            </p>
                          </div>
                    </div>
                    <div className="col-12 mb50">
                    <div className="row">
                          <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12  "><span>Total : </span></div>
                          <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12  NOpadding text-right">
                            <span className="invoiceOrderTotal"><i className={"fa fa-" + this.state.orderData.currency}> </i> {(this.state.orderData.paymentDetails.netPayableAmount).toFixed(2)} &nbsp;{this.state.currency}&nbsp;</span>
                          </div>
                        </div>  
                    </div>

                <div className={"backtoMyOrdersDiv col-12 mb-3 mt-5 pt-3 text-center "+Style.backtoMyOrdersDivWrapper}>
                  <Link href="/my-account#v-pills-settings-tab">
                      <a><i className="fa fa-arrow-circle-left"></i> Go Back To My Orders</a>
                  </Link>
                </div>
                <div className={"backtoMyOrdersDiv col-12 text-center "+Style.backtoMyOrdersDivWrapper}>
                  <Link href="/">
                      <a><i className="fa fa-arrow-circle-left"></i> Go Back To HomePage</a>
                  </Link>
                </div>
               
              </div>
              :null}
            </div>
                </div>
              </div>
           </div>
            </div>
          </div>
        :null  
        }
        <Footer />
        </div>
        </div>
    );
  }
}


export default Payment;