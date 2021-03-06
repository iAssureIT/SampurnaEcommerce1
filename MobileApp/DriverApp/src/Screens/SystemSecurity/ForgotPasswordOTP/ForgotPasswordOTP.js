import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  Image, TextInput,
  TouchableOpacity,
  ImageBackground,Modal,ActivityIndicator
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
          <TouchableOpacity style={{alignSelf:'flex-start',paddingHorizontal:10,marginTop:35,height:30,paddingRight:5}} onPress={()=> navigation?.goBack()}>
              <Icon size={25} name='arrow-left' type='material-community' color={colors.theme} />
          </TouchableOpacity>
          <View style={{height: 160,paddingHorizontal:30,justifyContent:'flex-start'}}>
            <Image
              style={{height: 60, width: 150,backgroundColor:'white', alignSelf: 'flex-start'}}
              source={require("../../../AppDesigns/currentApp/images/trollymart-black.png")}
              resizeMode="contain"
            />
          </View>
          <ImageBackground source={require("../../../AppDesigns/currentApp/images/s1.png")} style={{paddingHorizontal:30, height:500}} resizeMode="cover" >
           <View style={{marginHorizontal:5}}><Text style={styles.otpTitle}>OTP</Text></View>
           {/* <View style={styles.textTitleWrapper}><Text style={{ fontSize: 15, fontFamily: 'Montserrat-Regular',alignSelf:'center' }}>Please Enter Verification Code</Text></View> */}
         <OTPInputView
            style={{width: '95%', height: 100,marginHorizontal:20}}
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
           <Text style={{fontSize:12,color:"#f00",alignSelf:"center"}}>{touched['otp'] && errors['otp'] ? errors['otp'] : ''}</Text>
           <View style={{marginHorizontal:10}}>
              <Text style={styles.otpLastText}>Didn't receive code?
                <TouchableOpacity  onPress={handleResend}>
                  <Text style={[styles.otpLastText1,{}]}> Request again!</Text>
                </TouchableOpacity>
                {/* <Text style={styles.otpLastText1}> Request again!</Text> */}
              </Text>
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