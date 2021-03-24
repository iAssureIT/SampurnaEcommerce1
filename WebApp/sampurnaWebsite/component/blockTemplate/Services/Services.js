import React from 'react';
import $ from "jquery"; //for next.js
import axios from 'axios';
import Style from "./Services.module.css";

export default class Services extends React.Component {



	constructor(props) {
		super(props);
		this.state = {
		  blocks: {
			"blockTitle": "<b>WHAT</b> WE DO",
			"blockSubTitle": "We are passionate about our work",
			"blockDescription": 'iAssureIT is an innovative IT company with energetic, talented and ambitious pool of 30+ Software Engineers, passionate about bringing the disruptive change in technology arena.<br/>We are the Change Makers.<br/>&nbsp;&nbsp;&nbsp;&nbsp;Our world class quality application development with latest cutting-edge technologies used for rapid development and blazing fast performance.A tremendous journey of 7 years started in 2011. We have developed over 150+ projects of small and large sizes. Our clientele is spread across the globe, from countries like USA, Europien Countries, South Africa, Gulf Region, Singapore and Australia.<br/>&nbsp;&nbsp;&nbsp;&nbsp;iAssureIT has customers from various industry domains that include Start ups too. Our clients are from industries like Financial Services, Healthcare, Manufacturing, Pharmaceuticals, Real Estate, Shipping and Logistics, Education, etc. We have been helping them to craft their organizational level digital road map.',
			"blockComponentName": "",
			"blockType": "",
			"bgImage": "https://unimandai.s3.amazonaws.com/CMS/3_20201015202717.png",
			"fgImage": "",
			"repeatedBlocks": [
								{ 
									Title: "<b>ENTERPRISE APPS<b/>", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/4_2020101520269.png",
									Description: "We have indepth expertise in developing large scale Enterprise grade web & mobile apps."
								},
								
								{ 
									Title: "<b>STAFF AUGMEN-TATION</b>", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/4_2020101520269.png",
									Description: "Boost Your eCommerce business with our Flexible, Scalable & Robust eCommerce Platform AutoPilot with the blazing fast performance and SEO Friendly Online Stores"
								},
								{ 
									Title: "<b>WEB APPS</b>", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/4_2020101520269.png",
									Description: "Boost Your eCommerce business with our Flexible, Scalable & Robust eCommerce Platform AutoPilot with the blazing fast performance and SEO Friendly Online Stores"
								},
								{ 
									Title: "<b>BUSINESS PORTALS</b>", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/4_2020101520269.png",
									Description: "Boost Your eCommerce business with our Flexible, Scalable & Robust eCommerce Platform AutoPilot with the blazing fast performance and SEO Friendly Online Stores"
								},
								{ 
									Title: "<b>MOBILE APPS</b>", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/4_2020101520269.png",
									Description: "Boost Your eCommerce business with our Flexible, Scalable & Robust eCommerce Platform AutoPilot with the blazing fast performance and SEO Friendly Online Stores"
								},
								{ 
									Title: "<b>eCOMMERCE PORTAL</b>", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/4_2020101520269.png",
									Description: "Boost Your eCommerce business with our Flexible, Scalable & Robust eCommerce Platform AutoPilot with the blazing fast performance and SEO Friendly Online Stores"
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
						if(error.message === "Request failed with status code 401")
						  {
							  // swal("Your session is expired! Please login again.","", "error");
						  }
				  })
				}
		  this.setState({
					block_id:this.props.block_id
				  });
	}

	render() {
		// console.log("this.state.blocks.repeatedBlocks",this.state.blocks.repeatedBlocks);
		return (
			
				<div className={Style.serviceswrapper}>

				<div className={Style.serviceheight}  style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                    <div className={"col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 " +Style.whatdowrapper}>
	                      <ul className={Style.whatwedobox}>
							  <li className={Style.whatdash1}></li>
							  <li className={Style.whatdash2}></li>
						      <li className={Style.whatdash3}></li> 
					      </ul>
	                    </div>
	                </div>

				<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.textwrapper}>

                    <div className={"text-center"}>
                        <div className={"globalMainTitle " +Style.h1titble00}  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                    </div>
                </div>	 
				  	

				   	<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.Hexagonwrapper00}>

						<div className={Style.hexagon1}>
							  
								<div className={Style.serviceimgblock}>
								<img loading="lazy" height="60" width="60" src={this.state.blocks.repeatedBlocks?this.state.blocks.repeatedBlocks[0].Image:"/images/5.png"} className={"lazyload "+Style.images1} alt="images1"/>
								</div>
							   <div className={Style.heprizeapps +" text-center"} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks?this.state.blocks.repeatedBlocks[0].Title:"<b>ENTERPRISE APPS<b/>"}}></div>
						</div>    
						<div className={Style.hexagon2}>
						    <div className={Style.h1services +" text-center"} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
						</div>     
						<div className={Style.hexagon3}>
							<div className={Style.serviceimgblock2}>
								<img loading="lazy" height="60" width="60" src={this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].Image :"/images/5.png"} className="lazyload images2"  alt="images2"/>
							</div>
							<div className={Style.hstaffaugmtion +" text-center"} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[1]?this.state.blocks.repeatedBlocks[1].Title:""}}></div>

						</div>     
						<div className={Style.hexagon4}>
							<div className={Style.serviceimgblock3}>
							<img loading="lazy" height="60" width="60" src={this.state.blocks.repeatedBlocks[2]?this.state.blocks.repeatedBlocks[2].Image:"/images/5.png"} className={"lazyload "+Style.images3} alt="images3"/>
							</div>
							<div className={"text-center " +Style.hwebapps} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[2]?this.state.blocks.repeatedBlocks[2].Title:""}}></div>

						</div>      
						<div className={Style.hexagon5}>
							<div className={Style.serviceimgblock4}>
							<img loading="lazy" height="60" width="60" src={this.state.blocks.repeatedBlocks[3]?this.state.blocks.repeatedBlocks[3].Image:"/images/5.png"} className={"lazyload "+Style.images4} alt="images4"/>

							</div>
							<div className={" text-center " +Style.hbportals} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[3]?this.state.blocks.repeatedBlocks[3].Title:""}}></div>

						</div>      
						<div className={Style.hexagon6}>
							<div className={Style.serviceimgblock5}>
							   <img loading="lazy" height="60" width="60"  src={this.state.blocks.repeatedBlocks[4]?this.state.blocks.repeatedBlocks[4].Image:"/images/5.png"} className={"lazyload "+Style.images5} alt="images5"/>

							</div>
							<div className={Style.hmapps +" text-center"} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[4]?this.state.blocks.repeatedBlocks[4].Title:""}}></div>
						</div>      
						<div className={Style.hexagon7}>
							<div className={Style.serviceimgblock6}>
							<img loading="lazy" height="60" width="60" src={this.state.blocks.repeatedBlocks[5]?this.state.blocks.repeatedBlocks[5].Image:"/images/5.png"} className={"lazyload "+Style.images6} alt="images6"/>

							</div>
							<div className={Style.heportal +" text-center"} dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[5]?this.state.blocks.repeatedBlocks[5].Title:""}}></div>
						</div>         
					</div>

				</div>
			</div>
		
		);
	}
}
						