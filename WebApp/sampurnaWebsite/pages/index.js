
import React from 'react';
import axios from 'axios';

// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import {setBlockData} from '../redux/actions/index.js';
// import {connect} from 'react-redux';
// import store from '../redux/store.js'

import MasterPage from '../MasterPage/MasterPage.js'

export const config = {
    unstable_runtimeJS : false
}
export default function App({pageData}) {
  // console.log("2. index.js pageData",pageData)
  return (
      <MasterPage pageData = {pageData}/>
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
