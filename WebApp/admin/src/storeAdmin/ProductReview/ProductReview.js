import React, { Component }   from 'react';
import axios                  from 'axios';
import Select 						from 'react-select';
import IAssureTable           from "./ProductReviewTable/IAssureTable.jsx";
import moment                 from "moment";
import "./Productreview.css";


class Productreview extends Component{
	constructor(props) { 
		super(props);
		this.state = {
			vendor                          : null,
			section                         : null,             
			category                        : null,
			subCategory                     : null,
			status                    			: null,
			vendorArray                     : [],       
			sectionArray                    : [],       
			categoryArray                   : [],       
			subCategoryArray                : [],
			statusArray               			: [
															{name : 'status', label : 'All', value : ""},
															{name : 'status', label : 'New', value : "New"},
															{name : 'status', label : 'Published', value : "Published"},
															{name : 'status', label : 'Rejected', value : "Rejected"},
															],
			tableHeading    						: {
															"orderNumber"       : "Order Number",
															"productName"       : "Product Name(Product Code)",
															"vendorName"        : 'Vendor Name',
															"section"        	: 'Section',
															"category"          : 'Category',
															"subCategory"       : 'SubCategory',
															"customerName"      : 'Customer Name',
															"customerReview"    : 'Customer Review',
															"reviewDate"        : 'Review Date',
															"adminComment"      : 'Admin Comment',
															// "publishOrReject"   : 'Publish/Reject',
															"status"            : 'Status',
															"rating"            : 'Rating',
														},
			tableObjects    						: {
															paginationApply 	: true,
															searchApply     	: true,
															searchPlaceholder : "Search Products by Product Name, Vendor Name, Section, Category, subCategory, Order Number etc...",
															deleteMethod    	: 'delete',
															apiLink         	: '/api/customerReview',
															editUrl         	: '/add-product/'
														},
			startRange                     	: 0,
			limitRange                       : 10,
			dataCount                        : 0,
			isLoadingData                    : false,
			searchText                       : ""
		};
		window.scrollTo(0, 0);
	}

	 /**=========== handleChange() ===========*/
	 handleChange(event){
		  const target = event.target;
		  const name   = target.name;
		  this.setState({
				[name]: event.target.value,
		  });
	 }

	 /**=========== componentDidMount() ===========*/
	 componentDidMount() {
		  this.getData(this.state.startRange, this.state.limitRange);   
		  this.getSectionData();
		  this.getVendorList();     
	 }

	 /**=========== getVendorList() ===========*/
	 getVendorList() {
		axios.get("/api/entitymaster/get/filter/vendor")
		.then(response =>{
		  if (response.data && response.data.length > 0) {
				var vendorArray = [{
					 name  : "vendor",
					 label : "All",
					 value : ""
				}];
				for (var i = 0; i < response.data.length; i++) {
					 vendorArray.push({
						  name  : "vendor",
						  label : response.data[i].companyName,
						  value : response.data[i]._id
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

	 /**===========  ===========*/
	getSubCategoryData(category_id){

	 if (this.state.categories && this.state.categories.length > 0) {

		  var selectedcategory = this.state.categories.filter(category => String(category._id) === String(category_id))
		  if (selectedcategory && selectedcategory.length > 0 && selectedcategory[0].subCategory && selectedcategory[0].subCategory.length > 0) {
				var subCategories   = selectedcategory[0].subCategory;
				var subCategoryArray = [{
					 name    : "subCategory",
						  label : "All",
						  value : ""
				}];
				for (var i = 0; i < subCategories.length; i++) {
					 subCategoryArray.push({
						  name : "subCategory",
						  label : subCategories[i].subCategoryTitle,
						  value : subCategories[i]._id
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
	 	console.log("searchText => ",searchText)
		  this.setState({
				searchText : searchText
		  },()=>{
				this.getData(0, this.state.limitRange);
		  })
	}

	 /**=========== getData() ===========*/
	 getData(startRange, limitRange){
	 	this.setState({isLoadingData : true})
		  var formValues = {
         startRange 		: startRange,
         limitRange 		: limitRange,
         searchText 		: this.state.searchText,
			vendor 			: this.state.vendor ? this.state.vendor.value : "",
			section 			: this.state.section ? this.state.section.value : "",
			category 		: this.state.category ? this.state.category.value : "",
			subCategory 	: this.state.subCategory ? this.state.subCategory.value : "",
			status 			: this.state.status ? this.state.status.value : "",
      }
		  axios.post('/api/customerReview/get/list', formValues)
		  .then((response)=>{
		  	console.log("response => ",response.data)
				var tableData = response.data.data.map((a, ind)=>{
					 return{
						  "_id"               : a._id,
						  "orderNumber"       : a.orderDetails[0] && a.orderDetails[0].orderID ? a.orderDetails[0].orderID : "-",
						  "productName"       : a.productDetails[0] && a.productDetails[0].productName ? ("<b>" +  a.productDetails[0].productName + "</b> </br> <div class=whiteSpaceNoWrap> ProductCode : " + a.productDetails[0].productCode  + " </br> </div><div class=whiteSpaceNoWrap> ItemCode : " + a.productDetails[0].productCode  + "</div>" ) : "",
						  "vendorName"        : a.vendorDetails[0] && a.vendorDetails[0].companyName ? a.vendorDetails[0].companyName : "",
						  "section"        	: a.sectionDetails[0] && a.sectionDetails[0].section ? a.sectionDetails[0].section : "",
						  "category"        	: a.categoryDetails[0] && a.categoryDetails[0].category ? a.categoryDetails[0].category : "",
						  "subCategory"       : a.productDetails[0] && a.productDetails[0].subCategory ? a.productDetails[0].subCategory : "-",
						  "productImages"     : a.productDetails[0] && a.productDetails[0].productImage ? a.productDetails[0].productImage : "",
						  "customerName"      : a.customerName,
						  "customerReview"    : a.customerReview, 
						  "reviewDate"        : "<div class='whiteSpaceNoWrap'> " + moment(a.createdAt).format('MMM Do YYYY') + "</div>" + "<div>" + moment(a.createdAt).format('hh:mm a') + "</div>",             
						  "adminComment"      : a.adminComment ? a.adminComment : "-",
						  "orderID"           : a.orderID,
						  "productID"         : a.productID,
						  // "publishOrReject"   : "<div class='publishOrReject'><i class='fa fa-times-circle reviewActionBtns padding-15-0 " + (a.status === 'Rejected' ? 'rejectedActive' : '') +  "'name='Rejected' id='Rejected' title='Reject Customer Review' onclick=window.changeReviewStatus('"+ a._id + "-" + "Rejected" +"')></i>"+
						  //                         "<i class='fa fa-check-circle reviewActionBtns padding-15-0 " + (a.status === 'Published' ? 'publishedActive' : '') + "'name='Published' id='Published' title='Publish Customer Review' onClick=window.changeReviewStatus('"+ a._id + "-" + "Published" +"')></i></div>",
						  "status"            : "<div class='reviewStatusSpan review-" + a.status.toLowerCase() + "'>" + a.status + "</div>",
						  "rating"            : a.rating,
					 };
				})
				this.setState({
					dataCount 		: response.data.dataCount,
					tableData 		: tableData,
					isLoadingData 	: false
				},()=>{
					
				})
		  })
		  .catch((error)=>{
				console.log('error', error);
		  })
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

	 /**=========== render() ===========*/
	 render(){
		  return(
				<section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 content NOPadding">
					 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pageContent">
						  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
								<div className="box">
									 <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
										  <h4 className="weighttitle NOpadding-right">Returned Products</h4>
									 </div>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt NOPadding">
									 <div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NOPadding">                                    
										  <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Section</label>
												<Select
													 value       = {this.state.section}
													 name            = "section"
													 onChange    = {this.handleChangeFilters.bind(this)}
													 options         = {this.state.sectionArray}
												/>
										  </div>
										  <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Category</label>
												<Select
													 value       = {this.state.category}
													 name            = "category"
													 onChange    = {this.handleChangeFilters.bind(this)}
													 options         = {this.state.categoryArray}
												/>
										  </div>
										  <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">SubCategory</label>
												<Select
													 value       = {this.state.subCategory}
													 name            = "subCategory"
													 onChange    = {this.handleChangeFilters.bind(this)}
													 options         = {this.state.subCategoryArray}
												/>
										  </div>
										  <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Status</label>
												<Select
													 value       = {this.state.status}
													 name            = "status"
													 onChange    = {this.handleChangeFilters.bind(this)}
													 options         = {this.state.statusArray}
												/>
										  </div>                              
									 </div>
									 <div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NOPadding">
										  <div className="form-group col-lg-offset-3 col-lg-6 col-md-offset-3 col-md-6 col-sm-12 col-xs-12">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Vendor</label>
												<Select
													 value       = {this.state.vendor}
													 name            = "vendor"
													 onChange    = {this.handleChangeFilters.bind(this)}
													 options         = {this.state.vendorArray}
												/>
										  </div>
									 </div>                                     
								
									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
										  <IAssureTable 
												tableHeading    = {this.state.tableHeading}
												twoLevelHeader  = {this.state.twoLevelHeader} 
												dataCount       = {this.state.dataCount}
												tableData       = {this.state.tableData}
												getData         = {this.getData.bind(this)}
												tableObjects    = {this.state.tableObjects}
												getSearchText   = {this.getSearchText.bind(this)}
												isLoading    		= {this.state.isLoadingData}
										  />
									 </div>              
								</div>
						  </div>
					 </div>
				</section>
		  );
	 }
}
export default Productreview ;