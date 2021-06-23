import React, { Component } from 'react';
import ProductViewEcommerce from "./ProductViewEcommerce.js";
import axios                from 'axios';
import dynamic              from 'next/dynamic';
import Head                 from 'next/head'
import getConfig            from 'next/config';
import Header               from '../../../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Style                  from './product_detail.module.css';

const { publicRuntimeConfig } = getConfig();
var SITE_NAME =  publicRuntimeConfig.SITE_NAME;

class ProductDetailsEcommerce extends Component {
	constructor(props){
    super(props);
	    this.state = {
			 bestSellerProducts:[],
			 productID : ''
	    };
	} 

	componentDidMount(){
		var pageUrl = window.location.pathname;
		let a = pageUrl ? pageUrl.split('/') : "";
		const urlParam =a[3];
		this.setState({
			productID : urlParam
		});

	}
  	render() {
		return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
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
  
