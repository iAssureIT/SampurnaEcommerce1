import React, { Component } from 'react';
import ProductViewEcommerce from "./ProductViewEcommerce.js";
// import ProductViewEcommerceDetailsReviewFAQ from "../../blocks/ProductViewEcommerceDetailsReviewFAQ/ProductViewEcommerceDetailsReviewFAQ.js";
import axios       from 'axios';
import dynamic from 'next/dynamic';
import Head        from 'next/head'
import getConfig   from 'next/config';
import Header               from '../../../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
// import MasterPage  from '../../../../MasterPage/MasterPage.js'
const { publicRuntimeConfig } = getConfig();
var SITE_NAME =  publicRuntimeConfig.SITE_NAME;
// console.log("SITE_NAME===",SITE_NAME);

class ProductDetailsEcommerce extends Component {
	constructor(props){
    super(props);
	    this.state = {
			 bestSellerProducts:[],
			 productID : ''
	    };
       // this.bestSellerData();
	} 

	componentDidMount(){
		// console.log("componentDidMount in product",this.props);
		
		var pageUrl = window.location.pathname;
		let a = pageUrl ? pageUrl.split('/') : "";
		const urlParam =a[3];
		this.setState({
			productID : urlParam
		});

	}
	// pageHead(){
	// 	return (
	// 		this.props.pageData.pageHead && Object.keys(this.props.pageData.pageHead).length > 0 ? 
	// 		<Head>
	// 			<meta charset="UTF-8" />
	// 			<title>{SITE_NAME} | Product Detail</title>
	// 			<meta name="description" content={this.props.pageData.pageHead.pageDescription === undefined ? null : this.props.pageData.pageHead.pageDescription} /> 
	// 			<meta name="keywords" content={this.props.pageData.pageHead.pageWords[0]} />
	// 			<meta name="author" content={this.props.pageData.pageHead.pageWords[0]} />
	// 			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	// 			{/* <title>{this.props.pageData.pageHead.pageWords[0]}</title> */}
	// 		</Head>
	// 		: 
	// 		<Head>
	// 			<meta charSet="UTF-8" />
	// 			<meta name="author" content="" />
	// 			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	// 			<title>{SITE_NAME} | Product Detail</title>
	// 		</Head>
	// 	)
	// }
  	  	
  	render() {
		// console.log("paths  =====",this.props);
		return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
		       {/* {this.pageHead()} */}
				<Header/>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop180  backColorGray">
					<ProductViewEcommerce productID = { this.state.productID } />
				</div>
				<Footer/>
            </div>
		);
	}
}
  
export default ProductDetailsEcommerce;
  
