import React, { useState,useEffect,useRef} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,StyleSheet
} from 'react-native';
import axios              from "axios";
import styles             from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import { colors, sizes }  from '../../AppDesigns/currentApp/styles/styles.js';
import Loading            from '../../ScreenComponents/Loading/Loading.js';
import AsyncStorage       from '@react-native-async-storage/async-storage';
import PhoneInput           from "react-native-phone-number-input";
import {FormButton}         from '../../ScreenComponents/FormButton/FormButton';
import {setToast, withCustomerToaster} from '../../redux/AppState.js';
import * as Yup             from 'yup';
import {emailValidator,specialCharacterValidator,mobileValidator}     from '../../config/validators.js';
import {Formik}             from 'formik';
import commonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {FormInput}          from '../../ScreenComponents/FormInput/FormInput';
import { CheckBox,Icon}     from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";

const window = Dimensions.get('window');




export const AccountInformation=withCustomerToaster((props)=>{
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const {setToast,navigation} = props; //setToast function bhetta
  const [userDetails , setUserDetails]=useState();
  const [user_id,setUserId]=useState('');
  const [checkedMobNo,setCheckedMobNo] = useState(false);
  const [checkedEmailId,setCheckedEmailId] = useState(false);
  useEffect(() => {
    getData();
    setCheckedMobNo(false);
    setCheckedEmailId(false)
  },[props,isFocused]);

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
       {isFocused && <Formik
          onSubmit={(data) => {
              setBtnLoading(true);
              let {firstName, lastName,mobileNumber,email_id,current_password} = data;
              var formValues = {
                firstname         : firstName,
                lastname          : lastName,
                mobNumber         : mobileNumber,
                email             : email_id,
                current_password  : current_password,
                otp               : '',
              }
              console.log("formValues",formValues);
              // axios.patch('/api/users/patch/' + user_id, formValues)
              // .then((response) => {
              //   setBtnLoading(false);
              //   setToast({text: 'Your profile is updated!', color: 'green'});
              //   // this.setState({profileupdated:true});
              // })
              // .catch((error) => {
              //   console.log("error",error);
              //   setBtnLoading(false);
              //   setToast({text: 'Something went wrong.', color: 'red'});
              // })
          }}
          validationSchema={
              checkedEmailId && checkedMobNo ?
              Yup.object().shape({
                firstName: Yup.string()
                .required('This field is required')
                .test(
                  'special character test',
                  'This field cannot contain only special characters or numbers',
                  specialCharacterValidator,
                ),
                lastName: Yup.string()
                .required('This field is required')
                .test(
                  'special character test',
                  'This field cannot contain only special characters or numbers',
                  specialCharacterValidator,
                ),
                mobileNumber: Yup.string()
                .required('This field is required'),
                email_id: Yup.string()
                .required('This field is required')
                  .test(
                    'email validation test',
                    'Enter a valid email address',
                    emailValidator,
                  ),
                  current_password: Yup.string()
                .required('This field is required')
                })
                :
                checkedMobNo ?
                Yup.object().shape({
                firstName: Yup.string()
                .required('This field is required')
                .test(
                  'special character test',
                  'This field cannot contain only special characters or numbers',
                  specialCharacterValidator,
                ),
                lastName: Yup.string()
                .required('This field is required')
                .test(
                  'special character test',
                  'This field cannot contain only special characters or numbers',
                  specialCharacterValidator,
                ),
                mobileNumber: Yup.string()
                .required('This field is required'),
              })
              :
                checkedEmailId ?
                Yup.object().shape({
                  firstName: Yup.string()
                  .required('This field is required')
                  .test(
                    'special character test',
                    'This field cannot contain only special characters or numbers',
                    specialCharacterValidator,
                  ),
                  lastName: Yup.string()
                  .required('This field is required')
                  .test(
                    'special character test',
                    'This field cannot contain only special characters or numbers',
                    specialCharacterValidator,
                  ),
                  email_id: Yup.string()
                  .required('This field is required')
                    .test(
                      'email validation test',
                      'Enter a valid email address',
                      emailValidator,
                    ),
                  current_password: Yup.string()
                  .required('This field is required')
                  })
                :
                Yup.object().shape({
                  firstName: Yup.string()
                  .required('This field is required')
                  .test(
                    'special character test',
                    'This field cannot contain only special characters or numbers',
                    specialCharacterValidator,
                  ),
                  lastName: Yup.string()
                  .required('This field is required')
                  .test(
                    'special character test',
                    'This field cannot contain only special characters or numbers',
                    specialCharacterValidator,
                  ),
                })
          }
          initialValues={{
            firstName         : userDetails && userDetails.firstname? userDetails.firstname:'',
            lastName          : userDetails && userDetails.lastname? userDetails.lastname:'',
            mobileNumber      : userDetails && userDetails.mobile? userDetails.mobile:'',
            email_id          : userDetails && userDetails.email ?userDetails.email:'',
            current_password  : '',
          }}>
          {(formProps) => (
            <FormBody
              loading={loading}
              btnLoading={btnLoading}
              navigation={navigation}
              setToast =   {setToast}
              checkedMobNo={checkedMobNo}
              setCheckedMobNo={setCheckedMobNo}
              checkedEmailId={checkedEmailId}
              setCheckedEmailId={setCheckedEmailId}
              {...formProps}
            />
          )}
        </Formik>}
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
      checkedMobNo,
      setCheckedMobNo,
      checkedEmailId,
      setCheckedEmailId
    } = props;
    const [openModal, setModal] = useState(false);
    const [showPassword, togglePassword] = useState(false);
    const [image, setImage] = useState({profile_photo: '', image: ''});
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [countryCode, setCountryCode] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const [showCurrentPassword, toggleCurrentPassword] = useState(false);
    const phoneInput = useRef(null);
    if (loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <React.Fragment>
          <View style={styles.profileparent}>
            <View style={{flex:1,backgroundColor:"#fff"}}>
            <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
                <View style={{ paddingHorizontal: 15, marginBottom: 30 }}>
                  <View style={{ borderWidth: 1, borderColor: '#f1f1f1', backgroundColor: '#ccc', paddingVertical: 15, marginTop: 10 }}>
                    <Text style={{ fontSize: 13, fontFamily: "Montserrat-SemiBold", color: '#333', paddingHorizontal: 15 }}>Profile Details : </Text>
                  </View>
                    <View style={styles.marTp15}>
                      <View style={commonStyles.formWrapper}>
                        <FormInput
                          labelName       = "First Name"
                          placeholder     = "First Name"
                          onChangeText    = {handleChange('firstName')}
                          required        = {true}
                          name            = "firstName"
                          errors          = {errors}
                          touched         = {touched}
                          // iconName        = {'user-circle-o'}
                          // iconType        = {'font-awesome'}
                          value           = {values.firstName} 
                          // autoCapitalize  = "none"
                        />
                        <FormInput
                          labelName       = "Last Name"
                          placeholder     = "Last Name"
                          onChangeText    = {handleChange('lastName')}
                          required        = {true}
                          name            = "lastName"
                          errors          = {errors}
                          touched         = {touched}
                          // iconName        = {'user-circle-o'}
                          // iconType        = {'font-awesome'}
                          value           = {values.lastName} 
                          // autoCapitalize  = "none"
                        />

                        <CheckBox
                          title='Change Mobile No'
                          checked={checkedMobNo}
                          onPress={() => setCheckedMobNo(!checkedMobNo)}
                        />
                        {checkedMobNo && <View style={{marginHorizontal:10,marginVertical:5}}>
                        <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 14,paddingVertical:2}}>
                            <Text>Phone Number</Text>{' '}
                            <Text style={{color: 'red', fontSize: 12}}>
                            *
                            </Text>
                        </Text>
                            <PhoneInput
                              ref={phoneInput}
                              defaultValue={values.mobileNumber}
                              defaultCode={values.countryCode}
                              layout="first"
                              onChangeText={(text) => {
                                console.log("text",text);
                                const checkValid = phoneInput.current?.isValidNumber(text);
                                const callingCode = phoneInput.current?.getCallingCode(text);
                                const countryCode = phoneInput.current?.getCountryCode(text);
                                var mobileNumber = "+"+callingCode+" "+text;
                                setValue(text);
                                setFieldValue('mobileNumber',mobileNumber)
                                setFieldValue('countryCode',countryCode)
                                setValid(checkValid);

                              }}
                              containerStyle= {styles1.containerStyle}
                              textContainerStyle={styles1.textContainerStyle}
                              textInputStyle={styles1.textInputStyle}
                            />
                          <Text style={{fontSize:12,marginTop:2,color:"#f00"}}>{value ? !valid && "Enter a valid mobile number" :touched['mobileNumber'] && errors['mobileNumber'] ? errors['mobileNumber'] : ''}</Text>
                        </View> }
                        <CheckBox
                          title='Change Email Id'
                          checked={checkedEmailId}
                          onPress={() => setCheckedEmailId(!checkedEmailId)}
                        />
                              
                        {checkedEmailId &&
                        <>
                        <FormInput
                          labelName       = "Email Id"
                          placeholder     = "Email Id"
                          onChangeText    = {handleChange('email_id')}
                          required        = {false}
                          name            = "email_id"
                          errors          = {errors}
                          touched         = {touched}
                          // iconName        = {'email'}
                          // iconType        = {'material-community'}
                          autoCapitalize  = "none"
                          keyboardType    = "email-address"
                          value           = {values.email_id}
                        />
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
                              <TouchableOpacity  style={{paddingHorizontal:'5%'}} onPress={() => toggleCurrentPassword(!showCurrentPassword)}>
                                {showCurrentPassword ? (
                                  <Icon name="eye" type="entypo" size={18} />
                                ) : (
                                  <Icon name="eye-with-line" type="entypo" size={18} />
                                )}
                              </TouchableOpacity>
                            }
                          secureTextEntry={!showCurrentPassword}
                        />
                        </>
                        }
                        <FormButton
                          title       = {'Update Profile'}
                          onPress     = {handleSubmit}
                          background  = {true}
                          loading     = {btnLoading}
                        />
                      </View>
                    </View>
                  </View>
            </ScrollView>
          </View>
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