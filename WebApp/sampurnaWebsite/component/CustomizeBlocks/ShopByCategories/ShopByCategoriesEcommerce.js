import React, { Component } from 'react';
import "../../../sites/currentSite/blocks/ShopByCategoriesEcommerce.css";
import $ from 'jquery';
import axios from 'axios';
import { connect } from 'react-redux';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import notavailable from '../../../sites/currentSite/images/notavailable.jpg';

class ShopByCategoriesEcommerce extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	addtocart(event) {
		event.preventDefault();
		var id = event.target.id;

		axios.get('/api/products/get/one/' + id)
			.then((response) => {
				var totalForQantity = parseInt(1 * response.data.discountedPrice);
				const userid = localStorage.getItem('user_ID');

				const formValues = {
					"user_ID": userid,
					"product_ID": response.data._id,
					"currency": response.data.currency,
					"productCode": response.data.productCode,
					"productName": response.data.productName,
					"section_ID": response.data.section_ID,
					"section": response.data.section,
					"category_ID": response.data.category_ID,
					"category": response.data.category,
					"subCategory_ID": response.data.subCategory_ID,
					"subCategory": response.data.subCategory,
					"productImage": response.data.productImage,
					"quantity": 1,
					"discountedPrice": parseInt(response.data.discountedPrice),
					"originalPrice": parseInt(response.data.originalPrice),
					"totalForQantity": totalForQantity,

				}
				axios.post('/api/carts/post', formValues)
					.then((response) => {
						window.fbq('track', 'AddToCart');

						// swal(response.data.message);
						this.props.changeCart(response.data.cartCount);

					})
					.catch((error) => {
						console.log('error', error);
					})
			})
			.catch((error) => {
				console.log('error', error);
			})
	}


	addtowishlist(event) {
		event.preventDefault();
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
						window.fbq('track', 'AddToWishlist');
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
						this.props.changeWishlistCount(response.data.wishlistCount);
					})
					.catch((error) => {
						console.log('error', error);
					})
			})
			.catch((error) => {
				console.log('error', error);
			})
	}

	render() {

		const token = localStorage.getItem("user_ID");
		var plength = this.props.newProducts && this.props.newProducts.length > 0 ? this.props.newProducts.length : 0;
		var productlength = plength % 3;
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  backColorWhite">
						<div className="customPillsEcommerceorange col-lg-offset-4 col-lg-4">
							<h3><b>{this.props.title}</b></h3>
						</div>
					</div>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 grayLine"></div>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ecommerceCollage">
						<div className="col-lg-10 col-lg-offset-1 col-md-12 backColorWhite">
							<div className="row">
								{this.props.newProducts && this.props.newProducts.length > 0 ?
									this.props.newProducts.map((data, index) => {

										if (productlength == 2) {
											if (plength === index + 2) {
												var classes = "mt20 col-lg-4  col-lg-offset-2";
											} else {
												var classes = "mt20 col-lg-4";
											}
										} else if (productlength == 1) {
											if (plength === index + 1) {
												var classes = "mt20 col-lg-4 col-lg-offset-4";
											} else {
												var classes = "mt20 col-lg-4";
											}
										} else {
											var classes = "mt20 col-lg-4";
										}
										return (
											<div className={classes} key={index}>
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blogs">
													<div className="">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 flip-box ecommerceProduct ">
															{
																data.offered == true ?
																	<div className="row">
																		<div className="offerDetailstrue col-lg-6">Offer Price </div><div className="offerDetailstrue col-lg-6 "><span className="pull-right"><i className="fa fa-inr"></i>&nbsp;{data.discountedPrice}</span></div>
																	</div>
																	:
																	<div className="row">
																		<div className="offerDetails col-lg-6">Offer Price </div><div className="offerDetails col-lg-6 "><span className="pull-right"><i className="fa fa-inr"></i>&nbsp;{data.discountedPrice}</span></div>
																	</div>
															}
															<a title="View Product" href={"/ProductDetailsEcommerce/" + data._id}><div className=" flip-box-inner">
																<img src={data.productImage[0] ? data.productImage[0] : notavailable} className="flip-box-front img-responsive" alt="blog1" />
																<img src={data.productImage[1] ? data.productImage[1] : (data.productImage[0] ? data.productImage[0] : notavailable)} className="flip-box-back img-responsive " alt="blog1" />
															</div></a>
															<div id="" className="col-lg-6 col-sm-12 col-xs-12 mt40 row">
																{/*<fieldset className="ratingReview stars ">
																		<input type="radio" id="star5" name="ratingReview" value="5" /><label htmlFor="star5"></label>
																		<input type="radio" id="star4" name="ratingReview" value="4" /><label htmlFor="star4"></label>
																		<input type="radio" id="star3" name="ratingReview" value="3" /><label htmlFor="star3"></label>
																		<input type="radio" id="star2" name="ratingReview" value="2" /><label htmlFor="star2"></label>
																		<input type="radio" id="star1" name="ratingReview" value="1"/><label htmlFor="star1"></label>
																	</fieldset>*/}
																<div className="clearfix "></div>
															</div>
															<label className="pull-right priceDivProduct mt40"><i className={"fa fa-" + data.currency}> </i>&nbsp;{data.originalPrice}</label><br />
															<span className="col-lg-12 row nameOfProduct">{data.productName}</span>
															{
																token ?

																	<div className="optionDiv col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
																		<div data-toggle="tooltip" title="Add to cart" className="col-lg-3 col-md-3 col-sm-3 col-xs-3  " >

																			{
																				token ?
																					<div className={data.webCategory == "Grocery fa fa-shopping-cart" ? "iconContainerGrocery fa fa-shopping-cart" : "iconContainerEcommerce fa fa-shopping-cart"} onClick={this.addtocart.bind(this)} id={data._id}></div>
																					:
																					<a href="/login" className="iconContainerEcommerce"><i className="fa fa-shopping-cart"></i></a>
																			}
																		</div>
																		<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3" data-toggle="tooltip" title="Add to wishlist">
																			{
																				token ?
																					<div className={data.webCategory == "Grocery" ? "iconContainerGrocery fa fa-heart" : "iconContainerEcommerce  fa fa-heart"} onClick={this.addtowishlist.bind(this)} id={data._id} ></div>
																					:
																					<a href="/login" className={data.webCategory == "Grocery" ? "iconContainerGrocery" : "iconContainerEcommerce  "}><i className="fa fa-heart "></i></a>

																			}


																		</div>
																		<div data-toggle="tooltip" title="View product">
																			<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3  mr0 ">
																				<a href={"/ProductDetailsEcommerce/" + data._id}><div className={data.webCategory == "Grocery" ? "iconContainerGrocery  " : "iconContainerEcommerce ht20"}><i className="fa fa-eye "></i></div></a>
																			</div>
																		</div>
																	</div>
																	:
																	<div className="optionDiv col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
																		<div data-toggle="tooltip" title="Add to cart" className="col-lg-3 col-md-3 col-sm-3 col-xs-3  " >

																			{
																				token ?
																					<div className={data.webCategory == "Grocery fa fa-shopping-cart" ? "iconContainerGrocery fa fa-shopping-cart" : "iconContainerEcommerce fa fa-shopping-cart"} onClick={this.addtocart.bind(this)} id={data._id}></div>
																					:
																					<a href="/login" className="iconContainerEcommerce"><i className="fa fa-shopping-cart"></i></a>
																			}
																		</div>
																		<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3" data-toggle="tooltip" title="Add to wishlist">
																			{
																				token ?
																					<div className={data.webCategory == "Grocery" ? "iconContainerGrocery fa fa-heart" : "iconContainerEcommerce fa fa-heart"} onClick={this.addtowishlist.bind(this)} id={data._id} ></div>
																					:
																					<a href="/login" className={data.webCategory == "Grocery" ? "iconContainerGrocery" : "iconContainerEcommerce"}><i className="fa fa-heart "></i></a>

																			}


																		</div>
																		<div data-toggle="tooltip" title="View product">
																			<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mr0 ">
																				{
																					token ?
																						<a href={"/ProductDetailsEcommerce/" + data._id}> <div className={data.webCategory == "Grocery" ? "iconContainerGrocery  col-lg-12" : "iconContainerEcommerce ht20 col-lg-12 "}><i className="fa fa-eye "></i></div></a>
																						:
																						<a href={"/ProductDetailsEcommerce/" + data._id}> <span className={data.webCategory == "Grocery" ? "iconContainerGrocery " : "iconContainerEcommerce"}><i className="fa fa-eye "></i></span></a>

																				}
																			</div>
																		</div>
																	</div>
															}

														</div>

													</div>
												</div>
											</div>
										);
									})
									:
									null
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default (ShopByCategoriesEcommerce);
