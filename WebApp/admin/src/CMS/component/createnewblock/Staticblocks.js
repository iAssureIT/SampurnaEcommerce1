import React 						from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import axios 						from 'axios';


import Typecomponent1               from "../blockTemplate/Typecomponent1/Typecomponent1.js";
import Aboutusbanner                from "../blockTemplate/UnimandaiBlocks/Aboutusbanner/Aboutusbanner.js";
import Aboutusmultistore            from "../blockTemplate/UnimandaiBlocks/Aboutusmultistore/Aboutusmultistore.js";
import PrivacyPolicy                from "../blockTemplate/UnimandaiBlocks/PrivacyPolicy/PrivacyPolicy.js";
import ReturnPolicy                 from "../blockTemplate/UnimandaiBlocks/ReturnPolicy/ReturnPolicy.js";
import LegalNotice                  from "../blockTemplate/UnimandaiBlocks/LegalNotice/LegalNotice.js";

// import CircleMenuBars            	 from "../blockTemplate/CircleMenuBars/CircleMenuBars.js";
import Std1LeftImgRightContent      from "../blockTemplate/Std1LeftImgRightContent/Std1LeftImgRightContent.js";
import Std2LeftVideoRightContent    from "../blockTemplate/Std2LeftVideoRightContent/Std2LeftVideoRightContent.js";
import Std3RightImgLeftContent      from "../blockTemplate/Std3RightImgLeftContent/Std3RightImgLeftContent.js";
import Std4RightVideoLeftContent    from "../blockTemplate/Std4RightVideoLeftContent/Std4RightVideoLeftContent.js";
import Std5PlainContent    			from "../blockTemplate/Std5PlainContent/Std5PlainContent.js";
import Std6RepeatedBlock    		from "../blockTemplate/Std6RepeatedBlock/Std6RepeatedBlock.js";
import Std7ContactUs    			from "../blockTemplate/Std7ContactUs/Std7ContactUs.js";
import ProductCarousel    			from "../blockTemplate/ProductCarousel/ProductCarousel.js";
import BannerView                   from "../blockTemplate/BannerView/BannerView.js";
import Banner                       from "../blockTemplate/Banner/Banner.js";
import 							    './Staticblocks.css';



class Staticblocks extends React.Component {

	constructor(props) {
		super(props);
		this.state ={
			ListOfBlockTypes  : "",
			blockType  : "",
			pageType   : ""
		}
	
	}

	selectComponent(event){
		console.log("inside selectComponent");
		var blockTitle 			= "";
		var blocksubTitle 		= "";
		var blockDescription 	= "";
		var blockType 			= "";
		var blockLink 			= "";
		var bgImage 			= "";
		var bgVideo 			= "";
		var fgVideo 			= "";
		var fgImage 			= "";
		var annimationSettings  = "";
		var rBlocksTitle 		= "";
		var rBlocksSubTitle 	= "";
		var rBlocksDescription 	= "";
		var rBlocksImage 		= "";
		var rBlocksVideo 		= "";
		var rBlocksLink         = "";
		var RepetedBlock        = "";
		var blockType           = "";
	   
		var componentName = event.target.id;
		console.log("componentName==========",componentName);
		var element = document.getElementById("id");

		if(event.target.getAttribute("data-blockTitle")){
			blockTitle = event.currentTarget.getAttribute("data-blockTitle");
		}
		if(event.target.getAttribute("data-blocksubTitle")){
			blocksubTitle = event.currentTarget.getAttribute("data-blocksubTitle");
		}
		if(event.target.getAttribute("data-blockDescription")){
			blockDescription = event.currentTarget.getAttribute("data-blockDescription");
		}
		if(event.target.getAttribute("data-blockType")){
			blockType = event.currentTarget.getAttribute("data-blockType");
		}
		if(event.target.getAttribute("data-fgImage")){
			fgImage = event.currentTarget.getAttribute("data-fgImage");
			console.log("fgImage  =>",fgImage);
		}
		if(event.target.getAttribute("data-bgImage")){
			bgImage = event.currentTarget.getAttribute("data-bgImage");
			console.log("bgImage  =>",bgImage);
		}
		if(event.target.getAttribute("data-bgVideo")){
			bgVideo = event.currentTarget.getAttribute("data-bgVideo");
			console.log("bgVideo  =>",bgVideo);
		}
		if(event.target.getAttribute("data-fgVideo")){
			fgVideo = event.currentTarget.getAttribute("data-fgVideo");
			console.log("fgVideo  =>",fgVideo);
		}
		if(event.target.getAttribute("data-annimationSettings")){
			annimationSettings = event.currentTarget.getAttribute("data-annimationSettings");
			console.log("annimationSettings  =>",annimationSettings);
		}
		if(event.target.getAttribute("data-blockLink")){
			blockLink = event.currentTarget.getAttribute("data-blockLink");
			console.log("blockLink  =>",blockLink);
		}
		if(event.target.getAttribute("data-rBlocksTitle")){
			rBlocksTitle = event.currentTarget.getAttribute("data-rBlocksTitle");
		}
		if(event.target.getAttribute("data-rBlocksSubTitle")){
			rBlocksSubTitle = event.currentTarget.getAttribute("data-rBlocksSubTitle");
		}
		if(event.target.getAttribute("data-rBlocksDescription")){
			rBlocksDescription = event.currentTarget.getAttribute("data-rBlocksDescription");
		}
		if(event.target.getAttribute("data-rBlocksImage")){
			rBlocksImage = event.currentTarget.getAttribute("data-rBlocksImage");
		}
		if(event.target.getAttribute("data-rBlocksVideo")){
			rBlocksVideo = event.currentTarget.getAttribute("data-rBlocksVideo");
		}
		if(event.target.getAttribute("data-rBlocksLink")){
			rBlocksLink = event.currentTarget.getAttribute("data-rBlocksLink");
		}
		if(event.target.getAttribute("data-RepetedBlock")){
			RepetedBlock = event.currentTarget.getAttribute("data-RepetedBlock");
		}
		if(event.target.getAttribute("data-RepetedBlock")){
			RepetedBlock = event.currentTarget.getAttribute("data-RepetedBlock");
		}
		if(event.target.getAttribute("data-RepetedBlock")){
			RepetedBlock = event.currentTarget.getAttribute("data-RepetedBlock");
		}
		if(event.target.getAttribute("data-RepetedBlock")){
			RepetedBlock = event.currentTarget.getAttribute("data-RepetedBlock");
		}
		if(event.target.getAttribute("data-RepetedBlock")){
			RepetedBlock = event.currentTarget.getAttribute("data-RepetedBlock");
		}
		

		if(this.state.blockType){
			blockType = this.state.blockType;
			console.log("blockType in static blocks",blockType);
			// blockType = event.currentTarget.getAttribute("data-blockType");
		}

	

		var queryString = 	"componentName="+componentName
							+"&blockTitle="+blockTitle
							+"&blocksubTitle="+blocksubTitle
							+"&blockDescription="+blockDescription
							+"&fgImage="+fgImage
							+"&bgImage="+bgImage
							+"&bgVideo="+bgVideo
							+"&fgVideo="+bgVideo
							+"&blockLink="+blockLink
							+"&RepetedBlock="+RepetedBlock
							+"&rBlocksTitle="+rBlocksTitle
							+"&rBlocksSubTitle="+rBlocksSubTitle
							+"&rBlocksDescription="+rBlocksDescription
							+"&rBlocksImage="+rBlocksImage
							+"&rBlocksVideo="+rBlocksVideo
							+"&rBlocksLink="+rBlocksLink
							+"&blockType="+blockType

							
		
		this.props.history.push('/cms/create-new-block?'+queryString);
	}

	componentDidMount(){
		this.getListOfBlockType();
	}

	handleChange(event){
		event.preventDefault();
        // console.log("handleChange===>in Componant===>",this.refs.blockType.value);
    	this.setState({
       			// "blockTitle"       : this.state.parsed.blockTitle ? this.refs.blockTitle.value : "",
			    // "blocksubTitle"    : this.state.parsed.blocksubTitle ? this.refs.blocksubTitle.value :"",
			    "blockType"		     : this.refs.blockType.value ,
          		});
	}
	getListOfBlockType(){
    	axios
	      	.get('/api/blocktypemaster/get/list')
	      	.then((response)=>{    
	        	// console.log("ListOfBlockTypes",response.data);    
	            this.setState({
	                ListOfBlockTypes:response.data
	            });
	        })
	        .catch(function (error) {
	        // handle error
          	console.log(error);
        });
    }


	render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xl-12 bgclrwhtforstatic">

				<div className="boxItem1Statickblocks ">
				<div className=" txtCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
					<div className="  col-lg-12 col-md-12 col-sm-12 col-xs-12 ">

                    	<h2 className="text-center">Select Required Design from Following list </h2>
            		</div>
            	</div>
            	 <div className="form-group m3all" id="pageType">
					<div className="col-lg-6 col-lg-offset-3 col-md-6 col-sm-12 col-xs-12 ">

                                <div className="form-group">
                                    <label className="label-category lb666 labelform">Select Block Type </label>
                                    <select className="form-control hinput30" id="blockType"  value={this.state.blockType} ref="blockType" name="blockType"  onChange={this.handleChange.bind(this)}>
                                          <option hidden >--Select Block type--</option>
                                          { this.state.ListOfBlockTypes  && this.state.ListOfBlockTypes.length 
                                            ?
                                              this.state.ListOfBlockTypes.map((result,index)=>{
                                              	{/*console.log("result",result)*/}
                                              return(
                                                      <option value={result.facility}>{result.facility}</option>
                                                  )
                                                })
                                            :
                                              ""
                                            }
                                     
                                    </select>
                                  
                                </div>
                            </div>
                        </div>
                        {

                        this.state.blockType == "Standard" 
                        ?
                        <div>
							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover imgHovercontainer m10 nopadding">	
								<div className="image">
									<Std1LeftImgRightContent/> 
								</div>
								<div className="middleStatic">
					            <button id="Std1LeftImgRightContent" 
					            		data-blockTitle   			="blockTitle" 
					            		data-blocksubTitle   		="blocksubTitle" 
					            		data-blockDescription   	="blockDescription" 
										data-fgImage      			="fgImage"
										data-bgImage      			="bgImage"
										data-blockLink   			="blockLink" 
										 
					                	className="btn zIndexmtop pull-right textBtn" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design 
					            </button>	
					            </div>	            
							</section>
							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover imgHovercontainer m10 nopadding">	
								<div className="image">
									<Std2LeftVideoRightContent/> 
								</div>
								<div className="middleStatic">
					            <button id="Std2LeftVideoRightContent" 
					            		data-blockTitle   			="blockTitle" 
					            		data-blocksubTitle   		="blocksubTitle" 
					            		data-blockDescription   	="blockDescription" 
										data-fgVideo      			="fgVideo"
										data-bgImage      			="bgImage"
										data-blockLink   			="blockLink"
										 
					                	className="btn zIndexmtop pull-right textBtn" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design 
					            </button>	
					            </div>	            
							</section>
							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover imgHovercontainer m10 nopadding">	
								<div className="image">
									<Std3RightImgLeftContent/> 
								</div>
								<div className="middleStatic">
					            <button id="Std3RightImgLeftContent" 
					            		data-blockTitle   			="blockTitle" 
					            		data-blocksubTitle   		="blocksubTitle" 
					            		data-blockDescription   	="blockDescription" 
										data-fgImage      			="fgImage"
										data-bgImage      			="bgImage"
										data-blockLink   			="blockLink"  
										 
					                	className="btn zIndexmtop pull-right textBtn" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design 
					            </button>	
					            </div>	            
							</section>
							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover imgHovercontainer m10 nopadding">	
								<div className="image">
									<Std4RightVideoLeftContent/> 
								</div>
								<div className="middleStatic">
					            <button id="Std4RightVideoLeftContent" 
					            		data-blockTitle   			="blockTitle" 
					            		data-blocksubTitle   		="blocksubTitle" 
					            		data-blockDescription   	="blockDescription" 
										data-fgVideo      			="fgVideo"
										data-bgImage      			="bgImage"
										data-blockLink   			="blockLink"
										 
					                	className="btn zIndexmtop pull-right textBtn" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design 
					            </button>	
					            </div>	            
							</section>
							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover imgHovercontainer m10 nopadding">	
								<div className="image">
									<Std5PlainContent/> 
								</div>
								<div className="middleStatic">
					            <button id="Std5PlainContent" 
					            		data-blockTitle   		="blockTitle" 
					            		data-blocksubTitle   	="blocksubTitle" 
					            		data-blockDescription   ="blockDescription" 
										data-bgImage      		="bgImage"
										 
					                	className="btn zIndexmtop pull-right textBtn" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design 
					            </button>	
					            </div>	            
							</section>

							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover imgHovercontainer m10 nopadding">	
								<div className="image">
									<Std6RepeatedBlock/> 
								</div>
								<div className="middleStatic">
					            <button id="Std6RepeatedBlock" 
					            		data-blockTitle   		="blockTitle" 
					            		data-blocksubTitle   	="blocksubTitle" 
					            		data-blockDescription   ="blockDescription"
										data-RepetedBlock 		="RepetedBlock" 
										data-rBlocksTitle 		="rBlocksTitle" 
										data-rBlocksSubTitle 	="rBlocksSubTitle" 
										data-rBlocksDescription ="rBlocksDescription" 
										data-rBlocksImage 		="rBlocksImage" 
										data-rBlocksLink 		="rBlocksLink" 
					            		 

										 
					                	className="btn zIndexmtop pull-right textBtn" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design 
					            </button>	
					            </div>	            
							</section>
							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover imgHovercontainer m10 nopadding">	
								<div className="image">
									<Std7ContactUs/> 
								</div>
								<div className="middleStatic">
					            <button id="Std7ContactUs" 
					            		data-blockTitle   		="blockTitle" 
					            		data-blocksubTitle   	="blocksubTitle" 
					            		data-blockDescription   ="blockDescription"
										data-RepetedBlock 		="RepetedBlock" 
										data-rBlocksTitle 		="rBlocksTitle" 
										data-rBlocksSubTitle 	="rBlocksSubTitle" 
										data-rBlocksDescription ="rBlocksDescription" 
										data-rBlocksImage 		="rBlocksImage" 
										data-rBlocksLink 		="rBlocksLink" 
					            		 

										 
					                	className="btn zIndexmtop pull-right textBtn" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design 
					            </button>	
					            </div>	            
							</section>
						</div>
						:
						""

						}
						{

                        this.state.blockType == "Custamized" 
                        ?
                        <div>
							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover m10">	
					            <button id="Aboutusbanner" 
										data-blockTitle="blockTitle" 
					                	
										data-bgImage="bgImage" 
					                	className="btn zIndexmtop pull-right" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design
					            </button>		            
								<Aboutusbanner /> 
							</section>
					
					<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover m10">	
			            <button id="Aboutusmultistore" 
								data-blockTitle="blockTitle" 
			                	data-blocksubTitle="blocksubTitle" 
			                	data-blockDescription="blockDescription" 
			                	data-RepetedBlock="RepetedBlock" 
			                	data-rBlocksTitle="rBlocksTitle" 
			                	data-rBlocksSubTitle="rBlocksSubTitle" 
								
			                	className="btn zIndexmtop pull-right" 
			                	onClick={this.selectComponent.bind(this)} > 
			                	Select this Design
			            </button>		            
						<Aboutusmultistore /> 
					</section>
					
					<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover m10">	
			            <button id="PrivacyPolicy" 
								data-blockTitle="blockTitle" 
			                	data-blockDescription="blockDescription" 
								
			                	className="btn zIndexmtop pull-right" 
			                	onClick={this.selectComponent.bind(this)} > 
			                	Select this Design
			            </button>		            
						<PrivacyPolicy /> 
					</section>
					
					
					<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover m10">	
			            <button id="ReturnPolicy" 
								data-blockTitle="blockTitle" 
			                	data-blockDescription="blockDescription" 
								
			                	className="btn zIndexmtop pull-right" 
			                	onClick={this.selectComponent.bind(this)} > 
			                	Select this Design
			            </button>		            
						<ReturnPolicy /> 
					</section>
					
					
					<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover m10">	
			            <button id="LegalNotice" 
								data-blockTitle="blockTitle" 
			                	data-blockDescription="blockDescription" 
							 
			                	className="btn zIndexmtop pull-right" 
			                	onClick={this.selectComponent.bind(this)} > 
			                	Select this Design
			            </button>		            
						<LegalNotice /> 
					</section>
							
						</div>
						:
						""

						}
						{

                        this.state.blockType == "eCommerce" 
                        ?
                        <div>
							
							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover imgHovercontainer m10 nopadding">	
								<div className="image">
									<ProductCarousel/> 
								</div>
								<div className="middleStatic">
					            <button id="ProductCarousel" 
					            		
										 
					                	className="btn zIndexmtop pull-right textBtn" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design 
					            </button>	
					            </div>	            
							</section>
							<section className="col-lg-12 col-md-12 col-sm-12 col-xl-12 selectHover imgHovercontainer m10 nopadding">	
								<div className="image">									
									<Banner />									
								</div>
								<div class="middleStatic">
					            <button id="Banner" 
					            		data-blockTitle   			="blockTitle" 
					            		data-blocksubTitle   		="blocksubTitle" 
										data-blockDescription   	="blockDescription" 
										
										data-fgVideo      			="fgVideo"
										data-bgImage      			="bgImage"
										data-bgVideo      			="bgVideo"
										data-fgImage      			="fgImage"
										
										data-blockLink   			="blockLink"
										data-RepetedBlock 		    ="RepetedBlock" 
										data-rBlocksTitle 		    ="rBlocksTitle" 
										data-rBlocksSubTitle 	    ="rBlocksSubTitle" 
										data-rBlocksDescription     ="rBlocksDescription" 
										data-rBlocksImage 		    ="rBlocksImage" 
										data-rBlocksLink 		    ="rBlocksLink"

										data-annimationSettings     ="annimationSettings"								
					            		
										 
					                	className="btn zIndexmtop pull-right textBtn" 
					                	onClick={this.selectComponent.bind(this)} > 
					                	Select this Design 
					            </button>	
					            </div>	            
							</section>
							
						</div>
						:
						""

						}
					
				
					</div>
				</div>
		);
	}
}

export default withRouter(Staticblocks);