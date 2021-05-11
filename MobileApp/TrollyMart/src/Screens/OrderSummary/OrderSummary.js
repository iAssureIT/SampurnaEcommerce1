import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,ActivityIndicator,
} from 'react-native';
import { Dropdown }       from 'react-native-material-dropdown-v2';
import { Button, Icon, }  from "react-native-elements";
import Modal              from "react-native-modal";
import axios              from "axios";
import HeaderBar5         from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import {Footer}           from '../../ScreenComponents/Footer/Footer1.js';
import Notification       from '../../ScreenComponents/Notification/Notification.js'
import styles             from '../../AppDesigns/currentApp/styles/ScreenStyles/OrderSummaryStyles.js';
import { colors }         from '../../AppDesigns/currentApp/styles/styles.js';
import {withCustomerToaster}  from '../../redux/AppState.js';
// import {AppEventsLogger} from 'react-native-fbsdk';    

  export const OrderSummary = withCustomerToaster((props)=>{
    const {navigation,route}=props;
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
    const [currency,setCurrency] = useState('');
    const [totaloriginalprice, setOrignalPrice] = useState(0);
    const [saving,setTotalSaving] =useState(0);
    useEffect(() => {
      getData();
  }, []);

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
    
    getCartData(user_id, product_ID);
    getTimes_func(startRange, limitRange);
    getDiscounteData(startRange, limitRange);
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
        console.log('error', error);
      });
  }

  const getDiscounteData=(startRange, limitRange)=>{
    axios.get('/api/discount/get/list-with-limits/' + startRange + '/' + limitRange)
        .then((response) => {
            console.log('tableData = ', response.data[0]);
            if(response.data && response.data.length > 0) {
              setDiscountData(response.data[0]);
              setDiscountType(response.data[0].discounttype);
              setDiscountIn(response.data[0].discountin);
              setDiscountValue(response.data[0].discountvalue);

                  var amountofgrandtotal =  response.data[0] !== undefined ?
                                              totaloriginalprice && response.data[0].discountin === "Percent" ?
                                                      totaloriginalprice - (totaloriginalprice * response.data[0].discountvalue)/ 100
                                                      : totaloriginalprice - response.data[0].discountvalue
                                                  : totaloriginalprice
              console.log('amountofgrandtotal = ', amountofgrandtotal);
              setAmountofgrandtotal(amountofgrandtotal);
            }  
        })
        .catch((error) => {
            console.log('error', error);
        });
}


   
const getCartData=(userId)=>{
  axios.get('/api/Carts/get/cartproductlist/' + userId)
    .then((response) => {
      setLoading(false);
      if(response.data.length > 0) {
        setSubTotalItems(response.data[0].cartItems.length);
        setCartData(response.data[0].cartItems);
        setSubTotal(response.data[0].subTotal);
        setTotalSaving(response.data.saving);''
        setCurrency(response.data[0].cartItems[0].productDetail.currency);
        gettotalcount(response.data[0].cartItems);
      } else {
        setCartData([]);
      }

    })
    .catch((error) => {
      setLoading(false);
      console.log('error', error);
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
  
 
  const paymentmethodspage=()=>{
    // AppEventsLogger.logEvent('Initiate Checkout');
    // this.props.navigation.navigate('PaymentMethod', { cartdata: cartData, addData: addData, userID: user_id, totalamountpay: totaloriginalprice, shippingtime: shippingTiming, })
    var amt =   discountdata !== undefined ?
        totaloriginalprice && discountin === "Percent" ?
            totaloriginalprice - (totaloriginalprice * discountvalue)/ 100
            : totaloriginalprice - discountvalue
        : totaloriginalprice;
    navigation.navigate('PaymentMethod', { cartdata: cartData, addData: addData, userID: user_id, totalamountpay: amt, discount: discountvalue, shippingtime: shippingTiming, })
  }

  // const handleDelete = (id) => {
  //   Alert.alert("", "Are you sure you want to delete ?", [
  //     { text: "Cancel" },
  //     {
  //       text: "Delete",
  //       onPress: () => {
  //         this.deleteCompetitor(id);
  //       }
  //     },
  //   ]);
  // };

    return (
      <React.Fragment>
        <HeaderBar5
          goBack={navigation.goBack}
          headerTitle={'Order Summary'}
          navigate={navigation.navigate}
        />
        <View style={styles.addsuperparent}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={styles.padhr15}>
              <View style={styles.addcmporder}>
                <View style={styles.orderaddchkbx}>
                  <Text style={styles.addname}>{addDataName}</Text>
                  <Text style={styles.addoffice}>{addDataAddType}</Text>
                </View>
                <View style={{}}>
                  <Text style={styles.address}>{addDataAddressLine1}</Text>
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
                    <View style={styles.inputImgWrapper}></View>
                    <View style={styles.inputTextWrapper}>
                      {/* {console.log("Times in data=>",getTimes)} */}
                      <Dropdown
                        placeholder={"-- Select Time --"}
                        onChangeText={(value) => handleTypeChange(value)}
                        data={getTimes}
                        value={shippingTiming}
                        containerStyle={styles.ddContainer}
                        dropdownOffset={{ top: 0, left: 0 }}
                        itemTextStyle={styles.ddItemText}
                        inputContainerStyle={styles.ddInputContainer}
                        labelHeight={10}
                        tintColor={'#FF8800'}
                        labelFontSize={15}
                        fontSize={15}
                        baseColor={'#666'}
                        textColor={'#333'}
                        labelTextStyle={{ left: 5 }}
                        style={styles.ddStyle}
                        disabledLineType='none'
                      />
                    </View>
                  </View>
                  <Text style={styles.tomorroworder}>Your order will be delivered to you by 4pm to 9pm.</Text>
                </View>
              </View>
              <View style={styles.formWrapper}>
                <Text style={styles.totaldata}>You're Buying</Text>
                <View style={styles.cartdetails}>
                  {!loading ?
                    cartData && cartData.length > 0 ?
                      cartData.map((item, index) => {
                        return (
                          <View key={index} style={styles.proddetails}>
                            <View style={styles.flxdir}>
                              <View style={styles.flxpd}>
                                {
                                  item.productDetail.productImage.length > 0 ?
                                    <Image
                                      source={{ uri: item.productDetail.productImage[0] }}
                                      style={styles.imgwdht}
                                    />
                                    :
                                    <Image
                                      source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                                      style={styles.imgwdht}
                                      resizeMode="contain"
                                    />
                                }
                              </View>
                              <View style={styles.flxmg}>
                                <Text style={styles.productname}>{item.productDetail.productName}</Text>
                                <View style={styles.productdets}>
                                  <Icon
                                    name={item.productDetail.currency}
                                    type="font-awesome"
                                    size={11}
                                    color="#666"
                                    iconStyle={styles.iconstyle}
                                  />
                                  <Text style={styles.proddetprice}>{item.productDetail.discountedPrice * item.quantity}</Text>
                                </View>
                                {/* <Text style={styles.prodqtyunit}>Size: {item.productDetail.size + " " + item.productDetail.unit}</Text> */}
                                <Text style={styles.prodqtyunit}>Qty: {item.quantity + " Pack(s)"}</Text>
                              </View>
                            </View>
                          </View>
                        )
                      })
                    :
                        <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
                          <Image
                            source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
                          />
                        </View>
                    :
                        <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                          <ActivityIndicator size="large" color={colors.theme} />
                        </View>
                  }
                  <Text style={styles.totaldata}>Pricing Details </Text>
                  <View style={styles.totaldetails}>
                    <View style={styles.flxdata}>
                      <View style={styles.flx7}>
                        <Text style={styles.totaldata}>Total ({subtotalitems} Item(s)) </Text>
                      </View>
                      <View style={styles.flx3}>
                        <View style={styles.endrow}>
                          <Icon
                            name={currency}
                            type="font-awesome"
                            size={15}
                            color="#666"
                            iconStyle={styles.iconstyle}
                          />
                          <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{totaloriginalprice}</Text>
                        </View>
                      </View>
                    </View>



                    <View style={styles.flxdata}>
                      <View style={styles.flx7}>
                        <Text style={styles.totaldata}>Discount </Text>
                      </View>
                      <View style={styles.flx3}>
                        <View style={styles.endrow}>
                        
                        { 
                          discountin === "Amount" ? 
                            <Icon
                              name={currency}
                              type="font-awesome"
                              size={15}
                              color="#666"
                              iconStyle={styles.iconstyle}
                            />
                          : null 
                        }
                        <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{discountvalue > 1 ? discountvalue : 0.00}</Text>
                         
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
                         
                         
                          {/* <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{discountvalue}</Text> */}
                        </View>
                      </View>
                    </View>



                    <View style={styles.orderbrdr}>
                      <View style={styles.flx7}>
                        <Text style={styles.totaldata}>Delivery </Text>
                      </View>
                      <View style={styles.flx3}>
                        <View style={styles.endrow}>
                          <Text style={styles.free}>&nbsp;&nbsp;Free</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.amountpay}>
                      <View style={styles.flx7}>
                        <Text style={styles.totaldata}>Amount Payable </Text>
                      </View>
                      <View style={styles.flx3}>
                        <View style={styles.endrow}>
                          <Icon
                            name={currency}
                            type="font-awesome"
                            size={15}
                            color="#666"
                            iconStyle={styles.iconstyle}
                          />
                          <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{  discountdata !== undefined ?
                                            totaloriginalprice && discountin === "Percent" ?
                                                    totaloriginalprice - (totaloriginalprice * discountvalue)/ 100
                                                    : totaloriginalprice - discountvalue
                                                : totaloriginalprice}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.margTp20}>
                      <TouchableOpacity >
                        <Button
                          onPress={() => paymentmethodspage()}
                          title={"PROCEED TO BUY"}
                          buttonStyle={styles.button1}
                          containerStyle={styles.buttonContainer1}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginBottom: 30 }}>
                      <Text style={styles.securetxt}>Safe & Secure Payments | 100% Authentic Products</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <Footer />
        </View>

        {/* <Modal isVisible={removewishlistmodal}
          onBackdropPress={() => this.setState({ removewishlistmodal: false })}
          coverScreen={true}
          hideModalContentWhileAnimating={true}
          style={{ paddingHorizontal: '5%', zIndex: 999 }}
          animationOutTiming={500}>
          <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: "#c10000" }}>
            <View style={{ justifyContent: 'center', }}>
              <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
            </View>
            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
              Product is removed from wishlist.
            </Text>
            <View style={styles.yesmodalbtn}>
              <View style={styles.ordervwbtn}>
                <TouchableOpacity>
                  <Button
                    onPress={() => this.setState({ removewishlistmodal: false })}
                    titleStyle={styles.buttonText1}
                    title="OK"
                    buttonStyle={styles.button1}
                    containerStyle={styles.buttonContainer2}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> */}
      </React.Fragment>
    );
})
