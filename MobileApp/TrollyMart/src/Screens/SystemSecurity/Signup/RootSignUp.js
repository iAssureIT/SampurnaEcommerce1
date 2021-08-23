import React,{useState,useRef} from 'react';
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Icon }             from "react-native-elements";
import axios                from "axios";
import commonStyles         from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import styles               from '../../../AppDesigns/currentApp/styles/ScreenStyles/SystemSecurityStyles.js';
import { colors }           from '../../../AppDesigns/currentApp/styles/styles.js';
import {FormInput}          from '../../../ScreenComponents/FormInput/FormInput';
import {FormPhoneInput}          from '../../../ScreenComponents/PhoneInput/PhoneInput';
import {FormButton}         from '../../../ScreenComponents/FormButton/FormButton';
import * as Yup             from 'yup';
import {useDispatch}        from 'react-redux';

import {emailValidator,specialCharacterValidator,mobileValidator}     from '../../../config/validators.js';
import {Formik}             from 'formik';
import {setToast, withCustomerToaster} from '../../../redux/AppState.js';
import {setUserDetails}     from '../../../redux/user/actions';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import PhoneInput           from "react-native-phone-number-input";

const window = Dimensions.get('window');
  const LoginSchema = Yup.object().shape({
    firstName: Yup.string()
    .required('This field is required')
    .test(
      'special character test',
      'This field cannot contain only characters',
      specialCharacterValidator,
    ),
    lastName: Yup.string()
    .required('This field is required')
    .test(
      'special character test',
      'This field cannot contain only characters',
      specialCharacterValidator,
    ),
    mobileNumber: Yup.string()
    .required('This field is required'),
    
    email_id: Yup.string()
      .test(
        'email validation test',
        'Enter a valid email address',
        emailValidator,
      ),
    password: Yup.string().required('This field is required'),
    confirm_password: Yup.string().required('This field is required'),
  });


  export const RootSignUp = withCustomerToaster((props)=>{
    const [btnLoading, setLoading] = useState(false);
    const [password_matched, setPasswordMatched] = useState(false);
    const {setToast,navigation} = props; //setToast function bhetta
    const dispatch = useDispatch();
    
      return (
        <React.Fragment>
          <Formik
            onSubmit={(values,fun) => {
              if(password_matched){
                setLoading(true);
                let {firstName, lastName,mobileNumber,email_id,password,countryCode,callingCode} = values;
                var formValues = {
                  firstname   : firstName,
                  lastname    : lastName,
                  mobNumber   : mobileNumber,
                  pincode     : "",
                  email       : email_id,
                  pwd         : password,
                  role        : 'user',
                  status      : 'unverified',
                  countryCode : countryCode,
                  username    : "MOBILE",
                  isdCode     : callingCode,
                  authService : ""
                }
                // console.log("formValues",formValues); 
                axios.post('/api/auth/post/signup/user/otp',formValues)
                .then((response) => {
                  console.log("response",response);
                  setLoading(false)
                  if(response.data.message == 'USER_CREATED'){   
                    var sendData = {
                      "event": "5",
                      "toUser_id": response.data.ID,
                      "toUserRole":"user",
                        "variables": {
                          "Username" : response.data.result.profile.firstname,
                          "OTP" : response.data.result.profile.otpEmail,
                        }
                      }
                      axios.post('/api/masternotifications/post/sendNotification', sendData)
                      .then((res) => {
                      })
                      .catch((error) => { console.log('notification error: ',error)})
                      setToast({text: "Great, Information submitted successfully", color: 'green'});
                      AsyncStorage.multiSet([
                        ['user_id_signup', response.data.ID],
                      ])
                      fun.resetForm(values);
                      navigation.navigate('OTPVerification',{userID:response.data.ID,Username:response.data.result.profile.firstname});
                  }else{
                    setToast({text: response.data.message, color:  colors.warning});
                  }
                })
                .catch((error) => {
                  console.log("error",error);
                  setLoading(false);
                  setToast({text: 'Something went wrong.', color: 'red'});
                })
              }else{
                setToast({text: 'Please confirm your password', color: colors.warning});
                setLoading(false);
              }
            }}
            validationSchema={LoginSchema}
            initialValues={{
              firstName         : '',
              lastName          : '',
              mobileNumber      : '',
              email_id          : '',
              password          : '',
              confirm_password  : '',
              countryCode       : '',
              callingCode       : "+971"
            }}>
            {(formProps) => (
              <FormBody
                btnLoading={btnLoading}
                navigation={navigation}
                setToast =   {setToast}
                setLoading={setLoading}
                setPasswordMatched =   {setPasswordMatched}
                {...formProps}
              />
            )}
          </Formik>
        </React.Fragment>
      );
    });
    
  const FormBody = (props) => {
    const {
      handleChange,
      handleSubmit,
      errors,
      touched,
      btnLoading,
      setLoading,
      setFieldValue,
      navigation,
      values,
      setToast,
      setPasswordMatched
    } = props;
    const [openModal, setModal] = useState(false);
    const [showPassword, togglePassword] = useState(false);
    const [confirmPassword, toggleConfirmPassword] = useState(false);
    const [image, setImage] = useState({profile_photo: '', image: ''});
    const [value, setValue] = useState(values.mobileNumber);
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [countryCode, setCountryCode] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  console.log("phoneInput",phoneInput);

  const checkPassword = () => {
      if (values.password && values.confirm_password) {
        if (values.password === values.confirm_password){
          setPasswordMatched(true)
          // setToast({text: 'Password matched', color: 'green'});
        }else{
          setPasswordMatched(false)
          setToast({text: 'Password not matched', color: colors.warning});
        }
      }
  }

  return (
       <ImageBackground 
       source={require("../../../AppDesigns/currentApp/images/s3.png")} 
        style={commonStyles.container} resizeMode="cover" >
        <ScrollView style={{flex:1}} keyboardShouldPersistTaps='handled'>
          <View contentContainerStyle={[commonStyles.container,{flex:1}]} keyboardShouldPersistTaps="always" >
              <View style={{}}>
                <View style={styles.boxOpacity}>
                <TouchableOpacity style={{alignSelf:'flex-start',paddingHorizontal:10,marginTop:Platform.OS === 'ios'? 45 : 15,height:30,paddingRight:5}} onPress={()=> navigation.goBack()}>
                    <Icon size={25} name='arrow-left' type='material-community' color={colors.theme} />
                </TouchableOpacity>
                  <View style={styles.syslogo1}>
                      <Image
                      resizeMode="contain"
                      source={require("../../../AppDesigns/currentApp/images/trollymart-black.png")}
                      style={styles.syslogoimg1}
                      />
                  </View>
                      <View style={{marginBottom:30,}}><Text style={styles.signupTitle}>Create an account..!</Text></View>
                  <View style={commonStyles.formWrapper}>
                  <FormInput
                    labelName       = "First Name"
                    // placeholder     = "First Name"
                    onChangeText    = {handleChange('firstName')}
                    required        = {true}
                    name            = "firstName"
                    errors          = {errors}
                    touched         = {touched}
                    value           = {values.firstName}
                    // iconName        = {'user-circle-o'}
                    iconType        = {'font-awesome'}
                    // autoCapitalize  = "none"
                  />
                  <FormInput
                    labelName       = "Last Name"
                    // placeholder     = "Last Name"
                    onChangeText    = {handleChange('lastName')}
                    required        = {true}
                    name            = "lastName"
                    errors          = {errors}
                    touched         = {touched}
                    value           = {values.lastName}
                    // iconName        = {'user-circle-o'}
                    iconType        = {'font-awesome'}
                    // autoCapitalize  = "none"
                  />
                 {/* <FormPhoneInput 
                    ref={phoneInput}
                    
                    onChangeFormattedText={(text) => {
                      console.log("text",text);
                      console.log("phoneInput",phoneInput);
                      setValue(text)
                      const checkValid = phoneInput.current?.isValidNumber(text);
                      console.log("checkValid",checkValid);
                      setValid(checkValid)
                    }}
                    onChangeText       = {handleChange('mobileNumber')}
                    required        = {true}
                    errors          = {errors}
                    touched         = {touched}
                    name            = "mobileNumber"
                  /> */}
                  <View style={{marginHorizontal:10}}>
                    <Text style={{ fontSize: 14,paddingVertical:2}}>
                        <Text style={{fontFamily:'Montserrat-Medium', fontSize: 12,color:'#000'}}>Phone Number</Text>{' '}
                        <Text style={{color: 'red', fontSize: 12}}>
                        *
                        </Text>
                    </Text>
                      <PhoneInput
                        ref={phoneInput}
                        defaultCode="AE"
                        layout="second"
                        placeholder='Phone Number'
                        value={values.mobileNumber}
                        onChangeText={(text) => {
                          const checkValid = phoneInput.current?.isValidNumber(text);
                          const callingCode = phoneInput.current?.getCallingCode(text);
                          const countryCode = phoneInput.current?.getCountryCode(text);
                          console.log("callingCode",callingCode);
                          var mobileNumber = text;
                          setValue(text);
                          setFieldValue('mobileNumber',mobileNumber)
                          setFieldValue('countryCode',countryCode)
                          setFieldValue('callingCode',callingCode)
                          setValid(checkValid);
                        }}
                        containerStyle= {styles1.containerStyle}
                        textContainerStyle={styles1.textContainerStyle}
                        textInputStyle={styles1.textInputStyle}
                      />
                    <Text style={{fontSize:12,marginTop:2,color:"#f00"}}>{value ? !valid && "Enter a valid mobile number" :touched['mobileNumber'] && errors['mobileNumber'] ? errors['mobileNumber'] : ''}</Text>
                  </View>       
                  <FormInput
                    labelName       = "Email Id"
                    // placeholder     = "Email Id"
                    onChangeText    = {handleChange('email_id')}
                    required        = {false}
                    name            = "email_id"
                    errors          = {errors}
                    touched         = {touched}
                    value           = {values.email_id}
                    // iconName        = {'email'}
                    iconType        = {'material-community'}
                    autoCapitalize  = "none"
                    // keyboardType    = "email-address"
                  />
                 
                  <FormInput
                    labelName     = "Password"
                    // placeholder   = "Password"
                    onChangeText  = {handleChange("password")}
                    onBlur        = {checkPassword}
                    errors        = {errors}
                    name          = "password"
                    required      = {true}
                    touched       = {touched}
                    value         = {values.password}
                    // iconName      = {'lock'}
                    iconType      = {'material-community'}
                    rightIcon ={
                      <TouchableOpacity
                        style={{paddingHorizontal: '5%'}}
                        onPress={() => togglePassword(!showPassword)}>
                        {showPassword ? (
                          <Icon style={{color:'#000'}} name="eye-with-line" type="entypo" size={18} />
                        ) : (
                          <Icon style={{color:'#000'}} name="eye" type="entypo" size={18} />
                        )}
                      </TouchableOpacity>
                    }
                    secureTextEntry={!showPassword}
                  />
                  <FormInput
                    labelName     = "Confirm Password"
                    // placeholder   = "Confirm Password"
                    onChangeText  = {handleChange('confirm_password')}
                    onBlur        = {checkPassword}
                    errors        = {errors}
                    name          = "confirm_password"
                    required      = {true}
                    touched       = {touched}
                    value         = {values.confirm_password}
                    // iconName      = {'lock'}
                    iconType      = {'material-community'}
                    rightIcon ={
                      <TouchableOpacity
                        style={{paddingHorizontal: '5%'}}
                        onPress={() => toggleConfirmPassword(!confirmPassword)}>
                        {confirmPassword ? (
                          <Icon style={{color:'#000'}} name="eye-with-line" type="entypo" size={18} />
                        ) : (
                          <Icon style={{color:'#000'}} name="eye" type="entypo" size={18} />
                        )}
                      </TouchableOpacity>
                    }
                    secureTextEntry={!confirmPassword}
                  />
                  <View style={{paddingVertical:15}}>
                  <FormButton
                    title       = {'Sign Up'}
                    onPress     = {handleSubmit}
                    background  = {true}
                    // loading     = {btnLoading}
                  />
                </View>  
                 <View
                    style={[
                      {
                        flexDirection   : 'row',
                        alignItems      : 'center',
                        justifyContent  : 'center',
                        marginBottom    : 25,
                        paddingHorizontal:15
                      },
                    ]}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('LogIn')} style={{flexDirection:"row"}}>
                          {/* <Icon name="chevron-double-left" type="material-community" size={22} color={colors.textLight} style={{}} /> */}
                        <Text style={{fontFamily:"Montserrat-Regular", fontSize: 12,color:'#033554'}}>Sign In</Text>
                      </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
        </View>
        </ScrollView>
        <Modal 
          animationType="slide"
          transparent={true}
          visible={btnLoading}
          // onRequestClose={() => setLoading(false)}
          // onDismiss={() =>  setLoading(false)}
        >
        <View 
          style={{
            backgroundColor: 'rgba(0,0,0,0)',
            flex:1,
            justifyContent:'center',
            alignItems:'center'
          }}>
            <ActivityIndicator color={colors.theme} size={40}/>
        </View>
        </Modal>
    </ImageBackground>
  );
};

const styles1 = StyleSheet.create({
  containerStyle:{
    //  borderWidth:1,
    //  borderRadius:5,
     width:"100%",
    //  borderColor:"#ccc",
    borderBottomWidth:1,
    borderBottomColor:"#ccc",
     backgroundColor:"transparent"
   },
   textInputStyle:{
       height:50,
       paddingTop:15,
       backgroundColor:'transparent'
   },
   textContainerStyle:{
     height:50,
     padding:0,
     backgroundColor:"transparent"
   },
 });