import React, {Component}       from 'react';
import axios                    from 'axios';


import StdBlockSeparatorWhite   from '../../8_Common/StdBlockSeparatorWhite/StdBlockSeparatorWhite.js';
import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleWhite       from '../../8_Common/StdBlockTitleWhite/StdBlockTitleWhite.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S                        from './Std2Repeated_WithoutImg.module.css';


export default class Std2Repeated_WithoutImg extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockType"          : "2_RepeatedBlocks",
                "blockComponentName" : "Std2Repeated_WithoutImg",
                "blockTitle"         : "Standard 2 Repeated - Without Image",
                "blockSubTitle"      : "",
                "blockDescription"   : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
                "fgImage1"           : "/images/001.png",
                "fgImage2"           : "",
                "bgImage"            : "",
                "repeatedBlocks":[
                    {
                        Title        : "HEAD OFFICE",
                        SubTitle     : "Pune(INDIA)",
                        Description  : "#323, Amanora Chambers, Magarpatta, Pune, Maharashtra 411028",
                        FGImage1     : "",
                        FGImage2     : "",
                        BGImage      : "",
                        Link         : ""
                    },
                    {
                        Title        : "PHONE",
                        SubTitle     : "+91 99233 93733",
                        Description  : "",
                        FGImage1     : "",
                        FGImage2     : "",
                        BGImage      : "",
                        Link         : ""
                    },
                    {
                        Title        : "EMAIL",
                        SubTitle     : "i@iassureit.com", 
                        Description  : "",
                        FGImage1     : "",
                        FGImage2     : "",
                        BGImage      : "",
                        Link         : ""
                    },
                ],
                "bgVideo"		     : "",
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

    render(){
        return(
            <div className="col-12">
                {
                    this.state.blocks.bgImage
                    ?
                        <section className="col-12 stdBlockWrapperBackground" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                            <StdBlockSeparatorWhite />
                            <StdBlockTitleWhite blockTitle={this.state.blocks.blockTitle} />
                            <div className={"col-12 mb-md-5 std2TextWrapper "+S.std2TextWrapper}>
                                <p className={"stdBlockDescriptionWhite "+S.std2Description} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                            </div>
                            <div className={"col-10 mx-auto d-flex text-center std2FieldWrapper "+S.std2FieldWrapper}>
                                <div className="row">
                                    {
                                        this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0
                                        ?
                                            this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                return(
                                                    <div className={"col-12 col-md-4  std2SubFieldWrapper "+S.std2SubFieldWrapper} key={index}>
                                                        <div className="row">
                                                            <div className={"col-12 std2IconWrapper "+S.std2IconWrapper}>
                                                                <div className={"col-12 col-md-4 offset-md-4  "+S.std2Icon}>
                                                                    <img className="img-responsive mx-auto " src={data.FGImage1} alt="std2RepBlock Icon"/>
                                                                </div>
                                                            </div>
                                                            <div className={"col-12 std2TextWrapper2 "+S.std2TextWrapper2}>
                                                                <h3 className={"std2Title my-3 repeatedblockTitle "+S.std2Title} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
                                                                <h4 className={"std2SubTitle  repeatedblockSubTitle "+S.std2SubTitle} dangerouslySetInnerHTML={{ __html: data.SubTitle } }></h4>
                                                                <p className={"std2Description2 repeatedblockDescription "+S.std2Description2} dangerouslySetInnerHTML={{ __html: data.Description } }></p>
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
                        </section>
                    :
                        <section className="col-12 stdBlockWrapper">
                            <StdBlockSeparatorBlue />
                            <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
                            <div className={"col-12 mb-md-5 std2TextWrapper "+S.std2TextWrapper}>
                                <p className={"stdBlockDescriptionBlack "+S.std2Description} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                            </div>
                            <div className={"col-10 mx-auto d-flex text-center std2FieldWrapper "+S.std2FieldWrapper}>
                                <div className="row">
                                    {
                                        this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0
                                        ?
                                            this.state.blocks.repeatedBlocks.map((data, index)=>{
                                                return(
                                                    <div className={"col-12 col-md-4  std2SubFieldWrapper "+S.std2SubFieldWrapper} key={index}>
                                                        <div className="row">
                                                            <div className={"col-12 std2IconWrapper "+S.std2IconWrapper}>
                                                                <div className={"col-12 col-md-4 offset-md-4  "+S.std2Icon}>
                                                                    <img className="img-responsive mx-auto " src={data.FGImage1} alt="std2RepBlock Icon"/>
                                                                </div>
                                                            </div>
                                                            <div className={"col-12 std2TextWrapper2 "+S.std2TextWrapper2}>
                                                                <h3 className={"std2Title my-3 repeatedblockTitle "+S.std2Title} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
                                                                <h4 className={"std2SubTitle  repeatedblockSubTitle "+S.std2SubTitle} dangerouslySetInnerHTML={{ __html: data.SubTitle } }></h4>
                                                                <p className={"std2Description2 repeatedblockDescription "+S.std2Description2} dangerouslySetInnerHTML={{ __html: data.Description } }></p>
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
                        </section>
                }
            </div>
        )
    }
}