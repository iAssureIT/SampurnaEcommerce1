import React,{ useState,useEffect,useRef}from 'react';
import {View,Dimensions,Image,Modal,TouchableOpacity,StyleSheet,SafeAreaView,Text}            from 'react-native';
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

const window = Dimensions.get('window');
navigator.geolocation = require('react-native-geolocation-service');

export const Confirmation = withCustomerToaster((props)=>{
    const {navigation}=props;
    const [btnLoading,setBtnLoading] = useState(false);
    const [showModal,toggleModal] = useState(false);
    const [selection,setSelection] = useState({start:0,end:0});
    const dispatch = useDispatch();
    const mapStyle = [];
    const ref = useRef();


    const getPermission = ()=>{
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
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
                setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
                navigation.navigate('Auth')
              }else{
                setToast({text: 'Something went wrong.', color: 'red'});
              }  
          });
    }

  
    
    return (
        <View>
            <View style={{height:window.height, justifyContent:"flex-end",backgroundColor:"#fff"}}>
                <View style={{flex:.8,justifyContent:"center",alignItems:"center",paddingHorizontal:15}}>
                    <Image source={require("../../AppDesigns/currentApp/images/delivery.jpeg")} style={{height:300,width:300}}/>
                    <Text style={{color:"#333",fontFamily:"Montserrat-Bold",fontSize:18,alignSelf:"center"}}>Delivery Location</Text>
                    <Text>Set your delivery location to browse stores around you.</Text>
                </View>    
                <View style={{flex:.2}}>
                    <View style={{paddingHorizontal:30}}>
                    <FormButton
                        title       = {'Detect My Location'}
                        onPress     = {()=>getPermission()}
                        background  = {true}
                        // icon        = {{name: "crosshairs-gps",type : 'material-community',size: 18,color: "white"}}
                        // loading     = {btnLoading}
                        />
                    </View>    
                    <Text 
                        style={{textDecorationLine:'underline',color:"#333",fontFamily:"Montserrat-Bold",padding:15,alignSelf:"center"}}
                        onPress={()=>navigation.navigate('Location',{type:'Manual'})}
                    >
                        Set Location Manually
                    </Text>
                </View>   
            </View>
            <BottomModal
                closeModal={() => toggleModal(false)}
                visible={showModal}
                navigation={navigation}
            />   
        </View>     
    );  
})