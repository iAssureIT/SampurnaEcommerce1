import React, { Component } from 'react';
import { Link} from 'react-router-dom';
// import {browserHistory} from 'react-router-dom';
import { Redirect } from 'react-router';
import swal from 'sweetalert';
import $ from "jquery";

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
    
  }
  userlogin(event){
    event.preventDefault();
    console.log("in login mode",this.state.auth);
        var auth= {
          email       : this.refs.loginusername.value,
          password    : this.refs.loginpassword.value,
          role: "ba"
        }

        console.log("auth value",auth);

    axios.post('/api/auth/post/login',auth)
      .then((response)=> {
        console.log("-------userData------>>",response);
        // this.setState({
        //   token : response.data.token
        // });
        console.log(response.data.roles.indexOf("ba"));
        if (response.data.roles.indexOf("ba") != -1) {
          
          localStorage.setItem("token",response.data.token);
          localStorage.setItem("admin_ID",response.data.user_ID);
          localStorage.setItem("user_ID",response.data.user_ID);
          localStorage.setItem("userName",response.data.userFirstName);
          
          this.props.history.push("/dashboard");
          window.location.reload();
          // direct.setState({loggedIn:response.data.token})
          if(localStorage==null){
            swal("Invalid Email or Password","Please Enter valid email and password");
          }else{
            this.setState({
                loggedIn  :   true
            })
          }
        }else{
          swal("Invalid Email or Password","Please Enter valid email and password"); 
        }
      })
      .catch(function (error) {
          console.log(error);
        if(localStorage!==null){
          swal("Invalid Email or Password","Please Enter valid email and password");
        }
      });
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
    
    // if(this.state.loggedIn===true){
    //   return <div></div>
    // }

    // var windowWidth = $(window).width();
    // // console.log('ww',windowWidth);
    //   if(windowWidth>=320&&windowWidth<=992){
    //     var backImage = "visible-xs col-xs-12 visible-sm col-sm-12 noBackImage"
    //     }else{
    //     var backImage = "signUpBackground hidden-xs hidden-sm"
    //   }


    // var winHeight = window.innerHeight;
    // var divHeight = 490 +'px';
    //   console.log("-------------------------------",this.state.loggedIn)
    
   

    var projectName = process.env.REACT_APP_PROJECT_NAME ? process.env.REACT_APP_PROJECT_NAME : '';
    var customClass = 'defaultBgImg';
    if(projectName !== ''){
      customClass = projectName+'BgImg';
    }


    return(  
      <div style={{'height': window.innerHeight+'px', 'width': window.innerWidth+'px'}} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper "+customClass}>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-12 col-xs-12 formShadow">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-xs-12 padding0">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
                <h3>Sign In</h3>
              </div>
              <form id="login" onSubmit={this.userlogin.bind(this)}>
                <div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mt25">
                     <label className="fontWeight900">Email ID</label><label className="astricsign">*</label>
                      <input type="email" className="form-control" onChange={this.handleChange} ref="loginusername" id="loginusername" name="loginusername" placeholder="Email ID" required/>
                </div>
               
                <div className="textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mb25">
                  <label className="fontWeight900">Password</label><label className="astricsign">*</label>
                  <input type="password" className="form-control inputTextPass" ref="loginpassword" name="loginpassword" placeholder="Password"  required/>
                  <div className="showHideSignDiv">
                    <i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
                    <i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
                  </div> 
                </div>
               
                <div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                  <input id="logInBtn" type="submit" className="font12 col-lg-12 col-md-12 col-xs-12 col-sm-12 btn loginBtn" value="Sign in"/>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                 {/*<div className="col-lg-6 col-md-6 col-sm-6 ">
                    <Link to='/signup' className="UMGreyy UMGreyy_l UMcreateacc col-lg-12 col-md-12 col-xs-12 col-sm-12"> Sign Up</Link>
                  </div>*/}

                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt30 mb25">
                  <div className="row">
                    <div className="textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                      <div className="row loginforgotpass">
                        <a href='/forgot-pwd' className="">Forgot Password?</a>
                      </div>
                    </div>
                    {
                      process.env.REACT_APP_USERID ?
                      <div className="col-lg-12 sampleTable">
                        <div className="table-responsive col-lg-12 col-md-12">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{"background":"#367EA8","color":"#fff","textAlign":'center'}}>
                                <th>Email</th>
                                <th>Password</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{process.env.REACT_APP_USERID}</td>
                                <td>{process.env.REACT_APP_PWD}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      :
                        null
                    }

                    

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