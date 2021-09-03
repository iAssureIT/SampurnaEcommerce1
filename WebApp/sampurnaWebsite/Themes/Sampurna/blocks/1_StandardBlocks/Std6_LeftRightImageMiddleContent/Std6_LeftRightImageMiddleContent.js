import React, {Component}       from 'react';
import axios 			        from 'axios';


import StdBlockSeparatorWhite   from '../../8_Common/StdBlockSeparatorWhite/StdBlockSeparatorWhite.js';
import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleWhite       from '../../8_Common/StdBlockTitleWhite/StdBlockTitleWhite.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S 			            from './Std6_LeftRightImageMiddleContent.module.css';


export default class Std6_LeftRightImageMiddleContent extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks : {
                "blockType"          : "1_StandardBlocks",
                "blockComponentName" : "Std6_LeftRightImageMiddleContent",
				"blockTitle"         : "Standard 6 - Left Right Image Middle Content",
                "blockSubTitle"      : "",
                "blockDescription"   : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
                "fgImage1"           : "",
                "fgImage2"           : "",
                "bgImage"            : "",
                "fgVideo"			 : "",
                "bgVideo"			 : "",
                "repeatedBlocks": [
                    {
                        Title        : "",
                        SubTitle     : "",
                        Description  : "",
                        FGImage1     : "",
                        FGImage2     : "",
                        BGImage      : "",
                        Link         : ""
                    }
                ],
                "blockGroup"		 : "",
                "blockAppearOnPage"	 : ""
            },
            blockID  : "",
            block_id : ""
        }
    }

    componentDidMount(){
        {
            axios
                .get('/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                    if(response.data){
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
            <div className="col-12">
                {
                    this.state.blocks.bgImage
                    ?
                        <section className="col-12 stdBlockWrapperBackground" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                            <StdBlockSeparatorWhite />
                            <StdBlockTitleWhite blockTitle={this.state.blocks.blockTitle} />
                            <div className="col-12 stdBlockContentWrapper">
                                <div className="row">
                                    <div className="col-12 col-lg-3 stdBlockLeftImageWrapper">
                                        <img className="mt-lg-5 mt-xl-0 stdBlockLeftFGImage" src={this.state.blocks.fgImage1} alt=""/>
                                    </div>
                                    <div className="col-12 col-lg-6 stdBlockDescriptionWrapper">
                                        <p className="mt-5 mt-lg-3 mt-xl-0 stdBlockDescriptionWhite" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                    </div>
                                    <div className="col-12 col-lg-3 stdBlockRightImageWrapper">
                                        <img className="mt-5 mt-xl-0 stdBlockRightFGImage" src={this.state.blocks.fgImage2} alt=""/>
                                    </div>
                                </div>
                            </div>
                        </section>
                    :
                        <section className="col-12 stdBlockWrapper">
                            <StdBlockSeparatorBlue />
                            <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
                            <div className="col-12 stdBlockContentWrapper">
                                <div className="row">
                                    <div className="col-12 col-lg-3 stdBlockLeftImageWrapper">
                                        <img className="mt-lg-5 mt-xl-0 stdBlockLeftFGImage" src={this.state.blocks.fgImage1} alt=""/>
                                    </div>
                                    <div className="col-12 col-lg-6 stdBlockDescriptionWrapper">
                                        <p className="mt-5 mt-lg-3 mt-xl-0 stdBlockDescriptionBlack" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                    </div>
                                    <div className="col-12 col-lg-3 stdBlockRightImageWrapper">
                                        <img className="mt-5 mt-xl-0 stdBlockRightFGImage" src={this.state.blocks.fgImage2} alt=""/>
                                    </div>
                                </div>
                            </div>
                        </section>
                }
            </div>
		);
	}
}