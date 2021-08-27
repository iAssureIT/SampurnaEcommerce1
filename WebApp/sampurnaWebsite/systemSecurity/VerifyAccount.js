import React, { Component } 	from 'react';
import { Link }					from 'react-router-dom';
import InputMask				from 'react-input-mask';


import 	'font-awesome/css/font-awesome.min.css';


class VerifyAccount extends Component{

	render(){
		var winHeight = window.innerHeight;
		return(
			<div style={{'height': window.innerHeight+'px'}} className="col-12 signUpWrapper">
				<div className="col-12 col-lg-4 col-lg-offset-4 signupPadding signUpFormWrap bg-success" style={{"height": winHeight}}>
					<div className="col-12 divVerifyEmailWrap">
						<div className="col-12 forgotpwd verifypd">
							<form id="OTPMobMail">
								<h3 className="signInNameTitle"><span className="bordbt">VERIFY ACCOUNT</span></h3>
								<div className="col-12 text-center otpHeader">
									<span>Enter Mobile Number that you used for creating Account</span>
								</div>
								<div className="col-12 form-group pdleftclr veribtm">
									<div className="input-effect input-group">
										<InputMask mask="9999-999-999" maskChar="" name="mobileVerifyAOS" ref="mobileVerifyAOS" /*onChange={this.handleChange}*/ className="form-control col-12 inputText" pattern="^(0|[0-9-+]*)$" title="Enter Mobile Numbers!" autoComplete="off" required />
										<span className="input-group-addon glyphi-custommm"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
										<span className="focus-border"><i></i></span>
									</div>
								</div>
								<div className="col-12 submitButtonWrapper pdleftclr">
									<button type="submit" className="col-12 btn btn-info submitBtn UMloginbutton">Submit</button>
								</div>
								<div className="col-4 pdcls">
									<Link to='/' className="col-12 UMGrey signInbtn pdleftclr">Sign In</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default VerifyAccount;