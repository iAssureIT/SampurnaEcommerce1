import React from 'react';
import s     from "./Banner.module.css";
import axios from 'axios';
// import Image from 'next/image';

export default class ServicesBanner extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		blocks: {
			"blockTitle"        : "Lorem Ipsum",
			"blockSubTitle"     : "<b>Lorem Ipsum</b>",
			"blockDescription"  : "Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elity",
			"blockComponentName": "TemplateOverview",
			"blockType"         : "7_Widgets",
			"bgImage"           : "/images/CMSImages/BlockBGImg.jpeg",
			"fgImage"           : "/images/CMSImages/BlockFGImg.png",
			"repeatedBlocks": [

				{
					Title       : "Sample 5",
					SubTitle    : "",
					Image       : "/images/4.png",
					Link        : "",
					Description : ""
				}
			],
			"bgVideo"           : "",
			"fgVideo"           : "",
			"blockGroup"        : "",
			"blockAppearOnPage" : ""
		},
		blockID: "",
		block_id: ""
	};
}
componentDidMount() {
	/*console.log("==>",this.props.block_id);*/
	{
		axios
			.get('/api/blocks/get/' + this.props.block_id)
			.then((response) => {
				if (response.data) {
					// console.log("ListofServices =",response.data);
					this.setState({
						blocks: response.data
					});
				}
			})
			.catch(function (error) {
				console.log(error);
			})
	}
	this.setState({
		block_id: this.props.block_id
	});
}

	render() {
		return (
       <section className="BannerWrapper">
              <div class={ "BannerImageWrapper row "+s.BannerImageWrapper} style={{backgroundImage: "url("+this.state.blocks.bgImage+ ")"}}>
                  <div class="col-md">
                    <div className={ "TitleWrapper "+s.TitleWrapper}>
                      <h1 className={ "bannerTitle Title1  "+s.Title1} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h1>
                      <br/>
                      <h3 className={ "bannerSubTitle Title2 "+s.Title2} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></h3>
                      <br/>
                      <h4 className={ "bannerDescription Title3 "+s.Title3} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></h4>
                    </div>
                  </div>
                  
                  <div class="col-md p-5">
                    <img src={this.state.blocks.fgImage} className={ "bannerImgSB img-responsive lazyload img-fluid "+s.bannerImgSB} alt="Responsive image"></img>
                  </div>
              </div>
          </section>
);
}
}
				