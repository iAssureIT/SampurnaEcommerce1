import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import jQuery                 from 'jquery';
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
// import { result }             from 'underscore';
import IAssureTable           from "../../CategoryTable/IAssureTable.jsx";
// import IAssureTable           from '../../../../coreadmin/IAssureTable/IAssureTable.jsx';
import 'jquery-validation';
import 'bootstrap/js/tab.js';
import '../css/CategoryManagement.css';
// import { set } from 'mongoose';

class CategoryManagement extends Component{
	constructor(props) {
		super(props);
		this.state = {
			"subcatgArr"             	: [],
			"addEditModeCategory"      : "",
			"addEditModeSubCategory"   : [],
			"addEditMode"              : "",
			"categoryImage"            : "",
			/**=============== SubCategory Details ===============*/
			"subcategorytableHeading"  : {
														subCategoryTitle  	: "Subcategory Title",
			},
			"subcategorytableObjects"	: {
														deleteMethod      	: 'delete',
														apiLink              : '/api/category',
														paginationApply      : true,
														searchApply          : true,
														searchByPlaceholder : "Search By Subcategory Name",
														editUrl              : '/project-master-data',
														deleteUrl            : '/project-master-data',
														patchStatusUrl       : '/api/category/patch/subcategory/status',
														type                 : 'SubCategories',
														showAction 			 : false,
														checkbox 			 : false
			},
			/**=============== Category Details ===============*/
			"tableHeading"             : {
														section              : "Section",
														category             : "Category Title",
														// categoryNameRlang    : "Category Name RL",
														categoryRank         : "Category Rank",
														// categoryDescription 	: "Category Description",
														subCategory         	: "SubCategories"
			},
			"tableObjects"          	: {
														deleteMethod        	: 'delete',
														apiLink              	: '/api/category',
														paginationApply      	: true,
														searchApply          : true,
														searchByPlaceholder : "Search By Section and Category Name",
														editUrl              	: '/project-master-data/',
														deleteUrl            	: '/project-master-data',
														patchStatusUrl      	: '/api/category/patch/status',
														getOneUrl       		: '/api/category/get/one/',
														type                 	: 'Categories',
														showAction 			 	: true,
														checkbox 				: false
			},
			"sectionsList"          	: [],
			"startRange"            	: 0,
			"limitRange"            	: 10,
			"editId"                	: this.props.editId ? this.props.editId : '',
			"sectionn"               	: "-- Select --",
			"tableName"             	: 'Category-management',
			"subtablename" 				: "Subcategory-management",
			tableData 						: [],
			subcategorytableData 		: [],
			categorySearchText 			: "",
			subCategorySearchText 		: ""
		};
		this.openSubCategoryModal = this.openSubCategoryModal.bind(this);
	}

	handleChange(event){ 
		const target = event.target;
		const name   = target.name;

		this.setState({
			[name]: event.target.value,
		});
	}
	
	sectionChange(event){
		// const target = event.target;
		// const name   = target.name;

		this.setState({
			// section     : event.target.value.split('|')[0],
			sectionn     : event.target.value.split('|')[0],
			section_ID  : event.target.value.split('|')[1],
		},()=>{
		  // console.log('sectionChange', this.state.section, this.state.section_ID);
		});
	}

	componentWillReceiveProps(nextProps) {
		console.log("Inside componentWillRecive props",nextProps);
		// console.log("EditId:===",this.state.editId);
		
		if(nextProps && nextProps.editId && nextProps.editId !== undefined &&  nextProps.history.location.pathname !== "/project-master-data"){      
		  	this.setState({
			  	editId : nextProps.editId
		  	},()=>{
			 	this.edit(this.state.editId);
		  	})
		}
	}
  
	componentDidMount(){
		var userDetails = JSON.parse(localStorage.getItem("userDetails"));
		var token       = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

		window.openSubCategoryModal	= this.openSubCategoryModal;
		
		window.scrollTo(0, 0);
		// console.log("editId:",this.props.editId);
		var inputBox 		= document.getElementById("categoryRank");
		var invalidChars 	= ["-","+","e"];
  
		inputBox.addEventListener("keydown", function(e) {
		  	if (invalidChars.includes(e.key)) {
			 	e.preventDefault();
		  	}
		});
  
		if(this.state.editId && this.state.editId !== "undefined"){      
		  	this.edit(this.state.editId);
		}
		// $.validator.addMethod("regxsection", function (value, element, arg) {
		//   	return arg !== value;
		// }, "Please select the section");
		$.validator.addMethod("regxsection", function (value, element, regexpr) {
			return regexpr !== value;
		}, "Please select section");		
		// $.validator.addMethod("valueNotEquals", function(value, element, arg){
		//   	return arg !== value;
		// }, "Please select the section");
		$.validator.addMethod("letterswithspace", function(value, element) {
		  	return this.optional(element) || /^[a-zA-Z]*$/g.test(value);
		}, "Please enter letters only");
		$.validator.addMethod("charactersLength", function(value, element) {
		  	return this.optional(element) || value.length <= 128;
		}, "Please enter less than 128 characters");
		$.validator.addMethod("digitsLength", function(value, element) {
		  	return this.optional(element) || value.length <= 5;
		}, "Please enter max 5 digits only.");

		// $.validator.addMethod("regxA1", function(value, element, regexpr) {          
		//   return regexpr.test(value);
		// }, "Name should only contain letters & number.");
  
		$.validator.setDefaults({
		  	debug 	: true,
		  	success : "valid"
		});

		$("#categoryManagement").validate({
		  	rules : {
			 	sectionn : {
					required 			: true,
					regxsection 		: "-- Select --"
			 	},
			 	category : {
					required 			: true,
					// letterswithspace 	: true,
					charactersLength 	: true
			 	},
				categoryRank : {
					required 			: true,
					digitsLength 		: true
			 	},
				categoryImage : {
					required 			: true,
			 	}
			 // categoryDescription: {
			 //   required: true,
			 //   // regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/, 
			 // },
			 // categoryDescription : {
				// 	required 			: true,
				// 	// letterswithspace 	: true,
				// 	charactersLength 	: true 
			 // }
		  	},
		  	
			errorPlacement: function(error, element) {
			 	if (element.attr("name") === "sectionn"){
					error.insertAfter("#sectionn");
				}
			 	if (element.attr("name") === "category"){
					error.insertAfter("#category");
			 	}
			 	if (element.attr("name") === "categoryRank"){
					error.insertAfter("#categoryRank");
			 	}
			 	if (element.attr("name") === "categoryImage"){
					error.insertAfter("#categoryImage");
			 	}
			
				// if (element.attr("name") === "categoryDescription"){
				//   error.insertAfter("#categoryDescription");
				// }         
			}
		});

		this.getSectionData();
		this.getDataCount();
		this.getData(this.state.startRange,this.state.limitRange);
		// this.getSubCategoryData(this.state.startRange,this.state.limitRange);
	}

	getDataCount(){
		axios.get('/api/category/get/count')
		.then((response)=>{
		  	console.log('category dataCount', response.data);
		  	this.setState({
			 	dataCount : response.data.dataCount
		  	})
		})
		.catch((error)=>{
		  	console.log('error', error);
		  	if(error.message === "Request failed with status code 401"){
				localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is expired.",                
					text  : "You Need to Login Again. Click 'OK' to go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		});
	}

	
	/**=========== getData() ===========*/
	getData(startRange, limitRange){
		var data = {
		  startRange : startRange,
		  limitRange : limitRange,
		  searchText : this.state.categorySearchText
		}
		
		console.log("data => ",data);
		axios.post('/api/category/get/list', data)
		.then((response)=>{
		  	console.log('category tableData', response.data);
		  
		  	var tableData = response.data.data.map((a, i)=>{                      
				return{ 
					_id                   : a._id,
					section               : a.section,
					category              : a.category,
					categoryNameRlang     : a.categoryNameRlang,
					categoryRank          : "<div class=textAlignCenter >" + a.categoryRank + "</div>",
					categoryDescription   : a.categoryDescription,
					subCategory           : "<a aria-hidden='true' class='actionLinks' title='Show all SubCategories' id='" + a._id + "'data-toggle='modal' data-target='#subCategoryModal' onclick=window.openSubCategoryModal('"+ a._id + "')> View </a>",
					status                : a.status,
					subCategories 		  : a.subCategory
				}
			})
			this.setState({
				tableData : tableData,
				dataCount : response.data.dataCount
			},()=>{
				console.log("categories data => ",this.state.tableData);
				if(this.state.category_id && this.state.category_id !== "undefined"){
					this.getSubCategoryData(this.state.startRange, this.state,limitRange);
					// this.openSubCategoryModal(this.state.category_id);
				}
			})
		})
		.catch((error)=>{
			console.log('error', error);
			if(error.message === "Request Failed with Status Code 401"){
				localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is Expired.",                
					text  : "You need to login again. Click OK to Go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		});
	}


	/**=========== getSubCategoryData() ===========*/
	getSubCategoryData(startRange, limitRange){
		console.log("startRange => ",startRange)
		console.log("limitRange => ",limitRange)

		if (this.state.category_id) {	
			console.log("id => ", this.state.category_id)
			var formValues ={
				category_id : this.state.category_id,
				startRange 	: startRange,
				limitRange 	: limitRange,
				searchText 	: this.state.subCategorySearchText
			}
			axios.post('/api/category/get/one',formValues)
			.then((response)=>{
				console.log('One category tableData', response.data);
				if(response.data !== null && response.data !== undefined && response.data.subCategory && response.data.subCategory.length > 0){	
					var subcategorytableData = response.data.subCategory;
					console.log("subcategorytableData => ",subcategorytableData)
					this.setState({
						subcategorytableData 	: (subcategorytableData).slice(startRange, parseInt(startRange) + parseInt(limitRange)),
						subcategoryDataCount 	: subcategorytableData.length,
						category_id 		 		: this.state.category_id,
						categoryName 				: response.data.category
					})
				}else{					
					this.setState({
						subcategorytableData 	: [],
						subcategoryDataCount 	: 0,
						category_id 			: this.state.category_id,
						categoryName 			: ''
					})
				}
				console.log("subcategorytableData => ",this.state.subcategorytableData);
				// if(filteredCategory && filteredCategory.length > 0 && filteredCategory[0].subCategories && filteredCategory[0].subCategories.length > 0){
				// 	var subcategorytableData = filteredCategory[0].subCategories;
				// 	this.setState({
				// 		subcategorytableData 	: subcategorytableData,
				// 		subcategoryDataCount 	: subcategorytableData.length,
				// 		category_id 		 	: category_id,
				// 		categoryName 			: filteredCategory[0].category
				// 	})
				// }
				// var tableData = response.data.reverse().map((a, i)=>{                      
				// 	return{ 
				// 		_id                   : a._id,
				// 		section               : a.section,
				// 		category              : a.category,
				// 		categoryNameRlang     : a.categoryNameRlang,
				// 		categoryRank          : a.categoryRank,
				// 		categoryDescription   : a.categoryDescription,
				// 		subCategory           : "<a aria-hidden='true' class='actionLinks' title='Show all SubCategories' id='" + a._id + "'data-toggle='modal' data-target='#subCategoryModal' onclick=window.openSubCategoryModal('"+ a._id + "')> View </a>",
				// 		status                : a.status,
				// 		subCategories 		  : a.subCategory
				// 	}
				// })
				// this.setState({
				// 	tableData : tableData
				// },()=>{
				// 	console.log("categories data => ",this.state.tableData);
				// 	if(this.state.category_id && this.state.category_id !== "undefined"){
				// 		this.openSubCategoryModal(this.state.category_id);
				// 	}
				// })
			})
			.catch((error)=>{
				console.log('error', error);
				if(error.message === "Request failed with status code 401"){
					localStorage.removeItem("userDetails");
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
			});
		}
	}
	
	/*======== openSubCategoryModal() ========*/
	openSubCategoryModal(category_id){
		this.setState({downloadFlag : false});
		if(category_id){			
			console.log("category_id => ",category_id);
			console.log("tableData => ",this.state.tableData);
			if(this.state.tableData && this.state.tableData.length > 0){
				var filteredCategory = this.state.tableData.filter((filteredcategory)=> String(filteredcategory._id) === String(category_id));
				console.log("filteredCategory => ",filteredCategory);
				// console.log("filteredCategory[0].subCategories => ",filteredCategory[0].subCategories);
				if(filteredCategory && filteredCategory.length > 0){
					if(filteredCategory[0].subCategories && filteredCategory[0].subCategories.length > 0){
						var subcategorytableData = filteredCategory[0].subCategories;
						this.setState({
							subcategorytableData 	: subcategorytableData.slice(this.state.startRange, this.state.limitRange),
							subcategoryDataCount 	: subcategorytableData.length,
							category_id 		 	: category_id,
							categoryName 			: filteredCategory[0].category
						})
					}else{
						this.setState({
							categoryName 			: filteredCategory[0].category
						})
					}
				}else{					
					this.setState({
						subcategorytableData 	: [],
						subcategoryDataCount 	: 0,
						category_id 			: category_id,
						categoryName 			: ''
					})
				}
				console.log("subcategorytableData => ",subcategorytableData);
			}else{
				this.setState({
					subcategorytableData 	: [],
					subcategoryDataCount 	: 0,
					category_id 			: category_id
				})
			}			 
		}
	}
	
	addNewSubCatArray(event){
		let arrLength 	= [];
		arrLength 		= this.state.subcatgArr ? this.state.subcatgArr : null;
		arrLength.push({
			subCategoryCode 	: "a"+arrLength.length,
			subCategoryTitle 	: "",
			subCategoryImage 	: "",
		});
		this.setState({
			subcatgArr : arrLength,
		},()=>{
			// console.log('subcatgArr',this.state.subcatgArr);
		}); 
	}

	// addNewRow(index){
	// 	return(
	// 		<div className="col-lg-12 col-md-12 NOpadding newSubCatgArr">   
	// 			<div className="col-lg-11 col-md-11 NOpadding">             
	// 				<input type="text" id={index} value={this.state['subCategoryTitle'+index]} name={"subCategoryTitle"+index} onChange={this.handleChange.bind(this)} className={"form-control newSubCatg"+index} placeholder="Category Title" aria-label="Brand" aria-describedby="basic-addon1" ref={"newSubCatg"+index} />
	// 			</div>
	// 			<div className="col-lg-1 col-md-1 deleteSubCategory fa fa-trash" id={index} onClick={this.deleteSubCategory.bind(this)}>		
	// 			</div>
	// 		</div>
	// 	);
	// }
	getSectionData(){
		axios.get('/api/sections/get/list')
		.then((res)=>{
			// console.log('res', res.data);
			this.setState({
				sectionsList : res.data
			})
		})
		.catch((error)=>{
			console.log('error', error);
			if(error.message === "Request failed with status code 401"){
				localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is Expired.",                
					text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		})
	}

	deleteSubCategory(event){
		event.preventDefault();
		var id = event.target.id;
		// console.log('subCategory Id',id);

		let arrLength 	= this.state.subcatgArr ? this.state.subcatgArr : null;
		// var index 		= arrLength.indexOf(id);
		
		arrLength.splice(arrLength.findIndex(v => v.subCategoryCode === id), 1);
		this.setState({
			subcatgArr : arrLength
		},()=>{});
	}

	submitCategory(event){
		event.preventDefault();
		// console.log('bjgjbmbmb',$('#categoryManagement').valid());
		if($('#categoryManagement').valid()){
			var addRowLength 				= this.state.subcatgArr ? this.state.subcatgArr.length : null;
			var categoryDimentionArray = [];
			console.log("addRowLength----------",this.state.subcatgArr);

		  	axios.get('/api/category/get/count')
		  	.then((response)=>{
			 	var catCodeLength = response.data.dataCount;
			 	// console.log("catCodeLength",catCodeLength);
			 	// console.log("addRowLength",addRowLength);
				if(addRowLength){
					for(var i=0;i<addRowLength;i++){
						console.log("1 => ",($(".attributeName" + i).val()));
						console.log("2 => ",($(".subCategoryImage"+i).attr("src")));
						if(($(".attributeName" + i).val()) !== "" && ($(".attributeValue" + i).val()) !== ""){
							var obj = {
								"index"             : i,
								"subCategoryCode"   : catCodeLength+'|'+i,
								"subCategoryTitle"  : $(".newSubCatg"+i).val(),
								"subCategoryUrl"    : $(".subcategoryUrl"+i).val(),
								"subCategoryImage"  : $(".subCategoryImage"+i).attr("src"),
							}
							if($(".newSubCatg"+i).val()){
								console.log("subcategory obj===",obj);
								axios.post('/api/category/get/list')
								.then((response)=>{
									console.log("response in get Category list => ",response);

								})
								.catch((error)=>{
									console.log('error', error);
								});
								// categoryDimentionArray.push(obj);
								// var finalCategoryArray = Array.from(new Set(categoryDimentionArray.map(c => c.subCategoryTitle.toLowerCase()))).map(subCategoryTitle => {
								//   console.log("c => ",c);
								//   console.log("id => ",subCategoryTitle);
								//   return{
								//     subCategoryTitle : subCategoryTitle,
								//   }
								// })
								categoryDimentionArray.push(obj);
								var result = [];
								if(categoryDimentionArray.length > 0){ 
									console.log("categoryDimentionArray=> ",categoryDimentionArray)                   
									const map    = new Map();
									for (const item of categoryDimentionArray) {
										if(!map.has(item.subCategoryTitle)){
											map.set(item.subCategoryTitle, true);    // set any value to Map
											result.push({
												index             : item.index,
												subCategoryTitle  : item.subCategoryTitle,
												subCategoryCode   : item.subCategoryCode,
												subCategoryUrl    : item.subCategoryUrl,
												subCategoryImage  : item.subCategoryImage,
												status            : "Published",
											});
										}
									}
								}
								this.setState({
									allowToSubmit: true
								})
							}else{
								// console.log("subCategoryTitleErrora"+i, " subCategoryTitlea0Error");
								this.setState({
									["subCategoryTitleErrora"+i] 	: "This field is required.",
									allowToSubmit 					:  false
								})
							}
						}
					}
				}
			 	// console.log("categoryDimentionArray",categoryDimentionArray);

			 
				var formValues = {
					"section"                   : this.state.sectionn,
					"section_ID"                : this.state.section_ID,
					"category"                  : this.refs.category.value,
					// "categoryNameRlang"         : this.refs.categoryNameRlang.value,
					"categoryUrl"               : this.refs.categoryUrl.value,
					// "subCategory"               : categoryDimentionArray ? categoryDimentionArray : [],
					"subCategory"               : result,
					"categoryDescription"       : this.refs.categoryDescription.value,
					"categoryImage"             : this.state.categoryImage,
					"categoryRank"              : this.state.categoryRank,
				}

				console.log("Formvalues = ", formValues);

				axios.post('/api/category/post', formValues)
				.then((response)=>{
				  	/*swal({text  : response.data.message,});*/
				  	swal(" ",(response.data.message ));
				
					this.setState({
						"sectionn"               	: '-- Select --',
						"category"                 : '',
						"categoryUrl"              : '',
						"addEditModeCategory"      : '',
						"addEditModeSubCategory"   : '',
						"categoryDescription"      : '',
						"subcatgArr"               : [],
						"categoryImage"            : "",
						"categoryRank"             : "",
						"categoryNameRlang"        : '',
						"status"                   : ''
					});
					$(':input').val('');
					this.getData(this.state.startRange, this.state.limitRange);
				})
				.catch((error)=>{
					console.log('error', error);
					if(error.message === "Request failed with status code 401"){
						localStorage.removeItem("userDetails");
						localStorage.clear();
						swal({  
							title : "Your Session is Expired.",                
							text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
						})
						.then(okay => {
							if (okay) {
								window.location.href = "/login";
							}
						});
					}
				});
		  })
		  .catch((error)=>{
				console.log('error', error);
				if(error.message === "Request failed with status code 401"){
					localStorage.removeItem("userDetails");
					localStorage.clear();
					swal({  
						title : "Your Session is Expired.",                
						text  : "You need to Login Again. Click 'OK' to Go to Login Page"
					})
					.then(okay => {
						if (okay) {
							window.location.href = "/login";
						}
					});
				}
			});
		}
	}
	 
	updateCategory(event){
		event.preventDefault();
		// console.log('bjgjbmbmb',$('#categoryManagement').valid());
		if($('#categoryManagement').valid()){
		  	var addRowLength            = this.state.subcatgArr ? this.state.subcatgArr.length : 0;
		  	var categoryDimentionArray  = [];
		  	var newresult               = [];
		  
		  	var formValues = {
				"category_ID"               : this.state.editId,
				"section"                   : this.state.sectionn,
				"section_ID"                : this.state.section_ID,
				"category"                  : this.refs.category.value,
				"categoryUrl"               : this.refs.categoryUrl.value,
				// "subCategory"               : categoryDimentionArray,
				"subCategory"               : newresult,
				"categoryDescription"       : this.refs.categoryDescription.value,
				"categoryImage"             : this.state.categoryImage,
				"categoryRank"              : this.state.categoryRank,
				// "categoryNameRlang"         : this.refs.categoryNameRlang.value
			}

		  	console.log("formValues = ", formValues);
		  	axios.get('/api/category/get/count')
		  	.then((response)=>{
			 	var catCodeLength = response.data.dataCount;
				if(addRowLength){
					console.log("addRowLength => ",addRowLength);  
					for(var i=0;i<addRowLength;i++){
						var obj = {
								"index"             : i,
								"subCategoryCode"   : catCodeLength+'|'+i,
								"subCategoryTitle"  : $(".newSubCatg"+i).val(),
								"subCategoryUrl"    : $(".subcategoryUrl"+i).val(),
								"subCategoryImage"    : $(".subCategoryImage"+i).attr("src"),
								"status"   				: this.state.categoryStatus,
						}
						if($(".newSubCatg"+i).val()){
							categoryDimentionArray.push(obj);							
							this.setState({
								allowToUpdate : true
							})
						}else{
							// console.log("subCategoryTitleErrora"+i, " subCategoryTitlea0Error");
							this.setState({
								["subCategoryTitleErrora"+i] 	: "This field is required.",
								allowToUpdate 						: false
							})
						}
					}
					if(i >= addRowLength){
						if(categoryDimentionArray.length > 0){    
							console.log("categoryDimentionArray => ",categoryDimentionArray);                
							const map    = new Map();
							for (const item1 of categoryDimentionArray) {
								console.log("item => ", item1)
								if(!map.has(item1.subCategoryUrl)){
									map.set(item1.subCategoryUrl, true);    // set any value to Map
									newresult.push({
										index             : item1.index,
										subCategoryTitle  : item1.subCategoryTitle,
										subCategoryCode   : item1.subCategoryCode,
										subCategoryUrl    : item1.subCategoryUrl,
										subCategoryImage  : item1.subCategoryImage,
										status   			: item1.status,
									});
								}
							}

						// console.log("newresult 1 => ", newresult);
							
						}
						// newresult = newresult.filter((v,i,a)=>a.findIndex(t=>(t.subCategoryTitle === v.subCategoryTitle)===i)
						console.log("newresult => ", newresult.filter((v,i,a)=>a.findIndex(t=>(t.subCategoryTitle === v.subCategoryTitle)===i)));
					}
				}

			 	// if(this.state.allowToUpdate === true){
				console.log("In update => ",formValues);
				axios.patch('/api/category/patch', formValues)
				.then((response)=>{
					console.log("response => ",response.data)
					swal({
						text  : response.data.message,
					});
					this.getData(this.state.startRange, this.state.limitRange);
					this.setState({
						"sectionn"                       : '-- Select --',
						"category"                      : '',
						"categoryUrl"                   : '',
						"categoryRank"                  : '',
						"addEditModeCategory"           : '',
						"addEditModeSubCategory"        : '',
						"categoryDescription"           : '',
						"editId"                        : '',
						"subcatgArr"                    : [],
						"categoryNameRlang"             : '',
						"categoryImage"                 : "",
					},()=>{
						this.props.history.push('/project-master-data');
						// this.props.editId = '';
					});
					console.log("props => ",this.props);
					// this.props.history.push('/category-management');					
					// window.location.href ='/project-master-data';
				})
				.catch((error)=>{
					console.log('error', error);
					if(error.message === "Request failed with status code 401"){
						localStorage.removeItem("userDetails");
						localStorage.clear();
						swal({  
							title : "Your Session is Expired.",                
							text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
						})
						.then(okay => {
							if (okay) {
								window.location.href = "/login";
							}
						});
					}
				});
			 // }
		  	})
		  	.catch((error)=>{
			 	console.log('error', error);
			 	if(error.message === "Request failed with status code 401"){
				  	localStorage.removeItem("userDetails");
				  	localStorage.clear();
				  	swal({  
						title : "Your Session is expired.",                
						text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
				  	})
				  	.then(okay => {
				  		if (okay) {
							window.location.href = "/login";
				  		}
				  	});
				}
		  	});
		}
	}
	
	edit(editId){
		// var editId = id.editId; 
		// console.log("edit Id send to axios:",editId);
		// console.log("Id send to axios:",id);
		axios.get('/api/category/get/one/'+editId)
		.then((response)=>{
		  	console.log('record to be edit', response.data);
		  	if(response.data){
				this.setState({
					"sectionn"                   : response.data.section,
					"section_ID"                : response.data.section_ID,
					"category"                  : response.data.category,
					"categoryNameRlang"         : response.data.categoryNameRlang,
					"categoryStatus"            : response.data.status,
					"categoryUrl"               : response.data.categoryUrl,
					"categoryRank"              : response.data.categoryRank,
					"addEditModeCategory"       : response.data.category,
					"addEditModeSubCategory"    : response.data.subCategory,
					"subcatgArr"                : response.data.subCategory,
					"categoryDescription"       : response.data.categoryDescription,
					"categoryImage"             : response.data.categoryImage,
				},()=>{
					console.log("this.state.section----",this.state.sectionn);
					console.log("this.state.section_ID----",this.state.section_ID);
					console.log("this.state.category----",this.state.category);
					console.log("this.state.categoryImage----",this.state.categoryImage);
					var addRowLength = this.state.subcatgArr ? this.state.subcatgArr.length : 0;
					if(addRowLength){
						for(var i=0;i<addRowLength;i++){
							console.log("subCategory => ",this.state.subcatgArr[i])
							this.setState ({
								['subCategoryTitle'+this.state.subcatgArr[i].subCategoryCode]  : this.state.subcatgArr[i].subCategoryTitle,
								['subcategoryUrl'+this.state.subcatgArr[i].subCategoryCode] 	: this.state.subcatgArr[i].subCategoryUrl,
								['subCategoryImage'+this.state.subcatgArr[i].subCategoryCode] 	: this.state.subcatgArr[i].subCategoryImage
							},()=>{});
						}
					}
				});
		 	}
		})
		.catch((error)=>{
			console.log('error', error);
			if(error.message === "Request failed with status code 401"){
				localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is Expired.",                
					text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		});
	}
	
	uploadImage(event){
		event.preventDefault();
		var name 	= event.currentTarget.name;
		var image 	= "";

		// console.log("name => ", event.currentTarget.name);
		if (event.currentTarget.files && event.currentTarget.files[0]) {
			// for(var i=0; i<event.currentTarget.files.length; i++){
			var file = event.currentTarget.files[0];
			console.log("file => ",file);
			if (file) {
				var fileName  	= file.name; 
				var ext 		= fileName.split('.').pop();  
				if(ext === "jpg" || ext === "png" || ext === "jpeg" || ext==="webp" || ext==="WEBP" || ext === "JPG" || ext === "PNG" || ext === "JPEG"){
					if (file) {
						var objTitle = { fileInfo : file }
						console.log("object => ",objTitle)
						image = objTitle ;
						
					}else{          
						swal("Images not uploaded");  
					}//file
				}else{ 
					swal("Allowed images formats are (jpg,png,jpeg)");   
				}//file types
			}//file
			// }//for 
  			console.log("event.currentTarget.files => ",(event.currentTarget.files))
			if(event.currentTarget.files){
				// this.setState({
				// 	categoryImage : categoryImage
				// },()=>{
				// 	// console.log("categoryImage => ",this.state.categoryImage)
				// });  
				main().then(formValues=>{
					if(name === "file"){
						this.setState({
							categoryImage : formValues.image
						}, ()=>{
							console.log("categoryImage => ",this.state.categoryImage)
						})
					}else{
						console.log("Image else => ",this.state.categoryImage);
						this.setState({
							[name] : formValues.image
						}, ()=>{
							console.log("subcategoryImage => ",name, this.state[name])
						})
					}
				});
				async function main(){
					var config 	= await getConfig();
					var s3url 	= await s3upload(image.fileInfo, config, this);

					const formValues = {
						"image"    : s3url,
						"status"   : "New"
					};	
					console.log("formValues => ",formValues)
					return Promise.resolve(formValues);
				}
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
								localStorage.removeItem("userDetails");
								localStorage.clear();
								swal({  
									title : "Your Session is Expired.",                
									text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
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
							// console.log("s3 response :",response.data);
							const config = {
								bucketName      : response.data.bucket,
								dirName         : process.env.ENVIRONMENT,
								region          : response.data.region,
								accessKeyId     : response.data.key,
								secretAccessKey : response.data.secret,
							}
							resolve(config);                           
						})
						.catch(function(error){
							console.log(error);
							if(error.message === "Request failed with status code 401"){
								localStorage.removeItem("userDetails");
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
	
	// deleteImage(event){		
	// 	var id 					= event.target.id;
	// 	var productImageArray 	= this.state.productImageArray;
	// 	console.log('id', id);
	// 	console.log('productImageArray', productImageArray);

	// 	productImageArray.splice(productImageArray.findIndex(v => v === id), 1);
	// 	this.setState({
	// 		categoryImage 		: "",
	// 		productImageArray : productImageArray
	// 	},()=>{});
	// }
	
	createCategoryUrl(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
			[name]: event.target.value,
		});
		var url = event.target.value;
		if(url){
			url = url.replace(/\s+/g, '-').toLowerCase();
			this.setState({
				categoryUrl : url
			})
		}
	}

	deleteImage(event){
		// event.preventDefault();
		var name = event.currentTarget.id.split("-")[1];
		console.log("name => ",name)
		if(name === "file"){
			this.setState({
				categoryImage : ""
			}, ()=>{
				console.log("categoryImage => ",this.state.categoryImage)
			})
		}else{
			console.log("Image else => ",this.state.categoryImage);
			this.setState({
				[name] : ""
			}, ()=>{
				console.log("subcategoryImage => ",name, this.state[name])
			})
		}
	}
	
	getSearchText(searchText, startRange, limitRange){
		this.getSearchCount(searchText);
		var formValues={ 
			"searchText"    : searchText,
			"startRange"    : startRange,
			"limitRange"    : limitRange
		};
		axios.post("/api/category/searchCategory",formValues)
		.then((response)=>{ 
			console.log('tableData', response.data);
			var tableData = response.data.reverse().map((a, i)=>{                      
				return{ 
					_id                   : a._id,
					sectionn               : a.section,
					category              : a.category,
					categoryNameRlang     : a.categoryNameRlang,
					categoryRank          : a.categoryRank,
					categoryDescription   : a.categoryDescription,
					subCategory           : "<a aria-hidden='true' class='actionLinks' title='Show all SubCategories' id='" + a._id + "'data-toggle='modal' data-target='#subCategoryModal' onclick=window.openSubCategoryModal('"+ a._id + "')> View </a>",
					status                : a.status,
					subCategories 		  : a.subCategory
				}
			})		 
			this.setState({
				tableData : tableData,
				//dataCount : response.data.length
			});
		})
		.catch((error)=>{
			console.log('error', error);
			if(error.message === "Request failed with status code 401"){
				localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is Expired.",                
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
	
	getSearchCount(searchText){
		var formValues = { 
		  	"searchText" : searchText
		};
		axios.post("/api/category/searchCategoryCount",formValues)
		.then((response)=>{ 
			console.log("category data count => ",response.data)
			this.setState({
				dataCount : response.data.dataCount
			},()=>{
			})
		})
		.catch((error)=>{
			console.log('error', error);
			if(error.message === "Request failed with status code 401"){
				localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is Expired.",                
					text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		})
	}
	handleSubCatChange(event){
		this.setState({
			[event.target.name] 									: event.target.value,
			["subCategoryTitleError"+event.target.id] 	: event.target.value ? "" : "This field is required."
		})
	}

	createSubCategoryUrl(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
			[name] 													: event.target.value,
			["subCategoryTitleError"+event.target.id] 	: event.target.value ? "" : "This field is required."
		});
		var url = event.target.value;
		if(url){
			url = url.replace(/\s+/g, '-').toLowerCase();
			this.setState({
				["subcategoryUrl"+event.target.id] : url
			})
		}
	}

	selectedProducts(checkedProductsList) {
		// console.log('checkedUsersList', checkedUsersList);
		this.setState({
			checkedProducts: checkedProductsList,
			messageData: {}
		})
		// console.log("this.state.checkedUser",this.state.checkedUser);
 	}

  	setunCheckedProducts(value) {
		this.setState({
			unCheckedProducts 	: value,
			messageData 			: {}
		})
  	}

  	getSubCategorySearchText(searchText) {
		this.setState({
			subCategorySearchText : searchText
		},()=>{
			this.getSubCategoryData(this.state.startRange, this.state.limitRange)
		})
  	}

  	getCategorySearchText(searchText) {
		this.setState({
			categorySearchText : searchText
		},()=>{
			this.getData(this.state.startRange, this.state.limitRange);
		})
  	}

	render(){		
		return(
			<div className="container-fluid col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
						<div className="formWrapper">
							<section className="content">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
									<div className="">
										<div className="">
											<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
												<h4 className="weighttitle NOpadding-right">Category Master </h4>
											</div>
											<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 formContent">
												<form id="categoryManagement" className="">
													<div className="col-lg-6 col-md-12 col-xs-12 col-sm-12  NOpadding">
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 fieldWrapper"  >
															<label>Section <i className="redFont">*</i></label>
															<select onChange={this.sectionChange.bind(this)} value={this.state.sectionn+'|'+this.state.section_ID}  name="sectionn" className="form-control allProductCategories" aria-describedby="basic-addon1" ref="sectionn" id="sectionn">
																<option>-- Select --</option>
																{
																	this.state.sectionsList && this.state.sectionsList.length>0 
																	?
																		this.state.sectionsList.map((data, index)=>{
																			return(
																				<option value={data.section+'|'+data._id}>{data.section}</option>
																			);
																		})
																	:
																		null
																}
															</select>
														</div>
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 fieldWrapper">
															<label>Category URL {/*<i className="redFont">*</i>*/}</label>                                                                    
															<input disabled value={this.state.categoryUrl} onChange={this.handleChange.bind(this)} id="categoryUrl" name="categoryUrl" type="text" className="form-control categoryUrl" placeholder="Category URL" ref="categoryUrl"  />
														</div>
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 fieldWrapper">
															<label>Category Rank <i className="redFont">*</i></label>                                                                    
															<input value={this.state.categoryRank} onChange={this.handleChange.bind(this)} onkeydown="return event.keyCode !== 69" id="categoryRank" name="categoryRank" type="number" className="form-control categoryRank" placeholder="Category Rank" ref="categoryRank"  min="1"/>
														</div>
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 fieldWrapper">
                                             {/*<div className="container-flex">*/}
																<label>Category Image <i className="redFont">*</i></label> 
																{this.state.categoryImage 
																?
																	null
																:
																	<div className="divideCatgRows col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryImgWrapper1">
																		                                                                    
																		<input type="file" name="categoryImage" onChange={this.uploadImage.bind(this)} id="categoryImage" title="Click to upload category image" accept=".jpg,.jpeg,.png" />
																	</div>
																}
																{this.state.categoryImage 
																? 
																	<div className="row">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 productImgCol">
																			<div className="imageDiv">
																				<div className="prodImageInner">
																					<span className="prodImageCross" title="Delete" id="delete-categoryImage" data-imageUrl={this.state.categoryImage} onClick={this.deleteImage.bind(this)} >x</span>
																				</div>
																				<img title="view Image" alt="Please wait..." src={this.state.categoryImage ? this.state.categoryImage : "/images/notavailable.jpg"} className="img-responsive" />
																			</div>    
																		</div>
																	</div>
																:
																	null
																}
															{/*</div>*/}
														</div>
													</div>
													<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 divideCatgRows fieldWrapper">
															<label>Category Title <i className="redFont">*</i></label>
															<input value={this.state.category} name="category" id="category" onChange={this.createCategoryUrl.bind(this)} type="text" className="form-control edit-catg-new" placeholder="Category Title" ref="category" />
														</div>
														{/* <div className="divideCatgRows">
															<label>Category Image</label>
															<div className="col-lg-12 col-md-12 col-xs-6 col-sm-6">
															<div className="col-lg-12 col-md-12 col-xs-6 col-sm-6 categoryImage" style={{"backgroundImage":`url(`+(this.state.categoryImage && this.state.categoryImage !== "" ? this.state.categoryImage : "/images/notavailable.jpg")+`)`}}>
																<div className="row">
																	<input type="file" onChange={this.uploadImage.bind(this)} title="Click to Edit Photo" className="imgUp col-lg-12 col-sm-12 col-xs-12 col-md-12" accept=".jpg,.jpeg,.png" />
																</div>
															</div>
															</div>
														</div> */}
														{/*<div className="divideCatgRows fieldWrapper">*/}
															{/* <div className="col-lg-12 col-md-12"> */}
																{/*<label>Category Name in RL <i className="redFont"></i></label>
																<input value={this.state.categoryNameRlang} name="categoryNameRlang" id="categoryNameRlang" onChange={this.handleChange.bind(this)} type="text" className="form-control categoryNameRlang RegionalFont" placeholder="कॅटेगरी नेम इन रिजनल लँग्वेज" aria-label="categoryNameRlang" aria-describedby="basic-addon1" ref="categoryNameRlang" />*/}
															{/* </div> */}
														{/*</div>*/}														
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 fieldWrapper ">
															<label>Category Short Description </label>                                                                    
															<input type="text" value={this.state.categoryDescription} onChange={this.handleChange.bind(this)} name="categoryDescription" id="categoryDescription" className="form-control categoryShortDesc" placeholder="Category Short Description" ref="categoryDescription" />
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 subCatAddLabel">
														<label>Subcategories </label>
														{this.state.subcatgArr 
														?
															this.state.subcatgArr.map((dataRowArray, index)=>{
																{/*console.log("dataRowArray => ",dataRowArray);*/}
																return(
																	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding" key={index}>                                                                                  
																		<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding newSubCatgArr">   
																			<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding">             
																				<input type="text" id={dataRowArray.subCategoryCode} value={this.state['subCategoryTitle'+dataRowArray.subCategoryCode]} name={"subCategoryTitle"+dataRowArray.subCategoryCode} onChange={this.createSubCategoryUrl.bind(this)} className={"form-control newSubCatg"+index} placeholder="Sub Category Title" aria-label="Brand" aria-describedby="basic-addon1" ref={"newSubCatg"+index} />
																			</div>
																			<div className="col-lg-4 col-md-6 col-sm-6 col-xs-6">
																				<input disabled value={this.state['subcategoryUrl'+dataRowArray.subCategoryCode]} onChange={this.createSubCategoryUrl.bind(this)} id="subcategoryUrl" name={"subcategoryUrl"+dataRowArray.subCategoryCode} type="text" className={"form-control subcategoryUrl"+index} placeholder="Sub Category URL" ref="subcategoryUrl"  />
																			</div>
																			<div className="col-lg-1 col-md-1 col-sm-6 col-xs-6 NOpadding">
																			{this.state['subCategoryImage'+dataRowArray.subCategoryCode] 
																			?
																				null
																			:
																				<div className="">
																					<label class="custom-file-upload-subCategory">
																						<input type="file" name={'subCategoryImage'+dataRowArray.subCategoryCode} onChange={this.uploadImage.bind(this)} title="Click to Edit Photo" className="" accept=".jpg,.jpeg,.png" />
																						<i class="fa fa-cloud-upload"></i><br/> Image
																					</label>
																					{/* <label>SubCategory Image</label>                                                                    
																					<input type="file" name={'subCategoryImage'+dataRowArray.subCategoryCode} onChange={this.uploadImage.bind(this)} title="Click to Edit Photo" className="" accept=".jpg,.jpeg,.png" /> */}
																				</div>
																			}
																			{this.state['subCategoryImage'+dataRowArray.subCategoryCode] 
																			? 
																				<div className="row">
																					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 subCategoryImgCol">
																						<div className="subCategoryImg">
																							<div className="subCategoryImageInner">
																								<span className="prodImageCross" title="Delete" id={'delete-subCategoryImage'+dataRowArray.subCategoryCode} data-imageUrl={this.state['subCategoryImage'+dataRowArray.subCategoryCode]} onClick={this.deleteImage.bind(this)} >x</span>
																							</div>
																							<img title="view Image" alt="Please wait..." src={this.state['subCategoryImage'+dataRowArray.subCategoryCode] ? this.state['subCategoryImage'+dataRowArray.subCategoryCode] : "/images/notavailable.jpg"} className={"img-responsive " + "subCategoryImage"+index} />
																						</div>    
																					</div>
																				</div>
																			:
																				null
																			}
																			</div>
																			<div className="deleteSubCategory fa fa-trash" id={dataRowArray.subCategoryCode} onClick={this.deleteSubCategory.bind(this)}>
																			</div>
																		</div>
																		{/*<div className="error" name={"subCategoryTitleError"+dataRowArray.subCategoryCode} id={"subCategoryTitle"+dataRowArray.subCategoryCode+"-error"}>{this.state["subCategoryTitleError"+dataRowArray.subCategoryCode]}</div>*/}
																	</div>
																);
															})
														:
															null
														}
													</div>												
													<div className="col-lg-12">
														<div onClick={this.addNewSubCatArray.bind(this)}  className="submitBtn btn categoryBtn button3 col-lg-4">Add New Subcategory</div>
													</div>
													
														
														{/*<div className=" col-lg-6">
															<div onClick={this.cancelCategoryUpdate.bind(this)} className="edit-cancel-catg btn col-lg-12 col-md-12 col-sm-12 col-xs-12">Cancel</div>
														</div>*/}
														<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBottom30">
															{/* <div className="row">
																<div className="col-lg-4"> */}
																	{this.state.editId 
																	? 
																		<button onClick={this.updateCategory.bind(this)} className="btn button3 pull-right">Update</button>
																	:
																		<button onClick={this.submitCategory.bind(this)} className="btn button3 pull-right">Submit</button>
																	}
																{/* </div>											
															</div>												 */}
														</div>
												</form>
											</div>
											<div class="modal fade" id={"subCategoryModal"} role="dialog" style={{"textAlign" : "center"}}>
												<div class="modal-dialog modal-lg">
													<div class="modal-content">
														<div class="modal-header">
															<button type="button" class="close" data-dismiss="modal">&times;</button>
															<h4 className="invoicePaymentModalHeading">SubCategories of {this.state.categoryName}</h4>
														</div>
														<div class="modal-body">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
																<IAssureTable 
																	tableHeading          = {this.state.subcategorytableHeading}
																	twoLevelHeader        = {this.state.twoLevelHeader} 
																	dataCount             = {this.state.subcategoryDataCount}
																	tableData             = {this.state.subcategorytableData}
																	getData               = {this.getSubCategoryData.bind(this)}
																	tableObjects          = {this.state.subcategorytableObjects}
																	getSearchText         = {this.getSubCategorySearchText.bind(this)} 
																	tableName             = {this.state.subtableName}
																	currentView           = {"SubCategory-Management-table"}
																	selectedProducts      = {this.selectedProducts.bind(this)}
																	setunCheckedProducts  = {this.setunCheckedProducts.bind(this)}
																	unCheckedProducts     = {this.state.unCheckedProducts}
																/>													
															</div>
														</div>
														<div class="modal-footer" style={{"borderTop" : 0}}>
															{/* <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> */}
														</div>
													</div>
												</div>
											</div>
											{/* <div className="modal col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-12" id={"subCategoryModal"} aria-hidden="false" role="dialog">
												<div className="adminModal adminModal-dialog marginTopModal">
													<div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
														<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
															<div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 NOpadding-left NOpadding-right">
																<h4 className="invoicePaymentModalHeading">SubCategories of {this.state.categoryName}</h4>
															</div>
															<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
																<button type="button" className="adminCloseButton" data-dismiss="modal" >&times;</button>
															</div>
														</div>
														<div className="modal-body adminModal-body OneFieldModal paymentModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
															{/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																<h2 className="remainingBalance">Balance : <span className="BalanceAmt"><i className="fa fa-inr faIcon"></i> {this.state.remainingBalance}</span></h2>
															</div> */}
															{/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																<IAssureTable 
																	tableHeading          = {this.state.subcategorytableHeading}
																	twoLevelHeader        = {this.state.twoLevelHeader} 
																	dataCount             = {this.state.subcategoryDataCount}
																	tableData             = {this.state.subcategorytableData}
																	getData               = {this.getSubCategoryData.bind(this)}
																	tableObjects          = {this.state.subcategorytableObjects}
																	getSearchText         = {this.getSearchText.bind(this)} 
																	tableName             = {this.state.subtableName}
																	currentView           = {"SubCategory-Management-table"}
																	selectedProducts      = {this.selectedProducts.bind(this)}
																	setunCheckedProducts  = {this.setunCheckedProducts.bind(this)}
																	unCheckedProducts     = {this.state.unCheckedProducts}
																/>													
															</div>
														</div>
														<div className="modal-footer adminModal-footer paymentModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
														</div>
													</div>
												</div>
											</div>
											 */}
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  NOPadding">
												<IAssureTable 
													tableHeading          = {this.state.tableHeading}
													twoLevelHeader        = {this.state.twoLevelHeader} 
													dataCount             = {this.state.dataCount}
													tableData             = {this.state.tableData}
													getData               = {this.getData.bind(this)}
													tableObjects          = {this.state.tableObjects}
													getSearchText         = {this.getCategorySearchText.bind(this)} 
													tableName             = {this.state.tableName}
													currentView           = {"Category-Management-table"}
													selectedProducts      = {this.selectedProducts.bind(this)}
													setunCheckedProducts  = {this.setunCheckedProducts.bind(this)}
													unCheckedProducts     = {this.state.unCheckedProducts}
												/>
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
export default CategoryManagement;