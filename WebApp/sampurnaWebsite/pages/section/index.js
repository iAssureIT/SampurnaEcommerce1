
import React from 'react';
import axios from 'axios';
import MasterPage from '../../MasterPage/MasterPage.js'

export const config = {
    unstable_runtimeJS : false
}
export default function App({pageData}) {
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
