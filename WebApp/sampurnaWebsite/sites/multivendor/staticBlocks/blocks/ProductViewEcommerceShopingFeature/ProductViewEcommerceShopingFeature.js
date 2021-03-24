import React, { Component }     from 'react';
import $              from 'jquery';
import {Route, withRouter} from 'react-router-dom';
import axios                  from 'axios';
import "../../../sites/currentSite/blocks/ProductViewEcommerceFeature.css";
import _                      from 'underscore';



export default class ProductViewEcommerceShopingFeature extends Component {
	constructor(props){
    super(props);
	    
  	} 
  	componentDidMount(){  	} 
  	  	
  	render() {
		return (
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop180 ">
          <div className="col-lg-4 paddinglzero"> 
              <div className="feature">
                <div className="featurebx bluebx">
                  <div className="col-lg-12 pdnglft">
                    <span className="featurebxicon col-lg-2">
                      <i className="fa fa-shopping-cart fntsize" aria-hidden="true"></i> 
                    </span>
                    <span className="featuretxt text-left col-lg-10">
                      <span className="col-lg-12 featuretxtline">FREE SHIPPING</span><br/>
                      <span className="col-lg-12">On all orders Rs. 199.00</span>
                    </span>
                  </div>
                  
                </div>
              </div>
          </div>
          <div className="col-lg-4 paddinglzero">
              <div className="feature">
                <div className="featurebx skyblue">
                  <div className="col-lg-12 pdnglft">
                      <span className="featurebxicon col-lg-2">
                        <i className="fa fa-money fntsize" aria-hidden="true"></i> 
                      </span>
                      <span className="featuretxt text-left col-lg-10">
                        <span className="col-lg-12 featuretxtline">90 DAY</span><br/>
                        <span className="col-lg-12">Money Come Black</span>
                      </span>
                    </div>
                </div>
              </div>
          </div>
          <div className="col-lg-4 paddinglzero"> 
              <div className="feature">
                <div className="featurebx greenbx">
                  <div className="col-lg-12 pdnglft">
                    <span className="featurebxicon col-lg-2">
                      <i className="fa fa-umbrella fntsize" aria-hidden="true"></i> 
                    </span>
                    <span className="featuretxt text-left col-lg-10">
                      <span className="col-lg-12 featuretxtline">FREE SHIPPING</span><br/>
                      <span className="col-lg-12">Guarantee 100%</span>
                    </span>
                  </div>
                </div>
              </div>
          </div>
         {/* <div className="col-lg-4 ">iuyt</div>
          <div className="col-lg-4 ">iuyt</div>*/}
        </div>
		);
	}
}