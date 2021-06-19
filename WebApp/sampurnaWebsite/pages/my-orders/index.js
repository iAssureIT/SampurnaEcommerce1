import React, { Component } from 'react';
import axios                from 'axios';
import $, { data, event }                    from 'jquery';
import moment               from "moment";
import { FaStar }           from 'react-icons/fa';
import                      'bootstrap/dist/css/bootstrap.min.css';
// import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
// import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';
// import Sidebar              from '../../Themes/Sampurna/blocks/StaticBlocks/Sidebar/Sidebar.js';
import Address              from '../../Themes/Sampurna/blocks/StaticBlocks/Address/Address.js';
import BreadCrumbs          from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';
import ReturnStatus         from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/ReturnStatus.jsx';
import StepWizard           from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/StepWizard.jsx';
// import Countdown            from "react-countdown";

import Style                  from './index.module.css';

export default class MyOrders extends Component {
  constructor(props) {
    super(props);
    if (!this.props.loading) {
      this.state = {
        "orderData": [],
        "orderID": "",
        "userID" : "",
        customerReview: "",
        loading: false
      };
    } else {
      this.state = {
        "orderData" : [],
        "orderID"   : "",
        "user_ID"   : "",
        loading     : true
      };
    }
  }

  componentDidMount() {
    console.log("this.props",this.props);
      var sampurnaWebsiteDetails  = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
      var currency = sampurnaWebsiteDetails.preferences.currency;
      var userDetails  = JSON.parse(localStorage.getItem('userDetails'));
      // console.log("userDetails===",userDetails);
      this.setState({
          user_ID : userDetails.user_id,
          email   : userDetails.email,
          fullName: userDetails.firstName +" "+userDetails.lastName ,         
          currency     : currency,
      },()=>{
        this.getMyOrders();
        this.getMyUser();
    })
  }
  getMyOrders() {
    // $('.fullpageloader').show(); 
      axios.get("/api/orders/get/list/" +this.state.user_ID)
      .then((response) => {
        if(response.data){
          console.log("response.data=>",response.data);
          $('.fullpageloader').hide();
          this.setState({
            orderData: response.data,
            loading: false
          }, () => {
            console.log("orderData after setstate=>",this.state.orderData);
          })
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  getMyUser() {    
    axios.get("/api/users/get/id/" +this.state.user_ID)
      .then((response) => {
        this.setState({
          reviewuserData: response.data
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  showFeedbackForm() {
    $('#feedbackFormDiv').show();
  }
 
  returnProduct(event) {
    $('#returnProductModal').show();

    var status = $(event.target).data('status');
    var id = $(event.target).data('id');
    var productid = $(event.target).data('productid');
    var altorderid = $(event.target).data('altorderid');
    var str = '';

    axios.get("/api/products/get/one/" + productid)
      .then((response) => {
        this.setState({
          oneproductdetails: response.data
        }, () => {
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
    if (status === "Paid") {
      str = 'Do you want to return order?';
      $('#returnProductBtn').attr('data-id', id);
      $('#returnProductBtn').attr('data-productid', productid);
      $('#returnProductBtn').attr('data-altorderid', altorderid);

      $('.cantreturn').hide();
      $('.canreturn').show();
    } else {
      str = "This order is not delivered yet. You cannot return this order.";

      $('.cantreturn').show();
      $('.canreturn').hide();
    }

    //$('.modaltext').html('');
    // $('.modaltext').append(str); 
  }
  
  returnProductAction(event) {
    event.preventDefault();

    var id = $(event.target).data('id');
    var productid = $(event.target).data('productid');
    var altorderid = $(event.target).data('altorderid');
    var reasonForReturn = $('.reasonForReturn').val();

    var formValues = {
      "orderID": id,
      "altorderid": altorderid,
      "productID": productid,
      "reasonForReturn": reasonForReturn,
      "bankname": $('#bankname').val(),
      "bankacctno": $('#bankacctno').val(),
      "ifsccode": $('#ifsccode').val()
    }
    

    if ($('#returnForm').valid()) {
      // $('.fullpageloader').show();
      axios.patch('/api/orders/get/returnOrder', formValues)
        .then((response) => {
          $('.fullpageloader').hide();
          this.getMyOrders();
          this.setState({
            messageData: {
              "type": "outpage",
              "icon": "fa fa-exclamation-circle",
              "message": response.data.message,
              "class": "warning",
              "autoDismiss": true
            }
          })
          setTimeout(() => {
            this.setState({
              messageData: {},
            })
          }, 3000);
          var modal = document.getElementById('returnProductModal');
          modal.style.display = "none";

          $('.modal-backdrop').remove();
        })

        .catch((error) => {
          console.log('error', error);
        })
    }
  }
  Closepagealert(event) {
    event.preventDefault();
    $(".toast-error").html('');
    $(".toast-success").html('');
    $(".toast-info").html('');
    $(".toast-warning").html('');
    $(".toast-error").removeClass('toast');
    $(".toast-success").removeClass('toast');
    $(".toast-info").removeClass('toast');
    $(".toast-warning").removeClass('toast');

  }
  cancelProduct(event) {

    $('#cancelProductModal').show();
    var status = $(event.target).data('status');
    var id = $(event.target).data('id');
    var str = '';

    if (status === "New Order" || status === "Verified" || status === "Packed") {
      str = 'Do you want to cancel order?';
      $('#cancelProductBtn').attr('data-id', id);
      $('.cantcancel').hide();
      $('.cancancel').show();
    }
    else {

      str = status === "Delivery Initiated" || status === "Delivered & Paid" ? "This order is delivered. You cannot cancel this order." : "This order is being dispatched. You cannot cancel this order.";

      $('.cantcancel').show();
      $('.cancancel').hide();
    }
    $('#cancelProductModal .modaltext').html('');
    $('#cancelProductModal .modaltext').append(str);
  }

  cancelProductAction(event) {
    event.preventDefault();
    $('.fullpageloader').show();
    var orderId = event.target.id;
    // var id = $(event.target).data('id');
    // var vendorid = event.target.getAttribute('vendorId');
    if(orderId){
      var formValues = {
        "order_id"   : orderId,
        "userid"    : this.state.user_ID,
        "type"      : "wholeorder",
        "vendor_id" : '',
      }
    }
    if(formValues){
    // console.log("formValues=",formValues);
    axios.patch('/api/orders/cancel/order', formValues)
      .then((response) => {
        // console.log("cancel order response:",this.state.orderData);
        $('.fullpageloader').hide();
        this.getMyOrders();
        const el = document.createElement('div')
        el.innerHTML = "<a href='/CancellationPolicy' style='color:blue !important'>View Cancellation Policy</a>"
        
        axios.get('/api/orders/get/one/' +orderId)
        .then((res) => {                                    
            // =================== Notification OTP ==================
        if(res){
          var sendData = {
            "event": "4",
            "toUser_id": this.state.user_ID,
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
    }
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleChangeReview(event) {
    this.setState({
      [event.target.name]: event.target.value,
      reviewTextError : event.target.value ? "" : "Please Enter your feedback."
    })
  }

  ratingReview(event){
    // console.log("event.target.value---",event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
      reviewStarError : event.target.value ? "" : "Please give star rating."
    },()=>{
      // console.log('ratingReview---', this.state.ratingReview);
      // console.log("reviewStarError===",this.state.reviewStarError);
    })
  }

  closeModal(event){
    this.setState({
      rating : "",
      ratingReview : "",
      customerReview : ""
    })
  }
  showOrdersDetails(event){
      event.preventDefault();
  }

  render() {
    // console.log("1. myorder page this.state.orderData=",this.state.orderData);
    return (
      <div className="col-12">
         <div className="row"> 
        {/* <Header /> */}
       
          <Message messageData={this.state.messageData} />
          {
            this.state.loading ?
              <div className="col-12 loaderHeight"><Loader type="fullpageloader" /></div> 
              :
              // <div className="col-12 NOpadding">
              //   <br />
               <div className="row"> 
                {/* <div className="col-12 col-xl-3 col-md-3 col-sm-3 myOrderSidebar ">
                  <Sidebar />
                </div> */}

                <div className="col-12 col-xl-12 col-md-12 col-sm-12 pr-0">
                  <div className="col-12">
                      <h4 className={"table-caption py-3 "}>My Orders</h4>
                  </div>

                  <div className="col-12">
                    {this.state.orderData && this.state.orderData.length > 0 ? 
                      this.state.orderData.map((singleOrder, index) => {
                        // console.log("singleOrder=",singleOrder);
                        return(
                          <div className={"col-12 NoPadding orderIdborder " +Style.orderIdborderNew} key={index}>
                            <div className="col-12  NoPadding orderNowrapper mb-4 ">
                              <div className={"row " +Style.ptb15}>
                                <div className="col-6">
                                    <div className="col-12"><b>{singleOrder.orderStatus}</b></div>
                                    <div className="col-12">{"Order ID : "+(singleOrder.orderID)}</div>
                                    <div className="col-12"><b>{"Total amount : "+this.state.currency +" " +(singleOrder.paymentDetails.netPayableAmount)}</b></div>
                                </div>                       
                                <div className={"col-6 " +Style.rightside}>
                                    <div className="row">
                                        <div className="col-12">
                                          <span className="col-6 text-right">Date - {moment(singleOrder.createdAt).format("DD MMMM YYYY")}&nbsp;</span>
                                          <span className="col-6 text-right">Time -  {moment(singleOrder.createdAt).format("HH:mm")}</span>
                                        </div>
                                        <div className="col-12">
                                            <div className="col-12"> Cash on delivery</div> 
                                        </div>
                                        <div className="col-12">
                                            <div className="col-12 orderAddress"> 
                                              {singleOrder.deliveryAddress.addressLine2}, <br/> {singleOrder.deliveryAddress.addressLine1}
                                            </div> 
                                        </div>
                                    </div>
                                </div>                        
                              </div> 
                            </div> 
                            
                              {
                                singleOrder && singleOrder.vendorOrders && singleOrder.vendorOrders.length > 0 ?                    
                                singleOrder.vendorOrders.map((vendordata, index) => {
                                    console.log(" single orderData:",vendordata);
                                    return (
                                      <div className={"col-12 vendorwiseOrderHistory " +Style.vendorRow}>
                                        <div className="col-12" >
                                        <div key={index} className={"row "}>
                                          <div className={"col-4 NoPadding "}>
                                              <span className=""><b>{vendordata.vendorName}</b></span> &nbsp;
                                          </div>           
                                          <div className={"col-6 " +Style.middleText}>
                                              <div className="row ">   
                                                  <div className="col-12 title NoPadding">
                                                    <div className="row">
                                                        <span className="col-4 ">&nbsp; No.Of Items </span>
                                                        <span className="col-1">:</span>
                                                        <span className="col-6 ">
                                                            {vendordata.vendor_numberOfProducts} 
                                                        </span>
                                                    </div>
                                                  </div>             
                                                  <div className="col-12">
                                                      <div className="row">
                                                        <span className="col-4 ">&nbsp; Amount </span>
                                                        <span className="col-1">:</span>
                                                        <span className="col-6 "> 
                                                            {this.state.currency} {vendordata.vendor_beforeDiscountTotal > 0 ? (vendordata.vendor_beforeDiscountTotal).toFixed(2) : 0.00} 
                                                        </span>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>

                                          {vendordata.orderStatus=== "Cancelled"?
                                            <span className={" col-2  orderStatusBadge badge badge-danger NoPadding "+Style.orderStatusBadge}>{vendordata.orderStatus}</span>
                                          :
                                            <span className={" col-2  orderStatusBadge badge badge-primary NoPadding "+Style.orderStatusBadge}>{vendordata.orderStatus}</span>
                                          }
                                        </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                  :
                                  <div className="col-12 textAlignCenter">
                                    <div className="mt15 alert alert-warning textAlignCenter"><i className="fa fa-exclamation-circle"> </i>  No Orders Yet</div>
                                    <img src="/images/eCommerce/emptyorder.png" alt=""/>
                                  </div>
                              }
                              <div className={"col-12 " +Style.vendorRowBottom}> 
                                  <div className="row">
                                    <div className="col-5  pull-left ">
                                        <div className={"col-12 cancelOrderbtn " +Style.cancelBtn} id={singleOrder._id} onClick={this.cancelProductAction.bind(this)}> Cancel Order before  {moment(singleOrder.createdAt).add(singleOrder.maxDurationForCancelOrder, 'minutes').format("HH:mm")  } </div>
                                    </div>
                                    <div className="col-7  pull-right orderBtnWrapper">
                                      <button className=" btn col-6 pull-right " onClick={()=>this.props.getOrderId(singleOrder._id)}>
                                        <a id="v-pills-settings2-tab" data-toggle="pill" href="#v-pills-settings2" role="tab" aria-controls="v-pills-settings2" aria-selected="false" className={"col-12 pull-right globalCommonBtn col-md-12 showDetailsBtn "} >Show Details</a>
                                      </button>
                                    </div>
                                  </div>
                              </div>
                          </div>
                        )
                      })
                    :
                    <div className="col-12 textAlignCenter">
                      <div className="mt15 alert alert-warning textAlignCenter"><i className="fa fa-exclamation-circle"> </i>  No Orders Yet</div>
                      <img src="/images/eCommerce/emptyorder.png" alt=""/>
                    </div>
                    }
                    {/* cancelProductModal */}
                    {/* <div className="modal" id="cancelProductModal" role="dialog">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <img src="" alt="" />
                            <button type="button" className="close modalclosebut" data-dismiss="modal">&times;</button>
                            <h4 className="modalTitle modalheadingcont">CANCEL ORDER</h4>
                          </div>
                          <div className="modal-body">
                            <h4 className="modaltext"></h4>
                          </div>
                          <div className="modal-footer">
                            <div className="cantcancel">
                              <a className="btn btn-warning" href="/ReturnPolicy">View Return Policy</a>
                              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                            <div className="cancancel">
                              <button className="btn btn-danger" onClick={this.cancelProductAction.bind(this)} id="cancelProductBtn" data-dismiss="modal"  >Yes</button>
                              <button type="button" className="btn btn-default" data-dismiss="modal">No</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}

                   
                
                  </div>
                </div>
               </div> 
          }
        </div>
        </div>
      
    );
  }
}

