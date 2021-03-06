import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import {connect} from 'react-redux';
import axios from 'axios';
import {setBlockData ,setProductApiUrl} from '../../../../../../redux/actions/index.js';
import MasterPage from '../../../../../../MasterPage/MasterPage.js'
import store from '../../../../../../redux/store.js'
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
import { useRouter } from "next/router";

function Home({pageData,productApi}) {
  //set data in store
  store.dispatch(setBlockData(pageData))
  store.dispatch(setProductApiUrl(productApi))
  return (
      <MasterPage pageData = {pageData}/>
  )
}

export async function getServerSideProps({query}){  
  console.log("Subcategory query",query)
  // var productApi = "/api/products/get/listbysubcategory/"+query.subcategoryUrl;
  var productApi = "/api/products/get/list/lowestprice";
  const urlParam = query.categoryUrl ? query.categoryUrl : 'product-list'
  const res = await axios.get("api/pages/get/page_block/product-list")
  const pageData = await res.data;
  // console.log("Pagedata--------",pageData);
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
