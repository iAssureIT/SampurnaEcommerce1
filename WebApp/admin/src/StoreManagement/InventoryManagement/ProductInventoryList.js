import React,{Component} 	from 'react';
import { render } 			from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';
import axios                from 'axios';
import $, { data } 					from "jquery";
import moment 				from "moment";
import Select               from 'react-select';
import swal         		from 'sweetalert';
import IAssureTable           from "../../coreadmin/IAssureTable/IAssureTable.jsx";
import { CheckBoxSelection, 
    Inject, 
    MultiSelectComponent }  from '@syncfusion/ej2-react-dropdowns';
import './ProductInventory.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';

export default class ProductInventoryList extends Component{
	
	constructor(props) {
	 super(props);
		this.state = {
			vendorArray 		: [],
			sectionArray 		: [],
			categoryArray 		: [],
			subCategoryArray 	: [],
			vendor 				: "",
			section 				: "",
			category 			: "",
			subCategory 		: "",
			tableHeading    	: {
            // "productCode"     : "Product Code",
            // "itemCode"        : "Item Code",
            "vendorName"      : 'Vendor Name',
				"productName"     : "Product Name",
				// "UPC" 				: "UPC",
            "section"        	: 'Section',
            "category"        : 'Category',
            "subCategory"     : 'SubCategory',
            "originalPrice"   : 'Original Price',
            "discountPercent" : 'Discount Percent',
            "discountedPrice" : 'Discounted Price',
            "currentQuantity" : 'currentQuantity'
         },
            tableObjects    : {
                paginationApply : true,
                searchApply     : true,
                deleteMethod    : 'delete',
                apiLink         : '/api/returnedproducts',
            },
            startRange      : 0,
            limitRange      : 10,
            isLoadingData     : false,
            searchText 			: ""
		}
		// this.getReturnedProducts = this.getReturnedProducts.bind(this);
	}
	 
	/**=========== componentDidMount() ===========*/
	componentDidMount(){
		var userDetails = JSON.parse(localStorage.getItem("userDetails"));
		var token       = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
		this.getData(this.state.startRange, this.state.limitRange);
		this.getCount();
		this.getSectionData();
     	// this.getCategoryData();
     	this.getVendorList();
	}    

	productCountByStatus(){
     	axios.get('/api/products/get/productCountByStatus')
      .then((response) => {
         this.setState({
            productCountByStatus: response.data
         })
      })
      .catch((error) => {
      	console.log("error => ",error)
      })
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

	/**=========== getCategoryData() ===========*/
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
	/**=========== getCount() ===========*/
    getCount(){
        axios.get('/api/returnedproducts/get/count')
        .then((response)=>{
            console.log('dataCount', response.data.dataCount);
            this.setState({
                dataCount : response.data.dataCount
            })
        })
        .catch((error)=>{
            console.log('error', error);
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
			status 			: this.state.status ? this.state.status.value : ""
      }
      console.log("formValues => ",formValues)
		axios.post("/api/products/get/inventory/list", formValues)
		.then((response)=>{
			console.log("response return products => ",response.data)
			var tableData = response.data.data.map((a, ind)=>{
				// console.log("condition => ",(a.productDetails && a.productDetails.length > 0));
				// if(a.productDetails && a.productDetails.length > 0){
					// console.log("a => ",a)
					return{
						"_id"               	: a._id,
						// "UPC"           		: a.UPC,
						"vendorName"        	: a.vendorName,
						"productName"       	: a.productName ? a.productName : "NA",
						"section"        		: a.section ? a.section : "NA",
						"category"        	: a.category ? a.category : "NA",
						"subCategory"        : a.subCategory ? a.subCategory : "NA",
						"originalPrice"      : a.originalPrice ? a.originalPrice : 0,
						"discountPercent"    : a.discountPercent ? a.discountPercent : 0 + "%",
						"discountedPrice"    : a.discountedPrice ? a.discountedPrice : a.originalPrice,
						"currentQuantity" 	: a.currentQuantity ? "<div class='currentQuantityWrapper'><a href=/product-inventory-list/" + a._id + " title='View Inventory Logs'>	" + a.currentQuantity + "</a></div>" : 0,						
					};
				// }
            })
			// console.log("tabledata => ",tableData)
            this.setState({
                tableData 		: tableData,
                dataCount 		: response.data.dataCount,
                isLoadingData : false
            },()=>{
                console.log("tableData => ",this.state.tableData)
            })
		})
		.catch((error)=>{
			console.log('error', error);
			if(error.message === "Request failed with status code 401"){
				var userDetails =  localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
						title : "Your Session is expired.",                
						text : "You need to login again. Click OK to go to Login Page"
				})
				.then(okay => {
				if (okay) {
						window.location.href = "/login";
				}
				});
			}
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
			<div className="">
				<div>
					<section className="content">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pageContent">
							<div className="row">
								<div className="box">
									<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
										<h4 className="weighttitle NOpadding-right">Product Inventory List</h4>
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
							
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<IAssureTable 
									tableHeading    = {this.state.tableHeading}
									twoLevelHeader  = {this.state.twoLevelHeader} 
									dataCount       = {this.state.dataCount}
									tableData       = {this.state.tableData}
									getData         = {this.getData.bind(this)}
									tableObjects    = {this.state.tableObjects}
									getSearchText   = {this.getSearchText.bind(this)}
									isLoading 		 = {this.state.isLoadingData}
								/>
							</div>				
						</div>
					</section>
				</div>
			</div>
		);
	}
}
