import React, { Component }   	from 'react';
import $                      	from 'jquery';
import axios                  	from 'axios';
import jQuery                 	from 'jquery';
import swal                   	from 'sweetalert';
import S3FileUpload           	from 'react-s3';
import moment                 	from "moment";
import IAssureTable           	from "../OrderTable/IAssureTable.jsx";
// import { result }            from 'underscore';
// import IAssureTable          from '../../../../coreadmin/IAssureTable/IAssureTable.jsx';
import 'jquery-validation';
import 'bootstrap/js/tab.js';
// import '../css/CategoryManagement.css';
// import { set } from 'mongoose';

class AllOrdersList extends Component{
	constructor(props) {
		super(props);
		this.state = {
			                  
			"tableHeading"     	: {
									orderNumber             : "Order Number",
									orderDate             	: "Order Date",
									customer    			: "Customer",
									totalPrice         		: "Total Price",
									// vendors 				: "Vendors",
									vendorName  			: "Vendor Name",
									vendorPrice 			: "Vendor Price",
									vendorStatus 			: "Vendor Status",
									changeVendorStatus 	    : "Change Vendor Status"
			},
			"twoLevelHeader"    : {
									apply : true,
									firstHeaderData : [
										{
											heading 		: 'Order Details',
											mergedColoums 	: 4,
											// mergedRows 		: 1
										},
										// {
										// 	heading 		: 'Order Date',
										// 	mergedColoums 	: 1,
										// 	mergedRows 		: 1
										// },
										// {
										// 	heading 		: 'Customer',
										// 	mergedColoums 	: 1,
										// 	mergedRows 		: 1
										// },
										{
											heading 		: 'Vendor',
											mergedColoums 	: 4,
											// mergedRows 		: 1
										},
										{
											heading 		: '',
											mergedColoums 	: 1,
											// mergedRows 		: 1
										},
									]
			},
			"tableObjects"      : {
									// deleteMethod        	: 'delete',
									// apiLink              	: '/api/category',
									paginationApply      	: true,
									searchApply          	: true,
									// editUrl              	: '/project-master-data/',
									// deleteUrl            	: '/project-master-data',
									patchStatusUrl      	: '/api/category/patch/status',
									// type                 	: 'Categories',
									showAction 			 	: true
			},
			"startRange"       	: 0,
			"limitRange"        : 10,
			"tableName"         : 'AllOrders',
			tableData 			: [],
		};
	}

	handleChange(event){ 
		const target = event.target;
		const name   = target.name;

		this.setState({
			[name]: event.target.value,
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
		this.getDataCount();
		this.getData(this.state.startRange,this.state.limitRange);
		var currency = localStorage.getItem("preferencedata");
		console.log("currency => ",currency)
		// this.getSubCategoryData(this.state.startRange,this.state.limitRange);
		this.getAdminPreferences();
		this.getAllorderStatus();
	}

	
	getAllorderStatus(){
		axios.get('/api/orderstatus/get/list')
		.then((response) => {
			// console.log("getAllorderStatus 402 response ==>",response)
			this.setState({
				"orderStatusArray": response.data,
			},()=>{
					console.log("getAllorderStatus response ==>",response)
			})
		})
		.catch((error) => {
			console.log("Error in orderstatus = ", error);
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

	//======= Admin Preferences ==========
	getAdminPreferences(){
		axios.get("/api/adminpreference/get")
		.then(preferences =>{
			if(preferences.data){
				// console.log("preferences.data[0] => ",preferences.data[0])
				// var askpincodeToUser = preferences.data[0].askPincodeToUser;

				this.setState({
					'websiteModel'     	: preferences.data[0].websiteModel,
					'askPincodeToUser' 	: preferences.data[0].askPincodeToUser,
					'showLoginAs'      	: preferences.data[0].showLoginAs,
					'showInventory'    	: preferences.data[0].showInventory,
					'showDiscount'    	: preferences.data[0].showDiscount,
					'showCoupenCode'    : preferences.data[0].showCoupenCode,
					'showOrderStatus'   : preferences.data[0].showOrderStatus,
					'currency' 			: preferences.data[0].currency,
					'unitOfDistance' 	: preferences.data[0].unitOfDistance
				})									
			}
		})
		.catch(error=>{
				console.log("Error in preferences = ", error);
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

	getDataCount(){
		axios.get('/api/category/get/count')
		.then((response)=>{
		  	// console.log('dataCount', response.data);
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
		  limitRange : limitRange
		}
		
		axios.post('/api/orders/get/get_orders')
		.then((response)=>{
		  	console.log('order tableData', response.data);		               
		  
		  	var tableData = response.data.reverse().map((a, i)=>{                      
				return{ 
					_id             : a._id,
					orderNumber     : a.orderID,
					orderDate       : moment(a.createdAt).format("DD/MM/YYYY"),
					customer     	: '<div><b>'+ a.userFullName +'</b><br/> ' + a.deliveryAddress.addressLine1 + ", " + a.deliveryAddress.addressLine2 + '</div>',
					totalPrice  	: this.state.currency + " " + a.paymentDetails.netPayableAmount,					
					vendorName   	: a.vendorOrders 
										? 
											(a.vendorOrders.map((b)=>{
												return '<div>'+b.vendorName+'</div>'
											})).join(' ')
										: [],
					vendorPrice   	: a.vendorOrders 
										? 
											(a.vendorOrders.map((b)=>{
												return ('<div>'+ this.state.currency + " " + b.vendor_afterDiscountTotal + '</div>').trim(",")
											})).join(' ')
										: [],
					vendorStatus   	: a.vendorOrders 
										? 
											(a.vendorOrders.map((b)=>{
												var status = (b.deliveryStatus[b.deliveryStatus.length - 1].status).replace(/\s+/g, '-').toLowerCase()
												console.log("b.deliveryStatus => ",b.deliveryStatus)
												console.log("status => ",status)
												return '<div class="statusDiv">'+ ( b.deliveryStatus && b.deliveryStatus.length > 0 
													? 
														"<a aria-hidden='true' class='" + status + "'>" +(b.deliveryStatus[b.deliveryStatus.length - 1].status) + "</a>"
													 
													: 
														'') + '</div>'
											})).join(' ')
										: [],
					changeVendorStatus  : a.vendorOrders 
										? 
											(a.vendorOrders.map((b)=>{
												// url = url.replace(/\s+/g, '-').toLowerCase();
												
												return(
														"<div aria-hidden='true' class='changeVendorStatusBtn' title='Change vendor order status' id='" + a._id + "-" + b.vendor_id + "' onclick=window.changeVendorOrderStatus('" + a._id + "-" + b.vendor_id + "') data-toggle='modal' data-target='#changeOrderStatusModal'> Change Status </div>"
													 
												)
											})).join(' ')
										: []
				}
			})
			this.setState({
				tableData : tableData
			},()=>{
				console.log("order data => ",this.state.tableData);
				if(this.state.category_id && this.state.category_id !== "undefined"){
					this.getSubCategoryData();
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

	/*======== openCancelledRemarkModal() ========*/
	openCancelledRemarkModal(id){
		if(id){
		   this.setState({ 
			   masterInvoice_id 	: id,
			   downloadFlag 		: false 
		   },()=>{
				 this.getSingleMasterInvoiceRecord(this.state.masterInvoice_id);
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
					section               : a.section,
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
			[event.target.name] 						: event.target.value,
			["subCategoryTitleError"+event.target.id] 	: event.target.value ? "" : "This field is required."
		})
	}

	createSubCategoryUrl(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
			[name] 										: event.target.value,
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

	render(){		
		return(
			<div className="container-fluid col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div className="formWrapper">
							<section className="content">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
									<div className="row">
										<div className="">
											<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
												<h4 className="weighttitle NOpadding-right">All Orders </h4>
											</div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
												<IAssureTable 
													tableHeading          = {this.state.tableHeading}
													twoLevelHeader        = {this.state.twoLevelHeader} 
													dataCount             = {this.state.dataCount}
													tableData             = {this.state.tableData}
													getData               = {this.getData.bind(this)}
													tableObjects          = {this.state.tableObjects}
													getSearchText         = {this.getSearchText.bind(this)} 
													tableName             = {this.state.tableName}
												/>
											</div>
										</div>
									</div>
								</div>
							</section>
						</div>
					</div>
				</div>
				<div className="modal fade" id="changeOrderStatusModal" role="dialog">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal">&times;</button>
								<h4 className="modal-title">Modal Header</h4>
							</div>
							<div className="modal-body">
								<ol class="progtrckr" data-progtrckr-steps="5">
									<li class="progtrckr-done">Order Processing</li>
									<li class="progtrckr-done">Pre-Production</li>
									<li class="progtrckr-done">In Production</li>
									<li class="progtrckr-wip">Shipped</li>
									<li class="progtrckr-todo">Delivered</li>
								</ol>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default AllOrdersList;