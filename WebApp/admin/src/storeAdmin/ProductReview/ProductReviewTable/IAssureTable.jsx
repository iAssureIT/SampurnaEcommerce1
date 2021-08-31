import React, { Component }       	from 'react';
import {withRouter} 			from 'react-router-dom';
import swal                   from 'sweetalert2';
import axios 						from 'axios';
import $ 							from 'jquery';
import jQuery 						from 'jquery';
import './IAssureTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';

const swalWithBootstrapButtons = swal.mixin({
  	customClass : {
   	confirmButton 	: 'btn btn-success',
    	cancelButton 	: 'btn btn-danger'
  	},
  	buttonsStyling : false
})

class IAssureTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			"dataCount" 				: props.dataCount,
			"tableData" 				: props && props.tableData ? props.tableData : [],
			"tableHeading"				: props && props.tableHeading ? props.tableHeading : {},
			"twoLevelHeader" 			: props && props.twoLevelHeader ? props.twoLevelHeader : {},
			"tableObjects" 			: props && props.tableObjects ? props.tableObjects : {},		    
			isLoading               : props.isLoading,
			"reA" 						: /[^a-zA-Z]/g,
			"reN" 						: /[^0-9]/g,
			"sort" 	  					: true,
			"examMasterData2" 		: '',
			"paginationArray" 		: [],
			"startRange" 				: 0,
			"limitRange" 				: 10,
			"activeClass" 				: 'activeCircle', 		    
			"normalData" 				: true,
			"callPage" 					: true,
			"pageCount" 				: 0,
			"valI" 						: 1,
		}
		this.delete = this.delete.bind(this);
	}
	componentDidMount() {
	  $("html,body").scrollTop(0); 
	  console.log('com');
      this.setState({
      	tableHeading	: this.props.tableHeading,
      	tableData 		: this.props.tableData,
      	dataCount 		: this.props.dataCount,
      	isLoading      : this.props.isLoading,
      },()=>{
      	this.paginationFunction();
      });
	}
	componentWillReceiveProps(nextProps) {
		if(this.state.callPage === true){
        	this.paginationFunction();
      }

		this.setState({
		   tableData	   : nextProps.tableData,
		   dataCount 		: nextProps.dataCount,
		   isLoading      : nextProps.isLoading,
		},()=>{
			this.paginationFunction();
		}) 
   }

	edit(event){
		event.preventDefault();
		$("html,body").scrollTop(0);
		var tableObjects =  this.props.tableObjects;
		var id = event.target.id;
		this.props.history.push(tableObjects.editUrl+id);
	}
    delete(e){
	  	e.preventDefault();
	  	var tableObjects =  this.props.tableObjects;
		var id = e.target.id;
		swalWithBootstrapButtons.fire({
		  	title 				: 'Are you sure?',
		  	text 					: "You won't be able to revert this!",
		  	icon 					: 'warning',
		  	showCancelButton 	: true,
		  	confirmButtonText : 'Yes, delete it!',
		  	cancelButtonText 	: 'No, cancel!',
		  	reverseButtons 	: true
		}).then((result) => {
			if (result.isConfirmed) {
				axios({
			        method: tableObjects.deleteMethod,
			        url: tableObjects.apiLink+'/delete/'+id
			    }).then((response)=> {
			    	console.log("response => ",response.data)
			    	this.props.getData(this.state.startRange, this.state.limitRange);
			        
			        swalWithBootstrapButtons.fire(
					      response.data.deleted ? 'Deleted!' : "Sorry!",
					      response.data.message,
					      response.data.deleted ? 'success' : 'info'
				    	)
			    }).catch(function (error) {
			        console.log('error', error);
						swal.fire({
						  icon 	: 'error',
						  title 	: 'Oops...',
						  text 	: 'Something went wrong!'
						})
					});	
			}else if (result.dismiss === swal.DismissReason.cancel) {
			   swalWithBootstrapButtons.fire(
			      'Cancelled',
			      'Your record is safe :)',
			      'info'
			   )
			}
		})
    } 
    sortNumber(key, tableData){
    	var nameA = '';
    	var nameB = '';
    	var reA = /[^a-zA-Z]/g;
		var reN = /[^0-9]/g;
		var aN = 0;
		var bN = 0;
		var sortedData = tableData.sort((a, b)=> {
    		Object.entries(a).map( 
				([key1, value1], i)=> {
					if(key === key1){
						nameA = value1.replace(reA, "");				
					}
				}
			);
			Object.entries(b).map( 
				([key2, value2], i)=> {
					if(key === key2){
						nameB = value2.replace(reA, "");
					}
				}
			);
			if(this.state.sort === true){
				this.setState({
					sort 	  : false
				})
				if (nameA === nameB) {
					Object.entries(a).map( 
						([key1, value1], i)=> {
							if(key === key1){
								aN = parseInt(value1.replace(reN, ""), 10);				
							}
						}
					);
					
					Object.entries(b).map( 
						([key1, value1], i)=> {
							if(key === key1){
								bN = parseInt(value1.replace(reN, ""), 10);					
							}
						}
					);

					if (aN < bN) {
						return -1;
					}
					if (aN > bN) {
						return 1;
					}
					return 0;

				} else {

					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				}
			}else if(this.state.sort === false){
				this.setState({
					sort 	  : true
				})
				if (nameA === nameB) {
					Object.entries(a).map( 
						([key1, value1], i)=> {
							if(key === key1){
								aN = parseInt(value1.replace(reN, ""), 10);			
							}
						}
					);
					
					Object.entries(b).map( 
						([key1, value1], i)=> {
							if(key === key1){
								bN = parseInt(value1.replace(reN, ""), 10);					
							}
						}
					);

					if (aN > bN) {
						return -1;
					}
					if (aN < bN) {
						return 1;
					}
					return 0;

				} else {

					if (nameA > nameB) {
						return -1;
					}
					if (nameA < nameB) {
						return 1;
					}
					return 0;
				}
			}				
		});
		this.setState({
			tableData : sortedData,
		});
    }
    sortString(key, tableData){
    	var nameA = '';
    	var nameB = '';
    	var sortedData = tableData.sort((a, b)=> {
		Object.entries(a).map( 
			([key1, value1], i)=> {
				if(key === key1){
					if(jQuery.type( value1 ) === 'string'){
						nameA = value1.toUpperCase();
					}else{
						nameA = value1;
					}						
				}
			}
		);
		Object.entries(b).map( 
			([key2, value2], i)=> {
				if(key === key2){
					if(jQuery.type( value2 ) === 'string'){
						nameB = value2.toUpperCase();
					}else{
						nameB = value2;
					}	
				}
			}
		);
			if(this.state.sort === true){	
				this.setState({
					sort 	  : false
				})		
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			}else if(this.state.sort === false){
				this.setState({
					sort 	  : true
				})	
				if (nameA > nameB) {
					return -1;
				}
				if (nameA < nameB) {
					return 1;
				}
				return 0;
			}
		});
		this.setState({
			tableData : sortedData,
		});
    }
    sort(event){
    	event.preventDefault();
    	var key = event.target.getAttribute('id');
    	var tableData = this.state.tableData;
		if(key === 'number'){
			this.sortNumber(key, tableData);
		}else{
			this.sortString(key, tableData);
		}
    }
   /*===========  ===========*/
   paginationFunction(){
		var dataLength = this.state.dataCount;
		// console.log("dataLength => ",dataLength)
		const maxRowsPerPage = this.state.limitRange;
		// console.log("maxRowsPerPage 299=> ",maxRowsPerPage)
		var paginationNum = dataLength/maxRowsPerPage;
		// console.log("paginationNum 301 => ",paginationNum)
		var pageCount = Math.ceil(paginationNum) > 20 ? 20 : Math.ceil(paginationNum);
		// console.log("Math.ceil(paginationNum)",Math.ceil(paginationNum))
		// console.log("pageCount 306 => ",pageCount)
		this.setState({
			valI 			: 1,
			pageCount 	: pageCount,
			// callPage : false
		},()=>{
			// console.log("pageCount 308=> ",this.state.pageCount)
			this.showPagination(1, this.state.pageCount);		
		})
	}

	/*===========  ===========*/
	showPagination(valI, pageCount){
		// console.log("pageCount ==> 309",pageCount)
		// console.log("val I ==> 309",valI)
		var paginationArray = [];

		for (var i = valI; i <= pageCount; i++){
			var countNum 	= this.state.limitRange * i;
			var startRange = countNum - this.state.limitRange;
			// console.log("this.state.limitRange ==> ",this.state.limitRange)
			// console.log("countNum ==> ",countNum)
			// console.log("startRange ==> ",startRange)
			// console.log("i ==>",i)
			if(i === 1){
				var activeClass = 'activeCircle';
			}else{
				activeClass = '';
			}
			paginationArray.push(
				<li key={i} className={"queDataCircle page-link "+activeClass+" parseIntagination"+i} id={this.state.limitRange+'|'+startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on "+i+ " page"}>{i}</li>
			);
		}

		if(pageCount>=1){				
			this.setState({
				paginationArray : paginationArray,
			},()=>{
				// console.log("paginationArray 326 ==> ",this.state.paginationArray)
			});
		}
		return paginationArray;
	}

	getStartEndNum(event){	
		event.preventDefault();
		var limitRange = $(event.target).attr('id').split('|')[0];
		var limitRange2     = parseInt(limitRange);
		var startRange = parseInt($(event.target).attr('id').split('|')[1]);
		this.props.getData(startRange, limitRange);
		this.setState({
			startRange:startRange,
			limitRange:limitRange,
			callPage : false
		});
		$('li').removeClass('activeCircle');
		$(event.target).addClass('activeCircle');
		var counter = $(event.target).text();
	}
	setLimit(event){
		event.preventDefault();
		var limitRange = parseInt(this.refs.limitRange.value);
		var startRange = 0;
		this.setState({
			"limitRange":limitRange,
			"startRange":0

		},()=>{
			$('li').removeClass('activeCircle');
			this.paginationFunction();
			this.props.getData(startRange, this.state.limitRange);
		});	
	}
	tableSearch(event){
    	this.props.getSearchText(event.target.value);   	 
   }
    showNextPaginationButtons(){
    	var dataLength = this.state.dataCount;
		const maxRowsPerPage = this.state.limitRange;
		var paginationNum = dataLength/maxRowsPerPage;
		var pageCount = Math.ceil(paginationNum);

		var addInValI = this.state.valI+20;
		var addInPageCount = this.state.pageCount+20 > pageCount ? (pageCount) : this.state.pageCount+20;

		this.setState({
			valI 		: addInValI,
			pageCount 	: addInPageCount
		},()=>{

			this.showPagination(this.state.valI, this.state.pageCount);
		})
    }
    showPreviousPaginationButtons(){
    	var dataLength = this.state.dataCount;
		const maxRowsPerPage = this.state.limitRange;
		var paginationNum = dataLength/maxRowsPerPage;
		var pageCount = Math.ceil(paginationNum);

		var subFromValI = this.state.valI-20 < 1 ? 1 : this.state.valI-20;
		// var subFromPageCount = this.state.pageCount-20 < 20 ? 20 : this.state.pageCount-20 ;
		var subFromPageCount = subFromValI+19 ;

		this.setState({
			valI 		: subFromValI,
			pageCount 	: subFromPageCount
		},()=>{

			this.showPagination(this.state.valI, this.state.pageCount);
		})
    }
    showFirstTweentyButtons(){
		this.setState({
			valI 		: 1,
			pageCount 	: 20
		},()=>{
			this.showPagination(this.state.valI, this.state.pageCount);
		})
    }
    showLastTweentyButtons(){
    	var dataLength = this.state.dataCount;
		const maxRowsPerPage = this.state.limitRange;
		var paginationNum = dataLength/maxRowsPerPage;
		var pageCount = Math.ceil(paginationNum);

		this.setState({
			valI 		: pageCount-19,
			pageCount 	: pageCount
		},()=>{
			
			this.showPagination(this.state.valI, this.state.pageCount);
		})
    }
    changeAttribute(event){
		event.preventDefault();
		console.log('this', this.state.startRange, this.state.limitRange);
		var attribute = event.target.getAttribute('data-attribute');
    	var attributeValue = event.target.getAttribute('data-attributeValue');
        var product_ID  = event.currentTarget.getAttribute('data-ID');
		console.log('attribute', attribute, attributeValue, product_ID);
        if(product_ID){
            if(attributeValue=="true"){
                attributeValue = false;
            } else {
                attributeValue = true;
            }
            var data = {
				attribute   : attribute,
				attributeValue : attributeValue,
	        	product_ID : product_ID
	        }
            axios.put('/api/products/attribute', data)
			.then((response)=>{
				console.log('this', this.state.startRange, this.state.limitRange);
			  this.props.getData(this.state.startRange, this.state.limitRange);
			})
			.catch((error)=>{
			  console.log('error', error);
			})
        }
    }
    changeStatusOfProd(event){
    	var status = event.target.getAttribute('data-status');
        var review_ID = event.target.getAttribute('data-ID');
        if(status === "Publish" && review_ID){
            var changingStat = "Unpublish";
        }else {
            var changingStat = "Publish";
        }
        var data = {
        	status : changingStat,
        	review_ID : review_ID
        }
        axios.put('/api/customerReview/status', data)
        .then((response)=>{
        	this.props.getData(this.state.startRange, this.state.limitRange);
        	swal({
                title: 'Review '+changingStat+'ed Successfully',
            });
        })
        .catch((error)=>{

        });
	}
	getProductDetail(productID){
		console.log('prod', productID);
		axios.get('/api/products/get/one/'+productID)
		.then((response)=>{
			console.log('res', response);
			this.setState({
				productData : response.data
			});
			return <p>nkhbhjb</p>
		})
		.catch((error)=>{
			console.log('error', error);
		})
	}
	submitReview(event){
		var formValues = {
			rating_ID 		: event.target.id,
			adminComment 	: this.state.adminComment
		}
		console.log('adminComment', formValues);
		axios.patch('/api/customerReview/admin/review', formValues)
		.then((response)=>{
			swal(response.data.message);
		})
		.catch((error)=>{
			console.log('error', error);
		})
	}
	handleChange(event){
		this.setState({
			[event.target.name] : event.target.value
		})
	}
	render(){
		var fiveStar = [1, 1, 1, 1, 1]
        return (
	       	<div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12">	
		       	{
		       		this.state.tableObjects.paginationApply === true ?
			       		<div className="col-lg-2 col-md-3 col-sm-6 col-xs-12 NOpadding">
							<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Data Per Page</label>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
								<select onChange={this.setLimit.bind(this)} value={this.state.limitRange} id="limitRange" ref="limitRange" name="limitRange" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding  form-control">
									<option value="Not Selected" disabled>Select Limit</option>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
									<option value={100}>100</option>
									<option value={500}>500</option>
								</select>
							</div>
						</div>
					:
					null        
		       	}
				{
		       		this.state.tableObjects.searchApply === true ? 
			       		<div className="col-lg-10  col-md-9  col-xs-12 col-sm-12 NOpadding-right pull-right">
			        		<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Search</label>
			        		<div className="input-group">
						        <input type="text" onChange={this.tableSearch.bind(this)} className="NOpadding-right form-control" ref="tableSearch" id="tableSearch" name="tableSearch"  placeholder={this.props.tableObjects.searchPlaceholder}/>
						    	<span className="input-group-addon"><i className="fa fa-search"></i></span>
						    </div>
			        	</div>	
		        	:
		        	null
		       	}
					
	            <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding marginTop17">			            	        
	                <div className="table-responsive">
						<table className="table iAssureITtable-bordered table-striped table-hover">
	                        <thead className="tempTableHeader">	     
		                        <tr className="">
		                            { 
		                            	this.state.twoLevelHeader.apply === true ?
		                            	this.state.twoLevelHeader.firstHeaderData.map((data, index)=>{
		                            		return(
												<th key={index} colSpan={data.mergedColoums} className="umDynamicHeader srpadd textAlignCenter">{data.heading}</th>			
		                            		);		                            		
		                            	})	
		                            	:
		                            	null									
									}
	                            </tr>
	                            <tr className="">
	                            <th className="umDynamicHeader srpadd textAlignLeft">Sr.No.</th>
		                            { this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map( 
											([key, value], i)=> {
													// if(key === 'actions'){
													// 	return(
													// 		<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value}</th>
													// 	);	
													// }else{
														return(
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value} 
															{/*<span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span>*/}
															</th>
														);	
													// }
																							
											}
										) 
										:
										<th className="umDynamicHeader srpadd textAlignLeft"></th>
									}
									{/* <th className="umDynamicHeader srpadd textAlignLeft">Status</th> */}
									<th className="umDynamicHeader srpadd textAlignLeft">Action</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                           { this.state.isLoading
	                  	?
	                  		<tr className="trAdmin">
	                     		<td colSpan={Object.keys(this.state.tableHeading).length+1} className="noTempData textAlignCenter">
	                     			<div className="container">
    											<div className="row">
								               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center dataLoaderWrapper">
								                	<p>Loading</p>
								                	<span>Data is Loading. Just a moment please...</span><br/>
								                	<div className="dataLoader">
														   <span></span>
														   <span></span>
														   <span></span>
														   <span></span>
														   <span></span>
														</div>
													</div>
												</div>
											</div>
	                     		</td>
	                  		</tr>
	                  	: 
	                  		this.state.tableData && this.state.tableData.length > 0 ?
	                           		this.state.tableData.map( 
										(value, i)=> {													
											return(
												<tr key={i} className="">
													<td className="textAlignCenter">{this.state.startRange+1+i}</td>
													{
														Object.entries(value).map( 
															([key, value1], i)=> {
																var textAlign = '';
																if($.type(value1) === 'string'){
																	var regex = new RegExp(/(<([^>]+)>)/ig);
																	var value2 = value1 ? value1.replace(regex,'') : '';
																	var aN = value2.replace(this.state.reA, "");
																	if(aN && $.type( aN ) === 'string'){
																		textAlign = 'textAlignLeft';
																	}else{
																		var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																		if(bN){
																			textAlign = 'textAlignRight';
																		}else{
																			textAlign = 'textAlignLeft';
																		}
																	}
																}else{
																	textAlign = 'textAlignRight';
																}	
																var found = Object.keys(this.state.tableHeading).filter((k)=> {
																  return k === key;
																});
																if(found.length > 0){
																	if(key !== 'id'){
																		return(<td className={textAlign} key={i}><div className={textAlign} dangerouslySetInnerHTML={{ __html:value1}}></div></td>); 						
																	}
																}
															}
														)
													}
                                                    {/* <td className="col-lg-1">
                                                        <div className={value.status.toLowerCase()} >
                                                            {value.status}
                                                        </div>
                                                    </td> */}
													<td className="textAlignCenter">
														<span>
															{/* <i className="fa fa-reply" data-toggle="modal" title="Comment" data-target={"#showCommentModal-"+(value._id)} id={value._id}></i>&nbsp; &nbsp;  */}
															
															<a href={"/product-reviews-&-ratings/"+value._id} className="" title="View" data-ID={value._id}>
	                                                            <i className="fa fa-eye" title="View Customer Review" aria-hidden="true"></i>
	                                                        </a>&nbsp; &nbsp;
															<i className={"fa fa-trash redFont "+value._id} id={value._id} onClick={this.delete.bind(this)} title="Delete Customer Review"></i>
															{/* <i className="fa fa-eye" title="View Customer Review" id={value._id} ></i>&nbsp; &nbsp;  */}
														</span>
													</td>
												</tr>
											);										
										}
									) 	
									:
									<tr className="trAdmin"><td colSpan={Object.keys(this.state.tableHeading).length+2} className="noTempData textAlignCenter">No Record Found!</td></tr>               		
								}
	                    	</tbody>
	                    </table>
	                    {
	                    	this.state.tableObjects.paginationApply === true ?
		                    	this.state.tableData && this.state.tableData.length > 0 ?
		                    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 paginationAdminWrap">
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{ 
					                    		this.state.valI ===  1?                  		
					                    		null
						                    	:
				                    			<div className="btn btn-primary" onClick={this.showFirstTweentyButtons.bind(this)} title="Fast Backward"><i className="fa fa-fast-backward"></i></div>
				                    	}
			                    	</div>
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{ 
				                    		this.state.valI ===  1?                  		
					                    	null
					                    	:
					                    	<div className="btn btn-primary" onClick={this.showPreviousPaginationButtons.bind(this)} title="Previous"><i className="fa fa-caret-left"></i></div>
					                    }
				                    </div>
									<ol className="questionNumDiv paginationAdminOES col-lg-8 col-md-8 col-sm-8 col-xs-8 mainExamMinDeviceNoPad">										 
										{this.state.paginationArray}
									</ol>
									<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
										{
											this.state.pageCount >= Math.ceil(this.state.dataCount/this.state.limitRange) ?
											null
											:
											<div className="btn btn-primary" onClick={this.showNextPaginationButtons.bind(this)} title="Next"><i className="fa fa-caret-right"></i></div>
										}
									</div>
									<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
										{
											this.state.pageCount >= (this.state.dataCount/this.state.limitRange) ?
											null
											:
											<div className="btn btn-primary" onClick={this.showLastTweentyButtons.bind(this)} title="Fast Forward"><i className="fa fa-fast-forward"></i></div>
										}
									</div>							
								</div>
								:
								null
							:
							null
	                    }
	                    
	                </div>                        
	            </div>
            </div>
	    );
		
	} 

}

export default withRouter(IAssureTable);