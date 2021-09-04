import React, { Component } from 'react';
import { Link } 			from 'react-router-dom';
import InputMask 			from 'react-input-mask';
import swal 				from 'sweetalert';
import $ 					from "jquery";
import jQuery 				from 'jquery';
import axios 				from 'axios';
import './SignUp.css';

class ResetPassword extends Component {
  	constructor() {
		super();
		this.state = {
			'newPassword' 		: "",
			'confirmPassword'	: "",
			'currentPassword' 	: ""
		}
		this.changepassword 	= this.changepassword.bind(this);
		this.showConfirmPass  	= this.showConfirmPass.bind(this);
  	}

	/**=========== handleChange() ===========*/
	handleChange = (event) => {
		event.preventDefault();
		
		var name = event.target.name;
		this.setState({
			[name]: event.target.value
		})
	}

	/**=========== handleChange() ===========*/
	componentDidMount() {
		var userDetails = JSON.parse(localStorage.getItem("userDetails"));
		var user_id 	= userDetails.user_id;
		var emailId 	= userDetails.email;

		this.setState({ 
			user_id 	: user_id, 
			emailId 	: emailId 
		})
		this.validation();
	}

	/**=========== validation() ===========*/
	validation(){
        jQuery.validator.setDefaults({
            debug 	: true,
            success : "valid"
        });

        $("#resetPasswordForm").validate({
            rules: {
                currentPassword: {
                    required: true,
                },
                newPassword: {
                    required: true,
                },
                confirmPassword: {
                    required: true,
                },
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") === "currentPassword") {
                    error.insertAfter("#currentPasswordMsg");
                }
                if (element.attr("name") === "newPassword") {
                    error.insertAfter("#newPasswordMsg");
                }
                if (element.attr("name") === "confirmPassword") {
                    error.insertAfter("#confirmPasswordMsg");
                }
            }
        });
    }

	/**=========== logout() ===========*/
	logout() {
		var userDetails = JSON.parse(localStorage.getItem("userDetails"));
		// console.log(" token ->",localStorage.getItem("token"))
		if (userDetails.token !== null) {
			this.setState({
				loggedIn: false
			}, () => {
				localStorage.clear();
				window.location = "/login";
			})
		}
		// this.props.history.push('/login')
	}

	/**=========== changepassword() ===========*/
	changepassword(event) {
		event.preventDefault();
		
		var formValues 	= {
			newPassword  	: this.state.newPassword,
			currentPassword : this.state.currentPassword,
			user_id 		: this.state.user_id
		}

		if($('#resetPasswordForm').valid()){
			$('.fullpageloader').show();

			if(this.state.newPassword === this.state.confirmPassword){
				if(this.state.currentPassword === this.state.newPassword){
					swal("Your new password must be different from your old password.");
				}else{
					axios.patch('/api/auth/patch/reset_password', formValues)
					.then((response)=>{
						console.log("response => ",response.data)
						$('.fullpageloader').hide();
						if(response.data.messageCode){
							swal("Your Password has been changed");
							this.logout();
						}else{
							swal(response.data.message);
						}
					})
					.catch((error)=>{
						$('.fullpageloader').hide();
					})
				}
			}else{
				swal("New Password and Confirm Password should be same");
			}
		}
	}

	/**=========== Hide / Show Password ===========*/
	showCurrentPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.currentPasswordInput').attr('type', 'text');
	}

	hideCurrentPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.currentPasswordInput').attr('type', 'password');
	}

	showNewPass() {
		$('.showPwd2').toggleClass('showPwd3');
		$('.hidePwd2').toggleClass('hidePwd3');
		return $('.newPasswordInput').attr('type', 'text');
	}

	hideNewPass() {
		$('.showPwd2').toggleClass('showPwd3');
		$('.hidePwd2').toggleClass('hidePwd3');
		return $('.newPasswordInput').attr('type', 'password');
	}

	showConfirmPass(){
        $('.showPwd4').toggleClass('showPwd5');
        $('.hidePwd4').toggleClass('hidePwd5');
        return $('.confirmPasswordInput').attr('type', 'text');
    }

    hideConfirmPass(){
        $('.showPwd4').toggleClass('showPwd5');
        $('.hidePwd4').toggleClass('hidePwd5');
        return $('.confirmPasswordInput').attr('type', 'password');
    }

	/**=========== render() ===========*/
	render() {
		return (
			<div className="container-fluid changePwdWrapper">
				<div className="row">
					<div className="formWrapper">
						<section className="content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
									<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
										<h4 className="weighttitle NOpadding-right">Reset Password</h4>
									</div>
								</div>
								<hr className="container-fluid row" />
								<div className="box-body">
									<div className="row">
										<form id="resetPasswordForm" >										
											<div className="form-group loginFormGroup pdleftclr veribtm col-lg-6 col-lg-offset-3 col-md-6 col-sm-12 col-xs-12">
												<div className="input-group" id="currentPasswordMsg">
													<input type="password" className="form-control loginInputs currentPasswordInput" ref="currentPassword" name="currentPassword" value={this.state.currentPassword} onChange={this.handleChange} placeholder="Current Password" aria-label="Password" aria-describedby="basic-addon1" required />
													<span className="input-group-addon addons glyphi-custommm padBoth" id="basic-addon1">
														<i className="fa fa-eye Pass showPwd" aria-hidden="true" onClick={this.showCurrentPass.bind(this)}></i>
														<i className="fa fa-eye-slash Pass hidePwd" aria-hidden="true" onClick={this.hideCurrentPass.bind(this)}></i>
													</span>
												</div>
											</div>
											<div className="form-group loginFormGroup pdleftclr veribtm col-lg-6 col-lg-offset-3 col-md-6 col-sm-12 col-xs-12">
												<div className="input-group" id="newPasswordMsg">
													<input type="password" className="form-control loginInputs newPasswordInput" ref="newPassword" name="newPassword" value={this.state.newPassword} onChange={this.handleChange} placeholder="New Password" aria-label="Password" aria-describedby="basic-addon1" required />
													<span className="input-group-addon addons glyphi-custommm padBoth" id="basic-addon1">
														<i className="fa fa-eye Pass showPwd2" aria-hidden="true" onClick={this.showNewPass.bind(this)}></i>
														<i className="fa fa-eye-slash Pass hidePwd2" aria-hidden="true" onClick={this.hideNewPass.bind(this)}></i>
													</span>
												</div>
											</div>
											<div className="form-group loginFormGroup pdleftclr veribtm col-lg-6 col-lg-offset-3 col-md-6 col-sm-12 col-xs-12">
												<div className="input-group" id="confirmPasswordMsg">
													<input type="password" className="form-control loginInputs confirmPasswordInput" ref="confirmPassword" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} placeholder="Confirm Password" aria-label="confirmPassword" aria-describedby="basic-addon1" required />
													<span className="input-group-addon addons glyphi-custommm padBoth" id="basic-addon1">
														<i className="fa fa-eye Pass showPwd4" aria-hidden="true" onClick={this.showConfirmPass.bind(this)}></i>
														<i className="fa fa-eye-slash Pass hidePwd4" aria-hidden="true" onClick={this.hideConfirmPass.bind(this)}></i>
													</span>
												</div>
											</div>
											<div className="form-group loginFormGroup pdleftclr veribtm col-lg-6 col-lg-offset-3 col-md-6 col-sm-12 col-xs-12 mt25 mb25">
												<button className="btn resetBtn col-lg-12 col-md-12 col-sm-12 col-xs-12 btn loginBtn" onClick={this.changepassword.bind(this)}>Reset Password</button>
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
	
	export default ResetPassword;
  