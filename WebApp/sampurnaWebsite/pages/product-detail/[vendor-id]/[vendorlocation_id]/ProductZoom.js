import React, { Component } from 'react';
import axios                from 'axios';
import ReactImageZoom       from 'react-image-zoom';
import Carousel             from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {ntc}                from '../../../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';
import { withRouter }       from 'next/router'
import dynamic              from 'next/dynamic';
import getConfig            from 'next/config';
import Image                from 'next/image';
import Style                  from './product_detail.module.css';

const { publicRuntimeConfig } = getConfig();

const responsive = {
	desktop: {
	  breakpoint: { max: 3000, min: 1024 },
	  items: 3,
	  slidesToSlide: 1 // optional, default to 1.
	},
	tablet: {
	  breakpoint: { max: 1024, min: 464 },
	  items: 3,
	  slidesToSlide: 1 // optional, default to 1.
	},
	mobile: {
	  breakpoint: { max: 464, min: 0 },
	  items: 2,
	  slidesToSlide: 1 // optional, default to 1.
	}
  };
  
class ProductZoom extends Component {
	constructor(props) {
		super(props);
		this.state = {		
			"productData": [],
			"user_ID"        : ""

		};
		this.changeImage = this.changeImage.bind(this);
	}

	async componentDidMount(){
		var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
            if(userDetails.user_id){
				this.setState({
					user_ID :  userDetails.user_id,
				},()=>{
				})
               
            }
        }
		if(sampurnaWebsiteDetails && sampurnaWebsiteDetails.preferences){
			this.setState({
				websiteModel : sampurnaWebsiteDetails.preferences.websiteModel,
				showLoginAs  : sampurnaWebsiteDetails.preferences.showLoginAs,
				currency     : sampurnaWebsiteDetails.preferences.currency,
			})
		}
    }	
	
	changeImage = (event) => {
		this.setState({
			selectedImage: event.target.src
		}, () => {

		});
	}
	
	onClickImg(data){
		this.setState({
			selectedImage : data
		})
		
	}
	render() {
		var myprops={};
		// console.log("productZoom data  =====",this.props.productData);
		// console.log("productZoom image  =====",this.props.productData.productImage);
		
		if(this.props.productData ){
			var productImg = this.props.productData.productImage && this.props.productData.productImage.length > 0 ? this.props.productData.productImage[0] : '/images/eCommerce/notavailable.png';
			myprops = { width: 400, height: 200, zoomWidth: 500, offset: { vertical: 100, horizontal: 100 }, zoomLensStyle: 'cursor: zoom-in;', zoomStyle: 'z-index:1000;background-color:#fff; height:400px;width:600px;box-shadow: 0 4px 20px 2px rgba(0,0,0,.2);border-radius: 8px;', img: this.props.productData.productImage && this.props.productData.productImage.length > 0 ? this.props.productData.productImage[0] : '/images/eCommerce/notavailable.png' };
			// const props = { width: 200, height: 200, zoomWidth: 100, offset: { vertical: 100, horizontal: 100 }, zoomLensStyle: 'cursor: zoom-in;', zoomStyle: 'z-index:1000;background-color:#fff; height:400px;width:600px;box-shadow: 0 4px 20px 2px rgba(0,0,0,.2);border-radius: 8px;', img: this.props.productData.productImage.length > 0 ? this.props.productData.productImage[0] : '/images/eCommerce/notavailable.png' };
		}
		return (
			<div className="col-12 col-xl-5 col-lg-5 col-md-12 col-sm-12 mt20 mb20 boxBorder mobileViewNoPadding NoPadding">
				{this.props.productData
				?
				<div className="col-12 boxBorderInner mobileViewNoPadding ">
					<div className="row">
						<div className=" col-12 stickyDiv">
							<div className="col-12 imageContainer imgCont">
								<div className="prod-detail-slider prod-detail-filpCommon col-12 ">
									{this.props.productData.discountPercent ? <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 "  +Style.discountBadge}>{Math.floor(this.props.productData.discountPercent)} % </div> : null}
									<div id="react-app" className={"col-12 item productZoomBlock img-responsiveProduct " +Style.zoomImgWrapper}>
										{this.props.productData &&
											<ReactImageZoom {...myprops} />
											
										}					
									</div> 
									{/* <div id="img-container" style="width: 400px">
										<img src="productImg" />
									</div> */}
									<div id="" className="col-12 NoPadding mt-3">
									<Carousel
										className="productview"
										swipeable={true}
										draggable={true}
										showDots={false}
										responsive={responsive}
										ssr={true} // means to render carousel on server-side.
										infinite={true}
										autoPlay={false}
										autoPlaySpeed={3000}
										keyBoardControl={true}
										customTransition="all .20"
										transitionDuration={500}
										// containerClass="carousel-container"
										removeArrowOnDeviceType={["Desktop","tablet", "mobile"]}
										deviceType={this.props.deviceType}
										//dotListClass="custom-dot-list-style"
										itemClass={"carousel-item-padding-10-px " +Style.smallBoxImg}>
										{	
											this.props.productData && Array.isArray(this.props.productData.productImage) && this.props.productData.productImage.map((data, index) => {
												// console.log("map 581 =========>",data)
												return(
													// <img src={data} className="img-responsive prodImgMobileView" onClick={this.onClickImg.bind(this,data)} key={index}></img>	
													<Image                                           
														src={data}
														alt="ProductImg" 
														className={"img-responsive prodImgMobileView " +Style.imageBoxPrd}
														height={200}
														width={400} 
														layout={'intrinsic'}
														// onClick={this.onClickImg.bind(this,data)}
														key={index}
													/>										
												);
											})
										}
									</Carousel>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
									:null}
			</div>
		);
	}
}
  export default ProductZoom;