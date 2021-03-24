import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import {connect} from 'react-redux';
import axios from 'axios';
import {setBlockData ,setProductApiUrl} from '../../redux/actions/index.js';
import MasterPage from '../../component/MasterPage/MasterPage.js'
import store from '../../redux/store.js'
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
import { useRouter } from "next/router";

function Home({pageData,productApi}) {
  //set data in store
  // console.log("pagedata===",pageData);
  store.dispatch(setBlockData(pageData))
  store.dispatch(setProductApiUrl(productApi))
  return (
    pageData.pageBlocks.length>0?
      <MasterPage/>
      :
      <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " }>
        <img src="/images/bookscart.gif" className={"col-lg-6 col-lg-offset-3 img-responsive"}/>
      </div>
  )
}


export async function getServerSideProps({query}){
  // console.log("query",query)
  var productApi = "/api/products/get/listbysection/"+query.sectionUrl;
  const urlParam = query.sectionUrl ? query.sectionUrl : 'product-list'
  const res = await axios.get("api/pages/get/page_block/product-list")
  const pageData = await res.data;
  return {
    props:{
      pageData,
      productApi
    }
  }
}

const mapStateToProps = state => (
  {data: state.data.value}
);

const mapDispatchToProps = {
  setBlockData: setBlockData,
  setProductApiUrl: setProductApiUrl
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
