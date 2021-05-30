import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
}                     from 'react-native';
import { Icon, Card } from "react-native-elements";
import {HeaderBar3}   from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}       from '../../ScreenComponents/Footer/Footer1.js';
import styles         from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import { colors }     from '../../AppDesigns/currentApp/styles/styles.js';
import Loading        from '../../ScreenComponents/Loading/Loading.js';
import axios          from 'axios';
import AsyncStorage   from '@react-native-async-storage/async-storage';
import moment         from 'moment';
import commonStyles    from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {withCustomerToaster}    from '../../redux/AppState.js';

const labels = ["Order Placed", "Out for delivery", "In transition", "Delivered"];
const dateTime = ['13/12/2019 12:48 pm'];
const thirdIndicatorStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: 'colors.theme',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: 'colors.theme',
  stepStrokeUnFinishedColor: '#dedede',
  separatorFinishedColor: 'colors.theme',
  separatorUnFinishedColor: '#dedede',
  stepIndicatorFinishedColor: 'colors.theme',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#999999',
  labelSize: 13,
  labelFontFamily: 'OpenSans-Italic',
  currentStepLabelColor: 'colors.theme'
}
export const OrderDetails = withCustomerToaster((props)=>{
  const {navigation,route,setToast}=props;
  const [isOpen,setOpen]=useState(false);
  const [cancelOrderModal,setCancelOrderModal] =useState(false);
  const [ordernumber,setOrderNumber] =useState("");
  const [currentPosition,setCurrentPosition]=useState(0);
  const [myorders,setMyOrders]=useState([]);
  const [totalamount,setTotalAmount]=useState(0);
  const [userName,setUserName]=useState('');
  const [userFullName,setUserFullName]=useState('');
  const [mobileNumber,setMobNum]=useState('');
  const [deliveryAddress,setDeliveryAdd]=useState('');
  const [currency,setCurrency]=useState('');
  const [order,setOrder]=useState('');
  const {orderid}=route.params;
  useEffect(() => {
    getorderlist(orderid);
}, [props]);

 

  const getorderlist=(orderid)=>{
    axios.get('/api/orders/get/one/' + orderid)
      .then((response) => {
        console.log("getorderlist",response.data);
          setOrder(response.data);
      })
      .catch((error) => {
        console.log("error",error);
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


  const toggle=()=>{
    let isOpen = !isOpen;
    setOpen(isOpen);
  }

    if (props.loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <React.Fragment>
          <HeaderBar3
            goBack={navigation.goBack}
            navigate={navigation.navigate}
            headerTitle={"My Orders Details"}
            toggle={() =>toggle()}
            openControlPanel={() => openControlPanel()}
          />
          <View style={styles.superparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <View style={styles.parent}>

                  <View style={styles.prodinfoparent}>
                    <View style={styles.orderid}>
                      <Text style={styles.orderidinfo}>Order ID   : {order.orderID}</Text>
                      <Text style={styles.orderidinfo}>Ordered Date : {moment(order.createdAt).format("DD/MM/YYYY hh:mm a")}</Text>
                    </View>
                    <View style={styles.addressdetais}>
                      <Text style={styles.addtitle}>Shipping Address <Text style={styles.addressdets}>: {order.deliveryAddress ? order.deliveryAddress.addressLine2+" "+order.deliveryAddress.addressLine1 : "NA"}</Text></Text>
                      <Text style={styles.addtitle}>Mobile Number <Text style={styles.addressdets}>: {order.deliveryAddress ?  order.deliveryAddress.mobileNumber : "NA"}</Text></Text>
                      {/* <Text style={styles.addtitle}>Email ID  <Text style={styles.addressdets}>: {order.deliveryAddress.name  ? order.deliveryAddress.name  : "NA"}</Text></Text> */}
                    </View>
                    {
                      order && order.vendorOrders.length > 0 ?
                      order.vendorOrders.map((vendor,i)=>{
                        return(
                        <View>
                          <View style={{backgroundColor:colors.theme,marginTop:15}}>
                            <Text style={[commonStyles.headerText,{color:"#fff"}]}>{vendor.vendor_id.companyName}</Text>
                          </View>  
                          {vendor.products.map((pitem, index) => {
                            // console.log("pitem===>", pitem);
                            return (
                                <Card containerStyle={styles.prodorders} wrapperStyle={{flexDirection:"row",flex:1}}>
                                  <View style={{flex:0.3}}>
                                    {pitem.productImage[0] ?<Image
                                      style={styles.img15}
                                      source={{ uri: pitem.productImage[0] }}
                                      resizeMode="contain"
                                    />:
                                    <Image
                                      source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                                      style={styles.img15}
                                    />
                                  }
                                  </View>
                                  <View style={{flex:0.7,paddingHorizontal:5}}>
                                    <View style={{flexDirection:"row",flex:1}}>
                                        <Text style={styles.proddets}>Product :</Text>
                                        <Text style={styles.prodinfo}>{pitem.productName}</Text>
                                    </View>  
                                    <View style={{flexDirection:"row",flex:1}}>
                                        <Text style={styles.proddets}>Qty :</Text>
                                        <Text style={styles.prodinfo}> {pitem.quantity} Pack </Text>
                                    </View>  
                                    <View style={{flexDirection:"row",flex:1}}>
                                        <Text style={styles.proddets}>Price :</Text>
                                      <View style={styles.flx4}>
                                      <View style={{ flexDirection: 'row',alignItems:"center"}}>
                                          <Icon
                                            name={pitem.currency}
                                            type="font-awesome"
                                            size={14}
                                            color="#388e3c"
                                            iconStyle={styles.iconrps}
                                          />
                                          <Text style={styles.pricenum}> {pitem.discountedPrice}</Text>
                                        </View>
                                      </View>
                                    </View>
                                  </View>  
                                </Card>
                            );
                          })}
                          <View style={styles.totaldetails}>
                            <View style={styles.flxdata}>
                              <View style={{ flex: 0.6,flexDirection:"row" }}>
                                <Text numberOfLines={1} style={styles.totaldata}>{vendor.vendorName}</Text>
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
                            <View>
                            </View>
                          </View>
                        </View>
                        )
                      })
                      :
                      null
                    }
                    <View style={styles.totaldetails}>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.6 }}>
                          <Text style={styles.totaldata}>Final Total Amount </Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.afterDiscountTotal.toFixed(2)}</Text>
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
                            <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.discountAmount.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.6 }}>
                          <Text style={styles.totaldata}>Total Tax  </Text>
                        </View> 
                        <View style={{ flex: 0.4 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.taxAmount.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.6 }}>
                          <Text style={styles.totaldata}>Total Delivery Charges </Text>
                        </View> 
                        <View style={{ flex: 0.4 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.shippingCharges.toFixed(2)}</Text>
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
                            <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.netPayableAmount.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <Footer />
        </React.Fragment>
      );
    }
  })