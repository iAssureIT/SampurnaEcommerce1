import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link, location } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';
import validator from 'validator';
import getConfig from 'next/config';
import { connect } from 'react-redux';
import { bindActionCreators } from  'redux';
import dynamic from 'next/dynamic';
import Image   from 'next/image';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import {getForm,updateForm} from '../../redux/actions';
import SignUp from './SignUp.js';

const { publicRuntimeConfig } = getConfig();
class Login extends Component {

  constructor() {
    super();
    this.state = {
      btnLoading: false,
      loggedIn: false,
      auth: {
        email: '',
        pwd: '',
      },
      formerrors: {
				emailIDV: "",
			},
      messageData: {
        "type": "",
      },
      fields: {},
      errors: {}
    }
  }
  componentDidMount() {
    $(".hidePwd").css('display','none');
  }

  handleChange(e){
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });

  }

  userlogin(event) {
    event.preventDefault();
    var auth = {
      email: this.refs.loginusername.value,
      password: this.refs.loginpassword.value,
      role: "user"
    }

    // var email = validator.isEmail(this.refs.loginusername.value); //=> true
    // var pwd = !validator.isEmpty(this.refs.loginpassword.value); //=> true
    //  console.log("email",this.validateForm());

    if (this.validateForm()) {
      // document.getElementById("logInBtn").value = 'Please Wait...';
      document.getElementById("logInBtn").value =
        this.setState({ btnLoading: true });
      axios.post('/api/auth/post/login', auth)
        .then((response) => {
          // console.log("preference.data, ===> ",response.data.userDetails);
          if (response.data.ID) {
            this.setState({ btnLoading: false });
            var userDetails = {
              firstName: response.data.userDetails.firstName,
              lastName: response.data.userDetails.lastName,
              companyID : parseInt(response.data.userDetails.companyID),
              email: response.data.userDetails.email,
              phone: response.data.userDetails.phone,
              pincode: response.data.userDetails.pincode,
              user_id: response.data.userDetails.user_id,
              roles: response.data.userDetails.roles,
              token: response.data.userDetails.token,
            }
            // console.log("response.data.data, ===> ",response.data);
            document.getElementById("logInBtn").value = 'Sign In';
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user_ID", response.data.ID);
            localStorage.setItem("roles", response.data.roles);            
            localStorage.setItem('userDetails', JSON.stringify(userDetails));
              axios.get("/api/adminPreference/get")
                  .then(preference =>{
                    var websiteModel = preference.data[0].websiteModel;
                    var showLoginAs = preference.data[0].showLoginAs;
                    var preferencedata = preference.data[0];
                    // console.log("preference.data, ===> ",preferencedata);
                    localStorage.setItem("websiteModel",websiteModel);
                    localStorage.setItem("showLoginAs",showLoginAs);
                    localStorage.setItem("preferencedata",preferencedata);
                  })
                  .catch(error=>{
                      console.log("Error in getting adminPreference ===> ", error);
                    }) 

            this.setState({
              loggedIn: true
            }, () => {
              // this.props.history.push('/')
              swal("Thank You", "You have been successfuly logged In");
              window.location.reload();
            })
          } else if (response.data.message === "USER_BLOCK") {
            swal({
              text: "You are blocked by admin. Please contact Admin."
            });
            document.getElementById("logInBtn").value = 'Sign In';
          } else if (response.data.message === "NOT_REGISTER") {
            swal({
              text: "This Email ID is not registered. Please try again."
            });
            document.getElementById("logInBtn").value = 'Sign In';
          } else if (response.data.message === "INVALID_PASSWORD") {
            swal({
              text: "You have entered wrong password. Please try again."
            });
            document.getElementById("logInBtn").value = 'Sign In';
          } else if (response.data.message === "USER_UNVERIFIED") {
            swal({
              text: "You have not verified your account. Please verify your account."
            })
              .then((value) => {
                var emailText = {
                  "emailSubject": "Email Verification",
                  "emailContent": "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
                }
                axios.patch('/api/auth/patch/setsendemailotpusingEmail/' + this.refs.loginusername.value, emailText)
                  .then((response) => {
                    swal("We send you a Verification Code to your registered email. Please verify your account.");
                    this.props.history.push("/confirm-otp/" + response.data.userID);
                  })
                  .catch((error) => {
                    swal(" Failed to sent OTP");
                  })
              });
            document.getElementById("logInBtn").value = 'Sign In';
          }
        })
        .catch((error) => {
          console.log("error", error);
          swal({
            text: "Please enter valid Email ID and Password"
          })
          this.setState({ btnLoading: false });
          // document.getElementById("logInBtn").value = 'Sign In';
          // if (localStorage !== null) {
          // }
        });
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["loginusername"]) {
      formIsValid = false;
      errors["loginusername"] = "Please enter your email.";
    }
    if (typeof fields["loginusername"] !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
      if (!pattern.test(fields["loginusername"])) {
        formIsValid = false;
        errors["loginusername"] = "Please enter valid email.";
      }
    }

    if (!fields["loginpassword"]) {
      formIsValid = false;
      errors["loginpassword"] = "Please enter your password.";
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  closeModal(event){
    event.preventDefault();
    $("#loginFormModal").css("display", "none");
    $('.modal-backdrop').remove();
    $("#signUpFormModal").show();
   
  }
  openSignUpModal(event){
      event.preventDefault();
      this.props.updateFormValue("signUp");
      // $("#pageOpacity").show();
      // $('#loginFormModal').show();
      
  }
  openForgotPasswordModal(event){
    event.preventDefault();
    this.props.updateFormValue("forgotPassword");   
}
 
  showSignPass() {
    $(".hidePwd").css('display','block');
    $(".showPwd").css('display','none');

    $('.showPwd').toggleClass('showPwd1');
    $('.hidePwd').toggleClass('hidePwd1');
    return $('#loginpassword').attr('type', 'text');
  }
  hideSignPass() {
    $(".hidePwd").css('display','none');
    $(".showPwd").css('display','block');

    $('.showPwd').toggleClass('showPwd1');
    $('.hidePwd').toggleClass('hidePwd1');
    return $('#loginpassword').attr('type', 'password');
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
  render() {
    // console.log('local userDetails')
    return (
      // <div id="loginFormModal" style={{ 'height': window.innerHeight + 'px', 'width': window.innerWidth + 'px','background' : "url("+signInBackgroundImg +")" }} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper">
        // <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
        // </div>    
        <div id="loginFormModal"  className="col-12 LoginWrapper mobileViewNoPadding">    
        <div className="col-12 mobileViewNoPadding">
          <div className="col-12 NoPadding ">
            <div className="col-12 NoPadding">
              <div className="col-12 innloginwrap">
                {/* style={{'background': 'url("../../static/'+publicRuntimeConfig.CURRENT_SITE+'/images/Logo.png")'}} */}
                <div className=" col-lg-6 offset-lg-3 col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-xs-8 offset-xs-2 siteLogo NoPadding">
                  {/* <img src="/images/eCommerce/kokilaLogo.png" className="responsive logoImg"></img> */}
                  <Image 
                    src={"/images/multivendorlogo.jpg"}
                    className={"logoImg"}
                    height ={50}
                    width={100}
                    layout="responsive"
                  />	
                </div>
                <div className="col-12">
                  <h4>SIGN IN</h4>
                </div>
              </div>
              <form id="login" onSubmit={this.userlogin.bind(this)}>
                <div className="form-group frmhgt textAlignLeft col-12 NOpadding mt25">
                  <label>Email ID</label><label className="astricsign">*</label>
                  <input type="email" className="form-control" ref="loginusername" id="loginusername" name="loginusername" placeholder="Email ID"  onChange={this.handleChange.bind(this)}/>
                  <span className="text-danger">{this.state.formerrors.emailIDV}</span>
                  <div className="errorMsg">{this.state.errors.loginusername}</div>
                </div>


                <div className="textAlignLeft frmhgt col-12 NOpadding mb25">
                  <label>Password</label><label className="astricsign">*</label>
                  <input type="password" className="form-control" ref="loginpassword" name="loginpassword" id="loginpassword" placeholder="Password"  onChange={this.handleChange.bind(this)} autoComplete="off"/>
                  <div className="showHideSignDiv">
                    <i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
                    <i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
                  </div>
                  <div className="errorMsg">{this.state.errors.loginpassword}</div>

                </div>
                {
                  this.state.btnLoading
                  ?
                  <div className="col-12 col-lg-3 offset-lg-4 col-md-10 offset-md-1  NoPadding ">
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
                    <div className="col-12 NoPadding">
                      <input id="logInBtn" type="submit" className="col-12 btn globaleCommBtn" value="Sign In" />
                    </div>
                }

                <div className="col-12 mt30 mb25 NoPadding">
                  <div className="row">
                    <div className="col-12 col-sm-6 mt10 textAlignment">
                      <div className="loginforgotpass">
                        <a href='' className="col-12 " onClick={this.openForgotPasswordModal.bind(this)}>Forgot Password?</a>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 textAlignment mt10 ">
                      <div className="row loginforgotpass loginSignupBtn">                        
                          <a href='' className="col-12 " onClick={this.openSignUpModal.bind(this)}>Sign Up</a>                    
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log("Login  state:",state);
  return {
    formToShow     : state.formToShow,
  }
}

const mapDispachToProps = (dispatch) => {
  return  bindActionCreators({
    formToShow :getForm, 
    updateFormValue: updateForm
  }, dispatch)
}

export default connect(mapStateToProps, mapDispachToProps)(Login);
// export default Login;