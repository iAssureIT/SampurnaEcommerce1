import React, {Component} from 'react';
import axios              from 'axios';


import './KeyFeaturesWebApp.css';


export default class keyFeaturesWebApp extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "<b>KEY FEATURES</b>",
                "blockSubTitle"      : "",
                "blockDescription"   : "",
                "blockComponentName" : "keyFeaturesWebApp",
                "blockType"          : "keyFeaturesWebApp",
                "bgImage"            : "",
                "fgImage"            : "/images/KeyFeaturesWebApp.png",
                "repeatedBlocks"     : [
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
                        Image        : "/images/KeyFeaturesWebApp1.png",
                        Link         : ""
                    },
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
                        Image        : "/images/KeyFeaturesWebApp1.png",
                        Link         : ""
                    },
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
                        Image        : "/images/KeyFeaturesWebApp1.png",
                        Link         : ""
                    },
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
                        Image        : "/images/KeyFeaturesWebApp1.png",
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 keyFeaturesWebAppWrapper">
                <div className="col-lg-12 keyFeaturesWebAppDashWrapper">
                    <ul className="col-lg-2 col-lg-offset-5">
                        <li className="dash1"></li>
                        <li className="dash2"></li>
                        <li className="dash3"></li>
                    </ul>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 keyFeaturesWebAppTextWrapper">
                    <p className="keyFeaturesWebAppTitle" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></p>
                </div>
                <div className="col-lg-12 keyFeaturesWebAppTextNImageWrapper">
                <div className="col-lg-6 keyFeaturesWebAppImageWrapper">
                        <img className="keyFeaturesWebAppImage" src={this.state.blocks.fgImage} alt="Key Features Image"/>
                    </div>
                   
                        <div className="row">
                            {
                                this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                    this.state.blocks.repeatedBlocks.map((data, index)=>{
                                        return(
                                            <div className="col-lg-5 keyFeaturesWebAppLeftRepeatedBlockWrapper "key={index}>
                                                <div className="col-lg-12 keyFeaturesWebAppRepeatedBlock ">

                                                    <div className="col-lg-2 keyFeaturesWebAppIconWrapper">
                                                        <div className="keyFeaturesWebAppIconCircleWrapper">
                                                            <img className="keyFeaturesWebAppIcon" src={data.Image} alt=""/>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-10 keyFeaturesWebAppRepeatedBlockTextWrapper">
                                                        <p className="keyFeaturesWebAppRepeatedBlockTitle" dangerouslySetInnerHTML={{ __html: data.Title } }></p>
                                                        <p className="keyFeaturesWebAppRepeatedBlockDescription" dangerouslySetInnerHTML={{ __html: data.Description } }></p>
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
            </div>
		);
	}
}