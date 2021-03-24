import React, {Component} from 'react';
// import '../../../sites/currentSite/common/Sidebar.css';
import $ from 'jquery';

export default class Sidebar extends Component {
	// constructor(props){
 //    super(props);
        
 //    }
    componentDidMount(){
    	let links = document.getElementsByClassName('nav item');
    	//console.log(links);
    	
    	for (var i = 0; i <= links.length; i++) {
    		// console.log(window.location.pathname);
    		// console.log($(links[i]).find('a').attr('href'));
    		if (window.location.pathname === $(links[i]).find('a').attr('href')) {

    			$(links[i]).addClass('current');
    			
    		}
    		
    	}
    }
  	render() {  
    return (
		<div className="sidebar col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
			{/* <div className="mp-title">
		        <strong>Marketplace</strong>
		    </div> */}
		    {/* <div className="mp-subtitle">
		        <strong>Marketplace</strong>
		    </div>
		    <nav className="account-nav">
		            <ul className="nav items">
		                <li className="nav item col-lg-12">
		                <a href="http://demo8.cmsmart.net/mag2_amazon_themeforest/france/customer/account/">
		                <i className="fa fa-user" aria-hidden="true"></i>&nbsp; Become a Seller</a>
		                </li>
		            </ul>
		    </nav>     */}
		    <br className="hidden-xs" />
		    <br className="hidden-xs" />        
      			<nav className="account-nav">
		            <ul className="nav items">
		                <li className="nav item col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
		                <a href="/account" id="atag"><i className="fa fa-user" aria-hidden="true"></i>&nbsp; Account Dashboard</a>
		                </li>

		                <li className="nav item col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
		                <a href="/edit-account" id="atag"><i className="fa fa-info" aria-hidden="true"></i>&nbsp; Account Information</a>
		                </li>

		                <li className="nav item col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
		                <a href="/address-book" id="atag"><i className="fa fa-location-arrow"></i>&nbsp; Address Book</a>
		                </li>

		                <li className="nav item col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
		                <a href="/my-orders" id="atag"><i className="fa fa-download"></i>&nbsp; My Orders </a>
		                </li>

		                <li className="nav item col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
		                <a href="/wishlist" id="atag"><i className="fa fa-heart"></i> &nbsp; My Wishlist</a>
		                </li>		                
		               
		                <li className="nav item col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                <a href="/productreview" id="atag"><i className="fa fa-eye"></i> &nbsp;My Product Reviews</a>
		                </li>
		                          
		            </ul>
		        </nav>
		        <br className="hidden-xs" />
		       	{/*<div className="block block-compare" >
		       					    <div className="block-title">
		       					        <strong id="block-compare-heading" role="heading" aria-level="2">Compare Products</strong>
		       					    </div>
		       					    <hr/>
		       					    <div className="empty">You have no items to compare.</div>
		       					</div>*/}
      		</div>
      		);
	}
}