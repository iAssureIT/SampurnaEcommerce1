import React from 'react';
import axios from 'axios';
import './CompanyEmp.css';
import jQuery from 'jquery';

export default class CompanyEmp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  blocks: {
			"blockTitle": "COMPANY EMPLOYEES",
			"blockSubTitle": "WHAT WE PROVIDE FOR CLIENTS",
			"blockDescription": 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
			"blockComponentName": "",
			"blockType": "",
			"bgImage": "/images/1.png",
			"fgImage": "/images/37.png",
			"repeatedBlocks": [
								{ 
									Title: "PATRICK OCONOR", 
									SubTitle: "FOUNDER / CEO", 
									Link: "", 
									Image: "/images/Background2.jpg",
									Description: "Qorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo enean massa. Cumsociis nato magnis..."
								},
								{ 
									Title: "JESSICA BONNER", 
									SubTitle: "FOUNDER / CEO", 
									Link: "", 
									Image: "/images/bookstorebg.jpg",
									Description: "Qorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo enean massa. Cumsociis nato magnis..."
								},
								{ 
									Title: "JACOB HORAM", 
									SubTitle: "FOUNDER / CEO", 
									Link: "", 
									Image: "/images/Background.jpg",
									Description: "Qorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo enean massa. Cumsociis nato magnis..."
								},
								
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

		   jQuery(document).ready(function ($) {
            'use strict';

            $('div.members-area').each(function () {
            $(this).children().eq(0).addClass('clicked');
            var testimo = $(this).find(".member");
            $(testimo).on("click", function () {
            $(testimo).removeClass("clicked");
            $(this).addClass("clicked");
            });
            });
            });

		  
			}


	render(){
		return(

			<section class="block blackish col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="fixed-bg col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{backgroundImage: "url(" + this.state.blocks.bgImage + ")"}}></div>
					<div class="container">
						<div class="row">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 column ">
								<div class="text-center heading">
									<span>{this.state.blocks.blockSubTitle}</span>
									<h2>{this.state.blocks.blockTitle}</h2>
								</div>
								<div class="profWrapper members-area top-margin">
								{
					                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
											this.state.blocks.repeatedBlocks.map((data, index)=>{
	                					return(
		                            <div class="member">
		                        		<div class="member-thumb">
		                            		<img height="320" src={data.Image} class="attachment-unload_580x634 size-unload_580x634 wp-post-image" alt=""/>
		                            		<div class="member-info">
		                                	<span itemprop="jobTitle" dangerouslySetInnerHTML={{ __html: data.SubTitle } }></span>
		                                	<h4 itemprop="name" dangerouslySetInnerHTML={{ __html: data.Title } }></h4>
		                            	</div>
		                        	</div>
		                        	<div class="member-detail">
		                            	<div class="member-info">
		                                	<span itemprop="jobTitle" dangerouslySetInnerHTML={{ __html: data.SubTitle } }></span>
		                                	<h4 itemprop="name" dangerouslySetInnerHTML={{ __html: data.Title } }></h4>
		                            	</div>
		                            	<p itemprop="description" dangerouslySetInnerHTML={{ __html: data.Description } }></p>
		                                <ul class="social-btns">
		                                    <li>
		                                    	<a href="https://www.facebook.com/people/@/webinane" title="" itemprop="url"><i class="fa fa-facebook"></i></a></li><li><a href="https://twitter.com/webinane" title="" itemprop="url"><i class="fa fa-twitter"></i></a></li><li><a href="https://www.linkedin.com/company/webinane-web-arcade" title="" itemprop="url"><i class="fa fa-linkedin"></i>
		                                    	</a>
		                                    </li>
		                                </ul>
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
            </section>
			
			)
	}
}