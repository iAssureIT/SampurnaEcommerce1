import React, { Component, Suspense } 		from 'react';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import axios from 'axios';
import swal 								from 'sweetalert';
import CmsBlock 							from "../createnewblock/Cmsblock.js";
import CreateECommblock 					from "../createECommBlock/CreateECommblock.js";
import BlockDrawer     						from "./BlockDrawer.js";
import './Addnewblockonpage.css';

export default class Addnewblockonpage extends React.Component {

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
        this.getAllBlockList();
		this.pageAddBlock(urlParam);


	}
	getAllBlockList(){
		// console.log("pageTypepageType=>",pageType);
		axios
        .get('/api/blocks/get/list')
        .then((response)=>{
				// console.log("AllBloks=",response.data);
				// var scomp = response.data.find(({ pageTypes }) => pageTypes === pageType );
				// console.log("scomp=",scomp);

			      	this.setState({
		      			ListOfBlocks:response.data.reverse()
		      		},()=>{
		      				// console.log("======>",this.state.ListOfBlocks);
		      		});
		      	})
			  	.catch(function (error) {
			    // handle error
			    	console.log(error);
			  	});
	}

	openNav() {
		document.getElementById("mySidenav").style.width = "250px";
	}

	closeNav() {
		document.getElementById("mySidenav").style.width = "0";
	}
	toggleNav(event) {
		event.preventDefault()
		    var currentWidth = document.getElementById("mySidenavaddBLOCK").style.width;
		    if (currentWidth == "500px") {
		      document.getElementById("mySidenavaddBLOCK").style.width = "0";
		    } else {
		      document.getElementById("mySidenavaddBLOCK").style.width = "500px";
		    }

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


	handleChange(){

	}
	/*
	selectBlockDesign(event){
		event.preventDefault();
		var componentName = event.target.id;
		console.log("componentName,",componentName);
		var urlParam = this.state.urlParam;
	

		var formValues = {
	  		
	  		blockComponentName : componentName,
	  		blockType 			   : this.state.blockType ? this.state.blockType : "",
	      	pageType           : this.state.pageType ? this.state.pageType : "" ,
	  					
		};

		console.log("formValues=blocks>",formValues);
		axios
			.post('/api/blocks/post',formValues)
		  	.then( (response)=> {
		  
		    	console.log("data in block========",response.data);
		    	if (response.data) {
		    		var AttachmentValues ={    
							"blockComponentName"	: componentName,
							"block_id"				: response.data.ID,										
				   		}

		    	axios
					.patch('api/pages/patch/blocks/add/'+urlParam,AttachmentValues)
				  	.then( (response)=> {
				    	// window.location.reload();
				    	
						this.pageAddBlock(urlParam);
			            swal("Block added in your page");

				    	console.log(response);
				  	})
				  	.catch(function (error) {
				    	console.log(error);
				  	});
		    	 }
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});

		
        
	

	}*/

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


	pageAddBlock(urlParam){
		axios
		.get('/api/pages/get/page_block/'+urlParam)
        .then((response)=>{
        	// console.log("data in page=",response.data.pageHead);
      		if (response.data) {
		      	this.setState({
		      		pageData		: response.data,
		      		pageTitle 		: response.data.pageTitle,
					pageURL 		: response.data.pageURL,
					pageWords 		: response.data.pageHead.pageWords[0],
					pageDescription : response.data.pageHead.pageDescription,
					pageAuthor 		: response.data.pageHead.pageAuthor,
		      	});

				}
		    })
	    .catch(function(error){
	        console.log(error);
          	
	    })

	}

	deleteBlocks(event){
		event.preventDefault();
		let urlParam=this.state.urlParam;
		// console.log("this.state.urlParam  ",urlParam);
		var URL= event.currentTarget.id;
		var Block_id = event.currentTarget.id;
		var block_on_page = event.currentTarget.getAttribute("data-block_on_page");

		// console.log("delet id ",block_on_page);
		// console.log("delet id ",Block_id);
		var deleteValues ={
	      "pageBlocks_id":block_on_page
			}
		// console.log("id delet", this.state.urlParam, deleteValues);
		swal({
	          	title: "Are you sure you want to delete this block ?",
	          	buttons: true,
	          	dangerMode: true,
	        })
	        .then((success) => {
	        	// console.log(success);
	            if (success) {
	            	axios
				    .patch('/api/pages/patch/blocks/remove/'+this.state.urlParam,deleteValues)
				    .then((response)=>{
				     	// this.getListOfPages();
				       	swal("block is deleted!");
				       	// this.getAllBlockList();
						// this.pageAddBlock();
						this.pageAddBlock(this.state.urlParam);

				       
				    })
				    .catch((error)=>{
				       console.log("error = ", error);              
				    });  
	            } else {
	            swal("Your Block is safe!");
	          }
	        }); 
	}
	editBlock(event){
		event.preventDefault();

		var Block_id = event.currentTarget.id;
		var block_on_page = event.currentTarget.getAttribute("data-block_on_page");
		var blockcomponent = event.currentTarget.getAttribute("data-blockcomponent");
		var blockType = event.currentTarget.getAttribute("data-blocktype");
		console.log("Block_id=",Block_id);
		console.log("block_on_page=",block_on_page);
		console.log("this.state.urlParam=",this.state.urlParam);
		axios
		.get('/api/pages/get/page_block/'+this.state.urlParam)
        .then((response)=>{
        	// console.log("data in page=",response.data);
      		if (response.data) {
				var _id = "" ;
				// console.log("response.data=",response.data.pageBlocks);
				// var scomp = response.data.pageBlocks.find( Block_id  => Block_id === Block_id );
				var samp =  response.data.pageBlocks.filter(x => x._id === Block_id);
				// console.log("samp",samp[0].parsed);
				// console.log("scomp",scomp);
				this.setState(
					{
						Block_id: Block_id,
						Edit_blockType: blockType,
						blockcomponent: blockcomponent,
						parsed : samp[0].parsed,
						block_on_page: block_on_page ? block_on_page : null,
					});

				}
		    })
	    .catch(function(error){
	        console.log(error);	
	    })
	}
	addSimilarBlock(event){
		event.preventDefault();
		var Block_id = event.currentTarget.id;
		var blockcomponent = event.currentTarget.getAttribute("data-blockcomponent");
		var block_on_page = event.currentTarget.getAttribute("data-block_on_page");
		// console.log("blockcomponent",blockcomponent);
		 axios
	      // .get('/api/pages/get/list')
	      .get('/api/blocks/get/similarblocklist/'+blockcomponent)     
	      .then((response)=>{    
	        // console.log("response",response.data);    
	              this.setState({
	                ListOfBlocks:response.data,
	                block_on_page_id: Block_id
	              },()=>{
	                // console.log("ListOfPageslll==ll",this.state.ListOfBlocks);
	              });
	        })
	        .catch(function (error) {
	        // handle error
	          console.log(error);
	        });

	}
	addThisBlock(event){
		event.preventDefault();
		var block_id = event.currentTarget.id;
	    // console.log("block_id==ll",block_id);
	    // console.log("block_id==ll",this.state.urlParam);
	    var pageformValues = {
              "block_id"        : block_id,                   
              "_id"        : this.state.block_on_page_id,                   

            }
	    // console.log("block_id==ll",pageformValues);

	    axios
            .patch('/api/pages/patch/pageaddblocks/'+this.state.urlParam, pageformValues)

                .then((response)=>{
                  // console.log("data in page=",response.data);
                 
                })
              .catch(function(error){
                  console.log(error);
                    
              })



	}

	WindowRefresh(){
		window.location.reload();
	}

	render() {
		// console.log("pageData--->>>>>>>>",this.state.pageData)

		// console.log("this.state.pageData.    this.state.pageData.pageTitle",this.state.pageData.pageTitle);
		return (
			<div className="wrapperClassspage">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding headerNewPage">
							<div className="logoaddpageleftImg col-lg-4 col-md-4 col-sm-12 col-xs-12">
                          		{/*<img src="/images/iAssureIT.svg" alt="iAssureIT.svg" className="intro_img"  width="100" />*/}
                    		</div>
	                        <button  type="button" className="CNPBtnANBOP btn pull-right sendtxtmsgbtn col-lg-4 col-md-4 col-sm-12 col-xs-12" onClick={this.toggleNav.bind(this)}><i className="glyphicon glyphicon-plus-sign"></i>&nbsp;&nbsp;&nbsp;&nbsp; ADD BLOCK</button>

						</div>	
					</div>	

					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pageLayoutBoxWrap">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pageLayoutBox nopadding">
							<div className="anpTitle ">
								<div className="col-lg-4 col-md-4 col-xs-12 col-sm-12">
									<h3>{this.state.pageData.pageTitle} Page Layout</h3>
								</div>
	                        	<button  type="button" className="CNPBtnANBOPInfo btn pull-right sendtxtmsgbtn col-lg-4 col-md-4 col-sm-12 col-xs-12"  data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"><i className="glyphicon glyphicon-list-alt"></i>&nbsp;&nbsp;&nbsp;&nbsp; PAGE HEADER INFO</button>

							</div>
							<div className="collapse" id="collapseExample">
								  <div className="card card-body">
								    <div>
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                    <div className="form-group m3all" id="pageTitle">
	                                    	<label className="label-category lb666 labelform">Page Title<span className="astrick"> </span></label>
	                                   		<div className="input-group ipspanht form-group">
									      		<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-credit-card"></i></div>
	                                	        <input type="text" ref="pageTitle" value={this.state.pageTitle || ""} id="basicPageName" name="basicPageName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid fromcontrolheight form-control" onChange={this.handleChange.bind(this)} disabled/>
	                                    	
	                                    	</div>
	                                    </div>
	                                </div>
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                    <div className="form-group m3all">
	                                    	<label className="label-category lb666 labelform">Page URL<span className="astrick"></span></label>
	                                    	<div className="input-group ipspanht form-group">
											<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-globe"></i></div>
	                                        	<input type="text" ref="pageUrl" id="basicPageName" value={this.state.pageURL || ""} name="basicPageName" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid fromcontrolheight form-control" onChange={this.handleChange.bind(this)} disabled/>
	                                    	</div>
	                                    </div>
	                                </div>
	                            </div>
	                            
	                                
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <div className="form-group m3all">
                                    	<label className="label-category lb666 labelform">Keywords<span className="astrick"></span></label>
                                        <div className="input-group ipspanht form-group">
									 	<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-text-background"></i></div>
                                        	<input type="text" ref="pageWords" value={this.state.pageWords || ""} id="pageWords" name="pageWords"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid fromcontrolheight form-control" onChange={this.handleChange.bind(this)} disabled/>
                                    	</div>
                                    </div>
                                </div>
	                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                <div className="form-group m3all">
	                                    <label className="label-category lb666 labelform">Author<span className="astrick"></span></label>
										<div className="input-group ipspanht form-group">
									      	<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-user"></i></div>	                                    
	                            	        <input type="text" ref="pageAuthor" id="pageAuthor" value={this.state.pageAuthor || ""} name="pageAuthor"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid fromcontrolheight form-control" onChange={this.handleChange.bind(this)} disabled/>
	                                	</div>
	                                </div>
	                            </div>
                            	
                            	<div className="row inputrow">
	                               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                  <div className="form-group m3all">
	                                   <label className="label-category lb666 labelform">Description<span className="astrick"></span></label>
	                                        <textarea ref="pageDescription" value={this.state.pageDescription || ""} id="pageDescription" name="pageDescription"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12   form-control" rows="4" onChange={this.handleChange.bind(this)} disabled/>
	                                  </div>
	                                </div>
                            	</div>
								  </div>
								</div>
							{
								this.state.pageData.pageBlocks && this.state.pageData.pageBlocks.length>0 ?

							<div>
							{

										this.state.pageData.pageBlocks && this.state.pageData.pageBlocks.length>0
										?
											this.state.pageData.pageBlocks.map((result, index)=>{
												
												var blockType = result.parsed ? result.parsed.blockType : "Standard";
												/*
												var componentBlockComp = result.blockComponentName ? result.blockComponentName : 'Typecomponent1';
												var componentTemp_id = result.block_id ? result.block_id.blockComponentName : "Typecomponent1";
												*/
												var componentTemp = result.blockComponentName  ? result.blockComponentName ? result.blockComponentName : 'Typecomponent1' :result.block_id ? result.block_id.blockComponentName : "Typecomponent1" ;
												console.log("=-componentTemp=--->>>>>>>>",componentTemp);
												// var componentPath =  "../blockTemplate/" ;
												// if (blockType === "Standard" ) {
												// 	componentPath =  "../blockTemplate/Standard/" ;
												// }else if(blockType === "Customized") {
												// 	componentPath =  "../blockTemplate/"+process.env.REACT_APP_PROJECT_NAME+"/Customized/" ;
												// }else if(blockType === "eCommerce") {
												// 	componentPath =  "../blockTemplate/eCommerce/" ;
												// }else if(blockType === "Widget") {
												// 	componentPath =  "../blockTemplate/Widget/" ;
												// }
												// console.log("=-componentPath=--->>>>>>>>",componentPath);

												var NewPageComponent = React.lazy(() => import('../blockTemplate/'+componentTemp+'/'+componentTemp+'.js'));
												// var NewPageComponent = React.lazy(() => import('../blockTemplate/iAssureIT/Customized/eCommerceBanner/eCommerceBanner.js'));
												// console.log("=-NewPageComponent=--->>>>>>>>",NewPageComponent);
												
												//const NewPageComponent = loadable(() => import('../blockTemplate/'+componentTemp));
												// var Block_id=result._id;
												var Block_id=result._id;
												var block_id=result.block_id ? result.block_id._id : null;
											
												return(
													<div key={index} className="DynamicBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
														<div className="DynamicblockImageAddBLock">
														  	<Suspense fallback={<div className="LoaderWrapper">
														  				<Loader type="Rings" color="#333" height={250} width={300} timeout={4000} />
														  			</div>} >
																{/*<i className="fa fa-trash deletbtnIcon pull-right" id={block_id} onClick={this.deleteBlocks.bind(this)}></i>*/}
																{/*<i className="fa fa-pencil editIcon pull-right" id={Block_id} onClick={this.editBlock.bind(this)} data-toggle="modal" data-target="#editBlockFormM"></i>*/}
													    		<NewPageComponent Block_id={Block_id} block_id={block_id}/>
													    	</Suspense>
												    	</div>
													  	<div className="DynamicmiddleButtn">
												            <div className="DynamicblockSelectWrap">
													            <div className="DynamicblockSelectBtn col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<div className="iconincenter col-lg-4 col-md-4 col-sm-12 col-xs-12"  id={Block_id}  data-block_on_page={block_id}  data-toggle="modal" title="Select Ready Blocks of this Type" data-target="#allBlockModal" data-blockcomponent={componentTemp} onClick={this.addSimilarBlock.bind(this)}>
																		<i className="fa fa-address-card  bkclr"></i>
																	</div>
																	<div className="iconincenter col-lg-4 col-md-4 col-sm-12 col-xs-12" id={Block_id} data-block_on_page={block_id} data-blocktype={blockType} title="Edit this block" data-blockcomponent={componentTemp} onClick={this.editBlock.bind(this)} data-toggle="modal" data-target="#editBlockFormM">
																		<i className="fa fa-pencil  bkclr" ></i>{/*data-toggle="modal" data-target="#editBlockFormM"*/}
																	</div>
																	<div className="iconincenter col-lg-4 col-md-4 col-sm-12 col-xs-12" id={block_id} data-block_on_page={Block_id} title="Delete this block" onClick={this.deleteBlocks.bind(this)}>
																		<i className="fa fa-trash  bkclr" ></i>
																	</div>
																	
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
							:
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  nopadding">
								<div className="col-lg-6 col-lg-offset-3 nbaddedBox col-md-12 col-sm-12 col-xs-12  ">
									<h3 className="text-center mtoph1adbl">No Blocks Added Yet<br/>Click on 'Add Block' button above
									</h3>

								</div>
							</div>
						}

						</div>		
					</div>	
					<div id="mySidenavaddBLOCK" className="sidenavaddBlock">
						<BlockDrawer pageAddBlock={this.pageAddBlock.bind(this)}/>
							
			        </div>	
				</div>	
				<div id="editBlockFormM" className="modal" role="dialog">
					 	<div className="modal-dialog modal-lg">
					    {/*<!-- Modal content-->*/}
					    	<div className="modal-content">
						        <div className="modal-header">
							        <button type="button" className="close" data-dismiss="modal" onClick={this.WindowRefresh.bind(this)}>&times;</button>
							        {/*<h4 className="modal-title text-center">Edit Block</h4>*/}
						      
						      		{/*console.log("in modal",this.state.block_id)*/}
						      		{
						      			this.state.Edit_blockType =="eCommerce"
						      			?
						      				<CreateECommblock urlParam={this.state.urlParam} Block_id={this.state.Block_id}/>

						        		:
						        		<CmsBlock urlParam={this.state.urlParam} Block_id={this.state.Block_id} block_on_page={this.state.block_on_page} blockcomponent={this.state.blockcomponent} parsed={this.state.parsed} Edit_blockType={this.state.Edit_blockType} pageAddBlock={this.pageAddBlock.bind(this)}/>
						      		}
						      	</div>
						      	{/*<div className="modal-footer">
						        	<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						      	</div>*/}
					    	</div>
					    </div>
				</div>		
				<div id="allBlockModal" className="modal" role="dialog">
					 	<div className="modal-dialog modal-lg allBlockModalWidth">
					    {/*<!-- Modal content-->*/}
					    	<div className="modal-content">
					    		<div className="modal-header">
							        <button type="button" className="close" data-dismiss="modal">&times;</button>
						      	</div>
						        <div className="modal-header">

						        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
									{
										this.state.ListOfBlocks && this.state.ListOfBlocks.length> 0
										?
											this.state.ListOfBlocks.map((result, index)=>{
												// console.log("blockType =-------------------------------------===> ",result);

												var blockType = result ? result.blockType : "";
												// console.log("blockType ====> ",blockType);

												var component = result.blockComponentName ? result.blockComponentName : "Typecomponent1";
												// console.log("component",component);
												const NewPageComponent = React.lazy(() => import('../blockTemplate/'+component+'/'+component+'.js'));
												var block_id=result._id;
												return(
													<div key={index} className="DynamicBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
														<div className="DynamicblockImageAddBLock">
														  	<Suspense key={index} fallback={<div className="LoaderHightW">
														  			<Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />
														  			</div>} >
																{/*<i className="fa fa-trash deletbtnIcon pull-right" id={block_id} onClick={this.deleteBlocks.bind(this)}></i>*/}
																{/*<i className="fa fa-pencil editIcon pull-right" id={Block_id} onClick={this.editBlock.bind(this)} data-toggle="modal" data-target="#editBlockFormM"></i>*/}
													    		<NewPageComponent  block_id={block_id}/>
													    	</Suspense>
												    	</div>
													  	<div className="DynamicmiddleButtn allblockbtnaddcss">
													    	
											            <div className="DynamicblockSelectWrap">
												            <div className="DynamicblockSelectBtn col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<button  className="btn blockSelectBtn btnHoverblockAdd pull-right textBtn" id={block_id}	
															    		onClick={this.addThisBlock.bind(this)}> 
													                	Add this Block 
													            	</button>
												            </div>
											            </div>

													  	</div>
													</div>
										    	)
											})
										:
										<img className="img-responsive middlPageImage" src="/images/loading.gif" alt="Bannerpng"/>
										
									}
								</div>
								</div>
					    	</div>
					    </div>
				</div>	
			</div>
		);
	}
}
