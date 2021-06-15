import React, {Component}       from 'react';
import axios                    from 'axios';


import StdBlockSeparatorWhite   from '../../8_Common/StdBlockSeparatorWhite/StdBlockSeparatorWhite.js';
import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleWhite       from '../../8_Common/StdBlockTitleWhite/StdBlockTitleWhite.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S                        from './Std1_RightImgLeftContent.module.css';


export default class Std1_RightImgLeftContent extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks : {
                "blockType"          : "1_StandardBlocks",
                "blockComponentName" : "Std1_RightImgLeftContent",
				"blockTitle"         : "Standard 1 - Right Image Left Content",
                "blockSubTitle"      : "",
                "blockDescription"   : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release.",
                "fgImage1"           : "/images/CMSImages/BlockFGImg.png",
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
                                    <div className="col-12 col-lg-6 stdBlockDescriptionWrapper">
                                        <p className="stdBlockDescriptionWhite" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                    </div>
                                    <div className="col-12 col-lg-6 stdBlockImageWrapper">
                                        <img className="mt-5 mt-lg-3 mt-xl-0 stdBlockFGImage" src={this.state.blocks.fgImage1} alt="iAssureIT-Standard Block Image" title="iAssureIT-Standard Block Image" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    :
                        <section className="col-10 offset-1 stdBlockWrapper">
                          <div className="row">
                            {/* <StdBlockSeparatorBlue /> */}
                            <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
                            <div className="col-12 stdBlockContentWrapper">
                                <div className="row">
                                    <div className="col-12 col-lg-6 my-auto stdBlockDescriptionWrapper">
                                        <p className={"stdBlockDescriptionBlack "+S.stdBlockDescriptionBlack} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                    </div>
                                    <div className="col-12 col-lg-6 my-auto stdBlockImageWrapper">
                                        <img className={"mt-5  mt-lg-3 mt-xl-0 img-fluid stdBlockFGImage "+S.stdBlockFGImage} src={this.state.blocks.fgImage1} alt="iAssureIT-Standard Block Image" title="iAssureIT-Standard Block Image" />
                                    </div>
                                </div>
                            </div>
                            </div>
                        </section>
                }
            </div>
        )
    }
}