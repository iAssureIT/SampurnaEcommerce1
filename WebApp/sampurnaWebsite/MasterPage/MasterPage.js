import React from 'react';
// import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import {getBlockData} from '../redux/actions/counterActions';
import ScrollTop from '../Themes/Sampurna/blocks/StaticBlocks/ScrollTop/ScrollTop.js';
import Banner from '../Themes/Sampurna/blocks/3_BannerManagement/Banner/Banner.js';

// import BlogCarousel from '../blockTemplate/BlogCarousel/BlogCarousel.js';
// import BreadCrumbs from '../Themes/Sampurna/block/StaticBlocks/BreadCrumbs/BreadCrumbs.js';

const { publicRuntimeConfig } = getConfig();
//get site name from next.config.js
const SITE_NAME =  publicRuntimeConfig.SITE_NAME; 
const Header = dynamic(() => import('../Themes/'+SITE_NAME+'/blocks/5_HeaderBlocks/SampurnaHeader/Header.js'));
const Footer = dynamic(() => import('../Themes/'+SITE_NAME+'/blocks/6_FooterBlocks/Footer/Footer.js'));
// const Banner = dynamic(() => import('../Themes/' +SITE_NAME+'/blocks/3_BannerManagement/Banner/Banner.js'));


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
			},
			pageLoaded : false,
		};
	}
	componentDidMount(){
		// console.log('inside componentDidMount => ',this.props);
		// console.log("pageLoaded===",this.state.pageLoaded);
		this.getPreferences();
		// console.log("1 timestamp = ", new Date() );
		window.onload = (event) => {	
			// console.log('inside onload');
			this.setState({
				"pageLoaded" : true
			},()=>{
				// console.log("2 timestamp = ", new Date() );
				// console.log('Page loaded');
			})
		};		
	}
	getInitialProps(){
		// console.log("inside getInitial props");
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
			this.props.pageData && this.props.pageData.pageHead && Object.keys(this.props.pageData.pageHead).length > 0 ? 
			<Head>
				<meta charSet="UTF-8" />
				<title>{SITE_NAME} | {this.props.pageData.pageTitle}</title>
				<meta name="description" content={this.props.pageData.pageHead.pageDescription === undefined ? null : this.props.pageData.pageHead.pageDescription} /> 
				<meta name="keywords" content={this.props.pageData.pageHead.pageWords[0]} />
				<link rel="canonical" href="https://www.sampurna.com/"/>
				<meta name="author" content={this.props.pageData.pageHead.pageWords[0]} />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				{/* <title>{this.props.pageData.pageHead.pageWords[0]}</title> */}
			</Head>
			: 
			<Head>
				<meta charSet="UTF-8" />
				<meta name="author" content="" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{SITE_NAME}</title>
			</Head>
		)
	}

   render() {	 
	// console.log("2. render");
	
	// console.log("masterpage render this.props.pagedata===",this.props.pageData);
    return (		
		<div className="col-12 NoPadding masterPageWrapper">
			{this.pageHead()}
			<Header/>			 
			<div className="col-12 NoPadding componentWrapper">

			{/* {this.state.pageLoaded ? */}
				{this.props.pageData && this.props.pageData.pageBlocks && this.props.pageData.pageBlocks.length > 0 ?
					this.props.pageData.pageBlocks.map((result, index)=>{
						// console.log("this.props.pageData.pageBlocks===",this.props.pageData.pageBlocks);
						var component = result._id ? result.blockComponentName : "TitleDesc";
						var blockFolderName = result._id ? result.blockFolderName : "1_StandardBlocks";
						var block_id=result.block_id?result.block_id._id:"";
						// console.log("component==",component);
						const OtherComponent = dynamic(() => import('../Themes/'+SITE_NAME+'/blocks/'+blockFolderName+'/'+component+'/'+component+'.js'),					
						{
							loading: () =>
								<div className="col-2 offset-5 loading">
									<img src="/images/eCommerce/loader.gif" className="col-12 "></img>
								</div> 
						});
						
						return(						
							<div className="col-12 NoPadding" key={index}>
								<OtherComponent block_id={block_id} key={index}/>							
							</div>						
						)
					})
				:
					<div className=" col-12 NoPadding">								
						<a href="/"><img className=" col-12 NoPadding img-responsive" src="/images/eCommerce/404-Page.gif" /></a>
					</div>
	
				
				
			// :
				
			// 	<div className="col-12 NoPadding">
			// 		{/* <Banner />	 */}
			// 		<div> Page loading...</div>					
			// 	</div>
				
			//  }
			
			}
			</div>
			
			{/* {this.props.pageData.pageURL === 'homepage' ? <BlogCarousel/> : null} */}
			{/* <ScrollTop /> */}
			<Footer/>
		</div>
    );
  }
}
  
export default MasterPage;