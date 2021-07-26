import React, {Component}       from 'react';
import axios                    from 'axios';


import StdBlockSeparatorWhite   from '../../8_Common/StdBlockSeparatorWhite/StdBlockSeparatorWhite.js';
import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleWhite       from '../../8_Common/StdBlockTitleWhite/StdBlockTitleWhite.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S                        from'./Std4Repeated_LeftImgRightBullets.module.css';


export default class Std4Repeated_LeftImgRightBullets extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockType"          : "2_RepeatedBlocks",
                "blockComponentName" : "Std4Repeated_LeftImgRightBullets",
                "blockTitle"         : "Standard 4 Repeated - Left Image Right Bullets",
                "blockSubTitle"      : "",
                "blockDescription"   : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
                "fgImage1"           : "/images/CMSImages/BlockFGImg.png",
                "fgImage2"           : "",
                "bgImage"            : "",
                "repeatedBlocks"     : [
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
    					FGImage1     : "/images/CMSImages/RepeatedBlockFGImg.png",
	    				FGImage2     : "",
		    			BGImage      : "",
                        Link         : ""
                    },
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
			    		FGImage1     : "/images/CMSImages/RepeatedBlockFGImg.png",
				    	FGImage2     : "",
					    BGImage      : "",
                        Link         : ""
                    },
                    {
                        Title        : "Lorem ipsum",
                        SubTitle     : "",
                        Description  : "Innovation is the backbone of company's development methodology. We produce amazing micro-innovations at every step in app to give you that 'wow' effect",
    					FGImage1     : "/images/CMSImages/RepeatedBlockFGImg.png",
	    				FGImage2     : "",
		    			BGImage      : "",
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
                            <div className="row">
                                <StdBlockSeparatorWhite />
                                <StdBlockTitleWhite blockTitle={this.state.blocks.blockTitle} />
                                <div className={"col-12 mb-5 "+S.stdRepDescrption}>
                                    <p className="stdBlockDescriptionWhite" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                </div> 
                                <div className={"col-12 std4TextNImageWrapper "+S.std4TextNImageWrapper}>
                                    <div className={"col-12 col-md-6 mt-4  std4ImageWrapper "+S.std4ImageWrapper}>
                                        <img className={"std4Image col-12 mx-auto pb-5 "+S.stdRep4Image} src={this.state.blocks.fgImage1} alt="std4RepBlock Image"/>
                                    </div>
                                    <div className={"col-12 col-md-6 mt-2 std4RepBlkWrapper "+S.std4RepBlkWrapper}>
                                        <div className="row">                                  
                                            {
                                                this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                                    this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                        return(
                                                            <div className={"col-12 std4RepBlock "+S.std4RepBlock} key={index}>
                                                                <div className="row">
                                                                    <div className={"col-2 std4IconWrapper "+S.std4IconWrapper}>
                                                                        <div className={"std4IconCircleWrapper mx-auto "+S.std4IconCircleWrapper}>
                                                                            <img className={"std4Icon "+S.std4Icon} src={data.FGImage1} alt=""/>
                                                                        </div>
                                                                    </div>
                                                                    <div className={"col-10 std4RepBlockTextWrapper pb-5 "+S.std4RepBlockTextWrapper}>
                                                                        <h3 className={"std4RepBlockTitle repBlockTitle pl-md-4  "+S.std4RepBlockTitle} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
                                                                        <h5 className={"std4RepBlockDescription mr-5 pr-5 mb-3 pl-md-4 text-justify repeatedblockDescription "+S.std4RepBlockDescription} dangerouslySetInnerHTML={{ __html: data.Description } }></h5>   
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
                            </div>
                        </section>
                    :
                       <section className="col-12 stdBlockWrapper">
                            <div className="row">
                                <StdBlockSeparatorBlue />
                                <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
                                <div className={"col-12 mb-5 "+S.stdRepDescrption}>
                                    <p className="stdBlockDescriptionBlack" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                </div> 
                                <div className={"col-12 std4TextNImageWrapper "+S.std4TextNImageWrapper}>
                                    <div className={"col-12 col-md-6 mt-4  std4ImageWrapper "+S.std4ImageWrapper}>
                                        <img className={"std4Image col-12 mx-auto pb-5 "+S.stdRep4Image} src={this.state.blocks.fgImage1} alt="std4RepBlock Image"/>
                                    </div>
                                    <div className={"col-12 col-md-6 mt-2 std4RepBlkWrapper "+S.std4RepBlkWrapper}>
                                        <div className="row">                                  
                                            {
                                                this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                                    this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                        return(
                                                            <div className={"col-12 std4RepBlock "+S.std4RepBlock} key={index}>
                                                                <div className="row">
                                                                    <div className={"col-2 std4IconWrapper "+S.std4IconWrapper}>
                                                                        <div className={"std4IconCircleWrapper mx-auto "+S.std4IconCircleWrapper}>
                                                                            <img className={"std4Icon "+S.std4Icon} src={data.FGImage1} alt=""/>
                                                                        </div>
                                                                    </div>
                                                                    <div className={"col-10 std4RepBlockTextWrapper pb-5 "+S.std4RepBlockTextWrapper}>
                                                                        <h3 className={"std4RepBlockTitle repBlockTitle pl-md-4  "+S.std4RepBlockTitle} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
                                                                        <h5 className={"std4RepBlockDescription mr-5 pr-5 mb-3 pl-md-4 text-justify repeatedblockDescription "+S.std4RepBlockDescription} dangerouslySetInnerHTML={{ __html: data.Description } }></h5>   
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
                            </div>
                        </section>
                }
            </div>
		);
	}
}