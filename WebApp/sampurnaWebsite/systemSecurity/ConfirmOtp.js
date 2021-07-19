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
		// $("#pageOpacity").show();
    $('#loginFormModal').show();	 
  }
  render() {
    return (
        <div className="col-12 NoPadding signUpOtpWrapper">
          <div className="col-10 offset-1 mt-3 ">
              <div className="col-12">
                <a href='' className="OtpTitleWrapper1" onClick={this.openSignUpModal.bind(this)}><u className="mt-5 pt-5">Back to Login</u></a>
              </div> 
              <h5 className=" pb-2 text-center OtpTitleWrapper mt-5 pt-5  font-weight-bold ">Confirm OTP</h5>
                <div className="row">
                <OtpInput
                    className="otpInputBox "
                    value={this.state.otp}
                    onChange={this.handleChange}
                    numInputs={4}
                    separator={<span></span>}
                />
                </div>
                <p className="OtpTitleWrapper2 text-center mt-3">Didn't receive code?&nbsp;<a className="OtpTitleWrapper3"href=""onClick={this.resendOTP.bind(this)}>Request again!</a></p>
                
              </div>
              <div className="col-10 offset-1 mt-4">
                <div className="col-12">
                  <div className="col-12 otpBtns text-center ml-2" onClick={this.verifyOTP.bind(this)}> Verifiy OTP</div>
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
