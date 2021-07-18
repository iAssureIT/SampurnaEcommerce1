
import React,{useState,useEffect}      from 'react';
import axios                           from 'axios';
import MasterPage                      from '../MasterPage/MasterPage.js';
import DeliveryLocationPopup           from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/DeliveryLocationPopup';
import Websitelogo                     from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import SearchBar                       from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Searchbar.js';
import Footer                          from '../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import GoogleMap                       from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Googlemap.js';
import SystemSecurityPopup             from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/SystemSecurityPopup.js';

export default function App({pageData}) {
  const [sampurnaWebsiteDetails,setSampurnaWebsiteDetails]   = useState({});
  const [userDetails,setUserDetails]           = useState({});
  const [userId,setUserId]           = useState();
  var user_details              =  JSON.parse(localStorage.getItem('userDetails'));
  // console.log("user_details",user_details);
  const signOut = (e) => {
      var token = localStorage.removeItem("userDetails");
      swal({text:'Thank You. You have been logged out Successfully!'}).then(function(){
        Router.push('/');
        window.location.reload();
      });
      if (token !== null) {
        setUserId(" ");
      }
  }

  useEffect(()=>{
    var sampurnaWebsiteDetailsObj =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    // console.log("sampurnaWebsiteDetails.deliveryLocation=>",sampurnaWebsiteDetailsObj);
    if(user_details && user_details.user_id){
      setUserId(user_details.user_id);
      // console.log("userId===",userId);
    }
    if(sampurnaWebsiteDetailsObj){
        if(sampurnaWebsiteDetailsObj.deliveryLocation){
          // console.log("sampurnaWebsiteDetails.deliveryLocation=>",sampurnaWebsiteDetails.deliveryLocation);
          setSampurnaWebsiteDetails(sampurnaWebsiteDetailsObj);
          setUserDetails(user_details);
        }
    }
  },[user_details?.user_id])
 
  return (
    <div className="col-12">
      {console.log("userId===",userId)}
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
                                          {userId ?
                                          <div className=" col-1 NoPadding signInBlock" >
                                              <a href="" className="faIcon faLoginIcon  col-12 NoPadding pull-right" onClick={()=>signOut()}  id="loginModal" area-hidden ="true"> 
                                                  <span className="col-12 loginView">Sign Out &nbsp;
                                                      <img src="/images/eCommerce/userIcon.png" className="userIconImg"></img>
                                                  </span>
                                              </a>          
                                          </div> 
                                          :
                                          <div className=" col-1 NoPadding signInBlock" >
                                              <a href="" className="faIcon faLoginIcon  col-12 NoPadding pull-right" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" area-hidden ="true"> 
                                                  <span className="col-12 loginView">Sign in &nbsp;
                                                      <img src="/images/eCommerce/userIcon.png" className="userIconImg"></img>
                                                  </span>
                                              </a>          
                                          </div> 
                                          }
                                          < SystemSecurityPopup />
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
