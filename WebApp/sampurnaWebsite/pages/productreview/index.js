import React, { Component } from 'react';
import axios        from 'axios';
import $            from 'jquery';
import SmallBanner          from '../../component/CustomizeBlocks/SmallBanner/SmallBanner.js';
import Sidebar              from '../../component/CustomizeBlocks/Sidebar/Sidebar.js';
import Loader               from "../../component/CustomizeBlocks/Loader/Loader.js";
import Message              from '../../component/CustomizeBlocks/Message/Message.js';
import Header               from '../../component/blockTemplate/Header/Header.js';
import Footer               from '../../component/blockTemplate/Footer/Footer.js';

import _            from 'underscore';
import moment       from "moment";
import swal         from 'sweetalert';
// import '../../../sites/currentSite/pages/Productreview.css';
// import notavailable from '../../../sites/currentSite/images/notavailable.jpg';

class Productreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewData: "",
      bannerData: {
        title: "PRODUCT REVIEW",
        breadcrumb: 'Product reviews',
        backgroungImage: '/images/eCommerce/cartBanner.png',
      },
      wishlist: [],
      products: [],
      abc: [],
      quantity: 1

    }
    // window.scrollTo(0, 0);
  }
  componentDidMount() {

    var userid = localStorage.getItem('user_ID');
        this.setState({
            user_ID : userid,
            websiteModel : localStorage.getItem('websiteModel')
        },()=>{
            this.getMyReview();
        })
    
  }
  getMyReview() {
    
    axios.get("/api/customerReview/get/user/list/" + this.state.user_ID)
      .then((response) => {
        this.setState({
          reviewData: response.data,
        }, () => {
          // console.log("reviewData=========================>",this.state.reviewData);
          // console.log("reviewuserid",this.state.reviewuserid);
        })
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

  submitReview(event) {
    event.preventDefault();
    // var id = $(event.target).data('dataid');
    var rating = $('input[name="ratingReview"]:checked', '.feedbackForm').val();
    var formValues = {
      "rating_ID" : this.state.rating_ID,
      "customerID": localStorage.getItem('user_ID'),
      "customerName": this.state.customerName,
      "orderID": this.state.orderID,
      "productID": this.state.productID,
      "rating": parseInt(rating),
      "customerReview": this.state.customerReview
    }
    if (this.state.reviewData.length != null) {
      axios.patch("/api/customerReview/patch", formValues)
        .then((response) => {
          this.getMyReview();
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

      console.log(formValues);
    } else {
      swal("Blank Review cant be submitted")
    }
  }
  getoneproductdetails(event) {
    var productID = event.target.id;
    var customerID = localStorage.getItem('user_ID');
    var orderID = event.target.getAttribute('orderID');
    this.setState({ orderID: orderID });
    // console.log(',n,',customerID, orderID, productID)
    axios.get("/api/products/get/one/" + productID)
    .then((response) => {
      this.setState({
        oneproductdetails: response.data
      }, () => {
        // console.log('oneproductdetails', this.state.oneproductdetails);
      })
    })
    .catch((error) => {
      console.log('error', error);
    })
    
    axios.get("/api/customerreview/get/order/list/"+customerID+"/"+orderID+"/"+productID )
    .then((response) => {
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
    })
    .catch((error) => {
      console.log('error', error);
    })
  }
  ratingReview(event){
    this.setState({
      [event.target.name]: event.target.value,
      reviewStarError : event.target.value ? "" : "Please give star rating."
    },()=>{
      // console.log('ratingReview', this.state.ratingReview);
    })
  }
  handleChangeReview(event) {
    this.setState({
      [event.target.name]: event.target.value,
      reviewTextError : event.target.value ? "" : "Please Enter your feedback."
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
      <div className="col-12 NoPadding">
        <Message messageData={this.state.messageData} />
        <SmallBanner bannerData={this.state.bannerData} />

        <div className=" container">
          <br />
          <div className="row"> 
          <div className="col-12 col-md-3  NOpadding">
            <Sidebar />
          </div>
          <div className="col-12 col-lg-9 col-md-9  NOpadding">
            <div className="mt25 col-12">
              {
                this.state.reviewData && this.state.reviewData.length > 0 ?
                  this.state.reviewData.map((data, index) => {
                    return (
                      <div key={index} className="col-12 reviewborder topspace15">
                        <div className="row">
                          <div className="col-12  col-md-2 col-sm-4">
                            <img className="img img-responsive reviewProImg" src={data.productDetails.length >0 ? (data.productDetails[0].productImage[0] ? data.productDetails[0].productImage[0] : "/images/eCommerce/notavailable.jpg") : ""} alt="" />
                          </div>
                          <div className="col-12 col-md-10 col-sm-12">
                            <div className="row">
                              <div className="col-12reviewuserimg">
                                  <div className=" pull-right">
                                    <span  id={data.productDetails[0]._id} orderID={data.orderID} onClick={this.getoneproductdetails.bind(this)} data-toggle="modal" data-target="#feedbackProductModal" className=" fa fa-pencil editCursor" title="Give Feedback" ></span>
                                  </div>
                                  <b><div className="col-11">{data.productDetails.length >0 ? data.productDetails[0].productName : ""}</div></b>
                                  <div className="col-11 ">
                                  {
                                    data.rating ?
                                      _.times(5, (i) => {
                                        console.log(i,'i');
                                        if(i < data.rating){
                                          return <label className="reviewStarIcon activeStar"></label>;
                                        }else{
                                          return <label className="reviewStarIcon"></label>;
                                        }
                                      })
                                    :
                                    _.times(5, (i) => {
                                      return <label className="reviewStarIcon"></label>;
                                    })
                                  }

                                  </div>
                                  <div className="col-12 textAlignLeft">
                                    <span>By {data.customerName} </span>
                                    
                                  </div>
                              </div>
                              <div className="col-12 reviewuserimg">
                                
                                  {/* <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                    <div className="row">
                                      <h5>Review :</h5>
                                    </div>
                                  </div> */}
                                  <div className="col-12 topspace8">
                                      <p>{data.customerReview}</p>
                                      <span> {moment(data.createdAt).format('DD-MM-YYYY')}</span>
                                  </div>
                                  
                              </div>
                              <div className="col-1topspace8">
                                
                        
                                <div className="modal" id="feedbackProductModal" role="dialog">
                                  <div className="modal-dialog">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <img src="../../../sites/currentSite/images/Icon.png" alt=""/>
                                        <button type="button" className="close modalclosebut" onClick={this.closeModal.bind(this)} data-dismiss="modal">&times;</button>
                                        <h4 className="modal-title modalheadingcont">PRODUCT REVIEW</h4>
                                      </div>
                                      <div className="modal-body">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
                                                  <td data-th="Order #" className="col id orderimgsize"><img src={this.state.oneproductdetails.productImage[0] ? this.state.oneproductdetails.productImage[0] : "/images/eCommerce/notavailable.jpg"} alt="" /></td>
                                                  <td data-th="Order #" className="col id">{this.state.oneproductdetails.productName}</td>
                                                  <td data-th="Order Total" className="col total textAlignRight"><span><i className={"fa fa-" + this.state.oneproductdetails.currency}> {this.state.oneproductdetails.discountedPrice}</i></span></td>
                                                </tr>
                                                :
                                                null
                                            }
                                            </tbody>
                                          </table>
                                          <form className="feedbackForm" id="">
                                            <div className="col-12 row">
                                              <fieldset className="ratingReview stars givefeedback ">
                                                <input type="radio" id="star1" name="ratingReview" checked={this.state.ratingReview === 5 ? true : false} onChange={this.ratingReview.bind(this)} value="5" /><label htmlFor="star1"></label>
                                                <input type="radio" id="star2" name="ratingReview" checked={this.state.ratingReview === 4 ? true : false} onChange={this.ratingReview.bind(this)} value="4" /><label htmlFor="star2"></label>
                                                <input type="radio" id="star3" name="ratingReview" checked={this.state.ratingReview === 3 ? true : false} onChange={this.ratingReview.bind(this)} value="3" /><label htmlFor="star3"></label>
                                                <input type="radio" id="star4" name="ratingReview" checked={this.state.ratingReview === 2 ? true : false} onChange={this.ratingReview.bind(this)} value="2" /><label htmlFor="star4"></label>
                                                <input type="radio" id="star5" name="ratingReview" checked={this.state.ratingReview === 1 ? true : false} onChange={this.ratingReview.bind(this)} value="1" /><label htmlFor="star5"></label>
                                              </fieldset>
                                              <div className="clearfix "></div>
                                            </div>
                                            <label className="error">{this.state.reviewStarError}</label>
                                            <div className="row inputrow">
                                              <label className="col-12 mt15">Write review</label>
                                              <div className="col-12">
                                                <textarea rows="5" className="col-12" onChange={this.handleChangeReview.bind(this)} value={ this.state.customerReview} name="customerReview"></textarea>
                                                <label className="error">{this.state.reviewTextError}</label>
                                              </div>
                                            </div>
                                            <div className="row inputrow">
                                            </div>
                                          </form>
                                        </div>

                                      </div>
                                      <div className="modal-footer modalfooterborder ">
                                        <div className="col-12">
                                          <button className="btn btn-warning mt15" onClick={this.submitReview.bind(this)} data-productid={this.state.oneproductdetails && this.state.oneproductdetails._id}
                                          >{this.state.rating_ID ? 'Update' :'Submit'}</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                  :
                  <div className="mt15 alert alert-warning textAlignCenter"><i className="fa fa-exclamation-circle"> </i>  No Reviews Yet</div>
              }
            </div>
          </div>
         </div> 
        </div>
      </div>
      <Footer />
      </div>
    );
  }
}

export default Productreview;