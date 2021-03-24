import React, { Component } from "react";
// import "./FasttrackFrameWork.css";
import css from "./FasttrackFrameWork.module.css";

// import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';


export default class FastrackFrameWork extends Component{


    constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "<b>FASTTRACK </b>FRAMEWORK",
            
            "blockSubTitle": "We are passionate about our work",
            "blockDescription": "<span style='font-size:30px'><b>Lorem Ipsum </b> </span> is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages,<p style='margin-top:20px'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software </p>",
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
          "bgImage":"/images/ecom4.png",
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
                              blocks:response.data,
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
      // console.log("this.state.blocks.bgImage",this.state.blocks.bgImage);
        return(
            <div className={"pagewrapperheight "+css.pagewrapperheight}>
            {
              // console.log("this.state.blocks.bgImage",this.state.blocks.bgImage)
            }
                <div className={"bgwrapperheight lazy "+css.bgwrapperheight} style={{backgroundImage:"url("+this.state.bgImage+")"}}>

                 
                     <div className={"col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 dashwrapp "+css.dashwrapp}>
                      <ul className={"dashBox1 "+css.dashBox1}>
						            <li className={"dash01 "+css.dash01}></li>
						            <li className={"dash02 "+css.dash02}></li>
					            	<li className={"dash03 "+css.dash03}></li> 
				            	</ul>
                    </div> 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 titlewrapper1 "+css.titlewrapper1}>
                            <div className={"h1title00 globalMainTitle "+css.h1title00} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                        </div>
                   </div>     
                    
					             <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 maincontentwrapper "+css.maincontentwrapper}>  
                          <div className={"col-lg-6 col-md-6 col-sm-12 col-xs-12 contentframework "+css.contentframework}>
                            <p className={"hdescription "+css.hdescription}  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p> 

                             {/* <h3 className="ftracermore">Read More </h3> <div className="arrow"><i className="fas fa-angle-double-right"></i></div> */}
                          </div>  

                             <div className={"col-lg-6 col-md-6 col-sm-12 col-xs-12 imageframework "+css.imageframework}>
                            <img loading="lazy" src={this.state.blocks.fgImage} alt="001" className={"lazyload sideimageftrack img-responsive "+css.sideimageftrack}/>  
                          </div>      
                       </div>    
					       </div> 
              </div>
        )
    }
}
