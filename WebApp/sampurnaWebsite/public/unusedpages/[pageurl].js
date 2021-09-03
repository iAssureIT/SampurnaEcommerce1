import Head           from 'next/head';
import axios          from 'axios';
import MasterPage     from '../MasterPage/MasterPage.js'

import getConfig      from 'next/config';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
import { useRouter } from "next/router";

function Home({pageData}) {
  return (
    pageData 
    ? 
      <MasterPage pageData={pageData}/> 
    : 
      <div className=" col-12 NoPadding">
  				<a href="/"><img className=" col-12 NoPadding" src="/images/eCommerce/404-Page.gif" /></a>
  		</div>      
  )
}

export async function getServerSideProps({query}){
  const urlParam = query.pageurl ? query.pageurl : 'homepage'
  try{
    const res = await axios.get("api/pages/get/page_block/"+urlParam)
    const pageData = await res.data;
    console.log("pageData=",pageData);
    return {
      props:{
        pageData
      }
    }
  }
  catch (err){
    return { props:{ "pageData" : null } }
  }
}


export default Home;
