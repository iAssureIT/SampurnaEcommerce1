import React, { Component } from 'react';
import $ 					from "jquery";
import PhoneInput 			from 'react-phone-input-2';
// import PhoneInput           from 'react-phone-number-input'
import swal 				from 'sweetalert';
import axios 				from 'axios';
import { connect } 			from 'react-redux';
import { bindActionCreators }     from 'redux';
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
			var pattern = new RegExp(/^[A-Za-z]*$/)
			if (!pattern.test(fields["lastname"])) {
			  formIsValid = false;
			  errors["lastname"] = "Name should only contain letters.";
			}
		}


		// if (!fields["signupEmail"]) {
		// 	formIsValid = false;
		// 	errors["signupEmail"] = "Please enter your email.";
		//   }
		//   if (typeof fields["signupEmail"] !== "undefined") {
		// 	//regular expression for email validation
		// 	var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
		// 	if (!pattern.test(fields["signupEmail"])) {
		// 	  formIsValid = false;
		// 	  errors["signupEmail"] = "Please enter valid email.";
		// 	}
		//   }
	  
		if (!fields["mobNumber"]) {
			formIsValid = false;
			errors["mobNumber"] = "This field is required.";
		}
		// if (typeof fields["mobNumber"] !== "undefined") {
		// 	//regular expression for email validation
		// 	var pattern = new RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/)
		// 	if (!pattern.test(fields["mobNumber"])) {
		// 	  formIsValid = false;
		// 	  errors["mobNumber"] = "Please enter valid mobile number.";
		// 	}
		// }

		// if (!fields["pincode"]) {
		// 	formIsValid = false;
		// 	errors["pincode"] = "This field is required.";
		// }
		// if (typeof fields["pincode"] !== "undefined") {
		// 	var pattern = new RegExp(/^[1-9][0-9]{5}$/);
		// 	if (!pattern.test(fields["pincode"])) {
		// 	  formIsValid = false;
		// 	  errors["pincode"] = "Please enter 6 digit pincode.";
		// 	}
		// }

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
	  
	userSignupWithOtp(event){
	event.preventDefault();
		if(this.validateForm()){
			var formValues = {
				firstname   : this.state.firstname,
				lastname    : this.state.lastname,
				mobNumber   : (this.state.mobNumber).split("971")[1],
				pincode     : "",
				email       : this.state.signupEmail,
				pwd         : this.state.signupPassword,
				role        : 'user',
				status      : 'unverified',
				countryCode : "uae",
				username    : "MOBILE",
				authService : "",
				isdCode     : "971",
			}
			// console.log("formValues==",formValues);
			axios.post('/api/auth/post/signup/user/otp',formValues)
			.then((signupResponse) =>{
				if(signupResponse){
					// console.log("signupResponse=",signupResponse);
					if(signupResponse.data.result){
						var userDetails = {
							firstname	: signupResponse.data.result.profile.firstname,
							lastname	: signupResponse.data.result.profile.lastname,
							email		: signupResponse.data.result.profile.email,
							mobNumber   : signupResponse.data.result.profile.mobile,
							authService : "",
							userId      : signupResponse.data.ID,
							roles		: signupResponse.data.result.roles[0],
						}
						localStorage.setItem('userDetails', JSON.stringify(userDetails));
						swal("Thank you!! Your account created Successfully. Please Check your SMS, We have sent verification code on your mobile number.");
						this.props.updateFormValue("signupotp");
					}else{
						swal(signupResponse.data.message);
					}
				}
			})
			.catch((error)=>{
				console.log("getting error while signup user",error);
			})
		}
	}

	handleChange(event){
		const formerrors = this.state.formerrors;
		
		this.setState({
			[event.target.name]: event.target.value,
			formerrors
		}); 
		// if(event.target.name ==="pincode"){
		// 	var pinValid = this.validatePIN(event.target.value);
		// 	this.setState({
		// 		pinValid : pinValid,
		// 	}); 
		// }
		let fields = this.state.fields;
		fields[event.target.name] = event.target.value;
		this.setState({
		  fields
		});
	}
	// validatePIN (pin) {
	// 	if(pin.length === 4 ||  pin.length === 6 ) {
	// 	  if( /[0-9]/.test(pin))  {
	// 		return true;
	// 	  }else {return false;}
	// 	}else {
	// 		return false;
	// 		}
	// }
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

	//password show hide working
	togglePassword(event){
		event.preventDefault();
    	// console.log("event.currentTarget==",event.target);
		var element = event.target;
		$(element).toggleClass("fa-eye fa-eye-slash");
		var input = document.getElementById('signupPassword');
		// console.log("input==",input);
		if (input.getAttribute("type") == "password") {
			input.setAttribute("type", "text");
		} else {
			input.setAttribute("type", "password");
		}
	}
	toggleConfirmPassword(){
		event.preventDefault();
    	// console.log("event.currentTarget==",event.target);
		var element = event.target;
		$(element).toggleClass("fa-eye fa-eye-slash");
		var input = document.getElementById('signupConfirmPassword');
		// console.log("input==",input);
		if (input.getAttribute("type") == "password") {
		input.setAttribute("type", "text");
		} else {
		input.setAttribute("type", "password");
		}
	}

	openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");
      	$('#loginFormModal').show();	
	}

	render() {		
		return (
			<div className="col-12 NoPadding">
				<div className="col-12 innloginwrap">
					<h5 className="blueText signinText">Sign Up</h5>
				</div>

				<div className="col-12 NoPadding mb-3 blueText loginforgotpass signuplink mt-5">
					<label>Already have an account?</label> &nbsp; <a href='' className="forgotText " onClick={this.openSignInModal.bind(this)}>Sign In </a>
						<div id="loginFormModal" className="modal in">
						<div className="modal-dialog">
							<div className="modal-content loginModalContent">                            
								<div className="modal-body">   
								<button type="button" className="close"  data-dismiss="modal" aria-hidden="true" >&times;</button>                                                            
									<div className="col-lg-12 col-md-12 loginForm">
									</div>                                                                   
								</div>
							</div>
						</div>
					</div> 
				</div>

				<form id="signUpUser" className="row">
					<div className="form-group frmhgt textAlignLeft col-12 col-lg-6">
						<label className="blueText">First Name</label><label className="astricsign">*</label>
						<input type="text" maxLength="25" className="form-control formcontrol1" id="firstname" ref="firstname" name="firstname" placeholder="" onChange={this.handleChange} data-text="firstNameV" />
						<div className="errorMsg mt-1">{this.state.errors.firstname}</div>

					</div>
					
					<div className="form-group frmhgt textAlignLeft col-12 col-lg-6">
						<label className="blueText">Last Name</label><label className="astricsign">*</label>
						<input type="text" maxLength="25" className="form-control formcontrol1" id="lastname" ref="lastname" name="lastname" placeholder="" onChange={this.handleChange} data-text="lastNameV" />
						<div className="errorMsg mt-1 ">{this.state.errors.lastname}</div>
					</div>

					<div className="form-group frmhgt textAlignLeft col-12 col-lg-6 mt-4 ">
						{/* <label>Mobile Number</label><label className="astricsign">*</label>   */}
						<PhoneInput
						country={'ae'} 
						value={this.state.mobNumber}
						inputProps={{
							name: 'mobNumber',
							required: true
						}}
						// disabled={false}
						// disableDropdown={false}
						// enableAreaCodes={false}
						name="phone"
						// className="col-12 formcontrol1"
						// autoFormat={true}
						// enableAreaCodes={true}
						// withCountryCallingCode={false}
						onChange={mobNumber => { 
							this.setState({ mobNumber })
							
								
								// this.setState({
								// 	mobNumber : this.state.mobNumber,
								// }); 
								let fields = this.state.fields;
								fields["mobNumber"] = this.state.mobNumber;
								this.setState({
								fields
								});
						}}
					/>    
					<div className="errorMsg">{this.state.errors.mobNumber}</div> 
					</div>

					<div className="form-group frmhgt textAlignLeft col-12 col-lg-6 mt-4 ">
						<label className="blueText">Email ID</label>
						<input type="email" className="form-control formcontrol1" id="signupEmail" ref="signupEmail" name="signupEmail" placeholder="" onChange={this.handleChange} data-text="emailIDV" />
						{/* <label className="checkUserExistsError">User already exists!!!</label> */}
						<div className="errorMsg mt-2">{this.state.errors.signupEmail}</div>
					</div>
					
					{/*<div className="form-group frmhgt textAlignLeft col-12 col-lg-6 ">
						<label>Pincode</label><label className="astricsign">*</label>
						<input minLength="6" maxLength="6" type="number" className="form-control formcontrol1" id="pincode" ref="pincode" placeholder="" name="pincode" onChange={this.handleChange} />
						<div className="errorMsg">{this.state.errors.pincode}</div>
					</div>*/}

					<div className="form-group frmhgt textAlignLeft col-12 col-lg-6  mt-4">
						<label className="blueText">Create Password</label><label className="astricsign">*</label>
						<input id="signupPassword" type="password" class="form-control passswordInput formcontrol1" ref="signupPassword" name="signupPassword" placeholder="Password" 
							onChange={this.handleChange.bind(this)}
							value={this.state.signupPassword}  autoComplete="off"
						/>
						<span toggle="#signupPassword" class="fa fa-fw fa-eye field-icon toggle-password"
							onClick={this.togglePassword.bind(this)}>
						</span>
						<div className="errorMsg mt-1">{this.state.errors.signupPassword}</div>
					</div>
					<div className="form-group frmhgt textAlignLeft col-12 col-lg-6  mt-4">
						<label className="blueText">Confirm Password</label><label className="astricsign">*</label>
						<input id="signupConfirmPassword" type="password" class="form-control passswordInput formcontrol1" ref="signupConfirmPassword" name="signupConfirmPassword" placeholder="Password" 
							onChange={this.handleChange.bind(this)}
							value={this.state.signupConfirmPassword}  autoComplete="off"
						/>
						<span toggle="#signupConfirmPassword" class="fa fa-fw fa-eye field-icon toggle-password"
							onClick={this.toggleConfirmPassword.bind(this)}>
						</span>
						<div className="errorMsg mt-1">{this.state.errors.signupConfirmPassword}</div>
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
							<div className="col-12 mb-3 mt-5 ">
								<button id="signUpBtn" onClick={this.userSignupWithOtp.bind(this)} className="col-12  btn otpBtns	">Sign Up</button>
							</div>
					}
					
				</form>
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