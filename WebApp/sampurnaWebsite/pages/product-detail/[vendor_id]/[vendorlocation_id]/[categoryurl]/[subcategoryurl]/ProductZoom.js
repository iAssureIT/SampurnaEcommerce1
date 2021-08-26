import React, { Component } from 'react';
import axios                from 'axios';
import ReactImageZoom       from 'react-image-zoom';
import Carousel             from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {ntc}                from '../../../../../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';
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
			"productData"   : [],
			"user_ID"       : "",
			"selectedImage" : false
		};
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
	
	
	handleClickImg(event){
		var srcImage = event.currentTarget.id;
		// console.log("srcImage = ",srcImage);

		this.setState({
			selectedImage : srcImage,
			selectedProduct_id : this.props.productData._id
		})
		
	}
	render() {
		var myprops={};
		if(this.props.productData ){
			if(this.props.productData._id === this.state.selectedProduct_id){
				var productImg = this.state.selectedImage ? this.state.selectedImage : this.props.productData.productImage && this.props.productData.productImage.length > 0 ? this.props.productData.productImage[0] : '/images/eCommerce/notavailable.png';
			}else{
				var productImg = this.props.productData.productImage && this.props.productData.productImage.length > 0 ? this.props.productData.productImage[0] : '/images/eCommerce/notavailable.png';
			}
			// myprops = {offset: { vertical:0, horizontal: 0 }, zoomLensStyle: 'cursor: zoom-in;', zoomStyle: 'z-index:1000;background-color:#fff; height:400px; width:600px; box-shadow: 0 4px 20px 2px rgba(0,0,0,.2);border-radius: 8px; d-none', img: this.props.productData.productImage && this.props.productData.productImage.length > 0 ? this.props.productData.productImage[0] : '/images/eCommerce/notavailable.png' };
			myprops = {offset: { vertical:0, horizontal: 0 }, zoomLensStyle: 'cursor: zoom-in;', zoomStyle: 'z-index:1000;background-color:#fff; height:400px; width:600px; box-shadow: 0 4px 20px 2px rgba(0,0,0,.2);border-radius: 8px; d-none', img: productImg };
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
										{this.props.productData.discountPercent ? <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 "  +Style.discountBadge}>{Math.floor(this.props.productData.discountPercent)}% off</div> : null}
										<div id="react-app" className={"col-12 item productZoomBlock img-responsiveProduct " +Style.zoomImgWrapper}>
											{this.props.productData &&
												<ReactImageZoom className="d-none d-lg-block d-xl-block" {...myprops} />												
											}					
										</div> 
										
										<div id="" className="col-12 NoPadding mt-3">
										<div className="col-12">
											<Carousel
											className="productview"
											swipeable={false}
											draggable={false}
											showDots={false}
											responsive={responsive}
											ssr={true} // means to render carousel on server-side.
											infinite={true}
											autoPlay={false}
											autoPlaySpeed={3000}
											keyBoardControl={true}
											customTransition="all .20"
											transitionDuration={500}
											containerClass="carousel-container"
											removeArrowOnDeviceType={["Desktop","tablet", "mobile"]}
											deviceType={this.props.deviceType}
											//dotListClass="custom-dot-list-style"
											itemClass={"carousel-item-padding-10-px " +Style.smallBoxImg}>
											{	
												this.props.productData && Array.isArray(this.props.productData.productImage) && this.props.productData.productImage.map((data, index) => {
													if(data === this.state.selectedImage){
														var itemClass = itemClass + " " + Style.activeThumbnail;
													}else{
														var itemClass = itemClass;														
													}
													return(
														// <img src={data} className="img-responsive prodImgMobileView" onClick={this.onClickImg.bind(this,data)} key={index}></img>	
														<Image                                           
															src={data}
															alt="ProductImg" 
															className={"img-responsive prodImgMobileView " +Style.imageBoxPrd+" "+Style.activeThumbnail}
															height={200}
															width={400} 
															layout={'intrinsic'}
															id={data}
															onClick={this.handleClickImg.bind(this)}
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
					</div>
				:
					null
				}
			</div>
		);
	}
}
  export default ProductZoom;