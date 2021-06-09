import React, { Component } from 'react';
import axios                from 'axios';
import $, { data, event }                    from 'jquery';
import moment               from "moment";
import { FaStar }           from 'react-icons/fa';
import                      'bootstrap/dist/css/bootstrap.min.css';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';
import Sidebar              from '../../Themes/Sampurna/blocks/StaticBlocks/Sidebar/Sidebar.js';
import Address              from '../../Themes/Sampurna/blocks/StaticBlocks/Address/Address.js';
import BreadCrumbs          from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';
import ReturnStatus         from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/ReturnStatus.jsx';
import StepWizard           from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/StepWizard.jsx';
import Countdown            from "react-countdown";
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
    
    // $.validator.setDefaults({
    //   debug: true,
    //   success: "valid"
    // });
    // $("#returnForm").validate({
    //   rules: {
    //     reasonForReturn: {
    //       required: true,
    //     },
    //     bankname: {
    //       required: true,
    //     },
    //     bankacctno: {
    //       required: true,
    //     },
    //     ifsccode: {
    //       required: true,
    //     }
    //   },
    //   errorPlacement: function (error, element) {
    //     if (element.attr("name") === "reasonForReturn") {
    //       error.insertAfter(".reasonForReturn");
    //     }
    //     if (element.attr("name") === "bankname") {
    //       error.insertAfter("#bankname");
    //     }
    //     if (element.attr("name") === "bankacctno") {
    //       error.insertAfter("#bankacctno");
    //     }
    //     if (element.attr("name") === "ifsccode") {
    //       error.insertAfter("#ifsccode");
    //     }
    //   }
    // });
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
    axios.get("/api/users/" +this.state.user_ID)
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
  submitReview(event) {
    $('.fullpageloader').show();
    event.preventDefault();
    var rating = $('input[name="ratingReview"]:checked', '.feedbackForm').val();
    // console.log("rating===",rating);
    // if(rating < 0 || rating === undefined){
    //   this.setState({
    //     reviewStarError: "Please give star rating."
    //   })
    // }else{
      if (this.state.customerReview.length > 0) {
        if(this.state.rating_ID){
          var formValues = {
            "rating_ID" : this.state.rating_ID,
            "customerID": localStorage.getItem('user_ID'),
            "customerName": this.state.customerName,
            "orderID": this.state.orderID,
            "productID": this.state.productID,
            // "rating": parseInt(rating),
            "rating": this.state.ratingReview,
            "customerReview": this.state.customerReview
          }
          
          axios.patch("/api/customerReview/patch", formValues)
          .then((response) => {
            $('.fullpageloader').hide();
            this.setState({
              messageData: {
                "type": "outpage",
                "icon": "fa fa-check-circle",
                "message": response.data.message,
                "class": "success",
                "autoDismiss": true
              }
            })
            setTimeout(() => {
              this.setState({
                messageData: {},
              })
            }, 3000);
            var modal = document.getElementById('feedbackProductModal');
            modal.style.display = "none";

            $('.modal-backdrop').remove();
          })
          .catch((error) => {
          })
        }else{
          formValues = {
            "customerID": this.state.userID,
            "customerName": this.state.reviewuserData.profile.fullName,
            "orderID": this.state.orderID,
            "productID": $(event.currentTarget).data('productid'),
            "rating": parseInt(rating),
            "customerReview": $('.feedbackForm textarea').val()
          }
          axios.post("/api/customerReview/post", formValues)
          .then((response) => {
            $('.fullpageloader').hide();
            this.setState({
              messageData: {
                "type": "outpage",
                "icon": "fa fa-check-circle",
                "message": response.data.message,
                "class": "success",
                "autoDismiss": true
              }
            })
            setTimeout(() => {
              this.setState({
                messageData: {},
              })
            }, 3000);
            var modal = document.getElementById('feedbackProductModal');
            modal.style.display = "none";

            $('.modal-backdrop').remove();
          })
          .catch((error) => {
          })
        }
      }else{
        this.setState({
          reviewTextError: "Please Enter your feedback."
        })
      }
    //}
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
  getoneproductdetails(event) {
    var productID = event.target.id;
    var customerID = this.state.userID;
    var orderID = event.target.getAttribute('orderid');
    this.setState({ orderID: orderID });
    
    axios.get("/api/products/get/one/" + productID)
    .then((response) => {
      this.setState({
        oneproductdetails: response.data
      }, () => {
      })
    })
    .catch((error) => {
      console.log('error', error);
    })
    
    axios.get("/api/customerreview/get/order/list/"+customerID+"/"+orderID+"/"+productID )
    .then((response) => {
      if(response.data){
        this.setState({
          rating_ID       : response.data._id,
          customerID      : response.data.customerID,
          customerName    : response.data.customerName,
          customerReview  : response.data.customerReview,
          orderID         : response.data.orderID,
          productID       : response.data.productID,
          rating          : response.data.rating,
          ratingReview    : response.data.rating
        })
      }
    })
    .catch((error) => {
      console.log('error', error);
    })
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
    console.log("formValues=",formValues);
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
    console.log("1.this.state.orderData=",this.state.orderData);
    return (
      <div className="col-12 NoPadding">
        <Header />
        <div className="container">
          <Message messageData={this.state.messageData} />
          {
            this.state.loading ?
              <div className="col-12 loaderHeight"><Loader type="fullpageloader" /></div> 
              :

              <div className="col-12 NOpadding">
                <br />
               <div className="row"> 
                <div className="col-12 col-xl-3 col-md-12 col-sm-12 myOrderSidebar ">
                  <Sidebar />
                </div>

                <div className="col-12 col-xl-9 col-md-12">
                  <div className="col-12">
                      <h4 className="table-caption">My Orders</h4>
                  </div>

                  <div className="col-12">
                    {this.state.orderData && this.state.orderData.length > 0 ? 
                      this.state.orderData.map((singleOrder, index) => {
                        return(
                          <div className="col-12 NoPadding orderIdborder">
                            <div className="col-12  NoPadding orderNowrapper mb-4 pb-2">
                              <div className="row">
                                <div className="col-6">
                                    <div className="orderIdBtn col-12 col-md-12">{"Order ID : "+(singleOrder.orderID)}</div>
                                </div>                       
                                <div className="col-6 NOpadding">
                                    <div className="col-12 text-right">Date - {moment(singleOrder.createdAt).format("DD MMMM YYYY")}</div>
                                </div>                        
                              </div> 
                            </div> 
                            <div className="col-12 totalOrderBlock pb-2">
                              <div className="row">
                                <div className="col-6 NoPadding">
                                  <div className={"col-12 pull-left"}> Total Amount</div>
                                  <div className={"col-12 pull-left"}> {this.state.currency} &nbsp; {singleOrder.paymentDetails.netPayableAmount}</div>
                                </div>                       
                                <div className="col-6 NOpadding">
                                    <div className="col-4 orderStatus pull-right ">{singleOrder.orderStatus}</div> 
                                </div>                        
                              </div> 
                            </div> 
                              {
                                singleOrder && singleOrder.vendorOrders && singleOrder.vendorOrders.length > 0 ?                    
                                singleOrder.vendorOrders.map((vendordata, index) => {
                                    // console.log("orderData:",vendordata);
                                    return (
                                      <div className="col-12 vendorwiseOrderHistory mb-4 mt-4">
                                        <div className="col-12" >
                                        <div key={index} className={"row "}>
                                          <div className="col-4 NoPadding ">
                                              <span className="">{vendordata.vendorName}</span> &nbsp;
                                          </div>           
                                          <div className="col-6">
                                              <div className="row ">   
                                                    <div className="col-12 title NoPadding">
                                                      <div className="row">
                                                          <span className="col-6 ">&nbsp; Number Of Items </span>
                                                          <span className="col-1">:</span>
                                                          <span className="col-5 ">
                                                              {vendordata.order_numberOfProducts} 5
                                                          </span>
                                                      </div>
                                                    </div>             
                                                    <div className="col-12">
                                                        <div className="row">
                                                          <span className="col-6 ">&nbsp; Amount </span>
                                                          <span className="col-1">:</span>
                                                          <span className="col-5 "> 
                                                              {this.state.currency} &nbsp;{vendordata.vendor_beforeDiscountTotal > 0 ? (vendordata.vendor_beforeDiscountTotal).toFixed(2) : 0.00} 
                                                          </span>
                                                        </div>
                                                    </div>
                                              </div>
                                          </div>
                                          <div className="col-2 orderStatus">
                                            {vendordata.orderStatus}
                                          </div>
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

                              <div className="col-12 "> 
                                  <div className="row">
                                    <div className="col-6 pull-left orderBtnWrapper">
                                      <button className=" btn btn-secondary col-6 ">
                                        <a href="/order-details" className="col-12 showDetailsBtn ">Show Details</a>
                                      </button>
                                    </div>
                                    <div className="col-5 offset-1 pull-right ">
                                        <button className=" btn btn-danger cancelbtn col-12 " id={singleOrder._id} onClick={this.cancelProductAction.bind(this)} >Cancel Order Within &nbsp;
                                          <Countdown date={Date.now() + 10000} />
                                          &nbsp; Min
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

                    {/* feedbackProductModal */}

                    {/* <div className="modal" id="feedbackProductModal" role="dialog">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header feedbackModalHeader">
                            <img src="/favicon.ico" alt="" />
                            <h4 className="modal-title modalheadingcont">PRODUCT REVIEW</h4>
                            <button type="button" className="close modalclosebut" onClick={this.closeModal.bind(this)} data-dismiss="modal">&times;</button>
                          </div>
                          <div className="modal-body">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-xs-12">
                              <table className="data table table-order-items history" id="my-orders-table">
                                <thead>
                                  <tr>
                                    <th scope="col" className="col id">Product Image</th>
                                    <th scope="col" className="col id">Product Name</th>
                                    <th scope="col" className="col date textAlignRight">Price</th>
                                  </tr>
                                </thead>
                                <tbody>{
                                  this.state.oneproductdetails ?
                                    <tr>
                                      <td data-th="Order #" className="col id orderimgsize"><img src={this.state.oneproductdetails.productImage[0] ? this.state.oneproductdetails.productImage[0] : "/images/eCommerce/notavailable.jpg" } alt="" /></td>
                                      {this.state.oneproductdetails.productNameRlang?                                      
                                        <td data-th="Order #" className="col id RegionalFont">{this.state.oneproductdetails.productNameRlang}</td>
                                      :
                                        <td data-th="Order #" className="col id">{this.state.oneproductdetails.productName}</td>
                                      }
                                      
                                      <td data-th="Order Total" className="col total textAlignRight"><span><i className={"fa fa-" + this.state.oneproductdetails.currency}> {this.state.oneproductdetails.discountedPrice}</i></span></td>
                                    </tr>
                                    :
                                    null
                                }
                                </tbody>
                              </table>
                              <form className="feedbackForm col-12" id="">
                                <div className="col-12 row">
                                  <fieldset className="ratingReview stars givefeedback ">
                                    <input type="radio" id="star1" name="ratingReview" checked={this.state.ratingReview === 1 ? true : false} onChange={this.ratingReview.bind(this)} value="1" /><label htmlFor="star1"></label>
                                    <input type="radio" id="star2" name="ratingReview" checked={this.state.ratingReview === 2 ? true : false} onChange={this.ratingReview.bind(this)} value="2" /><label htmlFor="star2"></label>
                                    <input type="radio" id="star3" name="ratingReview" checked={this.state.ratingReview === 3 ? true : false} onChange={this.ratingReview.bind(this)} value="3" /><label htmlFor="star3"></label>
                                    <input type="radio" id="star4" name="ratingReview" checked={this.state.ratingReview === 4 ? true : false} onChange={this.ratingReview.bind(this)} value="4" /><label htmlFor="star4"></label>
                                    <input type="radio" id="star5" name="ratingReview" checked={this.state.ratingReview === 5 ? true : false} onChange={this.ratingReview.bind(this)} value="5" /><label htmlFor="star5"></label>
                                  </fieldset>
                                  <div className="clearfix "></div>
                                </div>
                                <label className="error">{this.state.reviewStarError}</label>
                                <div className="row inputrow">
                                  <label className="col-12 mt15">Write review</label>
                                  <div className="col-12 ">
                                    <textarea rows="5" className="col-12 " onChange={this.handleChangeReview.bind(this)} value={ this.state.customerReview} name="customerReview"></textarea>
                                    <label className="error">{this.state.reviewTextError}</label>
                                  </div>
                                </div>
                                <div className="row inputrow">
                                </div>
                              </form>
                            </div>

                          </div>
                          <div className="modal-footer modalfooterborder ">
                            <div className="col-12 actionbtn ">
                              <button className="btn mt15" onClick={this.submitReview.bind(this)} data-productid={this.state.oneproductdetails && this.state.oneproductdetails._id}
                              >{this.state.rating_ID ? 'Update' :'Submit'}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                 */}
                
                  </div>
                </div>
               </div> 
              </div>
          }
        </div>
        <Footer />
      </div>
    );
  }
}

