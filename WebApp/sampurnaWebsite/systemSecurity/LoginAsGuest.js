import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
import axios from 'axios';
import Image from 'next/image';

class LoginAsGuest extends Component {
  constructor(props) {
    super(props);
        this.state = {
            userID  : "",
        }
}

componentDidMount() {
    var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
          var userID                = userDetails.user_id; 
        }
}

getRandomInt=(min, max)=>{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

customerloginAsGuest(event){
    event.preventDefault();
    var formValues = {
        firstname   : "",
        lastname    : "",
        mobNumber   : "",
        pincode     : "",
        email       : "",
        pwd         : "guest"+this.getRandomInt(1000, 9999),
        role        : 'user',
        status      : 'active',
        countryCode : "",
        authService : "guest"
      }
    console.log("inside guest login=");
    axios.post("/api/auth/post/signup/guest_login",formValues)
    .then((guestResponse)=>{
        if(guestResponse){
            console.log("guestResponse==",guestResponse.data);
            swal("Thank You", "You have been successfuly logged in as guest");
            window.location.reload();
        }
    })
    .catch((error)=>{
        console.log("Error while guest login=",error);
    })

}

  verifyOTP(event){
    event.preventDefault();
    var userDetails     =  JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
        const mobileOTP = this.state.otp;
        console.log("mobileOTP=",mobileOTP);
        console.log("verifyOTP userDetails===",userDetails);
        axios.get("/api/auth/get/checkmobileotp/usingID/"+userDetails.userId+"/"+mobileOTP)
        .then((verifyOtpResponse)=>{
            if(verifyOtpResponse){
                console.log("verifyOtpResponse==",verifyOtpResponse);
                var userDetails = {
                    firstname	: verifyOtpResponse.data.userDetails.firstName,
                    lastname	: verifyOtpResponse.data.userDetails.lastName,
                    email		: verifyOtpResponse.data.userDetails.email,
                    mobNumber   : verifyOtpResponse.data.userDetails.mobile,
                    pincode		: verifyOtpResponse.data.userDetails.pincode,
                    user_id		: verifyOtpResponse.data.userDetails.user_id,
                    roles		: verifyOtpResponse.data.userDetails.roles,
                    token		: verifyOtpResponse.data.userDetails.token,
                }
                    localStorage.setItem('userDetails', JSON.stringify(userDetails));
                    swal('Congratulations! You have been successfully Login, Now you can place your order.')
                    window.location.reload();
            }
        })
        .catch((error)=>{
            console.log("error while resending otp==",error);
        })
    }

  }

  render() {
    return (
        <div className="col-12 NoPadding">
              <button className="btn guestBtn col-12 NoPadding" onClick={this.customerloginAsGuest.bind(this)}>Login As a Guest</button>
        </div>
    );
  }
}

  export default LoginAsGuest;
