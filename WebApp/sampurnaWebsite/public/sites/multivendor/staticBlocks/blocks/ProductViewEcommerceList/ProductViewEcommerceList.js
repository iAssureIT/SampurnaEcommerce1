import React, { Component }     from 'react';
import $              from 'jquery';
import {Route, withRouter} from 'react-router-dom';
import axios                  from 'axios';
import "../../../sites/currentSite/blocks/ProductViewEcommerceList.css";
import _                      from 'underscore';



export default class ProductViewEcommerceList extends Component {
	constructor(props){
    super(props);
	    
  	} 
  	componentDidMount(){  	} 
  	  	
  	render() {
		return (
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 spc20 ">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 lstbxouter">
           <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 lstbx selectl">
            <span className="listttl col-lg-12 col-md-12 col-sm-12 col-xs-12">ABOUT MARKET</span>
             <span className="listui col-lg-12 col-md-12 col-sm-12 col-xs-12">
               <ul>
                  <li className="selectlist">About Us</li>
                  <li className="selectlist">Contact</li>
                  <li className="selectlist">Privacy Policy</li>
                   <li className="selectlist">Site Map</li>
                </ul>

             </span>
           </div>
           <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 lstbx">
            <span className="listttl col-lg-12 col-md-12 col-sm-12 col-xs-12">MAKE MONEY WITH US</span>
             <span className="listui col-lg-12 col-md-12 col-sm-12 col-xs-12">
               <ul>
                  {/*<li>Marketplace</li>
                  <li className="">Compensation First</li>*/}
                  <li className="selectlist">My Account</li>
                   <li className="selectlist">Return Policy</li>
                  {/* <li>Affiliate</li>*/}
                </ul>

             </span>
           </div>
           <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 lstbx">
            <span className="listttl col-lg-12 col-md-12 col-sm-12 col-xs-12">PAYMENT AND SHIPPING</span>
             <span className="listui col-lg-12 col-md-12 col-sm-12 col-xs-12">
               <ul>
                  <li className="selectlist">Terms of Use</li>
                  <li className="selectlist">Payment Methods</li>
                  <li className="selectlist">Shipping Methods</li>
                  <li className="selectlist">Locations We Ship To</li>
                   <li className="selectlist">Estimated Delivery Time</li>
                </ul>

             </span>
           </div>
           <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 lstbx">
            <span className="listttl col-lg-12 col-md-12 col-sm-12 col-xs-12">LET US HELP YOU</span>
             <span className="listui col-lg-12 col-md-12 col-sm-12 col-xs-12">
               <ul>
                  <li className="selectlist">Join Free</li>
                  <li className="selectlist">Blog</li>
                  <li className="selectlist">Faqs</li>
                   <li className="selectlist">Store Locations</li>
                   <li className="selectlist">Shop By Brands</li>
                </ul>

             </span>
           </div>
          </div>
        </div>
		);
	}
}