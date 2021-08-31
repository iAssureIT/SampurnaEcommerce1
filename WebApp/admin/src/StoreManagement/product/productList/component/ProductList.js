import React, { Component } from 'react';
import axios                from 'axios';
import swal                 from 'sweetalert2';
import Select               from 'react-select';
import _                    from 'underscore';
import $                    from "jquery";
import { CheckBoxSelection, 
	 Inject, 
	 MultiSelectComponent }  from '@syncfusion/ej2-react-dropdowns';
import Message              from '../../../../storeAdmin/message/Message.js';
import IAssureTable         from "../../ProductTable/IAssureTable.jsx";

import '../css/productList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-react-dropdowns/styles/material.css";

const swalWithBootstrapButtons = swal.mixin({
  	customClass : {
   	confirmButton 	: 'btn btn-success',
    	cancelButton 	: 'btn btn-danger'
  	},
  	buttonsStyling : false
})
class ProductList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bulkActionArray 		: [
											{name : 'bulkAction', label : 'Publish Selected Products', value : 'Publish'},
											{name : 'bulkAction', label : 'Draft Selected Products', value : 'Draft'},
											{name : 'bulkAction', label : 'Unpublish Selected Products', value : 'Unpublish'},
											{name : 'bulkAction', label : 'Delete Selected Products', value : 'Delete'}
										],
			statusArray 			: [
											{name : 'status', label : 'All', value : ''},
											{name : 'status', label : 'Publish', value : 'Publish'},
											{name : 'status', label : 'Draft', value : 'Draft'},
											{name : 'status', label : 'Unpublish', value : 'Unpublish'}
										],
			tableHeading 			: {
				productName       : 'Product Details',
				vendor 				: 'Vendor Name',
				section           : 'Section',
				category 			: 'Category',
				subCategory 		: 'SubCategory',
				brand 				: 'Brand',
				originalPrice 		: 'Original Price',
				discountPercent 	: 'Discount Percent',
				discountedPrice 	: 'Discounted Price',
				// "availableQuantity": 'Available Quantity',
			},
			tableObjects 			: {
				paginationApply 	: true,
				searchApply 		: true,
				deleteMethod 		: 'delete',
				apiLink 				: '/api/products',
				editUrl 				: '/add-product/'
			},
			startRange 				: 0,
			limitRange 				: 10,
			selector 				: {},
			unCheckedProducts 	: false,
			isLoadingData 			: false
		};
		window.scrollTo(0, 0);
	}

	handleChange(event) {
	  const name 	= event.target.name;
	  this.setState({
			[name] : event.target.value,
	  });
	}

	componentDidMount() {
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
		this.productCountByStatus();  
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

	/**=========== getSearchText() ===========*/
	getSearchText(searchText) {
	  	this.setState({
			searchText : searchText
	  	},()=>{
			this.getData(0, this.state.limitRange);
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
	 
	getCount(formValues) {
	  	axios.post('/api/products/get/all/count',formValues)
		.then((response) => {
			console.log('dataCount', response.data.dataCount);
			this.setState({
			  	dataCount: response.data.dataCount
			})
		})
		.catch((error) => {
			console.log('error', error);
		})
	}

	getData(startRange, limitRange) {
		this.setState({ 
			messageData 		: {}, 
			isLoadingData 		: true			
		})

		var formValues = {		  	
			startRange 		: startRange,
         limitRange 		: limitRange,
         searchText 		: this.state.searchText,
			vendor 			: this.state.vendor ? this.state.vendor.value : "",
			section 			: this.state.section ? this.state.section.value : "",
			category 		: this.state.category ? this.state.category.value : "",
			subCategory 	: this.state.subCategory ? this.state.subCategory.value : "",
			status 			: this.state.status ? this.state.status.value : ""
		}
		this.getCount(formValues);
		axios.post('/api/products/get/list', formValues)
		.then((response) => {
			// console.log("reponse for admin list",response);
		  	var tableData = response.data.data.map((a, i) => {
			  	// console.log("a.vendorName----",a.vendorName);
				return {
					productName 		: a.productName,
					vendor  				: a.vendorName,
					section  			: a.section,
					category 			: a.category,
					subCategory 		: a.subCategory,
					brand 				: a.brand,
					originalPrice 		: "<div class='whiteSpaceNoWrap'>" + (this.state.currency && this.state.currency !== undefined ? this.state.currency : "") + " " + a.originalPrice + "</div>",
					discountPercent 	: a.discountPercent,
					discountedPrice 	: "<div class='whiteSpaceNoWrap'>" + (this.state.currency && this.state.currency !== undefined ? this.state.currency : "") + " " + a.discountedPrice + "</div>",
					status  				: a.status,
					featured  			: a.featured,
					exclusive  			: a.exclusive,
					_id 					: a._id
				}
		  	})
		 	this.setState({
		 		// dataCount 		: response.data.dataCount,
			  	tableData 			: tableData,
			  	isLoadingData 		: false,
			  	unCheckedProducts : false
		 	})
		})
		.catch((error) => {
			console.log('error', error);
		})
	}

	publishAllProducts(event) {
		event.preventDefault();

	  	var data = {
			publishData: _.pluck(this.state.tableData, '_id')
	  	};

	  	axios.put('/api/products/multiple', data)
		.then((response) => {
			swal({
				text: 'Product published successfully',
			});
		})
		.catch((error) => {
		 	swal({
			  	title: 'All products are published.',
		 	});
		});
	  	this.getData(this.state.startRange, this.state.limitRange);
 	}

	// getSearchText(searchText) {
	//   	this.setState({isLoadingData : true})
	//   	axios.get("/api/products/get/adminsearch/" + searchText)
	// 	.then((response) => {
	// 	 	this.setState({
	// 		  	tableData: response.data,
	// 		  	dataCount: response.data.length,
	// 		  	isLoadingData : false
	// 	 	});
	// 	})
	// 	.catch((error) => {
	// 		console.log('error', error);
	// 	})
	// }

 	filterProductCount(formValues) {
	  	axios.post('/api/products/post/adminFilterProductsCount', formValues)
		.then((response) => {
			this.setState({
				dataCount: response.data.dataCount
			}, () => {})
		})
		.catch((error) => {
			console.log("error = ", error);
		})
 	}

	 handleChangeFilter(event){
		  this.setState({ messageData:{} })
		  console.log("event.target--",event.target);
		  if (event.target) {
				var currentSelection = event.target.getAttribute("id");
		  }else{
				var currentSelection = event.element.getAttribute("id");
		  }
		  // var currentSelection = event.element.getAttribute("id");
		  var selector = this.state.selector;

		  if (currentSelection === 'vendorChange') {
				selector.vendorIds = event.target.value;
		  }
		  if (currentSelection === 'sectionChange') {
				selector.sectionIds = event.value;
		  }
		  if (currentSelection === 'categoryChange') {
				selector.categoryIds = event.value;
		  }
		  if (currentSelection === 'subCategoryChange') {
				selector.subCategoryIds = event.value;
		  }
		  if (currentSelection === 'statusChange') {
				selector.statusArray = event.value;
		  }
		  selector.startRange = this.state.startRange
		  selector.limitRange = this.state.limitRange


		  // this.setState({ selector: selector, isLoadingData : true })
		  this.filterProductCount(selector);

		  // console.log("Selector Value = ",this.state.selector);
		  axios.post('/api/products/post/list/adminFilterProducts', selector)
				.then((response) => {
					 console.log("filter response---------",response);
					  var tableData = response.data.map((a, i) => {
								return {
									 productName : a.productName,
									 section : a.section,
									 category: a.category,
									 subCategory: a.subCategory,
									 vendor : a.vendorName,
									 originalPrice: a.originalPrice,
									 discountPercent: a.discountPercent,
									 discountedPrice: a.discountedPrice,
									 status : a.status,
									 featured : a.featured,
									 exclusive : a.exclusive,
									 _id: a._id
								}
						  })


					 this.setState({
						  tableData: tableData,
						  // isLoadingData : false
					 },()=>{
							this.productCountByStatus();
					 })
					/* this.setState({
						  tableData: response.data,

					 },()=>{
						  this.productCountByStatus();
					 })*/
					 //this.getData(this.state.startRange, this.state.limitRange);
				})
				.catch((error) => {
					 console.log("error = ", error);
				})
	 }
	selectedProducts(checkedProductsList) {
	  	// console.log('checkedUsersList', checkedUsersList);
	  	this.setState({
			checkedProducts 	: checkedProductsList,
			messageData 		: {}
	  	})

	  	// console.log("this.state.checkedUser",this.state.checkedUser);
	}

 	setunCheckedProducts(value) {
	  	this.setState({
			unCheckedProducts: value,
			messageData: {}
	  	})
 	}

	 productBulkAction(event) {
		  var selectedAction = this.state.selectedAction
		  var formValues = {
				selectedProducts 	: this.state.checkedProducts,
				selectedAction		: this.state.selectedAction
		  }
		  axios.patch('/api/products/patch/productBulkAction', formValues)
				.then((response) => {
					 $('#bulkActionModal').hide();
					 var selectedAction = this.state.selectedAction.toLowerCase();
					 if(selectedAction === 'delete'){
						  selectedAction = 'deleted';
					 }else{
						  selectedAction = this.state.selectedAction.toLowerCase()+'ed';
					 }
					 this.setState({
						  messageData: {
								"type": "outpage",
								"icon": "fa fa-correct",
								"message": "Selected products are " + selectedAction + " successfully.",
								"class": "success",
								"autoDismiss": true
						  }
					 },()=>{
							$('.filterDropdown').val('-- Select --');
							this.productCountByStatus();
					 })

					 axios.post('/api/products/post/list/adminFilterProducts', this.state.selector)
						  .then((response) => {
								this.setState({
									 tableData: response.data
								},()=>{
									 // this.getData(this.state.startRange, this.state.limitRange);

									 // window.location.reload();
								})
						  })
						  .catch((error) => {
								console.log("error = ", error);
						  })
				})
				.catch((error) => {
					 this.setState({
						  messageData: {
								"type": "outpage",
								"icon": "fa fa-exclamation",
								"message": "Failed to perform action! ",
								"class": "danger",
								"autoDismiss": true
						  }
					 });
				})
	}
	bulkActionChange(event) {
	  	console.log("event.target.value => ",event);
	  	if (event.value) {
			this.setState({ 
				unCheckedProducts 	: false, 
				bulkAction 				: event, 
				messageData 			: {} 
			})
			if (this.state.checkedProducts && this.state.checkedProducts.length > 0) {
				swalWithBootstrapButtons.fire({
				  	title 				: 'Are you sure?',
				  	text 					: "Do you want to " + event.value.toLowerCase() + " selected products ?",
				  	icon 					: 'warning',
				  	showCancelButton 	: true,
				  	confirmButtonText : 'Yes, ' + event.value + ' it!',
				  	cancelButtonText 	: 'No, cancel!',
				  	reverseButtons 	: true
				}).then((result) => {
	  				if (result.isConfirmed) {
					  	var formValues 		= {
							selectedProducts 	: this.state.checkedProducts,
							selectedAction 	: this.state.bulkAction.value
					  	}

				  		axios.patch('/api/products/patch/productBulkAction', formValues)
						.then((response) => {
							this.setState({ 
								checkedProducts 		: [],
								unCheckedProducts 	: true,
								bulkAction 				: null,
							})
							this.getData(this.state.startRange, this.state.limitRange);
							
							this.setState({
								messageData: {
									"type" 			: "outpage",
									"icon"			: "fa fa-correct",
									"message"		: response.data.msg,
									"class"			: "success",
									"autoDismiss"	: true
								}
							},()=>{
								this.productCountByStatus();
							})
						})
						.catch((error) => {
							console.log("error => ",error)
							this.setState({ 
								checkedProducts 		: [],
								unCheckedProducts 	: true,
								bulkAction 				: null,
							})
						 	this.setState({
							  	messageData: {
									"type"			: "outpage",
									"icon"			: "fa fa-exclamation",
									"message"		: "Failed to perform action! ",
									"class"			: "danger",
									"autoDismiss"	: true
							  	}
						 	});
						})	
					}else if (result.dismiss === swal.DismissReason.cancel) {
						this.setState({ 
							checkedProducts 		: [],
							unCheckedProducts 	: true,
							bulkAction 				: null,
						})
					   swalWithBootstrapButtons.fire(
					      'Cancelled',
					      'Your bulk action is cancelled :)',
					      'info'
					   )
					}
				})
			} else {
				this.setState({ 
					bulkAction 	: null,
				})
				swalWithBootstrapButtons.fire(
			      'Oops',
			      'Please select products to perform bulk action',
			      'info'
			   )
			}
	  	} 
	}

	closeModal(event){
		$('#bulkActionModal').hide();
 	}
	 saveProductImages(productImage, productID, productImageArray) {
		  // var productImage = productImage;
		  var formValues = {
				"product_ID": productID,
				"productImage": productImageArray,
				"status": "New"
		  };
		  console.log('formValues', formValues);
		  axios.patch('/api/products/patch/gallery', formValues)
				.then((res) => {
					 this.setState({
						  messageData: {
								"type": "outpage",
								"icon": "fa fa-correct",
								"message": "Product image updated successfully",
								"class": "success",
								"autoDismiss": true
						  }
					 })
					 //this.props.history.push('/product-list')
				})
				.catch((error) => {
					 this.setState({
						  messageData: {
								"type": "outpage",
								"icon": "fa fa-exclamation",
								"message": "Failed to uppdate product images!",
								"class": "success",
								"autoDismiss": true
						  }
					 })
					 console.log("error = ", error);
				});

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
				this.getData(0, this.state.limitRange);
		  });
	 };

	render() {

		// maps the appropriate column to fields property
		// const fields: object = { text: 'vendor', value: 'id' };
		const sectionfields: object = { text: 'section', value: 'id' };
		const categoryfields: object = { text: 'category', value: 'id' };
		const subcategoryfields: object = { text: 'subCategory', value: 'id' };

		// const statusArray = [];
		// statusArray.push({ status: "Publish" })
		// statusArray.push({ status: "Draft" })
		// statusArray.push({ status: "Unpublish" })

		const statusfields: object = { text: 'status', value: 'status' };

		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">			 	
			  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
					<section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding content">
						<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
							{/*<div className="row">*/}
								<Message messageData={this.state.messageData} />

								<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left NOpadding-right">
									<h4 className="weighttitle NOpadding-right"> Product List</h4>
								</div>

								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt NOPadding">
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
								</div>
							 	<div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NoPadding">
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
								</div>
								<div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NOPadding">                                    
									<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Section</label>
										<Select
											value       = {this.state.section}
											name        = "section"
											onChange    = {this.handleChangeFilters.bind(this)}
											options     = {this.state.sectionArray}
									  	/>
									</div>
									<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Category</label>
										<Select
											value       = {this.state.category}
											name        = "category"
											onChange    = {this.handleChangeFilters.bind(this)}
											options     = {this.state.categoryArray}
									  	/>
									</div>
									<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">SubCategory</label>
										<Select
										  	value       = {this.state.subCategory}
										  	name        = "subCategory"
										  	onChange    = {this.handleChangeFilters.bind(this)}
										  	options     = {this.state.subCategoryArray}
									  	/>
									</div>
									<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Status</label>
										<Select
											value       = {this.state.status}
											name        = "status"
											onChange    = {this.handleChangeFilters.bind(this)}
											options     = {this.state.statusArray}
									  	/>
									</div>                              
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
							{/*</div>*/}																				
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">	 
								<IAssureTable
									tableHeading			= {this.state.tableHeading}
									twoLevelHeader 		= {this.state.twoLevelHeader}
									dataCount 				= {this.state.dataCount}
									tableData 				= {this.state.tableData}
									getData 					= {this.getData.bind(this)}
									tableObjects 			= {this.state.tableObjects}
									selectedProducts 		= {this.selectedProducts.bind(this)}
									getSearchText 			= {this.getSearchText.bind(this)}
									setunCheckedProducts = {this.setunCheckedProducts.bind(this)}
									unCheckedProducts 	= {this.state.unCheckedProducts}
									saveProductImages 	= {this.saveProductImages.bind(this)}
									isLoading          	= {this.state.isLoadingData}
								/>	
							</div>
						</div> 
					</section>
				</div>
			  	<div className="modal" id="bulkActionModal" role="dialog">
					<div className="modal-dialog">
						<div className="modal-content bulk-modal-content">
							<div className="modal-header">
								<button type="button" className="close" onClick={this.closeModal.bind(this)} data-dismiss="modal">&times;</button>
								<h3 className="modalTitle">Bulk Action</h3>
						  	</div>
						  	<div className="modal-body">
								<div className="confirmmsg" style={{ display: "none" }}>
									<label>Do you want to ?</label>
								</div>
								<div className="selectmsg" style={{ display: "none" }}>
									<label>Please select products to perform bulk action</label>
								</div>
								<br />
						  	</div>
						  	<div className="modal-footer"> 
								<button type="button" className="btn btn-default" id="bulkActionModalclose" onClick={this.closeModal.bind(this)} data-dismiss="modal">Close</button>
								<a href="#" className="btn btn-info" id="bulkActionModalbtn" data-dismiss="modal" onClick={this.productBulkAction.bind(this)} style={{"margin-bottom": 0,"margin-left": "5px"}}>Yes</a>
						  	</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default ProductList;