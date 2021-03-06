import React,{useEffect,useState,useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  TextInput,
  View,StyleSheet,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView
} from 'react-native';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import Axios                    from 'axios';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage             from '@react-native-async-storage/async-storage';
import PhoneInput               from "react-native-phone-number-input";
import {emailValidator,specialCharacterValidator,mobileValidator}     from '../../config/validators.js';
import {Formik}                 from 'formik';
import {FormButton}             from '../../ScreenComponents/FormButton/FormButton';
import {FormInput}              from '../../ScreenComponents/FormInput/FormInput';
import * as Yup                 from 'yup';
import {setToast, withCustomerToaster} from '../../redux/AppState.js';
import commonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { Dimensions }           from 'react-native';
import SearchSuggetion          from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { useSelector }          from 'react-redux';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import { Icon }                 from "react-native-elements";
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { NetWorkError } from '../../../NetWorkError.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const window = Dimensions.get('window');
const ValidationSchema = Yup.object().shape({
    name        : Yup.string().required('This field is required'),
    email       : Yup.string().required('This field is required')
      .test(
        'email validation test',
        'Enter a valid email address',
        emailValidator,
      ),
    message     : Yup.string().required('This field is required'),
  });


export const SupportSystem = withCustomerToaster((props)=>{
    const [btnLoading, setLoading] = useState(false);
    const {setToast,navigation} = props; //setToast function bhetta
    const [user_id,setUserId]               = useState('');
    const [companyName,setCompanyName]      = useState('');
    const [companyEmail,setCompanyEmail]    = useState('');
    const [companyPhone,setCompanyPhone]    = useState('');
    const [website_url,setWebsiteURL]       = useState('');
    const phoneInput = useRef(null);


    useEffect(() => {
        AsyncStorage.multiGet(['token', 'user_id'])
        .then((data) => {
            var token = data[0][1]
            var user_id = data[1][1]
            setUserId(user_id)
        }); 
        getData();
    },[]);

    const getData=()=>{
        Axios.get('/api/entitymaster/getCompany/1')
        .then(res=>{
            setCompanyName(res.data.companyName);
            setCompanyPhone(res.data.companyPhone);
            setCompanyEmail(res.data.companyEmail);
            setWebsiteURL(res.data.website)
            setLoading(false)
        })
        .catch(error=>{
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

    return (
        <React.Fragment>
          <Formik
             onSubmit={(values,fun) => {
                console.log("values",values);
                fun.resetForm(values);
              setLoading(true);
              const formValues2 = {
                "email" 	: values.email,
                "text"		: "",
                "mail"		: 'Dear Admin, <br/>'+
                                "Following new query/feedback came from website! <br/> <br/>" +
                                "============================  <br/> <br/>" + 
                                "<b>Client Name: </b>"   + values.name + '<br/>'+
                                "<b>Client Email: </b>"  + values.email + '<br/><br/>'+
                                "<pre> " + values.message + "</pre>" + 
                                "<br/><br/> ============================ " + 
                                "<br/><br/> This is a system generated email! " ,
            };
    
            console.log("formValues2" , formValues2);                   
                    
            Axios
                .post('/send-email-mobile',formValues2)
                .then((response)=>{
                    console.log("res=-0-0",response);
                    setLoading(false);
    phoneInput?.current?.props?.onChangeText('');

                    setToast({text:"Thank you for contacting us, we will respond as soon as possible.!",color:"green"})
                    
				}) 
                .catch(function(error){
					console.log(error);
                    if(error.message === "Request failed with status code 401"){
						// swal("Your session is expired! Please login again.","", "error");
					}
              	})
            }}          

            validationSchema={ValidationSchema}            
            initialValues={{
                name: '',
                email: '',
                mobile_no:'',
                message:''
            }}>
            {(formProps) => (
              <FormBody
                btnLoading={btnLoading}
                navigation={navigation}
                companyName={companyName}
                companyPhone={companyPhone}
                companyEmail={companyEmail}
                website_url={website_url}
                phoneInput={phoneInput}
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
        companyPhone,
        website_url,
        values,
        phoneInput
    } = props;
    console.log("values",values);
    console.log("phoneInput",phoneInput.current);
    const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    const store = useSelector(store => ({
        globalSearch    : store.globalSearch
      }));
    return (
        <View style={{flex:1,backgroundColor:"#fff",paddingVertical:15,marginBottom:hp(6.5)}}>
        {store.globalSearch.search ?
              <SearchSuggetion />
          :
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >
            <ScrollView contentContainerStyle={{paddingVertical:15,backgroundColor:"#fff"}} showsVerticalScrollIndicator={false}>
                <View style={{ paddingHorizontal: 15 }}>
                    <View style={{ height:200,backgroundColor:'#fff',marginBottom: 15,marginLeft:5}}>
                         <Image 
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/contact_us1.png'}}
                            style={{height:200, width:window.width-5}} 
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={{flex:1,alignSelf: 'center', justifyContent: 'center', alignItem: 'center'}}>
                        <Text style={[styles.mailText]}>support@knock-knockeshop.com</Text>
                    </View>                   
                </View>  

                <View style={{padding:21}}>
                    <View style={{marginBottom:5}}>
                        <FormInput
                            labelName       = "Your Name"
                            onChangeText    = {handleChange('name')}
                            required        = {true}
                            name            = "name"
                            errors          = {errors}
                            touched         = {touched}
                            value           = {values.name}
                            iconType        = {'font-awesome'}
                        />
                     </View>   
                     <View style={{marginBottom:5}}>
                        <FormInput
                            labelName       = "Email"
                            onChangeText    = {handleChange('email')}
                            required        = {true}
                            name            = "email"
                            errors          = {errors}
                            touched         = {touched}
                            value           = {values.email}
                            iconType        = {'material-community'}
                            autoCapitalize  = "none"
                        />
                    </View>    
                    <View style={{marginHorizontal:10,marginBottom:5}}>
                        <Text style={{fontFamily:'Montserrat-Medium',color:'#000', fontSize: RFPercentage(1.8),paddingVertical:2}}>
                            <Text>Phone Number</Text>{' '}
                            <Text style={{color: 'red', fontSize: RFPercentage(1.8)}}>
                            </Text>
                        </Text>
                        <PhoneInput
                            ref={phoneInput}
                            defaultCode="AE"
                            name = 'mobile_no'
                            value  = {values.mobile_no}
                            // defaultValue    = {values.mobile_no}
                            layout="second"
                            onChangeText={(text) => {
                            const checkValid = phoneInput.current?.isValidNumber(text);
                            const callingCode = phoneInput.current?.getCallingCode(text);
                            const countryCode = phoneInput.current?.getCountryCode(text);
                            var mobileNumber = text;
                                setValue(text);
                                setFieldValue('mobile_no',mobileNumber)
                                setFieldValue('countryCode',countryCode)
                                setValid(checkValid);
                            }}
                            clearButtonMode='always'
                            containerStyle= {styles1.containerStyle}
                            textContainerStyle={styles1.textContainerStyle}
                            textInputStyle={styles1.textInputStyle}
                        />
                        <Text style={{fontSize:RFPercentage(1.8),marginTop:2,color:"#f00",fontFamily:"Montserrat-Regular"}}>{value ? !valid && "Enter a valid mobile number" :touched['mobileNumber'] && errors['mobileNumber'] ? errors['mobileNumber'] : ''}</Text>
                    </View> 
                    <View style={{marginBottom:10,marginHorizontal:10}}>
                        <Text style={{fontFamily:'Montserrat-Medium',color:'#000', fontSize: RFPercentage(1.8),paddingBottom:hp(2)}}>
                            <Text>Message</Text>{' '}
                            <Text style={{color: 'red', fontSize: RFPercentage(1.8)}}>
                            *
                            </Text>
                        </Text>
                        <TextInput
                            style={[styles.msgContainerStyle,{textAlignVertical:'top',paddingLeft:10, paddingTop: 5, paddingBottom:5}]}
                            multiline={true}
                            numberOfLines={5}
                            value           = {values.message}
                            label="Message"
                            // placeholder="Type here to translate!"
                            onChangeText={handleChange('message')}
                            // defaultValue={text}
                        />
                        <Text style={CommonStyles.errorText}>{touched['message'] && errors['message'] ? errors['message'] : ''}</Text>
                    </View>
                    <View style={{flex:1,alignItems:'flex-end',marginRight:10}}>
                        <View style={{width:wp(20)}}>
                            <FormButton
                            title       = {'Send'}
                            onPress     = {handleSubmit}
                            background  = {true}
                            iconName      = {'comment'}
                            icon={{
                                name: "paper-plane",
                                size: 12,
                                color: "white",
                                type: 'font-awesome'
                            }}
                            iconPosition='right'
                            loading     = {btnLoading}
                            />
                        </View>
                    </View>
                </View>
                <View  style={{paddingHorizontal:21}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Icon name="phone" type="font-awesome"  size={hp(2)} iconStyle={{paddingHorizontal:5}}/>
                        <Text onPress={()=>{Linking.openURL('tel:'+companyPhone);}} 
                            style={[commonStyles.linkLightText,{color:'#000000',lineHeight:20}]}>
                        {companyPhone}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Icon name="globe-asia" type="font-awesome-5"  size={hp(2)} iconStyle={{paddingHorizontal:5}}/>
                        <Text onPress={() => Linking.openURL(website_url) } 
                            style={[commonStyles.linkLightText,{color:'#000000',lineHeight:20}]}>
                            {website_url}
                        </Text>
                     </View>       
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',marginBottom:hp(6.5),}}>
                        <View style={{alignItems:'center',paddingHorizontal:10}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://www.instagram.com/knockknock_eshop/')} >
                                <Icon size={15} name='instagram' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View>
                        <View style={{alignItems:'center',paddingHorizontal:10}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://www.facebook.com/Knock-Knock-103575731986682')} >
                                <Icon size={15} name='facebook' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{alignItems:'center',paddingHorizontal:10}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://www.instagram.com/knockknock_eshop/')} >
                                <Icon size={15} name='youtube' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View>
                        <View style={{alignItems:'center',paddingHorizontal:10}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://www.instagram.com/knockknock_eshop/')} >
                                <Icon size={15} name='linkedin' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View> */}
                        <View style={{alignItems:'center',paddingHorizontal:10}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://twitter.com/knockknockeshop')} >
                                <Icon size={hp(2)} name='twitter' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View>                        
                    </View>
            </ScrollView>
            </KeyboardAvoidingView>
            }
        </View>
    );
}        


const styles1 = StyleSheet.create({
    containerStyle:{
    //    borderWidth:1,
    //    borderRadius:5,
       width:"100%",
    //    borderColor:"#ccc",
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
     HorizontalBox3: {
        alignItems          : "center",
        justifyContent      : 'center',
        backgroundColor     : "#000",
        height              : 20,
        width               : 20,
        shadowColor         : '#000',
        shadowOffset        : { width: 0, height: 2 },
        shadowOpacity       : 0.5,
        shadowRadius        : 20,
        elevation           : 10,
        borderRadius        : 100,
        marginVertical      : 15
    },
   });