import React,{ useState,useEffect,useRef}from 'react';
import {View,Dimensions,Image,Modal,TouchableOpacity,StyleSheet,SafeAreaView,Text}            from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
const window = Dimensions.get('window');
navigator.geolocation = require('react-native-geolocation-service');

export const Location = withCustomerToaster((props)=>{
    const {navigation,route}=props;
    const {type}=route.params;
    const [region,setRegion]=useState()
    const [googleapikey,setGoogleAPIKey] = useState('');
    const [address,setAddress] = useState('');
    const [coords,setCoords] = useState('');
    const [btnLoading,setBtnLoading] = useState(false);
    const [selection,setSelection] = useState({start:0,end:0});
    const dispatch = useDispatch();
    const mapStyle = [];
    const ref = useRef();
    const store = useSelector(store => ({
        location      : store.location
      }));
      const {location} = store;
        console.log("location",location);

    useEffect(() => {
        axios.get('/api/projectsettings/get/GOOGLE')
        .then(async(response) => {
            console.log("response",response);
            await setGoogleAPIKey(response.data.googleapikey);
            await Geocoder.init(response.data.googleapikey);
            if(type==="Auto"){
                await getCurrentPosition();
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
                        setRegion({
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: latitude * 0.0001,
                            longitudeDelta: longitude * 0.0001 
                        })
                        Geocoder.from(latitude, longitude)
                        .then(json => {
                            var address = json.results[0].formatted_address;
                            setAddress(address);
                            // ref.current?.setAddressText(address);
                        })
                        .catch(error => console.warn(error));
                    },
                    (error) => {
                      // See error code charts below.
                      console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
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
        setBtnLoading(true);
        if(coordinate){
            setRegion({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: coordinate.latitude * 0.0001,
                longitudeDelta: coordinate.longitude * 0.0001 
            })
            Geocoder.from(coordinate.latitude,coordinate.longitude).then(
                json => {
                var address = json.results[0].formatted_address;
                setAddress(address);
                setBtnLoading(false);
                // ref.current?.setAddressText(address);
            },
            error => {
            console.error("err1",error);
            }
        );}
      }

    const confirmLocation=()=>{
        var payload = {"address":address,"coords":coords};
        AsyncStorage.setItem('location',JSON.stringify(payload));
        dispatch({
            type: SET_USER_ADDRESS,
            payload:payload
        })
        navigation.navigate('App');
    }  

    return (
        <View style={{flex:1}}>
            <HeaderBar3
            goBack={navigation.goBack}
            navigate={navigation.navigate}
            headerTitle={"Location"}
            toggle={() => toggle()}
            openControlPanel={() => openControlPanel()}
          />
          <GooglePlacesAutocomplete
            ref={ref}
            placeholder='Search for area street name...'
            onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                var address = details.formatted_address;
                const latlong = details.geometry.location;
                setAddress(address);
                setCoords({"latitude": latlong.lat,"longitude":latlong.lng});
                ref.current?.setAddressText(address);
                setRegion({
                    latitude: latlong.lat,
                    longitude: latlong.lng,
                    latitudeDelta: latlong.lat * 0.0001,
                    longitudeDelta: latlong.lng * 0.0001 
                })
            }}
            GoogleReverseGeocodingQuery
            query={{key: googleapikey,language: 'en',components: 'country:ae',}}
            listViewDisplayed={true}
            currentLocation={true}
            renderDescription={row => row.description || row.formatted_address || row.name}
            currentLocationLabel='Current Location'
            nearbyPlacesAPI="GoogleReverseGeocoding"
            textInputProps={{ 
                selection:selection,
                onSelectionChange : ({ nativeEvent: { selection, text } }) => {setSelection(selection)},
                clearButtonMode: 'never',
            }}

            renderLeftButton={() => (
                <View style={{height:44,width:30,backgroundColor:"#fff",justifyContent:'center'}}
                    onPress={() => {
                        ref.current?.clear(address);
                        ref.current?.setAddressText('');
                    }}
                >
                <Icon name="crosshairs-gps" type='material-community' size={15} style={styles.fabButton}/>
            </View>
            )}

            renderRightButton={() => (
                <View style={{height:44,width:30,backgroundColor:"#fff",justifyContent:'center'}}
                onPress={() => {
                    ref.current?.clear(address);
                }}
            >
                <Icon name="close" type='material-community' size={15} style={styles.fabButton}
                    onPress={() => {ref.current?.clear(address)}}
                />
            </View>
            )}
            styles={{
                textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderRadius:0,
                    padding:15,
                    zIndex:10,
                    position:'absolute',
                },
                textInput:{
                    borderRadius:0, 
                    backgroundColor: '#fff',
                },
                listView:{
                    position: 'absolute',
                    zIndex: 9999,
                    top: 59,
                    paddingHorizontal:15
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
        <View style={{width:window.width,position:'absolute',zIndex:9999,marginTop:window.height-140,backgroundColor:"#fff",minHeight:160,padding:15}}>
            <Text style={{fontFamily:"Montserrat-Regular",marginBottom:5}}>Delivery Location</Text>
            <View style={{flexDirection:"row",justifyContent:"space-between",height:60,paddingVertical:5}}>
                <Icon name="crosshairs-gps" type='material-community' size={20} color="black" />
                <Text numberOfLines={2} style={{flex:.98,fontFamily:"Montserrat-SemiBold",fontWeight:"bold"}}>{region? address : "-"}</Text>
            </View>   
            <View style={{justifyContent:"flex-end"}}>
                <FormButton
                    title       = {'Confirm Location'}
                    onPress     = {()=>confirmLocation()}
                    background  = {true}
                    icon        = {{name: "crosshairs-gps",type : 'material-community',size: 18,color: "white"}}
                    disabled    = {region?false:true}
                    // loading     = {btnLoading}
                    />
            </View>        
        </View>
        {region&&<View pointerEvents="none" style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,zIndex:30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
            <Image pointerEvents="none" source={require("../../AppDesigns/currentApp/images/marker.png")} style={{height:50,width:35}}/>
        </View>}    
         {region&&<MapView
                provider={PROVIDER_GOOGLE}
                ref={map => map = map}
                region = {region}
                style={[{width:window.width,height:window.height}]}
                onRegionChangeComplete={addMarker}
                customMapStyle={mapStyle}
           />}
       </View> 
    );  
})