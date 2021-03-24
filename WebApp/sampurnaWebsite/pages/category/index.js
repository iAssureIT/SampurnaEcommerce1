import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import {connect} from 'react-redux';
import axios from 'axios';
import {setBlockData} from '../../redux/actions/index.js';
import MasterPage from '../../component/MasterPage/MasterPage.js'
import store from '../../redux/store.js'
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
import { useRouter } from "next/router";

function Home({pageData}) {
  //set data in store
  store.dispatch(setBlockData(pageData))
  return (
      <MasterPage/>
  )
}


export async function getServerSideProps({query}){
  //console.log("query",query)
  const urlParam = query.pageurl ? query.pageurl : 'homepage'
  const res = await axios.get("api/pages/get/page_block/"+urlParam)
  const pageData = await res.data;
  return {
    props:{
      pageData
    }
  }
}

const mapStateToProps = state => (
  {data: state.data.value}
);

const mapDispatchToProps = {
  setBlockData: setBlockData,
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
