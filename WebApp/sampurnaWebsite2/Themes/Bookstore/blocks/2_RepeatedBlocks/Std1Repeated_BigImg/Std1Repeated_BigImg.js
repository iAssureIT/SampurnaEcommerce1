import React, {Component} 		from 'react'
import axios              		from 'axios';


import StdBlockSeparatorWhite   from '../../8_Common/StdBlockSeparatorWhite/StdBlockSeparatorWhite.js';
import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleWhite       from '../../8_Common/StdBlockTitleWhite/StdBlockTitleWhite.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S                  		from './Std1Repeated_BigImg.module.css';


export default class Std1Repeated_BigImg extends Component{

	constructor(props){
		super(props);
		this.state = {
		blocks: {
			"blockType"          : "2_RepeatedBlocks",
			"blockComponentName" : "Std1Repeated_BigImg",
			"blockTitle"         : "Standard 1 Repeated - Block With Big Image",
			"blockSubTitle"      : "",
			"blockDescription"   : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including.",
			"fgImage1"           : "/images/CMSImages/BlockFGImg.png",
			"fgImage2"           : "",
			"bgImage"            : "",
			"repeatedBlocks"     : [
				{
					Title        : "Lorem Ipsum",
					SubTitle     : "",
					Description  : "",
					FGImage1     : "/images/CMSImages/RepeatedBlockFGImg.png",
					FGImage2     : "",
					BGImage      : "",
					Link         : ""
				},
				{
					Title        : "Lorem Ipsum",
					SubTitle     : "",
					Description  : "",
					FGImage1     : "/images/CMSImages/RepeatedBlockFGImg.png",
					FGImage2     : "",
					BGImage      : "",
					Link         : ""
				},
				{
					Title        : "Lorem Ipsum",
					SubTitle     : "",
					Description  : "",
					FGImage1     : "/images/CMSImages/RepeatedBlockFGImg.png",
					FGImage2     : "",
					BGImage      : "",
					Link         : ""
				},
				{
					Title        : "Lorem Ipsum", 
					SubTitle     : "", 
					Description  : "",
					FGImage1     : "/images/CMSImages/RepeatedBlockFGImg.png",
					FGImage2     : "",
					BGImage      : "",
					Link         : "" 
				}
			],
			"bgVideo"			 : "",
			"fgVideo"			 : "",
			"blockGroup"		 : "",
			"blockAppearOnPage"	 : ""
		},
		blockID 				 : "",
		block_id				 : ""
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
							<div className="row">
								<StdBlockSeparatorWhite />
								<StdBlockTitleWhite blockTitle={this.state.blocks.blockTitle} />
								<div className={"col-12 mb-5 "+S.stdRepDescrption}>
									<p className="stdBlockDescriptionWhite" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
								</div>
								<div className={"col-12 d-flex justify-content-center "+S.stdBlockImageWrapper}>
									<img className={"pb-5 mx-auto "+S.stdBigImage} src={this.state.blocks.fgImage1} alt="iAssureIT" loading="lazy" />
								</div>
								<div className={"col-10 mx-auto "+S.reptedblockwrapp}>
									{
										this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length>0
										?
											this.state.blocks.repeatedBlocks.map((data,index)=>{
												return(
													<div className={"col-12 col-sm-6 col-md-3 mx-auto mb-xs-5 mb-sm-5 "+S.std1RepBlk} key={index}>
														<div className={"col-12 pb-4 std1RepSubBlk "+S.std1RepSubBlk}>
															<img  loading="lazy" src={data.FGImage1} alt="std1RepBlk" className={"lazyload img-responsive "+S.std1RepSubBlk_img} />
															<div className="col-12 text-center">
																<h3 className={"repeatedblockTitle "+S.std1Title} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
															</div>
														</div>
													</div>
												)
											})
										:
											null
									}
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
								<div className={"col-12 d-flex justify-content-center "+S.stdBlockImageWrapper}>
									<img className={"pb-5 mx-auto "+S.stdBigImage} src={this.state.blocks.fgImage1} alt="iAssureIT" loading="lazy" />
								</div> 
								<div className={"col-10 mx-auto "+S.reptedblockwrapp}>
									{
										this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length>0
										?
											this.state.blocks.repeatedBlocks.map((data,index)=>{
												return(
													<div className={"col-12 col-sm-6 col-md-3 mx-auto mb-xs-5 mb-sm-5 "+S.std1RepBlk} key={index}>
														<div className={"col-12 pb-4 std1RepSubBlk "+S.std1RepSubBlk}>
															<img  loading="lazy" src={data.FGImage1} alt="std1RepBlk" className={"lazyload img-responsive "+S.std1RepSubBlk_img} />
															<div className="col-12 text-center">
																<h3 className={"repeatedblockTitle "+S.std1Title} dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
															</div>
														</div>
													</div>
												)
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