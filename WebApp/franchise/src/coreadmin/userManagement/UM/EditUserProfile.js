import React, { Component } from 'react';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import swal from 'sweetalert';
import $ from "jquery";
import "./userManagement.css";
class EditUserProfile extends Component {
	constructor(props) {
		super(props);
		var UserId = this.props.match.params.id;

		this.state = {
			UserId: UserId,
			fullname: "",
			username: "",
			mobNumber: "",
			userProfile: "",
			firstName: "",
			lastName: "",
			centerName: "",
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(event) {
		if ($('#editUser').valid()) {
			var userid = this.state.UserId;

			var formvalues = {
				"firstname": this.refs.firstName.value,
				"lastname": this.refs.lastName.value,
				"mobNumber": (this.state.mobNumber).replace("-", ""),
			}
			axios.patch('/api/users/patch/' + userid, formvalues)
				.then((response) => {
					swal({
						title: " ",
						text: "User updated successfully",
					});
					this.props.history.push('/dashboard');
				})
				.catch((error) => {
					window.location = '/dashboard';
				});
		}
	}


	handleChange(event) {
		const target = event.target.value;
		const name = event.target.name;
		this.setState({
			[name]: target,
		}, () => {
		})
	}

	componentDidMount() {
		const firstnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
		const lastnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
		const mobileRegex = RegExp(/^[0-9][0-9]{9}$|^$/);
		const emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);
		$.validator.addMethod("regxCenter", function (value, element, regexpr) {
			return value !== regexpr;
		}, "This field is required.");
		$.validator.addMethod("regxEmail", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter a valid email address.");
		$.validator.addMethod("regxMobile", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter a valid mobile number.");
		$.validator.addMethod("regxName", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "It should only contain alphabets.");
		$("#editUser").validate({
			rules: {
				firstName: {
					required: true,
					regxName: firstnameRegex
				},
				lastName: {
					required: true,
					regxName: lastnameRegex
				},
				username: {
					required: true,
					regxEmail: emailRegex
				}
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") === "firstName") {
					error.insertAfter("#firstNameErr");
				}
				if (element.attr("name") === "lastName") {
					error.insertAfter("#lastNameErr");
				}
				if (element.attr("name") === "username") {
					error.insertAfter("#usernameErr");
				}
			}
		});
		var userid = this.state.UserId;
		axios.get('/api/users/get/' + userid)
			.then((res) => {
				this.setState({
					firstName: res.data.firstname,
					lastName: res.data.lastname,
					username: res.data.email,
					mobNumber: res.data.mobile
				})
			})
			.catch((error) => {
			});
	}
	handleChangeCenter(event) {
		event.preventDefault();
		this.setState({
			centerName: event.target.value,
		}, () => {
		})
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="formWrapper">
						<section className="content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
									Edit User Data
								</div>
								<hr className="hr-head container-fluid row" />
								<div className="box-body">
									<div className="row">
										<form id="editUser">
											<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
												<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">First Name <label className="requiredsign">*</label></label>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="firstNameErr">
															<input type="text" style={{ textTransform: 'capitalize' }}
																className="form-control"
																id="firstName" ref="firstName" name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="First Name" />
														</div>
													</div>
													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Last Name <label className="requiredsign">*</label></label>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="lastNameErr">
															<input type="text" className="form-control"
																id="lastName" ref="lastName" name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Last Name" />
														</div>
													</div>
												</div>
												<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Username/Email <label className="requiredsign">*</label></label>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="usernameErr">
															<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="form-control" ref="username" name="username" required />
														</div>
													</div>
													<div className="form-margin col-lg-6 col-sm-6 col-xs-6 col-md-6">
														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Mobile Number <label className="requiredsign">*</label></label>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="mobNumberErr">
															
															<PhoneInput
																country={'in'}
																value={this.state.mobNumber} 
																name="mobNumber"
																inputProps={{
																name: 'mobNumber',
																required: true
																}}
																onChange={mobNumber=>{this.setState({mobNumber})}}
															/>
														</div>
														
													</div>
												</div>
												<div className="form-margin col-lg-12 col-sm-12 col-xs-12 col-md-12 pull-right">
													<button onClick={this.handleSubmit.bind(this)} className="col-lg-2 col-sm-2 col-xs-2 col-md-2 btn resetBtn pull-right">Update</button>
												</div>
											</div>
											
										</form>
										
									</div>
									
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		);
	}
}

export default EditUserProfile;


