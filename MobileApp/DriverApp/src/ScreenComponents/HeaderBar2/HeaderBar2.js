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
import {useDispatch,useSelector }      from 'react-redux';
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation }      from '@react-navigation/native';
import { request,
  check,
  PERMISSIONS,
  RESULTS }                       from 'react-native-permissions';
import Geolocation                  from 'react-native-geolocation-service';

  const HeaderBars2=(props)=>{
    const [searchText,useSearchText] = useState('');
    const [inAppNotificationsCount,setInAppNotifyCount] = useState(0);
    const [user_id,setUserId] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [list,setList]=useState([])
    const [value,setValue]=useState('offline')
    var interval = 0;
    const store = useSelector(store => ({
      globalSearch  : store.globalSearch,
      location      : store.location,
      cartCount     : store.productList.cartCount,
    }));
    const {globalSearch,location,cartCount} = store;
   
    useEffect(() => {
      getData()
    },[props]);

    
 
  const getData=()=>{
    useSearchText(globalSearch.searchText);
    getNotificationList();
  }

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

  const setOnOff=(val)=>{
    console.log("val",val);
    if(val==="online"){
       interval = setInterval(() => {
        getCurrentPosition();
      }, 15000);
    }else if(val==="offline"){
      clearInterval(interval);
    }
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
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log("position",position);
                    axios.post('/api/')
                    .then(res=>{

                    })
                    .catch(err=>{
                      console.log("err",err)
                    })
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
                {props.backBtn ?
                  <TouchableOpacity onPress={()=> navigation.goBack()}>
                  <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                    <Icon size={30} name='keyboard-arrow-left' type='MaterialIcons' color='#fff' />
                  </View>
                </TouchableOpacity>
                :
                <TouchableOpacity  onPress={()=> navigation.dispatch(DrawerActions.toggleDrawer())}>
                  <Icon size={25} name='bars' type='font-awesome' color={colors.white} />
                </TouchableOpacity>
              }
            </View>
            
          }
          centerComponent={
              props.headerTitle && props.headerTitle!=="" ?
                <View style={{width:200}}>
                  <Text style={[{fontSize:18,color:'#fff',fontFamily:"Montserrat-SemiBold",textAlign:'center',alignSelf:'center'}]}>{props.headerTitle}</Text>
                </View>  
                :
                <Image
                  resizeMode="contain"
                  source={require("../../AppDesigns/currentApp/images/Logo.png")}
                  style={styles.whitename}
                />
          }
          rightComponent={
             <View style={[styles.tabWrap]}>
              <TouchableOpacity
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
              </TouchableOpacity>
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
