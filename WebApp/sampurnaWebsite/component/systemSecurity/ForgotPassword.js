import React, { Component } from 'react';
import $     from 'jquery';
import axios from 'axios';
import swal  from 'sweetalert';
import Image from 'next/image';
import { connect }                from 'react-redux';
import { bindActionCreators }     from 'redux';
import {getForm,updateForm}       from '../../redux/actions';
// import '../../sites/currentSite/common/SignUp.css'


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

    validateForm() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
    
        if (!fields["emailLink"]) {
          formIsValid = false;
          errors["emailLink"] = "Please enter your email.";
        }
        if (typeof fields["emailLink"] !== "undefined") {
          //regular expression for email validation
          var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
          if (!pattern.test(fields["emailLink"])) {
            formIsValid = false;
            errors["emailLink"] = "Please enter valid email.";
          }
        }
    
        this.setState({
          errors: errors
        });
        return formIsValid;
      }
    handleChange(e){
        let fields = this.state.fields;
        fields[e.target.name] = e.target.value;
        this.setState({
          fields
        });
      }    
    
    sendLink(evvalidateForment) {
        event.preventDefault();
        var email = this.refs.emailLink.value;
        var formValues = {
            username: email,
            "emailSubject": "Email Verification",
            "emailContent": "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
        }
        if (this.validateForm()) {
            // document.getElementById("sendlink").innerHTML = 'Please wait...';
            document.getElementById("sendlink").value =
            this.setState({ btnLoading: true });
            $('.fullpageloader').show();
            // console.log("formValues==",formValues);
            axios.patch('/api/auth/patch/setsendemailotpusingEmail/' + email, formValues)
                .then((response) => {
                    // console.log("response============",response.data.message);
                    this.setState({ btnLoading: false });                    
                    // console.log("userId===",response.data.ID);
                    $('.fullpageloader').hide();    
                    localStorage.setItem('userID',response.data.ID);
                    if(response.data.message === "NOT_REGISTER"){
                        swal("This Email ID is not registered");
                    }else if(response.data.message === "OTP_UPDATED"){
                        swal("OTP sent to your registered Email ID.");
                        // console.log("response.data.userID===",response.data.ID);
                        this.props.updateFormValue("confirmOtp");
                    }                    
                })
                .catch((error) => {user
                    document.getElementById("sendlink").innerHTML = 'Resend OTP';
                    swal("This Email ID is not registered");
                    console.log("error===",error);
                    $('.fullpageloader').hide();
                })
        }
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

    openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");	
	}
    render() {
        return (
            // <div style={{ 'height': window.innerHeight + 'px', 'width': window.innerWidth + 'px' }} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper">
                <div className="col-xl-12 col-md-12 col-sm-12 col-12 mobileViewNoPadding">
                    <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    </div>
                    <div className=" col-xl-6 offset-xl-3 col-md-6 offset-xl-3 offset-md-3 col-sm-6 col-sm-offset-3 col-xs-8 offset-xs-2 siteLogo NoPadding">
                         {/* <img src="/images/eCommerce/kokilaLogo.png" className="responsive logoImg"></img> */}
                        <Image 
                            src={"/images/multivendorlogo.jpg"}
                            className={"logoImg"}
                            height ={30}
                            width={80}
                            layout="responsive"
                        />	
                    </div>
                    <div className="col-xl-12 col-md-12 col-sm-12 col-12 innloginwrap">
                        <h4>Forgot Password</h4>
                    </div>
                    {
                        this.state.showMessage === false ?
                            <div>
                                <p className="col-xl-12 col-md-12 col-sm-12 col-12 mt25">Please enter your registered email address below to receive an OTP.</p>
                                <form id="resetPass">
                                    <div className="textAlignLeft col-xl-12 frmhgt col-md-12 col-sm-12 col-xs-12 mt25" >
                                        <label className="">Email ID</label><label className="astricsign">*</label>
                                        <input className="form-control col-lg-12 col-md-12 col-sm-12  col-xs-12" placeholder="Email ID" ref="emailLink" name="emailLink" type="text" onChange={this.handleChange.bind(this)}/>
                                        <div id="emailLink"></div>
                                        <div className="errorMsg">{this.state.errors.emailLink}</div>
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
                                                <button id="sendlink" type="button"  onClick={this.sendLink.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  btn loginBtn globaleCommBtn waves-effect">Send OTP</button>                                                
                                            </div>
                                    }
                                    {/* <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 mt25 mb25">
                                    <button id="sendlink" className="btn resetBtn" onClick={this.sendLink.bind(this)}>Send OTP</button>
                                </div> */}
                                    <div className="col-xl-12 col-md-12 col-sm-12 col-12 mt10">
                                        <div className=" loginforgotpass textAlignCenter">
                                            <a href='/' className="" onClick={this.openSignInModal.bind(this)}>Sign In</a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            :
                            <div>
                                <p className="col-xl-12 col-md-12 col-sm-12 col-12 mt25">We have sent a reset password link to your email account.</p>
                                <div className="col-xl-12 col-md-12 col-sm-12 col-12 mt10">
                                    <div className=" loginforgotpass textAlignCenter">
                                        <a href='/login' className="">Sign In</a>
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