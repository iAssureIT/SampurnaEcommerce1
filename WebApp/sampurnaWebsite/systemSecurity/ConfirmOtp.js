import React, { Component }		from 'react';
import swal                   	from 'sweetalert';
import $                      	from "jquery";
import axios                  	from 'axios';
import Image 					from 'next/image';
import { connect } 				from 'react-redux';
import OtpInput 				from 'react-otp-input';
import { bindActionCreators }   from 'redux';
import {getForm,updateForm} 	from '../redux/actions';


import S from './systemSecurity.module.css';


class ConfirmOTP extends Component{

	constructor(props){
		super(props);
		this.state = {
			userID  : "",
			otp     : '' 
		}
	}

	handleChange = (otp) => this.setState({ otp });

	componentDidMount(){
		var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
			console.log("userDetails ==",userDetails); 
			console.log("userDetails ==",userDetails.userId); 
          	this.setState({
            	userId  : userDetails.userId,
			})
        }
	}

	resendOTP(event){
		event.preventDefault();
		var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
			console.log("userDetails ==",userDetails.userId); 
          	this.setState({
            	userId  : userDetails.userId,
			})
        }
		if(this.state.userId){
		axios.patch("/api/auth/patch/setsendmobileotpusingID/" +this.state.userId)
			.then((otpResponse)=>{
				if(otpResponse){
					swal("Please Enter your OPT");
				}
			})
			.catch((error)=>{
				console.log("error while resending otp==",error);
			})
		}
	}

	verifyOTP(event){
    	event.preventDefault();
		var userDetails = JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
			console.log("userDetails inside verify otp ==",userDetails.userId); 
          	this.setState({
            	userId  : userDetails.userId,
			})
        }
        console.log("this.state.userId===",this.state.userId,this.state.otp);
        if(this.state.otp && this.state.userId){
        	axios.get("/api/auth/get/checkmobileotp/usingID/"+this.state.userId+"/"+this.state.otp)
        		.then((verifyOtpResponse)=>{
            		if(verifyOtpResponse){
              			this.props.updateFormValue("resetPassword");
						// swal(verifyOtpResponse.data.message);
						swal("OTP Verified");
					}
				})
        		.catch((error)=>{
            		console.log("error while verifying otp==",error);
        		})
		}
	}

	openSignUpModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");
		$('#loginFormModal').show();	 
	}

	openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");
      	$('#loginFormModal').show();	
	}

	render(){
		return(
			<div className={"col-12 "+S.systemSecurityWrapper}>
				<div className="col-12 mt-3">
					<div className={"col-12 "+S.systemSecurityTextWrapper}>
						<div className="row">
							<a><img src="/images/eCommerce/go-back-arrow.png"></img>&nbsp;</a>
							<a href="" className={S.backToLogin} onClick={this.openSignInModal.bind(this)}><u> Back to Login</u></a>
						</div>
					</div>
					<div className={"col-12 "+S.systemSecurityTitleWrapper}>
						<span className={S.systemSecurityTitle2}>OTP</span>
					</div>
                	<div className="col-12 mt-4">
						<div className="d-flex justify-content-center">
							<OtpInput
								className="otpInputBox"
								value={this.state.otp}
								onChange={this.handleChange}
								numInputs={4}
								separator={<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
							/>
						</div>
					</div>
					<div className={"col-12 "+S.systemSecurityTextWrapper}>
						<div className="row d-flex justify-content-center">
							<span className={"mt-xl-n2 "+S.otpText1}>Didn't receive code?</span>&nbsp;&nbsp;
							<a href="" className={"mt-xl-n2 "+S.otpText2} onClick={this.resendOTP.bind(this)}>Request again!</a>
						</div>
					</div>
					<div className="col-12">
						<button className="col-12 mt-3 mb-4 otpBtns" onClick={this.verifyOTP.bind(this)}>Verify</button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return{
		formToShow : state.formToShow,
	}
}
  
const mapDispachToProps = (dispatch) => {
	return  bindActionCreators({formToShow :getForm, updateFormValue: updateForm}, dispatch)
}

export default connect(mapStateToProps, mapDispachToProps)(ConfirmOTP);