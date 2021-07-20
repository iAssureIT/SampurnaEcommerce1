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
      return (
        <View style={{backgroundColor:"#fff",minHeight:window.height}}>
            <ScrollView style={{minHeight:window.height}}>
            <View style={{paddingVertical:24,paddingHorizontal:20}}>
              <Text style={CommonStyles.screenHeader}>Payment Receipt</Text>
            </View>
            <View style={{backgroundColor:"#5B8E7E",marginHorizontal:15,borderRadius:23,paddingHorizontal:15,paddingBottom:50}}>
                <View style={{marginTop:22,flexDirection:'row',}}>
                    <View style={{flex:0.6,alignItems:'flex-end'}}>
                        <Icon color="#fff" name="check" type="font-awesome" size={73} iconStyle={{elevation:5}}/>
                    </View> 
                    <View style={{flex:0.4,alignItems:'flex-end'}}>
                        <Image
                            resizeMode="contain"
                            source={require("../../AppDesigns/currentApp/images/trollymart-black.png")}
                            style={{height:50,width:80}}
                            />
                    </View>    
                </View>  
                <View style={{alignItems:"center"}}>
                    <Text style={[CommonStyles.label,{color:"#fff"}]}>Thank you your order</Text>
                    <Text style={[CommonStyles.label,{color:"#fff"}]}>has been received</Text>
                </View> 
                <View style={{flexDirection:"row",marginTop:45,justifyContent:'center'}}>
                    <View style={{flex:0.4}}>
                        <Text style={[CommonStyles.label,{color:"#fff",fontFamily:"Montserrat-Regular"}]}>Receipt from</Text>
                    </View>
                    <View style={{flex:0.4}}>
                        <Text style={[CommonStyles.label,{color:"#fff"}]}>Knock Knock</Text>
                    </View>
                </View> 
                <View style={{flexDirection:"row",marginTop:25,justifyContent:'center'}}>
                    <View style={{flex:0.4,flexDirection:'row'}}>
                        <Icon name="wallet" type='material-community' size={18} color="#fff" iconStyle={{paddingHorizontal:3}}/>
                        <Text style={[CommonStyles.label,{color:"#fff",fontFamily:"Montserrat-Regular"}]}>Amount</Text>
                    </View>
                    <View style={{flex:0.4}}>
                        <Text style={[CommonStyles.label,{color:"#fff"}]}>{currency} : {order.paymentDetails.netPayableAmount}/-</Text>
                    </View>
                </View> 
                <View style={{flexDirection:"row",marginTop:15,justifyContent:'center'}}>
                    <View style={{flex:0.4,flexDirection:'row'}}>
                        <Icon name="calendar" type='material-community' size={18} color="#fff" iconStyle={{paddingHorizontal:3}}/>
                        <Text style={[CommonStyles.label,{color:"#fff",fontFamily:"Montserrat-Regular"}]}>Date</Text>
                    </View>
                    <View style={{flex:0.4}}>
                        <Text style={[CommonStyles.label,{color:"#fff"}]}>{moment(order.createdAt).format('ll')}</Text>
                    </View>
                </View>  
                <View style={{flexDirection:"row",marginTop:50}}>
                    <View style={{flex:0.5}}>
                        <Text style={[CommonStyles.label,{fontFamily:"Montserrat-Regular"}]}>Order No</Text>
                    </View>
                    <View style={{flex:0.5,alignItems:'flex-end'}}>
                        <Text style={[CommonStyles.label]}>{order.orderID}</Text>
                    </View>
                </View>
                <View style={{flexDirection:"row",marginTop:16}}>
                    <View style={{flex:0.5}}>
                        <Text style={[CommonStyles.label,{fontFamily:"Montserrat-Regular"}]}>Mobile No</Text>
                    </View>
                    <View style={{flex:0.5,alignItems:'flex-end'}}>
                        <Text style={[CommonStyles.label]}>{order?.deliveryAddress?.mobileNumber ? order?.deliveryAddress?.mobileNumber : "NA"}</Text>
                    </View>
                </View>
                <View style={{flexDirection:"row",marginTop:16}}>
                    <View style={{flex:0.5}}>
                        <Text style={[CommonStyles.label,{fontFamily:"Montserrat-Regular"}]}>Total</Text>
                    </View>
                    <View style={{flex:0.5,alignItems:'flex-end'}}>
                        <Text style={[CommonStyles.label]}>{order.paymentDetails.netPayableAmount} {currency}</Text>
                    </View>
                </View>
                <View style={{flexDirection:"row",marginTop:16}}>
                    <View style={{flex:0.5}}>
                        <Text style={[CommonStyles.label,{fontFamily:"Montserrat-Regular"}]}>Payment Method</Text>
                    </View>
                    <View style={{flex:0.5,alignItems:'flex-end'}}>
                        <Text style={[CommonStyles.label]}>{order.paymentDetails.paymentMethod}</Text>
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



