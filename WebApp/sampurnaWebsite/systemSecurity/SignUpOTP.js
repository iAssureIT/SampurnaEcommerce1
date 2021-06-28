import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
import axios from 'axios';
import Image from 'next/image';
import { connect } from 'react-redux';
import OtpInput from 'react-otp-input';
import { bindActionCreators }     from 'redux';
import {getForm,updateForm} from '../redux/actions';

class SignUpOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID  : "",
      otp     : '' 
    }
  }

  handleChange = (otp) => this.setState({ otp });

  componentDidMount() {
    var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
          var userID                = userDetails.user_id; 
        }
  }

  resendOTP(event){
    event.preventDefault();
    var userDetails     =  JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
        console.log("userDetails===",userDetails);
        const mobile = userDetails.mobile;
        axios.patch("/api/auth/patch/set_send_otp/"+mobile)
        .then((otpResponse)=>{
            if(otpResponse){
                console.log("otpResponse==",otpResponse);
            }
        })
        .catch((error)=>{
            console.log("error while resending otp==",error);
        })
    }
  }

  verifyOTP(event){
    event.preventDefault();
    var userDetails     =  JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
        const mobileOTP = this.state.otp;
        console.log("mobileOTP=",mobileOTP);
        console.log("verifyOTP userDetails===",userDetails);
        axios.get("/api/auth/get/checkmobileotp/usingID/"+userDetails.userId+"/"+mobileOTP)
        .then((verifyOtpResponse)=>{
            if(verifyOtpResponse){
                console.log("verifyOtpResponse==",verifyOtpResponse);
                var userDetails = {
                    firstname	: verifyOtpResponse.data.userDetails.firstName,
                    lastname	: verifyOtpResponse.data.userDetails.lastName,
                    email		: verifyOtpResponse.data.userDetails.email,
                    mobNumber   : verifyOtpResponse.data.userDetails.mobile,
                    pincode		: verifyOtpResponse.data.userDetails.pincode,
                    user_id		: verifyOtpResponse.data.userDetails.user_id,
                    roles		: verifyOtpResponse.data.userDetails.roles,
                    token		: verifyOtpResponse.data.userDetails.token,
                }
                    localStorage.setItem('userDetails', JSON.stringify(userDetails));
                    swal('Congratulations! You have been successfully Login, Now you can place your order.')
                    window.location.reload();
            }
        })
        .catch((error)=>{
            console.log("error while resending otp==",error);
        })
    }

  }
  render() {
    return (
        <div className="col-12 NoPadding signUpOtpWrapper">
              <div className="col-12 innloginwrap mb25">
                <h4>Confirm OTP</h4>
              </div>
              <div className="col-8 offset-2 mt-5">
                <OtpInput
                    className="otpInputBox"
                    value={this.state.otp}
                    onChange={this.handleChange}
                    numInputs={4}
                    separator={<span></span>}
                    // inputStyle={none}
                />
              </div>
              <div className="col-8 offset-2 mt-5">
                  <button className="col-5 btn-secondary  pull-left otpBtns" onClick={this.resendOTP.bind(this)}> Resend OTP</button>
                  {/* <div className="col-1"></div> */}
                  <button className="col-5 btn-secondary pull-right otpBtns" onClick={this.verifyOTP.bind(this)}> Verify OTP</button>
              </div>
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

  export default connect(mapStateToProps, mapDispachToProps)(SignUpOTP);
