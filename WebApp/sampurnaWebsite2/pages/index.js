
import React,{useState,useEffect}      from 'react';
import axios                           from 'axios';
import MasterPage                      from '../MasterPage/MasterPage.js';
import DeliveryLocationPopup           from '../Themes/Bookstore/blocks/5_HeaderBlocks/SampurnaHeader/DeliveryLocationPopup';
import Websitelogo                     from '../Themes/Bookstore/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import SearchBar                       from '../Themes/Bookstore/blocks/5_HeaderBlocks/SampurnaHeader/Searchbar.js';
import Footer                          from '../Themes/Bookstore/blocks/6_FooterBlocks/Footer/Footer.js';
import GoogleMap                       from '../Themes/Bookstore/blocks/5_HeaderBlocks/SampurnaHeader/Googlemap.js';

// import {config, library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {faCode, faHighlighter } from '@fortawesome/free-solid-svg-icon';
// library.add(faCode);
// import { faUserGraduate } from '@fortawesome/pro-light-svg-icons';
// import { faImages } from '@fortawesome/pro-solid-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithubAlt,
  faGoogle,
  faFacebook,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faGithubAlt,
  faGoogle,
  faFacebook,
  faTwitter
);



export default function App({pageData}) {
  const [sampurnaWebsiteDetails,setSampurnaWebsiteDetails]   = useState({});
  const [userDetails,setUserDetails]           = useState({});

  useEffect(()=>{
    var sampurnaWebsiteDetailsObj =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    var user_details              =  JSON.parse(localStorage.getItem('userDetails'));
    // console.log("sampurnaWebsiteDetails.deliveryLocation=>",sampurnaWebsiteDetailsObj);
    if(sampurnaWebsiteDetailsObj){
        if(sampurnaWebsiteDetailsObj.deliveryLocation){
          // console.log("sampurnaWebsiteDetails.deliveryLocation=>",sampurnaWebsiteDetails.deliveryLocation);
          setSampurnaWebsiteDetails(sampurnaWebsiteDetailsObj);
          setUserDetails(user_details);
        }
    }
  },[])

  return (
    <div className="col-12">
      <div className="row">
        {sampurnaWebsiteDetails && sampurnaWebsiteDetails.deliveryLocation  && sampurnaWebsiteDetails.deliveryLocation.address ?	
          <MasterPage pageData = {pageData}/>
        :
          <div className="col-12">
              <div className="row headerWrapper ">
                <div className="col-12 NoPadding multilevelType2MenuWrapper"> 
                    <header>
                        <nav className="navbar navbar-expand-md navbar-dark megamenu">
                            <div className="col-12 NoPadding ">
                                <div className="col-12 top-header">
                                    <div className="row headeLogoWrap mt-4">  
                                          <div className="col-2">
                                              <Websitelogo />
                                          </div>  
                                          <div className="col-9 text-center searchTitle"></div>
                                          <div className=" col-1 NoPadding signInBlock" >
                                              <a href="" className="faIcon faLoginIcon  col-12 NoPadding pull-right" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" area-hidden ="true"> 
                                                  <span className="col-12 loginView">Sign in &nbsp;
                                                      <img src="/images/eCommerce/userIcon.png" className="userIconImg"></img>
                                                  </span>
                                              </a>          
                                          </div> 
                                    </div>
                                </div>                                                    
                            </div>
                        </nav>
                    </header>
                </div>
              </div> 

              < DeliveryLocationPopup />
              <div className="row"> 
                  <Footer />
              </div>
          </div>
        }
      </div>
    </div>
  )
}

export async function getStaticProps(store,context){
	const urlParam = 'homepage';
    try {
        const res = await axios.get("api/pages/get/page_block/"+urlParam);
        const pageData = await res.data;
        return { props:{ pageData } }
      } catch (err) {
        return { props:{ "pageData" : null } }
      }
  }
