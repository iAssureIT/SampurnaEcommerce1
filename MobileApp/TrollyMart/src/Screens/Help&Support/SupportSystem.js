import React,{useEffect,useState,useRef} from 'react';
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';
import {
  ScrollView,
  Text,
  Image,
  Input,
  TextInput,
  Button,
  View,StyleSheet,
} from 'react-native';
import {Footer}                   from '../../ScreenComponents/Footer/Footer.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import Axios                    from 'axios';
import { colors }   from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage             from '@react-native-async-storage/async-storage';
import PhoneInput           from "react-native-phone-number-input";
import {emailValidator,specialCharacterValidator,mobileValidator}     from '../../config/validators.js';
import {Formik}             from 'formik';
import {FormPhoneInput}          from '../../ScreenComponents/PhoneInput/PhoneInput';
import {FormButton}         from '../../ScreenComponents/FormButton/FormButton';
import {FormInput}          from '../../ScreenComponents/FormInput/FormInput';
import * as Yup             from 'yup';
import {setToast, withCustomerToaster} from '../../redux/AppState.js';
import commonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { Dimensions } from 'react-native';
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { useSelector }        from 'react-redux';

const window = Dimensions.get('window');
const ValidationSchema = Yup.object().shape({
    name        : Yup.string().required('This field is required'),
    email       : Yup.string().required('This field is required')
      .test(
        'email validation test',
        'Enter a valid email address',
        emailValidator,
      ),
    mobile_no   : Yup.string().required('This field is required'),
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
            onSubmit={(data) => {
                console.log("data",data);
              setLoading(true);
              let {username, password} = data;
              const payload = {
                name      : username,
                password  : password,
                role      : "user"
              };

              const formValues2 = {
                "email" 	: 'supriya16ghatge@gmail.com',
                "text"		: "",
                "mail"		: 'Dear Admin, <br/>'+
                                "Following new query/feedback came from website! <br/> <br/>" +
                                "============================  <br/> <br/>" + 
                                "<b>Client Name: </b>"   + data.name + '<br/>'+
                                "<b>Client Email: </b>"  + data.email + '<br/><br/>'+
                                "<pre> " + data.message + "</pre>" + 
                                "<br/><br/> ============================ " + 
                                "<br/><br/> This is a system generated email! " ,
            };
    
            console.log("formValues2" , formValues2);                   
                    
            Axios
                .post('/send-email-mobile',formValues2)
                .then((response)=>{
                	console.log("res=-0-0",response);
                                
				})           
                .catch(function(error){
					console.log(error);
                    if(error.message === "Request failed with status code 401"){
						// swal("Your session is expired! Please login again.","", "error");
					}
              	})
		
            // this.setState({
            //     name    : "",
            //     email   : "",
            //     message : "",
            //     mobile  : ""
            // });
             
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
        setLoading,
        navigation,
        dispatch,
        companyName,
        companyEmail,
        companyPhone,
        website_url
    } = props;
    const phoneInput = useRef(null);
    const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    const store = useSelector(store => ({
        globalSearch    : store.globalSearch
      }));
    return (
        <View style={{flex:1,backgroundColor:"#fff",paddingVertical:15}}>
        {store.globalSearch.search ?
              <SearchSuggetion />
          :
            <ScrollView contentContainerStyle={{paddingVertical:15,backgroundColor:"#fff"}}>
                <View style={{ paddingHorizontal: 15 }}>
                    <View style={{ height:230,backgroundColor:'#fff',marginBottom: 15,marginLeft:5}}>
                         <Image 
                            source = {require("../../AppDesigns/currentApp/images/contact_us1.png")}
                            style={{height:230, width:window.width-5}} 
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={{flex:1,alignSelf: 'center', justifyContent: 'center', alignItem: 'center'}}>
                        <Text style={[styles.mailText]}>knockknock@gmail.com</Text>
                    </View>                   
                </View>  

                <View style={{padding:21}}>
                    <View style={{marginBottom:5}}>
                        <FormInput
                            labelName       = "Your Name"
                            // placeholder     = "Please enter your name..."
                            onChangeText    = {handleChange('name')}
                            required        = {true}
                            name            = "name"
                            errors          = {errors}
                            touched         = {touched}
                            // iconName        = {'user'}
                            iconType        = {'font-awesome'}
                        />
                     </View>   
                     <View style={{marginBottom:5}}>
                        <FormInput
                            labelName       = "Email"
                            // placeholder     = "Please enter your email..."
                            onChangeText    = {handleChange('email')}
                            required        = {true}
                            name            = "email"
                            errors          = {errors}
                            touched         = {touched}
                            // iconName        = {'email'}
                            iconType        = {'material-community'}
                            autoCapitalize  = "none"
                            keyboardType    = "email-address"
                        />
                    </View>    
                    <View style={{marginHorizontal:10,marginBottom:5}}>
                        <Text style={{fontFamily:'Montserrat-SemiBold',color:'#000', fontSize: 12,paddingVertical:2}}>
                            <Text>Phone Number</Text>{' '}
                            <Text style={{color: 'red', fontSize: 12}}>
                            *
                            </Text>
                        </Text>
                        <PhoneInput
                            ref={phoneInput}
                            defaultValue={value}
                            defaultCode="AE"
                            layout="first"
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
                            containerStyle= {styles1.containerStyle}
                            textContainerStyle={styles1.textContainerStyle}
                            textInputStyle={styles1.textInputStyle}
                        />
                        <Text style={{fontSize:12,marginTop:2,color:"#f00"}}>{value ? !valid && "Enter a valid mobile number" :touched['mobileNumber'] && errors['mobileNumber'] ? errors['mobileNumber'] : ''}</Text>
                    </View> 
                    <View style={{marginBottom:20,marginHorizontal:10}}>
                        <Text style={{fontFamily:'Montserrat-SemiBold',color:'#000', fontSize: 12,paddingBottom:15}}>
                            <Text>Message</Text>{' '}
                            <Text style={{color: 'red', fontSize: 12}}>
                            *
                            </Text>
                        </Text>
                        <TextInput
                            style={[styles.msgContainerStyle,{textAlignVertical:'top',paddingLeft:10, paddingTop: 5, paddingBottom:5}]}
                            multiline={true}
                            numberOfLines={5}
                            label="Message"
                            // placeholder="Type here to translate!"
                            onChangeText={handleChange('message')}
                            // defaultValue={text}
                        />
                    </View>
                    <View style={{flex:1,alignItems:'flex-end',marginRight:10}}>
                        <View style={{width:73}}>
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
                            // loading     = {btnLoading}
                            />
                        </View>
                    </View>
                    {/* <View
                        style={styles.button}>
                        <Icon
                            name='fontawesome|paper-plane'
                            size={25}
                            color='#3b5998'
                            style={{height:25,width:25}}/>
                        <Text style={styles.buttonText}>Send</Text>
                    </View> */}
                    
                </View>
                <View  style={{marginBottom:50,paddingHorizontal:21}}>
                    <Text onPress={()=>{Linking.openURL('tel:'+companyPhone);}} 
                        style={[commonStyles.text,{color:'#000000',lineHeight:20}]}>
                    {companyPhone}
                    </Text>
                    <Text onPress={() => Linking.openURL(website_url) } 
                        style={[commonStyles.text,{color:'#000000',lineHeight:20}]}>
                        {website_url}
                    </Text>
                </View>
            </ScrollView>}
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
         paddingTop:15,
         backgroundColor:"#fff"
     },
     textContainerStyle:{
       height:50,
       padding:0,
       backgroundColor:"#fff"
     },
   });