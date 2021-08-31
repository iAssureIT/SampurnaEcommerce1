import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  Alert,BackHandler,
} from 'react-native';
import { Button, Icon,}       from "react-native-elements";
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/PaymentMethodStyles.js';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import {withCustomerToaster}  from '../../redux/AppState.js';
import { connect,
  useDispatch,
  useSelector }               from 'react-redux';
import openSocket               from 'socket.io-client';
import {REACT_APP_BASE_URL} from '@env'
import {FormButton}           from '../../ScreenComponents/FormButton/FormButton';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const window = Dimensions.get('window');
const  socket = openSocket(REACT_APP_BASE_URL,{ transports : ['websocket'] });




// import {AppEventsLogger} from 'react-native-fbsdk';    

export const PaymentConfirmation = withCustomerToaster((props)=>{
  const {navigation,route,setToast}=props;
  const {order}=props.route.params;
  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
  }));
  const {currency}=store.preferences;

//   useEffect(() => {
//     BackHandler.addEventListener("hardwareBackPress", backAction);
//     return () =>
//     BackHandler.removeEventListener("hardwareBackPress", backAction);
//   },[]);

  const backAction = () => {
    navigation.navigate('Dashboard');
    return true
  };

  console.log("order",order);
      return (
        <View style={{backgroundColor:"#fff",minHeight:window.height}}>
            <ScrollView style={{minHeight:window.height}}>
            <View style={{paddingVertical:24,paddingHorizontal:20}}>
              <Text style={CommonStyles.screenHeader}>Payment Receipt</Text>
            </View>
            <View style={{backgroundColor:"#5B8E7E",marginHorizontal:wp(4),borderRadius:23,paddingHorizontal:wp(4),paddingBottom:hp(6.5)}}>
                <View style={{marginTop:hp(1.8),flexDirection:'row',}}>
                    <View style={{flex:0.6,alignItems:'flex-end'}}>
                        {/* <Icon color="#fff" name="check" type="font-awesome" size={73} iconStyle={{elevation:15}}/> */}
                        <Image
                        resizeMode="contain"
                        source={require("../../AppDesigns/currentApp/images/payment_success.png")}
                        style={{height:hp(10),width:wp(20)}}
                        />
                    </View> 
                    <View style={{flex:0.4,alignItems:'flex-end'}}>
                        <Image
                            resizeMode="contain"
                            source={require("../../AppDesigns/currentApp/images/Logo.png")}
                            style={{height:hp(6),width:wp(20)}}
                            />
                    </View>    
                </View>  
                <View style={{alignItems:"center"}}>
                    <Text style={[CommonStyles.label,{color:"#fff"}]}>Thank you!</Text>
                    <Text style={[CommonStyles.text,{color:"#fff"}]}>Your order has been received</Text>
                </View> 
                    <View style={{flexDirection:"row",marginTop:hp(2),justifyContent:'center'}}>
                        <View style={{flex:0.4}}>
                            <Text style={styles.label}>Receipt from</Text>
                        </View>
                        <View style={{flex:0.4,alignItems:"flex-end"}}>
                            <Text style={styles.text}>Knock Knock</Text>
                        </View>
                    </View> 
                    <View style={{flexDirection:"row",marginTop:hp(2),justifyContent:'center'}}>
                        <View style={{flex:0.4,flexDirection:'row',alignItems:'center'}}>
                        <Image source={require('../../AppDesigns/currentApp/images/wallet.png')}
                        resizeMode="contain"
                        style={{height:hp(3),width:wp(6),marginRight:wp(1)}}
                        />
                            <Text style={styles.label}>Amount</Text>
                        </View>
                        <View style={{flex:0.4,flexDirection:'row',justifyContent:'flex-end'}}>
                            <Text style={[styles.label,{fontSize:RFPercentage(2.3)}]}>{currency}: </Text><Text style={[styles.label1]}>{order.paymentDetails.netPayableAmount}</Text>
                        </View>
                    </View> 
                    <View style={{flexDirection:"row",marginTop:hp(2),justifyContent:'center'}}>
                        <View style={{flex:0.4,flexDirection:'row',alignItems:'center'}}>
                        <Image source={require('../../AppDesigns/currentApp/images/calendar.png')}
                        resizeMode="contain"
                        style={{height:hp(3),width:wp(6),marginRight:wp(1)}}
                        />
                            <Text style={styles.label}>Date</Text>
                        </View>
                        <View style={{flex:0.4,alignItems:'flex-end'}}>
                            <Text style={styles.label}>{moment(order.createdAt).format('ll')}</Text>
                        </View>
                    </View>
                <View style={{paddingHorizontal:wp(5)}}>
                    <View style={{flexDirection:"row",marginTop:hp(3)}}>
                        <View style={{flex:0.5}}>
                            <Text style={styles.label2}>Order No.</Text>
                        </View>
                        <View style={{flex:0.5,alignItems:'flex-end'}}>
                            <Text style={styles.label3}>{order.orderID}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",marginTop:hp(3)}}>
                        <View style={{flex:0.5}}>
                            <Text style={styles.label2}>Mobile:</Text>
                        </View>
                        <View style={{flex:0.5,alignItems:'flex-end'}}>
                            <Text style={styles.label3}>{order?.deliveryAddress?.mobileNumber ? order?.deliveryAddress?.mobileNumber : "NA"}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",marginTop:hp(3)}}>
                        <View style={{flex:0.5}}>
                            <Text style={styles.label2}>Total:</Text>
                        </View>
                        <View style={{flex:0.5,alignItems:'flex-end'}}>
                            <Text style={styles.label3}>{currency} {order.paymentDetails.netPayableAmount} </Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",marginTop:hp(2)}}>
                        <View style={{flex:0.5}}>
                            <Text style={styles.label2}>Payment Method:</Text>
                        </View>
                        <View style={{flex:0.5,alignItems:'flex-end'}}>
                            <Text style={styles.label3}>{order.paymentDetails.paymentMethod}</Text>
                        </View>
                    </View>
                </View>    
                <TouchableOpacity style={{flexDirection:'row',marginTop:hp(4),justifyContent:'center',alignItems:'center'}}  onPress  = {() => navigation.navigate('OrderDetails', { orderid: order._id })}>
                    <Icon name="eye" type='material-community' size={RFPercentage(2.8)} color="#fff" iconStyle={{paddingHorizontal:3}}/>
                    <Text style={[CommonStyles.label,{color:"#fff",fontFamily:"Montserrat-Regular",textDecorationLine:'underline'}]}>View my order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:100}}  onPress  = {() => navigation.navigate('Dashboard')}>
                    <Icon name="reply" type='material-community' size={RFPercentage(2.8)} color="#fff" iconStyle={{paddingHorizontal:3}}/>
                    <Text style={[CommonStyles.label,{color:"#fff",fontFamily:"Montserrat-Regular",textDecorationLine:'underline'}]}>Go back to homepage</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
      );
    })



