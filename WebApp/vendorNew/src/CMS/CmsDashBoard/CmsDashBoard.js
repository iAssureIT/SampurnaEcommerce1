import React from 'react';
import './CmsDashBoard.css';
import axios from 'axios';

export default class CmsDashBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {


			"ListOfPagest"		:"",
			"noOfPages"			:"",
			"noOfBlocks"			:"",
			"noOfBlogs"			:"",


		};
	}


	componentDidMount(){
		
		    
		this.getListOfPages();
		this.getListOfBlocks();
		this.getListOfBlogs();

	}
	getListOfPages(){
	/*/get/list*/
		axios
			.get('/api/pages/get/list')
			.then((response)=>{    
				console.log("response",response.data.length);    
			      	this.setState({
		      			ListOfPages:response.data,
		      			noOfPages : response.data.length
		      		});
				})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
	}
	ListOfPagesBTn (){
                    this.props.history.push("/cms/create-new-page");

	}
	getListOfBlocks(){
	/*/get/list*/
		axios
			.get('/api/blocks/get/list')
			.then((response)=>{    
				console.log("response",response.data.length);    
			      	this.setState({
		      			
		      			noOfBlocks : response.data.length
		      		});
				})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
	}

	getListOfBlogs(){
	/*/get/list*/
		axios
			.get('/api/blogs/get/all/list')
			.then((response)=>{    
				console.log("response",response.data.length);    
			      	this.setState({
		      			
		      			noOfBlogs : response.data.length
		      		});
				})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
	}

	render() {
		return (
			<div>
				<div className="App container-fluid" >
                    <div className="row" >
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bfcolrefefef" >
                        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtop15bgclrwht" >
                        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                        			<h2>Dashboard
                        			</h2>
                        		</div>
                        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
	                        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxItem1">
	                        			<p className="fs30">
	                        				Welcome to iAssureIT CMS
	                        			</p>
	                        			<p className="fs20">
	                        				We've assembled some Links to get you started:
	                        			</p>
	                        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" >
	                        				<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 NOpadding" >
	                        					<div className="fs20 mtop10">Get Started
	                        					</div>
	                        					<button type="button" className="btn btn-primary col-lg-8 col-md-8 col-sm-8 col-xs-8 custBtn NOpadding">Customized your site</button>
			                        			<br/>
			                        			
	                        				</div>
	                        				<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4" >
	                        					<div className="f20s mtop10">Next step</div>

	                        					<div className="fs14">
	                        						<a href='/cms/create-new-page' data-toggle="tooltip" title="Click here Create new page">
	                        							<i className="fa fa-plus w20px"></i> &nbsp;&nbsp;Create new page
	                        						</a>
	                        					</div>
	                        					<div className="fs14"> <i className="fa fa-edit w20px"></i> &nbsp;&nbsp;Write your first blog post</div>
	                        					<div className="fs14">
	                        						<i className="fa fa-desktop w20px"></i> &nbsp;&nbsp;View your site
	                        					</div>
	                        				</div>
	                        				<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4" >
	                        					<div className="f20s mtop10">More actions
	                        					</div>

	                        					<div className="fs14"><i className="fa fa-file w20px"></i> &nbsp;&nbsp; Manage your widgets or menu</div>
	                        					<div className="fs14"><i className="fa fa-comment w20px"></i> &nbsp;&nbsp; Turn comments On or Off</div>
	                        					<div className="fs14"><i className="fa fa-graduation-cap w20px"></i> &nbsp;&nbsp; Learn more about getting started</div>
	                        			
	                        				</div>

	                        			</div>

									</div>
								</div>

								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
	                        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxItem2">
	                        			<div className="mtopleft30">
	                        				<h4><b>Website at a Glance</b></h4>
	                        			</div>
	                        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" >
	                        				<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 " >
	                        					<h4 className="f20s mtop10 col-lg-12 col-md-12 col-sm-12 col-xs-12">Pages
	                        					</h4>
	                        					<div className="fs14 col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        						<div className="fontawBox col-lg-2 col-md-2 col-sm-4 col-xs-4 NOpadding">
	                        							<i className="fa fa-plus marAlltop7 fs16"></i>   
	                        						</div>
	                        						<a href="/cms/create-new-page">
	                        							<div className="col-lg-10 col-md-10 col-sm-8 col-xs-8 marAlltop7">Create New Page</div>
	                        						</a>
	                        					</div>
	                        					<div className="fs14 col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
	                        						<div className="fontawBox col-lg-2 col-md-2 col-sm-4 col-xs-4 NOpadding" >
	                        						<i className="fa fa-file marAlltop7 fs16"></i>   
	                        						</div><div className="col-lg-10 col-md-10 col-sm-8 col-xs-8 marAlltop7 colr55a2de"> {this.state.noOfPages} Pages</div>
	                        					</div>
	                        					<div className="fs14 col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        						<div className="fontawBox col-lg-2 col-md-2 col-sm-4 col-xs-4 NOpadding">
	                        						<i className="fa fa-table marAlltop7 fs16"></i>   
	                        						</div>
	                        						<a href="/cms/select-new-block">
	                        							<div className="col-lg-10 col-md-10 col-sm-8 col-xs-8 marAlltop7">Creat New Block</div>
	                        						</a>
	                        					</div>
	                        					<div className="fs14 col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        						<div className="fontawBox col-lg-2 col-md-2 col-sm-4 col-xs-4 NOpadding">
	                        						<i className="fa fa-object-group marAlltop7 fs16"></i>   
	                        						</div><div className="col-lg-10 col-md-10 col-sm-8 col-xs-8 marAlltop7 colr55a2de"> {this.state.noOfBlocks} Blocks</div>
	                        					</div>
	                        					
			                        			
	                        				</div>
	                        				<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4" >
	                        					<h4 className="f20s mtop10 col-lg-12 col-md-12 col-sm-12 col-xs-12">Blogs</h4>
												<div className="fs14 col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        						<div className="fontawBox col-lg-2 col-md-2 col-sm-4 col-xs-4 NOpadding">
	                        						<i className="fa fa-file marAlltop7 fs16"></i>   
	                        						</div><div className="col-lg-10 col-md-10 col-sm-8 col-xs-8 marAlltop7"> {this.state.noOfBlogs} Blogs</div>
	                        					</div>
	                        					<div className="fs14 col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        						<div className="fontawBox col-lg-2 col-md-2 col-sm-4 col-xs-4 NOpadding">
	                        						<i className="fa fa-comment marAlltop7 fs16"></i>   
	                        						</div><div className="col-lg-10 col-md-10 col-sm-8 col-xs-8 marAlltop7"> {this.state.noOfBlogs} Comments</div>
	                        					</div>
	                        				</div>
	                        				<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4" >
	                        					<h4 className="f20s mtop10 col-lg-12 col-md-12 col-sm-12 col-xs-12">Job Management
	                        					</h4>

	                        					<div className="fs14 col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        						<div className="fontawBox col-lg-2 col-md-2 col-sm-4 col-xs-4 NOpadding" >
	                        						<i className="fa fa-briefcase marAlltop7 fs16"></i>   
	                        						</div><div className="col-lg-10 col-md-10 col-sm-8 col-xs-8 marAlltop7"> 09 Active Jobs</div>
	                        					</div>
	                        					<div className="fs14 col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        						<div className="fontawBox col-lg-2 col-md-2 col-sm-4 col-xs-4 NOpadding">
	                        						<i className="fa fa-briefcase marAlltop7 fs16"></i>   
	                        						</div><div className="col-lg-10 col-md-10 col-sm-8 col-xs-8 marAlltop7">15 Total Jobs</div>
	                        					</div>
	                        					<div className="fs14 col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        						<div className="fontawBox col-lg-2 col-md-2 col-sm-4 col-xs-4 NOpadding">
	                        						<i className="fa fa-wpforms marAlltop7 fs16"></i>   
	                        						</div><div className="col-lg-10 col-md-10 col-sm-8 col-xs-8 marAlltop7">60 Applicants</div>
	                        					</div>
	                        				</div>

	                        			</div>
	                        			
	                        			
									</div>
								</div>
                        		<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 " >
	                        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxItem3 NOpadding" >
	                        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        				<h4 className="col-lg-5 col-md-5 col-sm-4 col-xs-4 pdtop9px"><b>List of Pages</b></h4>
	                        				<button type="button" className="boxshadow1px btn btn-default pull-right col-lg-2 col-md-2 col-sm-4 col-xs-4 " onClick={this.ListOfPagesBTn.bind(this)}>View All</button>
	                        			</div>
	                        			<div>
	                        				 <table className="table table-striped ">
												    <thead className="backclrgray">
												      <tr>
												        <th>Page Type</th>
												        <th>Sub Page Type</th>
												       
												      </tr>
												    </thead>
												    <tbody>
												      <tr>
												        <td>Special</td>
												        <td className="colr55a2de">Home Page</td>
												     
												      </tr>
												      <tr>
												        <td>About</td>
												        <td className="colr55a2de"> About Us<br/>Mission Vision<br/>Our Team</td>
												        
												      </tr>
												      <tr>
												        <td>Services</td>
												        <td className="colr55a2de">Service1<br/>Service2</td>
												        
												      </tr>
												    </tbody>
											 </table>
	                        			</div>

                        			</div>
								</div>

								<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 " >
	                        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxItem3 NOpadding" >
	                        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                        				<h4 className="col-lg-5 col-md-5 col-sm-4 col-xs-4 pdtop9px"><b>List of Blogs</b></h4>
	                        				<button type="button" className="boxshadow1px btn btn-default pull-right col-lg-2 col-md-2 col-sm-4 col-xs-4 ">View All</button>
	                        			</div>
	                        			<div>
	                        				 <table className="table table-striped ">
												    <thead className="backclrgray">
												      <tr>
												        <th>Blog Title</th>
												        <th>Comments</th>
												       
												      </tr>
												    </thead>
												    <tbody className="colr55a2de">
												      <tr>
												        <td>Blog-1</td>
												        <td className="colr55a2de">12</td>
												     
												      </tr>
												      <tr>
												        <td>Blog-2</td>
												        <td className="colr55a2de">06</td>
												        
												      </tr>
												      <tr>
												        <td>Blog-3</td>
												        <td className="colr55a2de">15</td>
												        
												      </tr>
												    </tbody>
											 </table>
	                        			</div>

                        			</div>
								</div>


                        	


							
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


/*

<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12  " >
                        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxItem2" >
	                        			<div className="fs20 mtop10">At a Glance</div><hr/>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  "><i className="fa fa-file"></i> &nbsp;&nbsp; {this.state.noOfBlocks} Blocks</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  "><i className="fa fa-file"></i> &nbsp;&nbsp; {this.state.noOfPages} Pages</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  "><i className="fa fa-comment"></i> &nbsp;&nbsp; {this.state.noOfBlogs} Blog Posts</div>



                        			</div>
                        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxItem2" >
	                        			<div className="fs20 mtop10">Activity</div><hr/>
	                        			<div className="fs20 mtop10">Recently published</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  ">Oct 11, 10.04 AM</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  ">Lorem Ipsum</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  ">Oct 11, 10.04 AM</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  ">Lorem Ipsum</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  ">Oct 11, 10.04 AM</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  ">Lorem Ipsum</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  ">Oct 11, 10.04 AM</div>
	                        			<div className="fs14 col-lg-6 col-md-6 col-sm-12 col-xs-12  ">Lorem Ipsum</div>
	                        			



                        			</div>
                        			
	                        	</div>
	                        	<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 " >
	                        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxItem3" >
	                        			{/*<div className="fs20 mtop10">Quick draft</div><hr/>
	                        			<form>
										    <div className="form-group">
											    <label for="formGroupExampleInput">Title </label>
											    <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Title input"/>
											</div>
											<div className="form-group">
											    <label for="formGroupExampleInput2">Description</label>
											    <textarea type="text" className="form-control" row="5" id="formGroupExampleInput2" placeholder="Description input"/>
											</div>
											<button className="btn btn-primary" type="submit">Draft</button>
										</form>
										<div className="line5"></div>
                        			</div>
	                        			<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxItem-LOPages">
											<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
												<h2>List Of Pages</h2>
											</div>
											<hr/>
											<div className="">
										
												<table className="table fs14T">
												  	<thead className="thead-dark">
												    	<tr className="">
													      <th scope="col">No.</th>
													      <th scope="col">Page Title</th>
													    
													      {/*<th scope="col">Actions</th>
												    	</tr>
												  	</thead>
												    <tbody className="h250overflwscroll">
												    {
												    	this.state.ListOfPages 
															?
															this.state.ListOfPages && this.state.ListOfPages.length>0?
																this.state.ListOfPages.map((result, index)=>{
																	// console.log('result', result);
																	return(
																	    <tr key={index}>
																	      <td>{index+1}</td>
																	      <td >{result.pageTitle}</td>
																	      {/*<td id={result.pageURL} className="onHoverClick" onClick={this.urlPage.bind(this)} data-placement="top" title="Click here to view Page">{result.pageURL}</td>
																	      <td><i className="fa fa-edit deletIcon" id={result.pageURL} data-toggle="collapse" data-toggle="modal" data-target="#createnewPageModal" onClick={this.editPage.bind(this)} data-placement="top" title="Edit Page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
																	      																      		<i className="fa fa-trash deletIcon" id={result.pageURL} onClick={this.deletePage.bind(this)} data-placement="top" title="Delete page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
																	      																      		<i className="fa fa-eye"  id={result.pageURL} onClick={this.urlPage.bind(this)}></i>
																	      																      </td>
																	    </tr>
																    	)
																	})
																:
																null
													    	:
															null
													}   
												    </tbody>
												</table>
											</div>
										</div>
									</div>
                        		
	                        	</div>

*/