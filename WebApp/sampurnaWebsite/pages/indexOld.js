import React,{useState,useEffect}      from 'react';
import axios                           from 'axios';
import MasterPage                      from '../MasterPage/MasterPage.js';
import DeliveryLocationPopup           from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/DeliveryLocationPopup';
import Websitelogo                     from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import SearchBar                       from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Searchbar.js';
import Footer                          from '../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import GoogleMap                       from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Googlemap.js';
import SystemSecurityPopup             from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/SystemSecurityPopup.js';


export default function App({pageData}){
	
	// console.log("page data => ", pageData);
   // console.log("*** Loaded index.js ***");

	const [sampurnaWebsiteDetails,setSampurnaWebsiteDetails] = useState({});
	const [userDetails,setUserDetails] = useState({});
	const [userId,setUserId] = useState();

	var user_details =  JSON.parse(localStorage.getItem('userDetails'));

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

	useEffect(()=>{
	   var sampurnaWebsiteDetailsObj =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));

    	if(user_details && user_details.user_id){
			setUserId(user_details.user_id);
    	}
	   if(sampurnaWebsiteDetailsObj){
	        if(sampurnaWebsiteDetailsObj.deliveryLocation){
	          setSampurnaWebsiteDetails(sampurnaWebsiteDetailsObj);
	          setUserDetails(user_details);
	        }
	   }
  	},[user_details?.user_id])

  	
	return(
	    <div className="col-12">
			<div className="row">
        		{
					sampurnaWebsiteDetails && sampurnaWebsiteDetails.deliveryLocation  && sampurnaWebsiteDetails.deliveryLocation.address
					?
						<MasterPage pageData = {pageData}/>
        			:
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
				}
			</div>
		</div>
  	)
}

export async function getStaticProps(store,context){
// export async function getServerSideProps(store,context){
	const urlParam = 'homepage';
    try{
        const res = await axios.get("api/pages/get/page_block/"+urlParam);
        const pageData = await res.data;
        return{
			props : { pageData }
		}
	}catch(err){
        return{
			props : { "pageData" : null }
		}
	}
}