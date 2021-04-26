import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import ValidationComponent from "react-native-form-validator";
import axios from "axios";
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/SystemSecurityStyles.js';
import commonStyle                  from '../../../AppDesigns/currentApp/styles/commonStyles.js';
import { colors, sizes } from '../../../AppDesigns/currentApp/styles/styles.js';
import Modal from "../../Modal/OpenModal.js";
import { Fumi } from 'react-native-textinput-effects';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

class RootForgotPassword extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      email: '',
      mobileNumber: '',
      btnLoading: false,
    };
  }
  validInputField = (stateName, stateErr) => {
    const {
      email,
      mobileNumber,
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
  validInput = () => {
    const {
      email,
    } = this.state;
    let valid = true;

    this.validate({
      email: {
        required: true,
        email: true,
      },
       mobileNumber: {
        required: true,
        email: true,
      },
    });

    if (this.isFieldInError("email")) {
      this.setState({ emailError: this.getErrorsInField("email") });
      valid = false;
    } else {
      this.setState({ emailError: "" });
    }
    return valid;
  };

  displayValidationError = (errorField) => {
    let error = null;
    if (this.state[errorField]) {
      error = <View style={commonStyle.errorWrapper}>
        <Text style={commonStyle.errorText}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }

  // handleSendOtp = () => {
  //   this.setState({ btnLoading: true })
  //   // var formValues = {
  //   //   "emailSubject" : "Forgot Password",
  //   //   "emailContent"  : "Use code to reset your password",
  //   // }
  //   axios.patch('/api/auth/patch/setsendemailotpusingEmail/' + this.state.email)
  //     .then(response => {
  //       console.log("response",response);
  //       this.setState({ btnLoading: false })
  //       if (response.data.message == 'OTP_UPDATED') {
  //         // var messageHead = "OTP Resend successfully!";
  //         // var messagesSubHead = "Please enter New OTP to verify";
          
  //         // this.props.openModal(true,messageHead, messagesSubHead,"success");
  //         // =================== Notification OTP ==================
        

  //         // =================== Notification ==================

  //       } else {
  //         this.setState({ email: "" })
  //         var messageHead = response.data.message;
  //         var messagesSubHead = "";
  //         this.props.openModal(true, messageHead, messagesSubHead, "warning");
  //       }
  //     })
  //     .catch(error => {
  //       console.log("error",error);
  //       this.setState({ btnLoading: false })
  //     })

  // }

  handleSendOtp = () => {
    if(this.validInput()){
      this.setState({ btnLoading: true})
      axios.patch('/api/auth/patch/setsendemailotpusingEmail/'+this.state.email)
      .then(response => {
        this.setState({ btnLoading: false })
        if (response.data.message == 'OTP_UPDATED') {
          axios.get('/api/ecommusers/' + response.data.ID)
          .then((res) => {
            console.log("res.data.image==>", res.data);
            this.setState({
              fullName: res.data.profile.fullName,
              userid:response.data.ID
            }, () => {
              var sendData = {
                "event": "5",
                "toUser_id": response.data.ID,
                "toUserRole": "user",
                "variables": {
                  "Username": this.state.fullName,
                  "OTP": res.data.profile.optEmail,
                }
              }
              console.log('sendDataToUser==>', sendData)
              axios.post('/api/masternotifications/post/sendNotification', sendData)
                .then((res) => {
                  
                  console.log('sendDataToUser in result==>>>', res.data)
                })
                .catch((error) => { console.log('notification error: ', error) })
            })
            var messageHead = "OTP sent successfully!";
            var messagesSubHead = "Please enter the OTP received to reset your password.";
            this.props.setUserID(response.data.ID);
            this.props.openModal(true,messageHead, messagesSubHead,"success","ForgotPasswordOTP");
            // this.props.navigation.navigate('ForgotPasswordOTP');;
          })
          .catch((error) => {
            console.log('error', error)
          });
        }else if(response.data.message == 'NOT_REGISTER'){
          var messageHead = "This Email ID is not registered.";
          var messagesSubHead = "";
          this.props.openModal(true,messageHead, messagesSubHead,"warning",'');
        }else if(response.data.message == 'OTP_NOT_UPDATED'){
          var messageHead = "Something went wrong";
          var messagesSubHead = "";
          this.props.openModal(true,messageHead, messagesSubHead,"warning",'');
        }else if(response.data.message == 'USER_BLOCK'){
          var messageHead = "This Email ID is blocked";
          var messagesSubHead = "Please contact admin";
          this.props.openModal(true,messageHead, messagesSubHead,"warning",'');
        }
      })
      .catch(error => {
        console.log("error",error);
        if (error.response.status == 401) {
          this.setState({btnLoading: false })
        }
      })
    }
  }

  handleMobileChange(value) {
    if (value.startsWith && value.startsWith('+')) {
      value = value.substr(3);
    }
    let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    console.log("x value = ", x);
    let y = x.input ? (!x[2] && !x[3]) ? '+91 ' + x[1] : (!x[3] ? '+91 ' + x[1] + '-' + x[2] : '+91 ' + x[1] + '-' + x[2] + '-' + x[3]) : '';
    this.setState({
      mobileNumber: y,
    });
  }

  render() {
    const { navigate, dispatch, goBack } = this.props.navigation;
    const { navigation } = this.props;

    return (
      <View>
        <View style={{ width: '100%' }}>
          <View style={styles.textTitleWrapper}><Text style={commonStyle.headerText}>Forgot Password</Text></View>
          <View style={{ paddingHorizontal: 30 }}><Text style={commonStyle.subHeaderText}>Please enter email id</Text></View>
          <View style={commonStyle.formWrapper}>
            <View style={[commonStyle.formInputView, styles.marginBottom30]}>
              <Fumi
                label={'Email'}
                onChangeText={(email) => { this.setState({ email }, () => { this.validInputField('email', 'emailError'); }) }}
                value={this.state.email}
                keyboardType="email-address"
                autoCapitalize='none'
                iconClass={MaterialCommunityIcons}
                iconName={'lock'}
                iconColor={colors.inputText}
                iconSize={22}
                iconWidth={40}
                inputPadding={16}
                style={commonStyle.inputContainer}
                labelStyle={commonStyle.labelStyle}
              />
              {this.displayValidationError('emailError')}
            </View>


            <View style={{ paddingHorizontal: 15 }}>
              {this.state.btnLoading
                ?
                <ActivityIndicator size="large" color={colors.theme} />
                :
                <Button
                  onPress={this.handleSendOtp}
                  titleStyle={commonStyle.buttonText}
                  title="Send OTP"
                  buttonStyle={commonStyle.button}
                  containerStyle={commonStyle.buttonContainer}
                />

              }
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center',marginVertical:30}}>
              <TouchableOpacity onPress={() => this.props.navigation("Login")}>
              <View style={{flexDirection:'row'}}>
                <Icon name="chevron-double-left" type="material-community" size={22} color={colors.textLight} style={{}} />
                <Text style={[commonStyle.linkText]}>
                    Sign In
                </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this.props.openModal ?
          <Modal navigation={navigation} />
          :
          null
        }
      </View>
    );

  }
}

RootForgotPassword.defaultProps = {
  messages: {
    en: {
      email: 'Enter a valid email address',
      required: 'This field is required.',
      mobileNo: 'Enter a valid mobile number.',
    }
  },

  rules: {
    email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$|^$/,
    required: /\S+/,
    mobileNo: /^(\+91\s)?[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/,
  },
}

const mapStateToProps = (state) => {
  return {
    user_id: state.user_id,
  }

};
const mapDispatchToProps = (dispatch) => {
  return {
    openModal  : (openModal,messageHead,messagesSubHead,messageType,route)=> dispatch({type: "MODAL",
      openModal:openModal,
      messageHead:messageHead,
      messagesSubHead:messagesSubHead,
      messageType:messageType,
      route : route
    }),
    setUserID: (user_id) => dispatch({
      type: "SET_USER_ID",
      user_id: user_id,
    }),
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(RootForgotPassword);