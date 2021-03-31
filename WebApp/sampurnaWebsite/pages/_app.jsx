import React from 'react';
import Head from 'next/head'
import firebase from 'firebase/app';
import 'firebase/database';
import getConfig from 'next/config';
import Link           from 'next/link';
import dynamic from 'next/dynamic';
import $ from 'jquery';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'
import store from '../redux/store.js'
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
// import '../styles/global.css';
import '../styles/multivendor_global.css';
const { publicRuntimeConfig } = getConfig();
axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
const current_site = publicRuntimeConfig.CURRENT_SITE;
// console.log("current site===",current_site);
// const dynamicCss = dynamic(() => import('../styles/'+current_site+'_global.css'));
// import '../styles/'+current_site+'global.css';


//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps }) {
  
  return (
    <Provider store={store}> 
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet" />
        <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossOrigin="anonymous"/>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossOrigin="anonymous"/>
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" crossOrigin="anonymous"></script>
       
        <script type="module" src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossOrigin="anonymous"></script>
        <script type="module" src='https://kit.fontawesome.com/a076d05399.js'></script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCrzFPcpBm_YD5DfBl9zJ2KwOjiRpOQ1lE&libraries=places"></script>   
                                       
      </Head>
      
      <Component {...pageProps} />  
           
    </Provider>
  )

}
