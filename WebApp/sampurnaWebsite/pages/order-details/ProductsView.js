import React, { Component } from 'react';
import axios                from 'axios';
import $                    from 'jquery';
import moment               from 'moment';
import Link                 from 'next/link';
import StarRatingComponent  from 'react-star-rating-component';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import ProductReview        from './ProductsView.js';
import ReturnForm           from './ReturnForm.js';
import swal                 from 'sweetalert';
import WebsiteLogo          from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import Style                from './index.module.css';
import { event } from 'jquery';
class ProductsView extends Component {
  constructor(props) {
    super(props);
      this.state = {
        "orderData" : {},
        "rating"    : 1,
        "rating_ID" : '',
        "user_ID"   : '',
      }
  }

  componentDidMount() {
   
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

  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue},()=>{
        console.log("Rating value :",this.state.rating);
    });
    
  }

  submitReview(event) {
    event.preventDefault();
    // console.log("rating===",this.state.rating);
      if (this.state.customerReview.length > 0) {
        // if(this.state.rating_ID){
        //   var formValues = {
        //     "rating_ID"         : this.state.rating_ID,
        //     "customer_id"       : this.state.userID,
        //     "customerName"      : this.state.reviewuserData.profile.fullName,
        //     "order_id"          : this.state.orderID,
        //     "product_id"        : $(event.currentTarget).data('productid'),
        //     "rating"            : parseInt(rating),
        //     "customerReview"    : $('.feedbackForm textarea').val(),
        //     "vendorLocation_id" : '',
        //     "status"            : "New"
        //   }
          
        //   axios.patch("/api/customerReview/patch", formValues)
        //   .then((response) => {
        //     // $('.fullpageloader').hide();
        //     this.setState({
        //       messageData: {
        //         "type": "outpage",
        //         "icon": "fa fa-check-circle",
        //         "message": response.data.message,
        //         "class": "success",
        //         "autoDismiss": true
        //       }
        //     })
        //     setTimeout(() => {
        //       this.setState({
        //         messageData: {},
        //       })
        //     }, 3000);
        //     var modal = document.getElementById('feedbackProductModal');
        //     modal.style.display = "none";

        //     $('.modal-backdrop').remove();
        //   })
        //   .catch((error) => {
        //   })
        // }else{
        console.log("reviewuserData====",this.props.reviewuserData);
         var formValues = {
            "customer_id"       : this.props.user_ID,
            "customerName"      : this.props.orderData.userFullName,
            "order_id"          : this.props.orderData._id,
            "product_id"        : event.target.getAttribute('productid'),
            "rating"            : this.state.rating,
            "customerReview"    : $('.feedbackForm textarea').val(),
            "vendorLocation_id" : event.target.getAttribute('vendorLocationId'),
            "status"            : "New"
          }
          console.log("formValues=",formValues);
          axios.post("/api/customerReview/post", formValues)
          .then((response) => {
            if(response){
              console.log("review response=",response.data);
              swal(response.data.message);
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
            }
            var modal = document.getElementById('feedbackProductModal');
            modal.style.display = "none";

            $('.modal-backdrop').remove();
          })
          .catch((error) => {
          })
        
      }else{
        this.setState({
          reviewTextError: "Please Enter your feedback."
        })
      }
    //}
  }

  setProductId(event){
      event.preventDefault();
      var productId = event.currentTarget.getAttribute('productId');
      this.setState({
          "productId":productId,
          "productData": event.currentTarget.getAttribute('productdata')
        },()=>{
            console.log("productData=",this.state.productData);
            console.log("productId=",this.state.productId);
        }
        );
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
  }
    
  render() {
    console.log("productView props  vendorOrders===",this.props);
    return (
          <div className="col-12">
            {/* < ProductReview /> */}
            <Message messageData={this.state.messageData} />
            
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
                    this.props.vendorWiseOrderData && this.props.vendorWiseOrderData.products.map((productdata, index) => {
                            return (
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
                                            <span className="cartOldprice">{this.props.currency} &nbsp;{productdata.originalPrice}</span>&nbsp;
                                        <span className="cartPrice">{this.props.currency}&nbsp;{productdata.discountedPrice}</span> &nbsp; &nbsp;
                                        <span className="cartDiscountPercent">( {Math.floor(productdata.discountPercent)}% Off ) </span>
                                        </div>
                                        :
                                        <span className="price">{this.props.currency}&nbsp;{productdata.originalPrice}</span>
                                    }
                                    <div>
                                        {productdata.color ? <span className="cartColor">Color : <span style={{ backgroundColor: productdata.color, padding: '0px 5px' }}>&nbsp;</span>  </span> : null}
                                        {productdata.size ? <span className="cartColor">Size : {productdata.size} &nbsp; {productdata.unit}</span> : null}
                                    </div>
                                </td>
                                <td className="textAlignLeft">
                                    {
                                        
                                      // <span className="productPrize textAlignRight"><i className={"fa fa-" + productdata.currency}></i> &nbsp;{parseInt(productdata.discountedPrice).toFixed(2)}</span>
                                      <span className="productPrize textAlignRight">{this.props.currency}&nbsp;{productdata.discountedPrice}</span>
                                            
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
                                          {this.props.currency}
                                          &nbsp;{productdata.discountedPrice}
                                      </span>
                                    }
                                    {this.props.orderStatus === "Delivered"?
                                        <span>
                                            <div className={" "+Style.returnReviewBtn} productdata={productdata} productId={productdata._id} onclick={this.setProductId.bind(this)} data-toggle="modal" data-target={"#reviewModal_"+productdata._id}>Add Review</div>
                                            <div className={" "+Style.returnReviewBtn} productId={productdata._id} onclick={this.setProductId.bind(this)} data-toggle="modal" data-target="#returnProductModal">return</div>
                                        </span>
                                    :null
                                    }

                                    {/* Review and Rating */}
                                    <div className="modal col-6 offset-3 NOpadding mt-4" id={"reviewModal_"+productdata._id} role="dialog">
                                        <div className="modal-content " style={{ 'background': '#fff'}}>
                                            <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                                                <div className="col-3">
                                                    < WebsiteLogo /> </div>
                                                <div className="col-7 text-center">
                                                    <h6 className="modal-title modalheadingcont">Product Review</h6> </div>
                                                <div className="col-1 text-center">
                                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                </div>
                                            </div>
                                            <div className="modal-body addressModalBody">
                                            <table className="data table table-order-items history" id="my-orders-table">
                                                <tbody>
                                                    <tr className="row">
                                                        <td className="col-3 orderimgsize"><img src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.jpg" } alt="" /></td>
                                                        
                                                        <td className="col-5 ">{productdata.productName}</td>
                                                        
                                                        <td className="col-4 total textAlignRight"><span>{this.props.currency} {productdata.discountedPrice}</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <form className="feedbackForm col-12">
                                                <div className="col-12 row">
                                                    <StarRatingComponent 
                                                        name="rate1" 
                                                        starCount={5}
                                                        value={this.state.rating}
                                                        onStarClick={this.onStarClick.bind(this)}
                                                    /> 

                                                    <div className="clearfix "></div>
                                                </div>
                                                <label className="error">{this.state.reviewStarError}</label>
                                                <div className="row inputrow">
                                                    <label className="col-12 mt15 text-left">Write review</label>
                                                    <div className="col-12 ">
                                                    <textarea rows="5" className="col-12 " onChange={this.handleChangeReview.bind(this)} value={ this.state.customerReview} name="customerReview"></textarea>
                                                    <label className="error">{this.state.reviewTextError}</label>
                                                    </div>
                                                </div>
                                                <div className="row inputrow">
                                                </div>
                                            </form>
                                            </div>
                                            <div className="modal-footer modalfooterborder ">
                                                <div className="col-12 ">
                                                    <button className="btn btn-primary pull-right mt15" onClick={this.submitReview.bind(this)}  vendorLocationId={this.props.vendorWiseOrderData.vendorLocation_id} productid={productdata && productdata._id}
                                                    >{this.state.rating_ID ? 'Update' :'Submit'}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                </td>
                            </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            
            
        </div>
    );
  }
}

export default ProductsView;