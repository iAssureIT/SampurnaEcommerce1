import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  ImageBackground,
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
  const userDetails = useSelector(store => store.userDetails);

  useEffect(() => {
    getData()
  },[props]);

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
        style={{elevation:1,borderRadius:100,}}
            overlayContainerStyle={{borderRadius:100,}}
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
        <TouchableOpacity onPress={()=> navigation.navigate('MyAccount')}>
          <View style={styles.menu}>
            <Icon 
              size={22} 
              name='user-circle-o' 
              type='font-awesome' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>My Account</Text>
          </View>
        </TouchableOpacity>
          <TouchableOpacity onPress={()=> navigation.navigate('AddressDefaultComp',{"delivery":false})} >
          <View style={styles.menu}>
            <Icon 
              size={22} 
              name='address-book-o' 
              type='font-awesome' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>My Deliveries</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigation.navigate('MyOrder')}>
          <View style={styles.menu}>
            <Icon 
              size={20} 
              name='briefcase' 
              type='entypo' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>My Deliveries</Text>
          </View>
        </TouchableOpacity></View>}
        
        <TouchableOpacity onPress={()=> navigation.navigate('SupportSystem')}>
          <View style={styles.menu} >
            <Icon 
              size={20} 
              name='account-box' 
              type='material-community' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>Contact Us</Text>
          </View>
        </TouchableOpacity> 
        {user_id && userDetails.authService!=="guest" ?
        <TouchableOpacity onPress={()=>logout()}>
          <View style={styles.menu}>
            <Icon 
              size={20} 
              name='sign-out' 
              type='font-awesome' 
              color='#666' 
              containerStyle={styles.iconContainer}
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
