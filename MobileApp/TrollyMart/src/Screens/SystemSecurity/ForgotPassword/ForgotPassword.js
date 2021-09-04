import React,{useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Icon }             from "react-native-elements";
import axios                from "axios";
import commonStyles         from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import styles               from '../../../AppDesigns/currentApp/styles/ScreenStyles/SystemSecurityStyles.js';
import { colors }           from '../../../AppDesigns/currentApp/styles/styles.js';
import {FormInput}          from '../../../ScreenComponents/FormInput/FormInput';
import {FormButton}         from '../../../ScreenComponents/FormButton/FormButton';
import * as Yup             from 'yup';
import {useDispatch}        from 'react-redux';

import {emailValidator}     from '../../../config/validators.js';
import {Formik}             from 'formik';
import {withCustomerToaster} from '../../../redux/AppState.js';
import {setUserDetails}     from '../../../redux/user/actions';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .required('This field is required')
  });


  export const ForgotPassword = withCustomerToaster((props)=>{
    const [btnLoading, setLoading] = useState(false);
    const {setToast,navigation} = props; //setToast function bhetta
    const dispatch = useDispatch();
    
      return (
        <React.Fragment>
          <Formik
              onSubmit={(data) => {
                setLoading(true);
                let {username} = data;
                axios.patch('/api/auth/patch/set_send_otp/'+username)
                  .then(response => {
                    console.log("response",response);
                      setLoading(false);
                        if(response.data.message == 'OTP sent on registered mobile number') {
                          // var sendData = {
                          //   "event": "5",
                          //   "toUser_id": response.data.ID,
                          //   "toUserRole": "user",
                          //   "variables": {
                          //     "Username": response.data.profile.fullName,
                          //     "OTP": response.data.profile.optEmail,
                          //   }
                          // }
                          // console.log('sendDataToUser==>', sendData)
                          // axios.post('/api/masternotifications/post/sendNotification', sendData)
                          // .then((res) => {
                          //   console.log('sendDataToUser in result==>>>', res.data)
                          // })
                          // .catch((error) => { console.log('notification error: ', error) })
                          navigation.navigate('ForgotPasswordOTP',{user_id:response.data.ID});
                          setToast({text: 'OTP sent successfully!', color: 'green'});
                          navigation.navigate('ForgotPasswordOTP',{user_id:response.data.ID})
                      }else if(response.data.message == 'User is not registered'){
                          setToast({text: response.data.message, color: colors.warning});
                      }else if(response.data.message == 'OTP_NOT_UPDATED'){
                          setToast({text: 'Something went wrong.', color: 'red'});
                      }else{
                        setToast({text: response.data.message, color: colors.warning});
                      }
                  })
                  .catch(error => {
                      console.log("error",error);
                      setToast({text: 'Something went wrong.', color: 'red'});
                      setLoading(false)
                      if (error.response.status == 401) {
                      }
                  })
            }}
            validationSchema={LoginSchema}
            initialValues={{
              username: '',
            }}>
            {(formProps) => (
              <FormBody
                btnLoading={btnLoading}
                navigation={navigation}
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
      navigation,
    } = props;
    const [openModal, setModal] = useState(false);
    const [showPassword, togglePassword] = useState(false);
    const [image, setImage] = useState({profile_photo: '', image: ''});
    
  return (
      <ImageBackground source={require("../../../AppDesigns/currentApp/images/s1.png")} style={commonStyles.container} resizeMode='cover' >
      <View style={{flex:1}}>
          <View style={[styles.boxOpacity]}>
            <TouchableOpacity style={{alignSelf:'flex-start',paddingHorizontal:10,marginTop:Platform.OS==='ios'?45:15,height:30,paddingRight:5}} onPress={()=> navigation.goBack()}>
                <Icon size={25} name='arrow-left' type='material-community' color={colors.theme} />
            </TouchableOpacity>
            <View style={styles.syslogo}>
                <Image
                resizeMode="contain"
                source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/trollymart-black.png'}}
                style={styles.syslogoimg}
                />
            </View>
            <View style={styles.textTitleWrapper}>
              <Text style={{fontSize:RFPercentage(1.8),color:"#000000",fontFamily:"Montserrat-Medium",opacity:0.5}}>Knock Knock</Text>
              <Text style={{fontSize:RFPercentage(1.9),color:"#000000",fontFamily:"Montserrat-Regular",}}>Forgot your password?</Text>
            </View>
            <View style={styles.textTitleWrapper}>
              <Text style={styles.textLine1}>Enter your email address/mobile no. and we'll send you a link to reset your password.</Text>
            {/* <Text style={styles.textLine1}>send you a link to reset your password.</Text> */}
            </View>
            <View style={commonStyles.formWrapper}>
            <FormInput
              labelName       = "Mobile No / Email Id"
              // placeholder     = "Enter Mobile No / Email Id..."
              onChangeText    = {handleChange('username')}
              required        = {true}
              name            = "username"
              errors          = {errors}
              touched         = {touched}
              // iconName        = {'email'}
              iconType        = {'material-community'}
              autoCapitalize  = "none"
              keyboardType    = "email-address"
            />
            <FormButton
              title       = {'Reset Password'}
              onPress     = {handleSubmit}
              background  = {true}
              loading     = {btnLoading}
            />
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
              <View
              style={[
                {
                  flexDirection   : 'row',
                  alignItems      : 'center',
                  justifyContent  : 'center',
                  marginTop       : '3%',
                  // marginBottom    : 25,
                },
              ]}>
                <View style={{flexDirection:"row",paddingHorizontal:wp(1)}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Signup')} style={{flex:1,alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                  <Text style={{fontSize:RFPercentage(1.5),fontFamily:"Montserrat-Regular",}}>Don't have an account?<Text style={[commonStyles.linkText,{fontSize:RFPercentage(1.8),fontFamily:"Montserrat-Regular"}]}> Sign Up</Text></Text>                  
                </TouchableOpacity>                
                </View>
            </View>
            </View>
          </View>
        </View>
      </View>
   </ImageBackground>
  );
};