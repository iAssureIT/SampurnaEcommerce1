import React from 'react';
import "./OutSpeciality.css";
import axios from 'axios';

export default class OutSpeciality extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		  blocks: {
			"blockTitle": "<b>OUR</b> SPECIALITY",
			"blockSubTitle": "We are passionate about our work",
			"blockDescription": 'iAssureIT is an innovative IT company with energetic, talented and ambitious pool of 30+ Software Engineers, passionate about bringing the disruptive change in technology arena.<br/>We are the Change Makers.<br/>&nbsp;&nbsp;&nbsp;&nbsp;Our world class quality application development with latest cutting-edge technologies used for rapid development and blazing fast performance.A tremendous journey of 7 years started in 2011. We have developed over 150+ projects of small and large sizes. Our clientele is spread across the globe, from countries like USA, Europien Countries, South Africa, Gulf Region, Singapore and Australia.<br/>&nbsp;&nbsp;&nbsp;&nbsp;iAssureIT has customers from various industry domains that include Start ups too. Our clients are from industries like Financial Services, Healthcare, Manufacturing, Pharmaceuticals, Real Estate, Shipping and Logistics, Education, etc. We have been helping them to craft their organizational level digital road map.',
			"blockComponentName": "",
			"blockType": "",
			"bgImage": "/images/1.png",
			// "fgImage": "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
			"repeatedBlocks": [
								{ 
									Title: "<b>Enterprise<b/>", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
									Description: "We have indepth expertise in developing large scale Enterprise grade web & mobile apps."
								},
								{ 
									Title: "<b>Startup</b> World", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
									Description: "Specially made plans for Startups that are highly cost effective & value added services. Our quotations are absolutely unbeatable in the IT Industry."
								},
								{ 
									Title: "<b>eCommerce</b>", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
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

		

		return (
			<div className="specialhightwrapper">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 dashboxwrapper">
                      <ul className="dashBox">
						  <li className="dash1"></li>
						  <li className="dash2"></li>
					      <li className="dash3"></li> 
				      </ul>
                    </div>
                </div>
				 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 specialityheading">
                        <div className="text-center ">
                            <div className="h2title" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                        </div>
				 </div>   
					
					  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 osDiv"> 
					 <div className="row"> 

					 {
                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
						this.state.blocks.repeatedBlocks.map((data, index)=>{
                					return(
											<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" key={index}>
											<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 col1"> 
												
												<div className="row"><div className="BlueStrip"></div></div>
												
												<div className="iconCircle">
													<img src="/images/11.png" alt="smallHexagon" className="red"/>
													{/* <div className="red"> </div> */}
												   <img src={data.Image} alt="enteprice" className="innerCircle img-responsive"/> 
											   </div> 
												 <div className="sptextBox1">
												   <h2 className="text-center" dangerouslySetInnerHTML={{ __html: data.Title } }></h2>
													<div className="col-lg-12 col-md-12">
													   <p className="paragraph"  dangerouslySetInnerHTML={{ __html: data.Description } }></p>
												   </div>
												    {/* <p className="text-center rmore">Read More</p>    */}
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
						   
				    
			 
		 ) 
		}

	}
 
			
 