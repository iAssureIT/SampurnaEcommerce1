
import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,Platform
} from 'react-native';
import { Button,Icon}       from "react-native-elements";
import styles               from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import { useIsFocused }     from "@react-navigation/native";
import CommonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { useDispatch,
    useSelector }           from 'react-redux';
import {USER_LOGOUT}        from '../../redux/store';
import {SocialMediaLogin}   from '../SystemSecurity/RootLogIn/SocialMediaLogin.js';
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { Linking }          from 'react-native';
import DeviceInfo           from 'react-native-device-info';
import { NetWorkError }     from '../../../NetWorkError.js';
import { CommonActions }            from '@react-navigation/native';
import { RFPercentage, RFValue }    from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export const MyAccount =(props)=>{
  const {navigation}=props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const store = useSelector(store => ({
    userDetails  : store.userDetails,
    globalSearch  : store.globalSearch,
    isConnected: store.netWork.isConnected
  }));
  const {userDetails,globalSearch,isConnected} = store;
  console.log("store",store);

  console.log("DeviceInfo.getVersion()",DeviceInfo.getVersion());

  const logout=()=>{
    AsyncStorage.removeItem('user_id');
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('location');
    dispatch({type: USER_LOGOUT});
    // navigation.closeDrawer();

    navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Auth' },
          ],
        })
      );
  };
  console.log("userDetails",userDetails)
  
  return (
    isFocused &&<View style={{flex:1,backgroundColor:"#fff"}}>
   {!isConnected?
        <NetWorkError />
    :
    globalSearch.search ?
        <SearchSuggetion />
    :
     <ScrollView style={[styles.acdashsuperparent,{marginBottom:hp(7)}]} showsVerticalScrollIndicator={false}>
            <View style={{flex:1,marginBottom:hp(10),justifyContent:'center'}}>
            {userDetails.authService=="guest" ?
                <View>
                    <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                        <Text style={CommonStyles.screenHeader}>My Account</Text>
                    </View>  
                    <View style={{marginLeft:24,marginTop:hp(1)}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{marginTop:hp(1)}}>
                                <Text style={{fontSize:RFPercentage(2.5),color:'#000',fontFamily:"Montserrat-SemiBold",paddingVertical:5}}>Hello</Text>
                                <Text style={{fontSize:RFPercentage(2.3),color:'#000',fontFamily:"Montserrat-Medium"}}>Welcome to</Text>
                            </View>
                            <Image
                                resizeMode="contain"
                                source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/trollymart-black.png'}}
                                style={[{marginLeft:wp(1),marginTop:hp(5),height:hp(4),width:wp(25)}]}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles1.signSignUpBox} onPress={()=>logout()}>
                        <Text style={{fontSize:RFPercentage(1.5),color:'#000',fontFamily:"Montserrat-Medium"}}>Sign In / Sign Up </Text>
                    </TouchableOpacity> 
                    <SocialMediaLogin/>
                    </View> 
                    :
                 <View> 
                    <Image
                        resizeMode="contain"
                        source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/trollymart-black.png'}}
                        style={styles1.syslogoimg}
                    />
                    <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                        <Text style={styles.header1}>Profile</Text>
                        {userDetails.authService===""&&<TouchableOpacity  onPress={()=>navigation.navigate('AccountInformation')}>
                        <Image
                        resizeMode="contain"
                        source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/editNEW.png'}}
                        style={{height:hp(2),width:hp(2),marginLeft:wp(1),marginBottom:4}}
                        />
                            {/* <Icon size={15} name='edit' type='font-awesome' color={colors.textLight} iconStyle={[styles1.iconStyle,{marginLeft:12}]}/> */}
                        </TouchableOpacity>}
                    </View>  
                    <View style={{marginHorizontal:11,marginTop:hp(2)}}>
                        <Text style={[CommonStyles.label,{paddingVertical:5}]}>{userDetails.firstName+" "+userDetails.lastName}</Text>
                        {userDetails.email ?<Text style={{fontSize:RFPercentage(2),fontFamily:"Montserrat-Medium",color:"#aaa"}}>{userDetails.email}</Text>: null}
                        {userDetails.mobile ?<Text style={{fontSize:RFPercentage(2),fontFamily:"Montserrat-Medium",color:"#aaa"}}>{userDetails.isdCode ? ("+"+userDetails.isdCode) : ""}{userDetails.mobile}</Text>: null}
                    </View>       
                </View>}    
                <View style={styles1.horizontalLine} /> 
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <View style={{alignItems:'center',flex:0.3}}>   
                        <TouchableOpacity style={styles1.HorizontalBox} onPress={()=>navigation.navigate('MyOrder')}>
                            {/* <Icon size={30} name='shopping-outline' type='material-community' color={colors.theme} style={styles1.iconStyle}/> */}
                            <Image 
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/shopping-bag.png'}}
                            style={[styles.iconImg,{height:hp(5),width:hp(5)}]} resizeMode="contain" />
                        </TouchableOpacity>
                        <Text style={styles1.label}>My Orders</Text>
                    </View>
                    {userDetails.authService!=="guest" &&<View style={{alignItems:'center',flex:0.3}}>   
                        <TouchableOpacity style={styles1.HorizontalBox} onPress={()=> navigation.navigate('AddressDefaultComp',{"delivery":false,"back":false})} >
                            {/* <Icon size={30} name='map-marker-outline' type='material-community' color={colors.theme} style={styles1.iconStyle}/> */}                           
                            <Image 
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/address.png'}}
                            style={[styles.iconImg]} resizeMode="contain"/>                            
                        </TouchableOpacity>
                        <Text style={[styles1.label]}>My Address</Text>
                    </View>}
                    {userDetails.authService!=="guest" &&<View style={{alignItems:'center',flex:0.3}}>   
                        <TouchableOpacity style={styles1.HorizontalBox} onPress={()=>navigation.navigate('RewardsPoint')}>
                            {/* <Icon size={30} name='award' type='font-awesome-5' color={colors.theme} style={styles1.iconStyle}/> */}
                            <Image 
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/cards.png'}}
                            style={styles.iconImg} resizeMode="contain" />
                        </TouchableOpacity>
                        <Text style={[styles1.label,{alignSelf:'center'}]}>My Credit Points</Text>
                    </View>}
                </View>    
                <View style={styles1.horizontalLine} />
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <View style={{alignItems:'center',flex:0.3}}>   
                        <TouchableOpacity style={styles1.HorizontalBox1} onPress={()=>navigation.navigate('AboutUs')}>
                            {/* <Icon size={20} name='shopping-bag' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/> */}
                            <Image 
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/profile-information.png'}}
                            style={[styles.iconImg],{height:hp(2.5),width:hp(2.5)}} resizeMode="contain" />
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>About Us</Text>
                    </View>
                    <View style={{alignItems:'center',flex:0.3}}>   
                        <TouchableOpacity style={styles1.HorizontalBox1} onPress={()=> navigation.navigate('SupportSystem')} >
                            {/* <Icon size={20} name='card-account-mail-outline' type='material-community' color={colors.theme} style={styles1.iconStyle}/> */}
                            <Image 
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/ContactUs.png'}}
                            style={[styles.iconImg],{height:hp(2.5),width:hp(2.5)}} resizeMode="contain" />
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>Contact Us</Text>
                    </View>
                    <View style={{alignItems:'center',flex:0.3}}>   
                        <TouchableOpacity style={styles1.HorizontalBox1} onPress={()=>navigation.navigate('FAQ')}>
                            {/* <Icon size={20} name='frequently-asked-questions' type='material-community' color={colors.theme} style={styles1.iconStyle}/> */}
                            <Image 
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/FAQ.png'}}
                            style={[styles.iconImg],{height:hp(2.5),width:hp(2.5)}} resizeMode="contain"/>
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>FAQ</Text>
                    </View>
                </View>   
                <View style={{flexDirection:'row',justifyContent:'center',marginTop:hp(3),paddingHorizontal:hp(5)}}>
                    <View style={{alignItems:'center',flex:0.45}}>   
                        <TouchableOpacity style={[styles1.HorizontalBox1]} onPress={()=>navigation.navigate('TermsConditions')}>
                            {/* <Icon size={20} name='text-box-check-outline' type='material-community' color={colors.theme} style={styles1.iconStyle}/> */}
                            <Image 
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/compliant.png'}}
                            style={[styles.iconImg],{height:hp(2.5),width:hp(2.5)}} resizeMode="contain"/>
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>Terms and Conditions</Text>
                    </View>
                    <View style={{alignItems:'center',flex:0.45}}>   
                        <TouchableOpacity style={[styles1.HorizontalBox1]} onPress={()=> navigation.navigate('PrivacyPolicy')} >
                            {/* <Icon size={20} name='book-lock' type='material-community' color={colors.theme} style={styles1.iconStyle}/> */}
                            <Image 
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/PrivacyPolicy.png'}}
                            style={[styles.iconImg],{height:hp(2.5),width:hp(2.5)}} resizeMode="contain"/>
                        </TouchableOpacity>
                        <Text style={[styles1.label1]}>Privacy Policy</Text>
                    </View>
                </View> 
                <View style={styles1.horizontalLine} />
                    {userDetails.authService !== "guest" ?
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <View style={{alignItems:'center',paddingHorizontal:hp(1)}}>   
                            <TouchableOpacity style={styles1.HorizontalBox1}  onPress={()=> logout()} >
                                {/* <Icon size={20} name='logout' type='material-community' color={colors.theme} style={styles1.iconStyle}/> */}
                                <Image 
                                source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/logout.png'}}
                                style={[styles.iconImg],{height:hp(2.5),width:hp(2.5)}} />
                            </TouchableOpacity>
                            <Text style={[styles1.label1]}>Log Out</Text>
                        </View>                        
                    </View>
                    :
                        null
                    }
                {userDetails.authService !== "guest" ?
                    <View style={styles1.horizontalLine} />
                    :
                     null
                }
                <View style={{flex:1}}>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <View style={{alignItems:'center',paddingHorizontal:wp(2)}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://www.instagram.com/knockknock_eshop/')} >
                                <Icon size={RFPercentage(2.5)} name='instagram' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View>
                        <View style={{alignItems:'center',paddingHorizontal:wp(2)}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://www.facebook.com/Knock-Knock-103575731986682')} >
                                <Icon size={RFPercentage(2.5)} name='facebook' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{alignItems:'center',paddingHorizontal:10}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://www.instagram.com/knockknock_eshop/')} >
                                <Icon size={15} name='youtube' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View> */}
                        {/* <View style={{alignItems:'center',paddingHorizontal:10}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://www.instagram.com/knockknock_eshop/')} >
                                <Icon size={15} name='linkedin' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View> */}
                        <View style={{alignItems:'center',paddingHorizontal:wp(2)}}>   
                            <TouchableOpacity style={styles1.HorizontalBox3}  onPress={()=> Linking.openURL('https://twitter.com/knockknockeshop')} >
                                <Icon size={RFPercentage(2.5)} name='twitter' type='material-community' color={'#fff'} style={styles1.iconStyle}/>                            
                            </TouchableOpacity>
                        </View>                        
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',marginTop:hp(2),alignItems:'center'}}>
                        <Icon size={RFPercentage(1.8)} name='copyright' type='material-community' color={'#aaa'}/>
                        <Text style={styles.copyRightText}>&nbsp;2021 Knock Knock. All Rights Reserved</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',marginTop:hp(2),alignItems:'center'}}>
                        <Text style={styles.copyRightText}>V {DeviceInfo.getVersion()}</Text>
                    </View>
                </View>                
            </View>
        </ScrollView>}
      </View>
    );  
}


const styles1 = StyleSheet.create({
    HorizontalBox: {
        alignItems        : "center",
        justifyContent    : 'center',
        backgroundColor   : "#fff",
        height            : hp(5),
        width             : hp(5),
        shadowColor       : '#000',
        shadowOffset      : { width: 0, height: 2 },
        shadowOpacity     : 0.5,
        shadowRadius      : 2,
        elevation         : 10,
        borderRadius      : hp(100),
    },
    HorizontalBox1: {
        alignItems        : "center",
        justifyContent    : 'center',
        backgroundColor   : "#fff",
        height            : hp(4),
        width             : hp(4),
        shadowColor       : '#000',
        shadowOffset      : { width: 0, height: 2 },
        shadowOpacity     : 0.5,
        shadowRadius      :  Platform.OS === "ios" ?5:20,
        elevation         : Platform.OS === "ios" ? 1:10,
        borderRadius      : hp(100),
    },
    HorizontalBox3: {
        alignItems          : "center",
        justifyContent      : 'center',
        backgroundColor     : "#000",
        height              : hp(3),
        width               : hp(3),
        shadowColor         : '#000',
        shadowOffset        : { width: 0, height: 2 },
        shadowOpacity       : 0.5,
        shadowRadius        : 20,
        elevation           : 10,
        borderRadius        : 100,
        marginVertical      : 5
    },
    syslogoimg:{
        width        : wp(30),
        height       : hp(10),
    },
    syslogoimg1:{
        width   : '50%',
        height  : 50
    },
    label : {
        fontFamily  : "Montserrat-Medium",
        fontSize    : RFPercentage(1.5),
        color       :'#000',
        marginTop   :5
    },
    label1 : {
        fontFamily  : "Montserrat-Medium",
        fontSize    : RFPercentage(1.3),
        color       : '#000',  
        marginTop   :5      
    },
    signSignUpBox:{
        marginHorizontal:wp(10),marginTop:hp(1),height:hp(4),borderWidth:0.5,borderRadius:8,justifyContent:'center',alignItems:'center',width:wp(70),alignSelf:'center'
    },
    horizontalLine:{borderWidth:0.5,borderColor:"#e1e1e1",width:wp(75),alignSelf:'center',marginVertical:hp(3)}
  });
  