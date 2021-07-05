import React, { Component } from 'react';
import axios                from 'axios';
import { connect }          from 'react-redux';
import getConfig            from 'next/config';
import { withRouter }       from 'next/router'
import dynamic              from 'next/dynamic';
import CategoryBlock        from '../../../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/CategoryBlock.js';
import Message              from '../../../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js';
import {getCartData,getWishlistData, updateCartCount}  from '../../../../redux/actions/index.js'; 

import Style                  from './product_detail.module.css';


const { publicRuntimeConfig } = getConfig();
class ProductDetailView extends Component {
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
		// console.log("url===",url);
		if(url[4] !== "undefined"){	
		  var vendor_ID              = url[4];
		  var vendorlocation_ID      = url[5];
		  var productId             = url[6];
		}
		if(sampurnaWebsiteDetails && sampurnaWebsiteDetails.preferences){
			this.setState({
				websiteModel : sampurnaWebsiteDetails.preferences.websiteModel,
				showLoginAs  : sampurnaWebsiteDetails.preferences.showLoginAs,
				currency     : sampurnaWebsiteDetails.preferences.currency,
			})
		}
		
	}
	addtocart(event) {
		event.preventDefault();	
		if(this.state.user_ID){
			var id = event.target.id;
			var availableQuantity = event.target.getAttribute('availableQuantity');
			const formValues = {
				"user_ID"    : this.state.user_ID,
				"product_ID" : event.target.id,
				"quantity"   : 1,   
				"vendor_ID"  : event.target.getAttribute('vendor_id'),       
			  } 
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
			console.log("product id===",id);
			axios.get('/api/products/get/one/' + id)
				.then((response) => {
					const formValues =
					{
						"user_ID": this.state.user_ID,
						"product_ID": response.data._id,
					}
					axios.post('/api/wishlist/post', formValues)
						.then((response) => {
							this.props.recentWishlistData();
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
	render() {
		// console.log("product wishlistdata  =====",this.props.recentWishlistData);
        var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === this.state.productData._id) : [];
		var wishClass = '';
		var tooltipMsg = '';
		if (x && x.length > 0) {
			wishClass = '';
			// console.log("wishClass=",wishClass);
			tooltipMsg = 'Remove from wishlist';
		} else {
			wishClass = 'r';
			// console.log("wishClass=",wishClass);
			tooltipMsg = 'Add To Wishlist';
		} 
		return (
			<section>
				<div className="col-12 mt20 mb20 boxBorder mobileViewNoPadding">
                {this.state.productData?
							<div className="col-12">
								<div className="row">
								{/* {this.state.productData.brandNameRlang?
									<div className={"col-12 globalProduct_brand RegionalFont NoPadding productDetailsMB "} title={this.state.productData.brandNameRlang}>{this.state.productData.brandNameRlang}</div>
									:
									<div className={"col-12 globalProduct_brand NoPadding productDetailsMB"} title={this.state.productData.brand}>{this.state.productData.brand}</div>
								} */}
								<div className={"col-12 globalProduct_brand NoPadding productDetailsMB"} title={this.state.productData.brand}>{this.state.productData.brand}</div>
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
									<div className="col-12 NoPadding brandName">Brand : {this.state.productData.brand}</div> 
								</div>
								<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  }>
								{                                  
									this.state.productData.discountPercent ?
									<div className="col-12 NoPadding priceWrapper">
										<span className="price"><span className="">&nbsp;{this.state.currency} &nbsp;{this.state.productData.originalPrice}&nbsp;</span>&nbsp;
										{this.state.currency} &nbsp;{(this.state.productData.discountedPrice).toFixed(2)} 
									</span>
									</div>
									:  
									<div className={"col-12 NoPadding  priceWrapper NoPadding"}>
									<span className="price">
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
																{this.state.user_ID?
																<div id={this.state.productData._id} vendor_id={this.state.productData.vendor_ID} availablequantity={this.state.productData.availableQuantity} onClick={this.addtocart.bind(this)} className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 viewAddtoCart globaleCommLargeBtn"  > &nbsp; Add To Cart</div>
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
												{this.state.user_ID?
													<div id={this.state.productData._id} title={this.state.wishTooltip} onClick={this.addtowishlist.bind(this)} className={" col-lg-12 col-md-12 col-sm-12 col-xs-12 globaleCommLargeBtn "+this.state.wishIconClass}>
														<i className={"fa abc fa-heart"+wishClass +" " +" heartIcon"}></i>
													</div>
												:
													<div id={this.state.productData._id} title={this.state.wishTooltip} onClick={this.addtowishlist.bind(this)} className={" col-lg-12 col-md-12 col-sm-12 col-xs-12 globaleCommLargeBtn "+this.state.wishIconClass} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal">
														<i className={"fa abc fa-heart"+wishClass +" " +"heartIcon"}></i>
													</div>												
												}
											</div>	
											<div className="col-12 productDetailWrapper mt-4">
												<h6>Products Information</h6>
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
													<div className="col-12 singleProductDetail">
														<span className="col-4">Size</span>
														<span className="col-1">:</span>
														<span className="col-6">{this.state.productData.size}</span>
													</div>
												}
											</div>								
											</div>										
											</form>
										</div>
									</div>
								</div>
							</div>
							:null
							}
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailView);