import React, { Component } from 'react';
import ProductViewEcommerce from "./ProductViewEcommerce.js";
// import ProductViewEcommerceDetailsReviewFAQ from "../../blocks/ProductViewEcommerceDetailsReviewFAQ/ProductViewEcommerceDetailsReviewFAQ.js";
import axios       from 'axios';
import dynamic from 'next/dynamic';
import Head        from 'next/head'
import getConfig   from 'next/config';
import {connect}   from 'react-redux';
import {setBlockData ,setProductApiUrl} from '../../../../redux/actions/index.js';
import store       from '../../../../redux/store.js'
import Header               from '../../../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import MasterPage  from '../../../../MasterPage/MasterPage.js'
// import BreadCrumbs from '../../../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';
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
		store.dispatch(setProductApiUrl(this.props.productApi))
		
		var pageUrl = window.location.pathname;
		let a = pageUrl ? pageUrl.split('/') : "";
		const urlParam =a[3];
		this.setState({
			productID : urlParam
		});

	}
	pageHead(){
		return (
			this.props.pageData.pageHead && Object.keys(this.props.pageData.pageHead).length > 0 ? 
			<Head>
				<meta charset="UTF-8" />
				<title>{SITE_NAME} | Product Detail</title>
				<meta name="description" content={this.props.pageData.pageHead.pageDescription === undefined ? null : this.props.pageData.pageHead.pageDescription} /> 
				<meta name="keywords" content={this.props.pageData.pageHead.pageWords[0]} />
				<meta name="author" content={this.props.pageData.pageHead.pageWords[0]} />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				{/* <title>{this.props.pageData.pageHead.pageWords[0]}</title> */}
			</Head>
			: 
			<Head>
				<meta charSet="UTF-8" />
				<meta name="author" content="" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{SITE_NAME} | Product Detail</title>
			</Head>
		)
	}
  	  	
  	render() {
		// console.log("paths  =====",this.props);
		return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
		       {this.pageHead()}
				<Header/>
				{/* <BreadCrumbs /> */}
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop180  backColorGray">
				<ProductViewEcommerce productID = { this.state.productID } />
					{ this.props.pageData.pageBlocks && this.props.pageData.pageBlocks.length > 0 ?
						this.props.pageData.pageBlocks.map((result, index)=>{
						var component = result._id ? result.blockComponentName : "TitleDesc";
						var block_id=result.block_id._id;						
						var blockFolderName = result._id ? result.blockFolderName : "1_StandardBlocks";
					    const OtherComponent = dynamic(() => import('../../../../Themes/'+SITE_NAME+'/blocks/'+blockFolderName+'/'+component+'/'+component+'.js'),				
						{
							loading: () =>
							<div className="col-2 offset-5 loading">
								<img src="/images/eCommerce/loader.gif" className=""></img>
							</div> 
						}
						); 
						return(
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding" key={index}>
								{/* <OtherComponent block_id={block_id} key={index}/> */}
							</div>
						)
					})
					: 
					<div><h2>There is no content</h2></div>
					}

				</div>
				<Footer/>
            </div>
		);
	}
}

export async function getServerSideProps({query}){
	// console.log("query.product",query.category)
	var productApi = "/api/products/get/listbycategory/"+query.category;
	const urlParam = 'related-carousel'
	const res = await axios.get("api/pages/get/page_block/"+urlParam)
	const pageData = await res.data;
	return {
	  props:{
		pageData,
		productApi
	  }
	}
  }
  
  const mapStateToProps = state => (
	// console.log("mapStateToProps in produt page",state.data),
	{data: state.data}
  );
  
  const mapDispatchToProps = {
	setBlockData: setBlockData,
	setProductApiUrl: setProductApiUrl
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailsEcommerce);
  
