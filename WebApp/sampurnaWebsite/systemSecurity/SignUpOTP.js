import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
import axios from 'axios';
import Image from 'next/image';
import { connect } from 'react-redux';
import OtpInput from 'react-otp-input';
import { bindActionCreators }     from 'redux';
import {getForm,updateForm} from '../redux/actions';

class SignUpOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID  : "",
      otp     : '' 
    }
  }

  handleChange = (otp) => this.setState({ otp });

  componentDidMount() {
    var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
          var userID                = userDetails.user_id; 
        }
  }
 
  openSignInModal(event){
		event.preventDefault();
		this.props.updateFormValue("login");	
  }
  
  render() {
    return (
        <div className="col-12 NoPadding signUpOtpWrapper">
              <div className="col-12 innloginwrap mb25">
                <h4>Confirm OTP</h4>
              </div>
              <div className="col-12">
                <OtpInput
                    className="col-2 otpInputBox"
                    value={this.state.otp}
                    onChange={this.handleChange}
                    numInputs={4}
                    separator={<span>-</span>}
                    // inputStyle={none}
                />
              </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
	  formToShow     : state.formToShow,
	}
  }
  
  const mapDispachToProps = (dispatch) => {
	return  bindActionCreators({formToShow :getForm, updateFormValue: updateForm}, dispatch)
  }

  export default connect(mapStateToProps, mapDispachToProps)(SignUpOTP);
