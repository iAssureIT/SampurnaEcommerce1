import React, {Component} from 'react';
import axios              from 'axios';


import './AboutBanner.css';


export default class AboutBanner extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "<b>ABOUT US</b>",
                "blockSubTitle"      : "We are passionate about our work",
                "blockDescription"   : "You need an eCommerce website that is super beautiful, user-friendly & that grows your business exponentially.",
                "blockComponentName" : "",
                "blockType"          : "",
                "bgImage"            : "/images/about1.png",
                "fgImage"            : "/images/us2.png",
                "repeatedBlocks"     : [
                    {
                        Title        : "", 
                        SubTitle     : "", 
                        Image        : "",
                        Link         : "", 
                        Description  : ""
                    }
                ],
                "bgVideo"			 : "",
                "fgVideo"			 : "",
                "blockGroup"		 : "",
                "blockAppearOnPage"  : ""
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
			<div className="container-fluid aboutUsBannerWrapper" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 aboutUsBannerTextWrapper">
                    <div className="aboutUsBannerTitle" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div><br/>
                    <div className="aboutUsBannerSubTitle" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 aboutUsBannerImageWrapper">
                    <img className="aboutUsBannerImage img-responsive" src={this.state.blocks.fgImage} alt="AboutUs Banner Image"/>
                </div>
			</div>
		);
	}
}