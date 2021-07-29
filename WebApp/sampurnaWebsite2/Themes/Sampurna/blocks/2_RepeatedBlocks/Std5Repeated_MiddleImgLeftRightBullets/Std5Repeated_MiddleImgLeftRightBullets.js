import React, {Component}       from 'react';
import axios                    from 'axios';


import StdBlockSeparatorWhite   from '../../8_Common/StdBlockSeparatorWhite/StdBlockSeparatorWhite.js';
import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleWhite       from '../../8_Common/StdBlockTitleWhite/StdBlockTitleWhite.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S                        from './Std5Repeated_MiddleImgLeftRightBullets.module.css';


export default class Std5Repeated_MiddleImgLeftRightBullets extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockType"          : "2_RepeatedBlocks",
                "blockComponentName" : "Std5Repeated_MiddleImgLeftRightBullets",
                "blockTitle"         : "Standard 5 Repeated - Middle Image Left Right Bullets",
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
                                    <p className="stdBlockDescriptionWhite text-justify " dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                </div> 
                                <div className={"col-12 Std5TextNImageWrapper "+S.Std5TextNImageWrapper}>
                                    <div className={"col-12 col-lg-4 Std5LeftRepeatedBlockWrapper "+S.Std5LeftRepeatedBlockWrapper}>
                                        {
                                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                                this.state.blocks.repeatedBlocks.slice(0,4).map((data, index)=>{
                                                    return(
                                                        <div className={"col-12 Std5LeftRepeatedBlock "+S.Std5LeftRepeatedBlock} key={index}>
                                                            <div className="row">
                                                                <div className={"col-10 Std5LeftRepeatedBlockTextWrapper text-right "+S.Std5LeftRepeatedBlockTextWrapper}>
                                                                    <h3 className={"repeatedblockTitle mr-4 pl-md-4 "+S.Std5LeftRepeatedBlockTitle} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
                                                                    <p className={"repeatedblockDescription pr-4 mb-3 pl-md-4 "+S.Std5LeftRepeatedBlockDescription} dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                                                </div>
                                                                <div className={"col-2 Std5LeftIconWrapper "+S.Std5LeftIconWrapper}>
                                                                    <div className={"Std5LeftIconCircleWrapper  "+S.Std5LeftIconCircleWrapper}>
                                                                        <img className={"Std5LeftIcon "+S.Std5LeftIcon} src={data.FGImage1} alt="Key Features Icon"/>
                                                                    </div>
                                                                </div>
                                                            </div>   
                                                        </div>
                                                    );
                                                })
                                            :
                                                null
                                        }
                                    </div>
                                    <div className={"col-12 col-lg-4 std5ImageWrapper mx-auto "+S.std5ImageWrapper}>
                                        <img className={"std5Image col-12 mx-auto "+S.std5Image} src={this.state.blocks.fgImage1} alt="std5RepBlock Image"/>
                                    </div>
                                    <div className={"col-12 col-lg-4 std5RightRepeatedBlockWrapper "+S.std5RightRepeatedBlockWrapper}>
                                        {
                                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                                this.state.blocks.repeatedBlocks.slice(4,8).map((data, index)=>{
                                                    return(
                                                        <div className={"col-12 std5RightRepeatedBlock "+S.std5RightRepeatedBlock} key={index}>
                                                            <div className="row">
                                                                <div className={"col-2 std5RightIconWrapper "+S.std5RightIconWrapper}>
                                                                    <div className={"std5RightIconCircleWrapper pull-right "+S.std5RightIconCircleWrapper}>
                                                                        <img className={"std5RightIcon "+S.std5RightIcon} src={data.FGImage1} alt="Key Feature Icon"/>
                                                                    </div>
                                                                </div>
                                                                <div className={"col-10 text-left std5RightRepeatedBlockTextWrapper "+S.std5RightRepeatedBlockTextWrapper}>
                                                                    <h3 className={"repeatedblockTitle mr-4 pl-md-4 "+S.std5RightRepeatedBlockTitle} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
                                                                    <p className={"repeatedblockDescription justify-content pr-4 mb-3 pl-md-4 "+S.std5RightRepeatedBlockDescription} dangerouslySetInnerHTML={{ __html: data.Description } }></p>
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
                        </section>
                    :
                        <section className="col-12 stdBlockWrapper">
                            <div className="row">
                                <StdBlockSeparatorBlue />
                                <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
                                <div className={"col-12 mb-5 "+S.stdRepDescrption}>
                                    <p className="stdBlockDescriptionBlack" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                                </div> 
                                <div className={"col-12 Std5TextNImageWrapper "+S.Std5TextNImageWrapper}>
                                    <div className={"col-12 col-lg-4 Std5LeftRepeatedBlockWrapper "+S.Std5LeftRepeatedBlockWrapper}>
                                        {
                                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                                this.state.blocks.repeatedBlocks.slice(0,4).map((data, index)=>{
                                                    return(
                                                        <div className={"col-12 Std5LeftRepeatedBlock "+S.Std5LeftRepeatedBlock} key={index}>
                                                            <div className="row">
                                                                <div className={"col-10 Std5LeftRepeatedBlockTextWrapper text-right "+S.Std5LeftRepeatedBlockTextWrapper}>
                                                                    <h3 className={"repeatedblockTitle mr-4 pl-md-4 "+S.Std5LeftRepeatedBlockTitle} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
                                                                    <p className={"repeatedblockDescription pr-4 mb-3 pl-md-4 "+S.Std5LeftRepeatedBlockDescription} dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                                                </div>
                                                                <div className={"col-2 Std5LeftIconWrapper "+S.Std5LeftIconWrapper}>
                                                                    <div className={"Std5LeftIconCircleWrapper  "+S.Std5LeftIconCircleWrapper}>
                                                                        <img className={"Std5LeftIcon "+S.Std5LeftIcon} src={data.FGImage1} alt="Key Features Icon"/>
                                                                    </div>
                                                                </div>
                                                            </div>   
                                                        </div>
                                                    );
                                                })
                                            :
                                                null
                                        }
                                    </div>
                                    <div className={"col-12 col-lg-4 std5ImageWrapper mx-auto "+S.std5ImageWrapper}>
                                        <img className={"std5Image col-12 mx-auto "+S.std5Image} src={this.state.blocks.fgImage1} alt="std5RepBlock Image"/>
                                    </div>
                                    <div className={"col-12 col-lg-4 std5RightRepeatedBlockWrapper "+S.std5RightRepeatedBlockWrapper}>
                                        {
                                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                                this.state.blocks.repeatedBlocks.slice(4,8).map((data, index)=>{
                                                    return(
                                                        <div className={"col-12 std5RightRepeatedBlock "+S.std5RightRepeatedBlock} key={index}>
                                                            <div className="row">
                                                                <div className={"col-2 std5RightIconWrapper "+S.std5RightIconWrapper}>
                                                                    <div className={"std5RightIconCircleWrapper pull-right "+S.std5RightIconCircleWrapper}>
                                                                        <img className={"std5RightIcon "+S.std5RightIcon} src={data.FGImage1} alt="Key Feature Icon"/>
                                                                    </div>
                                                                </div>
                                                                <div className={"col-10 text-left std5RightRepeatedBlockTextWrapper "+S.std5RightRepeatedBlockTextWrapper}>
                                                                    <h3 className={"repeatedblockTitle mr-4 pl-md-4 "+S.std5RightRepeatedBlockTitle} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
                                                                    <p className={"repeatedblockDescription justify-content pr-4 mb-3 pl-md-4 "+S.std5RightRepeatedBlockDescription} dangerouslySetInnerHTML={{ __html: data.Description } }></p>
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
                        </section>
                }
            </div>
		);
	}
}