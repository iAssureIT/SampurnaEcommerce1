import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,ActivityIndicator,
} from 'react-native';
import { Dropdown }             from 'react-native-material-dropdown-v2';
import { Button, Icon,Input }   from "react-native-elements";
import Modal                    from "react-native-modal";
import axios                    from "axios";
import {HeaderBar3}             from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                 from '../../ScreenComponents/Footer/Footer1.js';
import Notification             from '../../ScreenComponents/Notification/Notification.js'
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/OrderSummaryStyles.js';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import {withCustomerToaster}    from '../../redux/AppState.js';
import { connect,
  useDispatch,
  useSelector }                 from 'react-redux';
  import commonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
  import {FormButton}           from '../../ScreenComponents/FormButton/FormButton';
import { SafeAreaView }         from 'react-native';
// import {AppEventsLogger} from 'react-native-fbsdk';    

  export const OrderSummary = withCustomerToaster((props)=>{
    const {navigation,route,setToast}=props;
    console.log("props",props);
    const [shippingTiming,setShippingTiming]=useState("");
    const [startRange,setStartRange]=useState(0);
    const [limitRange,setLimitRange]=useState(10);
    const [addDataAddType,setAddDataAddType]=useState("");
    const [addDataName,setAddDataName]=useState("");
    const [addDataAddressLine1,setAddDataAddressLine1]=useState("");
    const [addDataAddressLine2,setAddDataAddressLine2]=useState("");
    const [addDataCity,setAddDataCity]=useState("");
    const [addDataCountry,setAddDataCountry]=useState("");
    const [addDataPincode,setAddDataPincode]=useState("");
    const [addDataMobileNumber,setAddDataMobileNumber]=useState("");
    const [addDataState,setAddDataState]=useState("");
    const [getTimes,setGetTimes]=useState([]);
    const [discountdata,setDiscountData] = useState('');
    const [discounttype,setDiscountType] = useState('');
    const [discountin,setDiscountIn] = useState('');
    const [discountvalue,setDiscountValue] = useState('');
    const [amountofgrandtotal,setAmountofgrandtotal] = useState('');
    const {product_ID,user_id,addData}=route.params;
    const [loading,setLoading] = useState(true);
    const [cartData, setCartData] = useState('');
    const [subtotalitems,setSubTotalItems] = useState('');
    const [subtotal,setSubTotal] = useState('');
    const [couponCode,setCouponCode] = useState('');
    const [coupenPrice,setCoupenPrice] = useState(0);
    const [totalPrice,setTotalPrice] =useState(0);
    // const [currency,setCurrency] = useState('');
    const [totaloriginalprice, setOrignalPrice] = useState(0);
    const [saving,setTotalSaving] =useState(0);
    useEffect(() => {
      getData();
  }, [props]);


  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
  }));
  console.log("store",store);
  const {currency}=store.preferences;

  const getData=()=>{
    setAddDataAddType(addData.addType);
    setAddDataName(addData.name);
    setAddDataAddressLine1(addData.addressLine1);
    setAddDataAddressLine2(addData.addressLine2);
    setAddDataCity(addData.city);
    setAddDataCountry(addData.country);
    setAddDataPincode(addData.pincode);
    setAddDataMobileNumber(addData.mobileNumber);
    setAddDataState(addData.state);
    
    getCartData(user_id);
    getTimes_func(startRange, limitRange);
  }

  const handleTypeChange = (value) => {
    console.log('getTimes ===> ', value);
    setShippingTiming(value);
  }

  const getTimes_func=(startRange, limitRange)=>{
    axios.get('/api/time/get/list-with-limits/' + startRange + '/' + limitRange)
      .then((response) => {
        var array = response.data.map((a, i) => { return { label: a.fromtime + " - " + a.totime, value: a.fromtime + "-" + a.totime } })
        setGetTimes(array);
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
  }

    const getCartData=(userId)=>{
      axios.get('/api/carts/get/cartproductlist/' + userId)
        .then((response) => {
          console.log("response getCartData",response);
          setCartData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("error",error);
          setLoading(false);
          if (error.response.status == 401) {
            AsyncStorage.removeItem('user_id');
            AsyncStorage.removeItem('token');
            setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
            navigation.navigate('Auth')
          }else{
            setToast({text: 'Something went wrong.', color: 'red'});
          }  
        })
    }

  const gettotalcount=(resdata)=>{
    let UserArray = [];
    for (let i = 0; i < resdata.length; i++) {
      var totalprice = resdata[i].subTotal;
      UserArray.push(totalprice);
    }
    let totalAmount = UserArray.reduce(function (prev, current) {
      return prev + +current
    }, 0);
    setOrignalPrice(totalAmount);
  }

  const applyCoupen=()=>{
    if(coupenPrice === 0){
      var payload={
          "user_ID"     : user_id,
          "couponCode"  : couponCode
      }
      axios.patch('/api/carts/put/coupon',payload)
      .then(res=>{
        console.log("applyCoupen res",res);
          setToast({text: res.data.message, color:res.data.message === "Coupon Applied Successfully!" ? 'green':colors.warning});
          setCartData(res.data.data);
          setCouponCode('');
      })
      .catch(err=>{
        setCouponCode('');
        console.log("err",err);
      })
    }else{
      setCouponCode('');
      setToast({text: "Coupen already applied", color:colors.warning});
    }  
  }
  
 
  const paymentMethodsPage=()=>{
    navigation.navigate('PaymentMethod', { cartdata: cartData, addData: addData, userID: user_id, shippingtime: shippingTiming})
  }

  console.log("couponCode",couponCode);
    return (
      <React.Fragment>
        <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'Order Summary'}
          navigate={navigation.navigate}
        />
        <View style={styles.addsuperparent}>
          <ScrollView contentContainerStyle={styles.container} style={{marginBottom:"15%"}} keyboardShouldPersistTaps="handled" >
            <View style={styles.padhr15}>
              <View style={styles.addcmporder}>
                <View style={styles.orderaddchkbx}>
                  <Text style={styles.addname}>{addDataName}</Text>
                  <Text style={styles.addoffice}>{addDataAddType}</Text>
                </View>
                <View style={{}}>
                  <Text style={styles.address}>{addDataAddressLine1+", "+addDataAddressLine2}</Text>
                  <View style={styles.mobflx}>
                    <Text style={styles.mobileno}>Mobile:</Text>
                    <Text style={styles.mobilenum}>{addDataMobileNumber}</Text>
                  </View>
                  <View style={styles.confirmbtn}>
                    <TouchableOpacity >
                      <Button
                        onPress={() => navigation.navigate('AddressDefaultComp', {user_id,"delivery":true})}
                        title={"Change or Add Address"}
                        buttonStyle={styles.button1}
                        containerStyle={styles.buttonContainer1}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.confirmbtn, styles.marginBottom20]}>
                  <View style={[styles.inputWrapper]}>
                    <View style={styles.inputTextWrapper}>
                      <Dropdown
                      underlineColorAndroid ='transparent'
                        placeholder         = {"-- Select Time --"}
                        onChangeText        = {(value) => handleTypeChange(value)}
                        data                = {getTimes}
                        value               = {shippingTiming}
                        containerStyle      = {styles.ddContainer}
                        dropdownOffset      = {{ top: 0, left: 0 }}
                        itemTextStyle       = {styles.ddItemText}
                        inputContainerStyle = {styles.ddInputContainer}
                        labelHeight         = {10}
                        tintColor           = {'#FF8800'}
                        labelFontSize       = {15}
                        fontSize            = {15}
                        baseColor           = {'#666'}
                        textColor           = {'#333'}
                        labelTextStyle      = {{ left: 5 }}
                        style               = {styles.ddStyle}
                        disabledLineType    = 'none'
                      />
                    </View>
                  </View>
                  <Text style={styles.tomorroworder}>Your order will be delivered to you by 4pm to 9pm.</Text>
                </View>
              </View>
              <View style={styles.formWrapper}>
                <Text style={[styles.totaldata,{paddingVertical:2}]}>You're Buying</Text>
                <View style={styles.cartdetails}>
                {
                cartData  && cartData.vendorOrders && cartData.vendorOrders.length>0?
                  cartData.vendorOrders.map((vendor, i) => {
                    console.log("vendor",vendor);
                    return (
                      <View style={{backgroundColor:"#fff",marginBottom:15}}>
                        <View style={{ flex: 0.6,flexDirection:"row",padding:10 }}>
                          <Text numberOfLines={1} style={styles.totaldata}>{vendor.vendor_id.companyName}</Text>
                      </View> 
                      {vendor.cartItems && vendor.cartItems.length>0 && vendor.cartItems.map((item,index)=>{
                        return(
                          <View key={index}>
                            <View key={index} style={styles.proddetails}>
                              <View style={styles.flxdir}>
                                <View style={styles.flxpd}>
                                  <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item.product_ID })}>
                                    {item.product_ID.productImage.length > 0 ?
                                      <Image
                                        style={styles.imgwdht}
                                        source={{ uri: item.product_ID.productImage[0] }}
                                      />
                                      :
                                      <Image
                                        style={styles.imgwdht}
                                        source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                                      />
                                    }
                                  </TouchableOpacity>
                                </View>
                                <View style={styles.flxmg}>
                                  <TouchableOpacity onPress={() => navigation.navigate('', { productID: item.product_ID })}>
                                    {item.product_ID.productNameRlang ?
                                    <Text style={{fontFamily:'aps_dev_priyanka',fontWeight:'Bold',fontSize:20,flexWrap:'wrap'}}>{item.product_ID.productNameRlang}</Text>
                                    : 
                                    <Text style={styles.productname}>{item.product_ID.productName}</Text>
                                    }
                                    </TouchableOpacity>
                                  <View style={[styles.flx1, styles.prdet,{marginVertical:10}]}>
                                    {item.product_ID.availableQuantity > 0 ?
                                      <View style={[styles.flxdir]}>
                                        <View style={[styles.flxdir]}>
                                          <Text style={styles.ogprice}>{currency} </Text>
                                          {item.product_ID.discountPercent > 0 &&<Text style={styles.discountpricecut}>{(item.product_ID.originalPrice * item.quantity).toFixed(2)}</Text>}
                                        </View>
                                        <View style={[styles.flxdir,{alignItems:"center"}]}>
                                            <Text style={styles.ogprice}> {(item.product_ID.discountedPrice * item.quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                            </Text>
                                        </View>
                                        {item.product_ID.discountPercent > 0 &&<View style={[styles.flxdir,{alignItems:"center"}]}>
                                            <Text style={styles.ogprice}>( {item.product_ID.discountPercent} % OFF) <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                            </Text>
                                        </View>}
                                      </View>
                                      :
                                      <Text style={styles.totaldata}>SOLD OUT</Text>
                                    }
                                  </View>
                              </View>
                            </View>
                          </View>
                        </View>
                        )
                      })}
                        <View style={styles.totaldetails}>
                            <View style={styles.flxdata}>
                              <View style={{ flex: 0.6,flexDirection:"row" }}>
                                {/* <Text numberOfLines={1} style={styles.totaldata}>{vendor.vendor_id.companyName}</Text> */}
                                <Text style={styles.totaldata}>Total</Text>
                              </View>
                              <View style={{ flex: 0.4 }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                  <Text style={styles.totalpriceincart}>{currency} {vendor.vendor_afterDiscountTotal && vendor.vendor_afterDiscountTotal.toFixed(2)}</Text>
                                </View>
                              </View>
                            </View>
                            <View style={styles.flxdata}>
                              <View style={{ flex: 0.6 }}>
                                <Text style={styles.totaldata}>You Saved </Text>
                              </View> 
                              <View style={{ flex: 0.4 }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                  <Text style={styles.totalpriceincart}> - </Text>
                              <Text style={styles.totalpriceincart}>{currency} {vendor.vendor_discountAmount > 1 ? vendor.vendor_discountAmount.toFixed(2) : 0.00}</Text>
                              {
                                discountin === "Percent" ? 
                                    <Icon
                                      name="percent"
                                      type="font-awesome"
                                      size={15}
                                      color="#666"
                                      iconStyle={styles.iconstyle}
                                    /> 
                                  : null
                                } 
                                </View>
                              </View>
                            </View>
                            <View style={styles.flxdata}>
                              <View style={{ flex: 0.6 }}>
                                <Text style={styles.totaldata}>Delivery Charges </Text>
                              </View> 
                              <View style={{ flex: 0.4 }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                              <Text style={styles.totalpriceincart}>{currency} {vendor.vendor_shippingCharges}</Text>
                                </View>
                              </View>
                            </View>
                            {/* <View style={styles.flxdata}>
                              <View style={{ flex: 0.5 }}>
                                <Text style={styles.totaldata}>Sub Total {alphabet[i]}</Text>
                              </View>
                              <View style={{ flex: 0.5 }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                  <Text style={styles.totalpriceincart}>{currency} {vendor.total}</Text>
                                </View>
                              </View>
                            </View> */}
                            <View style={{ flex: 1, marginTop: 10 }}>
                              <Text style={styles.totalsubtxt}>Part of your order qualifies for Free Delivery </Text>
                            </View>
                          </View>
                    </View>
                    )
                  })
                  :
                  <Text>Not found</Text>
                  }
                  {
                   cartData && cartData.paymentDetails ?
                  <View style={styles.totaldetails}>
                    <View style={styles.flxdata}>
                        <View style={{ flex: 0.6 }}>
                          <Text style={styles.totaldata}>Final Total Amount </Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.totalpriceincart}>{currency} {cartData.paymentDetails.afterDiscountTotal && cartData.paymentDetails.afterDiscountTotal.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.6 }}>
                          <Text style={styles.totaldata}>Total Savings </Text>
                        </View> 
                        <View style={{ flex: 0.4 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.totalpriceincart}> - </Text>
                            <Text style={styles.totalpriceincart}>{currency} {cartData.paymentDetails.discountAmount && cartData.paymentDetails.discountAmount.toFixed(2)}</Text>
                          {
                            discountin === "Percent" ? 
                                <Icon
                                  name="percent"
                                  type="font-awesome"
                                  size={15}
                                  color="#666"
                                  iconStyle={styles.iconstyle}
                                /> 
                              : null
                            } 
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.6 }}>
                          <Text style={styles.totaldata}>Total Tax  </Text>
                        </View> 
                        <View style={{ flex: 0.4 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <Text style={styles.totalpriceincart}>{currency} {cartData.paymentDetails.taxAmount && cartData.paymentDetails.taxAmount.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                    {cartData.paymentDetails.afterDiscountCouponAmount === 0 ?
                      <View style={{flex:1,flexDirection:"row",marginTop:15,height:50}}>
                        <View style={{flex:.7}}>
                          <Input
                            placeholder           = "Enter promotional code"
                            onChangeText          = {(text)=>setCouponCode(text)}
                            autoCapitalize        = "none"
                            keyboardType          = "email-address"
                            inputContainerStyle   = {styles.containerStyle}
                            containerStyle        = {{paddingHorizontal:0}}
                            placeholderTextColor  = {'#bbb'}
                            inputStyle            = {{fontSize: 16}}
                            inputStyle            = {{textAlignVertical: "top"}}
                            autoCapitalize        = 'characters'
                            value                 = {couponCode}
                          />
                        </View>  
                        <View style={{flex:.3}}>
                          <FormButton 
                            onPress    = {()=>applyCoupen()}
                            title       = {'Apply'}
                            background  = {true}
                          /> 
                        </View>  
                      </View>
                      :
                      <SafeAreaView>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.6 }}>
                          <Text style={styles.totaldata}>Discount Coupon Amount  </Text>
                        </View> 
                        <View style={{ flex: 0.4 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                             <Text style={styles.totalpriceincart}>{currency} {cartData.paymentDetails.afterDiscountCouponAmount.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={[styles.totaldata,{color:"red",alignSelf:"flex-end",paddingBottom:5}]} onPress={()=>getCartData(user_id)}>Remove Coupon</Text>
                      </SafeAreaView>
                    }
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.totaldata}>Total Delivery Charges </Text>
                      </View> 
                      <View style={{ flex: 0.4 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincart}>{currency} {cartData.paymentDetails.shippingCharges}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{borderWidth:0.5,marginVertical:5,borderColor:"#ddd"}} />
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.6 }}>
                          <Text style={styles.totaldata}>Grand Total</Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.totalpriceincart}>{currency} {cartData.paymentDetails.netPayableAmount && cartData.paymentDetails.netPayableAmount.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.margTp20}>
                      <TouchableOpacity >
                        <Button
                          onPress={() => paymentMethodsPage()}
                          title={"PROCEED TO BUY"}
                          buttonStyle={styles.button1}
                          containerStyle={styles.buttonContainer1}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginBottom: 30 }}>
                      <Text style={styles.securetxt}>Safe & Secure Payments | 100% Authentic Products</Text>
                    </View>
                      {/* <View style={{ flex: 1, marginTop: 10,justifyContent:"center" }}>
                        <Text style={styles.totalsubtxt}>Part of your order qualifies for Free Delivery </Text>
                      </View> */}
                    <View>
                  </View>
                </View>
                :
                null
              }
            </View>
            </View>
          </View>
        </ScrollView>
        <Footer />
      </View>
    </React.Fragment>
  );
})
