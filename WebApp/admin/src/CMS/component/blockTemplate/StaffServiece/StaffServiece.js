import React from 'react';
import axios from 'axios';
import Style  from "./StaffServiece.module.css";
// import Image from 'next-images';


// // import BlockSeparatorBlue   from '../Common/BlockSeparatorBlue/BlockSeparatorBlue.js';
// import StdBlockTitleBlack   from '../Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


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
             <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				 	<div className="row">				
				{/*<BlockSeparatorBlue/>*/}
            { /*   <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle}/>   */}
                   <div className={"col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 BoxWrapperMain "+Style.BoxWrapperMain}>
					  {
                 		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
			 			this.state.blocks.repeatedBlocks.map((data, index)=>{
                 					return(
								<div key={index} className={"col-lg-4 col-md-4 col-sm-12 col-xs-12 staffBoxBottom "+Style.staffBoxBottom}>
									<div className={"col-lg-12 col-md-12  col-sm-12 col-xs-12 StaffBox1a1 "+Style.StaffBox1a1}> 
										<div className={"col-lg-12 col-md-12  col-sm-12 col-xs-12 StaffBox1a1IMG "+Style.StaffBox1a1IMG}> 
											<img  src={data.Image} alt="enteprice" className={"col-lg-12 col-md-12  col-sm-12 col-xs-12 StaffboxImageWrapper "+Style.StaffboxImageWrapper} /> 
										</div>   
										<div className={"col-lg-12 col-md-12  col-sm-12 col-xs-12 stafftextBox1 nopadding "+Style.stafftextBox1+" "+Style.nopadding}>
											<b><h3 className={Style.fontw600+" h3boxTitle globalblocksubtitlefontsize "+Style.h3boxTitle} dangerouslySetInnerHTML={{ __html: data.Title } }></h3></b>
											<div className={"col-lg-12 col-md-12 nopadding "+Style.nopadding}>
											<p className={"paragraph globalFormSubTitle "+Style.paragraph}  dangerouslySetInnerHTML={{ __html: data.Description } }></p>
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
			 </section>
			// <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 StaffServieceWrap "+Style.StaffServieceWrap} >
			// 	<div className="row">				
			// 	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            //         <div className={"col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 dashboxStaffwrapper" +Style.dashboxStaffwrapper}>
            //             <ul className={"dashBox "+Style.dashBox}>
          	// 				<li className={"dash1 globaldotteddashcolor1inallbg "+Style.dash1}></li>
          	// 		    	<li className={"dash2 globaldotteddashcolor1inallbg "+Style.dash2}></li>
          	// 			    <li className={"dash3 globaldotteddashcolor1inallbg "+Style.dash3 }></li> 
          	// 		    </ul>
            //         </div>
            //     </div>
			// 	<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 staffServiceTitle globalbanner1sttitlefontsize "+Style.staffServiceTitle}>
			// 	<h1 className={"text-center staffServiceTitleH1 globalblocktitlefontsize "+Style.staffServiceTitleH1} dangerouslySetInnerHTML={{ __html: this.state.blocks.blockTitle} }></h1>
			// 	</div>   
					
			// 	<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1"> 
			// 		 <div className=""> 
			// 		{
            //     		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
			// 			this.state.blocks.repeatedBlocks.map((data, index)=>{
            //     					return(
			// 			<div key={index} className={"col-lg-4 col-md-4 col-sm-12 col-xs-12 staffBoxBottom "+Style.staffBoxBottom}>
			// 				<div className={"col-lg-12 col-md-12  col-sm-12 col-xs-12 StaffBox1a1 "+Style.StaffBox1a1}> 
			// 					<div className={"col-lg-12 col-md-12  col-sm-12 col-xs-12 StaffBox1a1IMG "+Style.StaffBox1a1IMG}> 
			// 						<img  src={data.Image} alt="enteprice" className={"col-lg-12 col-md-12  col-sm-12 col-xs-12 StaffboxImageWrapper "+Style.StaffboxImageWrapper} /> 
			// 				    </div>   
			// 					<div className={"col-lg-12 col-md-12  col-sm-12 col-xs-12 stafftextBox1 nopadding "+Style.stafftextBox1+" "+Style.nopadding}>
			// 					    <b><h3 className={Style.fontw600+" h3boxTitle globalblocksubtitlefontsize "+Style.h3boxTitle} dangerouslySetInnerHTML={{ __html: data.Title } }></h3></b>
			// 						<div className={"col-lg-12 col-md-12 nopadding "+Style.nopadding}>
			// 						   <p className={"paragraph globalFormSubTitle "+Style.paragraph}  dangerouslySetInnerHTML={{ __html: data.Description } }></p>
			// 					   </div> 
			// 				    </div>   
			// 			    </div> 
			// 		    </div> 	
			// 		    );
    		// 			})
    		// 		:
    		// 		null
        	// 	}		
		         	   
			// 		</div> 
			// 	</div> 
			// 	</div>
		  
			// </div>  
						   
				    
			 
		 ) 
		}
	}
 
