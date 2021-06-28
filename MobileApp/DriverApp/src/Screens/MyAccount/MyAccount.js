
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
import {Footer}       from '../../ScreenComponents/Footer/Footer1.js';
import styles         from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import {colors}       from '../../AppDesigns/currentApp/styles/styles.js';
import Loading        from '../../ScreenComponents/Loading/Loading.js';
import AsyncStorage   from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { connect,
    useDispatch,
    useSelector }    from 'react-redux';

// export default class AccountDashboard extends React.Component{
export const MyAccount =(props)=>{
  const {navigation}=props;
  const store = useSelector(store => ({
    userDetails  : store.userDetails,
  }));
  const {userDetails} = store;
  return (
    <React.Fragment>
      {/* <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'My Account'}
          navigate={navigation.navigate}
      /> */}
      <View style={styles.acdashsuperparent}>
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
            </View>
            <Footer/>
        </View>
      </React.Fragment>
    );  
}


const styles1 = StyleSheet.create({
    HorizontalBoxLeft: {
        height              : 50,
        alignItems          : "center",
        justifyContent      : 'center',
        backgroundColor     : "#fff",
        flex                : 0.47,
        height              : 150,
        marginLeft          : 15,
        marginVertical      : 15,
        elevation: 5
    },
    HorizontalBoxRight: {
        height              : 50,
        alignItems          : "center",
        justifyContent      : 'center',
        backgroundColor     : "#fff",
        flex                : 0.47,
        height              : 150,
        marginRight         : 15,
        marginVertical      : 15,
        elevation: 5
    },
    iconStyle:{
        marginBottom:15
        // width               :50
    }
  });
  