import axios             from 'axios';
import Aboutusbanner     from '../../Themes/Sampurna/blocks/7_Widgets/Aboutusbanner/Aboutusbanner';
import FAQ               from '../../Themes/Sampurna/blocks/7_Widgets/FAQ/FAQ.js';
import Header            from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer            from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';

import getConfig      from 'next/config';
const { publicRuntimeConfig } = getConfig();
axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;

function Faq({pageData}) {
  if(pageData){ 
    // console.log("pageData==",pageData);
    var Aboutusbanner_block_id = pageData.pageBlocks[0].block_id._id ? pageData.pageBlocks[0].block_id._id : ""
    var faq_block_id = pageData.pageBlocks[1].block_id._id ? pageData.pageBlocks[1].block_id._id : ""
    
  }
  return (
    pageData ? 
    <div className="col-12">
        <div className="row">
            < Header />
            < Aboutusbanner block_id = {Aboutusbanner_block_id}/>
            < FAQ  block_id = {faq_block_id}/>  
            < Footer />
        </div>
    </div>
    : 
    <div className=" col-12 NoPadding">
				<a href="/"><img className=" col-12 NoPadding" src="/images/eCommerce/404-Page.gif" /></a>
		</div>      
  )
}
export async function getStaticProps() {
  const urlParam = "faq"
  try{
    const res = await axios.get("api/pages/get/page_block/"+urlParam)
    const pageData = await res.data;
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

export default Faq;
