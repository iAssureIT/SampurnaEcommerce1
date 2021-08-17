import React, { Component }		from 'react';
import $						from 'jquery';
import swal 					from 'sweetalert';
import axios 					from 'axios';
import Image 					from 'next/image';
import getConfig 				from 'next/config';
import { connect } 				from 'react-redux';
import { bindActionCreators }   from 'redux';
import {getForm,updateForm} 	from '../redux/actions';

import S from './systemSecurity.module.css';

const { publicRuntimeConfig } = getConfig();

class ResetPassword extends Component{

	constructor(props){
        super(props);
        this.state = {
            showMessage : false,
            errors 		: {}
        }
    }

	componentDidMount(){
        var userDetails =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
			this.setState({
				userId : userDetails.userId,
			})
        }
    }

	resetPassword(event){
        event.preventDefault();
		var formValues = {
			pwd: this.refs.newPassword.value,
		};
		if(this.refs.newPassword.value === this.refs.confirmPassword.value ){
		axios.patch('/api/auth/patch/change_password_using_otp/id/'+this.state.userId, formValues)
	        .then((response)=>{
				if(response){
					this.setState({
						"showMessage" : true,
					})
					swal(response.data.message);
				}
			})
			.catch((error)=>{
				console.log("reset Password error=",error);
			})
		}else{
			swal("Password is not matching");
		}
    }

	handleChange(event){
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

    togglePassword(event){
		event.preventDefault();
		var element = event.target;
		$(element).toggleClass("fa-eye fa-eye-slash");
		var input = document.getElementById('newPassword');
		if(input.getAttribute("type") == "password"){
			input.setAttribute("type", "text");
		}else{
			input.setAttribute("type", "password");
		}
	}

	toggleConfirmPassword(){
		event.preventDefault();
		var element = event.target;
		$(element).toggleClass("fa-eye fa-eye-slash");
		var input = document.getElementById('confirmPassword');
		if (input.getAttribute("type") == "password"){
			input.setAttribute("type", "text");
		}else{
			input.setAttribute("type", "password");
		}
	}

	openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");
      	$('#loginFormModal').show();	
	}

	render(){
        return(
            <div className="col-12 resetWrapper mobileViewNoPadding">
                <div className="col-12 mobileViewNoPadding">
					<div className={"col-12 "+S.signTextWrapper}>
						<div className="row">
							<a href="" className={S.backToLogin} onClick={this.openSignInModal.bind(this)}><i className="fa fa-arrow-left"></i><u> Back to Login</u></a>
						</div>
					</div>
					<div className={"col-12 "+S.signTitleWrapper}>
						<span className={"font-weight-bolder border-0 "+S.signTitle+" "+S.resetPasswordTitle}>RESET PASSWORD</span>
					</div>
                    {
                        this.state.showMessage === false
						?
							<div>
								<form id="resetPassword">
									<div className="form-group frmhgt textAlignLeft col-lg-8 offset-lg-2 mt-4">
										{/* <label className="blueText">New Password</label><label className="astricsign">*</label> */}
										<input
											id="newPassword"
											type="password"
											className="form-control passswordInput formcontrol1"
											ref="newPassword"
											name="newPassword"
											placeholder="New Password" 
											onChange={this.handleChange.bind(this)}
											value={this.state.signupPassword}
											autoComplete="off"
										/>
										<span
											toggle="#newPassword"
											className="fa fa-fw fa-eye field-icon toggle-password"
											onClick={this.togglePassword.bind(this)}
										>
										</span>
										<div className="errorMsg mt-1">{this.state.errors.newPassword}</div>
									</div>
									<div className="form-group frmhgt textAlignLeft col-12 col-lg-8 offset-lg-2 mt-4">
										{/* <label className="blueText">Confirm Password</label><label className="astricsign">*</label> */}
										<input
											id="confirmPassword"
											type="password"
											className="form-control passswordInput formcontrol1"
											ref="confirmPassword"
											name="confirmPassword"
											placeholder="Confirm Password" 
											onChange={this.handleChange.bind(this)}
											value={this.state.signupPassword}  autoComplete="off"
										/>
										<span
											toggle="#confirmPassword"
											className="fa fa-fw fa-eye field-icon toggle-password"
											onClick={this.toggleConfirmPassword.bind(this)}>
										</span>
										<div className="errorMsg mt-1">{this.state.errors.confirmPassword}</div>
									</div>
									<div className="col-12 col-lg-8 offset-lg-2 mb-3 mt-5 mt-lg-3">
										<button id="signUpBtn" onClick={this.resetPassword.bind(this)} className="col-12 btn otpBtns">Save New Password</button>
									</div>
								</form>
							</div>
                        :
							<div className="col-12 resetPassword">
								<p className="col-12 mt25 textAlignCenter">Your password has been reset successfully!</p>
								<div className="col-12 mt10">
									<div className="loginforgotpass textAlignCenter"> Please &nbsp;
										<span className=""onClick={this.openSignInModal.bind(this)} style={{'cursor':'pointer'}}><b>Click here</b> &nbsp;</span>
											to Sign In.
									</div>
								</div>
							</div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return{
		formToShow : state.formToShow,
	}
}
  
const mapDispachToProps = (dispatch) => {
	return bindActionCreators({formToShow :getForm, updateFormValue: updateForm}, dispatch)
}

export default connect(mapStateToProps, mapDispachToProps)(ResetPassword);