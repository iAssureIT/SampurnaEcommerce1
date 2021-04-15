import React, { Component, Suspense } from 'react';
import CircleMenuBars from '../circlemenubars.js';
import axios from 'axios';
import {Route, withRouter} from 'react-router-dom';
import CmsBlock from "../createnewblock/Cmsblock.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/collapse.js';
import swal from 'sweetalert';
import './viewpage.css';

class Viewpage extends React.Component {
	constructor(props) {
		super(props);
   		var id = this.props.match.params.url;
		this.state = {
			Newpagecomponent: "",
			urlId:id,
	   		blocks:"",
	   		Blocks:[],
	   		ListOfBlocks:"",
	        addedBlocks:[],
	   		listOfBlocks:false,
	   		urlParam:"",
	   		block_id:"",
	   		pageData	:"",
	   		ListOfPages :""

	   		/* "blockGroup": null,
        "blockAppearOnPage": null*/
		}
	}
	
	getAllBlockList(){
		axios
				.get('/api/blocks/get/list')
				.then((response)=>{
						        console.log("AllBlogs=",response.data);
						      	this.setState({
					      			ListOfBlocks:response.data
					      		},()=>{
					      				console.log("===================result==",this.state.ListOfBlocks);
					      		});
					      	})
			  	.catch(function (error) {
			    // handle error
			    	console.log(error);
			  	});
	}

	getListOfPages(){
	/*/get/list*/
	axios
			.get('/api/pages/get/list')
			.then((response)=>{        
			      	this.setState({
		      			ListOfPages:response.data
		      		});
				})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
	}
	componentWillReceiveProps(nextProps){

	
	}
  
	componentDidMount(){
			// console.log("pageUrl = ",pageUrl);
			
			this.getListOfPages();
			this.getAllBlockList();
			var pageUrl = window.location.pathname;
			// console.log("pageUrl = ",pageUrl);
			let a = pageUrl ? pageUrl.split('/') : "";
	        // console.log("a==>",a[1]); 
	        const urlParam =a[2];
	        this.setState({
			      			urlParam:urlParam
			      		});

			axios
			.get('/api/pages/get/page_block/'+urlParam)
	        .then((response)=>{
	        	console.log("data in page=",response.data);
	      		if (response.data) {
			      	this.setState({
			      		pageData:response.data,
			      	});

    			/*var blockFromPage = response.data.pageBlocks;
		    	// console.log("Page = ",response.data);
			    for (var i = 0; i < blockFromPage.length; i++) 
			    {
			    	{
			   		 axios
				        .get('http://iogapi.iassureit.com/api/blocks/get/'+ blockFromPage[i].block_id)
				        .then((response)=>{
					        var blocks = this.state.Blocks;
					        blocks.push(response.data);
					      	this.setState({
				      			Blocks:blocks
				      		});
				      	})
				      	.catch(function(error){
				        	console.log(error);
				          	if(error.message === "Request failed with status code 401")
		              		{
		                   		swal("Your session is expired! Please login again.","", "error");
		              		}
		     			})
	    			}
	 			}*/
			}
	    })
	      .catch(function(error){
	        console.log(error);
	          if(error.message === "Request failed with status code 401")
	              {
	                   swal("Your session is expired! Please login again.","", "error");
	              }
	      })
   	}
   		handleChange(event)
	{
		var attaribute_Value = event.target.getAttribute('data_id');
		// console.log("attaribute_Value",attaribute_Value);
		this.state.addedBlocks.push(attaribute_Value)
	}


	addBlock(event){
		// var urlParam = window.location.pathname;
        //      console.log('urlParam=>',urlParam);
		var pageUrl = window.location.pathname;;
		console.log("pageUrl = ",pageUrl);
		let a = pageUrl ? pageUrl.split('/') : "";
        const urlParam =a[2];
		console.log("urlParam = ",urlParam);

		var attaribute_addBlock = event.target.id;
		console.log("attaribute_addBlock = ",attaribute_addBlock);
		

		var AttachmentValues ={    
			"block_id"	: attaribute_addBlock,											
   		}
		axios
			.patch('api/pages/patch/blocks/add/'+urlParam,AttachmentValues)
		  	.then(function (response) {
		    	window.location.reload();
		    	console.log(response);
		  	})
		  	.catch(function (error) {
		    	console.log(error);
		  	});

	}
	submitData(event){
		var AttachmentValues =this.state.addedBlocks;
		// console.log("ids =",this.state.addedBlocks);
		axios
			.post('/api/pages/patch/blocks/add/'+this.state.urlParam,AttachmentValues)
		  	.then(function (response) {
		    	console.log(response);
		  	})
		  	.catch(function (error) {
		    	console.log(error);
		  	});
	}
	editBlock(event){
		var block_id = event.currentTarget.id;
		// console.log("block_id=",block_id);
		this.setState({block_id: block_id});
	}
	deleteBlocks(event){
		let urlParam=this.state.urlParam;
		// console.log("this.state.urlParam  ",urlParam);
		event.preventDefault();
		var URL= event.target.id;
		// console.log("delet id ",URL);
		var deleteValues ={
	      "pageBlocks_id":URL
			}
		console.log("id delet", this.state.urlParam, deleteValues);
		 swal({
	          title: "Are you sure you want to delete this Page ?",
	          text: "Once deleted, you will not be able to recover this Page!",
	          icon: "warning",
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
				       swal("Your Page is deleted!");
				       window.location.reload();
				    })
				    .catch((error)=>{
				       console.log("error = ", error);              
				    });  
	            } else {
	            swal("Your Block is safe!");
	          }
	        }); 
	}
	onclickEvent(){
		this.setState({
	      			listOfBlocks:true
	      		});
		}

   render() {
    	// var data = this.state.ListOfBlocks;
    	console.log("block id in render=",this.state.pageData);
    	const listBlock = this.state.pageData.pageBlocks;
    	// console.log("ListOfPages==>",this.state.ListOfPages);
    	// console.log("data blocks in render",data);
        return (
        		<div>	
					<div className="contentWrapper padd1520 content">
						<div className="pageContent">
							<div className="row">
								
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<CircleMenuBars />
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									{/*<Cmspage id={this.state.urlId}/>*/}
								
									{
										this.state.pageData.pageBlocks && this.state.pageData.pageBlocks.length>0?
											this.state.pageData.pageBlocks.map((result, index)=>{

											var componentTemp = result.block_id.blockComponentName ? result.block_id.blockComponentName : 'Typecomponent1';
											const NewPageComponent = React.lazy(() => import('../blockTemplate/'+componentTemp+'/'+componentTemp+'.js'));
												console.log("componentTemp=======in viewpage=",componentTemp);


												//const NewPageComponent = loadable(() => import('../blockTemplate/'+componentTemp));
												var Block_id=result.block_id._id;
												var block_id=result._id;
												// console.log("componentTemp",componentTemp);
												return(
													<Suspense fallback={<div>Loading...</div>} key={index}>
														<i className="fa fa-trash deletbtnIcon pull-right" id={block_id} onClick={this.deleteBlocks.bind(this)}></i>
														<i className="fa fa-pencil editIcon pull-right" id={Block_id} onClick={this.editBlock.bind(this)} data-toggle="modal" data-target="#editBlockFormM"></i>
											    		<NewPageComponent block_id={Block_id}/>
											    	</Suspense>
										    	);
											})
										:
										null
									}
									<button type="button" className=" col-lg-4 col-lg-offset-4 btn b1 success btn-lg" onClick={() => this.onclickEvent()}>
										Add new Block
									</button>
									{
										this.state.listOfBlocks === true ?
										<section>
											<div className="row">
												<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
													<div className="noPadLR  selectBox col-lg-12 col-md-12 col-xs-12 col-sm-12">
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadLR">
						                					<div className="panel panel-default bgcolorO">
															    <div className="panel-heading bgPanelHead">
															        <h4 className="panel-title">
																        <button className="btn btn-primary">
																         	<a href="/viewpage1">Back</a>
																        </button>
																        <button className="btn btn-primary pull-right" id="cnBlock">
																        <a className="pull-right" data-toggle="collapse" data-parent="#accordion" href="#collapse1">
																        + Create New Block</a>
																        </button>
															        </h4>
															    </div>
															    <div id="collapse1" className="panel-collapse collapse">
															      	<div className="panel-body">
															      		<CmsBlock/>
															        </div>
															    </div>
															</div>
															{/*<div className="col-lg-12">
																<div className="col-lg-6">
                                                				<label htmlFor="email">Block Type<span className="redFont">*</span></label>
									                				<select name="cars" className="col-lg-12">
																	    		<option>HomePage</option>
                            			  								        <option>Blog</option>
                            			  								        <option>About Us</option>
                            			  								        <option>Services</option>
                            			  								        <option>Contact Us</option>
																	</select>
																</div>
																<div className="col-lg-6">
                                                				<label htmlFor="email">Block On Page<span className="redFont">*</span></label>
																	<select name="" className="col-lg-12">
																	{ this.state.ListOfPages ?
																		this.state.ListOfPages.map((result, index)=>{
																			return(
																	    		<option value="" key={index}>{result.pageTitle}</option>
																	    		);
																		})
																		:
																		""
																	}

																	</select>
																</div>
															</div> */ }
						                				</div>
									                		{
																this.state.ListOfBlocks && this.state.ListOfBlocks.length>0?
																	this.state.ListOfBlocks.map((result, index)=>{
																		console.log("========result in viewpage 2=============",result);

																	/*	var component = result.blockComponentName ? result.blockComponentName : 'Block1Sample';
																		const NewPageComponent = React.lazy(() => import('../blockComponent/'+component+'.js'));*/	
																	var component = result.blockComponentName ? result.blockComponentName : 'Typecomponent1';
																	const NewPageComponent = React.lazy(() => import('../blockTemplate/'+component+'/'+component+'.js'));
																	var block_id=result._id;
																		// console.log("block_id",block_id);
																	return(
												                			<div key={index} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectDiv1 designList">
												                				<div className="checkbox">
																			        <label>
																			        	<input type="checkbox" className="pull-right" onChange={this.handleChange.bind(this)} data_id={block_id}/> Select Multiple Blocks
																			        </label>
								                            						<button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right AddBlockbtn" onClick={this.addBlock.bind(this)} id={block_id} >Add Block</button>
																			    </div>
																				<Suspense fallback={<div>Loading...</div>} key={index}>
																		    		<NewPageComponent block_id={block_id}/>
																		    	</Suspense>
																		    </div>	
																	    	)
																		})
																	:
																	null
																}	
															<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
									                            <button  type="submit" className="col-lg-3 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn AddBlockbtn" onClick={() => this.submitData()} >Add Multiple Blocks</button>
									                        </div>			
													</div> 
										       	</div>
											</div>
										</section>	
										:
										null
									}
								</div>
							</div>
						</div>
					</div>

					{/*<!-- Modal -->*/}
					<div id="editBlockFormM" className="modal" role="dialog">
					 	<div className="modal-dialog modal-lg">
					    {/*<!-- Modal content-->*/}
					    	<div className="modal-content">
						        <div className="modal-header">
							        <button type="button" className="close" data-dismiss="modal">&times;</button>
							        <h4 className="modal-title">Edit Block</h4>
						      	</div>
						     	<div className="modal-body">
						      		{/*console.log("in modal",this.state.block_id)*/}
						        	<CmsBlock block_id={this.state.block_id}/>
						      	</div>
						      	<div className="modal-footer">
						        	<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						      	</div>
					    	</div>
					    </div>
					</div>
				</div> 
        );
    }
}

export default withRouter(Viewpage);