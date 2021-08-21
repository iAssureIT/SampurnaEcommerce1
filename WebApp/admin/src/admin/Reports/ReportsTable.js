import React, { Component }       	from 'react';
import {withRouter} 						from 'react-router-dom';
import $ 									from "jquery";
import jQuery 								from 'jquery';
import Loader                 		from "react-loader";
import ReactHTMLTableToExcel 			from 'react-html-table-to-excel';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';
// import './IAssureTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';


class IAssureTable extends Component {
	constructor(props){
		super(props);

		this.state = {
			"dataCount" 				: props && props.dataCount ? props.dataCount : [],
			"tableData" 				: props && props.tableData ? props.tableData : [],
			"tableHeading"				: props && props.tableHeading ? props.tableHeading : {},
			"twoLevelHeader" 			: props && props.twoLevelHeader ? props.twoLevelHeader : {},
			"tableObjects" 			: props && props.tableObjects ? props.tableObjects : {},		    
			isLoading               : props.isLoading,
			"reA" 						: /[^a-zA-Z]/g,
			"reN" 						: /[^0-9]/g,
			"sort" 	  					: true,
			"examMasterData2" 		: '',
			"activeClass" 				: 'activeCircle',
			"paginationArray" 		: [],
			"startRange" 				: 0,
			"limitRange" 				: 25,	
			"callPage" 					: true,
			"pageCount" 				: 0,
			"valI" 						: 1,
			allid  						:null,
			productImage          	: [],
			productImageArray     	: [],
			productTitle          	: '',
			productNameRlang      	: '',
			searchText 					: ''
		}
	}

	/*===========  ===========*/
	componentDidMount() {
	  $("html,body").scrollTop(0); 
	  $('.uMDetailCheck').parent().parent().addClass("paddingLeft30");
      this.setState({
      	tableHeading	: this.props.tableHeading,
      	tableData 		: this.props.tableData,
      	dataCount 		: this.props.dataCount,
      	isLoading 		: this.props.isLoading,
      });
	  this.paginationFunction();
	}

	/*===========  ===========*/
	componentWillReceiveProps(nextProps) {
		if(this.state.callPage === true){
        	this.paginationFunction();
      }
     	this.setState({
         tableData	: nextProps.tableData,
         dataCount 	: nextProps.dataCount,
         isLoading 	: nextProps.isLoading,
     	})
      if(nextProps){
        	this.setState({
            tableData     		: nextProps.tableData,
            completeDataCount : nextProps.completeDataCount,
        	},()=>{
	        	this.paginationFunction();

	        	if(nextProps.unCheckedUser&&this.state.tableData){
		        	$('.allSelector').prop('checked',false);
		        	
		        	this.state.tableData.map((a,i)=>{
			        	this.setState({
				        	[a._id] 	: false,
				        	allid 	: []
				      },()=>{
				        	this.props.setunCheckedUser(false)
				      })
		   		});
	   		}
        	})
		}        
   }

	/*===========  ===========*/
   sortNumber(key, tableData){
    	var nameA 		= '';
    	var nameB 		= '';
    	var reA 			= /[^a-zA-Z]/g;
		var reN 			= /[^0-9]/g;
		var aN 			= 0;
		var bN 			= 0;

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

   /*===========  ===========*/
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

  	/*===========  ===========*/
  	sort(event){
    	event.preventDefault();
    	var key 			= event.target.getAttribute('id');
    	var tableData 	= this.state.tableData;
		
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

	/*===========  ===========*/
	getStartEndNum(event){	
		event.preventDefault();
		var limitRange = $(event.target).attr('id').split('|')[0];
		var startRange = parseInt($(event.target).attr('id').split('|')[1]);		
		
		this.setState({
			startRange 	: startRange,
			callPage 	: false
		},()=>{
			this.props.getData(this.state.searchText, this.state.startRange, this.state.limitRange);
		});

		$('li').removeClass('activeCircle');
		$(event.target).addClass('activeCircle');
	}

	/*===========  ===========*/
	setLimit(event){
		event.preventDefault();
		var limitRange = parseInt(this.refs.limitRange.value);
		var startRange = 0;

		this.setState({
			"limitRange"	: limitRange,
			"startRange"	: 0

		},()=>{
			$('li').removeClass('activeCircle');
			this.paginationFunction();

			this.props.getData(this.state.searchText, this.state.startRange, this.state.limitRange);
			
		});	
	}

	/*===========  ===========*/
	tableSearch(event){
    	var searchText = event.target.value;
		
		this.setState({
			searchText  : searchText,
		},()=>{
			console.log("this.state.searchText => ",this.state.searchText)
			this.props.getData(this.state.searchText, this.state.startRange, this.state.limitRange);
		});	    	
	     	 
   }

   showNextPaginationButtons(){
    	var dataLength 		= this.state.dataCount;
		const maxRowsPerPage = this.state.limitRange;
		var paginationNum 	= dataLength/maxRowsPerPage;
		var pageCount 			= Math.ceil(paginationNum);
		var addInValI 			= this.state.valI+20;
		var addInPageCount 	= this.state.pageCount+20 > pageCount ? (pageCount) : this.state.pageCount+20;
    	// console.log("dataLength => ",dataLength)
		// console.log("pageCount  ==> ",pageCount)
		// console.log("addInValI  ==> ",addInValI)
		// console.log("addInPageCount ==> ",addInPageCount)
		this.setState({
			valI 			: addInValI,
			pageCount 	: addInPageCount
		},()=>{
			this.showPagination(this.state.valI, this.state.pageCount);
		})
   }

   /*===========  ===========*/
   showPreviousPaginationButtons(){
    	var dataLength 			= this.state.dataCount;
		const maxRowsPerPage 	= this.state.limitRange;
		var paginationNum 		= dataLength / maxRowsPerPage;
		var pageCount 				= Math.ceil(paginationNum);
		var subFromValI 			= this.state.valI - 20 < 1 ? 1 : this.state.valI - 20;
		var subFromPageCount 	= subFromValI + 19 ;

		// var subFromPageCount = this.state.pageCount-20 < 20 ? 20 : this.state.pageCount-20 ;
		// console.log("subFromValI ==> ",subFromValI)
		// console.log("subFromPageCount ==> ",subFromPageCount)

		this.setState({
			valI 			: subFromValI,
			pageCount 	: subFromPageCount
		},()=>{
			this.showPagination(this.state.valI, this.state.pageCount);
		})
    }

   /*===========  ===========*/
   showFirstTweentyButtons(){
		this.setState({
			valI 			: 1,
			pageCount 	: 20
		},()=>{
			this.showPagination(this.state.valI, this.state.pageCount);
		})
   }

   /*===========  ===========*/
   showLastTweentyButtons(){
    	var dataLength 			= this.state.dataCount;
		const maxRowsPerPage 	= this.state.limitRange;
		var paginationNum 		= dataLength/maxRowsPerPage;
		var pageCount 				= Math.ceil(paginationNum);

		this.setState({
			valI 			: pageCount-19,
			pageCount 	: pageCount
		},()=>{			
			this.showPagination(this.state.valI, this.state.pageCount);
		})
   }

   /*===========  ===========*/
	selectedId(event){
		var selectedProducts = this.state.allid?this.state.allid:[];
		var data 				= event.target.id;
		var value 				= event.target.checked;

		this.setState({
			[data] : value,
		},()=>{
			if(this.state[data] === true ){
				selectedProducts.push(data);
				this.setState({
					allid : selectedProducts
				},()=>{
					// console.log('length',this.state.tableData.length,this.state.allid.length)
					if(this.state.tableData.length===this.state.allid.length){
			        $('.allSelector').prop('checked',true);
					}
					this.props.selectedProducts(this.state.allid);
				})
			}else{
				$('.allSelector').prop('checked',false);
				var indexVal = selectedProducts.findIndex(x=>x === data)
				selectedProducts.splice(indexVal,1)
				
				this.setState({
					allid : selectedProducts
				},()=>{
					this.props.selectedProducts(this.state.allid);
				})
			}
		})
	}

	/*===========  ===========*/
	checkAll(event) {
      	// let allid =[];
      	// console.log('event.target.checked',event.target.checked)
      	if(event.target.checked){
      		var allid = []
	        	this.state.tableData.map((a,i)=>{
	        		allid.push(a._id)
	        		this.setState({
	        			[a._id] : true,
	        		},()=>{
		        		if(this.state.tableData.length===(i+1)){
	      				this.setState({allid:allid},()=>{
	      					// console.log("here id true=======================",this.state.allid);
    							this.props.selectedProducts(this.state.allid);
	      				})
		        		}
		        	})
	        		return a._id;
	        	});
      	}else{
		    	this.state.tableData.map((a,i)=>{
		        	this.setState({
		        		[a._id] : false,
		        	},()=>{
		        		if(this.state.tableData.length===(i+1)){
	      				this.setState({allid:[]},()=>{
	      				// console.log("here id=======================",this.state.allid);
    						this.props.selectedProducts(this.state.allid);
	      			})
		        	}
		      })
		      return a._id;
	      });
	   }
   }

   /*===========  ===========*/
	render(){
      return (
	      <div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOPadding">	
	      	<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding">	
				   {this.state.tableObjects.paginationApply === true 
				   	?
					      <div className="col-lg-2 col-md-2 col-sm-4 col-xs-6 NoPadding NOpadding-left">
								<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17 NOpadding">Data Per page</label>
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
					{this.state.tableObjects.searchApply === true 
						? 
					      <div className={"col-lg-9 col-md-9 col-xs-12 col-sm-6 marginTop17 NOpadding-right" + (!this.state.tableObjects.excelReportExport ? " pull-right" : "")}>
				        		<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Search</label>
				        		<div className="input-group">
							        <input type="text" onChange={this.tableSearch.bind(this)} className="NOpadding-right form-control" 
							        ref="tableSearch" id="tableSearch" name="tableSearch" placeholder="Search by Customer Name, Order ID"/>
							    	<span className="input-group-addon" ><i className="fa fa-search"></i></span>
							    </div>
				        	</div>	
				      :
				        	null
				   }
				   {this.state.tableObjects.excelReportExport === true 
						?
				   	<div className="col-lg-1 col-md-1 col-sm-2 col-xs2 NOPadding pull-right marginTop17">
				        	<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" style={{zIndex : -1}}>Search</label>
							<ReactHTMLTableToExcel
								id 				= "test-table-xls-button"
								className 		= "download-table-xls-button fa tableicons downloadExlIcon marginTop0 pull-right"
								table 			= "table-to-xls"
								filename 		= {this.state.tableName ? this.state.tableName + '-' + this.state.date : 'table-' + this.state.date }
								sheet 			= {this.state.tableName + "_Export_Data"}
								buttonText 		= {<i class="fa fa-download" aria-hidden="true"></i>}								
							/>
						</div>
						:
				        	null
				   }
			   </div>					
	         <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding marginTop17">			            	        
	            <div className="table-responsive">
						<table className="table iAssureITtable-bordered table-striped table-hover">
	                  <thead className="tempTableHeader">	     
	                     <tr className="">
	                    	{ 
	                      	this.state.twoLevelHeader.apply === true 
	                      	?
	                      		this.state.twoLevelHeader.firstHeaderData.map((data, index)=>{
	                      			return(
												<th key={index} colSpan={data.mergedColoums} rowSpan={data.mergedRows} className="umDynamicHeader srpadd textAlignCenter">{data.heading}</th>			
	                      			);		                            		
	                      		})	
	                      	:
	                      		null									
								}
	                     </tr>
	                     <tr className="">
	                     {/* <th className="umDynamicHeader srpadd textAlignLeft">
									<div className="uMDetailContainer">
										<input type="checkbox" className="allSelector col-lg-1 col-md-1 col-sm-3 col-xs-1" name="allSelector" onChange={this.checkAll.bind(this)}/>
							    	 	<span className="uMDetailCheck"></span> 
							    	</div>
								</th> */}

	                     	{this.state.tableHeading 
	                     		?
											Object.entries(this.state.tableHeading).map( 
												([key, value], i)=> {
													return(
														<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value} {/*<span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span>*/}</th>
													);								
												}
											) 
										:
											<th className="umDynamicHeader srpadd textAlignLeft"></th>
									}
	                     </tr>
	                  </thead>
	                 	<tbody>
	                  {this.state.isLoading
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
	                  		this.state.tableData && this.state.tableData.length > 0 
	            			?
	                  		this.state.tableData.map((value, i)=> {	
										{/*var vendorArrayLength = value.vendors.length;	
										if(vendorArrayLength === 1){	*/}								
											return(
												<tr key={i} className="">
													{/* <td className="textAlignCenter"><input type="checkbox" ref="userCheckbox" name={value._id} id={value._id} checked={this.state[value._id]} className="userCheckbox" onChange={this.selectedId.bind(this)} /></td>	 */}
													{Object.entries(value).map(([key, value1], i)=> {
														var textAlign = '';						
														if($.type(value1) === 'string'){
															var regex 	= new RegExp(/(<([^>]+)>)/ig);
															var value2 	= value1 ? value1.replace(regex,'') : '';
															var aN 		= value2.replace(this.state.reA, "");
															
															if(aN && $.type( aN ) === 'string'){

																if(value1.includes('textAlignLeft')){
																	textAlign = 'textAlignLeft';
																}else if(value1.includes('textAlignRight')){
																	textAlign = 'textAlignRight';
																}else{
																	textAlign = 'textAlignLeft';
																}

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
																return(
																	<td  key={key+"-"+i} className={textAlign}>
																		<div className={textAlign} dangerouslySetInnerHTML={{ __html : value1}}></div>
																	</td>
																);																
															}
														}
													})}
												</tr>
											);	
															
									}) 	
								:
									<tr className="trAdmin"><td colSpan={12} className="noTempData textAlignCenter">No Record Found!</td></tr>               		
							}
	                 	</tbody>
	               </table>
	               {this.state.tableObjects.paginationApply === true 
	               	?
	                    	this.state.tableData && this.state.tableData.length > 0 
	                    	?
		                    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 paginationAdminWrap">
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{this.state.valI ===  1
				                    		?                  		
					                    		null
						                  :
				                    			<div className="btn btn-primary" onClick={this.showFirstTweentyButtons.bind(this)} title="Fast Backward"><i className="fa fa-fast-backward"></i></div>
				                    	}
			                    	</div>
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{this.state.valI ===  1
				                    		?                  		
					                    		null
					                    	:
					                    		<div className="btn btn-primary" onClick={this.showPreviousPaginationButtons.bind(this)} title="Previous"><i className="fa fa-caret-left"></i></div>
					                  }
				                  </div>
										<ol className="questionNumDiv paginationAdminOES col-lg-8 col-md-8 col-sm-8 col-xs-8 mainExamMinDeviceNoPad">										 
											{this.state.paginationArray}
										</ol>
										<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
											{this.state.pageCount >= Math.ceil(this.state.dataCount/this.state.limitRange) 
												?
													null
												:
													<div className="btn btn-primary" onClick={this.showNextPaginationButtons.bind(this)} title="Next"><i className="fa fa-caret-right"></i></div>
											}
										</div>
										<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
											{this.state.pageCount >= (this.state.dataCount/this.state.limitRange) 
												?
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