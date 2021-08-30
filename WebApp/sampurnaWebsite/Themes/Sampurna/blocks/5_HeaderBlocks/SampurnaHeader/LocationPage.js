import React,{useState,useEffect}      from 'react';
import DeliveryLocationPopup           from './DeliveryLocationPopup';
import Websitelogo                     from './Websitelogo.js';
import Footer                          from '../../6_FooterBlocks/Footer/Footer.js';
import SystemSecurityPopup             from './SystemSecurityPopup.js';

export default function LocationPage(){

	const [sampurnaWebsiteDetails,setSampurnaWebsiteDetails] = useState({});
	const [userDetails,setUserDetails] = useState({});
	const [userId,setUserId] = useState();	
    var user_details =  JSON.parse(localStorage.getItem('userDetails'));

    useEffect(()=>{
        var sampurnaWebsiteDetailsObj =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
         if(user_details && user_details.user_id){
             setUserId(user_details.user_id);
         }
       },[user_details?.user_id])

	const signOut = (e) => {
		var token = localStorage.removeItem("userDetails");
		swal({text:'Thank You. You have been logged out Successfully!'}).then(function(){
        	Router.push('/');
        	window.location.reload();
      	});
      	if(token !== null){
			setUserId(" ");
      	}
  	}
  	
	return(
        <div className="col-12">
            <div className="row headerWrapper ">
                <div className="col-12 NoPadding multilevelType2MenuWrapper"> 
                    <header>
                        <nav className="navbar navbar-expand-md navbar-dark megamenu">
                            <div className="col-12 NoPadding ">
                                <div className="col-12 top-header mobileNoPadding">
                                    <div className="col-12 headeLogoWrap my-3"> 
                                        <div className="row"> 
                                            <div className="col-4 col-sm-4 col-md-3 col-lg-2 col-xl-2">
                                                <Websitelogo />
                                            </div>
                                            <div className="col-8 col-sm-8 col-md-9 col-lg-10 col-xl-10">
                                                {
                                                    userId
                                                    ?
                                                        <div className="col-4 col-sm-3 col-md-2 col-lg-1 col-xl-1 NoPadding signInBlock pull-right">
                                                            <a href="" className="faIcon faLoginIcon NoPadding pull-right" onClick={()=>signOut()}  id="loginModal" area-hidden ="true">
                                                                <span className="btn headerLoginButton mr-3">Sign Out &nbsp;
                                                                    <img src="/images/eCommerce/userIcon.svg" className="userIconImg"></img>
                                                                </span>
                                                            </a>
                                                        </div>
                                                    :
                                                        <div className="col-4 col-sm-3 col-md-2 col-lg-1 col-xl-1 NoPadding signInBlock pull-right">
                                                            <a href="" className="faIcon faLoginIcon NoPadding pull-right" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" area-hidden ="true"> 
                                                                <span className="btn headerLoginButton mr-3">Sign in &nbsp;
                                                                    <img src="/images/eCommerce/userIcon.svg" className="userIconImg"></img>
                                                                </span>
                                                            </a>
                                                        </div>
                                                }
                                            </div>
                                            <SystemSecurityPopup />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                </div>
            </div>
            <div className="row"> 
                <DeliveryLocationPopup />
                <Footer />
            </div>
        </div>
    )
}