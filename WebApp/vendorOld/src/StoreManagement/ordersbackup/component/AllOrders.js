import React,{Component}          			from 'react';
import axios                      			from 'axios';
import { bindActionCreators }     			from 'redux';
import { connect }                			from 'react-redux';
import IAssureTable                       from '../../../coreAdmin/IAssureTable/IAssureTable.jsx';
import { getAllOrders, getAllOrderCount}  from '../../../actions/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

class AllOrders extends Component{
  	constructor(props) {
		super(props);
	 	this.state = {
			"data" 				: [],
			"tableHeading" 	: {
									  	orderID           : "Order Id",
									  	vendorOrderID     : "Vendor Order Id",
									  	userFullName      : "Customer Name",
									  	products          : "Products",
									  	cartQuantity      : "Total Items",
									  	status            : "Status",
									},
			"tableObjects"    : {
									  	deleteMethod      : 'delete',
									  	apiLink           : '/api/vendororders/get/vendorwiselist/'+localStorage.getItem("company_ID"),
									  	// paginationApply   : true,
									  	// searchApply       : true,
									},
			"sectionsList"    : [],
			"startRange"      : 0,
			"limitRange"      : 10
	 	}
	 	this.getOrders = this.getOrders.bind(this);
  	}
	
	/*=========== componentDidMount() ==========*/
  	async componentDidMount(){
	 	this.getOrders(this.state.startRange, this.state.limitRange);
	 	this.props.fetchordercount();
  	}

  	/*=========== getOrders() ==========*/
  	async getOrders(startRange, limitRange){
  		console.log("UserDetails-> ",(localStorage.getItem("userDetails")))
	 	var data = {
			startRange 	: startRange,
			limitRange 	: limitRange,
			vendor_ID 	: localStorage.getItem("companyID")
	 	}
	 	await this.props.fetchallorders(data);
	 	this.setState({
			tableData 	: this.props.allOrders
	 	})
  	}

  	/*=========== componentDidMount() ==========*/
  	render(){
	 	return(
			<div>
		  		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				  	<div className="row"> 
					 	<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
					 		<div className="formWrapper">
								<section className="content">
						  			<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent marginBottomCSS">
							 			<div className="row">
											<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
											  	<h4 className="NOpadding-right"> All Orders</h4>
											</div>								
										  	<div className="admin-orders-SubTitleRow  row">
											 	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
											 		<br/>
											 		<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
											  			<div className="admin-orders-listofColors">
															<span className="">
														 		<span className="admin-orders-stat-NewOrder comm-status-of-order"></span>
														 		New Order
															</span>
															<span className="">
																<span className="admin-orders-stat-Verified comm-status-of-order"></span>
																Verified
															</span>
															<span className="">
																<span className="admin-orders-stat-Packed comm-status-of-order"></span>
																Packed
															</span>
															<span className="">
																<span className="admin-orders-stat-Inspection comm-status-of-order"></span>
																Inspection
															</span>
															<span className="">
																<span className="admin-orders-stat-OrderVerified comm-status-of-order"></span>
																Dispatch Approved
															</span>
															<span className="">
																<span className="admin-orders-stat-Dispatched comm-status-of-order"></span>
																Dispatched
															</span>
															<span className="">
																<span className="admin-orders-stat-Delivered comm-status-of-order"></span>
																Delivery Initiated
															</span>
															<span className="">
																<span className="admin-orders-stat-Deliveredpaid comm-status-of-order"></span>
																Delivered & Paid
															</span>
														</div>
											  		</div>
											 	</div>
									  		</div>
											<br/>
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<IAssureTable 
									  				tableHeading 	= {this.state.tableHeading}
									  				twoLevelHeader = {this.state.twoLevelHeader} 
												  	dataCount 		= {this.props.allOrdersCount && this.props.allOrdersCount.length>0 ? this.props.allOrdersCount[0].dataCount : 0}
												  	tableData 		= {this.props.allOrders}
												  	getData 			= {this.getOrders.bind(this)}
												  	tableObjects 	= {this.state.tableObjects}
												  	// getSearchText={this.getSearchText.bind(this)} 
												/>
											</div>
								 		</div>
							  		</div>
								</section>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
  	return {
	 	allOrdersCount 	: state.allOrdersCount,
	 	allOrders  			: state.allOrders
  	}
}

const mapDispachToProps = (dispatch) => {
  	return bindActionCreators({ 
  		fetchallorders 	: getAllOrders, 
  		fetchordercount 	: getAllOrderCount 
  	}, dispatch)
}

export default connect(mapStateToProps, mapDispachToProps)(AllOrders);