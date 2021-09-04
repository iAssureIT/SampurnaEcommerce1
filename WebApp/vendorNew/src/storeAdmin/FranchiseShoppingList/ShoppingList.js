import React, { Component } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import $ from 'jquery';
import jQuery from 'jquery';
import 'jquery-validation';
// import './IAssureTable.css';
import './FranchiseShoppingList.css';
import moment from 'moment';
import { Route, withRouter } from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

var sum = 0;
class IAssureTableUM extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"tableData": props && props.tableData ? props.tableData : [],
			"tableName": props && props.tableName ? props.tableName : [],
			"tableHeading": props && props.tableHeading ? props.tableHeading : {},
			"twoLevelHeader": props && props.twoLevelHeader ? props.twoLevelHeader : {},
			"reA": /[^a-zA-Z]/g,
			"reN": /[^0-9]/g,
			"sort": true,
			"examMasterData2": '',
			"activeClass": 'activeQueDataCircle',
			"paginationArray": [],
			"startRange": 0,
			"limitRange": 10,
			"activeClass": 'activeQueDataCircle',
			"completeDataCount": props && props.completeDataCount ? props.completeDataCount : 0,
			"normalData": true,
			"resetPassword": "",
			"resetPasswordConfirm": "",
			show: true,
			selectedUser: [],
			allid: null,
			filterDate : moment(new Date()).format("YYYY-MM-DD"),
		}
	}
	componentDidMount() {
		$("html,body").scrollTop(0);
		this.setState({
			tableHeading: this.props.tableHeading,
			tableData: this.props.tableData,
			completeDataCount: this.props.completeDataCount
		})
		const user_ID = localStorage.getItem("user_ID");
		this.getFranchiseList();
		this.setState({
			user_ID: user_ID,
		}, () => {
			var user_ID = this.state.user_ID
			axios.get('/api/users/get/' + user_ID)
				.then((res) => {
					this.setState({
						username: res.data.firstname + " " + res.data.lastname
					})
				})
				.catch((error) => {
				});
		})
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps) {
			this.setState({
				tableData: nextProps.tableData,
				completeDataCount: nextProps.completeDataCount,
			})
		}
	}

	componentWillUnmount() {
		window.showUserDetails = null;
		window.doubleclickonname = null;
		window.doubleclickonCompany = null;
		$("script[src='/js/adminSide.js']").remove();
		$("link[href='/css/dashboard.css']").remove();
	}
	sort(event) {
		event.preventDefault();
		var key = event.target.getAttribute('id');
		var nameA = '';
		var nameB = '';
		var tableData = this.state.tableData;
		if (this.state.sort === true) {
			if (key === 'number') {
				var reA = /[^a-zA-Z]/g;
				var reN = /[^0-9]/g;
				var aN = 0;
				var bN = 0;
				var sortedData = tableData.sort((a, b) => {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								nameA = value1.replace(reA, "");
							}
						}
					);
					Object.entries(b).map(
						([key2, value2], i) => {
							if (key === key2) {
								nameB = value2.replace(reA, "");
							}
						}
					);

					if (nameA === nameB) {
						Object.entries(a).map(
							([key1, value1], i) => {
								if (key === key1) {
									aN = parseInt(value1.replace(reN, ""), 10);
								}
							}
						);

						Object.entries(b).map(
							([key1, value1], i) => {
								if (key === key1) {
									bN = parseInt(value1.replace(reN, ""), 10);
								}
							}
						);

						if (aN < bN) {
							return -1;
						}
						if (aN > bN) {
							return 1;
						}
						return 0;

					} else {

						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						return 0;
					}
				});
			} else {
				var sortedData = tableData.sort((a, b) => {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								if (jQuery.type(value1) === 'string') {
									nameA = value1.toUpperCase();
								} else {
									nameA = value1;
								}
							}
						}
					);
					Object.entries(b).map(
						([key2, value2], i) => {
							if (key === key2) {
								if (jQuery.type(value2) === 'string') {
									nameB = value2.toUpperCase();
								} else {
									nameB = value2;
								}
							}
						}
					);

					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				});
			}
			this.setState({
				tableData: sortedData,
				sort: false
			});
		} else if (this.state.sort === false) {
			if (key === 'number') {
				var reA = /[^a-zA-Z]/g;
				var reN = /[^0-9]/g;
				var aN = 0;
				var bN = 0;
				var sortedData = tableData.sort((a, b) => {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								nameA = value1.replace(reA, "");
							}
						}
					);
					Object.entries(b).map(
						([key2, value2], i) => {
							if (key === key2) {
								nameB = value2.replace(reA, "");
							}
						}
					);

					if (nameA === nameB) {
						Object.entries(a).map(
							([key1, value1], i) => {
								if (key === key1) {
									aN = parseInt(value1.replace(reN, ""), 10);
								}
							}
						);

						Object.entries(b).map(
							([key1, value1], i) => {
								if (key === key1) {
									bN = parseInt(value1.replace(reN, ""), 10);
								}
							}
						);

						if (aN > bN) {
							return -1;
						}
						if (aN < bN) {
							return 1;
						}
						return 0;

					} else {

						if (nameA > nameB) {
							return -1;
						}
						if (nameA < nameB) {
							return 1;
						}
						return 0;
					}
				});
			} else {
				var sortedData = tableData.sort((a, b) => {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								if (jQuery.type(value1) === 'string') {
									nameA = value1.toUpperCase();
								} else {
									nameA = value1;
								}
							}
						}
					);
					Object.entries(b).map(
						([key2, value2], i) => {
							if (key === key2) {
								if (jQuery.type(value2) === 'string') {
									nameB = value2.toUpperCase();
								} else {
									nameB = value2;
								}
							}
						}
					);

					if (nameA > nameB) {
						return -1;
					}
					if (nameA < nameB) {
						return 1;
					}
					return 0;
				});
			}
			this.setState({
				tableData: sortedData,
				sort: true
			});
		}
	}
	
	setLimit(event) {
		event.preventDefault();
		if (this.refs.limitRange.value === 'All') {
			var limitRange = '';
		} else {
			var limitRange = parseInt(this.refs.limitRange.value);
		}
		console.log("this.limitRange==>",limitRange)
		var startRange = 0;
		this.setState({
			"limitRange": limitRange,
		}, () => {
			// console.log("this.props.limitRange==>",this.state.limitRange)
			if (this.state.normalData === true) {
				var data = {
					"startRange": this.state.startRange,
					"limitRange": this.state.limitRange,
					"companyID": this.props.companyID
				}
				this.props.getData(data)
			}
			if (this.state.searchData === true) {
				this.tableSearch();
			}
		});
	}
	tableSearch() {
		var searchText = this.refs.tableSearch.value.trim().toString();
		console.log("this.props.searchText==>",searchText)
		if (searchText && searchText.length !== 0) {
			var data = {
				searchText: searchText.toString(),
				// startRange: this.state.startRange,
				// limitRange: this.state.limitRange,
			}
			axios.post('/api/franchisepo/post/searchlist', data)
				.then((res) => {
					console.log("Res in searchtext==>", res)
					// var tableData = res.data.map((a, i) => {
					// 	return {
					// 		_id: a._id,
					// 		orderNo: a.orderNo.toString(),
					// 		orderDate: moment(a.orderDate).format("llll"),
					// 		franchisename: 'Franchise Name',
					// 		ordereditems: 'Ordered Items',
					// 		orderedqty: a.orderItems.length.toString(),
					// 		profileStatus: "Status",
					// 	}
					// })
					// this.setState({
					// 	tableData: tableData,
					// })
				})
				.catch((error) => {
				})

			this.setState({
				tableData: []
			});
		} else {
			this.setState({
				tableHeading: this.props.tableHeading,
				tableData: this.props.tableData,
				completeDataCount: this.props.completeDataCount
			})
		}
	}
	redirecttoadd(){
		this.props.history.push("/franchise-shopping-list");
	}
	edit(id){
		console.log("edit id",id);
		this.props.history.push("/franchise-shopping-list/"+id);
	}
	getViewData(id){
		this.props.history.push("/franchise-order-view/"+id);
	}
	supply(id){
		this.props.history.push("/franchise_distribution/"+id);
	}
	getFranchiseList(){
		axios.get('/api/entitymaster/get/franchise/')
        .then((response) => {
          this.setState({
            "franchiseList": response.data,
          },()=>{
						// console.log("franchiseList = ",this.state.franchiseList);
					})
	      })
	      .catch((error) => {
					console.log("Error in franchiseList = ", error);
	      })
	}
	selectedFranchise(event){
		let index = event.target.selectedIndex;
		let label = event.target[index].text;
		var selectedValue = event.target.value;
		var keywordSelectedValue = selectedValue.split('$')[0];
		console.log('keywordSelectedValue A==>>>', keywordSelectedValue);
			if (selectedValue === "all") {
				var data = {
					"startRange": this.state.startRange,
					"limitRange": this.state.limitRange,
				}
				this.getData(data)
			} else {
				var data = {
					"startRange": this.state.startRange,
					"limitRange": this.state.limitRange,
					"date"      : this.state.filterDate
				}
				axios.get('/api/franchisepo/get/franchiseorderlist/' + keywordSelectedValue, data)
					.then((res) => {
						var tableData = res.data.map((a, i) => {
							console.log('tableData A==>>>', keywordSelectedValue);
							if(a.distributionData.length > 0){
								for (i= 0; i < a.distributionData.length; i++) {
									if(a.orderItems[i]){
										if(a.distributionData[i].itemCode == a.orderItems[i].itemCode){
											console.log(a.orderItems[i].orderQty, a.distributionData[i].suppliedQty)
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
								franchisename	: a.franchiseName.length > 0 ? a.franchiseName[0].companyName : null,
								orderedqty		: a.orderItems.length.toString(),
								profileStatus	: a.status != undefined ? a.status : "Pending",
							}
						})
						this.setState({
							tableData: tableData,
						})
					}).catch((error) => {
						swal(" ", "Sorry there is no data of " + label, "");
					});
		}
	}
	showDeliveryChallans(id){
		this.props.history.push("/delivery_challan/"+id);
	}
	getData(data) {
		
		if(data){
			data.date = this.state.filterDate;
		}else{
			var data = {
				"date": this.state.filterDate,
			}
		}
		axios.post('/api/franchisepo/get/purchaseorderallList/',data)
			.then((res) => {
					var tableData = res.data.map((a, i) => {
						
						if(a.distributionData.length > 0){
							for (i= 0; i < a.distributionData.length; i++) {
							    if(a.orderItems[i]){
									if(a.distributionData[i].itemCode == a.orderItems[i].itemCode){
										console.log(a.orderItems[i].orderQty, a.distributionData[i].suppliedQty)
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
							_id					: a._id,
							orderNo				: a.orderNo.toString(),
							orderDate			: moment(a.orderDate).format("ddd, DD-MMM-YYYY"),
							franchisename	    : a.franchiseName !== null || a.franchiseName.length > 0 ? a.franchiseName[0].companyName : null,
							orderedqty		    : a.orderItems.length.toString(),
							// profileStatus	: a.franchiseName.length !== null || a.franchiseName.length >= 1 ? a.franchiseName[0].profileStatus:null,
							profileStatus	    : a.status,
						}

					})

					this.setState({
						tableData: tableData,
					},()=>{
						console.log("tableData",tableData);
					})
			})
			.catch((error) => {
				console.log("error",error);
			});
	}
	deletePO(id){
	 	swal({
          title: "Are you sure you want to delete this Order ?",
          text: "Once deleted, you will not be able to recover this Order!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
            	axios
			    .delete("/api/franchisepo/delete/purchaseorder/"+id)
			    .then((response)=>{
			     	this.getFranchiseShoppingList();
			       swal("Your Order is deleted!");
			    })
			    .catch((error)=>{
			       console.log("error = ", error);              
			    });   
            } else {
            swal("Your Order is safe!");
          }
        }); 
	}	
	
	/* Filters start*/
	filterChange(event){
		event.preventDefault();
		const {name,value} = event.target;
  
		this.setState({ 
		  [name]:value,
		},()=>{
		  this.getData();
		//   this.getReportBetweenDates();
		 });
	  }
   /* Filters end*/

	render() {
		return (
			<div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
				 <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
						<button className="btn btn-primary col-lg-8 col-md-12 col-xs-4 col-sm-4 mglft15" onClick={this.redirecttoadd.bind(this)} style={{"margin": "23px"}}>Add Franchise Order</button>
				</div>  
				<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12">
					<label class="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left labelform">Select Date:</label>
					<input type="Date" placeholder="1234" className="col-lg-6 col-md-6 form-control" value={this.state.filterDate} name="filterDate" refs="filterDate" onChange={this.filterChange.bind(this)} id="filterDate"/>
				</div>
				<div className="col-lg-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
				 			<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left labelform">Select Company</label>
							<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="companyDropdown" name="companyDropdown" onChange={this.selectedFranchise.bind(this)} >
								<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
								<option value="all" name="roleListDDOption">Show All</option>
								{
									this.state.franchiseList && this.state.franchiseList.length > 0 ?
										this.state.franchiseList.map((data, index) => {
											// console.log("companyDropdown==>",data);
											return (
												<option key={index} value={data._id}>{data.companyName}</option>
											);
										})
										:
										<option value='user'>User</option>
								}
							</select>
				</div> 
				{/* <div className="col-lg-4 col-md-4 col-md-offset-4 col-xs-12 col-sm-12 NOpadding-right">
					<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform text-left">Search</label>
					<div className="">
						<input type="text" placeholder="Search By Franchise Name,PO Number..." onChange={this.tableSearch.bind(this)} className="NOpadding-right zzero form-control fa fa-search" ref="tableSearch" id="tableSearch" name="tableSearch" />
						<span className="input-group-addon input_status">
						</span>
					</div>
				</div> */}
					<div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right" data-toggle="tooltip" data-placement="top" title="Download Table Data!">
						<ReactHTMLTableToExcel
							id="test-table-xls-button"
							className="download-table-xls-button fa fa-download tbmgtp tableicons pull-right"
							table="table-to-xls"
							filename={this.state.tableName}
							sheet="Users_Table_Data"
							
							buttonText=""/>
					</div>
				<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding marginTop17">
					<div className="table-responsive  ">
						<div className="scrolltbl">
							<table className="table iAssureITtable-bordered table-striped table-hover  ">
								<thead className="tempTableHeader">
									<tr className="">
										{this.state.twoLevelHeader.apply === true ?
											this.state.twoLevelHeader.firstHeaderData.map((data, index) => {
												return (
													<th key={index} colSpan={data.mergedColoums} className="umDynamicHeader srpadd textAlignCenter">{data.heading}</th>
												);
											})
											:
											null
										}
									</tr>
									<tr className="">
										{this.state.tableHeading ?
											Object.entries(this.state.tableHeading).map(
												([key, value], i) => {
													if (key === 'actions') {
														return (
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value}</th>
														);
													} else {
														return (
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value} <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
														);
													}

												}
											)
											:
											<th className="umDynamicHeader srpadd textAlignLeft"></th>
										}
									</tr>
								</thead>
								<tbody className="scrollContent">
									{this.state.tableData && this.state.tableData.length > 0 ?
										this.state.tableData.map(
											(value, i) => {
												 console.log('log.value=====>', value.profileStatus);
												return (
													<tr key={i} className="">
														{
															Object.entries(value).map(
																([key, value1], i) => {
																	if (value1) {
																		if ($.type(value1) === 'string') {
																			var regex = new RegExp(/(<([^>]+)>)/ig);
																			var value2 = value1 ? value1.replace(regex, '') : '';
																			var aN = value2.replace(this.state.reA, "");
																			if (aN && $.type(aN) === 'string') {
																				var textAlign = 'textAlignLeft';
																			} else {
																				var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																				if (bN) {
																					var textAlign = 'textAlignLeft';
																				} else {
																					var textAlign = 'textAlignLeft';
																				}
																			}
																			var found = Object.keys(this.state.tableHeading).filter((k) => {
																				return k === key;
																			});
																			if (found.length > 0) {
																				if (key !== 'id') {
																					return (<td className={textAlign} key={i}><div className={textAlign} dangerouslySetInnerHTML={{ __html: value1 }}></div></td>);
																				} else {

																				}
																			}
																		}
																	} else {
																		return (<td key={i}></td>);
																	}
																}
															)
														}
														{
															this.props.Actioncol ?
																""
																:
																<td className="textAlignCenter">
																	<span className="pointer pointerCls">
																	        <i className="fa fa-eye" title="View purchase order" id={value._id} onClick={this.getViewData.bind(this,value._id)}></i>&nbsp; &nbsp;
																			{value.profileStatus === 'Order Completed'
																			? 
																			  <i className="fa fa-file" title="Delivery Challan for this purchase order" id={value._id} onClick={this.showDeliveryChallans.bind(this,value._id)}></i> 
																			:
																			  <span><i className="fa fa-truck" title="Supply to this purchasr order" id={value._id} onClick={this.supply.bind(this,value._id)}></i>&nbsp; &nbsp;</span>
																			}
																		    {value.profileStatus === "Partially Completed"
                                                                             ? 
																			  <span><i className="fa fa-file" title="Delivery Challan for this purchase order" id={value._id} onClick={this.showDeliveryChallans.bind(this,value._id)}></i></span>
																			: null 
																			}

																			
																		
																			{/* <i className="fa fa-pencil " title="Edit" id={value._id} onClick={this.edit.bind(this,value._id)} ></i>&nbsp; &nbsp;
																			<i className="fa fa-trash redFont " id={value._id} onClick={this.deletePO.bind(this,value._id)}></i>&nbsp; &nbsp; */}
																			
																	</span>
																</td>
														}
													</tr>
												);
											}
										)
										:
										<tr className="trAdmin"><td colSpan={Object.keys(this.state.tableHeading).length + 2} className="noTempData textAlignCenter">No Record Found!</td></tr>
									}
								</tbody>
							</table>
							
						</div>
					</div>
						{/*Export To Excel*/}
						<div className="table-responsive" id="HideTable">
						<table id="table-to-xls" className="table iAssureITtable-bordered table-striped table-hover  ">
								<thead className="tempTableHeader">
									<tr className="">
										{this.state.twoLevelHeader.apply === true ?
											this.state.twoLevelHeader.firstHeaderData.map((data, index) => {
												return (
													<th key={index} colSpan={data.mergedColoums} className="umDynamicHeader srpadd textAlignCenter">{data.heading}</th>
												);
											})
											:
											null
										}
									</tr>
									<tr className="">
										{this.state.tableHeading ?
											Object.entries(this.state.tableHeading).map(
												([key, value], i) => {
													if (key === 'actions') {
														return (
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value != "actions"}</th>
														);
													} else {
														return (
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value} <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
														);
													}

												}
											)
											:
											<th className="umDynamicHeader srpadd textAlignLeft"></th>
										}
									</tr>
								</thead>
								<tbody className="scrollContent">
									{this.state.tableData && this.state.tableData.length > 0 ?
										this.state.tableData.map(
											(value, i) => {
												return (
													<tr key={i} className="">
														{
															Object.entries(value).map(
																([key, value1], i) => {
																	if (value1) {
																		if ($.type(value1) === 'string') {
																			var regex = new RegExp(/(<([^>]+)>)/ig);
																			var value2 = value1 ? value1.replace(regex, '') : '';
																			var aN = value2.replace(this.state.reA, "");
																			if (aN && $.type(aN) === 'string') {
																				var textAlign = 'textAlignLeft';
																			} else {
																				var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																				if (bN) {
																					var textAlign = 'textAlignLeft';
																				} else {
																					var textAlign = 'textAlignLeft';
																				}
																			}
																			var found = Object.keys(this.state.tableHeading).filter((k) => {
																				return k === key;
																			});
																			if (found.length > 0) {
																				if (key !== 'id') {
																					return (<td className={textAlign} key={i}><div className={textAlign} dangerouslySetInnerHTML={{ __html: value1 }}></div></td>);
																				} else {

																				}
																			}
																		}
																	} else {
																		return (<td key={i}></td>);
																	}
																}
															)
														}
													</tr>
												);
											}
										)
										:
										<tr className="trAdmin"><td colSpan={Object.keys(this.state.tableHeading).length + 2} className="noTempData textAlignCenter">No Record Found!</td></tr>
									}
								</tbody>
							</table>
						</div>
				</div>
			</div>
		);
	}
}

export default withRouter(IAssureTableUM);
