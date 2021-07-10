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
// import {AppEventsLogger} from 'react-native-fbsdk';    

  export const OrderSummary = withCustomerToaster((props)=>{
    const {navigation,route,setToast}=props;
    const [shippingTiming,setShippingTiming]=useState("");
    const [getTimes,setGetTimes]=useState([]);
    const [loading,setLoading] = useState(true);
    const [orders, setorders] = useState('');
    const {order_id}=route.params;
    useEffect(() => {
      getorders(order_id);;
  }, [props]);


  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    userDetails     : store.userDetails
  }));
  const {currency,userDetails}=store.preferences;



  const getorders=(order_id)=>{
    axios.get('/api/orders/get/one/' + order_id)
    .then((response) => {
      console.log("response",response);
      setorders(response.data);
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


    return (
      <React.Fragment>
        {/* <View style={styles.addsuperparent}>
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
                </View>
              </View>
              <View style={styles.formWrapper}>
                <Text style={[styles.totaldata,{paddingVertical:2}]}>You're Buying</Text>
                <View style={styles.cartdetails}>
                {
                orders  && orders.vendorOrders && orders.vendorOrders.length>0?
                  orders.vendorOrders.map((vendor, i) => {
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
                                      <View style={[styles.flxdir]}>
                                        <View style={[styles.flxdir]}>
                                          <Text style={styles.ogprice}>{currency} </Text>
                                          {item.product_ID.discountPercent > 0 &&<Text style={styles.discountpricecut}>{(item.product_ID.originalPrice * item.quantity).toFixed(2)}</Text>}
                                        </View>
                                        <View style={[styles.flxdir,{alignItems:"center"}]}>
                                            <Text style={styles.ogprice}> {(item.product_ID.discountedPrice * item.quantity).toFixed(2)}<Text style={styles.packofnos}></Text>
                                            </Text>
                                        </View>
                                        {item.product_ID.discountPercent > 0 &&<View style={[styles.flxdir,{alignItems:"center"}]}>
                                            <Text style={styles.ogprice}>( {item.product_ID.discountPercent} % OFF) <Text style={styles.packofnos}></Text>
                                            </Text>
                                        </View>}
                                        <View style={[styles.flxdir,styles.padhr15,{flex:1,justifyContent:"flex-end"}]}>
                                            <Text style={[styles.ogprice]}> Qty : {item.quantity}<Text style={styles.packofnos}></Text>
                                            </Text>
                                        </View>
                                      </View>
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
                                <Text style={styles.totaldata}>Total</Text>
                              </View>
                              <View style={{ flex: 0.4 }}>
                                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                  <Text style={styles.totalpriceincart}>{currency} {vendor.vendor_afterDiscountTotal && vendor.vendor_afterDiscountTotal.toFixed(2)}</Text>
                                </View>
                              </View>
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
          </View>
        </ScrollView>
        <Footer />
      </View> */}
    </React.Fragment>
  );
})
