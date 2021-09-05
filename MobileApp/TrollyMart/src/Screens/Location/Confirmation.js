import React,{ useState,useEffect,useRef}from 'react';
import {View,Dimensions,ImageBackground,Image,Modal,TouchableOpacity,StyleSheet,SafeAreaView,Text,Platform,BackHandler,Alert}            from 'react-native';
import {withCustomerToaster}        from '../../redux/AppState.js';
import { request,
    check,
    PERMISSIONS,
    RESULTS }                       from 'react-native-permissions';
import {FormButton}                 from '../../ScreenComponents/FormButton/FormButton';
import { connect,
        useDispatch,
        useSelector }               from 'react-redux';
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import CommonStyles                 from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import Geocoder                     from 'react-native-geocoding';
import Geolocation                  from 'react-native-geolocation-service';
import axios                        from "axios";
import {BottomModal}                from '../../ScreenComponents/BottomModal/BottomModal';
import {colors, Icon}                       from 'react-native-elements';
import {USER_LOGOUT} from '../../redux/store';
import { NetWorkError } from '../../../NetWorkError.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const window = Dimensions.get('window');
navigator.geolocation = require('react-native-geolocation-service');

export const Confirmation = withCustomerToaster((props)=>{
    const {navigation}=props;
    console.log("navigation",navigation);
    const [btnLoading,setBtnLoading] = useState(false);
    const [showModal,toggleModal] = useState(false);
    const [selection,setSelection] = useState({start:0,end:0});
    const [deliveryAddress,setDeliveryAddress]  = useState([]);
    const dispatch = useDispatch();
    const mapStyle = [];
    const ref = useRef();
    const store = useSelector(store => ({
      location      : store.location,
      userDetails   : store.userDetails
    }));
    console.log("userDetails",store.userDetails);
    const {location,userDetails} = store;
  //   let canGoBack = navigation.canGoBack();
  //   useEffect(() => {
  //     console.log("canGoBack",canGoBack);
  //     if(!canGoBack){
  //       BackHandler.addEventListener("hardwareBackPress", backAction);
  //         return () =>
  //         BackHandler.removeEventListener("hardwareBackPress", backAction);
  //     }
  // },[canGoBack]);

  // const backAction = () => {
  //   Alert.alert("Confirmation!", "Are you sure you want to log out?", [
  //     {
  //       text: "Cancel",
  //       onPress: () => null,
  //       style: "cancel"
  //     },
  //     { text: "YES", onPress: () => logout() }
  //   ]);
  //   return true;
  // };

  useEffect(() => {
    getAddressList();
  },[props]); 


  const getAddressList=()=>{
      var formValues = {
        "user_id"       : store?.userDetails?.user_id,
        "latitude"      : store.location?.address?.latlong?.lat,
        "longitude"     : store.location?.address?.latlong?.lng,
      }
      console.log("formValues",formValues);
      axios.post('/api/ecommusers/myaddresses',formValues)
        .then((response) => {
          console.log("response",response);
          if (response.data.deliveryAddress.length > 0) {
            var deliveryAddress = response.data.deliveryAddress;
            setDeliveryAddress(deliveryAddress);
          }
        })
        .catch((error) => {
          console.log("error",error);
          if (error.response.status == 401) {
            AsyncStorage.removeItem('user_id');
            AsyncStorage.removeItem('token');
            // setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
            navigation.navigate('Auth')
          }else{
            // setToast({text: 'Something went wrong.', color: 'red'});
          }  
        })
  }

    const getPermission = ()=>{
        request(Platform.OS ==='android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(result => {
            console.log("result",result);
          switch (result) {
            case RESULTS.UNAVAILABLE:
                toggleModal(true);
              console.log('This feature is not available (on this device / in this context)');
              break;
            case RESULTS.DENIED:
              console.log('The permission has not been requested / is denied but requestable');
              toggleModal(true);
              break;
            case RESULTS.GRANTED:
                console.log("The permission is granted")
                navigation.navigate('Location',{type:'Auto'})
              break;
            case RESULTS.BLOCKED:
                toggleModal(true);
              console.log('The permission is denied and not requestable anymore');
              break;
            }
          })
          .catch(error => {
            if (error.response.status == 401) {
                AsyncStorage.removeItem('user_id');
                AsyncStorage.removeItem('token');
                // setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
                navigation.navigate('Auth')
              }else{
                // setToast({text: 'Something went wrong.', color: 'red'});
              }  
          });
    }

    const logout=()=>{
      AsyncStorage.removeItem('user_id');
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('location');
      dispatch({type: USER_LOGOUT});
      // navigation.closeDrawer();
      navigation.navigate('Auth');
    };

  
    console.log("navigation.canGoBack()",navigation.canGoBack());
    return (
        <View>
            <ImageBackground source={require("../../AppDesigns/currentApp/images/LocationBg.jpg")} style={{height:window.height, justifyContent:"flex-end"}}>
                <View style={{alignItems:"flex-start",paddingTop:hp(2),paddingLeft:15}}>
                  {/* <TouchableOpacity onPress={()=> navigation.canGoBack() ?  navigation.goBack() : backAction()}> */}
                {navigation.canGoBack() ?
                 <TouchableOpacity style={{}} onPress={()=>navigation.goBack()}>
                    <Icon size={RFPercentage(4)} name='arrow-left' type='material-community' color={colors.theme} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={{}} onPress={()=>logout()}>
                   <Icon size={25} name='logout' type='material-community' color={colors.theme} />
                  </TouchableOpacity>
                } 
                </View>  
                <View style={{flex:.7,justifyContent:"flex-end",paddingHorizontal:wp(8),paddingBottom:hp(3)}}>
                    {/* <Image source={require("../../AppDesigns/currentApp/images/delivery.jpeg")} style={{height:300,width:300}}/> */}
                    <Text style={{color:"#000000",fontFamily:"Montserrat-Regular",fontSize:RFPercentage(2)}}>Delivery Location</Text>
                    <Text style={{color:"#EF4D4D",fontFamily:"Montserrat-Regular",fontSize:RFPercentage(1.3)}}>Set your delivery location to browse stores around you.</Text>
                </View>    
                <View style={{flex:.3}}>
                    <View style={{paddingHorizontal:wp(8)}}>
                    <FormButton
                        title       = {'Current Location'}
                        onPress     = {()=>getPermission()}
                        background  = {true}
                        // icon        = {{name: "crosshairs-gps",type : 'material-community',size: 18,color: "white"}}
                        // loading     = {btnLoading}
                        />
                    </View>  
                    <View style={{paddingHorizontal:wp(8)}}>
                      <FormButton
                          title       = {'Set Your Location'}
                          onPress     = {()=>navigation.navigate('Location',{type:'Manual'})}
                          background  = {true}
                          // icon        = {{name: "crosshairs-gps",type : 'material-community',size: 18,color: "white"}}
                          // loading     = {btnLoading}
                          />
                    </View>
                    {deliveryAddress.length > 0?
                      <View style={{paddingHorizontal:wp(8),marginBottom:hp(2)}}>
                        <FormButton
                          title       = {'Choose From Addresses'}
                          onPress     = {()=>navigation.navigate('AddressDefaultComp',{delivery:false,disabled:true,back:true})}
                          background  = {true}
                          // icon        = {{name: "crosshairs-gps",type : 'material-community',size: 18,color: "white"}}
                          // loading     = {btnLoading}
                          />
                      </View>
                      :
                      null
                    } 
                </View>   
            </ImageBackground>
            <BottomModal
                closeModal={() => toggleModal(false)}
                visible={showModal}
                navigation={navigation}
            />   
        </View>     
    );  
})