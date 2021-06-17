
import React,{useState,useEffect,useRef} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet
} from 'react-native';
import { Dropdown }                 from 'react-native-material-dropdown-v2';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { TextField }                from 'react-native-material-textfield';
import { Button, Icon}              from "react-native-elements";
import {HeaderBar3}                   from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                       from '../../ScreenComponents/Footer/Footer1.js';
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Addressstyles.js';
import { colors, sizes }            from '../../AppDesigns/currentApp/styles/styles.js';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import axios                        from "axios";
import Modal                        from "react-native-modal";
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import {setToast, 
        withCustomerToaster}        from '../../redux/AppState.js';
import {FormInput}                  from '../../ScreenComponents/FormInput/FormInput';
import { connect,
        useDispatch,
        useSelector }               from 'react-redux';
import * as Yup                     from 'yup';
import {emailValidator,
        specialCharacterValidator,
        mobileValidator}            from '../../config/validators.js';

import {Formik}                     from 'formik';
import {FormButton}                 from '../../ScreenComponents/FormButton/FormButton';
import PhoneInput                   from "react-native-phone-number-input";

  const window = Dimensions.get('window');
  const LoginSchema = Yup.object().shape({
    contactperson: Yup.string()
    .required('This field is required')
    .test(
      'special character test',
      'This field cannot contain only special characters or numbers',
      specialCharacterValidator,
    ),
    addressLine1: Yup.string()
    .required('This field is required'),

    fromaddress: Yup.string()
    .required('This field is required'),
   
    // fromarea: Yup.string()
    // .required('This field is required'),
   
    fromstate: Yup.string()
    .required('This field is required'),
   
    fromcountry: Yup.string()
    .required('This field is required')
  });

export const AddressComponent = withCustomerToaster((props)=>{
  const [btnLoading, setLoading] = useState(false);
    const {setToast,navigation,route} = props; //setToast function bhetta
    const dispatch = useDispatch();
    
    const [googleapikey,setGoogleAPIKey] = useState('');
    const store = useSelector(store => ({
      userDetails : store.userDetails,
      location    : store.location
    }));

    const {userDetails,location}= store;
    const {delivery}=route.params;  
    console.log("location",location);
  
    useEffect(() => {
      var type = 'GOOGLE';
      axios.get('/api/projectsettings/get/'+type)
      .then((response) => {
        setGoogleAPIKey(response.data.googleapikey)
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
    },[props]);

      return (
        <React.Fragment>
          <Formik
            onSubmit={(data) => {
              console.log("data",data);
              const {addressLine1,fromaddress,contactperson,fromarea,fromPincode,fromcity,fromstate,fromcountry,fromlatlong,mobileNumber,addresstype}=data;
              var formValues = {
                "user_ID"       : userDetails.user_id,
                "name"          : contactperson,
                "addressLine1"  : addressLine1,
                "addressLine2"  : fromaddress,
                "area"          : fromarea,
                "pincode"       : fromPincode,
                // "district"      : modaldistrict,
                "city"          : fromcity,
                "state"         : fromstate,
                "country"       : fromcountry,
                "latitude"      : fromlatlong.lat,
                "longitude"     : fromlatlong.lng,
                "mobileNumber"  : mobileNumber,
                "addType"       : addresstype,
              }
              console.log("formValues",formValues);
              axios.patch('/api/ecommusers/patch/address', formValues)
              .then((response) => {
                // if(delivery){
                  // navigation.navigate('OrderSummary', { 'addData': formValues, 'user_id': userDetails.user_id })
                // }else{
                  navigation.navigate('AddressDefaultComp',{"delivery":delivery});
                // }
              })
              .catch((error) => {
                console.log('error', error)
              });
            }}
            validationSchema={LoginSchema}
            initialValues={{
              inputFocusColor     : colors.textLight,
              isOpen              : false,
              starCount           : 2.5,
              mobileNumber        : userDetails.mobile,
              countryCode         : userDetails.countryCode,
              pincodenotexist     : '',
              contactperson       : userDetails.fullName,
              addresstype         : 'Home',
              addsaved            : false,
              validpincodeaddress : false,
              pincodeExists       : false,
              addressLine1        : "",
              fromaddress         : location?.address?.addressLine2,
              fromarea            : location?.address?.area,
              fromPincode         : '',
              fromlatlong         : location?.address?.latlong,
              fromcity            : location?.address?.city,
              fromstate           : location?.address?.state,
              fromcountry         : location?.address?.country, 
            }}>
            {(formProps) => (
              <FormBody
                btnLoading      = {btnLoading}
                navigation      = {navigation}
                setToast        = {setToast}
                googleapikey    = {googleapikey}
                delivery        = {delivery}
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
        values,
        setToast,
        googleapikey,
        delivery
      } = props;
      const [openModal, setModal] = useState(false);
      const [showPassword, togglePassword] = useState(false);
      const [image, setImage] = useState({profile_photo: '', image: ''});
      const [value, setValue] = useState("");
      const [formattedValue, setFormattedValue] = useState("");
      const [valid, setValid] = useState(false);
      const [showMessage, setShowMessage] = useState(false);
      const phoneInput = useRef(null);
      const ref = useRef();
      const [selection,setSelection] = useState({start:0,end:0});
      ref.current?.setAddressText(values.fromaddress);
      // var mobileNumber = values.mobileNumber.split(" ");
      // if(mobileNumber && mobileNumber.length >0){
      //   var countryCode = mobileNumber[0].trim('+');
      //   var number      = mobileNumber[1];
      // }
      var ShippingType = [{ value: 'Home', }, { value: 'Office', }, { value: 'Relative', }, { value: 'Friend', }];
      console.log("values",values);
      const pincodeexistsornot=(pincode,formatted_address,area,city,state,country,latlong)=>{
        axios.get("/api/allowablepincode/checkpincode/" + pincode)
          .then((response) => {
            if (response) {
                setFieldValue('fromaddress',formatted_address);
                setFieldValue('fromarea',area);
                setFieldValue('fromcity',city);
                setFieldValue('fromstate',state);
                setFieldValue('fromcountry',country);
                setFieldValue('fromPincode',pincode);
                setFieldValue('fromlatlong',latlong);
                setFieldValue('formatted_address',formatted_address);
            }
          });
      }
  
    return (
      <React.Fragment>
        {/* <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={delivery ? "Delivery Address": 'Add Delivery Address'}
          navigate={navigation.navigate}
          // openControlPanel={() => openControlPanel()}
        /> */}
        <View style={styles.addsuperparent}>
          <ScrollView contentContainerStyle={{}} keyboardShouldPersistTaps="handled" >
            <View style={styles.formWrapper}>
              <View style={{ backgroundColor: '#fff', paddingVertical: 20, paddingHorizontal: 15, marginTop: 15, marginBottom: "5%" }}>
              <FormInput
                labelName       = "Contact Person Name"
                placeholder     = "Contact Person Name"
                onChangeText    = {handleChange('contactperson')}
                required        = {true}
                name            = "contactperson"
                errors          = {errors}
                touched         = {touched}
                iconName        = {'user-circle-o'}
                iconType        = {'font-awesome'}
                autoCapitalize  = "none"
                value           = {values.contactperson}
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
                      onChangeFormattedText={(text) => {
                        console.log("text",text);
                        setValue(text);
                        setFieldValue('mobileNumber',text)
                        const checkValid = phoneInput.current?.isValidNumber(text);
                        console.log("checkValid",checkValid);
                        setValid(checkValid)
                      }}
                      containerStyle= {styles1.containerStyle}
                      textContainerStyle={styles1.textContainerStyle}
                      textInputStyle={styles1.textInputStyle}
                    />
                  <Text style={{fontSize:12,marginTop:2,color:"#f00"}}>{value ? !valid && "Enter a valid mobile number" :touched['mobileNumber'] && errors['mobileNumber'] ? errors['mobileNumber'] : ''}</Text>
                </View>   
                <FormInput
                    labelName       = "Flat / Office No"
                    placeholder     = "Flat / Office No"
                    onChangeText    = {handleChange('addressLine1')}
                    required        = {true}
                    name            = "addressLine1"
                    errors          = {errors}
                    touched         = {touched}
                    // iconName        = {'user-circle-o'}
                    // iconType        = {'font-awesome'}
                    autoCapitalize  = "none"
                    value           = {values.addressLine1}  
                    // disabled        = {deliveuuuuuuuuuyyry}       
                  />
                <View style={[styles.formInputView, styles.marginBottom20]}>
                  <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 14,paddingVertical:2}}>
                    <Text>Address</Text>{' '}
                    <Text style={{color: 'red', fontSize: 12}}>
                    *
                    </Text>
                </Text>
              
                  <GooglePlacesAutocomplete
                  autoCorrect={false} 
                    placeholder               = 'Address'
                    ref                       = {ref}
                    minLength                 = {2} // minimum length of text to search
                    autoFocus                 = {true}
                    returnKeyType             = {'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    keyboardAppearance        = {'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                    listViewDisplayed         = {false}    // true/false/undefined
                    fetchDetails              = {true}
                    // onChangeText              = {(from)}
                    // value                     = {from}
                    enablePoweredByContainer  = {false}
                    currentLocation           = {false} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel      = "Current location"
                    nearbyPlacesAPI           = 'GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    renderDescription         = {row => row.description} // custom description render
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                      for (var i = 0; i < details.address_components.length; i++) {
                        for (var b = 0; b < details.address_components[i].types.length; b++) {
                          switch (details.address_components[i].types[b]) {
                            case 'sublocality_level_2':
                              var address = details.address_components[i].long_name;
                              break;
                            case 'sublocality_level_1':
                              var area = details.address_components[i].long_name;
                              break;
                            case 'locality':
                              var city = details.address_components[i].long_name;
                              break;
                            case 'administrative_area_level_1':
                              var state = details.address_components[i].long_name;
                              break;
                            case 'country':
                              var country = details.address_components[i].long_name;
                              break;
                            case 'postal_code':
                              var pincode = details.address_components[i].long_name;
                              break;
                          }
                        }
                      }
                      console.log("details",details);
                      const latlong = details.geometry.location
                      pincodeexistsornot(pincode,details.formatted_address,area,city,state,country,latlong);
                      setFieldValue('fromaddress',details.formatted_address);
                      setFieldValue('fromcity',details.city);
                      setFieldValue('fromstate',details.state);
                      setFieldValue('fromcountry',details.country);
                      setFieldValue('fromPincode',details.pincode);
                      setFieldValue('fromlatlong',details.latlong);
                      setFieldValue('formatted_address',details.formatted_address);
                    }}
                    textInputProps={{ 
                      selection:selection,
                      onSelectionChange : ({ nativeEvent: { selection, text } }) => {setSelection(selection)},
                      clearButtonMode: 'never',
                      editable : !delivery,
                      style    :  { color: '#999',fontFamily:"Montserrat-Medium",fontSize:18 }
                    }}
                    getDefaultValue={() => ''}
                    query={{
                      // key: 'AIzaSyCrzFPcpBm_YD5DfBl9zJ2KwOjiRpOQ1lE',
                      key: googleapikey,
                    }}
                    styles={{
                      textInputContainer: {
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderWidth: 1,
                        borderColor:"#ccc",
                        borderRadius:5,
                      },
                      textInput: {
                        height :45,
                      },
                    }}/>
              </View>
               <View>
               <FormInput
                    labelName       = "Area"
                    placeholder     = "Area"
                    onChangeText    = {handleChange('fromarea')}
                    required        = {false}
                    name            = "fromarea"
                    errors          = {errors}
                    touched         = {touched}
                    // iconName        = {'user-circle-o'}
                    // iconType        = {'font-awesome'}
                    autoCapitalize  = "none"
                    value           = {values.fromarea}  
                    disabled        = {delivery}       
                  />
                <FormInput
                    labelName       = "City"
                    placeholder     = "City"
                    onChangeText    = {handleChange('fromcity')}
                    required        = {true}
                    value           = {values.fromcity}
                    name            = "fromcity"
                    errors          = {errors}
                    touched         = {touched}
                    // iconName        = {'user-circle-o'}
                    // iconType        = {'font-awesome'}
                    autoCapitalize  = "none"
                    disabled        = {delivery}  
                  />
                   <FormInput
                    labelName       = "Emirate"
                    placeholder     = "Emirate"
                    onChangeText    = {handleChange('fromstate')}
                    required        = {true}
                    value           = {values.fromstate}
                    name            = "fromstate"
                    errors          = {errors}
                    touched         = {touched}
                    // iconName        = {'user-circle-o'}
                    // iconType        = {'font-awesome'}
                    autoCapitalize  = "none"
                    disabled        = {delivery}  
                  />
                   <FormInput
                    labelName       = "Country"
                    placeholder     = "Country"
                    onChangeText    = {handleChange('fromcountry')}
                    required        = {true}
                    value           = {values.fromcountry}
                    name            = "fromcountry"
                    errors          = {errors}
                    touched         = {touched}
                    // iconName        = {'user-circle-o'}
                    // iconType        = {'font-awesome'}
                    autoCapitalize  = "none"
                    disabled        = {delivery}  
                  />
                  <FormInput
                    labelName       = "Postal code"
                    placeholder     = "Postal Code"
                    onChangeText    = {handleChange('fromPincode')}
                    required        = {false}
                    name            = "fromPincode"
                    errors          = {errors}
                    touched         = {touched}
                    // iconName        = {'user-circle-o'}
                    // iconType        = {'font-awesome'}
                    autoCapitalize  = "none"
                  />
                </View>
                <View style={[styles.formInputView, styles.marginBottom20]}>
                  <Dropdown
                    label               = 'Type of Address'
                    containerStyle      = {styles.ddContainer}
                    dropdownOffset      = {{ top: 0, left: 0 }}
                    itemTextStyle       = {styles.ddItemText}
                    inputContainerStyle = {styles.ddInputContainer}
                    labelHeight         = {10}
                    tintColor           = {colors.button}
                    labelFontSize       = {sizes.label}
                    fontSize            = {15}
                    baseColor           = {'#666'} 
                    textColor           = {'#333'}
                    labelTextStyle      = {styles.ddLabelText}
                    style               = {styles.ddStyle}
                    data                = {ShippingType}
                    value               = {values.addresstype}
                    underlineColorAndroid ='transparent'
                    // onChangeText={(addresstype) => { this.setState({ addresstype }) }}
                    onChangeText={handleChange('addresstype')}
                  />
                 </View> 
                    <FormButton
                    title       = {'SAVE'}
                    onPress     = {handleSubmit}
                    background  = {true}
                    loading     = {btnLoading}
                  />
              </View>
            </View>
          </ScrollView>
          {/* <Footer /> */}
        </View>
      </React.Fragment>
    );
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

