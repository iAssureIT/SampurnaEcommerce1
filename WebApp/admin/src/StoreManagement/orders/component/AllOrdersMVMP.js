import React, { Component }   	from 'react';
import axios                  	from 'axios';
import swal                   	from 'sweetalert';
import moment                 	from "moment";
import IAssureTable           	from "../OrderTable/IAssureTable.jsx";
import openSocket               from 'socket.io-client';
import 'jquery-validation';
import 'bootstrap/js/tab.js';

const  socket = openSocket(process.env.REACT_APP_BASE_URL,{ transports : ['websocket'] ,upgrade: false});
console.log("socket",socket);

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
				apply 			: true,
				firstHeaderData : [
					{
						heading 		: 'Order Details',
						mergedColoums 	: 4,
						// mergedRows 		: 1
					},
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
				// apiLink             	: '/api/category',
				paginationApply      	: true,
				searchApply          	: true,
				patchStatusUrl      	: '/api/category/patch/status',
				showAction 			 	: true
			},
			"startRange"       	: 0,
			"limitRange"        : 10,
			"tableName"         : 'AllOrders',
			tableData 			: [],
			activeStatus 		: ""
		};
		this.openChangeStatusModal 		= this.openChangeStatusModal.bind(this);
		window.openChangeStatusModal  	= this.openChangeStatusModal;
		this.changeVendorOrderStatus    = this.changeVendorOrderStatus.bind(this);
	}

	/* ======= handleChange() ========== */
	handleChange(event){ 
		const target = event.target;
		const name   = target.name;

		this.setState({
			[name]: event.target.value,
		});
	}	
	
	/* ======= componentWillReceiveProps() ========== */
	componentWillReceiveProps(nextProps) {
		if(nextProps && nextProps.editId && nextProps.editId !== undefined &&  nextProps.history.location.pathname !== "/project-master-data"){      
		  	this.setState({
			  	editId : nextProps.editId
		  	},()=>{
			 	this.edit(this.state.editId);
		  	})
		}
	}
  
	/* ======= componentDidMount() ========== */
	async componentDidMount(){
		
		this.getAdminPreferences();
		var orderStatusData 	= await axios.get('/api/orderstatus/get/list');
		var orderStatusArray 	= orderStatusData.data;
		this.setState({
			"orderStatusArray": orderStatusArray,
		},()=>{})

		var orderStatusParams 	= this.props.match.params.orderStatus.replace(/-/g, ' ');
		var orderStatus 		= "";

		if(orderStatusArray && orderStatusArray.length > 0){
			var orderStatusObject = await orderStatusArray.filter(orderStatus => (orderStatus.orderStatus).toLowerCase() === orderStatusParams);
			if(orderStatusObject && orderStatusObject.length > 0){
				orderStatus = orderStatusObject[0].orderStatus;
			}else{
				orderStatus = orderStatusParams;
			}
		}else{
			orderStatus = orderStatusParams;
		}
		this.setState({
			orderStatus : orderStatus
		},()=>{
			this.getData(this.state.startRange,this.state.limitRange);		
		})
	}

	/* ======= getAllorderStatus() ========== */
	getAllorderStatus(){
		axios.get('/api/orderstatus/get/list')
		.then((response) => {
			// console.log("getAllorderStatus 402 response ==>",response)
			
			return response.data
		})
		.catch((error) => {
			console.log("Error in orderstatus = ", error);
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
	}

	/* ======= openChangeStatusModal() ========== */
	openChangeStatusModal(id){
		var order_id 		= id.split("-")[0];
		var vendor_id 		= id.split("-")[1];
		var order_user_id 	= id.split("-")[2];
		
		this.setState({
			vendor_id 		: vendor_id,
			order_id 		: order_id,
			order_user_id	: order_user_id
		},()=>{
			this.getOneOrder(this.state.order_id, this.state.vendor_id);
		})		
	}
	
	/* ======= get Single order ========== */
	getOneOrder(order_id, vendor_id){
		axios.get('/api/orders/get/one/order/'+order_id)
		.then((response) => {
			// console.log("get one order response ==>",response.data)
			if (response.data && response.data.vendorOrders && response.data.vendorOrders.length > 0) {
				var vendorOrder = response.data.vendorOrders.filter(vendorOrder => String(vendorOrder.vendor_id) === String(vendor_id))
				
				if(vendorOrder[0] && vendorOrder[0].deliveryStatus.length > 0){
					var activeStatus 		= vendorOrder[0].deliveryStatus[vendorOrder[0].deliveryStatus.length -1].status;
					var activeStatusObject 	= this.state.orderStatusArray.filter(status => status.orderStatus === activeStatus);
					var activeStatusRank  	= 0;

					if(activeStatusObject && activeStatusObject.length > 0){
						activeStatusRank  	= activeStatusObject[0].statusRank;
					}
					this.setState({
						activeStatus 		: activeStatus,
						activeStatusRank 	: activeStatusRank
					},()=>{})
				}
			}			
		})
		.catch((error) => {
			console.log("Error in orderstatus = ", error);
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
	}

	/* ======= Admin Preferences ========== */
	getAdminPreferences(){
		axios.get("/api/adminpreference/get")
		.then(preferences =>{
			if(preferences.data && preferences.data.length > 0){
				this.setState({
					'currency' 			: preferences.data[0].currency
				})									
			}
		})
		.catch(error=>{
			console.log("Error in preferences = ", error);
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
	}

	/**=========== getData() ===========*/
	async getData(startRange, limitRange){
		var formValues = await {
		  startRange : startRange,
		  limitRange : limitRange,
		  status 	 : this.state.orderStatus
		}
		
		// axios.post('/api/orders/get/list_orders_by_status',formValues)
		// .then((response)=>{
		socket.emit('adminOrtderListValues',formValues);
		socket.on("adminBookingList", (response)=>{
		console.log('order tableData', response);		               
		  	var tableData = response.map((a, i)=>{
			// var tableData = response.data.reverse().map((a, i)=>{                      
				return{ 
					_id             : a._id,
					orderNumber     : a.orderID,
					orderDate       : '<div class=textFloatLeft><div>' + moment(a.createdAt).format("MMMM Do YYYY") + '</div><div>' + moment(a.createdAt).format('h:mm a')
					+ '</div></div>',
					customer     	: '<div><b>'+ a.userFullName ? a.userFullName : (a.deliveryAddress.name ? a.deliveryAddress.name : "Guest User")  +'</b><br/> ' + a.deliveryAddress.addressLine1 + ", " + a.deliveryAddress.addressLine2 + '</div>',
					totalPrice  	: this.state.currency + " " + a.paymentDetails.netPayableAmount,					
					vendors   		: a.vendorOrders && a.vendorOrders.length > 0
										?
											a.vendorOrders.map((vendorOrder, index)=>{
												return ({
													vendorName 			: '<div>'+vendorOrder.vendor_id.companyName+'</div>',
													vendorPrice 		: '<div>'+ this.state.currency + " " + vendorOrder.vendor_afterDiscountTotal + '</div>',
													vendorStatus 		: '<div class="statusDiv ' + (vendorOrder.deliveryStatus && vendorOrder.deliveryStatus.length > 0 ? vendorOrder.deliveryStatus[vendorOrder.deliveryStatus.length - 1].status : "").replace(/\s+/g, '_').toLowerCase() + '">'+ ( vendorOrder.deliveryStatus && vendorOrder.deliveryStatus.length > 0 
																			? 
																				(vendorOrder.deliveryStatus[vendorOrder.deliveryStatus.length - 1].status)
																				
																			: 
																				'') + '</div>',
													changeVendorStatus 	: "<div aria-hidden='true' class='changeVendorStatusBtn' title='Change vendor order status' id='" + a._id + "-" + vendorOrder.vendor_id._id + "'onclick=window.openChangeStatusModal('" + a._id + "-" + vendorOrder.vendor_id._id +"-"+a.user_ID +"') data-toggle='modal' data-target='#changeOrderStatusModal'> Change Status </div>",

												})
											})
										:
											[],

					// vendorName   	: a.vendorOrders 
					// 					? 
					// 						(a.vendorOrders.map((b)=>{
					// 							return '<div>'+b.vendor_id.companyName+'</div>'
					// 						})).join(' ')
					// 					: [],
					// vendorPrice   	: a.vendorOrders 
					// 					? 
					// 						(a.vendorOrders.map((b)=>{
					// 							return ('<div>'+ this.state.currency + " " + b.vendor_afterDiscountTotal + '</div>').trim(",")
					// 						})).join(' ')
					// 					: [],
					// vendorStatus   	: a.vendorOrders 
					// 					? 
					// 						(a.vendorOrders.map((b)=>{
					// 							var status = (b.deliveryStatus[b.deliveryStatus.length - 1].status).replace(/\s+/g, '_').toLowerCase()
					// 							return '<div class="statusDiv ' + status + '">'+ ( b.deliveryStatus && b.deliveryStatus.length > 0 
					// 								? 
					// 									(b.deliveryStatus[b.deliveryStatus.length - 1].status)
													 
					// 								: 
					// 									'') + '</div>'
					// 						})).join(' ')
					// 					: [],
					// changeVendorStatus  : a.vendorOrders 
					// 					? 
					// 						(a.vendorOrders.map((b)=>{
					// 							// url = url.replace(/\s+/g, '-').toLowerCase();
												
					// 							return(
					// 									"<div aria-hidden='true' class='changeVendorStatusBtn' title='Change vendor order status' id='" + a._id + "-" + b.vendor_id + "'onclick=window.openChangeStatusModal('" + a._id + "-" + b.vendor_id._id +"-"+a.user_ID +"') data-toggle='modal' data-target='#changeOrderStatusModal'> Change Status </div>"
													 
					// 							)
					// 						})).join(' ')
					// 					: []
				}
			})
			console.log("tableData",tableData);
			this.setState({
				tableData : tableData
			},()=>{})
		})
		// .catch((error)=>{
		// 	console.log('error', error);
		// 	if(error.message === "Request Failed with Status Code 401"){
		// 		localStorage.removeItem("userDetails");
		// 		localStorage.clear();
		// 		swal({  
		// 			title : "Your Session is Expired.",                
		// 			text  : "You need to login again. Click OK to Go to Login Page"
		// 		})
		// 		.then(okay => {
		// 			if (okay) {
		// 				window.location.href = "/login";
		// 			}
		// 		});
		// 	}
		// });
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

	/* ======= changeVendorOrderStatus() ========== */
	async changeVendorOrderStatus(event){		
		// console.log("event => ",event.target.id);	

		var nextStatusRank 		= this.state.activeStatusRank + 1;
		var previousStatusRank 	= 0;

		if(this.state.activeStatusRank === 1){
			previousStatusRank 	= 0;
		}else{
			previousStatusRank 	= this.state.activeStatusRank - 1 ;
		}

		var changeStatus 		= "";
		var changeStatusRank 	= 0;

		if(event.target.id === "Previous"){
			var previousStatusObject 	= await this.state.orderStatusArray.filter(orderStatus => orderStatus.statusRank === previousStatusRank)
			changeStatus 			= previousStatusObject[0].orderStatus;
			changeStatusRank 		= previousStatusRank;
		}else if(event.target.id === "Next"){
			var nextStatusObject 	= await this.state.orderStatusArray.filter(orderStatus => orderStatus.statusRank === nextStatusRank)
			changeStatus 		= nextStatusObject[0].orderStatus;
			changeStatusRank 	= nextStatusRank;
		}
		this.setState({
			changeStatus 		: changeStatus,
			changeStatusRank 	: changeStatusRank
		},()=>{})	

		
		var formValues = { 
			order_id 			: this.state.order_id,
			vendor_id 			: this.state.vendor_id,
			changeStatus 		: this.state.changeStatus,
			changeStatusRank 	: this.state.changeStatusRank,
			order_user_id       : this.state.order_user_id
		};
		if(this.state.changeStatus && this.state.changeStatusRank){
			socket.emit('room',this.state.order_user_id);
			socket.emit('changevendororderstatus',formValues);
			socket.on("changeStatus", (response)=>{
				// axios.patch("/api/orders/changevendororderstatus",formValues)
				// .then((response)=>{ 
					this.getOneOrder(this.state.order_id, this.state.vendor_id);
					// this.getData(this.state.startRange,this.state.limitRange);
				})
				// .catch((error)=>{
				// 	console.log('error', error);
				// 	if(error.message === "Request failed with status code 401"){
				// 		localStorage.removeItem("userDetails");
				// 		localStorage.clear();
				// 		swal({  
				// 			title : "Your Session is Expired.",                
				// 			text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
				// 		})
				// 		.then(okay => {
				// 			if (okay) {
				// 				window.location.href = "/login";
				// 			}
				// 		});
				// 	}
				// })
			// })		
		}
	}

	/* ======= render() ========== */
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
												<h4 className="weighttitle NOpadding-right">{this.state.orderStatus} Orders </h4>
											</div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
												<IAssureTable 
													tableHeading          = {this.state.tableHeading}
													twoLevelHeader        = {this.state.twoLevelHeader} 
													dataCount             = {this.state.dataCount}
													tableData             = {this.state.tableData}
													getData               = {this.getData.bind(this)}
													tableObjects          = {this.state.tableObjects}
													// getSearchText         = {this.getSearchText.bind(this)} 
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
				<div className="changeOrderStatusModal modal fade" id="changeOrderStatusModal" role="dialog">
					<div className="modal-dialog modal-lg">
						<div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="modal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<button type="button" className="close" data-dismiss="modal">&times;</button>
								<h4 className="modal-title">Change Vendor Status</h4>
							</div>
							<div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
								{(this.state.activeStatus).toLowerCase() === "cancelled"
								?
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<h3 className="cancelledOrderMsg"> This Order is Cancelled</h3>
									</div>
								:
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="statusChange col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<ul id="progressbar">
												{this.state.orderStatusArray && this.state.orderStatusArray.length > 0
												?
													this.state.orderStatusArray.map((data, index) => {												
														var statusArrayLength = this.state.orderStatusArray.length;
														return (
															<li className={"step0 " + 
																(index === 0 
																?
																	"pointStart "
																:
																	index !== 0 && index < (statusArrayLength - 2) 
																	? 
																		"text-center pointMiddle " 
																	: 
																		index === statusArrayLength - 2 
																		?	
																			"text-right pointSecondLast "
																		:
																			statusArrayLength - 1
																			? 
																				"text-right pointLast " 
																			: 
																				""
																		
																) + (data.statusRank <= this.state.activeStatusRank ? "active " : "")
															} 
															id={data.statusRank}  key={index} style={{"width" : (100/statusArrayLength)+"%"}}>
																{data.statusRank === this.state.activeStatusRank 
																?
																	<span className="activeStatus">{data.orderStatus}</span>
																:
																	data.orderStatus
																}
															</li>
														)}
													)
												:
													null
												}
											</ul>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 actionButtons">
											<button type="button" className={"btn btn-warning "+ (this.state.activeStatusRank === 1 ? "disabled noClick" : "")} onClick={this.changeVendorOrderStatus} id="Previous">&laquo; Previous</button>
											<button type="button" className={"btn btn-success "+ (this.state.activeStatusRank === 5 ? "disabled noClick" : "")} onClick={this.changeVendorOrderStatus} id="Next">Next  &raquo;</button>
										</div>
									</div>
								}
							</div>
							<div className="modal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
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