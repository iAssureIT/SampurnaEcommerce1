import React, {Component}       from 'react';
import axios 			        from 'axios';


import StdBlockSeparatorWhite   from '../../8_Common/StdBlockSeparatorWhite/StdBlockSeparatorWhite.js';
import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleWhite       from '../../8_Common/StdBlockTitleWhite/StdBlockTitleWhite.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S                        from './Std5_PlainContent.module.css';


export default class Std5_PlainContent extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks : {
                "blockType"          : "1_StandardBlocks",
                "blockComponentName" : "Std5_PlainContent",
				"blockTitle"         : "Standard 5 - Plain Content",
                "blockSubTitle"      : "Standard Block SubTitle",
                "blockDescription"   : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
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
                                <h3 className="stdBlockSubTitleWhite">{this.state.blocks.blockSubTitle}</h3>
                                <p className="mt-5 stdBlockDescriptionWhite" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                            </div>
                        </section>
                    :
                        <section className="col-12 stdBlockWrapper">
                            <StdBlockSeparatorBlue />
                            <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
                            <div className="col-12 stdBlockContentWrapper">
                                <h3 className="stdBlockSubTitleBlack">{this.state.blocks.blockSubTitle}</h3>
                                <p className="mt-5 stdBlockDescriptionBlack" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                            </div>
                        </section>
                }
            </div>
        )
	}
}