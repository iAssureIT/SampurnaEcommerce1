import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
import { BrowserRouter, Route, Switch,Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

import axios from 'axios';


class Login extends Component {

  constructor(){
      super();
        this.state = {           
          loggedIn : false,
          auth: {
                email           : '',
                pwd             : '',
            }
        }
  }
  componentDidMount(){
    // var userDetail = localStorage.getItem("userDetails");
    // var userDetails =  localStorage.removeItem("userDetails");
  }
userlogin(event) {
      event.preventDefault();
      var auth = {
        email: this.refs.loginusername.value,
        password: this.refs.loginpassword.value,
        role: "vendor"
      }
      if ($("#login").valid()) {
        // document.getElementById("logInBtn").value = 'Please Wait...';
        document.getElementById("logInBtn").value =
          this.setState({ btnLoading: true });
        axios.post('/api/auth/post/login', auth)
          .then((response) => {
            console.log("response login",response);
            if (response.data) {
              this.setState({ btnLoading: false });
              var userDetails = {
                firstName: response.data.userDetails.firstName,
                lastName: response.data.userDetails.lastName,
                email: response.data.userDetails.email,
                phone: response.data.userDetails.phone,
                // companyID : parseInt(response.data.userDetails.companyID),
                company_ID : response.data.userDetails.company_id,
                companyID : parseInt(response.data.userDetails.companyID),
                companyName : response.data.userDetails.companyName,
                pincode: response.data.userDetails.pincode,
                user_id: response.data.userDetails.user_id,
                roles: response.data.userDetails.roles,
                token: response.data.userDetails.token,
              }
              document.getElementById("logInBtn").value = 'Sign In';
              // localStorage.setItem("token", response.data.token);
              localStorage.setItem("user_ID", response.data.ID);
              localStorage.setItem("roles", response.data.roles);
              localStorage.setItem("companyID", response.data.userDetails.companyID);
              localStorage.setItem("companyName", response.data.userDetails.companyName);
              localStorage.setItem('userDetails', JSON.stringify(userDetails));
              // localStorage.setItem('corporateUrl', 'http://qafivebeescorporate.iassureit.com');
              // localStorage.setItem('vendorUrl', 'http://qafivebeesvendor.iassureit.com');
  
              this.setState({
                loggedIn: true
              }, () => {
                this.props.history.push('/dashboard')
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
  showSignPass(){
      $('.showPwd').toggleClass('showPwd1');
      $('.hidePwd').toggleClass('hidePwd1');
      return $('.inputTextPass').attr('type', 'text');
  }
  hideSignPass(){
      $('.showPwd').toggleClass('showPwd1');
      $('.hidePwd').toggleClass('hidePwd1');
      return $('.inputTextPass').attr('type', 'password');
  }
  render(){
    // var winHeight = window.innerHeight;
    // var divHeight = winHeight/4.5+'px';
    //   console.log("-------------------------------",this.state.loggedIn)
    
    if(this.state.loggedIn===true){
      return <div></div>
    }

    var windowWidth = $(window).width();
    // console.log('ww',windowWidth);
      if(windowWidth>=320&&windowWidth<=992){
        var backImage = "visible-xs col-xs-12 visible-sm col-sm-12 noBackImage"
        }else{
        var backImage = "signUpBackground hidden-xs hidden-sm"
      }


    var winHeight = window.innerHeight;
    var divHeight = 490 +'px';
      console.log("-------------------------------",this.state.loggedIn)
    
   



    return(
      <div className={backImage} style={{"height": winHeight}}> 
{/*     <button className="btn btn-primary" onClick={this.openModal.bind(this)}>Open Modal</button>
*/}     

      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper loginbg">
        <div className="col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-12 signupPadding loginFormWrap ">
          <div className="divLoginInWrap">

           {/* <div className="col-lg-12 text-center marbtm10 ">
              <img src="images/furniture-logo1.jpg" height="70px"/>
              </div>*/}

              <form id="login" onSubmit={this.userlogin.bind(this)}>
              <br/>
              <div className="col-lg-4 col-lg-offset-4 ">
             {/* <h3> hhhh</h3>*/}
              {<h3 className="signInNameTitle "><span className="bordbt">Sign In</span></h3>
              }</div>
              <div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mt25">
                  <label>Email ID</label><label className="astricsign">*</label>
                  <input type="email" className="form-control" onChange={this.handleChange} ref="loginusername" id="loginusername" name="loginusername" placeholder="Email ID" required />
              </div>
              <div className="textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mb25">
                <label>Password</label><label className="astricsign">*</label>
                <input type="password" className="form-control" ref="loginpassword" name="loginpassword" id="loginpassword" placeholder="Password" required />
                <div className="showHideSignDiv">
                  <i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
                  <i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
                </div>
              </div>

              {/*<div className="col-lg-12 col-md-12 col-sm-12 ">
                <div className="inputContent">
                  <span className="blocking-span noIb">
                    <input type="email" className="col-lg-12 col-md-1col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox" onChange={this.handleChange} ref="loginusername" id="loginusername" name="loginusername" placeholder="" required/>
                    <span className="floating-label"><i className="fa fa-envelope signupIconFont" aria-hidden="true"/>Email ID</span>   
                  </span>
                </div>
              </div>*/}

               

              {/*<div className="col-lg-12 col-md-12 col-sm-12 marBtm30">
                <div className="form-group form-group1 fltlft input-group col-lg-12 col-md-12 col-sm-12 inputContent ">     
                  <span className="blocking-span noIb">
                    <input type="password" className="form-control border3 pass oesSignUpForm confirmbtm inputTextPass tmsLoginTextBox" ref="loginpassword" name="loginpassword" required/>
                    <span className="floating-label1 lbfloatpass"><i className="fa fa-lock lockIcon" aria-hidden="true"></i> Password</span>                 
                  </span>
               
                <div className="showHideSignDiv">
                  <i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
                  <i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
                </div> 
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>*/}
             {/* <div className="col-lg-12 col-md-12 col-sm-12">
                <input id="logInBtn" type="submit" className="col-lg-12 col-md-12 col-xs-12 col-sm-12 UMloginbutton hvr-sweep-to-right" value="Sign In"/>
              </div>*/}
              <div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                    <input id="logInBtn" type="submit" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 UMloginbutton btn " value="Sign In" />
                  </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
              {/* <div className="col-lg-6 col-md-6 col-sm-6 ">
                  <Link to='/signup' className="UMGreyy UMGreyy_l UMcreateacc col-lg-12 col-md-12 col-xs-12 col-sm-12"> Sign Up</Link>
                </div>*/}
                <div className="col-lg-6 col-md-6 col-sm-6 col-lg-offset-3 customFl">
                  <Link to='/forgot-pwd' className="UMGreyy UMGreyy_l UMcreateacc forgot col-lg-12 col-md-12 col-xs-12 col-sm-12">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 pdcls">
                <div className="col-lg-12 col-md-12 col-sm-12 ">
                  <Link to='/verify-account' className="UMGreyy UMGreyy_l forgotpass forgot emailverify col-lg-12 col-md-12 col-xs-12 col-sm-12">
                    OTP Verification
                  </Link>
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
export default Login;