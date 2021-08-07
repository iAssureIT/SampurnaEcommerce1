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
			console.log("userDetails ==",userDetails.userId); 
          	this.setState({
            	userId  : userDetails.userId,
			})
        }
	}

	resendOTP(event){
		event.preventDefault();
		axios.patch("/api/auth/patch/setsendmobileotpusingID/" +this.state.userId)
			.then((otpResponse)=>{
				if(otpResponse){
					console.log("otpResponse==",otpResponse);
					swal("Please Enter your OPT");
				}
			})
			.catch((error)=>{
				console.log("error while resending otp==",error);
			})
	}

	verifyOTP(event){
    	event.preventDefault();
        console.log("this.state.userId===",this.state.userId,this.state.otp);
        if(this.state.otp){
        	axios.get("/api/auth/get/checkmobileotp/usingID/"+this.state.userId+"/"+this.state.otp)
        		.then((verifyOtpResponse)=>{
            		if(verifyOtpResponse){
              			this.props.updateFormValue("resetPassword");
						swal(verifyOtpResponse.data.message);
					}
				})
        		.catch((error)=>{
            		console.log("error while resending otp==",error);
        		})
		}else{
			swal("Please enter OTP");
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
			<div className="col-12 NoPadding signUpOtpWrapper">
				<div className="col-10 offset-1 mt-3">
					<div className={"col-12 "+S.signTextWrapper}>
						<div className="row">
							<a href="" className="" onClick={this.openSignInModal.bind(this)}><u>Back to Login</u></a>
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