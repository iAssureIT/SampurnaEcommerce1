
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { Button,Icon}     from "react-native-elements";
import axios          from "axios";
import {Menu}         from '../../ScreenComponents/Menu/Menu.js';
import {HeaderBar3}   from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}       from '../../ScreenComponents/Footer/Footer.js';
import styles         from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import {colors}       from '../../AppDesigns/currentApp/styles/styles.js';
import Loading        from '../../ScreenComponents/Loading/Loading.js';
import AsyncStorage   from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { connect,
    useDispatch,
    useSelector }    from 'react-redux';
import {USER_LOGOUT} from '../../redux/store';


// export default class AccountDashboard extends React.Component{
export const MyAccount =(props)=>{
  const {navigation}=props;
  const dispatch = useDispatch();
  const store = useSelector(store => ({
    userDetails  : store.userDetails,
  }));
  const {userDetails} = store;

  const logout=()=>{
    AsyncStorage.removeItem('user_id');
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('location');
    dispatch({type: USER_LOGOUT});
    // navigation.closeDrawer();
    navigation.navigate('Auth');
    
  };
  
  return (
    <View style={{flex:1,backgroundColor:"#f1f1f1"}}>
      {/* <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'My Account'}
          navigate={navigation.navigate}
      /> */}
      <ScrollView style={styles.acdashsuperparent}>
            <View style={{flex:1,marginBottom:65,justifyContent:'center'}}>
                <View style={{flexDirection:"row",justifyContent:'space-between',marginTop:5}}>   
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('AccountDashboard')}>
                        <Icon size={30} name='user-circle-o' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>My Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.HorizontalBoxRight} onPress={()=>navigation.navigate('MyOrder')}>
                        <Icon size={30} name='shopping-bag' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>My Orders</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:"row",justifyContent:'space-between'}}>         
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('WishlistComponent')}>
                        <Icon size={30} name='heart-o' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>My WishList</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.HorizontalBoxRight} onPress={()=>navigation.navigate('CartComponent', { userId: userDetails.user_id })}>
                        <Icon size={30} name='shopping-cart' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>My Cart</Text>
                    </TouchableOpacity>
                </View>   
                <View style={{flexDirection:"row",justifyContent:'space-between'}}>    
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('RewardsPoint')}>
                        <Icon size={30} name='award' type='font-awesome-5' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>My Rewards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles1.HorizontalBoxRight]} onPress={()=> navigation.navigate('AddressDefaultComp',{"delivery":false})} >
                        <Icon size={30} name='address-book' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>My Addresses</Text>
                    </TouchableOpacity>
                </View> 
                <View style={{flexDirection:"row",justifyContent:'space-between'}}>    
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('AboutUs')}>
                        <Icon size={30} name='info-circle' type='font-awesome-5' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>About Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles1.HorizontalBoxRight]} onPress={()=> navigation.navigate('SupportSystem')} >
                        <Icon size={30} name='account-box' type='material-community' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>Contact Us</Text>
                    </TouchableOpacity>
                </View> 
                <View style={{flexDirection:"row",justifyContent:'space-between'}}>    
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('TermsConditions')}>
                        <Icon size={30} name='file-contract' type='font-awesome-5' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>Terms and Conditions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles1.HorizontalBoxRight]} onPress={()=> navigation.navigate('PrivacyPolicy')} >
                        <Icon size={30} name='file-contract' type='font-awesome-5' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View> 
                <View style={{flexDirection:"row",justifyContent:'space-between'}}>    
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('FAQ')}>
                        <Icon size={30} name='question-circle' type='font-awesome-5' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>FAQ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles1.HorizontalBoxRight]} onPress={()=> logout()} >
                        <Icon size={30} name='logout' type='font-awesome5' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>Log Out</Text>
                    </TouchableOpacity>
                </View>     
                 
            </View>
        </ScrollView>
      </View>
    );  
}


const styles1 = StyleSheet.create({
    HorizontalBoxLeft: {
        alignItems          : "center",
        justifyContent      : 'center',
        backgroundColor     : "#fff",
        flex                : 0.47,
        height              : 100,
        marginLeft          : 15,
        marginVertical      : 15,
        elevation: 5
    },
    HorizontalBoxRight: {
        height              : 30,
        alignItems          : "center",
        justifyContent      : 'center',
        backgroundColor     : "#fff",
        flex                : 0.47,
        height              : 100,
        marginRight         : 15,
        marginVertical      : 15,
        elevation: 5
    },
    iconStyle:{
        marginBottom:15
        // width               :50
    }
  });
  