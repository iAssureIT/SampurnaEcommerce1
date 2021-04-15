import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import swal from 'sweetalert';
import $ from "jquery";

import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

class ForgotPassword extends Component {
    constructor(){
      super();
      this.state ={
        email  : '',
        mobile  : '',
        // subscription    : {
        //   user: Meteor.subscribe("userfunction"), 
        // }
      }
    }
    componentDidMount(){
      var x = this.props.match.params;
      console.log('x',x);
    }
    forgotpassword(event){
      console.log('forgotpassword');
      event.preventDefault();
      var email = this.refs.enterEmail.value;
      var mobile = this.refs.enterMobNo.value;
      // console.log("email: ",email);
     this.setState({
      email : email,
      mobile : mobile,
     });
      var userOtp = 1 /*Meteor.users.findOne({"username":email})*/;
      // console.log("userOtp: ",userOtp);
     
     if(userOtp==1){
      var mobileotp = Math.floor(1000 + Math.random() * 9000);
      var emailotp = Math.floor(100000 + Math.random() * 900000);
  //       // Session.set('mobotp',mobileotp);
  ///////////////
  //       // Session.set('mailotp',emailotp);
        
  //       var newID = userOtp._id;

  ///////////////

  //       // Session.set('newID',newID);

  //       Meteor.call('addOTP', newID , emailotp, function(error,result){
  //         if(error){
  //           Bert.alert(error);
  //         }else{

  //         }
  //       });
      
  //       // //Send OTP    
  //       // Meteor.call('sendOtp',mobile,mobileotp,
  //       // function(error,result){
  //       //   if(error){
  //       //     console.log(error.reason);
  //       //   }else{
  //       //     swal('Successfully sent the OTP to your mobile number');
  //       //   }
  //       // });
                             
        // // SEND EMAIL VERIFICATION LINK
        // Meteor.call('sendVerificationLinkToUser', email, function(error,result){
        //   if(error){
        //     Bert.alert(error);
        //   }else{ 
        //     swal({text:'Successfully sent the OTP to your Email Address.', showConfirmButton: true,type     : 'success'});                  
        //   } //end else
        // }); // send verification mail ends
        //    FlowRouter.go('/forgotOTPVarification/'+newID);
        // // $('.confirnModalWrap').addClass('newPassword');
        // // $('.NewForgotPasswordWrap').css('display','none');

      }else{
        swal('Email Address not found',"Please enter valid Email Id","warning");                  
      }
    }

    inputEffect(event){
      event.preventDefault();
      if($(event.target).val() != ""){
        $(event.target).addClass("has-content");
      }else{
        $(event.target).removeClass("has-content");
      }
    }

  render(){
     var projectName = process.env.REACT_APP_PROJECT_NAME ? process.env.REACT_APP_PROJECT_NAME : '';
        var customClass = 'defaultBgImg';
        if(projectName !== ''){
          customClass = projectName+'BgImg';
        }

    return(
       <div style={{'height': window.innerHeight+'px', 'width': window.innerWidth+'px'}} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper "+customClass}>
        <div  className="col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-12 col-xs-12 formShadow">
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
              <h3>Forgot Password</h3>
          </div>
            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 line-height">Please enter your registered email address below to receive an OTP.</p>
               <form id="forgotPassword" onSubmit={this.forgotpassword.bind(this)}>
                  <div className="textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 mt30" >
                    <label className="fontWeight900">Email ID</label><label className="astricsign">*</label>
                    <input type="email" className="form-control col-lg-12 col-md-12 col-sm-12  col-xs-12" ref="enterEmail" name="enterEmail" onBlur={this.inputEffect.bind(this)} aria-label="Email Id" aria-describedby="basic-addon1" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" title="Please add '.' and enter only 2 or 3 characters following '.'!" required/>
                  </div>
                  
                   <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 mb25">
                    <Link to='/confirm-otp'>
                      <button type="submit" className="btn font12 loginBtn resetBtn col-lg-12 col-md-12 col-sm-12 col-xs-12">Send OTP</button>
                    </Link>
                  </div>
                   <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25">
                    <div className="row loginforgotpass textAlignCenter">
                     <a href='/' className="">Sign In</a>
                    </div>
                  </div>
            </form>
              
            
         
        </div>
      </div>
    );
  }
}
export default ForgotPassword;