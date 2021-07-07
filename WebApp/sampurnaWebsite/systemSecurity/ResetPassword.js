import React, { Component } from 'react';
import $ from 'jquery';
import swal from 'sweetalert';
import axios from 'axios';
import Image from 'next/image';
import getConfig from 'next/config';
import { connect } from 'react-redux';
import { bindActionCreators }     from 'redux';
import {getForm,updateForm} from '../redux/actions';
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
        var formValues = {
            "pwd" : this.refs.newPassword.value
        }
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
            <div className="col-12 LoginWrapper mobileViewNoPadding">
                <div className="col-12 mobileViewNoPadding">
                    <div className="col-12 innloginwrap">
                        <h4>Reset Password</h4>
                    </div>
                    {
                        this.state.showMessage === false ? 
                        <div>
                            <form id="resetPassword">
                            <div className="form-group textAlignLeft frmhgt col-12">
                                <label>New Password </label><label className="astricsign">*</label>
                                <input type="password" id="newPassword" className="form-control col-12" ref="newPassword" name="newPassword" autoComplete="off" />
                              
                                <br/>
                                <div  id="newPasswordmsg"></div>
                            </div>
                            <div className="form-group frmhgt textAlignLeft col-12" >
                                <label>Confirm Password</label><label className="astricsign">*</label>
                                <input type="password" id="confirmPassword" className="form-control col-12" ref="confirmPassword" name="confirmPassword" autoComplete="off" />
                               
                                <br/>
                                <div id="confirmPass"></div>
                            </div>
                            <div className="col-12 mt25 mb25">
                                <button className="btn loginBtn globaleCommBtn" onClick={this.resetPassword.bind(this)}>Reset Password</button>
                            </div>
                        </form>
                        </div>
                        :
                        <div>
                            <p className="col-12 mt25 textAlignCenter">Your password has been reset successfully!</p>
                            <div className="col-12 mt10">
                                <div className="row loginforgotpass textAlignCenter"> Please &nbsp;
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
