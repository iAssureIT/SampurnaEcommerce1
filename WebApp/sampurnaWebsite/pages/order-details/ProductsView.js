import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import moment from 'moment';
import Link from 'next/link';
import S3 from 'react-aws-s3';
// import Image                from 'next/image';
// import {S3FileUpload}         from 'react-s3';
// import aws                  from 'aws-sdk';
// import S3                   from 'aws-sdk/clients/s3';
// import { useS3Upload }      from 'next-s3-upload';

import StarRatingComponent from 'react-star-rating-component';
import Message from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import ProductReview from './ProductsView.js';
import ReturnForm from './ReturnForm.js';
import swal from 'sweetalert';
import WebsiteLogo from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import Style from './index.module.css';

class ProductsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "orderData": {},
      "rating": 1,
      "rating_ID": '',
      "user_ID": '',
      "paymentRefundSource": "source",
      "config": {},
      "returnProductImages": [],
      "returnProductError": '',
      fields: {},
      errors: {}
    }
  }

  componentDidMount() {
    this.getReturnReasons();
  }

  getS3Details() {
    axios
      .get('/api/projectSettings/get/S3')
      .then((response) => {
        const config = {
          bucketName: response.data.bucket,
          dirName: process.env.ENVIRONMENT,
          region: response.data.region,
          accessKeyId: response.data.key,
          secretAccessKey: response.data.secret,
        }
        if (config) {
          this.setState({
            config: config,
          }, () => {

          });
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  getReturnReasons() {
    axios.get('/api/returnreasons/get/list')
      .then((reasonsResponse) => {
        console.log("reasonsResponse==", reasonsResponse);
        if (reasonsResponse) {

          this.setState({
            returnsReasons: reasonsResponse.data
          })
        }
      })
      .catch((error) => {
        console.log("error while getting return resons=", error);
      })
  }

  // ratingReview(event){
  //   // console.log("event.target.value---",event.target.value);
  //   this.setState({
  //     [event.target.name]: event.target.value,
  //     reviewStarError : event.target.value ? "" : "Please give star rating."
  //   },()=>{
  //     // console.log('ratingReview---', this.state.ratingReview);
  //     // console.log("reviewStarError===",this.state.reviewStarError);
  //   })
  // }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue }, () => {
      // console.log("Rating value :",this.state.rating);
    });

  }

  validateReviewForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["customerReview"]) {
      console.log("!fields==", !fields["customerReview"]);
      formIsValid = false;
      errors["customerReview"] = "Please add your review.";
    }

    this.setState({
      errors: errors
    });

    return formIsValid;
  }

  handleChangeReview(event) {
    this.setState({
      [event.target.name]: event.target.value,
      reviewTextError: event.target.value ? "" : "Please Enter your feedback."
    })

    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });

  }

  submitReview(event) {
    event.preventDefault();
    if (this.validateReviewForm()) {
      if (this.state.rating_ID) {
        var formValues = {
          "review_id": this.state.rating_ID,
          "rating": this.state.rating,
          "customerReview": $('.feedbackForm textarea').val(),
          "reviewProductImages": [],
        }

        console.log("formValues=", formValues);
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
      } else {
        var reviewProductImages = [];
        var formValues = {
          "customer_id": this.props.user_ID,
          "customerName": this.props.orderData.userFullName,
          "order_id": this.props.orderData._id,
          "product_id": event.target.getAttribute('productid'),
          "rating": this.state.rating,
          "customerReview": $('.feedbackForm textarea').val(),
          "vendor_id": this.props.vendorWiseOrderData.vendor_id._id,
          "vendorLocation_id": event.target.getAttribute('vendorlocationid'),
          "status": "New",
          "reviewProductImages": reviewProductImages.push(this.state.imgUrl),
        }
        console.log("formValues=", formValues);
        axios.post("/api/customerReview/post", formValues)
          .then((response) => {
            if (response) {
              swal({ text: response.data.message }).then(function () {
                window.location.reload();
              });
            }
            var modal = document.getElementByClass('feedBackModal');
            modal.style.display = "none";
          })
          .catch((error) => {
          })
      }//end else
    }
    //}
  }

  setProductId(event) {
    event.preventDefault();
    var productId = event.currentTarget.getAttribute('productid');
    this.setState({
      "productId": productId,
      "productData": event.currentTarget.getAttribute('productdata')
    });
  }

  handleChangeReturn(event) {
    this.setState({
      [event.target.name]: event.target.value,
      returnTextError: event.target.value ? "" : "Please write your comment."
    })
  }

  handleRefundPayment(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
      refundToError: event.target.value ? "" : "Please select your Refund source."
    })
  }


  uploadImage(event) {
    event.preventDefault();
    const file = event.currentTarget.files[0];
    if (file) {
      axios
        .get('/api/projectSettings/get/S3')
        .then((response) => {
          const config = {
            bucketName: response.data.bucket,
            dirName: process.env.ENVIRONMENT,
            region: response.data.region,
            accessKeyId: response.data.key,
            secretAccessKey: response.data.secret,
            dirName: 'propertiesImages',
          }
          if (config) {
            this.setState({
              config: config,
            }, () => {
              const ReactS3Client = new S3(config);
              if (ReactS3Client) {
                ReactS3Client
                  .uploadFile(file)
                  .then(data => {
                    // console.log("fileUpload data=",data);
                    // console.log("fileUpload data=",data.location);
                    this.setState({
                      imgUrl: data.location
                    });

                  })
                  .catch(err => console.error("fileUpload data=", err))
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  deleteImage(event) {
    if (file) {
      // console.log("file to be deleted==",event.currentTarget.file);
      axios
        .get('/api/projectSettings/get/S3')
        .then((response) => {
          const config = {
            bucketName: response.data.bucket,
            dirName: process.env.ENVIRONMENT,
            region: response.data.region,
            accessKeyId: response.data.key,
            secretAccessKey: response.data.secret,
            dirName: 'propertiesImages',
          }
          if (config) {
            this.setState({
              config: config,
            }, () => {
              const ReactS3Client = new S3(config);
              if (ReactS3Client) {
                ReactS3Client
                  .deleteFile(file)
                  .then(response => {
                    console.log("img deleted", response);
                    this.setState({
                      imgUrl: data.location
                    });
                  })
                  .catch(err => console.error(err))

                  .catch(err => console.error("fileUpload data=", err))
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
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


  deleteImage(event) {
    var id = event.target.id;
    var productImageArray = this.state.productImageArray;
    if (productImageArray && productImageArray > 0) {
      productImageArray.splice(productImageArray.findIndex(v => v == id), 1);
      this.setState({
        sectionImage: "",
        productImageArray: productImageArray
      }, () => {
        // console.log('subcatgArr', this.state.subcatgArr);
      });
    }
  }
  getSingleProductReview(event) {
    // console.log("getSingleProductdetails==")
    var productID = event.target.getAttribute('productId');
    var customerID = event.target.getAttribute('customerId');
    var orderID = event.target.getAttribute('orderId');
    this.setState({ orderID: orderID });
    var formValues = {
      "customer_id": customerID,
      "order_id": orderID,
      "product_id": productID
    }
    console.log("formValues=", formValues);
    if (formValues) {
      axios.post("/api/customerReview/get/single/customer/review", formValues)
        .then((response) => {
          if (response.data) {
            // console.log("single review==",response.data);
            this.setState({
              rating_ID: response.data._id,
              customerID: response.data.customer_id,
              customerName: response.data.customerName,
              customerReview: response.data.customerReview,
              orderID: response.data.order_id,
              productID: response.data.productID,
              rating: response.data.rating,
              ratingReview: response.data.rating,
              reviewProductImages: [],
            }, () => {
              let fields = this.state.fields;
              fields["customerReview"] = response.data.profile.fullName;
              this.setState({
                fields
              });
            })
          }
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
  }

  selecteReason(event) {
    event.preventDefault();
    axios.get('/api/returnreasons/get/list')
      .then((reasonsResponse) => {
        if (reasonsResponse) {
          console.log("reasonsResponse=", reasonsResponse.data);
          this.setState({
            reasonsForReturn: reasonsResponse.data
          }, () => {
            // var reasonForReturn = event.target.getAttribute('id');
            var reasonForReturn = event.target.value;
            this.setState({
              reasonForReturn: reasonForReturn
            })
          })
        }
      })
      .catch((error) => {
        console.log("error while getting return resons=", error);
      })
  }

  returnProduct(event) {
    event.preventDefault();
    var productID = event.target.getAttribute('productId');
    var formValues = {
      "user_id": this.props.user_ID,
      "order_id": this.props.orderID,
      "product_id": productID,
      "vendor_id": this.props.vendorWiseOrderData.vendor_id._id,
      "vendorLocation_id": this.props.vendorWiseOrderData.vendorLocation_id,
      "reasonForReturn": this.state.reasonForReturn,
      "customerComment": this.state.customerReturnComment,
      "refund": this.state.paymentRefundSource,
      "returnProductImages": this.state.returnProductImages.push(this.state.imgUrl)
    }

    // console.log("formValues=",formValues);

    if (formValues && this.state.reasonForReturn && this.state.customerReturnComment && this.state.paymentRefundSource && this.state.returnProductImages) {
      axios.patch("/api/orders/patch/returnproduct", formValues)
        .then((response) => {
          if (response.data) {
            // console.log("single review==",response.data);
            swal({ text: response.data.message }).then(function () {
              window.location.reload();
            });
          }
        })
        .catch((error) => {
          console.log('error', error);
        })
    } else {
      this.setState({
        "returnProductError": "All feilds are mandatory"
      })
    }
  }

  render() {
    // console.log("productdetails this.props ===",this.props);
    return (
      <div className="col-12 ">
        <Message messageData={this.state.messageData} />
        <table className={"table table-borderless orderTable " + Style.table}>
          <thead>
            <tr>
              <th className="font-weight-bold">Product</th>
              <th className={"d-none d-lg-block " + Style.pnHIdden}>Products Name</th>
              {/* <th className="textAlignLeft">Price</th> */}
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
                    <td><img className="img orderImg" src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.png"} />
                      <h5 className="productName d-lg-none d-xl-none  ">{productdata.productName}</h5>
                      {productdata.size ? <span className="cartColor d-lg-none d-xl-none ">Size : {productdata.size} &nbsp; {productdata.unit}</span> : null}
                    </td>
                    <td className="mt-lg-4 d-none d-lg-block d-xl-block">
                      <a href={"/product-detail/" + this.props.vendorWiseOrderData.vendor_id._id + "/" + this.props.vendorWiseOrderData.vendorLocation_id + "/" + productdata.product_ID}>
                        {productdata.productNameRlang ?
                          <h5 className="RegionalFont">{productdata.productNameRlang}</h5>
                          :
                          <h5 className="productName">{productdata.productName}</h5>
                        }
                      </a>


                      <div>
                        {productdata.color ? <span className="cartColor">Color : <span style={{ backgroundColor: productdata.color, padding: '0px 5px' }}>&nbsp;</span>  </span> : null}
                        {productdata.size ? <span className="cartColor">Size : {productdata.size} &nbsp; {productdata.unit}</span> : null}
                      </div>
                    </td>
                    {/* <td className="textAlignLeft">
                                    {
                                      <span className="productPrize textAlignRight">{this.props.currency}&nbsp;{productdata.discountedPrice.toFixed(2)}</span>
                                            
                                    }
                                </td> */}
                    <td className="textAlignCenter">
                      {
                        <span className=" textAlignRight">{productdata.quantity}</span>

                      }
                    </td>
                    <td className="textAlignRight">
                      {
                        <span className="productPrize textAlignRight">
                          {this.props.currency}
                          &nbsp;{productdata.discountedPrice.toFixed(2)}
                        </span>
                      }

                      {this.props.orderStatus === "Delivered" ?
                        <span>
                          {productdata.isReview ?
                            <div className={" " + Style.returnReviewBtn} productId={productdata.product_ID} orderId={this.props.orderID} customerId={this.props.user_ID} onClick={this.getSingleProductReview.bind(this)} data-toggle="modal" data-target={"#reviewModal_" + productdata.product_ID}>Edit Review</div>
                            :
                            <div className={" " + Style.returnReviewBtn} productid={productdata.product_ID} onClick={this.setProductId.bind(this)} data-toggle="modal" data-target={"#reviewModal_" + productdata.product_ID}>Add Review</div>
                          }
                          {/* {productdata.productReturnable === "returnable"  && productdata.productStatus? */}
                          {productdata.productStatus ?
                            <div className={" " + Style.returnReviewBtn} productId={productdata.product_ID} >{productdata.productStatus}</div>
                            :
                            <div className={" " + Style.returnReviewBtn} productid={productdata.product_ID} onClick={this.setProductId.bind(this)} data-toggle="modal" data-target={"#returnModal_" + productdata.product_ID}>return</div>
                          }
                        </span>
                        : null
                      }
                      {/* Review and Rating */}
                      <div className="modal col-6 offset-3 NOpadding mt-4 feedBackModal" id={"reviewModal_" + productdata.product_ID} role="dialog">
                        <div className="modal-content modalContent " style={{ 'background': '#fff' }}>
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
                                  <img src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.png"} alt="" />
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
                              <span className={"col-12 " + Style.errormsg}>{this.state.reviewStarError}</span>
                              <div className="row inputrow">
                                <label className="col-12 mt15 text-left">Write review</label>
                                <div className="col-12 ">
                                  <textarea rows="5" className="col-12 " onChange={this.handleChangeReview.bind(this)} value={this.state.customerReview} name="customerReview"></textarea>
                                  <div className={"col-12 text-left NoPadding " + Style.errormsg}>{this.state.errors.customerReview}</div>
                                </div>
                              </div>
                              <div className={"col-12 " + Style.ReturnImg}>
                                <div className="row">
                                  <div className=" col-4 mt-2">
                                    <div className="row">
                                      <span className={"col-1 " + Style.errormsg}>*</span>
                                      <input type="file" className="col-10" onChange={this.uploadImage.bind(this)} title="Choose Image" accept=".jpg,.jpeg,.png" />
                                    </div>
                                    {/* <span className={"col-12 " +Style.errormsg}>{this.state.imgUrl}</span> */}
                                    <div className={"col-12 " + Style.errormsg}>{this.state.errors.imgUrl}</div>
                                  </div>
                                  {
                                    this.state.imgUrl ?
                                      <div className="col-lg-12 productImgCol">
                                        <div className={"col-2 NoPadding " + Style.prodImage}>
                                          <div className="col-12 NoPadding prodImageInner">
                                            <span className="prodImageCross" title="Delete Image" data-imageurl={this.state.imgUrl} onClick={this.deleteImage.bind(this)} >x</span>
                                          </div>
                                          <img src={this.state.imgUrl} className={" col-12 NoPadding img-responsive imp-thumbnail " + Style.reviewImg} style={{ height: '40px' }}></img>
                                        </div>
                                        <div className="errorMsg">{this.state.errors.reviewImg}</div>
                                      </div>
                                      :
                                      null
                                  }
                                </div>
                              </div>
                              <div className="row inputrow">
                              </div>
                            </form>
                          </div>
                          <div className="modal-footer modalfooterborder ">
                            <div className="col-12 ">
                              <button className="btn btn-primary pull-right mt15" onClick={this.submitReview.bind(this)} vendorlocationid={this.props.vendorWiseOrderData.vendorLocation_id} productid={productdata && productdata.product_ID}
                              >{productdata.isReview ? 'Update' : 'Submit'}</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Return product */}
                      <div className="modal col-6 offset-3 NOpadding mt-4 feedBackModal" id={"returnModal_" + productdata.product_ID} role="dialog">
                        <div className="modal-content modalContent " style={{ 'background': '#fff' }}>
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
                            <div className="col-12 mt-4 mb-4">
                              <div className="row">
                                <div className="col-3 orderimgsize">
                                  <img src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.png"} alt="" />
                                </div>
                                <div className="col-5 ">{productdata.productName}</div>
                                <div className="col-4 total textAlignRight">{this.props.currency} {productdata.discountedPrice}</div>
                              </div>
                            </div>

                            <form className={"feedbackForm col-12 pt-2 mt-2 " + Style.returnForm}>
                              <div className={" col-12 mt-2 mb-2 text-left NoPadding " + Style.errorMsg} >{this.state.returnProductError}</div>
                              <label className="col-12 NoPadding text-left">Please Select Reasons <span className="errorMsg"> * </span></label>
                              <select onChange={this.selecteReason.bind(this)} className={"col-12 form-control "} ref="reasonOfReturn" name="reasonOfReturn" >
                                <option name="reasonOfReturn" selected="true">-- Select --</option>
                                {
                                  this.state.returnsReasons && this.state.returnsReasons.length > 0 ?
                                    this.state.returnsReasons.map((data, index) => {
                                      return (
                                        <option key={index} id={data._id} value={data.reasonOfReturn}>{data.reasonOfReturn}</option>
                                      );
                                    })
                                    :
                                    <option value='user'>No Reasons available</option>
                                }
                              </select>
                              <label className="error ">{this.state.reviewStarError}</label>

                              <div className="row inputrow">
                                <label className="col-12 NoPadding text-left ">Comment <span className="errorMsg"> * </span></label>
                                <div className="col-12 ">
                                  <textarea rows="5" className="col-12 " onChange={this.handleChangeReturn.bind(this)} value={this.state.customerReturnComment} name="customerReturnComment"></textarea>
                                  <label className="error">{this.state.returnTextError}</label>
                                </div>
                              </div>

                              {/* <div className="col-12">
                                                      < ReturnForm />
                                                  </div> */}


                              <div className={"col-12 " + Style.ReturnImg}>
                                <div className="row">
                                  <div className=" col-4 mt-2">
                                    {/* <label className="col-12 NoPadding ">Upload real images of the product <span className="errorMsg"> * </span></label>                                                            */}
                                    <input type="file" onChange={this.uploadImage.bind(this)} title="upload product Image" accept=".jpg,.jpeg,.png" />
                                  </div>
                                  {
                                    this.state.imgUrl ?
                                      <div className="col-lg-12 productImgCol">
                                        <div className={"col-2 NoPadding " + Style.prodImage}>
                                          <div className="col-12 NoPadding prodImageInner">
                                            <span className="prodImageCross" title="Delete Image" data-imageurl={this.state.imgUrl} onClick={this.deleteImage.bind(this)} >x</span>
                                          </div>
                                          <img src={this.state.imgUrl} className={" col-12 NoPadding img-responsive imp-thumbnail " + Style.reviewImg} style={{ height: '40px' }}></img>
                                        </div>
                                      </div>
                                      :
                                      null
                                  }
                                </div>
                              </div>

                              <div className={"col-12 NoPadding text-left "}>
                                <div className={"col-12 mt-2 mb-2 text-left" + Style.eCommTitle + " " + Style.paymentMethodTitle}>Refund to <span className="required">*</span></div>
                                <div className="form-check mt-2">
                                  <label className="form-check-label ">
                                    <input type="radio" className="form-check-input webModelInput codRadio" name="paymentRefundSource" type="radio" id="paymentRefundSource" value="source"
                                      checked={this.state.paymentRefundSource === "source"}
                                      onClick={this.handleRefundPayment.bind(this)}
                                    />The Source( valid for card payment only)
                                  </label>
                                </div>
                                <div className="form-check mt-2" >
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
                              {!productdata.status ?
                                <button className="btn btn-primary pull-right mt15"
                                  onClick={this.returnProduct.bind(this)}
                                  productid={productdata && productdata.product_ID}
                                  vendor_id={this.props.vendorWiseOrderData.vendor_id}
                                  orderId={this.props.orderID}
                                  vendorlocationid={this.props.vendorWiseOrderData.vendorLocation_id}
                                >Submit</button>
                                : null}
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