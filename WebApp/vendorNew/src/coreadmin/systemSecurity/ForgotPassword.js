import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';

class ForgotPassword extends Component {
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
        var windowHeight = window.innerHeight;
        console.log("windowHeight===",windowHeight);
        var height = windowHeight - 460;
        var marginHeight = height/2;
        console.log("marginHeight===",marginHeight);
        // $('.formShadow').style("margin-top": marginHeight);
        $('.formShadow').css({
        'margin-top': (marginHeight),
        'margin-bottom': (marginHeight)
        });
            this.validation();
        }

    // sendLink(event) {
    //     event.preventDefault();
    //     var email = this.refs.emailLink.value;
    //     var formValues = {
    //         username : email,
    //         "emailSubject"	: "Email Verification", 
	// 		"emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
    //     }
    //     if($('#resetPass').valid()){
    //         document.getElementById("sendlink").innerHTML = 'Please wait...';
    //         $('.fullpageloader').show();
    //         axios.patch('/api/auth/patch/setsendemailotpusingEmail/'+email, formValues)
    //         .then((response)=>{
    //             document.getElementById("sendlink").innerHTML = 'Reset Password';
    //             localStorage.setItem('previousUrl' ,'forgotpassword');
    //             var sendData = {
    //                 "event": "5",
    //                 "toUser_id": response.data._id,
    //                 "toUserRole": "user",
    //                 "variables": {
    //                 "Username": response.data.profile.fullName,
    //                 "OTP": response.data.profile.otpEmail,
    //                 }
    //             }
    //             axios.post('/api/masternotifications/post/sendNotification', sendData)
    //             .then((res) => {
    //                 console.log('sendDataToUser in result==>>>', res.data)
    //             })
    //             .catch((error) => { console.log('notification error: ', error) })

    //             $('.fullpageloader').hide();
    //             swal("OTP sent to your registered Email ID.");
    //             this.props.history.push('/confirm-otp/'+response.data.userID);
    //         })
    //         .catch((error)=>{
    //             document.getElementById("sendlink").innerHTML = 'Reset Password';
    //             swal("This Email ID is not registered");
    //             $('.fullpageloader').hide();
    //         })
    //     }
    // }

    sendLink(event) {
        event.preventDefault();
        
        var email = this.refs.emailLink.value;
        var formValues = {
            username : email,
            "emailSubject"	: "Email Verification", 
			"emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
        }
        if($('#resetPass').valid()){
            document.getElementById("sendlink").innerHTML = 'Please wait...';
            $('.fullpageloader').show();
            axios.patch('/api/auth/patch/setsendemailotpusingEmail/'+email, formValues)
            .then((response)=>{
                console.log("response",response);
                if(response.data.message === "OTP_UPDATED"){
                    document.getElementById("sendlink").innerHTML = 'Reset Password';
                    localStorage.setItem('previousUrl' ,'forgotpassword');
                    $('.fullpageloader').hide();
                    swal("OTP send to your registered email ID.");
                    this.props.history.push('/confirm-otp/'+response.data.ID);
                }else if(response.data.message === "NOT_REGISTER"){
                    document.getElementById("sendlink").innerHTML = 'Send OTP';
                    swal("This Email Id is not registered.");
                }else if(response.data.message === 'OTP_NOT_UPDATED'){
                    document.getElementById("sendlink").innerHTML = 'Send OTP';
                    swal("Something went wrong. Please contact admin");
                }
            })
            .catch((error)=>{
                document.getElementById("sendlink").innerHTML = 'Send OTP';
                swal("This Email ID is not registered");
                $('.fullpageloader').hide();
            })
        }
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

    validation() {
        $.validator.addMethod("regxemail", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid email address.");


        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });

        $("#resetPass").validate({
            rules: {
                emailLink: {
                    required: true,
                    regxemail: /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
                },
            },
            errorPlacement: function (error, element) {

                if (element.attr("name") === "emailLink") {
                    error.insertAfter("#emailLink");
                }
            }
        });
    }
    render() {
        var projectName = process.env.REACT_APP_PROJECT_NAME ? process.env.REACT_APP_PROJECT_NAME : '';
        var customClass = 'defaultBgImg';
        if(projectName !== ''){
          customClass = projectName+'BgImg';
        }
    
        return (
            <div style={{'height': window.innerHeight+'px', 'width': window.innerWidth+'px'}} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper "+customClass}>
                
                <div className="col-lg-7 col-md-7 col-sm-6 col-xs-12">
                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 adminLOgo">
                            <img src="images/admin/sampurnaLogo.png " className="col-lg-12" />
                    </div>
                    <div className="col-lg-12 loginLeftImg hidden-xs">
                        <img src="images/admin/1.png" className="col-lg-6 col-lg-offset-2"/>
                    </div>
                </div>
                <div  className="col-lg-4 col-md-5 col-sm-5 col-xs-12 formShadow">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
                        <h3>Forgot Password</h3>
                    </div>
                    {
                        this.state.showMessage === false ? 
                        <div>
                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25">Please enter your registered email address below to receive an OTP.</p>
                            <form id="resetPass">
                                {/* <div className="textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25" >
                                    <label className="">Email ID</label><label className="astricsign">*</label>
                                    <input className="form-control col-lg-12 col-md-12 col-sm-12  col-xs-12" placeholder="Email ID" ref="emailLink" name="emailLink" type="text" />
                                    <div id="emailLink"></div>
                                </div> */}
                                <div id="emailLink" class="input-group customeInput-group " >
                                    <span class="input-group-addon"><i className="fa fa-user-o"></i></span>
                                    <input  type="text" className="form-control" onChange={this.handleChange} ref="emailLink" name="emailLink" placeholder="Email ID" required/>
                                </div>

                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt10">
                                    <div className="row loginforgotpass textAlignLeft">
                                        <a href='/login' className="">Sign In</a>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 mt25 mb25 pull-right NOpadding">
                                    <button id="sendlink" className="btn resetBtn col-lg-12 col-md-12 col-sm-12 col-xs-12" onClick={this.sendLink.bind(this)}>Send OTP </button>
                                </div>
                                

                                {/* <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 mt25 mb25">
                                    <button id="sendlink" className="btn resetBtn" onClick={this.sendLink.bind(this)}>Send OTP</button>
                                </div> */}
                                
                            </form>
                        </div>
                        :
                        <div>
                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25">We have sent a reset password link to your email account.</p>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                                <div className="row loginforgotpass textAlignCenter">
                                    <a href='/login' className="">Sign In</a>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ForgotPassword;