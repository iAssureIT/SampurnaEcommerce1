import React,{useState,useEffect} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Keyboard
}                                 from "react-native";
import {Linking}                  from 'react-native'
import { 
  Header, 
  Icon,
  SearchBar,
  Button 
} from 'react-native-elements';
import axios                from 'axios'; 
import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/HeaderBar2Styles.js';
import {useDispatch,useSelector } from 'react-redux';
import FlipToggle                   from 'react-native-flip-toggle-button'
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import { DrawerActions }    from '@react-navigation/native';
import { useNavigation }    from '@react-navigation/native';
import { request,
  check,
  PERMISSIONS,
  RESULTS }                 from 'react-native-permissions';
import Geolocation          from 'react-native-geolocation-service';

  const HeaderBars2=(props)=>{
    const [searchText,useSearchText] = useState('');
    const [inAppNotificationsCount,setInAppNotifyCount] = useState(0);
    const [user_id,setUserId] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [list,setList]=useState([])
    const [value,setValue]=useState('offline')
    var watchID = 0;
    const store = useSelector(store => ({
      location      : store.location,
      userDetails   : store.userDetails
    }));
    const {location,userDetails} = store;
   
    useEffect(() => {
      getData();
    },[]);
 
  const getData=()=>{
    getNotificationList();
    getUserStatus();
  }

  console.log("userDetails",userDetails);

  const getNotificationList=()=>{
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
          var token = data[0][1];
          var user_id = data[1][1];
          setUserId(user_id);
          if(user_id){
            axios.get('/api/notifications/get/list/Unread/' + user_id)
            .then(notifications => {
                setInAppNotifyCount(notifications.data.length)
            })
            .catch(error => {
                console.log('error', error)
            })
          }
      });
  }

  const getUserStatus = ()=>{
    if(userDetails.user_id){
      axios.get('/api/drivertracking/get/status/' + userDetails.user_id)
      .then(res => {
      console.log("res",res);
          if(res.data.status === "online"){
            setValue(res.data.status);
            getCurrentPosition();
          }
      })
      .catch(error => {
          console.log('error1', error)
      })
    }  
  }

  const setOnOff=(val)=>{
    console.log("val",val);
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    .then(result => {
      switch (result) {
        case RESULTS.GRANTED:
            Geolocation.getCurrentPosition(
                (position) => {
                  const {latitude,longitude} = position.coords;
                  var payload = {
                    user_id       : userDetails.user_id,
                    currentDate   : new Date(),
                    onlineActivities    : {
                          activity    : val, 
                          timestamp   : new Date() , 
                          lat         : latitude, 
                          long        : longitude
                      },
                  }
                  console.log("payload",payload);
                  axios.post('/api/drivertracking/post/add_tracking',payload)
                  if(val==="online"){
                    // interval = setInterval(() => {
                      getCurrentPosition();
                    // }, 15000);
                  }else if(val==="offline"){
                    Geolocation.clearWatch(watchID);
                  }
                },
                (error) => {
                  // See error code charts below.
                  console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
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
          watchID = Geolocation.watchPosition(
                (position) => {
                    console.log("position",position);
                  const {latitude,longitude} = position.coords;
                    var payload = {
                      user_id       : userDetails.user_id,
                      currentDate   : new Date(),
                      currentLocations    : {
                            timestamp   : new Date() , 
                            lat         : latitude, 
                            long        : longitude
                        },
                    }
                    axios.post('/api/drivertracking/post/start_racking',payload)
                    .then(res=>{
                        console.log("res",res);
                    })
                    .catch(err=>{
                      console.log("err",err)
                    })
                },
                (error) => {
                  // See error code charts below.
                  console.log(error.code, error.message);
                },
                { 
                  enableHighAccuracy: true,
                  distanceFilter: 0,
                  interval:15000,
                  fastestInterval:15000,
                  forceRequestLocation:true,
                  showLocationDialog:true,
                  useSignificantChanges:true
                }
            );
            console.log("watchID",watchID);
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

    return (
      <View style={styles.header2main}>
        <Header
          statusBarProps={{ barStyle: 'light-content' }}
          backgroundColor={colors.theme}
          placement="left"
          leftContainerStyle={styles.leftside}
          centerContainerStyle={styles.center}
          rightContainerStyle={styles.rightside}
          leftComponent={
            <View style={styles.flxdir}>
                
                <TouchableOpacity  onPress={()=> navigation.toggleDrawer()}>
                  {/* <Icon size={25} name='bars' type='font-awesome' color={colors.white} /> */}
                  <View style={{}}>
                    <Image
                      resizeMode="contain"
                      source={require("../../AppDesigns/currentApp/images/Box.png")}
                      style={{height:14,width:19}}
                      />
                  </View>
                </TouchableOpacity>
              
            </View>
            
          }
          centerComponent={
              props.headerTitle && props.headerTitle!=="" ?
                <View style={{width:200,marginTop:-5,marginLeft:-40}}>
                  <Text style={[{fontSize:15,color:'#fff',fontFamily:"Montserrat-SemiBold"}]}>{props.headerTitle}</Text>
                </View>  
                :
                <View style={{height:27,width:90,marginTop:-5}}>
                  <Image
                    resizeMode="contain"
                    source={require("../../AppDesigns/currentApp/images/Logo.png")}
                    style={styles.whitename}
                  />
                </View>                
          }
          rightComponent={
            <View style={[styles.tabWrap1]}>
              <View style={[styles.tabWrap]}>
                <FlipToggle
                  value={value==='online'?true:false}
                  buttonWidth={36}
                  buttonHeight={18}
                  buttonRadius={50}
                  sliderWidth={18}
                  sliderHeight={18}
                  sliderRadius={50}
                  buttonOnColor='#0D9C25'
                  buttonOffColor='#C82323'
                  sliderOnColor='#fff'
                  sliderOffColor='#fff'
                  onLabel={''}
                  offLabel={''}
                  labelStyle={{ color: '#E33941' }}
                  onToggle={()=>{
                    setValue(value==='online'?'offline':'online');
                    setOnOff(value==='online'?'offline':'online')
                  }
                }      
                />
                {/* <TouchableOpacity
                  onPress = {()=>{setValue('online');setOnOff('online')}}
                  style={[(value === "online" ? styles.activeTabView:styles.tabView),styles.tabBorder,styles.borderRadiusLeft]}
                >
                    <Text style={value === "online" ? styles.tabText : styles.tabText1}>Online</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress = {()=>{setValue('offline');setOnOff('offline')}}
                  style={[(value === "offline" ? styles.activeTabView:styles.tabView),styles.borderRadiusRight]}
                >
                  <Text style={value === "offline" ? styles.tabText : styles.tabText1}>Offline</Text>
                </TouchableOpacity> */}
              </View>
              <View>
                <TouchableOpacity onPress={()=> navigation.navigate('InAppNotification')}>
                  <View style={{marginLeft:20}}>
                    <Icon size={20} name='bell-ring-outline' type='material-community' color='#fff' />
                    {/* <Image
                    resizeMode="contain"
                    source={require("../../AppDesigns/currentApp/images/Box.png")}
                    style={{height:17,width:17}}
                    /> */}
                  </View>
                </TouchableOpacity>
              </View>
          </View>
          }          
          // rightComponent={
          //     <View style={styles.notificationbell}>
          //      <TouchableOpacity style={styles.bellIcon} onPress={()=> navigation.navigate('InAppNotification')}>
          //       <Icon name="bell-o" type="font-awesome"    size={25} color={colors.white} />
          //       <Text style={styles.notificationText}>{inAppNotificationsCount}</Text>
          //      </TouchableOpacity> 
          //       {/* <TouchableOpacity onPress={()=>{Linking.openURL('tel:+91 90280 79487');}} style={{marginLeft:20,justiafyContent:"flex-end"}}>
          //         <Icon name="phone" type="font-awesome"  size={25} color={colors.white} />
          //       </TouchableOpacity> */}
          //       {/* <TouchableOpacity onPress={() => navigation.navigate('CartComponent', { userId: userDetails.user_id })}  style={{marginLeft:20,justiafyContent:"flex-end"}}>
          //       <Icon name="shopping-cart" type="feather" size={25} color={colors.white} />
          //       <Text style={styles.footerTitle}>My Cart</Text>
          //       {
          //         cartCount > 0 ?
          //           <Text style={styles.notificationText}>{cartCount}</Text>
          //         :
          //         null
          //       }
          //     </TouchableOpacity> */}

          //       {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate('Stores')}>
          //         <Icon size={25} name="store"  type="font-awesome-5" color=colors.theme />
          //       </TouchableOpacity> */}
          //     </View>
          // }          
          containerStyle={styles.container}
        />
      </View>
    );
}
export default HeaderBars2;
