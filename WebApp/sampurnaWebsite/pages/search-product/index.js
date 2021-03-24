import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import {connect} from 'react-redux';
import axios from 'axios';
import {setBlockData } from '../../redux/actions/index.js';
import MasterPage from '../../component/MasterPage/MasterPage.js'
import store from '../../redux/store.js'
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
import { useRouter } from "next/router";

function Home({pageData,productApi}) {
  //set data in store
  store.dispatch(setBlockData(pageData))
  // store.dispatch(setProductApiUrl(productApi))
  return (
      <MasterPage/>
  )
}

export async function getServerSideProps({query}){ 
  // console.log("query",query)
  var productApi = "/api/products/get/search/"+"apple";
  const urlParam = query.categoryUrl ? query.categoryUrl : 'product-list'
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
  // console.log("State In search index.js========",state),
  {data: state.data.value}
);

const mapDispatchToProps = {
  setBlockData: setBlockData
  // setProductApiUrl: setProductApiUrl
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
