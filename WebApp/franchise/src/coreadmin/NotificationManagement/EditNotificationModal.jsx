import React, { Component }       from 'react';
import {browserHistory} 		  from 'react-router';
import swal                       from 'sweetalert';
import $ 						  from 'jquery';
import axios 					  from 'axios';
import CKEditor 				  from "react-ckeditor-component";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';


class EditNotificationModal extends Component{

	constructor(props){
		super(props);
		this.state = {
	    'event' 		    : props.data ? props.data.event : '',
	    'templateType' 		: props.data ? props.data.templateType : '',
		'role'		: props.data ? props.data.role : '',
		'company'		: props.data && props.data.company != null ? props.data.company : 'All',
		'status'		: props.data ? props.data.status : '',
		'subject'			: props.data ? props.data.subject : '',
		'content'			: props.data ? props.data.content : '',
	   	'optionA'			: '',
	   	'messageError' 		: '',
	   	shown 				: true,
	   	emailTemplatesList 			: "",
		notificationTemplatesList 	: "",
		smsTemplatesList 			: "",
		roleArray:[],
		companyArray:[]
	  };

	    this.handleChange = this.handleChange.bind(this);
	    this.onChange 		= this.onChange.bind(this);
	}
	componentDidMount() {
        this.getRoles();
        this.getCompany();
    }

	componentWillReceiveProps(nextProps){
		this.getRoles();
        this.getCompany();
		this.setState({
			'event' 		    : nextProps.data.event,
			'templateType' 		: nextProps.data.templateType,
			'role'		: nextProps.data.role,
			'status'		: nextProps.data.status,
			'company'		: nextProps.data.company,
			'subject'			: nextProps.data.subject,
			'content'			: nextProps.data.content,
		});
	}

	handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}


	deleteEmailTemplate(event){
	
	}

	getRoles() {
        var data = {
	      "startRange": 0,
	      "limitRange": 100000,
	    }
	    axios.post('/api/roles/get/list', data)
	      .then((response) => {
	        this.setState({
	          roleArray: response.data
	        }, () => {
	        })
	      }).catch(function (error) {
	      });
    }
    getCompany() {
	    axios.get('/api/entitymaster/get/corporate')
	      .then((response) => {
	        this.setState({
	          companyArray: response.data
	        }, () => {
	        })
	      }).catch(function (error) {
	      });
    }

	updateNotificationEmail(event){
		event.preventDefault();

	    if(this.state.content){
	    	var editId 		 = this.props.emailNot;
			var event        = this.state.event;
			var templateType     = this.state.templateType;
			var status     = this.state.status;
			var subject          = this.state.subject;
			var cketext          = this.state.content;
			if(cketext === null || cketext === ""){
				swal({
					title: 'This field is required.',
					// text:"This field is required.",
					type: 'success',
					showCancelButton: false,
					confirmButtonColor: '#666',
					confirmButtonText: 'Ok'
				});
			}else{	
				var formValues = {
					"status": status,
					"content": this.state.content,
					"subject":this.state.subject
				}
				axios.put('/api/masternotifications/put/'+editId, formValues)
				.then((response)=> {		
					 swal({
						title: "Template updated successfully",
						// text: "Template updated successfully",
					});		
					this.setState({
						shown : false,
					});
					if (templateType  === "Email") {
						this.props.emailGetData(editId)

					}
					if (templateType  === "Notification") {
						this.props.notiGetData(editId)

					}

					if (templateType  === "SMS") {
						this.props.smsGetData(editId)

					}

					
					$('#editNotifyModal-'+this.props.emailNot).hide();
				    $('.modal-backdrop').remove();
                   
						window.location.reload();
				})
				.catch((error)=> {
					 swal({
						title: "Sorry! Template can't update successfully",
						// text: "Sorry! Template can't update successfully",
					});
					this.setState({
						shown : false,
					});
				})
			}
		}else{
			this.setState({
				contentError: 'This field is required.',
			});
		}
    	// }
	}
	selectType(event){
		event.preventDefault();
		const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	
	}
	
	updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }
    onChange(evt){
      var newContent = evt.editor.getData();
      this.setState({
        content: newContent
      },()=>{
      	if(this.state.content){
      		this.setState({
      			messageError : ''
      		});
      	}else{
      		this.setState({
      			messageError : 'This field is required'
      		});
      	}
      });
    }

    showAllTokens(event){
    	event.preventDefault();
		$('.showTokens').toggle();
	}


	render() {
		if(this.props.emailNot){
	        return (
	        	<div>
	        		{this.state.shown === true ? 
					<div className="modal modalHide" id={"editNotifyModal-"+this.props.emailNot} role="dialog">
					  	<div className="modal-dialog modal-lg" role="document">
					    	<div className="modal-content modalContent col-lg-12 NOpadding">
					      		<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
					        		<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel">Edit {this.state.templateType} Template</h4>
					        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
								        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
								          <span aria-hidden="true">&times;</span>
								        </button>
							        </div>
					      		</div>

					     		<div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        <form className="newTemplateForm" id="editModal" >
							         	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding rowPadding">
											{/*<div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 NOpadding-left">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">
													<div className="form-group">
													 	<label className="labelform">Template Type <span className="astrick">*</span></label>     						
												        	<select className="form-control templateType" disabled="disabled" name="templateType" id="templateType" onChange={this.selectType.bind(this)} value={this.state.templateType}>
													      	<option> -- Select --	</option>
															<option> Email 			</option>
															<option> Notification 	</option>
															<option> SMS 			</option>
												      	</select> 
													</div>	
												</div>
											</div>*/}
											<div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Event <sup className="astrick">*</sup></label>
                                                <select id="event" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled="disabled" value={this.state.event} ref="event" name="event" >
                                                    <option disabled value="">--Select Event--</option>
                                                    <option value="Sign Up">Sign Up</option>
                                                    <option value="Contact Created">Contact Created</option>
													<option value="Forgot Password">Forgot Password</option>
													<option value="User Activated">User Activated</option>
													<option value="User Blocked">User Blocked</option>
													<option value="TripBooking">Trip Booking</option>
													<option value="ManagerApproval">Manager Approval</option>
													<option value="ManagerRejection">Manager Rejection</option>
													<option value="TripAllocatedToVendor">Trip Allocated to Vendor</option>
													<option value="Vendor allocates (Car + Driver)">Vendor allocates (Car + Driver)</option>
													<option value="Informs Corporate Employee">Informs Corporate Employee</option>
													<option value="Trip Started">Trip Started</option>
													<option value="Reached Pick up point">Reached Pick up point</option>
													<option value="OTP Verified & Trip begins">OTP Verified & Trip begins</option>
													<option value="Reached Destination">Reached Destination</option>
													<option value="Returned back & Trip-End-OTP">Returned back & Trip-End-OTP</option>
													<option value="EndTrip">End Trip</option>
													<option value="GenerateInvoice">Generate Bill / Invoice</option>
													<option value="EmployeeCancelsTrip">Employee Cancels Trip</option>
													<option value="AdminCancelsTrip">Admin Cancels Trip</option>
													<option value="VendorCancelsTrip">Vendor Cancels Trip</option>
													<option value="VendorAcceptsTrip">Vendor Accepts Booking</option>
													<option value="VendorRejectsTrip">Vendor Rejects Booking</option>
													<option value="DriverApproved">Driver Approved Booking</option>
													<option value="DriverRejected">Driver Rejected Booking</option>
													<option value="Vendor Changes Driver">Vendor Changes Driver</option>
                                                </select>   
                                            </div>
											<div className="col-md-3">
												<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Role<sup className="astrick">*</sup></label>
                                                <select id="role" disabled="disabled" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.role} ref="role" name="role" >
                                                    <option disabled value="">--Select Role--</option>
                                                    {
                                                        this.state.roleArray && this.state.roleArray.length > 0 ?
                                                            this.state.roleArray.map((data, i)=>{
                                                                return(
                                                                    <option key={i} value={data.role}>{data.role} </option>
                                                                );
                                                            })
                                                        :
                                                        null
                                                    }
                                                </select>
											</div>
											<div className="col-md-3">
												<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Status<sup className="astrick">*</sup></label>
                                                <select id="status" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.status} ref="status" name="status" onChange={this.handleChange.bind(this)}>
                                                    <option disabled value="">--Select Status--</option>
                                                    <option> active </option>
													<option> inactive </option>
                                                </select>
											</div>
											<div className="col-md-3">
												<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Company</label>
                                                <select id="company" disabled="disabled" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.company} ref="company" name="company">
                                                    <option disabled value="All">--Select Company--</option>
                                                    {
                                                        this.state.companyArray && this.state.companyArray.length > 0 ?
                                                            this.state.companyArray.map((data, i)=>{
                                                                return(
                                                                    <option key={i} value={data._id}>{data.companyName} </option>
                                                                );
                                                            })
                                                        :
                                                        null
                                                    }
                                                </select>
											</div>
										</div>
										{this.state.templateType!='Notification' && this.state.templateType!='SMS' ?
											<div className="rowPadding col-lg-12 col-md-12 col-xs-12 col-sm-12">
												<div className="form-group">
												 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform">Subject <span className="astrick">*</span></label>     						
											     <input type="text" name="subject" value={this.state.subject} onChange={this.handleChange} className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" required/>
												</div>	
											</div>
											:
											null
										}
										<div className="rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<button className="btn-default btn-sm btnToken pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding" onClick={this.showAllTokens.bind(this)}>Show Available Tokens</button>
										</div>

										<div className=" rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12 showTokens">
											WORK IN PROGRESS
										</div>
										<div className="rowPadding col-lg-12 col-md-12 col-xs-12 col-sm-12">
											<div className="form-group">
												 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform">Message <span className="astrick">*</span></label> 
												 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">  
												 	<CKEditor activeClass="p15" id="editor"  className="templateName" content={this.state.content} events={{"change": this.onChange}}/>
												 </div> 
												 			
												<label className="redFont">{this.state.messageError}</label>			
											</div>
										</div>
									</form>
							    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<button type="submit"  className="btn pull-right col-lg-2 col-md-3 col-sm-6 col-xs-12 submit" id={this.props.emailNot} onClick={this.updateNotificationEmail.bind(this)}>Update Template</button>
							   	</div>
					      		</div>
					   		</div>
					  	</div>
					</div>
					:
					null
				}
				</div>
		    );
		}else{
			return (<div></div>);
		}
	} 

}
export default EditNotificationModal;