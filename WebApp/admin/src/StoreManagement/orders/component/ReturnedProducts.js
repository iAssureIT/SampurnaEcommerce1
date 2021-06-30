import React,{Component} 	from 'react';
import { render } 			from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';
import axios                from 'axios';
import $ 					from "jquery";
import moment 				from "moment";
import AdminOrdersList 		from './AdminOrdersList.js';
import swal         		from 'sweetalert';
import IAssureTable           from "../ReturnProductTable/IAssureTable.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';

export default class ReturnProducts extends Component{
	
	constructor(props) {
	 super(props);
		this.state = {
			"returnedProducts" : [],
			tableHeading    : {
				"orderID" 			: "Order Id",
                "productName"       : "Product Name(Product Code)",
                "vendorName"        : 'Vendor Name',
                "customerName"      : 'Customer Name',
                "reasonOfReturn"    : 'Reason of Return',
                "OrderDate"        	: 'Ordered on',
                "returnRequestedOn" : 'Return Requested on',
                "approveOrReject"   : 'Approve/Reject',
                "status"            : 'Status'
            },
            tableObjects    : {
                paginationApply : true,
                searchApply     : true,
                deleteMethod    : 'delete',
                apiLink         : '/api/returnedproducts',
            },
            startRange      : 0,
            limitRange      : 10
		}
		// this.getReturnedProducts = this.getReturnedProducts.bind(this);
	}
	 
	componentDidMount(){
		var userDetails = JSON.parse(localStorage.getItem("userDetails"));
		var token       = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
		this.getData();
		// this.getReturnedProducts();
		$('.showmore').click(function () {
			console.log('this',$(this));

		});
		
		$.validator.setDefaults({
			debug: true,
			success: "valid"
		});

		$("#pickupform").validate({
			rules: {
			pickupby: {
				required: true,
			}
		},
		errorPlacement: function(error, element) {
			if (element.attr("name") === "pickupby"){
				error.insertAfter("#pickupby");
			}
		}
		});
	}    
	getData(){
		axios.get("/api/returnedproducts/get/list")
		.then((response)=>{
			console.log("response return products => ",response.data)
			var tableData = response.data.map((a, ind)=>{
				console.log("condition => ",(a.productDetails && a.productDetails.length > 0));
				if(a.productDetails && a.productDetails.length > 0){
					return{
						"_id"               : a._id,
						"orderID"           : a.orderID,
						"productName"       : a.productDetails[0] && a.productDetails[0].productName ? (a.productDetails[0].productName+" "+"("+a.productDetails[0].productCode)+")" : "",
						"vendorName"        : a.vendorDetails[0] && a.vendorDetails[0].companyName ? a.vendorDetails[0].companyName : "",
						"productImages"     : a.productDetails[0] && a.productDetails[0].productImage ? a.productDetails[0].productImage : "",
						"customerName"      : a.customerName,
						"reasonOfReturn"    : a.reasonForReturn,
						"OrderDate"        	: moment(a.dateOfPurchase).format("DD MMMM YYYY, HH:mm a"),
						"returnRequestedOn" : moment(a.createdAt).format("DD MMMM YYYY, HH:mm a"),             
						// "productID"         : a.productID,
						"approveOrReject"   : "<div class='publishOrReject'><i class='fa fa-times-circle reviewActionBtns padding-15-0 " + (a.status === 'Rejected' ? 'rejectedActive' : '') +  "'name='Rejected' id='Rejected' title='Reject Customer Review' onclick=window.changeReviewStatus('"+ a._id + "-" + "Rejected" +"')></i>"+
												"<i class='fa fa-check-circle reviewActionBtns padding-15-0 " + (a.returnStatus === 'Published' ? 'publishedActive' : '') + "'name='Published' id='Published' title='Publish Customer Review' onClick=window.changeReviewStatus('"+ a._id + "-" + "Published" +"')></i></div>",
						"status"            : "<div class='reviewStatusSpan review-" + a.returnStatus.toLowerCase() + "'>" + a.returnStatus + "</div>",
						
					};
				}
            })
            this.setState({
                tableData : tableData
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
	returnApproveModal(event){
		$('#returnApprove').show();
		$('#returnApprovebtn').attr('data-id',$(event.target).attr('id'));
	}
	returnApprove(event){
		event.preventDefault();
		var formValues = {
			"id" : $(event.target).data('id'),
			"status" : "Return Approved"
		}
		axios.patch('/api/returnedProducts/returnStatusUpdate',formValues)
					.then((response)=>{
						console.log('response', response);
						this.getData();
						swal({
							title : response.data.message,
						});
						
						$('#returnApprove').hide();
						$('.modal-backdrop').remove();
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
	addpickupdetails(event){
		event.preventDefault();
		$('#pickupdetailsModal').show();
		$('#addpickupbtn').attr('data-id',$(event.target).attr('id'));
	}
	addpickup(event){
		event.preventDefault();
		var formValues = {
			"id" : $(event.target).data('id'),
			"pickupby" : $('#pickupby').val()
		}
		if ($('#pickupby').valid()) {
			axios.patch('/api/returnedProducts/returnPickeupInitiated',formValues)
					.then((response)=>{
						console.log('response', response);
						this.getReturnedProducts();
						swal({
									title : response.data.message,
								});
						$('#pickupdetailsModal').hide();
						$('.modal-backdrop').remove();
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
		
	}
	openpickupproduct(event){
		event.preventDefault();
		$('#pickupproductModal').show();
		$('#pickupproductbtn').attr('data-id',$(event.target).attr('id'));
	}
	pickupcollected(event){
		event.preventDefault();
		var formValues = {
			"id" : $(event.target).data('id'),
			"status" : "Return Pickedup"
		}
		axios.patch('/api/returnedProducts/returnStatusUpdate',formValues)
					.then((response)=>{
						console.log('response', response);
						this.getReturnedProducts();
						swal({
									title : response.data.message,
								});
						$('#pickupproductModal').hide();
						$('.modal-backdrop').remove();
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

	openproductApproval(event){
		event.preventDefault();
		$('#approveProductModal').show();
		$('#approveProductbtn').attr('data-id',$(event.target).attr('id'));
	}
	approveProduct(event){
		event.preventDefault();
		var formValues = {
			"id" : $(event.target).data('id'),
			"status" : "Return Accepted"
		}
		axios.patch('/api/returnedProducts/returnStatusUpdate',formValues)
					.then((response)=>{
						console.log('response', response);
						this.getReturnedProducts();
						swal({
									title : response.data.message,
								});
						$('#approveProductModal').hide();
						$('.modal-backdrop').remove();
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
	render(){		
		return(
			<div className="">
				<div>
					<section className="content">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pageContent">
							<div className="row">
								<div className="box">
									<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
										<h4 className="weighttitle NOpadding-right">Returned Products</h4>
									</div>
								</div>
							</div>
				{/* {this.state.returnedProducts.length > 0 
				?  */}
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<IAssureTable 
							tableHeading    = {this.state.tableHeading}
							twoLevelHeader  = {this.state.twoLevelHeader} 
							dataCount       = {this.state.dataCount}
							tableData       = {this.state.tableData}
							getData         = {this.getData.bind(this)}
							tableObjects    = {this.state.tableObjects}
							// getSearchText   = {this.getSearchText.bind(this)}
						/>
					</div>
				{/* : 					
					<div className="text-center"><img src="/images/noproducts.jpeg" style={{marginTop:"5%"}}/></div>						
				}   */}
				</div>
				<br />
				<div className="modal" id="returnApprove" role="dialog">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close modalclosebut" data-dismiss="modal">&times;</button>
								<h3 className="modalTitle">Return Approval</h3>
							</div>
							<div className="modal-body">
								<label>Do you want to approve this product for return?</label>
								<br/>
							</div>
							<div className="modal-footer">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<a href="#" className="btn btn-warning" id="returnApprovebtn" onClick={this.returnApprove.bind(this)}>Approve</a>
									<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			 
				<div className="modal" id="pickupdetailsModal" role="dialog">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close modalclosebut" data-dismiss="modal" data-target={"#pickupdetailsModal"}>&times;</button>
								<h3 className="modalTitle">Add Pickup Deatils</h3>
							</div>
							<div className="modal-body">
							<form id="pickupform">
								<div className="inputrow">
									<div className="col-lg-8 col-md-8 col-sm-4 col-xs-12">
										<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">Pick up person name  :</label>
										<input type="text" ref="pickupby" name="pickupby" id="pickupby" className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-control" required/>
									</div>
								</div>
								<br/>
								<br/>
								<br/>
							</form>
							</div>
							<div className="modal-footer">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<a href="#" className="btn btn-warning" id="addpickupbtn" onClick={this.addpickup.bind(this)}>Save</a>
									<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="modal" id="pickupproductModal" role="dialog">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal">&times;</button>
								<h3 className="modalTitle">Pickup Product</h3>
							</div>
							<div className="modal-body">
								<label>Does this product picked up?</label>
								<br/>
							</div>
							<div className="modal-footer">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<a href="#" className="btn btn-warning" id="pickupproductbtn" onClick={this.pickupcollected.bind(this)}>Yes</a>
									<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="modal" id="approveProductModal" role="dialog">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal">&times;</button>
								<h3 className="modalTitle">Accept Product</h3>
							</div>
							<div className="modal-body">
								<label>Does this product accepted for return?</label>
								<br/>
							</div>
							<div className="modal-footer">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<a href="#" className="btn btn-warning" id="approveProductbtn" onClick={this.approveProduct.bind(this)}>Yes</a>
									<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				</section>
				</div>
			</div>
		);
	}
}
