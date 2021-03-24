import React, {Component} from 'react';
import axios              from 'axios';


import css from './ReactNativeWebApp.css';


export default class ReactNativeWebApp extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "React Native Web App",
                // "blockSubTitle"      : "We are passionate about our work",
                "blockDescription"   : "<span style='font-size:30px'><b>Lorem Ipsum </b> </span> is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages,<p style='margin-top:20px'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software </p>",
                "blockComponentName" : "TemplateOverview",
                "blockType"          : "",
                // "bgImage"            : "https://unimandai.s3.amazonaws.com/CMS/ecom4_20201015191246.png",
                // "fgImage"            : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                "bgImage"            : "/images/ReactNativeBg.png",
                "fgImage"            : "/images/ReactNativeFg.png",
                "fg1Image"           :"/images/React1.png",
                "repeatedBlocks": [
                    {
                            
                        Title        : "Sample 5",
                        SubTitle     : "",
                        Image        : "",
                        Link         : "",
                        Description  : ""
                    }
                ],
                "bgVideo"			 : "",
                "fgVideo"			 : "",
                "blockGroup"		 : "",
                "blockAppearOnPage"	 : ""
            },
            blockID  : "",
            block_id : ""
        }
    }

    componentDidMount(){
        // console.log("==>",this.props.block_id);
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
        // console.log("this.state.blocks.bgImage",this.state.blocks.bgImage);
        return(
            <div className={"col-lg-12 ReactNativeWrapper"+css.ReactNativeWrapper}>
                <div className="row">
                    <div className="col-lg-12 ReactNativeBgImage" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                        <div className="row">
                           
                            
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ReactNativeTextNImageWrapper">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ReactNativeTextWrapper">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ReactNativeTitleWrapper">
                                {/* <div className="ReactNativeBlockTitleSideImg"><img src={this.state.blocks.fg1Image} alt="React Native Image" className="ReactNativeImage1 img-responsive"/></div> */}

                                            <div className="ReactNativeTitle1" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                                   </div>

                                        <p className="ReactNativeText1" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ReactNativeImageWrapper">
                                        <img src={this.state.blocks.fgImage} alt="React Native Image" className="ReactNativeImage img-responsive"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}