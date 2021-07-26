
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

 
  return (
    <div className="col-12">
      <div className="row">
        <MasterPage pageData = {pageData}/>
      </div>
    </div>
  )
}



export async function getStaticProps(store,context){
	const urlParam = 'homepage';
    try {
        const res = await axios.get("api/pages/get/page_block/"+urlParam);
        const pageData = await res.data;
        // console.log("pageData = ",pageData);
        
        return { props:{ pageData } }
      } catch (err) {
        return { props:{ "pageData" : null } }
      }
  }
