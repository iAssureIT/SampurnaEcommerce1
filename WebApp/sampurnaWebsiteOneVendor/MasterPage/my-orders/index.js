import React, { Component } from 'react';
import axios                from 'axios';
import $, { data, event }                    from 'jquery';
import moment               from "moment";
import                      'bootstrap/dist/css/bootstrap.min.css';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';
import ReturnStatus         from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/ReturnStatus.jsx';
import StepWizard           from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/StepWizard.jsx';
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
    // console.log("this.props",this.props);
      $(window).scrollTop(0);
      var sampurnaWebsiteDetails  = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
      var currency = sampurnaWebsiteDetails.preferences.currency;
      var userDetails  = JSON.parse(localStorage.getItem('userDetails'));
      // console.log("userDetails===",userDetails);
      if(userDetails){
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
  }
  getMyOrders() {
    // $('.fullpageloader').show(); 
      axios.get("/api/orders/get/list/" +this.state.user_ID)
      .then((response) => {
        if(response.data){
          // console.log("response.data=>",response.data);
          $('.fullpageloader').hide();
          this.setState({
            orderData: response.data,
            loading: false
          }, () => {
            // console.log("myOrder orderData after setstate=>",this.state.orderData);
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
  
  cancelButton = (orderDate)=>{
    var min = moment(orderDate).add(this.state.orderData[0].maxDurationForCancelOrder, 'minutes');
    var duration = moment.duration(min.diff(new Date())).asSeconds();
    if(duration > 0 &&duration < this.state.orderData[0].maxDurationForCancelOrder*60){
      var that =this;
      setTimeout(function(){that.getMyOrders()},  Math.abs(duration) *1000);
      return true;
    }else{
      return false;
    }
  }

  cancelProductAction(event) {
    event.preventDefault();
    $('.fullpageloader').show();
    var orderId = event.target.id;    
    if(orderId){
      var formValues = {
        "order_id"   : orderId,
        "userid"    : this.state.user_ID,
        "type"      : "wholeorder",
        "vendor_id" : '',
      }
    }
    if(formValues){
    console.log("formValues=",formValues);
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
        // this.setState({
        //     messageData: {
        //       "type": "outpage",
        //       "icon": "fa fa-exclamation-circle",
        //       "message": "Your order is cancelled. Refund will be made as per Cancellation Policy",
        //       "class": "warning",
        //       "autoDismiss": true
        //     }
        //   })
        //   setTimeout(() => {
        //     this.setState({
        //       messageData: {},
        //     })
        //   }, 3000);
  
        })
        .catch((error) => {
            console.log("erroe while cancelling order=",error);
        })

        swal("Cancelled!", "Your order cancelled successfully!", "success");

      }else{
        swal("Your order is safe!");
      }
    });
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
    console.log("1. myorder page this.state.orderData=",this.state.orderData);
    return (
      <div className="col-12">
         <div className="row"> 
          <Message messageData={this.state.messageData} />
          {
            this.state.loading ?
              <div className="col-12 loaderHeight"><Loader type="fullpageloader" /></div> 
              :
               <div className="col-12"> 
                <div className="col-12 col-xl-12 col-md-12 col-sm-12 pr-0">
                  <div className="col-12">
                      <h4 className={"table-caption mb-2 "}>My Orders</h4>
                  </div>

                  <div className="col-12">
                    {this.state.orderData && this.state.orderData.length > 0 ? 
                      this.state.orderData.map((singleOrder, index) => {
                        // console.log("singleOrder=",singleOrder);
                        return(
                          <div className={"col-12 NoPadding orderIdborder " +Style.orderIdborderNew} key={index}>
                            <div className="col-12  NoPadding orderNowrapper mb-4 " style={{'backgroundColor': singleOrder.orderStatus==="New"&& '#033554' ||
                                                                                                              singleOrder.orderStatus==="Delivered" && '#3E9D5E' ||
                                                                                                              singleOrder.orderStatus==="Cancelled" && '#E88686'
                                                                                                               }}>
                              <div className={"row " +Style.ptb15}>
                                <div className="col-6">
                                    <div className="col-12"><b>{singleOrder.orderStatus}</b></div>
                                    <div className="col-12">{"Order ID : "+(singleOrder.orderID)}</div>
                                    <div className="col-12">Total Amount : &nbsp;<b>{this.state.currency} {singleOrder.paymentDetails.netPayableAmount}</b></div>
                                    <div className="col-12">
                                      Credits Points : &nbsp;<b>{this.state.currency} {singleOrder.paymentDetails.creditPointsEarned}{singleOrder.paymentDetails.creditPointsValueEarned}</b>
                                    </div>
                                </div>                       
                                <div className={"col-6 " +Style.rightside}>
                                    <div className="row">
                                        <div className="col-12">
                                          <span className="col-12 text-right">Date : {moment(singleOrder.createdAt).format("DD/MM/YYYY")}&nbsp;&nbsp;{moment(singleOrder.createdAt).format("hh:mm A")}</span>
                                          {/* <span className="col-6 text-right"></span> */}
                                        </div>
                                        <div className="col-12">
                                            <div className="col-12"> <i className="fas fa-wallet"></i>&nbsp; {singleOrder.paymentDetails.paymentMethod}</div> 
                                        </div>
                                        <div className="col-12">
                                            <div className="col-12 orderAddress"> 
                                            <i className="fa fa-map-marker-alt-alt"></i> {singleOrder.deliveryAddress.addressLine1} , <br/>{singleOrder.deliveryAddress.addressLine2} 
                                            </div> 
                                        </div>
                                    </div>
                                </div>                        
                              </div> 
                            </div> 
                            
                              {
                                singleOrder && singleOrder.vendorOrders && singleOrder.vendorOrders.length > 0 ?                    
                                singleOrder.vendorOrders.map((vendordata, index) => {
                                    // console.log(" single orderData:",vendordata);
                                    return (
                                      <div className={"col-12 vendorwiseOrderHistory " +Style.vendorRow} key={index}>
                                        <div className="col-12" >
                                        <div key={index} className={"row "}>
                                          <div className={"col-4 NoPadding "}>
                                              <span className={" "+Style.myOrderVendorNameWrapper}><b>{vendordata.vendorName}</b></span> &nbsp;
                                          </div>           
                                          <div className={"col-6 " +Style.middleText}>
                                              <div className="row ">                                                           
                                                  <div className="col-12">
                                                      <div className="row">
                                                        <span className="col-12 mx-5 ">Amount =   {vendordata.vendor_beforeDiscountTotal > 0 ? (vendordata.vendor_beforeDiscountTotal).toFixed(2) : 0.00} {this.state.currency}
                                                        </span>
                                                       
                                                      </div>
                                                  </div>
                                                  <div className="col-12 title NoPadding">
                                                    
                                                        <span className="col-12 mx-5 ">No.Of products : {vendordata.vendor_numberOfProducts} </span>
                                                    
                                                  </div>       
                                              </div>
                                          </div>

                                          {vendordata.orderStatus=== "Cancelled"&&
                                            <span className={" col-2  orderStatusBadge badge badge-danger NoPadding "+Style.orderStatusBadge2}>{vendordata.orderStatus}</span>
                                          }
                                          {vendordata.orderStatus=== "New"&&
                                            <span className={" col-2  orderStatusBadge badge  NoPadding "+Style.orderStatusBadge1}>{"Processing"}</span>
                                          }
                                          {vendordata.orderStatus=== "Processing"&&
                                            <span className={" col-2  orderStatusBadge badge  NoPadding "+Style.orderStatusBadge1}>{"Processing"}</span>
                                          }
                                          {vendordata.orderStatus=== "On the Way" &&
                                            <span className={" col-2  orderStatusBadge badge badge-primary NoPadding "+Style.orderStatusBadge1 +" " +Style.customeBadge +" " +Style.ontheWayBadge}>On the Way</span>
                                          }
                                          {vendordata.orderStatus=== "Ready to Dispatch"&&
                                            <span className={" col-2  orderStatusBadge badge badge-primary  NoPadding "+Style.orderStatusBadge1 +" " +Style.customeBadge +" " +Style.ontheWayBadge}>On the Way</span>
                                          }
                                          {vendordata.orderStatus=== "Delivered"&&
                                            <span className={" col-2  orderStatusBadge badge badge-success NoPadding "+Style.orderStatusBadge}>{vendordata.orderStatus}</span>
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
                                      <div className="col-5 pull-left">
                                        {this.cancelButton(singleOrder.createdAt)&& singleOrder.orderStatus === "New" &&
                                          <div className="col-12 ">
                                              <div className={"col-12 cancelOrderbtn " +Style.cancelBtn} id={singleOrder._id} onClick={this.cancelProductAction.bind(this)}> Cancel before  {moment(singleOrder.createdAt).add(singleOrder.maxDurationForCancelOrder, 'minutes').format("hh:mm:A")  } </div>
                                          </div>
                                        }
                                      </div>
                                    <div className="col-7  pull-right orderBtnWrapper">
                                      <button className=" btn col-6 float-right " onClick={()=>this.props.getOrderId(singleOrder._id)}>
                                        <a id="v-pills-settings2-tab" data-toggle="pill" href="#v-pills-settings2" role="tab" aria-controls="v-pills-settings2" aria-selected="false" className={"col-9 float-right showDetailsBtn "} >Show Details</a>
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
                  </div>
                </div>
               </div> 
          }
        </div>
        </div>
      
    );
  }
}

