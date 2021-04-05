
import React from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from 'react-redux';
import axios from 'axios';
import {setBlockData} from '../redux/actions/index.js';
import MasterPage from '../component/MasterPage/MasterPage.js'
import store from '../redux/store.js'
import BlogCarousel from '../component/blockTemplate/BlogCarousel/BlogCarousel.js';

export const config = {
    unstable_runtimeJS : false
}

class App extends React.Component { 
    constructor(props) {
        super(props);
    }
    
    render() {
        //set data in store
        // console.log("2.inside index.js");
        store.dispatch(setBlockData(this.props.pageData))
        // console.log("props data===", this.props.pageData);
        return (
            this.props.pageData ?
                <MasterPage/>                
            : 
                <div className="container textAlignCenter siteNotcreated"><h1>Website is not yet created</h1></div> 
            );
    }
}

export async function getStaticProps(store,context){
	const urlParam = 'homepage';
    try {
        const res = await axios.get("api/pages/get/page_block/"+urlParam);
        const pageData = await res.data;
        return { props:{ pageData } }
      } catch (err) {
        //console.log("err",err);
        return { props:{ "pageData" : null } }
      }
  }

const mapStateToProps = state => (
    {data: state.data.value}
);

const mapDispatchToProps = {
    setBlockData: setBlockData,
};


export default connect(mapStateToProps, mapDispatchToProps)(App);


