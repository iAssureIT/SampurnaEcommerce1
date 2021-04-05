import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
// import jQuery from 'jquery';
import axios from 'axios';
import Image from 'next/image';
import { connect } from 'react-redux';
import { bindActionCreators }     from 'redux';
import {getForm,updateForm} from '../redux/actions';

class ConfirmOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: false,
      fields: {},
      errors: {}

    }
  }
  componentDidMount() {
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    // if (!fields["emailotp"]) {
    //   formIsValid = false;
    //   errors["emailotp"] = "Please enter a valid OTP.";
    // }
    // if (typeof fields["emailotp"] !== "undefined") {
    //   //regular expression for email validation
    //   var pattern = new RegExp(/^[1-9][0-9]{3}$/)
    //   if (!pattern.test(fields["emailotp"])) {
    //     formIsValid = false;
    //     errors["emailotp"] = "Please enter a valid OTP";
    //   }
    // }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  confirmOTP(event) {
    event.preventDefault();
    var userID = localStorage.getItem('userID');
    // var url = this.props.match.params;
    var formValues = {
      "user_ID": userID,
      "emailOTP": parseInt(this.refs.emailotp.value),
      "status": "Active"
    }
    if (this.validateForm()) {
      axios.get('/api/auth/get/checkemailotp/usingID/' +userID + '/' + this.refs.emailotp.value)
        .then((response) => {
          if (response.data.message === 'SUCCESS') {
            this.props.updateFormValue("resetPassword");	
            swal('OTP Verified Successfully.');
            // var url = localStorage.getItem('previousUrl');
            // if (url === 'forgotpassword') {
            //   localStorage.removeItem("previousUrl");
            //   this.props.history.push('/reset-pwd/' + this.props.match.params.userID);
            // } else {
            //   localStorage.removeItem("previousUrl");
            //   this.props.history.push('/login');
            // }
          } else {
            swal('Please enter valid OTP.');
          }
        })
        .catch((error) => {
          swal(error.response.data.message);
        })
    }

  }
  inputEffect(event) {
    event.preventDefault();
    if ($(event.target).val() !== "") {
      $(event.target).addClass("has-content");
    } else {
      $(event.target).removeClass("has-content");
    }
  }
  resendOtp(event) {
    // const userid = this.props.match.params.userID;
    var userid = localStorage.getItem('userID');
    // if ($("#OTPMobMail").valid()) {
    document.getElementById("resendOtpBtn").innerHTML = 'Please wait...';
      var formValues = {
        "emailSubject": "Email Verification",
        "emailContent": "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
      }
      axios.patch('/api/auth/patch/setsendemailotpusingID/' + userid, formValues)
        .then((response) => {
          document.getElementById("resendOtpBtn").innerHTML = 'Resend OTP';
          //Notification code
          axios.get('/api/ecommusers/' +userid)                    
          .then((res) => {
          // console.log("res.data==>", res.data);
          this.setState({
          fullName: res.data.profile.fullName,
          userid:res.data._id
          }, () => {
          var sendData = {
          "event": "5",
          "toUser_id": res.data._id,
          "toUserRole": "user",
          "variables": {
          "Username": res.data.profile.fullName,
          "OTP": res.data.profile.otpEmail,
          }
          }
              // console.log('sendDataToUser==>', sendData);
              axios.post('/api/masternotifications/post/sendNotification', sendData)
              .then((res) => {
                  // console.log('sendDataToUser in result==>>>', res.data)
              })
              .catch((error) => { 
                  console.log('notification error: ', error) })
              })                  

          })
          .catch((error) => {
          console.log('error', error)
          });//end notification


          swal("OTP re-sent to your registered Email ID.");
        })
      .catch((error) => {
          swal(" Failed to resent OTP");
          document.getElementById("resendOtpBtn").innerHTML = 'Resend OTP';
     })
    //}
  }
  Closepagealert(event) {
    event.preventDefault();
    $(".toast-error").html('');
    $(".toast-success").html('');
    $(".toast-info").html('');
    $(".toast-warning").html('');
    $(".toast-error").removeClass('toast');
    $(".toast-success").removeClass('toast');
    $(".toast-info").removeClass('toast');
    $(".toast-warning").removeClass('toast');

  }

  openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");	
  }
  
  render() {

    var resendOtpWrap = "resendOtpWrap resendOtpWrapcss";
    var mobileEmail = 'Mobile Number';
    var resendOtp = "";

    return (
      // <div style={{ 'height': window.innerHeight + 'px', 'width': window.innerWidth + 'px' }} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper">
      //   <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
      //   </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mobileViewNoPadding">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mobileViewNoPadding">
              <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 siteLogo NoPadding">
                  {/* <img src="/images/eCommerce/kokilaLogo.png" className="responsive logoImg"></img> */}
                  <Image 
                      src={"/images/eCommerce/kokilaLogo.png"}
                      className={"logoImg"}
                      height ={60}
                      width={200}
                      layout="responsive"
                  />	
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap mb25">
                <h4>Confirm OTP</h4>
              </div>
              {
                this.state.showMessage === false ?
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <p>We've sent you an OTP to your registered Email ID.</p>
                    <div className="">
                      <span> Please enter your OTP below.<br /></span>
                    </div>
                    <form id="OTPMobMail" className="textAlignLeft">
                      <div className="">
                        <br />
                        <div className="input-group " id="emailotp">
                          <input type="text" className="form-control" ref="emailotp" name="emailotp" placeholder="Enter OTP" onBlur={this.inputEffect.bind(this)} aria-describedby="basic-addon1" maxLength="4" pattern="(0|[0-9]*)" required />
                          <span className="input-group-addon glyphi-custommm"><i className="fa fa-key" aria-hidden="true"></i></span>
                        </div>
                        <div className="errorMsg">{this.state.errors.emailotp}</div>
                      </div>
                      <div className="loginforgotpass mt25">
                        <label>Found your Password?</label>&nbsp;<a href="" onClick={this.openSignInModal.bind(this)} className="" >Sign In <b>&#8702;</b></a>
                      </div>
                      <div className="mt30 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb25 NoPadding">
                        <div className="col-lg-7 col-md-7 col-sm-7 col-xs-12 ">
                          <div id="resendOtpBtn" onClick={this.resendOtp.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn globaleCommBtn  systemsecBtn">
                              Resend OTP
                          </div>
                        </div>
                        <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 ">
                           <button type="submit" onClick={this.confirmOTP.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn loginBtn globaleCommBtn systemsecBtn">Submit</button>
                        </div>
                      </div>
                    </form>
                  </div>
                  :
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <p className="textAlignCenter">Your Account is verified successfully! Please Sign In to access your account.<br /></p>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
                      <a href="" className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 button3  btn btn-warning  signupbtn" onClick={this.openSignInModal.bind(this)}>Sign In</a>
                    </div>
                  </div>
              }

            </div>
          </div>
        </div>
      // </div>
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

  export default connect(mapStateToProps, mapDispachToProps)(ConfirmOtp);
