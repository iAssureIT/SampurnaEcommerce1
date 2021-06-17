import React, {Component} from 'react';
// import '../../../sites/currentSite/common/Sidebar.css';
import $ from 'jquery';

import Style                  from './Sidebar.module.css';


export default class Sidebar extends Component {
	// constructor(props){
 //    super(props);
        
 //    }
    componentDidMount(){
    	let links = document.getElementsByClassName('sidebarNav');
    	console.log("links===",links);
    	
    	for (var i = 0; i <= links.length; i++) {
    		console.log("window.location.pathname==",window.location.pathname);
    		console.log($(links[i]).find('a').attr('href'));
    		if (window.location.pathname === $(links[i]).find('a').attr('href')) {

    			$(links[i]).addClass('activeSideBar');
				console.log("class match");
    			
    		}
    		
    	}
    }
  	render() {  
    return (
		<div className="sidebar col-12 NoPadding">			
		    <br className="hidden-xs" />		          
      			<nav className="account-nav">
		            <ul className={"nav items " +Style.sideMenuBoxTOP}>
		                <li className={" col-12  " +Style.sideMenuBox}>
		                	<a href="/account" id="atag" className="col-12 sidebarNav"><i className="fa fa-user" aria-hidden="true"></i>&nbsp; Account Dashboard</a>
		                </li>

		                <li className={"nav item col-12 " +Style.sideMenuBox}>
		                	<a href="/edit-account" id="atag" className="col-12 sidebarNav"><i className="fa fa-info" aria-hidden="true"></i>&nbsp; Account Information</a>
		                </li>

		                <li className={"nav item col-12 " +Style.sideMenuBox}>
		                	<a href="/address-book" id="atag" className="col-12 sidebarNav"><i className="fa fa-location-arrow"></i>&nbsp; Address Book</a>
		                </li>

		                <li className={"nav item col-12 " +Style.sideMenuBox }>
		                	<a href="/my-orders" id="atag" className="col-12 sidebarNav"><i className="fa fa-download"></i>&nbsp; My Orders </a>
		                </li>

		                <li className={"nav item col-12 " +Style.sideMenuBox}>
		                	<a href="/wishlist" id="atag" className="col-12 sidebarNav"><i className="fa fa-heart"></i> &nbsp; My Wishlist</a>
		                </li>		                
		               
		                <li className={"nav item col-12 " +Style.sideMenuBox}>
		                	<a href="/productreview" id="atag" className="col-12 sidebarNav"><i className="fa fa-eye"></i> &nbsp;My Product Reviews</a>
		                </li>
		                          
		            </ul>
		        </nav>
		        <br className="hidden-xs" />
		       	
      		</div>
      		);
	}
}