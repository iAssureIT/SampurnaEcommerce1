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
import {getForm,updateForm,updateCartCount}  from '../../../../../redux/actions';
import Style                  from './Header.module.css';
import SystemSecurityPopup   from './SystemSecurityPopup.js';

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
    
    signOut(event) {
        event.preventDefault();
        var token = localStorage.removeItem("userDetails");
        // Router.push('/');
        window.location.href = '/';
        if (token !== null) {
          this.setState({
            loggedIn: false
          })
        }
        // swal({text:'Thank You. You have been logged out Successfully!'}).then(function(){
        //     Router.push('/');
        //     window.location.reload();
        // });
    }
  
   render() {
    return (
        <div className="row  h-100">  
                {
                    this.state.loggedIn 
                    ? 
                        <div className={"dropdown h-100 " + Style.myAccDropdown}>
                            <div className={"col-12 h-100 "+ Style.signDivWrapper}>  
                                {
                                    this.state.authService === "guest" && this.state.userId
                                    ?
                                    <div className={"row "}>
                                        <div  className="col-12 offset-3">
                                            <span className={Style.userName}>
                                                Hello Guest!
                                            </span>
                                        </div>
                                        <span className={"col-12 offset-3 " + Style.myAccountTitle}>
                                            My Account 
                                            {/* <i className="fa fa-angle-down"></i> */}
                                        </span>
                                    </div>
                                    :
                                    <div className="row">
                                        <div  className="col-12">
                                            <span className={Style.userName}>
                                                {"Hello " + this.state.userName}
                                            </span>
                                        </div>
                                        <div className={"col-12 " + Style.myAccountTitle}>
                                            My Account 
                                            {/* <i className="fa fa-angle-down"></i> */}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={"dropdown-menu mt-5 " + Style.listDropDownMenu}>   
                                {this.state.authService!=="guest"
                                    ?    
                                    <div className="col-12">                                 
                                        <div className="row">                                 
                                            <div className="col-12 ">                            
                                                <div className="row">
                                                    <div className={"col-3 " + Style.userInfoWrapper}>
                                                        <div className="row">
                                                            <div className={Style.userInfoCircle}>                                                    
                                                                <div className={Style.userInfo}>
                                                                    {this.state.firstname}
                                                                    {this.state.lastname}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-9">
                                                        <div className="row">  
                                                            <div className={Style.userDetalisWrapper}> 
                                                                <div className={Style.userFullName}>
                                                                    {
                                                                        this.state.userData 
                                                                            ? 
                                                                                this.state.userData.fullName 
                                                                            :
                                                                                null
                                                                    }
                                                                </div>
                                                                <div className={Style.userEmail}>
                                                                    {
                                                                        this.state.userData 
                                                                            ? 
                                                                                this.state.userData.email 
                                                                            : 
                                                                                null
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                            
                                        <div className="row">  
                                            <div className={"col-12 " + Style.userDetailsList} onClick={()=>{(this.state.currentUrl==="/my-account#v-pills-settings-tab"||this.state.currentUrl==="/my-account#v-pills-settings1-tab"||this.state.currentUrl==="/my-account#v-pills-settings3-tab"||this.state.currentUrl==="/my-account")? window.location.reload() :null }}>
                                                <div className="row">
                                                    <Link href="/my-account#v-pills-settings-tab">
                                                        <div className={Style.userDetailsListTitle}>My Orders</div>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className={"col-12 " + Style.userDetailsList} onClick={()=>{(this.state.currentUrl==="/my-account#v-pills-settings-tab"||this.state.currentUrl==="/my-account#v-pills-settings1-tab"||this.state.currentUrl==="/my-account#v-pills-settings3-tab"||this.state.currentUrl==="/my-account")? window.location.reload() :null }}>
                                                <div className="row">
                                                    <Link href="/my-account#v-pills-settings1-tab">
                                                        <div className={Style.userDetailsListTitle}>My Wishlist</div>
                                                    </Link>
                                                </div>
                                            </div>   
                                                {
                                                    this.state.authService === ""  &&                            
                                                    <div className={"col-12 " + Style.userDetailsList} onClick={()=>{(this.state.currentUrl==="/my-account#v-pills-settings-tab"||this.state.currentUrl==="/my-account#v-pills-settings1-tab"||this.state.currentUrl==="/my-account#v-pills-settings3-tab"||this.state.currentUrl==="/my-account")? window.location.reload() :null }}>
                                                        <div className="row">
                                                            <Link href="/my-account">
                                                                <div className={Style.userDetailsListTitle}>My Profile</div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                }
                                            <div className={"col-12 " + Style.userDetailsList} onClick={()=>{(this.state.currentUrl==="/my-account#v-pills-settings-tab"||this.state.currentUrl==="/my-account#v-pills-settings1-tab"||this.state.currentUrl==="/my-account#v-pills-settings3-tab"||this.state.currentUrl==="/my-account")? window.location.reload() :null }}>
                                                <div className="row">
                                                    <Link href="/my-account#v-pills-settings3-tab">
                                                        <div className={Style.userDetailsListTitle}>My Credits</div>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className={"col-12 " + Style.userDetailsList1} onClick={this.signOut.bind(this)}>
                                                <div className="row">
                                                    <Link href="/">
                                                        <div className={Style.userDetailsListTitle1}>Sign Out</div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        
                                     :
                                        <div className={"col-12 " + Style.listDropDownMenu2}>
                                            <div className="row"> 
                                                <div className={"col-12 "+  Style.userDetailsList2} onClick={()=>{(this.state.currentUrl==="/my-account#v-pills-settings-tab"||this.state.currentUrl==="/my-account#v-pills-settings1-tab"||this.state.currentUrl==="/my-account#v-pills-settings3-tab"||this.state.currentUrl==="/my-account")? window.location.reload() :null }}>
                                                    <div className="row"> 
                                                        <Link href="/my-account#v-pills-settings-tab">
                                                            <div className={Style.userDetailsListTitle}>My Orders</div>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className={"col-12 "+  Style.userDetailsList1} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" area-hidden ="true">
                                                   <div className="row"> 
                                                       <div className={Style.userDetailsListTitle1}>
                                                            Sign In
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                   : 
                        <div className={"col-8 col-lg-10 offset-lg-4 offset-6 " + Style.signInWrapper}>
                            <div className="row">
                                <a href="" data-toggle="modal" data-target="#loginFormModal" 
                                   data-backdrop="true" id="loginModal" area-hidden ="true"> 
                                    <span className={Style.signInTitle}>
                                        Sign in
                                    </span>
                                    <span className={Style.signInIcon}>
                                        <img src="/images/eCommerce/userIcon.svg" className={Style.userIcon}/>
                                    </span>
                                </a>  
                            </div>        
                        </div>
                }
                
                < SystemSecurityPopup />
                
            
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
    updateCartCount  : updateCartCount,
    updateFormValue: updateForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(header);