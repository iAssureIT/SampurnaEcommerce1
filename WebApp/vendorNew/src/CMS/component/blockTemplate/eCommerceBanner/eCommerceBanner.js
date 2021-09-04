import React, {Component} from 'react';
import axios              from 'axios';


import './eCommerceBanner.css';


export default class eCommerceBanner extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "eCommerce",
                "blockSubTitle"      : " <b>WEBSITE DEVELOPMENT </b>",
                "blockDescription"   : "You need an eCommerce website that is super beautiful, user-friendly & that grows your business exponentially.",
                "blockComponentName" : "TemplateOverview",
                "blockType"          : "",
                "bgImage"            : "https://unimandai.s3.amazonaws.com/CMS/e01_20201015183833.png",
                "fgImage"            : "https://unimandai.s3.amazonaws.com/CMS/ecom2_20201015183927.png",
                "repeatedBlocks": [
                    { 
                        Title        : "Sample 5", 
                        SubTitle     : "", 
                        Image        : "https://unimandai.s3.amazonaws.com/CMS/ecom2_20201015183927.png",
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
        return(
            <div className="container-fluid eCommerceBannerWrapper" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 eCommerceBannerTextWrapper">
                    <div className="eCommerceBannerSubTitle" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></div>
                    <div className="eCommerceBannerTitle" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                    <div className="eCommerceBannerDescription" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></div>
                </div>
                <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 eCommerceBannerImageWrapper">
                    <img className="eCommerceBannerImage img-responsive" src={this.state.blocks.fgImage} alt="eCommerce Banner Image"/>
                </div>
            </div>
        );
    }
}