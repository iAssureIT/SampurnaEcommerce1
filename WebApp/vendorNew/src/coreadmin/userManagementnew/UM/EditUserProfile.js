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
				"role"  : [this.state.role],
				"email"  : this.state.username,
			}
			axios.patch('/api/users/patch/profile/'+userid, formvalues)
				.then((response) => {
					swal({
						title: " ",
						text: "User updated successfully",
					});
					this.props.history.push('/umlistofusers');
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
		axios.get('/api/users/get/id/' + userid)
			.then((res) => {
				console.log("Get SUers detis==>>",res.data)
				this.setState({
					firstName: res.data.profile.firstname,
					lastName: res.data.profile.lastname,
					username: res.data.profile.email,
					mobNumber: res.data.profile.mobile,
					Roles:res.data.roles,

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








// import React, { Component } from 'react';
// import PhoneInput from 'react-phone-input-2';
// import axios from 'axios';
// import swal from 'sweetalert';
// import $ from 'jquery';
// import jQuery from 'jquery';
// import "./userManagement.css";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng
// } from "react-places-autocomplete";
// var entity = ""
// class EditUserProfile extends Component {
// 	constructor(props) {
// 		super(props);
// 		var UserId = this.props.match.params.id;

// 		this.state = {
// 			UserId: UserId,
// 			fullname: "",
// 			username: "",
// 			mobNumber: "",
// 			userProfile: "",
// 			firstName: "",
// 			lastName: "",
// 			entity : entity,
// 			centerName: "",
// 			user: "user",
// 			// gmapsLoaded: false,
// 		}
// 		this.handleChange = this.handleChange.bind(this);
// 	}
// 	componentDidMount() {
// 		this.getDepartment();
// 		this.userdata();
// 		this.getDesignation();
// 		var role = [];
// 			var getCompany_Id = localStorage.getItem("company_Id")
// 			var getcompanyID = localStorage.getItem("companyID")
// 			var companyName = localStorage.getItem("companyName")
// 			role.push(localStorage.getItem("roles"));
// 			this.setState({
// 			listOfRoles: role,
// 			})
// 			if (role.indexOf("admin") == -1) {
// 				this.setState({
// 					companyID: getcompanyID,
// 					corporate_Id: getCompany_Id,
// 					corporate: companyName
// 				}, () => {
// 					this.getEntityLocation(getCompany_Id);
// 				})
// 			}

			
// 		const firstnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
// 		const lastnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
// 		const mobileRegex = RegExp(/^[0-9][0-9]{9}$|^$/);
// 		const emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);
// 		$.validator.addMethod("regxCenter", function (value, element, regexpr) {
// 			return value !== regexpr;
// 		}, "This field is required.");
// 		$.validator.addMethod("regxEmail", function (value, element, regexpr) {
// 			return regexpr.test(value);
// 		}, "Please enter a valid email address.");
// 		$.validator.addMethod("regxMobile", function (value, element, regexpr) {
// 			return regexpr.test(value);
// 		}, "Please enter a valid mobile number.");
// 		$.validator.addMethod("regxName", function (value, element, regexpr) {
// 			return regexpr.test(value);
// 		}, "It should only contain alphabets.");
// 		$("#editUser").validate({
// 			rules: {
// 				firstName: {
// 					required: true,
// 					regxName: firstnameRegex
// 				},
// 				lastName: {
// 					required: true,
// 					regxName: lastnameRegex
// 				},
// 				username: {
// 					required: true,
// 					regxEmail: emailRegex
// 				}
// 			},
// 			errorPlacement: function (error, element) {
// 				if (element.attr("name") === "firstName") {
// 					error.insertAfter("#firstNameErr");
// 				}
// 				if (element.attr("name") === "lastName") {
// 					error.insertAfter("#lastNameErr");
// 				}
// 				if (element.attr("name") === "username") {
// 					error.insertAfter("#usernameErr");
// 				}
// 			}
// 		});
// 	}
// 	handleSelectLocation = address => {
// 		console.log(address)
// 		geocodeByAddress(address)
// 		  .then((results) => {
	
// 			for (var i = 0; i < results[0].address_components.length; i++) {
// 			  for (var b = 0; b < results[0].address_components[i].types.length; b++) {
// 				switch (results[0].address_components[i].types[b]) {
// 				  case 'sublocality_level_1':
// 					var area = results[0].address_components[i].long_name;
// 					break;
// 				  case 'sublocality_level_2':
// 					var area = results[0].address_components[i].long_name;
// 					break;
// 				  case 'locality':
// 					var city = results[0].address_components[i].long_name;
// 					break;
// 				  case 'administrative_area_level_1':
// 					var state = results[0].address_components[i].long_name;
// 					break;
// 				}
// 			  }
// 			}
// 			// console.log("state===>>>>", state)
// 			this.setState({ states: state })
// 		  })
// 		  .catch(error => console.error('Error', error));
// 		geocodeByAddress(address)
// 		  .then(results => getLatLng(results[0]))
// 		  .then(latLng => this.setState({ 'fromLatLng': latLng }))
// 		  .catch(error => console.error('Error', error));
// 		var array = {
// 		  cityName: address,
// 		}
// 		// console.log("address===>>>>", address)
// 		this.setState({ 
// 		  cityName: address ? address.split(",")[0] : "", 
// 		  tripArray: array });
// 	  };
	
// 	componentWillReceiveProps(nextProps){
// 		this.userdata();
// 	}
// 	userdata(){
// 		var userid = this.state.UserId;
// 		axios.get('/api/users/get/' + userid)
// 			.then((res) => {
// 				this.setState({
// 					firstName: res.data.firstname,
// 					lastName: res.data.lastname,
// 					username: res.data.email,
// 					mobNumber: res.data.mobile,
// 					department: res.data.department,
// 					designation: res.data.designation,
// 					cityName: res.data.city,
// 					role: res.data.role,
// 					states: res.data.states,
// 					companyID: res.data.companyID,
// 					companyName: res.data.companyName,
// 				})
// 			})
// 			.catch((error) => {});
		
// 	}
// 	handleSubmit() {
// 		if ($('#editUser').valid()) {
// 			var userid = this.state.UserId;
// 			console.log("userid==>",userid)
// 			var formvalues = {
// 				"firstname": this.refs.firstName.value,
// 				"lastname": this.refs.lastName.value,
// 				"mobNumber": (this.state.mobNumber),
// 				"department": this.state.department,
// 				"designation": this.state.designation,
// 				"cityName": this.state.cityName,
// 				"states": this.state.states,
// 				"companyID": this.state.companyID,
// 				"companyName": this.state.companyName,
// 			}
// 			console.log("userid==>",userid)
// 			axios.patch('/api/users/patch/' + userid, formvalues)
// 				.then((response) => {
// 						console.log("userid==>",response.data)
// 						this.props.history.push("/umlistofusers")
// 				})
// 				.catch((error) => {});
// 		}
// 	}
// 	backtoum() {
// 		this.props.history.push("/umlistofusers")
// 	}
// 	getDepartment() {
// 		axios.get("/api/departmentmaster/get/list")
// 			.then((response) => {
// 				// console.log("departmentArray==>",response.data)
// 				this.setState({
// 					departmentArray: response.data
// 				})
// 			})
// 			.catch((error) => {
// 			})
// 	}
// 	getDesignation() {
// 		axios.get("/api/designationmaster/get/list")
// 			.then((response) => {
// 				// console.log("designationArray==>",response.data)
// 				this.setState({
// 					designationArray: response.data
// 				})
// 			})
// 			.catch((error) => {
// 			})
// 	}
// 	handleChange(event) {
// 		const target = event.target.value;
// 		const name = event.target.name;
// 		this.setState({
// 			[name]: target,
// 		}, () => {
// 		})
// 	}

// 	render() {
// 		const searchOptions = {
// 			types: ['(cities)'],
// 			componentRestrictions: { country: "in" }
// 		}
// 		console.log("this.state.entity===>",this.state.entity);
// 		console.log("this.state.entity===>",this.state.userdetails);
// 		return (
// 			<div className="container-fluid">
// 				<div className="row">
// 					<div className="formWrapper">
// 						<section className="content">
// 							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
// 								<div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
// 									Edit User Data
// 								</div>
// 								<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 " id="rolemodalcl">
// 									<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform userbtn clickforhideshow"
// 										onClick={this.backtoum.bind(this)}>
// 										<i className="fa fa-undo" aria-hidden="true"></i>
// 										<b>&nbsp;&nbsp; Back To UM List</b>
// 									</button>
// 								</div>
// 								<hr className="hr-head container-fluid row" />
// 								<div className="box-body">
// 									<div className="row">
// 										<form id="editUser">
// 											<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
// 												<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
// 													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
// 														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">First Name <label className="requiredsign">*</label></label>
// 														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="firstNameErr">
// 															<input type="text" style={{ textTransform: 'capitalize' }}
// 																className="form-control"
// 																id="firstName" ref="firstName" name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="First Name" />
// 														</div>
// 													</div>
// 													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
// 														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Last Name <label className="requiredsign">*</label></label>
// 														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="lastNameErr">
// 															<input type="text" className="form-control"
// 																id="lastName" ref="lastName" name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Last Name" />
// 														</div>
// 													</div>
// 												</div>
// 												<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
// 													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
// 														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Username/Email <label className="requiredsign">*</label></label>
// 														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="usernameErr">
// 															<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="form-control" ref="username" name="username" required />
// 														</div>
// 													</div>
// 													<div className="form-margin col-lg-6 col-sm-6 col-xs-6 col-md-6">
// 														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Mobile Number <label className="requiredsign">*</label></label>
// 														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="mobNumberErr">
// 															<PhoneInput
// 																country={'in'}
// 																value={this.state.mobNumber}
// 																name="mobNumber"
// 																inputProps={{
// 																	name: 'mobNumber',
// 																	required: true
// 																}}
// 																onChange={mobNumber => { this.setState({ mobNumber }) }}
// 															/>
// 														</div>

// 													</div>
// 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
// 														<label>Company ID <span className="requiredsign">*</span></label>
// 														<input type="text" className="form-control UMname  has-content"
// 															id="companyID" ref="companyID" name="companyID" data-text="companyID" onChange={this.handleChange}
// 															value={this.state.companyID} placeholder="company ID" />
// 													</div>
// 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
// 														<label>Company Name <span className="requiredsign">*</span></label>
// 														<input type="text"
// 															className="form-control UMname  has-content"
// 															id="companyName" ref="companyName"
// 															name="companyName" data-text="companyName"
// 															onChange={this.handleChange} disabled
// 															value={this.state.companyName} placeholder="company Name"
// 														/>
// 													</div>
// 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
// 														<label >Department <span className="requiredsign">*</span></label>
// 														<div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="department">
// 															<select className="form-control " value={this.state.department} onChange={this.handleChange} ref="department" id="department" name="department" data-text="department">
// 																<option hidden> --Select-- </option>
// 																{
// 																	this.state.departmentArray && this.state.departmentArray.length > 0 ?
// 																		this.state.departmentArray.map((data, index) => {
// 																			return (
// 																				<option key={index} value={data.department}>{data.department}</option>
// 																			);
// 																		})
// 																		:
// 																		<option value='user'>User</option>
// 																}
// 															</select>
// 														</div>
// 													</div>
// 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
// 														<label > Designation <span className="requiredsign">*</span></label>
// 														<div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="designation">
// 															<select className="form-control " value={this.state.designation} onChange={this.handleChange} ref="designation" id="designation" name="designation" data-text="designation">
// 																<option hidden> --Select-- </option>
// 																{
// 																	this.state.designationArray && this.state.designationArray.length > 0 ?
// 																		this.state.designationArray.map((data, index) => {
// 																			return (
// 																				<option key={index} value={data.designation}>{data.designation}</option>
// 																			);
// 																		})
// 																		:
// 																		<option value='user'>User</option>
// 																}
// 															</select>
// 														</div>
// 													</div>
// 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
// 														<label >City</label>
// 														<PlacesAutocomplete
// 															value={this.state.cityName}
// 															onChange={this.handleChangePlaces}
// 															onSelect={this.handleSelectLocation}
// 															searchOptions={searchOptions}>
// 															{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
// 																<div>
// 																	<input
// 																		{...getInputProps({
// 																			placeholder: 'Search Cities ...',
// 																			className: 'location-search-input col-lg-12 form-control',
// 																		})}
// 																	/>
// 																	<div className="autocomplete-dropdown-container">
// 																		{loading && <div>Loading...</div>}
// 																		{suggestions.map(suggestion => {
// 																			const className = suggestion.active
// 																				? 'suggestion-item--active'
// 																				: 'suggestion-item';
// 																			const style = suggestion.active
// 																				? { backgroundColor: '#fafafa', cursor: 'pointer' }
// 																				: { backgroundColor: '#ffffff', cursor: 'pointer' };
// 																			return (
// 																				<div
// 																					{...getSuggestionItemProps(suggestion, {
// 																						className,
// 																						style,
// 																					})}
// 																				>
// 																					<span>{(suggestion.description ? suggestion.description.split(",")[0] : "")}</span>

// 																				</div>
// 																			);
// 																		})}
// 																	</div>
// 																</div>
// 															)}
// 														</PlacesAutocomplete>
// 													</div>
// 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
// 														<label>State </label>
// 														<input type="text"
// 															className="form-control"
// 															id="states" ref="states"
// 															name="states" data-text="states"
// 															onChange={this.handleChange} disabled
// 															value={this.state.states} placeholder="State Name"
// 														/>
// 													</div>
// 												</div>
// 												<div className="form-margin col-lg-12 col-sm-12 col-xs-12 col-md-12 pull-right">
// 													<button onClick={this.handleSubmit.bind(this)} className="col-lg-2 col-sm-2 col-xs-2 col-md-2 btn resetBtn pull-right">Update</button>
// 												</div>
// 											</div>

// 										</form>

// 									</div>

// 								</div>
// 							</div>
// 						</section>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// export default EditUserProfile;








// // import PhoneInput from 'react-phone-input-2';
// // import React, { Component } from 'react';
// // import $                        from 'jquery';
// // import jQuery                   from 'jquery';
// // import axios from 'axios';
// // import swal from 'sweetalert';
// // import 'font-awesome/css/font-awesome.min.css';
// // import 'bootstrap/js/modal.js';
// // import './userManagement.css';
// // import PlacesAutocomplete, {
// //   geocodeByAddress,
// //   getLatLng
// // } from "react-places-autocomplete";

// // const formValid = formerrors => {
// //   let valid = true;
// //   Object.values(formerrors).forEach(val => {
// //     val.length > 0 && (valid = false);
// //   })
// //   return valid;
// // }

// // const nameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
// // const mobileRegex = RegExp(/^[0-9][0-9]{9}$/);
// // const emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
// // class EditUserProfile extends Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       show: true,
// //       office: null,
// //       allPosts: null,
// //       gmapsLoaded: false,
// //       firstname: "",
// //       lastname: "",
// //       signupEmail: "",
// //       mobile: "",
// //       companyName: "",
// //       role: "-- Select --",
// //       department: "-- Select --",
// //       designation: "-- Select --",
// //       cityName: "",
// //       states: "",
// //       workLocation: "",
// //       corporate_Id: "",
// //       formValues: "",
// //       adminRolesListData: [],

// //       formerrors: {
// //         firstname: "",
// //         companyID: "",
// //         lastname: "",
// //         signupEmail: "",
// //         mobile: "",
// //         role: "",
// //       },
// //       'buttonType': 'Register User'
// //     };
// //     this.handleChange = this.handleChange.bind(this);
// //   }

// //   	initMap = () => {
// //       this.setState({
// //         gmapsLoaded: true,
// //       })
// // 	}
// // 	getEntityLocation(companyId) {
// // 		console.log("getEntityLocation",companyId)
// // 		axios.get('/api/entitymaster/getCompany/' + companyId)
// // 		.then((response) => {
// // 			console.log("response.data[0]==>",response.data.locations)
// // 			this.setState({
// // 			corporateLocationArray: response.data.locations
// // 			},()=>{
// // 			})
// // 		})
// // 		.catch((error) => {

// // 		})
// // 	}
// // 	handleChange(event) {
// // 		const datatype = event.target.getAttribute('data-text');
// // 		const target = event.target;
// // 		const name   = target.name;
// // 		const value  = target.value;
// // 		if(name ==='role'){
// // 		var e = document.getElementById("role");
// // 		var rolesentityname = e.options[e.selectedIndex].id;
// // 		console.log("rolesentityname==>",rolesentityname);
// // 		this.setState({
// // 			rolesentityname: rolesentityname
// // 		})
// // 		}
// // 		let formerrors = this.state.formerrors;
// // 		this.setState({[name]:event.target.value},()=>{if(name=='companyID'){
		
// // 		axios.get('/api/entitymaster/get/one/companyName/' + this.state.companyID)
// // 		.then((response) => {
// // 			this.getEntityLocation(this.state.companyID)
// // 			var companyName = response.data.companyName;
// // 			if (companyName == null) {
// // 			this.setState({
// // 				companyName: "No Company Available"
// // 			})
// // 			} else {
// // 			this.setState({
// // 				companyName: companyName
// // 			})
// // 			}

// // 		}).catch(function (error) { });
// // 		}})
// // 		switch (datatype) {
// // 		case 'firstname':
// // 			formerrors.firstname = nameRegex.test(value) && value.length > 0 ? '' : "Please Enter Valid Name";
// // 			break;

// // 		case 'lastname':
// // 			formerrors.lastname = nameRegex.test(value) && value.length > 0 ? '' : "Please Enter Valid Name";
// // 			break;

// // 		case 'mobile':
// // 			formerrors.mobile = mobileRegex.test(value) && value.length > 0 ? '' : "Please enter a valid Contact Number";
// // 			break;

// // 		case 'signupEmail':
// // 			formerrors.signupEmail = emailRegex.test(value) && value.length > 0 ? "" : "Please enter a valid Email ID";
// // 			break;

// // 		case 'role':
// // 			formerrors.role = value !== "--select--" ? "" : "Please select role";
// // 			break;

// // 		case 'department':
// // 			formerrors.department = value !== "--select--" ? "" : "Please select department";
// // 			break;

// // 		case 'designation':
// // 			formerrors.designation = value !== "--select--" ? "" : "Please select designation";
// // 			break;

// // 		case 'city':
// // 			formerrors.city = value !== "--select--" ? "" : "Please select city";
// // 			break;

// // 		case 'state':
// // 			formerrors.state = value !== "--select--" ? "" : "Please select state";
// // 			break;

// // 		case 'centerName':
// // 			formerrors.role = value !== "--select--" ? "" : "Please select Center";
// // 			break;

// // 		default:
// // 			break;

// // 		}

// // 		this.setState({
// // 		formerrors,
// // 		[name]: value
// // 		});
// // 	}
// // 	validation() {
// // 		$.validator.addMethod("regxA1", function (value, element, regexpr) {
// // 		return regexpr.test(value);
// // 		}, "Please enter valid first name");
// // 		$.validator.addMethod("regxA2", function (value, element, regexpr) {
// // 		return regexpr.test(value);
// // 		}, "Please enter valid last name");
// // 		$.validator.addMethod("regxEmail", function (value, element, regexpr) {
// // 		return regexpr.test(value);
// // 		}, "Please enter valid email ID");

// // 		$.validator.addMethod("regxmobile", function (value, element, regexpr) {
// // 		return regexpr.test(value);
// // 		}, "Please enter valid mobile number");

// // 		$.validator.addMethod("regxcompanyID", function (value, element, regexpr) {
// // 		return regexpr.test(value);
// // 		}, "Please enter valid company ID");

// // 		$.validator.addMethod("regxRole", function (value, element, arg) {
// // 		return arg !== value;
// // 		}, "Please select the role");

// // 		$.validator.addMethod("regxdesignation", function (value, element, arg) {
// // 		return arg !== value;
// // 		}, "Please select the Designation");


// // 		$.validator.addMethod("regxdepartment", function (value, element, arg) {
// // 		return arg !== value;
// // 		}, "Please select the Department");


// // 		$.validator.addMethod("regxcity", function (value, element, arg) {
// // 		return arg !== value;
// // 		}, "Please select the City");

// // 		$.validator.addMethod("regxstate", function (value, element, arg) {
// // 		return arg !== value;
// // 		}, "Please select the state");


// // 		jQuery.validator.setDefaults({
// // 		debug: true,
// // 		success: "valid"
// // 		});
// // 		$("#userInfo").validate({
// // 		rules: {
// // 			firstname: {
// // 			required: true,
// // 			regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/,
// // 			},
// // 			lastname: {
// // 			required: true,
// // 			regxA2: /^[A-Za-z][A-Za-z0-9\-\s]/,
// // 			},
// // 			signupEmail: {
// // 			required: true,
// // 			regxEmail: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
// // 			},
// // 			mobile: {
// // 			required: true,
// // 			regxmobile: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
// // 			},

// // 			companyID: {
// // 			required: true,
// // 			regxcompanyID: /[a-zA-Z0-9]/,
// // 			},
// // 			role: {
// // 			required: true,
// // 			regxRole: "--Select--"
// // 			},
// // 			department: {
// // 			required: true,
// // 			regxdepartment: "--Select--"
// // 			},
// // 			designation: {
// // 			required: true,
// // 			regxdesignation: "--Select--"
// // 			},
// // 			city: {
// // 			required: true,
// // 			regxA2: /^[A-Za-z][A-Za-z0-9\-\s]/,
// // 			},
// // 		},
// // 		errorPlacement: function (error, element) {
// // 			if (element.attr("name") === "firstname") {
// // 			error.insertAfter("#firstname");
// // 			}
// // 			if (element.attr("name") === "lastname") {
// // 			error.insertAfter("#lastname");
// // 			}
// // 			if (element.attr("name") === "signupEmail") {
// // 			error.insertAfter("#signupEmail");
// // 			}
// // 			if (element.attr("name") === "mobile") {
// // 			error.insertAfter("#mobile");
// // 			}
// // 			if (element.attr("name") === "companyID") {
// // 			error.insertAfter("#companyID");
// // 			}
// // 			if (element.attr("name") === "role") {
// // 			error.insertAfter("#role");
// // 			}
// // 			if (element.attr("name") === "department") {
// // 			error.insertAfter("#department");
// // 			}
// // 			if (element.attr("name") === "designation") {
// // 			error.insertAfter("#designation");
// // 			}
// // 			if (element.attr("name") === "city") {
// // 			error.insertAfter("#city");
// // 			}
// // 		}
// // 		});
// // 	}
// // 	changeMobile(event) {
// // 		this.setState({
// // 		mobile: event
// // 		}, () => {
// // 		if (this.state.mobile) {
// // 			this.setState({
// // 			companyPhoneAvailable: this.state.mobile === "+" || this.state.mobile.length<12 ? false : true
// // 			},()=>{
// // 			})
// // 		}
// // 		})
// // 	}
// // //   componentDidMount() {
// // //     this.validation();
// // // 	this.getDepartment();
// // // 	this.userdata();
// // //     this.getDesignation();
// // //     this.getRole();
// // //     axios.get('/api/companysettings/list')
// // //       .then(
// // //         (res) => {
// // //           const postsdata = res.data;
// // //           this.setState({
// // //             allPosts: postsdata,
// // //           });
// // //           let locationArray = [];
// // //           if (this.state.allPosts !== null) {
// // //             locationArray = this.state.allPosts.map(function (item) { return item.companyLocationsInfo });
// // //           } else {
// // //             locationArray = "no data";
// // //           }
// // //           this.setState({
// // //             office: locationArray,
// // //           });

// // //           // here for list
// // //           var data = {
// // //             "startRange": this.state.startRange,
// // //             "limitRange": this.state.limitRange,
// // //             "companyID": this.props.companyID,
// // //           }
// // //           this.props.getData(data);
// // //         }
// // //       )
// // //       .catch((error) => {});
// // //   }
// // 	componentDidMount() {
// // 			this.getDepartment();
// // 			this.userdata();
// // 			this.getDesignation();
// // 			var role = [];
// // 				var getCompany_Id = localStorage.getItem("company_Id")
// // 				var getcompanyID = localStorage.getItem("companyID")
// // 				var companyName = localStorage.getItem("companyName")
// // 				role.push(localStorage.getItem("roles"));
// // 				this.setState({
// // 				listOfRoles: role,
// // 				})
// // 				if (role.indexOf("admin") == -1) {
// // 					this.setState({
// // 						companyID: getcompanyID,
// // 						corporate_Id: getCompany_Id,
// // 						corporate: companyName
// // 					}, () => {
// // 						this.getEntityLocation(getCompany_Id);
// // 					})
// // 				}
	
				
// // 			const firstnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
// // 			const lastnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
// // 			const mobileRegex = RegExp(/^[0-9][0-9]{9}$|^$/);
// // 			const emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);
// // 			$.validator.addMethod("regxCenter", function (value, element, regexpr) {
// // 				return value !== regexpr;
// // 			}, "This field is required.");
// // 			$.validator.addMethod("regxEmail", function (value, element, regexpr) {
// // 				return regexpr.test(value);
// // 			}, "Please enter a valid email address.");
// // 			$.validator.addMethod("regxMobile", function (value, element, regexpr) {
// // 				return regexpr.test(value);
// // 			}, "Please enter a valid mobile number.");
// // 			$.validator.addMethod("regxName", function (value, element, regexpr) {
// // 				return regexpr.test(value);
// // 			}, "It should only contain alphabets.");
// // 			$("#editUser").validate({
// // 				rules: {
// // 					firstName: {
// // 						required: true,
// // 						regxName: firstnameRegex
// // 					},
// // 					lastName: {
// // 						required: true,
// // 						regxName: lastnameRegex
// // 					},
// // 					username: {
// // 						required: true,
// // 						regxEmail: emailRegex
// // 					}
// // 				},
// // 				errorPlacement: function (error, element) {
// // 					if (element.attr("name") === "firstName") {
// // 						error.insertAfter("#firstNameErr");
// // 					}
// // 					if (element.attr("name") === "lastName") {
// // 						error.insertAfter("#lastNameErr");
// // 					}
// // 					if (element.attr("name") === "username") {
// // 						error.insertAfter("#usernameErr");
// // 					}
// // 				}
// // 			});
	
// // 		}
// //   	componentWillReceiveProps(nextProps){
// // 		this.userdata();
// // 	}
// // 	userdata(){
// // 		var userid = this.state.UserId;
// // 		axios.get('/api/users/get/' + userid)
// // 			.then((res) => {
// // 				this.setState({
// // 					firstName: res.data.firstname,
// // 					lastName: res.data.lastname,
// // 					username: res.data.email,
// // 					mobNumber: res.data.mobile,
// // 					department: res.data.department,
// // 					designation: res.data.designation,
// // 					cityName: res.data.city,
// // 					role: res.data.role,
// // 					states: res.data.states,
// // 					companyID: res.data.companyID,
// // 					companyName: res.data.companyName,
// // 				},()=>{
// // 					if(this.state.role.indexOf("driver") >= 0){
// // 							var entity = "driver";
// // 							var myJSON = JSON.stringify(entity);
// // 							this.setState({
// // 								entity: myJSON,
// // 								userdetails : res.data
// // 							},()=>{
// // 								console.log("this.state.entity driver===>",this.state.entity);
// // 							})
// // 					}else{
// // 						var entity = "employee";
// // 						var myJSON = JSON.stringify(entity);
// // 						this.setState({
// // 							entity: myJSON,
// // 							userdetails : res.data
// // 						},()=>{
// // 							console.log("this.state.entity emp===>",this.state.entity);
// // 						})
// // 					}
// // 				})
// // 			})
// // 			.catch((error) => {});
// // 	}
// //   	getDepartment() {
// // 		axios.get("/api/departmentmaster/get/list")
// // 		.then((response) => {
// // 			console.log("departmentArray==>",response.data[0])
// // 			this.setState({
// // 			departmentArray: response.data
// // 			})
// // 		})
// // 		.catch((error) => {
// // 		})
// // 	  }
// // 	  	handleSubmit(event) {
// // 		if ($('#editUser').valid()) {
// // 			var userid = this.state.UserId;
// // 			var formvalues = {
// // 				"firstname": this.refs.firstName.value,
// // 				"lastname": this.refs.lastName.value,
// // 				"mobNumber": (this.state.mobNumber).replace("-", ""),
// // 				"department": this.state.department,
// // 				"designation": this.state.designation,
// // 				"cityName": this.state.cityName,
// // 				"states": this.state.states,
// // 				"companyID": this.state.companyID,
// // 				"companyName": this.state.companyName,
// // 			}
// // 			axios.patch('/api/users/patch/' + userid, formvalues)
// // 				.then((response) => {
// // 						this.updatePerson();
// // 				})
// // 				.catch((error) => {
// // 					// window.location = '/dashboard';
// // 				});
// // 		}
// // 	}
// // 	backtoum() {
// // 		this.props.history.push("/umlistofusers")
// // 	}
// //   	getDesignation() {
// // 		axios.get("/api/designationmaster/get/list")
// // 		.then((response) => {
// // 			// console.log("designationArray==>",response.data)
// // 			this.setState({
// // 			designationArray: response.data
// // 			})
// // 		})
// // 		.catch((error) => {
// // 		})
// //   	}

// //   createUser(event) {
// //     event.preventDefault();
// //       if (this.state.companyName === "No Company Available") {
// //         console.log('IN IF Post==>>>', this.state.companyName)
// //         swal({
// //                 text: "Company ID " + this.state.companyID + " is not valid Company ID",
// //             });
// //       }
// //       else{
// //         axios.get('/api/entitymaster/get/one/companyName/' + this.state.companyID)
// //           .then((response) => {
// //             console.log("response.dataresponse.data",response.data);
// //             var companyName = response.data.companyName;
// //             this.setState({
// //               companyName: companyName,
// //               corporate_Id:response.data._id
// //             })
// //             this.setState(() => {
// //               if (this.state.companyName === "No Company Available") {
// //                 swal({
// //                   title: "",
// //                   text: "Company ID " + this.state.companyID + " is not valid Company ID",
// //                 });
// //               } else {
// //                 console.log('this.state.role Post==>>>', this.state.role)
// //                 const formValues = {
// //                   "firstname": this.state.firstname,
// //                   "lastname": this.state.lastname,
// //                   "email": this.state.signupEmail,
// //                   "mobNumber": (this.state.mobile).replace("-", ""),
// //                   "pwd": "welcome123",
// //                   // "role": this.state.role !== "employee" ? ["  employee",this.state.role] : ["employee"],
// //                   "role"  : this.state.rolesentityname === "corporate" ? 
// //                             this.state.role === "employee" ? ["employee"] : ["employee",this.state.role]
// //                             :
// //                             [this.state.role],

// //                   "department"      : this.state.department,
// //                   "designation"     : this.state.designation,
// //                   "cityName"        : this.state.cityName,
// //                   "states"          : this.state.states,
// //                   "companyID"       : this.state.companyID,
// //                   "workLocation"    : this.state.workLocation,
// //                   "companyName"     : companyName,
// //                   "status"          : this.state.role ==="corporateadmin" || this.state.role ==="vendoradmin" || this.state.role ==="admin"  ? "active" :"blocked",
// //                 }
// //                 console.log('userid Post==>>>', formValues)
// //                 if (this.state.firstname !== "" && this.state.companyName !== "" && this.state.lastname !== "" && this.state.signupEmail && this.state.mobile ) {
// //                   axios.post('/api/auth/post/signup/user', formValues)
// //                     .then((res) => {
// //                       // console.log('userid Post==>>>', res.data.ID)
// //                       if (res.data.message === 'Email Id already exits.') {
// //                         swal({
// //                           title: "Please enter mandatory fields",
// //                           text: res.data.message,
// //                         });
// //                         this.setState({
// //                           show: false,
// //                           'buttonType': 'Register User'
// //                         })
// //                       } else {
// //                         // var sendData = {
// //                         //   "event": "Contact Created", //Event Name
// //                         //   "toUser_id": res.data.ID, //To user_id(ref:users)
// //                         //   "toUserRole":"employee",
// //                         //   "company_id": this.state.corporate_Id, //company_id(ref:entitymaster)
// //                         //   "otherAdminRole":'corporateadmin',
// //                         //   "variables": {
// //                         //     'EmployeeName': this.state.firstname + ' ' + this.state.lastname,
// //                         //     'Password': "Welcome@123",
// //                         //     'mobileNo': this.state.mobile,
// //                         //     'email': this.state.signupEmail
// //                         //   }
// //                         // }

// //                         // axios.post('/api/masternotifications/post/sendNotification', sendData)
// //                         //   .then((res) => {
// //                         //     // console.log('sendDataToUser in result==>>>', res.data.type)
// //                         //   })
// //                         //   .catch((error) => { console.log('notification error: ', error) })
// //                         var sendData = {
// //                           "event": "Event2", //Event Name
// //                           "toUser_id": res.data._id, //To user_id(ref:users)
// //                           "toUserRole":"employee",
// //                           "company_id": this.state.corporate_Id, //company_id(ref:entitymaster)
// //                           "otherAdminRole":'corporateadmin',
// //                           "variables": {
// //                             'EmployeeName': this.state.firstname + ' ' + this.state.lastname,
// //                             'Password': "welcome123",
// //                             'mobileNo': this.state.mobile,
// //                             'email': this.state.signupEmail,
// //                             // 'sendUrl': this.state.url+"/login",
// //                           }
// //                         }
// //                         console.log('sendData: ',sendData)
// //                         axios.post('/api/masternotifications/post/sendNotification', sendData)
// //                         .then((res) => {
// //                         console.log('sendDataToUser in result==>>>', res.data)
// //                         })
// //                         .catch((error) => { console.log('notification error: ',error)})
// //                           var contactDetailspersonmaster 	= {
// //                               'firstName'       : this.state.firstname,
// //                               'lastName'        : this.state.lastname,
// //                               'contactNo'       : (this.state.mobile).replace("-", ""),
// //                               'phone'           : (this.state.mobile).replace("-", ""),
// //                               'email'           : this.state.signupEmail,
// //                               "departmentName"  : this.state.department,
// //                               "designationName" : this.state.designation,
// //                             /*  "cityName"        : this.state.cityName,
// //                               "states"          : this.state.states,*/
// //                               "address"         : [{
// //                                                   "city"        : this.state.cityName,
// //                                                   "state"          : this.state.states,

// //                               }],
// //                               "companyID"       : this.state.companyID,
// //                               "company_Id"      : this.state.corporate_Id,
// //                               "companyName"     : companyName,
// //                               "type"            : this.state.rolesentityname === "corporate" ? 
// //                                                   "employee": null ||
// //                                                   this.state.rolesentityname === "vendor" ? 
// //                                                   "driver": null,
// //                               "entityType"      : this.state.rolesentityname,
// //                               "userId"          : res.data.ID,
// //                               "status"          : "Active",
// //                             }
                          
// //                           if(contactDetailspersonmaster.type == "driver" || "employee" || "guest"){
// //                           console.log("mastercontactDetailspersonmaster",contactDetailspersonmaster);
// //                           // console.log("Before");

// //                             axios.post('/api/personmaster/post' ,contactDetailspersonmaster)
// //                             .then((response) => {

// //                               console.log('in result Res data==>>>', response.data);
// //                             })
// //                             .catch((error) => {})
// //                           }
                          
// //                         swal( "User added successfully! \n Email Id: "+this.state.signupEmail+"\n Default Password: "+"welcome123");
// //                         var data = {
// //                           "startRange": this.state.startRange,
// //                           "limitRange": this.state.limitRange,
// //                           "companyID": this.props.companyID,
// //                         }
// //                         this.props.getData(data);
// //                         this.setState({
// //                           firstname: "",
// //                           lastname: "",
// //                           companyID: "",
// //                           signupEmail: "",
// //                           mobile: "",
// //                           role: "",
// //                           centerName: "",
// //                           department: "",
// //                           designation: "",
// //                           cityName: "",
// //                           states: "",
// //                           companyName: "",
// //                           show: false,
// //                           'buttonType': 'Register User'
// //                         }, () => {
// //                           var data = {
// //                             "startRange": this.state.startRange,
// //                             "limitRange": this.state.limitRange,
// //                             "companyID": this.props.companyID,
// //                           }
// //                           this.props.getData(data);
// //                           var modal = document.getElementById("CreateUserModal");
// //                           modal.style.display = "none";
// //                           $('.modal-backdrop').remove();
// //                           $("#CreateUserModal .close").click()
                          

// //                         })
// //                       }
// //                     })
// //                     .catch((error) => {
// //                       this.setState({ show: false })
// //                     });

// //                 } else {
// //                   swal({
// //                     title: "Please enter mandatory fields",
// //                     text: "Please enter mandatory fields",
// //                   });
// //                 }
// //               }
// //             })
// //           }).catch(function (error) { });
// //         }
// //       // }
// //   }
// //   companynamewithid() {
// //     // console.log(" this.state.companyID==>>", this.state.companyID)
// //     axios.get('/api/entitymaster/get/one/companyName/' + this.state.companyID)
// //       .then((response) => {
// //         var companyName = response.data.companyName;
// //         this.setState({
// //           companyName: companyName
// //         })
// //       }).catch(function (error) { });
// //   }
// //   getRole() {
// // 		axios.post('/api/roles/get/list')
// // 		  .then((response) => {
// //         // console.log("response from role =>",response.data[0].rolesentity);
// //         this.setState({
// //           adminRolesListData: response.data
// //         })
// // 		  }).catch(function (error) {
// // 		  });
// // 	}
// //   handleChangePlaces = address => {
// //     var array = {
// //       cityName: address,
// //     }
// //     this.setState({ cityName: address, tripArray: array });
// //   };
// //   handleSelectLocation = address => {
// //     console.log(address)
// //     geocodeByAddress(address)
// //       .then((results) => {

// //         for (var i = 0; i < results[0].address_components.length; i++) {
// //           for (var b = 0; b < results[0].address_components[i].types.length; b++) {
// //             switch (results[0].address_components[i].types[b]) {
// //               case 'sublocality_level_1':
// //                 var area = results[0].address_components[i].long_name;
// //                 break;
// //               case 'sublocality_level_2':
// //                 var area = results[0].address_components[i].long_name;
// //                 break;
// //               case 'locality':
// //                 var city = results[0].address_components[i].long_name;
// //                 break;
// //               case 'administrative_area_level_1':
// //                 var state = results[0].address_components[i].long_name;
// //                 break;
// //             }
// //           }
// //         }
// //         // console.log("state===>>>>", state)
// //         this.setState({ states: state })
// //       })
// //       .catch(error => console.error('Error', error));
// //     geocodeByAddress(address)
// //       .then(results => getLatLng(results[0]))
// //       .then(latLng => this.setState({ 'fromLatLng': latLng }))
// //       .catch(error => console.error('Error', error));
// //     var array = {
// //       cityName: address,
// //     }
// //     // console.log("address===>>>>", address)
// //     this.setState({ 
// //       cityName: address ? address.split(",")[0] : "", 
// //       tripArray: array });
// //   };

// //   camelCase(str) {
// //     return str
// //       .toLowerCase()
// //       .split(' ')
// //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// //       .join(' ');
// //   }
// //   close(event) {
// //     this.setState({
// //       firstname: "",
// //       lastname: "",
// //       signupEmail: "",
// //       mobile: "",
// //       role: "",
// //     });
// //     var modal = document.getElementById("CreateUserModal");
// //     modal.style.display = "none";
// //     $('.modal-backdrop').remove();
// //     $("#userInfo").validate().resetForm();

// //   }
// //   render() {
// //     const searchOptions = {
// //       types: ['(cities)'],
// //       componentRestrictions: { country: "in" }
// //     }
// //     const { formerrors } = this.state;
// //     return (
// //       <div>
// //        	<section className="content">
// // 							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
// // 								<div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
// // 									Edit User Data
// // 								</div>
// // 								<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 " id="rolemodalcl">
// // 									<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform userbtn clickforhideshow"
// // 										onClick={this.backtoum.bind(this)}>
// // 										<i className="fa fa-undo" aria-hidden="true"></i>
// // 										<b>&nbsp;&nbsp; Back To UM List</b>
// // 									</button>
// // 								</div>
// // 								<hr className="hr-head container-fluid row" />
// // 								<div className="box-body">
// // 									<div className="row">
// // 										<form id="editUser">
// // 											<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
// // 												<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
// // 													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
// // 														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">First Name <label className="requiredsign">*</label></label>
// // 														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="firstNameErr">
// // 															<input type="text" style={{ textTransform: 'capitalize' }}
// // 																className="form-control"
// // 																id="firstName" ref="firstName" name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="First Name" />
// // 														</div>
// // 													</div>
// // 													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
// // 														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Last Name <label className="requiredsign">*</label></label>
// // 														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="lastNameErr">
// // 															<input type="text" className="form-control"
// // 																id="lastName" ref="lastName" name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Last Name" />
// // 														</div>
// // 													</div>
// // 												</div>
// // 												<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
// // 													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
// // 														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Username/Email <label className="requiredsign">*</label></label>
// // 														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="usernameErr">
// // 															<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="form-control" ref="username" name="username" required />
// // 														</div>
// // 													</div>
// // 													<div className="form-margin col-lg-6 col-sm-6 col-xs-6 col-md-6">
// // 														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Mobile Number <label className="requiredsign">*</label></label>
// // 														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="mobNumberErr">
// // 															<PhoneInput
// // 																country={'in'}
// // 																value={this.state.mobNumber}
// // 																name="mobNumber"
// // 																inputProps={{
// // 																	name: 'mobNumber',
// // 																	required: true
// // 																}}
// // 																onChange={mobNumber => { this.setState({ mobNumber }) }}
// // 															/>
// // 														</div>

// // 													</div>
// // 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
// // 														<label>Company ID <span className="requiredsign">*</span></label>
// // 														<input type="text" className="form-control UMname  has-content"
// // 															id="companyID" ref="companyID" name="companyID" data-text="companyID" onChange={this.handleChange}
// // 															value={this.state.companyID} placeholder="company ID" />
// // 													</div>
// // 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
// // 														<label>Company Name <span className="requiredsign">*</span></label>
// // 														<input type="text"
// // 															className="form-control UMname  has-content"
// // 															id="companyName" ref="companyName"
// // 															name="companyName" data-text="companyName"
// // 															onChange={this.handleChange} disabled
// // 															value={this.state.companyName} placeholder="company Name"
// // 														/>
// // 													</div>
// // 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
// // 														<label >Department <span className="requiredsign">*</span></label>
// // 														<div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="department">
// // 															<select className="form-control " value={this.state.department} onChange={this.handleChange} ref="department" id="department" name="department" data-text="department">
// // 																<option hidden> --Select-- </option>
// // 																{
// // 																	this.state.departmentArray && this.state.departmentArray.length > 0 ?
// // 																		this.state.departmentArray.map((data, index) => {
// // 																			return (
// // 																				<option key={index} value={data.department}>{data.department}</option>
// // 																			);
// // 																		})
// // 																		:
// // 																		<option value='user'>User</option>
// // 																}
// // 															</select>
// // 														</div>
// // 													</div>
// // 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
// // 														<label > Designation <span className="requiredsign">*</span></label>
// // 														<div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="designation">
// // 															<select className="form-control " value={this.state.designation} onChange={this.handleChange} ref="designation" id="designation" name="designation" data-text="designation">
// // 																<option hidden> --Select-- </option>
// // 																{
// // 																	this.state.designationArray && this.state.designationArray.length > 0 ?
// // 																		this.state.designationArray.map((data, index) => {
// // 																			return (
// // 																				<option key={index} value={data.designation}>{data.designation}</option>
// // 																			);
// // 																		})
// // 																		:
// // 																		<option value='user'>User</option>
// // 																}
// // 															</select>
// // 														</div>
// // 													</div>
// // 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
// // 														<label >City</label>
// // 														<PlacesAutocomplete
// // 															value={this.state.cityName}
// // 															onChange={this.handleChangePlaces}
// // 															onSelect={this.handleSelectLocation}
// // 															searchOptions={searchOptions}>
// // 															{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
// // 																<div>
// // 																	<input
// // 																		{...getInputProps({
// // 																			placeholder: 'Search Cities ...',
// // 																			className: 'location-search-input col-lg-12 form-control',
// // 																		})}
// // 																	/>
// // 																	<div className="autocomplete-dropdown-container">
// // 																		{loading && <div>Loading...</div>}
// // 																		{suggestions.map(suggestion => {
// // 																			const className = suggestion.active
// // 																				? 'suggestion-item--active'
// // 																				: 'suggestion-item';
// // 																			const style = suggestion.active
// // 																				? { backgroundColor: '#fafafa', cursor: 'pointer' }
// // 																				: { backgroundColor: '#ffffff', cursor: 'pointer' };
// // 																			return (
// // 																				<div
// // 																					{...getSuggestionItemProps(suggestion, {
// // 																						className,
// // 																						style,
// // 																					})}
// // 																				>
// // 																					<span>{(suggestion.description ? suggestion.description.split(",")[0] : "")}</span>

// // 																				</div>
// // 																			);
// // 																		})}
// // 																	</div>
// // 																</div>
// // 															)}
// // 														</PlacesAutocomplete>
// // 													</div>
// // 													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
// // 														<label>State </label>
// // 														<input type="text"
// // 															className="form-control"
// // 															id="states" ref="states"
// // 															name="states" data-text="states"
// // 															onChange={this.handleChange} disabled
// // 															value={this.state.states} placeholder="State Name"
// // 														/>
// // 													</div>
// // 												</div>
// // 												<div className="form-margin col-lg-12 col-sm-12 col-xs-12 col-md-12 pull-right">
// // 													<button onClick={this.handleSubmit.bind(this)} className="col-lg-2 col-sm-2 col-xs-2 col-md-2 btn resetBtn pull-right">Update</button>
// // 												</div>
// // 											</div>

// // 										</form>

// // 									</div>

// // 								</div>
// // 							</div>
// // 						</section>
// //       </div>
// //     );
// //   }
// // }
// // export default EditUserProfile;
