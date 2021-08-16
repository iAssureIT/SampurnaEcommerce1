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


class SignUpOTP extends Component{

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
			console.log("userDetails ==",userDetails.userId); 
          	this.setState({
            	userId  : userDetails.userId,
				phone   : userDetails.mobNumber,
			})
        }
	}

	resendOTP(event){
		event.preventDefault();
		axios.patch("/api/auth/patch/set_send_otp/"+this.state.phone)
			.then((otpResponse)=>{
				if(otpResponse){
					console.log("otpResponse==",otpResponse);
				}
			})
			.catch((error)=>{
				console.log("error while resending otp==",error);
			})
	}

	verifyOTP(event){
		event.preventDefault();
		if(this.state.otp){
			axios.get("/api/auth/get/checkmobileotp/usingID/"+this.state.userId+"/"+this.state.otp)
				.then((verifyOtpResponse)=>{
					if(verifyOtpResponse){
						console.log("verifyOtpResponse==",verifyOtpResponse);
						if(verifyOtpResponse.data.message === "FAILED"){
							swal('Wrong OTP.');
						}else{
							var userDetails = {
								firstname	: verifyOtpResponse.data.userDetails.firstName,
								lastName	: verifyOtpResponse.data.userDetails.lastName,
								email		: verifyOtpResponse.data.userDetails.email,
								mobNumber	: verifyOtpResponse.data.userDetails.mobile,
								pincode		: verifyOtpResponse.data.userDetails.pincode,
								user_id		: verifyOtpResponse.data.userDetails.user_id,
								roles		: verifyOtpResponse.data.userDetails.roles,
								token		: verifyOtpResponse.data.userDetails.token,
								authService : "",
							}
							localStorage.setItem('userDetails', JSON.stringify(userDetails));
							window.location.reload();
							swal(response.data.message);
						}
					}
				})
				.catch((error)=>{
					console.log("error while resending otp==",error);
				})
		}else{
			swal('Please enter valid OTP.');
		}
	}
	openSignUpModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");
		$('#loginFormModal').show();	 
	}
  
	render(){
	    return(
			<div className="col-12 NoPadding signUpOtpWrapper">
				<div className="col-10 offset-1 mt-3">
					<div className={"col-12 "+S.signTextWrapper}>
						<div className="row">
							<a href="" className="" onClick={this.openSignUpModal.bind(this)}><u>Back to Login</u></a>
						</div>
					</div>
					<div className={"col-12 "+S.signTitleWrapper}>
						<span className={"font-weight-bolder border-0 "+S.signTitle}>OTP</span>
					</div>
					<div className="col-12 mt-3">
						<OtpInput
							className="otpInputBox"
							value={this.state.otp}
							onChange={this.handleChange}
							numInputs={4}
							separator={<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
						/>
					</div>
					<div className={"col-12 "+S.signTextWrapper}>
						<div className="row">
							<span className={"mt-xl-n2 "+S.otpText}>Didn't receive code?</span>&nbsp;&nbsp;
							<a href="" className="mt-xl-n2" onClick={this.resendOTP.bind(this)}>Request again!</a>
						</div>
					</div>
				</div>
				<div className="col-10 offset-1 mt-4">
					<div className="col-12">
						<button className="col-12 otpBtns text-center" onClick={this.verifyOTP.bind(this)}>Verifiy OTP</button>
					</div>
				</div>
			</div>
			// <div className="col-12 NoPadding signUpOtpWrapper">
			// 	<div className="col-10 offset-1 mt-3 ">
			// 		<div className="col-12">
			// 			<a href='' className="OtpTitleWrapper1" onClick={this.openSignUpModal.bind(this)}><u className="mt-5 pt-5">Back to Login</u></a>
			// 		</div>
			// 		<h5 className=" pb-2 text-center OtpTitleWrapper mt-5 pt-5  font-weight-bold ">OTP</h5>
			// 		<div className="row">
			// 			<OtpInput
			// 				className="otpInputBox "
			// 				value={this.state.otp}
			// 				onChange={this.handleChange}
			// 				numInputs={4}
			// 				separator={<span></span>}
			// 			/>
			// 		</div>
			// 		<p className="OtpTitleWrapper2 text-center mt-3">Didn't receive code?&nbsp;<a className="OtpTitleWrapper3"href=""onClick={this.resendOTP.bind(this)}>Request again!</a></p>
			// 	</div>
			// 	<div className="col-10 offset-1 mt-4">
			// 		<div className="col-12">
			// 			<div className="col-12 otpBtns text-center ml-2" onClick={this.verifyOTP.bind(this)}> Verifiy</div>
			// 		</div>
			// 	</div>
			// </div>
	    );
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

export default connect(mapStateToProps, mapDispachToProps)(SignUpOTP);