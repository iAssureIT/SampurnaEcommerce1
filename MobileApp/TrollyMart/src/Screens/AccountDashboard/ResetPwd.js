import React, { useState,useEffect,useRef} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,StyleSheet
} from 'react-native';
import { Button,Icon }      from "react-native-elements";
import axios                from "axios";
import styles               from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import { colors, sizes }    from '../../AppDesigns/currentApp/styles/styles.js';
import Loading              from '../../ScreenComponents/Loading/Loading.js';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import {FormButton}         from '../../ScreenComponents/FormButton/FormButton';
import {setToast, withCustomerToaster} from '../../redux/AppState.js';
import * as Yup             from 'yup';
import {Formik}             from 'formik';
import commonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {FormInput}          from '../../ScreenComponents/FormInput/FormInput';

const window = Dimensions.get('window');
  const LoginSchema = Yup.object().shape({
    current_password: Yup.string()
    .required('This field is required'),
    password: Yup.string()
    .required('This field is required'),
    confirm_password: Yup.string()
    .required('This field is required'),
  });



export const ResetPwd=withCustomerToaster((props)=>{
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const {setToast,navigation} = props; //setToast function bhetta
  const [userDetails , setUserDetails]=useState();
  const [user_id,setUserId]=useState('');
  useEffect(() => {
    getData();
  },[props]);

  const getData=async()=>{
    axios.get('/api/ecommusers/' + await AsyncStorage.getItem('user_id'))
    .then((response) => {
      setUserDetails(response.data.profile);
      setUserId(response.data._id);
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      if (error.response.status == 401) {
        AsyncStorage.removeItem('user_id');
        AsyncStorage.removeItem('token');
        setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
        navigation.navigate('Auth')
      }else{
        setToast({text: 'Something went wrong.', color: 'red'});
      }  
    })
  }

  if(userDetails){
    return (
      <React.Fragment>
        <Formik
          onSubmit={(data) => {
              setBtnLoading(true);
              let {firstName, lastName,mobileNumber,email_id} = data;
              var formValues = {
                firstname   : firstName,
                lastname    : lastName,
                mobNumber   : mobileNumber,
                email       : email_id,
              }
              axios.patch('/api/users/patch/' + user_id, formValues)
              .then((response) => {
                setBtnLoading(false);
                setToast({text: 'Your profile is updated!', color: 'green'});
                // this.setState({profileupdated:true});
              })
              .catch((error) => {
                console.log("error",error);
                setBtnLoading(false);
                setToast({text: 'Something went wrong.', color: 'red'});
              })
          }}
          validationSchema={LoginSchema}
          initialValues={{
            current_password  : '',
            password              : '',
            confirm_password      : '',
          }}>
          {(formProps) => (
            <FormBody
              loading={loading}
              btnLoading={btnLoading}
              navigation={navigation}
              setToast =   {setToast}
              {...formProps}
            />
          )}
        </Formik>
      </React.Fragment>
    );}else{
      return <Loading/>
    }
 })   

  const FormBody = (props) => {
    const {
      handleChange,
      handleSubmit,
      errors,
      touched,
      loading,
      setFieldValue,
      navigation,
      values,
      btnLoading,
      setToast,
    } = props;
    const [showCurrentPassword, toggleCurrentPassword] = useState(false);
    const [showPassword, togglePassword] = useState(false);
    const [showConfPassword, toggleConfPassword] = useState(false);
    const phoneInput = useRef(null);
    if (loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <React.Fragment>
          <View style={[styles.profileparent]}>
            <ScrollView contentContainerStyle={styles.container} style={{flex:1}} keyboardShouldPersistTaps="handled" >
                <View style={{ paddingHorizontal: 15, marginBottom: 30 }}>
                  <View style={{ borderWidth: 1, borderColor: '#f1f1f1', backgroundColor: '#ccc', paddingVertical: 15, marginTop: 10 }}>
                    <Text style={{ fontSize: 13, fontFamily: "Montserrat-SemiBold", color: '#333', paddingHorizontal: 15 }}>Reset Password : </Text>
                  </View>
                    <View style={styles.marTp15}>
                      <View style={commonStyles.formWrapper}>
                      <FormInput
                          labelName     = "Current Password"
                          // placeholder   = "Password"
                          onChangeText  = {handleChange('current_password')}
                          errors        = {errors}
                          name          = "current_password"
                          required      = {true}
                          touched       = {touched}
                          // iconName      = {'lock'}
                          // iconType      = {'font-awesome'}
                          rightIcon={
                              <TouchableOpacity  style={{paddingHorizontal:'5%'}} onPress={() => toggleCurrentPassword(!current_showPassword)}>
                                {showCurrentPassword ? (
                                  <Icon name="eye" type="entypo" size={18} />
                                ) : (
                                  <Icon name="eye-with-line" type="entypo" size={18} />
                                )}
                              </TouchableOpacity>
                            }
                          secureTextEntry={!showPassword}
                        />
                          <FormInput
                            labelName     = "Password"
                            // placeholder   = "Confirm Password"
                            onChangeText  = {handleChange('password')}
                            errors        = {errors}
                            name          = "password"
                            required      = {true}
                            touched       = {touched}
                            // iconName      = {'lock'}
                            // iconType      = {'font-awesome'}
                            rightIcon={
                                <TouchableOpacity  style={{paddingHorizontal:'5%'}} onPress={() => togglePassword(!showPassword)}>
                                  {showPassword ? (
                                    <Icon name="eye" type="entypo" size={18} />
                                  ) : (
                                    <Icon name="eye-with-line" type="entypo" size={18} />
                                  )}
                                </TouchableOpacity>
                              }
                              secureTextEntry={!showConfPassword}
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
                            // iconType      = {'font-awesome'}
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
                        
                        <FormButton
                          title       = {'Reset Password'}
                          onPress     = {handleSubmit}
                          background  = {true}
                          loading     = {btnLoading}
                        />
                      </View>
                    </View>
                  </View>
            </ScrollView>
          </View>
        </React.Fragment>
      );
    }
  }



  const styles1 = StyleSheet.create({
    containerStyle:{
       borderWidth:1,
       borderRadius:5,
       width:"100%",
       borderColor:"#ccc",
       backgroundColor:"#fff"
     },
     textInputStyle:{
         height:50,
         paddingTop:15,
         backgroundColor:"#fff"
     },
     textContainerStyle:{
       height:50,
       padding:0,
       backgroundColor:"#fff"
     },
   });