import React, { Component } from 'react';
import axios                from 'axios';
import { connect }          from 'react-redux';
import getConfig            from 'next/config';
import { withRouter }       from 'next/router'
import dynamic              from 'next/dynamic';
import Link                 from'next/link';
import $, { post }          from 'jquery';
import CategoryBlock        from '../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/CategoryBlock.js';
import Message              from '../../../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js';
import ReactImageZoom       from 'react-image-zoom';
import Carousel             from 'react-multi-carousel';
import {ntc}                from '../../../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';
import ProductZoom          from './ProductZoom.js';
import ProductReviewList    from './productReviewList.js';
import ProductCarouselView  from '../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/ProductCarouselView.js';
import CategoryFilters      from '../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/CategoryFilters.js';
import {getCartData,getWishlistData, updateCartCount}  from '../../../../redux/actions/index.js'; 
import 'react-multi-carousel/lib/styles.css';
import SubCategoryBlock     from '../../../../Themes/Sampurna/blocks/StaticBlocks/SubCategoryBlock/SubCategoryBlock.js';
import Style                from './product_detail.module.css';
import style                from '../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/ProductCarousel.module.css';

const { publicRuntimeConfig } = getConfig();
class ProductViewEcommerce extends Component {
	constructor(props) {
		super(props);
		this.state = {		
			"productData"    : {},
			"subImgArray"    : [],
			"totalQuanity"   : 1,
			"quanityLimit"   : 5,
			"reviewData"     : [],
			"imgsrc"         : "",
			"wishIconClass"  : "viewWishList",
			"wishTooltip"    : "Add to wishlist",
			"productID"      : '',
			"user_ID"        : "",
			"userLongitude"  : "",
			"userLatitude"   : "",
			"startRange"     : 0,
			"limitRange"     : 28,

		};
	}

	async componentDidMount(){
		$(document).ready(function() {
			$(this).on("click", ".koh-faq-question", function() {
			  $(this).parent().find(".koh-faq-answer").toggleClass("d-block");
			  $(this).find(".fa").toggleClass('active');
			});
		  });
		var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(sampurnaWebsiteDetails && sampurnaWebsiteDetails.preferences){
			this.setState({
				websiteModel : sampurnaWebsiteDetails.preferences.websiteModel,
				showLoginAs  : sampurnaWebsiteDetails.preferences.showLoginAs,
				currency     : sampurnaWebsiteDetails.preferences.currency,
			})
		}
		if(sampurnaWebsiteDetails.deliveryLocation){
			this.setState({ 
				"userLatitude"  : sampurnaWebsiteDetails.deliveryLocation.latitude,
				"userLongitude" : sampurnaWebsiteDetails.deliveryLocation.longitude,
				"delLocation"   : sampurnaWebsiteDetails.deliveryLocation.address,
			});
		  }
		if(userDetails){
            if(userDetails.user_id){
				this.setState({
					user_ID       :  userDetails.user_id,
					authService   :  userDetails.authService,
					// userLongitude : userDetails.userLatitude,
					// userLongitude : userDetails.userLongitude,
					"delLocation" : sampurnaWebsiteDetails.deliveryLocation.address,
				},()=>{
				})
            }
        }
		var url = window.location.href.split('/');
		// console.log("url===",url);
		if(url[4] !== "undefined"){	
		  var vendor_ID              = url[4];
		  var vendorlocation_ID      = url[5];
		  var productId             = url[6];
		//   console.log("productId==",productId);
		  this.setState({
			"vendor_ID"         : vendor_ID,
			"vendorlocation_ID" : vendorlocation_ID,
			"productID"         : productId,
		  },async()=>{
			//   console.log("productID===",this.state.productID);
			if(this.state.vendor_ID){
				await axios.get('/api/entitymaster/get/one/'+this.state.vendor_ID)    
				.then((vendorResponse)=>{
					if(vendorResponse){
					// console.log("vendorResponse===",vendorResponse);
						this.setState({
							vendorData : vendorResponse.data[0],
						})
					}
				})
				.catch((error) =>{
				console.log("error in get vendor=",error);
				})
			}

			if(this.state.productID){
				var formvalues = {
					"user_id"           : this.state.user_ID !== ""? this.state.user_ID : null,
					"product_id"        : this.state.productID,
					"vendor_id"         : this.state.vendor_ID,
					"vendorLocation_id" : this.state.vendorlocation_ID,
				}
				console.log("formvalues  => ",formvalues)
				if(formvalues){
					// console.log("before formvalues=",formvalues);
					const url = "/api/products/get/one";
					this.getProductDetails(url,formvalues);
				}		
			}
			})
		}
		
	}

	getProductDetails(url,formvalues){
		console.log("url=",url);
		// console.log("formvalues=",formvalues);
		axios.post(url,formvalues)
			.then((response) => {
				if(response.data){
					// console.log("product response = ",response.data);
					this.setState({
						variantProductsList : response.data.products,
						variants            : response.data.variants
					},()=>{
						// this.setProductData();
						this.filterdataWithId();
					})
					
				}
			})
			.catch((error) => {
				console.log('error', error);
			})
	}

	filterdataWithId(){
		var productData = this.state.variantProductsList.filter((productItem) => productItem._id === this.state.productID);
		if(productData && productData.length >0){
			this.setProductData(productData[0]);
		}
	}

	filterdataWithSize(){
		var productData = this.state.variantProductsList.filter((productItem) => productItem.size === this.state.currentSize);
		// console.log("productData==",productData);
		if(productData && productData.length >0){
			this.setProductData(productData[0]);
		}
	}

	filterdataWithColor(){
		// var productData = this.state.variantProductsList.filter((productItem) => productItem.size === this.state.currentSize);
		var productData = this.state.variantProductsList.filter((productItem) => productItem.color === this.state.productColor);
		// console.log("productData==",productData);
		if(productData && productData.length >0){
			this.setProductData(productData[0]);
		}
	}

	setProductData(productData){
		// console.log("productData.color===",productData.color);
		// var productData = this.state.variantProductsList.filter((productItem) => productItem._id === this.state.productID);
		this.setState({	
			// currentSize   : productData.color ? productData.color:"",
			// currentColor   : productData.color ? productData.color:"",
			activeColor   : productData.color ? productData.color:"",		
			activeSize    : productData.size ? productData.size:"",			
			productData   : productData,
			sectionUrl    : productData.section.split(' ').join('-').toLowerCase(),
			categoryUrl   : productData.category.split(' ').join('-').toLowerCase(),
			section_ID    : productData.section_ID,
			category_ID   : productData.category_ID,
			subCategoryUrl: productData.subCategory ? productData.subCategory.replace(' ','-').toLowerCase():"",
			selectedImage : productData.productImage && productData.productImage.lenth > 0 ? productData.productImage[0] : "",
			quanityLimit  : productData.availableQuantity,
			selectedColor : productData.color,
			selectedSize  : productData.size,
			websiteModel  : this.state.websiteModel
		},async()=>{
			console.log("api data=",this.state.sectionUrl,this.state.vendor_ID);
			
			await axios.get("/api/category/get/list/"+this.state.sectionUrl+"/" +this.state.vendor_ID)     
			.then((categoryResponse)=>{
				if(categoryResponse.data){    
				this.setState({
					categoryData     : categoryResponse.data.categoryList,  
					brandData        : categoryResponse.data.brandList, 
				},()=>{
					// console.log("categoryData object==",this.state.categoryData);
					// console.log("brandData object==",this.state.brandData);
				}); 
				// console.log("categoryUrl=",this.state.categoryUrl); 
				// console.log("categoryResponse=",categoryResponse.data.categoryList);
					
						for(let i=0 ;i<categoryResponse.data.categoryList.length;i++){
							// console.log("categoryResponse.data.categoryList[i].categoryUrl===",categoryResponse.data.categoryList[i].categoryUrl);
							// console.log("this.state.categoryUrl===",this.state.categoryUrl);
							if(categoryResponse.data.categoryList[i].categoryUrl === this.state.categoryUrl){
							var subCategoryData = categoryResponse.data.categoryList[i].subCategory?categoryResponse.data.categoryList[i].subCategory:[];
							if(subCategoryData){
								this.setState({
									subCategoryData  : subCategoryData,
									brandData        : this.state.brandData
								},()=>{
									// console.log("subCategoryData==",subCategoryData);
								});
							}
							break;
						}
					}
				}
			})
			.catch((error)=>{
				console.log("Error while getting subcategory=",error);
			})

			var similarProductsFormvalues = {
				product_ID     : this.state.productID,
				vendor_ID      : this.state.vendor_ID,
				category_ID    : this.state.category_ID,
				// subCategory_ID : productdata.subCategory_ID,
				section_ID     : this.state.section_ID,
				user_ID        : this.state.user_ID
			}
			if(similarProductsFormvalues){
				// console.log("similarProductsFormvalues==",similarProductsFormvalues);
				axios.post("/api/products/get/similar_products", similarProductsFormvalues)
				.then((similarProductResponse)=>{
					if(similarProductResponse){
						// console.log("similarProductResponse==",similarProductResponse);
						this.setState({
							newProducts : similarProductResponse.data
						})
					}
				})
				.catch((error)=>{
						console.log("error while getting similar product=",error);
				})
			}
		})
	}
	addtocart(event) {
		event.preventDefault();	
		if(this.state.user_ID){
			var id = event.target.id;
			var availableQuantity = event.target.getAttribute('availableQuantity');
			const formValues = {
				"user_ID"             : this.state.user_ID,
				"product_ID"          : event.target.id,
				"quantity"            : 1,   
				"vendor_ID"           : this.state.vendor_ID,  
				"vendorLocation_id"   : this.state.vendorlocation_ID, 
				"userLatitude"        : this.state.userLatitude,
				"userLongitude"       : this.state.userLongitude,
				"vendorName"          : event.target.getAttribute('vendor_name'),

			  } 
			  
			if(formValues){
			// console.log("formValues===",formValues);
			axios.post('/api/carts/post', formValues)
				.then((response) => {
					this.props.fetchCartData();
          			this.props.updateCartCount();
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
			// console.log("product id===",id);
			axios.get('/api/products/get/one/' + id)
				.then((response) => {
					const formValues = {
						"user_ID"             : this.state.user_ID,
						"userDelLocation"     : {
													"lat"             : this.state.userLongitude, 
													"long"            : this.state.userLongitude,
													"delLocation"     : this.state.delLocation,
												},
						"vendor_id"           : this.state.vendor_ID,
						"vendorLocation_id"   : this.state.vendorlocation_ID,
						"product_ID"          : id
					  }
					if(formValues){
						axios.post('/api/wishlist/post', formValues)
							.then((response) => {
								this.props.getWishlistData();
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
					}
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
	
	getBrandWiseData(event){
		// console.log("brand value ==",event.target.value);
		var brandArray = this.state.brandArray;
		if(event.target.value !== "undefined"){
		  var brandValue = event.target.value;
		  brandArray.push(brandValue);
		}
		this.setState({
		  brandArray : brandArray
		},()=>{
		  // console.log("brandArray => ",this.state.brandArray);
		  var formValues = {
			"vendor_ID"      : this.state.vendor_ID, 
			"sectionUrl"     : this.state.sectionUrl,
			"categoryUrl"    : this.state.categoryUrl,
			// "subCategoryUrl" : this.state.blockSettings.subCategory !== "all"?[this.state.blockSettings.subCategory.replace(/\s/g, '-').toLowerCase()]:[],
			"userLatitude"   : this.state.userLatitude,
			"userLongitude"  : this.state.userLongitude,
			"startRange"     : 0,
			"limitRange"     : 28,
			"sortProductBy"  : '',
			"brand"          : this.state.brandArray 
		  }  
			$("html, body").animate({ scrollTop: 0 }, 800);
			// this.getProductList(this.state.productApiUrl,formValues);
		})
	  }
	
	render() {
		// console.log("this.state.currentSize",this.state.currentSize);
		// console.log("product view eccomerce data  =====",this.state.productData);
		var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === this.state.productData._id) : [];
		var wishClass = '';
		var tooltipMsg = '';
		if (x && x.length > 0) {
			wishClass = '';
			// console.log("wishclassName=",wishClass);
			tooltipMsg = 'Remove from wishlist';
		} else {
			wishClass = 'r';
			// console.log("wishclassName=",wishClass);
			tooltipMsg = 'Add To Wishlist';
		} 
		return (
			 <section className={"SingleProductMainWrapper "+Style.ShopBySubCategories}>
				<div className="row">
					<div className={"col-12 NoPadding pb-2 pt-2 " +Style.productDetailVendorName}> 
						<div className="col-12  ">
							<div className="row">
								<span className={"col-6 "+Style.vendorNameWrapper}> 
									<b>Vendor</b>- &nbsp;{this.state.vendorData? this.state.vendorData.companyName:null}
								</span>
								<span className={"col-6   "+Style.chaneVendorBtn }> 
									<Link href={"/vendor-list/"+this.state.sectionUrl} className={"col-12 NoPadding "+Style.changeVendorWrapper} >Change Vendor</Link>
								</span>
							</div>
						</div>
					</div>
				</div>
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
					<div className={"col-12 col-lg-2 col-xl-2 col-md-2 col-sm-12 col-xs-12 mt-2 FiltersBlock NoPadding " +Style.FilterBlkBox}>
						{ this.state.subCategoryData && this.state.subCategoryData.length>0?
						< CategoryFilters 
							categoryData       = {this.state.subCategoryData}
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
						:
							// <div className="col-12 pt-4"> No SubCategory available</div>
							null
						}

						{/* {this.state.brandData && this.state.brandData.length>0?  
							<div className="panel-group NoPadding" >     
								{this.state.brandData.length && this.state.brandData[0].brand!=' '>0?                 
								<div className={" " +style.categoryFilterTitle}> Brand </div>  
								:null}
								{
								this.state.brandData && this.state.brandData.length > 0
								?
									this.state.brandData.map((brand,index)=>{
									var i = index+1;
									if(brand === ""){
										return true;
									}else{
										return(
										<div className="col-12 noPadding panelCategory paneldefault" key={index}>
											<div className={"row panel-heading "+style.panelHeading}>
												<div className={"NoPadding centreDetailContainerEcommerce "+style.brandInput}>
													<input className="" type="checkbox" name="brands[]" className={style.brandFilterInput} onChange={this.getBrandWiseData.bind(this)} value={brand} />
												</div>
												<span className="col-11 centreDetaillistItemEcommerce">{brand}</span>
											</div>                              
										</div>
										)
									}
									})   
								:
									null
								}
							</div>  
						:' '
						} */}
					</div>

					<div className="col-12 col-lg-10 col-xl-10 col-md-10 col-sm-12 col-xs-12 boxBorderInner mobileViewNoPadding mt50 ">
						<div className="row mb-5">
						{this.state.productData?
							<ProductZoom 
								productData = {this.state.productData}
							/>
						:
							null
						}
							<div className={"col-12 col-xl-7 col-lg-7 col-md-12 col-sm-12 " +Style.topSpace}>

							<Message messageData={this.state.messageData} />
							{this.state.productData?
							<div className="col-12">
								<div className="row">
								<div className={"col-lg-2 col-xl-2 col-3  NoPadding mobileViewNoPadding pull-right " +Style.heartPosition}>
									{this.state.user_ID && this.state.authService!=="guest"?
										<div id={this.state.productData._id} title={this.state.wishTooltip} onClick={this.addtowishlist.bind(this)} className={" col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.wishClass}>
											<i id={this.state.productData._id} className={"fa"+wishClass +" " +"fa-heart" +" heartIcon"}></i>
										</div>
									:
										<div id={this.state.productData._id} title={this.state.wishTooltip} onClick={this.addtowishlist.bind(this)} className={" col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.wishClass} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal">
											<i id={this.state.productData._id} className={"fa"+wishClass +"fa-heart"+ wishClass +" heartIcon"}></i>
										</div>												
									}
								</div>
								{this.state.productData.productNameRlang?
									<div className={"col-12 globalProductItemName NoPadding productDetailsMB" } title={this.state.productData.productNameRlang}>
										<span className={" RegionalFont ellipsis globalProdName  " +Style.productNameClassNew}>{this.state.productData.productNameRlang} </span>&nbsp;&nbsp;&nbsp;   
										<span className=""> <span className="productCode"> (  {this.state.productData.productCode+'-'+this.state.productData.itemCode} )</span> </span>
									</div>
									:
									<div className={"col-12 globalProductItemName NoPadding NoPadding" } title={this.state.productData.productName}>
										{/* <div ><span className={" " +Style.productNameClassNew}> {this.state.productData.productName}</span> <span className="productCode">  {this.state.productData.productCode+'-'+this.state.productData.itemCode}</span> </div> */}
										<div ><span className={" " +Style.productNameClassNew}> {this.state.productData.productName}</span> <span className="productCode">  {this.state.productData.itemCode}</span> </div>

									</div>
								}
									<div className={"col-12 globalProduct_brand NoPadding mt-2 "  +Style.brandName} title={this.state.productData.brand}>Brand : {this.state.productData.brand}</div>
									<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "+Style.priceWrapperPD  }>
										{                                  
											this.state.productData.discountPercent ?
											<div className="col-12 NoPadding priceWrapper mb-2">
												<span className={" " +Style.f123}>Price &nbsp;:&nbsp;&nbsp; <strike className={" " +Style.disPriceColor}>&nbsp;{this.state.currency} &nbsp;{this.state.productData.originalPrice}&nbsp;</strike>&nbsp;&nbsp;&nbsp;
												<span className={" " +Style.priceColor}>{this.state.currency} &nbsp;{(this.state.productData.discountedPrice).toFixed(2)}</span>
												</span>
											</div>
											:  
											<div className={"col-12 NoPadding  priceWrapper NoPadding mb-2"}>
												<span className={"price "+Style.priceColorMain}>
												Price &nbsp;: {this.state.currency} &nbsp;{this.state.productData.originalPrice? (this.state.productData.originalPrice).toFixed(2):0} </span> &nbsp;                                      
											</div> 
										}
									</div>

									<div className={"col-12 NoPadding "  }>
										<div className={"col-12 NoPadding pt-4 mt-4 "+Style.productSize}>
											<span className={Style.brandName1}>Size : </span>&nbsp; 
											<span className={Style.brandName2}>{this.state.productData.size}</span>&nbsp;{this.state.productData.unit} 
										</div>
										
										{/* product variant code */}
										<div className={"container NoPadding mt-3 "+Style.ProductSize1}>
											<ul className="nav nav-tabs">
												{Array.isArray(this.state.variants) && this.state.variants.map((productItem,index)=>{
													return(
														productItem.size !=="" && productItem.size !== "undefined" && productItem.size !== null &&
														<li className="nav-item col-2 sizeVariantTab NoPadding ml-2 mb-4" key={index}>
															<a className={"nav-link "+productItem.size === this.state.currentSize ? 'active ' :' '+Style.sizeBox} data-toggle="tab" href={"#"+productItem.size} 
																onClick={()=>{
																this.setState({
																	currentSize      : productItem.size
																},()=>{
																		this.filterdataWithSize();
																	}
																)}}
															>
																{productItem.size}
															</a>
														</li>
														
													)})											
												}
											</ul>
											
											<div class="tab-content">
											{Array.isArray(this.state.variants) && this.state.variants.map((productItem,productIndex)=>{
												return(	 
													<div id={productItem.size} class={"container tab-pane " + (productItem.size === this.state.activeSize ? 'active ': 'fade')} key={productIndex}><br/>
														<div className={ "col-12 NoPadding  " +Style.brandNameColor}>Colour : {this.state.productData.color} </div>&nbsp;
														<div className={"row "+Style.ColorTabWrapper}>
														{Array.isArray(productItem.color) && productItem.color.map((colorItem,colorIndex)=>{
															return(	
																<div className={" col-2 NoPadding mt-2 colorVariantTab "+colorItem === this.state.activeColor ? 'active ': ''}  key={colorIndex} productId = {this.state.productData._id} 
																	onClick={()=>{
																	this.setState({
																		productColor: colorItem,
																	},()=>{
																		this.filterdataWithColor();
																	});
																}}>
																	{colorItem !==" " && colorItem !== "undefined" && colorItem !== null&&
																		<span className={"col-12 mr-2  "+Style.colorBox} style={{ backgroundColor: colorItem}}> </span>
																	}
																</div>
															)})
														}
														</div>
													</div>
												)})
											}
											</div>
										</div>
									</div>

									<div className={"col-12 adCart mobileViewNoPadding mt-4 "+Style.productDetailsInfo}>
										<div className="row spc">
											<form id="productView" className="col-12 NOpadding">
												<div className="row">
											{
												this.state.productData.availableQuantity > 0 ?
													<div className={"col-12 NOpadding "+Style.addToCartWrapperPD}>
														<div className="row">
															<div className="col-3 NoPadding pb-4">
																<div className={"col-5 NoPadding float-left qtyIncrease  globaleCommLargeBtn " +Style.p17 +" "+Style.marginNo +" "+Style.radiusB1+" "+Style.OrderNumIncWrapper} id="totalQuanity">
																	1
																</div>
																<div className={"col-6 float-left NoPadding " +Style.marginNo}>
																	<i className={"fa fa-plus qtyIncrease globaleCommLargeBtn " +Style.radiusB2 +" "+Style.marginNo+" "+Style.OrderNumIncWrapper1} id="addQuantity" onClick={this.addQuantity.bind(this)}></i><br />
																	<i className={"fa fa-minus qtyIncrease globaleCommLargeBtn " +Style.radiusB3 +" "+Style.marginNo+" "+Style.OrderNumIncWrapper1} id="decreaseQuantity" onClick={this.decreaseQuantity.bind(this)}></i>
																</div>
															</div>
															
															<div className="col-6 NOpadding mobileViewPaddingLeft">
																{this.state.user_ID?
																<div id={this.state.productData._id} vendor_id={this.state.productData.vendor_ID} availablequantity={this.state.productData.availableQuantity} onClick={this.addtocart.bind(this)} className={" col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.cartBTN}  > &nbsp; Add To Cart</div>
																:
																<div id={this.state.productData._id} availablequantity={this.state.productData.availableQuantity} onClick={this.addtocart.bind(this)} className={" col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.cartBTN} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" > &nbsp; Add To Cart</div>
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
											<div className="col-12 productDetailWrapper mt-4 NoPadding">
												<div className={" "+Style.productInformationWrapper} ><b>Products Information</b></div>
												{this.state.productData.weight &&
												<div className="col-12 singleProductDetail">
													<span className="col-4">Brand</span>
													<span className="col-1">:</span>
													<span className="col-6">{this.state.productData.brand}</span>
												</div>
												}
												{this.state.productData.weight &&
													<div className="col-12 singleProductDetail">
														<span className="col-4">Weight</span>
														<span className="col-1">:</span>
														<span className="col-6">{this.state.productData.weight}</span>
													</div>
												}
												{this.state.productData.size &&
													<div className={"col-12 singleProductDetail " +Style.f12}>
														<span className="col-4">Size</span>
														<span className="col-1">:</span>
														<span className="col-6">{this.state.productData.size}</span>
													</div>
												}
											</div>								
											{this.state.productData.productReturnable === "returnable"?
											<div className={"col-12 NoPadding mt-4"}>
												<div className="row ">
													<div className="koh-faq-question">
														{/* <i className="fa fa-undo "></i> */}
														<span className="col-12 returnabletxt koh-faq-question-span">Enjoy Free return for this item
														<i className="fa fa-chevron-right" aria-hidden="true"></i> <br/>
														</span>
													</div>
													<div className="col-12 koh-faq-answer d-none">
														<p>Consumable products are eligible for return,<br/>
															within 8 hours from the delivery time of the order.<br/>

															Non consumable products are eligible for<br/>
															return, within 5 days from the delivery<br/>
															time of the order
															 
															return policy &nbsp;<Link href={"/privacy-policy"}>Read more</Link>
														</p>
													</div>
													<div class="koh-tab-content d-none">
														<div class="koh-tab-content-body">
															<div class="koh-faq">
															<div class="koh-faq-question">
																<i class="fa fa-chevron-right" aria-hidden="true"></i>
																<span class="koh-faq-question-span"> Test Question 1 </span>
															</div>
															<div class="koh-faq-answer">
																Test Answer 1
															</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											:
											<div className={"container-flex NoPadding mt-4"}>
												<div className="row ">
													
													<div className="koh-faq-question">
														<div className="col-12 returnabletxt koh-faq-question-span ">This item is non-returnable 
														&nbsp;<i className="fa fa-chevron-right" aria-hidden="true"></i> <br/>
														</div>
														<div className="col-12 koh-faq-answer d-none ">
															<p >For more details about knock knock return <br/>
															policy &nbsp;<Link href="/privacy-policy">Read more</Link>
															</p>
														</div>
													</div>
													<div class="koh-tab-content d-none">
													<div class="koh-tab-content-body">
														<div class="koh-faq">
														<div class="koh-faq-question">
															<i class="fa fa-chevron-right" aria-hidden="true"></i>
															<span class="koh-faq-question-span"> Test Question 1 </span>
														</div>
														<div class="koh-faq-answer">
															Test Answer 1
														</div>
														</div>
													</div>
													</div>
												</div>
											</div>
											}
											</div>										
											</form>
										</div>
									</div>
								</div>
							</div>
							:null
							}
						</div>
						</div>
						{this.state.newProducts && this.state.newProducts.length>0
							?
								<ProductCarouselView 
								    blockTitle         = {"Similar Items"}
									newProducts        = {this.state.newProducts}
									vendor_ID          = {this.state.vendor_ID}
									vendorlocation_ID  = {this.state.vendorlocation_ID}
									userLatitude       = {this.state.userLongitude}
									userLongitude      = {this.state.userLongitude}
									sectionUrl         = {this.state.sectionUrl}
									subCategoryUrl     = {this.state.subCategoryUrl}
									categoryUrl        = {this.state.categoryUrl}
									className          ="font-weight-bold"
								/>
							:null
						}
						
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
									className          ={"font-weight-bold "+Style.ShopBySubCategories}
								/>
						:null
						}
						
					
						{this.state.productID
						?
							< ProductReviewList 
								productID = {this.state.productID}
							/>
						:null
						}	
					</div>
			</div>
			</div>
		</section>
		);
	}
}
  const mapStateToProps = state => (
  
	{
	  cartCount          : state.data.cartCount,
	  recentCartData     : state.data.recentCartData,
	  recentWishlistData : state.data.recentWishlistData,
  
	} 
  );
  const mapDispatchToProps = {
	fetchCartData    : getCartData,  
	updateCartCount  : updateCartCount,
	getWishlistData  : getWishlistData,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProductViewEcommerce);