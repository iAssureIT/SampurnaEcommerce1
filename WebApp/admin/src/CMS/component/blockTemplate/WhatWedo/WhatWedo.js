import React from 'react';
import axios from 'axios';

import './WhatWedo.css';

export default class WhatWedo extends React.Component {
constructor(props) {
		super(props);
		this.state = {
		  blocks: {
			"blockTitle": "WHAT WE DO",
			"blockSubTitle": "A UI UX Design that works from concept  to production",
			"blockDescription": 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
			"blockComponentName": "",
			"blockType": "",
			"bgImage": "/images/1.png",
			"fgImage": "/images/37.png",
			"repeatedBlocks": [
								{ 
									Title: "Ideation", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/WhatWedo1.png",
									Description: "Exploring and experimenting solutions through an organised design first aproach"
								},
								{ 
									Title: "Optimization", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/WhatWedo2.png",
									Description: "Using insights to maximize factor such as productivity,reliablity,efficiency and utilisation "
								},
								{ 
									Title: "Transformation", 	
									SubTitle: "", 
									Link: "", 
									Image: "/images/WhatWedo3.png",
									Description: "Transforming business processes and experience to meet business and marketing requirements"
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
	}
	

	render() {

		

		return (
			<div className="col-lg-12 ">
				<div className="container WhatWedpboxWrapperMain ">
				<div className="row">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                   <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 dashboxwrapper">
                         <ul className="dashBox">
          	 				<li className="dash1"></li>
          	 		    	<li className="dash2"></li>
          				    <li className="dash3"></li> 
          	 		    </ul>
                     </div>
                 </div>
			 	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 WhatweDoTitle">
                     <h1 className="text-center" dangerouslySetInnerHTML={{ __html: this.state.blocks.blockTitle} }></h1>
			 	</div>   
				 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 WhatweDoTitle">
                     <h2 className="text-center" dangerouslySetInnerHTML={{ __html: this.state.blocks.blockSubTitle} }></h2>
			 	</div>  
				{
				this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
				this.state.blocks.repeatedBlocks.map((data, index)=>{
							return(

				<div className=""> 
					
					<div className="col-xs-12 col-sm-4 col-lg-4 boxWrapper" key={index}>
						<div className="box">
						<img src={data.Image} alt="enteprice" className="col-lg-12 col-md-12  col-sm-12 col-xs-12 " />
						<div className="WDblockDescription">
						<b><h3 className=" h3boxTitle" dangerouslySetInnerHTML={{ __html: data.Title } }></h3></b>
									<div className="col-lg-12 col-md-12 nopadding">
									   <p className="WhatWedoparagraph"  dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                    </div>
						</div>
						</div>
						<button className="btn btn-default"><h5>Read More</h5></button>
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
 

			
 