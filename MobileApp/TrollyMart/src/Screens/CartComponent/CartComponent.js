import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,ActivityIndicator,
  Dimensions,
  Platform,
    
} from 'react-native';
import { Button, Icon,Input } from "react-native-elements";
import Modal                  from "react-native-modal";
import {HeaderBar3}           from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}               from '../../ScreenComponents/Footer/Footer1.js';
import Notification           from '../../ScreenComponents/Notification/Notification.js'
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/Cartstyles.js';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import axios                  from 'axios';
import Counter                from "react-native-counters";
import {withCustomerToaster}  from '../../redux/AppState.js';
import { getList } 		        from '../../redux/productList/actions';
import { connect,
  useDispatch,
  useSelector }               from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import commonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import AsyncStorage           from '@react-native-async-storage/async-storage';


  const window = Dimensions.get('window');
// export default class CartComponent extends React.Component {
  export const CartComponent = withCustomerToaster((props)=>{
    console.log("props",props);
    const dispatch = useDispatch();
    const {setToast,navigation,route} = props; 
    const [cartData, setCartData] = useState('');
    const [startRange, setStartRange] = useState(0);
    const [limitRange, setLimitRange] = useState(10);
    const [removefromcart,setRemoveFromCart] =useState(false);
    const [loading,setLoading] =useState(false);
    const [totalPrice,setTotalPrice] =useState(0);
    const [userId,setUserId] =useState(''); 
    const [discountin,setDiscountIn] = useState('');
    const [discountvalue,setDiscountValue] = useState('');
    const [amountofgrandtotal,setAmountofgrandtotal] = useState('');
    const [minvalueshipping,setMinValueShipping] = useState('');
    const [subtotalitems,setSubTotalItems] = useState('');
    const [subtotal,setSubTotal] = useState('');
    const [cartitemid,setCartItemId] = useState('');
    const [incresecartnum,setIncreaseCartNum] = useState('');
    const store = useSelector(store => ({
      preferences     : store.storeSettings.preferences,
    }));
  
    const {currency}=store.preferences;
    

  useEffect(() => {
    getData()
  },[props]); 

  const getData=()=>{
    const {userId } = route.params;
    if(userId){
      setLoading(true);
      getshippingamount(startRange,limitRange);
      setUserId(userId);
      console.log("userId ===>",userId)
      if(userId){
        getCartItems(userId);
      }
      // getdiscounteddata(startRange,limitRange);
    } 
  }

const getshippingamount=(startRange, limitRange)=>{
    axios.get('/api/shipping/get/list-with-limits/' + startRange + '/' + limitRange)
    .then((response) => {
      setMinValueShipping(response.data[0].shippingcosting);
    })
    .catch((error) => {
      if (error.response.status == 401) {
        AsyncStorage.removeItem('user_id');
        AsyncStorage.removeItem('token');
        setToast({text: 'Your Session is expired. You need to login again.', color: colors.warning});
        navigation.navigate('Auth')
      }else{
        setToast({text: 'Something went wrong.', color: 'red'});
      }  
    });
 }
 
  const getCartItems=(userId)=>{
    axios.get('/api/carts/get/cartproductlist/' + userId)
      .then((response) => {
        console.log("response",response);
        setLoading(false);
        if(response.data){
          setCartData(response.data);
        }else{
          setCartData([]);
        }
      })
      .catch((error) => {
        console.log("error",error);
        setLoading(false);
        if (error.response.status == 401) {
          AsyncStorage.removeItem('user_id');
          AsyncStorage.removeItem('token');
          setToast({text: 'Your Session is expired. You need to login again.', color: colors.warning});
          navigation.navigate('Auth')
        }else{
          setToast({text: 'Something went wrong.', color: 'red'});
        }  
      })
  }


  const deleteItem=()=>{
    const formValues = {
      "user_ID": userId,
      "cartItem_ID": cartitemid,
    }
    console.log("formValues",formValues);
    axios.patch("/api/carts/remove", formValues)
      .then((response) => {
        console.log("userId",userId);
        if(userId){
          getCartItems(userId);
        }
        setRemoveFromCart(false)
      })
      .catch((error) => {
        if (error.response.status == 401) {
          AsyncStorage.removeItem('user_id');
          AsyncStorage.removeItem('token');
          setToast({text: 'Your Session is expired. You need to login again.', color: colors.warning});
          navigation.navigate('Auth')
        }else{
          setToast({text: 'Something went wrong.', color: 'red'});
        }  
      });
  }

  const deleteItemFromCart=(cartitemid)=>{
    setRemoveFromCart(true);
    setCartItemId(cartitemid);
  }


  const addToWishList = (productid) => {
    const wishValues = {
      "user_ID": userId,
      "product_ID": productid,
    }
    axios.post('/api/wishlist/post', wishValues)
      .then((response) => {
        console.log("response check",response);
        if(userId){
          getCartItems(userId);
        }
        dispatch(getList('featured',userId,6));
        dispatch(getList('exclusive',userId,6));
        dispatch(getList('discounted',userId,10));
        // dispatch(getWishList(user_id));
        setToast({text: response.data.message, color: 'green'});
      })
      .catch((error) => {
        if (error.response.status == 401) {
          AsyncStorage.removeItem('user_id');
          AsyncStorage.removeItem('token');
          setToast({text: 'Your Session is expired. You need to login again.', color: colors.warning});
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
  }

  const onChange=(number,product_ID,venndor_id)=>{
    const quantity = parseInt(number);
    const formValues = {
      "user_ID": userId,
      "product_ID": product_ID,
      "vendor_ID" : venndor_id,
      "quantityAdded": quantity,
    }
    console.log("formValues",formValues);
    axios.patch("/api/carts/quantity", formValues)
      .then((response) => {
        console.log("response",response);
        setIncreaseCartNum(formValues.quantityAdded);
        if(userId){
          getCartItems(userId);
        }
        
      })
      .catch((error) => {
        if (error.response.status == 401) {
          AsyncStorage.removeItem('user_id');
          AsyncStorage.removeItem('token');
          setToast({text: 'Your Session is expired. You need to login again.', color: colors.warning});
          navigation.navigate('Auth')
        }else{
          setToast({text: 'Something went wrong.', color: 'red'});
        }  
      })
  }
  console.log("cartData",cartData);
  var alphabet =["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    return (
      <React.Fragment>
        <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'My Cart'}
          navigate={navigation.navigate}
          openControlPanel={() => openControlPanel}
        />
        <View style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
        { !loading ?
            <KeyboardAwareScrollView contentContainerStyle={{}} style={{flex:1}} keyboardShouldPersistTaps="always" extraScrollHeight={130}  enableAutomaticScroll enableOnAndroid	>
            <View style={{flex:1}}>
              <View style={styles.cartdetails}>
                    {cartData  && cartData.vendorOrders && cartData.vendorOrders.length>0?
                      cartData.vendorOrders.map((vendor, i) => {
                        return (
                          <View style={{backgroundColor:"#fff",marginBottom:15}}>
                            <View style={{backgroundColor:colors.theme}}>
                              <Text style={[commonStyles.headerText,{color:"#fff"}]}>{vendor.vendorName}</Text>
                            </View>  
                          {vendor.cartItems.map((item,index)=>{
                            return(
                              <View key={index}>
                                <View key={index} style={styles.proddetails}>
                                  <View style={styles.flxdir}>
                                    <View style={styles.flxpd}>
                                      <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item.product_ID._id})}>
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
                                      <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item.product_ID._id })}>
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
                                                <Text style={styles.ogprice}> {item.product_ID.discountedPrice * item.quantity}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
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
                                      <Counter start={item.quantity} min={1} max={100}
                                        buttonStyle={{
                                          borderColor: colors.theme,
                                          borderWidth: 1,
                                          borderRadius: 25,
                                          width: 15,
                                          height: 7
                                        }}
                                        buttonTextStyle={{
                                          color: colors.theme,
                                        }}
                                        countTextStyle={{
                                          color: colors.theme,
                                        }}
                                        size={5}
                                        onChange={(e)=>onChange(e,item.product_ID._id,vendor.vendor_id)} 
                                        />
                                  </View>
                                  <View style={styles.flxmg2}>
                                    <View style={styles.proddeletes}>
                                      <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => addToWishList(item.product_ID._id)} >
                                        <Icon size={20} name={item.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={colors.theme} />
                                      </TouchableOpacity>
                                      <Icon
                                        onPress={() => deleteItemFromCart(item._id)}
                                        name="delete"
                                        type="AntDesign"
                                        size={20}
                                        color="#ff4444"
                                        iconStyle={styles.iconstyle}
                                      />
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
                                <Text numberOfLines={1} style={styles.totaldata}>{vendor.vendorName}</Text>
                                <Text style={styles.totaldata}> Total</Text>
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
                              <Text style={styles.totalpriceincart}>{currency} 0</Text>
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
                            <View>
                              {minvalueshipping <= vendor.vendor_afterDiscountTotal ?
                                null
                                :
                                <View>
                                  <Text style={styles.minpurchase}>Minimum order should be {currency} {minvalueshipping} to Checkout & Place Order.
                                      {"\n"}<Text style={styles.minpurchaseadd}>Add more products worth {currency} {(minvalueshipping - (vendor.total)).toFixed(2)} to proceed further.</Text> </Text>
                                </View>
                              }
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
                      <Button
                            onPress={() => navigation.navigate('Dashboard')}
                            title={"Add Products"}
                            buttonStyle={styles.buttonshopping}
                            containerStyle={styles.continueshopping}
                      />
                    </View>   
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
                      
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.6 }}>
                          <Text style={styles.totaldata}>Total Delivery Charges </Text>
                        </View> 
                        <View style={{ flex: 0.4 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <Text style={styles.totalpriceincart}>{currency} {cartData.paymentDetails.shippingCharges && cartData.paymentDetails.shippingCharges.toFixed(2)}</Text>
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
                      <View style={{ flex: 1, marginTop: 10 }}>
                        <Text style={styles.totalsubtxt}>Part of your order qualifies for Free Delivery </Text>
                      </View>

                      <View>
                        {minvalueshipping <= cartData.paymentDetails.afterDiscountTotal ?
                          <View>
                            <Button
                              onPress        = {() => navigation.navigate('AddressDefaultComp', { userID: userId,"delivery":true})}
                              title          = {"PROCEED TO CHECKOUT"}
                              buttonStyle    = {styles.button1}
                              containerStyle = {styles.buttonContainer1}
                            />
                            <View style={styles.flxdata}>
                              <View style={{ flex: 1 }}>
                                <Text style={styles.purchasep}>100% Purchase Protection | <Text style={styles.freshnsecuretxt}>Secure Payment </Text></Text>
                              </View>
                            </View>
                          </View>
                          :
                          <View>
                            <Text style={styles.minpurchase}>Minimum order should be {currency} {minvalueshipping} to Checkout & Place Order.
                                 {"\n"}<Text style={styles.minpurchaseadd}>Add more products worth {currency} {(minvalueshipping - totalPrice).toFixed(2)} to proceed further.</Text> </Text>
                          </View>
                        }
                      </View>
                    </View>
                    :
                    null
                }
              </View>
            </View>
          </KeyboardAwareScrollView>
          :
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator size="large" color={colors.theme} />
          </View>}
          <Footer />
          <Modal isVisible={removefromcart}
            onBackdropPress={() => setRemoveFromCart(false)}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
              <View style={{ justifyContent: 'center', backgroundColor: "transparent", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
                Are you sure you want to remove this from cart?
              </Text>
              <View style={styles.cancelbtn}>
                <View style={styles.cancelvwbtn}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => setRemoveFromCart(false)}
                      titleStyle={styles.buttonText}
                      title="NO"
                      buttonStyle={styles.buttonRED}
                      containerStyle={styles.buttonContainer2}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.ordervwbtn}>
                    <Button
                      onPress={() => deleteItem()}
                      titleStyle={styles.buttonText1}
                      title="Yes"
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer2}
                    />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </React.Fragment>
    );
})





