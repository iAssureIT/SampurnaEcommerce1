import React, { Component } from 'react';
import swal from 'sweetalert';
import axios from 'axios';

class LoginAsGuest extends Component {
  constructor(props) {
    super(props);
        this.state = {
            userID  : "",
        }
}

componentDidMount() {
    var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
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
    axios.post("/api/auth/post/signup/guest_login",formValues)
    .then((guestResponse)=>{
        if(guestResponse){
            console.log("guestResponse==",guestResponse.data);
            var userDetails = {
                firstName	: guestResponse.data.userDetails.firstName,
                lastName	: guestResponse.data.userDetails.lastName,
                email		: guestResponse.data.userDetails.email,
                phone       : guestResponse.data.userDetails.mobile,
                pincode		: guestResponse.data.userDetails.pincode,
                user_id		: guestResponse.data.userDetails.user_id,
                roles		: guestResponse.data.userDetails.roles,
                token		: guestResponse.data.userDetails.token,
                authService : guestResponse.data.authService,
            }
            localStorage.setItem('userDetails', JSON.stringify(userDetails));
            // swal({text:'Congratulations! You have been successfully logged in as guest, Now you can place your order.'})
            // .then(function(){
            // window.location.reload();
            // });
            window.location.reload();
        }
    })
    .catch((error)=>{
        console.log("Error while guest login=",error);
    })
}

render() {
    return (
        <div className="col-12 NoPadding">
              <button className="btn guestBtn col-12 NoPadding" onClick={this.customerloginAsGuest.bind(this)}>Continue As A Guest</button>
        </div>
    );
  }
}

export default LoginAsGuest;
