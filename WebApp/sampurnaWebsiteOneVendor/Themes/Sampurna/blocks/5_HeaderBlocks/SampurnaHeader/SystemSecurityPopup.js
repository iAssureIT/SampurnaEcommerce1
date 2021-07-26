import React     from 'react';
import axios     from 'axios';
import {connect} from 'react-redux';
import dynamic   from 'next/dynamic'
import getConfig from 'next/config';
import Head      from 'next/head';
import Router    from 'next/router';
import Link      from 'next/link';
import swal      from 'sweetalert';
import Login          from '../../../../../systemSecurity/Login.js';
import SignUp         from '../../../../../systemSecurity/SignUp.js';
import ForgotPassword from '../../../../../systemSecurity/ForgotPassword';
import ConfirmOtp     from '../../../../../systemSecurity/ConfirmOtp.js';
import ResetPassword  from '../../../../../systemSecurity/ResetPassword.js';
import SignUpOTP      from '../../../../../systemSecurity/SignUpOTP.js';
import Websitelogo    from './Websitelogo.js';
import {getForm,updateForm} from '../../../../../redux/actions';

import Style                  from './location.module.css';

const { publicRuntimeConfig } = getConfig();

class SystemSecurityPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData:{},
            Blocks:[],
            blocks:"",
            ListOfBlocks : "",
            pageHead : {
                pageAuthor      : "",
                pageDescription : "",
                pageWords       : [""],
            },
            userDetails : [],
            preferencedata : [],
            loggedIn: false,
            userId: '',
            currentUrl:''
        }; 
    }
    componentDidMount(){        
        let defaultUrl=window.location.href.replace(/.*\/\/[^\/]*/, '');

        const userDetails  =  JSON.parse(localStorage.getItem('userDetails'));
        
        if(userDetails && userDetails.user_id){
            this.setState({
                currentUrl:defaultUrl,
                loggedIn    : true,
                userDetails : userDetails,
                userId      : userDetails.user_id,
                authService : userDetails.authService
            },()=>{
                this.getUserData();
                // console.log("authService==",this.state.authService);
                //  console.log("61",this.state.currentUrl)
            })
        }
        
    }
    getUserData() {
        if(this.state.userId){ 
        axios.get('/api/users/get/id/' +this.state.userId)
          .then((res) => {
            if(res.data){
            //   console.log("user response===",res.data);  
              this.setState({
                userData : res.data.profile,
                userName : res.data.profile.firstname,
                firstname: res.data.profile.firstname.substring(0, 1),
                lastname : res.data.profile.lastname.substring(0, 1)
              },()=>{
                // console.log("userData==============",this.state.userData);
              })
            }else{
              this.setState({
                userData  : "",
                firstname : "",
                lastname  : ""
              },()=>{
    
              })
            } 
          })
          .catch((error) => {
            console.log("error fetch user data = ", error);
          });
        }
    }
    
    CloseModal() {
        // $('#loginFormModal').hide(1000);
        this.props.updateFormValue("login");
    }
    
   render() {
    return (
        <div id="loginFormModal" className={"modal in loginMainWrapperr pb-4 " +Style.loginBGImg}  data-keyboard="false" >
                    <div className="modal-dialog modal-xl">                                        
                        <div className={"modal-content loginModalContent  loginBackImageHeight " +Style.signinBG} style={{'background': '#fff'}}>                            
                            <div className="modal-body LoginModalBody">  
                                <button type="button" className="close"  data-dismiss="modal" onClick={this.CloseModal.bind(this)}>&times;</button>  
                                <div className="row"> 
                                    <div className="col-lg-7 d-none d-lg-block NoPadding pb-4 modalImgBlock">
                                        <div className="col-12 mx-auto">
                                        <div className={"modal-title col-12 pt-5 modalheadingcont pb-2 text-center underline " +Style.f14B }><img className={" "+Style.modalLogoWrapper} src="/images/eCommerce/TrollyLogo.png" height="120px" alt="T&C MODAL-LOGO"/></div>
                                        </div>
                                        {/*<div className="col-10 NoPadding offset-1 mt-3">
                                            <h6 className="mb-4 ">Benefits of taking membership...</h6>
                                            <div className="loginUl">
                                                <ul className="loginLine pull-left">
                                                    <li>Instruction 1 - The email is sent instantly but may be delayed by your firewall setup, so if you haven't received it after 5-10 minutes, refresh your email application and check your spam and junk mail folders</li>
                                                    <li>Instruction 2 - You must enter your 'Area of Practice' on the Continuing Education Center to finish your account activation and access the site as a registered user (select Physician, Nurse, etc.)</li>
                                                    <li>Instruction 3 - After logging in, return to the course page where you would like to register  if you are not automatically redirected there</li>
                                                    <li>Instruction 4 - The email is sent instantly but may be delayed by your firewall setup, so if you haven't received it after 5-10 minutes, refresh your email application and check your spam and junk mail folders</li>                                                    
                                                </ul>
                                            </div>
                                        </div>*/}
                                    </div>   
                                    <div className="col-lg-5 col-12 pl-lg-0 pt-2 pb50 modalForm">                                                      
                                        {this.props.formToShow === "login" ?
                                            <div className="col-12 NoPadding loginForm mobileViewNoPadding">
                                                <Login />
                                            </div>  
                                        : null
                                        }  
                                        {this.props.formToShow === "signUp" ?
                                            <div className="col-12 signupForm ">
                                                <SignUp />
                                            </div>  
                                        : null
                                        } 
                                        {this.props.formToShow === "signupotp" ?
                                            <div className="col-12 NoPadding loginForm mobileViewNoPadding">
                                                <SignUpOTP />
                                            </div>  
                                        : null
                                        } 
                                        {this.props.formToShow === "forgotPassword" ?
                                            <div className="col-12 loginForm NoPadding mobileViewNoPadding">
                                                <ForgotPassword />
                                            </div>  
                                        : null
                                        }  
                                        {this.props.formToShow === "confirmOtp" ?
                                            <div className="col-12 loginForm NoPadding mobileViewNoPadding">
                                                <ConfirmOtp />
                                            </div>  
                                        : null
                                        } 
                                        {this.props.formToShow === "resetPassword" ?
                                            <div className="col-12 NoPadding loginForm mobileViewNoPadding">
                                                <ResetPassword />
                                            </div>  
                                        : null
                                        }  
                                    </div>  
                                </div>                                                            
                            </div>
                        </div>
                    </div>
                </div>  
    );
  }
}
  
const mapStateToProps = state => (
    //console.log("mapStateToProps master page",state),
    {formToShow: state.data.formToShow}
);

const mapDispatchToProps = {
    // getBlockData: getBlockData,
    updateFormValue: updateForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemSecurityPopup);