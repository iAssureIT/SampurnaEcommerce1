import React, { Component } 	from 'react';
import $ 						from "jquery";
import PhoneInput               from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import swal 					from 'sweetalert';
import axios 					from 'axios';
import { connect } 				from 'react-redux';
import { bindActionCreators }   from 'redux';
import {getForm,updateForm}		from '../redux/actions';
import getConfig 				from 'next/config';
import Login 	 				from './Login.js';


import S from './systemSecurity.module.css';


const { publicRuntimeConfig } = getConfig();


class SignUp extends Component{

	constructor(){
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
			signupEmail : "",
			// formerrors: {
			// 	firstNameV: "",
			// 	lastNameV: "",
			// 	mobileV: "",
			// 	emailIDV: "",
			// },
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

	componentDidMount(){
		$(".hidePwd").css('display','none');
		var projectName = process.env.REACT_APP_PROJECT_NAME;
	}

	validateForm(){ 
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		if (!fields["firstname"]) {
			formIsValid = false;
			errors["firstname"] = "This field is required.";
		}

		if (typeof fields["firstname"] !== "undefined") {
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
		if(this.state.signupEmail!==""){ 
		  if (!fields["signupEmail"]) {
			formIsValid = false;
			errors["signupEmail"] = "Please enter your email.";
		  }
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

		if (!fields["signupPassword"]) {
		  formIsValid = false;
		  errors["signupPassword"] = "This field is required.";
		}

		if (typeof fields["signupPassword"] !== "undefined") {
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
			  if (fields["signupPassword"] !== fields["signupConfirmPassword"]) {
				formIsValid = false;
				errors["signupConfirmPassword"] = "Password do not match";
			  }else{
				errors["signupConfirmPassword"] =""
			  }
		  }

		if(!fields["termsNconditions"]){
			var pattern = this.state.isChecked
            // console.log("condition---", fields["termsNconditions"]);
            if(pattern === false){
                formIsValid = false;
                errors["termsNconditions"] = "Please check terms and conditions";
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
			if(formValues){
				// console.log("formValues==",formValues);
				axios.post('/api/auth/post/signup/user/otp',formValues)
				.then((signupResponse) =>{
					if(signupResponse){
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
	}

	handleChange(event){
		this.setState({
			[event.target.name]: event.target.value,
			// formerrors
		}); 

		let fields = this.state.fields;
		// console.log("fields===",fields);
		fields[event.target.name] = event.target.value;
		this.setState({
		  fields
		});
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

	togglePassword(event){
		event.preventDefault();
		var element = event.target;
		$(element).toggleClass("fa-eye fa-eye-slash");
		var input = document.getElementById('signupPassword');
		if (input.getAttribute("type") == "password") {
			input.setAttribute("type", "text");
		} else {
			input.setAttribute("type", "password");
		}
	}

	toggleConfirmPassword(){
		event.preventDefault();
		var element = event.target;
		$(element).toggleClass("fa-eye fa-eye-slash");
		var input = document.getElementById('signupConfirmPassword');
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

	checkboxClick(event) {
        let isChecked = !this.state.isChecked;
        this.setState({ isChecked }, () => {

        });
        let fields = this.state.fields;
        fields[event.target.name] = isChecked;
        this.setState({
            fields
        });
    }

	render(){		
		return(
			<div className={"col-12 "+S.systemSecurityWrapper}>
				<div className={"col-12 "+S.systemSecurityTitleWrapper}>
					<span className={S.systemSecurityTitle1}>SIGN UP</span>
					<hr className={S.systemSecurityTitleUnderline}/>
				</div>
				<div className={"col-12 "+S.systemSecurityTextWrapper}>
					<div className="row">
						<span>Already have an account?</span>&nbsp;&nbsp;
						<a href="" className={S.systemSecuritySignIn} onClick={this.openSignInModal.bind(this)}>Sign In</a>
					</div>
				</div>
				<form id="signUpUser" className={"row "+S.signUpUser}>
					<div className="col-12 col-lg-6 form-group frmhgt textAlignLeft">
						<input type="text" maxLength="25" className="form-control formcontrol1" id="firstname" ref="firstname" name="firstname" placeholder="First Name*" onChange={this.handleChange} data-text="firstNameV" />
						<div className="errorMsg mt-1">{this.state.errors.firstname}</div>
					</div>
					<div className="col-12 col-lg-6 form-group frmhgt textAlignLeft">
						<input type="text" maxLength="25" className="form-control formcontrol1" id="lastname" ref="lastname" name="lastname" placeholder="Last Name*" onChange={this.handleChange} data-text="lastNameV" />
						<div className="errorMsg mt-1 ">{this.state.errors.lastname}</div>
					</div>
					<div className="col-12 col-lg-6 form-group frmhgt textAlignLeft">
						<input type="email" className="form-control formcontrol1" id="signupEmail" ref="signupEmail" name="signupEmail" placeholder="Email ID" onChange={this.handleChange} data-text="emailIDV" />
						<div className="errorMsg mt-2">{this.state.errors.signupEmail}</div>
					</div>
					<div className="col-12 col-lg-6 form-group frmhgt textAlignLeft">
					<PhoneInput
						country={'ae'} 
						countryCodeEditable = {false}
						value={this.state.mobNumber}
						inputProps={{
							name: 'mobNumber',
							required: true
						}}
						name="phone"
						placeholder="Phone*"
						onChange={mobNumber => { 
							this.setState({ mobNumber })
							console.log("Mobile no==",this.state.mobNumber);
							
							let fields = this.state.fields;
							fields["mobNumber"] = this.state.mobNumber;
							this.setState({
							fields
							});
						}}
					/>
						{/* <input
							className="form-control formcontrol1"
							type="tel"
							id="phone"
							name="phone"
							ref="phone"
							placeholder="Phone*"
							pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
							onChange={mobNumber => { 
								this.setState({ mobNumber })
								let fields = this.state.fields;
								fields["mobNumber"] = this.state.mobNumber;
								this.setState({
									fields
								});
							}}
							inputProps={{
								name: 'mobNumber',
								required: true
							}}
						/> */}
						<div className="errorMsg">{this.state.errors.mobNumber}</div> 
					</div>
					<div className="form-group frmhgt textAlignLeft col-12 col-lg-6">
						<input id="signupPassword" type="password" class="form-control passswordInput formcontrol1" ref="signupPassword" name="signupPassword" placeholder="Password*" 
							onChange={this.handleChange.bind(this)}
							value={this.state.signupPassword}  autoComplete="off"
						/>
						<span toggle="#signupPassword" class="fa fa-fw fa-eye field-icon toggle-password"
							onClick={this.togglePassword.bind(this)}>
						</span>
						<div className="errorMsg mt-1">{this.state.errors.signupPassword}</div>
					</div>
					<div className="form-group frmhgt textAlignLeft col-12 col-lg-6">
						<input id="signupConfirmPassword" type="password" class="form-control passswordInput formcontrol1" ref="signupConfirmPassword" name="signupConfirmPassword" placeholder="Confirm Password*" 
							onChange={this.handleChange.bind(this)}
							value={this.state.signupConfirmPassword}  autoComplete="off"
						/>
						<span toggle="#signupConfirmPassword" class="fa fa-fw fa-eye field-icon toggle-password"
							onClick={this.toggleConfirmPassword.bind(this)}>
						</span>
						<div className="errorMsg mt-1">{this.state.errors.signupConfirmPassword}</div>
					</div>
					<div className={"col-12 mt-2 shippingtimes "+S.systemSecurityTermsNConditionWrapper}>
						<span className="mt-2">
							<input className="mt-2" type="checkbox" name="termsNconditions" isChecked={this.state.isChecked} title="Please Read and Accept Terms & Conditions" onClick={this.checkboxClick.bind(this)} />
						</span>&nbsp;&nbsp;
						<span className={S.systemSecurityTermsNConditionText} data-toggle="modal" data-target="#termsNconditionsmodal">Terms & Conditions*</span>
						<div className="errorMsg mt-1">{this.state.errors.termsNconditions}</div>
					</div>
					{
						this.state.btnLoading
						?
							<div className="col-12 col-lg-3 offset-lg-4 col-md-10 offset-md-1 NOpaddingRight">
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
							<div className="col-12 col-sm-6 col-lg-7 col-xl-7 mx-auto mt-3 mt-lg-2 mt-xl-3 mb-5">
								<button id="signUpBtn" onClick={this.userSignupWithOtp.bind(this)} className="col-12 btn otpBtns">Sign Up</button>
							</div>
					}
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return{
		formToShow     : state.formToShow,
	}
}
  
const mapDispachToProps = (dispatch) => {
	return  bindActionCreators({formToShow :getForm, updateFormValue: updateForm}, dispatch)
}

export default connect(mapStateToProps, mapDispachToProps)(SignUp);