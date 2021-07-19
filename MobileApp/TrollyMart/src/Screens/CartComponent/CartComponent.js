import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,ActivityIndicator,
} from 'react-native';
import {Button,Icon,Tooltip}              from "react-native-elements";
import Modal                      from "react-native-modal";
import {HeaderBar3}               from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                   from '../../ScreenComponents/Footer/Footer.js';
import styles                     from '../../AppDesigns/currentApp/styles/ScreenStyles/Cartstyles.js';
import {colors}                   from '../../AppDesigns/currentApp/styles/styles.js';
import axios                      from 'axios';
import Counter                    from "react-native-counters";
import Feather from 'react-native-vector-icons/Feather';
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
    globalSearch    : store.globalSearch
  }));
  const {globalSearch}=store;
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


  const addToWishList = (productid) => {
    const wishValues = {
      "user_ID": userId,
      "product_ID": productid,
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
                                  {item.product_ID.discountPercent > 0 &&<Text style={styles.discountpricecut}>{(item.product_ID.originalPrice * item.quantity).toFixed(2)}</Text>}
                                    <Text style={[styles.currency,{fontFamily:"Montserrat-SemiBold"}]}> {(item.product_ID.discountedPrice * item.quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
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
                          <View style={[styles.flx5]}>
                            <Counter start={item.quantity} min={1} max={100}
                                minusIcon={minusIcon} 
                                plusIcon={plusIcon} 
                                buttonStyle={{
                                  borderColor: colors.cartButton,
                                  backgroundColor:'#355D76',
                                  // elevation:2,
                                  borderWidth: 1,
                                  borderRadius: 25,
                                 
                                }}
                                buttonTextStyle={{
                                  color: '#fff',
                                }}
                                countTextStyle={{
                                  color: colors.theme,
                                }}
                                onChange={(e)=>onChange(e,item.product_ID._id,vendor.vendor_id._id)} 
                                />
                          </View>
                          <View style={[styles.flx5,{alignItems:'flex-end'}]}>
                              <View style={styles.proddeletes}>
                                <TouchableOpacity style={[styles.wishlisthrt]} onPress={() => addToWishList(item.product_ID._id)} >
                                  <Icon size={20} name={item.product_ID.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={item.product_ID.isWish ?'red':'#ccc'}/>
                                </TouchableOpacity>
                                <Icon
                                  onPress={() => deleteItemFromCart(item._id,vendor.vendor_id._id)}
                                  name="delete"
                                  type="AntDesign"
                                  size={20}
                                  color="#ccc"
                                  iconStyle={styles.iconstyle}
                                />
                              </View>
                            </View>
                        </View>
                      </View>
                    </View>
                    )
                  })}
                  <View style={{flexDirection:'row',padding:10,paddingTop:0,marginBottom:5}}>
                    <Icon name="arrow-left" type="font-awesome" size={14} color={colors.cartButton} iconStyle={{paddingRight:3}}/>
                    <Text style={[CommonStyles.linkLightText,{alignSelf:'center',fontSize:14,color:colors.cartButton,fontFamily: "Montserrat-Medium",}]} onPress={()=>goToProductList(vendor)}>Continue shopping</Text>
                  </View>
                  <View style={styles.totaldetails}>
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
                        <Text style={styles.totaldata}>Total Amount</Text>
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
                          <Text style={[styles.totaldata],{fontFamily:"Montserrat-Bold",color:'#000',fontSize:16}}>Totals</Text>
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
                      {cartData.minOrderAmount <= vendor.vendor_afterDiscountTotal ?
                        null
                        :
                        <View style={{}}>
                          <Text style={styles.minpurchase}>Order total amount should be greater than {currency} {cartData.minOrderAmount}. Please add some more products.</Text>
                        </View>
                      }
                    </View>
                  </View>
                </View>
                )
              })}

                <View style={{ flex:1,backgroundColor:'#fff',flexDirection: "row", justifyContent: 'flex-start' }}>
                  <Text style={styles.billText}>Total Bill</Text>
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
                  <View style={{paddingVertical:15,marginBottom:60}}>
                      {/* <View>
                        <FormButton
                          onPress        = {() => navigation.navigate('AddressDefaultComp', {user_id:userId,"delivery":true})}
                          title          = {"PROCEED TO CHECKOUT"}
                          buttonStyle    = {styles.button1}
                          containerStyle = {styles.buttonContainer1}
                          disabled       = {!disabled}
                        />
                      </View> */}
                      <FormButton
                          title          = {"PROCEED TO CHECKOUT"}
                          onPress        = {() => navigation.navigate('AddressDefaultComp', {user_id:userId,"delivery":true})}
                          background     = {true}
                          // loading     = {btnLoading}
                          disabled       = {!disabled}
                        />
                    </View>
                  </View>                  
                </View>                
          </View>
          :
          <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
            <Image
              source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
            />
            <View style={{}}>
              <FormButton
                  onPress={() => navigation.navigate('Dashboard')}
                  // title={"Click Here To Continue Shopping"}
                  title={"Add Products"}
                  background={true}
              /> 
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





