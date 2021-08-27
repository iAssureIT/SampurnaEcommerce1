import React, { Component } from 'react';
import axios                from 'axios';
import { connect }          from 'react-redux';
import getConfig            from 'next/config';
import { withRouter }       from 'next/router'
import dynamic              from 'next/dynamic';
import Link                 from'next/link';
import $, { post }          from 'jquery';
import CategoryBlock        from '../../../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/CategoryBlock.js';
import Message              from '../../../../../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js';
import ReactImageZoom       from 'react-image-zoom';
import Carousel             from 'react-multi-carousel';
import {ntc}                from '../../../../../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';
import ProductZoom          from './ProductZoom.js';
import ProductReviewList    from './productReviewList.js';
import ProductCarouselView  from '../../../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/ProductCarouselView.js';
import CategoryFilters      from '../../../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/CategoryFilters.js';
import {getCartData,getWishlistData, updateCartCount}  from '../../../../../../redux/actions/index.js'; 
import 'react-multi-carousel/lib/styles.css';
import SubCategoryBlock     from '../../../../../../Themes/Sampurna/blocks/StaticBlocks/SubCategoryBlock/SubCategoryBlock.js';
import Style                from './product_detail.module.css';
import style                from '../../../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/ProductCarousel.module.css';


const { publicRuntimeConfig } = getConfig();

Array.prototype.sortBy = function(p) {
  return this.slice(0).sort(function(a,b) {
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
}



class ProductViewEcommerce extends Component{

	constructor(props){
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
			"tabclick" 		  : false,
			"clickedSize"    : "",
			"colorTabClick"  : false,
			"colorIndex"  	  : 0,
			wishlistIcon : "far"
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
      var userDetails          	=  JSON.parse(localStorage.getItem('userDetails'));
        
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


		 axios.get('/api/entitymaster/get/one/'+this.props.vendor_id)    
				.then((vendorResponse)=>{
					if(vendorResponse){
						this.setState({ vendorData : vendorResponse.data[0] })
					}

					var formvalues = {
						"user_id"           : this.state.user_ID !== ""? this.state.user_ID : null,
						"product_id"        : this.props.productID,
						"vendor_id"         : this.props.vendor_id,
						"vendorlocation_ID" : this.props.vendorlocation_id,
					}
					if(formvalues){
						const url = "/api/products/get/one";
						this.getProductDetails(url,formvalues);
					}

				})
				.catch((error) =>{
					console.log("error in get vendor=",error);
				})


				console.log("userID => ",this.state.user_ID);
	}

	getProductDetails(url,formvalues){
		axios.post(url,formvalues)
			.then((response) => {
				if(response.data){
					var sortedProducts = response.data.products.sortBy('size');					
					var sortedVariants = response.data.variants.sortBy('size');

					this.setState({
						variantProductsList : sortedProducts,
						variants            : sortedVariants
					},()=>{
						this.filterdataWithId();
					})
				}
			})
			.catch((error) => {
				console.log('error', error);
			})
	}

	filterdataWithId(){
		var productData = this.state.variantProductsList.filter((productItem) => productItem._id === this.props.productID);		
		if(productData && productData.length >0){
			var sortedProducts = productData.sortBy('size');
			this.setProductData(sortedProducts[0]);
		}
	}

	filterdataWithSize(){
		var productData = this.state.variantProductsList.filter((productItem) => productItem.size === this.state.currentSize);
		if(productData && productData.length >0){
			var sortedProducts = productData.sortBy('size');
			this.setProductData(sortedProducts[0]);
		}
	}

	filterdataWithColor(){
		// var productData = this.state.variantProductsList.filter((productItem) => productItem.size === this.state.currentSize);
		var productData = this.state.variantProductsList.filter((productItem) => productItem.color === this.state.productColor);
		if(productData && productData.length >0){
			var sortedProducts = productData.sortBy('size');
			this.setProductData(sortedProducts[0]);
		}
	}

	setProductData(productData){
		console.log("productData = ",productData );

		this.setState({	
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
			await axios.get("/api/category/get/list/"+this.state.sectionUrl+"/" +this.props.vendor_id)     
					.then((categoryResponse)=>{
						if(categoryResponse.data){    
							this.setState({
								categoryData : categoryResponse.data.categoryList,  
								brandData    : categoryResponse.data.brandList, 
							},()=>{
								// console.log("categoryData = ",categoryResponse.data.categoryList);								
							}); 
							for(let i=0 ;i<categoryResponse.data.categoryList.length;i++){
								if(categoryResponse.data.categoryList[i].categoryUrl === this.props.categoryurl){
									var subCategoryData = categoryResponse.data.categoryList[i].subCategory?categoryResponse.data.categoryList[i].subCategory:[];
									if(subCategoryData){
										this.setState({
											subCategoryData  : subCategoryData,
											brandData        : this.state.brandData
										},()=>{
											// console.log("subCategoryData = ",subCategoryData);
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
						product_ID     : this.props.productID,
						vendor_ID      : this.props.vendor_id,
						category_ID    : this.state.category_ID,
						// subCategory_ID : productdata.subCategory_ID,
						section_ID     : this.state.section_ID,
						user_ID        : this.state.user_ID
					}
					if(similarProductsFormvalues){
						axios.post("/api/products/get/similar_products", similarProductsFormvalues)
							.then((similarProductResponse)=>{
								if(similarProductResponse){
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

	addtocart(event){
		event.preventDefault();	
		
		if(this.state.user_ID){
			var id 					= event.target.id;
			var availableQuantity 	= event.target.getAttribute('availableQuantity');
			const formValues = {
				"user_ID"             : this.state.user_ID,
				"product_ID"          : event.target.id,
				"quantity"            : 1,   
				"vendor_ID"           : this.props.vendor_id,  
				"vendorLocation_id"   : this.props.vendorlocation_id, 
				"userLatitude"        : this.state.userLatitude,
				"userLongitude"       : this.state.userLongitude,
				"vendorName"          : event.target.getAttribute('vendor_name'),
			} 
			  
			if(formValues){
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
						"type"			: "outpage",
						"icon"			: "fa fa-exclamation-circle",
						"message" 		: "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
						"class"			: "warning",
						"autoDismiss"	: true
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
	
	addtowishlist(event){
		event.preventDefault();
		if (this.state.user_ID){
			var id = event.target.id;
			axios.get('/api/products/get/one/' + id)
				.then((response) => {
					const formValues = {
						"user_ID"         : this.state.user_ID,
						"userDelLocation" : {
							"lat"             : this.state.userLongitude, 
							"long"            : this.state.userLongitude,
							"delLocation"     : this.state.delLocation,
						},
						"vendor_id"           : this.props.vendor_id,
						"vendorlocation_ID"   : this.props.vendorlocation_id,
						"product_ID"          : id
					}
					if(formValues){
						axios.post('/api/wishlist/post', formValues)
							.then((response) => {

								this.props.getWishlistData();
								if(response.data.message === 'Product added in wishlist successfully.'){

									this.setState({
										messageData: {
											"type" 			: "outpage",
											"icon"			: "fa fa-check-circle",
											"message"		: "&nbsp; " + response.data.message,
											"class"			: "success",
											"autoDismiss" 	: true
										},
										wishlistIcon: "fas"
									});
								}else{
									this.setState({
										messageData: {
											"type" 			: "outpage",
											"icon"			: "fa fa-check-circle",
											"message"		: "&nbsp; " + response.data.message,
											"class"			: "success",
											"autoDismiss" 	: true
										},
										wishlistIcon: "far"
									});
								}

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
		}else{
			if(this.state.websiteModel && this.state.showLoginAs === 'modal'){
				$('#loginFormModal').show();
			}else{
				this.setState({
					messageData: {
						"type" 			: "outpage",
						"icon"			: "fa fa-exclamation-circle",
						"message"		: "Need To Sign In, Please <a href='/login'>Sign In</a> First.",         
						"class"			: "warning",
						"autoDismiss"	: true
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

	addQuantity(){
		var totalQuanity = this.state.totalQuanity
		totalQuanity++;
		$('#addQuantity').addClass('auto');
		$('#addQuantity').css('background-color', '#fff');
		$('#decreaseQuantity').addClass('auto');
		$('#decreaseQuantity').css('background-color', '#fff');
		var recentCartData = this.props.recentCartData && this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
		var productCartData = recentCartData.filter((a)=>a.product_ID === this.props.productID);
		var quantityAdded = productCartData.length > 0 ? productCartData[0].quantity : 0;
		if(Number(totalQuanity) > Number(this.state.quanityLimit) || quantityAdded >= Number(this.state.quanityLimit)){
			$('#addQuantity').css('background-color', '#ccc');
			$('#addQuantity').addClass('no-drop');
			this.setState({
				messageData: {
					"type"			: "inpage",
					"icon"			: "fa fa-check-circle",
					"message"		: "Last "+this.state.quanityLimit+" items taken by you",
					"class"			: "warning",
					"autoDismiss"	: true
				}
			})
			setTimeout(() => {
				this.setState({
					messageData: {},
				})
			}, 5000);
		}else{
			this.setState({ totalQuanity: totalQuanity });
			document.getElementById('totalQuanity').innerHTML = totalQuanity;
		}
	}

	decreaseQuantity(){
		var totalQuanity = this.state.totalQuanity
		totalQuanity--;
		$('#addQuantity').addClass('auto');
		$('#addQuantity').css('background-color', '#fff');
		$('#decreaseQuantity').addClass('auto');
		$('#decreaseQuantity').css('background-color', '#fff');
		if(Number(totalQuanity) === 1 || Number(totalQuanity) > 1){
			this.setState({ totalQuanity: totalQuanity }, () => {
				document.getElementById('totalQuanity').innerHTML = this.state.totalQuanity;
			});
		}else{
			$('#decreaseQuantity').addClass('no-drop');
			$('#decreaseQuantity').css('background-color', '#ccc');
		}
	}
	
	getBrandWiseData(event){
		var brandArray = this.state.brandArray;
		if(event.target.value !== "undefined"){
			var brandValue = event.target.value;
			brandArray.push(brandValue);
		}
		this.setState({
			brandArray : brandArray
		},()=>{
			var formValues = {
				"vendor_ID"      : this.props.vendor_id, 
				"sectionUrl"     : this.state.sectionUrl,
				"categoryUrl"    : this.props.categoryurl,
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
	

	handleSize(event){
		var idVar = event.currentTarget.id;
		var idArr = idVar.split("-");
		var size = idArr[1];

		var productArr = this.state.variantProductsList.filter((e)=>{return e.size === size});
		
		this.setProductData(productArr[0])

		this.setState({
			tabclick : true,
			clickedSize : size
		})
	}


	handleColour(event){
		var idVar = event.currentTarget.id;
		// console.log("idVar = ",idVar);

		var idArr = idVar.split("-");
		var colorIndex = idArr[1];

		// var productId = document.getElementById(idVar).getAttribute('productid');
		// console.log("productId = ",productId);
		//this.setProductData(productId)

		this.setState({
			colorTabClick : true,
			colorIndex : colorIndex,
		});

	}


	collapseClick(event){
		var elemId = event.currentTarget.id;
		var elemI = document.querySelectorAll('#'+elemId+' > i');
		var iElement = elemI[0];

		if(iElement.classList.contains('fa-chevron-right')){
			iElement.classList.remove("fa-chevron-right");
			iElement.classList.add("fa-chevron-down");			
		}else{
			iElement.classList.remove("fa-chevron-down");
			iElement.classList.add("fa-chevron-right");			
		}

	}



	render(){
		var x 			= this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === this.state.productData._id) : [];
		var wishClass 	= '';
		var tooltipMsg 	= '';
		if(x && x.length > 0){
			wishClass = '';
			tooltipMsg = 'Remove from wishlist';
		}else{
			wishClass = 'r';
			tooltipMsg = 'Add To Wishlist';
		} 
		
		return(
			<section className={"SingleProductMainWrapper "+Style.ShopBySubCategories}>
				<div className={"col-12 pb-2 pt-2 mobileNoPadding "+Style.productDetailVendorName}> 
					<div className="col-12">
						<div className={"row " +Style.vendorBar}>
							<div className={"col-8 col-sm-9 col-lg-9 col-xl-9 "+Style.vendorNameWrapper}> 
								<div className={"col-12 mobileNoPadding"}>
									<b>Vendor</b>- &nbsp;{this.state.vendorData? this.state.vendorData.companyName:null}
								</div>
							</div>
							<div className={"col-4 col-lg-3 col-sm-3 col-xl-3 text-right "+Style.chaneVendorBtn }>
								<a href={"/vendor-list/"+this.state.sectionUrl} className={"col-12 mobileNoPadding"} >Change Vendor</a>
							</div>
						</div>
					</div>
				</div>
				<div className="col-12">
					{
						this.state.categoryData && this.state.categoryData.length > 0
						?
							<CategoryBlock
								categoryData       = {this.state.categoryData}
								vendor_ID          = {this.props.vendor_id}
								vendorlocation_ID  = {this.props.vendorlocation_id}
								userLatitude       = {this.state.userLongitude}
								userLongitude      = {this.state.userLongitude}
								sectionUrl         = {this.state.sectionUrl}
								subCategoryUrl     = {this.props.subCategoryurl}
								categoryUrl        = {this.props.categoryurl}
							/>
						:
							null
					}
				</div>
				<div className="col-12 mt20 mb20 boxBorder mobileViewNoPadding">
					<div className="row">
						<div className={"col-12 col-lg-2 col-xl-2 col-md-2 col-sm-12 col-xs-12 mt-2 NoPadding FiltersBlock NoPadding" +Style.FilterBlkBox}>
							{
								this.state.subCategoryData && this.state.subCategoryData.length > 0
								?
									<CategoryFilters 
										categoryData       = {this.state.subCategoryData}
										vendor_ID          = {this.props.vendor_id}
										vendorlocation_ID  = {this.props.vendorlocation_id}
										sectionUrl         = {this.state.sectionUrl}
										subCategoryUrl     = {this.props.subCategoryurl}
										categoryUrl        = {this.props.categoryurl}
										userLatitude       = {this.state.userLatitude}
										userLongitude      = {this.state.userLongitude}
										startRange         = {this.state.startRange}
										limitRange         = {this.state.limitRange}
									/>
								:
									// <div className="col-12 pt-4"> No SubCategory available</div>
									null
							}

							{/* {
								this.state.brandData && this.state.brandData.length > 0
								?
									<div className="panel-group NoPadding">
										{
											this.state.brandData.length && this.state.brandData[0].brand!=' '> 0
											?
												<div className={" "+style.categoryFilterTitle}>Brand</div>
											:
												null
										}
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
								:
									''
							} */}
						</div>

						<div className={"col-12 col-lg-10 col-xl-10 col-md-10 col-sm-12 col-xs-12  mobileViewNoPadding mt50 " +Style.boxBorderInner}>
							<div className="row mb-5">
								{
									this.state.productData
									?
										<ProductZoom 
											productData = {this.state.productData}
										/>
									:
										null
								}
								<div className={"col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12 " +Style.topSpace}>
									<Message messageData={this.state.messageData} />
										{
											this.state.productData
											?
												<div className="col-12">
													<div className="row">
														<div className={"col-lg-2 col-xl-2 col-3  NoPadding mobileViewNoPadding pull-right " +Style.heartPosition}>
															{
																this.state.user_ID && this.state.authService!=="guest"
																?
																	<div id={this.state.productData._id} title={this.state.wishTooltip} onClick={this.addtowishlist.bind(this)} className={"col-12 "+Style.wishClass}>
																		{/*<i id={this.state.productData._id} className={"fa"+wishClass +" " +"fa-heart" +" heartIcon"}></i>*/}
																		<i id={this.state.productData._id} className={this.state.wishlistIcon +" fa-heart" +" heartIcon"}></i>
																	</div>
																:
																	<div id={this.state.productData._id} title={this.state.wishTooltip} onClick={this.addtowishlist.bind(this)} className={"col-12 "+Style.wishClass} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal">
																		{/*<i id={this.state.productData._id} className={"fa"+wishClass +"fa-heart"+ wishClass +" heartIcon"}></i>*/}
																		<i id={this.state.productData._id} className={this.state.wishlistIcon +" fa-heart heartIcon"}></i>
																	</div>												
															}
														</div>
														{
															this.state.productData.productNameRlang
															?
																<div className={"col-12 globalProductItemName NoPadding productDetailsMB"} title={this.state.productData.productNameRlang}>
																	<span className={" RegionalFont ellipsis globalProdName "+Style.productNameClassNew}>{this.state.productData.productNameRlang}</span>&nbsp;&nbsp;&nbsp;   
																	<span className=""><span className="productCode">({this.state.productData.productCode+'-'+this.state.productData.itemCode})</span></span>
																</div>
															:
																<div className={"col-12 globalProductItemName NoPadding" } title={this.state.productData.productName}>
																	{/* <div><span className={Style.productNameClassNew}>{this.state.productData.productName}</span><span className="productCode">{this.state.productData.productCode+'-'+this.state.productData.itemCode}</span></div> */}
																	<div className="col-12 NoPadding">
																		<span className={Style.productNameClassNew}>{this.state.productData.productName}</span>&nbsp;
																		<span className="productCode">{this.state.productData.itemCode}</span>
																	</div>
																</div>
														}
														{this.state.productData.brand &&
															<div className={"col-12 globalProduct_brand NoPadding mt-2 "+Style.brandName} title={this.state.productData.brand}>Brand : {this.state.productData.brand}</div>
														}
														
														{                                  
															this.state.productData.discountPercent
															?
																<div className={"col-12 NoPadding "+Style.priceWrapperPD}>
																	<div className="col-12 NoPadding priceWrapper mb-2">
																		<span className={" " +Style.f123}>
																			<span className="col-2 NoPadding">Price </span>&nbsp;: &nbsp;
																			<strike className={" " +Style.disPriceColor}>&nbsp;{this.state.currency} &nbsp;{this.state.productData.originalPrice}&nbsp;</strike>&nbsp;&nbsp;&nbsp;
																			<span className={Style.percentOff}>{this.state.productData.discountPercent}% </span>
																			<span className={Style.percentOffTxt}>OFF</span> &nbsp;
																			<span className={" " +Style.priceColor}>{this.state.currency} &nbsp;{(this.state.productData.discountedPrice).toFixed(2)}</span>
																			&nbsp;<span className={Style.vatSpan}>Inclusive of VAT</span>
																		</span>
																		<div className="col-12">
																			<span className="col-2"> </span>&nbsp;
																			<span className={" " +Style.savePrice}>{this.state.currency} &nbsp;{( this.state.productData.originalPrice - this.state.productData.discountedPrice).toFixed(2)}</span> &nbsp;
																			<span className={Style.youSaved}>You Saved</span>
																		</div>
																	</div>
																</div>
															:
																<div className={"col-12 NoPadding "+Style.OriginalpriceWrapper}>
																	<div className={"col-12 NoPadding priceWrapper NoPadding mb-4"}>
																		<span className={"price "+Style.priceColorMain}>
																			<span className="col-2 NoPadding">Price </span>&nbsp;: &nbsp;
																			{
																				this.state.productData.originalPrice
																				?
																					<span className={Style.mainPrice}>{this.state.currency} {(this.state.productData.originalPrice).toFixed(2)}</span> 
																				:
																					0
																			}
																			&nbsp;<span className={Style.vatSpan}>Inclusive Of VAT</span>
																		</span>&nbsp;                                      
																	</div>
																</div>
														}
														
														<div className={"col-12 NoPadding"}>
															{this.state.productData.size && 
																<div className={"col-12 NoPadding pt-2 "+Style.productSize}>
																	<span className={Style.brandName1}>Size : </span>&nbsp; 
																	<span className={Style.brandName2}>{this.state.productData.size}</span>&nbsp;{this.state.productData.unit} 
																</div>
															}

															<div className={"container NoPadding mt-3 "+Style.ProductSize1}>
																<ul className="nav nav-tabs" role="tablist">
																	{
																		Array.isArray(this.state.variants) && 
																		this.state.variants.map((productItem,index)=>{
																			if(!this.state.tabclick){																				
																				if(index === 0){
																					var actClass = " active";
																				}else{
																					var actClass = "";
																				}
																			}else{
																				var actClass = "";
																			}
																			return(
																				productItem.size !=="" && productItem.size !== "undefined" && productItem.size !== null &&
																					<li id={"li-"+productItem.size} className={"nav-item col-4 col-sm-3 col-xl-2 NoPadding ml-2 mb-4 sizeVariantTab "+Style.sizeTab} key={index} onClick={this.handleSize.bind(this)} >
																						<a className={"nav-link"+actClass} data-toggle="tab" href={"#"+productItem.size}>
																							{productItem.size}
																						</a>
																					</li>
														
																			)
																		})											
																	}
																</ul>

																<div className="tab-content">
																	{
																		this.state.productData.color &&
																		Array.isArray(this.state.variants) 
																		&& this.state.variants.map((productItem,productIndex)=>{

																			if(!this.state.tabclick){
																				if(productIndex === 0){
																					var actSizeContent = " active show";
																				}else{
																					var actSizeContent = " fade";
																				}																				
																			}else{
																				if(productItem.size === this.state.clickedSize){
																					var actSizeContent = " active show";
																				}else{
																					var actSizeContent = " fade";
																				}
																			}																				
																			return(
																				<div id={productItem.size} className={"container tab-pane"+actSizeContent} key={productIndex}><br/>
																					<div className={ "col-12 NoPadding " +Style.brandNameColor}>Colour : {productItem.color} </div>&nbsp;

																						<div className={"row "+Style.ColorTabWrapper}>
																							{ 
																								Array.isArray(productItem.color) && productItem.color.map((colorItem,colorIndex)=>{
																									
																									if(!this.state.colorTabClick){
																										if(colorIndex === 0){
																											var actColorClass = Style.actColor;
																										}else{
																											var actColorClass = "";
																										}
																									}else{
																										if(colorIndex === parseInt(this.state.colorIndex)){
																											var actColorClass = Style.actColor;
																										}else{
																											var actColorClass = "";
																										}																										
																									}
																									return(
																										<div id={"color-"+colorItem} className="col-2 NoPadding mt-2 colorVariantTab"  key={colorIndex} >
																											{
																												colorItem !== "" && colorItem !== "undefined" && colorItem !== null &&
																												<span id={"color-"+colorIndex} productId={this.state.productData._id} className={"col-12 mr-2 "+Style.colorBox +" "+actColorClass} style={{backgroundColor: colorItem}} onClick={this.handleColour.bind(this)}></span>
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
															<div className="col-12">
																<div className="row">
																<form id="productView" className="col-12 NOpadding">
																	<div className="row">
																		{
																			this.state.productData.availableQuantity > 0
																			?
																				<div className={"col-12 NOpadding "+Style.addToCartWrapperPD}>
																					<div className="row">
																						<div className="col-2 NoPadding pb-4 ml-5 ml-sm-0">
																							<div className={"col-4 NoPadding float-left qtyIncrease  globaleCommLargeBtn " +Style.p17 +" "+Style.marginNo +" "+Style.radiusB1+" "+Style.OrderNumIncWrapper} id="totalQuanity">
																								1
																							</div>
																							<div className={"col-6 float-left NoPadding " +Style.marginNo}>
																								<i className={"fa fa-plus qtyIncrease globaleCommLargeBtn " +Style.radiusB2 +" "+Style.marginNo+" "+Style.OrderNumIncWrapper1} id="addQuantity" onClick={this.addQuantity.bind(this)}></i><br />
																								<i className={"fa fa-minus qtyIncrease globaleCommLargeBtn " +Style.radiusB3 +" "+Style.marginNo+" "+Style.OrderNumIncWrapper1} id="decreaseQuantity" onClick={this.decreaseQuantity.bind(this)}></i>
																							</div>
																						</div>
																						<div className="col-6 NOpadding mobileViewPaddingLeft">
																							{
																								this.state.user_ID
																								?
																									<div id={this.state.productData._id} vendor_id={this.state.productData.vendor_ID} availablequantity={this.state.productData.availableQuantity} onClick={this.addtocart.bind(this)} className={"col-12 "+Style.cartBTN}>&nbsp; Add To Cart</div>
																								:
																									<div id={this.state.productData._id} availablequantity={this.state.productData.availableQuantity} onClick={this.addtocart.bind(this)} className={"col-12 "+Style.cartBTN} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" > &nbsp; Add To Cart</div>
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
																			<div className={"ml-5 ml-sm-0 "+Style.productInformationWrapper}><b>Products Information</b></div>
																			{
																				this.state.productData.weight &&
																					<div className="col-12 singleProductDetail">
																						<span className="col-4">Brand</span>
																						<span className="col-1">:</span>
																						<span className="col-6">{this.state.productData.brand}</span>
																					</div>
																			}
																			{
																				this.state.productData.weight &&
																					<div className="col-12 singleProductDetail">
																						<span className="col-4">Weight</span>
																						<span className="col-1">:</span>
																						<span className="col-6">{this.state.productData.weight}</span>
																					</div>
																			}
																			{
																				this.state.productData.size &&
																					<div className={"col-12 singleProductDetail " +Style.f12}>
																						<span className="col-4 ml-5 ml-sm-0">Size</span>
																						<span className="col-1">:</span>
																						<span className="col-6">{this.state.productData.size}</span>
																					</div>
																			}
																		</div>
																		{
																			this.state.productData.productReturnable === "returnable"
																			?
																				<div className="col-12 NoPadding mt-4">
																					<div className="row ">
																						<div id="collapse2" className={"col-12 ml-5 ml-sm-0 "+ Style.returnabletxt} data-toggle="collapse" data-target="#returnPolicy2" onClick={this.collapseClick.bind(this)}>
																							Enjoy Free return for this item  &nbsp;&nbsp;&nbsp;
																							<i className="fa fa-chevron-right" aria-hidden="true"></i> <br/>
																						</div>
																						<div className="col-12 collapse px-4" id="returnPolicy2">
																							<p>Consumable products are eligible for return,<br/>
																								within 8 hours from the delivery time of the order.<br/>
																								Non consumable products are eligible for<br/>
																								return, within 5 days from the delivery<br/>
																								time of the order return policy &nbsp;
																								<div className={"col-4 float-right "+Style.returnLink}> 
																									<a href="/privacy-policy" target="_blank">Read more</a> 
																								</div>
																							</p>
																						</div>																						
																					</div>
																				</div>
																			:
																				<div className={"container-flex NoPadding mt-4"}>
																					<div className="row ">
																						<div id="collapse1" className={"col-12 ml-5 ml-sm-0 "+ Style.returnabletxt} data-toggle="collapse" data-target="#returnPolicy" onClick={this.collapseClick.bind(this)}>
																							This item is non-returnable &nbsp;&nbsp;&nbsp;
																							<i className="fa fa-chevron-right" aria-hidden="true"></i><br/>
																						</div>
																						<div className="col-12 collapse px-4" id="returnPolicy">
																							<p>For more details about knock knock return <br/> policy &nbsp;
																								<div className={"col-4 float-right "+Style.returnLink}> 
																									<a href="/privacy-policy" target="_blank">Read more</a>
																								</div>
																							</p>
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
												</div>
											:
												null
										}
									</div>
								</div>
								{
									this.state.newProducts && this.state.newProducts.length> 0
									?
										<ProductCarouselView 
											blockTitle         = {"Similar Items"}
											newProducts        = {this.state.newProducts}
											vendor_ID          = {this.props.vendor_id}
											vendorlocation_ID  = {this.props.vendorlocation_id}
											userLatitude       = {this.state.userLongitude}
											userLongitude      = {this.state.userLongitude}
											sectionUrl         = {this.state.sectionUrl}
											subCategoryUrl     = {this.props.subCategoryurl}
											categoryUrl        = {this.props.categoryurl}
											className          = "font-weight-bold"
										/>
									:
										null
								}
								{
									this.state.subCategoryData && this.state.subCategoryData.length> 0
									?
										<SubCategoryBlock 
											blocktitle         = {"Shop By Sub Categories"}
											subCategoryData    = {this.state.subCategoryData}
											vendor_ID          = {this.props.vendor_id}
											vendorlocation_ID  = {this.props.vendorlocation_id}
											userLatitude       = {this.state.userLongitude}
											userLongitude      = {this.state.userLongitude}
											sectionUrl         = {this.state.sectionUrl}
											subCategoryUrl     = {this.props.subCategoryurl}
											categoryUrl        = {this.props.categoryurl}
											className          ={"font-weight-bold "+Style.ShopBySubCategories}
										/>
									:
										null
								}
								{
									this.props.productID
									?
									<ProductReviewList 
										productID = {this.props.productID}
									/>
									:
										null
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