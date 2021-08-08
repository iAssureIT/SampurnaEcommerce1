import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  Alert,ActivityIndicator,
} from 'react-native';
import { Button, Icon,}       from "react-native-elements";
import CommonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
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
import { NetWorkError } from '../../../NetWorkError.js';
import { Platform } from 'react-native';

const  socket = openSocket(REACT_APP_BASE_URL,{ transports : ['websocket'] });
// import {AppEventsLogger} from 'react-native-fbsdk';    

export const PaymentMethod = withCustomerToaster((props)=>{
  const {navigation,route,setToast}=props;

  const dispatch = useDispatch();
  const [checked,setChecked]                = useState('third');
  const [btnLoading,setBtnLoading]          = useState(false);
  const [paymentmethods,setPaymentMethods]  = useState("Credit/Debit Card");
  // const [environment,setEnvironment]        = useState(false);
  const [namepayg,setNamePayg]              = useState('');
  const [partnerid,setPartnerId]            = useState('');
  const [secretkey,setSecretKey]            = useState('');
  const [status,setStatus]                  = useState('');
  const [email,setEmail]                    = useState('');
  const [fullName,setFullName]              = useState('');
  const [mobNumber,setMobileNumber]         = useState('');

  const {cartdata,userID,addData,shippingtime} = route.params;
  const userDetails = useSelector(store => store.userDetails)
  useEffect(() => {
    getData();
  }, [props]);

  const getData=()=>{
    var type = "PG"
    axios.post('/api/projectsettings/getS3Details/' + type)
    .then(result => {
        // setEnvironment(result.data.environment);
        setNamePayg(result.data.namepayg);
        setPartnerId(result.data.partnerid);
        setSecretKey(result.data.secretkey);
        setStatus(result.data.status);
    })
    .catch(err => {
        console.log('Errr', err);
    })
        
    AsyncStorage.multiGet(['token', 'user_id'])
    .then((data) => {
      axios.get('/api/ecommusers/'+data[1][1])
      .then((res) => {
        var dAddress = res.data.deliveryAddress.length>0 ? res.data.deliveryAddress[0].addressLine1 : null;
        setFullName(res.data.profile.fullName);
        setEmail(res.data.profile.email);
        setMobileNumber(res.data.profile.mobile);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          AsyncStorage.removeItem('user_id');
          AsyncStorage.removeItem('token');
          setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
          navigation.navigate('Auth')
        }else{
          setToast({text: 'Something went wrong.', color: 'red'});
        }  
      });
    });
  }


  const paymentgateway=()=>{
    setChecked('second');
    setPaymentMethods("Credit/Debit Card");
  }

  const continuepage=(id)=>{
    setBtnLoading(true);
    var cartItems=[];
    var vendorOrders = cartdata.vendorOrders;
    for(var i = 0; i<vendorOrders.length;i++){ 
      vendorOrders[i].products =[];
      if(vendorOrders[i].cartItems){
        for(var j = 0; j < vendorOrders[i].cartItems.length;j++){
          vendorOrders[i].products[j] = {...vendorOrders[i].cartItems[j].product_ID} ;
          vendorOrders[i].products[j].product_ID = vendorOrders[i].cartItems[j].product_ID._id ;
          delete vendorOrders[i].products[j]['_id']; 
          vendorOrders[i].products[j].quantity =vendorOrders[i].cartItems[j].quantity ;
          vendorOrders[i].deliveryStatus =[];
            vendorOrders[i].deliveryStatus.push({
              "status"          : "New",
              "timestamp"       : new Date(),
              "statusUpdatedBy" : userID,
              "expDeliveryDate" : new Date(),
          }) 
          vendorOrders[i].orderStatus =  "New";
        } 
       delete vendorOrders[i].cartItems;
      }
    }
    if(i>=vendorOrders.length){

      var deliveryAddress = {
        "name"          : addData.name,
        "addressLine1"  : addData.addressLine1,
        "addressLine2"  : addData.addressLine2,
        "pincode"       : addData.pincode,
        "city"          : addData.city,
        "state"         : addData.state,
        "mobileNumber"  : (addData.isdCode ? "+"+addData.isdCode : "")+""+addData.mobileNumber,
        "district"      : addData.district,
        "country"       : addData.country,
        "addType"       : addData.addType,
        "latitude"      : addData.latitude,
        "longitude"     : addData.longitude,
      }

      cartdata.paymentDetails.paymentMethod = paymentmethods;
      var orderData = { 
        user_ID 		              : userID,
        userFullName              : userDetails.fullName,
        userEmail                 : userDetails.email,
        vendorOrders		         : vendorOrders,
        order_quantityOfProducts	: cartdata.order_quantityOfProducts,
        order_numberOfProducts    :cartdata.order_numberOfProducts,
        deliveryAddress		        : deliveryAddress,
        paymentMethod             : paymentmethods,
        paymentDetails					  : cartdata.paymentDetails,
        customerShippingTime      : shippingtime,
        orderStatus               : "New"
      }
      socket.emit('postOrder',orderData);
      socket.on("order", (result)=>{
      // axios.post('/api/orders/post', orderData)
      //   .then((result) => {
          axios.get('/api/orders/get/one/' + result.order_id)
            .then((res) => {
              console.log(" PaymentCosnfirmation res",res);
              dispatch(getCartCount(userID))
              // if (paymentmethods === 'Cash On Delivery' || paymentmethods === 'Card On Delivery') {
                // navigation.popToTop();
                navigation.navigate('PaymentConfirmation', { order: res.data })
                setPaymentMethods("Cash On Delivery");
                setBtnLoading(false);
                // setPaymentMode(true);
                // setToast({text: 'Your order is confirmed.Thank you for shopping with us.', color: 'green'});
            // } else {
            //     setToast({text: 'Your order is confirmed.Thank you for shopping with us.', color: 'green'});
            //     navigation.navigate('OrderDetails', { orderid: result._id })
            //     var paymentdetails = {
            //         MERCHANT_ID           : partnerid,
            //         MERCHANT_ACCESS_CODE  : secretkey,
            //         REFERENCE_NO          : result.order_ID,
            //         AMOUNT                : totalamountpay,
            //         CUSTOMER_MOBILE_NO    : mobile,
            //         CUSTOMER_EMAIL_ID     : email,
            //         PRODUCT_CODE          : "testing",
            //     }
            //     // console.log('paymentdetails in result==>>>', paymentdetails)
            //     axios.post('/api/orders/pgcall/post', paymentdetails)
            //     .then((payurl) => {
            //         if(payurl.data.result.RESPONSE_MESSAGE  === 'SUCCESS'){
            //           // console.log('sendDataToUser in payurl==>>>', payurl.data.result.PAYMENT_URL)
            //           setToast({text: 'Your order is confirmed.Thank you for shopping with us.', color: 'green'});
            //         }
            //         setBtnLoading(false);
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //         setBtnLoading(false);
            //     })
            // }
              // =================== Notification OTP ==================
              var sendData = {
                "event": "3",
                "toUser_id": user_ID,
                "toUserRole": "user",
                "variables": {
                  "Username": res.data.userFullName,
                  "amount": res.data.total,
                  "orderid": res.data.orderID,
                  "shippingtime": res.data.shippingtime,
                }
              }
              console.log('sendDataToUser==>', sendData)
              axios.post('/api/masternotifications/post/sendNotification', sendData)
                .then((res) => {
                  // console.log('sendDataToUser in result==>>>', res.data)
                })
                .catch((error) => { console.log('notification error: ', error) })
              // =================== Notification ==================
            })
      })
        // .catch((error) => {
        //   console.log("error",error);
        //   setBtnLoading(false);
        //   console.log(error);
        // })
      }   
  }

      return (
        <React.Fragment>
          {/* <HeaderBar3
            goBack={navigation.goBack}
            navigate={navigation.navigate}
            headerTitle={"Payment Methods"}
          /> */}
          <View style={styles.superparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" extraScrollHeight={130}  enableAutomaticScroll enableOnAndroid >
              <View style={styles.formWrapper}>
                <View style={styles.parent}>
                <View style={{paddingVertical:20,paddingHorizontal:6}}>
                  <Text style={CommonStyles.screenHeader}>Payment Method</Text>
                </View>
                  <View style={styles.vwwishlist}>
                    <Image
                      style={styles.imgwdht}
                      source={require("../../AppDesigns/currentApp/images/PaymentMethod.png")}
                    />
                  </View>
                  <View style={styles.orderbrdr}>
                    <View style={styles.flx3}>
                      <RadioButton
                        value="third"
                        checkedIcon='dot-circle-o'
                        color={colors.cartButton}                             
                        uncheckedIcon='circle-o'
                        uncheckedColor={colors.cartButton}  
                        size={14}
                        // color={colors.theme}
                        status={checked === 'third' ? 'checked' : 'unchecked'}
                        onPress={() => {setChecked('third');setPaymentMethods('Online Payment')}}

                      />
                      <View style={{flex:0.8}}>
                        <Text style={styles.free}>Online Payment </Text>
                        <Text style={styles.freeL2}> (Credit/Debit Card) </Text>
                      </View>  
                      <View style={{flex:0.1,alignItems:'flex-end'}}>                        
                        <Image source={require("../../AppDesigns/currentApp/images/online-payment.png")} style={styles.iconImg} resizeMode="contain" />
                      </View>                    
                    </View>
                  </View>
                  <View style={styles.orderbrdr}>
                    <View style={styles.flx3}>
                      <RadioButton
                        style={styles.radiobtn}
                        checkedIcon='dot-circle-o'
                        color='#033554'                              
                        uncheckedIcon='circle-o'
                        uncheckedColor='#033554'
                        size={14}
                        // color={colors.theme}
                        value="second"
                        status={checked === 'second' ? 'checked' : 'unchecked'}
                        onPress={() => {setChecked('second');setPaymentMethods('Card On Delivery')}}
                      />
                      <View style={{flex:0.8}}>
                        <Text style={styles.free}>Card on Delivery</Text>
                      </View>  
                      <View style={{flex:0.1,alignItems:'flex-end'}}>                        
                        <Image source={require("../../AppDesigns/currentApp/images/pos-terminal.png")} style={styles.iconImg} resizeMode="contain" />
                      </View>                         
                    </View>
                  </View>
                  <View style={styles.orderbrdr}>
                    <View style={styles.flx3}>
                      <RadioButton
                        style={styles.radiobtn}
                        checkedIcon='dot-circle-o'
                        color='#033554'                              
                        uncheckedIcon='circle-o'
                        uncheckedColor='#033554'
                        size={14}
                        value="first"
                        // color={colors.theme}
                        status={checked === 'first' ? 'checked' : 'unchecked'}
                        onPress={() => {setChecked('first');setPaymentMethods('Cash On Delivery')}}
                      />
                      <View style={{flex:0.8}}>
                        <Text style={styles.free}>Cash on Delivery</Text>
                      </View>  
                      <View style={{flex:0.1,alignItems:'flex-end'}}>                        
                        <Image source={require("../../AppDesigns/currentApp/images/cash-on-delivery.png")} style={styles.iconImgCash} resizeMode="contain" />
                      </View>                       
                    </View>
                  </View>
                  
                  {/* <View style={styles.orderbrdr}>
                    <View style={styles.flx3}>
                      <RadioButton
                        value="third"
                        disabled
                        status={checked === 'third' ? 'checked' : 'unchecked'}
                        onPress={() => { this.setState({ checked: 'third' }); }}
                      />
                      <Text style={styles.free}>Net Banking</Text>
                    </View>
                  </View> */}
                  <View style={{padding:Platform.OS==='ios'?40: 25}}>
                    <FormButton
                      onPress={() => continuepage()}
                      title={"Confirm Order"}
                      background  = {true}
                      // buttonStyle={styles.button1}
                      // containerStyle={styles.buttonContainer1}
                      loading={btnLoading}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </React.Fragment>
      );
    })



