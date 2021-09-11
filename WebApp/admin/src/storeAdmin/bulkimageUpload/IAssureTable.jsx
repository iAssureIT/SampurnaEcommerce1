import React, { Component }       	from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import swal                     	from 'sweetalert2';
import Swal                     	from 'sweetalert';
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


const swalWithBootstrapButtons = swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})
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
		    unCheck             : props.unCheckedProducts,		    
		    "reA" 						: /[^a-zA-Z]/g,
		    "reN" 						: /[^0-9]/g,
		    "sort" 	  					: true,
		    "examMasterData2" 			: '',
		    "activeClass" 				: 'activeCircle',
		    "paginationArray" 			: [],
		    "startRange" 				: 0,
		    "limitRange" 				: 10,
		    // "activeClass" 				: 'activeCircle', 		    
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
      	isLoading      : this.props.isLoading,
      	unCheck 			: this.props.unCheckedProducts
      },()=>{
	// console.log("this.state.tableData => ",this.state.tableHeading);

      	if (this.state.unCheck) {
      		this.unCheckAll();
      	}
      });
	  this.paginationFunction();
	}
	componentWillReceiveProps(nextProps) {
		// console.log("props.tableData = ",nextProps.tableData);
		
		if(this.state.callPage === true){
        	this.paginationFunction();
        }
        this.setState({
            tableData	    : nextProps.tableData,
            dataCount 		: nextProps.dataCount,
            isLoading      : nextProps.isLoading,
            unCheck 			: nextProps.unCheckedProducts
        })
        if(nextProps){
	        this.setState({
	            tableData     		: nextProps.tableData,
	            completeDataCount : nextProps.completeDataCount,
	            unCheck 				: nextProps.unCheckedProducts
	        },()=>{
		        this.paginationFunction();
		        	if(nextProps.unCheckedProducts && this.state.tableData){
			        $('.allSelector').prop('checked',false);
			        this.state.tableData.map((a,i)=>{
			        this.setState({
			        [a._id] : false,
			        allid : []
			        },()=>{
			        // this.props.setunCheckedUser(false)
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

	delete(event){
		event.preventDefault();
		var tableObjects = this.props.tableObjects;
		// console.log("event.target.id = ",event.target)
		let id = event.target.id;

		// console.log("id = ",id)
		swalWithBootstrapButtons.fire({
		  title: 'Are you sure?',
		  text: "You won't be able to revert this!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonText: 'Yes, delete it!',
		  cancelButtonText: 'No, cancel!',
		  reverseButtons: true
		}).then((result) => {
		  if (result.isConfirmed) {

		  	axios.get('/api/products/get/one/'+id)
			.then((response)=>{
			//	console.log('response.data product==>>>',response.data);
				if(response.data._id && response.data.status === "Publish"){
					// swal({
					// 	text : "This product is in Order and Publish!",
					// });
					swal.fire({
					  icon: 'info',
					  title: 'Oops...',
					  text: 'This product is exist in some customer Orders!'
					})
				}else{
					axios({
						method: tableObjects.deleteMethod,
						url: tableObjects.apiLink+'/delete/'+id
					}).then((response)=> {
						// console.log(this.state.startRange, this.state.limitRange);
						this.props.getData(this.state.startRange, this.state.limitRange);
						// swal({
						// 	text : response.data.message,
						// });
						swalWithBootstrapButtons.fire(
					      'Deleted!',
					      'Product has been deleted.',
					      'success'
				    )
					}).catch(function (error) {
						console.log('error', error);
					});	
				}
			})
			.catch((error)=>{
			  console.log('error', error);
			  swal.fire({
				  icon: 'error',
				  title: 'Oops...',
				  text: 'Something went wrong!'
				})
			})		  	
		    
		  } else if (
		    /* Read more about handling dismissals below */
		    result.dismiss === swal.DismissReason.cancel
		  ) {
		    swalWithBootstrapButtons.fire(
		      'Cancelled',
		      'Product is safe :)',
		      'error'
		    )
		  }
		})
		
	}

  //   delete(e){
	 //  	e.preventDefault();
	 //  	var tableObjects =  this.props.tableObjects;
		// let id = e.target.id;
		// axios.get('/api/products/get/one/'+id)
		// 	.then((response)=>{
		// 	//	console.log('response.data product==>>>',response.data);
		// 		if(response.data._id && response.data.status === "Publish"){
		// 			swal({
		// 				text : "This product is in Order and Publish!",
		// 			});
		// 		}else{
		// 			axios({
		// 				method: tableObjects.deleteMethod,
		// 				url: tableObjects.apiLink+'/delete/'+id
		// 			}).then((response)=> {
		// 				// console.log(this.state.startRange, this.state.limitRange);
		// 				this.props.getData(this.state.startRange, this.state.limitRange);
		// 				swal({
		// 					text : response.data.message,
		// 				});
		// 			}).catch(function (error) {
		// 				console.log('error', error);
		// 			});	
		// 		}
		// 	})
		// 	.catch((error)=>{
		// 	  console.log('error', error);
		// 	})
		
  //   } 
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
		
		this.props.getData(startRange, this.state.limitRange);
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
			this.props.getData(this.state.startRange, this.state.limitRange);
			// if(this.state.normalData === true){
			// 	this.props.getData(startRange, this.state.limitRange);
			// }	
			// if(this.state.searchData === true){
			// 	this.tableSearch();
			// }
		});	
	}
	tableSearch(){
    	var searchText = this.refs.tableSearch.value;
		// if(searchText && searchText.length !== 0) {
		// 	this.setState({
		// 		"normalData"  : false,
		// 		"searchData"  : true,
		// 	},()=>{
				this.props.getSearchText(searchText);
			// });	    	
	  //   }else{
			// this.props.getData(this.state.startRange, this.state.limitRange);
	  //   }    	 
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

    unCheckAll() {      	
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
    showImageModal(event){
    	//$('#showImageModal').show();
    	// console.log("event",event.target)
    	var productId = event.target.getAttribute('id');
    	this.getImageData(productId);
    	this.setState({productID:productId, productName:event.target.getAttribute('name'),productNameRlang:event.target.getAttribute('namerlang')})

    }

    deleteproductImages(event){

		event.preventDefault(); 
		var id  			= event.target.getAttribute('data-productid');
		var image 			= event.target.getAttribute('data-image');
		var imageName 		= image.split("/").pop();
		var smallImageName 	= imageName.split(".")[0] + "_small_image." + imageName.split(".")[1];
		var split 			= image.split("/");
		var smallImageLink  = split.slice(0, split.length - 1).join("/") + "/" + smallImageName;
		
		// console.log("image 715 => ", image)
		// console.log("smallImageLink 716 => ", smallImageLink)
		
		var formValues = {
			product_ID  	: id,
			imageLink 		: image,
			smallImageLink 	: smallImageLink
		}

		Swal({
			title 		: "Are you sure you want to delete this image?",
			text 		: "Once deleted, you will not be able to recover this image!",
			// icon 		: "warning",
			buttons 	: true,
			dangerMode 	: true,
		})
		.then((success) => {
			if (success) {
				Swal("Your image is deleted!");
				
					axios.patch('/api/products/remove/image', formValues)
					.then((res)=>{
						// this.getData();
                        this.props.getData(this.state.startRange, this.state.limitRange);
					})
					.catch((error)=>{
						console.log('errro', error);
					})
			
			} else {
				Swal("Your image is safe!");
			}
		});

 
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
        // console.log("event.currentTarget.files------",event.currentTarget.files);
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
		// console.log("this.state.tableData=====",this.state.tableData)

		// console.log('productImageArray',this.state.productImageArray)
        return (
	       	<div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NoPadding">	
		       	{
		       		this.state.tableObjects.paginationApply === true ?
			       		<div className="col-lg-2 col-md-3 col-sm-6 col-xs-12 NOpadding-left">
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
			       		<div className="col-lg-10 col-md-9 col-sm-12 col-xs-12 pull-right  NOpadding-right">
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
	                            {/* <th className="umDynamicHeader srpadd textAlignLeft">
									<div className="uMDetailContainer">
										<input type="checkbox" className="allSelector col-lg-1 col-md-1 col-sm-3 col-xs-1" name="allSelector" onChange={this.checkAll.bind(this)}/>
								    </div>
								</th> */}
		                            { this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map( 
											([key, value], i)=> {
												return(
													<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value}
													 {/*<span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span>*/}
													 </th>
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
                        	this.state.tableData && this.state.tableData.length > 0 ?
	                           		this.state.tableData.map( 
										(value, i)=> {		
											// console.log("value",value)											
											return(
												<tr key={i} className="">
													<td> {this.state.startRange + 1 + i} </td>												
													{
														Object.entries(value).map( 
															([key, value1], i)=> {
																{/*console.log("value1",value1, " = ",$.type(value1));*/}
																{/*if($.type(value1) === 'string' && value1.contains("%") !== "<span class='textAlignRight'>0%</span>"){*/}
																if($.type(value1) === 'string' && value1.includes("%")){
																	var textAlign = 'textAlignRight';
																}else if($.type(value1) === 'string' ){
																	var regex = new RegExp(/(<([^>]+)>)/ig);
																	var value2 = value1 ? value1.replace(regex,'') : '';
																	var aN = value2.replace(this.state.reA, "");
																	{/*console.log("aN ====> ",aN)*/}
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
																		{/*console.log("bN ====> ",bN)*/}
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
                                                    <td>
                                                    {
                                                        value.productImage.length > 0 ? 
                                                            <div className="col-lg-12 col-md-12 col-sm-12, col-xs-12 deleteimagewrapper bulkimagebg webkitDisplayBox">  
                                                                {  
                                                                    value.productImage.map((imgdata,index)=>{
                                                                        return(
                                                                            <div className="deleteImgBlkUpldCol" key={index}>
                                                                                {/* imgdata */}
                                                                                <i className="fa fa-times deleteImgBlkUpldSign" aria-hidden="true" data-image={imgdata} data-productid={value._id}   onClick={this.deleteproductImages.bind(this)}></i>
                                                                                <img src={imgdata} className=""/>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        :
                                                        <div className="bulkImgUpldNotShown">
                                                            No Images Available
                                                        </div>
                                                    }
                                                    </td>
												</tr>
											);										
										}
									) 	
									:
									<tr className="trAdmin"><td colSpan={13} className="noTempData textAlignCenter">No Record Found!</td></tr>               		
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

	            <div className="modal textAlignCenter" id="productImageModal" role="dialog">
                  	<div className="modal-dialog modal-lg">
                    	<div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                      		<div className="modal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                        <button type="button" className="close" data-dismiss="modal">&times;</button>
		                        <h3 className="modalTitle">Product Images</h3>
		                    </div>
                      	<div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                      		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 input-group">
		                        <br/>	<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left pageSubHeader textAlignCenter">Select Product Images to Upload{this.state.productName}</label>
										{/*<label className="col-lg-4 col-md-6 col-xs-12 col-sm-12 NOpadding-left pageSubHeader">Product Name : <span className="RegionalFont">{this.state.productNameRlang}</span></label> : null}*/}
		                        </div>
		                        <div className="col-lg-offset-5 col-md-offset-4 col-sm-offset-3 col-lg-2 col-md-4 col-sm-6 col-xs-12 input-group" id="hideInput">
		                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos height100" id="LogoImageUpOne">
	                                    <img src= "/images/uploadimg.png" className="img-responsive imgStyle" style={{height : "100%", width : "100%"}} />
	                                     <input type="file" className="form-control commonFilesUpld" accept=".jpg,.jpeg,.png" multiple onChange={this.uploadProductImage.bind(this)}  name="upload-logo"/>
	                                </div>            
		                            
		                        </div>
	                        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding ">
	                            	{this.state.productImageArray && this.state.productImageArray.length > 0 
	                            		?
	                            			<div className="row productImgWrapper productImagesDiv" >
		                                		{this.state.productImageArray.map((imageData, index)=>{
			                                    return(
			                                        <div className="col-lg-2 col-md-3 col-sm-4 col-xs-12 productImgCol" key={index}>
			                                            <div className="prodModalImage" style={{"height" : "100px"}}>
			                                                <div className="prodImageInner">
			                                                    <span className="prodImageCross" title="Delete" data-imageUrl={imageData} id={imageData} onClick={this.deleteProductImage.bind(this)}>x</span>
			                                                </div>
			                                                <img aria-hidden="true" data-toggle="modal" src={imageData} alt="Product Image" className="img-responsive" style={{height : "100%", width : "100%"}} />
			                                                {/*<img aria-hidden="true" data-toggle="modal" data-target={"#openImageModal"+index} title="view Image" src={imageData} alt="Product Image" className="img-responsive" style={{height : "100%", width : "100%"}} />*/}
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
		                                		})}
                            				</div>
		                                :
		                                	<div className="row productImgWrapper productImagesDiv height100 textAlignCenter" style={{paddingTop: "35px"}} >
		                                	 	No Product Images Available
		                                	</div>
	                            	}
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