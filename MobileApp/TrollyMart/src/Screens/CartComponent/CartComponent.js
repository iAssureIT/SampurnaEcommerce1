import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,ActivityIndicator,
  Dimensions
} from 'react-native';
import { Button, Icon, }  from "react-native-elements";
import Modal              from "react-native-modal";
import HeaderBar5         from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
// import Footer from '../../ScreenComponents/Footer/Footer.js';
import {Footer}             from '../../ScreenComponents/Footer/Footer1.js';
import Notification       from '../../ScreenComponents/Notification/Notification.js'
import styles             from '../../AppDesigns/currentApp/styles/ScreenStyles/Cartstyles.js';
import { colors }         from '../../AppDesigns/currentApp/styles/styles.js';
import axios              from 'axios';
import Counter            from "react-native-counters";
import {withCustomerToaster}  from '../../redux/AppState.js';

import { getList } 		        from '../../redux/productList/actions';
import { connect,
  useDispatch,
  useSelector }         from 'react-redux';

  const window = Dimensions.get('window');
// export default class CartComponent extends React.Component {
  export const CartComponent = withCustomerToaster((props)=>{
    console.log("props",props);
    const dispatch 		= useDispatch();
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
    const [totalIndPrice,setTotalIndPrice] =useState(0);
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
    const [currency,setCurrency] = useState('');
    const [cartitemid,setCartItemId] = useState('');
    const [incresecartnum,setIncreaseCartNum] = useState('');

    

  useEffect(() => {
    getData()
  },[props]); 

  const getData=()=>{
    const { product_ID, userId } = route.params;
    setLoading(true);
    getshippingamount(startRange,limitRange);
    setUserId(userId);
    setProductId(product_ID)
    getCartItems(userId);
    getdiscounteddata(startRange,limitRange);
  }

  const getdiscounteddata=(startRange, limitRange)=>{
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

const getshippingamount=(startRange, limitRange)=>{
    axios.get('/api/shipping/get/list-with-limits/' + startRange + '/' + limitRange)
      .then((response) => {
        setMinValueShipping(response.data[0].shippingcosting);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
 
const getCartItems=(userId)=>{
    axios.get('/api/Carts/get/cartproductlist/' + userId)
      .then((response) => {
        setLoading(false);
        if(response.data.length > 0) {
          setSubTotalItems(response.data[0].cartItems.length);
          setCartData(response.data[0].cartItems);
          setSubTotal(response.data[0].cartTotal);
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


  const deleteItem=()=>{
    const formValues = {
      "user_ID": userId,
      "cartItem_ID": cartitemid,
    }
    console.log("formValues",formValues);
    axios.patch("/api/carts/remove", formValues)
      .then((response) => {
        getCartItems(userId);
        setRemoveFromCart(false)
      })
      .catch((error) => {
        console.log('error', error);
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
        getCartItems(userId);
        dispatch(getList('featured',userId,6));
        dispatch(getList('exclusive',userId,6));
        dispatch(getList('discounted',userId,10));
        // dispatch(getWishList(user_id));
        setToast({text: response.data.message, color: 'green'});
      })
      .catch((error) => {
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
        getCartItems(userId);
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

    return (
      <React.Fragment>
        <HeaderBar5
          goBack={navigation.goBack}
          headerTitle={'My Cart'}
          navigate={navigation.navigate}
          openControlPanel={() => openControlPanel}
        />
        <View style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
          <ScrollView contentContainerStyle={{}} style={{flex:1}} keyboardShouldPersistTaps="handled" >
            <View style={{flex:1}}>
            { !loading ?
              <View style={styles.cartdetails}>
                    {cartData && cartData.length > 0 ?
                      cartData.map((item, i) => {
                        return (
                          <View key={i}>
                            <View key={i} style={styles.proddetails}>
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
                                  <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item.product_ID })}>
                                    {item.productDetail.productNameRlang ?
                                    <Text style={{fontFamily:'aps_dev_priyanka',fontWeight:'Bold',fontSize:20,flexWrap:'wrap'}}>{item.productDetail.productNameRlang}</Text>
                                    : 
                                    <Text style={styles.productname}>{item.productDetail.productName}</Text>
                                    }
                                    </TouchableOpacity>
                                  <View style={styles.productdets}>
                                    <Icon
                                      name={item.productDetail.currency}
                                      type="font-awesome"
                                      size={12}
                                      color="#666"
                                      iconStyle={styles.iconstyle}
                                    />
                                    <Text style={styles.proddetprice}>{item.productDetail.discountedPrice} Per {item.productDetail.size}  {item.productDetail.unit.toUpperCase()}</Text>
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
                                    <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => addToWishList(item.product_ID)} >
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
                                    item.productDetail.availableQuantity > 0 ?
                                      <View style={styles.productdetsprice}>
                                        <Icon
                                           name={item.productDetail.currency}
                                          type="font-awesome"
                                          size={17}
                                          color="#666"
                                          iconStyle={styles.iconstyle}
                                        />
                                        {/* <Text id={item._id} value={this.state['quantityAdded|' + item._id]} style={styles.proprice}> */}
                                       <Text id={item._id}  style={styles.proprice}>
                                          {item.productDetail.size > 0 ?
                                            item.productDetail.discountedPrice * item.quantity
                                            :
                                            item.productDetail.discountedPrice
                                          }
                                        </Text>
                                      </View>
                                      :
                                      <Text style={styles.totaldata}>SOLD OUT</Text>
                                  }
                                </View>
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
                        <View style={{ flex: 0.7 }}>
                          <Text style={styles.totaldata}>Subtotal ({subtotalitems} Item(s)) </Text>
                        </View>
                        <View style={{ flex: 0.3 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Icon
                               name={currency}
                              type="font-awesome"
                              size={16}
                              color="#666"
                              iconStyle={styles.iconstyle}
                            />
                            <Text style={styles.totalpriceincart}>{totaloriginalprice}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.7 }}>
                          <Text style={styles.totaldata}>Discount </Text>
                        </View> 
                        <View style={{ flex: 0.3 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
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
                        <Text style={styles.totalpriceincart}>{discountvalue > 1 ? discountvalue : 0.00}</Text>
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
                        <View style={{ flex: 0.7 }}>
                          <Text style={styles.totaldata}>Grand Total </Text>
                        </View>
                        <View style={{ flex: 0.3 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Icon
                              name={currency}
                              type="font-awesome"
                              size={15}
                              color="#666"
                              iconStyle={styles.iconstyle}
                            />
                            {/* <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{amountofgrandtotal}</Text> */}
                            <Text style={styles.totalpriceincart}>{  discountdata !== undefined ?
                                totaloriginalprice && discountin === "Percent" ?
                                    totaloriginalprice - (totaloriginalprice * discountvalue)/ 100
                                    : totaloriginalprice - discountvalue
                                : totaloriginalprice}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1, marginTop: 10 }}>
                        <Text style={styles.totalsubtxt}>Part of your order qualifies for Free Delivery </Text>
                      </View>
                      <View>
                        {minvalueshipping <= totaloriginalprice ?
                          <View>
                            <Button
                              onPress        = {() => navigation.navigate('AddressDefaultComp', { userID: userId,"delivery":true })}
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
              :
              <View style={{ height: window.height, alignItems: 'center',justifyContent:"center" }}>
                <ActivityIndicator size="large" color={colors.theme} />
              </View>}
            </View>
          </ScrollView>
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

          <Modal isVisible={wishlisted}
            onBackdropPress={() => setWishListed(false)}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
              <View style={{ justifyContent: 'center', backgroundColor: "transparent", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
                Product is move to wishlist.
                </Text>
              <View style={styles.cancelbtn}>
                <View style={styles.cancelvwbtn}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => setWishListed(false)}
                      titleStyle={styles.buttonText1}
                      title="OK"
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer2}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </React.Fragment>
    );
})



