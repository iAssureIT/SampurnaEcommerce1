import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  Image, TextInput,
  ImageBackground
} from 'react-native';
import * as Yup             from 'yup';
import {withCustomerToaster} from '../../../redux/AppState.js';
import styles  from '../../../AppDesigns/currentApp/styles/ScreenStyles/ForgotPasswordOTPStyles.js';
import {useDispatch}        from 'react-redux';

import {Formik}             from 'formik';
import commonStyle         from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import OTPInputView         from '@twotalltotems/react-native-otp-input';
import {FormButton}         from '../../../ScreenComponents/FormButton/FormButton';
import axios from "axios";
import { colors, sizes } from '../../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage         from '@react-native-async-storage/async-storage';
const LoginSchema = Yup.object().shape({
  otp: Yup.string()
  .required('This field is required')
});

//wrap component with withCustomerToaster hoc
export const OTPVerification = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
  const {setToast,navigation,route} = props; //setToast function bhetta
  const {userID}=route.params;
  // const dispatch = useDispatch();
  console.log("user_id",userID);
  return (
    <React.Fragment>
      <Formik
        onSubmit={(data) => {
            setLoading(true);
            let { otp } = data;
            console.log("otp",otp);
            axios.get('/api/auth/get/checkemailotp/usingID/'+userID+"/"+otp)
            .then(response => {
                setLoading(false);
                if (response.data.message == 'SUCCESS') {
                  var sendData = {
                    "event": "1",
                    "toUser_id": userID,
                    "toUserRole":"user",
                    "variables": {
                      // "Username" : this.state.fullName,
                      }
                  }
                  axios.post('/api/masternotifications/post/sendNotification', sendData)
                  .then((res) => {
                  console.log('sendDataToUser in result==>>>', res.data)
                  })
                  .catch((error) => { console.log('notification error: ',error)})
                //   axios.get('/api/users/get/id/'+userID)
                //   .then(res => {
                //     console.log("res",res);
                //     AsyncStorage.multiSet([
                //       ['user_id', res.data._id],
                //       ['token', res.data.services.resume.loginTokens[0].hashedToken],
                //     ]);
                //     axios.defaults.headers.common['Authorization'] = 'Bearer '+ res.data.services.resume.loginTokens[0].hashedToken
                //     dispatch(
                //       setUserDetails({
                //         user_id     : res.data._id,
                //         token       : res.data.services.resume.loginTokens[0].hashedToken,
                //         firstName   : res.data.profile.firstname,
                //         lastName    : res.data.profile.lastname,
                //         email       : res.data.profile.email,
                //         mobile      : res.data.profile.mobile,
                //         countryCode : res.data.profile.countryCode,
                //         fullName    : res.data.profile.fullName,
                //         company_id  : res.data.profile.company_id,
                //         companyID   : res.data.profile.companyID,
                //         companyName : res.data.profile.companyName,
                //         status      : res.data.profile.status,
                //         role        : res.data.roles
                //       }),
                //     );
                //     navigation.navigate('Dashboard')
                //   })
                //   .catch(error => {
                //     console.log("errr",error);
                //     setToast({text: 'Something went wrong.', color: 'red'});
                //     setLoading(false);
                //     if (error.response.status == 401) {
                //       navigation.navigate('App')
                //     }
                // })
                navigation.navigate('RootLogIn')
              }else{
                setToast({text: 'Please enter correct OTP.', color: colors.warning});
              }
            })
            .catch(error => {
                console.log("errr",error);
                setToast({text: 'Something went wrong.', color: 'red'});
                setLoading(false);
                if (error.response.status == 401) {
                  navigation.navigate('App')
                }
            })
        }}
        validationSchema={LoginSchema}
        initialValues={{
          otp: '',
        }}>
        {(formProps) => (
          <FormBody
            btnLoading={btnLoading}
            navigation={navigation}
            user_id={userID}
            setToast={setToast}
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
    setFieldValue,
    setFieldTouched,
    getValues,
    navigation,
    values,
    user_id,
    setToast
  } = props;
  console.log("props",props);
  const [resendLoading, setResendLoading] = useState(false);
  const handleResend = () => {
    setResendLoading(true);
    setFieldValue('otp','');
    axios.patch('/api/auth/patch/setsendemailotpusingID/'+user_id)
    .then(response => {
        console.log("response",response)
        setResendLoading(false)
        if(response.data.message == 'OTP_UPDATED') {
          // navigation.navigate('OTPVerification');
          setToast({text: 'OTP Resent successfully!', color: 'green'});
        }else if(response.data.message == 'NOT_REGISTER'){
            setToast({text: "This Email Id is not registered.", color: colors.warning});
        }else if(response.data.message == 'OTP_NOT_UPDATED'){
            setToast({text: 'Something went wrong.', color: 'red'});
        }
    })
    .catch(error => {
    console.log(error);
      if (error.response.status == 401) {
        setResendLoading(false)
      }
    })
  }

  return (
    <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={commonStyle.container} resizeMode="cover" >
      <View style={{paddingHorizontal:20}}>
          <View style={styles.boxOpacity}>
          <Image
            style={{height: 120, width: 150, alignSelf: 'center'}}
            source={require("../../../AppDesigns/currentApp/images/Logo.png")}
            resizeMode="contain"
          />
           <View style={styles.textTitleWrapper}><Text style={commonStyle.headerText}>OTP Verification</Text></View>
           <View style={styles.textTitleWrapper}><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Regular',alignSelf:'center' }}>Please Enter Verification Code</Text></View>
         <OTPInputView
            style={{width: '60%', height: 100,alignSelf:"center"}}
            pinCount={4}
            placeholderTextColor={'#333'}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled = {handleSubmit}
            onCodeChanged = {handleChange('otp')}
            // clearInputs
            />
           <Text style={{fontSize:12,color:"#f00",alignSelf:"center"}}>{touched['otp'] && errors['otp'] ? errors['otp'] : ''}</Text>
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                <FormButton
                    title       = {'Verify'}
                    onPress     = {handleSubmit}
                    background  = {btnLoading}
                    loading     = {btnLoading}
                />
                <FormButton
                    title       = {'Resend OTP'}
                    onPress     = {handleResend}
                    background  = {resendLoading}
                    loading     = {resendLoading}
                />
            </View>    
          <View
            style={[
              {
                flexDirection   : 'row',
                alignItems      : 'center',
                justifyContent  : 'center',
                marginTop       : '3%',
                marginBottom    : 25,
              },
            ]}>
            <Text style={commonStyle.linkLightText}>
              Version 1.0.3
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};