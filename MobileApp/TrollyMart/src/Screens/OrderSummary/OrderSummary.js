import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,ActivityIndicator,
  Linking
} from 'react-native';
import { Dropdown }             from 'react-native-material-dropdown-v2';
import { Button, Icon,Input,Tooltip,CheckBox }   from "react-native-elements";
import Modal                    from "react-native-modal";
import axios                    from "axios";
import {HeaderBar3}             from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                 from '../../ScreenComponents/Footer/Footer.js';
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
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { RadioButton }        from 'react-native-paper';
import HTML from 'react-native-render-html';
import {KeyboardAwareScrollView}  from 'react-native-keyboard-aware-scroll-view';
import { NetWorkError } from '../../../NetWorkError.js';
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
    const [returnModal,setCouponModal]=useState(false);
    useEffect(() => {
      getData();
      setChecked(false);
  }, [props]);

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
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
    setAddDataMobileNumber(addData.mobileNumber);
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
    axios.get('/api/pages/get/page_block/terms-and-conditions')
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
    // if(creditPointsUsed === 0){
      var payload={
          "user_ID"     : user_id,
          "creditPointsValueUsed"  : parseFloat(creditPointsUsed)
      }
      // console.log("payload",payload);
      axios.patch('/api/carts/redeem/creditpoints',payload)
      .then(res=>{
        console.log("res",res);
          // setToast({text: res.data.message, color:res.data.message === "Reee Applied Successfully!" ? 'green':colors.warning});
          setCartData(res.data);
          setRedeemPoints(0);
          // setCouponCode('');
      })
      .catch(err=>{
        setRedeemPoints(0);
        console.log("err",err);
      })
    // } 
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
    { cartData.vendorOrders && cartData.vendorOrders.length > 0&&
    cartData.vendorOrders.map((vendor, i) => {
        return (
          <View style={{paddingVertical:5}}>
              <Text style={[commonStyles.label,{color:"#fff"}]}>{vendor.vendor_id.companyName}</Text>
              <View style={{flexDirection:"row"}}>
                <Text style={[commonStyles.text,{color:"#fff"}]}>Delivery Charges : </Text>
                <Text style={[commonStyles.text,{color:"#fff",alignSelf:"flex-end"}]}>{vendor.vendor_shippingCharges} {currency}</Text>
              </View>  
          </View> 
        )
    })  
    }
    <View style={{marginTop:30,flexDirection:'row'}}>
      <Text style={[commonStyles.label,{color:"#fff"}]}>Total Delivey Charges :</Text>
      <Text style={[commonStyles.label,{color:"#fff"}]}>{cartData?.paymentDetails?.shippingCharges} {currency}</Text>
    </View>  
    </View>,
    { onLayout: (e) => setTooltipSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height }) }
  )

    return (
      <React.Fragment>
        <KeyboardAwareScrollView contentContainerStyle={{backgroundColor:"#fff"}}  keyboardShouldPersistTaps="always" extraScrollHeight={130}  enableAutomaticScroll enableOnAndroid	>
              <View style={styles.addcmporder}> 
                <View style={{backgroundColor:"#fff",flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{fontSize:15,fontFamily:"Montserrat-SemiBold",color: "#000000"}}>Address</Text>
                    <TouchableOpacity 
                        style={{height:34,width:34,elevation:5,marginRight:3,justifyContent:'center',alignItems:'center',backgroundColor:"#fff",borderRadius:50}}
                        onPress={() => navigation.navigate('AddressDefaultComp', {user_id,"delivery":true})}
                      >
                        <Icon name="edit" type="font-awesome" size={15}/>
                    </TouchableOpacity>
                </View>  
                <View style={{borderWidth:0.5,borderColor:'#707070',marginTop:10,borderRadius:9,borderColor:"#707070",paddingHorizontal:10}}>
                  <View style={styles.orderaddchkbx}>
                    <View style={{flex:0.05,justifyContent:'flex-end',marginBottom:7}}><Text style={styles.blueDot}></Text></View>
                    <View style={{flex:0.7}}><Text style={styles.addname}>{addDataName}</Text></View>                    
                    
                  </View>
                  <View style={{paddingHorizontal:15}}>
                    <Text style={styles.address}>{addDataAddressLine1+", "+addDataAddressLine2}</Text>
                    <View style={styles.mobflx}>
                      <Text style={styles.address}>Mobile:</Text>
                      <Text style={styles.address}>{addDataMobileNumber}</Text>
                    </View>
                  </View>                  
                </View>                 
              </View>
              <View style={{paddingHorizontal:30}}>
                <View style={{flexDirection:"row",marginVertical:10,alignItems:'center'}}>
                    <Icon name="sale" type="material-community" size={13} color="green"/>
                    <Text style={{color: "#3E9D5E"}}> Apply Discount</Text>
                </View>  
                {
                    cartData && cartData.paymentDetails ?
                    <View style={styles.totaldetails}>
                      <View style={styles.flxdata}>                    
                      <View style={{ flex: 0.55 }}>
                        <Text style={styles.totaldata1}>Final Total</Text>
                      </View>
                      <View style={{ flex: 0.2 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.currency1}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.2 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincartTotal}>{cartData.paymentDetails.afterDiscountTotal && cartData.paymentDetails.afterDiscountTotal.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.55 }}>
                        <Text style={styles.totaldata1}>Total Saving </Text>
                      </View>
                      <View style={{ flex: 0.2 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.currency1}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.2 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          {/* <Text style={styles.totalpriceincart}> - </Text> */}
                          <Text style={[styles.totalpriceincartTotalG]}>{cartData.paymentDetails.discountAmount && cartData.paymentDetails.discountAmount.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.55 }}>
                        <Text style={styles.totaldata1}>Total VAT  </Text>
                      </View>
                      <View style={{ flex: 0.2 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.currency1}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.2 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincartTotal}>{cartData.paymentDetails.taxAmount && cartData.paymentDetails.taxAmount.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.55 }}>
                        <Text style={styles.totaldata1}>Total Delivery Charges </Text>
                      </View>
                      <View style={{ flex: 0.2 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end'}}>
                            <Text style={styles.currency1}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.2 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincartTotal}>{cartData.paymentDetails.shippingCharges && cartData.paymentDetails.shippingCharges.toFixed(2)}</Text>
                        </View>
                      </View>
                      <View style={{flex:0.05,justifyContent:"center",alignItems:"center"}} >
                        <Tooltip 
                          containerStyle={{justifyContent:'flex-start',alignItems:'flex-start'}}
                          width={300} 
                          height={tooltipSize.h + 30}
                          backgroundColor={colors.theme}
                          popover={tooltipClone}
                          withOverlay={false}
                          >
                          <Icon name="information-outline" type={"material-community"} size={12}iconStyle={{color:'#648295'}} />
                        </Tooltip>
                      </View>  
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.55 }}>
                        <Text style={styles.totaldata1}>Discount Coupon</Text>
                      </View>
                      <View style={{ flex: 0.2 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end'}}>
                            <Text style={[styles.currency1],{opacity: 0.7,color:'#EF9A9A'}}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.2 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincartTotalR}>{cartData.paymentDetails.shippingCharges && cartData.paymentDetails.shippingCharges.toFixed(2)}</Text>
                        </View>
                      </View>
                      <View style={{flex:0.05,justifyContent:"center",alignItems:"center"}} >
                        <Tooltip 
                          containerStyle={{justifyContent:'flex-start',alignItems:'flex-start'}}
                          width={300} 
                          height={tooltipSize.h + 30}
                          backgroundColor={colors.theme}
                          popover={tooltipClone}
                          withOverlay={false}
                          >
                          <Icon name="trash" type={"font-awesome"} size={12} iconStyle={{color:'#648295'}} />
                        </Tooltip>
                      </View>  
                    </View>

                    {/* <SortModal
                      onBackdropPress={() => setCouponModal(false)}
                      onRequestClose={() => setCouponModal(false)}
                      sortOptions={sortOptions}
                      closeModal={() => toggleSort(false)}
                      visible={showSort}
                    /> */}
                    {cartData.paymentDetails.afterDiscountCouponAmount === 0 &&  cartData.paymentDetails.creditPointsUsed === 0?
                        // <View style={{flex:1,flexDirection:"row",marginTop:15,height:50}}>
                        //   <View style={{flex:.7}}>
                        //     <Input
                        //       // label                 = "Enter promotional code"
                        //       placeholder           = "Enter promotional code"
                        //       onChangeText          = {(text)=>setCouponCode(text)}
                        //       autoCapitalize        = "none"
                        //       keyboardType          = "email-address"
                        //       inputContainerStyle   = {styles.containerStyle}
                        //       containerStyle        = {{paddingHorizontal:0}}
                        //       placeholderTextColor  = {'#bbb'}
                        //       inputStyle            = {{fontSize: 16}}
                        //       inputStyle            = {{textAlignVertical: "top"}}
                        //       autoCapitalize        = 'characters'
                        //       value                 = {couponCode}
                        //     />
                        //   </View>  
                        //   <View style={{flex:.3,marginTop:10}}>
                          
                        //     <FormButton 
                        //       onPress    = {()=>applyCoupen()}
                        //       title       = {'Apply'}
                        //       background  = {true}
                        //     /> 
                        //   </View>  
                        // </View>
                        null
                        :
                        cartData.paymentDetails.afterDiscountCouponAmount > 0 &&<SafeAreaView>
                      <View style={styles.flxdata}>
                          <View style={{ flex: 0.6 }}>
                            <Text style={styles.totaldata}>Discount Coupon Amount  </Text>
                          </View> 
                          <View style={{ flex: 0.35 }}>
                            <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                              <Text style={styles.totalpriceincart}>{currency} {cartData.paymentDetails.afterDiscountCouponAmount.toFixed(2)}</Text>
                            </View>
                          </View>
                        </View>
                        <Text style={[styles.totaldata,{color:"red",alignSelf:"flex-end",paddingBottom:5}]} onPress={()=>getCartData(user_id)}>Remove Coupon</Text>
                        </SafeAreaView>
                      }
                      
                      {cartData.paymentDetails.afterDiscountCouponAmount === 0 && cartData.paymentDetails.creditPointsUsed === 0?
                      //  <View style={{marginTop:15}}>
                      //     <Text style={[CommonStyles.label]}>Credit Points Available {cartData.totalCreditPoints} Points.</Text>
                      //     <Text style={[CommonStyles.textLight]}>Total Balanace Available {cartData.totalCreditPointsValue} {currency}.</Text>
                      //     <View style={{flex:1,flexDirection:"row",height:50}}>
                      //       <View style={{flex:.7}}>
                      //         <Input
                      //           placeholder           = "Enter credit value..."
                      //           onChangeText          = {(text)=>onCheckLimit(text)}
                      //           autoCapitalize        = "none"
                      //           keyboardType          = "email-address"
                      //           inputContainerStyle   = {styles.containerStyle}
                      //           containerStyle        = {{paddingHorizontal:0}}
                      //           placeholderTextColor  = {'#bbb'}
                      //           inputStyle            = {{fontSize: 16}}
                      //           inputStyle            = {{textAlignVertical: "top"}}
                      //           autoCapitalize        = 'characters'
                      //           value                 = {creditPointsUsed.toString()}
                      //           keyboardType          = 'numeric'
                      //         />
                      //       </View>  
                      //       <View style={{flex:.3,marginTop:10}}>
                      //         <FormButton 
                      //           onPress    = {()=>redeemPoints()}
                      //           title       = {'Apply'}
                      //           background  = {true}
                      //         /> 
                      //       </View>  
                      //     </View>
                      //   </View>  
                      null
                        :
                        cartData.paymentDetails.creditPointsUsed > 0 &&<SafeAreaView>
                        <View style={styles.flxdata}>
                          <View style={{ flex: 0.6 }}>
                            <Text style={styles.totaldata}>Redeem Value  </Text>
                          </View> 
                          <View style={{ flex: 0.35 }}>
                            <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                              <Text style={styles.totalpriceincart}>{currency} {cartData.paymentDetails.creditPointsValueUsed.toFixed(2)}</Text>
                            </View>
                          </View>
                        </View>
                        <Text style={[styles.totaldata,{color:"red",alignSelf:"flex-end",paddingBottom:5}]} onPress={()=>getCartData(user_id)}>Remove Value</Text>
                        </SafeAreaView>
                      }
                    <View style={{marginVertical:5}} />
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.57 }}>
                        <Text style={[styles.totaldata1G]}>Grand Total</Text>
                      </View>
                      <View style={{ flex: 0.2 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.currency1G}>{currency}</Text>
                          </View>
                        </View>
                      <View style={{ flex: 0.2 }}>
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
                                size={12}
                                center
                                title=''
                                checked={checked}
                                onPress={() => {setChecked(!checked)}}
                          />
                            <Text style={styles.free}>I agree to <Text style={[CommonStyles.linkText,{fontSize:12,marginTop:-5}]}  onPress={()=>setModal(true)}>terms & conditions</Text><Text style={[commonStyles.errorText,{fontSize:20,}]}>*</Text></Text>
                          </View>
                      </View>
                      <View>
                    </View>
                  </View>
                  :
                  null
                }
                <View style={[styles.confirmbtn, styles.marginBottom20,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                  <Text style={{flex:0.6,marginLeft:10}}>Select Delivery Time</Text>
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
                        labelFontSize       = {10}
                        fontSize            = {10}
                        baseColor           = {'#666'}
                        textColor           = {'#333'}
                        labelTextStyle      = {{ left: 5 }}
                        style               = {styles.ddStyle}
                        disabledLineType    = 'none'
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
                         <View style={{paddingHorizontal:15}}>
                          <Text style={[commonStyles.headerText,{alignSelf:"flex-start",fontSize:15,marginBottom:10,fontFamily:'Montserrat-Bold'}]}>{vendor.vendor_id.companyName}</Text>
                        </View>
                        <View style={styles.proddetails1}>
                            {vendor.cartItems && vendor.cartItems.length>0 && vendor.cartItems.map((item,index)=>{
                            return(
                              <View key={index}>
                                <View key={index} style={styles.proddetails}>
                                  <View style={styles.flxdir}>
                                    <View style={[styles.flxpd]}>
                                      <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item.product_ID })}>
                                        {item.product_ID.productImage.length > 0 ?
                                          <Image
                                          style={styles.imgwdht}
                                          source={{ uri: item.product_ID.productImage[0] }}
                                        />
                                        :
                                        <Image
                                          style={styles.imgwdht}
                                          source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                                        />
                                        }
                                      </TouchableOpacity>
                                      
                                    </View>
                                    <View style={{flex:0.4,marginTop:10}}>
                                      <TouchableOpacity onPress={() => navigation.navigate('', { productID: item.product_ID })}>
                                        {item.product_ID.productNameRlang ?
                                        <Text style={{fontFamily:'aps_dev_priyanka',fontWeight:'Bold',fontSize:20,flexWrap:'wrap'}}>{item.product_ID.productNameRlang}</Text>
                                        : 
                                        <Text style={styles.productname1}>{item.product_ID.productName}</Text>
                                        }
                                        </TouchableOpacity>
                                      <View style={[styles.flx1, styles.prdet,{marginVertical:10}]}>                                     
                                      <View style={[styles.flxdir,{alignItems:"center"}]}>
                                          <Text style={[styles.QText]}>Quantity : <Text style={styles.QNum}>{item.quantity}</Text><Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                          </Text>
                                      </View>                                      
                                      </View>
                                  </View>
                                  <View style={{flexDirection:'row',flex:0.3,marginTop:10}}>
                                      <View style={{flex:0.5}}>
                                        <Text style={styles.currency1Iteam}>{currency} </Text>
                                      </View>
                                      <View style={{flex:0.5}}>
                                        <View style={[styles.flxdir,{alignItems:"center"}]}>
                                            <Text style={styles.priceIteam}> {(item.product_ID.discountedPrice * item.quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                            </Text>
                                        </View>
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
                        <View style={{ flex: 0.6,alignItems:'flex-end'}}>
                          {/* <Text numberOfLines={1} style={styles.totaldata}>{vendor.vendor_id.companyName} </Text> */}
                          <Text style={styles.vendorTotalText}>{vendor.vendor_id.companyName}</Text>
                        </View>
                        <View style={{flexDirection:'row',flex:0.3}}>
                            <View style={{flex:0.4}}>
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
                      <View style={{ flex: 0.6,alignItems:'flex-end' }}>
                        <Text style={styles.vendorTotalText}>You Saved </Text>
                      </View>
                      <View style={{flexDirection:'row',flex:0.3}}>
                          <View style={{flex:0.4}}>
                            <Text style={styles.currency1Iteam}>{currency} </Text>
                          </View>
                          <View style={{flex:0.6,alignItems:'flex-end'}}>
                            <View style={[styles.flxdir,{alignItems:"center"}]}>
                                <Text style={styles.priceIteamG}>{vendor.vendor_discountAmount > 1 ? vendor.vendor_discountAmount.toFixed(2) : 0.00}
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
        </KeyboardAwareScrollView>
      <Modal isVisible={modal}
          onBackdropPress={() => setModal(false)}
          onRequestClose={() => setModal(false)}
          coverScreen={true}
          hideModalContentWhileAnimating={true}
          style={{ zIndex: 999 }}
          animationOutTiming={500}>
          <View style={{ backgroundColor: "#fff", borderRadius: 20, paddingBottom: 30, paddingHorizontal: 10}}>
          <TouchableOpacity style={{flexDirection:"row",justifyContent:"flex-end"}} onPress={()=>setModal(false)}>
                <Icon name="close" type="material-community" size={20} color={colors.red} />
            </TouchableOpacity>  
          <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
                {
                    pageBlockes && pageBlockes.length>0?
                        pageBlockes.map((item,index)=>{
                            const result = item.block_id.blockDescription.replace(/<[^>]+>/g, '');
                            return(
                                <View style={{flex:1,paddingHorizontal:15}}>
                                    {result!=="" && <HTML ignoredTags={['br']} html={item.block_id.blockDescription}/>}
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
        </Modal>
        <View style={{marginBottom:Platform.OS ==='ios'?60: 45,flexDirection:'row'}}>
         <View style={{flex:0.5,height:60,backgroundColor:"#A2AEB5",justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:12,fontFamily:"Montserrat-Regular",color: "#eee"}}>Total Amount</Text>
            <Text style={{fontSize:16,fontFamily:"Montserrat-Regular",color: "#eee"}}>{currency} {cartData?.paymentDetails?.netPayableAmount && cartData?.paymentDetails?.netPayableAmount.toFixed(2)}</Text>
         </View>
         <TouchableOpacity style={{flex:0.5,height:60,backgroundColor:checked ?colors.cartButton: "#5F6C74",justifyContent:'center',alignItems:'center'}}
         disabled       = {!checked}
         onPress        = {() => paymentMethodsPage()}
         >
          <Text style={{fontSize:16,fontFamily:"Montserrat-Regular",color: "#eee"}}>Checkout</Text>
         </TouchableOpacity>
      </View>
    </React.Fragment>
  );
})
