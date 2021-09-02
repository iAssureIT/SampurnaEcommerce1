import React, {Component}       from 'react';
import axios                    from 'axios';


import StdBlockSeparatorWhite   from '../../8_Common/StdBlockSeparatorWhite/StdBlockSeparatorWhite.js';
import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleWhite       from '../../8_Common/StdBlockTitleWhite/StdBlockTitleWhite.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S                        from "./Std3Repeated_Carousel.module.css";


export default class Std3Repeated_Carousel extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockType"          : "2_RepeatedBlocks",
                "blockComponentName" : "Std3Repeated_Carousel",
                "blockTitle"         : "Standard 3 Repeated - Carousel",
                "blockSubTitle"      : "The Company Of The Year 2018",
                "blockDescription"   : "",
                "bgImage"            : "",
                "fgImage1"           : "",
                "fgImage2"           : "",
                "repeatedBlocks"     : [
                    {
                        Title        : "",
                        SubTitle     : "Lorem Ipsum1",
                        Description  : "Lorem Ipsum1 is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    					FGImage1     : "",
	    				FGImage2     : "",
		    			BGImage      : "",
                        Link         : "https://iassureit.com"
                    },
                    {
                        Title        : "",
                        SubTitle     : "Lorem Ipsum2",
                        Description  : "Lorem Ipsum2 is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
			    		FGImage1     : "",
				    	FGImage2     : "",
					    BGImage      : "",
                        Link         : "https://iassureit.com"
                    },
                    {
                        Title        : "",
                        SubTitle     : "Lorem Ipsum3",
                        Description  : "Lorem Ipsum3 is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
					    FGImage1     : "",
					    FGImage2     : "",
					    BGImage      : "",
                        Link         : "https://iassureit.com"
                    },
                    {
                        Title        : "",
                        SubTitle     : "Lorem Ipsum4",
                        Description  : "Lorem Ipsum4 is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    					FGImage1     : "",
	    				FGImage2     : "",
		    			BGImage      : "",
                        Link         : "https://iassureit.com"
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

    displayDetails(event){

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
                                <div className={"col-12 "+S.std3BlockTextNImageWrapper}>
                                    <div className="row">
                                        <div className={"col-12 "+S.tabWrapper}>
                                            <div className="tab-content text-center ">
                                                {
                                                    this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0
                                                    ?
                                                        this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                            return(
                                                                <div key={"key1-"+index} id={"tab-"+index} className={"tab-pane fade in " + (index===0 ? "active" : "")}>
                                                                    <div className="row">
                                                                        <div className={"col-12 col-md-6 pt-5 "+S.stdRep3ImageWrapper}>
                                                                            {
                                                                                this.state.blocks.fgImage1
                                                                                ?
                                                                                    <img src={this.state.blocks.fgImage1[index]} className={"img-responsive mx-auto "+S.stdRep3Image} alt="iAssureIT Award"/>
                                                                                :
                                                                                    null
                                                                            }
                                                                        </div>
                                                                        <div className={"col-12 col-md-6 pt-5 stdRep3ContentWrapper "+S.stdRep3ContentWrapper}>
                                                                            <h4 className={"stdBlockDescriptionWhite"} dangerouslySetInnerHTML={{ __html: data.SubTitle } }></h4>
                                                                            <p className={"stdBlockDescriptionWhite"} dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                                                            <p className={"stdBlockDescriptionWhite "+S.marker}><a href={data.Link}  dangerouslySetInnerHTML={{ __html: data.Link } }></a></p>
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
                                <div className="col-10 col-md-8 offset-md-2 col-lg-6 offset-lg-3 mx-auto ">
                                    <ul className="nav nav-pills col-xs-6 col-md-12 mx-auto ">
                                        {
                                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 
                                            ?
                                            this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                return(
                                                    <li className={"bgcolorhide mx-auto "+(index===0 ? S.active : "")} key={index}>
                                                        <a href={"#tab-"+index} data-toggle="pill" className="bgcolorhide">
                                                            <div className={S.tabImageWrapper}>
                                                                <img src={data.FGImage1} className={"img-responsive "+S.tabImageWrapper} alt="iAssureIT Award"/>
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
                        </section>
                    :
                        <section className="col-12 stdBlockWrapper">
                            <div className="row">
                            <StdBlockSeparatorBlue />
                            <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
                                <div className={"col-12 "+S.std3BlockTextNImageWrapper}>
                                    <div className="row">
                                        <div className={"col-12 "+S.tabWrapper}>
                                            <div className="tab-content text-center ">
                                                {
                                                    this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0
                                                    ?
                                                        this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                            return(
                                                                <div key={"key1-"+index} id={"tab-"+index} className={"tab-pane fade in " + (index===0 ? "active" : "")}>
                                                                    <div className="row">
                                                                        <div className={"col-12 col-md-6 pt-5 "+S.stdRep3ImageWrapper}>
                                                                            {
                                                                                this.state.blocks.fgImage1
                                                                                ?
                                                                                    <img src={this.state.blocks.fgImage1[index]} className={"img-responsive mx-auto "+S.stdRep3Image} alt="iAssureIT Award"/>
                                                                                :
                                                                                    null
                                                                            }
                                                                        </div>
                                                                        <div className={"col-12 col-md-6 pt-5 stdRep3ContentWrapper "+S.stdRep3ContentWrapper}>
                                                                            <h4 className={"stdBlockSubTitleBlack "+S.marker} dangerouslySetInnerHTML={{ __html: data.SubTitle } }></h4>
                                                                            <p className={"stdBlockDescriptionBlack "+S.marker} dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                                                            <p className=""><a href={data.Link}  dangerouslySetInnerHTML={{ __html: data.Link } }></a></p>
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
                                <div className="col-10 col-md-8 offset-md-2 col-lg-6 offset-lg-3 mx-auto ">
                                    <ul className="nav nav-pills col-xs-6 col-md-12 mx-auto ">
                                        {
                                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 
                                            ?
                                            this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                return(
                                                    <li className={"bgcolorhide mx-auto "+(index===0 ? S.active : "")} key={index}>
                                                        <a href={"#tab-"+index} data-toggle="pill" className="bgcolorhide">
                                                            <div className={S.tabImageWrapper}>
                                                                <img src={data.FGImage1} className={"img-responsive "+S.tabImageWrapper} alt="iAssureIT Award"/>
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
                        </section>
                }
            </div>
        )
    }
}