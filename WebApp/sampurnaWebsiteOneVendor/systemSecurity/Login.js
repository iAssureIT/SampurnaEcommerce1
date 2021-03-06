import React, { Component }   from 'react';
import { Route, location }    from 'react-router-dom';
import swal                   from 'sweetalert';
import validator              from 'validator';
import getConfig              from 'next/config';
import { connect }            from 'react-redux';
import dynamic                from 'next/dynamic';
import Image                  from 'next/image';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import PhoneInput 			      from 'react-phone-input-2';
import SignUp                 from './SignUp.js';
import Facebooklogin          from './Facebooklogin.js';
import Googlelogin            from './Googlelogin.js'
import LoginAsGuest           from './LoginAsGuest.js';
import { bindActionCreators } from  'redux';
import {getForm,updateForm}   from '../redux/actions';

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
  
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["loginusername"]) {
      formIsValid = false;
      errors["loginusername"] = "Username can't be empty.";
    }
    // if (typeof fields["loginusername"] !== "undefined") {
    //   //regular expression for email validation
    //   var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
    //   if (!pattern.test(fields["loginusername"])) {
    //     formIsValid = false;
    //     errors["loginusername"] = "Please enter valid username.";
    //   }
    // }

    if (!fields["loginpassword"]) {
      formIsValid = false;
      errors["loginpassword"] = "Password can't be empty.";
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  userlogin(event) {
    event.preventDefault();
    var payload = {
      username: this.refs.loginusername.value,
      password: this.refs.loginpassword.value,
      role: "user"
    }
      if(this.validateForm()){
        axios.post('/api/auth/post/login/mob_email', payload)
          .then((response) => {
            if(response.data.message === "Login Auth Successful"){
              // console.log("login response=",response);
              if (response.data.ID) {
                var userDetails = {
                  firstName   : response.data.userDetails.firstName,
                  lastName    : response.data.userDetails.lastName,
                  companyID   : parseInt(response.data.userDetails.companyID),
                  email       : response.data.userDetails.email,
                  phone       : response.data.userDetails.phone,
                  pincode     : response.data.userDetails.pincode,
                  user_id     : response.data.userDetails.user_id,
                  roles       : response.data.userDetails.roles,
                  token       : response.data.userDetails.token,
                  authService : "",
                }        
                localStorage.setItem('userDetails', JSON.stringify(userDetails));
                this.setState({
                  loggedIn: true
                }, () => {
                  // swal({text:'Thank You, You have been successfully logged in.'}).then(function(){
                  //   window.location.reload();
                  // });
                  // if(response.data.message === "Login Auth Successful"){
                    window.location.reload();
                  // }
                })
              }
            }else{
              if(response.data.message === "INVALID_PASSWORD"){
                  swal("Your password is wrong");
              }else if(response.data.message === "NOT_REGISTER"){
                  swal("Invalid user");
              }else{
                swal(response.data.message);
              }
            }
          })
          .catch((error) => {
            console.log("error while login user=", error);
          });
      }
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
  }
  openForgotPasswordModal(event){
    event.preventDefault();
    this.props.updateFormValue("forgotPassword");   
  }

  togglePassword(event){
		event.preventDefault();
    // console.log("event.currentTarget==",event.target);
    var element = event.target;
    $(element).toggleClass("fa-eye fa-eye-slash");
    var input = document.getElementById('password-field');
    // console.log("input==",input);
    if (input.getAttribute("type") == "password") {
      input.setAttribute("type", "text");
    } else {
      input.setAttribute("type", "password");
    }
	}
  
  render() {
    return ( 
        <div id="loginFormModal"  className="col-12 NoPadding LoginWrapper mobileViewNoPadding">    
        {this.state.loggedIn === false &&
        <div className="col-12 mobileViewNoPadding">
          <div className="col-12 NoPadding ">
            <div className="col-12 NoPadding">
              <div className="col-12 innloginwrap">
                <div className="col-12">
                  <h5 className="blueText signinText">SIGN IN</h5>
                </div>
              </div>
              <div className="col-12 textAlignment ">
                <div className="col-12 NoPadding blueText loginforgotpass "> 
                  Don't have an account?&nbsp;&nbsp;                      
                    <a href='' className="forgotText " onClick={this.openSignUpModal.bind(this)}> Sign Up</a>                    
                </div>
              </div>
              <form id="login">
                <div className="form-group frmhgt textAlignLeft col-12 NOpadding mt25">
                  <input type="email" className="form-control formcontrol1" ref="loginusername" id="loginusername" name="loginusername" placeholder="Phone Number / Email ID"  onChange={this.handleChange.bind(this)}/>
                  <span className="text-danger">{this.state.formerrors.emailIDV}</span>
                  <div className="errorMsg">{this.state.errors.loginusername}</div>
                </div>

                <div className="textAlignLeft frmhgt col-12 NOpadding ">
                  <input id="password-field" type="password" className="form-control passswordInput formcontrol1" ref="loginpassword" name="loginpassword" placeholder="Password" 
                    onChange={this.handleChange.bind(this)}
                    value={this.state.loginpassword}  autoComplete="off"
                  />
                  <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password"
                    onClick={this.togglePassword.bind(this)}
                  ></span>
                  <div className="errorMsg">{this.state.errors.loginpassword}</div>
                </div>

                <div className="col-12  mb25 text-right">
                  <div className="loginforgotpass">
                    <a href='' className="col-12 pull-right NoPadding forgotText" onClick={this.openForgotPasswordModal.bind(this)}>Forgot Password?</a>
                  </div>
                </div>
                {
                  this.state.btnLoading
                  ?
                  <div className="col-12 col-lg-3 offset-lg-4 col-md-10 offset-md-1  NoPadding ">
                    <div align="center" className="cssload-fond">
                      <div className="cssload-container-general">
                        <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_1">??</div></div>
                        <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_2">??</div></div>
                        <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_3">??</div></div>
                        <div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_4">??</div></div>
                      </div>
                    </div>
                  </div>
                  :
                    <div className="col-12 mb-2 mt-2 ">
                      <input id="logInBtn" type="button" className="col-12 btn signInBtn" value="Sign In" onClick={this.userlogin.bind(this)} />
                    </div>
                }
              </form>
              <div className="col-12 ">
                  <div className="col-12 NoPadding">
                    <div className="row">   
                      <div className="col-12 ">
                        <div className="row">
                          <hr className="col-3 whiteClr" ></hr>
                          <span className="col-2 blueText mt-2 text-center">&nbsp;OR&nbsp;</span>
                          <hr className="col-3 whiteClr"></hr>
                        </div>
                      </div>
                      <div className="col-12 facebookLoginBtn mb-2 mt-2">
                          < Facebooklogin />
                      </div>
                      <div className="col-12 mb-2 googleLoginBtn ">
                          < Googlelogin />
                      </div>
                      <div className="col-12 mb-2">
                          <LoginAsGuest />
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        }
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