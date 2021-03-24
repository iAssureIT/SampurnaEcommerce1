import React, {Component} from 'react';
import axios              from 'axios';


import css from './FasttrackFrameWork.css';


export default class FastrackFrameWork extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "<b>FASTTRACK</b> FRAMEWORK",
                "blockSubTitle"      : "We are passionate about our work",
                "blockDescription"   : "<span style='font-size:30px'><b>Lorem Ipsum </b> </span> is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages,<p style='margin-top:20px'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software </p>",
                "blockComponentName" : "TemplateOverview",
                "blockType"          : "",
                "bgImage"            : "https://unimandai.s3.amazonaws.com/CMS/ecom4_20201015191246.png",
                "fgImage"            : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
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
            <div className={"container-fluid fasttrackFrameworkWrapper"+css.fasttrackFrameworkWrapper}>
                <div className="row">
                    <div className="col-lg-12 fasttrackFrameworkBgImage" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fasttrackFrameworkDashWrapper">
                                <ul className="col-lg-2 col-lg-offset-5">
                                    <li className="dash1"></li>
                                    <li className="dash2"></li>
                                    <li className="dash3"></li>
                                </ul>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fasttrackFrameworkTitleWrapper">
                                <div className="row">
                                    <div className="fasttrackFrameworkTitle1" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fasttrackFrameworkTextNImageWrapper">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 fasttrackFrameworkTextWrapper">
                                        <p className="fasttrackFrameworkText1" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 fasttrackFrameworkImageWrapper">
                                        <img src={this.state.blocks.fgImage} alt="Fasttrack Framework Image" className="fasttrackFrameworkImage img-responsive"/>
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