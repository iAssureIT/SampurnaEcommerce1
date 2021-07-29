import React, { Component } from 'react';
import "./Aboutusclient.css";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';	
import Loadable                   from 'react-loadable';

const OwlCarousel = Loadable({
  loader: () => import('react-owl-carousel'),
  loading() {
    return <div className="col-sm-12 col-xs-12 col-lg-2 col-lg-offset-5 col-md-12 loadingImg"><img src="../images/loadersglms.gif" className="img-responsive" alt="loading"/></div>
  }
});

export default class Aboutusclient extends Component {
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
                items:7 
            }
          }

	    	
	    };
  	}  
  render() {
		return (
			<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 text-center aboutclientmb">
				<div className="row">
				<div className="aboutclient">
					<OwlCarousel
                            className="owl-theme aboutclientcaro"
                            margin={0}
                            nav={true}
                            responsive={this.state.responsive} 
                            autoplay={true}
                            autoplayHoverPause={true}
                        >
                          <div className="item aboutclientborder">
                            <i className="fa fa-futbol-o" aria-hidden="true"></i><br/>
                            <span>SPORT</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-television" aria-hidden="true"></i><br/>
                            <span>TELEVISION</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-laptop" aria-hidden="true"></i><br/>
                            <span>LAPTOP</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-desktop" aria-hidden="true"></i><br/>
                            <span>DESKTOP</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-cutlery" aria-hidden="true"></i><br/>
                            <span>FOOD</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-camera" aria-hidden="true"></i><br/>
                            <span>ELECTRONIC</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-television" aria-hidden="true"></i><br/>
                            <span>TELEVISION</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-futbol-o" aria-hidden="true"></i><br/>
                            <span>SPORT</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-desktop" aria-hidden="true"></i><br/>
                            <span>DESKTOP</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-camera" aria-hidden="true"></i><br/>
                            <span>ELECTRONIC</span>
                          </div>
                    </OwlCarousel>
                    </div>
                    <div className="col-lg-12 mt50">
	                    <div className="row">
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand1.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand2.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand3.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand4.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand5.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand6.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
	                    </div>
                    </div>
				</div>
			</div>
		);
	}
}