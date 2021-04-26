import React from 'react';
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  AsyncStorage,
  Image, TextInput,
  Platform,
  Alert,
  Keyboard
} from 'react-native';
// import AsyncStorage                 from '@react-native-community/async-storage';
// import Modal                        from "react-native-modal";
import ValidationComponent          from "react-native-form-validator";
import { Button, Icon }             from "react-native-elements";
import axios                        from "axios";
import commonStyles                 from '../../../AppDesigns/currentApp/styles/commonStyles.js';
import styles                       from '../../../AppDesigns/currentApp/styles/ScreenStyles/SystemSecurityStyles.js';
import { colors, sizes }            from '../../../AppDesigns/currentApp/styles/styles.js';
import { Fumi }                     from 'react-native-textinput-effects';
import FontAwesomeIcon              from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons       from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal                        from "../../Modal/OpenModal.js";
import LinearGradient               from 'react-native-linear-gradient';
import { connect }                  from 'react-redux';

const window = Dimensions.get('window');

class RootLogIn extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      email: '',
      password: '',
      emailError: [],
      showPassword: false,
      btnLoading: false,
      incorrectPwModal: false,
      test: ''
    };
  }

  validInput = () => {
    const {
      email,
      password,
    } = this.state;
    let valid = true;

    this.validate({
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 5
      },
    });
    if (this.isFieldInError("email")) {
      this.setState({ emailError: this.getErrorsInField("email") });
      valid = false;
    } else {
      this.setState({ emailError: "" });
    }
    if (this.isFieldInError("password")) {
      this.setState({ passwordError: this.getErrorsInField("password") });
      valid = false;
    } else {
      this.setState({ passwordError: "" });
    }
    return valid;
  };

  validInputField = (stateName, stateErr) => {
    const {
      email,
      password,
    } = this.state;
    let valid = true;

    this.validate({
      [stateName]: {
        required: true,
      }
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


  displayValidationError = (errorField) => {
    let error = null;
    if (this.state[errorField]) {
      error = <View style={commonStyles.errorWrapper}>
        <Text style={commonStyles.errorText}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }

  handleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

  login() {
    this.setState({ btnLoading: true })
    var auth = {
      email: this.state.email.toLowerCase(),
      password: this.state.password,
      role: "user"
    }
    if (this.validInput()) {
      console.log('loginValues Login====>',auth)
      axios.post('/api/auth/post/login', auth)
        .then(response => {
          this.setState({ btnLoading: false })
          console.log('response Login====>',response.data)
           if(response.data.message === 'INVALID_PASSWORD'){
            this.setState({ btnLoading: false})
            this.props.openModal(true,"Incorrect Password","Please enter correct password","warning");
          }else if(response.data.message === 'NOT_REGISTER'){
            this.setState({ btnLoading: false})
            this.props.openModal(true,"This Mobile Number is not registered.","","warning");
          }else if(response.data.message === 'USER_BLOCK'){
            this.setState({ btnLoading: false})
            this.props.openModal(true,"Please contact to admin","","warning");
          }else if(response.data.message === 'USER_UNVERIFIED'){
            console.log('USER_UNVERIFIED Login====>',response.data)
            Alert.alert("", "Your verification is still pending. Click Ok to verify your account.")
              console.log('response.data Result==>', response.data)
            var sendData = {
              "event": "2",
              "toUser_id": response.data.userDetails.user_id,
              "toUserRole":"user",
                "variables": {
                  "Username" : response.data.userDetails.firstName,
                  "OTP" : response.data.userDetails.otpEmail,
                }
              }
              axios.post('/api/masternotifications/post/sendNotification', sendData)
              .then((res) => {
                console.log('sendDataToUser in result==>>>', res.data)
              })
              .catch((error) => { console.log('notification error: ',error)})
            // =================== Notification ==================
            this.props.navigation('OTPVerification',{userID:response.data.userDetails.user_id,Username:response.data.userDetails.firstName});
          }else if(response.data.message === "already_loggedin"){
            this.setState({ btnLoading: false})
            this.props.openModal(true,"Your account is currently logged onto another device.","Please log out of the other device or contact your administrator.","warning");
          }else {
            AsyncStorage.multiSet([
              ['user_id', response.data.ID],
              ['token', response.data.token],
            ])
            console.log("Inside")
            this.props.navigation('Dashboard')
          }
        })
        .catch(error => {
          console.log("Inside 401",error.response.status)
          if (error.response.status == 401) {
            this.setState({ incorrectPwModal: true, btnLoading: false })
          }
        })
    } else {
      console.log('Inside Validation error')
      this.setState({ btnLoading: false })
    }
  }

  render() {

    const messages = {
      en: {
        email: "Please enter a valid Email / Mobile number.",
        numbers: 'Please enter a valid Email / Mobile number.',
        required: '\nThis Field is mandatory.',
        minlength: '\nPassword length must be greater than {1}.',
        maxlength: '\nPassword length must be lower than {1}.'
      }
    };

    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    return (
        <React.Fragment>
            <View style={styles.textTitleWrapper}><Text style={commonStyles.headerText}>Sign In</Text></View>
              <View style={commonStyles.formWrapper}>

                <View style={[commonStyles.formInputView, styles.marginBottom20]}>
                  <Fumi
                    label={'Email'}
                    onChangeText={(email) => { this.setState({ email }, () => { this.validInputField('email', 'emailError'); }) }}
                    value={this.state.email}
                    keyboardType="email-address"
                    autoCapitalize='none'
                    iconClass={MaterialCommunityIcons}
                    iconName={'email-variant'}
                    iconColor={colors.icon}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    style={commonStyles.inputContainer}
                    labelStyle={commonStyles.labelStyle}
                    autoCompleteType="off"
                  />
                {this.displayValidationError('emailError')}
                </View>

                <View style={[commonStyles.formInputView, styles.marginBottom20]}>
                  <Fumi
                    label={'Password'}
                    onChangeText={(password) => { this.setState({ password }, () => { this.validInputField('password', 'passwordError'); }) }}
                    value={this.state.password}
                    keyboardType="default"
                    autoCapitalize='none'
                    secureTextEntry={this.state.showPassword ? false : true}
                    iconClass={MaterialCommunityIcons}
                    iconName={'lock-open-outline'}
                    iconColor={colors.icon}
                    iconSize={22}
                    iconWidth={40}
                    inputPadding={16}
                    style={commonStyles.inputContainer}
                    labelStyle={commonStyles.labelStyle}
                    autoCompleteType="off"
                  />
                  
                  <View style={[commonStyles.eyeWrapper, {position:'absolute',left:'80%',top:22}]}>
                    <TouchableOpacity onPress={this.handleShowPassword}>
                      <Icon name={this.state.showPassword ? "eye-with-line" : "eye"} type="entypo" size={22} color="#aaa" style={{}} />
                    </TouchableOpacity>
                  </View>
                  {this.displayValidationError('passwordError')}
                </View>

                <View style={{marginBottom:15,paddingHorizontal:15}}>
                  {this.state.btnLoading
                    ?
                    <ActivityIndicator size="large" color={colors.theme} />
                    :
                    <Button
                      onPress={this.login.bind(this)}
                      titleStyle={commonStyles.buttonText}
                      title="Sign In"
                      buttonStyle={commonStyles.button}
                      containerStyle={commonStyles.buttonContainer}
                    />
                  }
                </View>
                
                <View style={{flexDirection:'row',paddingHorizontal:15,marginBottom:30}}>
                  <View style={{ flex:0.5,alignItems: 'flex-start', justifyContent: 'flex-start', }}>
                    <TouchableOpacity onPress={() => this.props.navigation("Signup")}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={[commonStyles.linkText]} >
                          Sign Up
                        </Text>
                        <Icon name="chevron-double-right" type="material-community" size={22} color={colors.textLight} style={{}} />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{flex:0.5,alignItems: 'flex-end', justifyContent: 'flex-end', }}>
                    <TouchableOpacity onPress={() => this.props.navigation("ForgotPassword")}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={[commonStyles.linkText]}>
                        Forgot Password?
                      </Text>
                      <Icon name="chevron-double-right" type="material-community" size={22} color={colors.textLight} style={{}} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginBottom:25 }]}>
                  <Text style={commonStyles.linkLightText}>Version 1.0</Text>
                </View>
            </View>
            {this.props.openModal ?
            <Modal navigation={navigation}/>
            :
            null
          }
        </React.Fragment>
    );

  }
}

RootLogIn.defaultProps = {
  messages: {
    en: {
      numbers: 'This field must be a number.',
      email: 'Enter a valid email address',
      required: 'This field is required.',
      letters: 'It should only contain letters.',
      mobileNo: 'Enter a valid mobile number.',
      lettersOrEmpty: 'It should only contain letters.',
      minlength: 'Length should be greater than 5',
    }
  },

  rules: {
    numbers: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
    email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$|^$/,
    required: /\S+/,
    letters: /^[a-zA-Z ]+$/,
    lettersOrEmpty: /^[a-zA-Z ]+$|^$/,
    mobileNo: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
    minlength(length, value) {
      if (length === void (0)) {
        throw 'ERROR: It is not a valid length, checkout your minlength settings.';
      } else if (value.length > length) {
        return true;
      }
      return false;
    },
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
export default connect(mapStateToProps,mapDispatchToProps)(RootLogIn);