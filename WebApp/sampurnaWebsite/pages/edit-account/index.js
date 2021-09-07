import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import Style                  from './index.module.css';
import swal from 'sweetalert';
import PhoneInput 			from 'react-phone-input-2';

class EditAccount extends Component{
    constructor(props) {
        super(props);
        this.state={
            "firstName"     : "",
            "lastName"      : "",
            "mobNumber"     : "",
            "emailId"       : "",
            "newPassword"   : "",
            "oldPassword"   : "",
            "changeEmail"   : "",
            "changePassword": "",
            "changeEmail"   : false,
            "changePassword": false,
            "showPassword": false,
            "showPassword1": false,
            "showPassword2": false,
            fields: {},
			errors: {}
        }
    }
    componentDidMount(){
        $(window).scrollTop(0);
        var sampurnaWebsiteDetails  = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var currency = sampurnaWebsiteDetails.preferences.currency;
        var userDetails  = JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
            this.setState({
                user_ID : userDetails.user_id,
                email   : userDetails.email,
                fullName: userDetails.firstName +" "+userDetails.lastName ,         
                currency     : currency,
            },()=>{
                this.getUserData();
            })
        }
    }
    validateFullName() { 
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		if (!fields["firstName"]) {
		  formIsValid = false;
		  errors["firstName"] = "This field is required.";
		}
		if (typeof fields["firstName"] !== "undefined") {
		  //regular expression for email validation
		  var pattern = new RegExp(/^[A-Za-z]*$/)
		  if (!pattern.test(fields["firstName"])) {
			formIsValid = false;
			errors["firstName"] = "Name should only contain letters.";
		  }else{
			errors["firstName"] = "";
		  }
		}
		
		if (!fields["lastName"]) {
			formIsValid = false;
			errors["lastName"] = "This field is required.";
		}
		if (typeof fields["lastName"] !== "undefined") {
			var pattern = new RegExp(/^[A-Za-z]*$/)
			if (!pattern.test(fields["lastName"])) {
			  formIsValid = false;
			  errors["lastName"] = "Name should only contain letters.";
			}
		}

		this.setState({
		  errors: errors
		});
		return formIsValid;
	}

    validatePhone(){ 
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["mobNumber"]) {
        formIsValid = false;
        errors["mobNumber"] = "This field is required.";
    }

    this.setState({
        errors: errors
    });
        return formIsValid;
    }

      validateEmail() { 
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		if (!fields["signupEmail"]) {
			formIsValid = false;
			errors["signupEmail"] = "Please enter your email.";
		  }
		  if (typeof fields["signupEmail"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
			if (!pattern.test(fields["signupEmail"])) {
			  formIsValid = false;
			  errors["signupEmail"] = "Please enter valid email.";
			}
		  }
	  
		// if (!fields["signupPassword"]) {
		//   formIsValid = false;
		//   errors["signupPassword"] = "This field is required.";
		// }
		// if (typeof fields["signupPassword"] !== "undefined") {
		// 	//regular expression for email validation
		// 	if (fields["signupPassword"].length >= 6) {
		// 		errors["signupPassword"] = ""
		// 	}else{
		// 		formIsValid = false;
		// 		errors["signupPassword"] = "Please enter at least 6 characters.";
		// 	}
		// }

		// if (!fields["signupConfirmPassword"]) {
		// 	formIsValid = false;
		// 	errors["signupConfirmPassword"] = "This field is required.";
		//   }

		this.setState({
		  errors: errors
		});
		return formIsValid;
	  }
    accountUpdate(event){
        event.preventDefault();
    }
    getUserData(){
        axios.get('/api/users/get/id/'+this.state.user_ID)
        .then( (res)=>{
            // console.log("user res==",res.data);
            this.setState({
                "firstName"         : res.data.profile.firstname,
                "lastName"          : res.data.profile.lastname,
                "mobNumber"         : res.data.profile.mobile,
                "emailId"           : res.data.profile.email,
                "newPassword"       : "",
                "oldPassword"       : "",
            },()=>{
                let fields = this.state.fields;
                    fields["firstName"] = res.data.profile.firstname;
                    fields["lastName"] = res.data.profile.lastname;
                    fields["mobNumber"] = res.data.profile.mobNumber,
                    fields["emailId"] = res.data.profile.emailId,
                    this.setState({
                        fields
                    });
            })

        })
        .catch((error)=>{
          console.log("error = ",error);
        });
    }
    updateUserBasicInfo(event){
        event.preventDefault();
        var formvalues = {
            "user_id"           : this.state.user_ID,
            "firstname"         : this.state.firstName,
            "lastname"          : this.state.lastName,
            "image"     	    : [],
            "isdCode"           : "971",
            "mobile"     	    : this.state.mobNumber,
            "mobileChange"      : false,
            "emailChange"       : false,
            "currentPassword"   : "",
            "email"    		    : ""
        }
        if(formvalues){
            console.log("formvalues==",formvalues);
            if(this.validateFullName()){
            axios.patch('/api/users/update/user_profile_details', formvalues)
            .then((response)=> {  
                if(response){  
                console.log("response==",response);
                this.setState({
                    messageData : {
                        "type" : "outpage",
                        "icon" : "fa fa-check-circle",
                        "message" : "&nbsp; "+response.data.message,
                        "class": "success",
                        "autoDismiss" : true
                    }
                    })
                    setTimeout(() => {
                        this.setState({
                            messageData   : {},
                        })
                    }, 3000);
                }
            })
            .catch((error,resp)=> {
                this.setState({
                  messageData : {
                    "type" : "outpage",
                    "icon" : "fa fa-times-circle",
                    "message" : error.response.data.message,
                    "class": "warning",
                    "autoDismiss" : true
                  }
                })
                setTimeout(() => {
                    this.setState({
                        messageData   : {},
                    })
                }, 3000);
            });
        }
       }
    }

    updateUserPassword(event){
        event.preventDefault();
        if(this.state.newPassword === this.state.confirmPassword){
        var formValues  =  {
            "user_id"               : this.state.user_ID,
            "newPassword"  	        : this.state.newPassword,
            "currentPassword"       : this.state.resetCurrentPassword,
        }
        }else{
            swal("Password not matching");
        }
        if(formValues){
            console.log("formValues===",formValues);
            axios.patch('/api/auth/patch/reset_password', formValues)
            .then((response)=> {  
                if(response){  
                console.log("response==",response);
                this.setState({
                    messageData : {
                        "type" : "outpage",
                        "icon" : "fa fa-check-circle",
                        "message" : "&nbsp; "+"User data updated successfully",
                        "class": "success",
                        "autoDismiss" : true
                    }
                    })
                    setTimeout(() => {
                        this.setState({
                            messageData   : {},
                        })
                    }, 3000);
                }
            })
            .catch((error,resp)=> {
                this.setState({
                  messageData : {
                    "type" : "outpage",
                    "icon" : "fa fa-times-circle",
                    "message" : error.response.data.message,
                    "class": "warning",
                    "autoDismiss" : true
                  }
                })
                setTimeout(() => {
                    this.setState({
                        messageData   : {},
                    })
                }, 3000);
            });
       }
    }

    updateUserMobile(event){
        event.preventDefault();
        var formvalues = {
            "user_id"           : this.state.user_ID,
            "firstname"         : this.state.firstName,
            "lastname"          : this.state.lastName,
            "image"     	    : [],
            "isdCode"           : "971",
            "mobile"     	    : this.state.mobNumber,
            "mobileChange"      : true,
            "emailChange"       : false,
            "currentPassword"   : "",
            "email"    		    : ""
        }
        if(formvalues){
            // console.log("formvalues==",formvalues);
            if(this.validatePhone()){
            axios.patch('/api/users/update/user_profile_details', formvalues)
            .then((response)=> {  
                if(response){  
                console.log("response==",response);
                this.setState({
                    messageData : {
                        "type" : "outpage",
                        "icon" : "fa fa-check-circle",
                        "message" : "&nbsp; "+"User data updated successfully",
                        "class": "success",
                        "autoDismiss" : true
                    }
                    })
                    setTimeout(() => {
                        this.setState({
                            messageData   : {},
                        })
                    }, 3000);
                }
            })
            .catch((error,resp)=> {
                this.setState({
                  messageData : {
                    "type" : "outpage",
                    "icon" : "fa fa-times-circle",
                    "message" : error.response.data.message,
                    "class": "warning",
                    "autoDismiss" : true
                  }
                })
                setTimeout(() => {
                    this.setState({
                        messageData   : {},
                    })
                }, 3000);
            });
        }
        }
    }
    updateUserEmail(event){
        event.preventDefault();
        if(this.state.currentPassword){
        var formvalues = {
            "user_id"           : this.state.user_ID,
            "firstname"         : this.state.firstName,
            "lastname"          : this.state.lastName,
            "image"     	    : [],
            "isdCode"           : "971",
            "mobile"     	    : this.state.mobNumber,
            "mobileChange"      : false,
            "emailChange"       : true,
            "currentPassword"   : this.state.currentPassword,
            "email"    		    : this.state.emailId
        }
        if(formvalues){
            console.log("formvalues==",formvalues);
            axios.patch('/api/users/update/user_profile_details', formvalues)
            .then((response)=> {  
                if(response){  
                console.log("response==",response);
                this.setState({
                    messageData : {
                        "type" : "outpage",
                        "icon" : "fa fa-check-circle",
                        "message" : "&nbsp; "+"User data updated successfully",
                        "class": "success",
                        "autoDismiss" : true
                    }
                    })
                    setTimeout(() => {
                        this.setState({
                            messageData   : {},
                        })
                    }, 3000);
                }
            })
            .catch((error,resp)=> {
                this.setState({
                  messageData : {
                    "type" : "outpage",
                    "icon" : "fa fa-times-circle",
                    "message" : error.response.data.message,
                    "class": "warning",
                    "autoDismiss" : true
                  }
                })
                setTimeout(() => {
                    this.setState({
                        messageData   : {},
                    })
                }, 3000);
            });
       }
    }else{
        swal("Please insert your current password");
    }
    }

    changeMobile(event){
        this.setState({
            changeMobile : event.target.checked
        },()=>{
            if(this.state.changeEmail === false && this.state.changePassword === false && this.state.changeMobile === false){
                $('.updateBasicInfo').show();
            }else{
                $('.updateBasicInfo').hide();
            }
        })
    }
    changeEmail(event){
        this.setState({
            changeEmail : event.target.checked
        },()=>{
            if(this.state.changeEmail === false && this.state.changePassword === false && this.state.changeMobile === false){
                $('.updateBasicInfo').show();
            }else{
                $('.updateBasicInfo').hide();
            }
        })
    }
    changePassword(event){
        this.setState({
            changePassword : event.target.checked
        },()=>{
            if(this.state.changeEmail === false && this.state.changePassword === false && this.state.changeMobile === false){
                $('.updateBasicInfo').show();
            }else{
                $('.updateBasicInfo').hide();
            }
        })
    }

    onChange(event){
        // console.log("event.target.name===",event.target.name);
        this.setState({
            [event.target.name] : event.target.value
        })
        let fields = this.state.fields;
		fields[event.target.name] = event.target.value;
		this.setState({
		  fields
		});
    }

    // handleChange(event){
    //     var fieldValue=event.currentTarget.value;
    //     var fieldKey=event.currentTarget.name;
    //     this.setState({
    //       [fieldKey]:fieldValue
    //     }); 
        
    //     let fields = this.state.fields;
	// 	fields[event.target.name] = event.target.value;
	// 	this.setState({
	// 	  fields
	// 	});
    // }
  
    showPassFun=(event)=>{
        event.preventDefault();
        var passwordToggle = document.getElementById("confirmPassword");
        if (passwordToggle.type === "password") {
            passwordToggle.type = "text";
            this.setState({showPassword:true});
          } else {
            passwordToggle.type = "password";
            this.setState({showPassword:false});
          }
      }
      showPassFun1=(event)=>{
        event.preventDefault();
        var passwordToggle = document.getElementById("newPass");
        if (passwordToggle.type === "password") {
            passwordToggle.type = "text";
            this.setState({showPassword1:true});
          } else {
            passwordToggle.type = "password";
            this.setState({showPassword1:false});
          }
      }
      showPassFun2=(event)=>{
        event.preventDefault();
        var passwordToggle = document.getElementById("currentPassword");
        if (passwordToggle.type === "password") {
            passwordToggle.type = "text";
            this.setState({showPassword2:true});
          } else {
            passwordToggle.type = "password";
            this.setState({showPassword2:false});
          }
      }
      showPassFun3 = (event)=>{
        event.preventDefault();
        var passwordToggle = document.getElementById("resetCurrentPassword");
        if (passwordToggle.type === "password") {
            passwordToggle.type = "text";
            this.setState({showPassword2:true});
          } else {
            passwordToggle.type = "password";
            this.setState({showPassword2:false});
          }   
      }
    render(){
        if(this.state.changeEmail === false && this.state.changePassword === false && this.state.changeMobile === false){
            $('.updateBasicInfo').show();
        }
        return(
            <section className="pt-4 pl-xl-3 mt-lg-3 pl-lg-2 mt-xl-0">
            <div className={"font-weight-bold pl-xl-2 pb-xl-3 pb-lg-3 pl-lg-2 pb-md-3 pl-md-3 pb-3 " + Style.editAccountTitle}>My Profile</div>
            <div className={"col-lg-10 col-12 col-xl-9 col-md-11 accountInformationMainWrapper "+Style.accountInformationMainWrapper}id="accountInformationManiId">
            <div className="row">
                <div className={ " col-12 accountDashBoardInnerwrapper ml-lg-2 "+Style.accountDashBoardInnerwrapper}>
                    <Message messageData={this.state.messageData} />
                    <div className="row">
                        <div className={"col-12 " + Style.accountSideSpacing}>
                            {/* <div className="col-12 "> */}
                                <form id="editAccount">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-xl-6 col-lg-5 col-sm-5 col-md-5 col-12 mt-4 ">
                                                    <div className="col-12 mb-2 NoPadding">
                                                        <label className={"mt15 " + Style.editAccountFont}>First Name <span className={"asterisk " + Style.asterikSign}> &#42; </span></label>
                                                        <br />
                                                        <div id="firstName" className={"col-xl-12 col-md-12 col-sm-12 col-xs-12 col-12 NoPadding "+Style.editAccInputWrapper}>
                                                            <input maxLength="25" type="text" name="firstName" ref="firstName" value={this.state.firstName} onChange={this.onChange.bind(this)} className="col-xl-12 col-md-12 col-sm-12 col-xs-12 px-0 form-control" required/> 
                                                            <div className="errorMsg mt-1 ">{this.state.errors.firstName}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-xl-6 col-lg-5 col-sm-5 col-md-5 col-12 mt-4 ">
                                                    <div className="col-12 mb-2 NoPadding">
                                                        <label className={"mt15 " + Style.editAccountFont}>Last Name <span className={"asterisk " + Style.asterikSign}> &#42; </span></label>
                                                        <br />
                                                        <div id="lastName" className={"col-xl-12 col-md-12 col-sm-12 col-xs-12 col-12 NoPadding "+Style.editAccInputWrapper}>
                                                            <input maxLength="25" type="text" name="lastName" ref="lastName" value={this.state.lastName} onChange={this.onChange.bind(this)} className="col-xl-12 col-md-12 col-sm-12 col-xs-12 px-0 form-control" required/> 
                                                            <div className="errorMsg mt-1 ">{this.state.errors.lastName}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="col-12 float-right">
                                                    <button className="btn globalCommonBtn editAccount col-12  float-right" onClick={this.updateUserBasicInfo.bind(this)}>Submit</button>
                                                </div> */}

                                            </div>
                                        </div>
                                        <div className="col-12 mt-1 px-0">
                                            <div className="col-12">
                                                <div className={"col-12 mt-2 NoPadding mt15 " + Style.editAccountFont}>
                                                    <input type="checkbox" id="changeEmail" checked={this.state.changeEmail} onChange={this.changeEmail.bind(this)}/> &nbsp; <span>Change Email</span> 
                                                </div>
                                            </div>
                                                
                                                { this.state.changeEmail === true &&
                                                    // <div className="col-12">
                                                        <div className="col-12">
                                                            <div className="row">
                                                                <div className="col-xl-6 col-lg-5 col-sm-5 col-md-5 col-12 mb-2">
                                                                    <label className={"mt15 " + Style.editAccountFont}>Email <span className={"asterisk " + Style.asterikSign}> &#42; </span></label>
                                                                    <br />
                                                                    <div id="emailId" className={"  "+Style.editAccInputWrapper}>
                                                                        <input type="email" name="emailId" ref="emailId" value={this.state.emailId} onChange={this.onChange.bind(this)} className="col-12 px-0 form-control" /> 
                                                                        <div className="errorMsg mt-1 ">{this.state.errors.emailId}</div>
                                                                    </div>
                                                                </div> 
                                                                <div className="col-xl-6 col-lg-5 col-sm-5 col-md-5 col-12 mb-2">
                                                                    <label className={"mt15 " + Style.editAccountFont}>Current Password <span className={"asterisk " + Style.asterikSign}> &#42; </span></label>
                                                                    <br />
                                                                    <div id="oldPassword" className={" "+Style.editAccInputWrapper}>
                                                                        <input type="text" id="currentPassword" type="password" name="currentPassword" ref="currentPassword" value={this.state.currentPassword} onChange={this.onChange.bind(this)} className="col-12 px-0 form-control" /> 
                                                                        <span className={" showHideEyeDiv "+ Style.emailPwdWrapper} onClick={this.showPassFun2.bind(this)}>
                                                                            <i className={this.state.showPassword2 ? "fa fa-eye" : "fa fa-eye-slash"} value={this.state.showPassword2}></i>
                                                                        </span> 
                                                                        <div className="errorMsg mt-1 ">{this.state.errors.currentPassword}</div>
                                                                    </div>
                                                                </div> 
                                                                <div className="col-12 float-right">
                                                                    <button className={"btn globalCommonBtn editAccount col-12 float-right " + Style.profileSubmitBtn}  onClick={this.updateUserEmail.bind(this)}>Submit</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    
                                                } 
                                                <div className={"col-12 mt-2 " +Style.horizontalLine}></div>
                                            </div>

                                        <div className="col-12 mt-1 px-0">
                                            <div className="col-12">
                                                <div className={"col-12 mt-2 NoPadding " + Style.editAccountFont}>
                                                    <input type="checkbox" id="changeMobile" checked={this.state.changeMobile} onChange={this.changeMobile.bind(this)}/> &nbsp; <span>Change Mobile</span> 
                                                </div>
                                                { this.state.changeMobile === true &&
                                                    <div className="col-12 ">
                                                        <div className="row ">
                                                            <div className="col-xl-5 col-lg-5 col-sm-5 col-md-5  col-12 mb-2 NoPadding">
                                                                <label className={"mt15 " + Style.editAccountFont}>Mobile Number<span className={"asterisk " + Style.asterikSign}> &#42; </span></label>
                                                                <br />
                                                                <PhoneInput
                                                                    country={'ae'} 
                                                                    value={this.state.mobNumber}
                                
                                                                    inputProps={{
                                                                        name: 'mobNumber',
                                                                        required: true
                                                                    }}
                                                                    onChange={mobileNumber => { 
                                                                        this.setState({ mobileNumber })
                                                                            this.setState({
                                                                                mobNumber : mobileNumber,
                                                                            },()=>{
                                                                                console.log("mobNumber==",this.state.mobNumber);
                                                                            }); 
                                                                            let fields = this.state.fields;
                                                                            fields["mobNumber"] = this.state.mobNumber;
                                                                            this.setState({
                                                                                fields
                                                                            });
                                                                    }} />
                                                                <div className="col-12 errorMsg mt-1 ">{this.state.errors.mobNumber}</div>
                                                            </div>
                                                            <div className="col-12 NoPadding float-right">
                                                                <button className={"btn globalCommonBtn editAccount col-12 float-right " + Style.profileSubmitBtn} onClick={this.updateUserMobile.bind(this)}>Submit</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className={"col-12 mt-2 " +Style.horizontalLine}></div>
                                            </div>
                                        </div>

                                      
                                        <div className="col-12 NoPadding mb-4">
                                            <div className="col-12 mb-2 px-0">
                                                <div className={"col-12 " + Style.editAccInputWrapper}>
                                                    <input type="checkbox" id="changePassword" checked={this.state.changePassword} onChange={this.changePassword.bind(this)}/> &nbsp; <span className={Style.editAccountFont}>Change Password</span> 
                                                </div>
                                                <div id="credentials" className=" mt-2 ">
                                                    { this.state.changePassword === true &&
                                                        <div className="col-12">
                                                        <div className="row ">
                                                            <div className="col-12 col-lg-3 col-md-3 mx-auto mb-2 NoPadding">
                                                                <label className={"mt15 " + Style.editAccountFont}>Current Password <span className={"asterisk " + Style.asterikSign}> &#42; </span></label>
                                                                <br />
                                                                <div id="oldPassword" className={"col-12 NoPadding "+Style.editAccInputWrapper}>
                                                                    <input type="text" id="resetCurrentPassword" type="password" name="resetCurrentPassword" ref="resetCurrentPassword" value={this.state.resetCurrentPassword} onChange={this.onChange.bind(this)} className="col-12 form-control" /> 
                                                                    <span className={" showHideEyeDiv "+Style.editAccInputWrapperInner} onClick={this.showPassFun3.bind(this)}>
                                                                        <i className={this.state.showPassword3 ? "fa fa-eye" : "fa fa-eye-slash"} value={this.state.showPassword3}></i>
                                                                    </span> 
                                                                    <div className="errorMsg mt-1 ">{this.state.errors.currentPassword}</div>
                                                                </div>
                                                            </div> 
                                                            <div className="col-12 col-lg-3 col-md-3 mx-auto mb-2 NoPadding">
                                                                <label className={"mt15 " + Style.editAccountFont}>New Password <span className={"asterisk " + Style.asterikSign}> &#42; </span></label>
                                                                <br />
                                                                <div id="newPassword" className={"col-12 NoPadding "+Style.editAccInputWrapper}>
                                                                    <input type="password" id="newPass" name="newPassword" ref="newPassword" value={this.state.newPassword} onChange={this.onChange.bind(this)} className="col-12 form-control newPassword" /> 
                                                                    <span className={" showHideEyeDiv "+Style.editAccInputWrapperInner} onClick={this.showPassFun1.bind(this)}>
                                                                        <i className={this.state.showPassword1 ? "fa fa-eye" : "fa fa-eye-slash"} value={this.state.showPassword1}></i>
                                                                    </span> 
                                                                    <div className="errorMsg mt-1 ">{this.state.errors.newPassword}</div>
                                                                </div>
                                                            </div>
                                                            <div className=" col-12 col-lg-3 col-md-3 mx-auto mb-2 NoPadding">
                                                                <label className={"mt15 col-12 NoPadding " + Style.editAccountFont}>Confirm New Password <span className={"asterisk " + Style.asterikSign}> &#42; </span></label>
                                                                <br />
                                                                <div className={"col-12 NoPadding "+Style.editAccInputWrapper}>
                                                                    <input type="password" className="loginPwdField col-12 form-control" id="confirmPassword" name="confirmPassword" value={this.state.confirmPassword} ref="confirmPassword" onChange={this.onChange.bind(this)} /> 
                                                                    <span className={" showHideEyeDiv "+Style.editAccInputWrapperInner} onClick={this.showPassFun.bind(this)}>
                                                                        <i className={this.state.showPassword ? "fa fa-eye" : "fa fa-eye-slash"} value={this.state.showPassword}></i>
                                                                    </span> 
                                                                    <div className="errorMsg mt-1 ">{this.state.errors.confirmPassword}</div>
                                                                </div>
                                                            </div> 
                                                            <div className="col-12 float-right">
                                                                <button className={"btn globalCommonBtn editAccount col-12 float-right " + Style.profileSubmitBtn} onClick={this.updateUserPassword.bind(this)}>Submit</button>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    } 
                                                   
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 float-right updateBasicInfo">
                                            <button className={"btn globalCommonBtn editAccount  col-12  float-right " + Style.profileSubmitBtn} onClick={this.updateUserBasicInfo.bind(this)}>Submit</button>
                                        </div>
                                </form>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>
        )
    }
}

export default EditAccount;