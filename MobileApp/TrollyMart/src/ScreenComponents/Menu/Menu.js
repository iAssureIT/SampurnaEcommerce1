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

export const Menu = (props)=>{
  console.log("PROPS",props);
  const {navigation}=props;
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName]   = useState('');
  const [user_id,setUserId]      = useState('');
  ;
  useEffect(() => {
    console.log("useEffect");
    getData()
  },[props]);

  const getData=()=>{
    AsyncStorage.getItem('user_id')
    .then((userId)=>{
      if(userId){
        axios
        .get('/api/users/get/'+userId)
        .then((user)=>{
          setFirstName(user.data.firstname);
          setLastName(user.data.lastname);
          setUserId(userId);
        })
        .catch((error)=>{
          console.log("error=>",error)
        })
      } 
    })
  }

  const logout=()=>{
    AsyncStorage.removeItem('user_id');
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('location');
    navigation.navigate('Auth');
  };
  
  return (
    <ScrollView contentContainerStyle={[styles.container]} scrollsToTop={false}>
      <ImageBackground source={require("../../AppDesigns/currentApp/images/Side_drawer.png")} style={styles.container} resizeMode="cover" >
        <View style={{flexDirection:"row",height:100,margin:40,paddingTop:30,borderBottomWidth:1}}>
        <Avatar
        style={{borderWidth:1, borderColor:"#999"}}
            overlayContainerStyle={{}}
            width={90}
            height={90}
            rounded
            source={require('../../AppDesigns/currentApp/images/user.jpg')}                 
          />
        <View style={{paddingTop:40,paddingLeft:4}}>
          <Text style={{fontSize:18,color: "#333"}}>Hi, {firstName ? firstName : "User"}</Text>
        </View>	
        </View>
      <View style={styles.menuWrapper}>
        <TouchableOpacity onPress={()=> navigation.navigate('AccountDashboard')}>
          <View style={styles.menu}>
            <Icon 
              size={22} 
              name='user-circle-o' 
              type='font-awesome' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>
              My Account
            </Text>
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
            <Text style={styles.menuText}>
              My Addresses 
            </Text>
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
            <Text style={styles.menuText}>
              My Orders
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigation.navigate('WishlistComponent')}>
          <View style={styles.menu} >
            <Icon 
              size={20} 
              name='bookmark-o' 
              type='font-awesome' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>
              My Wishlist
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigation.navigate('SupportSystem')}>
          <View style={styles.menu} >
            <Icon 
              size={20} 
              name='bookmark-o' 
              type='font-awesome' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>
              Help & Support
            </Text>
          </View>
        </TouchableOpacity> 
        {user_id ?
        <TouchableOpacity onPress={()=>logout()}>
          <View style={styles.menu}>
            <Icon 
              size={23} 
              name='power' 
              type='material-community' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={()=>logout()}>
          <View style={styles.menu}>
            <Icon 
              size={23} 
              name='login' 
              type='material-community' 
              color='#666' 
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.menuText}>
              Login
            </Text>
          </View>
        </TouchableOpacity>}
      </View>
      </ImageBackground>
  </ScrollView>
  );
}
