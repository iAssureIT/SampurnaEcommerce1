import React from 'react';
import axios from 'axios';
import swal 								from 'sweetalert';

export default class BlockDrawer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			parsed 	 			: "",
			Block_id 	 		: "",
			urlParam 	 		: "",
			pageData 	 		: "",
			pageData 	 		: {},
			Blocks 		 		: [],
			blocks 		 		: "",
			pageType 	 	 	: "",
			blockType 	 	 	: "",
			ListOfPages  	 	: "",
			ListOfBlockTypes 	: "",
			ListOfBlocks 	 	: "",
			Edit_blockType 	 	: "",
			block_on_page 	 	: "",
			block_on_page_id 	: "",
			ListOfpages  	 	: "",
			pageURL 			: "",
			pageWords 			: "",
			pageDescription 	: "",
			pageAuthor 			: "",
		};
	}


	selectBlockDesign(event){
		event.preventDefault();
		var blockTitle 			= "";
		var blocksubTitle 		= "";
		var blockDescription 	= "";
		var blockType 			= "";
		var blockLink 			= "";
		var bgImage 			= "";
		var bgVideo 			= "";
		var fgImage 			= "";
		var rBlocksTitle 		= "";
		var rBlocksSubTitle 	= "";
		var rBlocksDescription 	= "";
		var rBlocksImage 		= "";
		var rBlocksVideo 		= "";
		var rBlocksLink         = "";
		var RepetedBlock        = "";
		var blockType           = "";
	   	var parsed = {};

		var componentName = event.target.id;
		var element = document.getElementById("id");

		if(event.target.getAttribute("data-blocktitle")){
			parsed.blockTitle = event.currentTarget.getAttribute("data-blocktitle");
		}
		if(event.target.getAttribute("data-blocksubtitle")){
			parsed.blocksubTitle = event.currentTarget.getAttribute("data-blocksubtitle");
		}
		if(event.target.getAttribute("data-blockdescription")){
			parsed.blockDescription = event.currentTarget.getAttribute("data-blockdescription");
		}
		if(event.target.getAttribute("data-blocktype")){
			parsed.blockType = event.currentTarget.getAttribute("data-blocktype");
		}
		if(event.target.getAttribute("data-fgimage")){
			parsed.fgImage = event.currentTarget.getAttribute("data-fgimage");
			// console.log("fgImage  =>",fgImage);
		}
		if(event.target.getAttribute("data-bgimage")){
			parsed.bgImage = event.currentTarget.getAttribute("data-bgimage");
			// console.log("bgImage  =>",bgImage);
		}
		if(event.target.getAttribute("data-bgvideo")){
			parsed.bgVideo = event.currentTarget.getAttribute("data-bgvideo");
			// console.log("bgVideo  =>",bgVideo);
		}
		if(event.target.getAttribute("data-blocklink")){
			parsed.blockLink = event.currentTarget.getAttribute("data-blocklink");
			// console.log("blockLink  =>",blockLink);
		}
		if(event.target.getAttribute("data-rblockstitle")){
			parsed.rBlocksTitle = event.currentTarget.getAttribute("data-rblockstitle");
		}
		if(event.target.getAttribute("data-rblockssubtitle")){
			parsed.rBlocksSubTitle = event.currentTarget.getAttribute("data-rblockssubtitle");
		}
		if(event.target.getAttribute("data-rblocksdescription")){
			parsed.rBlocksDescription = event.currentTarget.getAttribute("data-rblocksdescription");
		}
		if(event.target.getAttribute("data-rblocksimage")){
			parsed.rBlocksImage = event.currentTarget.getAttribute("data-rblocksimage");
		}
		if(event.target.getAttribute("data-rblocksvideo")){
			parsed.rBlocksVideo = event.currentTarget.getAttribute("data-rblocksvideo");
		}
		if(event.target.getAttribute("data-rblockslink")){
			parsed.rBlocksLink = event.currentTarget.getAttribute("data-rblockslink");
		}
		if(event.target.getAttribute("data-repetedblock")){
			parsed.RepetedBlock = event.currentTarget.getAttribute("data-repetedblock");
		}
		if(this.state.blockType){
			parsed.blockType = this.state.blockType;
			console.log("blockType in static blocks",blockType);
			// blockType = event.currentTarget.getAttribute("data-blocktype");
		}
		var componentName = event.target.id;
		// console.log("componentName,",componentName);
		// console.log("parsed,",parsed);
		var urlParam = this.state.urlParam;
		console.log("urlParams=",urlParam);
		var AttachmentValues ={    
				"blockComponentName"	: componentName,
				"block_id"				: null,										
				"parsed"				: parsed,										
	   		}

		console.log("AttachmentValues,",AttachmentValues);

    	axios
			.patch('/api/pages/patch/blocks/add/'+urlParam,AttachmentValues)
		  	.then( (response)=> {
		    	// window.location.reload();
		    	
				this.props.pageAddBlock(urlParam);
	            swal("Block added in your page");

		    	console.log(response);
		  	})
		  	.catch(function (error) {
		    	console.log(error);
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
	selectblockType(event){
	    event.preventDefault();
			var data ={ 
		    	blocktype : this.refs.blockType.value
		    }
		    // const pageType = event.target.value;
			axios.post('/api/blocks/post/blocktype',data)
				.then((res) => {
					// console.log("res",res);
					 this.setState({
					      			ListOfBlocks:res.data
							      					      
						      });

					})
				.catch((error) => {
					console.log("errr",error);
				});
	    this.setState({
	      /*"cmspageDescription"      : this.refs.cmspageDescription.value,*/
	      "blockType"            : this.refs.blockType.value,
	      
	    });
	}
	componentDidMount(){
	 // this._isMounted = true;
		var pageUrl = window.location.pathname;
		// console.log("pageUrl = ",pageUrl);
		let a = pageUrl ? pageUrl.split('/') : "";
        // console.log("a==>",a[1]); 
        const urlParam =a[3];
        this.setState({
		      			urlParam:urlParam
		});
        this.getListOfBlockType();
        // this.getAllBlockList();
		// this.pageAddBlock(urlParam);


	}


	render() {
		return (
			<div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<h4><i className="glyphicon glyphicon-circle-arrow-right"></i>&nbsp;&nbsp;&nbsp;&nbsp; Select the required block on page
							</h4>
							    <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12 ">
			                        <div className="form-group m3all" id="pageType">
			                            <div className="form-group">
			                                <label className="label-category  labelform">Select Block Type </label>                            
										      	<div className="input-group ipspanht form-group">
											      	<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-list-alt"></i></div>
				                                    <select className="form-control fromcontrolheight" id="blockType"  value={this.state.blockType} ref="blockType" name="blockType"  onChange={this.selectblockType.bind(this)}>
				                                          <option hidden >--Select Block type--</option>
				                                          { this.state.ListOfBlockTypes  && this.state.ListOfBlockTypes.length 
				                                            ?
				                                              this.state.ListOfBlockTypes.map((result,index)=>{
				                                              return(
				                                                      <option value={result.facility} key={index}>{result.facility}</option>
				                                                  )
				                                                })
				                                            :
				                                              ""
				                                            }
				                                     
				                                    </select>
			                                    </div>
			                                </div>
			                        </div>
			                    </div>
			                    {
			                    	this.state.blockType == "eCommerce"
			                    	?
			                    	
			                    	<div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/ecomBlock1.jpeg" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="ProductCarousel" className="btn blockSelectBtn pull-right textBtn" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   			="blockTitle" 
								            		data-blocksubtitle   		="blocksubTitle" 
								            		data-blockdescription   	="blockDescription" 
													data-fgimage      			="fgImage"
													data-bgimage      			="bgImage"
													data-blocklink   			="blockLink"
										    		onClick={this.selectBlockDesign.bind(this)}> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>
										{/* <div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
											<img src="/images/cms/ecomFullPageBlock1.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
											<div className="middleButtn">
												
												<button id="FullPageBlock" className="btn blockSelectBtn pull-right textBtn" 
													data-blockType   			= {this.state.blockType} 
													data-blockTitle   			="blockTitle" 
													data-blocksubTitle   		="blocksubTitle" 
													data-blockDescription   	="blockDescription" 
													data-fgImage      			="fgImage"
													data-bgImage      			="bgImage"
													data-blockLink   			="blockLink"
													onClick={this.selectBlockDesign.bind(this)}> 
													Select this Design 
												</button>
											</div>
										</div> */}
									</div>
									: ""
			                    }
								{
			                    	this.state.blockType == "Menubar"
			                    	?
			                    	
			                    	<div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/SimpleMenu.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="SimpleMenu" className="btn blockSelectBtn pull-right textBtn" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   			="blockTitle" 
								            		data-blocksubtitle   		="blocksubTitle" 
								            		data-blockdescription   	="blockDescription" 
													data-fgimage      			="fgImage"
													data-bgimage      			="bgImage"
													data-blocklink   			="blockLink"
													data-repetedblock 		="RepetedBlock" 
													data-rblockstitle 		="rBlocksTitle" 
													data-rblockssubtitle 	="rBlocksSubTitle" 
													data-rblocksdescription ="rBlocksDescription" 
													data-rblocksimage 		="rBlocksImage" 
													data-rblockslink 		="rBlocksLink"
										    		onClick={this.selectBlockDesign.bind(this)}> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>
									</div>
									: ""
			                    }
			                    {
			                    	this.state.blockType == "Banner"
			                    	?
			                    	
			                    	<div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/unibanner.jpg" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="Banner" className="btn blockSelectBtn pull-right textBtn" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   			="blockTitle" 
								            		data-blocksubtitle   		="blocksubTitle" 
								            		data-blockdescription   	="blockDescription" 
													data-fgimage      			="fgImage"
													data-bgimage      			="bgImage"
													data-blocklink   			="blockLink"
													data-repetedblock 		="RepetedBlock" 
													data-rblockstitle 		="rBlocksTitle" 
													data-rblockssubtitle 	="rBlocksSubTitle" 
													data-rblocksdescription ="rBlocksDescription" 
													data-rblocksimage 		="rBlocksImage" 
													data-rblockslink 		="rBlocksLink"
										    		onClick={this.selectBlockDesign.bind(this)}> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>

									</div>
									: ""
			                    }
			                    {

			                    	this.state.blockType == "Standard"
			                    	?

				         			<div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/Slider_1.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="Std3RightImgLeftContent" className="btn blockSelectBtn pull-right textBtn" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   			="blockTitle" 
								            		data-blocksubtitle   		="blocksubTitle" 
								            		data-blockdescription   	="blockDescription" 
													data-fgimage      			="fgImage"
													data-bgimage      			="bgImage"
													data-blocklink   			="blockLink"
										    		onClick={this.selectBlockDesign.bind(this)}> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>
										
										{/* <div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/categories.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="CategoriesBlock" className="btn blockSelectBtn pull-right textBtn" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   			="blockTitle" 
								            		data-blocksubtitle   		="blocksubTitle" 
								            		data-blockdescription   	="blockDescription" 
													data-fgimage      			="fgImage"
													data-bgimage      			="bgImage"
													data-blocklink   			="blockLink"
										    		onClick={this.selectBlockDesign.bind(this)}> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div> */}
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/Slider_2.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="Std1LeftImgRightContent"
										    		data-blocktype   			= {this.state.blockType} 

										    		data-blocktitle   			="blockTitle" 
								            		data-blocksubtitle   		="blocksubTitle" 
								            		data-blockdescription   	="blockDescription" 
													data-fgimage      			="fgImage"
													data-bgimage      			="bgImage"
													data-blocklink   			="blockLink" 
										    		onClick={this.selectBlockDesign.bind(this)}
								                	className="btn blockSelectBtn pull-right textBtn" 
								                	 > 
								                	Select this Design 
								            </button>
										  	</div>
										</div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/Slider_3.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="Std6RepeatedBlock" 
										    		data-blocktype   			= {this.state.blockType} 

										    		data-blocktitle   		="blockTitle" 
								            		data-blocksubtitle   	="blocksubTitle" 
								            		data-blockdescription   ="blockDescription"
													data-repetedblock 		="RepetedBlock" 
													data-rblockstitle 		="rBlocksTitle" 
													data-rblockssubtitle 	="rBlocksSubTitle" 
													data-rblocksdescription ="rBlocksDescription" 
													data-rblocksimage 		="rBlocksImage" 
													data-rblockslink 		="rBlocksLink" 
										    		onClick={this.selectBlockDesign.bind(this)} 
								                	className="btn blockSelectBtn pull-right textBtn" 
								                	 > 
								                	Select this Design 
								            </button>
										  	</div>
										</div>
									</div>
									: ""
							
			         			}
			         			{

			                    	this.state.blockType == "Custamized"
			                    	?

				         			<div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/HomepageBanner.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="HomepageBanner" className="btn blockSelectBtn pull-right textBtn" 
										    		data-blocktype   			= {this.state.blockType} 
										    		
													data-repetedblock 		="RepetedBlock" 
													data-rblockstitle 		="rBlocksTitle" 
													data-rblockssubtitle 	="rBlocksSubTitle" 
													data-rblocksdescription ="rBlocksDescription" 
													data-rblocksimage 		="rBlocksImage" 
													data-rblockslink 		="rBlocksLink" 
													data-bgimage      			="bgImage"
													data-blocklink   			="blockLink"
										    		onClick={this.selectBlockDesign.bind(this)}> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>

										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/HelpAndSupport.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">										    	
										    	<button id="HelpAndSupport" className="btn blockSelectBtn pull-right textBtn" 
										    		data-blocktype   			= {this.state.blockType}										    		
													data-repetedblock 		="RepetedBlock" 
													data-rblockstitle 		="rBlocksTitle" 
													data-rblockssubtitle 	="rBlocksSubTitle" 
													data-rblocksdescription ="rBlocksDescription" 
													data-rblocksimage 		="rBlocksImage" 
													data-rblockslink 		="rBlocksLink" 
													data-bgimage      		="bgImage"
													data-blocklink   		="blockLink"
										    		onClick={this.selectBlockDesign.bind(this)}> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Services.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="Services"
										    		data-blocktype   			= {this.state.blockType} 

										    		data-blocktitle   		="blockTitle" 
													data-repetedblock 		="RepetedBlock" 
													data-rblockstitle 		="rBlocksTitle" 
													data-rblockssubtitle 	="rBlocksSubTitle" 
													data-rblocksdescription ="rBlocksDescription" 
													data-rblocksimage 		="rBlocksImage" 
													data-rblockslink 		="rBlocksLink"
													data-bgimage      			="bgImage"

										    		onClick={this.selectBlockDesign.bind(this)}
								                	className="btn blockSelectBtn pull-right textBtn" 
								                	 > 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/FastrackFrameWork.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="FasttrackFrameWork" className="btn blockSelectBtn pull-right textBtn" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   			="blockTitle" 
								            		data-blocksubtitle   		="blocksubTitle" 
								            		data-blockdescription   	="blockDescription" 
													data-fgimage      			="fgImage"
													data-bgimage      			="bgImage"
													data-blocklink   			="blockLink"
										    		onClick={this.selectBlockDesign.bind(this)}> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>
					         			
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/OutSpeciality.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="OutSpeciality"
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   		="blockTitle" 
													data-repetedblock 		="RepetedBlock" 
													data-rblockstitle 		="rBlocksTitle" 
													data-rblockssubtitle 	="rBlocksSubTitle" 
													data-rblocksdescription ="rBlocksDescription" 
													data-rblocksimage 		="rBlocksImage" 
													data-rblockslink 		="rBlocksLink"
										    		onClick={this.selectBlockDesign.bind(this)}
								                	className="btn blockSelectBtn pull-right textBtn" 
								                	 > 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/MobileAppDevelopment.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="MobileAppDevelopment"
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   		="blockTitle" 
								            		data-blocksubtitle   		="blocksubTitle" 
													data-fgimage      			="fgImage"
													data-repetedblock 		="RepetedBlock" 
													data-rblockstitle 		="rBlocksTitle" 
													data-rblocksimage 		="rBlocksImage" 
													data-rblockslink 		="rBlocksLink"
										    		onClick={this.selectBlockDesign.bind(this)}
								                	className="btn blockSelectBtn pull-right textBtn" 
								                	 > 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/AutoPilotPlatform.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="AutoPilotPlatform" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   		="blockTitle" 
								            		data-blocksubtitle   	="blocksubTitle" 
								            		data-blockdescription   ="blockDescription"
								            		data-fgimage      			="fgImage"
													data-bgimage      			="bgImage"
										    		onClick={this.selectBlockDesign.bind(this)} 
								                	className="btn blockSelectBtn pull-right textBtn" 
								                	 > 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Endlesspossibility.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="Endlesspossibility" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   		="blockTitle" 
								            		data-blocksubtitle   	="blocksubTitle" 
								            		data-blockdescription   ="blockDescription"
								            		data-fgimage      			="fgImage"
										    		onClick={this.selectBlockDesign.bind(this)} 
								                	className="btn blockSelectBtn pull-right textBtn" 
								                	 > 
								                	Select this Design 
								            </button>
										  	</div>
										</div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Testimonials.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="Testimonials" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   		="blockTitle" 
								            		data-repetedblock 		="RepetedBlock" 
													data-rblockstitle 		="rBlocksTitle" 
													data-rblockssubtitle 	="rBlocksSubTitle" 
													data-rblocksdescription ="rBlocksDescription" 
													data-rblocksimage 		="rBlocksImage" 
										    		onClick={this.selectBlockDesign.bind(this)} 
								                	className="btn blockSelectBtn pull-right textBtn" 
								                	 > 
								                	Select this Design 
								            </button>
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/AddressOnGoogleMap.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="AddressOnGoogleMap" 
										    		data-blocktype   			= {this.state.blockType} 
										    		data-blocktitle   		="blockTitle" 
										    		onClick={this.selectBlockDesign.bind(this)} 
								                	className="btn blockSelectBtn pull-right textBtn"> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/eCommerceBanner.png" alt="eCommerceBanner" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="eCommerceBanner" 
														data-blocktitle="blockTitle" 
														data-blocksubtitle="blockSubTitle" 
														data-blockdescription="blockDescription" 
														data-fgimage="fgImage" 
														data-bgimage="bgImage" 
								                		className="btn blockSelectBtn pull-right textBtn" 
														
										    			onClick={this.selectBlockDesign.bind(this)}  > 
									                	Select this Design
									            </button>
										  	</div>
										</div>
											{/*
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Customisable.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="Customisable" 
														data-blocktitle="blockTitle" 
														data-blockdescription="blockDescription" 
														data-fgimage="fgImage" 
														className="btn zIndexmtop pull-right" 
										    			onClick={this.selectBlockDesign.bind(this)}  > 
									                	Select this Design
									            </button>
										  	</div>
										</div>*/}

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Customisable.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="Customisable" 
														data-blocktitle="blockTitle" 
														data-blockdescription="blockDescription" 
														data-fgimage="fgImage" 
														
								                		className="btn blockSelectBtn pull-right textBtn" 

										    			onClick={this.selectBlockDesign.bind(this)}  > 
									                	Select this Design
									            </button>
										  	</div>
										</div>



					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CreateOnlineStore.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CreateOnlineStore" 
													data-blocktitle="blockTitle" 
													data-blockdescription="blockDescription" 
													data-fgimage="fgImage" 
													data-bgimage="bgImage"
								                	className="btn blockSelectBtn pull-right textBtn" 
													
										    		onClick={this.selectBlockDesign.bind(this)}  > 
								                	
								                	Select this Design
								            	</button>	
										  	</div>
										</div>

										
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/NationalAwards.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="NationalAwards" 
														data-blocktitle="blockTitle" 
														data-blocksubtitle="blocksubTitle" 
														data-fgimage="fgImage" 
														data-bgimage="bgImage"
														data-repetedblock="RepetedBlock"
														data-rblocksimage="rBlocksImage"
														data-rblocksdescription="rBlocksDescription"
								                		className="btn blockSelectBtn pull-right textBtn" 
													
														onClick={this.selectBlockDesign.bind(this)}  > 
									                	Select this Design
									            </button>
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/ContactBanner.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="ContactBanner" 
													    data-blocktitle="blockTitle"
													    data-bgimage   = "bgImage"
													    data-fgimage   ="fgImage"
								                		className="btn blockSelectBtn pull-right textBtn" 
													
														onClick={this.selectBlockDesign.bind(this)}  > 

									                	
									                	Select this Design
									            </button>
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/GetInTouch.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="GetInTouch" 
													    data-blocktitle="blockTitle"
													    data-blocksubtitle="blocksubTitle"
													    data-repetedblock="RepetedBlock"
													    data-rblockstitle="rBlocksTitle" 
													    data-rblockssubtitle="rBlocksSubTitle"
													    data-rblocksdescription="rBlocksDescription"
													    data-rblocksimage="rBlocksImage"

													    className="btn zIndexmtop pull-right" 
														onClick={this.selectBlockDesign.bind(this)}  > 
									                	
									                	Select this Design
									            </button>
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/ContactForm.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="ContactForm" 
												    data-blocktitle="blockTitle"
												    data-repetedblock="RepetedBlock"
												    data-rblockstitle="rBlocksTitle" 
												    data-rblockssubtitle="rBlocksSubTitle"
												    data-rblocksimage="rBlocksImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/StaffBanner.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="StaffBanner" 
												    data-blockdescription="blockDescription"
													data-blocktitle="blockTitle" 
													data-fgimage="fgImage" 
													data-bgimage="bgImage" 
												   
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CustomRepHiringModel.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CustomRepHiringModel" 
												    data-blocktitle="blockTitle"
												    data-repetedblock="RepetedBlock"
												    data-rblockstitle="rBlocksTitle" 
												    data-rblocksdescription="rBlocksDescription"
												    data-rblockslink="rBlocksLink"
												    data-rblocksimage="rBlocksImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CustomGetStarted.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CustomGetStarted" 
													data-blocktitle="blockTitle" 
												    data-blockdescription="blockDescription"
													data-fgimage="fgImage" 
													data-bgimage="bgImage"
													data-blocklink="blockLink"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/StaffServiece.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="StaffServiece" 
												    data-blocktitle="blockTitle"
												    data-repetedblock="RepetedBlock"
												    data-rblockstitle="rBlocksTitle" 
												    data-rblocksdescription="rBlocksDescription"
												    data-rblocksimage="rBlocksImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>

					         			{/* <div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CustNationalAwards.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CustNationalAwards" 
												        data-blocktitle="blockTitle" 
														data-fgimage="fgImage" 
														data-bgimage="bgImage"
														data-repetedblock="RepetedBlock"
														data-rblocksimage="rBlocksImage"
														data-rblockstitle="rBlocksTitle"
														data-rblocksdescription="rBlocksDescription"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div> */}

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Strategy.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="Strategy" 
												    data-blocktitle="blockTitle" 
												    data-blockdescription="blockDescription"
													data-fgimage="fgImage" 
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/WebSiteNextLevel.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="WebSiteNextLevel" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>
										 {/* ecommerce customized blocks */}
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/aboutusbanner.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="Aboutusbanner" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Aboutusmultistore.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="Aboutusmultistore" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/returnpolicy.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="ReturnPolicy" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/contactus.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="ContactUsform" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/allblogs.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="AllBlogs" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>
{/* ===================================================Vishal Added NEW blocks========================================================			 */}
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Faq.jpeg" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="Faq" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>


										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/KeyFeatures.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="KeyFeaturesWebApp" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>


										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/ReactNative.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="ReactNativeWebApp" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>


										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/TechnologyStacks.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="TechnologyStacksWebAppDev" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>


										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Whatwedo.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="WhatWedo" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>


										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/WantToStart.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="WantStartProject" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>


										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Portfolioimg.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="Portfolio" 
												    data-blocktitle="blockTitle" 
												    data-blocklink="blockLink" 
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>
{/* ===================================================END===================================================================			 */}

{/* NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN ++  Nitin Added New Blocks  ++ NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN  */}

										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/KeyFeatures-MA.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="KeyFeatures"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/TechnologyStack-MA.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="TechnologyStack"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/QualityPerformanceSecurity.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="QualityPerformanceSecurity"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>

{/* NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN ++  End  ++ NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN  */}
 {/* ................................................Divesh Added New Block...................................................*/}

 										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/ModeOfPaymt.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="ModeOfPaymt"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>

										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CustServices.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CustServices"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CargoShipment.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CargoShipment"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CompanyEmp.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CompanyEmp"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/MultilevelMenubar.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="MultilevelMenubar"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CompanyBenfts.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CompanyBenfts"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CustReviews.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CustReviews"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CompanyProjects.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CompanyProjects"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CargoFooter.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CargoFooter"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/EnquiryForm.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="EnquiryForm"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/ServiceDescrptn.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="ServiceDescrptn"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/CustGallery.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="CustGallery"
												    data-blocktitle="blockTitle"
												    data-blocklink="blockLink"
													data-fgimage="fgImage"
													data-bgimage="bgImage"
								               		className="btn blockSelectBtn pull-right textBtn"
													onClick={this.selectBlockDesign.bind(this)}
												>
													Select this Design
								            	</button>	
										  	</div>
										</div>
{/* ................................................END...................................................*/}
									</div>

									: ""

			         			}
			         				
			        	</div>
			</div>
		);
	}
}
