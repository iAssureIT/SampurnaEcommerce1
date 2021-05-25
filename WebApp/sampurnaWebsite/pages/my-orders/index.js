import React, { Component } from 'react';
import axios                from 'axios';
import $                    from 'jquery';
import moment       from "moment";
import { FaStar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
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

export default class MyOrders extends Component {
  constructor(props) {
    super(props);
    // console.log("this.props.loading===",this.props.loading);
    if (!this.props.loading) {
      this.state = {
        "orderData": [],
        "orderID": "",
        "userID" : "",
        customerReview: "",
        loading: false
        // "notificationData" :Meteor.subscribe("notificationTemplate"),
      };
    } else {
      this.state = {
        "orderData": [],
        "orderID": "",
        "userID" : "",
        loading: true
      };
    }
    // window.scrollTo(0, 0);
  }

  componentDidMount() {
    var userId = localStorage.getItem('user_ID');
    this.setState({"userID":userId},()=>{
        this.getMyOrders();
        this.getMyUser();
    });
    
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
      axios.get("/api/orders/get/list/" +this.state.userID)
      .then((response) => {
        $('.fullpageloader').hide();
        this.setState({
          orderData: response.data,
          loading: false
        }, () => {
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  getMyUser() {    
    axios.get("/api/users/" +this.state.userID)
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
      <div>
        <Header />
        {/* <BreadCrumbs /> */}
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
                <h4 className="table-caption">My Orders</h4>
                  
                  {
                    this.state.orderData && this.state.orderData.length > 0 ?                    
                      this.state.orderData.map((data, index) => {
                        // console.log("orderData:",data);
                        return (
                          <div key={index} style={{marginBottom:"40px"}} className={data.deliveryStatus[data.deliveryStatus.length - 1].status === 'Cancelled' ? "row cancelledorder" : "row"}>
                            <div className="col-12 orderIdborder">
                              <div className="col-12">
                               <div className="row">
                                <div className="col-6 NOpadding">
                                  <div className="orderIdButton globalBgColor col-12 col-md-12">{"Order ID : "+(data.orderID)}</div>
                                </div>  
                                <div className="col-6 NOpadding">
                                  <div className="actionbtn col-12   NOpadding">
                                    { data.deliveryStatus[data.deliveryStatus.length - 1].status !== 'Cancelled' ? 
                                      <a className="btn filterallalphab" target="_blank" rel="noopener noreferrer" href={"/view-order/" + data._id} title="View Order">
                                      <span> Invoice</span></a> : <div className="pull-right"><span className="cancelledtext"> Cancelled</span></div>
                                    } 
                                    
                                    {/* {
                                      data.deliveryStatus[data.deliveryStatus.length - 1].status === 'Cancelled' || data.deliveryStatus[data.deliveryStatus.length - 1].status === 'Returned' ? '' :
                                        data.deliveryStatus[data.deliveryStatus.length - 1].status === "New Order" || data.deliveryStatus[data.deliveryStatus.length - 1].status === "Verified"
                                          || data.deliveryStatus[data.deliveryStatus.length - 1].status === "Packed" ? <button type="button" data-toggle="modal" data-target="#cancelProductModal" className="btn filterallalphab" name="returnbtn" title="Cancel" onClick={this.cancelProduct.bind(this)}
                                            data-status={data.deliveryStatus[data.deliveryStatus.length - 1].status} data-id={data._id}>Cancel</button> : ''
                                    } */}
                                  </div>
                                </div>
                               </div> 
                              </div> 
                            </div>
                            { data.deliveryStatus[data.deliveryStatus.length - 1].status !== 'Cancelled' ?
                            <div className="col-12 orderIdborder">
                              <StepWizard data={data} />
                            </div> :null

                            }
                            <div className="col-12 orderbodyborder">
                              {
                              data.products && data.products.length > 0 ?
                                    data.products.map((pdata, index)=>{
                                      // console.log("pdata:",pdata);
                                      return(
                                        <div  className="col-12 NOpadding" style={{marginBottom:"20px"}} key={index}>
                                          <div className="row ">
                                           <div className="col-4 col-xl-2 col-md-4 col-sm-4 col-xs-2">
                                            <img src={pdata.productImage[0]?pdata.productImage[0]:"/images/eCommerce/notavailable.jpg"} style={{width:"100%"}} alt=""/>
                                           </div>
                                            <div className="col-4 NOpadding">
                                              {pdata.productNameRlang?
                                                <p> <a href={"/productdetails/"+pdata.product_ID} className="productname RegionalFont">{pdata.productNameRlang}</a></p>
                                              :
                                                <p> <a href={"/productdetails/"+pdata.product_ID} className="productname">{pdata.productName}</a></p>
                                              }
                                              { 
                                                pdata.discountPercent ?
                                                <div>
                                                  <span className="productCost"><i className="fa fa-inr"></i>&nbsp;{pdata.discountedPrice}</span> &nbsp;
                                                  <span className="oldprice productCost"><i className="fa fa-inr oldprice"></i>&nbsp;{pdata.originalPrice}</span> 
                                                </div>
                                                :
                                                <div>
                                                  <span className="productCost"><i className="fa fa-inr "></i>&nbsp;{pdata.originalPrice}</span> 
                                                </div>
                                              }
                                              
                                              <p>Quantity: {pdata.quantity}</p>
                                            </div>  
                                          <div className="col-2 NOpadding">
                                            <span className="productCost"><i className="fa fa-inr"></i>&nbsp;{pdata.subTotal}</span> &nbsp;
                                          </div>
                                          <div className="col-2 NOpadding">
                                          {
                                            data.deliveryStatus[data.deliveryStatus.length-1].status ==='New Order' ||
                                            data.deliveryStatus[data.deliveryStatus.length-1].status ==='Verified' || 
                                            data.deliveryStatus[data.deliveryStatus.length-1].status === 'Packed' || 
                                            data.deliveryStatus[data.deliveryStatus.length-1].status === 'Inspection' ||
                                            data.deliveryStatus[data.deliveryStatus.length-1].status === 'Dispatch Approved' 
                                            ? <p>Order Placed</p> 
                                            : (data.deliveryStatus[data.deliveryStatus.length-1].status === 'Dispatch' || 
                                              data.deliveryStatus[data.deliveryStatus.length-1].status === 'Delivery Initiated'
                                              ? <p>Out for Delivery</p> : (data.deliveryStatus[data.deliveryStatus.length-1].status === 'Delivered & Paid' ? <p>Delivered on <br/>{moment(data.deliveryStatus[data.deliveryStatus.length-1].date).format("DD MMMM YYYY")}</p>: "") )
                                          }
                                          </div>
                                          <div className="col-md-2 col-sm-3 col-xs-6 col-12"> 
                                            <div>
                                              {data.status === "Paid" ?
                                                <div data-th="Order Total" width="100" className="total actbtns">
                                                  <button type="button" data-toggle="modal" data-target="#feedbackProductModal" className="btn alphab filterallalphab fa fa-comment" title="Give Feedback" id={pdata.product_ID} orderid={data._id} onClick={this.getoneproductdetails.bind(this)}>                                                  
                                                  </button>
                                                  {/* {
                                                    data.status === 'Cancelled' || pdata.status === 'Returned' ? '' :
                                                      data.status === 'Paid' ? <button type="button" data-toggle="modal" data-target="#returnProductModal" className="btn alphab filterallalphab" name="returnbtn" title="Return"
                                                        onClick={this.returnProduct.bind(this)} data-status={data.status} data-id={data._id} data-altorderid={data.orderID} data-productid={pdata.product_ID}>
                                                        <i className="fa" data-status={data.status} data-id={data._id} data-productid={pdata.product_ID} >&#xf0e2;</i></button> : ''
                                                  } */}
                                                </div>
                                                :
                                                null
                                              }
                                              
                                            </div>
                                          </div>
                                         </div> 
                                          {
                                                pdata.status === "Returned" ?
                                                  data.returnProducts.map((value) => {
                                                    if (value.product_ID === pdata.product_ID) {
                                                      return (
                                                        <div className="col-lg-12">
                                                          <ReturnStatus data={value} />
                                                        </div>
                                                      );
                                                    }
                                                  })
                                                  :
                                                  null
                                            }

                                        </div>

                                        );
                                    })
                                    : null
                            }
                          
                            </div>
                            <div className="col-12 orderfooterborder">
                             <div className="row">
                              <div className="col-6">
                                <p className="orderfootertag"><span>Ordered On: </span>{moment(data.createdAt).format("DD MMMM YYYY")} </p>
                              </div>
                              <div className="col-6">
                                <p className="orderfootertag2"><span>Ordered Total: </span> <i className="fa fa-inr"></i>&nbsp;{data.cartTotal} </p>
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


                  {/* returnProductModal */}

                  <div className="modal" id="returnProductModal" role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <img src="" alt="" />
                          <button type="button" className="close modalclosebut" data-dismiss="modal">&times;</button>
                          <h4 className="modal-title modalheadingcont">RETURN PRODUCT</h4>
                        </div>
                        <h4 className="modaltext"></h4>
                        <div className="col-xl-12 col-md-12 col-sm-12 col-xs-12">
                          <table className="data table table-order-items history" id="my-orders-table">
                            <thead>
                              <tr>
                                <th scope="col" className="col id">Product Image</th>
                                <th scope="col" className="col id">Product Name</th>
                                <th scope="col" className="col date">Price</th>
                              </tr>
                            </thead>
                            <tbody>{
                              this.state.oneproductdetails ?
                                <tr>
                                  <td data-th="Order #" className="col id orderimgsize"><img src={this.state.oneproductdetails.productImage[0] ? this.state.oneproductdetails.productImage[0] : "/images/eCommerce/notavailable.jpg"} alt="" /></td>
                                  {this.state.oneproductdetails.productNameRlang?
                                    <td data-th="Order #" className="col id RegionalFont">{this.state.oneproductdetails.productName}</td>
                                  :
                                    <td data-th="Order #" className="col id">{this.state.oneproductdetails.productName}</td>
                                  }
                                  <td data-th="Order Total" className="col total"><span><i className={"fa fa-" + this.state.oneproductdetails.currency}> {this.state.oneproductdetails.discountedPrice}</i></span></td>
                                </tr>
                                :
                                null
                            }
                            </tbody>
                          </table>
                          <div className="inputrow">
                            <h4>Back Details</h4>
                          </div>

                          <form id="returnForm">
                            <div className="inputrow">
                              <span>
                                <label className="col-12 NOpadding ">Reason for Return <label className="astricsign">*</label></label>

                              </span>
                              <textarea rows="5" cols="55" className="reasonForReturn" name="reasonForReturn" required></textarea>
                            </div>
                            <div className="inputrow">
                              <label className="col-12 NOpadding  ">Bank Name<label className="astricsign">*</label></label>
                              <input type="text" ref="bankname" name="bankname" id="bankname" value={this.state.bankname} onChange={this.handleChange.bind(this)} className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-control returninputbox" required />
                            </div>
                            <div className="inputrow">
                              <label className="col-12 NOpadding ">Bank Account No<label className="astricsign">*</label></label>
                              <input type="text" ref="bankacctno" name="bankacctno" id="bankacctno" value={this.state.bankacctno} onChange={this.handleChange.bind(this)} className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-control returninputbox" required />
                            </div>
                            <div className="inputrow">
                              <label className="col-12 NOpadding">IFSC Code<label className="astricsign">*</label></label>
                              <input type="text" ref="ifsccode" name="ifsccode" id="ifsccode" value={this.state.ifsccode} onChange={this.handleChange.bind(this)} className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-control returninputbox" required />
                            </div>
                          </form>

                        </div>
                        <div className="canreturn modal-footer">
                          <div className="col-12">
                            <br />

                            <button className="btn btn-danger" onClick={this.returnProductAction.bind(this)} id="returnProductBtn" >Save</button>
                            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* cancelProductModal */}
                  <div className="modal" id="cancelProductModal" role="dialog">
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
                  </div>

                  {/* feedbackProductModal */}

                  <div className="modal" id="feedbackProductModal" role="dialog">
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

