import React, { Component } from 'react';
import $ 					from 'jquery';
import moment 				from 'moment';
// import { render } 			from 'react-dom';
// import { browserHistory } 	from 'react-router';
// import {Link} 				from 'react-router';


export default class ReturnStatus extends Component{
	constructor(props){
		super(props);
		this.state = {
			
		}
	}

	componentDidMount(){
		this.props.data.returnStatus.map((data,ind)=>{

			console.log('datadate', data); 
			console.log('datadate', moment(data.date).format('MM/DD/YYYY hh:mm a'));
				if (data.status === 'Return Approved') {

					$('#approvedDate'+this.props.data._id).html(moment(data.date).format('MM/DD/YYYY hh:mm a'))
				}
				if (data.status === 'Return Pickup Initiated') {
					$('#pickupInitiatedDate'+this.props.data._id).html(moment(data.date).format('MM/DD/YYYY hh:mm a'))
				}
				if (data.status === 'Return Pickedup') {
					$('#pickedupDate'+this.props.data._id).html(moment(data.date).format('MM/DD/YYYY hh:mm a'))
				}
				if (data.status === 'Return Accepted') {
					$('#accepteddate'+this.props.data._id).html(moment(data.date).format('MM/DD/YYYY hh:mm a'))
				}
			})
		if(this.props.data.returnStatus[this.props.data.returnStatus.length-1].status ==='Return Approved'){
			$('#cartbg'+this.props.data._id).addClass('neworderstatus');
		}
		if(this.props.data.returnStatus[this.props.data.returnStatus.length-1].status ==='Return Pickup Initiated'){
			$('#cartbg'+this.props.data._id).addClass('neworderstatus');
			$('#pickupInitiated'+this.props.data._id).addClass('neworderstatus');
		}
		if(this.props.data.returnStatus[this.props.data.returnStatus.length-1].status ==='Return Pickedup'){
			$('#cartbg'+this.props.data._id).addClass('neworderstatus');
			$('#pickupInitiated'+this.props.data._id).addClass('neworderstatus');
			$('#pickedup'+this.props.data._id).addClass('neworderstatus');
		}	
		if(this.props.data.returnStatus[this.props.data.returnStatus.length-1].status ==='Return Accepted'){
			$('#cartbg'+this.props.data._id).addClass('neworderstatus');
			$('#pickupInitiated'+this.props.data._id).addClass('neworderstatus');
			$('#pickedup'+this.props.data._id).addClass('neworderstatus');
			$('#accepted'+this.props.data._id).addClass('neworderstatus');
		}
	}

	render(){
		return(

			<div className="garmentTWizard col-lg-12 col-md-12 col-sm-12 col-xs-12 backColorGray">
	            <div className="wizard-inner col-lg-12 col-md-12 col-sm-12 col-xs-12 backColorWhite boxBorder">
	                <div className="connecting-line"></div>
	                <ul className="nav nav-tabs custmTabs" role="tablist">

	                    <li role="presentation" className=''>
	                        <a href="/">
	                            <span title="Cart" className="round-tab selectcart stepwizardclass" id= {"cartbg"+this.props.data._id}>
	                                <i className="" aria-hidden="true"></i>
	                            </span>
	                        </a>
	                        <div className="wiztextcontainer"><div className="wiztext">Return Approved</div>
	                        <div className="wiztext" id={"approvedDate"+this.props.data._id}></div>
	                        </div>
	                    </li>
	                    <li role="presentation" className="">
	                        <a href="/">
	                            <span title="Delivery Address" className="round-tab selectAddr stepwizardclass" id= {"pickupInitiated"+this.props.data._id}>
	                                <i className="fa fa-map-marker" aria-hidden="true"></i>
	                            </span>
	                        </a>
	                        <div className="wiztextcontainer"><div className="wiztext">Return Pickup Initiated</div>
	                       	<div className="wiztext" id={"pickupInitiatedDate"+this.props.data._id}></div>
	                        </div>
	                    </li>

	                    <li role="presentation" className="">
	                        <a href="/">
	                            <span  title="Order Summary" className="round-tab selectPayment stepwizardclass" id= {"pickedup"+this.props.data._id}>
	                                <i className="fa fa-credit-card" aria-hidden="true"></i>
	                            </span>
	                        </a>
	                        <div className="wiztextcontainer">
	                        <div className="wiztext">Return Pickedup</div>
	                        <div className="wiztext" id={"pickedupDate"+this.props.data._id}></div>
							</div>
	                    </li>

	                    <li role="presentation" className="">
	                        <a href="/">
	                            <span  title="Order Summary" className="round-tab selectPayment stepwizardclass" id= {"accepted"+this.props.data._id}>
	                                <i className="fa fa-check-circle" aria-hidden="true"></i>
	                            </span>
	                        </a>
	                        <div className="wiztextcontainer"><div className="wiztext">Return Accepted</div>
	                        <div className="wiztext" id={"accepteddate"+this.props.data._id}></div>
	                        </div>
	                    </li>
	                </ul>
	            </div>
	        </div>
		);
	}
}