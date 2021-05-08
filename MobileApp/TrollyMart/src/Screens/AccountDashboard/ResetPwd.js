import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { Button, } from "react-native-elements";
import axios from "axios";
import {Menu} from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import {Footer} from '../../ScreenComponents/Footer/Footer1.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import { colors, sizes } from '../../AppDesigns/currentApp/styles/styles.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import Modal from "react-native-modal";
import { Fumi }               from 'react-native-textinput-effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class ResetPwd extends React.Component {
    constructor(props){
    super(props);
    this.state={
      inputFocusColor : colors.textLight,
      password : '',
      confirmPassword : '',
      passwordMatch         : '',
      showPassword          : false,
      pwdupdate          : false,
      showConfirmPassword   : false,
    };
  }
//   validInput = () => {
//     const {
//       password,
//       confirmPassword,
//     } = this.state;
//     let valid = true;

//     this.validate({
//       password: { 
//         required: true, 
//         minlength: 5 
//       },
//       confirmPassword: { 
//         required: true 
//       }
//     });

//     if (this.isFieldInError("password")) {
//       this.setState({ passwordError: this.getErrorsInField("password") });
//       valid = false;
//     } else {
//       this.setState({ passwordError: "" });
//       valid = true;
//     }
//     if (this.isFieldInError("confirmPassword")) {
//       this.setState({
//         confirmPasswordError: this.getErrorsInField("confirmPassword")
//       });
//       valid = false;
//     } else {
//       this.setState({ confirmPasswordError: "" });
//       valid = true;
//     }

//     if(this.state.passwordMatch!='matched'){
//       valid = false;
//     }
// // console.log((!this.isFieldInError("password")), (!this.isFieldInError("confirmPassword")),(!this.isFieldInError("email")), (!this.isFieldInError("mobileNumber") ) , (!this.isFieldInError("firstName")) , (!this.isFieldInError("lastName")) , (this.state.isChecked) , (this.state.passwordMatch=='matched') );

// // return valid;
// return ((!this.isFieldInError("password"))&& (!this.isFieldInError("confirmPassword")))
// // return !this.isFieldInError("email");
//   };


// validInputField = (stateName,stateErr) => {
//   const {
//     password,
//     confirmPassword,
//   } = this.state;
//   let valid = true;

//   this.validate({
//     password: { 
//       required: true,
//       minlength: 5 
//     },
//     confirmPassword: { 
//       required: true, 
//     },
//   });

//   this.validate({
//     [stateName]: {
//       required: true,
//     },
//   });

//   if (this.isFieldInError(stateName)) {
//     let validinptError = this.getErrorsInField(stateName);
//     this.setState({ validinptError });
//     valid = false;
//   } else {
//     this.setState({ [stateErr]: "" });
//   }

//   return valid;
// };

componentDidMount() {
  AsyncStorage.multiGet(['token', 'user_id'])
  .then((data) => {
    this.setState({ user_id: data[1][1] })
    // console.log("addressId ===>>", addressId);
    axios.get('/api/ecommusers/' + data[1][1])
      .then((response) => {
        // console.log("response LIst ecommusers:==>>>", response.data.profile.mobile);
        this.setState({
          firstName: response.data.profile.firstname,
          lastName: response.data.profile.lastname,
          mobileNumber: response.data.profile.mobile,
          email: response.data.profile.email,
        })

      })
  });
}

handleReset = ()=>{
  const { password, confirmPassword} = this.state;
  // if(this.validInputField()){
    if(password == confirmPassword){
      var formValues = {
        pwd: password,
      };
      axios.patch('/api/auth//patch/change_password_withoutotp/id/'+this.state.user_id,formValues)
      .then((response)=>{  
        console.log("response",response);
        if(response.data === "PASSWORD_RESET"){
          var messageHead = "Password changed!";
          var messagesSubHead = "";
          // this.props.openModal(true,messageHead, messagesSubHead,"success");
          this.setState({ pwdupdate: true })

          
        }else{
          var messageHead = "Passwords not matching!";
          var messagesSubHead = "";
          // this.props.openModal(true,messageHead, messagesSubHead,"warning");
        }       
      })
      .catch((error)=>{
        console.log('error',error)
        if(error.message === "Request failed with status code 401")
        {

        }
      })
    }else{
      this.setState({invalid:true})
    }
  // }
}

displayValidationError = (errorField) =>{
  let error = null;
  if(this.state[errorField]){
    error = <View style={styles.errorWrapper}>
    <Text style={styles.errorText}>{this.state[errorField][0]}</Text>
    </View> ;
  }
  return error;
}

passwordChange = (value,key)=>{
  this.setState({
    [key] : value,
  },()=>{
    if(this.state.password && this.state.confirmPassword){
      if(this.state.password === this.state.confirmPassword)
        this.setState({passwordMatch: 'matched'});
      else
        this.setState({passwordMatch: 'not matched'});
    }

  });
}

handleShowPassword = ()=>{
  this.setState({showPassword:!this.state.showPassword});
}
changepwd = ()=>{
  this.setState({pwdupdate:false});
  this.props.navigation.navigate('Login');
}

handleShowConfirmPassword = ()=>{
  this.setState({showConfirmPassword:!this.state.showConfirmPassword});
}
 


  render() {
    const { navigate, goBack } = this.props.navigation;
    if (this.props.loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <React.Fragment>
          <HeaderBar5
            goBack={goBack}
            headerTitle={'Reset Password'}
            navigate={navigate}
            toggle={() => this.toggle.bind(this)}
            openControlPanel={() => this.openControlPanel.bind(this)}
          />
          <View style={styles.profileparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={{ paddingHorizontal: 15, marginBottom: 30 }}>
                
                <View style={{ flex: 1, borderWidth: 1, borderColor: '#f1f1f1', backgroundColor: '#ccc', paddingVertical: 15, marginTop: 10 }}>
                  <Text style={{ fontSize: 13, fontFamily: "Montserrat-SemiBold", color: '#333', paddingHorizontal: 15 }}>Profile Details : </Text>
                </View>
                <View style={styles.profilfileds}>

                  <View style={styles.marTp15}>
                    <View style={styles.padhr15}>
                      <View style={[styles.formInputView, styles.marginBottom20]}>
                        <View style={[styles.inputWrapper]}>
                          <View style={styles.inputTextWrapper}>
                            <TextField
                              label="New Password"
                              onChangeText    = {(password) => {this.setState({ password },this.passwordChange(password,"password"))}}
                              lineWidth={1}
                              secureTextEntry={true}
                              tintColor={colors.button}
                              inputContainerPadding={0}
                              labelHeight={13}
                              labelFontSize={sizes.label}
                              titleFontSize={13}
                              baseColor={'#666'}
                              textColor={'#333'}
                              value    = {this.state.password}
                              containerStyle={styles.textContainer}
                              inputContainerStyle={styles.textInputContainer}
                              titleTextStyle={styles.textTitle}
                              style={styles.textStyle}
                              labelTextStyle={styles.textLabel}
                              keyboardType="default"
                            />
                          </View>
                        </View>
                      </View>
                     </View>
                    <View style={styles.padhr15}>
                      <View style={[styles.formInputView, styles.marginBottom20]}>
                        <View style={[styles.inputWrapper]}>
                          <View style={styles.inputTextWrapper}>
                            <TextField
                              label="Confirm Password"
                              onChangeText    = {(confirmPassword) => {this.setState({ confirmPassword },this.passwordChange(confirmPassword,"confirmPassword"))}}
                              lineWidth={1}
                              secureTextEntry={true}
                              tintColor={colors.button}
                              inputContainerPadding={0}
                              labelHeight={13}
                              labelFontSize={sizes.label}
                              titleFontSize={13}
                              baseColor={'#666'}
                              textColor={'#333'}
                              value   = {this.state.confirmPassword}
                              containerStyle={styles.textContainer}
                              inputContainerStyle={styles.textInputContainer}
                              titleTextStyle={styles.textTitle}
                              style={styles.textStyle}
                              labelTextStyle={styles.textLabel}
                              keyboardType="password"
                              style={styles.resetpwd}
                            />
                          </View>
                        </View>
                      </View>
                     </View>
                  </View>
                </View>
                {this.displayValidationError('confirmPasswordError')}
                {this.state.passwordMatch == '' 
                  ?
                  null

                  :
                  this.state.passwordMatch=='matched'
                  ?
                  <View style={{width:'100%'}}>
                    <Text style={styles.successText}>Passwords matched</Text>
                  </View> 
                  :
                  <View style={{width:'100%'}}>
                    <Text style={styles.errorText}>Passwords not matching</Text>
                  </View>
                }
                <View style={{ marginBottom: "15%" }}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => this.handleReset()}
                      title={"Reset Password"}
                      buttonStyle={styles.button1}
                      titleStyle={styles.buttonTextEDIT}
                      containerStyle={styles.buttonContainerEDIT}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <Footer />
            <Modal isVisible={this.state.pwdupdate}
              onBackdropPress={() => this.setState({ pwdupdate: false })}
              coverScreen={true}
              hideModalContentWhileAnimating={true}
              style={{ paddingHorizontal: '5%', zIndex: 999 }}
              animationOutTiming={500}>
              <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:colors.theme }}>
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
                  Your Password is updated!
                </Text>
                <View style={styles.yesmodalbtn}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => this.changepwd()}
                      titleStyle={styles.buttonText1}
                      title="OK"
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer2}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </React.Fragment>
      );
    }
  }
}


ResetPwd.defaultProps = {
  messages: {
    en: {
      numbers: 'This field must be a number.',
      email: 'Enter a valid email address',
      required: 'This field is required.',
      letters: 'It should only contain letters.',
      mobileNo: 'Enter a valid mobile number.',
      lettersOrEmpty: 'It should only contain letters.',
      minlength: 'Password should be greater than {1} characters',
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
      if (length === void(0)) {
        throw 'ERROR: It is not a valid length, checkout your minlength settings.';
      } else if(value.length > length) {
        return true;
      }
      return false;
    },
  },
}
