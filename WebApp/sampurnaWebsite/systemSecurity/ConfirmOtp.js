import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
import axios from 'axios';
import Image from 'next/image';
import { connect } from 'react-redux';
import OtpInput from 'react-otp-input';
import { bindActionCreators }     from 'redux';
import {getForm,updateForm} from '../redux/actions';

class ConfirmOTP extends Component {
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
        cons
        axios.get("/api/auth/get/checkmobileotp/usingID/"+this.state.userId+"/"+this.state.otp)
        .then((verifyOtpResponse)=>{
            if(verifyOtpResponse){
              this.props.updateFormValue("ResetPassword");
              swal(verifyOtpResponse.data.message);
               
            }
        })
        .catch((error)=>{
            console.log("error while resending otp==",error);
        })
  }
  render() {
    return (
        <div className="col-12 NoPadding signUpOtpWrapper">
              <div className="col-12 innloginwrap mb25">
                <h4>Confirm OTP</h4>
              </div>
              <div className="col-10 offset-1 mt-5">
                <div className="row">
                <OtpInput
                    className="otpInputBox"
                    value={this.state.otp}
                    onChange={this.handleChange}
                    numInputs={4}
                    separator={<span></span>}
                />
                </div>
              </div>
              <div className="col-10 offset-1 mt-5">
                <div className="row">
                  <div className="col-5 otpBtns text-center mr-2" onClick={this.resendOTP.bind(this)}> Resend OTP</div>
                  <div className="col-5 otpBtns text-center ml-2" onClick={this.verifyOTP.bind(this)}> Verify OTP</div>
                </div>
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

  export default connect(mapStateToProps, mapDispachToProps)(ConfirmOTP);
