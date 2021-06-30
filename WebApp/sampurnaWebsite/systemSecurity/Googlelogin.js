import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
import axios from 'axios';
import Image from 'next/image';
import { GoogleLogin } from 'react-google-login';

const responseGoogle = (response) => {
    console.log(response);
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
}

class Googlelogin extends Component {
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

componentClicked(){

}
render() {
    return (
        <div className="col-12 NoPadding">
              <GoogleLogin
                clientId="289838416253-abo3h9t3cktstph4mp30vliol7d3ene5.apps.googleusercontent.com"
                // clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                // onLogoutSuccess={logout}
                
            />
        </div>
    );
  }
}

  export default Googlelogin;
