import React,{useState,useEffect} from 'react';
import Head from 'next/head'
import firebase             from 'firebase/app';
import 'firebase/database';
import getConfig            from 'next/config';
import Link                 from 'next/link';
import dynamic              from 'next/dynamic';
import $                    from 'jquery';
import axios                from 'axios';
import {connect}            from 'react-redux';
import {setCurrency}        from '../redux/actions/index.js';
import { Provider }         from 'react-redux'
import store                from '../redux/store.js'
import Router               from 'next/router';
import NProgress            from 'nprogress'; //nprogress module
import ReactDependentScript from "react-dependent-script";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'nprogress/nprogress.css'; //styles of nprogress
// import '../Themes/Sampurna/style/global.css';
import '../Themes/Sampurna/style/multivendor_global.css';
import '../Themes/Sampurna/style/stdBlockStyle.css';
// import '../Themes/Sampurna/style/font.css';

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
export default function App({ Component, pageProps }) {
	const [googleAPIKey,setGoogleAPIKey]=useState()
	useEffect(() => {
	 	axios.get("/api/projectSettings/get/GOOGLE",)
	    .then((response) => {
        // console.log("googleAPIKey response",response);
	      	// setGoogleAPIKey(response.data.googleapikey)
	    })
	    .catch((error) =>{
	        console.log(error)
	    })
        //Get all preferences and store them in localstorage
        axios.get("/api/adminpreference/get")
          .then(preferences =>{
            // console.log("preferences",preferences);
            var currency = preferences.data[0].currency;
            // store.dispatch(setCurrency(currency));

            // var askpincodeToUser = preferences.data[0].askPincodeToUser;

            // localStorage.setItem('preferences',askpincodeToUser);
            // localStorage.setItem("websiteModel",preferences.data[0].websiteModel);      
            // localStorage.setItem("showLoginAs",preferences.data[0].showLoginAs); 
            // localStorage.setItem('preferences', JSON.stringify(preferences));		
          })
          .catch(error=>{
            console.log("Error in preferences = ", error);
          })  
        
	}, []);
  // console.log("googleAPIKey",googleAPIKey);
  return (
    <Provider store={store}> 
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shortcut icon" href="/favicon.png" />
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <script type="module" src='https://kit.fontawesome.com/a076d05399.js'></script>
      {/* <script src= {"https://maps.googleapis.com/maps/api/js?key="+googleAPIKey+"&libraries=geometry,drawing,places"}></script> */}
      <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC2Ubr7BFRt1rjOU9XajVBNRUV5w8VLe0k&libraries=geometry,drawing,places"></script>                      
    </Head>
    <Component {...pageProps} />  
  </Provider>
	 
    );  
}

