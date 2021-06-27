import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
import axios from 'axios';
import Image from 'next/image';

import FacebookLogin from 'react-facebook-login';

class Facebooklogin extends Component {
  constructor(props) {
    super(props);
        this.state = {
            "userID"  : "",
            "name"    : "",
            "emaiil"  : "",
            "picture" : "",
        }
}

componentDidMount() {
    var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
          var userID                = userDetails.user_id; 
        }
}
responseFacebook = (response) => {
  console.log("response facebook =",response);
  if(response && response.userID){
    this.setState({
      "isloggedIn" : true ,
      "userID"     : response.userID,
      "name"       : response.name,
      "email"      : response.email,
      "picture"    : response.data.picture.data.url,
    })
  }
}
componentClicked = ()=>{
  console.log("clicked");
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
              <FacebookLogin
                  appId="507698857234444"
                  autoLoad={true}
                  fields="name,email,picture"
                  onClick={this.componentClicked}
                  callback={this.responseFacebook}
                  language="en_US"
              />
            </div>
      // <div className="col-12 NoPadding">
      //     {this.state.isloggedIn?
      //       <div className="col-12 NoPadding">
      //         <FacebookLogin
      //             appId="507698857234444"
      //             autoLoad={true}
      //             fields="name,email,picture"
      //             onClick={this.componentClicked}
      //             callback={this.responseFacebook}
      //             language="en_US"
      //         />
      //       </div>
      //     :
      //     <div className="col-12 NoPadding"></div>
      //     }
      //   </div>
    );
  }
}

  export default Facebooklogin;
