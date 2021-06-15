import React, { Component } from 'react';
import axios                from 'axios';
import { connect }          from 'react-redux';
import getConfig            from 'next/config';
import { withRouter }       from 'next/router'
import dynamic              from 'next/dynamic';
import CategoryBlock        from '../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/CategoryBlock.js';
import Message              from '../../../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js';
import ReactImageZoom       from 'react-image-zoom';
import Carousel             from 'react-multi-carousel';
import {ntc}                from '../../../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';
import ProductZoom          from './ProductZoom.js';
import ProductCarouselView from '../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/ProductCarouselView.js';
import CategoryFilters      from '../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/CategoryFilters.js';
import { getCartData,recentCartData } from '../../../../redux/actions/index';
import 'react-multi-carousel/lib/styles.css';
import SubCategoryBlock from '../../../../Themes/Sampurna/blocks/StaticBlocks/SubCategoryBlock/SubCategoryBlock.js';

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
			"productID"      : '',
			"user_ID"        : "",
			"userLongitude"  : "",
			"userLatitude"   : "",
			"startRange"     : 0,
			"limitRange"     : 28,

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
					userLongitude : userDetails.userLatitude,
					userLongitude : userDetails.userLongitude,
				},()=>{
				})
            }
        }
		var url = window.location.href.split('/');
		console.log("url===",url);
		if(url[4] !== "undefined"){	
		  var vendor_ID              = url[4];
		  var vendorlocation_ID      = url[5];
		  var productId             = url[6];
		  this.setState({
			"vendor_ID"         : vendor_ID,
			"vendorlocation_ID" : vendorlocation_ID,
			"productID"         : productId,
		  },()=>{
			if(this.state.vendor_ID){
				axios.get('/api/entitymaster/get/one/'+this.state.vendor_ID)    
				.then((vendorResponse)=>{
					if(vendorResponse){
					console.log("vendorResponse===",vendorResponse);
						this.setState({
							vendorData : vendorResponse.data[0],
						})
					}
				})
				.catch((error) =>{
				console.log("error in get vendor=",error);
				})
			}
			})
		}
		if(sampurnaWebsiteDetails && sampurnaWebsiteDetails.preferences){
			this.setState({
				websiteModel : sampurnaWebsiteDetails.preferences.websiteModel,
				showLoginAs  : sampurnaWebsiteDetails.preferences.showLoginAs,
				currency     : sampurnaWebsiteDetails.preferences.currency,
			})
		}
		if(productId){
			if(this.state.user_ID!==""){
				var url = "/api/products/get/one/" + productId +"/" +this.state.user_ID;
			}else{
				var url = "/api/products/get/one/" + productId +"/" +null;
			}
			// console.log("url",url);
			axios.get(url)
			.then((response) => {
				if(response.data){
					console.log("product response = ",response.data);
					this.setState({
						sectionUrl : response.data.section.replace(' ','-').toLowerCase(),
						categoryUrl: response.data.category.replace(' ','-').toLowerCase(),
						subCategoryUrl: response.data.subCategory ? response.data.subCategory.replace(' ','-').toLowerCase():"",
						productData: response.data,
						selectedImage: response.data.productImage[0],
						quanityLimit: response.data.availableQuantity,
						selectedColor : response.data.color,
						selectedSize : response.data.size,
						websiteModel : this.state.websiteModel
					},async()=>{
						await axios.get("/api/category/get/list/"+this.state.sectionUrl+"/" +this.state.vendor_ID)     
						.then((categoryResponse)=>{
							if(categoryResponse.data){    
							this.setState({
								categoryData     : categoryResponse.data.categoryList,  
								brandData        : categoryResponse.data.brandList, 
							}); 
							console.log("categoryUrl=",this.state.categoryUrl); 
							console.log("categoryResponse=",categoryResponse.data.categoryList);
								for(let i=0 ;i<categoryResponse.data.categoryList.length;i++){
									if(categoryResponse.data.categoryList[i].categoryUrl === this.state.categoryUrl){
									var subCategoryData = categoryResponse.data.categoryList[i].subCategory?categoryResponse.data.categoryList[i].subCategory:[];
									this.setState({
										subCategoryData  : subCategoryData, 
									});
									break;
									}
								}
							}
						})
						.catch((error)=>{
							console.log("Error while getting subcategory=",error);
						})
					})
				}
				this.forceUpdate();
			})
			.catch((error) => {
				console.log('error', error);
			})
		}
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
		if(this.state.user_ID){
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
				})
				.catch((error) => {
					console.log('error', error);
				})
			}
		}else{
			if(this.state.websiteModel && this.state.showLoginAs==='modal'){
				$('#loginFormModal').show();
				}else{
				this.setState({
				  messageData: {
					"type": "outpage",
					"icon": "fa fa-exclamation-circle",
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
			  if(this.state.websiteModel && this.state.showLoginAs === 'modal'){
				$('#loginFormModal').show();
				}else{
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
	
	onClickImg(data){
		this.setState({
			selectedImage : data
		})
		
	}
	render() {
		// console.log("product data  =====",this.state);eCommerce
		const props = { width: 400, height: 350, zoomWidth: 750, offset: { vertical: 0, horizontal: 30 }, zoomLensStyle: 'cursor: zoom-in;', zoomStyle: 'z-index:1000;background-color:#fff; height:500px;width:750px;box-shadow: 0 4px 20px 2px rgba(0,0,0,.2);border-radius: 8px;', img: this.state.selectedImage ? this.state.selectedImage : '/images/eCommerce/notavailable.jpg' };
		return (
			<section>
				<div className="col-12">
					{this.state.categoryData && this.state.categoryData.length>0
					?
						< CategoryBlock 
							categoryData       = {this.state.categoryData}
							vendor_ID          = {this.state.vendor_ID}
							vendorlocation_ID  = {this.state.vendorlocation_ID}
							userLatitude       = {this.state.userLongitude}
							userLongitude      = {this.state.userLongitude}
							sectionUrl         = {this.state.sectionUrl}
							subCategoryUrl     = {this.state.subCategoryUrl}
							categoryUrl        = {this.state.categoryUrl}
						/>
					:	null
					}
				</div>

				<div className="col-12 mt20 mb20 boxBorder mobileViewNoPadding">
				<div className="row">
					<div className="col-3 FiltersBlock">
						< CategoryFilters 
							categoryData       = {this.state.subCategoryData}
							// blockSettings      = {this.state.blockSettings}
							vendor_ID          = {this.state.vendor_ID}
							vendorlocation_ID  = {this.state.vendorlocation_ID}
							sectionUrl         = {this.state.sectionUrl}
							subCategoryUrl     = {this.state.subCategoryUrl}
							categoryUrl        = {this.state.categoryUrl}
							userLatitude       = {this.state.userLatitude}
							userLongitude      = {this.state.userLongitude}
							startRange         = {this.state.startRange}
							limitRange         = {this.state.limitRange}
						/>
					</div>
					<div className="col-9 boxBorderInner mobileViewNoPadding mt50 ">
						<div className="row">
							<ProductZoom 
								productData = {this.state.productData}
							/>
							<div className="col-12 col-sm-7 ">
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
									</div>
									:
									<div className={"col-12 globalProductItemName NoPadding NoPadding" } title={this.state.productData.productName}>
										{/* <span className={ "ellipsis globalProdName"}>{this.state.productData.productName} </span>&nbsp; */}
										<div ><span className="productNameClassNew"> {this.state.productData.productName}</span> <span className="productCode"> (Product Code: {this.state.productData.productCode+'-'+this.state.productData.itemCode})</span> </div>
									</div>
								}
									<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  }>
								{                                  
									this.state.productData.discountPercent ?
									<div className="col-12 NoPadding priceWrapper">
									<span className="price"><span className="">&nbsp;{this.state.currency} &nbsp;{this.state.productData.originalPrice}&nbsp;</span>&nbsp;
									{/* <i className="fa fa-inr"></i> */}
									{this.state.currency} &nbsp;{(this.state.productData.discountedPrice).toFixed(2)} 
									</span>
									</div>
									:  
									<div className={"col-12 NoPadding  priceWrapper NoPadding"}>
									<span className="price">
										{/* <i className="fas fa-rupee-sign"></i> */}
										{this.state.currency} &nbsp;{this.state.productData.originalPrice? (this.state.productData.originalPrice).toFixed(2):0} </span> &nbsp;                                      
									</div> 
								}
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
											<div className="col-12 productDetailWrapper mt-4">
												<h6>Products Information</h6>
												<div className="col-12 singleProductDetail">
													<span className="col-4">Brand</span>
													<span className="col-1">:</span>
													<span className="col-6">{this.state.productData.brand}</span>
												</div>
												<div className="col-12 singleProductDetail">
													<span className="col-4">Weight</span>
													<span className="col-1">:</span>
													<span className="col-6">{this.state.productData.weight}</span>
												</div>
											</div>								
											</div>										
											</form>
										</div>
									</div>
								</div>
							</div>
							
						</div>
						</div>
						{this.state.subCategoryData && this.state.subCategoryData.length>0
							?
								<SubCategoryBlock 
									blocktitle         = {"Shop By Sub Categories"}
									subCategoryData    = {this.state.subCategoryData}
									vendor_ID          = {this.state.vendor_ID}
									vendorlocation_ID  = {this.state.vendorlocation_ID}
									userLatitude       = {this.state.userLongitude}
									userLongitude      = {this.state.userLongitude}
									sectionUrl         = {this.state.sectionUrl}
									subCategoryUrl     = {this.state.subCategoryUrl}
									categoryUrl        = {this.state.categoryUrl}
								/>
							:null
							}

							{/* {this.state.subCategoryData && this.state.subCategoryData.length>0
							?
								<ProductCarouselView 
									blocktitle         = {"Shop By Sub Category"}
									categoryData       = {this.state.subCategoryData}
									vendor_ID          = {this.state.vendor_ID}
									vendorlocation_ID  = {this.state.vendorlocation_ID}
									userLatitude       = {this.state.userLongitude}
									userLongitude      = {this.state.userLongitude}
									sectionUrl         = {this.state.sectionUrl}
									subCategoryUrl     = {this.state.subCategoryUrl}
									categoryUrl        = {this.state.categoryUrl}
								/>
							:null
							} */}
					</div>
			</div>
			</div>
		</section>
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
	fetchCartData    : getCartData
  }
  export default connect(mapStateToProps, mapDispachToProps)(ProductViewEcommerce);