import React, {Component} from 'react';
import axios              from 'axios';


import './KeyFeatures.css';


export default class KeyFeatures extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "<b>KEY FEATURES</b>",
                "blockSubTitle"      : "",
                "blockDescription"   : "",
                "blockComponentName" : "KeyFeatures",
                "blockType"          : "KeyFeatures",
                "bgImage"            : "",
                "fgImage"            : "/images/keyFeatures1.png",
                "repeatedBlocks"     : [
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
                        Image        : "/images/KeyFeatures2.png",
                        Link         : ""
                    },
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
                        Image        : "/images/KeyFeatures2.png",
                        Link         : ""
                    },
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
                        Image        : "/images/KeyFeatures2.png",
                        Link         : ""
                    },
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
                        Image        : "/images/KeyFeatures2.png",
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 keyFeaturesWrapper">
                <div className="col-lg-12 keyFeaturesDashWrapper">
                    <ul className="col-lg-2 col-lg-offset-5">
                        <li className="dash1"></li>
                        <li className="dash2"></li>
                        <li className="dash3"></li>
                    </ul>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 keyFeaturesTextWrapper">
                    <p className="keyFeaturesTitle" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></p>
                </div>
                <div className="col-lg-12 keyFeaturesTextNImageWrapper">
                    <div className="col-lg-4 keyFeaturesLeftRepeatedBlockWrapper">
                        <div className="row">
                            {
                                this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                    this.state.blocks.repeatedBlocks.slice(0,4).map((data, index)=>{
                                        return(
                                            <div className="col-lg-12 keyFeaturesRepeatedBlock" key={index}>
                                                <div className="col-lg-10 keyFeaturesRepeatedBlockTextWrapper">
                                                    <p className="keyFeaturesRepeatedBlockTitle" dangerouslySetInnerHTML={{ __html: data.Title } }></p>
                                                    <p className="keyFeaturesRepeatedBlockDescription" dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                                </div>
                                                <div className="col-lg-2 keyFeaturesIconWrapper">
                                                    <div className="keyFeaturesIconCircleWrapper">
                                                        <img className="keyFeaturesIcon" src={data.Image} alt="Key Features Icon"/>
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
                    <div className="col-lg-4 keyFeaturesImageWrapper">
                        <img className="keyFeaturesImage" src={this.state.blocks.fgImage} alt="Key Features Image"/>
                    </div>
                    <div className="col-lg-4 keyFeaturesRightRepeatedBlockWrapper">
                        <div className="row">
                            {
                                this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                    this.state.blocks.repeatedBlocks.slice(4,8).map((data, index)=>{
                                        return(
                                            <div className="col-lg-12 keyFeaturesRepeatedBlock" key={index}>
                                                <div className="col-lg-2 keyFeaturesIconWrapper">
                                                    <div className="keyFeaturesIconCircleWrapper">
                                                        <img className="keyFeaturesIcon" src={data.Image} alt=""/>
                                                    </div>
                                                </div>
                                                <div className="col-lg-10 keyFeaturesRepeatedBlockTextWrapper">
                                                    <p className="keyFeaturesRepeatedBlockTitle" dangerouslySetInnerHTML={{ __html: data.Title } }></p>
                                                    <p className="keyFeaturesRepeatedBlockDescription" dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                                </div>
                                            </div>
                                        );
                                    })
                                :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}