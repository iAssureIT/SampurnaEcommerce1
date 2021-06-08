import React, { Component } from 'react';
import axios                from 'axios';
import moment               from 'moment';
import Link                 from 'next/link';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import BreadCrumbs          from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';
import {ntc}                from '../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';

class Payment extends Component {
  constructor(props) {
    super(props);
      this.state = {
        "orderData": {},
		    "companyInfo": [],
		    "orderID" : '',
        externalData: null,
      };
  }

  componentDidMount() {
    var pageUrl = window.location.pathname;
    let a = pageUrl ? pageUrl.split('/') : "";
    const urlParam =a[2];
    if(urlParam){
      this.setState({
        orderID : urlParam
      },()=>{
        if(this.state.orderID){
          axios.get("/api/orders/get/one/" + this.state.orderID)
          .then((response) => {
            // console.log('orderData response', response.data)
            this.setState({
              orderData: response.data
            })
          })
          .catch((error) => {
            console.log('error', error);
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
          currency     : currency,
      })
      
      
  }
  render() {
    // console.log("this.state.orderData.vendorOrders===",this.state.orderData);
    return (
      <div>
        <Header />
        {/* <BreadCrumbs /> */}
          <div className="container">
            <div className="col-12 col-xl-12 col-sm-12 col-xs-12  NOpadding">
              <div className="col-xl-10 offset-xl-1 col-md-10 offset-md-1 col-sm-12 col-xs-12 col-12">
                <br />
                <br />
                <div className="alert alert-success">
                  <i className="fa fa-check-circle"></i> &nbsp;
                  Your order is placed successfully.
                </div>
                <br />
                <br />
                {this.state.orderData && this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length>0?
                <div className="col-12">
                  <h4 className="table-caption">Order Details</h4>
                  <p>Ordered on {moment(this.state.orderData.createdAt).format("DD MMMM YYYY")}  | OrderID -  {this.state.orderData.orderID}    {this.state.orderData.shippingtime?<span className="pull-right hidden-xs">Shipping Time : {this.state.orderData.shippingtime}</span>:null}</p>
                  <div className="col-12 col-xl-12 col-sm-12 col-xs-12  outerbox">
                  <div className="row">
                    <div className="col-xl-4 col-md-4 col-12 col-sm-12 col-xs-12  mb50">
                      <strong className="box-title">
                        <span>Shipping Address</span>
                      </strong>
                      <div className="box-content">
                        {this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.name} <br />
                        {this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.addressLine2} - &nbsp;
                        {this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.addressLine1} &nbsp; - &nbsp; 
                        {this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.pincode}. <br />                  
                        {/* {this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.district + ', ' + this.state.orderData.deliveryAddress.state + ', ' + this.state.orderData.deliveryAddress.pincode} <br />
                        {this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.country} <br /> */}
                      </div>
                    </div>
                    <div className="col-xl-4 col-md-4 col-12 col-sm-12 col-xs-12 col-12 mb50">
                      <strong className="box-title">
                        <span>Payment Method</span>
                      </strong>
                      <div className="box-content">
                        {
                          this.state.orderData.paymentMethod
                        }
                      </div>
                    </div>
                    <div className="col-xl-4 col-md-4 col-12 col-sm-12 col-xs-12  mb50">
                      <strong className="box-title">
                        <span>Order Summary</span>
                      </strong>
                      <div className="box-content">
                        <div>
                        <div className="row">
                          <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12 "><span>Cart Total:</span>  </div>
                          <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12  NOpadding text-right"><span>{this.state.currency}&nbsp; {(this.state.orderData.paymentDetails.beforeDiscountTotal).toFixed(2)}</span> </div>
                        </div>  
                        </div>
                        <div>
                        <div className="row">
                          <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12 "><span>Shipping:  </span></div>
                          <div className="col-xl-6 col-md-6 col-12 NOpadding text-right"><span>{this.state.orderData.paymentDetails.shippingCharges>0?this.state.orderData.paymentDetails.shippingCharges:0.00}</span> </div>
                        </div> 
                        </div>
                        <div>
                        <div className="row">
                            <div className="col-xl-6 col-md-6 col-12 "><span>Discount: </span></div>
                            <div className="col-xl-6 col-md-6 col-12 NOpadding text-right">
                              <span><i className={"fa fa-" + this.state.orderData.currency}></i> {this.state.orderData.paymentDetails.discountAmount>0?this.state.orderData.paymentDetails.discountAmount:0.00}</span>
                          </div>  
                          </div>
                        </div>
                        <div>
                        <div className="row">
                          <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12 "><span>Tax: </span></div>
                          <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12 NOpadding text-right">
                            <span><i className={"fa fa-" + this.state.orderData.currency}></i> {this.state.orderData.paymentDetails.taxAmount>0?this.state.orderData.paymentDetails.taxAmount:0.00}</span>
                          </div>  
                          </div>
                        </div>
                        <div>
                        <div className="row">
                            <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12" ><span>Order Total: </span></div>
                            <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12 NOpadding text-right">
                              <span>{this.state.orderData.currency} &nbsp; {(this.state.orderData.paymentDetails.netPayableAmount).toFixed(2)}</span>
                        </div>   
                          </div>
                        </div>
                        <div className="brdrbtmpayment col-xl-12 col-md-12 col-sm-12 col-xs-12"></div>
                        <div>
                        <div className="row">
                          <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12 invoiceOrderTotal "><span>Total: </span></div>
                          <div className="col-xl-6 col-md-6 col-12 col-sm-12 col-xs-12  NOpadding text-right">
                            <span className="invoiceOrderTotal"><i className={"fa fa-" + this.state.orderData.currency}></i> {(this.state.orderData.paymentDetails.netPayableAmount).toFixed(2)}</span>
                          </div>
                        </div>  
                        </div>
                      </div>
                    </div>
                  </div> 
                  </div>
                  <div className="col-xl-12 col-md-12 col-sm-12 col-xs-12 outerbox table-responsive">
                  <div className="col-12 orderReviewsWrapper">
                    <table className="table table-borderless orderTable">
                        <thead>
                            <tr>
                                <th>Products Image</th>
                                <th>Products Name</th>
                                {/* <th className="textAlignRight">Price</th> */}
                                <th className="textAlignRight">Quantity</th>
                                <th className="textAlignRight">SubTotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            this.state.orderData && this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length > 0 ?
                            this.state.orderData.vendorOrders.map((vendorWiseData, index) => {
                                // console.log("vendorWiseData=>",vendorWiseData);
                                    return (
                                        <tr className="col-12 tableRowWrapper" key={'cartData' + index}>
                                          <tr  className="col-12">
                                              <td colSpan="5">
                                                  <table className="table ">
                                                  <thead>
                                                      <tr>
                                                          <th colSpan="5">{vendorWiseData.vendor_id.companyName}</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody>
                                                  {   vendorWiseData && vendorWiseData.products && vendorWiseData.products.map((productdata, index) => {
                                                        // console.log("invoice productdata=>",productdata);
                                                        return(
                                                            <tr key={index}>
                                                                <td><img className="img orderImg" src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.jpg"} /></td>
                                                                <td>
                                                                    <a href={"/productdetails/" + productdata}>
                                                                    {productdata.productNameRlang?
                                                                        <h5 className="RegionalFont">{productdata.productNameRlang}</h5>
                                                                    :
                                                                        <h5 className="productName">{productdata.productName}</h5>
                                                                    }
                                                                    </a>

                                                                    {productdata.discountPercent ?
                                                                        <div className="col-12 NoPadding">
                                                                            <span className="cartOldprice">{this.state.currency} &nbsp;{productdata.originalPrice}</span>&nbsp;
                                                                        <span className="cartPrice">{this.state.currency}&nbsp;{productdata.discountedPrice}</span> &nbsp; &nbsp;
                                                                        <span className="cartDiscountPercent">( {Math.floor(productdata.discountPercent)}% Off ) </span>
                                                                        </div>
                                                                        :
                                                                        <span className="price">{this.state.currency}&nbsp;{productdata.originalPrice}</span>
                                                                    }
                                                                    <div>
                                                                        {productdata.color ? <span className="cartColor">Color : <span style={{ backgroundColor: productdata.color, padding: '0px 5px' }}>&nbsp;</span> {ntc.name(productdata.color)[1]}, </span> : null}
                                                                        {productdata.size ? <span className="cartColor">Size : {productdata.size} &nbsp; {productdata.unit}</span> : null}
                                                                    </div>
                                                                </td>
                                                                <td className="textAlignLeft">
                                                                    {
                                                                       
                                                                      // <span className="productPrize textAlignRight"><i className={"fa fa-" + productdata.currency}></i> &nbsp;{parseInt(productdata.discountedPrice).toFixed(2)}</span>
                                                                      <span className="productPrize textAlignRight">{this.state.currency}&nbsp;{productdata.discountedPrice}</span>
                                                                            
                                                                    }
                                                                </td>
                                                                <td className="textAlignCenter">
                                                                    {
                                                                      <span className=" textAlignRight">{productdata.quantity}</span>
                                                                            
                                                                    }
                                                                </td>
                                                                <td className="textAlignRight">
                                                                    {
                                                                      <span className="productPrize textAlignRight">
                                                                          {this.state.currency}
                                                                          &nbsp;{productdata.discountedPrice}
                                                                      </span>
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
                                          <tr className=" col-12 tableRow">
                                              <td colSpan="5"> 
                                                  <div className="col-8 offset-2">
                                                      <span className="col-8 title">{vendorWiseData.vendorName}&nbsp; Total</span>
                                                      <span className="col-4 textAlignRight title">&nbsp; 
                                                          {this.state.currency} &nbsp;{vendorWiseData.vendor_beforeDiscountTotal > 0 ? (vendorWiseData.vendor_beforeDiscountTotal).toFixed(2) : 0.00} 
                                                      </span>
                                                  </div>
                                                  <div className="col-8 offset-2">
                                                      <span className="col-8 title">You Saved&nbsp;</span>
                                                      <span className="col-4 textAlignRight title">&nbsp; 
                                                          {this.state.currency} &nbsp;{vendorWiseData.total > 0 ? vendorWiseData.vendor_discountAmount : 0.00} 
                                                      </span>
                                                  </div>
                                                  <div className="col-8 offset-2">
                                                      <span className="col-8 title">Tax &nbsp;</span>
                                                      <span className="col-4 textAlignRight title">&nbsp; 
                                                          {this.state.currency} &nbsp;{vendorWiseData.vendor_taxAmount > 0 ? vendorWiseData.vendor_taxAmount : 0.00} 
                                                      </span>
                                                  </div>                                                                        
                                              </td>
                                          </tr>
                                    </tr>
                                    );
                                })
                                :
                                  null
                            }
                        </tbody>
                    </table>
                </div>
              </div>

                <div className="backtoMyOrdersDiv">
                  <Link href="/my-orders">
                      <a  className="backtoMyOrders"> Back to My Orders</a>
                  </Link>
                </div>
                <hr />
              </div>
              :null}
            </div>
            </div>
          </div>
          <Footer />
        </div>
    );
  }
}


export default Payment;