import React, { Component } from 'react';
import swal 				from 'sweetalert';
import $ 					from "jquery";
import axios 				from 'axios';
import Image 				from 'next/image';
import FacebookLogin 		from 'react-facebook-login';

class Facebooklogin extends Component{
	
	constructor(props){
		super(props);
		this.state = {
			"userID"  : "",
			"name"    : "",
			"emaiil"  : "",
			"picture" : "",
		}
	}

	componenClicked = ()=>{

	}
	
	buttonClicked = ()=>{

	}

	responseFacebook(response){

		if(response){
			var formValues = {
				firstname   	: response.name && response.name.split(' ')[0],
				lastname    	: response.name && response.name.split(' ')[1],
				mobNumber   	: "",
				pincode     	: "",
				email       	: response.email,
				pwd         	: response.email,
				role        	: 'user',
				status      	: 'active',
				countryCode 	: "",
				authService 	: "facebook",
				social_media_id : response.id
			}
    
			window.FB.logout();

			axios.post('/api/auth/post/signup/social_media',formValues)
				.then((signupResponse)=>{
					if(signupResponse?.data){
						var userDetails = {
							firstname   : signupResponse.data.userDetails.firstName,
							lastname    : signupResponse.data.userDetails.lastName,
							companyID   : parseInt(signupResponse.data.userDetails.companyID),
							email       : signupResponse.data.userDetails.email,
							mobNumber   : signupResponse.data.userDetails.phone,
							pincode     : signupResponse.data.userDetails.pincode,
							user_id     : signupResponse.data.userDetails.user_id,
							roles       : signupResponse.data.userDetails.roles,
							token       : signupResponse.data.userDetails.token,
							authService : signupResponse.data.authService,
						}
				        localStorage.setItem('userDetails', JSON.stringify(userDetails));
						window.location.reload();
				    }
			    })
				.catch((error)=>{

				})
		}
	}

	render(){
	    return(
            <div className="col-12 NoPadding" onClick={this.buttonClicked}>
                <FacebookLogin
					textButton	= "Continue with Facebook"
					appId		= "507698857234444"
					autoLoad	= {false}
					fields		= "name,email,picture"
					scope		= "public_profile,email"
					callback	= {this.responseFacebook}
					onClick     = {this.componenClicked}
					className	= "facebookBtnWrapper"
					language	= "en_US"
				/>
            </div>
    	);
  	}
}

export default Facebooklogin;