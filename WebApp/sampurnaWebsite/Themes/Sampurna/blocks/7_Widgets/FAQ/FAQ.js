import React, {Component} 		from 'react'
import axios              		from 'axios';
import $                        from 'jquery';


import S                  		from './FAQ.module.css';


export default class FAQ extends Component{

	constructor(props){
		super(props);
		this.state = {
		blocks: {
			"blockType"          : "7_Widgets",
			"blockComponentName" : "FAQ",
			"blockTitle"         : "Frequently Asked Questions",
			"blockSubTitle"      : "FAQ",
			"blockDescription"   : "",
			"fgImage1"           : "",
			"fgImage2"           : "",
			"bgImage"            : "",
			"fgVideo"			 : "",
			"bgVideo"			 : "",
			"repeatedBlocks"     : [
				{
					Title        : "Faq1?",
					SubTitle     : "Lorem Ipsum has been the industry's",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq2?",
					SubTitle     : "Lorem Ipsum has been the industry's",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq3?",
					SubTitle     : "Lorem Ipsum has been the industry's",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq4?",
					SubTitle     : "Lorem Ipsum has been the industry's",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq5?",
					SubTitle     : "Lorem Ipsum has been the industry's",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq6?",
					SubTitle     : "Lorem Ipsum has been the industry's",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq7?",
					SubTitle     : "Lorem Ipsum has been the industry's",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq8?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq9?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq10?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq11?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq12?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq13?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq14?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq15?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq16?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq17?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq18?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq19?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq20?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq21?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq22?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq23?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq24?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq25?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq26?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq27?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq28?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq29?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq30?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq31?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq32?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq33?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq34?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq35?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq36?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq37?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq38?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq39?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq40?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq41?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq42?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq43?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq44?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq45?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq46?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq47?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq48?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq49?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq50?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq51?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq52?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq53?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq54?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq55?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
				{
					Title        : "Faq56?",
					SubTitle     : "",
					Description  : "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
					FGImage1     : "",
				},
			],
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

		$("#accordionEx").on("hide.bs.collapse show.bs.collapse", e => {
			$(e.target)
			.prev()
			.find("i:last-child")
			.toggleClass("fa-close fa-plus");
		});
	}

    render(){
        return(
            <section className={"col-12 "+S.faqWrapper}>
				<div className={"col-12 accordion md-accordion "+S.faqRepeatedBlockWrapper} id="accordionEx" role="tablist" aria-multiselectable="true">
					<div className="col-12 col-xl-10 offset-xl-1 my-5">
						<div className="row">
							<div className="col-12 col-lg-6">
								<div className="col-12">
									<div className={"col-12 "+S.faqSubTitleWrapper}>
										<h5 className={"mb-0 text-dark "+S.faqSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].SubTitle : ""}}></h5>
									</div>

									<div className={"col-12 card mt-3 "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading1">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse1" aria-expanded="false" aria-controls="collapse1">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse1" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading1" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading2">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse2" aria-expanded="false" aria-controls="collapse2">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse2" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading2" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].Description : ""}}></p>
											</div>
										</div>
									</div>
									
									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading3">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse3" aria-expanded="false" aria-controls="collapse3">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse3" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading3" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading4">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse4" aria-expanded="false" aria-controls="collapse4">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[3] ? this.state.blocks.repeatedBlocks[3].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse4" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading4" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[3] ? this.state.blocks.repeatedBlocks[3].Description : ""}}></p>
											</div>
										</div>
									</div>
									
									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading5">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse5" aria-expanded="false" aria-controls="collapse5">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[4] ? this.state.blocks.repeatedBlocks[4].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse5" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading5" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[4] ? this.state.blocks.repeatedBlocks[4].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading6">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse6" aria-expanded="false" aria-controls="collapse6">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[5] ? this.state.blocks.repeatedBlocks[5].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse6" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading6" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[5] ? this.state.blocks.repeatedBlocks[5].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading7">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse7" aria-expanded="false" aria-controls="collapse7">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[6] ? this.state.blocks.repeatedBlocks[6].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse7" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading7" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[6] ? this.state.blocks.repeatedBlocks[6].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading8">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse8" aria-expanded="false" aria-controls="collapse8">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[7] ? this.state.blocks.repeatedBlocks[7].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse8" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading8" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[7] ? this.state.blocks.repeatedBlocks[7].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading9">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse9" aria-expanded="false" aria-controls="collapse9">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[8] ? this.state.blocks.repeatedBlocks[8].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse9" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading9" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[8] ? this.state.blocks.repeatedBlocks[8].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading10">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse10" aria-expanded="false" aria-controls="collapse10">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[9] ? this.state.blocks.repeatedBlocks[9].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse10" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading10" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[9] ? this.state.blocks.repeatedBlocks[9].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading11">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse11" aria-expanded="false" aria-controls="collapse11">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[10] ? this.state.blocks.repeatedBlocks[10].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse11" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading11" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[10] ? this.state.blocks.repeatedBlocks[10].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading12">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse12" aria-expanded="false" aria-controls="collapse12">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[11] ? this.state.blocks.repeatedBlocks[11].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse12" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading12" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[11] ? this.state.blocks.repeatedBlocks[11].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading13">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse13" aria-expanded="false" aria-controls="collapse13">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[12] ? this.state.blocks.repeatedBlocks[12].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse13" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading13" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[12] ? this.state.blocks.repeatedBlocks[12].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading14">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse14" aria-expanded="false" aria-controls="collapse14">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[13] ? this.state.blocks.repeatedBlocks[13].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse14" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading14" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[13] ? this.state.blocks.repeatedBlocks[13].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading15">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse15" aria-expanded="false" aria-controls="collapse15">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[14] ? this.state.blocks.repeatedBlocks[14].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse15" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading15" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[14] ? this.state.blocks.repeatedBlocks[14].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading16">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse16" aria-expanded="false" aria-controls="collapse16">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[15] ? this.state.blocks.repeatedBlocks[15].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse16" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading16" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[15] ? this.state.blocks.repeatedBlocks[15].Description : ""}}></p>
											</div>
										</div>
									</div>

								</div>
							</div>
							<div className="col-12 col-lg-6">
								<div className={"col-12 col-lg-10 mx-lg-auto "+S.faqImageWrapper}>
									<img className={S.faqImage1} src={this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].FGImage1 : ""} alt="" />
								</div>
							</div>
						</div>
					</div>

					<div className="col-12 col-xl-10 offset-xl-1 my-5">
						<div className="row">
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className={"col-12 col-lg-10 mx-lg-auto "+S.faqImageWrapper}>
									<img className={S.faqImage} src={this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].FGImage1 : ""} alt="" />
								</div>
							</div>	
						
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className="col-12">
									<div className={"col-12 "+S.faqSubTitleWrapper}>
										<h5 className={"mb-0 text-dark "+S.faqSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].SubTitle : ""}}></h5>
									</div>

									<div className={"col-12 card mt-3 "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading17">
												<a data-toggle="collapse" data-parent="#accordionEx" href="#collapse17" aria-expanded="true" aria-controls="collapse17">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[16] ? this.state.blocks.repeatedBlocks[16].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse17" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading17" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[16] ? this.state.blocks.repeatedBlocks[16].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading18">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse18" aria-expanded="false" aria-controls="collapse18">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[17] ? this.state.blocks.repeatedBlocks[17].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse18" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading18" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[17] ? this.state.blocks.repeatedBlocks[17].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading19">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse19" aria-expanded="false" aria-controls="collapse19">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[18] ? this.state.blocks.repeatedBlocks[18].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse19" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading19" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[18] ? this.state.blocks.repeatedBlocks[18].Description : ""}}></p>
											</div>
										</div>
									</div>
									
									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading20">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse20" aria-expanded="false" aria-controls="collapse20">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[19] ? this.state.blocks.repeatedBlocks[19].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse20" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading20" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[19] ? this.state.blocks.repeatedBlocks[19].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading21">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse21" aria-expanded="false" aria-controls="collapse21">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[20] ? this.state.blocks.repeatedBlocks[20].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse21" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading21" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[20] ? this.state.blocks.repeatedBlocks[20].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading22">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse22" aria-expanded="false" aria-controls="collapse22">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[21] ? this.state.blocks.repeatedBlocks[21].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse22" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading22" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[21] ? this.state.blocks.repeatedBlocks[21].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading23">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse23" aria-expanded="false" aria-controls="collapse23">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[22] ? this.state.blocks.repeatedBlocks[22].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse23" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading23" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[22] ? this.state.blocks.repeatedBlocks[22].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading24">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse24" aria-expanded="false" aria-controls="collapse24">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[23] ? this.state.blocks.repeatedBlocks[23].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse24" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading24" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[23] ? this.state.blocks.repeatedBlocks[23].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading25">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse25" aria-expanded="false" aria-controls="collapse25">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[24] ? this.state.blocks.repeatedBlocks[24].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse25" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading25" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[24] ? this.state.blocks.repeatedBlocks[24].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading26">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse26" aria-expanded="false" aria-controls="collapse26">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[25] ? this.state.blocks.repeatedBlocks[25].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse26" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading26" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[25] ? this.state.blocks.repeatedBlocks[25].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading27">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse27" aria-expanded="false" aria-controls="collapse27">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[26] ? this.state.blocks.repeatedBlocks[26].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse27" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading27" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[26] ? this.state.blocks.repeatedBlocks[26].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading28">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse28" aria-expanded="false" aria-controls="collapse28">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[27] ? this.state.blocks.repeatedBlocks[27].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse28" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading28" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[27] ? this.state.blocks.repeatedBlocks[27].Description : ""}}></p>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>

					<div className="col-12 col-xl-10 offset-xl-1 my-5">
						<div className="row">
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className="col-12">
									<div className={"col-12 "+S.faqSubTitleWrapper}>
										<h5 className={"mb-0 text-dark "+S.faqSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].SubTitle : ""}}></h5>
									</div>

									<div className={"col-12 card mt-3 "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading29">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse29" aria-expanded="false" aria-controls="collapse29">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[28] ? this.state.blocks.repeatedBlocks[28].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse29" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading29" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[28] ? this.state.blocks.repeatedBlocks[28].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading30">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse30" aria-expanded="false" aria-controls="collapse30">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[29] ? this.state.blocks.repeatedBlocks[29].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse30" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading30" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[29] ? this.state.blocks.repeatedBlocks[29].Description : ""}}></p>
											</div>
										</div>
									</div>
									
									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading31">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse31" aria-expanded="false" aria-controls="collapse31">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[30] ? this.state.blocks.repeatedBlocks[30].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse31" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading31" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[30] ? this.state.blocks.repeatedBlocks[30].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading32">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse32" aria-expanded="false" aria-controls="collapse32">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[31] ? this.state.blocks.repeatedBlocks[31].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse32" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading32" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[31] ? this.state.blocks.repeatedBlocks[31].Description : ""}}></p>
											</div>
										</div>
									</div>									
								</div>
							</div>
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className={"col-12 col-lg-10 mx-lg-auto "+S.faqImageWrapper}>
									<img className={S.faqImage1} src={this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].FGImage1 : ""} alt="" />
								</div>
							</div>
						</div>
					</div>

					<div className="col-12 col-xl-10 offset-xl-1 my-5">
						<div className="row">
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className={"col-12 col-lg-10 mx-lg-auto "+S.faqImageWrapper}>
									<img className={S.faqImage} src={this.state.blocks.repeatedBlocks[3] ? this.state.blocks.repeatedBlocks[3].FGImage1 : ""} alt="" />
								</div>
							</div>
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className="col-12">
									<div className={"col-12 "+S.faqSubTitleWrapper}>
										<h5 className={"mb-0 text-dark "+S.faqSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[3] ? this.state.blocks.repeatedBlocks[3].SubTitle : ""}}></h5>
									</div>

									<div className={"col-12 card mt-3 "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading33">
												<a data-toggle="collapse" data-parent="#accordionEx" href="#collapse33" aria-expanded="true" aria-controls="collapse33">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[32] ? this.state.blocks.repeatedBlocks[32].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse33" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading33" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[32] ? this.state.blocks.repeatedBlocks[32].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading34">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse34" aria-expanded="false" aria-controls="collapse34">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[33] ? this.state.blocks.repeatedBlocks[33].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse34" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading34" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[33] ? this.state.blocks.repeatedBlocks[33].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading35">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse35" aria-expanded="false" aria-controls="collapse35">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[34] ? this.state.blocks.repeatedBlocks[34].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse35" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading35" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[34] ? this.state.blocks.repeatedBlocks[34].Description : ""}}></p>
											</div>
										</div>
									</div>
									
									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading36">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse36" aria-expanded="false" aria-controls="collapse36">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[35] ? this.state.blocks.repeatedBlocks[35].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse36" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading36" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[35] ? this.state.blocks.repeatedBlocks[35].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading37">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse37" aria-expanded="false" aria-controls="collapse37">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[36] ? this.state.blocks.repeatedBlocks[36].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse37" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading37" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[36] ? this.state.blocks.repeatedBlocks[36].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading38">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse38" aria-expanded="false" aria-controls="collapse38">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[37] ? this.state.blocks.repeatedBlocks[37].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse38" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading38" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[37] ? this.state.blocks.repeatedBlocks[37].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading39">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse39" aria-expanded="false" aria-controls="collapse39">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[38] ? this.state.blocks.repeatedBlocks[38].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse39" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading39" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[38] ? this.state.blocks.repeatedBlocks[38].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading40">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse40" aria-expanded="false" aria-controls="collapse40">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[39] ? this.state.blocks.repeatedBlocks[39].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse40" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading40" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[39] ? this.state.blocks.repeatedBlocks[39].Description : ""}}></p>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>

					<div className="col-12 col-xl-10 offset-xl-1 my-5">
						<div className="row">
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className="col-12">
									<div className={"col-12 "+S.faqSubTitleWrapper}>
										<h5 className={"mb-0 text-dark "+S.faqSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[4] ? this.state.blocks.repeatedBlocks[4].SubTitle : ""}}></h5>
									</div>

									<div className={"col-12 card mt-3 "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading41">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse41" aria-expanded="false" aria-controls="collapse41">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[40] ? this.state.blocks.repeatedBlocks[40].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse41" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading41" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[40] ? this.state.blocks.repeatedBlocks[40].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading42">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse42" aria-expanded="false" aria-controls="collapse42">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[41] ? this.state.blocks.repeatedBlocks[41].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse42" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading42" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[41] ? this.state.blocks.repeatedBlocks[41].Description : ""}}></p>
											</div>
										</div>
									</div>
									
									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading43">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse43" aria-expanded="false" aria-controls="collapse43">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[42] ? this.state.blocks.repeatedBlocks[42].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse43" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading43" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[42] ? this.state.blocks.repeatedBlocks[42].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading44">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse44" aria-expanded="false" aria-controls="collapse44">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[43] ? this.state.blocks.repeatedBlocks[43].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse44" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading44" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[43] ? this.state.blocks.repeatedBlocks[43].Description : ""}}></p>
											</div>
										</div>
									</div>									
								</div>
							</div>
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className={"col-12 col-lg-10 mx-lg-auto "+S.faqImageWrapper}>
									<img className={S.faqImage1} src={this.state.blocks.repeatedBlocks[4] ? this.state.blocks.repeatedBlocks[4].FGImage1 : ""} alt="" />
								</div>
							</div>
						</div>
					</div>

					<div className="col-12 col-xl-10 offset-xl-1 my-5">
						<div className="row">
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className={"col-12 col-lg-10 mx-lg-auto "+S.faqImageWrapper}>
									<img className={S.faqImage} src={this.state.blocks.repeatedBlocks[5] ? this.state.blocks.repeatedBlocks[5].FGImage1 : ""} alt="" />
								</div>
							</div>
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className="col-12">
									<div className={"col-12 "+S.faqSubTitleWrapper}>
										<h5 className={"mb-0 text-dark "+S.faqSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[5] ? this.state.blocks.repeatedBlocks[5].SubTitle : ""}}></h5>
									</div>

									<div className={"col-12 card mt-3 "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading45">
												<a data-toggle="collapse" data-parent="#accordionEx" href="#collapse45" aria-expanded="true" aria-controls="collapse45">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[44] ? this.state.blocks.repeatedBlocks[44].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse45" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading45" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[44] ? this.state.blocks.repeatedBlocks[44].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading46">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse46" aria-expanded="false" aria-controls="collapse46">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[45] ? this.state.blocks.repeatedBlocks[45].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse46" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading46" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[45] ? this.state.blocks.repeatedBlocks[45].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading47">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse47" aria-expanded="false" aria-controls="collapse47">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[46] ? this.state.blocks.repeatedBlocks[46].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse47" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading47" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[46] ? this.state.blocks.repeatedBlocks[46].Description : ""}}></p>
											</div>
										</div>
									</div>
									
									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading48">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse48" aria-expanded="false" aria-controls="collapse48">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[47] ? this.state.blocks.repeatedBlocks[47].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse48" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading48" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[47] ? this.state.blocks.repeatedBlocks[47].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading49">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse49" aria-expanded="false" aria-controls="collapse49">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[48] ? this.state.blocks.repeatedBlocks[48].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse49" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading49" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[48] ? this.state.blocks.repeatedBlocks[48].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading50">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse50" aria-expanded="false" aria-controls="collapse50">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[49] ? this.state.blocks.repeatedBlocks[49].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse50" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading50" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[49] ? this.state.blocks.repeatedBlocks[49].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading51">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse51" aria-expanded="false" aria-controls="collapse51">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[50] ? this.state.blocks.repeatedBlocks[50].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse51" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading51" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[50] ? this.state.blocks.repeatedBlocks[50].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading52">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse52" aria-expanded="false" aria-controls="collapse52">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[51] ? this.state.blocks.repeatedBlocks[51].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse52" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading52" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[51] ? this.state.blocks.repeatedBlocks[51].Description : ""}}></p>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>

					<div className="col-12 col-xl-10 offset-xl-1 my-5">
						<div className="row">
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className="col-12">
									<div className={"col-12 "+S.faqSubTitleWrapper}>
										<h5 className={"mb-0 text-dark "+S.faqSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[6] ? this.state.blocks.repeatedBlocks[6].SubTitle : ""}}></h5>
									</div>

									<div className={"col-12 card mt-3 "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading53">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse53" aria-expanded="false" aria-controls="collapse53">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[52] ? this.state.blocks.repeatedBlocks[52].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse53" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading53" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[52] ? this.state.blocks.repeatedBlocks[52].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading54">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse54" aria-expanded="false" aria-controls="collapse54">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[53] ? this.state.blocks.repeatedBlocks[53].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse54" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading54" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[53] ? this.state.blocks.repeatedBlocks[53].Description : ""}}></p>
											</div>
										</div>
									</div>
									
									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading55">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse55" aria-expanded="false" aria-controls="collapse55">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[54] ? this.state.blocks.repeatedBlocks[54].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse55" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading55" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[54] ? this.state.blocks.repeatedBlocks[54].Description : ""}}></p>
											</div>
										</div>
									</div>

									<div className={"col-12 card "+S.faqCard}>
										<div className="row">
											<div className={"col-12 card-header "+S.faqCardHeader} role="tab" id="heading56">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse56" aria-expanded="false" aria-controls="collapse56">
													<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[55] ? this.state.blocks.repeatedBlocks[55].Title : ""}}></h6>
													<i className={"fas fa-plus pull-right "+S.plusIconWrapper}></i>
												</a>
											</div>
											<div id="collapse56" className={"col-12 collapse "+S.faqCollapse} role="tabpanel" aria-labelledby="heading56" data-parent="#accordionEx">
												<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[55] ? this.state.blocks.repeatedBlocks[55].Description : ""}}></p>
											</div>
										</div>
									</div>									
								</div>
							</div>
							<div className="col-12 col-lg-6 mt-lg-3">
								<div className={"col-12 col-lg-10 mx-lg-auto "+S.faqImageWrapper}>
									<img className={S.faqImage1} src={this.state.blocks.repeatedBlocks[6] ? this.state.blocks.repeatedBlocks[6].FGImage1 : ""} alt="" />
								</div>
							</div>
						</div>
					</div>
				</div>
            </section>
        )
    }
}