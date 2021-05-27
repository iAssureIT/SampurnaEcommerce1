import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  Alert,ActivityIndicator,
} from 'react-native';
import { Button, Icon,}       from "react-native-elements";
import Modal                  from "react-native-modal";
import {HeaderBar3}           from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}               from '../../ScreenComponents/Footer/Footer1.js';
import axios                  from 'axios';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/PaymentMethodStyles.js';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import { RadioButton }        from 'react-native-paper';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import {withCustomerToaster}  from '../../redux/AppState.js';
import { connect,
  useDispatch,
  useSelector }               from 'react-redux';
// import {AppEventsLogger} from 'react-native-fbsdk';    

export const PaymentMethod = withCustomerToaster((props)=>{
  console.log(" PaymentMethod props",props)
  const {navigation,route,setToast}=props;
  
  const [checked,setChecked]                = useState('first');
  const [btnLoading,setBtnLoading]          = useState(false);
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
  console.log("cartdata",cartdata);
  console.log("route",route);
  const userDetails = useSelector(store => store.userDetails)
  console.log("userDetails",userDetails);
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
    setPaymentMethods("creditdebitcard");
  }

  const continuepage=(id)=>{
    // setToast({text: 'Your order is confirmed. Thank you for shopping with us.', color: 'green'});
    // navigation.navigate('Dashboard');
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
      user_ID                     : userID,
      userFullName                : userDetails.fullName,
      userEmail                   : userDetails.email,
      cartItems                   : cartItems,
      afterDiscountTotal          : totalamountpay,
      beforeDiscountTotal         : cartdata[0].cartTotal,
      discountAmount              : discount,
      order_quantityOfProducts    : cartdata[0].cartQuantity,
      deliveryAddress             : deliveryAddress,
      paymentMethod               : paymentmethods === 'cod' ? "Cash On Delivery" : "Credit/Debit Card",
      netPayableAmount            : cartdata[0].total,
      taxAmount                   : 0
      // shippingtime    : shippingtime,
    }

    console.log("orderData==>", orderData);
    // axios.post('/api/orders/post', orderData)
    //   .then((result) => {
    //     console.log("orderData==>", result.data);
    //     axios.get('/api/orders/get/one/' + result.data.order_ID)
    //       .then((res) => {
    //         console.log("res",res);
    //         if (paymentmethods === 'cod') {
    //           navigation.navigate('Dashboard');
    //           // setPaymentMethods("cod");
    //           setBtnLoading(false);
    //           setPaymentMode(true);
    //           setToast({text: 'Your order is confirmed.Thank you for shopping with us.', color: 'green'});
    //       } else {
    //           //  navigation.navigate('PGWebView', { pinepgurl: payurl.data.result.PAYMENT_URL })
    //           setToast({text: 'Your order is confirmed.Thank you for shopping with us.', color: 'green'});
    //            navigation.navigate('Dashboard');
    //           // var paymentdetails = {
    //           //     MERCHANT_ID           : partnerid,
    //           //     MERCHANT_ACCESS_CODE  : secretkey,
    //           //     REFERENCE_NO          : result.data.order_ID,
    //           //     AMOUNT                : totalamountpay,
    //           //     CUSTOMER_MOBILE_NO    : mobile,
    //           //     CUSTOMER_EMAIL_ID     : email,
    //           //     PRODUCT_CODE          : "testing",
    //           // }
    //           // // console.log('paymentdetails in result==>>>', paymentdetails)
    //           // axios.post('/api/orders/pgcall/post', paymentdetails)
    //           //     .then((payurl) => {
    //           //         if(payurl.data.result.RESPONSE_MESSAGE  === 'SUCCESS'){
    //           //           // console.log('sendDataToUser in payurl==>>>', payurl.data.result.PAYMENT_URL)
    //           //           setToast({text: 'Your order is confirmed.Thank you for shopping with us.', color: 'green'});
    //           //         }
    //           //         setBtnLoading(false);
    //           //     })
    //           //     .catch((error) => {
    //           //         console.log("return to checkout");
    //           //         console.log(error);
    //           //         setBtnLoading(false);
    //           //     })
    //       }
    //         console.log("orderdetails=====>", res.data);
    //         // =================== Notification OTP ==================
    //         var sendData = {
    //           "event": "3",
    //           "toUser_id": user_ID,
    //           "toUserRole": "user",
    //           "variables": {
    //             "Username": res.data.userFullName,
    //             "amount": res.data.total,
    //             "orderid": res.data.orderID,
    //             "shippingtime": res.data.shippingtime,
    //           }
    //         }
    //         console.log('sendDataToUser==>', sendData)
    //         axios.post('/api/masternotifications/post/sendNotification', sendData)
    //           .then((res) => {
    //             // console.log('sendDataToUser in result==>>>', res.data)
    //           })
    //           .catch((error) => { console.log('notification error: ', error) })
    //         // =================== Notification ==================
    //       })
    //   })
    //   .catch((error) => {
    //     console.log("error",error);
    //     setBtnLoading(false);
    //     console.log(error);
    //   })
  }

      return (
        <React.Fragment>
          <HeaderBar3
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
                    <Button
                      onPress={() => continuepage()}
                      title={"CONFIRM ORDER"}
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer1}
                      loading={btnLoading}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
            <Footer />
          </View>
        </React.Fragment>
      );
    })



