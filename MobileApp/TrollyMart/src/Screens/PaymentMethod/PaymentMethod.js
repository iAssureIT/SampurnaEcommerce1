import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  Alert,ActivityIndicator,
} from 'react-native';
import { Button, Icon,} from "react-native-elements";
import Modal from "react-native-modal";
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import {Footer} from '../../ScreenComponents/Footer/Footer1.js';
import axios from 'axios';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/PaymentMethodStyles.js';
import { colors } from '../../AppDesigns/currentApp/styles/styles.js';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {withCustomerToaster}  from '../../redux/AppState.js';
// import {AppEventsLogger} from 'react-native-fbsdk';    

export const PaymentMethod = withCustomerToaster((props)=>{
  console.log(" PaymentMethod props",props)
  const {navigation,route}=props;
  
  const [checked,setChecked]                = useState('first');
  const [btnLoading,setBtnLoading]          = useState(false);
  const [paymentmod,setPaymentMode]         = useState(false);
  const [paymentmethods,setPaymentMethods]  = useState("cod");
  // const [environment,setEnvironment]        = useState(false);
  const [namepayg,setNamePayg]              = useState('');
  const [partnerid,setPartnerId]            = useState('');
  const [secretkey,setSecretKey]            = useState('');
  const [status,setStatus]                  = useState('');
  const [email,setEmail]                    = useState('');
  const [fullName,setFullName]              = useState('');
  const [mobNumber,setMobileNumber]         = useState('');

  const {cartdata,userID,addData,totalamountpay,shippingtime,discount} = route.params;
  console.log("navigation",navigation);
  console.log("route",route);

  useEffect(() => {
    getData();
  }, []);

  const getData=()=>{
    var type = "PG"
    axios.post('/api/projectsettings/getS3Details/' + type)
    .then(result => {
      console.log("getData result",result);
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
        console.log('error', error)
      });
    });
  }


  const paymentgateway=()=>{
    setChecked('second');
    setPaymentMethods("creditdebitcard");
  }

  const continuepage=(id)=>{
    setBtnLoading(true);
    var cartItems = cartdata.map((a, i) => {
      return {
        "product_ID"      : a.productDetail._id,
        "productName"     : a.productDetail.productName,
        "discountPercent" : a.productDetail.discountPercent,
        "discountedPrice" : a.productDetail.discountedPrice,
        "originalPrice"   : a.productDetail.originalPrice,
        "color"           : a.productDetail.color,
        "size"            : a.productDetail.size,
        "currency"        : a.productDetail.currency,
        "quantity"        : a.quantity,
        "subTotal"        : a.subTotal,
        "saving"          : a.saving,
        "productImage"    : a.productDetail.productImage,
        "section_ID"      : a.productDetail.section_ID,
        "section"         : a.productDetail.section,
        "category_ID"     : a.productDetail.category_ID,
        "category"        : a.productDetail.category,
        "subCategory_ID"  : a.productDetail.subCategory_ID,
        "subCategory"     : a.productDetail.subCategory,
        "vendor_ID"       : a.productDetail.vendor_ID,
      }
    })
    var value = addData.mobileNumber;
    var mobile = "";
    value = value.replace(/\s/g, '');
    if(value.startsWith("+")){
      var temp = value.substring(3, value.length);
      mobile = temp;
      console.log(mobile);
    }

    var deliveryAddress = {
      "name"          : addData.name,
      "addressLine1"  : addData.addressLine1,
      "addressLine2"  : addData.addressLine2,
      "pincode"       : addData.pincode,
      "city"          : addData.city,
      "state"         : addData.state,
      "mobileNumber"  : mobile,
      "district"      : addData.district,
      "country"       : addData.country,
      "addType"       : addData.addType,
      "latitude"      : addData.latitude,
      "longitude"     : addData.longitude,
    }

    var orderData = {
      user_ID         : userID,
      cartItems       : cartItems,
      total           : totalamountpay,
      shippingtime    : shippingtime,
      cartTotal       : cartdata[0].cartTotal,
      discount        : discount,
      cartQuantity    : cartdata[0].cartQuantity,
      deliveryAddress : deliveryAddress,
      paymentMethod   : paymentmethods === 'cod' ? "Cash On Delivery" : "Credit/Debit Card",
    }

    console.log("orderData==>", orderData);
    axios.post('/api/orders/post', orderData)
      .then((result) => {
        console.log("orderData==>", result.data);
        axios.get('/api/orders/get/one/' + result.data.order_ID)
          .then((res) => {
            if (paymentmethods === 'cod') {
              navigation.navigate('Dashboard')
              setPaymentMethods("Cash On Delivery");
              setBtnLoading(false);
              setPaymentMode(true);
          } else {
              var paymentdetails = {
                  MERCHANT_ID           : partnerid,
                  MERCHANT_ACCESS_CODE  : secretkey,
                  REFERENCE_NO          : result.data.order_ID,
                  AMOUNT                : totalamountpay,
                  CUSTOMER_MOBILE_NO    : mobile,
                  CUSTOMER_EMAIL_ID     : email,
                  PRODUCT_CODE          : "testing",
              }
              // console.log('paymentdetails in result==>>>', paymentdetails)
              axios.post('/api/orders/pgcall/post', paymentdetails)
                  .then((payurl) => {
                      if(payurl.data.result.RESPONSE_MESSAGE  === 'SUCCESS'){
                        // console.log('sendDataToUser in payurl==>>>', payurl.data.result.PAYMENT_URL)
                        navigation.navigate('PGWebView', { pinepgurl: payurl.data.result.PAYMENT_URL })
                      }
                      setBtnLoading(false);
                  })
                  .catch((error) => {
                      console.log("return to checkout");
                      console.log(error);
                      setBtnLoading(false);
                  })
          }
            console.log("orderdetails=====>", res.data);
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
      .catch((error) => {
        setBtnLoading(false);
        console.log(error);
      })
  }

  const confirmorderbtn = () => {
    setPaymentMode(false);
    // AppEventsLogger.logEvent('Purchase');
    navigation.navigate('Dashboard')
  }

      return (
        <React.Fragment>
          <HeaderBar5
            goBack={navigation.goBack}
            navigate={navigation.navigate}
            headerTitle={"Payment Methods"}
          />
          <View style={styles.superparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <View style={styles.parent}>
                  <View style={styles.vwwishlist}>
                    <Image
                      style={styles.imgwdht}
                      source={require("../../AppDesigns/currentApp/images/paymentmethod.png")}
                    />
                  </View>
                 <View style={styles.orderbrdr}>
                    <View style={styles.flx3}>
                      <RadioButton
                        style={styles.radiobtn}
                        value="first"
                        status={checked === 'first' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('first')}
                      />
                      <Text style={styles.free}>Cash on Delivary</Text>
                    </View>
                  </View>
                  <View style={styles.orderbrdr}>
                    <View style={styles.flx3}>
                      <RadioButton
                        value="second"
                        // disabled
                        status={checked === 'second' ? 'checked' : 'unchecked'}
                        onPress={() => paymentgateway()}
                      />
                      <Text style={styles.free}>Credit/Debit Card</Text>
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
                  <View style={styles.margTp20}>
                  {btnLoading?
                      <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                      <ActivityIndicator size="large" color={colors.theme} />
                      </View>
                  :
                      <Button
                        onPress={() => continuepage()}
                        title={"CONFIRM ORDER"}
                        buttonStyle={styles.button1}
                        containerStyle={styles.buttonContainer1}
                      />
                  }
                  </View>
                </View>
              </View>
              {/* <Modal isVisible={paymentmod}
                onBackdropPress={() => this.setState({ paymentmod: false })}
                coverScreen={true}
                hideModalContentWhileAnimating={true}
                style={{ zIndex: 999 }}
                animationOutTiming={500}>
                <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:colors.theme }}>
                  <View style={{ justifyContent: 'center', }}>
                    <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
                  </View>
                  <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20, }}>
                    Your order is confirmed.Thank you for shopping with us.
                </Text>
                  <View style={styles.yesmodalbtn}>
                    <Button
                      onPress={() => this.confirmorderbtn()}
                      titleStyle={styles.buttonText1}
                      title="OK"
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer1}
                    />
                  </View>
                </View>
              </Modal> */}
            </ScrollView>
            <Footer />
          </View>
        </React.Fragment>
      );
    })



// import React, { Component } from "react";
// import {View,ImageBackground,Text,TouchableHighlight, Alert,} from "react-native";
// import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/PaymentMethodStyles.js';
// import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
// // import RazorpayCheckout from 'react-native-razorpay';
// // import axios from "../../config/axios.js";
// import { colors } from '../../AppDesigns/currentApp/styles/styles.js';
// export default  class PaymentMethods extends Component {

//   constructor(props){
//     super(props);
//     this.state = {
//       showPaymentSuccess: true,
//       openModal         : false,
//       subscription      : '',
//       user_id           : ''
//     };
//   }
//   componentDidMount(){
   
//   }
//   componentWillUnmount() {
    
//   }
//   paywithquikwallet(){
//     var amount = this.props.navigation.getParam('amount', '')
//     this.props.navigation.navigate("paymentGatewayWebView", { amount: amount, plan_id: subscription._id });
//   }
//   paywithrazorpay(){  
//     var amount = this.props.navigation.getParam('amount', '')
//     var plan_id = this.props.navigation.getParam('plan_id', '')
//     this.props.navigation.navigate("RazorPaygateway", { amount: amount, plan_id: plan_id });  
    
//   }
//   render(){
//     const { navigate, goBack } = this.props.navigation;
//     return(
//       <React.Fragment>
//           <HeaderBar5
//             goBack={goBack}
//             navigate={navigate}
//             headerTitle={"Payment Methods"}
//           />
//             {/* <ImageBackground
//               // source={require('../../images/monthly-inner.jpg')}
//               resizeMode='cover'
//               style={styles.bgContainer}> */}
//                 <View style={styles.detailsBlock}>
//                     <View style={styles.detailsTextWrap}>
//                         <Text style={styles.paymethodtitle}>Payment Methods</Text>
//                         <View style={{ flexDirection: 'row' }}>
//                             <View style={{ flex: 1,marginBottom:50 }}>
//                                 <TouchableHighlight onPress={() => this.paywithrazorpay()}>
//                                      <ImageBackground
//                                         resizeMode="contain"
//                                         // source={require("../../images/razerpaybackground.png")}
//                                         style={{ width: '100%', height: 100 }}>
//                                             <Text style={styles.paytitle}>Pay using Razorpay </Text>
//                                             <Text style={styles.payacctitle}> **** **** *** 1234 </Text>
//                                     </ImageBackground>
//                                 </TouchableHighlight>
//                             </View>
                            
//                         </View>
                        
//                     </View>
//                     {/* <View style={{ backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, padding: '5%' }}></View> */}
//               </View>
//             {/* </ImageBackground> */}
//       </React.Fragment>
//     );
//   }
// }









