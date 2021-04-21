import React from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,AsyncStorage,
  Alert,ActivityIndicator,
} from 'react-native';
import { Button, Icon,} from "react-native-elements";
import Modal from "react-native-modal";
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import axios from 'axios';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/PaymentMethodStyles.js';
import { colors } from '../../AppDesigns/currentApp/styles/styles.js';
import { RadioButton } from 'react-native-paper';
// import {AppEventsLogger} from 'react-native-fbsdk';    

export default class PaymentMethod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: 'first',
      inputFocusColor: colors.textLight,
      isOpen: false,
      btnLoading: false,
      paymentmod: false,
      paymentmethods: "cod",
    };
  }
  componentDidMount() {
    const cartdata = this.props.navigation.getParam('cartdata', 'No product_ID');
    const userID = this.props.navigation.getParam('userID', 'No userID');
    const adddata = this.props.navigation.getParam('adddata', 'No adddata');
    const totalamountpay = this.props.navigation.getParam('totalamountpay', 'No totalamountpay');
    const shippingtime = this.props.navigation.getParam('shippingtime', 'No shippingtime');
    const discount = this.props.navigation.getParam('discount', 'No discount');
    this.setState({
      cartdata: cartdata,
      user_ID: userID,
      adddata: adddata,
      discount: discount,
      totalamountpay: totalamountpay,
      shippingtime: shippingtime,
    }, () => {
    })
    var type = "PG"
    axios.post('/api/projectsettings/getS3Details/' + type)
        .then(result => {
            //    console.log('projectsettings Response===> ', result.data);
            this.setState({
                environment: result.data.environment,
                namepayg: result.data.namepayg,
                partnerid: result.data.partnerid,
                secretkey: result.data.secretkey,
                status: result.data.status,
            })
        })
        .catch(err => {
            console.log('Errr', err);
        })
        
        AsyncStorage.multiGet(['token', 'user_id'])
        .then((data) => {
          this.setState({ user_id: data[1][1] })
          axios.get('/api/ecommusers/'+data[1][1])
          .then((res) => {
            // console.log("res.data.image==>", res.data.profile);
            var dAddress = res.data.deliveryAddress.length>0 ? res.data.deliveryAddress[0].addressLine1 : null;
            this.setState({
                      fullName: res.data.profile.fullName,
                      email: res.data.profile.email,
                      mobNumber: res.data.profile.mobile,
                    })
            
          })
          .catch((error) => {
            console.log('error', error)
          });
        });
  }
  handleDelete = (id) => {
    Alert.alert("", "Are you sure you want to delete ?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          this.deleteCompetitor(id);
        }
      },
    ]);
  };
  paymentgateway(){
    this.setState({ checked: 'second',paymentmethods:"creditdebitcard" });
    
    // var amount = this.state.totalamountpay;
    // this.props.navigation.navigate("RazorPaygateway", { amount: amount});  
        
  }
  continuepage(id) {
    // this.props.navigation.navigate('PGWebView')
    this.setState({ btnLoading: true })
    var cartItems = this.state.cartdata.map((a, i) => {
      return {
        "product_ID": a.productDetail._id,
        "productName": a.productDetail.productName,
        "discountPercent": a.productDetail.discountPercent,
        "discountedPrice": a.productDetail.discountedPrice,
        "originalPrice": a.productDetail.originalPrice,
        "color": a.productDetail.color,
        "size": a.productDetail.size,
        "currency": a.productDetail.currency,
        "quantity": a.quantity,
        "subTotal": a.subTotal,
        "saving": a.saving,
        "productImage": a.productDetail.productImage,
        "section_ID": a.productDetail.section_ID,
        "section": a.productDetail.section,
        "category_ID": a.productDetail.category_ID,
        "category": a.productDetail.category,
        "subCategory_ID": a.productDetail.subCategory_ID,
        "subCategory": a.productDetail.subCategory,
        "vendor_ID": a.productDetail.vendor_ID,

      }
    })
    var value = this.state.adddata.mobileNumber;
    var mobile = "";
    value = value.replace(/\s/g, '');
    if(value.startsWith("+")){
      var temp = value.substring(3, value.length);
      mobile = temp;
      console.log(mobile);
    }

    var deliveryAddress = {
      "name": this.state.adddata.name,
      "addressLine1": this.state.adddata.addressLine1,
      "addressLine2": this.state.adddata.addressLine2,
      "pincode": this.state.adddata.pincode,
      "city": this.state.adddata.city,
      "state": this.state.adddata.state,
      "mobileNumber": mobile,
      "district": this.state.adddata.district,
      "country": this.state.adddata.country,
      "addType": this.state.adddata.addType,
      "latitude": this.state.adddata.latitude,
      "longitude": this.state.adddata.longitude,
    }
    var orderData = {
      user_ID: this.state.user_ID,
      cartItems: cartItems,
      total: this.state.totalamountpay,
      shippingtime: this.state.shippingtime,
      cartTotal: this.state.cartdata[0].cartTotal,
      discount: this.state.discount,
      cartQuantity: this.state.cartdata[0].cartQuantity,
      deliveryAddress: deliveryAddress,
      paymentMethod:this.state.paymentmethods === 'cod' ? "Cash On Delivery" : "Credit/Debit Card",
    }
    // console.log("orderData==>", deliveryAddress);
    axios.post('/api/orders/post', orderData)
      .then((result) => {
        // console.log("orderData==>", result.data);
        axios.get('/api/orders/get/one/' + result.data.order_ID)
          .then((res) => {
            // if (this.state.paymentmethods === 'cod') {
              // this.setState({paymethods : true})
              this.setState({ btnLoading: false,paymentmod: true })
          // } else {
          //     // this.setState({paymethods : true})
          //     var paymentdetails = {
          //         MERCHANT_ID: this.state.partnerid,
          //         MERCHANT_ACCESS_CODE: this.state.secretkey,
          //         REFERENCE_NO: result.data.order_ID,
          //         AMOUNT: this.state.totalamountpay,
          //         CUSTOMER_MOBILE_NO: mobile,
          //         CUSTOMER_EMAIL_ID: this.state.email,
          //         PRODUCT_CODE: "testing",
          //     }
          //     // console.log('paymentdetails in result==>>>', paymentdetails)
          //     axios.post('/api/orders/pgcall/post', paymentdetails)
          //         .then((payurl) => {
                      
          //             if(payurl.data.result.RESPONSE_MESSAGE  === 'SUCCESS'){
          //               // console.log('sendDataToUser in payurl==>>>', payurl.data.result.PAYMENT_URL)
          //               this.props.navigate('PGWebView', { pinepgurl: payurl.data.result.PAYMENT_URL })
          //             }
          //             this.setState({ btnLoading: false })
          //         })
          //         .catch((error) => {
          //             console.log("return to checkout");
          //             console.log(error);
          //             this.setState({ btnLoading: false })
          //         })
          // }
            console.log("orderdetails=====>", res.data);
            // =================== Notification OTP ==================
            var sendData = {
              "event": "3",
              "toUser_id": this.state.user_ID,
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
        this.setState({ btnLoading: false })
        console.log(error);
      })
  }
  confirmorderbtn = () => {
    this.setState({ paymentmod: false });
    // AppEventsLogger.logEvent('Purchase');
    this.props.navigation.navigate('Dashboard')
  }

  render() {
    const { checked } = this.state;
    const { navigate, goBack } = this.props.navigation;
      return (
        <React.Fragment>
          <HeaderBar5
            goBack={goBack}
            navigate={navigate}
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
                        onPress={() => { this.setState({ checked: 'first' }); }}
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
                        onPress={() => this.paymentgateway()}
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
                  {this.state.btnLoading?
                      <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                      <ActivityIndicator size="large" color={colors.theme} />
                      </View>
                  :
                      <Button
                        onPress={() => this.continuepage()}
                        title={"CONFIRM ORDER"}
                        buttonStyle={styles.button1}
                        containerStyle={styles.buttonContainer1}
                      />
                  }
                  </View>
                </View>
              </View>
              <Modal isVisible={this.state.paymentmod}
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
              </Modal>
            </ScrollView>
            <Footer />
          </View>
        </React.Fragment>
      );
    }
}



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
//     this.props.navigation.navigate("paymentGatewayWebView", { amount: amount, plan_id: this.state.subscription._id });
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









