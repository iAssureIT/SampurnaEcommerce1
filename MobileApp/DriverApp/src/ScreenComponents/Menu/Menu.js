import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,

} from "react-native";
import { Icon, Avatar }         from 'react-native-elements';
import axios                    from "axios";
import AsyncStorage             from '@react-native-async-storage/async-storage';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuStyles.js';
import {withCustomerToaster}     from '../../redux/AppState.js';
import {useDispatch,
  useSelector}              from 'react-redux';

export const Menu = (props)=>{
  const {navigation}=props;
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName]   = useState('');
  const [user_id,setUserId]      = useState('');
  const [index,setIndex]=useState(4)
  const userDetails = useSelector(store => store.userDetails);
  var routes = props?.state?.routes[0]?.state?.routes;

  useEffect(() => {
  console.log("propsnavigation1234",props?.state?.routes[0]?.state?.routes);
    if(routes && routes.length>0){
      if(routes[routes.length-1]?.name==="AccountDashboard"){
        setIndex(1);
      }
      else if(routes[routes.length-1]?.name==="AcceptedOrders"){
        setIndex(2);
      }
      else if(routes[routes.length-1]?.name==="RejectedOrder"){
        setIndex(3);
      }
      else if(routes[routes.length-1]?.name==="Dashboard"){
        setIndex(4);
      }else if(routes[routes.length-1]?.name==="SupportSystem"){
        setIndex(5);
      }else{
        setIndex(0);
      }
    }
    getData()
  },[props,routes]);

  const getData=()=>{
    setFirstName(userDetails.firstName);
    setLastName(userDetails.lastName);
    setUserId(userDetails.user_id);
  }

  const logout=()=>{
    AsyncStorage.removeItem('user_id');
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('location');
    navigation.closeDrawer();
    navigation.navigate('Auth');
  };
  
  return (
    <ScrollView contentContainerStyle={[styles.container]} scrollsToTop={false}>
      {/* <ImageBackground source={require("../../AppDesigns/currentApp/images/Side_drawer.png")} style={styles.container} resizeMode="cover" > */}
        <View style={{height:115,margin:20,marginTop:42,alignSelf:'center',}}>
        <Avatar
            style={{elevation:15,borderRadius:100,}}
            overlayContainerStyle={{borderRadius:100,}}
            avatarStyle={{}}
            width={114}
            height={114}
            resizeMode="center"
            rounded
            source={require('../../AppDesigns/currentApp/images/user.jpg')}                 
          />
        <View style={{marginTop:10,alignSelf:'center'}}>
          <Text style={styles.userName}>{firstName ? firstName : "Guest"}</Text>
        </View>	
        </View>
      <View style={styles.menuWrapper}>
        {user_id!==""&&userDetails.authService!=="guest" &&<View>
        <TouchableOpacity onPress={()=> navigation.navigate('AccountDashboard')} style={{backgroundColor:index ===1 ?"#033554": 'white'}}>
          <View style={styles.menu}>
            <Image
              resizeMode="contain"
              source={index ===1 ? require("../../AppDesigns/currentApp/images/AccountSelected.png") : require("../../AppDesigns/currentApp/images/Account.png")}
              style={{height:22,width:22,marginLeft:20}}
              />
            <Text style={[styles.menuText,{color:index ===1 ?"white": '#033554'}]}>My Account</Text>
          </View>
        </TouchableOpacity>
          <TouchableOpacity onPress={()=> navigation.navigate('AcceptedOrders')}style={{backgroundColor:index ===2 ?"#033554": 'white'}} >
          <View style={styles.menu}>
            <Image
              resizeMode="contain"
              source={index ===2 ?require("../../AppDesigns/currentApp/images/DeliveriesSelected.png"):require("../../AppDesigns/currentApp/images/Deliveries.png")}
              style={{height:22,width:22,marginLeft:20}}
              />
            <Text style={[styles.menuText,{color:index ===2 ?"white": '#033554'}]}>My Deliveries</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigation.navigate('RejectedOrder')} style={{backgroundColor:index ===3 ?"#033554": 'white'}}>
          <View style={styles.menu}>
            <Image
              resizeMode="contain"
              source={index ===3 ? require("../../AppDesigns/currentApp/images/RejectedSelected.png"):require("../../AppDesigns/currentApp/images/Rejected.png")}
              style={{height:22,width:22,marginLeft:20}}
              />
            <Text style={[styles.menuText,{color:index ===3 ?"white": '#033554'}]}>Rejected Orders</Text>
          </View>
        </TouchableOpacity></View>}

        <TouchableOpacity onPress={()=> navigation.navigate('Dashboard')} style={{backgroundColor:index ===4 ?"#033554": 'white'}}>
          <View style={styles.menu} >
            <Image
              resizeMode="contain"
              source={index ===4 ? require("../../AppDesigns/currentApp/images/dashboard.png") : require("../../AppDesigns/currentApp/images/dashboard1.png")}
              style={{height:22,width:22,marginLeft:20}}
              />
            <Text style={[styles.menuText,{color:index ===4 ?"white": '#033554'}]}>Dashboard</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={()=> navigation.navigate('SupportSystem')} style={{backgroundColor:index ===5 ?"#033554": 'white'}}>
          <View style={styles.menu} >
            <Image
              resizeMode="contain"
              source={index===5? require("../../AppDesigns/currentApp/images/ContactSelected.png") : require("../../AppDesigns/currentApp/images/ContactUS.png")}
              style={{height:22,width:22,marginLeft:20}}
              />
            <Text style={[styles.menuText,{color:index ===5 ?"white": '#033554'}]}>Contact Us</Text>
          </View>
        </TouchableOpacity> 
        {user_id && userDetails.authService!=="guest" ?
        <TouchableOpacity onPress={()=>logout()}>
          <View style={styles.menu}>
            <Image
              resizeMode="contain"
              source={require("../../AppDesigns/currentApp/images/logout.png")}
              style={{height:22,width:22,marginLeft:20}}
              />
            <Text style={styles.menuText}>Logout</Text>
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={()=>logout()}>
          <View style={styles.menu}>
            <Icon 
              size={20} 
              name='sign-in' 
              type='font-awesome' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>Login</Text>
          </View>
        </TouchableOpacity>}
      </View>
  </ScrollView>
  );
}
