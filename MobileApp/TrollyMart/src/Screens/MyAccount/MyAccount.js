
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image
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
import {SocialMediaLogin} from '../SystemSecurity/RootLogIn/SocialMediaLogin.js';


// export default class AccountDashboard extends React.Component{
export const MyAccount =(props)=>{
  const {navigation}=props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
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
  console.log("userDetails",userDetails)
  
  return (
    isFocused &&<View style={{flex:1,backgroundColor:"#fff"}}>
      {/* <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'My Account'}
          navigate={navigation.navigate}
      /> */}
     <ScrollView style={[styles.acdashsuperparent,{marginBottom:70}]}>
            <View style={{flex:1,marginBottom:65,justifyContent:'center'}}>
            {userDetails.authService=="guest" ?
                <View>
                    <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                        <Text style={{fontSize:22,fontFamily:"Montserrat-Bold"}}>My Account</Text>
                    </View>  
                    <View style={{marginLeft:24,marginTop:15}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{marginTop:20}}>
                                <Text style={{fontSize:18,fontFamily:"Montserrat-SemiBold",paddingVertical:5}}>Hello</Text>
                                <Text style={{fontSize:16,fontFamily:"Montserrat-Medium"}}>Welcome to</Text>
                            </View>
                            <Image
                                resizeMode="contain"
                                source={require("../../AppDesigns/currentApp/images/trollymart-black.png")}
                                style={[styles1.syslogoimg1,{flex:0.5,marginLeft:5,marginTop:50}]}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles1.signSignUpBox} onPress={()=>logout()}>
                        <Text>Sign In / Sign Up </Text>
                    </TouchableOpacity> 
                    <SocialMediaLogin/>
                    </View> 
                    :
                 <View> 
                     <View style={styles.syslogo}>
                        <Image
                        resizeMode="contain"
                        source={require("../../AppDesigns/currentApp/images/trollymart-black.png")}
                        style={styles1.syslogoimg}
                        />
                    </View>
                    <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                        <Text style={CommonStyles.screenHeader}>Profile</Text>
                        <TouchableOpacity  onPress={()=>navigation.navigate('AccountInformation')}>
                            <Icon size={15} name='edit' type='font-awesome' color={colors.textLight} iconStyle={[styles1.iconStyle,{marginLeft:12}]}/>
                        </TouchableOpacity>
                    </View>  
                    <View style={{marginLeft:20,marginTop:15}}>
                        <Text style={[CommonStyles.label,{paddingVertical:5}]}>{userDetails.firstName+" "+userDetails.lastName}</Text>
                        {userDetails.email ?<Text style={{fontSize:16,fontFamily:"Montserrat-Medium",color:"#aaa"}}>{userDetails.email}</Text>: null}
                        {userDetails.mobile ?<Text style={{fontSize:16,fontFamily:"Montserrat-Medium",color:"#aaa"}}>{userDetails.mobile}</Text>: null}
                    </View>       
                </View>}    
                <View style={styles1.horizontalLine} /> 
                <View style={{flexDirection:'row',justifyContent:'center',paddingHorizontal:30}}>
                    <View style={{alignItems:'center',paddingHorizontal:15}}>   
                        <TouchableOpacity style={styles1.HorizontalBox} onPress={()=>navigation.navigate('MyOrder')}>
                            <Icon size={30} name='shopping-outline' type='material-community' color={colors.theme} style={styles1.iconStyle}/>
                        </TouchableOpacity>
                        <Text style={styles1.label}>My Orders</Text>
                    </View>
                    {userDetails.authService!=="guest" &&<View style={{alignItems:'center',paddingHorizontal:15}}>   
                        <TouchableOpacity style={styles1.HorizontalBox} onPress={()=> navigation.navigate('AddressDefaultComp',{"delivery":false})} >
                            <Icon size={30} name='map-marker-outline' type='material-community' color={colors.theme} style={styles1.iconStyle}/>
                        </TouchableOpacity>
                        <Text style={[styles1.label]}>My Address</Text>
                    </View>}
                    {userDetails.authService!=="guest" &&<View style={{alignItems:'center',paddingHorizontal:15}}>   
                        <TouchableOpacity style={styles1.HorizontalBox} onPress={()=>navigation.navigate('RewardsPoint')}>
                            <Icon size={30} name='award' type='font-awesome-5' color={colors.theme} style={styles1.iconStyle}/>
                        </TouchableOpacity>
                        <Text style={[styles1.label]}>Credit Points</Text>
                    </View>}
                </View>    
                <View style={styles1.horizontalLine} />
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <View style={{alignItems:'center',paddingHorizontal:20}}>   
                        <TouchableOpacity style={styles1.HorizontalBox1} onPress={()=>navigation.navigate('AboutUs')}>
                            <Icon size={20} name='shopping-bag' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>About Us</Text>
                    </View>
                    <View style={{alignItems:'center',paddingHorizontal:20}}>   
                        <TouchableOpacity style={styles1.HorizontalBox1} onPress={()=> navigation.navigate('SupportSystem')} >
                            <Icon size={20} name='card-account-mail-outline' type='material-community' color={colors.theme} style={styles1.iconStyle}/>
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>Contact Us</Text>
                    </View>
                    <View style={{alignItems:'center',paddingHorizontal:20}}>   
                        <TouchableOpacity style={styles1.HorizontalBox1} onPress={()=>navigation.navigate('FAQ')}>
                            <Icon size={20} name='frequently-asked-questions' type='material-community' color={colors.theme} style={styles1.iconStyle}/>
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>FAQ</Text>
                    </View>
                </View>   
                <View style={{flexDirection:'row',justifyContent:'center',marginTop:30}}>
                    <View style={{alignItems:'center',paddingHorizontal:15}}>   
                        <TouchableOpacity style={styles1.HorizontalBox1} onPress={()=>navigation.navigate('TermsConditions')}>
                            <Icon size={20} name='text-box-check-outline' type='material-community' color={colors.theme} style={styles1.iconStyle}/>
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>Terms and Conditions</Text>
                    </View>
                    <View style={{alignItems:'center',paddingHorizontal:15}}>   
                        <TouchableOpacity style={styles1.HorizontalBox1} onPress={()=> navigation.navigate('PrivacyPolicy')} >
                            <Icon size={20} name='book-lock' type='material-community' color={colors.theme} style={styles1.iconStyle}/>
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>Privacy Policy</Text>
                    </View>
                </View> 
                <View style={styles1.horizontalLine} />
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <View style={{alignItems:'center',paddingHorizontal:15}}>   
                        <TouchableOpacity style={styles1.HorizontalBox1}  onPress={()=> logout()} >
                            <Icon size={20} name='logout' type='material-community' color={colors.theme} style={styles1.iconStyle}/>
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>Log Out</Text>
                    </View>
                </View> 
            </View>
        </ScrollView>
      </View>
    );  
}


const styles1 = StyleSheet.create({
    HorizontalBox: {
        alignItems          : "center",
        justifyContent      : 'center',
        backgroundColor     : "#fff",
        height              : 52,
        width              : 52,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 10,
        borderRadius :100,
        marginVertical:5
    },
    HorizontalBox1: {
        alignItems          : "center",
        justifyContent      : 'center',
        backgroundColor     : "#fff",
        height              : 40,
        width              : 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        borderRadius :100,
        marginVertical:5
    },
    iconStyle:{
        // marginBottom:15
        // width               :50
    },
    syslogoimg:{
        width: '50%',
        height:137
    },
    syslogoimg1:{
        width: '50%',
        height:50
    },
    label : {
        fontFamily:"Montserrat-Medium",
<<<<<<< Updated upstream
        fontSize:12,
        color:'#000'        
=======
        fontSize:12
>>>>>>> Stashed changes
    },
    label1 : {
        fontFamily:"Montserrat-Medium",
        fontSize:9,
        color:'#000',        
    },
    signSignUpBox:{
        marginTop:15,height:35,borderWidth:0.5,borderRadius:8,justifyContent:'center',alignItems:'center',width:333,alignSelf:'center'
    },
    horizontalLine:{borderWidth:0.5,borderColor:"#e1e1e1",width:300,alignSelf:'center',marginVertical:30}
  });
  