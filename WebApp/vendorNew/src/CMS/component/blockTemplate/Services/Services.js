import React from 'react';
import "./Services.css";
import $ from "jquery";
import axios from 'axios';

export default class Services extends React.Component {



	constructor(props) {
		super(props);
		this.state = {
		  blocks: {
			"blockTitle": "<b>WHAT</b> WE Do",
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
									Title: "<b>STAFF AUGMEN-<br/>TATION</b>", 
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
									Title: "<b>MOBILEAPPS</b>", 
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
		console.log("this.state.blocks.repeatedBlocks",this.state.blocks);
		return (
			
			<div className="serviceswrapper">
				<div className="serviceheight"  style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                    <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 whatdowrapper">
	                      <ul className="whatwedobox">
							  <li className="whatdash1"></li>
							  <li className="whatdash2"></li>
						      <li className="whatdash3"></li> 
					      </ul>
	                    </div>
	                </div>

				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 textwrapper">

                    <div className="text-center ">
                        <div className="h1titble00"  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                    </div>
                </div>	 
				  	
				   	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Hexagonwrapper00 ">

					   <div className="mainOuterCircle">
					     <div className="mainInnerCircle"> <div class="Animatedcircle"></div></div>
					   </div>

						<div className="hexagon1">
							  
								<div className="serviceimgblock">
								<img  src={this.state.blocks.repeatedBlocks.length > 0 ?this.state.blocks.repeatedBlocks[0].Image:"/images/5.png"} className="images1" alt="images1"/>
								</div>
							    <div className="heprizeapps text-center" dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks?this.state.blocks.repeatedBlocks[0].Title:"<b>ENTERPRISE APPS<b/>"}}></div> 
						</div>    
						<div className="hexagon2">
						    <div className="h1services text-center" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div> 
						</div>     
						<div className="hexagon3">
							<div className="serviceimgblock2">
								<img  src={this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].Image :"/images/5.png"} className="images2"  alt="images2"/>
							</div>
							<div className="hstaffaugmtion text-center" dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[1]?this.state.blocks.repeatedBlocks[1].Title:""}}></div>

						</div>     
						<div className="hexagon4">
							<div className="serviceimgblock3">
							<img  src={this.state.blocks.repeatedBlocks[2]?this.state.blocks.repeatedBlocks[2].Image:"/images/5.png"} className="images3" alt="images3"/>
							</div>
							<div className=" text-center hwebapps" dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[2]?this.state.blocks.repeatedBlocks[2].Title:""}}></div>

						</div>      
						<div className="hexagon5">
							<div className="serviceimgblock4">
							<img  src={this.state.blocks.repeatedBlocks[3]?this.state.blocks.repeatedBlocks[3].Image:"/images/5.png"} className="images4" alt="images4"/>

							</div>
							<div className="hbportals text-center" dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[3]?this.state.blocks.repeatedBlocks[3].Title:""}}></div>

						</div>      
						<div className="hexagon6">
							<div className="serviceimgblock5">
							   <img   src={this.state.blocks.repeatedBlocks[4]?this.state.blocks.repeatedBlocks[4].Image:"/images/5.png"} className="images5" alt="images5"/>

							</div>
							<div className="hmapps text-center" dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[4]?this.state.blocks.repeatedBlocks[4].Title:""}}></div>
						</div>      
						<div className="hexagon7">
							<div className="serviceimgblock6">
							<img  src={this.state.blocks.repeatedBlocks[5]?this.state.blocks.repeatedBlocks[5].Image:"/images/5.png"} className="images6" alt="images6"/>

							</div>
							<div className="heportal text-center" dangerouslySetInnerHTML={ { __html:this.state.blocks.repeatedBlocks[5]?this.state.blocks.repeatedBlocks[5].Title:""}}></div>
						</div>         
					
				</div>
				</div>
			</div>
		
		);
	}
}
						