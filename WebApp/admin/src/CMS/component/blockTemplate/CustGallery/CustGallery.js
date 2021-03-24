import React from 'react';
import "./CustGallery.css";
import axios from 'axios';
import $ 	from 'jquery';




export default class CustGallery extends React.Component {
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
								},{ 
									Title: "Ground", 
									SubTitle: "M2 Warehouse", 
									Link: "", 
									Image: "/images/bg4.jpg",
									Description: "SHIPPING"
								},{ 
									Title: "Ground", 
									SubTitle: "M2 Warehouse", 
									Link: "", 
									Image: "/images/Background_unimandai.jpg",
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

	onClickImage(image){
		// event.preventDefault();
		// console.log(event.target.src);
		this.setState({
			activeImg : image
		})

	}
	
	render(){
		return(
			<section>
				<div className=" galleryWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<ul class="list-inline">
					{
	                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
							this.state.blocks.repeatedBlocks.map((data, index)=>{
	                					return(
						  <li className="col-lg-6 col-md-6 col-sm-12 col-xs-12" data-toggle="modal" data-target="#myModal"><a href="#myGallery" data-slide-to={index}> <img onClick={this.onClickImage.bind(this,data.Image)} class="img-thumbnail" src={data.Image} alt={data.Image} /><br/>
							</a></li>
						
						);
		                					})
		                				:
		                				null
			                		}
					</ul>


					<div class="modal fade" id="myModal">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
									<div class="pull-left">My Gallery Title</div>
										<button type="button" class="close" data-dismiss="modal" title="Close"> <span class="glyphicon glyphicon-remove"></span></button>
									</div>
									<div class="modal-body">

										<div id="myGallery" class="carousel slide" data-interval="false">
											<div class="carousel-inner">
												{
		                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
								this.state.blocks.repeatedBlocks.map((data, index)=>{
									console.log(this.state.activeImg, data.Image)
		                					return(
		                						this.state.activeImg===data.Image? 
													<div class="item active"> 
														<img src={data.Image} alt="item0"/>
														<div class="carousel-caption">
														<h3>Heading 3</h3>
														<p>Slide 0  description.</p>
														</div>
													</div>


											:
											<div class="item"> 
												<img src={data.Image} alt="item0"/>
												<div class="carousel-caption">
												<h3>Heading 3</h3>
												<p>Slide 0  description.</p>
												</div>
											</div>
										
										
							);
	                					})
	                				:
	                				null
		                		}
						</div>

						<a class="left carousel-control" href="#myGallery" role="button" data-slide="prev"> 
							<span class="glyphicon glyphicon-chevron-left"></span>
						</a> 
						<a class="right carousel-control" href="#myGallery" role="button" data-slide="next"> 
							<span class="glyphicon glyphicon-chevron-right"></span>
						</a>
						</div>

						</div>
							<div class="modal-footer">
								<div class="pull-left">
									<small>Photographs by <a href="#" target="new">placeimg.com</a></small>
								</div>
								<button class="btn-sm close" type="button" data-dismiss="modal">Close</button>
							</div>
						</div>
						</div>
						</div>

					
			</div>
	</section>

			
			)
	}
}