import React,{Component}from 'react';
import "./NationalAwards.module.css";

import axios from 'axios';

export default class NationalAwards extends Component{

  constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockTitle": "<b>NATIONAL</b> AWARDS",
        
        "blockSubTitle": "The Company Of The Year 2018",
        "blockDescription": "",
        "blockComponentName": "TemplateOverview",
        "blockType": "",
        "bgImage": "https://unimandai.s3.amazonaws.com/CMS/ecom11_20201016175357.png",
        "fgImage": "/images/00.png",
        "repeatedBlocks": [
                            
                              {
                                 Title :"",
                                 Description :"Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                                 Image :"https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                              },
                              {
                                Title :"",
                                Description :"Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                                Image :"https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                            },
                             {
                               Title :"",
                               Description :"Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                               Image :"https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                            },
                            {
                              Title :"",
                              Description :"Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                              Image :"https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                        }
                           
                        
                    
        ],
        "bgVideo"				: "",
        "fgVideo"				: "",
        "blockGroup"			: "",
        "blockAppearOnPage"		: ""
      },
      blockID:"",
      block_id:""
    };   
  }
componentDidMount(){
/*console.log("==>",this.props.block_id);*/
          {
             axios
                .get('/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                    if(response.data){
                        // console.log("ListofServices =",response.data);
                      this.setState({
                          blocks:response.data
                      });
                    }                  
                  })           
                .catch(function(error){
                  console.log(error);
              })
            }
      this.setState({
                block_id:this.props.block_id
              });
}
displayDetails(event){

}
render(){
    return(
        <div className="Nawardswrapp">
            <div className="NawardsBgIMG"style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                 <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 awardwrapp">
                    <ul className="dashBoxNA">
                        <li className="NAdash1"></li>
                        <li className="NAdash2"></li>
                        <li className="NAdash3"></li> 
                    </ul>
                </div> 
             </div>
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NAh1title">
                    <div className=" text-center">
                        <div className="nah1title00" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                    </div>
               </div>  
                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 narionalawardwrapp">  
                   <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 awardleftwrapp">
                   <img loading="lazy" src="/images/award8 (1).png" alt="awardn" className="lazyload awardIMG img-responsive"/>
                 </div>  
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NATextwrapp"> 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NAtextwrapp1"> 
                     <div className="NAh1title" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></div> 
                     <div className="row"> 
                       <div className="col-lg-12 col-lg-md-12 col-sm-12 col-xs-12 tabwrap">
                        <div className="tab-content">
                          {
                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 
                            ?
                              this.state.blocks.repeatedBlocks.map((data, index)=>{
                              return(
                                  <div key={"key1-"+index} id={"tab-"+index} className={"tab-pane fade in " + (index===0 ? "active" : "")}>
                                    <p className="NAhetitle" dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                  </div>
                                );
                              })
                            :
                              null
                          }
                        </div>

                        <ul className="nav nav-pills">
                          {
                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 
                            ?
                              this.state.blocks.repeatedBlocks.map((data, index)=>{
                              return(
                                  <li className={"bgcolorhide "+(index===0 ? "active" : "")} key={index}>
                                    <a href={"#tab-"+index} data-toggle="pill" aria-label="pill" className="bgcolorhide">
                                      <img loading="lazy" src={data.Image} alt="award" className="lazyload iassureaward img-responsive"/>
                                    </a>
                                  </li>
                                );                                    
                              })
                            :
                              null
                          }

                         
                        </ul>

                   </div> 
                   
              </div> 
            <div> 
        </div> 
    </div> 
 </div> 
  </div>  
</div>
</div>
    )
}

}