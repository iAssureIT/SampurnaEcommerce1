import React, { Component }       	from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import swal                     	from 'sweetalert';
import axios 						from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";
import jQuery 						from 'jquery';
import './IAssureTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import _                      from 'underscore';
import S3FileUpload           from 'react-s3';
import Loader                 		from "react-loader";

var sum = 0;
class IAssureTable extends Component {
	constructor(props){
		super(props);
		// console.log("this.props ==> ",props)

		this.state = {
			"dataCount" 				: props && props.dataCount ? props.dataCount : [],
		    "tableData" 				: props && props.tableData ? props.tableData : [],
		    "tableHeading"				: props && props.tableHeading ? props.tableHeading : {},
		    "twoLevelHeader" 			: props && props.twoLevelHeader ? props.twoLevelHeader : {},
		    "tableObjects" 				: props && props.tableObjects ? props.tableObjects : {},		    
		    isLoading               : props.isLoading,		    
		    "reA" 						: /[^a-zA-Z]/g,
		    "reN" 						: /[^0-9]/g,
		    "sort" 	  					: true,
		    "examMasterData2" 			: '',
		    "activeClass" 				: 'activeCircle',
		    "paginationArray" 			: [],
		    "startRange" 				: 0,
		    "limitRange" 				: 10,
		    "activeClass" 				: 'activeCircle', 		    
		    "normalData" 				: true,
		    "callPage" 					: true,
		    "pageCount" 				: 0,
		    "valI" 						: 1,
		    allid :null,
		    productImage          : [],
            productImageArray     : [],
			productTitle          : '',
			productNameRlang      : ''
		}
		this.delete = this.delete.bind(this);
	}
	componentDidMount() {
	  $("html,body").scrollTop(0); 
	  $('.uMDetailCheck').parent().parent().addClass("paddingLeft30");
      this.setState({
      	tableHeading	: this.props.tableHeading,
      	tableData 		: this.props.tableData,
      	dataCount 		: this.props.dataCount,
      });
	  this.paginationFunction();
	}
	componentWillReceiveProps(nextProps) {
		if(this.state.callPage === true){
        	this.paginationFunction();
        }
        this.setState({
            tableData	    : nextProps.tableData,
            dataCount 		: nextProps.dataCount,
        })
        if(nextProps){
	        this.setState({
	            tableData     : nextProps.tableData,
	            completeDataCount : nextProps.completeDataCount,
	        },()=>{
		        this.paginationFunction();
		        if(nextProps.unCheckedUser&&this.state.tableData){
			        $('.allSelector').prop('checked',false);
			        this.state.tableData.map((a,i)=>{
			        this.setState({
			        [a._id] : false,
			        allid : []
			        },()=>{
			        this.props.setunCheckedUser(false)
			        })
			        });
		        }
        	})
		}
        
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
		let id = e.target.id;
		axios.get('/api/products/get/one/'+id)
			.then((response)=>{
			//	console.log('response.data product==>>>',response.data);
				if(response.data._id && response.data.status === "Publish"){
					swal({
						text : "This product is in Order and Publish!",
					});
				}else{
					axios({
						method: tableObjects.deleteMethod,
						url: tableObjects.apiLink+'/delete/'+id
					}).then((response)=> {
						// console.log(this.state.startRange, this.state.limitRange);
						this.props.getData(this.state.startRange, this.state.limitRange);
						swal({
							text : response.data.message,
						});
					}).catch(function (error) {
						console.log('error', error);
					});	
				}
			})
			.catch((error)=>{
			  console.log('error', error);
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
   	paginationFunction(event){
		var dataLength = this.state.dataCount;
			// console.log("dataLength 297=> ",dataLength)
		const maxRowsPerPage = this.state.limitRange;
			// console.log("maxRowsPerPage 299=> ",maxRowsPerPage)
		var paginationNum = dataLength/maxRowsPerPage;
			// console.log("paginationNum 301 => ",paginationNum)
		var pageCount = Math.ceil(paginationNum) > 20? 20 : Math.ceil(paginationNum);
			// console.log("Math.ceil(paginationNum)",Math.ceil(paginationNum))
			// console.log("pageCount 306 => ",pageCount)
		this.setState({
			valI : 1,
			pageCount : pageCount,
			// callPage : false
		},()=>{
			// console.log("pageCount 308=> ",this.state.pageCount)
		})
		this.showPagination(1, pageCount);
		
	}
	showPagination(valI, pageCount){
		// console.log("pageCount ==> 309",pageCount)
		// console.log("val I ==> 309",valI)
		var paginationArray = [];
		for (var i=valI; i<=pageCount;i++){
			var countNum = this.state.limitRange * i;
			// console.log("this.state.limitRange ==> ",this.state.limitRange)
			// console.log("countNum ==> ",countNum)
			var startRange = countNum - this.state.limitRange;
			// console.log("startRange ==> ",startRange)
			// console.log("i ==>",i)
			if(i === 1){
				var activeClass = 'activeCircle';
			}else{
				activeClass = '';
			}
			paginationArray.push(
				<li key={i} className={"queDataCircle page-link "+activeClass+" parseIntagination"+i} id={countNum+'|'+startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on "+i+ " page"}>{i}</li>
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
		// console.log("limitRange ==> ",limitRange)
		var limitRange2     = parseInt(limitRange);
		var startRange = parseInt($(event.target).attr('id').split('|')[1]);
		// console.log("startRange ==> ",startRange)
		
		this.props.getData(startRange, limitRange);
		// console.log("this.props.getData(startRange, limitRange)",this.props)		
		this.setState({
			startRange:startRange,
			// limitRange:limitRange,
			callPage : false
		},()=>{
			// console.log("setstate startRange ==> ",startRange)
			// console.log("setstate startRange ==> ",limitRange)
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
			if(this.state.normalData === true){
				this.props.getData(startRange, this.state.limitRange);
			}	
			if(this.state.searchData === true){
				this.tableSearch();
			}
		});	
	}
	tableSearch(){
    	var searchText = this.refs.tableSearch.value;
		if(searchText && searchText.length !== 0) {
			this.setState({
				"normalData"  : false,
				"searchData"  : true,
			},()=>{
				this.props.getSearchText(searchText, this.state.startRange, this.state.limitRange);
			});	    	
	    }else{
			this.props.getData(this.state.startRange, this.state.limitRange);
	    }    	 
    }
    showNextPaginationButtons(){
    	var dataLength = this.state.dataCount;
    	// console.log("dataLength => ",dataLength)
		const maxRowsPerPage = this.state.limitRange;
		var paginationNum = dataLength/maxRowsPerPage;
		var pageCount = Math.ceil(paginationNum);
		// console.log("pageCount  ==> ",pageCount)

		var addInValI = this.state.valI+20;
		// console.log("addInValI  ==> ",addInValI)
		var addInPageCount = this.state.pageCount+20 > pageCount ? (pageCount) : this.state.pageCount+20;
		// console.log("addInPageCount ==> ",addInPageCount)
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
		// console.log("subFromValI ==> ",subFromValI)
		var subFromPageCount = subFromValI+19 ;
		// console.log("subFromPageCount ==> ",subFromPageCount)

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
		// console.log('this', this.state.startRange, this.state.limitRange);
		var attribute = event.target.getAttribute('data-attribute');
    	var attributeValue = event.target.getAttribute('data-attributeValue');
        var product_ID  = event.currentTarget.getAttribute('data-ID');
		// console.log('attribute', attribute, attributeValue, product_ID);
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
				// console.log('this', this.state.startRange, this.state.limitRange);
			  this.props.getData(this.state.startRange, this.state.limitRange);
			})
			.catch((error)=>{
			  console.log('error', error);
			})
        }
    }
    
    changeStatusOfProd(event){
    	var status = event.target.getAttribute('data-status');
        var product_ID = event.target.getAttribute('data-ID');
        if(status === "Publish" && product_ID){
            var changingStat = "Unpublish";
        }else {
            var changingStat = "Publish";
        }
        var data = {
        	status : changingStat,
        	product_ID : product_ID
        }
        axios.put('/api/products/status', data)
        .then((response)=>{
        	this.props.getData(this.state.startRange, this.state.limitRange);
        	swal({
                title: 'Product '+changingStat+'ed Successfully',
            });
        })
        .catch((error)=>{

        });
        
	}
	selectedId(event){
		var selectedProducts = this.state.allid?this.state.allid:[];
		var data = event.target.id;
		var value = event.target.checked;
		// console.log("data", data,value,selectedProducts);
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
		// console.log('indexVal',indexVal)
		selectedProducts.splice(indexVal,1)
		this.setState({
		allid : selectedProducts
		},()=>{
		this.props.selectedProducts(this.state.allid);
		})
		}
		})
	}
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
    showImageModal(event){
    	//$('#showImageModal').show();
    	// console.log("event",event.target)
    	var productId = event.target.getAttribute('id');
    	this.getImageData(productId);
    	this.setState({productID:productId, productName:event.target.getAttribute('name'),productNameRlang:event.target.getAttribute('namerlang')})

    }
    getImageData(id){
        // console.log('id',id);
        axios.get('/api/products/get/one/'+id)
        .then((response)=>{
            // console.log('reas', response.data);
            this.setState({
                productImage : response.data.productImage && response.data.productImage.length>0 ? response.data.productImage : [],
                productImageArray : response.data.productImage && response.data.productImage.length>0 ? response.data.productImage : [],
                productTitle : response.data.productName 
            },()=>{
                // console.log('productImage', this.state.productImage);
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    uploadProductImage(event){
        event.preventDefault();
        console.log("event.currentTarget.files------",event.currentTarget.files);
        var productImage = [];
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            for(var i=0; i<event.currentTarget.files.length; i++){
                var file = event.currentTarget.files[i];
                if (file) {
                    var fileName  = file.name; 
                    var ext = fileName.split('.').pop();  
                    if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){
                        if (file) {
                            var objTitle = { fileInfo :file }
                            productImage.push(objTitle);
                            
                        }else{          
                            swal("Images not uploaded");  
                        }//file
                    }else{ 
                        swal("Allowed images formats are (jpg,png,jpeg)");   
                    }//file types
                }//file
            }//for 

            if(i >= event.currentTarget.files.length){
                this.setState({
                    productImage : productImage
                },()=>{
                    // console.log('productImage', this.state.productImage)
                });  
                main().then(formValues=>{
                    // console.log('formValues.productImage', formValues.productImage);
                    var newImages = this.state.productImageArray;
                    newImages.push(formValues.productImage);
                    this.setState({
                        productImageArray : _.flatten(newImages)
                    },()=>{
                        // console.log('form', this.state.productImageArray);
                    })
                });
                async function main(){
                    var config = await getConfig();
                    
                    var s3urlArray = [];
                    for (var i = 0; i<productImage.length; i++) {
                        var s3url = await s3upload(productImage[i].fileInfo, config, this);
                        s3urlArray.push(s3url);
                    }
                    // console.log('s3urlArray',s3urlArray);
                    
                    
                    const formValues = {
                        "product_ID"        : "fhfgf",
                        "productImage"      : s3urlArray,
                        "status"            : "New"
                    };
        
                    // console.log("1 formValues = ",formValues);
                    return Promise.resolve(formValues);
                }
                function s3upload(image,configuration){
        
                    return new Promise(function(resolve,reject){
                        S3FileUpload
                           .uploadFile(image,configuration)
                           .then((Data)=>{
                                // console.log("Data = ",Data);
                                resolve(Data.location);
                           })
                           .catch((error)=>{
                                console.log(error);
                           })
                    })
                }   
                function getConfig(){
                    return new Promise(function(resolve,reject){
                        axios
                           .get('/api/projectSettings/get/S3')
                           .then((response)=>{
                                // console.log("proj set res = ",response.data);
                                const config = {
                                    bucketName      : response.data.bucket,
                                    dirName         : 'propertiesImages',
                                    region          : response.data.region,
                                    accessKeyId     : response.data.key,
                                    secretAccessKey : response.data.secret,
                                }
                                resolve(config);                           
                            })
                           .catch(function(error){
                                console.log(error);
                           })
        
                    })
                }        
            }
        }
    }
    
	deleteProductImage(event){
        // console.log('delete');
        
        var id = event.target.id;
        var productImageArray = this.state.productImageArray;
        // console.log('productImage', productImageArray, id);

        productImageArray.splice(productImageArray.findIndex(v => v === id), 1);
        this.setState({
            productImageArray: productImageArray
        },()=>{
            // console.log('subcatgArr', this.state.subcatgArr);
        });
    }
    saveImages(event){
    	event.preventDefault();
    	this.props.saveProductImages(this.state.productImage,this.state.productID,this.state.productImageArray)
    }
	render(){
		// console.log('productImageArray',this.state.productImageArray)
        return (
	       	<div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NoPadding">	
		       	{
		       		this.state.tableObjects.paginationApply === true ?
			       		<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NoPadding">
							<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17 NOpadding">Show</label>
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
				<div className="col-lg-6  col-md-6  col-xs-12 col-sm-12 text-center mt50">
	        		{/* <label className="col-lg-6 col-md-6 col-sm-12 col-xs-12">Filtered Products: <span >{this.state.dataCount}</span> </label> */}
					<label className="col-lg-6 col-md-6 col-sm-12 col-xs-12">Selected Products: <span >{this.state.allid ? this.state.allid.length : '0'}</span> </label>
				</div> 
				{
		       		this.state.tableObjects.searchApply === true ? 
			       		<div className="col-lg-4  col-md-4  col-xs-12 col-sm-4 marginTop17 pull-right NoPadding">
			        		<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Search</label>
			        		<div className="input-group">
						        <input type="text" onChange={this.tableSearch.bind(this)} className="NOpadding-right form-control" 
						        ref="tableSearch" id="tableSearch" name="tableSearch" placeholder="Search by Product Name, Brand, Section, Category, Item code"/>
						    	<span className="input-group-addon" ><i className="fa fa-search"></i></span>
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
	                            <th className="umDynamicHeader srpadd textAlignLeft">
									<div className="uMDetailContainer">
										<input type="checkbox" className="allSelector col-lg-1 col-md-1 col-sm-3 col-xs-1" name="allSelector" onChange={this.checkAll.bind(this)}/>
								    	{/* <span className="uMDetailCheck"></span> */}
								    </div>
								</th>
		                            { this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map( 
											([key, value], i)=> {
												return(
													<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value} <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
												);								
											}
										) 
										:
										<th className="umDynamicHeader srpadd textAlignLeft"></th>
									}
									<th className="umDynamicHeader srpadd textAlignLeft">Featured</th>
									<th className="umDynamicHeader srpadd textAlignLeft">Exclusive</th>
									<th className="umDynamicHeader srpadd textAlignLeft">Status</th>
									<th className="umDynamicHeader srpadd textAlignLeft">Action</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                           { 	this.state.isLoading
                        	?
                        		<tr className="trAdmin">
                           		<td colSpan={Object.keys(this.state.tableHeading).length+1} className="noTempData textAlignCenter">
                           			<div id="tableLoaderDiv">  
						                    	<Loader
						                        loaded          = {false}
						                        lines           = {13}
						                        length          = {20}
						                        width           = {8}
						                        radius          = {10}
						                        corners         = {1}
						                        rotate          = {0}
						                        direction       = {1}
						                        color           = "#a5d8ff"
						                        speed           = {1}
						                        trail           = {60}
						                        shadow          = {false}
						                        hwaccel         = {false}
						                        className       = "spinner"
						                        zIndex          = {2e9}
						                        top             = "55%"
						                        left            = "50%"
						                        scale           = {1.0}
						                        loadedClassName = "loadedContent"
						                    	/> 
						                	</div>
                           		</td>
                        		</tr>
                        	:
                        	this.state.tableData && this.state.tableData.length > 0 ?
	                           		this.state.tableData.map( 
										(value, i)=> {		
											// console.log("value",value)											
											return(
												<tr key={i} className="">
													<td className="textAlignCenter"><input type="checkbox" ref="userCheckbox" name={value._id} id={value._id} checked={this.state[value._id]} className="userCheckbox" onChange={this.selectedId.bind(this)} /></td>
													
													{
														Object.entries(value).map( 
															([key, value1], i)=> {
																{/*console.log("value1",value1, " = ",$.type(value1));*/}
																if($.type(value1) === 'string' && value1 !== "<span class='textAlignRight'>0%</span>"){
																	var textAlign = 'textAlignRight';
																}else if($.type(value1) === 'string' ){
																	var regex = new RegExp(/(<([^>]+)>)/ig);
																	var value2 = value1 ? value1.replace(regex,'') : '';
																	var aN = value2.replace(this.state.reA, "");
																	console.log("aN ====> ",aN)
																	if(aN && $.type( aN ) === 'string'){
																		if(value1.includes('textAlignLeft')){
																			var textAlign = 'textAlignLeft';
																		}else if(value1.includes('textAlignRight')){
																			   var textAlign = 'textAlignRight';
																		}else{
																			var textAlign = 'textAlignLeft';
																		}

																	}else{
																		var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																		console.log("bN ====> ",bN)
																		if(bN || bN === 0){
																			var textAlign = 'textAlignRight';
																		}else{
																			var textAlign = 'textAlignLeft';
																		}
																	}
																}else{
																	var textAlign = 'textAlignRight';
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
													<td className="col-lg-1 textAlignCenter">
                                                      <i onClick={this.changeAttribute.bind(this)} data-attribute="featured" data-ID={value._id} data-attributeValue={value.featured} title={ (value.featured === true )? "Disable It" : "Enable It" } className={'fa fa-check-circle prodCheckboxDim ' + ( value.featured === true ? "prodCheckboxDimSelected" : "prodCheckboxDimNotSelected" )} aria-hidden="true"></i>
                                                    </td>
                                                    <td className="col-lg-1 textAlignCenter">
                                                        <i onClick={this.changeAttribute.bind(this)} data-attribute="exclusive" data-ID={value._id} data-attributeValue={value.exclusive} title={( value.exclusive === true ? "Disable It" : "Enable It" )}  className={'fa fa-check-circle prodCheckboxDim ' + ( value.exclusive === true ? "prodCheckboxDimSelected" : "prodCheckboxDimNotSelected" )} aria-hidden="true"></i>
                                                    </td>
													
                                                    <td className="col-lg-1">
                                                        <div className={( value.status === ("Unpublish") ? ("prodStatUnpublish") : (value.status === ("Publish") ? ("prodStatPublish") : ("prodStatDraft")) )}>{value.status}</div>
                                                        {/* <div onClick={this.changeStatusOfProd.bind(this)} data-ID={value._id} className={( value.status === ("Unpublish") ? ("prodStatUnpublish") : (value.status === "Publish" ? "prodStatPublish" : "prodStatDraft") )} data-status={value.status} >
                                                            {(value.status === ("Unpublish") ? ("Unpublished") : (value.status === ("Draft") ? ("Draft") : ("Published")))}
                                                        </div> */}
                                                    </td>
													<td className="textAlignCenter">
														<span class="displayInline">
															<a href={"/product-details/"+value._id} className="" title="View" data-ID={value._id}>
	                                                            <i className="fa fa-eye" aria-hidden="true"></i>
	                                                        </a>&nbsp; &nbsp;
															<i className="fa fa-pencil" title="Edit" id={value._id} onClick={this.edit.bind(this)}></i>&nbsp; &nbsp; 
															<i className={"fa fa-image "} id={value._id} name={value.productNameBasic} nameRlang={value.productNameRlang} data-toggle="modal" title="Upload Product Image" data-target={"#productImageModal"} onClick={this.showImageModal.bind(this)}></i>&nbsp; &nbsp;
														
															{this.props.editId && this.props.editId === value._id? null :<i className={"fa fa-trash redFont "+value._id} id={value._id+'-Delete'} data-toggle="modal" title="Delete" data-target={"#showDeleteModal-"+(value._id)}></i>}
															</span>
														<div className="modal fade" id={"showDeleteModal-"+(value._id)} role="dialog">
	                                                        <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                                          <div className="modal-content adminModal-content col-lg-6 col-lg-offset-4 col-md-6 col-md-offset-4 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
	                                                            <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                                            <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
	                                                              <button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"#showDeleteModal-"+(value._id)}>&times;</button>
	                                                            </div>
	                                                           
	                                                            </div>
	                                                            <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                                              <h4 className="blackLightFont textAlignCenter examDeleteFont col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure you want to delete?</h4>
	                                                            </div>
	                                                            
	                                                            <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                                                <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
	                                                              </div>
	                                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                                                <button onClick={this.delete.bind(this)} id={(value._id).replace(/-/g, "/")} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1 floatRight" data-dismiss="modal">DELETE</button>
	                                                              </div>
	                                                            </div>
	                                                          </div>
	                                                        </div>
	                                                    </div>
													</td>
												</tr>
											);										
										}
									) 	
									:
									<tr className="trAdmin"><td colSpan={12} className="noTempData textAlignCenter">No Record Found!</td></tr>               		
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

	            <div className="modal" id="productImageModal" role="dialog">
                  	<div className="modal-dialog modal-lg">
                    	<div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                      		<div className="modal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                        <button type="button" className="close" data-dismiss="modal">&times;</button>
		                        <h3 className="modalTitle">Product Images</h3>
		                    </div>
                      	<div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                      		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 input-group">
		                        <br/>	<label className="col-lg-8 col-md-6 col-xs-12 col-sm-12 NOpadding-left pageSubHeader">{this.state.productName}</label>
								{this.state.productNameRlang ? <label className="col-lg-4 col-md-6 col-xs-12 col-sm-12 NOpadding-left pageSubHeader">Product Name in Reg Language : <span className="RegionalFont">{this.state.productNameRlang}</span></label> : null}
		                        </div>
		                        <div className="col-lg-2 col-md-2 col-sm-4 col-xs-4 input-group height100" id="hideInput">
		                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
	                                    <img src= "/images/uploadimg.png" className="img-responsive imgStyle" />
	                                      <input type="file" className="form-control commonFilesUpld" accept=".jpg,.jpeg,.png" multiple onChange={this.uploadProductImage.bind(this)}  name="upload-logo"/>
	                                </div>            
		                            
		                        </div>
	                        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding ">
	                            	<div className="row productImgWrapper">
	                            	{this.state.productImageArray && this.state.productImageArray.length > 0?
		                                this.state.productImageArray.map((imageData, index)=>{
		                                    return(
		                                        <div className="col-lg-2 productImgCol" key={index}>
		                                            <div className="prodModalImage">
		                                                <div className="prodImageInner">
		                                                    <span className="prodImageCross" title="Delete" data-imageUrl={imageData} id={imageData} onClick={this.deleteProductImage.bind(this)}>x</span>
		                                                </div>
		                                                <img aria-hidden="true" data-toggle="modal" data-target={"#openImageModal"+index} title="view Image" src={imageData} alt="Product Image" className="img-responsive" />
		                                            </div>

		                                            <div className="modal fade" id={"openImageModal"+index} role="dialog">
		                                                <div className="modal-dialog">
		                                                    <div className="modal-content">
		                                                        <div className="modal-header">
		                                                            <a href="#" data-dismiss="modal" aria-hidden="true" className="close pull-right"><i className="fa fa-times-circle-o fa-lg venClosePadd" aria-hidden="true"></i></a>
		                                                            </div>
		                                                        <div className="modal-body">
		                                                            <div className="row">
		                                                                <div className="col-lg-12 text-left productImageModallMarginBtm">
		                                                                    <img src={imageData} alt="Product Image" className="img-responsive" />
		                                                                </div>
		                                                            </div>
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
                        	</div>
                        </div>
                      </div>
                      <div className="modal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <a href="#" className="btn btn-warning" id="productImageModalbtn" data-dismiss="modal" onClick={this.saveImages.bind(this)} >Save</a>
                          <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        </div>
                      </div>
                    </div>
                  	</div>
                </div>
	            

            </div>
	    );
		
	} 

}

export default withRouter(IAssureTable);