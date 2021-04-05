import React, { Component } from 'react';
import $ from 'jquery';
// import jQuery from 'jquery';
import swal from 'sweetalert';
import axios from 'axios';
import Image from 'next/image';
import getConfig from 'next/config';
import { connect } from 'react-redux';
import { bindActionCreators }     from 'redux';
import {getForm,updateForm} from '../redux/actions';
// import '../../sites/currentSite/common/SignUp.css'
const { publicRuntimeConfig } = getConfig();

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerData: {
                title: "MY SHOPPING CART",
                breadcrumb: 'My Shopping Cart',
                backgroungImage: '/images/cartBanner.png',
            },
            showMessage : false
        }
    }
    componentDidMount(){
        this.validation();
    }
    resetPassword(event) {
        event.preventDefault();
        // var userID = this.props.match.params.user_ID;
        var userID = localStorage.getItem("userID");
        var formValues = {
            "pwd" : this.refs.newPassword.value
        }
        // if($('#resetPassword').valid()){
            $('.fullpageloader').show();
            axios.patch('/api/auth/patch/change_password_withoutotp/id/'+userID, formValues)
            .then((response)=>{
                $('.fullpageloader').hide();
                this.setState({
                    "showMessage" : true,
                })
                swal(response.data.message);
                this.props.history.push('/login');
            })
            .catch((error)=>{
                $('.fullpageloader').hide();
            })
        // }
    }

    Closepagealert(event){
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

    validation(){
        // jQuery.validator.setDefaults({
        //     debug: true,
        //     success: "valid"
        // });

        // $("#resetPassword").validate({
        //     rules: {
        //         newPassword: {
        //             required: true,
        //         },
        //         confirmPassword: {
        //             required: true,
        //             equalTo : "#newPassword"
        //         },
        //     },
        //     messages:{
        //         confirmPassword:"Passwords do not match"
        //     },
        //     errorPlacement: function (error, element) {
        //         if (element.attr("name") === "newPassword") {
        //             error.insertAfter("#newPasswordmsg");
        //         }
        //         if (element.attr("name") === "confirmPassword") {
        //             error.insertAfter("#confirmPass");
        //         }
        //     }
        // });
    }
    
    showNewPass(){

        $(".hidePwd").css('display','block');
		$(".showPwd").css('display','none');	
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('#newPassword').attr('type', 'text');


        // $('.showPwd').toggleClass('showPwd1');
        // $('.hidePwd').toggleClass('hidePwd1');
        // return $('#newPassword').attr('type', 'text');
    }
    hideNewPass(){

        $(".showPwd").css('display','block');
		$(".hidePwd").css('display','none');
        $('.showPwd').toggleClass('showPwd1');
        $('.hidePwd').toggleClass('hidePwd1');
        return $('#newPassword').attr('type', 'password');
    }
    showConfirmPass(){
        $(".hidePwd2").css('display','block');
		$(".showPwd2").css('display','none');
        $('.showPwd2').toggleClass('showPwd3'); 
        $('.hidePwd2').toggleClass('hidePwd3');
        return $('#confirmPassword').attr('type', 'text');
    }
    hideConfirmPass(){
        $(".showPwd2").css('display','block');
		$(".hidePwd2").css('display','none');
        $('.showPwd2').toggleClass('showPwd3');
        $('.hidePwd2').toggleClass('hidePwd3');
        return $('#confirmPassword').attr('type', 'password');
    }
    openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");	
  }
    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper mobileViewNoPadding">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mobileViewNoPadding">

                    <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-2 siteLogo NoPadding">
                        {/* <img src="/images/eCommerce/kokilaLogo.png" className="responsive logoImg"></img> */}
                        <Image 
                            src={"/images/eCommerce/kokilaLogo.png"}
                            className={"logoImg"}
                            height ={60}
                            width={200}
                            layout="responsive"
                        />	
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
                        <h4>Reset Password</h4>
                    </div>
                    {
                        this.state.showMessage === false ? 
                        <div>
                            <form id="resetPassword">
                            <div className="form-group textAlignLeft frmhgt col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <label>New Password </label><label className="astricsign">*</label>
                                <input type="password" id="newPassword" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="newPassword" name="newPassword" autoComplete="off" />
                                {/* <div className="showHideSignDiv">
                                    <i className="fa fa-eye showPwd" aria-hidden="true" onClick={this.showNewPass.bind(this)}></i>
                                    <i className="fa fa-eye-slash hidePwd " aria-hidden="true" onClick={this.hideNewPass.bind(this)}></i>
                                </div>  */}
                                <br/>
                                <div  id="newPasswordmsg"></div>
                            </div>
                            <div className="form-group frmhgt textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                                <label>Confirm Password</label><label className="astricsign">*</label>
                                <input type="password" id="confirmPassword" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="confirmPassword" name="confirmPassword" autoComplete="off" />
                                {/* <div className="showHideSignDiv">
                                    <i className="fa fa-eye showPwd2 showEyeupSign" aria-hidden="true" onClick={this.showConfirmPass.bind(this)}></i>
                                    <i className="fa fa-eye-slash hidePwd2 hideEyeSignup" aria-hidden="true" onClick={this.hideConfirmPass.bind(this)}></i>
                                </div>  */}
                                <br/>
                                <div id="confirmPass"></div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 mb25">
                                <button className="btn loginBtn globaleCommBtn" onClick={this.resetPassword.bind(this)}>Reset Password</button>
                            </div>
                        </form>
                        </div>
                        :
                        <div>
                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 textAlignCenter">Your password has been reset successfully!</p>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                                <div className="row loginforgotpass textAlignCenter"> Please &nbsp;
                                    {/* <a href='/login' className=""><b>Click here</b></a> */}
                                    <span className=""onClick={this.openSignInModal.bind(this)} style={{'cursor':'pointer'}} ><b>Click here</b> &nbsp;</span>
                                     to Sign In.
                                </div>
                            </div>
                        </div>
                    }
                </div>
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

  export default connect(mapStateToProps, mapDispachToProps)(ResetPassword);
