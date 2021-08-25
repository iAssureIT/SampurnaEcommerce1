
import React,{useState,useEffect,useRef} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Dropdown }                 from 'react-native-material-dropdown-v2-fixed';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Addressstyles.js';
import { colors, sizes }            from '../../AppDesigns/currentApp/styles/styles.js';
import axios                        from "axios";
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import {withCustomerToaster}        from '../../redux/AppState.js';
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
import { useIsFocused }             from "@react-navigation/native";
import SearchSuggetion              from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { NetWorkError } from '../../../NetWorkError.js';

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
   
    mobileNumber: Yup.string()
    .required('This field is required'),
   
    // fromstate: Yup.string()
    // .required('This field is required'),
   
    fromcountry: Yup.string()
    .required('This field is required')
  });

 const AddressComponent = withCustomerToaster((props)=>{
  const [btnLoading, setLoading] = useState(false);
  const isFocused = useIsFocused();
    const {setToast,navigation,route} = props; //setToast function bhetta
    const dispatch = useDispatch();
    const [googleapikey,setGoogleAPIKey] = useState('');
    const store = useSelector(store => ({
      userDetails : store.userDetails,
      location    : store.location,
    }));

    const {userDetails,location}= store;
    console.log("store",store);
    const {delivery,address}=route.params;  
    console.log("address",route.params);

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
    },[]);

      return (
        <React.Fragment>
          {isFocused ?<Formik
            onSubmit={(data) => {
              console.log("data",data);
              setLoading(true);
              const {addressLine1,fromaddress,contactperson,fromarea,fromPincode,fromcity,fromstate,fromcountry,fromlatlong,mobileNumber,addresstype,callingCode}=data;
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
                "isdCode"       : callingCode,
                "addType"       : addresstype,
                "deliveryAddressID" :address?._id 
              }
              console.log("formValues",formValues);
              if(address){
                axios.patch('/api/ecommusers/updateuseraddress', formValues)
                .then((response) => {
                  setLoading(false);
                  // if(delivery){
                    // navigation.navigate('OrderSummary', { 'addData': formValues, 'user_id': userDetails.user_id })
                  // }else{
                    navigation.navigate('AddressDefaultComp',{"delivery":delivery});
                  // }
                })
                .catch((error) => {
                  console.log('error', error)
                });
              }else{
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
              }
            }}
            validationSchema={LoginSchema}
            initialValues={{
              inputFocusColor     : colors.textLight,
              isOpen              : false,
              starCount           : 2.5,
              mobileNumber        : address ? address.mobileNumber : userDetails.mobile,
              countryCode         : userDetails.countryCode,
              pincodenotexist     : '',
              contactperson       : address ? address.name  : (userDetails.firstName+" "+userDetails.lastName).trim(),
              addresstype         : address ? address.addType  :'Home',
              addsaved            : false,
              validpincodeaddress : false,
              pincodeExists       : false,
              addressLine1        : address ? address.addressLine1 : "",
              fromaddress         : address ? address.addressLine2  : location?.address?.addressLine2,
              fromarea            : address ? address.area  :  location?.address?.area,
              fromPincode         : '',
              fromlatlong         :  address ? {lat:address.latitude,lng:address.longitude} : location?.address?.latlong,
              fromcity            : address ? address.city  : location?.address?.city,
              fromstate           : address ? address.state  :location?.address?.state,
              fromcountry         : address ? address.country  :location?.address?.country, 
              callingCode         : address ? address.isdCode  :userDetails.isdCode ? userDetails.isdCode : "+971"
            }}>
            {(formProps) => (
              <FormBody
                btnLoading      = {btnLoading}
                navigation      = {navigation}
                setToast        = {setToast}
                googleapikey    = {googleapikey}
                delivery        = {delivery}
                address          = {address}
                {...formProps}
              />
            )}
          </Formik>: null}
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
        delivery,
        address
      } = props;
      const [value, setValue] = useState("");
      const [valid, setValid] = useState(false);
      const phoneInput = useRef(null);
      const ref = useRef();
      const [selection,setSelection] = useState({start:0,end:0});
      ref.current?.setAddressText(values.fromaddress);
      // var mobileNumber = values.mobileNumber.split(" ");
      // if(mobileNumber && mobileNumber.length >0){
      //   var countryCode = mobileNumber[0].trim('+');
      //   var number      = mobileNumber[1];
      // }
      var ShippingType = [{ value: 'Home', }, { value: 'Office', }];
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

      const globalSearch = useSelector(store =>  store.globalSearch);
  
    return (
      <React.Fragment>
      {
        globalSearch.search ?
            <SearchSuggetion />
        :
        <View style={[styles.addsuperparent,{marginBottom:Platform.OS==='ios'?60:40,paddingBottom:Platform.OS==='ios'?20:10}]}>
          <ScrollView  keyboardShouldPersistTaps='handled' style={styles.formWrapper} keyboardShouldPersistTaps='handled'>
           <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
              <View style={{ backgroundColor: '#fff', paddingHorizontal: 15, marginBottom: "5%" }}>
              <View style={{ flex:1,backgroundColor:'#fff',flexDirection: "row",marginLeft:10, justifyContent: 'flex-start',marginBottom:20 }}>
                  <Text style={styles.addressTitle}>My Address</Text>
              </View>
              <FormInput
                labelName       = "Full Name"
                labelFontSize = {18}
                // placeholder     = "Contact Person Name"
                onChangeText    = {handleChange('contactperson')}
                required        = {true}
                name            = "contactperson"
                errors          = {errors}
                touched         = {touched}
                // style           = {styles.inputText} 
                // iconName        = {'user-circle-o'}
                // iconType        = {'font-awesome'}
                autoCapitalize  = "none"
                value           = {values.contactperson}
              />
              <View style={{marginHorizontal:10,marginVertical:5}}>
                <Text style={{fontFamily:'Montserrat-Medium', fontSize: 12,color:'#000',paddingVertical:2}}>
                    <Text>Mobile Number</Text>{' '}
                    <Text style={{color: 'red', fontSize: 12}}>
                    *
                    </Text>
                </Text>
                    <PhoneInput
                      ref={phoneInput}
                      defaultValue={values.mobileNumber}
                      defaultCode={values.countryCode ? values.countryCode : "AE"}
                      layout="second"
                      onChangeText={(text) => {
                        setValue(text);
                        setFieldValue('mobileNumber',text)
                        const checkValid = phoneInput.current?.isValidNumber(text);
                        const callingCode = phoneInput.current?.getCallingCode(text);
                        setFieldValue('callingCode',callingCode)
                        setValid(checkValid)
                      }}
                      containerStyle= {styles1.containerStyle}
                      textContainerStyle={styles1.textContainerStyle}
                      textInputStyle={styles1.textInputStyle}
                    />
                  <Text style={{fontSize:12,marginTop:2,color:"#f00"}}>{value ? !valid && "Enter a valid mobile number" :touched['mobileNumber'] && errors['mobileNumber'] ? errors['mobileNumber'] : ''}</Text>
                </View>   
                <FormInput
                    labelName       = "House No/Street Name"
                    // placeholder     = "Please Enter Address..."
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
                  <FormInput
                    labelName       = "Area"
                    // placeholder     = "Area"
                    onChangeText    = {handleChange('fromarea')}
                    required        = {false}
                    name            = "fromarea"
                    errors          = {errors}
                    touched         = {touched}
                    editable        = {false}
                    // iconName        = {'user-circle-o'}
                    // iconType        = {'font-awesome'}
                    autoCapitalize  = "none"

                    value           = {values.fromarea}  
                    disabled        = {delivery}       
                  />
                <View style={[styles.formInputView, styles.marginBottom20]}>
                  <Text style={{fontFamily:'Montserrat-Medium',color:'#000', fontSize: 12,paddingVertical:2}}>
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
                      style    :  { color: '#000',fontFamily:"Montserrat-Medium",fontSize:14 }
                    }}
                    getDefaultValue={() => ''}
                    query={{
                      // key: 'AIzaSyCrzFPcpBm_YD5DfBl9zJ2KwOjiRpOQ1lE',
                      key: googleapikey,
                    }}
                    styles={{
                      textInputContainer: {
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderBottomWidth: 1,
                        borderColor:"#ccc",
                        borderRadius:5,
                        
                      },
                      textInput: {
                        height: 40,
                        color: '#333',
                        fontSize: 16,
                      },
                    }}/>
              </View>
               <View>

                <FormInput
                    labelName       = "City"
                    // placeholder     = "City"
                    onChangeText    = {handleChange('fromcity')}
                    required        = {false}
                    value           = {values.fromcity}
                    name            = "fromcity"
                    errors          = {errors}
                    touched         = {touched}
                    // iconName        = {'user-circle-o'}
                    // iconType        = {'font-awesome'}
                    autoCapitalize  = "none"
                    disabled        = {delivery}  
                  />
                   {/* <FormInput
                    labelName       = "Emirate"
                    // placeholder     = "Emirate"
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
                  /> */}
                   <FormInput
                    labelName       = "Country"
                    // placeholder     = "Country"
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
                    labelName       = "Zip/Postal Code"
                    // placeholder     = "Postal Code"
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
                <Text style={{fontFamily:'Montserrat-SemiBold',color:'#000', fontSize: 12,paddingVertical:2,marginBottom:10}}>
                    <Text>Address type</Text>                    
                </Text>
                  <Dropdown
                    // label               = 'Type of Address'
                    placeholder         = {"-- Select Address Type --"}                    
                    containerStyle      = {styles.ddContainer}
                    // dropdownOffset      = {{ top: 55, left: 0 }}
                    itemTextStyle       = {styles.ddItemText}
                    inputContainerStyle = {styles.ddInputContainer}
                    // labelHeight         = {10}
                    tintColor           = {colors.button}
                    labelFontSize       = {14}
                    baseColor           = {'#666'} 
                    textColor           = {'#000'}
                    itemTextStyle       = {styles.ddLabelText}
                    style               = {styles.ddStyle}
                    data                = {ShippingType}
                    // value               = {values.addresstype}
                    underlineColorAndroid ='transparent'
                    // onChangeText={(addresstype) => { this.setState({ addresstype }) }}
                    onChangeText={handleChange('addresstype')}
                  />
                 </View>
                 <View style={{marginHorizontal:30,}}>
                    <FormButton
                    title       = {address ? 'Update Address' :'Save Address'}
                    onPress     = {handleSubmit}
                    background  = {true}
                    loading     = {btnLoading}
                    style       = {styles.btnSave}
                   />
                  </View>
              </View>
          </KeyboardAvoidingView>
          </ScrollView>
          {/* */}
        </View>}
      </React.Fragment>
    );
  }

  const mapStateToProps = (store)=>{
    return {
      userDetails : store.userDetails,
      location    : store.location
    }
  };
  
  
  const mapDispatchToProps = (dispatch)=>{
    return {
    }
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(AddressComponent);

  const styles1 = StyleSheet.create({
    containerStyle:{
      //  borderWidth:1,
      //  borderRadius:5,
       width:"100%",
      //  borderColor:"#ccc",
      borderBottomWidth:1,
      borderBottomColor:"#ccc",
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

