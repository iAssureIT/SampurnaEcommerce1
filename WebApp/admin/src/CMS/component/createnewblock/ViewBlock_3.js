import React, { Component, Suspense } from 'react';

import {Route, withRouter} from 'react-router-dom';
import swal from 'sweetalert';

import axios        from 'axios';
import CircleBlockMenuBars from './circleblockmenubars.js';


// this._isMounted = false;
export default class ViewBlock_3 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageData 	 		: {},
			Blocks 		 		: [],
			blocks 		 		: "",
			pageType 	 	 	: "",
			blockType 	 	 	: "",
			ListOfPages  	 	: "",
			ListOfBlockTypes 	: "",
			ListOfBlocks 	 	: "",
			ListOfpages  	 	: ""
		}; 
	}

	getAllBlockList(pageType){
		// console.log("pageTypepageType=>",pageType);
		axios
        .get('/api/blocks/get/list')
        .then((response)=>{
				// console.log("AllBloks=",response.data);
				var scomp = response.data.find(({ pageTypes }) => pageTypes === pageType );
				// console.log("scomp=",scomp);

						      	this.setState({
					      			ListOfBlocks:response.data
					      		},()=>{
					      				// console.log("======>",this.state.ListOfBlocks);
					      		});
					      	})
			  	.catch(function (error) {
			    // handle error
			    	console.log(error);
			  	});

			axios
				.get('/api/pages/get/list')
				.then((response)=>{
						        // console.log("AllBlogs=",response.data);
						      	this.setState({
					      			ListOfpages:response.data
					      		},()=>{
					      				// console.log("======>",this.state.ListOfBlocks);
					      		});
					      	})
			  	.catch(function (error) {
			    // handle error
			    	console.log(error);
			  	});

	}
	componentDidMount(){
	 // this._isMounted = true;
		var pageUrl = window.location.pathname;;
		// console.log("pageUrl = ",pageUrl);
		let a = pageUrl ? pageUrl.split('/') : "";
        // console.log("a==>",a[1]); 
        const urlParam =a[1];
        // console.log("urlParam  === ",urlParam);
        this.getAllBlockList();
        this.getListOfPageType();
        this.getListOfBlockType();

	}


	getListOfPageType(){
	    axios
	      // .get('/api/pages/get/list')
	      .get('/api/typemaster/get/list')     
	      .then((response)=>{    
	        // console.log("response",response.data);    
	              this.setState({
	                ListOfPages:response.data
	              },()=>{
	                // console.log("ListOfPageslll==ll",this.state.ListOfPages);
	              });
	        })
	        .catch(function (error) {
	        // handle error
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

	selectpageType(event){
	    event.preventDefault();
	    // console.log("this.refs.pageType.value==ll",this.refs.pageType.value);
	    // console.log("this.refs.blockType.value==ll",this.refs.blockType.value);
	   
	    if (this.refs.pageType.value != "--Select Page type--" ) {
	    		// console.log("im in if this.refs.pageType.value==ll",this.refs.pageType.value);

	    	var data ={ 
	    		pagetype  : this.refs.pageType.value,
	    	}
	    	axios.post('/api/blocks/post/pagetype',data)
					.then((res) => {
						console.log("res",res);
						 this.setState({
					      			ListOfBlocks:res.data
							      					      
						      });

						})
					.catch((error) => {
						console.log("errr",error);
					});
	    	// const pageType = event.target.value;
		

	    }
	   else   if (this.refs.pageType.value != "--Select Page type--" && this.refs.blockType.value != "--Select Page type--") {
	   			 // console.log("this.reffghjkl=========.value==ll",this.refs.pageType.value);
	    		
	    		var data ={ 
	    			pagetype  : this.refs.pageType.value,
	    			blocktype : this.refs.blockType.value

	    		}
	    		axios.post('/api/blocks/post/pageblocktype',data)
					.then((res) => {
						// console.log("pageType & blockType",res);
						 this.setState({
					      			ListOfBlocks:res.data
							      					      
						      });

						})
					.catch((error) => {
						console.log("errr",error);
					});
	    }
	    
	    this.setState({
	          
	      /*"cmspageDescription"      : this.refs.cmspageDescription.value,*/
	      "pageType"            : this.refs.pageType.value,
	      
	      });
	}
	selectblockType(event){
	    event.preventDefault();
	    if ( this.refs.blockType.value != "--Select Page type--" ) {

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

	    }else if (this.refs.pageType.value != "--Select Page type--" && this.refs.blockType.value != "--Select Page type--") {
	    		var data ={ 
	    			pagetype  : this.refs.pageType.value,
	    			blocktype : this.refs.blockType.value

	    		}
	    		axios.post('/api/blocks/post/pageblocktype',data)
					.then((res) => {
						// console.log("res",res);
						 this.setState({
					      			ListOfBlocks:res.data
							      					      
						      });

						})
					.catch((error) => {
						console.log("errr",error);
					});
	    }
		    




	    this.setState({
	          
	      /*"cmspageDescription"      : this.refs.cmspageDescription.value,*/
	      "blockType"            : this.refs.blockType.value,
	      
	      });
	}
	
	deleteblock(event){
		event.preventDefault();
		var URL= event.target.id;
		var idArray =[];
		// console.log("ListOfpages", this.state.ListOfpages );

		let filteredBlocks = this.state.ListOfpages.filter( function (user) {
			return user.pageBlocks.filter((child)=>{
				if(URL === child.block_id){idArray.push(child._id)}
				return URL === child.block_id
			}).length !== 0
	       
	    });
	    //console.log('idArray',idArray);
	    // console.log('filteredBlocks',filteredBlocks);
	    var titleArray = [];
	    filteredBlocks.map((data,index)=>{
	    	titleArray.push(data.pageTitle);
	    })
	    var urlArray = [];
	    filteredBlocks.map((data,index)=>{
	    	urlArray.push(data.pageURL);
	    })
	    var deleteValues ={
		      "pageBlocks_id":idArray[0]
				}

	    //console.log('titleArray',titleArray)
	    
	    if (filteredBlocks.length>0) {
	    	swal({
		          title: "You can not delete this block as it is present in following pages",
		          text: "* "+titleArray.join(', '),
		          buttons: true,
		          dangerMode: true,
		          // icon: "warning",
		        })
	    		.then((success) => {

			            if (success) {
			            	axios
						    .patch('/api/pages/patch/blocks/remove/'+urlArray[0],deleteValues)
						    .then((response)=>{
						     	// this.getListOfPages();
						     	swal({
							          title: "Are you sure you want to delete this Block",
							          text: "..",
							          icon: "warning",
							          buttons: true,
							          dangerMode: true,
							        })
						    		.then((success) => {
										axios
										   .delete("/api/blocks/delete/"+URL)
										   .then((response)=>{
										    // this.getListOfPages();
										      swal("","Your block is deleted");
        										this.getAllBlockList();
										      
										   })
										   .catch((error)=>{
										      console.log("error = ", error);              
										   });
										// swal("Your block is deleted from page ");
						    			});
						    		 
						       	 
						    })
						    .catch((error)=>{
						       console.log("error = ", error);              
						    });

			           
			           
			             
			            } else {
			            swal("Your Block is safe!");
			          }
			        });
	    	}
	    	else{
	    	swal({
		          title: "Are you sure you want to delete this Block is present in some pages?",
		          text: "Once deleted, you will not be able to recover this Block!",
		          buttons: true,
		          dangerMode: true,
		        })
	    	.then((success) => {

		            if (success) {
		            axios
					   .delete("/api/blocks/delete/"+URL)
					   .then((response)=>{
					    // this.getListOfPages();
					    this.getAllBlockList();
					      swal("Your block is deleted!");
					     
					   })
					   .catch((error)=>{
					      console.log("error = ", error);              
					   });
		           
		             
		            } else {
		            swal("","Your Block is safe!");
		          }
		        });
		
	    	}

	}

	render() {
			var data= this.state.pageData;

			return (
				<div className="contentWrapper">
						<div className="">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
								
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bglightgclr">
									<CircleBlockMenuBars />
								</div>
								<div className=" txtCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
									<div className="  col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
		                                <h2 className="text-center"> All Blocks</h2>
		                            </div>
		                        </div>
		                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
			                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
			                            <div className="form-group m3all" id="pageType">
			                                <div className="form-group">
			                                  <label className="label-category lb666 labelform">Select Page type of block</label>
			                                  <select className="form-control hinput30" id="pageType"  value={this.state.pageType} ref="pageType" name="pageType"  onChange={this.selectpageType.bind(this)}>
			                                      <option  hidden>--Select Page type--</option>
			                                        { this.state.ListOfPages  && this.state.ListOfPages.length 
			                                          ?
			                                            this.state.ListOfPages.map((result,index)=>{
			                                             
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
			                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
			                            <div className="form-group m3all" id="pageType">
			                                <div className="form-group">
			                                    <label className="label-category lb666 labelform">Select Block Type </label>
			                                    <select className="form-control hinput30" id="blockType"  value={this.state.blockType} ref="blockType" name="blockType"  onChange={this.selectblockType.bind(this)}>
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
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
									{
										this.state.ListOfBlocks && this.state.ListOfBlocks.length> 0
										?
											this.state.ListOfBlocks.map((result, index)=>{
												var component = result.blockComponentName ? result.blockComponentName : "Typecomponent1";
												console.log("component",component);
												const NewPageComponent = React.lazy(() => import('../blockTemplate/'+component+'/'+component+'.js'));
												var block_id=result._id;
												return(
													<Suspense fallback={<div>Loading...</div>} key={index}>
														<div className="">
															<i className="fa fa-trash deletIcon pull-right fsm15" id={block_id} onClick={this.deleteblock.bind(this)}></i>&nbsp;&nbsp;&nbsp;&nbsp;
														</div>
															<br/>
											    		<NewPageComponent block_id={block_id}/>
											    	</Suspense>
										    	)
											})
										:
										<img className="img-responsive middlPageImage" src="/images/loading.gif" alt="Bannerpng"/>
										
									}
								</div>
							</div>
						</div>
					</div>
			);
		}
	}
