import React, { Component } from 'react';
import swal                 from 'sweetalert';
import axios                from 'axios';
import Image                from 'next/image';
import { GoogleLogin }      from 'react-google-login';


class Googlelogin extends Component{

	constructor(props){
	    super(props);
			this.state = {
				userID  : "",
			}
	}

	responseGoogle(response){
		if(response){
			var formValues = {
				firstname   	: response.profileObj.givenName,
				lastname    	: response.profileObj.familyName,
				mobNumber   	: "",
				pincode     	: "",
				email       	: response.profileObj.email,
				pwd         	: response.profileObj.email,
				role        	: 'user',
				status      	: 'active',
				countryCode 	: "",
				authService 	: "google",
				social_media_id	: response.profileObj.googleId
			}
    
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
			<div className="col-12 NoPadding">
				<GoogleLogin
					clientId		= "289838416253-abo3h9t3cktstph4mp30vliol7d3ene5.apps.googleusercontent.com"
					onSuccess		= {this.responseGoogle.bind(this)}
					// onFailure		= {responseGoogle}
					cookiePolicy	= {'single_host_origin'}
					isSignedIn		= {false}
					className		= "googleBgColor d-flex justify-content-center"
				>
					<span className="googleTextWrapper">Continue With Google</span>
				</GoogleLogin>
			</div>
    	);
  	}
}

export default Googlelogin;