import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Button, Icon }       from "react-native-elements";
import CheckBox               from 'react-native-check-box'
import ValidationComponent    from "react-native-form-validator";
import axios                  from 'axios';
import { colors, sizes }      from '../../../AppDesigns/currentApp/styles/styles.js';
import Modal                  from "../../Modal/OpenModal.js";
import { Fumi }               from 'react-native-textinput-effects';
import FontAwesomeIcon        from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect }            from 'react-redux';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import commonStyles           from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import styles                 from '../../../AppDesigns/currentApp/styles/ScreenStyles/SystemSecurityStyles.js';


class RootSignup extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      isChecked: false,
      firstName: '',
      lastName: '',
      mobileNumber: '',
      pincode: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstNameError: [],
      lastNameError: [],
      mobileNumberError: [],
      pincodeError: [],
      emailError: [],
      passwordError: [],
      confirmPasswordError: [],
      isCheckedError: [],
      passwordMatch: '',
      showPassword: false,
      showConfirmPassword: false,
      btnLoading: false,
      openModal: false,

    };
  }

  handleOnChange = () => {
    let isChecked = !this.state.isChecked;
    this.setState({ isChecked }, () => {
      if (isChecked) {
        this.setState({ isCheckedError: [] });
      } else {
        this.setState({
          isCheckedError: ["Please accept the terms & conditions."]
        });
      }
    });
  }

  validInput = () => {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      pincode,
      password,
      confirmPassword,
    } = this.state;
    let valid = true;
    this.validate({
      firstName: {
        required: true,
        letters: true,
      },
      lastName: {
        required: true,
        letters: true,
      },
      email: {
        required: true,
        email: true,
      },
      mobileNumber: {
        required: true,
        mobileNo: true,
        minlength: 9,
        maxlength: 10
      },
      pincode: {
        required: true,
        pincode: true,
        minlength: 6,
        maxlength: 6
      },
      password: {
        required: true,
        minlength: 5,
      },
      confirmPassword: {
        required: true
      }
    });

    if (this.isFieldInError("firstName")) {
      let firstNameError = this.getErrorsInField("firstName");
      this.setState({ firstNameError });
      valid = false;
    } else {
      this.setState({ firstNameError: "" });
      valid = true;
    }
    if (this.isFieldInError("lastName")) {
      this.setState({ lastNameError: this.getErrorsInField("lastName") });
      valid = false;
    } else {
      this.setState({ lastNameError: "" });
      valid = true;
    }
    if (this.isFieldInError("mobileNumber")) {
      this.setState({ mobileNumberError: this.getErrorsInField("mobileNumber") });
      valid = false;
    } else {
      this.setState({ mobileNumberError: "" });
      valid = true;
    }
    if (this.isFieldInError("pincode")) {
      this.setState({ pincodeError: this.getErrorsInField("pincode") });
      valid = false;
    } else {
      this.setState({ pincodeError: "" });
      valid = true;
    }
    if (this.isFieldInError("email")) {
      this.setState({ emailError: this.getErrorsInField("email") });
      valid = false;
    } else {
      this.setState({ emailError: "" });
      valid = true;
    }
    if (this.isFieldInError("password")) {
      this.setState({ passwordError: this.getErrorsInField("password") });
      valid = false;
    } else {
      this.setState({ passwordError: "" });
      valid = true;
    }
    if (this.isFieldInError("confirmPassword")) {
      this.setState({
        confirmPasswordError: this.getErrorsInField("confirmPassword")
      });
      valid = false;
    } else {
      this.setState({ confirmPasswordError: "" });
      valid = true;
    }

    if (!this.state.isChecked) {
      this.setState({
        isCheckedError: ["Please accept the terms & conditions."]
      });
      valid = false;
    } else {
      this.setState({ isCheckedError: "" });
      valid = true;
    }

    if (this.state.passwordMatch != 'matched') {
      valid = false;
    }
    return ((!this.isFieldInError("password")) && (!this.isFieldInError("confirmPassword")) && (!this.isFieldInError("email")) && (!this.isFieldInError("mobileNumber")) && (!this.isFieldInError("firstName")) && (!this.isFieldInError("lastName")) && (this.state.isChecked) && (this.state.passwordMatch == 'matched'));
  };

  validInputField = (stateName, stateErr) => {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      pincode,
      password,
      confirmPassword,
    } = this.state;
    let valid = true;

    this.validate({
      [stateName]: {
        required: true,
      },
    });

    if (this.isFieldInError(stateName)) {
      let validinptError = this.getErrorsInField(stateName);
      this.setState({ validinptError });
      valid = false;
    } else {
      this.setState({ [stateErr]: "" });
    }
    return valid;
  };

  handleSubmit = () => {

    if (this.validInput()) {
      this.setState({ btnLoading: true })
      let {
        firstName,
        lastName,
        mobileNumber,
        pincode,
        email,
        password
      } = this.state;
      var emailId = email.toLowerCase();
      var mobileNo = '+91' + mobileNumber.split(' ')[1].split('-').join('')
      var formValues = {
        firstname:firstName,
        lastname:lastName,
        mobNumber: mobileNo,
        pincode: pincode,
        email:emailId,
        pwd: password,
        role:'user',
        status: 'unverified',
        // "emailSubject" : "Email Verification",
        // "emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
      }

      // console.log('formValues=====>>>',formValues);

      
      if(this.state.isChecked){
        // axios.post('/api/auth/post/signup/user/emailotp', formValues)
        // axios.post('/api/auth/post/signup/user/otp',formValues)
        axios.post('/api/auth/post/signup/user/otp',formValues)
        .then((response) => {
          this.setState({ btnLoading: false});
          if(response.data.message == 'USER_CREATED'){            
            console.log('response.data Result==>', response.data.result)
            // =================== Notification OTP ==================
            var sendData = {
              "event": "5",
              "toUser_id": response.data.ID,
              "toUserRole":"user",
                "variables": {
                  "Username" : response.data.result.profile.firstname,
                  "OTP" : response.data.result.profile.otpEmail,
                }
              }
              console.log('sendDataToUser==>', sendData)
              axios.post('/api/masternotifications/post/sendNotification', sendData)
              .then((res) => {
              console.log('sendDataToUser in result==>>>', res.data)
              })
              .catch((error) => { console.log('notification error: ',error)})
            // =================== Notification ==================
              var messageHead = "Great, Information submitted successfully";
              var messagesSubHead = "and OTP is sent to your registered Email.";
              this.props.openModal(true,messageHead,messagesSubHead,"success");
              AsyncStorage.multiSet([
                ['user_id_signup', response.data.ID],
              ])
            this.props.navigation('OTPVerification',{userID:response.data.ID,Username:response.data.result.profile.firstname});
          }else{
            var messageHead = response.data.message;
            var messagesSubHead = "";
            this.props.openModal(true,messageHead,messagesSubHead,"warning");
          }
        })
        .catch((error) => {
          console.log(error);
        })

      }else {
          this.setState({
            isCheckedError: ["Please accept the terms & conditions."]
          });
        }
    }
  }

  checkboxClick = () => {
    let isChecked = !this.state.isChecked;
    this.setState({ isChecked }, () => {
      if (isChecked) {
        this.setState({
          isCheckedError: []
        });
      } else {
        this.setState({
          isCheckedError: ["Please accept the terms & conditions."]
        });
      }
    });
  }

  displayValidationError = (errorField) => {
    let error = null;
    if (this.state[errorField]) {
      error = <View style={styles.errorWrapper}>
        <Text style={styles.errorText}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }

  displayTermsError = (errorField) => {
    let error = null;
    if (this.state[errorField].length > 0) {
      error = <View style={{ marginTop: -8, marginBottom: 5 }}>
        <Text style={styles.errorText}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }

  passwordChange = (value, key) => {
    this.setState({
      [key]: value,
    }, () => {
      if (this.state.password && this.state.confirmPassword) {
        if (this.state.password === this.state.confirmPassword)
          this.setState({ passwordMatch: 'matched' });
        else
          this.setState({ passwordMatch: 'not matched' });
      }

    });
  }

  handleMobileChange(value) {
    // console.log("value = ",value);
    if (value.startsWith && value.startsWith('+')) {
      value = value.substr(3);
    }
    let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    let y = x.input ? (!x[2] && !x[3]) ? '+91 ' + x[1] : (!x[3] ? '+91 ' + x[1] + '-' + x[2] : '+91 ' + x[1] + '-' + x[2] + '-' + x[3]) : '';
    this.setState({
      mobileNumber: y,
    });
  }

  handleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

  handleShowConfirmPassword = () => {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  }

  handleTerms = () => {
    this.props.navigation.navigate('TermsOfUse');
  }

  render() {
    const { navigate, dispatch } = this.props.navigation;
    const { navigation } = this.props;
    return (
        <React.Fragment>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.textTitleWrapper}><Text style={commonStyles.headerText}>Sign Up</Text></View>
              <View style={[commonStyles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'First Name'}
                  onChangeText={(firstName) => { this.setState({ firstName }, () => { this.validInputField('firstName', 'firstNameError'); }) }}
                  value={this.state.firstName}
                  keyboardType="default"
                  iconClass={FontAwesomeIcon}
                  iconName={'user-circle-o'}
                  iconColor={colors.inputText}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  containerStyle={{height:20}}
                  style={commonStyles.inputContainer}
                  labelStyle={commonStyles.labelStyle}
                />
                {this.displayValidationError('firstNameError')}
              </View>

              <View style={[commonStyles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'Last Name'}
                  onChangeText={(lastName) => { this.setState({ lastName }, () => { this.validInputField('lastName', 'lastNameError'); }) }}
                  value={this.state.lastName}
                  keyboardType="default"
                  iconClass={FontAwesomeIcon}
                  iconName={'user-circle-o'}
                  iconColor={colors.inputText}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  containerStyle={{height:20}}
                  style={commonStyles.inputContainer}
                  labelStyle={commonStyles.labelStyle}
                />
                {this.displayValidationError('lastNameError')}
              </View>

              <View style={[commonStyles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'Phone Number'}
                  onChangeText={(mobileNumber) => { this.setState({ mobileNumber }, () => { this.validInputField('mobileNumber', 'mobileNumberError'); }), this.handleMobileChange(mobileNumber) }}
                  value={this.state.mobileNumber}
                  keyboardType="numeric"
                  iconClass={FontAwesomeIcon}
                  iconName={'phone-square'}
                  iconColor={colors.inputText}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  containerStyle={{height:20}}
                  style={commonStyles.inputContainer}
                  labelStyle={commonStyles.labelStyle}
                />
                {this.displayValidationError('mobileNumberError')}
              </View>

              <View style={[commonStyles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'Pincode'}
                  onChangeText={(pincode) => { this.setState({ pincode }, () => { this.validInputField('pincode', 'pincodeError'); })}}
                  value={this.state.pincode}
                  keyboardType="numeric"
                  iconClass={FontAwesomeIcon}
                  iconName={'phone-square'}
                  iconColor={colors.inputText}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  containerStyle={{height:20}}
                  maxLength={6}
                  keyboardType="numeric"
                  style={commonStyles.inputContainer}
                  labelStyle={commonStyles.labelStyle}
                />
                {this.displayValidationError('pincodeError')}
              </View>

              <View style={[commonStyles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'Email'}
                  onChangeText={(email) => { this.setState({ email }, () => { this.validInputField('email', 'emailError'); }) }}
                  value={this.state.email}
                  keyboardType="email-address"
                  autoCapitalize='none'
                  iconClass={MaterialCommunityIcons}
                  iconName={'email-variant'}
                  iconColor={colors.inputText}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  containerStyle={{height:20}}
                  style={commonStyles.inputContainer}
                  labelStyle={commonStyles.labelStyle}
                />
                {this.displayValidationError('emailError')}
              </View>

              <View style={[commonStyles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'Password'}
                  onChangeText={(password) => { this.setState({ password }, () => { this.validInputField('password', 'passwordError'); }), this.passwordChange(password, "password") }}
                  value={this.state.password}
                  keyboardType="default"
                  secureTextEntry={this.state.showPassword ? false : true}
                  autoCapitalize='none'
                  iconClass={MaterialCommunityIcons}
                  iconName={'lock'}
                  iconColor={colors.inputText}
                  iconSize={22}
                  iconWidth={40}
                  inputPadding={16}
                  containerStyle={{height:20}}
                  style={commonStyles.inputContainer}
                  labelStyle={commonStyles.labelStyle}
                />
                <View style={[styles.eyeWrapper, { position: 'absolute', left: '80%', top: 22 }]}>
                  <TouchableOpacity onPress={this.handleShowPassword}>
                    <Icon name={this.state.showPassword ? "eye-with-line" : "eye"} type="entypo" size={22} color="#aaa" style={{}} />
                  </TouchableOpacity>
                </View>
                {this.displayValidationError('passwordError')}
              </View>

              <View style={[commonStyles.formInputView]}>
                <Fumi
                  label={'Confirm Password'}
                  onChangeText={(confirmPassword) => { this.setState({ confirmPassword }, () => { this.validInputField('confirmPassword', 'confirmPasswordError'); }), this.passwordChange(confirmPassword, "confirmPassword") }}
                  value={this.state.confirmPassword}
                  keyboardType="default"
                  secureTextEntry={this.state.showConfirmPassword ? false : true}
                  autoCapitalize='none'
                  iconClass={MaterialCommunityIcons}
                  iconName={'lock'}
                  iconColor={colors.inputText}
                  iconSize={22}
                  iconWidth={40}
                  inputPadding={16}
                  containerStyle={{height:20}}
                  style={commonStyles.inputContainer}
                  labelStyle={commonStyles.labelStyle}
                />
                <View style={[styles.eyeWrapper, { position: 'absolute', left: '80%', top: 22 }]}>
                  <TouchableOpacity onPress={this.handleShowConfirmPassword}>
                    <Icon name={this.state.showConfirmPassword ? "eye-with-line" : "eye"} type="entypo" size={22} color="#aaa" style={{}} />
                  </TouchableOpacity>
                </View>
                {this.displayValidationError('confirmPasswordError')}
                {this.state.passwordMatch == ''
                  ?
                  null
                  :
                  this.state.passwordMatch == 'matched'
                    ?
                    <View style={{ width: '100%', marginTop: 5 }}>
                      <Text style={styles.successText}>Passwords matched</Text>
                    </View>
                    :
                    <View style={{ width: '100%', marginTop: 5 }}>
                      <Text style={styles.errorText}>Passwords not matching</Text>
                    </View>
                }
              </View>

              <View style={{ flexDirection: 'row', marginVertical: 15,justifyContent:"center" }}>
                <View style={[{ paddingLeft: 5, paddingRight: 15 }]}>
                  <CheckBox
                    style={{ flex: 1, padding: 0 }}
                    checkBoxColor={colors.textLight}
                    onClick={this.checkboxClick}
                    isChecked={this.state.isChecked}
                    // rightText       = {"I agree to the terms & conditions"}
                    rightTextStyle={{ fontFamily: "Montserrat-Regular" }}
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                  <Text style={commonStyles.linkLightText}>I agree to the </Text>
                  <TouchableOpacity>
                    <Text style={commonStyles.linkText}>
                      terms & conditions
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.formInputView,{marginTop:15}]}>
                {this.displayTermsError('isCheckedError')}
              </View>
               <View style={{paddingHorizontal:15}}>
                 {this.state.btnLoading
                  ?
                  // <Button
                  //   titleStyle={styles.buttonText}
                  //   title="Processing"
                  //   loading
                  //   buttonStyle={styles.button}
                  //   containerStyle={styles.buttonContainer}
                  // />
                  <ActivityIndicator size="large" color={colors.theme} />
                  :
                  <Button
                    onPress={this.handleSubmit.bind(this)}
                    titleStyle={commonStyles.buttonText}
                    title="Sign Up"
                    buttonStyle={commonStyles.button}
                    containerStyle={commonStyles.buttonContainer}
                  />
                }
                 
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center',marginVertical:30}}>
              <TouchableOpacity onPress={() => this.props.navigation("Login")}>
              <View style={{flexDirection:'row'}}>
                <Icon name="chevron-double-left" type="material-community" size={22} color={colors.textLight} style={{}} />
                <Text style={[commonStyles.linkText]}>
                    Sign In
                </Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
          {this.props.openModal ?
            <Modal navigation={navigation}/>
            :
            null
          }
        </React.Fragment>
    );

  }
}

RootSignup.defaultProps = {
  messages: {
    en: {
      numbers: 'This field must be a number.',
      email: 'Enter a valid email address',
      required: 'This field is required.',
      letters: 'It should only contain letters.',
      mobileNo: 'Enter a valid mobile number.',
      lettersOrEmpty: 'It should only contain letters.',
      pincode: 'Pincode should be 6 digit.',
    }
  },

  rules: {
    numbers: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
    email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$|^$/,
    required: /\S+/,
    letters: /^[a-zA-Z ]+$/,
    lettersOrEmpty: /^[a-zA-Z ]+$|^$/,
    mobileNo: /^(\+91\s)?[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/,
    pincode:/^[1-9][0-9]{5}$/,
  },
}

const mapStateToProps = (state)=>{
  // console.log("bState===",state);
  return {
    openModal             : state.openModal,
  }
  
};

const mapDispatchToProps = (dispatch)=>{
  return {
    openModal  : (openModal,messageHead,messagesSubHead,messageType)=> dispatch({type: "MODAL",
                            openModal:openModal,
                            messageHead:messageHead,
                            messagesSubHead:messagesSubHead,
                            messageType:messageType,
                  }),
    setUserID  : (user_id)=> dispatch({type: "SET_USER_ID",
                            user_id:user_id,
                  }),
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(RootSignup);