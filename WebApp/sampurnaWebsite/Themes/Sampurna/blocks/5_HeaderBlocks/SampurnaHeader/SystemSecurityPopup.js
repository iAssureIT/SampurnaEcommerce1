import React            from 'react';
import axios            from 'axios';
import {connect}        from 'react-redux';
import dynamic          from 'next/dynamic'
import getConfig        from 'next/config';
import Head             from 'next/head';
import Router           from 'next/router';
import Link             from 'next/link';
import swal             from 'sweetalert';
import {getForm,updateForm} from '../../../../../redux/actions';


import Login            from '../../../../../systemSecurity/Login.js';
import SignUp           from '../../../../../systemSecurity/SignUp.js';
import ForgotPassword   from '../../../../../systemSecurity/ForgotPassword';
import ConfirmOtp       from '../../../../../systemSecurity/ConfirmOtp.js';
import ResetPassword    from '../../../../../systemSecurity/ResetPassword.js';
import SignUpOTP        from '../../../../../systemSecurity/SignUpOTP.js';
import Websitelogo      from './Websitelogo.js';


import Style                  from './location.module.css';


const { publicRuntimeConfig } = getConfig();


class SystemSecurityPopup extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            userDetails         : [],
            preferencedata      : [],
            loggedIn            : false,
            userId              : '',
            currentUrl          : ''
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
            })
        }
        
    }

    getUserData() {
        if(this.state.userId){
            axios.get('/api/users/get/id/' +this.state.userId)
                .then((res) => {
                    if(res.data){
                        this.setState({
                            userData : res.data.profile,
                            userName : res.data.profile.firstname,
                            firstname: res.data.profile.firstname.substring(0, 1),
                            lastname : res.data.profile.lastname.substring(0, 1)
                        },()=>{
            
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
    
    CloseModal(){
        this.props.updateFormValue("login");
    }
    
    render(){
        return(
            <section id="loginFormModal" className={"col-12 modal fade "+Style.systemSecurityPopupWrapper}  role="dialog" data-backdrop="static" data-keyboard="false">
                <div className={"col-12 modal-dialog modal-xl"}>
                    <div className={"col-12 col-xl-10 offset-xl-1 modal-content "+Style.systemSecurityPopupModalContent}>
                        {/* <div className="modal-header col-12 NoPadding">
                            <button type="button" className="close pt-0 closeModal pull-right" data-dismiss="modal">&times;</button>
                        </div> */}
                        <div className={"col-12 modal-body "+Style.systemSecurityPopupModalBody}>
                                <div className="row">
                                    <div className={this.props.formToShow === "signUp"
                                                    ? "col-12 col-lg-4 col-xl-4 "+Style.systemSecurityPopupLeftImageWrapper
                                                    : "col-12 col-lg-6 col-xl-7 "+Style.systemSecurityPopupLeftImageWrapper
                                                   }
                                        style={this.props.formToShow === "signUp"
                                                ? {backgroundSize: "200% 100%"}
                                                : {backgroundSize: "100% 100%"}
                                              }
                                    >
                                        <img className={Style.systemSecurityPopupLeftImageLogoWrapper} src="/images/eCommerce/TrollyLogo.png" alt=""/>
                                    </div>
                                    <div className={this.props.formToShow === "signUp"
                                                    ? "col-12 col-lg-8 col-xl-8 "+Style.systemSecurityPopupRightFormWrapper
                                                    : "col-12 col-lg-6 col-xl-5 "+Style.systemSecurityPopupRightFormWrapper
                                                    }>
                                    {/* <button type="button" className={"close mt-3 mr-5 "+Style.systemSecurityPopupCloseButton} data-dismiss="modal" onClick={this.CloseModal.bind(this)}>&times;</button> */}
                                    <button type="button" className={"close pt-0 closeModal pull-right "+Style.systemSecurityPopupCloseButton} 
                                        onClick={this.CloseModal.bind(this)} data-dismiss="modal">&times;</button>    
                                        {
                                            this.props.formToShow === "login"
                                            ?
                                                <div className="col-12">
                                                    <Login />
                                                </div>
                                            :
                                                null
                                        }
                                        {
                                            this.props.formToShow === "signUp"
                                            ?
                                                <div className="col-10 mx-auto">
                                                    <SignUp />
                                                </div>
                                            :
                                                null
                                        }
                                        {
                                            this.props.formToShow === "signupotp"
                                            ?
                                                <div className="col-12">
                                                    <SignUpOTP />
                                                </div>
                                            :
                                                null
                                        }
                                        {
                                            this.props.formToShow === "forgotPassword"
                                            ?
                                                <div className="col-12">
                                                    <ForgotPassword />
                                                </div>
                                            :
                                                null
                                        }
                                        {
                                            this.props.formToShow === "confirmOtp"
                                            ?
                                                <div className="col-12">
                                                    <ConfirmOtp />
                                                </div>
                                            :
                                                null
                                        }
                                        {
                                            this.props.formToShow === "resetPassword"
                                            ?
                                                <div className="col-12">
                                                    <ResetPassword />
                                                </div>
                                            :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => (
    {formToShow: state.data.formToShow}
);

const mapDispatchToProps = {
    updateFormValue: updateForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemSecurityPopup);