import axios             from 'axios';
import Aboutusbanner            from '../../Themes/Sampurna/blocks/7_Widgets/Aboutusbanner/Aboutusbanner';
import Std1_RightImgLeftContent from '../../Themes/Sampurna/blocks/1_StandardBlocks/Std1_RightImgLeftContent/Std1_RightImgLeftContent.js';
import Std3_LeftImgRightContent from '../../Themes/Sampurna/blocks/1_StandardBlocks/Std3_LeftImgRightContent/Std3_LeftImgRightContent.js';
import Header            from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer            from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';

import getConfig      from 'next/config';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;

function AboutUs({pageData}) {
  if(pageData){ 
    // console.log("pageData==",pageData);
    var Aboutusbanner_block_id = pageData.pageBlocks[0].block_id._id ? pageData.pageBlocks[0].block_id._id : ""
    var standardTxt1_block_id = pageData.pageBlocks[1].block_id._id ? pageData.pageBlocks[1].block_id._id : ""
    var standardTxt2_block_id = pageData.pageBlocks[2].block_id._id ? pageData.pageBlocks[2].block_id._id : ""
    var standardTxt3_block_id = pageData.pageBlocks[3].block_id._id ? pageData.pageBlocks[3].block_id._id : ""
    
  }
  return (
    pageData ? 
    <div className="col-12">
        <div className="row">
            < Header />
            < Aboutusbanner block_id = {Aboutusbanner_block_id}/>
            < Std1_RightImgLeftContent block_id = {standardTxt1_block_id} />
            < Std3_LeftImgRightContent block_id = {standardTxt2_block_id} />
            < Std1_RightImgLeftContent block_id = {standardTxt3_block_id} />
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
  const urlParam = "about-us"
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

export default AboutUs;
