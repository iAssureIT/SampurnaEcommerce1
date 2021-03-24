import React from 'react';
import css from "./AppDevMain.module.css";
import axios from 'axios';
import $ 			from 'jquery';



export default class HomepageBanner extends React.Component {


		constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "",
            
            "blockSubTitle": "We are passionate about our work",
            "blockDescription": " ", 
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "https://unimandai.s3.amazonaws.com/CMS/b1background_20201016144728.png",
            "fgImage": "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
            "repeatedBlocks": [
                                
                                { 
                                    Title: "APPLICATION", 
                                    SubTitle: "DEVELOPMENT &MAINTENANCE", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                                    Link: "", 
                                    Description: "Highly Professional,Reliable & Affordable Cost."
								},
								{ 
                                    Title: " MOBILE", 
                                    SubTitle: "SOLUTIONS", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                                    Link: "", 
                                    Description: "We Build Robust & Scalable Mobile Applications."
								},
								{ 
                                    Title: "STAFF", 
                                    SubTitle: "AUGMENTATAION", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                                    Link: "", 
                                    Description: ""
								},
								{ 
                                    Title: "CUSTOMISED ECOMMERCE ", 
                                    SubTitle: "SOLUTIONS", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                                    Link: "", 
                                    Description: ""
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
    /*console.log("==>",this.props.block_id);*/
    //write jscode
   $(document).ready(function(){
			

			  $("#cItemHBpage div:nth-child(1)").addClass("active",{passive: true});


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
			<div className={"carouselBannerwrapper "+css.carouselBannerwrapper}>
				<div className={"b1banerheight "+css.b1banerheight} style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
				  	
					

					<div id="myCarousel" className="carousel " data-ride="carousel"  data-interval="false" data-pause="hover">
									
							  		<div className="carousel-inner" id="cItemHBpage">
									{
									  	this.state.blocks.repeatedBlocks.map((result, index)=>{
									  	// console.log("repeatedBlocks result",result.Title);
									  	return(
											    <div className="item " key={index}>
									    			<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 homepagecontentwrapp "+css.homepagecontentwrapp}>
														<div className={"col-lg-6 col-md-6 col-sm-12 col-xs-12 slide1 "+css.slide1}>
															<div className={"mtop100 "+css.mtop100}>
																<div className={"b1h1Title "+css.b1h1Title}  dangerouslySetInnerHTML={ { __html:result.Title}}></div><br/>
                                  <div className={"b1h2Title "+css.b1h2Title}  dangerouslySetInnerHTML={ { __html:result.SubTitle}}></div><br/>
																<div className={"b1h3Title "+css.b1h3Title}  dangerouslySetInnerHTML={ { __html:result.Description}}></div>
															</div>
														</div>
														<div className={"col-lg-6 col-md-6 col-sm-12 col-xs-12 appIMGwrapp "+css.appIMGwrapp}>
															<img loading="lazy" className={"lazyload b1bannerImg img-responsive "+css.b1bannerImg} width= "auto" height= "100" src={result.Image} alt="Bannerpng"/>


														</div>
												
													</div>
											    </div>
									    	)
											})
									}	
									</div>
									<a className={"left carousel-control carousel-control-prev "+css.carousel_control_prev} aria-label="previous" href="#myCarousel" data-slide="prev">
										<div className={"glyphicon glyphicon-chevron-left "+css.glyphicon_chevron_left}></div>
										<span className="sr-only">Previous</span>
									</a>
									<a className={"right carousel-control carousel-control-next "+css.carousel_control_next} aria-label="next" href="#myCarousel" data-slide="next">
									   <div className={"glyphicon glyphicon-chevron-right "+css.glyphicon_chevron_right}></div>
										<span className="sr-only">Next</span>
									</a>
								</div>
              </div>
			</div>				
			
			
		);
	}
}	 

