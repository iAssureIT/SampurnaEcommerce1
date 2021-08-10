import React,{ useState,useEffect,useRef}from 'react';
import {View,Dimensions,Image,Modal,TouchableOpacity,StyleSheet,SafeAreaView,Text,Pla, Platform}            from 'react-native';
import {Icon }                      from "react-native-elements";
import {HeaderBar3}                 from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import {colors}                     from '../../AppDesigns/currentApp/styles/styles.js';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import axios                        from "axios";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView,{PROVIDER_GOOGLE}    from 'react-native-maps';
import {withCustomerToaster}        from '../../redux/AppState.js';
import { request,
    check,
    PERMISSIONS,
    RESULTS }                       from 'react-native-permissions';
import Geolocation                  from 'react-native-geolocation-service';
import Geocoder                     from 'react-native-geocoding';
import {FormButton}                 from '../../ScreenComponents/FormButton/FormButton';
import { SET_USER_ADDRESS}          from '../../redux/location/types';
import { connect,useDispatch,useSelector }      from 'react-redux';
import { getWishList } 		    from '../../redux/wishDetails/actions';
import { NetWorkError } from '../../../NetWorkError.js';
import { CommonActions } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
const window = Dimensions.get('window');
navigator.geolocation = require('react-native-geolocation-service');

export const Location = withCustomerToaster((props)=>{
    const {navigation,route}=props;
    const {type}=route.params;
    const [region,setRegion]=useState();
    const [delivery,notDelivered] = useState(false);
    const [googleapikey,setGoogleAPIKey] = useState('');
    const [address,setAddress] = useState('');
    const [coords,setCoords] = useState('');
    const [btnLoading,setBtnLoading] = useState(false);
    const [selection,setSelection] = useState({start:0,end:0});
    const dispatch = useDispatch();
    const mapStyle = [];
    const ref = useRef();
    const store = useSelector(store => ({
        location      : store.location,
        userDetails : store.userDetails
      }));
      const {location,userDetails} = store;
    useEffect(async() => {
        axios.get('/api/projectsettings/get/GOOGLE')
        .then(async(response) => {
            await setGoogleAPIKey(response.data.googleapikey);
            await Geocoder.init(response.data.googleapikey);
            if(type==="Auto"){
                
                setTimeout(function(){getCurrentPosition();}, 1000);
            }    
            if(location && location.address!="" && location.coords!==""){
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: location.coords.latitude * 0.0001,
                    longitudeDelta: location.coords.longitude * 0.0001 
                })
                setAddress(location.address)
            }
        })
        .catch((error) => {
            if (error.response.status == 401) {
                AsyncStorage.removeItem('user_id');
                AsyncStorage.removeItem('token');
                setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
                navigation.navigate('Auth')
              }else{
                setToast({text: 'Something went wrong.', color: 'red'});
              }  
        });
    },[props]);

    const getCurrentPosition = ()=>{
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log('This feature is not available (on this device / in this context)');
              break;
            case RESULTS.DENIED:
              console.log('The permission has not been requested / is denied but requestable');
             
              break;
            case RESULTS.GRANTED:
                Geolocation.getCurrentPosition(
                    (position) => {
                        const {latitude,longitude}=position.coords;
                        setCoords({"latitude":latitude,"longitude":longitude});
                       
                        Geocoder.from(latitude, longitude)
                        .then(json => {
                            var details = json.results[0];
                            console.log("details",details);
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
                            setRegion({
                                latitude: latitude,
                                longitude: longitude,
                                latitudeDelta: latitude * 0.0001,
                                longitudeDelta: longitude * 0.0001 
                            })
                            if(country === "United Arab Emirates"){
                                notDelivered(false);
                                var address = {
                                    'addressLine2'     : details.formatted_address,
                                    'area'              : area,
                                    'city'              : city,
                                    'state'             : state,
                                    'country'           : country,
                                    'pincode'           : pincode,
                                    'latlong'           : details.geometry.location
                                }
                                console.log("address",address);
                                setAddress(address);
                            }else{
                                notDelivered(true);
                            }    
                            // ref.current?.setAddressText(address);
                        })
                        .catch(error => console.warn(error));
                    },
                    (error) => {
                      // See error code charts below.
                      console.log(error.code, error.message);
                    },
                    {enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
              break;
            case RESULTS.BLOCKED:
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

    const addMarker=(coordinate)=>{
        console.log("coordinate",coordinate);
        setBtnLoading(true);
        if(coordinate){
            setRegion({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: coordinate.latitudeDelta,
                longitudeDelta: coordinate.longitudeDelta 
            })
            Geocoder.from(coordinate.latitude,coordinate.longitude).then(
                json => {
                    var details = json.results[0];
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
                    if(country === "United Arab Emirates"){
                        notDelivered(false);
                        var address = {
                            'addressLine2'     : details.formatted_address,
                            'area'              : area,
                            'city'              : city,
                            'state'             : state,
                            'country'           : country,
                            'pincode'           : pincode,
                            'latlong'           : details.geometry.location
                        }
                        setAddress(address);
                    }else{
                        notDelivered(true);
                    } 
                     setBtnLoading(false);
                // ref.current?.setAddressText(address);
            },
            error => {
            console.error("err1",error);
            }
        );}
      }

    const confirmLocation=()=>{
        AsyncStorage.setItem('location',JSON.stringify(address));
        dispatch({
            type: SET_USER_ADDRESS,
            payload:address
        })
        if(userDetails && userDetails.user_id){
            dispatch(getWishList(userDetails.user_id))
        }    
        navigation.dispatch(
        CommonActions.reset({
            index: 1,
            routes: [
            { name: 'App' },
            ],
        })
        );
    }  

    return (
        <View style={{flex:1}}>
        <View style={styles.locationInput}>
            <TouchableOpacity style={{justifyContent:'center',height:45,paddingRight:5}} onPress={()=> navigation.goBack()}>
                <Icon size={25} name='arrow-left' type='material-community' color={colors.theme} />
            </TouchableOpacity>   
            <GooglePlacesAutocomplete
                ref={ref}
                placeholder='Search for area street name...'
                onSubmitEditing     = {()=>updateSearch()}
                
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
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
                    console.log("country",country);
                    if(country === "United Arab Emirates"){
                        notDelivered(false);
                        var address = {
                            'addressLine2'      : details.formatted_address,
                            'area'              : area,
                            'city'              : city,
                            'state'             : state,
                            'country'           : country,
                            'pincode'           : pincode,
                            'latlong'           : details.geometry.location
                        }
                        setAddress(address);
                        setCoords({"latitude": details.geometry.location.lat,"longitude":details.geometry.location.lng});
                        ref.current?.setAddressText(details.formatted_address);
                        setRegion({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: details.geometry.location.lat * 0.0001,
                            longitudeDelta: details.geometry.location.lng * 0.0001 
                        })
                    }else{
                        notDelivered(true);
                    }    
                }}
                GoogleReverseGeocodingQuery
                query={{key: googleapikey,language: 'en',components: 'country:ae',}}
                listViewDisplayed={true}
                currentLocation={false}
                renderDescription={row => row.description || row.formatted_address || row.name}
                currentLocationLabel='Current Location'
                nearbyPlacesAPI="GoogleReverseGeocoding"
                textInputProps={{ 
                    returnKeyType :'search',
                    blurOnSubmit:true,
                    selection:selection,
                    onSelectionChange : ({ nativeEvent: { selection, text } }) => {setSelection(selection)},
                    clearButtonMode: 'never',
                    onSubmitEditing : ({ nativeEvent: { text } }) => {notDelivered(true)},
                }}

                renderLeftButton={() => (
                    <View style={{height:44,width:30,backgroundColor:"#fff",justifyContent:'center'}}>
                    <Icon name="crosshairs-gps" type='material-community' size={15} style={styles.fabButton}/>
                </View>
                )}

                renderRightButton={() => (
                    <View style={{height:44,width:30,backgroundColor:"#fff",justifyContent:'center'}}
                    onPress={() => {
                        ref.current?.clear(address);
                            ref.current?.setAddressText('');
                    }}
                >
                    <Icon name="close" type='material-community' size={15} style={styles.fabButton}
                        onPress={() => {
                            ref.current?.clear(address);
                            ref.current?.setAddressText('');
                        }}
                    />
                </View>
                )}
                styles={{
                    textInputContainer: {
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderRadius:0,
                        zIndex:10,
                        position:'absolute',
                        flex:1
                    },
                    textInput:{
                        borderRadius:0, 
                        backgroundColor: '#fff',
                    },
                    listView:{
                        position: 'absolute',
                        zIndex: 9999,
                        top: 50,
                        // paddingHorizontal:15
                    } ,
                    row:{
                        backgroundColor: 'white'
                    },
                }}
                returnKeyType='search'
                enableHighAccuracyLocation={true}
                enablePoweredByContainer={false}
                listViewDisplayed={false}
                fetchDetails={true}
                isRowScrollable={true}
            />
        </View>    
        <View style={{width:window.width,position:'absolute',zIndex:9999,marginTop:window.height-160,backgroundColor:"#fff",minHeight:160,padding:15}}>
            <Text style={{fontFamily:"Montserrat-Regular",marginBottom:5}}>Delivery Location</Text>
            {delivery ?
            <View style={{flexDirection:"row",justifyContent:"space-between",height:60,paddingVertical:5}}>
                <Icon name="crosshairs-gps" type='material-community' size={20} color="black" />
                <Text numberOfLines={2} style={{flex:.98,fontFamily:"Montserrat-SemiBold",fontWeight:"bold"}}>Sorry, we don't deliver at this location.</Text>
            </View>
            :
            <View style={{flexDirection:"row",justifyContent:"space-between",height:60,paddingVertical:5}}>
                <Icon name="crosshairs-gps" type='material-community' size={20} color="black" />
                <Text numberOfLines={2} style={{flex:.98,fontFamily:"Montserrat-SemiBold",fontWeight:"bold"}}>{region? address?.addressLine2 : "-"}</Text>
            </View>
            }   
            <View style={{justifyContent:"flex-end"}}>
                <FormButton
                    title       = {'Confirm Location'}
                    onPress     = {()=>confirmLocation()}
                    background  = {true}
                    icon        = {{name: "crosshairs-gps",type : 'material-community',size: 18,color: "white"}}
                    disabled    = {delivery ? true : region?false:true}
                    // loading     = {btnLoading}
                    />
            </View>        
        </View>
        {region&&<View pointerEvents="none" style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,zIndex:30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
            <Image pointerEvents="none" source={require("../../AppDesigns/currentApp/images/pin.png")} style={{height:55,width:35,resizeMode:'contain'}}/>
        </View>}    
         {region&&<MapView
                provider={PROVIDER_GOOGLE}
                mapType={Platform.OS == "android" ? "standard" : "standard"}
                ref={map => map = map}
                region = {region}
                style={[{width:window.width,height:window.height}]}
                onRegionChangeComplete={Platform.OS==="ios" ?()=>addMarker : addMarker}
                customMapStyle={mapStyle}
           />}
       </View> 
    );  
})