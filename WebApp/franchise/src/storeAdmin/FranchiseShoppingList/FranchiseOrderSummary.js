import React, { Component } from 'react';
import axios from 'axios';
import _ from 'underscore';
import swal from 'sweetalert';
import $ from 'jquery';
import moment from 'moment';
import './FranchiseList.css';
// import 'import '../../coreadmin/userManagement/UM/userManagement.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
import ShoppingList from './ShoppingList.js';
class FranchiseOrderSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allPosts: [],
			"twoLevelHeader": {
				apply: false,
			},
			"tableHeading": {
				orderNo: 'PO Number',
				orderDate: 'PO Date',
				//franchisename: 'Franchise Name',
				// ordereditems: 'Ordered Items',
				orderedqty: 'Ordered Qty',
				profileStatus: "Status",
				actions: 'Action',
			},
			"startRange": 0,
			"limitRange": 10,	
			"selectedFranchise" : ''
		}
	}

	componentDidMount() {
		const user_ID = localStorage.getItem("user_ID");
		var userDetails = (localStorage.getItem('userDetails'));
		var userData = JSON.parse(userDetails);
		const companyID = parseInt(userData.companyID);
		this.getFranchiseDetails();
		this.setState({
			user_ID: user_ID,
			companyID: companyID
		}, () => {
		
		})
	
	}


	getFranchiseDetails(){
		var data = {
			"startRange": this.state.startRange,
			"limitRange": this.state.limitRange,
		}
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		axios.get('/api/entitymaster/getCompany/'+userDetails.companyID)
        .then((response) => {
			this.setState({
				"selectedFranchise": response.data._id,
			},()=>{
				this.getData(data);
				//console.log("selectedFranchise",this.state.selectedFranchise);
				})
			})
	      .catch((error) => {
			console.log("Error in franchiseDetail = ", error);
	      })
	}

	redirecttoadd(){
		this.props.history.push("/franchise-shopping-list");
	}
	getData(data) {
		data.date = moment(new Date()).format("YYYY-MM-DD");
		axios.get('/api/franchisepo/get/franchiseorderlist/' + this.state.selectedFranchise, data)
		.then((res) => {
			var tableData = res.data.map((a, i) => {
				//console.log('tableData A==>>>',a.distributionData.length);
				if(a.distributionData.length > 0){
					for (i= 0; i < a.distributionData.length; i++) {
						if(a.orderItems[i]){
							if(a.distributionData[i].itemCode == a.orderItems[i].itemCode){
								//console.log(a.orderItems[i].orderQty, a.distributionData[i].suppliedQty)
								if(a.orderItems[i].orderQty === a.distributionData[i].suppliedQty){
									a.status = "Order Completed";
								}else{
									a.status = "Partially Completed";
								}
							}else{
								 a.status = "Pending"
							}
						}else{
							a.status = "Pending"
						}
						
					}
				}else{
					a.status = "Pending"
				}
				return {
					_id				: a._id,
					orderNo			: a.orderNo.toString(),
					orderDate		: moment(a.orderDate).format("ddd, DD-MMM-YYYY"),
				//	franchisename	: a.franchiseName.length > 0 ? a.franchiseName[0].companyName : null,
					orderedqty		: a.orderItems.length.toString(),
					profileStatus	: a.status != undefined ? a.status : "Pending",
				}
			})
			this.setState({
				tableData: tableData,
			})
		}).catch((error) => {
			swal(" ", "Sorry there is no data");
		});
	}

	render() {
		return (
			<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
 					<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
					<div className="formWrapper">
						<section className="content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
								<div className="row">
									<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtop20">
										<h3 className="text-center">List of PO</h3>
									</div>
									{/* <div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
										<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
											<button className="btn btn-primary col-lg-8 col-md-12 col-xs-4 col-sm-4 mglft15" onClick={this.redirecttoadd.bind(this)}>Add Franchise Order</button>
										</div>
									</div> */}
									<form className="newTemplateForm">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<ShoppingList
												getData={this.getData.bind(this)}
												tableHeading={this.state.tableHeading}
												tableData={this.state.tableData}
												tableObjects={this.state.tableObjects}
											/>
										</div>
									</form>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		);
	}

}
export default FranchiseOrderSummary;










// import React from 'react';
// import axios from 'axios';
// import swal from 'sweetalert';
// import moment from 'moment';

// export default class FranchiseOrderSummary extends React.Component {

// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			date : "",
// 			franchiselist : "",
// 			status : "",
// 			prodStockOrder : "",
// 			viewDataID : "",
// 			user_ID : localStorage.getItem("user_ID")
// 		}
// 	}

// 	componentDidMount(){
// 		this.getFranchiseShoppingList();
// 		 const user_ID = localStorage.getItem("user_ID");
// 	}
// 	handleChange(event){
// 		event.preventDefault();
// 		this.setState({
// 			[event.target.name] : event.target.value,
// 			},()=>{
// 				this.getFranchiseShoppingList();
// 			});

// 	}
// 	getFranchiseShoppingList(){
// 		axios.get('/api/franchisepo/get/purchaseorderallList')
//             .then((franchiselist) => {
// 							console.log("franchiselist prodlist====>",franchiselist.data);
// 							axios.get('/api/franchisepo/get/franchiseorderlist/')
// 										.then((res) => {
// 											console.log("res prodlist====>",res.data);
												
// 										})
// 										.catch((error) => {})
//                 this.setState({
//                     "franchiselist": franchiselist.data,
//                 })
//             })
//             .catch((error) => {})
// 	}
// 	ToatalQty(event){
// 		var id = event.target.id;
// 		console.log("edit id",id);

// 	}
// 	updatestatus(event){
// 		var id = event.target.id;
// 		console.log("updatestatus id",id);
// 		var data  = event.target.getAttribute('data-product');
// 		var product = data.split("-");
// 		console.log("product",product);
// 		var formValues ={
// 							purchaseorder_id : id,
// 				            item : {
// 				        			productID:product[0],
// 				        			itemCode:product[1],
// 				        			productName:product[2],
// 				        			orderedQty:product[3], 
// 				        			units:product[4], 
// 				        			suppliedQty: 0, 
// 				        			status:"Approve"},
// 				            user_id :this.state.user_ID,
// 				        }
// 		console.log("formValues",formValues);
//          axios
// 			.patch('/api/franchisepo/patch/acceptitem',formValues)
// 		  	.then( (response)=> {
// 		    // handle success
		
// 		    	if (response) {
		    	
		    		
// 		    		this.getStatusViewData(id);
// 		    	}
//  			})
// 		  	.catch(function (error) {
// 		    // handle error
// 		    	console.log(error);
// 		  	});

// 	}
// 	updatedStatusChange(event){
// 		var id = event.target.id;
// 		console.log("updatestatus id",id);
// 		var data  = event.target.getAttribute('data-product');
// 		var product = data.split("-");
// 		console.log("product",product);
// 		var formValues ={
// 							purchaseorder_id : id,
// 				            item : {
// 				        			productID:product[0],
// 				        			itemCode:product[1],
// 				        			productName:product[2],
// 				        			orderedQty:product[3], 
// 				        			units:product[4], 
// 				        			suppliedQty: 0, 
// 				        			status:""},
// 				            user_id :this.state.user_ID,
// 				        }
// 		console.log("formValues",formValues);
//          axios
// 			.patch('/api/franchisepo/patch/acceptitem',formValues)
// 		  	.then( (response)=> {
// 		    // handle succes
// 			    if (response) {

// 			    	// this.ToatalQty();
// 			    	this.getStatusViewData(id);
// 			    }

// 		  	})
// 		  	.catch(function (error) {
// 		    // handle error
// 		    	console.log(error);
// 		  	});

// 	}
// 	tableSearch() {
// 		var searchText = this.refs.tableSearch.value.trim();

// 		if (searchText && searchText.length !== 0) {
// 			var data = {
// 				searchText: searchText,
// 			}
// 			console.log("Res in searchtext ==>", data)
// 			axios.post('/api/franchisepo/post/searchlist', data)
// 				.then((res) => {
// 					console.log("Res in searchtext==>", res)
// 					var tableData = res.data.map((a, i) => {
// 						return {
// 							_id: a._id,
// 							fullName: a.orderNo,
// 							companyDetails: a.orderItems.length,
// 							// status: a.status,
// 						}
// 					})
// 					this.setState({
// 						franchiselist: tableData,
// 					})
// 				})
// 				.catch((error) => {
// 				})
// 			this.setState({
// 				tableData: []
// 			});
// 		} else {
// 			this.setState({
// 				tableHeading: this.props.tableHeading,
// 				tableData: this.props.tableData,
// 				completeDataCount: this.props.completeDataCount
// 			})
// 		}
// 	}
// 	edit(event){
// 		event.preventDefault();
// 		var id = event.target.id;
// 		this.props.history.push("/franchise-shopping-list/"+id);
// 	}
// 	getViewData(event){
// 		event.preventDefault();
// 		var id = event.target.id;
// 		console.log("edit id",id);
// 		this.props.history.push("/franchise-order-view/"+id);
// 		// axios
// 		// 	.get('/api/franchisepo/get/one/purchaseorder/'+id)
//     //         .then((editdatalist) => {
// 		// 		// console.log("prodlist prodlist",editdatalist.data);

//     //             this.setState({
//     //             	"viewDataID": id,
//     //                 "prodStockOrder": editdatalist.data.orderItems,
//     //             },()=>{
// 		// 			// console.log("prodStockOrder = ",this.state.prodStockOrder);
// 		// 		})

//     //         })
//     //         .catch((error) => {
// 		// 		console.log("error in getEditData = ", error);
              
//     //         })

// 	}
// 	getStatusViewData(id){
// 		axios
// 			.get('/api/franchisepo/get/one/purchaseorder/'+id)
//             .then((editdatalist) => {
// 				// console.log("prodlist prodlist",editdatalist.data);

//                 this.setState({
                
//                     "prodStockOrder": editdatalist.data.orderItems,
//                 },()=>{
// 					// console.log("prodStockOrder = ",this.state.prodStockOrder);
// 				})

//             })
//             .catch((error) => {
// 				console.log("error in getEditData = ", error);
              
//             })

// 	}
// 	deletePO(event){
// 		event.preventDefault();
// 		var id= event.target.id;
// 		// console.log("id delet", URL);
// 	 	swal({
//           title: "Are you sure you want to delete this Order ?",
//           text: "Once deleted, you will not be able to recover this Order!",
//           icon: "warning",
//           buttons: true,
//           dangerMode: true,
//         })
//         .then((success) => {
//             if (success) {
//             	axios
// 			    .delete("/api/franchisepo/delete/purchaseorder/"+id)
// 			    .then((response)=>{
// 			     	this.getFranchiseShoppingList();
// 			       swal("Your Order is deleted!");
// 			       // window.location.reload();
// 			    })
// 			    .catch((error)=>{
// 			       console.log("error = ", error);              
// 			    });   
//             } else {
//             swal("Your Order is safe!");
//           }
//         }); 
//     }	
// 	render() {
		
// 		return (
// 				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
// 					<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
// 						<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
// 							<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtop20">
// 								<h1 className="text-center">Franchise Shopping Order Summary</h1>
// 							</div>
// 							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtopbotm15">
// 								<div className="col-lg-4 col-md-8 col-sm-12 col-xs-12 pull-right">
// 								    <label className=" ">Search Order :</label>
// 								    {/* <div className="col-lg-8 col-md-9 col-sm-12 col-xs-12  pull-right nopadding">
// 								      <input className=" " id="date" type="date" name="date" refs="date" value={this.state.date} onChange={this.handleChange.bind(this)}/>
// 										</div> */}
// 											<input type="text" placeholder="Search By Franchise Nam and Order Number..." onChange={this.tableSearch.bind(this)} className="NOpadding-right zzero form-control" ref="tableSearch" id="tableSearch" name="tableSearch" />
// 								</div>
// 							</div>
// 							<div> 
// 								<table className="table table-bordered">
// 								    <thead className="thead-dark">
// 								      <tr>
// 								        <th>Order Number</th>
// 								        <th>Total Items</th>
// 								        <th>Quantity</th>
// 								        <th>Action</th>
// 								      </tr>
// 								    </thead>
// 								    <tbody>
// 								    {
// 								    	Array.isArray(this.state.franchiselist) && this.state.franchiselist.length > 0
// 									    ? 
// 									    	this.state.franchiselist.map((result, index)=>{
// 													// console.log('result', result);
// 												return(
// 												      <tr  key={index}>
// 												        <td>{result.orderNo}</td>
// 												        <td>{result.orderItems.length}</td>
// 												        <td>
// 												        </td>
// 												        <td>
// 												        	<span>
// 																<i className="fa fa-pencil" title="Edit" id={result._id} onClick={this.edit.bind(this)}></i>&nbsp; &nbsp;
// 													    		<i className="fa fa-trash redFont " id={result._id} onClick={this.deletePO.bind(this)}></i>&nbsp; &nbsp;
// 													    		<i className="fa fa-eye" id={result._id} onClick={this.getViewData.bind(this)}></i>
// 															</span>
// 												        </td>
// 												      </tr>
// 										        )
// 											})
// 											:
// 												null
// 								    }
// 								    </tbody>
// 								</table>
								
// 							</div>
// 							{/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 								<div className="table-responsive"> 
// 								{
// 							    	Array.isArray(this.state.prodStockOrder) && this.state.prodStockOrder.length > 0
// 							    	?         
// 							    	<table className="table table-bordered table-striped table-hover">
// 									    <thead className="thead-dark text-center">
// 									      	<tr>
// 										        <th>ProductID</th>
// 										        <th>Item Code</th>
// 										        <th>Product Name</th>
// 										        <th>Current Stock</th>
// 										        <th>Ordered Items</th>
// 										        <th>Received Items</th>
// 										        <th>Approve Quantity</th>
// 										        <th>Total Stock</th>
										      
// 									      	</tr>
// 									    </thead>
// 									    <tbody>
// 									     {
// 									    		this.state.prodStockOrder.map((result, index)=>{
// 													console.log('result', result);
// 													return( 
													
// 													      <tr key={index}>
// 													        	<td>{result.productCode}</td>
// 													        	<td>{result.itemCode}</td>
// 													        	<td>{result.productName}</td>
// 													        	<td>{result.currentStock}</td>
// 													        	<td>
// 													        		{result.orderQty}
// 													        	</td>	
// 													        	<td>
// 													        		xxx
// 													        	</td>		
// 													        	<td>
// 													        		{
// 													        			result.status == "Approve"
// 													        			? 
// 													        			<div>
// 														        			<img src="/images/approved.png" height="50" alt=""/>&nbsp;&nbsp;&nbsp;&nbsp;
// 														    				<i className="fa fa-times redFont " 
// 														    				data-product={
// 															        			result.productCode+"-"+result.itemCode
// 															        			+"-"+result.productName+"-"+result.orderQty
// 															        			+"-"+result.units+"-"+result.suppliedQty+"-"+result.status}
// 															        			 id={this.state.viewDataID} onClick={this.updatedStatusChange.bind(this)}></i>&nbsp; &nbsp;
// 															        	</div>
// 													        		 	:
// 													        			<button className="btn btn-primary" 
// 														        			data-product={
// 														        			result.productCode+"-"+result.itemCode
// 														        			+"-"+result.productName+"-"+result.orderQty
// 														        			+"-"+result.units+"-"+result.suppliedQty+"-"+result.status}
// 														        			 id={this.state.viewDataID} onClick={this.updatestatus.bind(this)}>Approve</button>
// 													        		}
// 													        	</td>		
// 													        	<td>
// 													        		xxx
// 													        	</td>													       
// 													      </tr>
														
// 													)
// 												})
// 											}
// 									    </tbody>
// 									</table>
// 									:
// 										null
// 						  		}
// 							    </div>
										
// 							</div>	 */}
							
// 						</div>
// 					</div>
// 				</div>
// 		);
// 	}
// }
