import React from 'react';
// import React, { lazy, Suspense } from 'react';
import loadable from '@loadable/component';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getBlockData} from '../../redux/actions/counterActions';
import Header from '../blockTemplate/Header/Header.js';
// import Header from '../blockTemplate/Multistore_Header/Header.js';
import Footer from '../blockTemplate/Footer/Footer.js';
import BlogCarousel from '../blockTemplate/BlogCarousel/BlogCarousel.js';
import BreadCrumbs from '../CustomizeBlocks/BreadCrumbs/BreadCrumbs.js';
import ScrollTop   from '../CustomizeBlocks/ScrollTop/ScrollTop.js';
const { publicRuntimeConfig } = getConfig();
//get site name from next.config.js
var SITE_NAME =  publicRuntimeConfig.SITE_NAME; 
// console.log("SITE_NAME",SITE_NAME)
class MasterPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageData:{},
			Blocks:[],
			blocks:"",
			ListOfBlocks : "",
			pageHead : {
				pageAuthor		: "",
				pageDescription	: "",
				pageWords		: [""],
			}
		};
	}
	componentDidMount(){
		// console.log("inside masterpage componentDidmount");
		this.getPreferences();
	}
	getPreferences(){
	//Get all preferences and store them in localstorage	
	axios.get("/api/adminpreference/get")
	.then(preferences =>{
		var askpincodeToUser = preferences.data[0].askPincodeToUser;
		localStorage.setItem('preferences',askpincodeToUser);
		localStorage.setItem("websiteModel",preferences.data[0].websiteModel);      
		localStorage.setItem("showLoginAs",preferences.data[0].showLoginAs); 
		// localStorage.setItem('preferences', JSON.stringify(preferences));
	})
	.catch(error=>{
		console.log("Error in preferences = ", error);
	})

	}
	pageHead(){
		return (
			this.props.pageData.pageHead && Object.keys(this.props.pageData.pageHead).length > 0 ? 
			<Head>
				<meta charSet="UTF-8" />
				<title>{SITE_NAME} | {this.props.pageData.pageTitle}</title>
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
				<title>Static data</title>
			</Head>
		)
	}

   render() {	 
	// console.log("this.props.pagedata===",this.props.pageData);
    return (
		
		<div className="col-12 NoPadding masterPageWrapper">
			{this.pageHead()}
			<Header/>			
			<div className="col-lg-12 NoPadding componentWrapper">
			{ this.props.pageData.pageBlocks && this.props.pageData.pageBlocks.length > 0 ?
                this.props.pageData.pageBlocks.map((result, index)=>{
					var component = result._id ? result.blockComponentName : "TitleDesc";
					var block_id=result.block_id._id;
					// console.log("OtherComponent==",component);
					const OtherComponent = dynamic(() => import('../blockTemplate/'+component+'/'+component+'.js'),
					
					{
						loading: () =>
							<div className="col-lg-6 col-lg-offset-3 col-md-4 col-md-offset-4  col-sm-4 col-sm-offset-4 col-xs-12 loading abc">
								<img src="/images/loader.gif" className=""></img>
							</div> 
					});
					
					return(						
						<div className="col-12 NoPadding" key={index}>
							<OtherComponent block_id={block_id} key={index}/>							
						</div>						
                    )
				})
			:
			<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
				<a href="/"><img className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding" src="/images/eCommerce/404-Page.gif" /></a>
			</div>
			}
			</div>	

			{this.props.pageData.pageURL === 'homepage' ? <BlogCarousel/> : null}

			<ScrollTop />
			<Footer/>
			
		</div>
    );
  }
}
  
const mapStateToProps = state => (
	// console.log("redux store data in masterpage",state),
    {pageData: state.data.pageData}
);

const mapDispatchToProps = {
    getBlockData: getBlockData,
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterPage);
