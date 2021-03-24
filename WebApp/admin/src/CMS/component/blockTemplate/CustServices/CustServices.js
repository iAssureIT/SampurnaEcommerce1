import React from 'react';
import axios from 'axios';
import './CustServices.css';

export default class CustServices extends React.Component {
 
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
									Title: "Cargo Storage", 
									SubTitle: "M2 Warehouse", 
									Link: "", 
									Image: "/images/Background2.jpg",
									Description: "SHIPPING"
								},
								{ 
									Title: "Ground", 
									SubTitle: "M2 Warehouse", 
									Link: "", 
									Image: "/images/bookstorebg.jpg",
									Description: "SHIPPING"
								},
								{ 
									Title: "Worldwide", 
									SubTitle: "M2 Warehouse", 
									Link: "", 
									Image: "/images/Background.jpg",
									Description: "SHIPPING"
								},
								{ 
									Title: "Air Cargo", 
									SubTitle: "M2 Warehouse", 
									Link: "", 
									Image: "/images/bookstorebg.jpg",
									Description: "SHIPPING"
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
				

				<section class="block">
					<div class="container">
						<div class="row">
							<div class="col-lg-12 col-md-12 col-sm-12  col-xs-12 column "> 
						    	<div class="top-margin">
		                			<div class="row merge">
			                			{
					                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
											this.state.blocks.repeatedBlocks.map((data, index)=>{
	                					return(
			                                <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
			                            		<div class="fancy-service">
			                                		<img width="285" height="361" src={data.Image} class="attachment-unload_285x361 size-unload_285x361 wp-post-image" alt=""/>
			                                		<div class="service-detail">
					                                    <i class="fa fa-print"></i>
					                                    <span dangerouslySetInnerHTML={{ __html: data.SubTitle } }></span>
					                                    <h3 dangerouslySetInnerHTML={{ __html: data.Title } }></h3>
					                                    <h5 dangerouslySetInnerHTML={{ __html: data.Description } }></h5>
			                                           	<a class="theme-btn" itemprop="url" href="https://themes.webinane.com/wp/unload/service/cargo-storage/" title="Door To Door"><i class="fa fa-paper-plane"></i>Get A Rate</a>
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
                    	</div>
                	</div>
                </section>
                                        
						   
				    
			 
		 ) 
		}
	}
 
