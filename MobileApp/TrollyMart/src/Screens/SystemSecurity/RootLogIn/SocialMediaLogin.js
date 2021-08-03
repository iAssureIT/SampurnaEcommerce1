import React,{useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert
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
import {USER_LOGOUT} from '../../../redux/store';
import { getCartCount} from '../../../redux/productList/actions';

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


    
  export const SocialMediaLogin = withCustomerToaster((props)=>{
    const {
      navigation,
      setToast
    } = props;
    const [openModal, setModal] = useState(false);
    const [showPassword, togglePassword] = useState(false);
    const [image, setImage] = useState({profile_photo: '', image: ''});
    const [userInfo,setUserInfo]=useState({});
    const [googleLoading, setGoogleLoading] = useState(false);
    const [btnLoading, setLoading] = useState(false);
    const dispatch = useDispatch();
    
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
            console.log("user",user);
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
            console.log("formValues",formValues);
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
        // dispatch({type: USER_LOGOUT});
        console.log("response",res);
        setLoading(false)
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
          }
        }
      })
      .catch((error) => {
        console.log("error",error);
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
        <View style={{backgroundColor:"#fff",marginTop:30}}>
            <View style={{alignItems:"center",justifyContent:"center",flexDirection:'row'}}>
                <TouchableOpacity
                 onPress={()=>google_login()}
                  style={{
                    backgroundColor:"#fff",
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 30, 
                    height: 30,
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
                    width: 30, 
                    height: 30,
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
                  <Icon name='facebook' type='font-awesome' size={36} color="#fff"/>
                </TouchableOpacity>
            </View>
        <Modal 
          animationType="slide"
          transparent={true}
          visible={btnLoading}
        >
        <View 
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            flex:1,
            justifyContent:'center',
            alignItems:'center'
          }}>
            <ActivityIndicator color={colors.theme} size={40}/>
        </View>
        </Modal>
      </View>
  );
});