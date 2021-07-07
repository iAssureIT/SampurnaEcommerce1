import React, { Component } from 'react';
import axios                from 'axios';
import $                    from 'jquery';
import moment               from 'moment';
import Link                 from 'next/link';
// import {S3FileUpload}         from 'react-s3';
import S3 from 'react-aws-s3';
import StarRatingComponent  from 'react-star-rating-component';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import ProductReview        from './ProductsView.js';
import ReturnForm           from './ReturnForm.js';
import swal                 from 'sweetalert';
import WebsiteLogo          from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import Style                from './index.module.css';

const config = {
//   bucketName: 'myBucket',
//   dirName: 'media', /* optional */
//   region: 'eu-west-1',
//   accessKeyId: 'JAJHAFJFHJDFJSDHFSDHFJKDSF',
//   secretAccessKey: 'jhsdf99845fd98qwed42ebdyeqwd-3r98f373f=qwrq3rfr3rf',
//   s3Url: 'https:/your-custom-s3-url.com/', /* optional */

"accessKeyId" : "AKIAQBHT57FYOQYPF7ER",
"secretAccessKey" : "14/iqyGzWqg4VzEwW4EVgmNjHQMGLl2w/17hHgHj",
"bucketName" : "devtrollymart-2",
"region" : "us-east-2",
"type"   : "S3",
}

const ReactS3Client = new S3(config);

class ProductsView extends Component {
  constructor(props) {
    super(props);
      this.state = {
        "orderData" : {},
        "rating"    : 1,
        "rating_ID" : '',
        "user_ID"   : '',
        "paymentRefundSource" : "source"
      }
  }

  componentDidMount() {
    this.getReturnReasons();
    this.getS3Details();
  }
  getS3Details(){
    axios
      .get('/api/projectSettings/get/S3')
      .then((response)=>{
          const config = {
              bucketName      : response.data.bucket,
              dirName         : process.env.ENVIRONMENT,
              region          : response.data.region,
              accessKeyId     : response.data.key,
              secretAccessKey : response.data.secret,
          }
          if(config){
            this.setState({
              config : config,
            },()=>{
              
            });
          }                         
      })
      .catch(function(error){
          console.log(error);
      })
  }
  getReturnReasons(){
    // console.log("inside getReturnReasons");
    axios.get('/api/returnreasons/get/list')
    .then((reasonsResponse)=>{
        // console.log("reasonsResponse==",reasonsResponse);
        if(reasonsResponse){

            this.setState({
              returnReasons : reasonsResponse.data
            })
        }
    })
    .catch((error)=>{
        console.log("error while getting return resons=",error);
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
      if (this.state.customerReview) {
        if(this.state.rating_ID){

          var formValues = {
            "review_id"         : this.state.rating_ID,
            "rating"            : this.state.rating,
            "customerReview"    : $('.feedbackForm textarea').val(),
          }
        
          console.log("formValues=",formValues);
          axios.patch("/api/customerReview/patch/customer/review", formValues)
          .then((response) => {
            this.setState({

              messageData: {
                "type": "outpage",
                "icon": "fa fa-check-circle",
                "message": "Review Updated successfuly",
                "class": "success",
                "autoDismiss": true
              }
            })
            setTimeout(() => {
              this.setState({
                messageData: {},
              })
            }, 3000);
            var modal = document.getElementByClass('feedBackModal');
            modal.style.display = "none";
            $('.modal-backdrop').remove();
          })
          .catch((error) => {
          })
        }else{
         var formValues = {
            "customer_id"       : this.props.user_ID,
            "customerName"      : this.props.orderData.userFullName,
            "order_id"          : this.props.orderData._id,
            "product_id"        : event.target.getAttribute('productid'),
            "rating"            : this.state.rating,
            "customerReview"    : $('.feedbackForm textarea').val(),
            "vendor_id"         : this.props.vendorWiseOrderData.vendor_id._id,
            "vendorLocation_id" : event.target.getAttribute('vendorLocationId'),
            "status"            : "New"
          }
          console.log("formValues=",formValues);
          axios.post("/api/customerReview/post", formValues)
          .then((response) => {
            if(response){
              // console.log("review response=",response.data);
              // swal(response.data.message);
              swal({text:response.data.message}).then(function(){
                window.location.reload();
              });
            }
            var modal = document.getElementByClass('feedBackModal');
            modal.style.display = "none";
          })
          .catch((error) => {
          })
        }//end else
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
        });
  }

  handleChangeReturn(event) {
    this.setState({
      [event.target.name]: event.target.value,
      returnTextError : event.target.value ? "" : "Please write your comment."
    })
  }

  handleRefundPayment(event){
    event.preventDefault();
    // console.log("paymentRefundSource name ===",event.target.name);
    // console.log("paymentRefundSource value ===",event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
      refundToError : event.target.value ? "" : "Please select your Refund source."
    })
  }
  uploadImage(event){
    event.preventDefault();
    console.log("file===",event.target.files[0]);
    // var file = event.target.file;
    const file = event.target.files[0];

    // S3FileUpload
    ReactS3Client
    .uploadFile(file, config)
    .then(data => console.log("fileUpload data=",data))
    .catch(err => console.error("fileUpload data=",err))
    
  }

  // uploadImage(event){
  //   event.preventDefault();
  //   var returnProductImage = "";
  //   if (event.currentTarget.files && event.currentTarget.files[0]) {
  //           var file = event.currentTarget.files[0];
  //           if (file) {
  //               var fileName  = file.name; 
  //               var ext = fileName.split('.').pop();  
  //               if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){
  //                   if (file) {
  //                       var objTitle = { fileInfo :file }
  //                       returnProductImage = objTitle ;
                        
  //                   }else{          
  //                       swal("Images not uploaded");  
  //                   }//file
  //               }else{ 
  //                   swal("Allowed images formats are (jpg,png,jpeg)");   
  //               }//file types
  //           }//file
  //       if(event.currentTarget.files){
  //           this.setState({
  //             returnProductImage : returnProductImage
  //           });  
  //           main().then(formValues=>{
  //               this.setState({
  //                 returnProductImage : formValues.returnProductImage
  //               })
  //           });
  //           async function main(){
  //               var config = await getConfig();
  //               var s3url = await s3upload(returnProductImage.fileInfo, config, this);

  //               const formValues = {
  //                 "returnProductImage"    : s3url,
  //               };
  
  //               return Promise.resolve(formValues);
  //           }
  //           function s3upload(image,configuration){
  //               return new Promise(function(resolve,reject){
  //                   S3FileUpload
  //                   // ReactS3Client
  //                       .uploadFile(image,configuration)
  //                       .then((Data)=>{
  //                           resolve(Data.location);
  //                       })
  //                       .catch((error)=>{
  //                           console.log("Image upload error=",error);
  //                       })
  //               })
  //           }   

  //           function getConfig(){
  //               return new Promise(function(resolve,reject){
  //                   axios
  //                       .get('/api/projectSettings/get/S3')
  //                       .then((response)=>{
  //                           const config = {
  //                               bucketName      : response.data.bucket,
  //                               dirName         : process.env.ENVIRONMENT,
  //                               region          : response.data.region,
  //                               accessKeyId     : response.data.key,
  //                               secretAccessKey : response.data.secret,
  //                           }
  //                           resolve(config);                           
  //                       })
  //                       .catch(function(error){
  //                           console.log(error);
  //                       })
    
  //               })
  //           }        
  //          }
  //   }
  // }

  deleteImage(event){
    // console.log('delete');
    
    var id = event.target.id;
    var productImageArray = this.state.productImageArray;
    // console.log('productImage', productImageArray, id);
    if(productImageArray && productImageArray > 0) {
    productImageArray.splice(productImageArray.findIndex(v => v == id), 1);
    this.setState({
        sectionImage : "",
        productImageArray: productImageArray
    },()=>{
        // console.log('subcatgArr', this.state.subcatgArr);
    });
  }

}
  getSingleProductReview(event) {
    // console.log("getSingleProductdetails==")
    var productID  = event.target.getAttribute('productId');
    var customerID = event.target.getAttribute('customerId');
    var orderID    = event.target.getAttribute('orderId');
    this.setState({ orderID: orderID });
    var formValues = {
      "customer_id"     		: customerID,
      "order_id"        		: orderID,
      "product_id"      		: productID
    }
    console.log("formValues=",formValues);
    if(formValues){
      axios.post("/api/customerReview/get/single/customer/review",formValues)
      .then((response) => {
        if(response.data){
          // console.log("single review==",response.data);
          this.setState({
            rating_ID       : response.data._id,
            customerID      : response.data.customer_id,
            customerName    : response.data.customerName,
            customerReview  : response.data.customerReview,
            orderID         : response.data.order_id,
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
  }

  selecteReason(event){
    event.preventDefault();
    axios.get('/api/returnreasons/get/list')
    .then((reasonsResponse)=>{
        if(reasonsResponse){
          // console.log("reasonsResponse=",reasonsResponse.data);
            this.setState({
              returnReasons : reasonsResponse.data
            },()=>{
              var reasonForReturn = event.target.value;
              this.setState({
                reasonForReturn : reasonForReturn
              })
            })
        }
    })
    .catch((error)=>{
        console.log("error while getting return resons=",error);
    })
    
  }

  returnProduct(event) {
    event.preventDefault();
    var productID  = event.target.getAttribute('productId');
    var formValues  =  {
      "user_id"               : this.props.user_ID,
      "order_id"              : this.props.orderID,
      "product_id"            : productID,
      "vendor_id"             : this.props.vendorWiseOrderData.vendor_id._id,
      "vendorLocation_id"     : this.props.vendorWiseOrderData.vendorLocation_id,
      "reasonForReturn"       : this.state.reasonForReturn,
      "customerComment"       : this.state.customerReturnComment, 
      "refund"                : this.state.paymentRefundSource,
      "returnProductImages"   : []
    }

    // console.log("formValues=",formValues);

    if(formValues){
      axios.patch("/api/orders/patch/returnproduct",formValues)
      .then((response) => {
        if(response.data){
          // console.log("single review==",response.data);
          swal({text:response.data.message}).then(function(){
            window.location.reload();
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
    }
  }
    
  render() {
    console.log("productdetails this.props ===",this.props);
    return (
          <div className="col-12">
            <Message messageData={this.state.messageData} />
            <table className={"table table-borderless orderTable " +Style.table}>
                <thead>
                    <tr>
                        <th>Products Image</th>
                        <th>Products Name</th>
                        <th className="textAlignLeft">Price</th>
                        <th className="textAlignCenter">Quantity</th>
                        <th className="textAlignRight">SubTotal</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    this.props.vendorWiseOrderData && this.props.vendorWiseOrderData.products.map((productdata, index) => {
                          // console.log("productdata=",productdata);
                            return (
                                <tr key={index}>
                                <td><img className="img orderImg" src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.jpg"} /></td>
                                <td>
                                    <a href={"/product-detail/" +this.props.vendorWiseOrderData.vendor_id._id+"/"+this.props.vendorWiseOrderData.vendorLocation_id+"/"+productdata.product_ID}>
                                      {productdata.productNameRlang?
                                          <h5 className="RegionalFont">{productdata.productNameRlang}</h5>
                                      :
                                          <h5 className="productName">{productdata.productName}</h5>
                                      }
                                    </a>

                                    {productdata.discountPercent ?
                                        <div className="col-12 NoPadding">
                                            <span className="cartOldprice">{this.props.currency} &nbsp;{productdata.originalPrice}</span>&nbsp;&nbsp;&nbsp;
                                        <span className="cartPrice">{this.props.currency}&nbsp;{productdata.discountedPrice}</span> &nbsp;
                                        <span className="cartDiscountPercent">( {Math.floor(productdata.discountPercent)}% Off ) </span>
                                        </div>
                                        :
                                        <span className="price">{this.props.currency}&nbsp;&nbsp;&nbsp;{productdata.originalPrice}</span>
                                    }
                                    <div>
                                        {productdata.color ? <span className="cartColor">Color : <span style={{ backgroundColor: productdata.color, padding: '0px 5px' }}>&nbsp;</span>  </span> : null}
                                        {productdata.size ? <span className="cartColor">Size : {productdata.size} &nbsp; {productdata.unit}</span> : null}
                                    </div>
                                </td>
                                <td className="textAlignLeft">
                                    {
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
                                            {productdata.isReview?
                                              <div className={" "+Style.returnReviewBtn}  productId={productdata.product_ID} orderId={this.props.orderID} customerId={this.props.user_ID} onClick={this.getSingleProductReview.bind(this)} data-toggle="modal" data-target={"#reviewModal_"+productdata.product_ID}>Edit Review</div>
                                              :
                                              <div className={" "+Style.returnReviewBtn}  productId={productdata.product_ID} onclick={this.setProductId.bind(this)} data-toggle="modal" data-target={"#reviewModal_"+productdata.product_ID}>Add Review</div>
                                            }
                                            {/* {productdata.productReturnable === "returnable"  && productdata.productStatus? */}
                                            { productdata.productStatus?
                                              <div className={" "+Style.returnReviewBtn}    productId={productdata.product_ID} >{productdata.productStatus}</div>
                                            :
                                              <div className={" "+Style.returnReviewBtn}    productId={productdata.product_ID} onclick={this.setProductId.bind(this)} data-toggle="modal" data-target={"#returnModal_"+productdata.product_ID}>return</div>
                                            }
                                        </span>
                                    :null
                                    }

                                    {/* Review and Rating */}
                                    <div className="modal col-6 offset-3 NOpadding mt-4 feedBackModal" id={"reviewModal_"+productdata.product_ID} role="dialog">
                                        <div className="modal-content modalContent " style={{ 'background': '#fff'}}>
                                            <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                                              <div className="col-12">
                                                <div className="row">
                                                    <div className="col-5 mt-2">
                                                        < WebsiteLogo /> 
                                                    </div>
                                                    <div className="col-6 text-center">
                                                        <h6 className="modal-title mt-2 modalheadingcont"> Product Review</h6>
                                                    </div>
                                                    <div className="col-1 text-center">
                                                        <button type="button" className="close closeModal" data-dismiss="modal">&times;</button>
                                                    </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="modal-body addressModalBody">
                                            <div className="col-12 mt-4 ">
                                                <div className="row">
                                                  <div className="col-3 orderimgsize">
                                                    <img src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.jpg" } alt="" />
                                                  </div>
                                                  <div className="col-5 ">{productdata.productName}</div>
                                                  <div className="col-4 total textAlignRight">{this.props.currency} {productdata.discountedPrice}</div>
                                                </div>
                                            </div>

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
                                                    <button className="btn btn-primary pull-right mt15" onClick={this.submitReview.bind(this)}  vendorLocationId={this.props.vendorWiseOrderData.vendorLocation_id} productid={productdata && productdata.product_ID}
                                                    >{productdata.isReview ? 'Update' :'Submit'}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Return product */}
                                    <div className="modal col-6 offset-3 NOpadding mt-4 feedBackModal" id={"returnModal_"+productdata.product_ID} role="dialog">
                                        <div className="modal-content modalContent " style={{ 'background': '#fff'}}>
                                            <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                                            <div className="col-12">
                                              <div className="row">
                                                <div className="col-5 mt-4">
                                                    < WebsiteLogo /> 
                                                </div>
                                                <div className="col-6 text-center">
                                                    <h6 className="modal-title mt-2x modalheadingcont">Return Product</h6>
                                                </div>
                                                <div className="col-1 text-center">
                                                    <button type="button" className="close closeModal" data-dismiss="modal">&times;</button>
                                                </div>
                                              </div>
                                            </div>
                                            </div>
                                            <div className="modal-body addressModalBody">
                                              <div className="col-12 mt-4 ">
                                                <div className="row">
                                                  <div className="col-3 orderimgsize">
                                                    <img src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.jpg" } alt="" />
                                                  </div>
                                                  <div className="col-5 ">{productdata.productName}</div>
                                                  <div className="col-4 total textAlignRight">{this.props.currency} {productdata.discountedPrice}</div>
                                                </div>
                                              </div>
                                              <form className="feedbackForm col-12">
                                                  <div className="col-12 row">
                                                      <div className="clearfix "></div>
                                                  </div>
                                                  <label className="col-12 mt-4 text-left">Please Select Reasons </label>
                                                  <select onChange={this.selecteReason.bind(this)} className={"col-12 mt-4 form-control "} ref="reasonOfReturn" name="reasonOfReturn" >
                                                      <option name="reasonOfReturn"  selected="true">-- Select --</option>
                                                      {
                                                          this.state.returnReasons && this.state.returnReasons.length > 0 ?
                                                              this.state.returnReasons.map((data, index) => {
                                                                  return (
                                                                      <option key={index} value={data._id}>{data.reasonOfReturn}</option>
                                                                  );
                                                              })
                                                              :
                                                              <option value='user'>No Reasons available</option>
                                                      }
                                                  </select>
                                                  <label className="error">{this.state.reviewStarError}</label>
                                                  <div className="row inputrow">
                                                      <label className="col-12 mt-4 text-left">Comment</label>
                                                      <div className="col-12 ">
                                                      <textarea rows="5" className="col-12 " onChange={this.handleChangeReturn.bind(this)} value={ this.state.customerReturnComment} name="customerReturnComment"></textarea>
                                                      <label className="error">{this.state.returnTextError}</label>
                                                      </div>
                                                  </div>

                                                  <div className={"col-12 " +Style.ReturnImg}>   
                                                    <div className="row">
                                                      <div className=" col-4 mt-2">                                                               
                                                        <input type="file" onChange={this.uploadImage.bind(this)} title="upload product Image"  accept=".jpg,.jpeg,.png" />
                                                        {/* <input type="submit" value="Submit"></input> */}
                                                      </div>
                                                      {
                                                        this.state.returnProductImage ? 
                                                          <div className="col-lg-12 productImgCol">
                                                            <div className="prodImage">
                                                              <div className="prodImageInner">
                                                                  <span className="prodImageCross" title="Delete" data-imageUrl={this.state.returnProductImage} onClick={this.deleteImage.bind(this)} >x</span>
                                                              </div>
                                                              <img title="view Image" alt="Please wait..." data-imageurl={this.state.returnProductImage ? this.state.returnProductImage : "/images/notavailable.jpg"} className="img-responsive" />
                                                            </div>    
                                                          </div>
                                                        :
                                                        null
                                                      }
                                                    </div>
                                                  </div>
                                                  
                                                  <div className={"col-12 NoPadding text-left "}>
                                                      <div className={"col-12 mt-2 mb-2 " +Style.eCommTitle +" "+Style.paymentMethodTitle}>Refund to <span className="required">*</span></div>
                                                      <div className="form-check">
                                                        <label className="form-check-label">
                                                          <input type="radio" className="form-check-input webModelInput codRadio" name="paymentRefundSource" type="radio" id="paymentRefundSource" value="source" 
                                                          checked={this.state.paymentRefundSource === "source"} 
                                                          onClick={this.handleRefundPayment.bind(this)}
                                                          />The Source( valid for card payment only)
                                                        </label>
                                                      </div>
                                                      <div className="form-check" >
                                                        <label className="form-check-label" for="radio1">
                                                          <input type="radio" className="form-check-input webModelInput codRadio" name="paymentRefundSource" type="radio" id="paymentRefundSource" value="credit" 
                                                          checked={this.state.paymentRefundSource === "credit"} 
                                                          onChange={this.handleRefundPayment.bind(this)}
                                                          />Add To Credit Points
                                                        </label>
                                                      </div>
                                                      
                                                      <div className="errorMsg col-11 ml-2">{this.state.refundToError}</div>
                                                  </div>
                                              </form>
                                            </div>
                                            <div className="modal-footer modalfooterborder ">
                                                <div className="col-12 ">
                                                {!productdata.status?
                                                    <button className="btn btn-primary pull-right mt15" 
                                                    onClick   = {this.returnProduct.bind(this)}  
                                                    productid = {productdata && productdata.product_ID}
                                                    vendor_id = {this.props.vendorWiseOrderData.vendor_id}
                                                    orderId   = {this.props.orderID}
                                                    vendorLocationId = {this.props.vendorWiseOrderData.vendorLocation_id} 
                                                    >Submit</button>
                                                    :null}
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