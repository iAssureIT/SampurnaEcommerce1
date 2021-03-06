import React, { Component } from 'react';
import $     from 'jquery';
import axios from 'axios';
import swal  from 'sweetalert';
import Image from 'next/image';
import { connect }                from 'react-redux';
import { bindActionCreators }     from 'redux';
import {getForm,updateForm}       from '../redux/actions';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnLoading: false,
            bannerData: {
                title: "MY SHOPPING CART",
                breadcrumb: 'My Shopping Cart',
                backgroungImage: '/images/cartBanner.png',
            },
            showMessage: false,
            fields: {},
            errors: {}
      
        }
    }
    componentDidMount() {
        // this.validateForm();
    }

    // validateForm() {
    //     let fields = this.state.fields;
    //     let errors = {};
    //     let formIsValid = true;
    
    //     if (!fields["emailLink"]) {
    //       formIsValid = false;
    //       errors["emailLink"] = "Please enter your email.";
    //     }
    //     if (typeof fields["emailLink"] !== "undefined") {
    //       //regular expression for email validation
    //       var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
    //       if (!pattern.test(fields["emailLink"])) {
    //         formIsValid = false;
    //         errors["emailLink"] = "Please enter valid email.";
    //       }
    //     }
    
    //     this.setState({
    //       errors: errors
    //     });
    //     return formIsValid;
    //   }
    handleChange(e){
        let fields = this.state.fields;
        fields[e.target.name] = e.target.value;
        this.setState({
          fields
        });
      }    
    
    sendLink(evvalidateForment) {
        event.preventDefault();
        var username = this.refs.username.value;
            console.log("formValues==",username);
            axios.patch('/api/auth/patch/set_send_otp/' + username)
                .then((forgotPassResponse) => {
                    if(forgotPassResponse.data.message){
                        var userDetails = {
							userId      : forgotPassResponse.data.ID,
						}
                        swal(forgotPassResponse.data.message);
                        this.props.updateFormValue("signupotp");
                    }                  
                })
                .catch((error) => {
                    console.log("error===",error);
                })
        
    }

    openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");	
	}
    render() {
        return (
            <div className="col-xl-12 col-md-12 col-sm-12 col-12 mobileViewNoPadding">
                <div className="col-xl-12 col-md-12 col-sm-12 mt-5 col-12">
                </div>
                
                <div className="col-xl-12 col-md-12 col-sm-12 col-12 innloginwrap1">
                    <h4 className="blueText signinText">Forgot Password</h4>
                </div>
                {
                    this.state.showMessage === false ?
                        <div className="col-12 NoPadding">
                            <p className="col-xl-12 col-md-12 col-sm-12 col-12 infoText">Please enter your registered email address or Mobile Number below to receive an OTP.</p>
                            <form id="resetPass" className="mt-5 ">
                                <div className="textAlignLeft col-xl-12 frmhgt col-md-12 col-sm-12 col-xs-12 mt25" >
                                    <label className="formLabel ">Email ID / Mobile Number</label><label className="astricsign">*</label>
                                    <input className="form-control col-lg-12 col-md-12 col-sm-12  col-xs-12" placeholder="Mobile / Email ID" ref="username" name="username" type="text" onChange={this.handleChange.bind(this)}/>
                                    <div id="username"></div>
                                    <div className="errorMsg">{this.state.errors.username}</div>
                                </div>
                                {
                                    this.state.btnLoading
                                        ?
                                        <div className="col-xl-10 col-md-10 offset-xl-1 offset-xl-1 col-sm-12 col-xs-12 NOpaddingRight btn globaleCommBtn has-spinner active">
                                            Processing...
                                            <span className="spinner"><i className="fa fa-refresh fa-spin"></i></span>
                                        </div>
                                        :
                                        <div className="col-xl-12 col-md-12 col-sm-12 col-12 mt15 forgotPassBtn">
                                            <button id="sendlink" type="button"  onClick={this.sendLink.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  btn loginBtn signInBtn waves-effect">Send OTP</button>                                                
                                        </div>
                                }
                                <div className="col-xl-12 col-md-12 col-sm-12 col-12 mt-2">
                                    <div className=" loginforgotpass textAlignCenter">
                                        <a href='/' className="forgotText" onClick={this.openSignInModal.bind(this)}>Sign In</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        :
                        <div>
                            <p className="col-xl-12 col-md-12 col-sm-12 col-12 mt25">We have sent a reset password link to your email account.</p>
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12 mt10">
                                <div className=" loginforgotpass textAlignCenter">
                                    <a href='/login' className="forgotText ">Sign In</a>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
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

  export default connect(mapStateToProps, mapDispachToProps)(ForgotPassword);
// export default ForgotPassword;