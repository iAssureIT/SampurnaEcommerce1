import React, { Component, Suspense } 		from 'react';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import axios from 'axios';
import swal 								from 'sweetalert';
import CmsBlock 							from "../createnewblock/Cmsblock.js";

import './Addnewblockonpage.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// // a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

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
			block_on_page_id 	 	: "",
			ListOfpages  	 	: "",
			items:[{
			content: "item 0",id: "item-0"},
			{id: "item-1", content: "item 1"},
			{id: "item-2", content: "item 2"},
			{id: "item-3", content: "item 3"},
			{id: "item-4", content: "item 4"},
			{id: "item-5", content: "item 5"},
			{id: "item-6", content: "item 6"},
			{id: "item-7", content: "item 7"}]

		};
		this.onDragEnd = this.onDragEnd.bind(this);

	}

	 reorderitems(sourceInd,destInd){
		const items = reorder(
			this.state.items,
			sourceInd,
		    destInd
		);
		console.log("items",items)
		this.setState({
		  items
		});
	}

	onDragEnd(result) {
		console.log("destination", result);
		// dropped outside the list
		if (!result.destination) {
		  return;
		}
	
		const pageData = reorder(
		  this.state.pageData.pageBlocks,
		  result.source.index,
		  result.destination.index
		);
	
		this.setState({
			pageData
		});
	  }
	
		
	
	componentDidMount(){
		console.log("items",this.state.items)
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
	}/*
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

		if(event.target.getAttribute("data-blockTitle")){
			parsed.blockTitle = event.currentTarget.getAttribute("data-blockTitle");
		}
		if(event.target.getAttribute("data-blocksubTitle")){
			parsed.blocksubTitle = event.currentTarget.getAttribute("data-blocksubTitle");
		}
		if(event.target.getAttribute("data-blockDescription")){
			parsed.blockDescription = event.currentTarget.getAttribute("data-blockDescription");
		}
		if(event.target.getAttribute("data-blockType")){
			parsed.blockType = event.currentTarget.getAttribute("data-blockType");
		}
		if(event.target.getAttribute("data-fgImage")){
			parsed.fgImage = event.currentTarget.getAttribute("data-fgImage");
			// console.log("fgImage  =>",fgImage);
		}
		if(event.target.getAttribute("data-bgImage")){
			parsed.bgImage = event.currentTarget.getAttribute("data-bgImage");
			// console.log("bgImage  =>",bgImage);
		}
		if(event.target.getAttribute("data-bgVideo")){
			parsed.bgVideo = event.currentTarget.getAttribute("data-bgVideo");
			// console.log("bgVideo  =>",bgVideo);
		}
		if(event.target.getAttribute("data-blockLink")){
			parsed.blockLink = event.currentTarget.getAttribute("data-blockLink");
			// console.log("blockLink  =>",blockLink);
		}
		if(event.target.getAttribute("data-rBlocksTitle")){
			parsed.rBlocksTitle = event.currentTarget.getAttribute("data-rBlocksTitle");
		}
		if(event.target.getAttribute("data-rBlocksSubTitle")){
			parsed.rBlocksSubTitle = event.currentTarget.getAttribute("data-rBlocksSubTitle");
		}
		if(event.target.getAttribute("data-rBlocksDescription")){
			parsed.rBlocksDescription = event.currentTarget.getAttribute("data-rBlocksDescription");
		}
		if(event.target.getAttribute("data-rBlocksImage")){
			parsed.rBlocksImage = event.currentTarget.getAttribute("data-rBlocksImage");
		}
		if(event.target.getAttribute("data-rBlocksVideo")){
			parsed.rBlocksVideo = event.currentTarget.getAttribute("data-rBlocksVideo");
		}
		if(event.target.getAttribute("data-rBlocksLink")){
			parsed.rBlocksLink = event.currentTarget.getAttribute("data-rBlocksLink");
		}
		if(event.target.getAttribute("data-RepetedBlock")){
			parsed.RepetedBlock = event.currentTarget.getAttribute("data-RepetedBlock");
		}
		if(this.state.blockType){
			parsed.blockType = this.state.blockType;
			console.log("blockType in static blocks",blockType);
			// blockType = event.currentTarget.getAttribute("data-blockType");
		}
		var componentName = event.target.id;
		// console.log("componentName,",componentName);
		// console.log("parsed,",parsed);
		var urlParam = this.state.urlParam;
		var AttachmentValues ={    
				"blockComponentName"	: componentName,
				"block_id"				: null,										
				"parsed"				: parsed,										
	   		}

		console.log("AttachmentValues,",AttachmentValues);

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
	pageAddBlock(urlParam){
		axios
		.get('/api/pages/get/page_block/'+urlParam)
        .then((response)=>{
        	// console.log("data in page=",response.data);
      		if (response.data) {
		      	this.setState({
		      		pageData:response.data,
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
		var blockType = event.currentTarget.getAttribute("data-blockType");
		// console.log("blockType=",blockType);
		// console.log("block_on_page=",block_on_page);
		// console.log("this.state.urlParam=",this.state.urlParam);
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
	                console.log("ListOfPageslll==ll",this.state.ListOfBlocks);
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

	    getItemStyle = (isDragging, draggableStyle) => ({

        // some basic styles to make the items look a bit nicer
        userSelect: 'none',
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,
    
        // change background colour if dragging
        background: isDragging ? 'lightgreen' : 'grey',
    
        // styles we need to apply on draggables
        ...draggableStyle
    });

	// onDragEnd=(result)=>{
	// 	console.log("onDragEnd",result)
    //     const{destination, source, reason}=result;

    //     if(!destination || reason === 'CANCEL'){
    //         return;
    //     }
    //     if(destination.droppableId===source.droppableId && destination.index===source.index){
    //         return;
    //     }
    //     const blocks = Object.assign([],this.state.blocks);
    //     const droppedUser = this.state.blocks[source.index];

    //     blocks.splice(source.index,1);
    //     blocks.splice(destination.index,0,droppedUser);

    //     this.setState({
    //         blocks
    //     },()=>{
	// 		console.log("blocks",blocks)
	// 	})
    // }


	render() {
		// console.log("pageData--->>>>>>>>",this.state.pageData)

		// console.log("this.state.pageData.    this.state.pageData.pageTitle",this.state.pageData.pageTitle);
		return (
			<div className="wrapperClassspage">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding headerNewPage">
							<div className="logoaddpageleftImg col-lg-4 col-md-4 col-sm-12 col-xs-12">
                          		<img src="/images/iAssureIT.svg" alt="iAssureIT.svg" className="intro_img"  width="100" />
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
	                        	<button  type="button" className="CNPBtnANBOPInfo btn pull-right sendtxtmsgbtn col-lg-4 col-md-4 col-sm-12 col-xs-12"><i className="glyphicon glyphicon-list-alt"></i>&nbsp;&nbsp;&nbsp;&nbsp; PAGE HEADER INFO</button>

							</div>
							{
								this.state.pageData.pageBlocks && this.state.pageData.pageBlocks.length>0 ?

							<div>

							{

										this.state.pageData.pageBlocks && this.state.pageData.pageBlocks.length>0
										?
											this.state.pageData.pageBlocks.map((result, index)=>{
												
												var blockType = result.parsed.blockType ? result.parsed.blockType : "Standard";
												// console.log("=-blockType=--->>>>>>>>",blockType);
												var componentTemp = result.blockComponentName ? result.blockComponentName : 'Typecomponent1';
												// console.log("=-componentTemp=--->>>>>>>>",componentTemp);
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
													//example start
												// 	<DragDropContext onDragEnd={this.onDragEnd}>
												// 	<Droppable droppableId="droppable">
												// 	  {(provided, snapshot) => (
												// 		<div
												// 		  {...provided.droppableProps}
												// 		  ref={provided.innerRef}
												// 		  style={getListStyle(snapshot.isDraggingOver)}
												// 		>
												// 		  {this.state.items.map((item, index) => (
												// 			<Draggable key={item.id} draggableId={item.id} index={index}>
												// 			  {(provided, snapshot) => (
												// 				<div
												// 				  ref={provided.innerRef}
												// 				  {...provided.draggableProps}
												// 				  {...provided.dragHandleProps}
												// 				  style={getItemStyle(
												// 					snapshot.isDragging,
												// 					provided.draggableProps.style
												// 				  )}
												// 				>
												// 				  {item.content}
												// 				</div>
												// 			  )}
												// 			</Draggable>
												// 		  ))}
												// 		  {provided.placeholder}
												// 		</div>
												// 	  )}
												// 	</Droppable>
												//   </DragDropContext>
											
													//example end

													//working start
													<DragDropContext onDragEnd={this.onDragEnd}>
													<div className="container wrapper">                
													<Droppable droppableId="dp1">
															{(provided) => (
																<div ref={provided.innerRef}>
																	{ 
																	Array.isArray(this.state.users) && this.state.users.map((data, index)=>{                                                
																		return(
																		<Draggable key={index} draggableId={index+''} index={index}>
																				{(provided) => (
																			<div 
																			ref={provided.innerRef}
																			{...provided.draggableProps}
																			{...provided.dragHandleProps}
																			className="DynamicBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding"
																			>
																				<div className="DynamicblockImageAddBLock">
																					<Suspense fallback={<div className="LoaderWrapper">
																								<Loader type="Rings" color="#333" height={250} width={300} timeout={4000} />
																							</div>} key={index}>
																						<NewPageComponent Block_id={Block_id} block_id={block_id}/>
																					</Suspense>
																				</div> 
																				<div className="DynamicmiddleButtn">
																					<div className="DynamicblockSelectWrap">
																						<div className="DynamicblockSelectBtn col-lg-12 col-md-12 col-sm-12 col-xs-12">
																							<div className="iconincenter col-lg-4 col-md-4 col-sm-12 col-xs-12"  id={Block_id}  data-block_on_page={block_id}  data-toggle="modal" title="Select Ready Blocks of this Type" data-target="#allBlockModal" data-blockcomponent={componentTemp} onClick={this.addSimilarBlock.bind(this)}>
																								<i className="fa fa-address-card  bkclr"></i>
																							</div>
																							<div className="iconincenter col-lg-4 col-md-4 col-sm-12 col-xs-12" id={Block_id} data-block_on_page={block_id} data-blockType={result.parsed.blockType} title="Edit this block" data-blockcomponent={componentTemp} onClick={this.editBlock.bind(this)} data-toggle="modal" data-target="#editBlockFormM">
																								<i className="fa fa-pencil  bkclr" ></i>
																							</div>
																							<div className="iconincenter col-lg-4 col-md-4 col-sm-12 col-xs-12" id={block_id} data-block_on_page={Block_id} title="Edit this block" onClick={this.deleteBlocks.bind(this)}>
																								<i className="fa fa-trash  bkclr" ></i>
																							</div>
																							
																						</div>
																					</div>
																				</div> 
																			</div>
																			)}
																			</Draggable>
																		)                
																		})
																	}
														   {provided.placeholder}

														</div>
														)}
														{/* {provided.placeholder} */}
														</Droppable>
													</div>
													</DragDropContext>
										
													//working end
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
			                    </div>
			                    {

			                    	this.state.blockType == "Standard"
			                    	?

				         			<div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/Slider_1.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="Std3RightImgLeftContent" className="btn blockSelectBtn pull-right textBtn" 
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
										</div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/Slider_2.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="Std1LeftImgRightContent"
										    		data-blockType   			= {this.state.blockType} 

										    		data-blockTitle   			="blockTitle" 
								            		data-blocksubTitle   		="blocksubTitle" 
								            		data-blockDescription   	="blockDescription" 
													data-fgImage      			="fgImage"
													data-bgImage      			="bgImage"
													data-blockLink   			="blockLink" 
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
										    		data-blockType   			= {this.state.blockType} 

										    		data-blockTitle   		="blockTitle" 
								            		data-blocksubTitle   	="blocksubTitle" 
								            		data-blockDescription   ="blockDescription"
													data-RepetedBlock 		="RepetedBlock" 
													data-rBlocksTitle 		="rBlocksTitle" 
													data-rBlocksSubTitle 	="rBlocksSubTitle" 
													data-rBlocksDescription ="rBlocksDescription" 
													data-rBlocksImage 		="rBlocksImage" 
													data-rBlocksLink 		="rBlocksLink" 
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

			                    	this.state.blockType == "Customized"
			                    	?

				         			<div>
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/HomepageBanner.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="HomepageBanner" className="btn blockSelectBtn pull-right textBtn" 
										    		data-blockType   			= {this.state.blockType} 
										    		
													data-RepetedBlock 		="RepetedBlock" 
													data-rBlocksTitle 		="rBlocksTitle" 
													data-rBlocksSubTitle 	="rBlocksSubTitle" 
													data-rBlocksDescription ="rBlocksDescription" 
													data-rBlocksImage 		="rBlocksImage" 
													data-rBlocksLink 		="rBlocksLink" 
													data-bgImage      			="bgImage"
													data-blockLink   			="blockLink"
										    		onClick={this.selectBlockDesign.bind(this)}> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>
										<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/Services.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="Services"
										    		data-blockType   			= {this.state.blockType} 

										    		data-blockTitle   		="blockTitle" 
													data-RepetedBlock 		="RepetedBlock" 
													data-rBlocksTitle 		="rBlocksTitle" 
													data-rBlocksSubTitle 	="rBlocksSubTitle" 
													data-rBlocksDescription ="rBlocksDescription" 
													data-rBlocksImage 		="rBlocksImage" 
													data-rBlocksLink 		="rBlocksLink"
													data-bgImage      			="bgImage"

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
										</div>
					         			
					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/OutSpeciality.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	
										    	<button id="OutSpeciality"
										    		data-blockType   			= {this.state.blockType} 
										    		data-blockTitle   		="blockTitle" 
													data-RepetedBlock 		="RepetedBlock" 
													data-rBlocksTitle 		="rBlocksTitle" 
													data-rBlocksSubTitle 	="rBlocksSubTitle" 
													data-rBlocksDescription ="rBlocksDescription" 
													data-rBlocksImage 		="rBlocksImage" 
													data-rBlocksLink 		="rBlocksLink"
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
										    		data-blockType   			= {this.state.blockType} 
										    		data-blockTitle   		="blockTitle" 
								            		data-blocksubTitle   		="blocksubTitle" 
													data-fgImage      			="fgImage"
													data-RepetedBlock 		="RepetedBlock" 
													data-rBlocksTitle 		="rBlocksTitle" 
													data-rBlocksImage 		="rBlocksImage" 
													data-rBlocksLink 		="rBlocksLink"
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
										    		data-blockType   			= {this.state.blockType} 
										    		data-blockTitle   		="blockTitle" 
								            		data-blocksubTitle   	="blocksubTitle" 
								            		data-blockDescription   ="blockDescription"
								            		data-fgImage      			="fgImage"
													data-bgImage      			="bgImage"
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
										    		data-blockType   			= {this.state.blockType} 
										    		data-blockTitle   		="blockTitle" 
								            		data-blocksubTitle   	="blocksubTitle" 
								            		data-blockDescription   ="blockDescription"
								            		data-fgImage      			="fgImage"
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
										    		data-blockType   			= {this.state.blockType} 
										    		data-blockTitle   		="blockTitle" 
								            		data-RepetedBlock 		="RepetedBlock" 
													data-rBlocksTitle 		="rBlocksTitle" 
													data-rBlocksSubTitle 	="rBlocksSubTitle" 
													data-rBlocksDescription ="rBlocksDescription" 
													data-rBlocksImage 		="rBlocksImage" 
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
										    		data-blockType   			= {this.state.blockType} 
										    		data-blockTitle   		="blockTitle" 
										    		onClick={this.selectBlockDesign.bind(this)} 
								                	className="btn blockSelectBtn pull-right textBtn"> 
								                	Select this Design 
								            	</button>
										  	</div>
										</div>

					         			<div className="ImgBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
										  	<img src="/images/cms/eCommerceBanner.png" alt="Avatar" className="blockImageAddBLock" width="460"/>
										  	<div className="middleButtn">
										    	<button id="eCommerceBanner" 
														data-blockTitle="blockTitle" 
														data-blockSubTitle="blockSubTitle" 
														data-blockDescription="blockDescription" 
														data-fgImage="fgImage" 
														data-bgImage="bgImage" 
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
														data-blockTitle="blockTitle" 
														data-blockDescription="blockDescription" 
														data-fgImage="fgImage" 
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
														data-blockTitle="blockTitle" 
														data-blockDescription="blockDescription" 
														data-fgImage="fgImage" 
														
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
													data-blockTitle="blockTitle" 
													data-blockDescription="blockDescription" 
													data-fgImage="fgImage" 
													data-bgImage="bgImage"
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
														data-blockTitle="blockTitle" 
														data-blocksubTitle="blocksubTitle" 
														data-fgImage="fgImage" 
														data-bgImage="bgImage"
														data-RepetedBlock="RepetedBlock"
														data-rBlocksImage="rBlocksImage"
														data-rBlocksDescription="rBlocksDescription"
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
													    data-blockTitle="blockTitle"
													    data-bgImage   = "bgImage"
													    data-fgImage   ="fgImage"
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
													    data-blockTitle="blockTitle"
													    data-blocksubTitle="blocksubTitle"
													    data-RepetedBlock="RepetedBlock"
													    data-rBlocksTitle="rBlocksTitle" 
													    data-rBlocksSubTitle="rBlocksSubTitle"
													    data-rBlocksDescription="rBlocksDescription"
													    data-rBlocksImage="rBlocksImage"

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
												    data-blockTitle="blockTitle"
												    data-RepetedBlock="RepetedBlock"
												    data-rBlocksTitle="rBlocksTitle" 
												    data-rBlocksSubTitle="rBlocksSubTitle"
												    data-rBlocksImage="rBlocksImage"
								               		className="btn blockSelectBtn pull-right textBtn" 
												
													onClick={this.selectBlockDesign.bind(this)}  > 
								                	Select this Design
								            	</button>	
										  	</div>
										</div>


										


									</div>
									: ""
							
			         			}
			         				
			        	</div>	
			        </div>	
				</div>	
				<div id="editBlockFormM" className="modal" role="dialog">
					 	<div className="modal-dialog modal-lg">
					    {/*<!-- Modal content-->*/}
					    	<div className="modal-content">
						        <div className="modal-header">
							        <button type="button" className="close" data-dismiss="modal">&times;</button>
							        {/*<h4 className="modal-title text-center">Edit Block</h4>*/}
						      
						      		{/*console.log("in modal",this.state.block_id)*/}
						        	<CmsBlock urlParam={this.state.urlParam} Block_id={this.state.Block_id} block_on_page={this.state.block_on_page} blockcomponent={this.state.blockcomponent} parsed={this.state.parsed} Edit_blockType={this.state.Edit_blockType} pageAddBlock={this.pageAddBlock.bind(this)}/>
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
													<div className="DynamicBlockcontainer col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
														<div className="DynamicblockImageAddBLock">
														  	<Suspense fallback={<div className="LoaderHightW">
														  			<Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />
														  			</div>} key={index}>
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
