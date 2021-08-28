import React,{useState,useEffect,useRef} from 'react';
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
  BackHandler,
  StyleSheet
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
import DeviceInfo from 'react-native-device-info';
import {getCartCount}       from '../../../redux/productList/actions';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PhoneInput           from "react-native-phone-number-input";

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
   
    // const backAction = () => {
    //   Alert.alert("","Are you sure you want to exit app?", [
    //     {
    //       text: "Cancel",
    //       onPress: () => null,
    //       style: "cancel"
    //     },
    //     { text: "YES", onPress: () => BackHandler.exitApp() }
    //   ]);
    //   return true;
    // };
    
    // useEffect(() => {
    //   BackHandler.addEventListener("hardwareBackPress", backAction);
    //   return () =>
    //   BackHandler.removeEventListener("hardwareBackPress", backAction);
    // },[]);

      return (
        <React.Fragment>
           {isFocused &&<Formik
            onSubmit={(values,fun) => {
              setLoading(true);
              let {username, password} = values;
              const payload = {
                username  : username,
                password  : password,
                role      : "user"
              };
              axios
                .post('/api/auth/post/login/mob_email', payload)
                .then((res) => {
                  console.log("res",res);
                  setLoading(false);
                  if(res.data.message === "Login Auth Successful"){
                    dispatch(getCartCount(res.data.ID));
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
                          isdCode      : res.data.userDetails.isdCode,
                          authService  : res.data.authService,
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
                      navigation.navigate('LocationMain');
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
                    navigation.navigate('OTPVerification',{userID:res.data.ID,Username:res.data.result.profile.firstname});
                  }
                })
                .catch((error) => {
                  console.log("error",error.message);
                  setLoading(false);
                  setToast({text: error.message, color: 'red'});
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
    const [inpuType,setInputType]=useState('text');
    const phoneInput = useRef(null);
    const [value, setValue] = useState(values.mobileNumber);
  const logoutWithFacebook = () => {
    LoginManager.logOut();
    setUserInfo({})
  };

  const google_login = async () => {
      try {
        setLoading(true);
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log("userInfo",userInfo);
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
            authService : "google",
            social_media_id : userInfo.user.id,  
          }
          sign_in(formValues)
        }catch(error){
          console.log("error",error);
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
              social_media_id : user.id,  
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
              console.log("accessToken",accessToken);
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
        setLoading(false);
        if(res.data.message === "Login Auth Successful"){
          dispatch(getCartCount(res.data.ID));
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


    const checkType = (e)=>{
      console.log("typeof(e)",typeof(e))
      if(e.length>1){
        if(isNumeric(e)){
          setInputType('number');
        }else{
          setInputType('text');
        }
      }else{
        setInputType('text');
      }
      setFieldValue('username',e)
    }

    const isNumeric=(value)=>{
      return /^-?\d+$/.test(value);
  }

    return (
      <ImageBackground 
        source={require("../../../AppDesigns/currentApp/images/s2.png")} 
        style={[commonStyles.container]} 
        resizeMode="cover" >
        <ScrollView style={{}} >
              <View style={styles.syslogoLoginNEW}>
                  <Image
                  resizeMode="contain"
                  source={require("../../../AppDesigns/currentApp/images/trollymart-black.png")}
                  style={styles.syslogoimgLogin}
                  />
              </View>
              <View style={styles.textTitleWrapper}>
                <Text style={{fontSize:RFPercentage(2.2),color:"#bbb",fontFamily:"Montserrat-Medium",}}>Welcome to</Text>
                <Text style={{fontSize:RFPercentage(2.7),fontWeight:'bold',color:"#000000"}}>Knock Knock</Text>
              </View>
            
            <View style={commonStyles.formWrapper}>
            {
            // inpuType==='text' ?
            <FormInput
              // style={[styles.inputBoxStyle]}
              labelName       = "Phone no / Email Id"
              // placeholder     = "Enter Mobile No / Email Id..."
              onChangeText    = {(e)=>checkType(e)}
              required        = {true}
              name            = "username"
              errors          = {errors}
              touched         = {touched}
              // iconName        = {'email'}
              iconType        = {'material-community'}
              autoCapitalize  = "none"
              // keyboardType    = "email-address"
              value           = {values.username}
              autoFocus 
            />
            // :
            // <View style={{margin:10}}>
            //     <Text style={{ fontSize: 14,paddingVertical:2}}>
            //         <Text style={{fontFamily:'Montserrat-Medium', fontSize: RFPercentage(1.8),color:'#000'}}>Phone Number</Text>{' '}
            //         <Text style={{color: 'red', fontSize: RFPercentage(1.8)}}>
            //         *
            //         </Text>
            //     </Text>
            //       <PhoneInput
            //         ref={phoneInput}
            //         defaultCode="AE"
            //         layout="second"
            //         placeholder='Phone Number'
            //         value           = {values.username}
            //         onChangeText={(text) => {
            //           const checkValid = phoneInput.current?.isValidNumber(text);
            //           const callingCode = phoneInput.current?.getCallingCode(text);
            //           const countryCode = phoneInput.current?.getCountryCode(text);
            //           console.log("callingCode",callingCode);
            //           var mobileNumber = text;
            //           setValue(text);
            //           checkType(text)
            //         }}
            //         containerStyle= {styles1.containerStyle}
            //         textContainerStyle={styles1.textContainerStyle}
            //         textInputStyle={styles1.textInputStyle}
            //         codeTextStyle={styles1.codeStyle}
            //         keyboardType='default'
            //         autoFocus 
            //       />
            //   </View> 
            }
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
                    <Icon style={{color:'#000'}} name="eye-with-line" type="entypo" size={18} />
                  ) : (
                    <Icon style={{color:'#000'}} name="eye" type="entypo" size={18} />
                  )}
                </TouchableOpacity>
              }
              secureTextEntry={!showPassword}
              value = {values.password}
            />
            <View style={{flexDirection:"row",paddingHorizontal:wp(2),paddingBottom:hp(4),}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}  style={{flex:1,alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                <Text style={[{fontSize:RFPercentage(1.5),color: "#033554",fontFamily:"Montserrat-Regular",opacity:1}]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <FormButton
              title       = {'Sign In'}
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
                <View style={{flexDirection:"row"}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Signup')} style={{flex:1,alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                  <Text style={{fontSize:RFPercentage(1.5),fontFamily:"Montserrat-Medium",}}>Don't have an account?<Text style={[commonStyles.linkText,{fontSize:RFPercentage(1.8),fontFamily:"Montserrat-SemiBold",fontWeight:'600'}]}> Sign Up</Text></Text>                  
                </TouchableOpacity>                
                </View>
            </View>
           <Text style={{paddingVertical:hp(1.5),alignSelf:"center",fontSize:RFPercentage(1.3),color:'#000',fontFamily:"Montserrat-Bold"}}>OR</Text>
            <View style={{alignItems:"center",justifyContent:"center",flexDirection:'row'}}>
              {/* <GoogleSigninButton
                style={{ width: 41, height: 41,borderRadius:100,marginRight:15}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={()=>google_login()}
                // loading={googleLoading}
                // disabled={true} 
                /> */}
                <TouchableOpacity
                 onPress={()=>google_login()}
                  style={{
                    backgroundColor:"#fff",
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: hp(6), 
                    height: hp(6),
                    borderRadius:100,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    marginRight:15
                  }}>
                  <Image
                    resizeMode="contain"
                    source={require("../../../AppDesigns/currentApp/images/google.png")}
                    style={{height:"100%",width:"100%"}}
                  />
                  {/* <Icon name='google' type='font-awesome' size={36} color="#EA4335"/> */}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=>loginWithFacebook()}
                  style={{
                    backgroundColor:"#4267B2",
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: hp(6), 
                    height: hp(6),
                    borderRadius:100,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                  <Icon style={{alignSelf:'center'}} name='facebook' type='font-awesome' size={25} color="#fff"/>
                </TouchableOpacity>
            </View>
            <Text style={{paddingVertical:hp(1.5),fontSize:RFPercentage(1.3),alignSelf:"center",color:'#000',fontFamily:"Montserrat-Bold"}}>OR</Text>
            <View style={{alignItems:"center",justifyContent:"center",marginBottom:hp(2.2)}}>
                <FormButton
                  title       = {'Continue as a Guest'}
                  // onPress     = {()=>navigation.navigate('LocationMain')}
                  onPress     = {()=>login_guest()}
                  background  = {true}
                  // loading     = {btnLoading}
              />
            </View>
            <Text style={{paddingVertical:hp(1.5),fontSize:RFPercentage(1.3),alignSelf:"center",fontFamily:"Montserrat-Bold",color:"#aaa"}}>V {DeviceInfo.getVersion()}</Text>
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
       height:hp(4),
       backgroundColor:'transparent'
   },
   textContainerStyle:{
     height:50,
     padding:0,
     backgroundColor:"transparent"
   },
   codeStyle:{
     fontSize:RFPercentage(1.8),
     width:'50%',
     alignItems:"flex-start"
   },
  
 });