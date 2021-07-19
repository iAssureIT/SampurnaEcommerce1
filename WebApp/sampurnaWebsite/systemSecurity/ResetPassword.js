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
            showMessage : false,
            errors: {}
        }
    }
    componentDidMount(){
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
          this.setState({
            userId  : userDetails.userId,
          })
        }
    }
    resetPassword(event) {
        event.preventDefault();
        var formValues  =  {
            "user_id"               : this.state.userId,
            "newPassword"  	        : this.refs.newPassword.value,
            "currentPassword"       : this.refs.confirmPassword.value,
        }
        axios.patch('/api/auth/patch/reset_password', formValues)
        .then((response)=>{
            if(response){
                this.setState({
                    "showMessage" : true,
                })
                swal(response.data.message);
            }
        })
        .catch((error)=>{
            console.log("reset Password error=",error);
        })
    }
    handleChange(event){
		// const formerrors = this.state.formerrors;
		this.setState({
			[event.target.name]: event.target.value,
			// formerrors
		}); 
		// let fields = this.state.fields;
		// fields[event.target.name] = event.target.value;
		// this.setState({
		//   fields
		// });
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

    togglePassword(event){
		event.preventDefault();
		var element = event.target;
		$(element).toggleClass("fa-eye fa-eye-slash");
		var input = document.getElementById('newPassword');
		if (input.getAttribute("type") == "password") {
			input.setAttribute("type", "text");
		} else {
			input.setAttribute("type", "password");
		}
	}

	toggleConfirmPassword(){
		event.preventDefault();
		var element = event.target;
		$(element).toggleClass("fa-eye fa-eye-slash");
		var input = document.getElementById('confirmPassword');
		if (input.getAttribute("type") == "password") {
		input.setAttribute("type", "text");
		} else {
		input.setAttribute("type", "password");
		}
	}

    openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");	
  }
    render() {
        return (
            <div className="col-12 resetWrapper mobileViewNoPadding">
                <div className="col-12 mobileViewNoPadding">
                    <div className="col-12 innloginwrap">
                        <h4>Reset Password</h4>
                    </div>
                    {
                        this.state.showMessage === false ? 
                        <div>
                            <form id="resetPassword">
                            <div className="form-group frmhgt textAlignLeft col-12  mt-4">
                                <label className="blueText">New Password</label><label className="astricsign">*</label>
                                <input id="newPassword" type="password" class="form-control passswordInput formcontrol1" ref="newPassword" name="newPassword" placeholder="Password" 
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.signupPassword}  autoComplete="off"
                                />
                                <span toggle="#newPassword" class="fa fa-fw fa-eye field-icon toggle-password"
                                    onClick={this.togglePassword.bind(this)}>
                                </span>
                                <div className="errorMsg mt-1">{this.state.errors.newPassword}</div>
                            </div>

                            <div className="form-group frmhgt textAlignLeft col-12 mt-4">
                                <label className="blueText">Confirm Password</label><label className="astricsign">*</label>
                                <input id="confirmPassword" type="password" class="form-control passswordInput formcontrol1" ref="confirmPassword" name="confirmPassword" placeholder="Password" 
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.signupPassword}  autoComplete="off"
                                />
                                <span toggle="#confirmPassword" class="fa fa-fw fa-eye field-icon toggle-password"
                                    onClick={this.toggleConfirmPassword.bind(this)}>
                                </span>
                                <div className="errorMsg mt-1">{this.state.errors.confirmPassword}</div>
                            </div>
                           
                            <div className="col-12 mb-3 mt-5 ">
								<button id="signUpBtn" onClick={this.resetPassword.bind(this)} className="col-12  btn otpBtns	">Reset Password</button>
							</div>
                        </form>
                        </div>
                        :
                        <div className="col-12 resetPassword">
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
