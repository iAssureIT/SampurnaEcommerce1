import React, { useState,useEffect,useRef} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,StyleSheet,Image,ActivityIndicator
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
import { NetWorkError } from '../../../NetWorkError.js';
import {getUserDetails}           from '../../redux/user/actions';
import { 
  useDispatch,
   }    from 'react-redux';
 import Modal  from "react-native-modal";
 import OTPInputView         from '@twotalltotems/react-native-otp-input';
 import { RadioButton }        from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const window = Dimensions.get('window');

const intialSchema =Yup.object().shape({
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


export const AccountInformation=withCustomerToaster((props)=>{
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const {setToast,navigation} = props; //setToast function bhetta
  const [userDetails , setUserDetails]=useState();
  const [user_id,setUserId]=useState('');
  const [checkedMobNo,setCheckedMobNo] = useState(false);
  const [checkedEmailId,setCheckedEmailId] = useState(false);
  const [otpModal,setModal]=useState(false);
  const [schema, updateSchema ] = React.useState(intialSchema);
  const dispatch = useDispatch();
  useEffect(() => {
    getData();
    setCheckedMobNo(false);
    setCheckedEmailId(false)
  },[props,isFocused]);

  
  useEffect(() => {
    if(checkedMobNo){
      var new_schema = Yup.object().shape({
        mobileNumber: Yup.string()
        .required('This field is required'),
      })
    }else if(checkedEmailId){
      var new_schema = Yup.object().shape({
        email_id: Yup.string()
        .required('This field is required')
        .test(
          'email validation test',
          'Enter a valid email address',
          emailValidator,
        ),
      })
    }else{
      var new_schema = intialSchema;
    }
    updateSchema(new_schema)
  },[checkedEmailId,checkedMobNo]);

  const getData=async()=>{
    axios.get('/api/ecommusers/' + await AsyncStorage.getItem('user_id'))
    .then((response) => {
      console.log("getData response",response);
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
          onSubmit={(values,fun) => {
            console.log("initialSchema",schema)
              setBtnLoading(true);
            var {firstName, lastName,mobileNumber,email_id,current_password,isdCode,mobileChange,emailChange,otp} = values;
            if(otp!==''){
              var formValues={
                  "user_id"       : user_id,
                  "isdCode"       : isdCode,
                  "mobile"     	  : mobileNumber,
                  "otp"           : otp
            }
              axios.patch('/api/users/update/verify_user_otp',formValues)
              .then((response) => {
                setBtnLoading(false);
                if(response.data.messageCode === true){
                  setModal(false);
                  setToast({text: response.data.message, color: 'green'});
                  dispatch(getUserDetails(user_id));
                  fun.resetForm(values);
                }else{
                  setToast({text: response.data.message, color: colors.warning});
                }
                // this.setState({profileupdated:true});
              })
              .catch((error) => {
                console.log("error",error);
                
                setBtnLoading(false);
                setToast({text: 'Something went wrong.', color: 'red'});
              })
            }else{
              var formValues={
                "user_id"           : user_id,
                "firstname"         : firstName,
                "lastname"          : lastName,
                "image"     	      : [],
                "isdCode"           : isdCode,
                "mobile"     	      : mobileNumber,
                "mobileChange"      : mobileChange,
                "emailChange"       : emailChange,
                "currentPassword"   : current_password,
                "email"    		      : email_id,
            }
              console.log("formValues",formValues);
              axios.patch('/api/users/update/user_profile_details',formValues)
              .then((response) => {
                if(response.data.messageCode){
                  props.setToast({text: response.data.message, color: 'green'});
                  setBtnLoading(false);
                  if(checkedMobNo){
                    setModal(true);
                  }
                  dispatch(getUserDetails(user_id));
                }else{
                  props.setToast({text: response.data.message, color: colors.warning});
                  setBtnLoading(false);
                }
                // this.setState({profileupdated:true});
              })
              .catch((error) => {
                console.log("error",error);
                setBtnLoading(false);
                setToast({text: 'Something went wrong.', color: 'red'});
              })
            }  
          }}
          validationSchema={schema}
          initialValues={{
            firstName         : userDetails && userDetails.firstname? userDetails.firstname:'',
            lastName          : userDetails && userDetails.lastname? userDetails.lastname:'',
            mobileNumber      : userDetails && userDetails.mobile? userDetails.mobile:'',
            email_id          : userDetails && userDetails.email ?userDetails.email:'',
            current_password  : '',
            isdCode           : userDetails && userDetails.isdCode ?userDetails.isdCode:"",
            countryCode      :  userDetails && userDetails.countryCode ?userDetails.countryCode:"AE",
            otp               : ''
          }}
          enableReinitialize
          >
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
              updateSchema={updateSchema}
              otpModal={otpModal}
              mobile = {userDetails && userDetails.mobile? userDetails.mobile:''}
              email_id={userDetails && userDetails.email ?userDetails.email:''}
              setModal={setModal}
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
      setCheckedEmailId,
      updateSchema,
      otpModal,
      setModal,
      mobile,
      email_id
    } = props;
    const [showPassword, togglePassword] = useState(false);
    const [image, setImage] = useState({profile_photo: '', image: ''});
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(true);
    const [countryCode, setCountryCode] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [value, setValue] = useState(values.mobileNumber);
    const [showCurrentPassword, toggleCurrentPassword] = useState(false);
    const phoneInput = useRef(null);



    const handleMob = ()=>{
      if(values.mobileNumber === ""){
        setToast({text: "Please fill all mandetory fields", color: colors.warning});
      }else if(values.mobileNumber === mobile){
        setToast({text: "It seems that you didn't change anything", color: colors.warning});
      }else{  
        handleSubmit();
      }
    }
    const handleEmail = ()=>{
      if(values.email === "" || values.current_password === ""){
        setToast({text: "Please fill all mandetory fields", color: colors.warning});
      }else if(values.email === email_id){
        setToast({text: "It seems that you didn't change anything", color: colors.warning});
      }else{  
        handleSubmit();
      }
     }


     const ref = useRef();

    //  if(otpModal){
    //    console.log("ref123",ref);
    //     setTimeout(() => {
    //       ref.current.focusField(0);
    //     }, 500);
    //  }
    if (loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <React.Fragment>
          <View style={styles.profileparent}>
            <View style={{flex:1,backgroundColor:"#fff"}}>
            <ScrollView contentContainerStyle={styles.container} style={{marginBottom:hp(5)}} keyboardShouldPersistTaps="handled" >
                <View style={{ paddingHorizontal:wp(4), marginBottom: hp(4) }}>
                  <View style={{ borderWidth: 1, borderColor: '#f1f1f1', backgroundColor: '#ccc', paddingVertical: hp(2), marginTop: 10 }}>
                    <Text style={{ fontSize: RFPercentage(1.9), fontFamily: "Montserrat-SemiBold", color: '#333', paddingHorizontal: wp(4) }}>Profile Details : </Text>
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
                        <FormButton
                          title       = {'Update Profile'}
                          onPress     = {handleSubmit}
                          background  = {true}
                          disabled   ={checkedMobNo || checkedEmailId}
                          // loading     = {btnLoading}
                        />
                        <CheckBox
                          title='Change Mobile No'
                          checked={checkedMobNo}
                          onPress={() => {setCheckedMobNo(!checkedMobNo),setFieldValue('mobileChnage',!checkedEmailId),setCheckedEmailId(false)}}
                        />
                        
                        {checkedMobNo && <View style={{marginHorizontal:10,marginVertical:5}}>
                        <Text style={{fontFamily:'Montserrat-SemiBold',  color: '#333',fontSize: RFPercentage(1.8),paddingVertical:hp(0.5)}}>
                            <Text>Phone Number</Text>{' '}
                            <Text style={{color: 'red', fontSize: RFPercentage(1.8)}}>
                            *
                            </Text>
                        </Text>
                            <PhoneInput
                              ref={phoneInput}
                              defaultValue={values.mobileNumber}
                              defaultCode={values.countryCode}
                              layout="second"
                              onChangeText={(text) => {
                                console.log("text",text);
                                const checkValid = phoneInput.current?.isValidNumber(text);
                                const callingCode = phoneInput.current?.getCallingCode(text);
                                const countryCode = phoneInput.current?.getCountryCode(text);
                                var mobileNumber =text;
                                setValue(text);
                                setFieldValue('mobileNumber',mobileNumber)
                                setFieldValue('countryCode',countryCode)
                                setValid(checkValid);
                              }}
                              containerStyle= {styles1.containerStyle}
                              textContainerStyle={styles1.textContainerStyle}
                              textInputStyle={styles1.textInputStyle}
                            />
                          <Text style={{fontSize:RFPercentage(1.8),marginTop:2,color:"#f00"}}>{value ? !valid && "Enter a valid mobile number" :touched['mobileNumber'] && errors['mobileNumber'] ? errors['mobileNumber'] : ''}</Text>
                          <FormButton
                            title       = {'Update Mobile No'}
                            onPress     = {handleMob}
                            background  = {true}
                          // loading     = {btnLoading}
                        />
                        </View> }
                        <CheckBox
                          title='Change Email Id'
                          checked={checkedEmailId}
                          onPress={() => {setCheckedEmailId(!checkedEmailId), setFieldValue("emailChange",!checkedEmailId),setCheckedMobNo(false)}}
                        />
                              
                        {checkedEmailId &&
                        <>
                        <FormInput
                          labelName       = "Email Id"
                          placeholder     = "Email Id"
                          onChangeText    = {handleChange('email_id')}
                          required        = {true}
                          name            = "email_id"
                          errors          = {errors}
                          touched         = {touched}
                          // iconName        = {'email'}
                          // iconType        = {'material-community'}
                          autoCapitalize  = "none"
                          // keyboardType    = "email-address"
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
                                  <Icon name="eye" type="entypo" size={ hp(2.5)} />
                                ) : (
                                  <Icon name="eye-with-line" type="entypo" size={ hp(2.5)} />
                                )}
                              </TouchableOpacity>
                            }
                          secureTextEntry={!showCurrentPassword}
                          value           = {values.current_password}
                        />
                        <FormButton
                          title       = {'Update Email ID'}
                          onPress     = {handleEmail}
                          background  = {true}
                          // loading     = {btnLoading}
                        />
                        </>
                        }
                      </View>
                    </View>
                  </View>
            </ScrollView>
          </View>
          </View>
          <Modal isVisible={otpModal}
            onBackdropPress={() => setModal(false)}
            onRequestClose={() => setModal(false)}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", borderRadius: 20, paddingBottom: hp(4), padding :10,height:500}}>
              <TouchableOpacity style={{flexDirection:"row",justifyContent:"flex-end"}} onPress={()=>setModal(false)}>
                  <Icon name="close" type="material-community" size={25} color={"#333"} />
              </TouchableOpacity>
              <View style={{justifyContent:'center'}}>
                <View style={{height: 160,paddingHorizontal:10,justifyContent:'flex-start'}}>
                  <Image
                    style={{height: 60, width: 150,backgroundColor:'white', alignSelf: 'flex-start'}}
                    source={require("../../AppDesigns/currentApp/images/trollymart-black.png")}
                    resizeMode="contain"
                  />
                </View>
                <View style={{marginHorizontal:5}}><Text style={styles.otpTitle}>OTP</Text></View>
                <OTPInputView
                    ref={ref}
                    style={{width: '95%', height: 100,alignSelf:"center",marginHorizontal:20}}
                    pinCount={4}
                    placeholderTextColor={'#333'}
                    autoFocusOnLoad={false}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled = {handleSubmit}
                    onCodeChanged = {handleChange('otp')}
                    code={values.otp}
                    // clearInputs={isEmptyString(values.otp)}  
                    />
                    <Text style={{fontSize:RFPercentage(1.8),color:"#f00",alignSelf:"center"}}>{touched['otp'] && errors['otp'] ? errors['otp'] : ''}</Text>
                  <View style={{marginHorizontal:10}}>
                    <Text style={styles.otpLastText}>Didn't receive code?<Text onPress={()=>handleSubmit()} style={styles.otpLastText1}>Request again!</Text></Text>
                  </View>
                </View>
            </View>
          </Modal>
          <Modal 
          hasBackdrop={false}
          coverScreen={false}
          isVisible={btnLoading}
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
         backgroundColor:"#fff"
     },
     textContainerStyle:{
       height:50,
       padding:0,
       backgroundColor:"#fff"
     },
   });