import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/Header/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';
import Sidebar              from '../../Themes/Sampurna/blocks/StaticBlocks/Sidebar/Sidebar.js';
import Address              from '../../Themes/Sampurna/blocks/StaticBlocks/Address/Address.js';
import BreadCrumbs          from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';

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
            "changePassword": false
        }
    }
    componentDidMount(){
        var userid = localStorage.getItem('user_ID');
        this.setState({
            user_ID : userid,
            websiteModel : localStorage.getItem('websiteModel')
        },()=>{
            // this.getUserData();
            $('.fullpageloader').show();
            // var userid = localStorage.getItem("user_ID");
            axios.get('/api/users/'+this.state.user_ID)
            .then( (res)=>{
                $('.fullpageloader').hide();
                // console.log("response:",res);
                this.setState({
                    "firstName"         : res.data.profile.firstname,
                    "lastName"          : res.data.profile.lastname,
                    "mobNumber"         : res.data.profile.mobile,
                    "emailId"           : res.data.profile.email,
                    "newPassword"       : "",
                    "oldPassword"       : "",
                })
            })
            .catch((error)=>{
              console.log("error = ",error);
              // alert("Something went wrong! Please check Get URL.");
            });
    
        })
        
        // window.scrollTo(0, 0);
        // $.validator.setDefaults({
        //     debug: true,
        //     success: "valid"
        // });
        // $.validator.addMethod("regxmobNumber", function (value, element, regexpr) {
        //     return regexpr.test(value);
        // }, "Please enter valid mobile number.");
        // $("#editAccount").validate({
        //     rules: {
        //         firstName: {
        //             required: true,
        //         },
        //         lastName: {
        //             required: true,
        //         },
        //         mobNumber: {
        //             required: true,
        //             regxmobNumber: /^([7-9][0-9]{9})$/,
        //         },
        //         emailId:{
        //             required : true,
        //         },
        //         oldPassword: {
        //             required: true,
        //         },
        //         newPassword: {
        //             required: true,
        //         },
        //         newPassword2: {
        //             required: true,
        //             equalTo : ".newPassword"
        //         },
        //     },
        //     messages:{
        //         newPassword2:"Password do not match"
        //     },
        //     errorPlacement: function(error, element) {
        //         if (element.attr("name") === "firstName"){
        //             error.insertAfter("#firstName");
        //         }
        //         if (element.attr("name") === "lastName"){
        //             error.insertAfter("#lastName");
        //         }
        //         if (element.attr("name") === "mobNumber") {
        //             error.insertAfter("#mobNumber");
        //         }
        //         if (element.attr("name") === "emailId"){
        //             error.insertAfter("#emailId");
        //         }
        //         if (element.attr("name") === "oldPassword"){
        //             error.insertAfter("#oldPassword");
        //         }         
        //         if (element.attr("name") === "newPassword"){
        //             error.insertAfter("#newPassword");
        //         }         
        //         if (element.attr("name") === "newPassword2"){
        //             error.insertAfter("#newPassword2");
        //         }     
        //     }
        // });
    }
    accountUpdate(event){
        event.preventDefault();
    }
    // getUserData(){
    //     $('.fullpageloader').show();
    //     // var userid = localStorage.getItem("user_ID");
    //     axios.get('/api/users/'+this.state.user_ID)
    //     .then( (res)=>{
    //         $('.fullpageloader').hide();
    //         // console.log("response:",res);
    //         this.setState({
    //             "firstName"         : res.data.profile.firstname,
    //             "lastName"          : res.data.profile.lastname,
    //             "mobNumber"         : res.data.profile.mobile,
    //             "emailId"           : res.data.profile.email,
    //             "newPassword"       : "",
    //             "oldPassword"       : "",
    //         })
    //     })
    //     .catch((error)=>{
    //       console.log("error = ",error);
    //       // alert("Something went wrong! Please check Get URL.");
    //     });
    // }
    updateUser(event){
        event.preventDefault();
        
        // var userid = localStorage.getItem("user_ID");
        var field = (this.state.changeEmail === true && this.state.changePassword === true? 'all' : (this.state.changeEmail === true ? 'email' : (this.state.changePassword === true? 'password' :"name")));
        
        var formvalues = {
            "field"         : field,
            "firstName"     : this.refs.firstName.value,
            "lastName"      : this.refs.lastName.value,
            "mobileNumber"  : this.refs.mobNumber.value,
            "emailId"       : this.state.emailId,
            "newPassword"   : this.state.newPassword,
            "oldPassword"   : this.state.oldPassword,
            "changeEmail"   : this.state.changeEmail,
            "changePassword": this.state.changePassword
        }
       // if($('#editAccount').valid()){
            // $('.fullpageloader').show();
            
            axios.patch('/api/users/userdetails/'+this.state.user_ID, formvalues)
            .then((response)=> {    
                // $('.fullpageloader').hide();
                // console.log(response.message);
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
                // this.props.history.push('/account');
            }, 3000);
            
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

    changeEmail(event){
        this.setState({
            changeEmail : event.target.checked
        })
    }
    changePassword(event){
        this.setState({
            changePassword : event.target.checked
        })
    }
    onChange(event){
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    // showSignPass() {
    //     $(".hidePwd").css('display','block');
    //     $(".showPwd").css('display','none');
    
    //     $('.showPwd').toggleClass('showPwd1');
    //     $('.hidePwd').toggleClass('hidePwd1');
    //     return $('#newPass').attr('type', 'text');
    //   }

    showSignPass(){
        $(".hidePwd").css('display','none');
        $(".showPwd").css('display','block'); 
        
        $('.showPwd').toggleClass('showPwd1');
        $('.hidePwd').toggleClass('hidePwd1');
        return $('#newPass').attr('type', 'text');
    }
    hideSignPass(){
        $(".hidePwd").css('display','none');
        $(".showPwd").css('display','block');
        
        $('.showPwd').toggleClass('showPwd1');
        $('.hidePwd').toggleClass('hidePwd1');
        return $('#newPass').attr('type', 'password');
    }
    showConfirmPass(){
        $(".hidePwd2").css('display','block');
        $(".showPwd2").css('display','none');
        
        $('.showPwd2').toggleClass('showPwd3');
        $('.hidePwd2').toggleClass('hidePwd3');
        return $('#newPass2').attr('type', 'text');
    }
    hideConfirmPass(){
        $(".hidePwd2").css('display','none');
        $(".showPwd2").css('display','block');
        
        $('.showPwd2').toggleClass('showPwd3');
        $('.hidePwd2').toggleClass('hidePwd3');
        return $('#newPass2').attr('type', 'password');
    }
    
    showCurrentPass(){
        $(".hidePwd4").css('display','block');
        $(".showPwd4").css('display','none');
        
        $('.showPwd4').toggleClass('showPwd5');
        $('.hidePwd4').toggleClass('hidePwd5');
        return $('#oldPass').attr('type', 'text');
    }
    hideCurrentPass(){
        $(".hidePwd4").css('display','none');
        $(".showPwd4").css('display','block'); 
        
        $('.showPwd4').toggleClass('showPwd5');
        $('.hidePwd4').toggleClass('hidePwd5');
        return $('#oldPass').attr('type', 'password');
    }
    render(){
        return(
            <div>
            < Header />   
            < BreadCrumbs />
            <div className="container">            
            <Message messageData={this.state.messageData} />

                <div className="col-12 NoPadding">

                {/* <div className="container"> */}

                    <Loader type="fullpageloader" /> 
                    <br/>
                   <div className="row"> 
                    <div className="col-12 col-xl-3 col-md-12">
                        <Sidebar />
                    </div>
                    <div className=" col-12 col-xl-9 col-md-12 NOpadding mt25">
                        <h4 className="accountTitle">Account Information</h4>
                        <div className="col-12 mt15">
                            <form id="editAccount">
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <label className="mt15">First Name <i className="requiredsign">*</i></label><br />
                                        <div id="firstName" className="col-xl-12 col-md-12 col-sm-12 col-xs-12 col-12 NOpadding">
                                            <input maxLength="25" type="text" name="firstName"  ref="firstName" value={this.state.firstName} onChange={this.onChange.bind(this)} className="col-xl-12 col-md-12 col-sm-12 col-xs-12 form-control" required/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="mt15">Last Name <i className="requiredsign">*</i></label><br />
                                        <div id="lastName" className="col-12 NOpadding">
                                            <input maxLength="25" type="text" name="lastName"  ref="lastName" value={this.state.lastName} onChange={this.onChange.bind(this)} className="col-xl-12 col-md-12 col-sm-12 col-xs-12 form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="mt15">Mobile Number<i className="requiredsign">*</i></label><br />
                                        <div id="mobNumber" className="col-12 NOpadding">
                                            <input className="col-12 form-control" type="text" maxLength="10" ref="mobNumber" name="mobNumber" id="mobNumber" placeholder="Eg. 9876543210"
                                                 value={this.state.mobNumber}  onChange={this.onChange.bind(this)} required/>
                                        </div>
                                    </div>    
                                    <div className="col-12">   
                                    <div className="col-12 col-md-6"> 
                                        <div className="col-12 mt15 NOpadding">
                                            <input type="checkbox" id="changeEmail" checked={this.state.changeEmail} onChange={this.changeEmail.bind(this)}/> &nbsp; <span>Change Email</span>
                                        </div> 
                                        <div className="col-12 mt15 NOpadding">
                                            <input type="checkbox" id="changePassword" checked={this.state.changePassword} onChange={this.changePassword.bind(this)}/> &nbsp; <span>Change Password</span>
                                        </div>
                                        <div id="credentials" className="col-12 mt15 NOpadding">
                                        <div className="col-12 mt15 NOpadding">
                                            <h4>{(this.state.changeEmail === true && this.state.changePassword === true? 'Change Email and Password' : (this.state.changeEmail === true ? 'Change Email' : (this.state.changePassword === true? 'Change Password' :"")))}</h4>
                                        </div>

                                        {
                                            this.state.changeEmail === true?
                                            <div>
                                                <label className="mt15">Email <i className="requiredsign">*</i></label><br />
                                                <div id="emailId" className="col-12 NOpadding">
                                                    <input type="email" name="emailId"  ref="emailId" value={this.state.emailId} 
                                                    onChange={this.onChange.bind(this)} className="col-12 col-md-8 form-control" />
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                        
                                        {
                                            this.state.changeEmail === true || this.state.changePassword === true?
                                            <div>
                                                <label className="mt15">Current Password <i className="requiredsign">*</i></label><br />
                                                <div  id="oldPassword" className="col-12 NOpadding">
                                                    <input type="text" id="oldPass" type="password" name="oldPassword"  ref="oldPassword" value={this.state.oldPassword} onChange={this.onChange.bind(this)} className="col-xl-8 col-md-8 col-sm-12 col-xs-12 form-control" />
                                                    <div className="showHideEyeDiv">
                                                        <i className="fa fa-eye showPwd4 showEyeupSign" aria-hidden="true" onClick={this.showCurrentPass.bind(this)}></i>
                                                        <i className="fa fa-eye-slash hidePwd4 hideEyeSignup " aria-hidden="true" onClick={this.hideCurrentPass.bind(this)}></i>
                                                    </div> 
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                        
                                        {
                                            this.state.changePassword === true?
                                            <div>
                                                <label className="mt15">New Password <i className="requiredsign">*</i></label><br />
                                                <div id="newPassword" className="col-12 NOpadding">
                                                    <input type="password" id="newPass" name="newPassword"  ref="newPassword" value={this.state.newPassword} onChange={this.onChange.bind(this)} className="col-xl-8 col-md-8 col-sm-12 col-xs-12 form-control newPassword" />
                                                    <div className="showHideEyeDiv">
                                                        <i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
                                                        <i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
                                                    </div> 
                                                </div>
                                                <label className="mt15 col-12 NOpadding">Confirm New Password <i className="requiredsign">*</i></label><br />
                                                <div id="newPassword2" className="col-12 NOpadding">
                                                    <input type="password" id="newPass2" name="newPassword2"  ref="newPassword2" value={this.state.newPassword2} onChange={this.onChange.bind(this)} className="col-xl-8 col-md-8 col-sm-12 col-xs-12 form-control" />
                                                    <div className="showHideEyeDiv">
                                                        <i className="fa fa-eye showPwd2 showEyeupSign" aria-hidden="true" onClick={this.showConfirmPass.bind(this)}></i>
                                                        <i className="fa fa-eye-slash hidePwd2 hideEyeSignup " aria-hidden="true" onClick={this.hideConfirmPass.bind(this)}></i>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                        </div>
                                        </div>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <button className="btn globalCommonBtn editAccount col-xl-3 col-md-3 col-sm-3" onClick={this.updateUser.bind(this)}>Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                  </div>  
                </div>            
        </div>
        <Footer />   
        </div> 
        )
    }
}

export default EditAccount;