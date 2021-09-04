import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  BackHandler
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
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';
import { ActivityIndicator } from 'react-native';
import { useIsFocused } from "@react-navigation/native";

GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  webClientId: "1023694532217-4b1v4vf0oukma7c8c1bnogpr40b28kii.apps.googleusercontent.com",
  offlineAccess: false,
});

const window = Dimensions.get('window');
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('This field is required'),
    password: Yup.string().required('This field is required'),
  });


  export const LogIn = withCustomerToaster((props)=>{
    const [btnLoading, setLoading] = useState(false);
    const [facebookLoading, setFacebookLoading] = useState(false);
    const {setToast,navigation} = props; //setToast function bhetta
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const backAction = () => {
      Alert.alert("Confirmation!", "Are you sure you want to exit app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    
    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  },[]);

      return (
        <React.Fragment>
           {isFocused &&<Formik
            onSubmit={(values,fun) => {
              setLoading(true);
              let {username, password} = values;
              const payload = {
                username  : username,
                password  : password,
                role      : "deliveryperson"
              };
              console.log("payload",payload);
              axios
                .post('/api/auth/post/login/mob_email_new', payload)
                .then((res) => {
                  console.log("res",res);
                  setLoading(false);
                  if(res.data.message === "Login Auth Successful"){
                    if(res.data.passwordreset === false  ){
                      navigation.navigate('ChangePassword',{user_id:res.data.ID})
                    }else{  
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
                      fun.resetForm(values);
                      navigation.navigate('App');
                    }
                  }else if(res.data.message === 'INVALID_PASSWORD'){
                    setToast({text: "Please enter correct password", color: colors.warning});
                    setLoading(false);
                  }else if(res.data.message === 'NOT_REGISTER'){
                    setToast({text: "This username is not registered.", color: colors.warning});
                    setLoading(false);
                  }else if(res.data.message === 'USER_BLOCK'){
                    setToast({text: "Please contact to admin", color: colors.warning});
                    setLoading(false);
                  }else if(res.data.message === 'USER_UNVERIFIED'){
                    setToast({text: "Your verification is still pending.", color: colors.warning});
                    var sendData = {
                      "event": "2",
                      "toUser_id": res.data.userDetails.user_id,
                      "toUserRole":"user",
                        "variables": {
                          "Username" : res.data.userDetails.firstName,
                          "OTP" : res.data.userDetails.otpEmail,
                        }
                      }
                      axios.post('/api/masternotifications/post/sendNotification', sendData)
                      .then((res) => {
                        console.log('sendDataToUser in result==>>>', res.data)
                      })
                      .catch((error) => { console.log('notification error: ',error)})
                  }
                })
                .catch((error) => {
                  console.log("error",error);
                  setLoading(false);
                  setToast({text: 'Something went wrong.', color: 'red'});
                });
            }}
            validationSchema={LoginSchema}
            initialValues={{
              username: '',
              password: '',
            }}
            enableReinitialize
            >
            {(formProps) => (
              <FormBody
                btnLoading={btnLoading}
                navigation={navigation}
                dispatch={dispatch}
                setLoading={setLoading}
                {...formProps}
              />
            )}
          </Formik>}
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
      setLoading,
      navigation,
      dispatch,
      values
    } = props;
    const [openModal, setModal] = useState(false);
    const [showPassword, togglePassword] = useState(false);
    const [image, setImage] = useState({profile_photo: '', image: ''});
    const [userInfo,setUserInfo]=useState({});
    const [googleLoading, setGoogleLoading] = useState(false);
    
  const logoutWithFacebook = () => {
    LoginManager.logOut();
    setUserInfo({})
  };

  const google_login = async () => {
      try {
        setLoading(true);
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        await GoogleSignin.revokeAccess();
          var formValues = {
            firstname   : userInfo.user.givenName,
            lastname    : userInfo.user.familyName,
            mobNumber   : "",
            pincode     : "",
            email       : userInfo.user.email,
            pwd         : userInfo.user.email,
            role        : 'user',
            status      : 'active',
            countryCode : "",
            authService : "google"
          }
          sign_in(formValues)
        }catch(error){
          setLoading(false);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log("sign in was cancelled");
            // sign in was cancelled
            // Alert.alert('cancelled');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log("in progress");
            // operation in progress already
            // Alert.alert('in progress');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('play services not available or outdated');
            // Alert.alert('play services not available or outdated');
          } else {
            console.log('Something went wrong', error);
            // Alert.alert('Something went wrong', error);
          }
        }
    }; 

    const getInfoFromToken = (token) => {
      const PROFILE_REQUEST_PARAMS = {
        fields: {
          string: 'id, name,  first_name, last_name, email',
        },
      };
      const profileRequest = new GraphRequest(
        '/me',
        {token, parameters: PROFILE_REQUEST_PARAMS},
        (error, user) => {
          if (error) {
            console.log('login info has error: ' + error);
          } else {
            setUserInfo(user);  
            var formValues = {
              firstname   : user.first_name,
              lastname    : user.last_name,
              mobNumber   : "",
              pincode     : "",
              email       : user.email,
              pwd         : user.id,
              role        : 'user',
              status      : 'active',
              countryCode : "",
              authService : "facebook",
            }
            sign_in(formValues);
            logoutWithFacebook;
          }
        },
      );
      new GraphRequestManager().addRequest(profileRequest).start();
    };

    const loginWithFacebook = () => {
      // setLoading(true);
      // Attempt a login using the Facebook login dialog asking for default permissions.
      LoginManager.logInWithPermissions(['public_profile']).then(
        login => {
          if (login.isCancelled) {
            // setLoading(false);
            console.log('Login cancelled');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              const accessToken = data.accessToken.toString();
              getInfoFromToken(accessToken);
            });
          }
        },
        error => {
          setLoading(false);
          console.log('Login fail with error: ' + error);
        },
      );
    };


    const sign_in=(formValues)=>{
      axios.post('/api/auth/post/signup/social_media',formValues)
      .then((res) => {
        console.log("response",res);
        setLoading(false)
        if(res.data.message === "Login Auth Successful"){
          if(res.data.passwordreset === false  ){
            navigation.navigate('ChangePassword',{user_id:res.data.ID})
          }else{  
            AsyncStorage.multiSet([
              ['user_id', res.data.ID],
              ['token', res.data.token],
            ]);
            axios.defaults.headers.common['Authorization'] = 'Bearer '+ res.data.token;
            dispatch(
              setUserDetails({
                user_id     : res.data.ID,
                token       : res.data.token,
                authService : res.data.authService,
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
                role        : res.data.roles,
              }),
            );
            navigation.navigate('App');
          }
        }
      })
      .catch((error) => {
        // console.log("error",error);
        setLoading(false);
        setToast({text: 'Something went wrong.', color: 'red'});
      })
    }

    const getRandomInt=(min, max)=>{
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    
    const login_guest =()=>{
      var formValues = {
        firstname   : "",
        lastname    : "",
        mobNumber   : "",
        pincode     : "",
        email       : "",
        pwd         : "guest"+getRandomInt(1000, 9999),
        role        : 'user',
        status      : 'active',
        countryCode : "",
        authService : "guest"
      }
      setLoading(true);
      axios.post('/api/auth/post/signup/guest_login',formValues)
      .then((res) => {
        setLoading(false);
        if(res.data.message === "Login Auth Successful"){
          if(res.data.passwordreset === false  ){
            navigation.navigate('ChangePassword',{user_id:res.data.ID})
          }else{  
            AsyncStorage.multiSet([
              ['user_id', res.data.ID],
              ['token', res.data.token],
            ]);
            axios.defaults.headers.common['Authorization'] = 'Bearer '+ res.data.token;
            dispatch(
              setUserDetails({
                user_id     : res.data.ID,
                token       : res.data.token,
                authService : res.data.authService,
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
                role        : res.data.roles,
              }),
            );
            navigation.navigate('LocationMain');
          }
        }
      })
      .catch((error) => {
        // console.log("error",error);
        setLoading(false);
        setToast({text: 'Something went wrong.', color: 'red'});
      })
    }

    return (
      <ImageBackground 
        source={require("../../../AppDesigns/currentApp/images/s2.jpg")} 
        style={commonStyles.container} 
        resizeMode="contain" >
        <ScrollView style={{}}>
              <View style={styles.syslogo}>
                  <Image
                  resizeMode="contain"
                  source={require("../../../AppDesigns/currentApp/images/trollymart-black.png")}
                  style={styles.syslogoimg}
                  />
              </View>
              <View style={styles.textTitleWrapper}>
                <Text style={{fontSize:10,color:"#bbb"}}>Welcome to</Text>
                <Text style={{fontSize:15,fontWeight:'bold',color:"#000000"}}>Knock Knock</Text>
              </View>
            
            <View style={commonStyles.formWrapper}>
            <FormInput
              // style={[styles.inputBoxStyle]}
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
              value           = {values.username}
            />
            <FormInput
              labelName     = "Password"
              // placeholder   = "Enter Password"
              onChangeText  = {handleChange('password')}
              errors        = {errors}
              name          = "password"
              required      = {true}
              touched       = {touched}
              // iconName      = {'lock'}
              iconType      = {'material-community'}
              rightIcon ={
                <TouchableOpacity
                  style={{paddingRight: '5%'}}
                  onPress={() => togglePassword(!showPassword)}>
                  {showPassword ? (
                    <Icon name="eye-with-line" type="entypo" size={18} />
                  ) : (
                    <Icon name="eye" type="entypo" size={18} />
                  )}
                </TouchableOpacity>
              }
              secureTextEntry={!showPassword}
              value = {values.password}
            />
            <View style={{flexDirection:"row",paddingHorizontal:15,paddingBottom:20,}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}  style={{flex:1,alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                <Text style={[commonStyles.linkText]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <FormButton
              title       = {'Login'}
              onPress     = {handleSubmit}
              background  = {true}
              // loading     = {btnLoading}
            />
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
            {/* <Text style={{paddingVertical:10,fontSize:9,alignSelf:"center",fontFamily:"Montserrat-Bold"}}>OR</Text> */}
            <Text style={{paddingVertical:10,fontSize:9,alignSelf:"center",fontFamily:"Montserrat-Bold",color:"#aaa"}}>V 0.0.4</Text>
          </View>
        <Modal 
          animationType="slide"
          transparent={true}
          visible={btnLoading}
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
      </ScrollView>
    </ImageBackground>
  );
};