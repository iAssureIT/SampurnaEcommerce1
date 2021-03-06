import React, { Component } from 'react';
import axios                from 'axios';
import $                    from 'jquery';
import moment               from "moment";
import StepProgressBar       from 'react-step-progress';
import 'react-step-progress/dist/index.css';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
// import ReturnStatus         from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/ReturnStatus.jsx';
import StepWizard           from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/StepWizard.jsx';
import OrderStatusWizard    from '../../Themes/Sampurna/blocks/StaticBlocks/Wizard/OrderStatusWizard.js';
import ProductsView         from './ProductsView.js';
import Style                from './index.module.css';
import openSocket               from 'socket.io-client';
import getConfig            from 'next/config';

const { publicRuntimeConfig } = getConfig();
const  socket = openSocket(publicRuntimeConfig.API_BASE_URL,{ transports : ['websocket'] ,upgrade: false});
// console.log("socket",socket);

export default class OrderDetails extends Component {
  constructor(props) {
    super(props);
    if (!this.props.loading) {
      this.state = {
        "orderData": [],
        "orderID": "",
        "userID" : "",
        labels:[],
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
      $(window).scrollTop(0);
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
        // this.getAllorderStatus();
        var labels=[
          {
            label: 'New',
            name: 'step 1',
          },
          {
            label: 'Processing',
            name: 'step 2',
          },
          {
            label: 'Ready to Dispatch',
            name: 'step 2',
          },
          // {
          //   label: 'On the Way',
          //   name: 'step 3',
          // },
          {
            label: 'Delivered',
            name: 'step 3',
          }
        ]
        this.setState({labels:labels,labelsArray:labels})
      })
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
      socket.emit('room',this.props.order_id);
      socket.emit('signle_order',this.props.order_id);
      socket.on('getSingleOrder',(response)=>{
        if(response){
          console.log("socket response.data=>",response);
          this.setState({
            orderData: response,
            loading: false
          }, () => {
            // console.log("orderDetails orderData after setstate=>",this.state.orderData);
          })
        }
    })
}


  getAllorderStatus(){
		axios.get('/api/orderstatus/get/list')
		.then((response) => {
			// console.log("getAllorderStatus 402 response ==>",response)
			this.setState({AllOrderStatus : response.data});
			// return response.data
		})
		.catch((error) => {
			console.log("Error in orderstatus = ", error);
			if(error.message === "Request failed with status code 401"){
				localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is expired.",                
					text  : "You need to login again. Click OK to go to Login Page"
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
    axios.get("/api/users/get/id/" +this.state.user_ID)
      .then((response) => {
        this.setState({
          reviewuserData: response.data
        },()=>{
          // console.log("reviewuserData=",this.state.reviewuserData);
        })
      })
      .catch((error) => {
        console.log('Error while getting User data', error);
      })
  }
  cancelButton = (orderDate)=>{
    // console.log("orderData===",this.state.orderData);
    var min = moment(orderDate).add(this.state.orderData.maxDurationForCancelOrder, 'minutes');
    var duration = moment.duration(min.diff(new Date())).asSeconds();
    if(duration > 0 &&duration < this.state.orderData.maxDurationForCancelOrder*60){
      var that =this;
      setTimeout(function(){that.getMyOrders()},  Math.abs(duration) *1000);
      return true;
    }else{
      return false;
    }
  }
  
  
  cancelProductAction(event) {
    event.preventDefault();
    var id = event.target.getAttribute('id');
    // console.log("id===",id);

    var formValues = {
      "order_id"   : id,
      "userid"    : this.state.user_ID,
      "type"      : "vendororder",
      "vendor_id" : '',
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
          swal("Cancelled!", "Your order cancelled successfully!", "success");
      }else{
        swal("Your order is safe!");
      }
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
    if(this.state.orderData){
      // console.log("Order Details data====",this.state.orderData );
    }
    
    return (
      <div className={"col-12 NoPadding "+Style.orderDetailMainWrapper}>
        <div className={" " +Style.container1 }>
          <Message messageData={this.state.messageData} />
          {
            this.state.orderData &&
              <div className="col-12 NoPadding">
                <br />
               <div className="row"> 
                <div className="col-12 col-12 col-md-12">
                  <div className="col-12">
                      <h4 className={"table-caption " +Style.mainTitle}>Orders Details</h4>
                  </div>
                  <div className={"col-12 NoPadding orderDetailsTopBlock"}>
                    <div className="col-12 NoPadding orderDetailsTop " style={{'backgroundColor': this.state.orderData.orderStatus === "New"&& '#033554' ||
                                                                                                  this.state.orderData.orderStatus === "Delivered" && '#3E9D5E' ||
                                                                                                  this.state.orderData.orderStatus === "Cancelled" && '#E88686'
                                                                              }}>
                      <div className={"row " +Style.ptb15}>
                        <div className="col-6 ">
                            <div className="col-12">{"Order Status : "+(this.state.orderData.orderStatus)}</div>
                            <div className="col-12">{"Order ID : "+(this.state.orderData.orderID)}</div>
                            {this.state.orderData && this.state.orderData.paymentDetails &&
                              <div className="col-12">Total Amount : <b>{this.state.orderData.paymentDetails.netPayableAmount} {this.state.currency}</b></div>
                            }
                            <div className="col-12">
                             
                              {/* {this.state.orderData && this.state.orderData.paymentDetails &&
                                "Credit Points  "+this.state.orderData.paymentDetails.creditPointsEarned +" ( "+this.state.currency+" "+this.state.orderData.paymentDetails.creditPointsValueEarned +" )"
                              } */}
                              {this.state.orderData && this.state.orderData.paymentDetails &&
                                <span>Credits Points : &nbsp;<b>{this.state.currency} {this.state.orderData.paymentDetails.creditPointsEarned}{this.state.orderData.paymentDetails.creditPointsValueEarned}</b></span>
                              }
                            </div>
                        </div>                       
                        <div className={"col-6 " +Style.rightside}>
                            <div className="row">
                                <div className="col-12">
                                  <span className="col-12 text-right">Date - {moment(this.state.orderData.createdAt).format("DD/MM/YYYY")}&nbsp;&nbsp;{moment(this.state.orderData.createdAt).format("hh:mm A")}</span>
                                  {/* <span className="col-6 text-right"></span> */}
                                </div>
                                {this.state.orderData && this.state.orderData.paymentDetails &&
                                  <div className="col-12">
                                      <div className="col-12"> <i className="fas fa-wallet"></i>&nbsp;{this.state.orderData.paymentDetails.paymentMethod}</div> 
                                  </div>
                                }
                                {this.state.orderData.deliveryAddress && this.state.orderData.deliveryAddress.addressLine2 &&
                                  <div className="col-12">
                                      <div className="col-12 orderAddress"> 
                                      <i className="fas fa-map-marker-alt"></i>{this.state.orderData.deliveryAddress.addressLine1}, <br/>  {this.state.orderData.deliveryAddress.addressLine2}
                                      </div> 
                                  </div>
                                }
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
                          // console.log( " Order details this.state.orderData:",this.state.orderData);
                          var labels = this.state.labelsArray;
                          // labels.splice(2, 1);
                          console.log("vendordata.orderStatus",vendordata.orderStatus);
                          // console.log("this.state.labels[2].label",this.state.labels[2].label);
                          console.log("this.state.labels",this.state.labels);


                            var index1 = this.state.labels.map(e=>e.label).indexOf(vendordata.orderStatus);
                          // if(index1===1){
                            
                          // }
                          console.log("index1",index1)
                          return (
                            <div key={index} style={{marginBottom:"0px"}} className={"col-12 vendorwiseOrderHistory " +Style.vendorRow}>   
                              <div className="col-12 NOpadding vendorNameBlock pt-4 pb-4">
                                <div className="row">
                                  <div className="col-7 NOpadding">
                                      <span className="orderDetailsVendorName">{vendordata.vendorName}</span> &nbsp;
                                  </div>
                                  <div className="col-5 pull-right">
                                  {this.state.orderData.orderStatus !== "Cancelled" &&
                                    this.cancelButton(this.state.orderData.createdAt)&&
                                      <div className="col-12 NoPadding ">
                                          <div className={"col-12 text-right cancelOrderbtn " +Style.cancelBtn} id={this.state.orderData._id} onClick={this.cancelProductAction.bind(this)}> Cancel Order before  {moment(this.state.orderData.createdAt).add(this.state.orderData.maxDurationForCancelOrder, 'minutes').format("hh:mm A")  } </div>
                                      </div>
                                  }
                                  </div>
                                </div>      
                              </div>
                              { vendordata.deliveryStatus[vendordata.deliveryStatus.length - 1].status !== 'Cancelled' ?
                                <div className="col-12 NoPadding ">
                                    <StepProgressBar
                                      startingStep={index1 === -1 ? 2 : index1}
                                      // startingStep={index1}
                                      steps={labels}
                                    />
                                </div> :null
                              }

                              <ProductsView 
                                vendorWiseOrderData = {vendordata}
                                orderData           = {this.state.orderData}
                                orderStatus         = {vendordata.orderStatus}
                                currency            = {this.state.currency}
                                user_ID             = {this.state.user_ID}
                                reviewuserData      = {this.state.reviewuserData}
                                orderID             = {this.state.orderData._id}
                              />
                              
                              <div className="col-12 ">
                                <div  className="col-12 NOpadding" style={{marginBottom:"20px"}} key={index}>
                                  <div className="row ">                                      
                                      <div className="col-12 NOpadding">
                                        <div className={"col-8 offset-2 text-right font-weight-bold "+Style.orderDetaiAmount}>
                                            <span className="col-7 title">&nbsp; <b>Amount</b></span>
                                            <span className="col-5 textAlignRight title">&nbsp; 
                                                <span className="currencyColor">{this.state.currency}</span> &nbsp;{vendordata.vendor_beforeDiscountTotal > 0 ? (vendordata.vendor_beforeDiscountTotal).toFixed(2) : 0.00} 
                                            </span>
                                        </div>
                                        <div className={"col-8 offset-2 text-right font-weight-bold "+Style.orderDetaiAmount}>
                                            <span className="col-8 title">&nbsp; Number Of Items</span>
                                            <span className="col-4 textAlignRight title">&nbsp; 
                                                {vendordata.vendor_numberOfProducts} 
                                            </span>
                                        </div>
                                      </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                        :
                        <div className="col-12 textAlignCenter">
                          <div className="mt15 alert alert-warning textAlignCenter"><i className="fas fa-exclamation-circle"> </i>  No Orders Yet</div>
                          <img src="/images/eCommerce/emptyorder.png" alt=""/>
                        </div>
                    }
                  </div>
                </div>
               </div> 
              </div>
          }
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

