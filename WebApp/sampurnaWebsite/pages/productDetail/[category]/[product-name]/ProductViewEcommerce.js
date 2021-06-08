import React, { Component } from 'react';
import jQuery                 from 'jquery';
import $ from 'jquery';
import { bindActionCreators } from 'redux';
import { getCartData,recentCartData } from '../../../../redux/actions/index';
import axios from 'axios';
import { connect } from 'react-redux';
import Message from '../../../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js';
import ReactImageZoom from 'react-image-zoom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ProductViewEcommerceDetailsReviewFAQ from "./ProductViewEcommerceDetailsReviewFAQ.js";
import {ntc} from '../../../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';
import { withRouter } from 'next/router'
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const responsive = {
	desktop: {
	  breakpoint: { max: 3000, min: 1024 },
	  items: 5,
	  slidesToSlide: 1 // optional, default to 1.
	},
	tablet: {
	  breakpoint: { max: 1024, min: 464 },
	  items: 5,
	  slidesToSlide: 1 // optional, default to 1.
	},
	mobile: {
	  breakpoint: { max: 464, min: 0 },
	  items: 2,
	  slidesToSlide: 1 // optional, default to 1.
	}
  };
  
  
class ProductViewEcommerce extends Component {
	constructor(props) {
		super(props);
		this.state = {		
			"productData": [],
			"subImgArray": [],
			"totalQuanity": 1,
			"quanityLimit": 5,
			"reviewData" : [],
			"imgsrc": "",
			"wishIconClass" : "viewWishList",
			"wishTooltip"   : "Add to wishlist",
			"productData"   : 	{
									"availableQuantity" : 1
								},
			"productID"     : '',
			"userid"        : ""

		};
		this.changeImage = this.changeImage.bind(this);
	}

	static getInitialProps({ pathname }){
		return { pathname }
	}	  

	async componentDidMount(){
		var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
            if(userDetails.user_id){
				this.setState({
					user_ID :  userDetails.user_id,
				},()=>{
					this.validation();
					this.getWishData();
					this.reviewAverage();
					this.getMyReview();
				})
               
            }
        }
		if(sampurnaWebsiteDetails && sampurnaWebsiteDetails.preferences){
			this.setState({
				websiteModel : sampurnaWebsiteDetails.preferences.websiteModel,
				showLoginAs  : sampurnaWebsiteDetails.preferences.showLoginAs
			})
		}
		
		var pageUrl = window.location.pathname;
		let a = pageUrl ? pageUrl.split('/') : "";
		const urlParam =a[4];
		this.setState({
			productID : urlParam
		},()=>{
			// console.log(this.state.productID)
			axios.get("/api/products/get/one/" + this.state.productID)
		.then((response) => {
			this.setState({
				productData: response.data,
				selectedImage: response.data.productImage[0],
				quanityLimit: response.data.availableQuantity,
				selectedColor : response.data.color,
				selectedSize : response.data.size,
				websiteModel : websiteModel
			},()=>{
				// window.fbq('track', 'CustomizeProduct',this.state.productData.productName,this.state.productData.originalPrice);
				// console.log('selectedColor',this.state.selectedColor);
				this.getProductData();
				this.getProductSizeData();
			})
			this.forceUpdate();
		})
		.catch((error) => {
			console.log('error', error);
		})
		// this.validation();
		// this.getWishData();
		// this.reviewAverage();
		// this.getMyReview();
		})   
		// this.setState({showLoginAs: showLoginAs,websiteModel:websiteModel}); 
		await this.props.fetchCartData(); 
		
		
	}
	validation(){
			let fields = this.state.fields;
			let errors = {};
			let formIsValid = true;
			return formIsValid;
			// if (!fields["firstname"]) {
			//   formIsValid = false;
			//   errors["firstname"] = "This field is required.";
			// }
			// if (typeof fields["firstname"] !== "undefined") {
			// 	console.log("inside");
			//   //regular expression for email validation
			//   var pattern = new RegExp(/^[A-Za-z]*$/)
			//   if (!pattern.test(fields["firstname"])) {
			// 	formIsValid = false;
			// 	errors["firstname"] = "Name should only contain letters.";
			//   }else{
			// 	errors["firstname"] = "";
	
			//   }
			// }
	
		
		// jQuery.validator.setDefaults({
		// debug: true,
		// success: "valid"
		// });
		// $("#productView").validate({
		// rules: {
		// 	color: {
		// 		required: true,
		// 	},
		// 	size: {
		// 		required: true,
		// 	},
		// },
		// 	errorPlacement: function(error, element) {
		// 		if (element.attr("name") === "color"){
		// 			error.insertAfter("#color");
		// 		}
		// 		if (element.attr("name") === "size"){
		// 			error.insertAfter("#size");
		// 		}
		// 	}
		// });
	}
	getProductData(){
		var availableSize = [];
		var availableSizes = [];
		axios.get("/api/products/get/productcode/" + this.state.productData.productCode)
		.then((response) => {
			let mymap = new Map(); 
  
			var unique = response.data.filter(el => { 
				const val = mymap.get(el.color); 
				if(val) { 
					if(el._id < val) { 
						mymap.delete(el.color); 
						mymap.set(el.color, el._id); 
						return true; 
					} else { 
						return false; 
					} 
				} 
				mymap.set(el.color, el._id); 
				return true; 
			}); 
			// console.log('unique', unique);
			if(unique[0].size){
				availableSize.push(unique[0].size*1);
				availableSize.push(unique[0].size*2);
				availableSize.push(unique[0].size*4);
				unique[0].availableSizes = availableSize;
				   
			  }

			// console.log('unique', unique);
			this.setState({
				relatedProductArray : unique,
				productSizeArray 	: unique,
			})
			// console.log("productSizeArray===",this.state.productSizeArray);
		})
		.catch((error) => {
			console.log('error', error);
		})
	}
	getProductSizeData(){
		axios.get("/api/products/get/productcode/" + this.state.productData.productCode)
		.then((response) => {
			var x = response.data.filter((a)=>{
				return (a.color).toUpperCase() === (this.state.selectedColor).toUpperCase()
			})

			// console.log('pc', response.data);
			this.setState({
				productSizeArray : x
			})
		})
		.catch((error) => {
			console.log('error', error);
		})
	}
	getWishData(){
		// console.log("getWishData userid====",this.state.userid +" " +this.state.productID);
		axios.get("/api/wishlist/get/one/productwish/"+this.state.user_ID+"/" + this.state.productID)
		.then((response) => {
			// console.log("response====",response.data);
			if(response.data){
			this.setState({
				wishIconClass : response.data ? "viewWishListActive" : "viewWishList",
				wishTooltip   : response.data ? "Remove from wishlist" : "Add to wishlist",
			},()=>{
				// console.log("wishIconClass===",this.state.wishIconClass);
			})
			}
		})
		.catch((error) => {
			console.log('error', error);
		})
	}
	changeImage = (event) => {
		this.setState({
			selectedImage: event.target.src
		}, () => {

		});
	}
	
	addtocart(event) {
		event.preventDefault();	
		// console.log("this.props.recentCartData",this.props)	
		if(this.state.user_ID){
			if(this.props.recentCartData[0] && this.props.recentCartData[0].cartItems.length>0){
				var cartLength = this.props.recentCartData[0].cartItems.length;
				var productId = event.target.id;
				for(let i=0;i<cartLength;i++){
					if(this.props.recentCartData[0].cartItems[i].product_ID === productId){
					  this.setState({
						messageData: {
						  "type": "outpage",
						  "icon": "fa fa-exclamation-circle",
						  "message": "This product is already in your cart",       
						  "class": "success",
						  "autoDismiss": true
						}
					  })
					  setTimeout(() => {
						this.setState({
						  messageData: {},
						})
					  }, 3000);
					  break;
					}//end if
				}//end for loop
			}
			if(this.validation()){
				var id = event.target.id;
				var availableQuantity = event.target.getAttribute('availableQuantity');
				var recentCartData = this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
				var productCartData = recentCartData.filter((a)=>a.product_ID === id);
				var quantityAdded = productCartData.length>0 ? productCartData[0].quantity : 0;
				
				const formValues = {
					"user_ID": this.state.user_ID,
					"product_ID": event.target.id,
					"quantity": this.state.totalQuanity,
				}
				if(quantityAdded >= availableQuantity){
					this.setState({
						messageData : {
						"type" : "outpage",
						"icon" : "fa fa-check-circle",
						"message" : "Last "+availableQuantity+" items taken by you",
						"class": "success",
						"autoDismiss" : true
						}
					})
					setTimeout(() => {
						this.setState({
							messageData   : {},
						})
					}, 3000); 
				}else{
					axios.post('/api/carts/post', formValues)
					.then((response) => {
						this.props.fetchCartData();
						// window.fbq('track', 'AddToCart');
						this.setState({
						messageData : {
							"type" : "outpage",
							"icon" : "fa fa-check-circle",
							"message" : "&nbsp; "+response.data.message,
							"class": "success",
							"autoDismiss" : true
						}
						})
						setTimeout(() => {
						this.setState({
							messageData   : {},
						})
					}, 3000);
						// this.props.changeCartCount(response.data.cartCount);
						
					})
					.catch((error) => {
						console.log('error', error);
					})
				}
			}
		}else{
		//   var previousUrl = window.location.href;
		// 	localStorage.setItem("previousUrl",previousUrl);
			if(this.state.websiteModel && this.state.showLoginAs==='modal'){
				$('#loginFormModal').show();
				}else{
				this.setState({
				  messageData: {
					"type": "outpage",
					"icon": "fa fa-exclamation-circle",
					// "message": "Need To Sign In, Please <button onclick='alert('abc')'>Sign In</button> First.",
					"message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
					"class": "warning",
					"autoDismiss": true
				  }
				})
				setTimeout(() => {
				  this.setState({
					messageData: {},
				  })
				}, 3000);
			}
		}
	}
	
	addtowishlist(event) {
		event.preventDefault();
		if (this.state.user_ID) {
			var id = event.target.id;
			axios.get('/api/products/get/one/' + id)
				.then((response) => {
					const formValues =
					{
						"user_ID": this.state.user_ID,
						"product_ID": response.data._id,
					}

					axios.post('/api/wishlist/post', formValues)
						.then((response) => {
							this.getWishData();
							// window.fbq('track', 'AddToWishlist');
							this.setState({
								messageData: {
									"type": "outpage",
									"icon": "fa fa-check-circle",
									"message": "&nbsp; " + response.data.message,
									"class": "success",
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
							console.log('error', error);
						})
				})
				.catch((error) => {
					console.log('error', error);
				})
		} else {
			var previousUrl = window.location.href;
      		localStorage.setItem("previousUrl",previousUrl);
			  if(this.state.websiteModel && this.state.showLoginAs === 'modal'){
				$('#loginFormModal').show();
				}else{
				this.setState({
				  messageData: {
					"type": "outpage",
					"icon": "fa fa-exclamation-circle",
					"message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
					// "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
					"class": "warning",
					"autoDismiss": true
				  }
				})
				setTimeout(() => {
				  this.setState({
					messageData: {},
				  })
				}, 3000);
			}
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
	addQuantity() {
		var totalQuanity = this.state.totalQuanity
		totalQuanity++;
		$('#addQuantity').addClass('auto');
		$('#addQuantity').css('background-color', '#fff');
		$('#decreaseQuantity').addClass('auto');
		$('#decreaseQuantity').css('background-color', '#fff');
		var recentCartData = this.props.recentCartData && this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
		var productCartData = recentCartData.filter((a)=>a.product_ID === this.props.productID);
		var quantityAdded = productCartData.length>0 ? productCartData[0].quantity : 0;
		if (Number(totalQuanity) > Number(this.state.quanityLimit) || quantityAdded >= Number(this.state.quanityLimit)) {
			$('#addQuantity').css('background-color', '#ccc');
			$('#addQuantity').addClass('no-drop');
			this.setState({
				messageData: {
					"type": "inpage",
					"icon": "fa fa-check-circle",
					"message": "Last "+this.state.quanityLimit+" items taken by you",
					"class": "warning",
					"autoDismiss": true
				}
			})
			setTimeout(() => {
				this.setState({
					messageData: {},
				})
			}, 5000);
		} else {
			this.setState({ totalQuanity: totalQuanity });
			document.getElementById('totalQuanity').innerHTML = totalQuanity;
		}
	}
	decreaseQuantity() {
		var totalQuanity = this.state.totalQuanity
		totalQuanity--;
		$('#addQuantity').addClass('auto');
		$('#addQuantity').css('background-color', '#fff');
		$('#decreaseQuantity').addClass('auto');
		$('#decreaseQuantity').css('background-color', '#fff');
		if (Number(totalQuanity) === 1 || Number(totalQuanity) > 1) {
			this.setState({ totalQuanity: totalQuanity }, () => {
				document.getElementById('totalQuanity').innerHTML = this.state.totalQuanity;
			});
		} else {
			$('#decreaseQuantity').addClass('no-drop');
			$('#decreaseQuantity').css('background-color', '#ccc');
		}
	}
	getMyReview() {
		// console.log("getMyReview")
		axios.get("/api/customerReview/get/list/" + this.state.productID)
		.then((response) => {
		  this.setState({
			reviewData: response.data,
		  })
		})
		.catch((error) => {
		  console.log('error', error);
		})
	}
	reviewAverage(){
		axios.get("/api/customerReview/get/avg/" +this.state.productID)
		.then((response) => {
		//   console.log('e', response.data);
		if(response.data[0]){
		  this.setState({
			  reviewAverage : response.data[0].reviewAvg
		  })
		}
		})
		.catch((error) => { 
		  console.log('error', error);
		})
	}
	setNewProduct(event){
		var id = event.target.id;
		this.setState({
			selectedColor : event.target.value,
			selectedSize : ''
		})
		axios.get("/api/products/get/one/" + id)
		.then((response) => {
			
			this.setState({
				productData: response.data,
				selectedImage: response.data.productImage[0],
				quanityLimit: response.data.availableQuantity
			},()=>{
				this.getProductSizeData();
			})
			this.forceUpdate();
		})
		.catch((error) => {
			console.log('error', error);
		})
	}
	setNewSizeProduct(id){
		// var id = event.target.id;
		// this.setState({
		// 	selectedSize : event.target.value
		// })
		// console.log("id in setnewsize===>",id)
		axios.get("/api/products/get/one/" + id)
		.then((response) => {
		// console.log("response.data in setnewsize===>",response.data)
			
			this.setState({
				productData: response.data,
				selectedImage: response.data.productImage[0],
				quanityLimit: response.data.availableQuantity
			},()=>{
				this.getProductSizeData();
			})
			this.forceUpdate();
		})
		.catch((error) => {
			console.log('error', error);
		})
	}
	onClickImg(data){
		this.setState({
			selectedImage : data
		})
		
	}
	render() {
		// console.log("product data  =====",this.state);eCommerce
		const props = { width: 400, height: 350, zoomWidth: 750, offset: { vertical: 0, horizontal: 30 }, zoomLensStyle: 'cursor: zoom-in;', zoomStyle: 'z-index:1000;background-color:#fff; height:500px;width:750px;box-shadow: 0 4px 20px 2px rgba(0,0,0,.2);border-radius: 8px;', img: this.state.selectedImage ? this.state.selectedImage : '/images/eCommerce/notavailable.jpg' };
		return (
			<div className="col-12 mt20 mb20 boxBorder mobileViewNoPadding">
				<div className="col-12 boxBorderInner mobileViewNoPadding mt50 ">
					<div className="row">
						<div className=" col-12 col-sm-5 stickyDiv">
							<div className="col-12 imageContainer imgCont">
								<div className="prod-detail-slider prod-detail-filpCommon col-12 ">
									<div id="react-app" className="col-12 hidden-sm hidden-xs item img-responsiveProduct">
										<ReactImageZoom {...props} />
									</div> 
									<div id="" className="col-12 NoPadding">
									<Carousel
										className="productview"
										swipeable={true}
										draggable={true}
										showDots={false}
										responsive={responsive}
										ssr={true} // means to render carousel on server-side.
										infinite={true}
										autoPlay={false}
										autoPlaySpeed={3000}
										keyBoardControl={true}
										customTransition="all .20"
										transitionDuration={500}
										// containerClass="carousel-container"
										removeArrowOnDeviceType={["Desktop","tablet", "mobile"]}
										deviceType={this.props.deviceType}
										//dotListClass="custom-dot-list-style"
										itemClass="carousel-item-padding-10-px">
										{	
											Array.isArray(this.state.productData.productImage) && this.state.productData.productImage.map((data, index) => {
												// console.log("map 581 =========>",data)
												return(
													<img src={data} className="img-responsive prodImgMobileView" onClick={this.onClickImg.bind(this,data)} key={index}></img>											
												);
											})
										}
									</Carousel>
									</div>
								</div>
							</div>
							{/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  mt50 hidden-lg hidden-md hidden-sm">
							{
								this.state.productData && this.state.productData.productImage && this.state.productData.productImage.length > 0 ?
									this.state.productData.productImage.map((data, index) => {
										
										// if (!_.isEmpty(data)) {
										return (
											<div key={index} className="item col-lg-12 col-md-12 col-sm-12 col-xs-12 "  >
												<div className="row">
													{
														data && <img data-index={index} id="change-image" onClick={this.changeImage} src={data} className="img-responsive" alt="default" />
													}
												</div>
											</div>
										);
										// }
									})
									:
									null
							}
						</div> */}
							<div className="col-12 imageContainer mt50 hidden-sm hidden-xs">
								<div className="">
									{/* <Carousel
										className="owl-theme productview"
										swipeable={false}
										draggable={false}
										showDots={false}
										responsive={responsive}
										ssr={true} // means to render carousel on server-side.
										infinite={true}
										autoPlay={this.props.deviceType !== "mobile" ? true : false}
										autoPlaySpeed={3000}
										keyBoardControl={true}
										customTransition="all .20"
										transitionDuration={500}
										// containerClass="carousel-container"
										removeArrowOnDeviceType={["tablet", "mobile"]}
										deviceType={this.props.deviceType}
										//dotListClass="custom-dot-list-style"
										itemClass="carousel-item-padding-10-px">
										{
											this.state.productData && this.state.productData.productImage && this.state.productData.productImage.length > 0 ?
												this.state.productData.productImage.map((data, index) => {
													
													// if (!_.isEmpty(data)) {
													return (
														<div key={index} className="item col-lg-12 col-md-12 col-sm-12 col-xs-12 miniImagesInNew"  >
															<div className="row">
																{
																	data && <img data-index={index} id="change-image" onClick={this.changeImage} src={data} className="img-responsive" alt="default" />
																}
															</div>
														</div>
													);
													// }
												})
												:
												null
										}
									</Carousel> */}
								</div>
							</div>
						</div>

						<div className="col-12 col-sm-6 ">
						<Message messageData={this.state.messageData} />
						<div className="col-12">
							<div className="row">

							{this.state.productData.brandNameRlang?
                                <div className={"col-12 globalProduct_brand RegionalFont NoPadding productDetailsMB "} title={this.state.productData.brandNameRlang}>{this.state.productData.brandNameRlang}</div>
                                :
                                <div className={"col-12 globalProduct_brand NoPadding productDetailsMB"} title={this.state.productData.brand}>{this.state.productData.brand}</div>
                              }
                              {this.state.productData.productNameRlang?
                                <div className={"col-12 globalProductItemName NoPadding productDetailsMB" } title={this.state.productData.productNameRlang}>
                                    <span className={" RegionalFont ellipsis globalProdName productNameClassNew"}>{this.state.productData.productNameRlang} </span>&nbsp;    
								    <span className=""> <span className="productCode"> ( Product Code: {this.state.productData.productCode+'-'+this.state.productData.itemCode} )</span> </span>
								    <div className="col-12 productDetailsMB">									
										<div className="undrln row"> </div>
								    </div>                                    
                                </div>
                                :
                                <div className={"col-12 globalProductItemName NoPadding NoPadding" } title={this.state.productData.productName}>
									<span className={ "ellipsis globalProdName"}>{this.state.productData.productName} </span>&nbsp;
									<div ><span className="productNameClassNew"> {this.state.productData.productName}</span> <span className="productCode"> (Product Code: {this.state.productData.productCode+'-'+this.state.productData.itemCode})</span> ( <span className="marathiName">{this.state.productData.shortDescription}</span> )</div>
									<div className="col-12">									
										<div className="undrln row"> </div>
									</div>
								</div>
                              }


								{/* <div id="brand"><label className="productNameClassNewBrand"> {this.state.productData.brand} </label></div>
								<div ><span className="productNameClassNew"> {this.state.productData.productName}</span> <span className="productCode"> (Product Code: {this.state.productData.productCode+'-'+this.state.productData.itemCode})</span> ( <span className="marathiName">{this.state.productData.shortDescription}</span> )</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="row">
										 <p className="">{this.state.reviewData.length>0?<a href="#gotoreview" className="anchorclr">Be the first to review this product</a>: null} </p>
										<span className="priceEcommerce" ><i className={"fa fa-"+this.state.productData.currency}></i>&nbsp;{this.state.productData.discountedPrice}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										{this.state.productData.offered === true ? <span className="originalPrice"><i className={"fa fa-"+this.state.productData.currency}>&nbsp;{this.state.productData.originalPrice}</i></span> : null}
									</div>
									<div className="undrln row"> </div>
								</div> */}

								
								<div className="col-12 productDetailsMT">
									<div className="row">
										<div className="col-12 NOpadding mb15">
											{this.state.websiteModel ==="FranchiseModel"?
												<div>
													{/* {this.state.productData.unit === "Box" || this.state.productData.unit === "Wrap" || this.state.productData.unit === "Pack" || this.state.productData.unit==="pounch" ?
														<span className="priceEcommerceNew" ><i className="fa fa-inr"></i>&nbsp;{this.state.productData.discountedPrice}&nbsp;-&nbsp;{this.state.productData.unit} of {this.state.productData.size}&nbsp; </span>												
													:
													<span className="priceEcommerceNew" ><i className="fa fa-inr"></i>&nbsp;{this.state.productData.discountedPrice}&nbsp;-&nbsp;{this.state.productData.size}&nbsp;{this.state.productData.unit} </span>												
													}													
													{this.state.productData.unit === "Box" || this.state.productData.unit === "Wrap" || this.state.productData.unit === "Pack" || this.state.productData.unit==="pounch" ?
														this.state.productData.discountPercent ? <span className="originalPrice"><i className="fa fa-inr"> </i>&nbsp; {this.state.productData.originalPrice} - {this.state.productData.unit} of {this.state.productData.size}&nbsp;</span> : null
													:
													this.state.productData.discountPercent ? <span className="originalPrice"><i className="fa fa-inr"> </i>&nbsp; {this.state.productData.originalPrice} - {this.state.productData.size}&nbsp;{this.state.productData.unit}</span> : null
													} */}
													{ this.state.productData.discountPercent ? 
														<span className="priceEcommerceNew"><span className="oldprice"><i className="fa fa-inr "></i>&nbsp;{this.state.productData.originalPrice} </span>&nbsp; <i className="fa fa-inr "></i> {this.state.productData.discountedPrice} / {this.state.productData.size}&nbsp;<span className="ProSize">{this.state.productData.unit}</span></span>         
														:
														<span className="priceEcommerceNew"><i className="fa fa-inr"></i>&nbsp;{this.state.productData.originalPrice} / {this.state.productData.size}&nbsp;<span className="ProSize">{this.state.productData.unit}</span></span>   
													}                         
												</div>
											: 
												<div>
													{ this.state.productData.discountPercent ? 
														<span className="priceEcommerceNew"><span className="oldprice"><i className="fa fa-inr "></i>&nbsp;{this.state.productData.originalPrice} </span>&nbsp; <i className="fa fa-inr "></i> {this.state.productData.discountedPrice} /{this.state.productData.size}&nbsp;<span className="ProSize">{this.state.productData.unit}</span></span>         
														:
														<span className="priceEcommerceNew"><i className="fa fa-inr"></i>&nbsp;{this.state.productData.originalPrice} / {this.state.productData.size}&nbsp;<span className="ProSize">{this.state.productData.unit}</span></span>   
													} 
												</div>
												
											}
											

											
										</div>
										<div className="col-12 NOpadding">
											{this.state.reviewAverage ?<div> <div className="col-lg-1 col-md-1 product-reviews-summary ratebox">{this.state.reviewAverage} &nbsp;<i className="fa fa-star"></i></div> &nbsp; {this.state.reviewData.length} ratings and reviews</div> : null}
										</div>
									</div>

									<div className="row listspace">
										{this.state.productData.featureList ?
											<span className="col-12 paddingleftzero paddingrightzero ttl" >
												Features
											</span>
											:
											null
										}
										<div className="col-12 ttllist" dangerouslySetInnerHTML={{__html: this.state.productData.featureList}}></div>
												
									</div>
								</div>
								<div className="col-12 adCart mobileViewNoPadding">
									<div className="row spc">
										<form id="productView" className="col-12 NOpadding">
											<div className="row">
										{
                                            this.state.productData.availableQuantity > 0 ?
												<div className="col-9 NOpadding">
													<div className="row">
														<div className="col-2 col-sm-3 qtyInput globaleCommLargeBtn" id="totalQuanity">
															1
														</div>
														<div className="col-2">
															<i className="fa fa-plus qtyIncrease globaleCommLargeBtn" id="addQuantity" onClick={this.addQuantity.bind(this)}></i><br />
															<i className="fa fa-minus qtyIncrease globaleCommLargeBtn" id="decreaseQuantity" onClick={this.decreaseQuantity.bind(this)}></i>
														</div>
														<div className="col-7 NOpadding mobileViewPaddingLeft">
															{this.state.userid?
															<div id={this.state.productData._id} availablequantity={this.state.productData.availableQuantity} onClick={this.addtocart.bind(this)} className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 viewAddtoCart globaleCommLargeBtn"  > &nbsp; Add To Cart</div>
															:
															<div id={this.state.productData._id} availablequantity={this.state.productData.availableQuantity} onClick={this.addtocart.bind(this)} className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 viewAddtoCart globaleCommLargeBtn" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" > &nbsp; Add To Cart</div>
															}	
														</div>
													</div>
												</div>
										:
											<div className=" co-12 col-sm-9 NOpadding pull-right">
												<span className="soldOut">Sold Out</span>
												<p className="soldOutP">This item is currently out of stock</p>
											</div>
										}
										
										<div className="col-2 col-sm-3  mobileViewNoPadding">
											{this.state.userid?
											<div id={this.state.productData._id} title={this.state.wishTooltip} onClick={this.addtowishlist.bind(this)} className={" col-lg-12 col-md-12 col-sm-12 col-xs-12 globaleCommLargeBtn "+this.state.wishIconClass}>
													{this.state.wishIconClass ==="viewWishListActive"?
														<i className="fas fa-heart heartIcon"></i>
													:
														<i className="far fa-heart heartIcon"></i>
													}
											</div>
											:
											<div id={this.state.productData._id} title={this.state.wishTooltip} onClick={this.addtowishlist.bind(this)} className={" col-lg-12 col-md-12 col-sm-12 col-xs-12 globaleCommLargeBtn "+this.state.wishIconClass} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal">
													{this.state.wishIconClass ==="viewWishListActive"?
														<i className="fas fa-heart heartIcon"></i>
													:
														<i className="far fa-heart heartIcon"></i>
													}
											</div>												
											}
										</div>
										{this.state.productData.availableQuantity > 0 && this.state.productData.color ?
										<div className="col-12 NOpadding">
											{this.state.relatedProductArray && this.state.relatedProductArray.length>0?
												this.state.relatedProductArray.map((a,i)=>{
													if(a.color){
														var color  = ntc.name(a.color);
															return(
																<div className="col-12 " key={i}>
																<div className="row">
																 { i===0?	
																	<div>															
																		<label className="col-12 NOpadding mt15 detailtitle">Color</label>
																		<div className="col-sm-1 col-2 NOpadding">
																			<label title={color[1]} className="colorBox">
																				<input title="Please select color first." checked={this.state.selectedColor === a.color ? true : false} value={a.color} name="color" type="radio" id={a._id} onChange={this.setNewProduct.bind(this)}/>
																				<span style={{'backgroundColor' : a.color}} className="color col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"></span>
																			</label>
																		</div>
																	</div>
																	
																	:
																	<div className="col-sm-1 col-2 NOpadding">
																		<label title={color[1]} className="colorBox">
																			<input title="Please select color first." checked={this.state.selectedColor === a.color ? true : false} value={a.color} name="color" type="radio" id={a._id} onChange={this.setNewProduct.bind(this)}/>
																			<span style={{'backgroundColor' : a.color}} className="color col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"></span>
																		</label>
																	</div>
																}
																</div>
																</div>
															);														
													}													
												})
											:
												null
											}
											<div className="col-12 NOpadding colorError">
												<label id="color"></label>
											</div>
										</div>
										:
											null
										}
											{/* <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mt15 detailtitle">Select Size </label> */}
											{this.state.productData.availableQuantity > 0 ?
												<div className=" col-12 NOpadding">
													<div className="col-12 row">
													
													{Array.isArray(this.state.productSizeArray) && this.state.productSizeArray.length>0?
														this.state.productSizeArray.map((a,i)=>{
															// console.log("a in product==>",a)
															if(a.size){																	
																	return(	
																	<div key={i}>												
																		{/* <input title="Please select size first." checked={this.state.selectedSize === a.size ? true : false} value={a.size} name="size" type="radio" id={a._id} onChange={this.setNewSizeProduct.bind(this)}/> */}
																		{/* <span title={a.size} checked={this.state.selectedSize === a.size ? true : false} value={a.size} name="size" type="radio" id={a._id} onClick={this.setNewSizeProduct.bind(this,a._id)} className="checkmark mg15 row col-lg-4 col-md-12 col-sm-12 col-xs-12">{a.size}&nbsp;{a.unit}</span> */}
																	{/* {	
																		Array.isArray(a.availableSizes).length>0 ?
																			a.availableSizes.map((size,index)=>{
																			console.log("size in a product==>",size)
																			return(
																				<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 NOpaddingLeft">
																					<label className="size col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																						<input title="Please select size first." checked={this.state.selectedSize === a.size ? true : false} value={a.size} name="size" type="radio" id={a._id} onChange={this.setNewSizeProduct.bind(this)}/>
																						<span title={a.size} className="checkmark col-lg-12 col-md-12 col-sm-12 col-xs-12">{a.availableSize}&nbsp;{a.unit}</span>
																					</label>
																				</div>
																			);
																			})
																		:null									
																			
																	} */}
																	</div>
																	);																	
															}
														})
														:
														null
													} 
													</div>
													{/* <div className="col-lg-4  col-md-12 col-sm-12 col-xs-12 NOpadding colorError">
														<label id="size"></label>
													</div> */}
												</div>
												:
												null
											}										
										</div>										
										</form>
									</div>
								</div>

							</div>
							<div id="loginFormModal" className="modal in">
							<div className="modal-dialog">                                        
								<div className="modal-content loginModalContent">                            
									<div className="modal-body">   
									<button type="button" className="close"  data-dismiss="modal" aria-hidden="true">&times;</button>                                                            
										{this.props.formToShow === "login" ?
											<div className="col-lg-12 col-md-12 loginForm">
												<Login />
											</div>  
										: null
										}  
										{this.props.formToShow === "signUp" ?
											<div className="col-lg-12 col-md-12 signupForm">
												<SignUp />
											</div>  
										: null
										} 
										{this.props.formToShow === "forgotPassword" ?
											<div className="col-lg-12 col-md-12 loginForm">
												<ForgotPassword />
											</div>  
										: null
										}                                                                
									</div>
								</div>
							</div>
						</div>
						</div>
						{
							this.state.productData.productDetails ? 
							<div id="gotoreview" className="col-12 NOpadding">
								<div className="col-12 NOpadding topspace detailtitle globaltext">DESCRIPTION</div>
								<div className="spcbx topspace15"></div>
								<div className="col-12 NoPadding ttllist" dangerouslySetInnerHTML={{__html: this.state.productData.productDetails}}></div>
							</div>
							:
							null
						}
						<ProductViewEcommerceDetailsReviewFAQ productID = { this.state.productID } />
					</div>
					</div>
				</div>
				
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	// console.log("Product view ecommerce mapStateToProps",state)
	return {
	  recentCartData :  state.data.recentCartData
	}
  }
  const mapDispachToProps = (dispatch) => {
	return  bindActionCreators({ fetchCartData: getCartData }, dispatch)
  }
  export default connect(mapStateToProps, mapDispachToProps)(ProductViewEcommerce);