import React,{useState,useEffect}      from 'react';
import axios                           from 'axios';
import MasterPage                      from '../MasterPage/MasterPage.js';
import LocationPage                    from '../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/LocationPage.js'
import HomePage                        from '../Themes/Sampurna/blocks/HomePage/HomePage.js';
export default function App({pageData}){
	const [sampurnaWebsiteDetails,setSampurnaWebsiteDetails] = useState({});
	const [userDetails,setUserDetails] = useState({});
	const [userId,setUserId] = useState();

	var user_details =  JSON.parse(localStorage.getItem('userDetails'));


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
						< HomePage />
        			:
						< LocationPage />
				}
			</div>
		</div>
  	)
}
