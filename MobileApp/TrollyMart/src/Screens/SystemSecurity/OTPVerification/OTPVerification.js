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
export const OTPVerification = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
  const {setToast,navigation,route} = props; //setToast function bhetta
  const {userID}=route.params;
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
            axios.get('/api/auth/get/checkmobileotp/usingID/'+userID+"/"+otp)
            .then(res => {
                setLoading(false);
                console.log("REs============>",res.data);
                if(res.data.message == 'Login Auth Successful') {
                    AsyncStorage.multiSet([
                      ['user_id', res.data.ID],
                      ['token', res.data.token],
                    ]);
                    axios.defaults.headers.common['Authorization'] = 'Bearer '+ res.data.token;
                    dispatch(
                      setUserDetails({
                        user_id     : res.data.ID,
                        token       : res.data.token,
                        firstName   : res.data.userDetails.firstName,
                        lastName    : res.data.userDetails.lastName,
                        email       : res.data.userDetails.email,
                        mobile      : res.data.userDetails.mobile,
                        countryCode : res.data.userDetails.countryCode,
                        fullName    : res.data.userDetails.fullName,
                        company_id  : res.data.userDetails.company_id,
                        companyID   : res.data.userDetails.companyID,
                        companyName : res.data.userDetails.companyName,
                        status      : res.data.userDetails.status,
                        role        : res.data.roles
                      }),
                    );
                    navigation.navigate('LocationMain');
                // navigation.navigate('RootLogIn')
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
  const [resendLoading, setResendLoading] = useState(false);
  const handleResend = () => {
    setResendLoading(true);
    setFieldValue('otp','');
    axios.patch('/api/auth/patch/setsendmobileotpusingID/'+user_id)
    .then(response => {
      console.log("REs============>",response);
        setResendLoading(false)
        if(response.data.message == 'OTP sent on your registered mobile id') {
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
      <View style={{flex:1,backgroundColor:'#fff'}}>        
          <View style={[styles.boxOpacity,{flex:1,paddingHorizontal:0}]}>
          <TouchableOpacity style={{alignSelf:'flex-start',paddingHorizontal:wp(3),marginTop:Platform.OS === 'ios'? 45 : hp(2),height:hp(4),paddingRight:wp(1)}} onPress={()=> navigation.goBack()}>
              <Icon size={hp(3.5)} name='arrow-left' type='material-community' color={colors.theme} />
          </TouchableOpacity>
          <View style={{height:hp(22),paddingHorizontal:wp(7),justifyContent:'flex-start'}}>
            <Image
              style={{height: hp(10), width:wp(42),backgroundColor:'white', alignSelf: 'flex-start'}}
              source={require("../../../AppDesigns/currentApp/images/trollymart-black.png")}
              resizeMode="contain"
            />
          </View>
          <ImageBackground source={require("../../../AppDesigns/currentApp/images/s1.png")} style={{paddingHorizontal:wp(7), height:500}} resizeMode="cover" >
           <View style={{marginHorizontal:5}}><Text style={styles.otpTitle}>OTP</Text></View>
           {/* <View style={styles.textTitleWrapper}><Text style={{ fontSize: 15, fontFamily: 'Montserrat-Regular',alignSelf:'center' }}>Please Enter Verification Code</Text></View> */}
         <OTPInputView
            style={{width: '95%', height: 100,alignSelf:"center",marginHorizontal:wp(20)}}
            pinCount={4}
            placeholderTextColor={'#333'}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled = {handleSubmit}
            onCodeChanged = {handleChange('otp')}
            code={values.otp}
            // clearInputs={isEmptyString(values.otp)}  
            />
           <Text style={{fontSize:RFPercentage(1.8),color:"#f00",alignSelf:"center"}}>{touched['otp'] && errors['otp'] ? errors['otp'] : ''}</Text>
           <View style={{marginHorizontal:wp(1.2),flexDirection:'row'}}>
           <Text style={styles.otpLastText}>Didn't receive code? </Text>
              <TouchableOpacity  onPress={handleResend}>
                <Text style={styles.otpLastText1}> Request again!</Text>
              </TouchableOpacity>
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