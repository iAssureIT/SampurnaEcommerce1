import React, {Component}   from 'react';
import axios                from 'axios';


import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';



export default class Customise_Sample extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            blocks : {
                "blockType"          : "4_CustomisedBlocks",
                "blockComponentName" : "Customise_Sample",
				"blockTitle"         : "Customise Block",
                "blockSubTitle"      : "",
                "blockDescription"   : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release.",
                "fgImage"            : "/images/CMSImages/BlockImage.gif",
                "bgImage"            : "",
                "fgVideo"			 : "",
                "bgVideo"			 : "",
                "repeatedBlocks": [
                    {
                        Title        : "",
                        SubTitle     : "",
                        Description  : "",
                        Image        : "",
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
            <section className="col-12 bg-warning my-2 pb-5 stdBlockWrapper" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                <StdBlockSeparatorBlue />
                <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
                <div className="col-12 stdBlockContentWrapper">
                    <div className="row">
                        <div className="col-12 py-3 stdBlockImageWrapper">
                            <img className="stdBlockFGImage" src={this.state.blocks.fgImage} alt=""/>
                        </div>
                    </div>
                </div>                


            </section>
        )
    }
}