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

// import {getBlockData} from '../../../../../redux/actions/counterActions';
import {getForm,updateForm} from '../../../../../redux/actions';

import Style                  from './location.module.css';


const { publicRuntimeConfig } = getConfig();

class header extends React.Component {
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
                 console.log("61",this.state.currentUrl)
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
    
    async signOut(event) {
        event.preventDefault();
        var token = localStorage.removeItem("userDetails");
        swal("Thank You.","You have been logged out Successfully!");
        if (token !== null) {
          this.setState({
            loggedIn: false
          })
        }
        Router.push('/');
        window.location.reload();
    
    }
    
   render() {
    return (
        <div className="col-8 col-sm-6 NoPadding">  
            <div className="col-12 loginViewWrapper ">
                <div className="col-12 col-lg-12 row">
                {this.state.loggedIn ? 
                    <li className="dropdown myaccDropdown">
                        <span className="col-12 NoPadding ">
                            <div className="faIcon faLoginIcon col-12 mt-2 NoPadding"> 
                                <div className="mtm10 my-auto">  
                                    {this.state.authService === "guest" && this.state.userId ?
                                        <span className="my-auto">
                                            <span style={{float: "right"}} className="faIcon col-12 NoPadding pb-1"><span className="userName ">Hello Guest!</span></span>
                                            <span className="userEmail">My Account <i className="fa fa-angle-down"></i></span>
                                        </span>
                                    :
                                    <span className="my-auto">
                                        <span style={{float: "right"}} className="faIcon col-12 NoPadding pb-1"><span className="userName ">Hello&nbsp; {this.state.userName}!</span></span>
                                        <span className="userEmail">My Account <i className="fa fa-angle-down"></i></span>
                                    </span>
                                    }
                                </div>
                            </div>
                        </span>
                        <ul className="col-3 dropdown-menu mt-5 list-DropDownMenu">   
                        {this.state.authService!=="guest"?    
                            <div className="col-12 NoPadding">                                 
                                <li className="col-12 NoPadding">                            
                                    <div className="row">
                                        <div className="col-2">
                                        <div className="shortnamebk">
                                            <div className="">                                                    
                                                <div className="userinfo">{this.state.firstname}{this.state.lastname}</div>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="col-10">
                                        <div className="col-12">
                                            <div className="userinfotext"><span >{this.state.userData ? this.state.userData.fullName : null}</span></div>
                                        </div>
                                        <div className="col-12">
                                            <div className="useremail"><span>{this.state.userData ? this.state.userData.email : null}</span></div>
                                        </div>
                                        </div>
                                    </div>                            
                                </li>   
                                
                                <li className="col-12 NOpadding myAccMenu myAccMenuATag" onClick={()=>{this.state.currentUrl==="/"? null : window.location.reload()}}><Link href="/my-account#v-pills-settings-tab"><a>My Orders</a></Link></li>
                                <li className="col-12 NOpadding myAccMenu myAccMenuATag" onClick={()=>{this.state.currentUrl==="/"? null : window.location.reload()}}><Link href="/my-account#v-pills-settings1-tab"><a>My Wishlist</a></Link></li>                               
                                <li className="col-12 NOpadding myAccMenu myAccMenuATag" onClick={()=>{this.state.currentUrl==="/"? null : window.location.reload()}}><Link href="/my-account"><a>My Profile</a></Link></li>
                                <li className="col-12 NOpadding myAccMenu myAccMenuATag"onClick={()=>{this.state.currentUrl==="/"? null : window.location.reload()}}><Link href="/my-account#v-pills-settings3-tab"><a>My Credits</a></Link></li>
                                <li className="col-12 NOpadding myAccMenu globalSignoutBtn signoutBtn outBTN"  onClick={this.signOut.bind(this)}><Link href="/"><a style={{color:"#fff"}}>Sign Out</a></Link></li>
                            </div>
                        :
                            <div className="col-12 NoPaddind">
                                <li className="col-12 NOpadding myAccMenuGuest text-center"><Link href="/my-account#v-pills-settings-tab"><a>My Orders</a></Link></li>
                                <li className="col-12 NOpadding myAccMenu globalSignoutBtn signoutBtn outBTN" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" area-hidden ="true">Sign In</li>
                            </div>
                        }
                            </ul>
                    </li>
                    : 
                    <span className=" col-12 NoPadding signInBlock" >
                        <a href="" className="faIcon faLoginIcon  col-12 NoPadding pull-right" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" area-hidden ="true"> 
                            <span className="col-12 loginView">Sign in &nbsp;
                                <img src="/images/eCommerce/userIcon.png" className="userIconImg"></img>
                            </span>
                        </a>          
                    </span> 
                }
                </div>
                <div id="loginFormModal" className={"modal in " +Style.loginBGImg}  data-keyboard="false" >
                    <div className="modal-dialog modal-xl">                                        
                        <div className={"modal-content loginModalContent  loginBackImageHeight " +Style.signinBG} style={{'background': '#fff'}}>                            
                            <div className="modal-body LoginModalBody">  
                                <button type="button" className="close"  data-dismiss="modal" onClick={this.CloseModal.bind(this)}>&times;</button>  
                                <div className="row"> 
                                    <div className="col-7 pb-4 modalImgBlock">
                                        <div className="col-6 offset-3 mt-5">
                                            <Websitelogo />                                            
                                        </div>
                                        <div className="col-10 NoPadding offset-1 mt-3">
                                            <h6 className="mb-4 ">Benefits of taking membership...</h6>
                                            <div className="loginUl">
                                                <ul className="loginLine pull-left">
                                                    <li>Instruction 1 - The email is sent instantly but may be delayed by your firewall setup, so if you haven't received it after 5-10 minutes, refresh your email application and check your spam and junk mail folders</li>
                                                    <li>Instruction 2 - You must enter your 'Area of Practice' on the Continuing Education Center to finish your account activation and access the site as a registered user (select Physician, Nurse, etc.)</li>
                                                    <li>Instruction 3 - After logging in, return to the course page where you would like to register  if you are not automatically redirected there</li>
                                                    <li>Instruction 4 - The email is sent instantly but may be delayed by your firewall setup, so if you haven't received it after 5-10 minutes, refresh your email application and check your spam and junk mail folders</li>                                                    
                                                </ul>
                                            </div>
                                        </div>
                                    </div>   
                                    <div className="col-5 pt-2 modalForm">                                                      
                                        {this.props.formToShow === "login" ?
                                            <div className="col-12 NoPadding loginForm mobileViewNoPadding">
                                                <Login />
                                            </div>  
                                        : null
                                        }  
                                        {this.props.formToShow === "signUp" ?
                                            <div className="col-12 signupForm mobileViewNoPadding">
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

export default connect(mapStateToProps, mapDispatchToProps)(header);