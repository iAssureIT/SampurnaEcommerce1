import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,ActivityIndicator,
  Linking,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Dropdown }             from 'react-native-material-dropdown-v2-fixed';
import { Button, Icon,Input,Tooltip,CheckBox }   from "react-native-elements";
import Modal1                    from "react-native-modal";
import axios                    from "axios";
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/OrderSummaryStyles.js';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import {withCustomerToaster}    from '../../redux/AppState.js';
import { connect,
  useDispatch,
  useSelector }                 from 'react-redux';
  import commonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { SafeAreaView }         from 'react-native';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import HTML from 'react-native-render-html';
import {KeyboardAwareScrollView}  from 'react-native-keyboard-aware-scroll-view';
import { NetWorkError } from '../../../NetWorkError.js';
import FastImage              from 'react-native-fast-image';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Shadow } from 'react-native-neomorph-shadows';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
// import {AppEventsLogger} from 'react-native-fbsdk';    

  export const OrderSummary = withCustomerToaster((props)=>{
    const {navigation,route,setToast}=props;
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
    const [creditPointsUsed,setRedeemPoints] = useState('');
    const [coupenPrice,setCoupenPrice] = useState(0);
    const [totalPrice,setTotalPrice] =useState(0);
    // const [currency,setCurrency] = useState('');
    const [totaloriginalprice, setOrignalPrice] = useState(0);
    const [saving,setTotalSaving] =useState(0);
    const [checked,setChecked] = useState(false);
    const [modal,setModal] = useState(false);
    const [tooltipSize, setTooltipSize] = useState({ w: 500, h: 500 })
    const [pageBlockes,setPageBlocks]       = useState([]);
    const [couponModal,setCouponModal] = useState(false);
    const [tab,selectedTab] = useState(true);
    const [couponConfirmation,setCopuonConfirmation] = useState(false);
    const [creditConfirmation,setCreditConfirmation] = useState(false);
    useEffect(() => {
      getData();
      setChecked(false);
  }, [props]);

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    userDetails : store.userDetails,
  }));
  const {currency}=store.preferences;

  const getData=()=>{
    setAddDataAddType(addData.addType);
    setAddDataName(addData.name);
    setAddDataAddressLine1(addData.addressLine1);
    setAddDataAddressLine2(addData.addressLine2);
    setAddDataCity(addData.city);
    setAddDataCountry(addData.country);
    setAddDataPincode(addData.pincode);
    setAddDataMobileNumber((addData.isdCode ? "+"+addData.isdCode : "")+""+addData.mobileNumber);
    setAddDataState(addData.state);
    getTerms();
    getCartData(user_id);
    getTimes_func(startRange, limitRange);
  }

  const handleTypeChange = (value) => {
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

  const getTerms=()=>{
    axios.get('/api/pages/get/page_block/terms-and-conditions-mobile')
    .then(res=>{
        setPageBlocks(res.data.pageBlocks)
    })
    .catch(error=>{
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

    const getCartData=(userId)=>{
      setCopuonConfirmation(false);
      setCreditConfirmation(false);
      axios.get('/api/carts/get/cartproductlist/' + userId)
        .then((response) => {
          // console.log("response",response.data);
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
        console.log("res",res);
          setToast({text: res.data.message, color:res.data.message === "Coupon Applied Successfully!" ? 'green':colors.warning});
          setCartData(res.data.data);
          setCouponCode('');
          setCouponModal(false);
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

  const redeemPoints=()=>{
    if(parseFloat(creditPointsUsed) === 0){
      setCouponModal(false);
      setRedeemPoints('');
      setToast({text: "Oops! Credit points are invalid", color:colors.warning});
    }else{
      var payload={
          "user_ID"     : user_id,
          "creditPointsValueUsed"  : parseFloat(creditPointsUsed)
      }
      // console.log("payload",payload);
      axios.patch('/api/carts/redeem/creditpoints',payload)
      .then(res=>{
        console.log("res",res);
          setCouponModal(false);
          setToast({text: "Redeem Points Applied Successfully!",color:'green'});
          setCartData(res.data);
          setRedeemPoints('');
          // setCouponCode('');
      })
      .catch(err=>{
        setRedeemPoints('');
        console.log("err",err);
      })
    }  
  }

  const onCheckLimit = (value) => {
    const parsedQty = Number.parseFloat(value);
    if (Number.isNaN(parsedQty)) {
      setRedeemPoints('') //setter for state
    } else if (parsedQty > cartData.totalCreditPointsValue) {
       if(cartData.totalCreditPointsValue > cartData.paymentDetails.afterDiscountTotal){
        setRedeemPoints(cartData.paymentDetails.afterDiscountTotal)
       }else{
         setRedeemPoints(cartData.totalCreditPointsValue)
       }
    } else {
      setRedeemPoints(value)
    }
  }
  
 
  const paymentMethodsPage=()=>{
    navigation.navigate('PaymentMethod', { cartdata: cartData, addData: addData, userID: user_id, shippingtime: shippingTiming})
  }

  const tooltipClone = React.cloneElement(
    <View style={{width:"100%"}}>
      <Icon name="close" type="material-community" color="#fff" iconStyle={{alignSelf:"flex-end"}} size={RFPercentage(2.5)}/>
    { cartData.vendorOrders && cartData.vendorOrders.length > 0&&
    cartData.vendorOrders.map((vendor, i) => {
        return (
          <View style={{paddingVertical:5}}>
              <Text style={[commonStyles.label,{color:"#fff"}]}>{vendor.vendor_id.companyName}</Text>
              <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                <View style={{flex:.7}}><Text style={[commonStyles.text,{color:"#fff"}]}>Service Charges : </Text></View>
                <View style={{flex:.1}}>{
                  vendor.vendor_shippingChargesAfterDiscount !== vendor.vendor_shippingCharges &&
                    <Text style={[commonStyles.text,{color:"#fff",textDecorationLine:'line-through'}]}>{vendor.vendor_shippingCharges}</Text>
                }</View>
                <View style={{flex:.2}}><Text style={[commonStyles.text,{color:"#fff",alignSelf:"flex-end"}]}>{vendor.vendor_shippingChargesAfterDiscount} {currency}</Text></View>
              </View>  
          </View> 
        )
    })  
    }
    <View style={{marginTop:30,flexDirection:'row',justifyContent:'space-between'}}>
      <View style={{flex:.7}}><Text style={[commonStyles.text,{color:"#fff"}]}>Total Service Charges :</Text></View>
      <View style={{flex:.1}}>{
          cartData?.paymentDetails?.shippingChargesBeforeDiscount !== cartData?.paymentDetails?.shippingCharges &&
          <Text style={[commonStyles.text,{color:"#fff",textDecorationLine:'line-through'}]}>{cartData?.paymentDetails?.shippingChargesBeforeDiscount}</Text>
      }
      </View>
      <View style={{flex:.2}}><Text style={[commonStyles.text,{color:"#fff",alignSelf:"flex-end"}]}>{cartData?.paymentDetails?.shippingCharges} {currency}</Text></View>
    </View>  
    </View>,
    { onLayout: (e) => setTooltipSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height }) }
  )


    return (
      <View style={{flex:1,backgroundColor:"#f1f1f1"}}>
      { !loading ?
        <ScrollView contentContainerStyle={{backgroundColor:"#fff",paddingBottom:hp(5)}}keyboardShouldPersistTaps="always" extraScrollHeight={130}  enableAutomaticScroll enableOnAndroid showsVerticalScrollIndicator={false}	>
              <View style={styles.addcmporder}> 
                <View style={{backgroundColor:"#fff",flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{fontSize:RFPercentage(2.4),fontFamily:"Montserrat-Regular",color:"#000"}}>Address</Text>
                    <TouchableOpacity 
                        style={styles.addAddressIcon}
                        // onPress={() => navigation.navigate('AddressDefaultComp', {user_id,"delivery":true})}
                        onPress={()=> navigation.navigate('AddressComponent',{"delivery":true,"address":addData})}
                      >
                        <Image
                            resizeMode="contain"
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/editBlack.png'}}
                            style={{height:hp(2.5),width:hp(2.5)}}
                            />
                        {/* <Icon name="edit" type="font-awesome" size={15}/> */}
                    </TouchableOpacity>
                </View>  
                <View style={{borderWidth:0.5,borderColor:'#707070',marginTop:10,borderRadius:9,borderColor:"#707070",paddingHorizontal:10}}>
                  <View style={styles.orderaddchkbx}>
                    <View style={[styles.blueDot,{justifyContent:'flex-end',marginRight:wp(2)}]}></View>
                    <View style={{flex:0.95}}><Text style={styles.addname}>{addDataName}</Text></View>                    
                  </View>
                  <View style={{paddingHorizontal:wp(3.6)}}>
                    <Text style={[styles.address,{color:"#666"}]}>{addDataAddType} Address:</Text>
                    <Text style={styles.address}>{addDataAddressLine1+", "+addDataAddressLine2}</Text>
                    <View style={styles.mobflx}>
                      <Text style={styles.address}>Mobile:</Text>
                      <Text style={styles.address}>{addDataMobileNumber}</Text>
                    </View>
                  </View>                  
                </View>                 
              </View>
              <View style={{paddingLeft:wp(3)}}>
                {store?.userDetails?.authService !== "guest" ?
                cartData?.paymentDetails?.afterDiscountCouponAmount === 0 && cartData?.paymentDetails?.creditPointsUsed === 0 ? <TouchableOpacity style={{flexDirection:"row",marginTop:10,alignItems:'center'}} onPress={()=>{setCouponModal(true)}}>
                    <Image 
                      source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/coupon.png'}}
                      resizeMode="contain"
                      style={{height:hp(2),width:hp(2)}}
                    />
                    <Text style={{color: "#3E9D5E",fontFamily:"Montserrat-Regular",fontSize:RFPercentage(2.2)}}> Apply Discount</Text>
                </TouchableOpacity>
                : null
                :
                null
                }
                {
                    cartData && cartData.paymentDetails ?
                    <View style={styles.totaldetails}>
                      <View style={styles.flxdata}>                    
                      <View style={{ flex: 0.5 }}>
                        <Text style={styles.totaldata1}>Final Total</Text>
                      </View>
                      <View style={{ flex: 0.15 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.currency1}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.25 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincartTotal}>{cartData.paymentDetails.afterDiscountTotal && cartData.paymentDetails.afterDiscountTotal.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.5 }}>
                        <Text style={styles.totaldata1}>Total Saving </Text>
                      </View>
                      <View style={{ flex: 0.15 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.currency1}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.25 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          {/* <Text style={styles.totalpriceincart}> - </Text> */}
                          <Text style={[styles.totalpriceincartTotalG]}>{cartData.paymentDetails.discountAmount && cartData.paymentDetails.discountAmount > 0 ? cartData.paymentDetails.discountAmount.toFixed(2):"0.00"}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.5 }}>
                        <Text style={styles.totaldata1}>Total VAT  </Text>
                      </View>
                      <View style={{ flex: 0.15 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.currency1}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.25 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincartTotal}>{cartData.paymentDetails.taxAmount.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    {cartData.paymentDetails.afterDiscountCouponAmount > 0 &&<View style={styles.flxdata}>
                      <View style={{ flex: 0.5 }}>
                        <Text style={styles.totaldata1}>Discount Coupon</Text>
                      </View>
                      <View style={{ flex: 0.15 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end'}}>
                            <Text style={[styles.currency1,{opacity: 0.7,color:'#EF9A9A'}]}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.25 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincartTotalR}>{cartData.paymentDetails.afterDiscountCouponAmount.toFixed(2)}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={{flex:0.1,justifyContent:"center",alignItems:"center"}} onPress={()=>setCopuonConfirmation(true)}>
                          <Icon name="trash" type={"font-awesome"} size={RFPercentage(2.5)} iconStyle={{color:'#648295'}} />
                      </TouchableOpacity>  
                    </View>}
                    {cartData.paymentDetails.creditPointsUsed > 0 &&<View style={styles.flxdata}>
                      <View style={{ flex: 0.5 }}>
                        <Text style={styles.totaldata1}>Redeem Value</Text>
                      </View>
                      <View style={{ flex: 0.15 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end'}}>
                            <Text style={[styles.currency1,{opacity: 0.7,color:'#EF9A9A'}]}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.25 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincartTotalR}>{cartData.paymentDetails.creditPointsValueUsed.toFixed(2)}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={{flex:0.1,justifyContent:"center",alignItems:"center"}} onPress={()=>setCreditConfirmation(true)}>
                          <Icon name="trash" type={"font-awesome"} size={RFPercentage(2.5)} iconStyle={{color:'#648295'}} />
                      </TouchableOpacity>  
                    </View>}
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.5 }}>
                        <Text style={styles.totaldata1}>Total Service Charges</Text>
                      </View>
                      <View style={{ flex: 0.15 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end'}}>
                            <Text style={styles.currency1}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.25 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincartTotal}>{cartData.paymentDetails.shippingCharges && cartData.paymentDetails.shippingCharges.toFixed(2)}</Text>
                        </View>
                      </View>
                      <View style={{flex:0.1,justifyContent:"center",alignItems:"center"}} >
                        <Tooltip 
                          containerStyle={{justifyContent:'flex-start',alignItems:'flex-start'}}
                          width={350} 
                          height={tooltipSize.h + 30}
                          backgroundColor={colors.theme}
                          popover={tooltipClone}
                          withOverlay={false}
                          >
                          <Icon name="information-outline" type={"material-community"} size={RFPercentage(2.5)}iconStyle={{color:'#648295',paddingHorizontal:2}} />
                        </Tooltip>
                      </View>  
                    </View>
                    
                  
                    <View style={{marginVertical:wp(1)}} />
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.45 }}>
                          <Text style={[styles.totaldata1G]}>Grand Total</Text>
                        </View>
                        <View style={{ flex: 0.2}}>
                            <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                              <Text style={styles.currency1G}>{currency}</Text>
                            </View>
                          </View>
                        <View style={{ flex: 0.245}}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.totalpriceincartTotalGT}>{cartData.paymentDetails.netPayableAmount && cartData.paymentDetails.netPayableAmount.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                        <View style={styles.margTp10}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                            <CheckBox
                                containerStyle={styles.radiobtn}
                                checkedIcon='dot-circle-o'
                                checkedColor='#033554'                              
                                uncheckedIcon='circle-o'
                                uncheckedColor='#033554'
                                size={RFPercentage(2)}
                                center
                                title=''
                                checked={checked}
                                onPress={() => {setChecked(!checked)}}
                          />
                            <Text style={styles.free}>I agree to <Text style={[CommonStyles.linkText,{fontSize:RFPercentage(2.2),marginTop:-5}]}  onPress={()=>setModal(true)}>terms & conditions</Text><Text style={[commonStyles.errorText,{fontSize:20,}]}>*</Text></Text>
                          </View>
                      </View>
                      <View>
                    </View>
                  </View>
                  :
                  null
                }
                <View style={[styles.confirmbtn, styles.marginBottom20,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                  <Text style={{flex:0.5,marginLeft:hp(0.5),fontFamily:"Montserrat-Medium",color:"#000000",opacity: 1,fontSize:RFPercentage(2.1)}}>Select Delivery Time<Text style={[commonStyles.errorText,{fontSize:20,}]}>*</Text></Text>
                  <View style={[styles.inputWrapper]}>
                    <View style={styles.inputTextWrapper}>
                      <Dropdown
                        underlineColorAndroid ='transparent'
                        placeholder         = {"Select Time"}
                        onChangeText        = {(value) => handleTypeChange(value)}
                        data                = {getTimes}
                        value               = {shippingTiming}
                        containerStyle      = {styles.ddContainer}
                        dropdownOffset      = {{ top: hp(9.5), left: 20 }}
                        itemTextStyle       = {styles.ddItemText}
                        inputContainerStyle = {styles.ddInputContainer}
                        labelHeight         = {RFPercentage(1.5)}
                        tintColor           = {'#FF8800'}
                        labelFontSize       = {RFPercentage(1.5)}
                        fontSize            = {RFPercentage(1.5)}
                        baseColor           = {'#666'}
                        textColor           = {'#333'}
                        labelTextStyle      = {{ left: 5 }}
                        style               = {styles.ddStyle}
                        pickerStyle         = {{width:wp(42)}}
                        disabledLineType    = 'none'
                        underlineColor      ='transparent'
                      />
                    </View>
                  </View>
                  {/* <Text style={styles.tomorroworder}>Your order will be delivered to you by in 60 Minutes.</Text> */}
                </View>
              </View>
              <View style={styles.formWrapper}>
                <View style={styles.cartdetails}>
                {
                cartData  && cartData.vendorOrders && cartData.vendorOrders.length>0?
                  cartData.vendorOrders.map((vendor, i) => {
                    return (
                      <View style={{backgroundColor:"#fff",marginBottom:15}}>
                         <View style={{paddingHorizontal:8}}>
                          <Text style={[commonStyles.headerText,{alignSelf:"flex-start",fontSize:RFPercentage(2.4),marginBottom:10,fontFamily:'Montserrat-Bold'}]}>{vendor.vendor_id.companyName}</Text>
                        </View>
                        <View style={styles.proddetails1}>
                            {vendor.cartItems && vendor.cartItems.length>0 && vendor.cartItems.map((item,index)=>{
                            return(
                              <View key={index}>
                                <View key={index} style={styles.proddetails}>
                                  <View style={[styles.flxdir,{alignItems:'center'}]}>
                                    <View style={[styles.flxpd]}>
                                      <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item.product_ID })}>
                                        {item.product_ID.productImage.length > 0 ?
                                        <FastImage
                                          style={styles.imgwdht}
                                          source={{ 
                                            uri: item.product_ID.productImage[0],
                                            priority: FastImage.priority.high, 
                                            cache: FastImage.cacheControl.immutable,
                                          }}
                                          resizeMode="contain" 
                                        />
                                        :
                                        <FastImage
                                        style={styles.imgwdht}
                                        source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                                        resizeMode="contain" 
                                      />
                                        }
                                      </TouchableOpacity>
                                      
                                    </View>
                                    <View style={{flex:0.4,marginTop:10,paddingRight:10}}>
                                      <TouchableOpacity onPress={() => navigation.navigate('', { productID: item.product_ID })}>
                                        <Text style={styles.productname1}>{item.product_ID.productName}</Text>
                                      </TouchableOpacity>
                                      <View style={[styles.flx1, styles.prdet,{marginVertical:10}]}>                                     
                                      <View style={[styles.flxdir,{alignItems:"center"}]}>
                                          <Text style={[styles.QText]}>Quantity : <Text style={styles.QNum}>{item.quantity}</Text><Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                          </Text>
                                      </View>                                      
                                      </View>
                                  </View>
                                  <View style={{flexDirection:'row',flex:0.35,marginTop:10}}>
                                      <View style={{flex:0.4,alignItems:"flex-end"}}>
                                        <Text style={styles.currency1Iteam}>{currency} </Text>
                                      </View>
                                      <View style={{flex:0.6,alignItems:"flex-end"}}>
                                          <Text style={styles.priceIteam}> {(item.product_ID.discountedPrice * item.quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                          </Text>
                                      </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                            )
                          })}
                        </View>                       
                    <View style={styles.vendorTotal}>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.65,alignItems:'flex-end'}}>
                          {/* <Text numberOfLines={1} style={styles.totaldata}>{vendor.vendor_id.companyName} </Text> */}
                          <Text style={styles.vendorTotalText}>{vendor.vendor_id.companyName}</Text>
                        </View>
                        <View style={{flexDirection:'row',flex:0.35}}>
                            <View style={{flex:0.4,alignItems:'flex-end'}}>
                              <Text style={styles.currency1Iteam}>{currency} </Text>
                            </View>
                            <View style={{flex:0.6,alignItems:'flex-end'}}>
                              <View style={[styles.flxdir,{alignItems:"center"}]}>
                                  <Text style={styles.priceIteam}>{vendor.vendor_netPayableAmount.toFixed(2)}
                                  </Text>
                              </View>
                            </View>
                        </View>                        
                      </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.65,alignItems:'flex-end' }}>
                        <Text style={styles.vendorTotalText}>You Saved </Text>
                      </View>
                      <View style={{flexDirection:'row',flex:0.35}}>
                          <View style={{flex:0.4,alignItems:'flex-end'}}>
                            <Text style={styles.currency1Iteam}>{currency} </Text>
                          </View>
                          <View style={{flex:0.6,alignItems:'flex-end'}}>
                            <View style={[styles.flxdir,{alignItems:"center"}]}>
                                <Text style={styles.priceIteamG}>{vendor.vendor_discountAmount.toFixed(2)}
                                </Text>
                            </View>
                          </View>
                      </View>
                    </View>
                    <View>
                    </View>
                     </View>
                    </View>
                    )
                  })
                  :
                  <Text>Not found</Text>
                  }
           
            </View>
          </View>
        </ScrollView>
         :
         <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
           <ActivityIndicator size="large" color={colors.theme} />
         </View>}
   
      <Modal1 isVisible={modal}
          onBackdropPress={() => setModal(false)}
          onRequestClose={() => setModal(false)}
          coverScreen={false}
          hideModalContentWhileAnimating={true}
          style={{ zIndex: 999,paddingTop:hp(2),paddingBottom:hp(10),alignSelf:'center'}}
          animationOutTiming={1}
          animationInTiming={1}
          >
          <View style={{ backgroundColor: "#fff", borderRadius: 10}}>
            <View style={{borderTopLeftRadius: 10,borderTopRightRadius:10,backgroundColor:'#033554',flexDirection:'row',height:hp(6),alignItems:'center',justifyContent:'space-between',borderBottomWidth:0.5,borderColor:"#eee"}}>   
              <View style={{paddingHorizontal: wp(1.5)}}>
                <Text style={[CommonStyles.label,{color:'#fff',marginLeft:10}]}>Terms & conditions</Text>
              </View>  
              <TouchableOpacity style={{justifyContent:"flex-end",marginRight:10,padding:5,height:hp(4),width:hp(4)}} onPress={()=>setModal(false)}>
                  <Icon name="close" color="#fff" type="material-community" size={RFPercentage(3)} />
              </TouchableOpacity>
           </View>   
          <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
                {
                    pageBlockes && pageBlockes.length>0?
                        pageBlockes.map((item,index)=>{
                            const result = item.block_id.blockDescription.replace(/<[^>]+>/g, '');
                            return(
                                <View style={{flex:1,paddingHorizontal:15}}>
                                    {result!=="" && <HTML ignoredTags={['br']} baseFontStyle={styles.htmlText1} style={{fontSize:RFPercentage(1.8),color:'#000'}} html={item.block_id.blockDescription}/>}
                                    {item.block_id.fgImage1 &&<Image
                                        source={{uri:item.block_id.fgImage1}}
                                        style={{height:200,width:"100%"}}
                                        resizeMode={"stretch"}
                                    />}
                                </View>                                    
                            )
                        })
                    :
                    []
                }
            </ScrollView>
          </View>
        </Modal1>
        
      <SafeAreaView style={{flex: 1}}>
      <Modal
        hasBackdrop={true}
        animationType="slide"
        backdropColor="transparent"
        backdropOpacity={0}
        onBackdropPress={() => setCouponModal(false)}
        onBackButtonPress={() =>  setCouponModal(false)}
        style={{padding:0,margin:0}}
        isVisible={couponModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setCouponModal(false)}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
            padding: 0,
          }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles1.topContainer}
              >
            <SafeAreaView forceInset={{bottom: 'always',height:500}}>
              {/* <View style={styles1.titleContainer}>
                <Text style={CommonStyles.label}>Sort By</Text>
                <Icon name="md-close-circle" type="ionicon" color="#f00" />
              </View> */}
             <View style={styles1.titleContainer}>
                <TouchableOpacity style={tab ? styles1.tab : styles1.tab1} onPress={()=>selectedTab(true)}>
                  <Text style={tab ? styles1.tabText : styles1.tabText1}>Discount Coupon</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={!tab ? styles1.tab : styles1.tab1} onPress={()=>selectedTab(false)}>
                    <Text style={!tab ? styles1.tabText : styles1.tabText1}>Store Credit {currency} <Text style={{color:'#DC1919'}}>{cartData?.totalCreditPoints?.toFixed(2)}</Text></Text>
                </TouchableOpacity>
             </View>  
            <View style={{height:hp(16),backgroundColor:"#fff",paddingHorizontal:28}}>
              {tab?
              <View style={{flexDirection:"row",height:hp(7),marginTop:25}}>
                  <View style={{flex:.7}}>
                    <Input
                    // label                 = "Enter promotional code"
                    placeholder           = "Apply Coupon code"            
                    onChangeText          = {(text)=>setCouponCode(text)}
                    // keyboardType          = "email-address"
                    inputContainerStyle   = {styles.containerStyle}
                    containerStyle        = {{paddingHorizontal:0}}
                    placeholderTextColor  = {'#909090'}
                    inputStyle            = {{fontSize: RFPercentage(2.2),textAlignVertical: "top",fontFamily:"Montserrat-Medium",paddingLeft:10}}
                    autoCapitalize        = 'characters'
                    value                 = {couponCode}
                  />
                </View>  
                <View style={{flex:.3,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,}}>
                  <Button 
                    onPress    = {()=>applyCoupen()}
                    title       = {'Apply'}
                    // background  = {true}
                    buttonStyle={{
                      height:hp(6),
                      backgroundColor:"#FFFFFF",
                    }}
                    containerStyle={{elevation:5}}
                    titleStyle={{fontSize:RFPercentage(2.2),color: "#000000",opacity: 0.5,fontFamily:"Montserrat-SemiBold",}}
                  /> 
                </View>  
              </View>
              :
              <View >
                <View style={{flexDirection:"row",height:hp(7),marginTop:25}}>
                  <View style={{flex:.7}}>
                    <Input
                      placeholder           = "Apply AED"
                      onChangeText          = {(text)=>onCheckLimit(text)}
                      autoCapitalize        = "none"
                      keyboardType          = "email-address"
                      inputContainerStyle   = {styles.containerStyle}
                      containerStyle        = {{paddingHorizontal:0}}
                      placeholderTextColor  = {'#909090'}
                      inputStyle            = {{fontSize: RFPercentage(2.2),textAlignVertical: "top",fontFamily:"Montserrat-Medium",paddingLeft:10}}
                      autoCapitalize        = 'characters'
                      value                 = {creditPointsUsed.toString()}
                      keyboardType          = 'numeric'
                    />
                    </View>  
                    <View style={{flex:.3,shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,}}>
                      <Button 
                        onPress    = {()=>redeemPoints()}
                        title       = {'Apply'}
                        // background  = {true}
                        containerStyle={{elevation:5}}
                        buttonStyle={{height:hp(6),backgroundColor:"#FFFFFF"}}
                        titleStyle={{fontSize:RFPercentage(2.2),color: "#000000",opacity: 0.5,fontFamily:"Montserrat-SemiBold",}}
                      />   
                  </View> 
                </View> 
                <Text style={[{color:"#000000",fontSize:RFPercentage(2.2),fontFamily:"Montserrat-Medium",marginTop:5}]}>Total balance {currency} <Text style={{fontFamily:"Montserrat-SemiBold",color:'#033554'}}>{cartData.totalCreditPointsValue}</Text></Text>
               </View>
              }
            </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
      </SafeAreaView>
      <SafeAreaView style={{flex: 1}}>
      <Modal1 isVisible={couponConfirmation}
          onBackdropPress={() => setCopuonConfirmation(false)}
          onRequestClose={() => setCopuonConfirmation(false)}
          onDismiss={() =>  setCopuonConfirmation(false)}
          coverScreen={true}
          hideModalContentWhileAnimating={true}
          hasBackdrop={false}
          // hideModalContentWhileAnimating={true}
          style={{ paddingHorizontal: '5%', zIndex: 999 }}
          animationInTiming={1} animationOutTiming={1}
         >
          <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
            {/* <View style={{ justifyContent: 'center', backgroundColor: "transparent", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
              <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
            </View> */}
            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: RFPercentage(1.8), textAlign: 'center', marginTop: 20 }}>
              Are you sure you want to remove this coupon?
            </Text>
            <View style={styles.cancelbtn}>
              <View style={styles.cancelvwbtn}>
                <TouchableOpacity>
                  <Button
                    onPress={() => setCopuonConfirmation(false)}
                    titleStyle={styles.buttonText1}
                    title="NO"
                    buttonStyle={styles.buttonRED}
                    containerStyle={styles.buttonContainer2}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ordervwbtn}>
                <TouchableOpacity>
                  <Button
                    onPress={() => getCartData(user_id)}
                    titleStyle={styles.buttonText1}
                    title="Yes"
                    buttonStyle={styles.button1}
                    containerStyle={styles.buttonContainer2}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal1>
        <Modal1 isVisible={creditConfirmation}
          onBackdropPress={() => setCreditConfirmation(false)}
          onRequestClose={() => setCreditConfirmation(false)}
          onDismiss={() =>  setCreditConfirmation(false)}
          coverScreen={true}
          hasBackdrop={false}
          hideModalContentWhileAnimating={true}
          style={{ paddingHorizontal: '5%', zIndex: 999 }}
          animationInTiming={1} animationOutTiming={1}
          >
          <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
            {/* <View style={{ justifyContent: 'center', backgroundColor: "transparent", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
              <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
            </View> */}
            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: RFPercentage(1.8), textAlign: 'center', marginTop: 20 }}>
              Are you sure you want to remove this credit points?
            </Text>
            <View style={styles.cancelbtn}>
              <View style={styles.cancelvwbtn}>
                <TouchableOpacity>
                  <Button
                    onPress={() => setCreditConfirmation(false)}
                    titleStyle={styles.buttonText1}
                    title="NO"
                    buttonStyle={styles.buttonRED}
                    containerStyle={styles.buttonContainer2}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ordervwbtn}>
                <TouchableOpacity>
                  <Button
                    onPress={() => getCartData(user_id)}
                    titleStyle={styles.buttonText1}
                    title="Yes"
                    buttonStyle={styles.button1}
                    containerStyle={styles.buttonContainer2}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal1>
    </SafeAreaView>
    <View style={{marginBottom:Platform.OS ==='ios'?60: hp(8.5),flexDirection:'row',alignSelf:"flex-end"}}>
         <View style={{flex:0.5,height:hp(8.5),backgroundColor:"#A2AEB5",justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:RFPercentage(2),fontFamily:"Montserrat-Regular",color: "#eee"}}>Grand Amount</Text>
            <Text style={{fontSize:RFPercentage(2.4),fontFamily:"Montserrat-Regular",color: "#eee"}}>{currency} {cartData?.paymentDetails?.netPayableAmount && cartData?.paymentDetails?.netPayableAmount.toFixed(2)}</Text>
         </View>
         <TouchableOpacity style={{flex:0.5,height:hp(8.5),backgroundColor:(checked && shippingTiming!=="") ?colors.cartButton: "#5F6C74",justifyContent:'center',alignItems:'center'}}
         disabled       = {checked && shippingTiming!=="" ? false:true}
         onPress        = {() => paymentMethodsPage()}
         >
          <Text style={{fontSize:RFPercentage(2.4),fontFamily:"Montserrat-Regular",color: "#eee"}}>Checkout</Text>
         </TouchableOpacity>
      </View>
      
   </View>
  );
})


const styles1 = StyleSheet.create({
  sortText: {
    // ...getFontStyleObject(),
    fontSize: 14,
  },
  topContainer: {
    backgroundColor: '#fff',
    width: '100%',
    // height: '30%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 0.8,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    // padding:5
  },
  titleContainer: {
    // paddingHorizontal: `${5}%`,
    borderBottomColor: '#ccc',
    // borderBottomWidth: 0.6,
    // paddingVertical: `${2}%`,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    paddingHorizontal: `${5}%`,
    paddingVertical: `${5}%`,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab:{
    flex:0.5,
    justifyContent:'center',
    alignItems:'center',
    height:hp(6.5),
    backgroundColor:"#fff",    
  },
  tab1:{
    flex:0.5,
    justifyContent:'center',
    alignItems:'center',
    height:hp(6.5),
    borderTopLeftRadius:11,
    borderTopRightRadius:11,
    backgroundColor:"#E2E2E2",
  },
  tabText:{
    fontFamily:"Montserrat-Bold",
    color: "#000000",
    opacity: 1,
    fontSize:RFPercentage(1.8),
  },
  tabText1:{
    fontFamily:"Montserrat-Regular",
    color: "#000000",
    opacity: 1,
    fontSize:RFPercentage(1.8),
  }
});