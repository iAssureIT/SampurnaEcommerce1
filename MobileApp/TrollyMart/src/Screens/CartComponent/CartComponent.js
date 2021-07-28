import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,ActivityIndicator,
} from 'react-native';
import {Button,Icon,Tooltip}              from "react-native-elements";
import Modal                      from "react-native-modal";
import styles                     from '../../AppDesigns/currentApp/styles/ScreenStyles/Cartstyles.js';
import {colors}                   from '../../AppDesigns/currentApp/styles/styles.js';
import axios                      from 'axios';
import Counter                    from "react-native-counters";
import {withCustomerToaster}      from '../../redux/AppState.js';
import {getList} 		              from '../../redux/productList/actions';
import {useDispatch,
        useSelector}              from 'react-redux';
import {KeyboardAwareScrollView}  from 'react-native-keyboard-aware-scroll-view'
import commonStyles               from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import AsyncStorage               from '@react-native-async-storage/async-storage';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import SearchSuggetion          from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import {FormButton}         from '../../ScreenComponents/FormButton/FormButton';
import { getCartCount}                      from '../../redux/productList/actions';
import { Platform } from 'react-native';
const window = Dimensions.get('window');

export const CartComponent = withCustomerToaster((props)=>{
  const dispatch = useDispatch();
  const {setToast,navigation,route} = props; 
  const [cartData,setCartData] = useState('');
  const [startRange,setStartRange] = useState(0);
  const [limitRange,setLimitRange] = useState(10);
  const [removefromcart,setRemoveFromCart] =useState(false);
  const [loading,setLoading] =useState(true);
  const [userId,setUserId] =useState(''); 
  const [minvalueshipping,setMinValueShipping] = useState('');
  const [cartitemid,setCartItemId] = useState('');
  const [deleteVendor_id,setDeleteVendorId] = useState('');
  const [tooltipSize, setTooltipSize] = useState({ w: 500, h: 500 })
  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    globalSearch    : store.globalSearch,
    location        : store.location
  }));
  const {globalSearch,location}=store;
  const {currency}=store.preferences;


  const minusIcon = (isDisabled) => {
    return <Icon name='minus' type='feather' size={20} color={isDisabled? colors.cartButton : "#fff"} />
  };
  
  const plusIcon = (isPlusDisabled) => {
    return <Icon name='plus' type='feather' size={20} color={"#fff"} />
  };

  useEffect(() => {
    getData()
  },[props]); 

  const getData=()=>{
    const {userId} = route.params;
    if(userId){
      setLoading(true);
      getshippingamount(startRange,limitRange);
      setUserId(userId);
      if(userId){
        getCartItems(userId);
      }
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
        setToast({text: 'Something went wrong1.', color: 'red'});
      }  
    });
 }
 
  const getCartItems=(userId)=>{
    axios.get('/api/carts/get/cartproductlist/' + userId)
      .then((response) => {
        console.log("response.data",response.data);
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
      "user_ID"      : userId,
      "cartItem_ID"  : cartitemid,
      "vendor_ID"    : deleteVendor_id
    }
    axios.patch("/api/carts/remove", formValues)
      .then((response) => {
        if(userId){
          dispatch(getCartCount(userId));
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
          setToast({text: 'Something went wrong3.', color: 'red'});
        }  
      });
  }

  const deleteItemFromCart=(cartitemid,vendor_id)=>{
    setRemoveFromCart(true);
    setCartItemId(cartitemid);
    setDeleteVendorId(vendor_id);
  }


  const addToWishList = (productid,vendor) => {
    const wishValues = {
      "user_ID"           : userId,
      "product_ID"        : productid,
      "userDelLocation"   : {
        "lat"               : location?.address?.latlong?.lat, 
        "long"              : location?.address?.latlong?.lng,
        "delLocation"       : location?.address?.addressLine2
      },
      "vendor_id"          : vendor.vendor_id._id,
      "vendorLocation_id"  : vendor.vendorLocation_id,
    }
    axios.post('/api/wishlist/post', wishValues)
    .then((response) => {
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
        setToast({text: 'Something went wrong4.', color: 'red'});
      }  
    })
  }

  const onChange=(number,product_ID,venndor_id)=>{
    const quantity = parseInt(number);
    const formValues = {
      "user_ID"       : userId,
      "product_ID"    : product_ID,
      "vendor_ID"     : venndor_id,
      "quantityAdded" : quantity,
    }
    axios.patch("/api/carts/quantity", formValues)
      .then((response) => {
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
          setToast({text: 'Something went wrong5.', color: 'red'});
        }  
      })
  }

  const goToProductList=(vendor,sectionUrl)=>{
    var payload ={
        "vendorID"          : vendor.vendor_id._id,
        "sectionUrl"        : vendor.cartItems[0].product_ID.section.toLowerCase(),
        "startRange"        : 0,
        "limitRange"        : 8,
      } 
    dispatch(getCategoryWiseList(payload));
    
    navigation.navigate('VendorProducts',{vendor:vendor,sectionUrl:vendor.cartItems[0].product_ID.section.toLowerCase(),section:vendor.cartItems[0].product_ID.section,vendorLocation_id:vendor.vendorLocation_id});
}

  if(cartData && cartData.vendorOrders && cartData.vendorOrders.length>0){
  var disabled = cartData.vendorOrders.every(el => el.vendor_afterDiscountTotal >= cartData.minOrderAmount);
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
      <View style={{flex:1,backgroundColor:"#f1f1f1"}}>
      { !loading ?
      globalSearch.search ?
        <SearchSuggetion />
        :
        <KeyboardAwareScrollView contentContainerStyle={{}} style={{flex:1}} keyboardShouldPersistTaps="always" extraScrollHeight={130}  enableAutomaticScroll enableOnAndroid	>
         <View style={{flex:1}}>
          {cartData && cartData.vendorOrders && cartData.vendorOrders.length>0?
            <View style={styles.cartdetails}>
            {cartData.vendorOrders.map((vendor, i) => {
              return (
              <View style={{backgroundColor:"#fff",paddingBottom:15,paddingTop:15}}>
                <View style={{paddingHorizontal:15}}>
                  <Text style={[commonStyles.headerText,{alignSelf:"flex-start",fontSize:15,marginBottom:10}]}>{vendor.vendor_id.companyName}</Text>
                </View>  
                {vendor.cartItems.map((item,index)=>{
                  return(
                    <View key={index}>
                      <View key={index} style={styles.proddetails}>
                        <View style={styles.flxdir}>
                          <View style={styles.flxmg}>
                            <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item.product_ID._id })}>
                              {item.product_ID.productNameRlang ?
                              <Text style={{fontFamily:'aps_dev_priyanka',fontWeight:'Bold',fontSize:20,flexWrap:'wrap'}}>{item.product_ID.productNameRlang}</Text>
                              : 
                              <Text numberOfLines={2} style={styles.productname}>{item.product_ID.productName}</Text>
                              }
                              </TouchableOpacity>
                            <View style={[styles.flx1, styles.prdet,{marginVertical:5}]}>
                              {item.product_ID.availableQuantity > 0 ?
                                <View style={[styles.flxdir,{alignItems:'flex-end'}]}>
                                    <Text style={styles.currency}>{currency} </Text>                                    
                                  {item.product_ID.discountPercent > 0 &&<Text style={styles.discountpricecut}>{(item.product_ID.originalPrice).toFixed(2)}</Text>}
                                    <Text style={[styles.currency,{fontFamily:"Montserrat-SemiBold"}]}> {(item.product_ID.discountedPrice).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                    </Text>
                                  {item.product_ID.discountPercent > 0 &&
                                      <Text style={styles.offprice}>{item.product_ID.discountPercent} % <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                      </Text>
                                  }
                                </View>
                                :
                                <Text style={styles.totaldata}>SOLD OUT</Text>
                              }
                            </View>                            
                          </View>
                            <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item.product_ID._id})}>
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
                        <View style={styles.flxdir}>
                          <View style={[styles.flx5,]}>
                            <Counter start={item.quantity} min={1} max={100}
                                minusIcon={minusIcon} 
                                plusIcon={plusIcon} 
                                buttonStyle={{
                                  borderColor: colors.cartButton,
                                  borderWidth: 1,
                                  borderRadius: 25,
                                  minWidth: 30,
                                  minHeight: 30,
                                  backgroundColor: colors.cartButton,
                                }}
                                buttonTextStyle={{
                                  color: '#fff',
                                  fontSize:20
                                }}
                                countTextStyle={{
                                  color: colors.theme,
                                }}
                                countTextStyle={{
                                  color: colors.theme,
                                }}
                                onChange={(e)=>onChange(e,item.product_ID._id,vendor.vendor_id._id)} 
                                /> 
                                {/* <CounterInput
                                  onChange={(counter) => {
                                    console.log("onChange Counter:", counter);
                                  }}
                                  horizontal={true}
                                  style={{
                                    borderWidth
                                  }}
                              /> */}
                          </View>
                          <View style={[styles.flx5,{alignItems:'flex-end'}]}>
                              <View style={styles.proddeletes}>
                                <TouchableOpacity style={[styles.wishlisthrt]} onPress={() => addToWishList(item.product_ID._id,vendor)} >
                                  <Icon size={20} name={item.product_ID.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={item.product_ID.isWish ?'red':'#999'} iconStyle={{}}/>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={() => deleteItemFromCart(item._id,vendor.vendor_id._id)} >
                                <Icon
                                  // onPress={() => deleteItemFromCart(item._id,vendor.vendor_id._id)}
                                  name="trash-can-outline"
                                  type="material-community"
                                  size={20}
                                  color="#000000"
                                  iconStyle={styles.iconstyle}
                                />
                                </TouchableOpacity>
                              </View>
                            </View>
                        </View>
                      </View>
                    </View>
                    )
                  })}
                  <View style={{flexDirection:'row',padding:10,paddingTop:0,marginBottom:5,alignItems:'center'}}>
                    <View style={{flex:0.5,flexDirection:'row'}}>
                      <Icon name="reply" type="ionic" size={18} color={colors.cartButton} iconStyle={{}}/>
                      <Text style={[CommonStyles.linkLightText,{fontSize:14,color:colors.cartButton,fontFamily: "Montserrat-Medium",}]} onPress={()=>goToProductList(vendor)}>Continue shopping</Text>
                    </View>
                    <View style={{flex:0.5}}>
                      {cartData.minOrderAmount <= vendor.vendor_afterDiscountTotal ?
                          null
                          :
                          <View style={{marginVertical:10}}>
                            <Text style={styles.minpurchase}>{vendor.vendor_id.companyName}, Minimum shopping amount is {cartData.minOrderAmount}</Text>
                          </View>
                        }
                     </View>   
                  </View>
                  <View style={[styles.totaldetails,{backgroundColor:cartData.minOrderAmount <= vendor.vendor_afterDiscountTotal?"#F7F7F7":"#F3C2C2"}]}>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.65,flexDirection:"row" }}>
                        {/* <Text numberOfLines={1} style={styles.totaldata}>{vendor.vendor_id.companyName} </Text> */}
                        <Text style={styles.totaldata}>Sub Total</Text>
                      </View>
                      <View style={{ flex: 0.1 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.currency1}>{currency}</Text>
                        </View>
                      </View>
                      <View style={{ flex: 0.2 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincart}>{vendor.vendor_beforeDiscountTotal && vendor.vendor_beforeDiscountTotal.toFixed(2)}</Text>
                        </View>
                      </View>                      
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.65 }}>
                        <Text style={styles.totaldata}>You Saved </Text>
                      </View>
                      <View style={{ flex: 0.1 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.currency1}>{currency}</Text>
                        </View>
                      </View>
                      <View style={{ flex: 0.2 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          {/* <Text style={styles.totalpriceincart}> - </Text> */}
                      <Text style={styles.totalpriceincart1}>{vendor.vendor_discountAmount > 1 ? vendor.vendor_discountAmount.toFixed(2) : 0.00}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.65,flexDirection:"row" }}>
                        {/* <Text numberOfLines={1} style={styles.totaldata}>{vendor.vendor_id.companyName} </Text> */}
                        <Text style={styles.totaldata}>Final Amount</Text>
                      </View>
                      <View style={{ flex: 0.1 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.currency1}>{currency}</Text>
                        </View>
                      </View>
                      <View style={{ flex: 0.2 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincart}>{vendor.vendor_afterDiscountTotal && vendor.vendor_afterDiscountTotal.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.65 }}>
                        <Text style={styles.totaldata}>VAT</Text>
                      </View>
                      <View style={{ flex: 0.1 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.currency1}>{currency}</Text>
                        </View>
                      </View>
                      <View style={{ flex: 0.2 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincart}>{vendor.vendor_taxAmount.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{borderWidth:0.5,marginVertical:5,borderColor:"#ddd"}} />
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.65 }}>
                          <Text style={[styles.totaldata],{fontFamily:"Montserrat-Bold",color:'#000',fontSize:15}}>Totals</Text>
                        </View>
                        <View style={{ flex: 0.1 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.currency1}>{currency}</Text>
                          </View>
                        </View>
                        <View style={{ flex: 0.2 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <Text style={styles.totalpriceincart}>{vendor.vendor_netPayableAmount.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                    <View>
                    </View>
                  </View>
                </View>
                )
              })}

                <View style={{ flex:1,backgroundColor:'#fff',flexDirection: "row", justifyContent: 'flex-start' }}>
                  <Text style={styles.billText}>Total Amount</Text>
                </View>
                <View style={styles.totaldetails1}>
                  <View style={styles.flxdata}>                    
                    <View style={{ flex: 0.65 }}>
                      <Text style={styles.totaldata1}>Total Amount </Text>
                    </View>
                    <View style={{ flex: 0.1 }}>
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
                    <View style={{ flex: 0.65 }}>
                      <Text style={styles.totaldata1}>Total Saved </Text>
                    </View>
                    <View style={{ flex: 0.1 }}>
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
                    <View style={{ flex: 0.65 }}>
                      <Text style={styles.totaldata1}>Total VAT  </Text>
                    </View>
                    <View style={{ flex: 0.1 }}>
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
                    <View style={{ flex: 0.65 }}>
                      <Text style={styles.totaldata1}>Total Delivery Charges </Text>
                    </View>
                    <View style={{ flex: 0.1 }}>
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
                        <Icon name="information-outline" type={"material-community"} size={16}iconStyle={{}} />
                      </Tooltip>
                    </View>  
                  </View>
                  <View style={{borderWidth:0.5,marginVertical:5,borderColor:"#ddd"}} />
                  <View style={styles.flxdata}>
                    <View style={{ flex: 0.65 }}>
                      <Text style={[styles.totaldata1]}>Grand Total</Text>
                    </View>
                    <View style={{ flex: 0.1 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.currency1}>{currency}</Text>
                        </View>
                      </View>
                    <View style={{ flex: 0.2 }}>
                      <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <Text style={styles.totalpriceincartTotal}>{cartData.paymentDetails.netPayableAmount && cartData.paymentDetails.netPayableAmount.toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex:1,backgroundColor:'#fff',flexDirection: "row", justifyContent: 'center' }}>
                    <Text style={styles.lastText}>Proceed to checkout to add discount coupon</Text>
                  </View>
                  <View>
                  </View>                  
                </View>                
          </View>
          :
          <View>
            <View style={{paddingVertical:24,paddingHorizontal:6}}>
              <Text style={CommonStyles.screenHeader}>My Cart</Text>
            </View>
            <View style={{height:window.height-230,justifyContent:'center',alignItems:'center'}}>
              <Image
                source={require("../../AppDesigns/currentApp/images/empty-cart.png")}
                style={{width:window.width,height:300}}
                resizeMode='contain'
              />
              <View style={{alignItems:'center'}}>
                <Text style={{fontFamily:"Montserrat-SemiBold",fontSize:18,color:"#DC1919",opacity: 1}}>Your cart is empty!</Text>
                <View style={{marginTop:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Icon name="undo-variant" type="material-community" size={15}  color={colors.cartButton}/>
                  <Text style={[CommonStyles.linkText,{textDecorationLine: "underline",fontFamily:"Montserrat-SemiBold",fontSize:12}]} onPress={() => navigation.navigate('Dashboard')}>Continue shopping</Text>
                </View>
              </View> 
            </View>
          </View>           
        }
         
        </View>
       
      </KeyboardAwareScrollView>
      :
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size="large" color={colors.theme} />
      </View>}
      <Modal isVisible={removefromcart}
        onBackdropPress={() => setRemoveFromCart(false)}
        coverScreen={true}
        // transparent
        // hideModalContentWhileAnimating={true}
        style={{ paddingHorizontal: '5%', zIndex: 999 }}
        animationInTiming={1} animationOutTiming={1}>
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
                  onPress={() => {setRemoveFromCart(false);deleteItem()}}
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
    {cartData && cartData.vendorOrders && cartData.vendorOrders.length>0?<View style={{marginBottom:Platform.OS ==='ios'?60: 45,flexDirection:'row'}}>
         <View style={{flex:0.5,height:60,backgroundColor:"#A2AEB5",justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:12,fontFamily:"Montserrat-Regular",color: "#eee"}}>Total Amount</Text>
            <Text style={{fontSize:16,fontFamily:"Montserrat-Regular",color: "#eee"}}>{currency} {cartData?.paymentDetails?.netPayableAmount && cartData?.paymentDetails?.netPayableAmount.toFixed(2)}</Text>
         </View>
         <TouchableOpacity style={{flex:0.5,height:60,backgroundColor:!disabled?"#5F6C74":colors.cartButton,justifyContent:'center',alignItems:'center'}}
         disabled       = {!disabled}
         onPress        = {() => navigation.navigate('AddressDefaultComp', {user_id:userId,"delivery":true})}
         >
          <Text style={{fontSize:16,fontFamily:"Montserrat-Regular",color: "#eee"}}>Checkout</Text>
         </TouchableOpacity>
      </View>:null}
  </React.Fragment>
  );
})





