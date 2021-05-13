import React, { useState,useEffect,useRef} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,StyleSheet
} from 'react-native';
import { TextField }      from 'react-native-material-textfield';
import { Button, }        from "react-native-elements";
import axios              from "axios";
import {Menu}             from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar5         from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import {Footer}           from '../../ScreenComponents/Footer/Footer1.js';
import styles             from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import { colors, sizes }  from '../../AppDesigns/currentApp/styles/styles.js';
import Loading            from '../../ScreenComponents/Loading/Loading.js';
import Modal              from "react-native-modal";
import AsyncStorage       from '@react-native-async-storage/async-storage';
import PhoneInput           from "react-native-phone-number-input";
import {FormButton}         from '../../ScreenComponents/FormButton/FormButton';
import {setToast, withCustomerToaster} from '../../redux/AppState.js';
import * as Yup             from 'yup';
import {emailValidator,specialCharacterValidator,mobileValidator}     from '../../config/validators.js';
import {Formik}             from 'formik';
import commonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {FormInput}          from '../../ScreenComponents/FormInput/FormInput';

const window = Dimensions.get('window');
  const LoginSchema = Yup.object().shape({
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
      .test(
        'email validation test',
        'Enter a valid email address',
        emailValidator,
      ),
  });



export const AccountInformation=withCustomerToaster((props)=>{
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
      console.log("response",response)
      setUserDetails(response.data.profile);
      setUserId(response.data._id);
      setLoading(false);
    })
  }

  console.log("userDetails",userDetails);
  if(userDetails){
    return (
      <React.Fragment>
        <Formik
          onSubmit={(data) => {
            console.log("data",data);
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
            firstName         : userDetails && userDetails.firstname? userDetails.firstname:'',
            lastName          : userDetails && userDetails.lastname? userDetails.lastname:'',
            mobileNumber      : userDetails && userDetails.mobile? userDetails.mobile:'',
            email_id          : userDetails && userDetails.email ?userDetails.email:'',
            countryCode       : userDetails.countryCode,
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
    const [openModal, setModal] = useState(false);
    const [showPassword, togglePassword] = useState(false);
    const [image, setImage] = useState({profile_photo: '', image: ''});
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [countryCode, setCountryCode] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef(null);
    console.log("values",values);
    if (loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <React.Fragment>
          <HeaderBar5
            goBack={navigation.goBack}
            headerTitle={'Account Information'}
            navigate={navigation.navigate}
            toggle={() => this.toggle.bind(this)}
            openControlPanel={() => this.openControlPanel.bind(this)}
          />
          <View style={styles.profileparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
                <View style={{ paddingHorizontal: 15, marginBottom: 30 }}>
                  {/* <View style={styles.profileparent}>
                        <Text style={styles.profiltitle}>Profile Details : </Text>                
                      </View> */}
                  <View style={{ flex: 1, borderWidth: 1, borderColor: '#f1f1f1', backgroundColor: '#ccc', paddingVertical: 15, marginTop: 10 }}>
                    <Text style={{ fontSize: 13, fontFamily: "Montserrat-SemiBold", color: '#333', paddingHorizontal: 15 }}>Profile Details : </Text>
                  </View>
                  <View style={styles.profilfileds}>

                    <View style={styles.marTp15}>
                      <View style={styles.padhr15}>
                      <View style={commonStyles.formWrapper}>
                        <FormInput
                          labelName       = "First Name"
                          placeholder     = "First Name"
                          onChangeText    = {handleChange('firstName')}
                          required        = {true}
                          name            = "firstName"
                          errors          = {errors}
                          touched         = {touched}
                          iconName        = {'user-circle-o'}
                          iconType        = {'font-awesome'}
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
                          iconName        = {'user-circle-o'}
                          iconType        = {'font-awesome'}
                          value           = {values.lastName} 
                          // autoCapitalize  = "none"
                        />
                        <View style={{marginHorizontal:10,marginVertical:5}}>
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
                        </View>       
                        <FormInput
                          labelName       = "Email Id"
                          placeholder     = "Email Id"
                          onChangeText    = {handleChange('email_id')}
                          required        = {false}
                          name            = "email_id"
                          errors          = {errors}
                          touched         = {touched}
                          iconName        = {'email'}
                          iconType        = {'material-community'}
                          autoCapitalize  = "none"
                          keyboardType    = "email-address"
                          value           = {values.email_id}
                        />
                        <FormButton
                          title       = {'Update Profile'}
                          onPress     = {handleSubmit}
                          background  = {true}
                          loading     = {btnLoading}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                {/* <View style={{ marginBottom: "15%" }}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => this.updateprofile()}
                      title={"UPDATE PROFILE"}
                      buttonStyle={styles.button1}
                      titleStyle={styles.buttonTextEDIT}
                      containerStyle={styles.buttonContainerEDIT}
                    />
                  </TouchableOpacity>
                </View> */}
              </View>
            </ScrollView>
            <Footer />
            {/* <Modal isVisible={profileupdated}
              onBackdropPress={() => this.setState({ profileupdated: false })}
              coverScreen={true}
              hideModalContentWhileAnimating={true}
              style={{ paddingHorizontal: '5%', zIndex: 999 }}
              animationOutTiming={500}>
              <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:colors.theme }}>
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
                  Your profile is updated!
                </Text>
                <View style={styles.yesmodalbtn}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => this.props.navigation.navigate('AccountDashboard')}
                      titleStyle={styles.buttonText1}
                      title="OK"
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer2}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal> */}
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