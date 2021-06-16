import React, { Component } from 'react';
import axios                from 'axios';
import $                    from 'jquery';
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
import ProductsView         from './ProductsView.js';
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
            orderData: response.data[0],
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
    var id = $(event.target).data('id');

    var formValues = {
      "orderID": id,
      "userid": this.state.userID
    }
    axios.patch('/api/orders/get/cancelOrder', formValues)
      .then((response) => {
        // console.log("cancel order response:",this.state.orderData);
        $('.fullpageloader').hide();
        this.getMyOrders();
        const el = document.createElement('div')
        el.innerHTML = "<a href='/CancellationPolicy' style='color:blue !important'>View Cancellation Policy</a>"
        
        axios.get('/api/orders/get/one/' +id)
        .then((res) => {                                    
            // =================== Notification OTP ==================
        if(res){
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
  }
 
  handleChangeReview(event) {
    this.setState({
      [event.target.name]: event.target.value,
      reviewTextError : event.target.value ? "" : "Please Enter your feedback."
    })
  }

  ratingReview(event){
    console.log("event.target.value---",event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
      reviewStarError : event.target.value ? "" : "Please give star rating."
    },()=>{
      console.log('ratingReview---', this.state.ratingReview);
      console.log("reviewStarError===",this.state.reviewStarError);
    })
  }
  closeModal(event){
    this.setState({
      rating : "",
      ratingReview : "",
      customerReview : ""
    })
  }
  render() {
    return (
      <div className="col-12 NoPadding">
        <Header />
        <div className={" " +Style.container1 }>
          <Message messageData={this.state.messageData} />
          {
            this.state.loading ?
              <div className="col-12 loaderHeight"><Loader type="fullpageloader" /></div> 
              :
              <div className="col-12 NoPadding">
                <br />
               <div className="row"> 
                <div className="col-12 col-xl-3 col-md-12 col-sm-12 myOrderSidebar ">
                  <Sidebar />
                </div>

                <div className="col-12 col-xl-9 col-md-12">
                  <div className="col-12">
                      <h4 className={"table-caption " +Style.mainTitle}>Orders Details</h4>
                  </div>

                  <div className={"col-12 NoPadding orderIdborder " +Style.orderIdborderNew}>
                    <div className="col-12 NoPadding orderDetailsTop mb-4 ">
                      <div className={"row " +Style.ptb15}>
                        <div className="col-6 ">
                            <div className="col-12">{"Order Status : "+(this.state.orderData.orderStatus)}</div>
                            <div className="col-12">{"Order ID : "+(this.state.orderData.orderID)}</div>
                            <div className="col-12">{"Total amount : "+(this.state.orderData.orderID)}</div>
                        </div>                       
                        <div className={"col-6 " +Style.rightside}>
                            <div className="row">
                              <div className="col-12">
                                <span className="col-6 text-right">Date - {moment(this.state.orderData.createdAt).format("DD MMMM YYYY")}&nbsp;</span>
                                <span className="col-6 text-right">Time -  {moment(this.state.orderData.createdAt).format("HH:mm")}</span>
                              </div>
                              <div className="col-12">
                                  <div className="col-12"> Cash on delivery</div> 
                              </div>
                              <div className="col-12">
                                  <div className="col-12 orderAddress"> 
                                    {/* {this.state.deliveryAddress.addressLine2}, <br/> {this.state.deliveryAddress.addressLine1} */}
                                  </div> 
                              </div>
                            </div>
                        </div>
                        {/* <div className="col-6 NOpadding">
                          <div className="actionbtn col-12   NOpadding">
                            { this.state.orderData.deliveryStatus[this.state.orderData.deliveryStatus.length - 1].status !== 'Cancelled' ? 
                              <a className="btn filterallalphab" target="_blank" rel="noopener noreferrer" href={"/view-order/" + this.state.orderData._id} title="View Order">
                              <span> Invoice</span></a> : <div className="pull-right"><span className="cancelledtext"> Cancelled</span></div>
                            }*/}
                      </div> 
                    </div> 
                    {
                      this.state.orderData && this.state.orderData.vendorOrders && this.state.orderData.vendorOrders.length > 0 ?                    
                        this.state.orderData.vendorOrders.map((vendordata, index) => {
                          console.log( " Order details orderData:",vendordata);
                          return (
                            <div key={index} style={{marginBottom:"40px"}} className={"col-12 vendorwiseOrderHistory " +Style.vendorRow}>   
                              <div className="col-12 NOpadding vendorNameBlock pt-4 pb-4">
                                <div className="row">
                                  <div className="col-7 NOpadding">
                                      <span className="vendorName">{vendordata.vendorName}</span> &nbsp;
                                  </div> 
                                  <div className="col-5 pull-right">
                                      <div className={"col-12 cancelOrderbtn pull-right " +Style.cancelBtn +" "+Style.rightText} id={this.state.orderData._id} onClick={this.cancelProductAction.bind(this)}> Cancel Order before  {moment(this.state.orderData.createdAt).add(this.state.orderData.maxDurationForCancelOrder, 'minutes').format("HH:mm")  } </div>
                                  </div>    
                                </div>      
                              </div>
                              { vendordata.deliveryStatus[vendordata.deliveryStatus.length - 1].status !== 'Cancelled' ?
                                <div className="col-12 orderIdborder">
                                    <StepWizard data={vendordata} />
                                </div> :null
                              }

                              <ProductsView 
                                orderData = {vendordata.products}
                              />

                              <div className="col-12 orderbodyborder">
                                <div  className="col-12 NOpadding" style={{marginBottom:"20px"}} key={index}>
                                  <div className="row ">                                      
                                      <div className="col-12 NOpadding">
                                        <div className="col-8 offset-2">
                                            <span className="col-8 title">&nbsp; Amount</span>
                                            <span className="col-4 textAlignRight title">&nbsp; 
                                                {this.state.currency} &nbsp;{vendordata.vendor_beforeDiscountTotal > 0 ? (vendordata.vendor_beforeDiscountTotal).toFixed(2) : 0.00} 
                                            </span>
                                        </div>
                                        <div className="col-8 offset-2">
                                            <span className="col-8 title">&nbsp; Number Of Items</span>
                                            <span className="col-4 textAlignRight title">&nbsp; 
                                                {vendordata.order_numberOfProducts} 
                                            </span>
                                        </div>
                                      </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 orderfooterborder">
                                <div className="row">
                                  <div className="col-6">
                                    <p className="orderfootertag"><span>Ordered On: </span>{moment(vendordata.createdAt).format("DD MMMM YYYY")} </p>
                                  </div>
                                  <div className="col-6">
                                    <p className="orderfootertag2"><span>Ordered Total: </span> <i className="fa fa-inr"></i>&nbsp;{vendordata.vendor_afterDiscountTotal} </p>
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

