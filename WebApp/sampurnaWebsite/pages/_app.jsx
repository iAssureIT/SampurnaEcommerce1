import React,{useState,useEffect} from 'react';
import Head                 from 'next/head'
import firebase             from 'firebase/app';
import getConfig            from 'next/config';
import Link                 from 'next/link';
import dynamic              from 'next/dynamic';
import $                    from 'jquery';
import axios                from 'axios';
import {connect, Provider}  from 'react-redux';
import store                from '../redux/store.js'
import Router               from 'next/router';
import NProgress            from 'nprogress'; //nprogress module
import ReactDependentScript from "react-dependent-script";
import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'nprogress/nprogress.css'; //styles of nprogress
import '../Themes/Sampurna/style/multivendor_global.css';
import '../Themes/Sampurna/style/stdBlockStyle.css';

const { publicRuntimeConfig } = getConfig();
axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
const current_site = publicRuntimeConfig.CURRENT_SITE;

if (typeof window !== "undefined") {
    require("jquery");
    require("popper.js");
    require("bootstrap/dist/js/bootstrap");
}
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());


//================================================================
//  ******   IMPORTANT  ****
// Redux can't be implemented as it is with Functional components. 
// Refer : https://thoughtbot.com/blog/using-redux-with-react-hooks
// Use the new technique as explain in this article. 
//================================================================


 export default function App({ Component, pageProps }){
	const [googleAPIKey,setGoogleAPIKey]=useState();
  const [initMap,setInitMap] = useState(false);
	useEffect(() => {
	 	axios.get("/api/projectSettings/get/GOOGLE",)
         .then((response) => {
              setGoogleAPIKey(response.data.googleapikey);
              window.initMap=setInitMap(true);
          })
         .catch((error) =>{
              console.log(error)
         })
        //Get all preferences and store them in localstorage
        axios.get("/api/adminpreference/get")
        .then(async (preferences) =>{
            var sampurnaWebsiteDetails = {
              preferences   : preferences.data[0],
            };
            //======  Check if you already have delivery location stored in localstorage  ======
            var LSsampurnaWebsiteDetails = await Promise.resolve(JSON.parse(localStorage.getItem("sampurnaWebsiteDetails")));
            
            if(LSsampurnaWebsiteDetails){
              if(LSsampurnaWebsiteDetails.deliveryLocation){
                sampurnaWebsiteDetails.deliveryLocation = LSsampurnaWebsiteDetails.deliveryLocation;
              }            
            }
            // console.log("before setItem = ", sampurnaWebsiteDetails);
            localStorage.setItem('sampurnaWebsiteDetails', JSON.stringify(sampurnaWebsiteDetails));		
          })
          .catch(error=>{
            console.log("Error in preferences = ", error);
          })  
        
	}, []);
  return (
    <Provider store={store}> 
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <script type="module" src='https://kit.fontawesome.com/a076d05399.js'></script>  
      </Head>
      {
        initMap ?
        <ReactDependentScript
          scripts={["https://maps.googleapis.com/maps/api/js?key="+googleAPIKey+"&libraries=geometry,drawing,places"]}>
             <Component {...pageProps} />
          </ReactDependentScript>
          :
          null
        }
       
    </Provider>
  );  
}
