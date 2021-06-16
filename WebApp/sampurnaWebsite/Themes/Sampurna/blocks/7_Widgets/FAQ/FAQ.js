import React, {Component} 		from 'react'
import axios              		from 'axios';


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
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "/images/CMSImages/BranniganHealthCenter/Client1.jpg",
				},
				{
					Title        : "Faq2?",
					Description  : "Naturopathic Medicine is the combination of the greatest achievements of the traditional, western diagnostic and treatment techniques with the therapeutic methodologies of naturopathic and ancient medical methods.",
					FGImage1     : "/images/CMSImages/BranniganHealthCenter/Client2.jpg",
				},
				{
					Title        : "Faq3?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "/images/CMSImages/BranniganHealthCenter/Client3.jpg",
				},
				{
					Title        : "Faq4?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "/images/CMSImages/BranniganHealthCenter/Client4.jpg",
				},
				{
					Title        : "Faq5?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq6?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq7?",
					Description  : "Naturopathic Medicine is the combination of the greatest achievements of the traditional, western diagnostic and treatment techniques with the therapeutic methodologies of naturopathic and ancient medical methods.",
					FGImage1     : "",
				},
				{
					Title        : "Faq8?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq9?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq10?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq11?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq12?",
					Description  : "Naturopathic Medicine is the combination of the greatest achievements of the traditional, western diagnostic and treatment techniques with the therapeutic methodologies of naturopathic and ancient medical methods.",
					FGImage1     : "",
				},
				{
					Title        : "Faq13?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq14?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq15?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq16?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq17?",
					Description  : "Naturopathic Medicine is the combination of the greatest achievements of the traditional, western diagnostic and treatment techniques with the therapeutic methodologies of naturopathic and ancient medical methods.",
					FGImage1     : "",
				},
				{
					Title        : "Faq18?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq19?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
					FGImage1     : "",
				},
				{
					Title        : "Faq20?",
					Description  : "Suspendisse at consectetuer amet sit ligula, accumsan in vel, facilisi vulputate, maxime in lacinia suscipit sagittis diam, cras risus aliquam quis sit. Velit elit nec. Nec non et curabitur augue, aliquet sit. Cursus duis in eget in libero etiam, ac ante magna nec, ante lectus, consectetuer neque.",
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
	}

    render(){
        return(
            <section className={"col-12 "+S.faqWrapper}>
                <div className={"col-10 offset-1 "+S.faqTextWrapper}>
                    {/* <h5 className={S.faqSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></h5> */}
                    <h2 className={S.faqTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h2>
                </div>

                <div className={"col-12 "+S.faqContentWrapper}>
                    <div className="row">
                        <div className={"col-12 accordion md-accordion  "+S.faqRepeatedBlockWrapper} id="accordionEx" role="tablist" aria-multiselectable="true">
                            <div className="row">

								<div className="col-12 col-lg-10 offset-lg-1">
								<div className="row">
									<div className={"col-12 my-auto col-lg-4 "+S.faqImageWrapper}>
										<img className={"faqImage "+S.faqImage} src={this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].FGImage1 : ""} alt="" />
									</div>
									
									<div className="col-12 col-lg-8">
										<div className="col-12 card">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading1">
													<a data-toggle="collapse" data-parent="#accordionEx" href="#collapse1" aria-expanded="true" aria-controls="collapse1">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse1" className="col-12 collapse" role="tabpanel" aria-labelledby="heading1" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading2">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse2" aria-expanded="false" aria-controls="collapse2">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse2" className="col-12 collapse" role="tabpanel" aria-labelledby="heading2" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading3">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse3" aria-expanded="false" aria-controls="collapse3">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse3" className="col-12 collapse" role="tabpanel" aria-labelledby="heading3" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].Description : ""}}></p>
												</div>
											</div>
										</div>
										
										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading4">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse4" aria-expanded="false" aria-controls="collapse4">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[3] ? this.state.blocks.repeatedBlocks[3].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse4" className="col-12 collapse" role="tabpanel" aria-labelledby="heading4" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[3] ? this.state.blocks.repeatedBlocks[3].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading5">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse5" aria-expanded="false" aria-controls="collapse5">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[4] ? this.state.blocks.repeatedBlocks[4].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse5" className="col-12 collapse" role="tabpanel" aria-labelledby="heading5" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[4] ? this.state.blocks.repeatedBlocks[4].Description : ""}}></p>
												</div>
											</div>
										</div>
									</div>
									</div>
								</div>

								<div className="col-12 col-lg-10 offset-lg-1 my-5">
								<div className="row">
									<div className="col-12 col-lg-8">
										<div className="col-12 card">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading6">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse6" aria-expanded="false" aria-controls="collapse6">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[5] ? this.state.blocks.repeatedBlocks[5].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse6" className="col-12 collapse" role="tabpanel" aria-labelledby="heading6" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[5] ? this.state.blocks.repeatedBlocks[5].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading7">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse7" aria-expanded="false" aria-controls="collapse7">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[6] ? this.state.blocks.repeatedBlocks[6].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse7" className="col-12 collapse" role="tabpanel" aria-labelledby="heading7" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[6] ? this.state.blocks.repeatedBlocks[6].Description : ""}}></p>
												</div>
											</div>
										</div>
										
										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading8">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse8" aria-expanded="false" aria-controls="collapse8">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[7] ? this.state.blocks.repeatedBlocks[7].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse8" className="col-12 collapse" role="tabpanel" aria-labelledby="heading8" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[7] ? this.state.blocks.repeatedBlocks[7].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading9">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse9" aria-expanded="false" aria-controls="collapse9">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[8] ? this.state.blocks.repeatedBlocks[8].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse9" className="col-12 collapse" role="tabpanel" aria-labelledby="heading9" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[8] ? this.state.blocks.repeatedBlocks[8].Description : ""}}></p>
												</div>
											</div>
										</div>
										
										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading10">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse10" aria-expanded="false" aria-controls="collapse10">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[9] ? this.state.blocks.repeatedBlocks[9].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse10" className="col-12 collapse" role="tabpanel" aria-labelledby="heading10" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[9] ? this.state.blocks.repeatedBlocks[9].Description : ""}}></p>
												</div>
											</div>
										</div>
									</div>
									<div className={"col-12 my-auto col-lg-4 "+S.faqImageWrapper}>
										<img className={S.faqImage1} src={this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].FGImage1 : ""} alt="" />
									</div>
								</div>
								</div>

								<div className="col-12 col-lg-10 offset-lg-1 my-5">
								<div className="row">
									<div className={"col-12 my-auto col-lg-4 "+S.faqImageWrapper}>
										<img className={S.faqImage} src={this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].FGImage1 : ""} alt="" />
									</div>
									<div className="col-12 col-lg-8">
										<div className="col-12 card">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading11">
													<a data-toggle="collapse" data-parent="#accordionEx" href="#collapse11" aria-expanded="true" aria-controls="collapse11">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[10] ? this.state.blocks.repeatedBlocks[10].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse11" className="col-12 collapse" role="tabpanel" aria-labelledby="heading11" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[10] ? this.state.blocks.repeatedBlocks[10].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading12">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse12" aria-expanded="false" aria-controls="collapse12">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[11] ? this.state.blocks.repeatedBlocks[11].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse12" className="col-12 collapse" role="tabpanel" aria-labelledby="heading12" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[11] ? this.state.blocks.repeatedBlocks[11].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading13">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse13" aria-expanded="false" aria-controls="collapse13">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[12] ? this.state.blocks.repeatedBlocks[12].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse13" className="col-12 collapse" role="tabpanel" aria-labelledby="heading13" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[12] ? this.state.blocks.repeatedBlocks[12].Description : ""}}></p>
												</div>
											</div>
										</div>
										
										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading14">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse14" aria-expanded="false" aria-controls="collapse14">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[13] ? this.state.blocks.repeatedBlocks[13].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse14" className="col-12 collapse" role="tabpanel" aria-labelledby="heading14" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[13] ? this.state.blocks.repeatedBlocks[13].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading15">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse15" aria-expanded="false" aria-controls="collapse15">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[14] ? this.state.blocks.repeatedBlocks[14].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse15" className="col-12 collapse" role="tabpanel" aria-labelledby="heading15" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[14] ? this.state.blocks.repeatedBlocks[14].Description : ""}}></p>
												</div>
											</div>
										</div>
									</div>
								</div>
								</div>

								<div className="col-12 col-lg-10 offset-lg-1 my-5">
								<div className="row">
									<div className="col-12 col-lg-8">
										
										<div className="col-12 card">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading16">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse16" aria-expanded="false" aria-controls="collapse16">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[15] ? this.state.blocks.repeatedBlocks[15].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse16" className="col-12 collapse" role="tabpanel" aria-labelledby="heading16" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[15] ? this.state.blocks.repeatedBlocks[15].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading17">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse17" aria-expanded="false" aria-controls="collapse17">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[16] ? this.state.blocks.repeatedBlocks[16].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse17" className="col-12 collapse" role="tabpanel" aria-labelledby="heading17" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[16] ? this.state.blocks.repeatedBlocks[16].Description : ""}}></p>
												</div>
											</div>
										</div>
										
										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading18">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse18" aria-expanded="false" aria-controls="collapse18">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[17] ? this.state.blocks.repeatedBlocks[17].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse18" className="col-12 collapse" role="tabpanel" aria-labelledby="heading18" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[17] ? this.state.blocks.repeatedBlocks[17].Description : ""}}></p>
												</div>
											</div>
										</div>

										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading19">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse19" aria-expanded="false" aria-controls="collapse19">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[18] ? this.state.blocks.repeatedBlocks[18].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse19" className="col-12 collapse" role="tabpanel" aria-labelledby="heading19" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[18] ? this.state.blocks.repeatedBlocks[18].Description : ""}}></p>
												</div>
											</div>
										</div>
										
										<div className="col-12 card mt-2">
											<div className="row">
												<div className="col-12 card-header" role="tab" id="heading20">
													<a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapse20" aria-expanded="false" aria-controls="collapse20">
														<h6 className={"mb-0 text-dark "+S.faqRepeatedBlockQuestion} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[19] ? this.state.blocks.repeatedBlocks[19].Title : ""}}></h6>
													</a>
												</div>
												<div id="collapse20" className="col-12 collapse" role="tabpanel" aria-labelledby="heading20" data-parent="#accordionEx">
													<p className={"card-body "+S.faqRepeatedBlockAnswer} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[19] ? this.state.blocks.repeatedBlocks[19].Description : ""}}></p>
												</div>
											</div>
										</div>
									</div>
									<div className={"col-12 my-auto col-lg-4 "+S.faqImageWrapper}>
										<img className={S.faqImage1} src={this.state.blocks.repeatedBlocks[3] ? this.state.blocks.repeatedBlocks[3].FGImage1 : ""} alt="" />
									</div>
								</div>
                            </div>
                        </div>
                    </div>
                </div>
				</div>

              

            </section>
        )
    }
}