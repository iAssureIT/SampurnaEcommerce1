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
// import Footer from '../../ScreenComponents/Footer/Footer.js';
import {Footer}               from '../../ScreenComponents/Footer/Footer1.js';
import Notification           from '../../ScreenComponents/Notification/Notification.js'
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/Cartstyles.js';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import axios                  from 'axios';
import Counter                from "react-native-counters";
import {withCustomerToaster}  from '../../redux/AppState.js';
// import {FormInput}          from '../../ScreenComponents/FormInput/FormInput';
import {FormButton}           from '../../ScreenComponents/FormButton/FormButton';
import { getList } 		        from '../../redux/productList/actions';
import { connect,
  useDispatch,
  useSelector }               from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import commonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';


  const window = Dimensions.get('window');
// export default class CartComponent extends React.Component {
  export const CartComponent = withCustomerToaster((props)=>{
    console.log("props",props);
    const dispatch = useDispatch();
    const {setToast,navigation,route} = props; 
    const [cartData, setCartData] = useState('');
    const [totaloriginalprice, setOrignalPrice] = useState(0);
    const [startRange, setStartRange] = useState(0);
    const [limitRange, setLimitRange] = useState(10);
    const [removefromcart,setRemoveFromCart] =useState(false);
    const [wishlisted,setWishListed] =useState(false);
    const [loading,setLoading] =useState(false);
    const [shippingCharges,setShippingCharges] =useState(0);
    const [quantityAdded,setQuantityAdded] =useState(0);
    const [totalPrice,setTotalPrice] =useState(0);
    const [userId,setUserId] =useState(''); 
    const [product_ID,setProductId] =useState(''); 
    const [discountdata,setDiscountData] = useState('');
    const [discounttype,setDiscountType] = useState('');
    const [discountin,setDiscountIn] = useState('');
    const [discountvalue,setDiscountValue] = useState('');
    const [amountofgrandtotal,setAmountofgrandtotal] = useState('');
    const [minvalueshipping,setMinValueShipping] = useState('');
    const [subtotalitems,setSubTotalItems] = useState('');
    const [subtotal,setSubTotal] = useState('');
    const [cartitemid,setCartItemId] = useState('');
    const [incresecartnum,setIncreaseCartNum] = useState('');
    const [coupenCode,setCoupenCode] = useState('');
    const [coupenPrice,setCoupenPrice] = useState(0);
    const store = useSelector(store => ({
      preferences     : store.storeSettings.preferences,
    }));
  
    const {currency}=store.preferences;
    

  useEffect(() => {
    getData()
  },[props]); 

  const getData=()=>{
    const { product_ID, userId } = route.params;
    if(userId){
      setLoading(true);
      getshippingamount(startRange,limitRange);
      setUserId(userId);
      setProductId(product_ID)
      console.log("userId ===>",userId)
      if(userId){
        getCartItems(userId);
      }
      // getdiscounteddata(startRange,limitRange);
    } 
  }

  const getdiscounteddata=(startRange, limitRange)=>{
    axios.get('/api/discount/get/list-with-limits/' + startRange + '/' + limitRange)
        .then((response) => {
            console.log('tableData = ', response.data);
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

const getshippingamount=(startRange, limitRange)=>{
    axios.get('/api/shipping/get/list-with-limits/' + startRange + '/' + limitRange)
      .then((response) => {
        setMinValueShipping(response.data[0].shippingcosting);
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
 
const getCartItems=(userId)=>{
    axios.get('/api/carts/get/cartproductlist/' + userId)
      .then((response) => {
        console.log("response",response);
        setLoading(false);
        if(response.data.length > 0){
          var quantity  = 0;
          var cartTotal = 0;
          var discount  = 0;
          var total     = 0;
          for (var i = 0;  i < response.data.length; i++) {
            quantity  +=response.data[i].cartQuantity;
            cartTotal +=response.data[i].cartTotal;
            discount  +=response.data[i].discount;
            total     +=response.data[i].total;
          }
          setSubTotalItems(quantity);
          setCartData(response.data);
          setSubTotal(cartTotal);
          setDiscountValue(discount);
          gettotalcount(response.data[0].cartItems);
          setTotalPrice(total)
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
          setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
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
          setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
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

  const onChange=(number,product_ID)=>{
    const quantity = parseInt(number);
    const formValues = {
      "user_ID": userId,
      "product_ID": product_ID,
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
          setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
          navigation.navigate('Auth')
        }else{
          setToast({text: 'Something went wrong.', color: 'red'});
        }  
      })
  }

  const applyCoupen=()=>{
    if(coupenPrice === 0){
      axios.get('/api/coupon/get/one_by_couponcode/'+coupenCode+"/"+userId)
      .then(res=>{
        console.log("res",res);
        if(res.data.message){
          setToast({text: res.data.message, color:'red'});
        }else{
            if(totalPrice > res.data.minPurchaseAmount){
              if(res.data.coupenin === 'Percent'){
                console.log("res.data.coupenvaluE",res.data.coupenvalue);
                console.log("totalPrice",totalPrice);
                var discount = ((res.data.coupenvalue/100) * totalPrice).toFixed(2);
                console.log("discount",discount);
                setCoupenPrice(discount);
                setTotalPrice(totalPrice-discount);
                setToast({text: "Coupen Applied", color:'green'});
                setCoupenCode('');
                console.log("discount",discount);
              }else{
                var discount = totalPrice - res.data.coupenvalue;
                setCoupenPrice(res.data.coupenvalue);
                setTotalPrice(discount);
                setCoupenCode('');
                setToast({text: "Coupen Applied", color:'green'});
                console.log("discount",discount);
              }
              // setToast({text: "Your order total should be greater than AED " + res.data.minPurchaseAmount, color:colors.warning});
            }else{
              setToast({text: "Your order total should be greater than AED " + res.data.minPurchaseAmount, color:'red'});
            }
        }
      })
      .catch(err=>{
        setCoupenCode('');
        console.log("err",err);
      })
    }else{
      setCoupenCode('');
      setToast({text: "Coupen already applied", color:colors.warning});
    }  
  }

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
                    {cartData && cartData.length > 0 ?
                      cartData.map((vendor, i) => {
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
                                      <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item.product_ID })}>
                                        {item.productDetail.productImage.length > 0 ?
                                          <Image
                                            style={styles.imgwdht}
                                            source={{ uri: item.productDetail.productImage[0] }}
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
                                        {item.productDetail.productNameRlang ?
                                        <Text style={{fontFamily:'aps_dev_priyanka',fontWeight:'Bold',fontSize:20,flexWrap:'wrap'}}>{item.productDetail.productNameRlang}</Text>
                                        : 
                                        <Text style={styles.productname}>{item.productDetail.productName}</Text>
                                        }
                                        </TouchableOpacity>
                                  <View style={[styles.flx1, styles.prdet,{marginVertical:10}]}>
                                    {item.productDetail.availableQuantity > 0 ?
                                      <View style={[styles.flxdir]}>
                                        <View style={[styles.flxdir]}>
                                          <Text style={styles.ogprice}>{currency} </Text>
                                          {item.productDetail.discountPercent > 0 &&<Text style={styles.discountpricecut}>{item.productDetail.originalPrice * item.quantity}</Text>}
                                        </View>
                                        <View style={[styles.flxdir,{alignItems:"center"}]}>
                                            <Text style={styles.ogprice}> {item.productDetail.discountedPrice * item.quantity}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                            </Text>
                                        </View>
                                        {item.productDetail.discountPercent > 0 &&<View style={[styles.flxdir,{alignItems:"center"}]}>
                                            <Text style={styles.ogprice}>( {item.productDetail.discountPercent} % OFF) <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
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
                                      width: 20,
                                      height: 10
                                    }}
                                    buttonTextStyle={{
                                      color: colors.theme,
                                    }}
                                    countTextStyle={{
                                      color: colors.theme,
                                    }}
                                    size={5}
                                    onChange={(e)=>onChange(e,item.productDetail._id)} 
                                    />
                                </View>
                                    <View style={styles.flxmg2}>
                                      <View style={styles.proddeletes}>
                                        <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => addToWishList(item.productDetail._id)} >
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
                                      {
                                        // item.productDetail.availableQuantity > 0 ?
                                        //   <View style={styles.productdetsprice}>
                                        //     <Icon
                                        //        name={item.productDetail.currency}
                                        //       type="font-awesome"
                                        //       size={17}
                                        //       color="#666"
                                        //       iconStyle={styles.iconstyle}
                                        //     />
                                        //     {/* <Text id={item._id} value={this.state['quantityAdded|' + item._id]} style={styles.proprice}> */}
                                        //    <Text id={item._id}  style={styles.proprice}>
                                        //       {item.quantity > 0 ?
                                        //         item.productDetail.discountedPrice * item.quantity
                                        //         :
                                        //         item.productDetail.discountedPrice
                                        //       }
                                        //     </Text>
                                        //   </View>
                                        //   :
                                        //   <Text style={styles.totaldata}>SOLD OUT</Text>
                                      }
                                    </View>
                                  </View>
                                </View>
                                
                              </View>
                            )
                          })}
                          <View style={styles.totaldetails}>
                            <View style={styles.flxdata}>
                              <View style={{ flex: 0.5 }}>
                                <Text style={styles.totaldata}>Subtotal ({vendor.cartQuantity} Item(s)) </Text>
                              </View>
                              <View style={{ flex: 0.5 }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                  {/* <Icon
                                    name={currency}
                                    type="font-awesome"
                                    size={16}
                                    color="#666"
                                    iconStyle={styles.iconstyle}
                                  /> */}
                                  <Text style={styles.totalpriceincart}>{currency} {vendor.cartTotal}</Text>
                                </View>
                              </View>
                            </View>
                            <View style={styles.flxdata}>
                              <View style={{ flex: 0.5 }}>
                                <Text style={styles.totaldata}>You Saved </Text>
                              </View> 
                              <View style={{ flex: 0.5 }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                  <Text style={styles.totalpriceincart}> - </Text>
                              <Text style={styles.totalpriceincart}>{currency} {vendor.discount > 1 ? vendor.discount.toFixed(2) : 0.00}</Text>
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
                              <View style={{ flex: 0.5 }}>
                                <Text style={styles.totaldata}>Delivery Charges </Text>
                              </View> 
                              <View style={{ flex: 0.5 }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                              <Text style={styles.totalpriceincart}>{currency} 0</Text>
                                </View>
                              </View>
                            </View>
                            <View style={styles.flxdata}>
                              <View style={{ flex: 0.5 }}>
                                <Text style={styles.totaldata}>Sub Total {alphabet[i]}</Text>
                              </View>
                              <View style={{ flex: 0.5 }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                  <Text style={styles.totalpriceincart}>{currency} {vendor.total}</Text>
                                </View>
                              </View>
                            </View>
                            <View style={{ flex: 1, marginTop: 10 }}>
                              <Text style={styles.totalsubtxt}>Part of your order qualifies for Free Delivery </Text>
                            </View>
                            <View>
                              {minvalueshipping <= totaloriginalprice ?
                                null
                                :
                                <View>
                                  <Text style={styles.minpurchase}>Minimum order should be ₹{minvalueshipping} to Checkout & Place Order.
                                      {"\n"}<Text style={styles.minpurchaseadd}>Add more products worth ₹{minvalueshipping - totaloriginalprice} to proceed further.</Text> </Text>
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
                  cartData && cartData.length > 0 && subtotalitems ?
                    <View style={styles.totaldetails}>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.5 }}>
                          <Text style={styles.totaldata}>Subtotal ({subtotalitems} Item(s)) </Text>
                        </View>
                        <View style={{ flex: 0.5 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            {/* <Icon
                               name={currency}
                              type="font-awesome"
                              size={16}
                              color="#666"
                              iconStyle={styles.iconstyle}
                            /> */}
                            <Text style={styles.totalpriceincart}>{currency} {subtotal}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.5 }}>
                          <Text style={styles.totaldata}>You Saved </Text>
                        </View> 
                        <View style={{ flex: 0.5 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.totalpriceincart}> - </Text>
                          { 
                          // discountin === "Amount" ? 
                            // <Icon
                            //   name={currency}
                            //   type="font-awesome"
                            //   size={15}
                            //   color="#666"
                            //   iconStyle={styles.iconstyle}
                            // />
                          // : null 
                        }
                        <Text style={styles.totalpriceincart}>{currency} {discountvalue > 1 ? discountvalue.toFixed(2) : 0.00}</Text>
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
                        <View style={{ flex: 0.5 }}>
                          <Text style={styles.totaldata}>TAX </Text>
                        </View> 
                        <View style={{ flex: 0.5 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          { 
                          // discountin === "Amount" ? 
                            // <Icon
                            //   name={currency}
                            //   type="font-awesome"
                            //   size={15}
                            //   color="#666"
                            //   iconStyle={styles.iconstyle}
                            // />
                          // : null 
                        }
                        <Text style={styles.totalpriceincart}>{currency} 0</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.5 }}>
                          <Text style={styles.totaldata}>Coupon</Text>
                        </View> 
                        <View style={{ flex: 0.5 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincart}> - </Text>
                          { 
                          // discountin === "Amount" ? 
                            // <Icon
                            //   name={currency}
                            //   type="font-awesome"
                            //   size={15}
                            //   color="#666"
                            //   iconStyle={styles.iconstyle}
                            // />
                          // : null 
                        }
                        <Text style={styles.totalpriceincart}>{currency} {coupenPrice}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.5 }}>
                          <Text style={styles.totaldata}>Delivery Charges </Text>
                        </View> 
                        <View style={{ flex: 0.5 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <Text style={styles.totalpriceincart}>{currency} 0</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.5 }}>
                          <Text style={styles.totaldata}>Grand Total</Text>
                        </View>
                        <View style={{ flex: 0.5 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.totalpriceincart}>{currency} {totalPrice}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1, marginTop: 10 }}>
                        <Text style={styles.totalsubtxt}>Part of your order qualifies for Free Delivery </Text>
                      </View>
                      {coupenPrice === 0 &&<View style={{flex:1,flexDirection:"row",marginTop:15,height:50}}>
                        <View style={{flex:.7}}>
                          <Input
                            placeholder           = "Enter promotional code"
                            onChangeText          = {(text)=>setCoupenCode(text)}
                            autoCapitalize        = "none"
                            keyboardType          = "email-address"
                            inputContainerStyle   = {styles.containerStyle}
                            containerStyle        = {{paddingHorizontal:0}}
                            placeholderTextColor  = {'#bbb'}
                            inputStyle            = {{fontSize: 16}}
                            inputStyle            = {{textAlignVertical: "top"}}
                            autoCapitalize        = 'characters'
                            value                 = {coupenCode}
                          />
                        </View>  
                        <View style={{flex:.3}}>
                          <FormButton 
                            onPress    = {()=>applyCoupen()}
                            title       = {'Apply'}
                            background  = {true}
                          /> 
                        </View>  
                      </View>}
                      <View>
                        {minvalueshipping <= totaloriginalprice ?
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
                            <Text style={styles.minpurchase}>Minimum order should be ₹{minvalueshipping} to Checkout & Place Order.
                                 {"\n"}<Text style={styles.minpurchaseadd}>Add more products worth ₹{minvalueshipping - totaloriginalprice} to proceed further.</Text> </Text>
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





