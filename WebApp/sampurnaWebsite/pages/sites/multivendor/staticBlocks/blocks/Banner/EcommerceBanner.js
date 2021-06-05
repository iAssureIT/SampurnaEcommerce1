import React, { Component } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
// import Loadable    from 'react-loadable';
import "../../../sites/currentSite/blocks/Banner.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/carousel.js';	

export default class EcommerceBanner extends Component {
	constructor(props){
    super(props);
	    this.state = {
	      responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:1 
            }
          },
 	
	    };
  	}  
  render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 backColorWhite  marginTop180">
				<div className="row">
					<div className="">

						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bannerContainerEcomm">
							<div className="row">
						 		<OwlCarousel
									    className="owl-theme bannercaro"
									    loop
                            			responsive={this.state.responsive} 
			                            autoplay={true}
			                            autoplayHoverPause={true}
			                            dots={true}
			                            dotData={true}
									>
									    <div className="item">
									    	<img className="img img-responsive bannerimg" src="/images/banner1.png" alt="banner" />
									    	<div className="col-lg-6 col-lg-offset-3 bannerAnimation">
									    		<img className="img img-responsive banner1upImg" src="/images/banner1(1).png" alt="banner"  />
									    		<div className="BannerTitle"> Anas Handicraft </div>
									    		<img className="img img-responsive banner1downImg" src="/images/banner1(2).png" alt="banner"  />
									    		<div className="bannertext">India's Largest Handicraft Furniture Mall</div>
									    	</div>
									    </div>
									    <div className="item">
									    	<img className="img img-responsive" src="/images/banner2.png" alt="banner" />
									    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 banner2AnimationImg">
									    		<img className="img img-responsive banner2sideImg" src="/images/banner2(1).png" alt="banner" />
									    	</div>
									    	<div className="banner2TextBox col-lg-12">									    		
									    		<div className="BannerTitle2"> Authenticate Handicraft </div>	
									    		<div className="col-lg-6 col-lg-offset-3">								    		
									    			<div className="col-lg-2 hrLineBanner"/>
									    			<div className="bannertext1 col-lg-8">Pure Sagwan and Sheesham Furniture</div>
									    			<div className="col-lg-2 hrLineBanner" />
									    		</div>
									    	</div>
									    </div>
									    <div className="item">
									    	<img className="img img-responsive" src="/images/banner3.png" alt="banner"  />
									    	<div className="col-lg-6 col-lg-offset-3 bannerAnimation">
									    		<img className="img img-responsive banner1upImg" src="/images/banner3(1).png" alt="banner"  />
									    		<div className="BannerTitle"> Royal Collection </div>
									    		<img className="img img-responsive banner1downImg" src="/images/banner3(2).png" alt="banner" />
									    		<div className="bannertext">At amazing disscount, door step delivery</div>
									    	</div>
									    </div>
									</OwlCarousel>
							</div>
						</div>
					</div>	
				</div>
			</div>
		);
	}
}