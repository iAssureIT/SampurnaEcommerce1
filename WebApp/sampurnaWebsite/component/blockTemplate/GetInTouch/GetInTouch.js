import React,{Component} from 'react';
import Style from "./GetInTouch.module.css";

import axios from 'axios';

export default class GetInTouch extends Component{
    constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "GET IN TOUCH",
            
            "blockSubTitle": "Give us a call or drop by anything,we endeavour to answer all enquiries within 24 hours on business day.We will happy to answer your questuions",
            "blockDescription": "<span  </b>   a Ipsum passages, and more recently with desktop publishing software </p>",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "/images/002.png",
            "fgImage": "/images/001.png",
            "repeatedBlocks": [
                                
                                { 
                                    Title: "<b>HEAD OFFICE</b>", 
                                    SubTitle: "Pune(INDIA)", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/ctlocation_2020101611220.png",
                                    Link: "", 
									Description: "#323, Amanora Chambers Magarpatta Pune, Maharastra 411228"
									
									
								},

								{ 
                                    Title: "<b>PHONE</b>", 
                                    SubTitle: "+91 99233 93733", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/Receiver_20201016112551.png",
                                    Link: "", 
									Description: ""
									
									
								},
								{ 
                                    Title: "<b>EMAIL</b>", 
                                    SubTitle: "info@iassureit.com", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/email_20201016112450.png",
                                    Link: "", 
									Description: ""
									
									
								},
								
								
																
								
								
								
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



    render(){
        return(
            <div className={Style.gettouchwrapp}>
                 <div className={"col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 " +Style.GetIntouchdashwrapp}>
                      <ul className={Style.GetIntouchdashBox1}>
						<li className={Style.GetIntouchdash0}></li>
						<li className={Style.GetIntouchdash02}></li>
					    <li className={Style.GetIntouchdash03}></li> 
				     </ul>
                 </div>
                 <div className="col-lg-12 col-sm-12 col-sm-12 col-xs-12">
                     <div className="text-center">
                         <h1 className={"globalMainTitle "+Style.gettitlttext} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h1>
                     </div>
                </div>

                <div className={"col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 " +Style.getintouchwrapp1}>
                    <p className={Style.paragraphtext} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></p>
                </div>

                <div className={"col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 " +Style.getintouchwrapp2}>
                {
                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
						this.state.blocks.repeatedBlocks.map((data, index)=>{
                		return(
					
                    
                    <div className={"col-lg-4 col-md-4 col-sm-12 col-xs-12 " +Style.Getwrapp1} key={index}>
                       <div className={"col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 col-xs-12 " +Style.contactImgBlock}>
                           <img loading="lazy" src={data.Image} alt="c02" className="lazyload img-responsive"/>
                        </div>
                       <div className="row">
                          <div className={"col-lg-12 col-md-12 colsm-12 col-xs-12 " +Style.Getwrapp02}>
                               <div className="text-center"> 
                                  <div className={Style.GTh1title} dangerouslySetInnerHTML={{ __html: data.Title } }></div>
                                  <div className={Style.GTh1title2} dangerouslySetInnerHTML={{ __html: data.SubTitle } }></div>
                                  <div className={Style.GTh1title3} dangerouslySetInnerHTML={{ __html: data.Description } }></div> 
                              </div>
                          </div>
                      </div>
                  </div>
                			);
						})
					:
					null
				}

                </div>

            </div>
        )
    }
}


                