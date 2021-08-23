import React, { Component }		from 'react';
import $     					from 'jquery';
import axios 					from 'axios';
import swal  					from 'sweetalert';
import Image 					from 'next/image';
import { connect }              from 'react-redux';
import { bindActionCreators }   from 'redux';
import {getForm,updateForm}     from '../redux/actions';
import S                        from './systemSecurity.module.css';
class ForgotPassword extends Component{

	constructor(props){
        super(props);
        this.state = {
            btnLoading : false,
            bannerData : {
                title			: "MY SHOPPING CART",
                breadcrumb		: 'My Shopping Cart',
                backgroungImage	: '/images/cartBanner.png',
            },
            showMessage	: false,
            fields		: {},
            errors		: {}
        }
    }

	componentDidMount(){
        // this.validateForm();
    }

    validateForm(){
        let fields 		= this.state.fields;
        let errors 		= {};
        let formIsValid = true;
    
        if (!fields["username"]){
			formIsValid 		= false;
			errors["username"] 	= "Please enter your email or mobile number.";
        }
    
        this.setState({
			errors: errors
        });
        return formIsValid;
	}

    handleChange(e){
        let fields 				= this.state.fields;
        fields[e.target.name] 	= e.target.value;
        this.setState({
			fields
        });
	}    
    
    sendOTP(evvalidateForment){
        event.preventDefault();
        var username = this.refs.username.value;
		console.log("formValues==",username);
		if(this.validateForm()){
			axios.patch('/api/auth/patch/set_send_otp/' + username) 
                .then((forgotPassResponse) => {
                    // console.log("forgotPassResponse==",forgotPassResponse);
                    if(forgotPassResponse.data.message){
                        var userDetails = {
							userId : forgotPassResponse.data.ID,
						}
                        swal(forgotPassResponse.data.message);
                        this.props.updateFormValue("confirmOtp");
                        localStorage.setItem('userDetails', JSON.stringify(userDetails));
                        
                    }                  
                })
                .catch((error) => {
                    console.log("error===",error);
                })
            }
    }

    openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");	
	}

	render(){
        return(
            <div className="col-12 mobileViewNoPadding">
                <div className={"col-12 "+S.signTitleWrapper}>
                    <span className={S.signTitle}>FORGOT PASSWORD</span>
                </div>
                {/* <div className="col-12 mt-5">
                </div> */}
                {/* <div className="col-12 innloginwrap1">
                    <h4 className="blueText signinText">Forgot Password</h4>
                </div> */}
                {
                    this.state.showMessage === false
					?
                        <div className="col-12 NoPadding">
                            <p className="col-12 mt-5 infoText">Please enter your registered email address or Mobile Number below to receive an OTP.</p>
                            <form id="resetPass" className="mt-5">
                                <div className="col-12 textAlignLeft frmhgt">
                                    {/* <label className="formLabel ">Email ID / Mobile Number</label><label className="astricsign">*</label> */}
                                    <input className="col-12 form-control" placeholder="Email ID / Mobile Number" ref="username" name="username" type="text" onChange={this.handleChange.bind(this)}/>
                                    <div id="username"></div>
                                    <div className="errorMsg">{this.state.errors.username}</div>
                                </div>
                                {
                                    this.state.btnLoading
									?
                                        <div className="col-12 col-md-10 offset-md-1 NOpaddingRight btn globaleCommBtn has-spinner active">
                                            Processing...
                                            <span className="spinner"><i className="fa fa-refresh fa-spin"></i></span>
                                        </div>
									:
                                        <div className="col-12 forgotPassBtn">
                                            <button id="sendlink" type="button" onClick={this.sendOTP.bind(this)} className="col-12 btn loginBtn otpBtns mt-4 waves-effect">Send OTP</button>
                                        </div>
                                }
                                <div className="col-12 mt-2 mb-3">
                                    <div className=" loginforgotpass textAlignCenter">
                                        <a href='/' className="forgotText" onClick={this.openSignInModal.bind(this)}>Sign In</a>
                                    </div>
                                </div>
                            </form>
                        </div>
					:
                        <div>
                            <p className="col-12 mt25">We have sent a reset password link to your email account.</p>
                            <div className="col-12 mt10">
                                <div className="loginforgotpass textAlignCenter">
                                    <a href='/login' className="forgotText">Sign In</a>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return{
		formToShow : state.formToShow,
	}
}
  
const mapDispachToProps = (dispatch) => {
	return bindActionCreators({formToShow :getForm, updateFormValue: updateForm}, dispatch)
}

export default connect(mapStateToProps, mapDispachToProps)(ForgotPassword);