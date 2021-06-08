import React,{useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
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


GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  webClientId: "1023694532217-4b1v4vf0oukma7c8c1bnogpr40b28kii.apps.googleusercontent.com",
  offlineAccess: false,
});

const window = Dimensions.get('window');
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('This field is required'),
    password: Yup.string().required('This field is required'),
  });


  export const RootLogIn = withCustomerToaster((props)=>{
    console.log("RootLogIn props",props)
    const [btnLoading, setLoading] = useState(false);
    const {setToast,navigation} = props; //setToast function bhetta
    const dispatch = useDispatch();
      return (
        <React.Fragment>
          <Formik
            onSubmit={(data) => {
              console.log("data",data);
              setLoading(true);
              let {username, password} = data;
              const payload = {
                username  : username,
                password  : password,
                role      : "user"
              };
              console.log()
              axios
                .post('/api/auth/post/login/mob_email', payload)
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
                      navigation.push('Confirmation');
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
    

  const _signIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        await GoogleSignin.revokeAccess();
        }catch(error){
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


  return (
      <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={commonStyles.container} resizeMode="cover" >
      <View style={{paddingHorizontal:20}}>
          <View style={styles.boxOpacity}>
              <View style={styles.syslogo}>
                  <Image
                  resizeMode="contain"
                  source={require("../../../AppDesigns/currentApp/images/trollymart-black.png")}
                  style={styles.syslogoimg}
                  />
              </View>
              <View style={styles.textTitleWrapper}><Text style={commonStyles.headerText}>Sign In</Text></View>
            
            <View style={commonStyles.formWrapper}>
            <FormInput
              labelName       = "Email Id/Mobile No"
              placeholder     = "Enter Email Id / Mobile No"
              onChangeText    = {handleChange('username')}
              required        = {true}
              name            = "username"
              errors          = {errors}
              touched         = {touched}
              iconName        = {'email'}
              iconType        = {'material-community'}
              autoCapitalize  = "none"
              keyboardType    = "email-address"
            />
            <FormInput
              labelName     = "Password"
              placeholder   = "Enter Password"
              onChangeText  = {handleChange('password')}
              errors        = {errors}
              name          = "password"
              required      = {true}
              touched       = {touched}
              iconName      = {'lock'}
              iconType      = {'material-community'}
              rightIcon ={
                <TouchableOpacity
                  style={{paddingHorizontal: '5%'}}
                  onPress={() => togglePassword(!showPassword)}>
                  {showPassword ? (
                    <Icon name="eye-with-line" type="entypo" size={18} />
                  ) : (
                    <Icon name="eye" type="entypo" size={18} />
                  )}
                </TouchableOpacity>
              }
              secureTextEntry={!showPassword}
            />
            <FormButton
              title       = {'Login'}
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
                  // marginBottom    : 25,
                },
              ]}>
                <View style={{flexDirection:"row",paddingHorizontal:15}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Signup')} style={{flex:.5,alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                  <Text style={commonStyles.linkText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}  style={{flex:0.5,alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                  <Text style={commonStyles.linkText}>Forgot Password</Text>
                </TouchableOpacity>
                </View>
            </View>
           {/* <Text style={{paddingVertical:10,alignSelf:"center",fontFamily:"Montserrat-Bold"}}>OR</Text>
            <View style={{alignItems:"center",justifyContent:"center"}}>
              <GoogleSigninButton
                style={{ width: window.width-50, height: 50 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={()=>_signIn()}
                // disabled={this.state.isSigninInProgress} 
                />
            </View>  */}
            <Text style={{paddingVertical:10,alignSelf:"center",fontFamily:"Montserrat-Bold"}}>OR</Text>
            <View style={{alignItems:"center",justifyContent:"center",marginBottom:15}}>
                <FormButton
                  title       = {'Login As a Guest'}
                  onPress     = {()=>navigation.push('App')}
                  background  = {true}
                  // loading     = {btnLoading}
              />
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};