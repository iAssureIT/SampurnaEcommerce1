import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import moment from 'moment';
import Link from 'next/link';
import S3 from 'react-aws-s3';
// import S3FileUpload from 'react-s3';
import StarRatingComponent  from 'react-star-rating-component';
import swal                 from 'sweetalert';
import Style                from './index.module.css';

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
      "customerReturnComment" : "",
      "reasonForReturn": "",
      "imgUrls" : [],
      "isChecked" : false,
      "checkReturnPolicy": false,
      "returnProductImages": [],
      "returnProductError": '',
      fields: {},
      errors: {},
      authService : "",
      submitBtn:"enabled"
    }
  }

  componentDidMount() {
    this.getReturnReasons();
    var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    var currency = sampurnaWebsiteDetails.preferences.currency;
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    // console.log("userDetails===",userDetails);
    this.setState({
      user_ID: userDetails.user_id,
      email: userDetails.email,
      fullName: userDetails.firstName + " " + userDetails.lastName,
      currency: currency,
      authService : userDetails.authService,
    })
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
        // console.log("reasonsResponse==", reasonsResponse);
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
      // console.log("!fields==", !fields["customerReview"]);
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
          "customerReview": this.state.customerReview,
          "reviewProductImages": this.state.imgUrls,
          // "product_id": event.target.getAttribute('productid'),
          // "vendor_id": this.props.vendorWiseOrderData.vendor_id._id,
          // "vendorLocation_id": event.target.getAttribute('vendorlocationid'),
          // "status": "New",
        }

        console.log("formValues=", formValues);
        axios.patch("/api/customerReview/patch/customer/review", formValues)
          .then((response) => {
            swal({ text: response.data.message });
            this.setState({
              rating : 1,
              imgUrl : "",
              customerReview : ""
            })
            // swal({ text: response.data.message }).then(function () {
            //   window.location.reload();
            // });
            var modal = document.getElementByClass('feedBackModal');
            modal.style.display = "none";
            $('.modal-backdrop').remove();
          })
          .catch((error) => {
          })
      } else {
        var reviewProductImages = [];
        console.log("img===",this.state.imgUrls);
        // var imgUrl = this.state.imgUrl;
        // if(imgUrl){
        //   reviewProductImages.push(imgUrl)
        //   // console.log("imgArray===",reviewProductImages);
        // }
        var formValues = {
          "customer_id": this.props.user_ID,
          "customerName": this.props.orderData.userFullName,
          "order_id": this.props.orderData._id,
          "product_id": event.target.getAttribute('productid'),
          "rating": this.state.rating,
          "customerReview": this.state.customerReview,
          "vendor_id": this.props.vendorWiseOrderData.vendor_id._id,
          "vendorLocation_id": event.target.getAttribute('vendorlocationid'),
          "status": "New",
          "reviewProductImages": this.state.imgUrls,
        }
        console.log("formValues=", formValues);
        axios.post("/api/customerReview/post", formValues)
          .then((response) => {
            if (response) {
              swal({ text: response.data.message });
              this.setState({
                rating : 1,
                imgUrl : "",
                customerReview : ""
              })
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

  checkboxClick(event) {
    let isChecked = !this.state.isChecked;
    this.setState({ isChecked }, () => {

    });
    // let fields = this.state.fields;
    // fields[event.target.name] = isChecked;
    // this.setState({
    //     fields
    // });
}
uploadImage(event) {
    event.preventDefault();
    var productImages = [];
    // console.log("files===",event.currentTarget.files);
    let files = event.currentTarget.files;
    for(var i=0; i<files.length; i++){
      let file = files[i];
      productImages.push(file);
    }
    if (productImages) {
      console.log("productImages==",productImages);
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
              console.log("config==",config);
              const ReactS3Client = new S3(config);
              if (ReactS3Client) {
                var imagesPaths =[];
                for(let j=0;j<productImages.length;j++){
                ReactS3Client
                  .uploadFile(productImages[j])
                  .then(data => {
                    // console.log("fileUpload data=",data);
                    // console.log("fileUpload data=",data.location);
                    this.state.imgUrls.push(data.location);
                    // imagesPaths.push(data.location);
                    console.log("this.state.imgUrls=",this.state.imgUrls);
                    this.setState({
                      imgUrl: this.state.imgUrls
                    });

                  })
                  .catch(err => console.error("fileUpload data=", err))
                }
                this.setState({
                  imgUrls: imagesPaths
                },()=>{
                    console.log("imgUrls===",this.state.imgUrls);
                });
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
    event.preventDefault();
    var file = event.target.getAttribute('data-imageurl');
    console.log("file path ==",file);
    var fileArray = file.split('/');
    file = fileArray[4];
    console.log("file[3] ==",fileArray[4]);
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
            console.log("config==",config);
            this.setState({
              config: config,
            }, () => {
              console.log("file===",file);
              const ReactS3Client = new S3(config);
              if (ReactS3Client) {
                ReactS3Client
                  .deleteFile(file)
                  .then(response => {
                    console.log("img deleted", response);
                    this.state.imgUrls.pop(file);
                    this.setState({
                      imgUrls: this.state.imgUrls
                    },()=>{
                        console.log("ImgUrl==",this.state.imgUrls);
                    });
                  })
                  .catch(err => console.error("Error while deleting image from s3",err))

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
    // console.log("formValues=", formValues);
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
              fields["customerReview"] = response.data.customerReview;
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
  deleteReview(event){
    event.preventDefault();
    var productID = event.target.getAttribute('productId');
    var customerID = event.target.getAttribute('customerId');
    var orderID = event.target.getAttribute('orderId');
    this.setState({ orderID: orderID });
    var formValues = {
      "customer_id": customerID,
      "order_id": orderID,
      "product_id": productID
    }
    // console.log("formValues=", formValues);
    if (formValues) {
      axios.post("/api/customerReview/get/single/customer/review", formValues)
        .then((response) => {
          if (response.data) {
            console.log("single review==",response.data);
            this.setState({
              rating_ID: response.data._id,
            }, () => {
              swal({
                title: "Are you sure?",
                text: "Are you sure that you want to delete this review?",
                icon: "warning",
                dangerMode: true,
                buttons: true,
                })
                .then(willDelete => {
                    if (willDelete) {
                        axios.delete('/api/customerReview/delete/'+this.state.rating_ID)
                        .then((deleteResponse) => {
                          if (deleteResponse) {
                              swal("Review deleted.");
                          }
                        })
                        .catch((error) => {
                          console.log("error while deleting Review==", error);
                        })
                    } else {
                        swal("Your Review is safe!");
                    }
                })
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
          // console.log("reasonsResponse=", reasonsResponse.data);
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
      "returnProductImages": this.state.imgUrls,
      "checkReturnPolicy"  : this.state.isChecked,
    }
    console.log("formValues=",formValues);
    if (this.state.reasonForReturn!=="" && this.state.reasonForReturn!=="-- Select reason --" && this.state.customerReturnComment!=="" && this.state.isChecked !== false && this.state.paymentRefundSource !=="" && this.state.imgUrls.length>=1) {
      
      axios.patch("/api/orders/patch/returnproduct", formValues)
        .then((response) => {
          if (response.data) {
            // console.log("single review==",response.data);
            this.setState({
              "submitBtn" : "enabled",
            })
            swal({ text: response.data.message }).then(function () {
              // window.location.reload();
            });
          }
        })
        .catch((error) => {
          console.log('error', error);
        })
    } else {
      this.setState({
        "returnProductError": "All feilds are mandatory",
        "submitBtn" : "disabled",
      })
    }
  }

  render() {
    // console.log("OrderData==",this.props.orderData);
    return (
      <div className="col-12 productViewMainwrapper">
        <div className="col-12 d-none d-lg-block d-xl-block">
       
          {/*<Message messageData={this.state.messageData} />*/}
          <table className={"table table-borderless orderTable " + Style.table}>
            <thead>
              <tr>
                <th className="font-weight-bold pb-1">Product</th>
                <th className={"d-none d-lg-block pb-1 " + Style.pnHIdden}>Products Name</th>
                <th className="textAlignLeft pb-1">Price</th>
                <th className="textAlignCenter pb-1">Quantity</th>
                <th className="textAlignRight pb-1">SubTotal</th>
              </tr>
            </thead>
            
            {/* <thead className="d-block d-lg-none d-xl-none">
              <tr>
                <th className="font-weight-bold">Product</th>
                <th className={"d-none d-lg-block " + Style.pnHIdden}>Products Name</th>
              
                <th className="textAlignCenter">Quantity</th>
                <th className="textAlignRight">SubTotal</th>
              </tr>
            </thead> */}

            <tbody>
              {
                this.props.vendorWiseOrderData && this.props.vendorWiseOrderData.products.map((productdata, index) => {
                  // console.log("productdata=",productdata);
                  var categoryUrl = (productdata.category ? productdata.category:"").replace(/\s+/g, '-').toLowerCase();                    
                  var subCategoryUrl = (productdata.subCategory ? productdata.subCategory:"-").replace(/\s+/g, '-').toLowerCase();
                  return (
                    <tr key={index}>
                      <td><img className="img orderImg" src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.png"} />
                        <h5 className="productName d-lg-none d-xl-none  ">{productdata.productName}</h5>
                        {productdata.size ? <span className="cartColor d-lg-none d-xl-none ">Size : {productdata.size} &nbsp; {productdata.unit}</span> : null}
                      </td>
                      <td className="mt-lg-4 d-none d-lg-block d-xl-block">

                      {
                        <div className={" singleProductDetail "+Style.singleProductDetail}>        
                          <span className="">{productdata.brand}</span>
                        </div> 
                      }
                        <a href={"/product-detail/" + this.props.vendorWiseOrderData.vendor_id._id + "/" + this.props.vendorWiseOrderData.vendorLocation_id + "/"+categoryUrl +"/"+subCategoryUrl+"/" + productdata.product_ID}>
                          {productdata.productNameRlang ?
                            <h5 className="RegionalFont">{productdata.productNameRlang}</h5>
                            :
                            <h5 className={"productName "+Style.productNameOrderDetail}>{productdata.productName}</h5>
                          }
                        </a>
                      </td>
                      <td className="textAlignLeft ">
                              <span className={"productPrize textAlignRight "}>{this.props.currency}&nbsp;
                                {productdata.originalPrice !== productdata.discountedPrice ? 
                                  <span className={Style.oldPrice}>{productdata.originalPrice.toFixed(2)}</span>
                                :
                                  null
                                }
                                </span>&nbsp;
                              <span className="productPrize textAlignRight">&nbsp;{productdata.discountedPrice.toFixed(2)}</span>
                                    
                            
                        </td>
                      <td className="textAlignCenter">
                        {
                          <span className={"textAlignRight "+Style.productQuantity}>{productdata.quantity}</span>

                        }
                      </td>
                      <td className={"textAlignRight "+Style.orderDetailSubTotalWrapper}>
                        {
                          <span className={"productPrize abc textAlignRight "+Style.productPrize}>
                            {this.props.currency}
                            &nbsp;{(productdata.discountedPrice.toFixed(2) * productdata.quantity).toFixed(2) }
                          </span>
                        }

                        {this.props.orderStatus === "Delivered" && this.state.authService !== "guest" ?
                          <span className={" " + Style.returnReviewBtnWrapper}>
                            {/* {productdata.productReturnable === "returnable"  && productdata.productStatus? */
                              // console.log("productdata.productReturnable==",productdata.productReturnable)
                            }
                            {productdata.productStatus ?
                                <div className={"mt-2 " + Style.returnReviewBtn} productId={productdata.product_ID} >{productdata.productStatus}</div>
                              :
                                <div className={"mt-2 " + Style.returnReviewBtn} productid={productdata.product_ID} onClick={this.setProductId.bind(this)} data-toggle="modal" data-target={"#returnModal_" + productdata.product_ID}>Return</div>
                            }
                              {productdata.isReview ?
                                <div>
                                  <span className={"mt-1 " + Style.returnReviewBtn} productId={productdata.product_ID} orderId={this.props.orderID} customerId={this.props.user_ID} onClick={this.getSingleProductReview.bind(this)} data-toggle="modal" data-target={"#reviewModal_" + productdata.product_ID}>Edit Review  </span>
                                  &nbsp; <i className="fa fa-trash cursor-pointer" productId={productdata.product_ID} orderId={this.props.orderID} customerId={this.props.user_ID} onClick={this.deleteReview.bind(this)} style = {{cursor :"pointer",fontSize : "15px"}}></i>
                                </div>
                              :
                                <div className={"mt-1 " + Style.returnReviewBtn} productid={productdata.product_ID} onClick={this.setProductId.bind(this)} data-toggle="modal" data-target={"#reviewModal_" + productdata.product_ID}>Feedback</div>
                              }
                          </span>
                          : null
                        }
                        {/* Review and Rating */} 
                        <div className="modal fade feedBackModal" id={"reviewModal_" + productdata.product_ID} role="dialog" data-backdrop="static" data-keyboard="false">
                          <div class="modal-dialog modal-dialog-centered ">
                            <div className="modal-content modalContent " style={{ 'background': '#fff' }}>
                            <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                              <div className="col-12">
                                <div className="row mt-2">
                                  <div className="col-4 text-left mt-2">
                                    <img src="/images/eCommerce/TrollyLogo.png" height ={40} />
                                  </div>
                                  <div className="col-7 text-center">
                                    {/* <h6 className="modal-title mt-2 modalheadingcont"> Product Review</h6> */}
                                  </div>
                                  <div className="col-1 text-center">
                                    <button type="button" className="close pt-0 closeModal pull-right" data-dismiss="modal">&times;</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="modal-body addressModalBody">
                              <div className="col-12 mt-3 ">
                                <div className="row">
                                  <div className="col-3 NoPadding orderimgsize text-center" style={{height:'100px'}}>
                                    <img src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.png"} alt="" />
                                  </div>
                                  <div className="col-5 mt-4 pt-3">
                                      <div className={"col-12 NoPadding text-left " +Style.reviewProName}>{productdata.productName}</div>
                                      <div className={"col-12 NoPadding text-left " +Style.reviewProPrice}>{this.props.currency} {productdata.discountedPrice.toFixed(2)}</div>
                                  </div>
                                  <div className={"col-3 my-auto NoPadding total text-center "+Style.reviewVendorName }> <b>{this.props.vendorWiseOrderData.vendorName}</b></div>
                                </div>
                              </div>
                              
                              <form className="feedbackForm col-10 mx-auto">
                                <div className="row">
                                <div className="col-10  mx-auto row reviewWrapper">
                                  <StarRatingComponent
                                    name="rate1"
                                    starCount={5}
                                    value={this.state.rating}
                                    onStarClick={this.onStarClick.bind(this)}
                                  />
                                  <div className="clearfix "></div>
                                </div>
                                <span className={"col-12 " + Style.errormsg}>{this.state.reviewStarError}</span>
                                <div className="col-12 inputrow">
                                    <label className={"col-12 mt15 text-left "+Style.feedbackLable}>Leave a feedback...</label>
                                    <div className="row">
                                      <textarea rows="5" className={"col-12 "+Style.feedbackBox} onChange={this.handleChangeReview.bind(this)} value={this.state.customerReview} name="customerReview"></textarea>
                                      <div className={"col-12 text-left NoPadding " + Style.errormsg}>{this.state.errors.customerReview}</div>
                                    </div>
                                  
                                </div>
                                <div className={"col-12 "}>
                                  <div className="col-12">
                                    <div className={"col-3 pull-right " +Style.inputWrapper}>
                                        <input type="file" multiple id="files" className={ Style.hidden +" " +Style.fileInput} onChange={this.uploadImage.bind(this)} title="Choose Image" accept=".jpg,.jpeg,.png"/>
                                        <div className={" " +Style.uploadReviewImg}></div>
                                    </div>
                                    <div className="col-12 mt-4">
                                    {
                                        this.state.imgUrls ?
                                          <div className="col-lg-12 productImgCol">
                                            <div className="row">
                                              {this.state.imgUrls.map((imgUrl,index)=>{
                                                  return(
                                                    <div className={"col-4 " + Style.prodImage}>
                                                      <div className="col-12 NoPadding prodImageInner">
                                                        <span className={Style.prodImageCross} title="Delete Image" data-imageurl={imgUrl} onClick={this.deleteImage.bind(this)} >x</span>
                                                      </div>
                                                      <img src={imgUrl} className={" col-12 NoPadding img-responsive imp-thumbnail " + Style.reviewImg} style={{ height: '40px' }}></img>
                                                    </div>
                                                  )
                                                })
                                              }
                                            </div>
                                          </div>
                                          :
                                          null
                                      }
                                    </div>
                                  </div>
                                  </div>
                                </div>
                              </form>
                              
                            </div>
                            <div className={"modal-footer "+Style.reviewModalFooter}>
                              <div className="col-6 col-sm-6 col-lg-4 col-xl-4 mx-auto ">
                                <button className={"btn btn-primary col-12  pull-right "+Style.feedbackBtn} onClick={this.submitReview.bind(this)} vendorlocationid={this.props.vendorWiseOrderData.vendorLocation_id} productid={productdata && productdata.product_ID}
                                >{productdata.isReview ? 'Update' : 'Submit'}</button>
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                        {/* Return product */}
                        <div className="modal fade feedBackModal" id={"returnModal_" + productdata.product_ID} role="dialog" data-backdrop="static" data-keyboard="false">
                          <div class="modal-dialog modal-dialog-centered ">
                            <div className="modal-content modalContent " style={{ 'background': '#fff' }}>
                              <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                                <div className="col-12">
                                  <div className="row mt-2">
                                    <div className="col-4 text-left mt-2">
                                      <img src="/images/eCommerce/TrollyLogo.png" height ={40} />
                                    </div>
                                    <div className="col-7 text-center">
                                      {/* <h6 className="modal-title mt-2x modalheadingcont">Return Product</h6> */}
                                    </div>
                                    <div className="col-1 text-center">
                                      <button type="button" className="close pt-0 closeModal" data-dismiss="modal">&times;</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-body addressModalBody">
                                <div className="col-12 mt-3 ">
                                  <div className="row">
                                    <div className="col-3 NoPadding orderimgsize text-center" style={{height:'100px'}}>
                                      <img src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.png"} alt="" />
                                    </div>
                                    <div className="col-5 mt-4 pt-3">
                                        <div className={"col-12 NoPadding text-left " +Style.reviewProName}>{productdata.productName}</div>
                                        <div className={"col-12 NoPadding text-left " +Style.reviewProPrice}>{this.props.currency} {productdata.discountedPrice.toFixed(2)}</div>
                                    </div>
                                    <div className={"col-3 my-auto NoPadding total text-center "+Style.reviewVendorName }> <b>{this.props.vendorWiseOrderData.vendorName}</b></div>
                                  </div>
                                </div>

                                <form className={"feedbackForm col-10 mx-auto pt-2 " + Style.returnForm}>
                                  <div className={" col-12 mb-2 text-left NoPadding " + Style.errorMsg} >{this.state.returnProductError}</div>
                                  <label className={"col-12 NoPadding text-left "+Style.feedbackLable}> Reason for Return <span className="errorMsg">  </span></label>
                                  <select onChange={this.selecteReason.bind(this)} className={"col-12 form-control "} ref="reasonOfReturn" name="reasonOfReturn" >
                                    <option name="reasonOfReturn" selected="true">-- Select reason --</option>
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
                                    <label className={"col-12 text-left "+Style.feedbackLable}>Comment <span className="errorMsg">  </span></label>
                                    <div className="col-12 ">
                                      <textarea rows="5" className={"col-12 "+Style.feedbackBox} onChange={this.handleChangeReturn.bind(this)} value={this.state.customerReturnComment} name="customerReturnComment" style={{"resize":"none"}}></textarea>
                                      <label className="error">{this.state.returnTextError}</label>
                                    </div>
                                  </div>
                                  <div className={"container-flex"}>
                                  <div className={"col-2 NoPadding pull-right " +Style.inputWrapper}>
                                      <input type="file" multiple id="files" className={ Style.hidden +" " +Style.fileInput} onChange={this.uploadImage.bind(this)} title="Choose Image" accept=".jpg,.jpeg,.png"/>
                                      <div className={" " +Style.uploadReviewImg}></div>
                                  </div>
                                  <div className="col-12 mt-4">
                                  {
                                        this.state.imgUrls ?
                                          <div className="col-lg-12 productImgCol">
                                            <div className="row">
                                              {this.state.imgUrls.map((imgUrl,index)=>{
                                                  return(
                                                    <div className={"col-4 " + Style.prodImage}>
                                                      <div className="col-12 NoPadding prodImageInner">
                                                        <span className={Style.prodImageCross} title="Delete Image" data-imageurl={imgUrl} onClick={this.deleteImage.bind(this)} >x</span>
                                                      </div>
                                                      <img src={imgUrl} className={" col-12 NoPadding img-responsive imp-thumbnail " + Style.reviewImg} style={{ height: '40px' }}></img>
                                                    </div>
                                                  )
                                                })
                                              }
                                            </div>
                                          </div>
                                          :
                                          null
                                      }
                                  </div>
                                </div>
                                
                                  <div className={"col-12 NoPadding text-left "}>
                                    <div className={"col-12 NoPadding mt-2 mb-2 text-left" + Style.eCommTitle + " " + Style.paymentMethodTitle +" "+Style.feedbackLable}>Refund to : <span className="required"></span></div>
                                    <div className={"form-check mt-2 "}>
                                      <label className={"form-check-label "+Style.orderDetailRadioButtonLabel}>
                                        {this.props.orderData.paymentDetails.paymentMethod === "Cash On Delivery" ?
                                          <input type="radio" className={"form-check-input webModelInput " +Style.returnRadioBtn} name="paymentRefundSource" type="radio" id="paymentRefundSource" value="source"
                                            disabled
                                            onClick={this.handleRefundPayment.bind(this)}
                                          />
                                        :
                                          <input type="radio" className={"form-check-input webModelInput " +Style.returnRadioBtn} name="paymentRefundSource" type="radio" id="paymentRefundSource" value="source"
                                          checked={this.state.paymentRefundSource === "source"}
                                          onClick={this.handleRefundPayment.bind(this)}
                                          />
                                        }
                                        The Source( valid for card payment only)
                                      </label>
                                    </div>
                                    <div className="form-check mt-2" >
                                      <label className={"form-check-label "+Style.orderDetailRadioButtonLabel} for="radio1">
                                        <input type="radio" className={"form-check-input webModelInput "+Style.returnRadioBtn} name="paymentRefundSource" type="radio" id="paymentRefundSource" value="credit"
                                          checked={this.state.paymentRefundSource === "credit"}
                                          onChange={this.handleRefundPayment.bind(this)}
                                        />Add To Credit Points
                                      </label>
                                    </div>
                                    <div className="errorMsg col-11 ml-2">{this.state.refundToError}</div>
                                  </div>
                                  <div className={"col-12 text-left mt-2"}>
                                    <div className="row">
                                      <input type="checkbox" name="termsNconditions" isChecked={this.state.isChecked} title="I agree to return policy" onClick={this.checkboxClick.bind(this)} className="mt-1" />
                                      <div className="col-10">
                                          <a className={Style.privacyPolicy} target="_blank" href="/privacy-policy">I agree to <span className={Style.returnLink}>Return Policy</span></a>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                              <div className={"modal-footer "+Style.reviewModalFooter}>
                                <div className="col-6 col-sm-6 col-lg-4 col-xl-4 mx-auto ">
                                  {!productdata.status ?
                                    <button className={"btn btn-primary pull-right col-12 "+Style.feedbackBtn}
                                      
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
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>

        <div className="col-12 d-lg-none d-xl-none d-block">
       
          {/*<Message messageData={this.state.messageData} />*/}
          <table className={"table table-borderless orderTable " + Style.table}>
            <thead>
              <tr>
                <th className="font-weight-bold pb-1">Product</th>
                <th className={"d-none d-lg-block pb-1 " + Style.pnHIdden}>Products Name</th>
                {/* <th className="textAlignLeft pb-1">Price</th> */}
                <th className="textAlignCenter pb-1">Quantity</th>
                <th className="textAlignRight pb-1">SubTotal</th>
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

                      {
                        <div className={" singleProductDetail "+Style.singleProductDetail}>        
                          <span className="">Brand</span>
                        </div>           
                              
                      }
                        <a href={"/product-detail/" + this.props.vendorWiseOrderData.vendor_id._id + "/" + this.props.vendorWiseOrderData.vendorLocation_id + "/" + productdata.product_ID}>
                          {productdata.productNameRlang ?
                            <h5 className="RegionalFont">{productdata.productNameRlang}</h5>
                            :
                            <h5 className={"productName "+Style.productNameOrderDetail}>{productdata.productName}</h5>
                          }
                        </a>


                       
                      </td>
                      {/* <td className="textAlignLeft ">
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
                              <div className={" " + Style.returnReviewBtn} productId={productdata.product_ID} orderId={this.props.orderID} customerId={this.props.user_ID} onClick={this.getSingleProductReview.bind(this)} data-toggle="modal" data-target={"#reviewModal_" + productdata.product_ID}>Edit Feedback</div>
                              :
                              <div className={" " + Style.returnReviewBtn} productid={productdata.product_ID} onClick={this.setProductId.bind(this)} data-toggle="modal" data-target={"#reviewModal_" + productdata.product_ID}>Feedback</div>
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
                        <div className="modal fade feedBackModal" id={"reviewModal_" + productdata.product_ID} role="dialog" data-backdrop="static" data-keyboard="false">
                          <div class="modal-dialog modal-dialog-centered ">
                            <div className="modal-content modalContent " style={{ 'background': '#fff' }}>
                            <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                              <div className="col-12">
                                <div className="row mt-2">
                                  <div className="col-4 text-left NoPadding mt-2">
                                    {/*<WebsiteLogo/>*/}
                                    <img src="/images/eCommerce/TrollyLogo.png" height ={40} />                                    
                                  </div>
                                  <div className="col-7 text-center">
                                    {/* <h6 className="modal-title mt-2 modalheadingcont"> Product Review</h6> */}
                                  </div>
                                  <div className="col-1 text-center">
                                    <button type="button" className="close pt-0 closeModal pull-right" data-dismiss="modal">&times;</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="modal-body addressModalBody">
                              <div className="col-12 mt-3 ">
                                <div className="row">
                                  <div className="col-3 NoPadding orderimgsize" style={{height:'100px'}}>
                                    <img src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.png"} alt="" />
                                  </div>
                                  <div className="col-5 mt-4 pt-3">
                                      <div className={"col-12 NoPadding text-left " +Style.reviewProName}>{productdata.productName}</div>
                                      <div className={"col-12 NoPadding text-left " +Style.reviewProPrice}>{this.props.currency} {productdata.discountedPrice.toFixed(2)}</div>
                                  </div>
                                  <div className={"col-3 my-auto NoPadding total text-center "+Style.reviewVendorName }> <b>{this.props.vendorWiseOrderData.vendorName}</b></div>
                                </div>
                              </div>

                              <form className="feedbackForm col-12">
                                <div className="col-8 offset-2 row">
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
                                  <label className={"col-12 mt15 text-left "+Style.feedbackLable}>Leave a feedback...</label>
                                  <div className="col-12 ">
                                    <textarea rows="5" className={"col-12 feedbackTextBox "+Style.feedbackBox} style={{"resize":"none"}} onChange={this.handleChangeReview.bind(this)} value={this.state.customerReview} name="customerReview" ></textarea>
                                    <div className={"col-12 text-left NoPadding " + Style.errormsg}>{this.state.errors.customerReview}</div>
                                  </div>
                                </div>
                                <div className={"container-flex"}>
                                  <div className={"col-2 NoPadding pull-right " +Style.inputWrapper}>
                                      <input type="file" multiple id="files" className={ Style.hidden +" " +Style.fileInput} onChange={this.uploadImage.bind(this)} title="Choose Image" accept=".jpg,.jpeg,.png"/>
                                      <div className={" " +Style.uploadReviewImg}></div>
                                  </div>
                                  <div className="col-12 mt-4">
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
                              </form>
                            </div>
                            <div className={"modal-footer "+Style.reviewModalFooter}>
                              <div className="col-6 col-sm-6 col-lg-4 col-xl-4 mx-auto ">
                                <button className={"btn btn-primary col-12  pull-right "+Style.feedbackBtn} onClick={this.submitReview.bind(this)} vendorlocationid={this.props.vendorWiseOrderData.vendorLocation_id} productid={productdata && productdata.product_ID}
                                >{productdata.isReview ? 'Update' : 'Submit'}</button>
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                        {/* Return product */}
                        <div className="modal fade feedBackModal" id={"returnModal_" + productdata.product_ID} role="dialog" data-backdrop="static" data-keyboard="false">
                          <div class="modal-dialog modal-dialog-centered ">
                            <div className="modal-content modalContent " style={{ 'background': '#fff' }}>
                              <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                                <div className="col-12">
                                  <div className="row mt-2">
                                    <div className="col-4 NoPadding text-left mt-2">
                                      <img src="/images/eCommerce/TrollyLogo.png" height ={40} />
                                    </div>
                                    <div className="col-7 text-center">
                                      {/* <h6 className="modal-title mt-2x modalheadingcont">Return Product</h6> */}
                                    </div>
                                    <div className="col-1 text-center">
                                      <button type="button" className="close pt-0 closeModal" data-dismiss="modal">&times;</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-body addressModalBody">
                                <div className="col-12 mt-3 ">
                                  <div className="row">
                                    <div className="col-3 NoPadding orderimgsize" style={{height:'100px'}}>
                                      <img src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.png"} alt="" />
                                    </div>
                                    <div className="col-5 mt-4 pt-3">
                                        <div className={"col-12 NoPadding text-left " +Style.reviewProName}>{productdata.productName}</div>
                                        <div className={"col-12 NoPadding text-left " +Style.reviewProPrice}>{this.props.currency} {productdata.discountedPrice.toFixed(2)}</div>
                                    </div>
                                    <div className={"col-3 my-auto NoPadding total text-center "+Style.reviewVendorName }> <b>{this.props.vendorWiseOrderData.vendorName}</b></div>
                                  </div>
                                </div>
                                <form className={"feedbackForm col-lg-10 offset-lg-1 pt-2 " + Style.returnForm}>
                                  <div className={" col-12 mb-2 text-left NoPadding " + Style.errorMsg} >{this.state.returnProductError}</div>
                                  <label className={"col-12 NoPadding text-left "+Style.feedbackLable}> Reasons For return <span className="errorMsg">  </span></label>
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
                                    <label className={"col-12 text-left "+Style.feedbackLable}>Comment <span className="errorMsg">  </span></label>
                                    <div className="col-12 ">
                                      <textarea rows="5" className={"col-12 returnTextBox "+Style.feedbackBox} onChange={this.handleChangeReturn.bind(this)} value={this.state.customerReturnComment} name="customerReturnComment"></textarea>
                                      <label className="error">{this.state.returnTextError}</label>
                                    </div>
                                  </div>
                                  <div className={"container-flex"}>
                                  <div className={"col-2 NoPadding pull-right " +Style.inputWrapper}>
                                      <input type="file" multiple id="files" className={ Style.hidden +" " +Style.fileInput} onChange={this.uploadImage.bind(this)} title="Choose Image" accept=".jpg,.jpeg,.png"/>
                                      <div className={" " +Style.uploadReviewImg}></div>
                                  </div>
                                  <div className="col-12 mt-4">
                                  {
                                      this.state.imgUrl ?
                                        <div className="col-lg-12 productImgCol">
                                          <div className={"col-2 NoPadding " + Style.prodImage}>
                                            <div className="col-12 NoPadding prodImageInner">
                                              <span className="prodImageCross" title="Delete Image" data-imageurl={this.state.imgUrl} onClick={this.deleteImage.bind(this)} >x</span>
                                            </div>
                                            <img src={this.state.imgUrl} className={" col-12 NoPadding img-responsive imp-thumbnail " + Style.reviewImg} style={{ height: '40px' }}></img>
                                          </div>
                                          {/* <div className="errorMsg">{this.state.errors.reviewImg}</div> */}
                                        </div>
                                        :
                                        null
                                    }
                                  </div>
                                </div>
                                  <div className={"col-12 NoPadding text-left "}>
                                    <div className={"col-12 NoPadding mt-2 mb-2 text-left" + Style.eCommTitle + " " + Style.paymentMethodTitle +" "+Style.feedbackLable}>Refund to : <span className="required"></span></div>
                                    <div className="form-check mt-2">
                                      <label className={"form-check-label "+Style.orderDetailRadioButtonLabel}>
                                        <input type="radio" className={"form-check-input webModelInput " +Style.returnRadioBtn} name="paymentRefundSource" type="radio" id="paymentRefundSource" value="source"
                                          checked={this.state.paymentRefundSource === "source"}
                                          onClick={this.handleRefundPayment.bind(this)}
                                        />The Source( valid for card payment only)
                                      </label>
                                    </div>
                                    <div className="form-check mt-2" >
                                      <label className={"form-check-label "+Style.orderDetailRadioButtonLabel} for="radio1">
                                        <input type="radio" className={"form-check-input webModelInput "+Style.returnRadioBtn} name="paymentRefundSource" type="radio" id="paymentRefundSource" value="credit"
                                          checked={this.state.paymentRefundSource === "credit"}
                                          onChange={this.handleRefundPayment.bind(this)}
                                        />Add To Credit Points
                                      </label>
                                    </div>
                                    <div className="errorMsg col-11 ml-2">{this.state.refundToError}</div>
                                  </div>
                                  {/* <div className={"col-12 NoPadding text-left "}>
                                    <input type="checkbox" name="termsNconditions" isChecked={this.state.isChecked} title="I agree to return policy" onClick={this.checkboxClick.bind(this)} className="acceptTerms col-1" />
                                    <div className="col-11 col-xl-11 col-md-11 termsWrapper">
                                        <span className="termsNconditionsmodal globalTermsAndCondition" data-toggle="modal" data-target="#termsNconditionsmodal">I agree to Return Policy</span>
                                    </div>
                                  </div> */}
                                </form>
                              </div>
                              <div className={"modal-footer "+Style.reviewModalFooter}>
                                <div className="col-6 col-sm-6 col-lg-4 col-xl-4 mx-auto ">
                                  {!productdata.status ?
                                    <button className={"btn btn-primary pull-right col-12 "+Style.feedbackBtn}
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
                        </div>
                      
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>

      </div>      
    );
  }
}

export default ProductsView;