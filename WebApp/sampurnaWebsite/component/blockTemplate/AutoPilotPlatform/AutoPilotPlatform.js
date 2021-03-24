import React,{Component} from 'react';
import css from "./AutoPilotPlatform.module.css";

import axios from 'axios';
import  $ from 'jquery';

export default class AutoPilotPlatform extends Component{


    constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "<b>AUTOPILOT</b> ECOMMERCE PLATFORM",
            
            "blockSubTitle": "We are passionate about our work",
            "blockDescription": " <span style='font-size:30px'>Lorem Ipsum</span> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recentlywith desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages. <p style='margin-top:25px'> It is a long established fact that a reader will be distracted by the readable content of a page whenlooking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software</p>", 
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "https://unimandai.s3.amazonaws.com/CMS/ecom4_20201015191246.png",
            "fgImage": "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
            "repeatedBlocks": [
                                
                                { 
                                    Title: "Sample 5", 
                                    SubTitle: "", 
                                    Image: "",
                                    Link: "", 
                                    Description: ""
                                }
            ],
            "bgVideo"				: "",
            "fgVideo"				: "",
            "blockGroup"			: "",
            "blockAppearOnPage"		: ""
          },
          "bgImage": "/images/0001.png",
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
                          const { bgImage } = this.state.blocks.bgImage;
                          const imageLoader = new Image();
                          imageLoader.bgImage = response.data.bgImage;
                        
                          imageLoader.onload = () => {
                              this.setState({ bgImage });
                          };

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
            <div className={"autopilotwrapper00 "+css.autopilotwrapper00}>
                <div className={"autopilotwrapper lazy "+css.autopilotwrapper} id="bgimage" >
                <style jsx>{`
                  #bgimage {
                      background-image : url(${this.state.blocks.bgImage})         
                  `}
                </style>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                     <div className={"col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 wrapperdashbox "+css.wrapperdashbox}>
                      <ul className={"dashBox3 "+css.dashBox3}>
						            <li className={"dash0a1 "+css.dashBox3_li+'  '+css.dash0a1}></li>
						            <li className={"dash0a2 "+css.dashBox3_li+'  '+css.dash0a2}></li>
					            	<li className={"dash0a3 "+css.dashBox3_li+'  '+css.dash0a3}></li> 
				            	</ul>
                    </div> 
                 </div> 
                   <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 titlewrapper2 "+css.titlewrapper2}>
                        <div className=" text-center ">
                            <div className={"h1title000 "+css.h1title000} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                        </div> 
                </div>    
                   <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 maincontentwrapper001 "+css.maincontentwrapper001}>
                     <div className={"col-lg-6 col-md-6 col-sm-12 col-xs-12 leftimageframework "+css.leftimageframework}>
                         <img loading="lazy" src={this.state.blocks.fgImage} alt="002" className={"lazyload leftsideimg img-responsive "+css.leftsideimg}/>  


                    </div> 

                     <div className={"col-lg-6 col-md-6 col-sm-12 col-xs-12 autocontentframework "+css.autocontentframework}>
                            <p className={"paragraphfasttrack00 "+css.paragraphfasttrack00} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>

                            
                             {/* <h3 className="ftracermore00">Read More </h3> <div className="arrow00"><i className="fas fa-angle-double-right"></i></div> */}

                        </div> 

                 </div>   


                </div>


            </div>
        )
    }
}