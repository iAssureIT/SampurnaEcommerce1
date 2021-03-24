import React, {Component} from 'react';
import axios              from 'axios';


import './QualityPerformanceSecurity.css';


export default class QualityPerformanceSecurity extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "<b>QUALITY, PERFORMANCE, SECURITY<b>",
                "blockSubTitle"      : "",
                "blockDescription"   : "The world of mobile app developers is struck with more intense challenges because of constant advancements in technologies, mobile app development trends and fickle nature of customers. Users are not willing to compromise on performance and quality.",
                "blockComponentName" : "QualityPerformanceSecurity",
                "blockType"          : "QualityPerformanceSecurity",
                "bgImage"            : "/images/QualityPerformanceSecurity.png",
                "fgImage"            : "",
                "repeatedBlocks"     : [
                    {
                        Title        : "",
                        SubTitle     : "",
                        Description  : "",
                        Image        : "",
                        Link         : ""
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 qualityPerformanceSecurityWrapper">
                <div className="col-lg-12 qualityPerformanceSecurityDashWrapper">
                    <ul className="col-lg-2 col-lg-offset-5">
                        <li className="dash1"></li>
                        <li className="dash2"></li>
                        <li className="dash3"></li>
                    </ul>
                </div>
                <div className="col-lg-12 qualityPerformanceSecurityTextWrapper1">
                    <p className="qualityPerformanceSecurityTitle" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></p>
                </div>
                <div className="col-lg-10 col-lg-offset-1 qualityPerformanceSecurityImageNTextWrapper" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                    <div className="col-lg-12 qualityPerformanceSecurityTextWrapper2">
                        <p className="col-lg-10 col-lg-offset-1 qualityPerformanceSecurityDescription" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                    </div>
                </div>
            </div>
		);
	}
}