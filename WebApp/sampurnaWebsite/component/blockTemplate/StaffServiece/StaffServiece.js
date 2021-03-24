import React from 'react';
import axios from 'axios';
import "./StaffServiece.module.css";

export default class StaffServiece extends React.Component {
constructor(props) {
		super(props);
		this.state = {
		  blocks: {
			"blockTitle": "OUR SERVICES",
			"blockSubTitle": "What is Lorem Ipsum?",
			"blockDescription": 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
			"blockComponentName": "",
			"blockType": "",
			"bgImage": "/images/1.png",
			"fgImage": "/images/37.png",
			"repeatedBlocks": [
								{ 
									Title: "Mobile App Developers", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/Mobile_App_Dev.png",
									Description: "iOS | Android | React Native"
								},
								{ 
									Title: "Front End Developers", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/Front_End_Developers.png",
									Description: "ReactJS | Angular JS | VueJS"
								},
								{ 
									Title: "Backend Developers", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/Backend_Developers.png",
									Description: "NodeJS | DotNet | PHP | Java | Python | Ruby on Rails"
								},
								{ 
									Title: "Microsoft Technologies Developer", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/Microsoft_Technologies.png",
									Description: "Asp.Net | C# | Dot Net Core | MVC | Sharepoint"
								},
								{ 
									Title: "eCommerce Developer", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/eCommerce_Developer.png",
									Description: "Magento | OSCommerce | Open Cart | Shopify | Drupal | Wordpress eCommerce"
								},
								{ 
									Title: "UI/UX Designers", 
									SubTitle: "", 
									Link: "", 
									Image: "/images/UIUX_Designers.png",
									Description: "Adobe XD | Photoshop | Illustrator | Invision | After Effects | Premier Pro"
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
			<div className=" StaffServieceWrap">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 dashboxwrapper">
                        <ul className="dashBox">
          					<li className="dash1"></li>
          			    	<li className="dash2"></li>
          				    <li className="dash3"></li> 
          			    </ul>
                    </div>
                </div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h1 className="text-center">{this.state.blocks.blockTitle}</h1>
				</div>   
					
				<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1"> 
					 <div className=""> 
					{
                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
						this.state.blocks.repeatedBlocks.map((data, index)=>{
                					return(
						<div  className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
							<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 StaffBox1a1"> 
								<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 StaffBox1a1IMG"> 
									<img src={data.Image} alt="enteprice" className="col-lg-12 col-md-12  col-sm-12 col-xs-12 " /> 
							    </div>   
								<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 stafftextBox1 nopadding">
								    <b><h3 className=" h3boxTitle" dangerouslySetInnerHTML={{ __html: data.Title } }></h3></b>
									<div className="col-lg-12 col-md-12 nopadding">
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
 
