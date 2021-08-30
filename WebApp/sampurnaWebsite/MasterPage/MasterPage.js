import React                 from 'react';
import axios                 from 'axios';
import {connect}             from 'react-redux';
import dynamic               from 'next/dynamic';
import getConfig             from 'next/config';
import Head                  from 'next/head'
// import ScrollTop             from '../Themes/Sampurna/blocks/StaticBlocks/ScrollTop/ScrollTop.js';
// import Banner                from '../Themes/Sampurna/blocks/3_BannerManagement/Banner/Banner.js';
// import BlogCarousel          from '../blockTemplate/BlogCarousel/BlogCarousel.js';

const { publicRuntimeConfig } = getConfig();
const SITE_NAME   =  publicRuntimeConfig.SITE_NAME; 
const MYSITE_NAME =  publicRuntimeConfig.MYSITE_NAME; 
// const Header      = dynamic(() => import('../Themes/'+SITE_NAME+'/blocks/5_HeaderBlocks/SampurnaHeader/HeaderNew.js'));
const Header      = dynamic(() => import('../Themes/'+SITE_NAME+'/blocks/5_HeaderBlocks/SampurnaHeader/Header.js'));
const Footer      = dynamic(() => import('../Themes/'+SITE_NAME+'/blocks/6_FooterBlocks/Footer/Footer.js'));

class MasterPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageData     :{},
			Blocks       :[],
			blocks       :"",
			ListOfBlocks : "",
			pageHead     : {
				pageAuthor		: "",
				pageDescription	: "",
				pageWords		: [""],
			},
			pageLoaded    : false,
			deliveryLocation : {},
			userDetails      : {},
		};
	}
	componentDidMount(){
		// console.log("inside masterpage");
		window.onload = (event) => {	
			this.setState({
				"pageLoaded" : true
			})
		};

        // console.log("*** Loaded MasterPage ***");

	}


	pageHead(){
		return (
			this.props.pageData && this.props.pageData.pageHead && Object.keys(this.props.pageData.pageHead).length > 0 ? 
			<Head>
				<meta charSet="UTF-8" />
				<title>{MYSITE_NAME} | {this.props.pageData.pageTitle}</title>
				<meta name="description" content={this.props.pageData.pageHead.pageDescription === undefined ? null : this.props.pageData.pageHead.pageDescription} /> 
				<meta name="keywords" content={this.props.pageData.pageHead.pageWords[0]} />
				<link rel="canonical" href="https://www.sampurna.com/"/>
				<meta name="author" content={this.props.pageData.pageHead.pageWords[0]} />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			: 
			<Head>
				<meta charSet="UTF-8" />
				<meta name="author" content="" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{MYSITE_NAME}</title>
			</Head>
		)
	}

   render() {
    // console.log("this.props.pageData==",this.props.pageData);
    return (	
		<div className="col-12 NoPadding">
			<div className="col-12 NoPadding masterPageWrapper">
				{this.pageHead()}

				<Header/>

				<div className="col-12 NoPadding componentWrapper">
				{/* {this.state.pageLoaded ? */}
					{this.props.pageData && this.props.pageData.pageBlocks && this.props.pageData.pageBlocks.length > 0 ?
						this.props.pageData.pageBlocks.map((result, index)=>{
							var component = result._id ? result.blockComponentName : "TitleDesc";
							var blockFolderName = result._id ? result.blockFolderName : "1_StandardBlocks";
							var block_id=result.block_id?result.block_id._id:"";
							console.log("component==",component);
							const OtherComponent = dynamic(() => import('../Themes/'+SITE_NAME+'/blocks/'+blockFolderName+'/'+component+'/'+component+'.js'),
							{
								loading: () =>
									<div className="col-2 offset-5 loading">
										<img src="/images/eCommerce/loader.gif" className="col-12 "></img>
									</div> 
							});
							console.log("***  Loading "+component+"  ***");
							return(		
								<OtherComponent block_id={block_id} key={index}/>
							)
						})
					:
						<div className=" col-12 NoPadding">								
							<a href="/"><img className=" col-12 NoPadding img-responsive" src="/images/eCommerce/404-Page.gif" /></a>
						</div>
					
				}
				</div>

				<Footer/>
			</div>
		</div>
    );
  }
}
  
export default MasterPage;