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
import {useNavigation}      from '../../../config/useNavigation.js';
import {emailValidator}     from '../../../config/validators.js';
import {Formik}             from 'formik';
import {withCustomerToaster} from '../../../redux/AppState.js';
import {setUserDetails}     from '../../../redux/user/actions';
import AsyncStorage         from '@react-native-async-storage/async-storage';
const window = Dimensions.get('window');
  const LoginSchema = Yup.object().shape({
    email_id: Yup.string()
      .required('This field is required')
      .test(
        'email validation test',
        'Enter a valid email address',
        emailValidator,
      ),
    password: Yup.string().required('This field is required'),
  });


  export const RootLogIn = withCustomerToaster((props)=>{
    const [btnLoading, setLoading] = useState(false);
    const {setToast} = props; //setToast function bhetta
    const dispatch = useDispatch();
    const navigation = useNavigation();
      return (
        <React.Fragment>
          <Formik
            onSubmit={(data) => {
              console.log("data",data);
              setLoading(true);
              let {email_id, password} = data;
              const payload = {
                email     : email_id,
                password  : password,
                role      : "user"
              };
              axios
                .post('/api/auth/post/login', payload)
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
                      ])
                      dispatch(
                        setUserDetails({
                          user_id     : res.data.ID,
                          token       : res.data.token,
                          firstName   : res.data.userDetails.firstName,
                          lastName    : res.data.userDetails.lastName,
                          email       : res.data.userDetails.email,
                          mobile      : res.data.userDetails.mobile,
                          fullName    : res.data.userDetails.fullName,
                          company_id  : res.data.userDetails.company_id,
                          companyID   : res.data.userDetails.companyID,
                          companyName : res.data.userDetails.companyName,
                          status      : res.data.userDetails.status,
                          role        : res.data.roles
                        }),
                      );
                      navigation.navigate('Dashboard')
                    }
                  }else if(res.data.message === 'INVALID_PASSWORD'){
                    setToast({text: "Please enter correct password", color: colors.warning});
                    setLoading(false);
                  }else if(res.data.message === 'NOT_REGISTER'){
                    setToast({text: "This Email Id is not registered.", color: colors.warning});
                    setLoading(false);
                  }else if(res.data.message === 'USER_BLOCK'){
                    setToast({text: "Please contact to admin", color: colors.warning});
                    setLoading(false);
                  }else if(response.data.message === 'USER_UNVERIFIED'){
                    setToast({text: "Your verification is still pending.", color: colors.warning});
                    var sendData = {
                      "event": "2",
                      "toUser_id": response.data.userDetails.user_id,
                      "toUserRole":"user",
                        "variables": {
                          "Username" : response.data.userDetails.firstName,
                          "OTP" : response.data.userDetails.otpEmail,
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
              email_id: '',
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
    
  return (
    <View style={{backgroundColor : "red"}}>
      <ImageBackground source={require("../../../AppDesigns/currentApp/images/Background.png")} style={commonStyles.container} resizeMode="cover" >
      <View style={{paddingHorizontal:20}}>
          <View style={styles.boxOpacity}>
                <View style={styles.syslogo}>
                    <Image
                    resizeMode="contain"
                    source={require("../../../AppDesigns/currentApp/images/Logo.png")}
                    style={styles.syslogoimg}
                    />
                </View>
                <View style={styles.textTitleWrapper}><Text style={commonStyles.headerText}>Sign In</Text></View>
            <View style={commonStyles.formWrapper}>
            <FormInput
              labelName       = "Email Id"
              placeholder     = "Email Id"
              onChangeText    = {handleChange('email_id')}
              required        = {true}
              name            = "email_id"
              errors          = {errors}
              touched         = {touched}
              iconName        = {'email'}
              iconType        = {'material-community'}
              autoCapitalize  = "none"
              keyboardType    = "email-address"
            />
            <FormInput
              labelName     = "Password"
              placeholder   = "Password"
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
                  marginBottom    : 25,
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
          </View>
        </View>
      </View>
    </ImageBackground>
  </View>
  );
};