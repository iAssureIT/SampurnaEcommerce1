import React, {useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,TextInput,
  Alert
} from 'react-native';
import { Button, Icon }       from "react-native-elements";
import { TextField }          from "react-native-material-textfield";
import ValidationComponent    from "react-native-form-validator";
import axios                 from 'axios';
import styles               from '../../../AppDesigns/currentApp/styles/ScreenStyles/SystemSecurityStyles.js';
import {colors,sizes}         from '../../../AppDesigns/currentApp/styles/styles.js';
import Modal                  from "../../Modal/OpenModal.js";
import { Fumi }               from 'react-native-textinput-effects';
import FontAwesomeIcon        from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect }            from 'react-redux';
import commonStyle        from '../../../AppDesigns/currentApp/styles/CommonStyles.js';
import {Formik}             from 'formik';
import {withCustomerToaster} from '../../../redux/AppState.js';
import * as Yup             from 'yup';
import {FormButton}         from '../../../ScreenComponents/FormButton/FormButton';
import {FormInput}          from '../../../ScreenComponents/FormInput/FormInput';
import { CommonActions } from '@react-navigation/native';

const window = Dimensions.get('window');
const ChanegPasswordSchema = Yup.object().shape({

  confirm_password: Yup.string().required('This field is required'),
  password: Yup.string().required('This field is required'),
});
export const ResetPassword = withCustomerToaster((props) => {
    const [btnLoading, setLoading] = useState(false);
    const {setToast,navigation,route} = props; //setToast function bhetta
    const {user_id}=route.params;
    const backAction = () => {
      navigation.navigate('LogIn');
      return true;
    };
    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    },[]);

    return (
      <React.Fragment>
        <Formik
          onSubmit={data => {
            setLoading(true);
            if(data.password == data.confirm_password){
              setLoading(true)
              var formValues = {
                pwd: data.password,
              };
              axios.patch('/api/auth/patch/change_password_using_otp/id/'+user_id,formValues)
              .then((response)=>{  
                console.log("response",response);
                if(response.data === "PASSWORD_RESET"){
                  setToast({
                    text: "Password Changed",
                    color: 'green',
                  });
                  setLoading(false);
                  navigation.navigate('LogIn');
                }else if(response.data.message === "SAME_AS_CURRENT_PASSWORD"){
                  setToast({
                    text: "Your new password cannot be the same as your current password",
                    color: colors.warning,
                  });
                  setLoading(false);
                }
                else{
                  setToast({
                    text: "Password not changed",
                    color: colors.warning,
                  });
                  setLoading(false);
                }       
              })
              .catch((error)=>{
                setToast({text: "Something Went Wrong", color: 'red'});
                setLoading(false);
              })
            }else{
              setToast({
                text: "Password not matched",
                color: colors.warning,
              });
              setLoading(false);
            }
          }}
          validationSchema={ChanegPasswordSchema}
          initialValues={{
            password: '',
            confirm_password:'',
            token:'',
            user_id:''
          }}>
          {formProps => <FormBody btnLoading={btnLoading} {...formProps} />}
        </Formik>
      </React.Fragment>
    );
  });
  
  const FormBody = props => {
    const {
      handleChange,
      handleSubmit,
      errors,
      touched,
      btnLoading,
      navigation,
      setFieldValue,
    } = props;
    const [openModal, setModal] = useState(false);
    const [showPassword, togglePassword] = useState(false);
    const [showConfPassword, toggleConfPassword] = useState(false);
    const [image, setImage] = useState({profile_photo: '', image: ''});
  
    return (
          <View style={{paddingHorizontal:20,paddingVertical:15,flex:1}}>
          <View style={styles.boxOpacity}>
          {/* <TouchableOpacity style={{alignSelf:'flex-start',paddingHorizontal:10,height:30,paddingRight:5}} onPress={()=> navigation.goBack()}>
              <Icon size={25} name='arrow-left' type='material-community' color={colors.theme} />
          </TouchableOpacity> */}
          <Image
            style={{height: 120, width: 150, alignSelf: 'center'}}
            source={require("../../../AppDesigns/currentApp/images/trollymart-black.png")}
            resizeMode="contain"
          />
           <View style={styles.textTitleWrapper}><Text style={commonStyle.headerText}>Reset Password</Text></View>
            <FormInput
              labelName     = "Password"
              // placeholder   = "Password"
              onChangeText  = {handleChange('password')}
              errors        = {errors}
              name          = "password"
              required      = {true}
              touched       = {touched}
              // iconName      = {'lock'}
              iconType      = {'font-awesome'}
              rightIcon={
                  <TouchableOpacity  style={{paddingHorizontal:'5%'}} onPress={() => togglePassword(!showPassword)}>
                    {showPassword ? (
                      <Icon name="eye" type="entypo" size={18} />
                    ) : (
                      <Icon name="eye-with-line" type="entypo" size={18} />
                    )}
                  </TouchableOpacity>
                }
              secureTextEntry={!showPassword}
            />
            <FormInput
              labelName     = "Confirm Password"
              // placeholder   = "Confirm Password"
              onChangeText  = {handleChange('confirm_password')}
              errors        = {errors}
              name          = "confirm_password"
              required      = {true}
              touched       = {touched}
              // iconName      = {'lock'}
              iconType      = {'font-awesome'}
              rightIcon={
                  <TouchableOpacity  style={{paddingHorizontal:'5%'}} onPress={() => toggleConfPassword(!showConfPassword)}>
                    {showConfPassword ? (
                      <Icon name="eye" type="entypo" size={18} />
                    ) : (
                      <Icon name="eye-with-line" type="entypo" size={18} />
                    )}
                  </TouchableOpacity>
                }
                secureTextEntry={!showConfPassword}
            />
            <View style={{marginVertical:30}}>
              <FormButton
                title       = {"Change"}
                onPress     = {handleSubmit}
                background  = {true}
                loading     = {btnLoading}
              />
            </View>            
        </View>  
        </View>
    );
  };
