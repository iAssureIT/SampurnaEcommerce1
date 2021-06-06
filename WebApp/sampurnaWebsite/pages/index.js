
import React,{useState,useEffect}      from 'react';
import axios                           from 'axios';
import MasterPage                      from '../MasterPage/MasterPage.js';
import DeliveryLocationPopup           from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/DeliveryLocationPopup';
import Websitelogo                     from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import Searchbar                       from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Searchbar.js';
import Footer                          from '../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import GoogleMap                       from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Googlemap.js';

export const config = {
    unstable_runtimeJS : false
}

export default function App({pageData}) {
  const [sampurnaWebsiteDetails,setSampurnaWebsiteDetails]   = useState({});
  const [userDetails,setUserDetails]           = useState({});

  useEffect(()=>{
    var sampurnaWebsiteDetailsObj =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    var user_details           =  JSON.parse(localStorage.getItem('userDetails'));
    console.log("sampurnaWebsiteDetails.deliveryLocation=>",sampurnaWebsiteDetailsObj);
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
                                          <Websitelogo />
                                          <Searchbar />
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
