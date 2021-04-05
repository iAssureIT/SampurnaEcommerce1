import React, { Component } from 'react';
import $ 					from "jquery";
import PhoneInput 			from 'react-phone-input-2';
import swal 				from 'sweetalert';
import axios 				from 'axios';
import { connect } 			from 'react-redux';
import { bindActionCreators }     from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
// import jQuery from 'jquery';
// import 'jquery-validation';
import {getForm,updateForm} from '../redux/actions';
import getConfig from 'next/config';
import Login 	 from './Login.js';

const { publicRuntimeConfig } = getConfig();
class SignUp extends Component {

	constructor() {
		super();
		this.state = {
			checkUserExists: 0,
			btnLoading: false,
			loggedIn: false,
			auth: {
				firstname: '',
				lastname: '',
				mobNumber: '',
				email: '',
				pwd: '',
				signupPassword: '',
				role: ''
			},
			formerrors: {
				firstNameV: "",
				lastNameV: "",
				mobileV: "",
				emailIDV: "",
			},
			termsCondition: ["The price of products  is as quoted on the site from time to time.",
				"Price and delivery costs are liable to change at any time, but changes will not affect orders in respect of which we have already sent you a Despatch Confirmation.",
				"Products marked as 'non-returnable' on the product detail page cannot be returned.",
				"Products may not be eligible for return in some cases, including cases of buyer's remorse such as incorrect model or color of product ordered or incorrect product ordered."],
			pinValid: "",
			fields: {},
			errors: {}
			}
		this.handleChange = this.handleChange.bind(this);
	}
	componentDidMount() {
		$(".hidePwd").css('display','none');
		var projectName = process.env.REACT_APP_PROJECT_NAME;
	}
	validateForm() { 
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		// console.log(fields["firstname"]);

		if (!fields["firstname"]) {
		  formIsValid = false;
		  errors["firstname"] = "This field is required.";
		}
		if (typeof fields["firstname"] !== "undefined") {
		  //regular expression for email validation
		  var pattern = new RegExp(/^[A-Za-z]*$/)
		  if (!pattern.test(fields["firstname"])) {
			formIsValid = false;
			errors["firstname"] = "Name should only contain letters.";
		  }else{
			errors["firstname"] = "";

		  }
		}
		
		if (!fields["lastname"]) {
			formIsValid = false;
			errors["lastname"] = "This field is required.";
		}
		if (typeof fields["lastname"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^[A-Za-z]*$/)
			if (!pattern.test(fields["lastname"])) {
			  formIsValid = false;
			  errors["lastname"] = "Name should only contain letters.";
			}
		}


		if (!fields["signupEmail"]) {
			formIsValid = false;
			errors["signupEmail"] = "Please enter your email.";
		  }
		  if (typeof fields["signupEmail"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
			if (!pattern.test(fields["signupEmail"])) {
			  formIsValid = false;
			  errors["signupEmail"] = "Please enter valid email.";
			}
		  }
	  
		if (!fields["mobNumber"]) {
			formIsValid = false;
			errors["mobNumber"] = "This field is required.";
		}
		if (typeof fields["mobNumber"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^([7-9][0-9]{9})$/)
			if (!pattern.test(fields["mobNumber"])) {
			  formIsValid = false;
			  errors["mobNumber"] = "Please enter valid mobile number.";
			}
		}

		if (!fields["pincode"]) {
			formIsValid = false;
			errors["pincode"] = "This field is required.";
		}
		if (typeof fields["pincode"] !== "undefined") {
			var pattern = new RegExp(/^[1-9][0-9]{5}$/);
			if (!pattern.test(fields["pincode"])) {
			  formIsValid = false;
			  errors["pincode"] = "Please enter 6 digit pincode.";
			}
		}

		if (!fields["signupPassword"]) {
		  formIsValid = false;
		  errors["signupPassword"] = "This field is required.";
		}
		if (typeof fields["signupPassword"] !== "undefined") {
			//regular expression for email validation
			if (fields["signupPassword"].length >= 6) {
				errors["signupPassword"] = ""
			}else{
				formIsValid = false;
				errors["signupPassword"] = "Please enter at least 6 characters.";
			}
		}

		if (!fields["signupConfirmPassword"]) {
			formIsValid = false;
			errors["signupConfirmPassword"] = "This field is required.";
		  }

		  if (typeof fields["signupConfirmPassword"] !== "undefined") {
			  //regular expression for email validation
			  if (fields["signupPassword"] !== fields["signupConfirmPassword"]) {
				formIsValid = false;
				errors["signupConfirmPassword"] = "Password do not match";
			  }else{
				errors["signupConfirmPassword"] =""
			  }
		  }
  
	
		this.setState({
		  errors: errors
		});
		return formIsValid;
	  }

	usersignup(event) {
		event.preventDefault();
		if(this.validateForm()){
		//if ($("#signUpUser").valid()) {
			var auth = {
				firstname: this.state.firstname,
				lastname: this.state.lastname,
				mobNumber: (this.state.mobNumber).replace("-", ""),
				pincode: this.state.pincode,
				email: this.state.signupEmail,
				username: this.state.signupEmail,
				pwd: this.state.signupPassword,
				role: 'user',
				status: 'active',
				"emailSubject": "Email Verification",
				"emailContent": "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
			}
			
			// document.getElementById("signUpBtn").innerHTML = 'Please Wait...';
			document.getElementById("signUpBtn").innerHTML = 
			this.setState({ btnLoading: true });
			var passwordVar = this.refs.signupPassword.value;
			var signupConfirmPasswordVar = this.refs.signupConfirmPassword.value;
			// if (passwordVar === signupConfirmPasswordVar) {
				if(this.validateForm()){
				// console.log("Before post Auth:==>",auth)
				return (passwordVar.length >= 6) ?
				
					(true,
						// document.getElementById("signUpBtn").innerHTML = 'Sign Up',
						
						axios.post('/api/auth/post/signup/user', auth)
							.then((response) => {
								
								if (response.data.message === 'USER_CREATED') {
									// console.log("user created:", response.data);							

									var auth = {
										email: this.state.signupEmail,
										password: this.state.signupPassword,
										role: "user"
									}
									// console.log("Auth:", auth);
									axios.post('/api/auth/post/login', auth)
										.then((response) => {
											this.setState({ btnLoading: false });
											if (response) {
												// console.log("login response====",response);

												//send notification to user
												var sendData = {
													"event": "Sign Up",
													"toUser_id": response.data.userDetails.user_id,
													"toUserRole":"user",
													"variables": {
													"Username" : response.data.userDetails.firstName,
													}
												}
													// console.log('sendDataToUser==>', sendData)
													axios.post('/api/masternotifications/post/sendNotification', sendData)
													.then((res) => {
														// console.log('sendDataToUser in result==>>>', res.data)
													})
													.catch((error) => { console.log('notification error: ',error)})
													
												var userDetails = {
													firstname	: response.data.userDetails.firstName,
													lastname	: response.data.userDetails.lastName,
													email		: response.data.userDetails.email,
													mobNumber   : response.data.userDetails.mobile,
													pincode		: response.data.userDetails.pincode,
													user_id		: response.data.userDetails.user_id,
													roles		: response.data.userDetails.roles,
													token		: response.data.userDetails.token,
												}
												var previousUrl = localStorage.getItem('previousUrl');
												if (previousUrl !== null) {
													// console.log("previousUrl=====", previousUrl);
													if (previousUrl.includes('com')) {
														var previousUrl_split = previousUrl.split('com');

													} else {
														var port = window.location.port;
														// console.log("Port======", port);
														var previousUrl_split = previousUrl.split(port);
													}
													// console.log('pincode:',response.data.userDetails.pincode);												
													// localStorage.setItem("pincode", response.data.userDetails.pincode);
													localStorage.setItem("token", response.data.token);
													localStorage.setItem("user_ID", response.data.ID);
													localStorage.setItem("roles", response.data.roles);													
													localStorage.setItem('userDetails', JSON.stringify(userDetails));
													swal('Congratulations! You have been successfully Login, Now you can place your order.');
													window.location.reload();
													
												} else {	
													// console.log('pincode:',response.data.userDetails.pincode);												
													// localStorage.setItem("pincode", response.data.userDetails.pincode);
													localStorage.setItem("token", response.data.token);
													localStorage.setItem("user_ID", response.data.ID);													
													localStorage.setItem("roles", response.data.roles);
													localStorage.setItem('userDetails', JSON.stringify(userDetails));
													// this.props.history.push("/");
													swal('Congratulations! You have been successfully Login, Now you can place your order.')
													window.location.reload();
													
												}
											}

										})
										.catch((error) => {
											console.log("Error:", error);
										})
									this.setState({
										loggedIn: true
									})

								} else {
									this.setState({ btnLoading: false });
									swal(response.data.message);
								}
							})
							.catch((error) => {
								console.log("Signup Error :", error);
							})
					)
					:
					(
						document.getElementById("signUpBtn").innerHTML = 'Sign Up',

						swal("Password should be at least 6 Characters Long, Please try again or create an Account.")

					)


			} else {
				// document.getElementById("signUpBtn").innerHTML = 'Sign Up';
				this.setState({ btnLoading: false });
				swal("Passwords does not match, Please Try Again.");
			}
		//}
	   }
	} 
	
	Closepagealert(event) {
		event.preventDefault();
		$(".toast-error").html('');
		$(".toast-success").html('');
		$(".toast-info").html('');
		$(".toast-warning").html('');
		$(".toast-error").removeClass('toast');
		$(".toast-success").removeClass('toast');
		$(".toast-info").removeClass('toast');
		$(".toast-warning").removeClass('toast');
	}

	checkUserExists(event) {
		if (event.target.value !== '') {
			axios.get('/get/checkUserExists/' + event.target.value)
				.then((response) => {
					if (response.data.length > 0) {
						$(".checkUserExistsError").show();
						$('.button3').attr('disabled', 'disabled');
						this.setState({ checkUserExists: 1 })
					} else {
						$(".checkUserExistsError").hide();
						$('.button3').removeAttr('disabled');
						this.setState({ checkUserExists: 0 })
					}
				})
				.catch(function (error) {
				})
		} else {
			$(".checkUserExistsError").hide();
		}
	}

	handleChange(event){
		const formerrors = this.state.formerrors;
		
		this.setState({
			[event.target.name]: event.target.value,
			formerrors
		}); 
		if(event.target.name ==="pincode"){
			var pinValid = this.validatePIN(event.target.value);
			this.setState({
				pinValid : pinValid,
			}); 
			// console.log("pincode valid ==",pinValid);
		}
		let fields = this.state.fields;
		fields[event.target.name] = event.target.value;
		this.setState({
		  fields
		});
	
	}
	validatePIN (pin) {
		if(pin.length === 4 ||  pin.length === 6 ) {
		  if( /[0-9]/.test(pin))  {
			return true;
		  }else {return false;}
		}else {
			return false;
			}
	}
	acceptcondition(event){
		var conditionaccept = event.target.value;
		if (conditionaccept === "acceptedconditions") {
			$(".acceptinput").removeAttr('disabled');
		} else {
			$(".acceptinput").addAttr('disabled');
		}
	}
	showModal() {
		$(".modalbg").css("display", "block");
	}
	hideModal() {
		$(".modalbg").css("display", "none");
	}
	componentDidMount() {
		//this.validation();
		$(".checkUserExistsError").hide();
	}
	//password show hide working
	showSignUpPass() { 
		$(".hidePwd").css('display','block');
		$(".showPwd").css('display','none');
	
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('#signupPassword').attr('type', 'text');
	}	
	hideSignUpPass() {
		$(".hidePwd").css('display','none');
		$(".showPwd").css('display','block');
	
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('#signupPassword').attr('type', 'password');
	}
	//confirm password show hide working
	showConfirmPass() { 
		$(".hideConfirmPwd").css('display','block');
		$(".showConfirmPwd").css('display','none');
	
		$('.showConfirmPwd').toggleClass('showConfirmPwd1');
		$('.hideConfirmPwd').toggleClass('hideConfirmPwd1');
		return $('#signupConfirmPassword').attr('type', 'text');
	}	
	hideConfirmPass() {
		$(".hidePwd").css('display','none');
		$(".showPwd").css('display','block');
	
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('#signupConfirmPassword').attr('type', 'password');
	}
	openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");
		$("#pageOpacity").show();
      	$('#loginFormModal').show();	
	}
	render() {		
		return (
			// <div style={{ 'height': window.innerHeight + 'px', 'width': window.innerWidth + 'px','background' : "url("+signInBackgroundImg +")" }} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper">
					<div className="col-12 NoPadding">
						<div className="col-12 innloginwrap">
							<h3>Sign Up</h3>
						</div>
						<form id="signUpUser" className="row">
							<div className="form-group frmhgt textAlignLeft col-12 col-lg-6">
								<label>First Name</label><label className="astricsign">*</label>
								<input type="text" maxLength="25" className="form-control" id="firstname" ref="firstname" name="firstname" placeholder="" onChange={this.handleChange} data-text="firstNameV" />
								<div className="errorMsg">{this.state.errors.firstname}</div>

							</div>
							<div className="form-group frmhgt textAlignLeft col-12 col-lg-6">
								<label>Last Name</label><label className="astricsign">*</label>
								<input type="text" maxLength="25" className="form-control" id="lastname" ref="lastname" name="lastname" placeholder="" onChange={this.handleChange} data-text="lastNameV" />
								<div className="errorMsg">{this.state.errors.lastname}</div>
							</div>
							<div className="form-group frmhgt textAlignLeft col-12 mt15">
								<label>Email ID</label><label className="astricsign">*</label>
								<input type="email" className="form-control" id="signupEmail" ref="signupEmail" name="signupEmail" placeholder="" onChange={this.handleChange} data-text="emailIDV" />
								<label className="checkUserExistsError">User already exists!!!</label>
								<div className="errorMsg">{this.state.errors.signupEmail}</div>
							</div>
							<div className="form-group frmhgt textAlignLeft col-12 col-lg-6 mt15">
								<label>Mobile Number</label><label className="astricsign">*</label>                         
                                <input maxLength="10" placeholder="" type="text" ref="mobNumber" name="mobNumber" id="mobNumber" value={this.state.mobNumber} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" />                                     
								<div className="errorMsg">{this.state.errors.mobNumber}</div>

								{/* <PhoneInput
									country={'in'}
									value={this.state.mobNumber}
									name="mobNumber"
									inputProps={{
										name: 'mobNumber',
										required: true
									}}
									onChange={mobNumber => { this.setState({ mobNumber }) }}
								/> */}
							</div>
							<div className="form-group frmhgt textAlignLeft col-12 col-lg-6 mt15">
								<label>Pincode</label><label className="astricsign">*</label>
								<input minLength="6" maxLength="6" type="number" className="form-control" id="pincode" ref="pincode" placeholder="" name="pincode" onChange={this.handleChange} />
								<div className="errorMsg">{this.state.errors.pincode}</div>
							</div>


							<div className="form-group frmhgt textAlignLeft col-12 col-lg-6 mt15">
								<label>Create Password</label><label className="astricsign">*</label>
								<input minLength="6" type="password" className="form-control" id="signupPassword" ref="signupPassword" placeholder="" name="signupPassword" onChange={this.handleChange} autoComplete="off" />
								<div className="showHideSignDiv">
									<i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignUpPass.bind(this)}></i>
									<i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignUpPass.bind(this)} style={{display:'none'}}></i>
								</div>
								<div className="errorMsg">{this.state.errors.signupPassword}</div>

							</div>
							<div className="form-group frmhgt1 textAlignLeft col-12 col-lg-6 mt15">
								<label>Confirm Password</label><label className="astricsign">*</label>
								<input minLength="6" type="password" className="form-control" id="signupConfirmPassword" ref="signupConfirmPassword" placeholder="" name="signupConfirmPassword" onChange={this.handleChange} autoComplete="off"/>
								<div className="showHideSignDiv1">
									<i className="fa fa-eye showConfirmPwd showEyeupSign" aria-hidden="true" onClick={this.showConfirmPass.bind(this)}></i>
									<i className="fa fa-eye-slash hideConfirmPwd hideEyeSignup " aria-hidden="true" onClick={this.hideConfirmPass.bind(this)} style={{display:'none'}}></i>
								</div>
								<div className="errorMsg">{this.state.errors.signupConfirmPassword}</div>
							</div>
							{
								this.state.btnLoading
									?
									<div className="col-12 col-lg-3 offset-lg-4 col-md-10 offset-md-1 NOpaddingRight ">
										<div align="center" className="cssload-fond">
											<div className="cssload-container-general">
												<div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_1"> </div></div>
												<div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_2"> </div></div>
												<div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_3"> </div></div>
												<div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_4"> </div></div>
											</div>
										</div>
									</div>
									:
									<div className="col-12 mt15">
									<button id="signUpBtn" onClick={this.usersignup.bind(this)} className="col-12  btn loginBtn globaleCommBtn">Sign Up</button>
								    </div>
							}
							<div className="col-12 text-center loginforgotpass signuplink mt25">
								<label>Already have an account?</label> &nbsp; <a href='' onClick={this.openSignInModal.bind(this)}>Sign In <b>&#8702;</b></a>
								{/* login modal  */}
                                  <div id="loginFormModal" className="modal in">
                                    <div className="modal-dialog">
                                        <div className="modal-content loginModalContent">                            
                                            <div className="modal-body">   
                                            <button type="button" className="close"  data-dismiss="modal" aria-hidden="true" >&times;</button>                                                            
                                                <div className="col-lg-12 col-md-12 loginForm">
                                                    {/* <Login /> */}
                                                </div>                                                                   
                                            </div>
                                        </div>
                                    </div>
                                </div> 
							</div>
						</form>
						{/* <div className="modal" id="myModal" role="dialog">
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<img src="../../../sites/currentSite/images/Icon.png" />
										<button type="button" className="close modalclosebut" data-dismiss="modal">&times;</button>
										<h2 className="modaltext modalheadingcont">TERMS AND CONDITIONS</h2>
									</div>
									<div className="modal-body">
										<ul>
											{
												this.state.termsCondition && this.state.termsCondition.length > 0 ?
													this.state.termsCondition.map((data, index) => {
														return (
															<li>{data}</li>
														);
													})
													:
													null
											}
										</ul>
									</div>
									<div className="modal-footer">
										<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
									</div>
								</div>
							</div>
						</div> */}
					</div>
			
			
		);
	}
}

const mapStateToProps = (state) => {
	return {
	  formToShow     : state.formToShow,
  
	}
  }
  
  const mapDispachToProps = (dispatch) => {
	return  bindActionCreators({formToShow :getForm, updateFormValue: updateForm}, dispatch)
  }

  export default connect(mapStateToProps, mapDispachToProps)(SignUp);
// export default SignUp;