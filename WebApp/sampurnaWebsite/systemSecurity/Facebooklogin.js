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
facebookResponse = (response) => {
  console.log(response);
}
responseFacebook1 = (response) => {
  console.log("response facebook =",response);
  if(response && response.userID){
    this.setState({
      "isloggedIn" : true ,
      "userID"     : response.userID,
      "name"       : response.name,
      "email"      : response.email,
      "picture"    : response.data.picture.data.url,
    })

    var userDetails = {
      firstname	: response.name,
      lastname	: verifyOtpResponse.data.userDetails.lastName,
      email		  : response.email,
      mobNumber : "",
      user_id		: response.userID,
      roles		  : "user",
      token		  : response.token,
    }

      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      swal('Congratulations! You have been successfully Login, Now you can place your order.')
  }
}
responseFacebook(response) {
  console.log(response);
}
render() {
    return (
            <div className="col-12 NoPadding">
              {/* <FacebookLogin
                  appId="507698857234444"
                  autoLoad={true}
                  fields="name,email,picture"
                  onClick={this.responseFacebook}
                  callback={this.facebookResponse}
                  language="en_US"
              /> */}
                <FacebookLogin
                  appId="507698857234444"
                  // autoLoad={true}
                  fields="name,email,picture"
                  scope="public_profile,email"
                  callback={this.responseFacebook}
                />
            </div>
    );
  }
}

  export default Facebooklogin;
