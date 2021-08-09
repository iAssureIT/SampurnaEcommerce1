import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  Alert,ActivityIndicator,
} from 'react-native';
import { Button, Icon,}       from "react-native-elements";
import Modal                  from "react-native-modal";
import {HeaderBar3}           from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}               from '../../ScreenComponents/Footer/Footer.js';
import axios                  from 'axios';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/PaymentMethodStyles.js';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import { RadioButton }        from 'react-native-paper';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import {withCustomerToaster}  from '../../redux/AppState.js';
import { connect,
  useDispatch,
  useSelector }               from 'react-redux';
import {getCartCount } 		              from '../../redux/productList/actions';
import openSocket               from 'socket.io-client';
import {REACT_APP_BASE_URL} from '@env'
import {FormButton}           from '../../ScreenComponents/FormButton/FormButton';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';

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
  console.log("order",order);
      return (
        <View style={{backgroundColor:"#fff",minHeight:window.height}}>
            <ScrollView style={{minHeight:window.height}}>
            <View style={{paddingVertical:24,paddingHorizontal:20}}>
              <Text style={CommonStyles.screenHeader}>Payment Receipt</Text>
            </View>
            <View style={{backgroundColor:"#5B8E7E",marginHorizontal:15,borderRadius:23,paddingHorizontal:15,paddingBottom:50}}>
                <View style={{marginTop:22,flexDirection:'row',}}>
                    <View style={{flex:0.6,alignItems:'flex-end'}}>
                        {/* <Icon color="#fff" name="check" type="font-awesome" size={73} iconStyle={{elevation:15}}/> */}
                        <Image
                        resizeMode="contain"
                        source={require("../../AppDesigns/currentApp/images/payment_success.png")}
                        style={{height:57,width:73}}
                        />
                    </View> 
                    <View style={{flex:0.4,alignItems:'flex-end'}}>
                        <Image
                            resizeMode="contain"
                            source={require("../../AppDesigns/currentApp/images/Logo.png")}
                            style={{height:50,width:80}}
                            />
                    </View>    
                </View>  
                <View style={{alignItems:"center"}}>
                    <Text style={[CommonStyles.label,{color:"#fff"}]}>Thank you!</Text>
                    <Text style={[CommonStyles.text,{color:"#fff"}]}>Your order has been received</Text>
                </View> 
                <View style={{flexDirection:"row",marginTop:25,justifyContent:'center'}}>
                    <View style={{flex:0.45}}>
                        <Text style={styles.label}>Receipt from</Text>
                    </View>
                    <View style={{flex:0.45}}>
                        <Text style={styles.text}>Knock Knock</Text>
                    </View>
                </View> 
                <View style={{flexDirection:"row",marginTop:25,justifyContent:'center'}}>
                    <View style={{flex:0.45,flexDirection:'row',alignItems:'center'}}>
                    <Image source={require('../../AppDesigns/currentApp/images/wallet.png')}
                      resizeMode="contain"
                      style={{height:19,width:23,marginRight:15}}
                    />
                        <Text style={styles.label}>Amount</Text>
                    </View>
                    <View style={{flex:0.45,flexDirection:'row',height:25,alignItems:'center'}}>
                        <Text style={[styles.label,{fontSize:14}]}>{currency} : </Text><Text style={[styles.label1]}>{order.paymentDetails.netPayableAmount}</Text>
                    </View>
                </View> 
                <View style={{flexDirection:"row",marginTop:15,justifyContent:'center',height:25}}>
                    <View style={{flex:0.45,flexDirection:'row',alignItems:'center'}}>
                    <Image source={require('../../AppDesigns/currentApp/images/calendar.png')}
                      resizeMode="contain"
                      style={{height:19,width:23,marginRight:15}}
                    />
                        <Text style={styles.label}>Date</Text>
                    </View>
                    <View style={{flex:0.45}}>
                        <Text style={styles.label}>{moment(order.createdAt).format('ll')}</Text>
                    </View>
                </View>  
                <View style={{flexDirection:"row",marginTop:50}}>
                    <View style={{flex:0.5}}>
                        <Text style={styles.label2}>Order No</Text>
                    </View>
                    <View style={{flex:0.5,alignItems:'flex-end'}}>
                        <Text style={styles.label3}>{order.orderID}</Text>
                    </View>
                </View>
                <View style={{flexDirection:"row",marginTop:16}}>
                    <View style={{flex:0.5}}>
                        <Text style={styles.label2}>Mobile No</Text>
                    </View>
                    <View style={{flex:0.5,alignItems:'flex-end'}}>
                        <Text style={styles.label3}>{order?.deliveryAddress?.mobileNumber ? order?.deliveryAddress?.mobileNumber : "NA"}</Text>
                    </View>
                </View>
                <View style={{flexDirection:"row",marginTop:16}}>
                    <View style={{flex:0.5}}>
                        <Text style={styles.label2}>Total</Text>
                    </View>
                    <View style={{flex:0.5,alignItems:'flex-end'}}>
                        <Text style={styles.label3}>{currency} {order.paymentDetails.netPayableAmount} </Text>
                    </View>
                </View>
                <View style={{flexDirection:"row",marginTop:16}}>
                    <View style={{flex:0.5}}>
                        <Text style={styles.label2}>Payment Method</Text>
                    </View>
                    <View style={{flex:0.5,alignItems:'flex-end'}}>
                        <Text style={styles.label3}>{order.paymentDetails.paymentMethod}</Text>
                    </View>
                </View>
                <TouchableOpacity style={{flexDirection:'row',marginTop:50,justifyContent:'center',alignItems:'center'}}  onPress  = {() => navigation.navigate('OrderDetails', { orderid: order._id })}>
                    <Icon name="eye" type='material-community' size={18} color="#fff" iconStyle={{paddingHorizontal:3}}/>
                    <Text style={[CommonStyles.label,{color:"#fff",fontFamily:"Montserrat-Regular",textDecorationLine:'underline'}]}>View my order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:100}}  onPress  = {() => navigation.navigate('Dashboard')}>
                    <Icon name="reply" type='material-community' size={18} color="#fff" iconStyle={{paddingHorizontal:3}}/>
                    <Text style={[CommonStyles.label,{color:"#fff",fontFamily:"Montserrat-Regular",textDecorationLine:'underline'}]}>Go back to homepage</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
      );
    })



