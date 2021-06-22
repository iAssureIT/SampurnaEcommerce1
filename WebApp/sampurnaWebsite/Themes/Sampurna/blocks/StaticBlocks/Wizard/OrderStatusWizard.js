import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
export default class OrderStatusWizard extends Component{
	constructor(props){
		super(props);
		this.state = {
			
		}
	}
	
	componentDidMount(){
		this.props.data.deliveryStatus.map((data,ind)=>{
            if (data.status === 'New Order') {
                $('#orderplaceddate'+this.props.data._id).html(moment(data.Date).format('DD/MM/YYYY hh:mm a'))
            }
            if (data.status === 'Dispatch') {
                $('#dispatchdate'+this.props.data._id).html(moment(data.Date).format('DD/MM/YYYY hh:mm a'))
            }
            if (data.status === 'Delivery Initiated') {
                $('#deliveryinitdate'+this.props.data._id).html(moment(data.Date).format('DD/MM/YYYY hh:mm a'))
            }
            if (data.status === 'Delivered & Paid') {
                $('#delivereddate'+this.props.data._id).html(moment(data.Date).format('DD/MM/YYYY hh:mm a'))
            }
		})
		if(this.props.data.deliveryStatus[this.props.data.deliveryStatus.length-1].status ==='New Order' ||
			this.props.data.deliveryStatus[this.props.data.deliveryStatus.length-1].status ==='Verified' || 
			this.props.data.deliveryStatus[this.props.data.deliveryStatus.length-1].status === 'Packed' || 
			this.props.data.deliveryStatus[this.props.data.deliveryStatus.length-1].status === 'Inspection' ||
			this.props.data.deliveryStatus[this.props.data.deliveryStatus.length-1].status === 'Dispatch Approved' ){
			$('#cartbg'+this.props.data._id).addClass('neworderstatus');
		}
		if(this.props.data.deliveryStatus[this.props.data.deliveryStatus.length-1].status ==='Dispatch'){
			$('#outfrdelivery'+this.props.data._id).addClass('neworderstatus');
			$('#cartbg'+this.props.data._id).addClass('neworderstatus');			
		}
		if(this.props.data.deliveryStatus[this.props.data.deliveryStatus.length-1].status ==='Delivery Initiated'){
			$('#cartbg'+this.props.data._id).addClass('neworderstatus');
			$('#outfrdelivery'+this.props.data._id).addClass('neworderstatus');
			$('#intransit'+this.props.data._id).addClass('neworderstatus');
		}	
		if(this.props.data.deliveryStatus[this.props.data.deliveryStatus.length-1].status ==='Delivered & Paid'){
			$('#cartbg'+this.props.data._id).addClass('neworderstatus');
			$('#outfrdelivery'+this.props.data._id).addClass('neworderstatus');
			$('#intransit'+this.props.data._id).addClass('neworderstatus');
			$('#paid'+this.props.data._id).addClass('neworderstatus');
		}
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
	
	render(){
		console.log("wizard status == ",this.props);
		return(
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				{this.state.activeStatus && (this.state.activeStatus).toLowerCase() === "cancelled"
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
					</div>
				}
			</div>
		);
	}
}