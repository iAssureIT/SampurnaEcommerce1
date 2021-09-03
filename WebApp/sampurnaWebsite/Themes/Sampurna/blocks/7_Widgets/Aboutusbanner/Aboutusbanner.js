import React, {Component} from 'react';
import axios              from 'axios';


import S from './Aboutusbanner.module.css';
export default class Aboutusbanner extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockType"          : "7_Widgets",
                "blockComponentName" : "Aboutusbanner",
                "blockTitle"         : "Banner Title",
                "blockSubTitle"      : "",
                "blockDescription"   : "",
                "bgImage"            : " ",
                "fgImage1"           : "",
                "fgImage2"           : "",
                "repeatedBlocks"     : [
                    {
                        Title        : "", 
                        subTitle     : "", 
                        Description  : "",
                        FGImage1     : "",
                        FGImage2     : "",
                        BGImage      : "",
                        Link         : "" 
                    },
                ],
                "bgVideo"            : "",
                "fgVideo"            : "",
                "blockGroup"         : "",
                "blockAppearOnPage"  : ""
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
            <section className={"col-12 "+S.simplePageBanner} style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                <h4 className={S.simplePageBannerTitle} dangerouslySetInnerHTML={{ __html: this.state.blocks.blockTitle} }></h4>
            </section>
        );
    }
}