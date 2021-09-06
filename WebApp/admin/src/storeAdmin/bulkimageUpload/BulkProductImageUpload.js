import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import S3FileUpload           from 'react-s3';
import { Alert } from 'bootstrap';
import Compressor from 'compressorjs';
import Select               from 'react-select';
import IAssureTable         from "./IAssureTable.jsx";


class BulkProductImageUpload extends Component{
	constructor(props){
			super(props);
			this.state = {
				notuploadedImages : [],
				allshopproductimages : [],
				productImageArray : [],
				progressLength : 0,
				itemCodeNotExist :'',
				startRange 				: 0,
				limitRange 				: 10,
				selector 				: {},
				statusArray 			: [
					{name : 'status', label : 'All', value : ''},
					{name : 'status', label : 'Publish', value : 'Publish'},
					{name : 'status', label : 'Draft', value : 'Draft'},
					{name : 'status', label : 'Unpublish', value : 'Unpublish'}
				],
				tableHeading: {
					srNo 				: 'Sr no.',
					productCode		: 'Product Code',
					itemCode			: 'Item Code',
					productName		: 'Product Name',
					originalPrice		: 'Original Price',
					images				: 'Images',
				},
				tableObjects 			: {
					paginationApply 	: true,
					searchApply 		: true,
					deleteMethod 		: 'delete',
					apiLink 				: '/api/products',
					editUrl 				: '/add-product/'
				},
				dataCount : "",
			}

	}

	componentDidMount() {
		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
		var token       = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;   

		this.getData();
		this.getDatawithlimit(this.state.startRange , this.state.limitRange);


		axios.get("/api/adminPreference/get")
	  	.then(preference =>{
		 	// console.log("preference = ",preference.data);
		 	this.setState({
				websiteModel  : preference.data[0].websiteModel,
				currency  : preference.data[0].currency,
		 	},()=>{
			  	// console.log("this.state.websiteModel in comp",this.state.websiteModel);
			  	if(this.state.websiteModel =="MarketPlace"){

			  		// console.log(" this.state.tableHeading bove", this.state.tableHeading);
			  		this.setState({
					 	tableHeading: {
							"productName" 		: 'Product Details',
							"section"			: 'Section',
							"category"			: 'Category',
							"vendor"				: 'Vendor',
							"originalPrice"	: 'Original Price',
							"discountPercent"	: 'Discount Percent',
							"discountedPrice"	: 'Discounted Price',
							// "availableQuantity": 'Available Quantity',
						}
			  		})				  
				}
			  	if(this.state.websiteModel === "MarketPlace"){
					this.getVendorList();
			  	}
		 	});
	  	})
	  	.catch(error=>{
		 	console.log("Error in getting adminPreference = ", error);
	  	}) 

		// this.getCount();
		this.getData(this.state.startRange, this.state.limitRange);

		this.getSectionData();
		// this.productCountByStatus();
	}


		/**=========== getVendorList() ===========*/
		getVendorList() {
			axios.get("/api/entitymaster/get/filter/vendor")
			.then(response =>{
				  if (response.data && response.data.length > 0) {
					var vendorArray = [{
						name    	: "vendor",
						label 	: "All",
						value 	: ""
					}];
	
					for (var i = 0; i < response.data.length; i++) {
						vendorArray.push({
							name    	: "vendor",
							label 	: response.data[i].companyName,
							value 	: response.data[i]._id
						})
					}
					if (i >= response.data.length) {
						this.setState({
							  vendorArray : vendorArray
						},()=>{})
					}
				  }else{
					this.setState({
						vendorArray : []
					})
				  }
			})
			.catch(error=>{
				  console.log("Error => ", error);
			})
		}

	/**=========== getSectionData() ===========*/
	getSectionData() {
		axios.get("/api/sections/get/filter/sections")
		.then(response =>{
		  if (response.data && response.data.length > 0) {
				var sectionArray = [{
					 name    : "section",
					 label : "All",
					 value : ""
				}];
				for (var i = 0; i < response.data.length; i++) {
					 sectionArray.push({
						  name    : "section",
						  label : response.data[i].section,
						  value : response.data[i]._id
					 })
				}
				if (i >= response.data.length) {
					 this.setState({
						  sectionArray : sectionArray
					 },()=>{})
				}
		  }else{
				this.setState({
					 sectionArray : []
				})
		  }
		})
		  .catch(error=>{
		  console.log("Error => ", error);
		  })
	}

	/**===========  ===========*/
	getCategoryData(section_id) {
		axios.get("/api/category/get/filter/categories/"+section_id)
		.then(response =>{    
		  if (response.data && response.data.length > 0) {
				var categoryArray = [{
					 name    : "category",
					 label : "All",
					 value : ""
				}];
				for (var i = 0; i < response.data.length; i++) {
					 categoryArray.push({
						  name : "category",
						  label : response.data[i].category,
						  value : response.data[i]._id
					 })
				}
				if (i >= response.data.length) {
					 this.setState({
						  categories      : response.data,
						  categoryArray  : categoryArray
					 },()=>{})
				}
		  }else{
				this.setState({
					 categoryArray : []
				})
		  }
		})
		  .catch(error=>{
		  console.log("Error => ", error);
		  }) 
	}

	/**=========== getSubCategoryData() ===========*/
	getSubCategoryData(category_id){

	 	if (this.state.categories && this.state.categories.length > 0) {
		  	var selectedcategory = this.state.categories.filter(category => String(category._id) === String(category_id))
		  	
		  	if (selectedcategory && selectedcategory.length > 0 && selectedcategory[0].subCategory && selectedcategory[0].subCategory.length > 0) {
				var subCategories   	= selectedcategory[0].subCategory;
				var subCategoryArray = [{
					name  : "subCategory",
				  	label : "All",
				  	value : ""
				}];
				for (var i = 0; i < subCategories.length; i++) {
					subCategoryArray.push({
						name 		: "subCategory",
						label 		: subCategories[i].subCategoryTitle,
						value 		: subCategories[i]._id
					})
				}
				if (i >= subCategories.length) {
					this.setState({
						subCategoryArray    : subCategoryArray
					},()=>{})
				}
		  	}
	 	}else{
		  	this.setState({
				subCategoryArray : []
		  	})
	 	}      
	}
	getData(){
		axios.get('/api/products/get/list')
		.then((response)=>{
				// console.log('response = ', response.data)
				this.setState({
					// allshopproductimages : response.data
					dataCount : response.data.length
				})
		})
		.catch((error)=>{
				console.log('error', error);
				if(error.message === "Request failed with status code 401"){
								var userDetails =  localStorage.removeItem("userDetails");
								localStorage.clear();
								swal({  
										title : "Your Session is expired.",                
										text  : "You need to login again. Click OK to go to Login Page"
								})
								.then(okay => {
										if (okay) {
												window.location.href = "/login";
										}
								});
						}
		})
}

getDatawithlimit(startRange , limitRange){
	
	let payload = {
		startRange : startRange,
		limitRange : limitRange,
	}

	axios.post('/api/products/get/list/limit',payload)
	.then((response)=>{
			// console.log('response 68 = ', response.data)
			this.setState({
				allshopproductimages : response.data
			})
	})
	.catch((error)=>{
			console.log('error', error);
			if(error.message === "Request failed with status code 401"){
							var userDetails =  localStorage.removeItem("userDetails");
							localStorage.clear();
							swal({  
									title : "Your Session is expired.",                
									text  : "You need to login again. Click OK to go to Login Page"
							})
							.then(okay => {
									if (okay) {
											window.location.href = "/login";
									}
							});
					}
	})
}

	getSearchText(searchText) {
		this.setState({
		searchText : searchText
		},()=>{
			console.log("this.state.searchText" ,this.state.searchText)
		this.getDatawithlimit(0, this.state.limitRange);
		})
	}

	productCountByStatus(){
		axios.get('/api/products/get/productCountByStatus')
		.then((response) => {
			this.setState({
				productCountByStatus: response.data
			})
		})
		.catch((error) => {

		})
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			'allshopproductimages':nextProps.productData,
		});
	}
	
	bulkuplodaProductImages(event){
		var itemCodeNotExist 	= '';
		var itemCodeNotExistArr = [];

		event.preventDefault();
		var productImage = [];

		if (event.currentTarget.files && event.currentTarget.files[0]) {
			for(var i=0; i<event.currentTarget.files.length; i++){
				var file = event.currentTarget.files[i];

				if (file) {
					var fileName  		= file.name; 
					var vendorID 		= file.name.split('-')[0];
					var productCode 	= file.name.split('-')[1];
					var itemCode 		= file.name.split('-')[2];
					var ext 			= fileName.split('.').pop();  

					if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="webp" || ext==="JPG" || ext==="PNG" || ext==="JPEG" || ext==="WEBP"){
						if (file) {
							var objTitle = { 
								fileInfo 	: file,
								vendorID 	: vendorID,
								productCode : productCode,
								itemCode 	: itemCode
							}
							if(itemCode && productCode){
							// if(itemCode){
								checkItemCode();
								async function checkItemCode(){
									// const res = await axios.get('api/products/check-item-code-exits/'+itemCode);
									// const { data } = await res;
									// // console.log("data",data) ;
									// if(!data.exists){
									//   itemCodeNotExist = data.message;
									//   itemCodeNotExistArr.push({"message" :data.message});
									//   // console.log("itemCodeNotExistArr push",itemCodeNotExistArr);
									// }else{
										productImage.push(objTitle);
									// }
								}
							}											
						}else{          
							swal("Images are not uploaded");  
						}//file
					}else{ 
						swal("Your "+fileName+" image has format of "+ext+". Allowed images formats are (jpg,png,jpeg)");
					}//file types
				}//file
				// this.setState({
				//   itemCodeNotExist : itemCodeNotExistArr.length
				// })
			}//for 

			if(i >= event.currentTarget.files.length){
				this.setState({
					productImage : productImage,
					// itemCodeNotExist : itemCodeNotExistArr
				},()=>{
					// console.log("itemCodeNotExistArr",itemCodeNotExistArr)
				});  
					
				const main = async ()=>{
					var config = await getConfig();
					
					if(config){                    
						var s3urlArray 	= [];
						var imageLength = 100;
						var z 			= 0;

						for (var i = 0; i<productImage.length; i++) {
							var compressed_image 	= await handleCompressedUpload(productImage[i].fileInfo);
							compressed_image.name 	= compressed_image.name.split(".")[0]+"_small_image."+compressed_image.name.split(".")[1];

							var productSmallImage 	= await s3upload(compressed_image, config, this);
							var s3url 				= await s3upload(productImage[i].fileInfo, config, this);
							var x 					= i + 1;
							var progressLength 		= (x/productImage.length) * 100;
							
							this.setState({
								progressLength : parseInt(progressLength)
							})

							s3urlArray.push({
								productImage 		: s3url,
								productSmallImage  	: productSmallImage,
								vendorID 			: productImage[i].vendorID,
								productCode 		: productImage[i].productCode,
								itemCode 			: productImage[i].itemCode
							});
						}
						const formValues = {
							"product_ID"        : "",
							"productImage"      : s3urlArray,
							"status"            : "New"
						};
						return Promise.resolve(formValues);
					}
				}
				main().then(formValues=>{
					var newImages = this.state.productImageArray;
					
					newImages.push(formValues.productImage);
					this.setState({
						productImageArray : _.flatten(newImages)
					})
				});

				function handleCompressedUpload (e)  {
					return new Promise(function(resolve,reject){
						new Compressor(e,{
							quality 	: 0.8, // 0.6 can also be used, but its not recommended to go below.
							height  	: 300,
							width 		: 220,

							success: async (compressedResult) => {
								resolve(compressedResult);
							},
						});
					});
				};

				function s3upload(image,configuration){
					return new Promise(function(resolve,reject){
						S3FileUpload
						.uploadFile(image,configuration)
						.then((Data)=>{
							resolve(Data.location);
						})
						.catch((error)=>{
							console.log(error);
							if(error.message === "Request failed with status code 401"){
								var userDetails =  localStorage.removeItem("userDetails");
								localStorage.clear();
								swal({  
										title : "Your Session is expired.",                
										text  : "You need to login again. Click OK to go to Login Page"
								})
								.then(okay => {
									if (okay) {
										window.location.href = "/login";
									}
								});
							}
						})
					})
				}   

				function getConfig(){
					return new Promise(function(resolve,reject){                      
						axios.get('/api/projectSettings/get/S3')
						.then((response)=>{
							if(response.data){
								const config = {
									bucketName      : response.data.bucket,
									dirName         : 'propertiesImages',
									region          : response.data.region,
									accessKeyId     : response.data.key,
									secretAccessKey : response.data.secret,
								}
								resolve(config);                               
							}																 
						})
						.catch(function(error){
							console.log(error);
							if(error.message === "Request failed with status code 401"){
								var userDetails =  localStorage.removeItem("userDetails");
								localStorage.clear();
								swal({  
									title : "Your Session is expired.",                
									text  : "You need to login again. Click OK to go to Login Page"
								})
								.then(okay => {
									if (okay) {
										window.location.href = "/login";
									}
								});
							}
						})				
					})
				}        
			}
		}		
	}

	saveImages(event){
		event.preventDefault();
		for(var i=0; i<this.state.productImageArray.length; i++){
			var formValue = {
				productImage        : this.state.productImageArray[i].productImage,
				productSmallImage   : this.state.productImageArray[i].productSmallImage,
				vendorID      		: this.state.productImageArray[i].vendorID,
				productCode      	: this.state.productImageArray[i].productCode,
				itemCode      		: this.state.productImageArray[i].itemCode
			}
			axios.patch('/api/products/patch/bulkimages/', formValue)
			.then((response)=>{
				// console.log('itemCodeNotExist', this.state.itemCodeNotExist);
				this.getData();
				// if(this.state.itemCodeNotExist !== ''){
				//   swal(response.data.message+" some images not uploaded because item code does not exist");
				// }else{
				swal(response.data.message);

				//}
				$(':input').val('');
			})
			.catch((error)=>{
				console.log('error', error);
				if(error.message === "Request failed with status code 401"){
					var userDetails =  localStorage.removeItem("userDetails");
					localStorage.clear();
					swal({  
						title : "Your Session is expired.",                
						text  : "You need to login again. Click OK to go to Login Page"
					})
					.then(okay => {
						if (okay) {
							window.location.href = "/login";
						}
					});
				}
			})
		}
		this.setState({
			productImageArray : [],
			itemCode : []
		})
	}
	
	getUploadBulUSPercentage(){
	}

	deleteproductImages(event){
		event.preventDefault(); 
		var id  			= event.target.getAttribute('data-productid');
		var image 			= event.target.getAttribute('data-image');
		var imageName 		= image.split("/").pop();
		var smallImageName 	= imageName.split(".")[0] + "_small_image." + imageName.split(".")[1];
		var split 			= image.split("/");
		var smallImageLink  = split.slice(0, split.length - 1).join("/") + "/" + smallImageName;
		
		console.log("image => ", image)
		console.log("smallImageLink => ", smallImageLink)
		
		var formValues = {
			product_ID  	: id,
			imageLink 		: image,
			smallImageLink 	: smallImageLink
		}

		swal({
			title 		: "Are you sure you want to delete this image?",
			text 		: "Once deleted, you will not be able to recover this image!",
			// icon 		: "warning",
			buttons 	: true,
			dangerMode 	: true,
		})
		.then((success) => {
			if (success) {
				swal("Your image is deleted!");
				
					axios.patch('/api/products/remove/image', formValues)
					.then((res)=>{
						this.getData();
					})
					.catch((error)=>{
						console.log('errro', error);
					})
			
			} else {
				swal("Your image is safe!");
			}
		});

 
	}
	showItemCodeError(e){
		e.preventDefault();
		swal("Itemcode of selected images not exists.")
	}


		 /**=========== handleChangeFilters() ===========*/
		 handleChangeFilters(event){     
			var name    = event.name;
  
			this.setState({ 
				  [name]  : event
			},()=>{
				  if (name === "section") {
					   this.setState({
							category    : null,
							subCategory : null
					   })
					   this.getCategoryData(this.state[name].value);
				  }
				  if (name === "category") {
					   this.setState({
							subCategory : null
					   })
					   this.getSubCategoryData(this.state[name].value);
				  }
				  this.getDataSection(0, this.state.limitRange);
			});
	   };
	   
	   getDataSection(startRange, limitRange) {
		// this.setState({ 
		// 	messageData 		: {}, 
		// 	isLoadingData 		: true			
		// })

		var formValues = {		  	
			startRange 		: startRange,
            limitRange 		: limitRange,
            searchText 		: this.state.searchText,
			vendor 			: this.state.vendor ? this.state.vendor.value : "",
			section 		: this.state.section ? this.state.section.value : "",
			category 		: this.state.category ? this.state.category.value : "",
			subCategory 	: this.state.subCategory ? this.state.subCategory.value : "",
			status 			: this.state.status ? this.state.status.value : ""
		}
		// this.getCount(formValues);
		axios.post('/api/products/get/list/filter', formValues)
		.then((response) => {
			console.log("reponse for admin 647 list =======",response.data.data);
		  	// var tableData = response.data.data.map((a, i) => {
			//   	// console.log("a.vendorName----",a);
			// 	  return {
			// 		productCode 		: a.productCode,
			// 		productName 		: a.productName,
			// 		itemCode 			: a.itemCode,
			// 		// vendor  				: a.vendorName,
			// 		section  			: a.section,
			// 		category 			: a.category,
			// 		subCategory 		: a.subCategory,
			// 		// brand 				: a.brand,
			// 		originalPrice 		: "<div class='whiteSpaceNoWrap'>" + (this.state.currency && this.state.currency !== undefined ? this.state.currency : "") + " " + a.originalPrice + "</div>",
			// 		// discountPercent 	: a.discountPercent,
			// 		// discountedPrice 	: "<div class='whiteSpaceNoWrap'>" + (this.state.currency && this.state.currency !== undefined ? this.state.currency : "") + " " + a.discountedPrice + "</div>",
			// 		status  				: a.status,
			// 		// featured  			: a.featured,
			// 		// exclusive  			: a.exclusive,
			// 		_id 					: a._id
			// 	}
		  	// })
		 	this.setState({
		 		// dataCount 		: response.data.dataCount,
				 allshopproductimages 			: response.data.data,
			  	// isLoadingData 		: false,
			  	// unCheckedProducts : false
		 	})
		})
		.catch((error) => {
			console.log('error', error);
		})
	}
	   

	   getCategoryData(section_id) {
		axios.get("/api/category/get/filter/categories/"+section_id)
		.then(response =>{    
		  if (response.data && response.data.length > 0) {
				var categoryArray = [{
					 name    : "category",
					 label : "All",
					 value : ""
				}];
				for (var i = 0; i < response.data.length; i++) {
					 categoryArray.push({
						  name : "category",
						  label : response.data[i].category,
						  value : response.data[i]._id
					 })
				}
				if (i >= response.data.length) {
					 this.setState({
						  categories      : response.data,
						  categoryArray  : categoryArray
					 },()=>{})
				}
		  }else{
				this.setState({
					 categoryArray : []
				})
		  }
		})
		  .catch(error=>{
		  console.log("Error => ", error);
		  }) 
	}
		/**=========== getSubCategoryData() ===========*/
		getSubCategoryData(category_id){

			if (this.state.categories && this.state.categories.length > 0) {
				 var selectedcategory = this.state.categories.filter(category => String(category._id) === String(category_id))
				 
				 if (selectedcategory && selectedcategory.length > 0 && selectedcategory[0].subCategory && selectedcategory[0].subCategory.length > 0) {
				   var subCategories   	= selectedcategory[0].subCategory;
				   var subCategoryArray = [{
					   name  : "subCategory",
						 label : "All",
						 value : ""
				   }];
				   for (var i = 0; i < subCategories.length; i++) {
					   subCategoryArray.push({
						   name 		: "subCategory",
						   label 		: subCategories[i].subCategoryTitle,
						   value 		: subCategories[i]._id
					   })
				   }
				   if (i >= subCategories.length) {
					   this.setState({
						   subCategoryArray    : subCategoryArray
					   },()=>{})
				   }
				 }
			}else{
				 this.setState({
				   subCategoryArray : []
				 })
			}      
	   }
   
	render(){
		return( 

			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div className="formWrapper">
							<section className="col-lg-12 col-md-12 col-xs-12 col-sm-12 content">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
									<div className="row">
										<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
											<h4 className="weighttitle NOpadding-right"> Product Bulk Image Upload </h4>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent montserrat">
												<div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 bulkEmployeeVerif ">
													<h5 className="montserrat">Instructions:</h5>
													<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 upldImgTextColor NOPadding">
														Image name must be saved in format <span className="upldImgTextColor1">Your Vendor Company ID</span> - <span className="upldImgTextColor1">Your Product Code</span> - <span className="upldImgTextColor1">Your Item Code</span> - <span className="upldImgTextColor2">Image Number for that product. </span><br/>
														<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
															<li>VendorCompanyID -> V1</li>
															<li>ProductCode 	-> P1</li>
															<li>ItemCode 		-> I1</li>
															<li>Image Numbers   -> 01,02,03</li>
														</ul>
													</div>
													<b>Examples : </b>
													<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<li>V1-P1-I1-01</li>
														<li>V1-P1-I1-02</li>
														<li>V1-P1-I1-03</li>
													</ul>
												</div>
											</div>
										</div>
										<form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addRolesInWrap newTemplateForm">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageForm">
												<div className="col-lg-4 col-lg-offset-3  col-md-4 col-md-offset-3 col-sm-12 col-xs-12 marginTopp">
													<div className="form-group">
														<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category imageuploadtitle">
															Upload Product Images 
														</label>
														<input type="file" className="form-control bulkuplodaProductImagesInp" multiple onChange ={this.bulkuplodaProductImages.bind(this)}/>
														<div>{this.getUploadBulUSPercentage()}</div>
													</div>
												</div>
												{/* {console.log("itemCodeNotExist",this.state.itemCodeNotExist)} */}
												
													{this.state.progressLength === 100 ?
													<div className="col-lg-4  col-md-4 col-sm-12 col-xs-12 marginTopp">
														<div className="form-group">
															<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category imageuploadtitle">&nbsp; </label>
															<button className="btn btn-primary" onClick={this.saveImages.bind(this)}>Save Images</button>
														</div>
													</div>
													: null
													 }
												{/* :
												// this.state.itemCodeNotExist ? 
												<div className="col-lg-4  col-md-4 col-sm-12 col-xs-12 marginTopp">
														<div className="form-group">
														<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category imageuploadtitle">&nbsp; </label>
															<button className="btn btn-primary" onClick={this.showItemCodeError.bind(this)}>Save Images</button>
														</div>
												</div>
												:'' */}
											
												
												<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
													{/* <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-xs-12 col-sm-12 upldImgTextColor">
														Image name must be saved in format <span className="upldImgTextColor1">Your Vendor Company ID</span> - <span className="upldImgTextColor1">Your Product Code</span> - <span className="upldImgTextColor1">Your Item Code</span> - <span className="upldImgTextColor2">Image Number for that product. </span>
														eg. VendorCompanyID-ProductCode-ItemCode-01, VendorCompanyID-ProductCode-ItemCode-02, VendorCompanyID-ProductCode-ItemCode-03, ... etc.
													</div> */}
													{
														this.state.progressLength === 0 || this.state.progressLength === 100 ?
														null
														:
														<div className="progress img-progress col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-xs-12 col-sm-12 NOpadding">
															<div className="progress-bar col-lg-12 col-md-12 col-xs-12 col-sm-12" role="progressbar" style={{width:""+this.state.progressLength+"%" }}>
																<span className="img-percent" style={{background:"#337ab7"}}>{this.state.progressLength}% Complete</span>
															</div>
														</div>
													}
													
													<div className="col-lg-12">
														{
															this.state.notuploadedImages.length > 0 ?

																<div className="notBlkUplImgListOuter">
																	<div className="notBlkUplImgListTitle">
																		Images not Uploaded
																	</div>
																	{
																		this.state.notuploadedImages.map((data, index)=>{
																			return (
																				<div className="notBlkUplImgList" key={index}> 
																					{data}
																				</div>
																			);
																		})
																	}
																</div>
															:

															""
														} 
													</div>
												</div>										
											</div>
										</form>
										 

										<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
											<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
												<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOPadding">
													<div className="HRMSWrapper col-lg-12 col-md-12 col-xs-12 col-sm-12 NOPadding">
														{/* <table className="table iAssureITtable-bordered table-striped table-hover">
															<thead className="tempTableHeader">
																<tr >
																	<th className="col-lg-1 umDynamicHeader srpadd">Sr no.</th>
																	<th className="col-lg-2 umDynamicHeader srpadd">Product Code</th>
																	<th className="col-lg-2 umDynamicHeader srpadd">Item Code</th>
																	<th className="col-lg-2 umDynamicHeader srpadd">Product Name</th>
																	<th className="col-lg-7 umDynamicHeader srpadd">Images</th>
																</tr>
															</thead>
															<tbody>
																{  
																	this.state.allshopproductimages.map((data,index)=>{
																		
																		return(
																			<tr key ={index}>
																				<td> {index+1} </td>
																				<td> {data.productCode} </td>
																				<td> {data.itemCode} </td>
																				<td> {data.productName} </td>
																				<td>
																				{
																					data.productImage.length > 0 ? 
																						<div className="col-lg-12 col-md-12 col-sm-12, col-xs-12 deleteimagewrapper bulkimagebg">  
																							{  
																								data.productImage.map((imgdata,index)=>{
																									return(
																										<div className="deleteImgBlkUpldCol" key={index}>
																											<i className="fa fa-times deleteImgBlkUpldSign" aria-hidden="true" data-image={imgdata} data-productid={data._id}   onClick={this.deleteproductImages.bind(this)}></i>
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
																		)
																	})
																}   
															</tbody>
														</table> */}



								<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left NOpadding-right">
									 <h4 className="weighttitle NOpadding-right"> Product Image List</h4>
								</div> 

								{/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt NOPadding">
									<div className="col-lg-3">
										<div className="publishedBox" >
											<span className="publishedBoxIcon bg-aqua"><i className="fa fa-shopping-cart"></i></span>
											<div className="publishedBoxContent">
												<span className="publishedBoxtext">Total Products</span><br />
												<span className="publishedBoxNumber">{Array.isArray(this.state.productCountByStatus)&&this.state.productCountByStatus.length>0 ? this.state.productCountByStatus[0].total : 0}</span>
											</div>
										</div>
									</div>
									<div className="col-lg-3">
									  	<div className="publishedBox" >
											<span className="publishedBoxIcon bg-green"><i className="fa fa-shopping-cart"></i></span>
											<div className="publishedBoxContent">
												<span className="publishedBoxtext">Published Products</span><br />
												<span className="publishedBoxNumber">{Array.isArray(this.state.productCountByStatus)&&this.state.productCountByStatus.length>0 ? this.state.productCountByStatus[0].totalPublish : 0}</span>
											</div>
									  	</div>
								 	</div>
								 	<div className="col-lg-3">
									  	<div className="publishedBox" >
											<span className="publishedBoxIcon bg-redcolor"><i className="fa fa-shopping-cart"></i></span>
											<div className="publishedBoxContent">
												<span className="publishedBoxtext">Unpublished Products</span><br />
												<span className="publishedBoxNumber">{Array.isArray(this.state.productCountByStatus)&&this.state.productCountByStatus.length>0 ? this.state.productCountByStatus[0].totalUnpublish : 0}</span>
											</div>
									  	</div>
								 	</div>
								 	<div className="col-lg-3">
									  	<div className="publishedBox" >
											<span className="publishedBoxIcon bg-yellow"><i className="fa fa-shopping-cart"></i></span>
											<div className="publishedBoxContent">
												<span className="publishedBoxtext">Draft Products</span><br />
												<span className="publishedBoxNumber">{Array.isArray(this.state.productCountByStatus)&&this.state.productCountByStatus.length>0 ? this.state.productCountByStatus[0].totalDraft : 0}</span>
											</div>
									  	</div>
								 	</div>
								</div> */} 
							 	{/* <div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NoPadding">
								  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
								  		<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12">
											<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Bulk Action</label>
											<Select
												value       = {this.state.bulkAction}
												name        = "bulkAction"
												onChange    = {this.bulkActionChange.bind(this)}
												options     = {this.state.bulkActionArray}
										  	/>
								  		</div>
								  	</div>
								</div> */}
								<div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NOPadding"><br/>                                    
									<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Section</label>
										<Select
											value       = {this.state.section}
											name        = "section"
											onChange    = {this.handleChangeFilters.bind(this)}
											options     = {this.state.sectionArray}
									  	/>
									</div>
									<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Category</label>
										<Select
											value       = {this.state.category}
											name        = "category"
											onChange    = {this.handleChangeFilters.bind(this)}
											options     = {this.state.categoryArray}
									  	/>
									</div>
									<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">SubCategory</label>
										<Select
										  	value       = {this.state.subCategory}
										  	name        = "subCategory"
										  	onChange    = {this.handleChangeFilters.bind(this)}
										  	options     = {this.state.subCategoryArray}
									  	/>
									</div>
									{/* <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Status</label>
										<Select
											value       = {this.state.status}
											name        = "status"
											onChange    = {this.handleChangeFilters.bind(this)}
											options     = {this.state.statusArray}
									  	/>
									</div>                               */}
							  	</div>

							  	{this.state.preference === "MarketPlace"  || this.state.websiteModel === "MarketPlace"
								? 
									<div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NOPadding">
										<div className="form-group col-lg-offset-3 col-lg-6 col-md-offset-3 col-md-6 col-sm-12 col-xs-12">
										  	<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Vendor</label>
										  	<Select
												value       = {this.state.vendor}
												name        = "vendor"
												onChange    = {this.handleChangeFilters.bind(this)}
												options    	= {this.state.vendorArray}
											/>
									 	</div>
									</div> 
								:
									null 
							  	}													  	



														
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">	 
								<IAssureTable
									tableHeading			= {this.state.tableHeading}
									// twoLevelHeader 		= {this.state.twoLevelHeader}
									dataCount 				= {this.state.dataCount}
									tableData 				= {this.state.allshopproductimages}
									getData 					= {this.getDatawithlimit.bind(this)}
									tableObjects 			= {this.state.tableObjects}
									// selectedProducts 		= {this.selectedProducts.bind(this)}
									getSearchText 			= {this.getSearchText.bind(this)}
									// setunCheckedProducts = {this.setunCheckedProducts.bind(this)}
									// unCheckedProducts 	= {this.state.unCheckedProducts}
									// saveProductImages 	= {this.saveProductImages.bind(this)}
									// isLoading          	= {this.state.isLoadingData}
								/>	
							</div>


													</div>
												</div>
											</div>
										</div>

								</div>
							</div>
						</section>
						</div>
					</div>
				</div>
			</div>           
		);
	}
}
export default BulkProductImageUpload ;