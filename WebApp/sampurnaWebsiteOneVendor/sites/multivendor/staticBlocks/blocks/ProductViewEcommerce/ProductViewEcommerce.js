import React, { Component } from 'react';
import jQuery                 from 'jquery';
import $ from 'jquery';
import { bindActionCreators } from 'redux';
import { getCartData } from '../../actions/index';
import axios from 'axios';
import "../../../sites/currentSite/blocks/ProductViewEcommerce.css";
// import _ from 'underscore';
import { connect } from 'react-redux';
import Message from '../Message/Message.js';
import ReactImageZoom from 'react-image-zoom';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Loadable from 'react-loadable';
import ProductViewEcommerceDetailsReviewFAQ from "../../blocks/ProductViewEcommerceDetailsReviewFAQ/ProductViewEcommerceDetailsReviewFAQ.js";
import {ntc} from '../../ntc/ntc.js';
const OwlCarousel = Loadable({
	loader: () => import('react-owl-carousel'),
	loading() {
		return <div className="col-sm-12 col-xs-12 col-lg-2 col-lg-offset-5 col-md-12 loadingImg"><img src="../images/loadersglms.gif" className="img-responsive" alt="loading" /></div>
	}
});
const user_ID = localStorage.getItem("user_ID");
class ProductViewEcommerce extends Component {
	constructor(props) {
		super(props);
		this.state = {
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1000: {
					items: 5
				}
			},
			"productData": [],
			"subImgArray": [],
			"totalQuanity": 1,
			"quanityLimit": 5,
			"reviewData" : [],
			"imgsrc": "",
			"wishIconClass" : "viewWishList",
			"wishTooltip"   : "Add to wishlist",
			"productData"   : {
				"availableQuantity" : 1
			}
		};
		this.changeImage = this.changeImage.bind(this);
	}

	async componentDidMount(){
		await this.props.fetchCartData(); 
		axios.get("/api/products/get/one/" + this.props.productID)
		.then((response) => {
			this.setState({
				productData: response.data,
				selectedImage: response.data.productImage[0],
				quanityLimit: response.data.availableQuantity,
				selectedColor : response.data.color,
				selectedSize : response.data.size
			},()=>{
				//console.log('selectedColor',this.state.selectedColor);
				this.getProductData();
				this.getProductSizeData();
			})
			this.forceUpdate();
		})
		.catch((error) => {
			console.log('error', error);
		})
		this.validation();
		this.getWishData();
		this.reviewAverage();
		this.getMyReview();
	}
	validation(){
		
		jQuery.validator.setDefaults({
		debug: true,
		success: "valid"
		});
		$("#productView").validate({
		rules: {
			color: {
				required: true,
			},
			size: {
				required: true,
			},
		},
			errorPlacement: function(error, element) {
				if (element.attr("name") === "color"){
					error.insertAfter("#color");
				}
				if (element.attr("name") === "size"){
					error.insertAfter("#size");
				}
			}
		});
	}
	getProductData(){
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
			
			console.log('unique', unique);
			this.setState({
				relatedProductArray : unique,
				productSizeArray 	: unique,
			})
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

			console.log('pc', response.data);
			this.setState({
				productSizeArray : x
			})
		})
		.catch((error) => {
			console.log('error', error);
		})
	}
	getWishData(){
		const userid = localStorage.getItem('user_ID');
		
		axios.get("/api/wishlist/get/one/productwish/"+userid+"/" + this.props.productID)
		.then((response) => {
			
			this.setState({
				wishIconClass : response.data ? "viewWishListActive" : "viewWishList",
				wishTooltip   : response.data ? "Remove from wishlist" : "Add to wishlist",
			})
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
		
		if(user_ID){
			if($("#productView").valid()){
				var id = event.target.id;
				const userid = localStorage.getItem('user_ID');
				var availableQuantity = event.target.getAttribute('availableQuantity');
				var recentCartData = this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
				var productCartData = recentCartData.filter((a)=>a.product_ID === id);
				var quantityAdded = productCartData.length>0 ? productCartData[0].quantity : 0;
				
				const formValues = {
					"user_ID": userid,
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
		  this.setState({
			messageData : {
			  "type" : "outpage",
			  "icon" : "fa fa-exclamation-circle",
			  "message" : "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
			  "class": "danger",
			  "autoDismiss" : true
			}
		  })
		  setTimeout(() => {
			this.setState({
				messageData   : {},
			})
		  }, 3000);
		}
	}
	addtowishlist(event) {
		event.preventDefault();
		var user_ID = localStorage.getItem('user_ID');
		if (user_ID) {
			var id = event.target.id;
			axios.get('/api/products/get/one/' + id)
				.then((response) => {
					const userid = localStorage.getItem('user_ID');
					
					const formValues =
					{
						"user_ID": userid,
						"product_ID": response.data._id,
					}
					axios.post('/api/wishlist/post', formValues)
						.then((response) => {
							this.getWishData();
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
			this.setState({
				messageData: {
					"type": "outpage",
					"icon": "fa fa-exclamation-circle",
					"message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
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
		axios.get("/api/customerReview/get/list/" + this.props.productID)
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
		axios.get("/api/customerReview/get/avg/" +this.props.productID)
		.then((response) => {
		  console.log('e', response.data);
		  this.setState({
			  reviewAverage : response.data[0].reviewAvg
		  })
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
	setNewSizeProduct(event){
		var id = event.target.id;
		this.setState({
			selectedSize : event.target.value
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
	render() {
		const props = { width: 400, height: 350, zoomWidth: 750, offset: { vertical: 0, horizontal: 30 }, zoomLensStyle: 'cursor: zoom-in;', zoomStyle: 'z-index:1000;background-color:#fff; height:500px;width:750px;box-shadow: 0 4px 20px 2px rgba(0,0,0,.2);border-radius: 8px;', img: this.state.selectedImage ? this.state.selectedImage : "/images/notavailable.jpg" };
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20 backColorWhite mb20 boxBorder">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt50">
					<div className="col-lg-5 col-md-5 col-sm-12 col-xs-12 stickyDiv">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageContainer imgCont">
							<div className="prod-detail-slider prod-detail-filpCommon">
								<div id="react-app" className={"item img-responsiveProduct"}>
									<ReactImageZoom {...props} />
								</div>
							</div>
						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageContainer mt50">
							<div className="">
								<OwlCarousel
									className="owl-theme productview"
									margin={0}
									nav={true}
									responsive={this.state.responsive}
									autoplay={true}
									autoplayHoverPause={true}
								>
									{
										this.state.productData && this.state.productData.productImage && this.state.productData.productImage.length > 0 ?
											this.state.productData.productImage.map((data, index) => {
												
												// if (!_.isEmpty(data)) {
												return (
													<div key={index} className="item col-lg-12 col-md-12 col-sm-12 col-xs-12 miniImagesInNew"  >
														<div className="row">
															{
																data && <img data-index={index} id="change-image" onClick={this.changeImage} src={data} alt="default" />
															}
														</div>
													</div>
												);
												// }
											})
											:
											null
									}
								</OwlCarousel>
							</div>
						</div>
					</div>

					<div className="col-lg-6 col-md-6  col-sm-12 col-xs-12 ">
						<Message messageData={this.state.messageData} />
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="row">
								<div id="brand"><label className="productNameClassNewBrand"> {this.state.productData.brand} </label></div>
								<div ><span className="productNameClassNew"> {this.state.productData.productName}</span> <span className="productCode"> (Product Code: {this.state.productData.productCode+'-'+this.state.productData.itemCode})</span></div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="row">
										 {/* <p className="">{this.state.reviewData.length>0?<a href="#gotoreview" className="anchorclr">Be the first to review this product</a>: null} </p> */}
										{/*<span className="priceEcommerce" ><i className={"fa fa-"+this.state.productData.currency}></i>&nbsp;{this.state.productData.discountedPrice}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										{this.state.productData.offered === true ? <span className="originalPrice"><i className={"fa fa-"+this.state.productData.currency}>&nbsp;{this.state.productData.originalPrice}</i></span> : null}*/}
									</div>
									<div className="undrln row"> </div>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="row">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mb15">
											<span className="priceEcommerceNew" ><i className={"fa fa-" + this.state.productData.currency}></i>&nbsp;{this.state.productData.discountedPrice}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											{this.state.productData.discountPercent ? <span className="originalPrice"><i className={"fa fa-" + this.state.productData.currency}>&nbsp;{this.state.productData.originalPrice}</i></span> : null} &nbsp; &nbsp;
											{this.state.productData.discountPercent ?<span className="discountPercent">{this.state.productData.discountPercent}% off</span>: null}
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
											{this.state.reviewAverage ?<div> <div className="col-lg-1 col-md-1 product-reviews-summary ratebox">{this.state.reviewAverage} &nbsp;<i class="fa fa-star"></i></div> &nbsp; {this.state.reviewData.length} ratings and reviews</div> : null}
										</div>
									</div>

									<div className="row listspace">
										{this.state.productData.featureList ?
											<span className="col-md-12 col-lg-12 col-sm-12 col-xs-12 paddingleftzero paddingrightzero ttl" >
												Features
											</span>
											:
											null
										}
										<div className="col-md-12 col-sm-12 col-xs-12 col-lg-12 ttllist" dangerouslySetInnerHTML={{__html: this.state.productData.featureList}}></div>
												
									</div>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 adCart ">
									<div className="row spc">
										<form id="productView" className="col-lg-7 col-md-7 col-sm-7 col-xs-7 NOpadding">
										{
                                            this.state.productData.availableQuantity > 0 ?
												<div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 NOpadding">
													<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 qtyInput" id="totalQuanity">
														1
													</div>
													<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
														<i className="fa fa-plus qtyIncrease" id="addQuantity" onClick={this.addQuantity.bind(this)}></i><br />
														<i className="fa fa-minus qtyIncrease" id="decreaseQuantity" onClick={this.decreaseQuantity.bind(this)}></i>
													</div>
													<div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 NOpadding">
														<div id={this.state.productData._id} availableQuantity={this.state.productData.availableQuantity} onClick={this.addtocart.bind(this)} className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 viewAddtoCart"> &nbsp; Add to Cart</div>
													</div>
												</div>
											:
												<div className=" col-lg-9 col-md-9 col-sm-12 col-xs-12 NOpadding pull-right">
													<span className="soldOut">Sold Out</span>
													<p className="soldOutP">This item is currently out of stock</p>
												</div>
											}

											<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
												<div id={this.state.productData._id} title={this.state.wishTooltip} onClick={this.addtowishlist.bind(this)} className={"btn col-lg-12 col-md-12 col-sm-12 col-xs-12 "+this.state.wishIconClass }></div>
											</div>
											{this.state.productData.availableQuantity > 0 && this.state.productData.color ?
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
													{this.state.relatedProductArray && this.state.relatedProductArray.length>0?
														this.state.relatedProductArray.map((a,i)=>{
															if(a.color){
																var color  = ntc.name(a.color);
																if(i===0){
																	return(
																		<div>
																			<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mt15 detailtitle">Color</label>
																			<div className="col-lg-1 col-md-1 col-sm-1 col-xs-2 NOpadding">
																				<label title={color[1]} className="colorBox">
																					<input title="Please select color first." checked={this.state.selectedColor === a.color ? true : false} value={a.color} name="color" type="radio" id={a._id} onChange={this.setNewProduct.bind(this)}/>
																					<span style={{'backgroundColor' : a.color}} className="color col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"></span>
																				</label>
																			</div>
																			
																		</div>
																	);
																}else{
																	return(
																		<div className="col-lg-1 col-md-1 col-sm-1 col-xs-2 NOpadding">
																			<label title={color[1]} className="colorBox">
																				<input title="Please select color first." checked={this.state.selectedColor === a.color ? true : false} value={a.color} name="color" type="radio" id={a._id} onChange={this.setNewProduct.bind(this)}/>
																				<span style={{'backgroundColor' : a.color}} className="color col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"></span>
																			</label>
																		</div>
																	);
																}
															}
														})
														:
														null
													}
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding colorError">
														<label id="color"></label>
													</div>
												</div>
												:
												null
											}
											{this.state.productData.availableQuantity > 0 ?
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
													
													{this.state.productSizeArray && this.state.productSizeArray.length>0?
														this.state.productSizeArray.map((a,i)=>{
															if(a.size){		
																if(i === 0){
																	return(
																		<div>
																			<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mt15 detailtitle">Size</label>
																			<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 NOpaddingLeft">
																				<label className="size col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																					<input title="Please select size first." checked={this.state.selectedSize === a.size ? true : false} value={a.size} name="size" type="radio" id={a._id} onChange={this.setNewSizeProduct.bind(this)}/>
																					<span title={a.size} className="checkmark col-lg-12 col-md-12 col-sm-12 col-xs-12">{a.size}</span>
																				</label>
																			</div>
																		</div>
																	);
																}else{
																	return(
																		<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 NOpaddingLeft">
																			<label className="size col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																				<input title="Please select size first." checked={this.state.selectedSize === a.size ? true : false} value={a.size} name="size" type="radio" id={a._id} onChange={this.setNewSizeProduct.bind(this)}/>
																				<span title={a.size} className="checkmark col-lg-12 col-md-12 col-sm-12 col-xs-12">{a.size}</span>
																			</label>
																		</div>
																	);
																}	
															}
														})
														:
														null
													}
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding colorError">
														<label id="size"></label>
													</div>
												</div>
												:
												null
											}
											

										</form>
									</div>

								</div>

							</div>
						</div>
						{
							this.state.productData.productDetails ? 
							<div id="gotoreview" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding topspace detailtitle">DESCRIPTION</div>
								<div className="spcbx topspace15"></div>
								<div className="col-md-12 col-sm-12 col-xs-12 col-lg-12 ttllist" dangerouslySetInnerHTML={{__html: this.state.productData.productDetails}}></div>
							</div>
							:
							null
						}
						<ProductViewEcommerceDetailsReviewFAQ productID = { this.props.productID } />
					</div>
				</div>
				
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
	  recentCartData :  state.recentCartData
	}
  }
  const mapDispachToProps = (dispatch) => {
	return  bindActionCreators({ fetchCartData: getCartData }, dispatch)
  }
  export default connect(mapStateToProps, mapDispachToProps)(ProductViewEcommerce);