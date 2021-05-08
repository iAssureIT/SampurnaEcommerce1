import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert
}                     from 'react-native';
import { Header, 
        Button, 
        Icon, 
        SearchBar,
      Card }   from "react-native-elements";
import HeaderBar5     from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import {Footer}       from '../../ScreenComponents/Footer/Footer1.js';
import Notification   from '../../ScreenComponents/Notification/Notification.js';
import styles         from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import { colors }     from '../../AppDesigns/currentApp/styles/styles.js';
import Loading        from '../../ScreenComponents/Loading/Loading.js';
import axios          from 'axios';
import AsyncStorage   from '@react-native-async-storage/async-storage';

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
export const OrderDetails=(props)=>{
  const {navigation,route}=props;
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
  const {orderid}=route.params;
  useEffect(() => {
    getorderlist(orderid);
}, [props]);

 

  const getorderlist=(orderid)=>{
    axios.get('/api/orders/get/one/' + orderid)
      .then((response) => {
        var myorders = response.data.products;
        var originalPrice = response.data.total;
        console.log("originalPrice.orderID:==>>>", response.data);
        setMyOrders(myorders);
        setOrderNumber(response.data.orderID);
        setTotalAmount(originalPrice);
        setUserName(response.data.userName);
        setUserFullName(response.data.userFullName);
        setMobNum(response.data.deliveryAddress.mobileNumber);
        setDeliveryAdd(response.data.deliveryAddress.addressLine1);
        setCurrency(response.data.currency);
      })
      .catch((error) => {
        console.log('error', error)
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
          <HeaderBar5
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
                    <View style={styles.orderid}><Text style={styles.orderidinfo}>Order ID : {ordernumber}</Text></View>
                    {
                      myorders && myorders.length > 0 ?
                        myorders.map((pitem, index) => {
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
                                        <Text style={styles.pricenum}> {pitem.originalPrice}</Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>  
                              </Card>
                          );
                        })
                        :
                        null
                    }
                    
                    <View style={styles.totalpayment}>
                      <View style={styles.prodorderdets}>
                        <View style={styles.flx7}>
                          <Text style={styles.addtitle}>Amount :</Text>
                          <Text style={styles.addtitle}>Shipping Charges :</Text>
                          <Text style={styles.addtitle}>Total Amount:</Text>
                        </View>
                        <View style={styles.flx3}>
                          <View style={{ flexDirection: 'row', marginRight: 10, marginTop: 3,alignItems:"center" }}>
                            <Icon
                              name={currency}
                              type="font-awesome"
                              size={15}
                              color="#388e3c"
                              iconStyle={styles.iconrps}
                            />
                            <Text style={styles.pricenum}> {totalamount}</Text>
                          </View>
                          <Text style={styles.addtitle}>FREE</Text>
                          <View style={{ flexDirection: 'row', marginRight: 10, marginTop: 3,alignItems:"center" }}>
                            <Icon
                              name={currency}
                              type="font-awesome"
                              size={15}
                              color="#388e3c"
                              iconStyle={styles.iconrps}
                            />
                            <Text style={styles.pricenum}> {totalamount}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.addressdetais}>
                      <Text style={styles.addtitle}>Address <Text style={styles.addressdets}>: {deliveryAddress ? deliveryAddress : "NA"}</Text></Text>
                      <Text style={styles.addtitle}>Mobile Number <Text style={styles.addressdets}>: {mobileNumber ? mobileNumber : "NA"}</Text></Text>
                      <Text style={styles.addtitle}>Email ID  <Text style={styles.addressdets}>: {userName ? userName : "NA"}</Text></Text>
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
  }