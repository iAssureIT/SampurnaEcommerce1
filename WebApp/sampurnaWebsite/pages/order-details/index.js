import React, { Component } from 'react';
import axios from 'axios';
import moment from "moment";
import 'react-step-progress/dist/index.css';
import Message from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import ProductsView from '../../Themes/Sampurna/blocks/StaticBlocks/ProductsView/ProductsView.js';
import Style from './index.module.css';
import openSocket from 'socket.io-client';
import getConfig from 'next/config';

// import $ from 'jquery';
// import ReturnStatus         from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/ReturnStatus.jsx';
// import StepWizard from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/StepWizard.jsx';
// import OrderStatusWizard from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/OrderStatusWizard.js';

const { publicRuntimeConfig } = getConfig();
const socket = openSocket(publicRuntimeConfig.API_BASE_URL, { transports: ['websocket'], upgrade: false });

export default class OrderDetails extends Component {
  constructor(props) {
    super(props);
    if (!this.props.loading) {
      this.state = {
        "orderID": "",
        "userID": "",
        labels: [],
        customerReview: "",
        loading: false
      };
    } else {
      this.state = {
        "orderData": [],
        "orderID": "",
        "user_ID": "",
        loading: true
      };
    }
  }

  componentDidMount() {
    window.scroll(0,0);
    var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    var currency = sampurnaWebsiteDetails.preferences.currency;
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    // console.log("userDetails===",userDetails);
    this.setState({
      user_ID: userDetails.user_id,
      email: userDetails.email,
      fullName: userDetails.firstName + " " + userDetails.lastName,
      currency: currency,
    }, () => {
      this.getMyOrders();
      this.getMyUser();
      // this.getAllorderStatus();
      var labels = [
        {
          label: 'New Order',
          name: 'step 1',
        },
        {
          label: 'Processing',
          name: 'step 2',
        },
        // {
        //   label: 'Ready to Dispatch',
        //   name: 'step 3',
        // },
        {
          label: 'On the Way',
          name: 'step 3',
        },
        {
          label: 'Delivered',
          name: 'step 4',
          stepClass : 'delivered'
        }
      ]
      this.setState({ labels: labels, labelsArray: labels })
    })
  }

  componentDidUpdate(prevProps){
    if(this.props.order_id !== prevProps.order_id){
      window.scroll(0,0);
      var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
      var currency = sampurnaWebsiteDetails.preferences.currency;
      var userDetails = JSON.parse(localStorage.getItem('userDetails'));
      this.setState({
        user_ID: userDetails.user_id,
        email: userDetails.email,
        fullName: userDetails.firstName + " " + userDetails.lastName,
        currency: currency,
      }, () => {
        this.getMyOrders();
        this.getMyUser();
      });
    }
  }

  // getMyOrders() {
  //     axios.get("/api/orders/get/one/" +this.props.order_id)
  //     .then((response) => {
  //       if(response){
  //         console.log("socket response.data=>",response);
  //         this.setState({
  //           orderData: response.data,
  //           loading: false
  //         }, () => {
  //           console.log("orderDetails orderData after setstate=>",this.state.orderData);
  //         })
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('error', error);
  //     })
  // }

  getMyOrders() {
    console.log("this.props.order_id=",this.props.order_id);
    socket.emit('room', this.props.order_id);
    socket.emit('signle_order', this.props.order_id);
    socket.on('getSingleOrder', (response) => {
      // console.log("response==",response);
      if (response) {
        console.log("socket response.data=>", response);
        this.setState({
          orderData: response,
          loading: false
        }, () => {
          console.log("orderDetails orderData after setstate=>",this.state.orderData);
        })
      }
    })
  }

  getAllorderStatus() {
    axios.get('/api/orderstatus/get/list')
      .then((response) => {
        // console.log("getAllorderStatus 402 response ==>",response)
        this.setState({ AllOrderStatus: response.data });
        // return response.data
      })
      .catch((error) => {
        console.log("Error in orderstatus = ", error);
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("userDetails");
          localStorage.clear();
          swal({
            title: "Your Session is expired.",
            text: "You need to login again. Click OK to go to Login Page"
          })
            .then(okay => {
              if (okay) {
                window.location.href = "/login";
              }
            });
        }
      })
  }

  getMyUser() {
    axios.get("/api/users/get/id/" + this.state.user_ID)
      .then((response) => {
        this.setState({
          reviewuserData: response.data
        }, () => {
          // console.log("reviewuserData=",this.state.reviewuserData);
        })
      })
      .catch((error) => {
        console.log('Error while getting User data', error);
      })
  }

  cancelButton = (orderDate) => {
    // console.log("orderData===",this.state.orderData);
    var min = moment(orderDate).add(this.state.orderData.maxDurationForCancelOrder, 'minutes');
    var duration = moment.duration(min.diff(new Date())).asSeconds();
    if (duration > 0 && duration < this.state.orderData.maxDurationForCancelOrder * 60) {
      var that = this;
      setTimeout(function () { that.getMyOrders() }, Math.abs(duration) * 1000);
      return true;
    } else {
      return false;
    }
  }

  cancelProductAction(event) {
    event.preventDefault();
    var id = event.target.getAttribute('id');
    // console.log("id===",id);

    var formValues = {
      "order_id": id,
      "userid": this.state.user_ID,
      "type": "vendororder",
      "vendor_id": '',
    }

    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to cancelled order?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
    })

      .then(willDelete => {
        if (willDelete) {
          axios.patch('/api/orders/cancel/order', formValues)
            .then((response) => {
              // console.log("cancel order response:",this.state.orderData);
              // $('.fullpageloader').hide();
              this.getMyOrders();
              const el = document.createElement('div')
              el.innerHTML = "<a href='/CancellationPolicy' style='color:blue !important'>View Cancellation Policy</a>"

              axios.get('/api/orders/get/one/' + id)
                .then((res) => {
                  // =================== Notification OTP ==================
                  if (res) {
                    var sendData = {
                      "event": "4",
                      "toUser_id": this.state.user_id,
                      "toUserRole": "user",
                      "variables": {
                        "Username": res.data.userFullName,
                        "orderId": res.data.orderID,
                        "orderdate": moment(res.data.createdAt).format('DD-MMM-YY LT'),
                      }
                    }
                    // console.log('sendDataToUser==>', sendData)
                    axios.post('/api/masternotifications/post/sendNotification', sendData)
                      .then((res) => { })
                      .catch((error) => { console.log('notification error: ', error) })
                  }
                })
              // =================== Notification ==================

              this.setState({
                messageData: {
                  "type": "outpage",
                  "icon": "fa fa-exclamation-circle",
                  "message": "Your order is cancelled. Refund will be made as per Cancellation Policy",
                  "class": "warning",
                  "autoDismiss": true
                }
              })
              setTimeout(() => {
                this.setState({
                  messageData: {},
                })
              }, 3000);

            })
            .catch((error) => {
            })
          swal("Cancelled!", "Your order cancelled successfully!", "success");
        } else {
          swal("Your order is safe!");
        }
      })
  }

  closeModal(event) {
    this.setState({
      rating: "",
      ratingReview: "",
      customerReview: ""
    })
  }

  render() {
    // console.log("this.state.orderData.paymentDetails===",this.state.orderData.paymentDetails);
    // console.log("this.state.orderData.paymentDetails===",this.state.orderData);
    return (
      <div className={"col-12 NoPadding pt-4 " + Style.orderDetailMainWrapper} id="orderDetailMainID" >
        <div className={" " + Style.container1}>
          {/*<Message messageData={this.state.messageData} />*/}
          {
            this.state.orderData && this.state.orderData.paymentDetails &&
            <div className="col-12 NoPadding">
              <br />
              <div className="row">
                <div className="col-12 col-xl-10 pl-xl-1 ">
                  <div >
                    <h4 className={"table-caption mb-1 mt-4 pb-xl-2 " + Style.mainTitle}>My Order Details</h4>
                  </div>
                  <div className={"col-12 NoPadding orderDetailsTopBlock "+ Style.orderDetailsTopBlock}>
                    <div className="col-12 NoPadding orderDetailsTop " style={{
                      'backgroundColor': this.state.orderData.orderStatus === "New" && '#033554' ||
                        this.state.orderData.orderStatus === "Delivered" && '#3E9D5E' ||
                        this.state.orderData.orderStatus === "Cancelled" && '#E88686'
                    }}>
                    <div className={"row " + Style.ptb15}>
                      <div className={"col-6 "+ Style.leftSideMyOrderHeaderWrapper}>
                        <div className="col-12">
                          <div className="col-12">{"Order Status : " + (this.state.orderData.orderStatus === "New"?"New Order":this.state.orderData.orderStatus)}</div>
                          <div className="col-12">{"Order ID : " + (this.state.orderData.orderID)}</div>
                          <div className="col-12">Total Amount  &nbsp;&nbsp;<span className={" "+Style.leftSideMyOrderTotalWrapper}>{this.state.currency} {this.state.orderData.paymentDetails.netPayableAmount}</span></div>
                          <div className="col-12">
                            Credits Points &nbsp;&nbsp;<span className={" "+Style.leftSideMyOrderTotalWrapper}>{this.state.currency} {this.state.orderData.paymentDetails.creditPointsEarned}{this.state.orderData.paymentDetails.creditPointsValueEarned}</span>
                          </div>
                        </div>
                      </div>
                      <div className={"col-6 " + Style.rightside}>
                        <div className="">
                          <div className={"col-12 "+Style.myOrdersDetDateAndTime}>
                            <span className="col-12 text-right d-lg-block d-xl-block d-none">Date : {moment(this.state.orderData.createdAt).format("DD/MM/YYYY")}&nbsp;&nbsp;<span className={" "+ Style.rightSideDateWrapper2}></span>&nbsp;&nbsp;{moment(this.state.orderData.createdAt).format("hh:mm a")}</span>

                            <span className="col-12 text-right d-block d-lg-none d-xl-none">{moment(this.state.orderData.createdAt).format("DD/MM/YYYY")}&nbsp;&nbsp;{moment(this.state.orderData.createdAt).format("hh:mm A")}</span>

                          </div>
                          <div className={"col-12 "+Style.myOrderDeliveryDetails}>
                            <div className="col-12"> <i className="fas fa-wallet"></i>&nbsp; {this.state.orderData.paymentDetails.paymentMethod}</div>
                          </div>
                          <div className={"col-12 "+Style.rightSideDateWrapper1}>
                            <div className="col-lg-6 float-right col-12 orderAddress">
                              <i className="fas fa-map-marker-alt"></i>&nbsp; {this.state.orderData.deliveryAddress.addressLine1} , <br />{this.state.orderData.deliveryAddress.addressLine2}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                    {
                      this.state.orderData && this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length > 0 ?
                        this.state.orderData.vendorOrders.map((vendordata, index) => {
                          var labels = this.state.labelsArray;
                          var index1 = this.state.labels.map(e => e.label).indexOf(vendordata.orderStatus);
                          
                          return (
                            <div key={index} style={{ marginBottom: "0px" }} className={" pb-3 vendorwiseOrderHistory " + Style.vendorRow}>
                              <div className="row NOpadding vendorNameBlock pt-4 pb-4">
                                <div className="col-12">
                                  <div className="row">
                                    <div className="col-7 NOpadding">
                                      <span className="col-12 orderDetailsVendorName">{vendordata.vendorName}</span> &nbsp;
                                    </div>
                                    <div className="col-5 pull-right">
                                      {this.state.orderData.orderStatus !== "Cancelled" &&
                                        this.cancelButton(this.state.orderData.createdAt) &&
                                        <div className="col-12 NoPadding">
                                          <div className={"col-12 text-right cancelOrderbtn " + Style.cancelBtn} id={this.state.orderData._id} onClick={this.cancelProductAction.bind(this)}> Cancel Order before  {moment(this.state.orderData.createdAt).add(this.state.orderData.maxDurationForCancelOrder, 'minutes').format("hh:mm A")} </div>
                                        </div>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {vendordata.deliveryStatus[vendordata.deliveryStatus.length - 1].status !== 'Cancelled' ?
                                <div className="col-12 NoPadding pb-xl-5 ">
                                  <div className="row">
                                    {
                                      this.state.labels.map((step,index)=>{
                                        if(index === 0){
                                          var barCls = Style.firstStepBar;
                                        }else{
                                          var barCls = Style.stepBar;
                                        }

                                        if(index === this.state.labels.length -1){
                                          var barCls = Style.lastStepBar;
                                        }

                                        if(index1 === index){
                                          var actCls = Style.actRound;
                                        }else{
                                          var actCls = "";                                        
                                        }

                                        if((index < index1) || (index1 === -1 && index === 0) || (index1 === -1 && index === 1) ||
                                           (index1 === this.state.labels.length-1) ){
                                          var doneCls = Style.doneRound;                                        
                                        }else{
                                          var doneCls = "";
                                        }


                                        return(
                                          <div className={Style.stepWrapper}>
                                            <div className={barCls}> </div>
                                            <div className={doneCls+" "+actCls+" "+Style.stepRound}>
                                              <div className={Style.indicatorNum}> {doneCls==="" ? index + 1 : null} </div>
                                            </div>
                                            <div className={"col-12 "+Style.progressStep}> {step.label} </div>
                                          </div>
                                        )
                                      })
                                    }
                                  </div>
                                </div>
                                : null
                              }
                              <div className="col-12">
                                <div className="col-12">
                                  <ProductsView
                                    vendorWiseOrderData={vendordata}
                                    orderData={this.state.orderData}
                                    orderStatus={vendordata.orderStatus}
                                    currency={this.state.currency}
                                    user_ID={this.state.user_ID}
                                    reviewuserData={this.state.reviewuserData}
                                    orderID={this.state.orderData._id}
                                  />
                                </div>
                              </div>
                              
                              <div className="col-12 d-lg-none d-xl-none d-block">
                                <div className="col-12 NOpadding" style={{ marginBottom: "20px" }} key={index}>
                                  <div className="row ">
                                    <div className="col-12 NOpadding OrderDetailAmountWrapper">
                                      <div className={"col-lg-8 offset-lg-2 col-sm-8 offset-sm-2 col-12 text-lg-right font-weight-bold " + Style.orderDetaiAmount}>
                                        <span className="col-lg-7 col-5 title">&nbsp; <b>Total</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span className="col-lg-5 col-7 textAlignRight title">&nbsp;
                                          <span className="currencyColor">{this.state.currency}</span> &nbsp;{vendordata.vendor_beforeDiscountTotal > 0 ? (vendordata.vendor_beforeDiscountTotal).toFixed(2) :"00.00"}
                                        </span>
                                      </div>
                                      <div className={"col-lg-8 offset-lg-2 col-sm-8 offset-sm-2 col-12 text-lg-right font-weight-bold " + Style.orderDetaiAmount}>
                                        <span className="col-lg-7 col-5 title OrderDetailAmountTitleWrapper"><b>You Save</b>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span className="col-lg-5 col-7 textAlignRight title">&nbsp;
                                          <span className="currencyColor">{this.state.currency}</span> &nbsp;<span className={" "+Style.savingaMTcOLOR}>{vendordata.vendor_discountAmount > 0 ? vendordata.vendor_discountAmount.toFixed(2) : "00.00"}</span>
                                        </span>
                                      </div>
                                      
                                    </div>
                                  </div>
                                </div>
                              </div>

                               <div className={"col-lg-12 pr-0 d-lg-block d-xl-block d-none pb-1 "+Style.orderDetailVendorAmtWrapper}>
                                 
                                 <div className={"col-lg-5 col-12 pr-0 pull-right  "+Style.orderDetailVendorAmtInnerWrapper}>
                                    <div className={"col-lg-6 col-12 float-left text-left "+Style.TotalAmtVendorColor}>Total</div>
                                    <div className={"col-lg-6 col-12 float-left "}>
                                      <span className="col-lg-4 d-inline-block  currencyColor">{this.state.currency}</span>
                                      <span className={"col-lg-8  d-inline-block  "+Style.orderDEtailvendrTotalColor}>{vendordata.vendor_beforeDiscountTotal > 0 ? (vendordata.vendor_beforeDiscountTotal).toFixed(2) :"00.00"}</span>
                                    </div>
                                  </div>
                              </div>

                              <div className={"col-lg-12 pr-0 d-lg-block d-xl-block d-none "+Style.orderDetailVendorAmtWrapper}>
                                
                               <div className={"col-lg-5 col-12 pr-0 pull-right  "+Style.orderDetailVendorAmtInnerWrapper}>
                                  <div className={"col-lg-6 col-12 float-left text-left "+Style.TotalAmtVendorColor}>You Save</div>
                                  <div className="col-lg-6 col-12 float-left ">
                                    <span className="col-lg-4 d-inline-block  currencyColor">{this.state.currency}</span>
                                    <span className={"col-lg-8  d-inline-block "+Style.savingaMTcOLOR}>{vendordata.vendor_discountAmount > 0 ? vendordata.vendor_discountAmount.toFixed(2) : "00.00"}</span>
                                  </div>                    
                                </div>
                              </div>

                             

                            </div>
                          );
                        })
                        :
                        <div className="col-12 textAlignCenter">
                          <div className="mt15 alert alert-warning textAlignCenter"><i className="fas fa-exclamation-circle"> </i>  No Orders Yet</div>
                          <img src="/images/eCommerce/emptyorder.png" alt="" />
                        </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
     
      </div>
    );
  }
}

