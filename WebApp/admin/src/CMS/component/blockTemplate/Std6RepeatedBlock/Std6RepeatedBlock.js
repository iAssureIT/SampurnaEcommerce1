import React from 'react';
import axios from 'axios';
import './Std6RepeatedBlock.css';

export default class Std6RepeatedBlock extends React.Component {
 
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
									Title: "Lorem Ipsum", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/imgIcon.png",
									Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
								},
								{ 
									Title: "Lorem Ipsum", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/imgIcon.png",
									Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
								},
								{ 
									Title: "Lorem Ipsum", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/imgIcon.png",
									Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
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
			<div className=" Std6RepeatedBlockWrap">
				
				 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="">
                            <h1 className="text-center">{this.state.blocks.blockTitle}</h1>
                            <h3 className="text-center">{this.state.blocks.blockSubTitle}</h3>
                            <p className="text-center" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                        </div>
				 </div>   
					
				<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 osDiv"> 
					 <div className="row"> 

					 {
                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
						this.state.blocks.repeatedBlocks.map((data, index)=>{
                					return(
											<div key={index} className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
												<img src={data.Image} alt="enteprice" className="col-lg-12 col-md-12  col-sm-12 col-xs-12 " height="200px" /> 
												<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 col1"> 
													<div className="sptextBox1">
													    <h2 className="text-center mheading" dangerouslySetInnerHTML={{ __html: data.Title } }></h2>
														<div className="col-lg-12 col-md-12">
														   <p className="paragraph"  dangerouslySetInnerHTML={{ __html: data.Description } }></p>
													   </div>
													 
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
 
