import React, {Component} from 'react';
import axios              from 'axios';


import './NationalAwards.css';


export default class NationalAwards extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "<b>NATIONAL</b> AWARDS",
                "blockSubTitle"      : "The Company Of The Year 2018",
                "blockDescription"   : "",
                "blockComponentName" : "TemplateOverview",
                "blockType"          : "",
                "bgImage"            : "https://unimandai.s3.amazonaws.com/CMS/ecom11_20201016175357.png",
                "fgImage"            : "/images/00.png",
                "repeatedBlocks"     : [
                    {
                        Title        : "",
                        Description  : "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                        Image        : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                    },
                    {
                        Title        : "",
                        Description  : "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                        Image        : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                    },
                    {
                        Title        : "",
                        Description  : "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                        Image        : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                    },
                    {
                        Title        : "",
                        Description  : "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a",
                        Image        : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                    }
                ],
                "bgVideo"			 : "",
                "fgVideo"			 : "",
                "blockGroup"		 : "",
                "blockAppearOnPage"	 : ""
            },
            blockID  : "",
            block_id : ""
        };
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

    displayDetails(event){

    }
    
    render(){
        return(
            <div className="container-fluid nationalAwardWrapper" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nationalAwardDashWrapper">
                        <ul className="col-lg-2 col-lg-offset-5">
                            <li className="dash1"></li>
                            <li className="dash2"></li>
                            <li className="dash3"></li>
                        </ul>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nationalAwardTitleWrapper">
                        <div className="nationalAwardTitle1" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nationalAwardImageNTextWrapper">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nationalAwardImageWrapper">
                            <img src={this.state.blocks.fgImage} alt="iAssureIT Award" className="nationalAwardImage img-responsive"/>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nationalAwardTextWrapper1">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nationalAwardTextWrapper2">
                                <div className="nationalAwardSubTitle1" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></div>
                                <div className="row">
                                    <div className="col-lg-12 col-lg-md-12 col-sm-12 col-xs-12 tabWrapper">
                                        <div className="tab-content">
                                            {
                                                this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 
                                                ?
                                                    this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                        return(
                                                            <div key={"key1-"+index} id={"tab-"+index} className={"tab-pane fade in " + (index===0 ? "active" : "")}>
                                                                <p className="nationalAwardText1" dangerouslySetInnerHTML={{ __html: data.Title } }></p>
                                                                <p className="nationalAwardText2" dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                                            </div>
                                                        );
                                                    })
                                                :
                                                    null
                                            }
                                        </div>
                                        <ul className="nav nav-pills">
                                            {
                                                this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 
                                                ?
                                                this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                    return(
                                                        <li className={"bgcolorhide "+(index===0 ? "active" : "")} key={index}>
                                                            <a href={"#tab-"+index} data-toggle="pill" className="bgcolorhide">
                                                                <div className="awardTabImageWrapper">
                                                                    <img className="awardTabImage img-responsive" src={data.Image} alt="iAssureIT Award"/>
                                                                </div>
                                                            </a>
                                                        </li>
                                                        );                                    
                                                    })
                                                :
                                                    null
                                            }
                                        </ul>
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