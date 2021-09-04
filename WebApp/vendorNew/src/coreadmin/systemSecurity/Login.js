import React, { Component }                           	from 'react';
import { connect }                                    	from 'react-redux';
import { BrowserRouter, Route, Switch,Link,location } 	from 'react-router-dom';
import $                                              	from 'jquery';
import axios    										from 'axios';
import jQuery   										from 'jquery';
import swal     										from 'sweetalert';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';
import 'jquery-validation';

class Login extends Component {
	constructor() {
		super();
		this.state = {
			btnLoading 	: false,
			loggedIn 	: false,
			auth 		: {
								email 	: '',
								pwd 	: '',
			},
			messageData : {
								"type" 	: "",
			}
		}
	}

	/**=========== componentDidMount() ===========*/
	componentDidMount() {
		var windowHeight  = window.innerHeight;
		var height        = windowHeight - 460;
		var marginHeight  = height/2;		
		// console.log("marginHeight => ",marginHeight);
		
		$('.formShadow').css({
			'margin-top' 	: (marginHeight),
			'margin-bottom' : (marginHeight)
		});

		$.validator.addMethod("regxemail", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter a valid email address.");

		jQuery.validator.setDefaults({
			debug 	: true,
			success : "valid"
		});
		$("#login").validate({
			rules: {
				loginusername : {
					required 	: true,
					regxemail 	: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
				},
				loginpassword : {
					required 	: true
				}
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") === "loginusername") {
					error.insertAfter("#loginusername");
				}
				if (element.attr("name") === "loginpassword") {
					error.insertAfter(".showHideSignDiv");
				}
			}
		});
	}

	/**=========== User Login() ===========*/
	userlogin(event) {
		event.preventDefault();
		var auth = {
			email 		: this.refs.loginusername.value,
			password 	: this.refs.loginpassword.value,
			role 		: "vendor"
		}

		if ($("#login").valid()) {
			document.getElementById("logInBtn").value = this.setState({ btnLoading: true });
			
			axios.post('/api/auth/post/login', auth)
			.then((response) => {
				console.log("User Login Response => ",response.data)
					// this.props.setGlobalUser(response.data.userDetails);
				if (response.data.userDetails.user_id) {
					this.setState({ btnLoading: false });
					var  userDetails = {
						firstName 			: response.data.userDetails.firstName, 
						lastName  			: response.data.userDetails.lastName, 
						email     			: response.data.userDetails.email, 
						phone     			: response.data.userDetails.phone, 
						city       			: response.data.userDetails.city,
						companyID  			: parseInt(response.data.userDetails.companyID),
						company_id			: response.data.company_id,
						locationID 			: response.data.userDetails.locationID,
						user_id   			: response.data.userDetails.user_id,
						roles     			: response.data.userDetails.roles,
						token     			: response.data.userDetails.token, 
						loginTokens 		: response.data.loginTokens ? response.data.loginTokens : "",
						loginTokensLastID 	: response.data.loginTokens ? response.data.loginTokens._id : ""
					}
					document.getElementById("logInBtn").value = 'Sign In';
					localStorage.setItem('userDetails', JSON.stringify(userDetails));
					
					// localStorage.setItem("loginTokensLastID",response.data.loginTokens._ID);
					// localStorage.setItem("token", response.data.token);
					// localStorage.setItem("companyID", userDetails.companyID);
					// localStorage.setItem("user_ID", userDetails.user_id);
					// localStorage.setItem("roles", response.data.roles);						
					// var token         = userDetails.token;

					axios.defaults.headers.common['Authorization'] = 'Bearer '+ response.data.userDetails.token;
					
					axios.get("/api/adminpreference/get")
					.then(preference =>{
						console.log("preferencedata => ",preference);

						var websiteModel 	= preference.data[0].websiteModel;
						var showLoginAs 	= preference.data[0].showLoginAs;
						var preferencedata 	= preference.data[0];
						console.log("preference.data, ===> ",preferencedata);

						localStorage.setItem("websiteModel",websiteModel);
						localStorage.setItem("showLoginAs",showLoginAs);
						localStorage.setItem("preferencedata",preferencedata);
					})
					.catch(error=>{
						console.log("error => ",error);
						if(error.message === "Request failed with status code 401"){
							var userDetails =  localStorage.removeItem("userDetails");
							localStorage.clear();
							swal({  
								title : "Your Session is expired.",                
								text  : "You need to login again. Click OK to go to Login Page"
							})
							.then(okay => {
								if (okay) {
									window.location.href = "/login";
								}
							});
						}
					}) 

					this.setState({
						loggedIn : true
					},()=>{
						this.props.history.push('/dashboard')
						window.location.reload();
					})

				}else if(response.data.message === "USER_BLOCK"){
					swal({
						text : "You are blocked by admin. Please contact Admin."
					});
					document.getElementById("logInBtn").value = 'Sign In';
				}else if(response.data.message === "NOT_REGISTER"){
					swal({
						text : "This Email ID is not registered. Please try again."
					});
					document.getElementById("logInBtn").value = 'Sign In';
				}else if(response.data.message === "INVALID_PASSWORD"){
					swal({
						text : "You have entered wrong password. Please try again."
					});
					document.getElementById("logInBtn").value = 'Sign In';
				}else if(response.data.message === "USER_UNVERIFIED"){
					swal({
						text : "You have not verified your account. Please verify your account."
					})
					.then((value)=>{
						var emailText = {
							"emailSubject"	: "Email Verification", 
							"emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
						}
						axios.patch('/api/auth/patch/setsendemailotpusingEmail/'+this.refs.loginusername.value, emailText)
						.then((response)=>{
							swal("We send you a Verification Code to your registered email. Please verify your account.");
							this.props.history.push("/confirm-otp/" + response.data.userID);
						})
						.catch((error)=>{
							swal(" Failed to sent OTP");
						})    
					});
					// document.getElementById("logInBtn").value = 'Sign In';
					this.setState({ btnLoading : false });
				}
			})
			.catch((error) => {
				console.log("error => ",error);
				swal({
					text : "Please enter valid Email ID and Password"
				})
				this.setState({ btnLoading: false });
			});
		}
	}

	/**=========== showSignPass() ===========*/
	showSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('#loginpassword').attr('type', 'text');
	}

	/**=========== hideSignPass() ===========*/
	hideSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('#loginpassword').attr('type', 'password');
	}

	/**=========== Hide / Show Password ===========*/
	showCurrentPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('#loginpassword').attr('type', 'text');
	}

	hideCurrentPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('#loginpassword').attr('type', 'password');
	}

	/**=========== Closepagealert() ===========*/
	Closepagealert(event) {
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

	/**=========== render() ===========*/
	render() {
		var projectName = process.env.REACT_APP_PROJECT_NAME 
						? 
							process.env.REACT_APP_PROJECT_NAME 
						: 
							'';

		var customClass = 'defaultBgImg';
		
		if(projectName !== ''){
			customClass = projectName + 'BgImg';
		}

		return (
			<div style={{'height': window.innerHeight + 'px', 'width': window.innerWidth + 'px'}} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper "+customClass}>
				{/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap"></div> */}
				<div className="col-lg-7 col-md-7 col-sm-6 col-xs-12">
					<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 adminLOgo">
						<img src="images/admin/trollymart-black.png" className="col-lg-12" />
					</div>
					<div className="col-lg-12 loginLeftImg hidden-xs">
						<img src="images/admin/1.png" className="col-lg-6 col-lg-offset-2"/>
					</div>
				</div>
				<div className="col-lg-5 col-md-5 col-sm-6 col-xs-12">         
					<div className="col-lg-12 col-sm-12 col-xs-12">
						<div className="col-lg-12 col-sm-12 col-xs-12 formShadow">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
									<h3 className="adminTitle">Vendor</h3>
									<h3>Sign In</h3>
								</div>
								<form id="login" onSubmit={this.userlogin.bind(this)}>
									{/* <div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mt25">
										<label>Email ID</label><label className="astricsign">*</label>
										<input type="email" className="form-control" onChange={this.handleChange} ref="loginusername" id="loginusername" name="loginusername" placeholder="Email ID" required />
									</div> */}
									{/* <div className="textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mb25">
										<label>Password</label><label className="astricsign">*</label>
										<input type="password" className="form-control" ref="loginpassword" name="loginpassword" id="loginpassword" placeholder="Password" required />
										<div className="showHideSignDiv">
											<i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
											<i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
										</div>
									</div> */}
										{/* <div className="col-12 NOpadding loginInputWrapper"> */}
										<div id="loginusername" className="input-group customeInput-group " >
											<span className="input-group-addon"><i className="fa fa-user-o"></i></span>
											<input  type="text" className="form-control" onChange={this.handleChange} ref="loginusername" name="loginusername" placeholder="Email ID" required/>
										</div>										
										<div className="input-group customeInput-group">
											<span className="input-group-addon"><i className="fa fa-lock"></i></span>
											<input id="loginpassword" type="password" className="form-control" ref="loginpassword" name="loginpassword"  placeholder="Password" required />
											<span className="input-group-addon addons glyphi-custommm padBoth" id="basic-addon1">
												<i className="fa fa-eye Pass showPwd" aria-hidden="true" onClick={this.showCurrentPass.bind(this)}></i>
												<i className="fa fa-eye-slash Pass hidePwd" aria-hidden="true" onClick={this.hideCurrentPass.bind(this)}></i>
											</span>
										</div>
									
									{/* <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 NOpaddingRight">
										<input id="logInBtn" type="submit" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn loginBtn" value="Sign In" />
									</div> */}
									{this.state.btnLoading
									?
										<div className="col-lg-3 col-lg-offset-4 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 NOpaddingRight ">
											<div align="center" className="cssload-fond">
												<div className="cssload-container-general">
														<div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_1"> </div></div>
														<div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_2"> </div></div>
														<div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_3"> </div></div>
														<div className="cssload-internal"><div className="cssload-ballcolor cssload-ball_4"> </div></div>
												</div>
											</div>
										</div>
									:
										<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding customeInput-group">
											<div className="loginforgotpass col-lg-6 col-md-6 col-sm-6 col-xs-12 NOpadding pull-left ">
												<a href='/forgotpassword' className="">Forgot Password?</a>
											</div>
											<div className="form-group textAlignCenter col-lg-4  col-md-4 col-sm-4 col-xs-12 pull-right NOpadding">
												<input id="logInBtn" type="submit" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn loginBtn" value="Sign In" />
											</div>
										</div>										
									}

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt30 mb25">
										<div className="row">
											{/* <div className="textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
												<div className="row loginforgotpass">
													<a href='/forgotpassword' className="">Forgot Password?</a>
												</div>
											</div> */}
											{process.env.REACT_APP_USERID 
											?
												<div className="col-lg-12 sampleTable">
													<div className="table-responsive col-lg-12 col-md-12">
														<table className="table table-bordered">
															<thead>
																<tr style={{"background":"#367EA8","color":"#fff","textAlign":'center'}}>
																	<th>Email</th>
																	<th>Password</th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	<td>{process.env.REACT_APP_USERID}</td>
																	<td>{process.env.REACT_APP_PWD}</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											:
												null
											}
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>					
				</div>
			</div>
		);
	}
}

export default Login;

// const mapStateToProps = (state)=>{
// 	console.log("state = ",state)
// 	return {
// 		userDetails   : state.userDetails,
// 	}
// };


// const mapDispatchToProps = (dispatch)=>{
//   	return {
//       	setGlobalUser : (userDetails)=> dispatch({
// 			type      	: "SET_GLOBAL_USER",
// 			userDetails : userDetails,
// 		}),
//   	}
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Login);