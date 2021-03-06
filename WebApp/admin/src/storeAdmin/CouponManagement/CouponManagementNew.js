import React, { Component } 	from 'react';
import $ 							from 'jquery';
import S3FileUpload           from 'react-s3';
import CKEditor from 'ckeditor4-react';
import { CheckBoxSelection, Inject, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { Multiselect } from 'multiselect-react-dropdown';
import axios from 'axios';
import swal from 'sweetalert';
import IAssureTable from './IAssureTable.js';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

import moment from 'moment';
import './CouponManagement.css';


class CouponManagement extends Component {
	constructor(props) {
		 super(props);
		 this.state = {
			"addEditMode"         : "",
			"coupontitle"         : "",
			 sectionsList          : [],
			 categoryList          : [],
			 subCategoryList       : [],
			 section               : '',
			 category              : '',
			 subCategory           : '',
			selectedBrand         : [],
			selectedProducts      : [],
			selectedCategory      : [],
			categoryArray         : [],
			productArray          : [],
			brandArray            : [],
		  unCheckedCoupons 		: false,
			options             : [
										  {name: ''}
									 ],
			checkedProducts: "",
			couponcodeusage: "",
			couponcode: "",
			coupontype: "",
			couponin: "",
			couponvalue: "",
			couponImage: "",
			description: "",
			termscondition: "",
			discountvalue: "",
			maxdiscountvalue: "",
			availablefor: "",
			couponID: "",
			config: "",

			"tableHeading": { 
				// section             : "Section",
				// category            : "Category",
				// subCategory         : "SubCategory",
			coupontitle         : "Coupon Title",
			  couponcode          : "Coupon Code",
			  couponin            : "Coupon In",
			  couponvalue         : "Coupon Value",
			  minPurchaseAmount   : "Min Purchase Order",
			  maxDiscountAmount   : "Max Discount Amount",
			couponLimit 		: "Coupon Limit",
			  startdate           : "Start Date",
			  enddate             : "End Date",
				status              : "status",
			  actions             : 'Action',
			},
			"tableObjects": {
			  deleteMethod    : 'delete',
			  apiLink         : '/api/coupon/',
			  paginationApply : true,
			  searchApply     : false,
			  editUrl         : '/coupon-management'
			},
			"startRange"      : 0,
			"limitRange"      : 100,
			selector              : {},
			productCountByStatus  : "",
			// "editId": this.props.editId ? this.props.editId : ''
			"minstartdate"        : ''
		 };
			 this.onEditorChange = this.onEditorChange.bind(this);

	}

	handleChange(event) {
		 const target = event.target;
		 const name = target.name;
		 this.setState({
			[name]: event.target.value,
		 },()=>{
			 console.log("setState => ",this.state[name])
		 });

		 if(name === 'startdate'){
			this.setState({
			  enddate : ''
			})
		 }
	}
	selectedProducts(checkedProductsList) {
		  console.log('checkedUsersList', checkedProductsList);
		  this.setState({
				checkedProducts : checkedProductsList,
				messageData: {}
		  })

		  // console.log("this.state.checkedUser",this.state.checkedUser);
	 }
		onSelectProd(selectedList, selectedItem){
			 // console.log("selectedList=",selectedList); 
			 // console.log("selectedItem=",selectedItem.name);
			 this.setState({
				selectedProducts : selectedItem
			 },()=>{
				console.log("this.state.sourceOfIrrigation==", this.state.selectedProducts);
			 });
		  }
		onSelectCat(selectedList, selectedItem){
			 // console.log("selectedList=",selectedList); 
			 // console.log("selectedItem=",selectedItem.name);
			 this.setState({
				selectedCategory : selectedItem
			 },()=>{
				console.log("this.state.sourceOfIrrigation==", this.state.selectedCategory);
			 });
		  }
		onSelectBrand(selectedList, selectedItem){
			 // console.log("selectedList=",selectedList); 
			 // console.log("selectedItem=",selectedItem.name);
			 this.setState({
			  selectedBrand : selectedItem
			 },()=>{
				console.log("this.state.sourceOfIrrigation==", this.state.selectedBrand);
			 });
		  }

	componentWillReceiveProps(nextProps) {
		var editId = nextProps.match.params.editId;
		console.log("editId = ", editId);
		if (editId) {
		  this.setState({
			 editId: editId
		  })
		  this.edit(editId);
		}
	}
	  // componentDidUpdate(prevProps) {
	  //   // if(this.props.match.params.editId !== this.state.editId){
	  //   console.log("editId componentDidUpdate= ", this.props.match.params.editId);

	  //     this.setState({editId : this.props.match.params.editId});
	  //   }
	componentDidMount() {
		var userDetails 	= JSON.parse(localStorage.getItem("userDetails"));
	 	var token 			= userDetails.token;
	 	axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

		  this.getSectionData();
		 var date = new Date();
		 var day = date.getDate();
		 var month = date.getMonth() + 1;
		 var year = date.getFullYear();
		 if (month < 10) month = "0" + month;
		 if (day < 10) day = "0" + day;
		 var today = year + "-" + month + "-" + day;

		 this.setState({
			editId: this.props.match.params.editId,
			minstartdate:today
		 }, () => {
			console.log("this.state.editId = ", this.props.match.params.editId);
		 })

		 window.scrollTo(0, 0);
		 if (this.props.match.params.editId) {
			this.edit(this.props.match.params.editId);
		 }

		 
		 $.validator.addMethod("regxcoupontype", function (value, element, arg) {
			return arg !== value;
		 }, "Please select coupon Type.");
		 $.validator.addMethod("regxcouponstatus", function (value, element, arg) {
			return arg !== value;
		 }, "Please select Status .");
		 $.validator.addMethod("regxcouponavailablefor", function (value, element, arg) {
			return arg !== value;
		 }, "Please select Coupon Available for .");
		 $.validator.addMethod("regxcouponin", function (value, element, arg) {
			return arg !== value;
		 }, "Please select coupon In.");

			$("#CouponForm").validate({
			rules: {
			  // coupontype:{
			  //   required          : true,
			  //   regxcoupontype    : "-- Select Coupon Type --"
			  // },
				// availablefor : {
				//   required                  : true,
				//   regxcouponavailablefor    : "-- Select Coupon Code Available for --"
				// },
				// maxdiscountvalue:{
				//   required:true
				// },
				couponin : {
				 required      : true,
				 regxcouponin  : "-- Select Coupon In --"
			  },
			  status : {
				 required          : true,
				 regxcouponstatus  : "-- Select Status --"
			  },
			  couponvalue :{
				 required  : true,
				 // min       : this.state.couponin  === 'Percent' ? 100 : 9999
			  },
			  // section : {
				//     required            : true,
				//     regxcouponstatus    : ""
				// },
			  // category : {
				//     required            : true,
				//     regxcouponstatus    : ""
				// },
			  // subCategory : {
				//     required            : true,
				//     regxcouponstatus    : ""
				// },
			  couponcodeusage : {
				 required  : true
			  },
			  couponcode : {
				 required : true
			  },
			  coupontitle : {
				 required : true
			  },
			  startdate : {
				 required : true
			  },
			  enddate : {
				 required : true
			  },
			  maxDiscountAmount : {
				 required : true,
				 min : 1,
				 
			  },
			  minPurchaseAmount : {
				 required : true,
				 min : 1
			  },
			  numOfOrders : {
				 required : true,
				 min : 1
			  }
			},

			errorPlacement: function (error, element) {
			  // if (element.attr("name") === "coupontype") {
			  //   error.insertAfter("#coupontype");
			  // }
				// if (element.attr("name") === "section") {
			  //   error.insertAfter("#section");
			  // }
				// if (element.attr("name") === "category") {
				//     error.insertAfter("#category");
				// }
				// if (element.attr("name") === "subCategory") {
				//     error.insertAfter("#subCategory");
				// }
			  if (element.attr("name") === "couponcode") {
				 error.insertAfter("#couponcode");
			  }

			  if (element.attr("name") === "couponin") {
				 error.insertAfter("#couponin");
			  }

			  if (element.attr("name") === "couponvalue") {
				 error.insertAfter("#couponvalue");
			  }

			  if (element.attr("name") === "status") {
				 error.insertAfter("#status");
			  }

			  if (element.attr("name") === "coupontitle") {
				 error.insertAfter("#coupontitle");
			  }
				if (element.attr("name") === "maxDiscountAmount") {
				 error.insertAfter("#maxDiscountAmount");
			  }

			  if (element.attr("name") === "minPurchaseAmount") {
				 error.insertAfter("#minPurchaseAmount");
			  }

			  // if (element.attr("name") === "availablefor") {
			  //   error.insertAfter("#availablefor");
			  // }

			  // if (element.attr("name") === "couponcodeusage") {
			  //   error.insertAfter("#couponcodeusage");
			  // }

			  // if (element.attr("name") === "maxdiscountvalue") {
			  //   error.insertAfter("#maxdiscountvalue");
			  // }

			  if (element.attr("name") === "startdate") {
				 error.insertAfter("#startdate");
			  }

			  if (element.attr("name") === "enddate") {
				 error.insertAfter("#enddate");
			  }
			  if (element.attr("name") === "numOfOrders") {
				 error.insertAfter("#numOfOrders");
			  }


			}
		 });

		 this.randomSpecialChar(6);

			 axios
				.get('/api/projectsettings/get/S3')
				.then((response)=>{
				  // console.log("response S################2333",response);
				  const config = {
										  bucketName      : response.data.bucket,
										  dirName         : "test",
										  region          : response.data.region,
										  accessKeyId     : response.data.key,
										  secretAccessKey : response.data.secret,
									  }
				  this.setState({
					 config : config
				  })

				})
				.catch(function(error){
				  console.log(error);
				  if(error.message === "Request failed with status code 401")
					 {
						// swal("Your session is expired! Please login again.","", "error");
						// this.props.history.push("/");
					 }
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
				});
		 // console.log("=====><><><><><><>",this.randomSpecialChar(6));
		 this.Category();
		 this.getDataList();
		 this.gettableData();
		 this.getData(this.state.startRange, this.state.limitRange);
	}

	Category(){
		axios.get('/api/category/get/list')
		  .then((response) => {
			var categoryNameArray = [];
			if (response.data.length>0) {

				for (var i = 0; i < response.data.length; i++) {
					categoryNameArray.push({label : response.data[i].category,value:response.data[i]._id})
				}
			  this.setState({
				 categoryArray: categoryNameArray
			  },()=>{
			  	console.log("categoryArray",this.state.categoryArray);
			  })
			}
		})
		.catch((error) => {
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
	gettableData() {
		axios.get('/api/coupon/get/list')
			.then((response) => {
			  console.log('tableData = ', response.data);
			  var tableData = response.data.map((a, i) => {
					 console.log("a => ",a);
					 return {
						  coupontitle         : a.coupontitle ? a.coupontitle : "-",
						  couponcode          : a.couponcode ? a.couponcode : "-",
						  couponin            : a.couponin ? a.couponin : "-",
						  couponvalue         : a.couponvalue ? a.couponvalue : "-",
						  minPurchaseAmount   : a.minPurchaseAmount ? a.minPurchaseAmount : "-",
						  maxDiscountAmount   : a.maxDiscountAmount ? a.maxDiscountAmount : "-",
					couponLimit 		: a.couponLimit ? a.couponLimit : 0,
						  status              : a.status ? a.status : "-",
						  startdate        	: moment(a.startdate).format("DD/MM/YYYY") ? moment(a.startdate).format("DD/MM/YYYY") : "-",
						  enddate           	: moment(a.enddate).format("DD/MM/YYYY") ? moment(a.enddate).format("DD/MM/YYYY") : "-",
						  _id 				: a._id,
						  // section             : a.section,
						  // category            : a.category,
						  // subCategory         : a.subCategory,
						  // coupontype          : a.coupontype,
						  // couponcodeusage     : a.couponcodeusage,
						  /*selectedCategory      : a.selectedCategory,
						  selectedBrand     : a.selectedBrand,
						  selectedProducts  : a.selectedProducts,	*/
						  // selectedCategory    : a.selectedCategory.length > 0 ? a.selectedCategory.map((data,index)=>{return data.label}) : "" ,
						  // selectedBrand       : a.selectedBrand.length > 0 ? a.selectedBrand.map((data,index)=>{return data.label}) : "",
						  // selectedProducts    : a.selectedProducts.length > 0 ? a.selectedProducts.map((data,index)=>{return data.label}) : "",
						  
					 }
				})
			  this.setState({
				 tableData 		: tableData,
			  unCheckedCoupons 	: false
			  })
			})
			.catch((error) => {
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
			});
	}

	getData(startRange, limitRange) {
		  this.setState({ messageData: {} })
		  var data = {
				startRange: startRange,
				limitRange: limitRange
		  }
		  // this.getCount();
		  axios.get('/api/products/get/list')
				.then((response) => {
				var brandNameArray = [];
				var productNameArray = [];
				console.log(" products response",response.data);

					if (response.data.length>0) {

						for (var i = 0; i < response.data.length; i++) {
							brandNameArray.push({label:response.data[i].brand,value:response.data[i]._id})
							productNameArray.push({label:response.data[i].productName,value:response.data[i]._id})
						}
					  this.setState({
						 productArray: productNameArray,
						 brandArray: brandNameArray,
					  },()=>{
					  	// console.log("categoryArray",this.state.categoryArray);
					  })
					}
					 
				})
				.catch((error) => {
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

	randomSpecialChar (length) {
		 var result           = '';
			var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			var charactersLength = characters.length;
			for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			// return result;
			this.setState({
				 couponcode: result
			  })
	}

	getDataList() {
		 

	}
	handleChangeCategory(categoryArray,event){
		this.setState({ selectedCategory:event },()=>{console.log("event.target.value><><><>",this.state.selectedCategory)})
	}

	  
			//  this.setState({ selectedCategory:event.value },()=>{console.log("event.target.value><><><>",this.state.selectedCategory)})
	
	handleChangeBrand(BrandArray,event){
		this.setState({ selectedBrand:event },()=>{console.log("event.target.value><><><>",this.state.selectedCategory)})
	}
	handleChangeProducts(productsArray,event){
		this.setState({ selectedProducts:event },()=>{console.log("event.target.value><><><>",this.state.selectedCategory)})
	}
	productCountByStatus(){
			  axios.get('/api/products/get/productCountByStatus')
					.then((response) => {

						 this.setState({
							  productCountByStatus: response.data
						 })

					})
					.catch((error) => {
						console.log("error => ",error);
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
	/*getData(startRange, limitRange) {
		 axios.get('/api/coupon/get/list-with-limits/' + startRange + '/' + limitRange)
			.then((response) => {
			  console.log('tableData = ', response.data);
			  var tableData = response.data.map((a, i) => {
						return {
							_id: a._id,
							"coupontype"  : a.coupontype,
					"couponin"    : a.couponin,
					"couponvalue" : a.couponvalue,
					"startdate"     : moment(a.startdate).format("DD/MM/YYYY"),
					"enddate"       : moment(a.enddate).format("DD/MM/YYYY"),
							
						}
					})
			  this.setState({
				 tableData: tableData
			  })
			})
			.catch((error) => {
			  console.log('error', error);
			});
	}*/
	setLimit(event){
			
	}

	submitcoupon(event) {
		 event.preventDefault();
		 if ($('#CouponForm').valid()) {
		  	var couponcodeCheck = this.state.tableData.find(x=>x.couponcode===this.state.couponcode)
		  		console.log("couponcodeCheck",couponcodeCheck);

		 	if (couponcodeCheck !== undefined) {
		 		swal("","Coupon Code already exits");

		 	}else{

				 var formValues = {
					"coupontitle"       : this.state.coupontitle,
					  "couponcode"        : this.state.couponcode,
					  "couponin"          : this.state.couponin,
					  "couponvalue"       : this.state.couponvalue,
						  "minPurchaseAmount" : this.state.minPurchaseAmount,
						  "maxDiscountAmount" : this.state.maxDiscountAmount,
						  "numOfOrders"       : this.state.numOfOrders,
					  "startdate"         : this.state.startdate,
					  "enddate"           : this.state.enddate,
					  "couponImage"       : this.state.couponImage,
					  "status"            : this.state.status,
					  "createdBy"         : localStorage.getItem("admin_ID")
					  // "coupontype"        : this.state.coupontype,
					  // "couponcodeusage"   : this.state.couponcodeusage,
					  // "maxdiscountvalue"  : this.state.maxdiscountvalue,
					  // "availablefor"      : this.state.availablefor,
						  // "section_ID"        : this.state.section,
						  // "category_ID"       : this.state.category,
						  // "subCategory_ID"    : this.state.subCategory,
					  // "selectedCategory"  : this.state.selectedCategory,
					  // "selectedBrand"     : this.state.selectedBrand,
					  // "selectedProducts"  : this.state.selectedProducts,
					  // "description"       : this.state.description,
					  // "termscondition"    : this.state.termscondition,
				 }
				console.log('formValues===>', formValues);
				axios.post('/api/coupon/post', formValues)
				.then((response) => {
				  swal({
					 text: response.data.message,
				  });

					this.setState({
					 "coupontitle" 		: "",
					"couponcode" 		: "",
					"couponin" 			: "",
					"couponvalue"		: "",
					"minPurchaseAmount" : "",
					"maxDiscountAmount" : "",
					"numOfOrders"       : "",
					"status"			: "",
					"startdate"     	: "",
					"enddate"       	: "",
					"couponImage"       : "",
				  });
				  // this.props.history.push('/coupon-management');
					this.gettableData();
				})
				.catch((error) => {
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
				});
			}

		 }else{
			swal({
			  text: "Please Fill all Feilds"
			});
		 }
	}

	updatecoupon(event) {
		 event.preventDefault();
		 if ($('#CouponForm').valid()) {
			var formValues = {
			  "couponID" 			: this.state.couponID,
			  "coupontitle" 		: this.state.coupontitle,
			  "couponcode" 		: this.state.couponcode,
			  "couponin" 			: this.state.couponin,
			  "couponvalue"		: this.state.couponvalue,
			"minPurchaseAmount" : this.state.minPurchaseAmount,
				"maxDiscountAmount" : this.state.maxDiscountAmount,
			"numOfOrders"       : this.state.numOfOrders,
			  "status"			: this.state.status,
			  "startdate"     	: this.state.startdate,
			  "enddate"       	: this.state.enddate,
			  "couponImage"       : this.state.couponImage,
			  // "availablefor"		: this.state.availablefor,
			  // "coupontype" 		: this.state.coupontype,
			  // "couponcodeusage" 	: this.state.couponcodeusage,
			  // "maxdiscountvalue"	: this.state.maxdiscountvalue,
			  // "selectedCategory"  : this.state.selectedCategory,
			  // "selectedBrand"     : this.state.selectedBrand,
			  // "selectedProducts"  : this.state.selectedProducts,
			  // "description"       : this.state.description,
			  // "termscondition"    : this.state.termscondition,
			}
			console.log("formValues",formValues);
			axios.patch('/api/coupon/patch', formValues)
			  .then((response) => {
				 swal({
					text: response.data.message,
				 });
				 this.getData(this.state.startRange, this.state.limitRange);
				 this.setState({
					"couponID" 			: "",
				"coupontitle" 		: "",
				"couponcode" 		: "",
				"couponin" 			: "",
				"couponvalue"		: "",
				"minPurchaseAmount" : "",
				"maxDiscountAmount" : "",
				"numOfOrders"       : "",
				"status"			: "",
				"startdate"     	: "",
				"enddate"       	: "",
				"couponImage"       : "",
				 });
				 this.props.history.push('/coupon-management');
				  this.gettableData();
			  })
			  .catch((error) => {
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
			  });
		 }
	}

	edit(id) {
		 axios.get('/api/coupon/get/one/' + id)
			.then((response) => {
			console.log('edit = ', response.data);

			  if (response.data) {
				 this.setState({
					"couponID"		    : response.data._id,
					"coupontitle"		: response.data.coupontitle,
				  "couponcode"		: response.data.couponcode,
				  "couponin"			: response.data.couponin,
				  "couponvalue"		: response.data.couponvalue,
				"minPurchaseAmount" : response.data.minPurchaseAmount,
				"maxDiscountAmount" : response.data.maxDiscountAmount,
				"numOfOrders" 		: response.data.couponLimit,
				  "couponImage"       : response.data.couponImage,
				  "status" 			: response.data.status,				
					"startdate"     	: moment(response.data.startdate).format("YYYY-MM-DD"),
				"enddate"       	: moment(response.data.enddate).format("YYYY-MM-DD"),

				  // "maxdiscountvalue"	: response.data.maxdiscountvalue,
				  // "couponcodeusage"	: response.data.couponcodeusage,
				  // "availablefor" 		: response.data.availablefor,
				  // "selectedCategory"  : response.data.selectedCategory,
				  // "selectedBrand"     : response.data.selectedBrand,
				  // "selectedProducts"  : response.data.selectedProducts,
				  // "description"       : response.data.description,
				  // "termscondition"    : response.data.termscondition,
				// "categoryArrayfields"     : [response.data.selectedCategory],
				  // "coupontype"		: response.data.coupontype,
			  });
			  

			  }
			})
			.catch((error) => {
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
			});
	}
	onEditorChange( evt ) {
			this.setState( {
				 description: evt.editor.getData()
			} );
	}

	onEditortermsChange( evt ) {
			this.setState( {
				 termscondition: evt.editor.getData()
			} );
	}


	 uploadImage(event){
		event.preventDefault();
		let self = this;
		if (event.currentTarget.files && event.currentTarget.files[0]) {
			var file = event.currentTarget.files[0];
			var newFileName = JSON.parse(JSON.stringify(new Date()))+"_"+file.name;
			var newFile = new File([file],newFileName);
			// console.log("file",newFile);
			if (newFile) {
			// console.log("config--------------->",this.state.config);
			  var ext = newFile.name.split('.').pop();
			  if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
				 if (newFile) {
					S3FileUpload
					  .uploadFile(newFile,this.state.config)
					  .then((Data)=>{
						 
							var obj1={
							  imgPath : Data.location,
							}
							// console.log("imgPath",Data.location)
							// var imgArrayWSaws = this.state.imgArrayWSaws;
							// imgArrayWSaws.push(obj1);
							this.setState({
							  // workspaceImages : imgArrayWSaws
							  couponImage : Data.location
							})
					  })
					  .catch((error)=>{
						 console.log("formErrors");
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

				 }else{         
					swal("File not uploaded","Something went wrong","error"); 
				 }
			  }else{
				 swal("Please upload file","Only Upload  images format (jpg,png,jpeg)","warning");  
			  }
			}
		 }
	  }
	 deleteImage(event){
		  var id = event.target.id;
		  // var productImageArray = this.state.productImageArray;
		  // console.log('productImage', productImageArray, id);

		  // productImageArray.splice(productImageArray.findIndex(v => v === id), 1);
		  this.setState({
				couponImage : "",
				// productImageArray: productImageArray
		  },()=>{
				// console.log('subcatgArr', this.state.subcatgArr);
		  });
	 }
	 CouponBulkAction(event) {
		  var selectedAction = this.state.selectedAction
		  var formValues = {
				selectedProducts 	: this.state.checkedProducts,
				selectedAction 		: this.state.selectedAction
		  }
		  console.log("formValues",formValues);
		  axios.patch('/api/coupon/patch/couponBulkAction', formValues)
			  .then((response) => {
				$('#bulkActionModal').hide();

				 
				 this.gettableData();
				 this.setState({
				checkedProducts : [],
					"coupontype"  		: '',
					"couponin"    		: '',
					"couponvalue" 		: '',
					"startdate"     	: '',
					"enddate"       	: '',
				"selectedAction" 	: '',
				"unCheckedCoupons" 	: true,
				 });
				 // this.props.history.push('/coupon-management');
			  })
			  .catch((error) => {
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
			  });
	 }
	 bulkActionChange(event) {
		  // console.log(event.target.value);
		  if (event.target.value) {
				this.setState({ 
				unCheckedCoupons 	: false,
				unCheckedProducts 	: false, 
				selectedAction 		: event.target.value, 
				messageData 		: {} 
			})
				$('#bulkActionModal').show();
				$('.confirmmsg label').html('');
				$('.confirmmsg label').append("Do you want to " + event.target.value.toLowerCase() + " selected Coupons ?")
				if (this.state.checkedProducts && this.state.checkedProducts.length > 0) {
					 $('.confirmmsg, #bulkActionModalbtn').show();
					 $('.selectmsg').hide();
				} else {
					 $('.selectmsg').show();
					 $('#bulkActionModalbtn, .confirmmsg').hide();
				}
		  }
		  else{
				$('#bulkActionModal').hide();
		  } 
	 }
	 closeModal(event){
		  $('#bulkActionModal').hide();
	 }

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

	 getCategories(section_ID){
		  if (section_ID && section_ID !== "All") {  
				axios.get('/api/category/get/'+section_ID)
				.then((res)=>{
					 console.log('res', res.data);
					 this.setState({
						  categoryList : res.data
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
		  } else {
				this.setState({
					 categoryList : []
				})
		  }
	}

	 handleSelect(event){
		// const target = event.target;
		const name   = event.target.name;
		  console.log("name ====> ",name);

		this.setState({
			// section     : event.target.value.split('|')[0],
			[name]  : event.target.value,
		},()=>{
				console.log("state name => ", name)
				console.log("state name => ", this.state[name])
			 if(name === 'section' && this.state.section && this.state.section !== undefined){
					 this.getCategories(this.state.section);
				}
				if(name === 'category' && this.state.category && this.state.category !== undefined){
					 var category = this.state.categoryList.filter((item) => item._id === this.state.category);
					 console.log("category => ",category);
					 if(category && category.length > 0 && category[0].subCategory && category[0].subCategory.length > 0){
						  this.setState({
								subCategoryList : category[0].subCategory
						  },()=>{
								console.log("subCategoryList => ", this.state.subCategoryList)
						  })
					 }
				}
		});
	}

render() {
  	const categoryArray = this.state.categoryArray;
  	const productArray = this.state.productArray;
  	// console.log("productArray><><><><>",productArray);
  	const brandArray = this.state.brandArray;
	 // const brandArrayfields: object = { text: 'brand', value: 'brand' };
	 // const productArrayfields: object = { text: 'product', value: 'product' };
	 // const categoryArrayfields: object = { text: 'category', value: 'category' };

	 return (
		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
		  <section className="content">
			 <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
				<div className="row">
				  <div className="">
					 <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
						<h4 className="weighttitle NOpadding-right">Coupon Management</h4>
					 </div>
					 <form id="CouponForm" className="">
						  {/* <div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
						  	<div className="col-lg-12">
							 		<label>Section<i className="redFont">*</i></label>
							 		<select onChange={this.handleSelect.bind(this)} value={this.state.section}  name="section" className="form-control allProductCategories" aria-describedby="basic-addon1" id="section" ref="section" required>
										  <option disabled value="">-- Select Section --</option>
										  <option selected value="All">All</option>
										  {
												this.state.sectionsList && this.state.sectionsList.length>0 
												?
													 this.state.sectionsList.map((data, index)=>{
														  return(
																<option value={data._id}>{data.section}</option>
														  );
													 })
												:
													 null
										  }
									 </select>
						  	</div>
							</div> */}
							{/* <div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
						  	<div className="col-lg-12">
							 		<label>Category<i className="redFont">*</i></label>
							 		<select onChange={this.handleSelect.bind(this)} name="category" className="form-control allProductCategories" aria-describedby="basic-addon1" value={this.state.category} id="category" ref="category" required>
										  <option disabled selected value="">-- Select Category --</option>
										  <option selected value="All">All</option>
										  {
												this.state.categoryList && this.state.categoryList.length>0 
												?
													 this.state.categoryList.map((data, index)=>{
														  return(
																<option value={data._id}>{data.category}</option>
														  );
													 })
												:
													 null
										  }
									 </select>
						  	</div>
							</div> */}
							{/* <div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
						  	<div className="col-lg-12">
							 		<label>SubCategory<i className="redFont">*</i></label>
							 		<select onChange={this.handleSelect.bind(this)} value={this.state.subCategory}  name="subCategory" className="form-control allProductCategories" aria-describedby="basic-addon1" id="subCategory" ref="subCategory" required>
										  <option selected value="">-- Select SubCategory --</option>
										  <option selected value="All">All</option>
										  {
												this.state.subCategoryList && this.state.subCategoryList.length>0 
												?
													 this.state.subCategoryList.map((data, index)=>{
														  return(
																<option value={data._id}>{data.subCategoryTitle}</option>
														  );
													 })
												:
													 null
										  }
									 </select>
						  	</div>
							</div> */}
					 	<div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
						  	<div className="col-lg-12">
							 		<label>Coupon Code Title<i className="redFont">*</i></label>
							 		<input value={this.state.coupontitle} name="coupontitle" id="coupontitle"  onChange={this.handleChange.bind(this)} type="text" className="form-control edit-catg-new" placeholder="Enter coupon Title" ref="coupontitle" required/>
						  	</div>
							</div>
							<div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
						  	<div className="col-lg-12">
							 		<label>Coupon Code<i className="redFont">*</i></label>
							 		<input value={this.state.couponcode} name="couponcode" id="couponcode" maxLength="10" onChange={this.handleChange.bind(this)} type="text" className="form-control edit-catg-new" placeholder="Enter coupon code" ref="couponcode" required/>
						  	</div>
							</div>
							{/* <div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
						  	<div className="col-lg-12">
							 		<label>Coupon Code Usage<i className="redFont">*</i></label>
							 		<input value={this.state.couponcodeusage} name="couponcodeusage" id="couponcodeusage" maxLength="10" onChange={this.handleChange.bind(this)} type="number" className="form-control edit-catg-new" placeholder="Enter coupon code usage" ref="couponcodeusage" required/>
						  	</div>
							</div> */}
						 {/* <div className="col-lg-4 fieldWrapper inputHeight60">
							  <label>Coupon Type<i className="redFont">*</i></label>
							  <select onChange={this.handleChange.bind(this)} value={this.state.coupontype} id="coupontype" ref="coupontype" name="coupontype" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding  form-control">
								 <option  name="No Select" >-- Select Coupon Type --</option>
								 <option value="Order Base">Order Base</option>
								 <option value="Product Base">Product Base</option> 
							  </select>
						 </div> */}
						 <div className="col-lg-4 fieldWrapper inputHeight60">
							  <label>Coupon In<i className="redFont">*</i></label>
							  <select onChange={this.handleChange.bind(this)} value={this.state.couponin} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="couponin" name="couponin" id="couponin" >
								 <option  name="No Select"  >-- Select Coupon In --</option>
								 <option name="percent" value ="Percent" >Percent</option>
								 <option name="amount"  value ="Amount"  >Amount</option>
							  </select>
						 </div>
						 <div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
							  <div className="col-lg-12">
								 <label>Discount value<i className="redFont">*</i></label>
								 <input value={this.state.couponvalue} name="couponvalue" id="couponvalue" min="1" max={this.state.couponin === "Percent" ? 100 : 999999999999} onChange={this.handleChange.bind(this)} type="number" className="form-control edit-catg-new" placeholder="Discount Value" ref="couponvalue" required/>
							  </div>
						 </div>
							<div className="col-lg-4 fieldWrapper inputHeight60">
						  	<label>Status<i className="redFont">*</i></label>
						  	<select onChange={this.handleChange.bind(this)} value={this.state.status} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="status" name="status" id="status" >
							 		<option  name="No Select"  >-- Select Status --</option>
							 		<option name="Active" value ="Active" >Active</option>
							 		<option name="Inactive"  value ="Inactive"  >Inactive</option>
						  	</select>
							</div>
							<div className="col-lg-4 fieldWrapper inputHeight60 ">
							  <div className="">
								 <label>Start Date<span className="redFont">*</span></label>
								 {/* <input type="date" onChange={this.handleChange.bind(this)} value={moment(this.state.startdate).format("DD-MM-YYYY")}  className="form-control edit-catg-new" name="startdate" id="startdate" ref="startdate" /> */}
								 <input type="date" id="startdate"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.startdate} ref="startdate" name="startdate" onChange={this.handleChange.bind(this)} min={this.state.minstartdate} required/>
								 
							  </div>
						 </div>
							<div className="col-lg-4 fieldWrapper inputHeight60 ">
							  <div className="">
								 <label>End Date<span className="redFont">*</span></label>
								 <input type="date" id="enddate" min={this.state.startdate} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.enddate} ref="enddate" name="enddate" onChange={this.handleChange.bind(this)} required/>
							  </div>
							</div>
						 <div className="col-lg-12 fieldWrapper noPadding">
							  <div className="col-lg-12">
								 <label>Conditions If Any<i className="redFont">*</i></label>
							  </div>
						 </div>
						  <div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
							  <div className="col-lg-12">
								 <label>Minimum Purchase Amount to Apply Discount<span className="redFont">*</span></label>
								 <input value={this.state.minPurchaseAmount} name="minPurchaseAmount" id="minPurchaseAmount" maxLength="6"  onChange={this.handleChange.bind(this)} type="number" className="form-control edit-catg-new" placeholder="Minimum Purchase Amount" ref="minPurchaseAmount" />
							  </div>
						 </div>
						  <div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
							  <div className="col-lg-12">
								 <label>Maximum Discount Amount<span className="redFont">*</span></label>
								 <input value={this.state.maxDiscountAmount} name="maxDiscountAmount" id="maxDiscountAmount" maxLength="6" max = {this.state.minPurchaseAmount ?  parseInt(this.state.minPurchaseAmount) -1 : 9999999} onChange={this.handleChange.bind(this)} type="number" className="form-control edit-catg-new" placeholder="Maximum Discount Amount" ref="maxDiscountAmount" />
							  </div>
						 </div>
					<div className="col-lg-4 fieldWrapper inputHeight60 noPadding">
							  <div className="col-lg-12">
								 <label>Applicable For Number of Orders<span className="redFont">*</span></label>
								 <input value={this.state.numOfOrders} name="numOfOrders" min="1" id="numOfOrders" maxLength="6"  onChange={this.handleChange.bind(this)} type="number" className="form-control edit-catg-new" placeholder="Number of Orders" ref="numOfOrders" />
							  </div>
						 </div>
					
					
					{/* <div className="col-lg-4 fieldWrapper inputHeight60">
						  	<label>Coupon Code Available for<i className="redFont">*</i></label>
						  	<select onChange={this.handleChange.bind(this)} value={this.state.availablefor} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="availablefor" name="availablefor" id="availablefor" >
							 		<option  name="No Select"  >-- Select Coupon Code Available for --</option>
							 		<option name="All" value ="All" >All Products</option>
							 		<option name="Category"  value ="Category"  >Certain Category</option>
							 		<option name="Brand"  value ="Brand"  >Certain Brand</option>
							 		<option name="Product"  value ="Product"  >Certain Product</option>
						  	</select>
							</div> */}


					 	{
					 		this.state.availablefor == "Category" || this.state.availablefor == "All" ?

								<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6 fieldWrapper inputHeight60">
								  <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Select Category</label>
								 {/* <Multiselect
																			 options = {  categoryArray && categoryArray.length > 0 ?
																							  categoryArray.map((data, index)=>{
																								 return({
																											 
																											  "name" : data
																								 })
																							  }): ""
																						  }   
																			 // Options to display in the dropdown
																			  selectedValues={this.state.selectedCategory} // Preselected value to persist in dropdown
																			  showCheckbox={true}
																			  getSelectedItems={true}
																			  onSelect={this.onSelectCat.bind(this)} // Function will trigger on select event
																			  onRemove={this.onRemove} // Function will trigger on remove event
																			  displayValue="name" // Property name to display in the dropdown options
																			  value={this.state.selectedCategory} 
																			  // onChange={this.handleChangeCategory.bind(this)}
																			  name="sourceOfIrrigation"
																			  className="Multiselect MultiListContainer"
								 
																			  />*/}
							{/* <MultiSelectComponent id="categoryChange" dataSource={categoryArray}
								 class="selectCategories"
										change={this.handleChangeCategory.bind(this)}
										fields={categoryArrayfields} placeholder="You can select multiple Category" mode="CheckBox" selectAllText="Select All" unSelectAllText="Unselect All" showSelectAll={true}>
									{console.log("categoryArrayfields",categoryArrayfields)}
										<Inject services={[CheckBoxSelection]} />
								  </MultiSelectComponent> */}

							<ReactMultiSelectCheckboxes
								class="categorySelectButton"
	 							options={[{label: "All", value: "*"}, ...categoryArray]}
								value={this.state.selectedCategory}
								onChange={this.handleChangeCategory.bind(this,categoryArray)}
							/>

							 </div>
						 : null
					 	}  

					 	{
					 		this.state.availablefor == "Brand" || this.state.availablefor == "All" ?
							  <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6 fieldWrapper inputHeight60">
								  <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Select Brand</label>
								  {/*<Multiselect
									  options = {  brandArray && brandArray.length > 0 ?
														brandArray.map((data, index)=>{
														  return({
																	  
																		"name" : data
														  })
														}): ""
													}   
									  // Options to display in the dropdown
										selectedValues={this.state.selectedBrand} // Preselected value to persist in dropdown
										showCheckbox={true}
										getSelectedItems={true}
										onSelect={this.onSelectBrand.bind(this)} // Function will trigger on select event
										onRemove={this.onRemove} // Function will trigger on remove event
										displayValue="name" // Property name to display in the dropdown options
										value={this.state.selectedBrand} 
										// onChange={this.handleChangeBrand.bind(this)}
										name="sourceOfIrrigation"
										className="Multiselect MultiListContainer"

										/>*/}
							 <ReactMultiSelectCheckboxes
								class="brandSelectButton"
	 							options={[{label: "All", value: "*"}, ...brandArray]}
								value={this.state.selectedBrand}
								onChange={this.handleChangeBrand.bind(this,brandArray)}
							/>

								  {/* <MultiSelectComponent id="statusChange" dataSource={brandArray}
										change={this.handleChangeBrand.bind(this)}
										fields={brandArrayfields} placeholder="You can select multiple Brand" mode="CheckBox" selectAllText="Select All" unSelectAllText="Unselect All" showSelectAll={true}>
										<Inject services={[CheckBoxSelection]} />
								  </MultiSelectComponent> */}
							 </div>
						  : null
					 	} 

					 	{
					 		this.state.availablefor == "Product" || this.state.availablefor == "All" ?
		 
								  <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6 fieldWrapper inputHeight60">
									  <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Select Product</label>
									  {/*<Multiselect
												 options = {  this.state.productArray && this.state.productArray.length > 0 ?
																  this.state.productArray.map((data, index)=>{
																	 return({
																				 
																				  "name" : data
																	 })
																  }): ""
															  }   
												 // Options to display in the dropdown
												  selectedValues={this.state.selectedProducts} // Preselected value to persist in dropdown
												  showCheckbox={true}
												  getSelectedItems={true}
												  onSelect={this.onSelectProd.bind(this)} // Function will trigger on select event
												  onRemove={this.onRemove} // Function will trigger on remove event
												  displayValue="name" // Property name to display in the dropdown options
												  value={this.state.selectedProducts} 
												  // onChange={this.handleChangeProducts.bind(this)}
												  name="sourceOfIrrigation"
												  className="Multiselect MultiListContainer"
	 
												  />*/}
									  {/* <MultiSelectComponent id="statusChange" dataSource={productArray}
											change={this.handleChangeProducts.bind(this)}
											fields={productArrayfields} placeholder="You can select multiple Product" mode="CheckBox" selectAllText="Select All" unSelectAllText="Unselect All" showSelectAll={true}>
											<Inject services={[CheckBoxSelection]} />
									  </MultiSelectComponent> */}
								<ReactMultiSelectCheckboxes
									class="productSelectButton"
									options={[{label: "All", value: "*"}, ...productArray]}
									value={this.state.selectedProducts}
									onChange={this.handleChangeProducts.bind(this,productArray)}
								/>

								 </div>
						  : null
					 	}  
					

						  {/* <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 "> 
			 				<label className="">Description<span className="redFont">*</span></label>
								<div className="">
									 <CKEditor data={this.state.description} onChange={this.onEditorChange.bind(this)} />
			 				  </div>
						  </div>  
						  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 "> 
			 				<label className="">Terms & Conditions<span className="redFont">*</span></label>
								<div className="">
									 <CKEditor data={this.state.termscondition} onChange={this.onEditortermsChange.bind(this)} />
			 				  </div>
						  </div>                                      */}
						  <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 ">                                      
												  
								  {
									 this.state.couponImage ?
									 null
									 :                                        
									 <div className="divideCatgRows categoryImgWrapper">
										  <label>Coupon Image</label>                                                                    
										  <input type="file" name="couponImage" id="couponImage" onChange={this.uploadImage.bind(this)} title="Click to Edit Photo"  className="" accept=".jpg,.jpeg,.png" />
									 </div>
								  }
								  {
									 this.state.couponImage ? 
									 <div className="row">
										<div className="col-lg-4 productImgCol">
										  <div className="prodImage">
											 <div className="prodImageInner">
												  <span className="prodImageCross" title="Delete" onClick={this.deleteImage.bind(this)} >x</span>
											 </div>
											 <img title="view Image" alt="Please wait..." src={this.state.couponImage ? this.state.couponImage : "/images/notavailable.jpg"} className="img-responsive" />
										  </div>    
										</div>
									 </div>
									 :
									 null
								  }
						  </div>

						 <div className="col-lg-12">
							  <div className="col-lg-3  pull-right">
								 <label>&nbsp;</label>
								 {
									this.props.match.params.editId ?
									  <button onClick={this.updatecoupon.bind(this)} className="col-lg-12 btn-primary btn ">Update</button>
									  :
									  <button onClick={this.submitcoupon.bind(this)} className=" col-lg-12 btn-primary btn ">Submit</button>
								 }
							  </div>
						 </div>

					 </form>
				  </div>
				  		<div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NoPadding">
									 <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
										  <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Coupon Bulk Action</label>
										  <select className="form-control selectRole filterDropdown" ref="filterDropdown" name="filterDropdown"  onChange={this.bulkActionChange.bind(this)} style={{width:'200px'}} >
												<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled selected>-- Select --</option>   
												<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Active">Active selected Coupon</option>
												<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Inactive">Inactive selected Coupon</option>
												<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="delete">Delete selected Coupon</option>
										  </select>
									 </div>
									 
														 
													 
							  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 couponManagementTable">
									 <IAssureTable
										tableHeading={this.state.tableHeading}
										twoLevelHeader={this.state.twoLevelHeader}
										dataCount={this.state.dataCount}
										tableData={this.state.tableData}
											 getData={this.gettableData.bind(this)}
								  unCheckedCoupons ={this.state.unCheckedCoupons}
									 //   getData={this.getData.bind(this)}
										selectedProducts={this.selectedProducts.bind(this)}
										tableObjects={this.state.tableObjects}
									 />
								 </div>
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
															  <label>Please select coupon to perform bulk action</label>
														 </div>
														 <br />
											  </div>
											  <div className="modal-footer"> 
													 <button type="button" className="btn btn-default" id="bulkActionModalclose" onClick={this.closeModal.bind(this)} data-dismiss="modal">Close</button>
													  <a href="#" className="btn btn-info" id="bulkActionModalbtn" data-dismiss="modal" onClick={this.CouponBulkAction.bind(this)} style={{"margin-bottom": 0,"margin-left": "5px"}}>Yes</a>
											  </div>
										 </div>
									</div>
							  </div>

						</div>
			 		</div>
		  	</section>
		  </div>
	 );
  }
}

export default CouponManagement;
