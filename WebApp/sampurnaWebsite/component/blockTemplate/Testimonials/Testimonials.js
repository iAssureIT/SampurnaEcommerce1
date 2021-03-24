import React from 'react';
import Style from "./Testimonials.module.css";
import axios from 'axios';
import $ 			from 'jquery';

export default class Testimonials extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": " <b>Client Testimonials</b>",
            "blockSubTitle": "We are passionate about our work",
            "blockDescription": "Lorem Ipsum",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "/images/002.png",
            "fgImage": "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
            "repeatedBlocks": [
                                
                                { 
                                    Title: "Mr Paras Surana", 
                                    SubTitle: "Director - Prabandhan Management Consulting", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                                    Link: "", 
									Description: "One important thing which differentiates iAssureIT from other IT companies is the thought process of complete team & their will to provide the best of features, thinking completely out of the box & without bothering the extra efforts which would goin from their end implementing these.Really happy & satisfied with the quality of the work.",
									
									
								},

								{ 
                                    Title: "Mr. Imran,", 
                                    SubTitle: "Director - Prabandhan Management Consulting", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                                    Link: "", 
									Description: "One important thing which differentiates iAssureIT from other IT companies is the thought process of complete team & their will to provide the best of features, thinking completely out of the box & without bothering the extra efforts which would goin from their end implementing these.Really happy & satisfied with the quality of the work.",
									
									
									
								},
								{ 
                                    Title: "Mr Mohd Imran,", 
                                    SubTitle: "Director - Prabandhan Management Consulting", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                                    Link: "", 
									Description: "One important thing which differentiates iAssureIT from other IT companies is the thought process of complete team & their will to provide the best of features, thinking completely out of the box & without bothering the extra efforts which would goin from their end implementing these.Really happy & satisfied with the quality of the work.",
									
									
									
								}
																
								
								
								
            ],
            "bgVideo"				: "",
            "fgVideo"				: "",
            "blockGroup"			: "",
            "blockAppearOnPage"		: ""
          },
          blockID:"",
          block_id:""
        };   
      }
    componentDidMount(){
    		$(document).ready(function(){
			  	$("#cItemHBpageTest div:nth-child(1)").addClass("active",{passive: true});
			});
              {
                 axios
                    .get('/api/blocks/get/'+this.props.block_id)
                    .then((response)=>{
                        if(response.data){
                            // console.log("ListofServices =",response.data);
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

	

	
	
	render() {
		
				return (
				<section className={"testimonialwrapper "+Style.testimonialwrapper}>
					<div className={"col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 dashBoxTmwrapp "+Style.dashBoxTmwrapp}>
                        <ul className={"dashBoxTm "+Style.dashBoxTm}>
                            <li className={"dash1Tm "+Style.dashBoxTm_li+'  '+Style.dash1Tm}></li>
                            <li className={"dash2Tm "+Style.dashBoxTm_li+'  '+Style.dash2Tm}></li>
                            <li className={"dash3Tm "+Style.dashBoxTm_li+' '+Style.dash3Tm}></li> 
                        </ul>
					</div>
            <div className={"col-lg-12 col-md-12 col-sm-12 col-xl-12 clienttestmonials "+Style.clienttestmonials}>
				       	<h1 dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h1> 
            </div>  
				 <div className="col-lg-12 col-md-12 col-sm- col-xs-12 row"> 
					<div className="col-lg-9 col-md-9 col-sm-12 col-xs-12"> 
					   <div className={"col-lg-10 col-md-11 col-lg-offset-1 col-sm-12 col-xs-12 testimonialBox "+Style.testimonialBox}> 
						  <div id="myCarouselT" className="carousel slide" data-ride="carousel">
							  

									 <div className="carousel-inner" id="cItemHBpageTest">
									{
									  	this.state.blocks.repeatedBlocks.map((result, index)=>{
									  	
									  	return(

			                      				<div className={"item  itemwrapp "+Style.itemwrapp} key={index}>
				                      				<div className={"carousel-caption "+Style.carousel_caption}>
														<div className={"testContent "+Style.testimonialwrapper_testContent}   dangerouslySetInnerHTML={ { __html:result.Description}}></div>
														</div>
												    	<div className={"testimonialWriter "+Style.testimonialwrapper_testimonialWriter }   dangerouslySetInnerHTML={ { __html:result.Title}}></div>
														<div className={"writerDetails "+Style.writerDetails}   dangerouslySetInnerHTML={ { __html:result.SubTitle}}></div>   
												    	<div className={"testimonialwrapper_img_area "+Style.testimonialwrapper_img_area}>
									                        <img loading="lazy" src={result.Image} alt="t1" className={"lazyload d-block "+Style.img_area_img }/>
								                       </div>
										        </div>
										        )
											})
									}	
								
								 
								</div> 
								 <a className={"left carousel-control test_carousel_control_left "+Style.carousel_control_left+' '+Style.test_carousel_control_left} href="#myCarouselT" aria-label="left" data-slide="prev">
									<div className="glyphicon glyphicon-chevron-left"></div>
									<span className="sr-only">Previous</span>
								</a> 
								 <a className={"right carousel-control test_carousel_control_right "+Style.carousel_control_right+' '+Style.test_carousel_control_right} href="#myCarouselT" aria-label="right" data-slide="next">
									<div className="glyphicon glyphicon-chevron-right"></div>
									<span className="sr-only">Next</span>
								</a> 
							 </div>
						</div> 
					</div>  
			  </div>	 
		</section>
	   );
	}
}
