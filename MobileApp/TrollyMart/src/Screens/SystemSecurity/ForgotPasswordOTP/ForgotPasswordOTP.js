/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  Image, TextInput,
  TouchableOpacity,
  ImageBackground,Modal,ActivityIndicator,
  Platform,
} from 'react-native';
import * as Yup             from 'yup';
import {Icon }                      from "react-native-elements";
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
import {setUserDetails}     from '../../../redux/user/actions';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const LoginSchema = Yup.object().shape({
  otp: Yup.string()
  .required('This field is required')
});

//wrap component with withCustomerToaster hoc
export const ForgotPasswordOTP = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
  const {setToast,navigation,route} = props; //setToast function bhetta
  const {user_id}=route.params;
  const dispatch = useDispatch();
  // console.log("user_id",userID);
  return (
    <React.Fragment>
      <Formik
        onSubmit={(values,fun) => {
            setLoading(true);
            fun.resetForm(values);
            let { otp } = values;
            console.log("otp",otp);
            axios.get('/api/auth/get/checkmobileotp/usingID/'+user_id+"/"+otp)
            .then(response => {
              console.log("response",response);
                setLoading(false);
                if (response.data.message == 'Login Auth Successful') {
                  navigation.navigate('ResetPassword',{user_id:user_id});
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
            user_id={user_id}
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
  const [resendLoading, setResendLoading] = useState(false);
  const handleResend = () => {
    setResendLoading(true);
    setFieldValue('otp','');
    axios.patch('/api/auth/patch/setsendmobileotpusingID/'+user_id)
    .then(response => {
      console.log("response",response);
        setResendLoading(false)
        if(response.data.message == "OTP sent on your registered mobile id") {
          // navigation.navigate('OTPVerification');
          setToast({text: response.data.message , color: 'green'});
        }else{
            setToast({text: response.data.message , color: colors.warning});
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
      <View style={{flex:1,backgroundColor:'#fff'}}>        
          <View style={[styles.boxOpacity,{flex:1,paddingHorizontal:0}]}>
          <TouchableOpacity style={{alignSelf:'flex-start',paddingHorizontal:wp(3),marginTop:Platform.OS === 'ios'? 45 : hp(2),height:hp(4),paddingRight:wp(1)}} onPress={()=> navigation.goBack()}>
              <Icon size={hp(3.5)} name='arrow-left' type='material-community' color={colors.theme} />
          </TouchableOpacity>
          <View style={{height:hp(22),paddingHorizontal:wp(7),justifyContent:'flex-start'}}>
            <Image
              style={{height: hp(10), width: wp(42),backgroundColor:'white', alignSelf: 'flex-start'}}
              source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/trollymart-black.png'}}
              resizeMode="contain"
            />
          </View>
          <ImageBackground source={require("../../../AppDesigns/currentApp/images/s1.png")} style={{paddingHorizontal:wp(7), height:500}} resizeMode="cover" >
           <View style={{marginHorizontal:5}}><Text style={styles.otpTitle}>OTP</Text></View>
           {/* <View style={styles.textTitleWrapper}><Text style={{ fontSize: 15, fontFamily: 'Montserrat-Regular',alignSelf:'center' }}>Please Enter Verification Code</Text></View> */}
         <OTPInputView
            style={{width: '95%', height: 100,marginHorizontal:wp(6)}}
            pinCount={4}
            placeholderTextColor={'#333'}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled = {handleSubmit}
            onCodeChanged = {handleChange('otp')}
            code={values.otp}
            // clearInputs={isEmptyString(values.otp)}  
            />
           <Text style={{fontSize:RFPercentage(1.8),color:"#f00",alignSelf:"center"}}>{touched['otp'] && errors['otp'] ? errors['otp'] : ''}</Text>
           <View style={{marginHorizontal:10}}  onPress={handleResend}>
             <Text style={styles.otpLastText}>Didn't receive code?<Text style={styles.otpLastText1}> Request again!</Text></Text>
           </View>
            {/* <View style={{flexDirection:"row",justifyContent:"space-between"}}>
              <View style={{width:"45%"}}>
                <FormButton
                    title       = {'Verify'}
                    onPress     = {handleSubmit}
                    background  = {btnLoading}
                    loading     = {btnLoading}
                />
              </View>
              <View style={{width:"45%"}}>
                <FormButton
                    title       = {'Resend OTP'}
                    onPress     = {handleResend}
                    // background  = {resendLoading}
                    loading     = {resendLoading}
                />
             </View>   
            </View>     */}
          {/* <View
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
          </View> */}
          </ImageBackground>
        </View>
        <Modal 
          animationType="slide"
          transparent={true}
          visible={resendLoading}
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
      </View>   
  );
};