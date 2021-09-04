import React from 'react';
import axios from 'axios';
import './ModeOfPaymt.css';

export default class ModeOfPaymt extends React.Component {
 
	constructor(props) {
		super(props);
		this.state = {
		  blocks: {
			"blockTitle": "Lorem Ipsum",
			"blockSubTitle": "What is Lorem Ipsum?",
			"blockDescription": 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
			"blockComponentName": "",
			"blockType": "",
			"bgImage": "/images/1.png",
			"fgImage": "/images/37.png",
			"repeatedBlocks": [
								{ 
									Title: "ROAD FREIGHT", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/WhatWedo1.png",
									Description: "Lorem ipsum dolor sit amet"
								},
								{ 
									Title: "OCEAN FREIGHT", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/WhatWedo2.png",
									Description: "Lorem ipsum dolor sit amet"
								},
								{ 
									Title: "AIR FREIGHT", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/WhatWedo3.png",
									Description: "Lorem ipsum dolor sit amet"
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
			 if (this.props.block_id) {
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
			<div className=" ModeOfPaymtWrapper">
					
				<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 osDiv"> 
					 <div className="row"> 

					 {
                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
						this.state.blocks.repeatedBlocks.map((data, index)=>{
                					return(
											<div key={index} className=" mainDiv col-lg-4 col-md-4 col-sm-12 col-xs-12">
												<div classname="row">
													<img src={data.Image} alt="enteprice" className="img2" height="300px" />
												</div>
												 
												<div className="text-center col-lg-12 col-md-12  col-sm-12 col-xs-12 col1"> 
													<div className=" sptextBox1">

													    <h4 className="text-center mheading" dangerouslySetInnerHTML={{ __html: data.Title } }></h4>
														<div className="col-lg-12 col-md-12">
														   <p className="text-center paragraph"  dangerouslySetInnerHTML={{ __html: data.Description } }></p>
													   </div>
													 
												   </div>  
												   <div className="icnBox text-center col-lg-3 col-md-3 col-sm-3 col-xs-3">
												   		<i className="fa fa-road"></i>
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
 
