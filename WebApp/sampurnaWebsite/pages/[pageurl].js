import Head           from 'next/head';
import {connect}      from 'react-redux';
import axios          from 'axios';
import {setBlockData} from '../redux/actions/index.js';
import MasterPage     from '../MasterPage/MasterPage.js'
import store          from '../redux/store.js'
import getConfig      from 'next/config';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
import { useRouter } from "next/router";

function Home({pageData}) {
  //set data in store
  store.dispatch(setBlockData(pageData))
  return (
    pageData ? 
      <MasterPage pageData={pageData}/> 
    : 
    // <div className="container textAlignCenter siteNotcreated"><h1> This Page Not Found</h1></div>
    <div className=" col-12 NoPadding">
				<a href="/"><img className=" col-12 NoPadding" src="/images/eCommerce/404-Page.gif" /></a>
		</div>      
  )
}

export async function getServerSideProps({query}){
  // console.log("pageurl query===",query)
  const urlParam = query.pageurl ? query.pageurl : 'homepage'
  try{
    const res = await axios.get("api/pages/get/page_block/"+urlParam)
    const pageData = await res.data;
    // console.log("pageData=",pageData);
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

const mapStateToProps = state => (
  {data: state.data.value}
);

const mapDispatchToProps = {
  setBlockData: setBlockData,
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
