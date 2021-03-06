import React,{useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
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
const window = Dimensions.get('window');
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
                        if(response.data.message == 'OTP sent on registered mobile number'){
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
                      }else if(response.data.message == 'NOT_REGISTER'){
                          setToast({text: "This username is not registered.", color: colors.warning});
                      }else if(response.data.message == 'OTP_NOT_UPDATED'){
                          setToast({text: 'Something went wrong.', color: 'red'});
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
      <ImageBackground source={require("../../../AppDesigns/currentApp/images/s1.png")} style={commonStyles.container} resizeMode="cover" >
      <View style={{flex:1}}>
          <TouchableOpacity style={{alignSelf:'flex-start',paddingHorizontal:10,marginTop:35,height:30,paddingRight:5}} onPress={()=> navigation?.goBack()}>
              <Icon size={25} name='arrow-left' type='material-community' color={colors.theme} />
          </TouchableOpacity>
          <View style={[styles.boxOpacity]}>
            <View style={styles.syslogo}>
                <Image
                resizeMode="contain"
                source={require("../../../AppDesigns/currentApp/images/trollymart-black.png")}
                style={styles.syslogoimg}
                />
            </View>
            <View style={styles.textTitleWrapper}>
              <Text style={{fontSize:10,color:"#bbb"}}>Knock Knock</Text>
              <Text style={{fontSize:15,fontWeight:'bold',color:"#000000"}}>Forgot your password?</Text>
            </View>
            <View style={styles.textTitleWrapper}>
              <Text style={commonStyles.label}>Enter your email address and we'll send</Text>
            <Text style={commonStyles.label}>you a link to reset your password.</Text></View>
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
            <View
              style={[
                {
                  flexDirection   : 'row',
                  alignItems      : 'center',
                  justifyContent  : 'center',
                  marginTop       : '3%',
                  marginBottom    : 25,
                },
              ]}></View>
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
                {/* <View style={{flexDirection:"row",paddingHorizontal:15}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Signup')} style={{flex:1,alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                  <Text style={{fontSize:10}}>Don't have an account?<Text style={[commonStyles.linkText,{fontSize:10}]}> Sign Up</Text></Text>                  
                </TouchableOpacity>                
                </View> */}
            </View>
            </View>
          </View>
        </View>
      </View>
   </ImageBackground>
  );
};