import React, { Component } from 'react';
import '../../../sites/currentSite/blocks/Banner.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/carousel.js';

var Carousel = require('react-responsive-carousel').Carousel;
export default class Banner extends Component {
	constructor(props){
    super(props);
	    this.state = {
	    	
	    };
  	}  
  render() {
		return (
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb50">
					<div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 grossbannerContainerEcomm bannerContainerEcomm">
							<div className="row">
								<Carousel showArrows={true} onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}>
					                <div>
					                    <img src="/images/Banner_1.jpg" />
					                    <p className="legend">Legend 1</p>
					                </div>
					                <div>
					                    <img src="assets/Banner_2.jpeg" />
					                    <p className="legend">Legend 2</p>
					                </div>
					                <div>
					                    <img src="assets/Banner_3.jpeg" />
					                    <p className="legend">Legend 3</p>
					                </div>
					                {/* <div>
					                    <img src="assets/4.jpeg" />
					                    <p className="legend">Legend 4</p>
					                </div> */}
					            </Carousel>
							</div>
						</div>
					</div>
				</div>
		);
	}
}