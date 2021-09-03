import React, {Component}       from 'react';
import axios                    from 'axios';


import StdBlockSeparatorWhite   from '../../8_Common/StdBlockSeparatorWhite/StdBlockSeparatorWhite.js';
import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleWhite       from '../../8_Common/StdBlockTitleWhite/StdBlockTitleWhite.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S                        from './Std3_LeftImgRightContent.module.css';


export default class Std3_LeftImgRightContent extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            blocks : {
                "blockType"          : "1_StandardBlocks",
                "blockComponentName" : "Std3_LeftImgRightContent",
				"blockTitle"         : "Standard 3 - Left Image Right Content",
                "blockSubTitle"      : "",
                "blockDescription"   : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release.",
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
            <section className={"col-12 stdBlockWrapper "+S.stdBlockWrapper}>
                <div className="col-12 stdBlockContentWrapper">
                    <div className="row">
                        <div className="col-12 col-lg-6 stdBlockImageWrapper">
                        <img className={"stdBlockFGImage "+S.stdBlockFGImage} src={this.state.blocks.fgImage1} alt="" title="" />
                        </div>
                        <div className="col-12 col-lg-6 stdBlockDescriptionWrapper">
                            <p className={"stdBlockDescriptionBlack "+S.stdBlockDescriptionBlack} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}