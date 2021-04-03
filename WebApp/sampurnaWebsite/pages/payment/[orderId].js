import React, { Component } from 'react';
import axios from 'axios';
// import '../../../sites/currentSite/pages/Payment.css';
// import { withRouter } from 'react-router-dom';
// import { ntc } from '../../ntc/ntc.js';
import {ntc} from '../../component/CustomizeBlocks/ntc/ntc.js';
import Header      from '../../component/blockTemplate/Header/Header.js';
import Footer      from '../../component/blockTemplate/Footer/Footer.js';
import moment      from 'moment';
import BreadCrumbs from '../../component/CustomizeBlocks/BreadCrumbs/BreadCrumbs.js';
// import notavailable from '../../../sites/currentSite/images/notavailable.jpg';
class Payment extends Component {
  constructor(props) {
    super(props);

    if (!this.props.loading) {
      this.state = {
        "orderData": [],
		"companyInfo": [],
		"orderID" : '',
        // "notificationData" :Meteor.subscribe("notificationTemplate"),
      };
    } else {
      this.state = {
        "orderData": [],
		"companyInfo": [],
		"orderID" : '',
      };
    }
    // window.scrollTo(0, 0);
  }

  componentDidMount() {
	//this.getMyOrders();
	var pageUrl = window.location.pathname;
	// console.log("pageUrl---",pageUrl);
		let a = pageUrl ? pageUrl.split('/') : "";
		const urlParam =a[2];
		this.setState({
			orderID : urlParam
		},()=>{
			axios.get("/api/orders/get/one/" + this.state.orderID)
			.then((response) => {
				// console.log('orderData', response.data)
				this.setState({
				  orderData: response.data
				})
			})
			.catch((error) => {
				console.log('error', error);
			})
		})
    
  }

  render() {
    return (
	<div>
		<Header />
    <BreadCrumbs />
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
              <div className="col-xl-3 col-md-3 col-12 col-sm-12 col-xs-12  mb50">
                <strong className="box-title">
                  <span>Order Summary</span>
                </strong>
                <div className="box-content">
                  <div>
                   <div className="row">
                    <div className="col-xl-8 col-md-6 col-12 col-sm-12 col-xs-12 "><span>Cart Total:</span>  </div>
                    <div className="col-xl-4 col-md-6 col-12 col-sm-12 col-xs-12  NOpadding text-right"><span><i className={"fa fa-" + this.state.orderData.currency}></i> {this.state.orderData.cartTotal}</span> </div>
                   </div>  
                  </div>
                  <div>
                   <div className="row">
                    <div className="col-xl-8 col-md-6 col-12 col-sm-12 col-xs-12 "><span>Shipping:  </span></div>
                    <div className="col-xl-4 col-md-6 col-12 NOpadding text-right"><span>Free</span> </div>
                   </div> 
                  </div>
                  {/* <div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding"><span>Time:  </span></div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding text-right"><span>{this.state.orderData.shippingtime}</span><br/> </div>
                  </div> */}
                  <div>
                   <div className="row">
                      <div className="col-xl-8 col-md-6 col-12 "><span>Discount: </span></div>
                      <div className="col-xl-4 col-md-6 col-12 NOpadding text-right">
                        <span><i className={"fa fa-" + this.state.orderData.currency}></i> {parseInt(this.state.orderData.discount).toFixed(2)}</span>
                    </div>  
                    </div>
                  </div>
                  <div>
                   <div className="row">
                    <div className="col-xl-8 col-md-6 col-12 col-sm-12 col-xs-12 "><span>Tax: </span></div>
                    <div className="col-xl-4 col-md-6 col-12 col-sm-12 col-xs-12 NOpadding text-right">
                      <span><i className={"fa fa-" + this.state.orderData.currency}></i> {parseInt(this.state.orderData.gstTax).toFixed(2)}</span>
                    </div>  
                    </div>
                  </div>
                  <div>
                   <div className="row">
                      <div className="col-xl-8 col-md-6 col-12 col-sm-12 col-xs-12" ><span>Order Total: </span></div>
                      <div className="col-xl-4 col-md-6 col-12 col-sm-12 col-xs-12 NOpadding text-right">
                        <span><i className={"fa fa-" + this.state.orderData.currency}></i> {parseInt(this.state.orderData.total).toFixed(2)}</span>
                   </div>   
                    </div>
                  </div>
                  <div className="brdrbtmpayment col-xl-12 col-md-12 col-sm-12 col-xs-12"></div>
                  <div>
                   <div className="row">
                      <div className="col-xl-8 col-md-6 col-12 col-sm-12 col-xs-12 invoiceOrderTotal "><span>Total: </span></div>
                      <div className="col-xl-4 col-md-6 col-12 col-sm-12 col-xs-12  NOpadding text-right">
                       <div className="row">
                        <span className="invoiceOrderTotal"><i className={"fa fa-" + this.state.orderData.currency}></i> {parseInt(this.state.orderData.total).toFixed(2)}</span>
                       </div> 
                      </div>
                    </div>  
                  </div>
                </div>
              </div>
             </div> 
            </div>
            <div className="col-xl-12 col-md-12 col-sm-12 col-xs-12 outerbox table-responsive">
              <table className="table orderTable">
                <thead>
                  <tr>
                    <th></th>
                    <th>Products Name</th>
                    <th className="textAlignRight">Price</th>
                    <th className="textAlignRight">Quantity</th>
                    <th className="textAlignRight">SubTotal</th>
                  </tr>
                </thead>
                <tbody>
                  {
                      this.state.orderData.products && this.state.orderData.products.length > 0 ?
                        this.state.orderData.products.map((data, index) => {
                          // console.log("order data====",data);
                          return (
                            <tr key={'cartData' + index}>
                              <td><img alt="Product_Image" className="img orderImg" src={data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.jpg"} /></td>
                              <td>
                                {/* <a href={"/productdetails/"+dara.productDetail.productUrl+" " + data.product_ID}> */}
                                <a href={"/product-detail/"+"producturl/" +data.product_ID}>
                                  {data.productNameRlang?
                                    <h5 className="productNameRlang RegionalFont">{data.productNameRlang}</h5>
                                  :
                                    <h5 className="productName">{data.productName}</h5>
                                  }
                                </a>

                                {data.discountPercent ?
                                  <div className="col-xl-12 col-md-12 col-sm-12 col-xs-12  NOpadding">
                                    <span className="cartOldprice"><i className="fa fa-inr cartOldprice"></i>{Math.floor(data.originalPrice)}</span> &nbsp; &nbsp;
                                    <span className="cartPrice"><i className="fa fa-inr"></i>{Math.floor(data.discountedPrice)}</span> &nbsp; &nbsp;
                                    <span className="cartDiscountPercent">( {Math.floor(data.discountPercent)}% Off )</span>
                                  </div>
                                  :
                                  <span className="price"><i className="fa fa-inr"></i>{data.originalPrice}</span>
                                }
                                <div>
                                  {data.color ? <span className="cartColor">Color : <span style={{ backgroundColor: data.color, padding: '0px 5px' }}>&nbsp;</span> {ntc.name(data.color)[1]}, </span> : null}
                                  {data.size ? <span className="cartColor">Size : {data.size}</span> : null} &nbsp;
                                  {data.size && data.unit ? <span className="cartColor">{data.unit}</span> : null}
                                </div>
                              </td>
                              <td className="textAlignRight">
                                {/* <span className="productPrize textAlignRight"><i className={"fa fa-" + data.currency}></i> &nbsp;{parseInt(data.discountedPrice).toFixed(2)}</span> */}
                                <span className="productPrize textAlignRight"><i className="fa fa-inr"></i> &nbsp;{Math.floor(parseInt(data.discountedPrice).toFixed(2))}</span>
                              </td>
                              <td className="textAlignRight">
                                <span className=" textAlignRight">{data.quantity}</span>
                              </td>
                              <td className="textAlignRight">
                                {/* <span className="productPrize textAlignRight"><i className={"fa fa-" + data.currency}></i> &nbsp;{parseInt(data.subTotal).toFixed(2)}</span> */}
                                <span className="productPrize textAlignRight"><i className="fa fa-inr"></i> &nbsp;{Math.floor(parseInt(data.subTotal).toFixed(2))}</span>
                              </td>
                            </tr>
                          );
                        })
                      :
                      null
                  }
                </tbody>
              </table>

            </div>

            <div className="backtoMyOrdersDiv">
              <a href="/my-orders" className="backtoMyOrders"> Back to My Orders</a>
            </div>
            <hr />

          </div>

        </div>
      </div>
	  <Footer />
	  </div>
    );
  }
}


export default Payment;