import React from 'react';
import axios from 'axios';
import './Portfolio.css';
import $    from 'jquery';

export default class Portfolio extends React.Component {
constructor(props) {
	    super(props);
	    this.state = {
	      blocks: {
	        	blockComponentName  	: "Std1LeftImgRightContent",
	        	blockType		       	: "simple",
	        	blockTitle 				: "PORTFOLIO",
	        	blockSubTitle 			: "This is Block sub Title",
	        	blockDescription 		: "With a thorough discovery, we understand more about you, your company's vision, your brand, your unique business strategy & asipiration to portray your business in market. Strategy & planning is everything. We outline your project, create milestones, and agree on priorities. We have the experience and knowledge needed to create a smart strategy for your business to solve your digital problems.",
	        	fgVideo 				: "https://testtruusmiles.s3.ap-south-1.amazonaws.com/InShot_12.mp4",
	        	fgImage 				: "/images/Flow.png",
				bgImage 				: "",
				
				"repeatedBlocks": [
					{ 
						Title: "All PROJECTS", 
						
						Images:["https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png"] 
					},
					{ 
						Title: "MObile Application", 
						
						Images:["https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png"] 
					},
					{ 
						Title: "WEB APPLICATION", 
						
						Images:["https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png"] 
					},

					{ 
						Title: "eCOMMERCE ONLINE STORE", 
						
						Images:["https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png"] 
					},

					{ 
						Title: "BUSINESS PORTALS", 
						
						Images:["https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png"] 
					},

					{ 
						Title: "CORPORATE WEBSITES", 
						
						Images:["https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png","https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png"] 
					},
],
	      	},
	      	blockID 		:"",
	      	block_id 		:""
	    }; 

    
	}
	componentDidMount(){
	/*console.log("==>",this.props.block_id);*/
	         if (this.props.block_id) {
	             axios
	                .get('/api/blocks/get/'+this.props.block_id)
	                .then((response)=>{
						var  tableData = response.data;
						var repeatedBlocksArray=[];
	                    if(response.data){
							//loop through repeated block
							var repeatedBlocksData = tableData.repeatedBlocks.map((data, index)=>{
								//check title laready exists in array of object
								var index = repeatedBlocksArray.findIndex(x => x.Title==data.SubTitle.trim()); 
								//index === -1 ? not exist : already exist
                                if(index === -1){
									//not exist then push object in array
									repeatedBlocksArray.push({"Title":data.SubTitle.trim(),"Images":[data.Image]})
								}else{
									//if exist then push image in object's Images array
									repeatedBlocksArray[index]["Images"].push(data.Image)
								}
							})
						//set repeatedBlocks with new updated array
						tableData.repeatedBlocks = repeatedBlocksArray;

	                    this.setState({
							blocks: tableData,
	                      },()=>{ });
					    }                  
	                  })           
	                .catch(function(error){
	                  console.log(error);
	                  
	              })
	            }
	             this.setState({
	                block_id:this.props.block_id
				  });

			$('.link1Div,.link3Div,.link4Div,.link5Div,.link6Div').hide();
			

			$('.link1').click(function(e){
				e.stopPropagation();
				$('.link1Div').fadeToggle();
			$('.link2Div,.link3Div,.link4Div,.link5Div,.link6Div').slideUp();
			$('.link1').toggleClass('active');
			$('.link2, .link3,.link4,.link5,.link6').removeClass('active');
			});


			$('.link2').click(function(e){
				e.stopPropagation();
				$('.link2Div').slideToggle();
			$('.link1Div,.link3Div,.link4Div,.link5Div,.link6Div').slideUp();
			$('.link2').toggleClass('active');
			$('.link1, .link3,.link4,.link5,.link6').removeClass('active');
			});


			$('.link3').click(function(e){
				e.stopPropagation();
				$('.link3Div').slideToggle();
			$('.link1Div, .link2Div, .link4Div,.link5Div,.link6Div').slideUp();
			$('.link3').toggleClass('active');
			$('.link1, .link2,.link4,.link5,link6').removeClass('active');
			});

			$('.link4').click(function(e){
				e.stopPropagation();
				$('.link4Div').slideToggle();
			$('.link1Div, .link2Div, .link3Div,.link5Div,.link6Div').slideUp();
			$('.link4').toggleClass('active');
			$('.link1, .link2,.link3,.link5,.link6').removeClass('active');
			});

			$('.link5').click(function(e){
				e.stopPropagation();
				$('.link5Div').slideToggle();
			$('.link1Div, .link2Div, .link3Div,.link4Div,.link6Div').slideUp();
			$('.link5').toggleClass('active');
			$('.link1, .link2,.link3,.link4,.link6').removeClass('active');
			});

			$('.link6').click(function(e){
				e.stopPropagation();
				$('.link6Div').slideToggle();
			$('.link1Div, .link2Div, .link3Div,.link4Div,.link5Div').slideUp();
			$('.link6').toggleClass('active');
			$('.link1, .link2,.link3,.link4,.link5').removeClass('active');
			});


			$(document).click(function(){
			$('.link1Div, .link6Div, .link3Div,.link4Div,.link5Div').slideUp();
			$('.link1, .link6, .link3,.link4,.link5').removeClass('active');
});
				  
	}

	render() {
		return (
			<div className="container-fluid ourPortFolioWrapper">
				<div className="row">
					
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
		                 <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 ">
		                    <ul className="dashBox">
		                        <li className="dash1"></li>
		                        <li className="dash2"></li>
		                        <li className="dash3"></li> 
		                    </ul>
		                </div> 
		            </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-sm-12 col-xs-12 ourPortfolioTitle"> 
                            	<h1 className="text-center"><b>{this.state.blocks.blockTitle}</b></h1>	
                            </div>

                        </div>
                    </div> 
                    <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 buttonWrapper">
				     	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">	
						 {
                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
						this.state.blocks.repeatedBlocks.map((data, index)=>{
							var i= index+1;
                					return(
						  	<button type="button" className={"btn btn-default link"+i}>{data.Title}</button>
							  );
							})
						:	
						null
					}
						  	{/* <button type="button" className="btn btn-default link2">MOBILE APP</button>
						  	<button type="button" className="btn btn-default link3">WEB APPLICATION</button>
						  	<button type="button" className="btn btn-default link4">eCOMMERCE ONLINE STORE</button>
						  	<button type="button" className="btn btn-default link5">BUSINESS PORTALS</button>
						  	<button type="button" className="btn btn-default link6">CORPORATE WEBSITES</button> */}
						</div>	  
                    </div> 
					{
                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
						this.state.blocks.repeatedBlocks.map((data, index)=>{
							var i= index+1;
							console.log("dataImages",data.Images)
                					return(
										<div className={" x col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 link"+i+"Div"}>
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 y">
												
													{data.Images.length>0 ? data.Images.map((image,ind)=>{
                                                     return(
														<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 x ">
														<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 innerBoxPortFoilio"> 

														 <img src={image} alt="enteprice" className="" height="175" /> 
														</div>
														</div>
													 )

													})
													:
													null
												}

													
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
		);

	}
}
