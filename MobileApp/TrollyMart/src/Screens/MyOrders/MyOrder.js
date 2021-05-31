
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator}        from 'react-native';
import Modal                from "react-native-modal";
import { Button, Icon,Card} from "react-native-elements";
import StepIndicator        from 'react-native-step-indicator';
import {Menu}               from '../../ScreenComponents/Menu/Menu.js';
import {HeaderBar3}         from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}             from '../../ScreenComponents/Footer/Footer1.js';
import styles               from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import { colors }           from '../../AppDesigns/currentApp/styles/styles.js';
import Loading              from '../../ScreenComponents/Loading/Loading.js';
import commonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import axios                from 'axios';
import moment               from 'moment';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import { useIsFocused }     from "@react-navigation/native";
import {withCustomerToaster}    from '../../redux/AppState.js';
import { connect,
  useDispatch,
  useSelector }                 from 'react-redux';
const labels = ["Processing", "Preparing", "On the Way", "Delivered"];
const customStyles = {
  stepIndicatorSize                 : 25,
  currentStepIndicatorSize          : 30,
  separatorStrokeWidth              : 2,
  currentStepStrokeWidth            : 3,
  stepStrokeCurrentColor            : colors.success,
  stepStrokeWidth                   : 3,
  stepStrokeFinishedColor           : colors.success,
  stepStrokeUnFinishedColor         : '#aaaaaa',
  separatorFinishedColor            : colors.success,
  separatorUnFinishedColor          : '#aaaaaa',
  stepIndicatorFinishedColor        : colors.success,
  stepIndicatorUnFinishedColor      : '#ffffff',
  stepIndicatorCurrentColor         : '#ffffff',
  stepIndicatorLabelFontSize        : 13,
  currentStepIndicatorLabelFontSize : 13,
  stepIndicatorLabelCurrentColor    : colors.success,
  stepIndicatorLabelFinishedColor   : '#ffffff',
  stepIndicatorLabelUnFinishedColor : '#aaaaaa',
  labelColor                        : '#999999',
  labelSize                         : 13,
  currentStepLabelColor             : colors.success,
}
// stepStrokeFinishedColor: 'colors.theme',

export const MyOrder = withCustomerToaster((props)=>{
  const [user_id,setUserId]=useState('');
  const [myorders,setMyOrders]=useState([]);
  const [cancelOrderModal,setCancelOrderModal]=useState(false);
  const [cancelOrderId,setCancelOrderId]=useState('');
  const [loading,setLoading]=useState(true);
  const isFocused = useIsFocused();
  const {navigation}=props;

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
  }));
  console.log("store",store);
  const {currency}=store.preferences;
  useEffect(() => {
    getorderlist();
}, [props,isFocused]);

 const getorderlist=()=>{
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        setUserId(data[1][1]);
          axios.get('/api/orders/get/list/' + data[1][1])
          .then((response) => {
            console.log("getorderlist",response.data);
            setMyOrders(response.data);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            if (error.response.status == 401) {
              AsyncStorage.removeItem('user_id');
              AsyncStorage.removeItem('token');
              setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
              navigation.navigate('Auth')
            }else{
              setToast({text: 'Something went wrong.', color: 'red'});
            }  
          });
      });
  }

  const toggle=()=>{
    let isOpen = !isOpen;
    setOpen(isOpen);
  }

  const openControlPanel = () => {
   _drawer.open()
  }

  const confirmcancelorderbtn = () => {
    var formValues = {
      "orderID": cancelOrderId,
      "userid": user_id,
    }
    axios.patch('/api/orders/get/cancelOrder', formValues)
      .then((response) => {
        axios.get('/api/orders/get/one/' + cancelOrderId)
          .then((res) => {
            setCancelOrderModal(false);
            getorderlist();
            Alert.alert(
              "Your order has been cancelled."
            );
            var sendData = {
              "event": "4",
              "toUser_id": user_id,
              "toUserRole": "user",
              "variables": {
                "Username": res.data.userFullName,
                "orderId": res.data.orderID,
                "orderdate": moment(res.data.createdAt).format('DD-MMM-YY LT'),
              }
            }
            console.log('sendDataToUser==>', sendData)
            axios.post('/api/masternotifications/post/sendNotification', sendData)
              .then((res) => { })
              .catch((error) => { console.log('notification error: ', error) })
            
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
      });
  }
  
  const cancelorderbtn = (id) => {
    setCancelOrderModal(true);
    setCancelOrderId(id);
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
            headerTitle={"My Orders"}
            toggle={() => toggle()}
            openControlPanel={() => openControlPanel()}
          />
          <View style={styles.superparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                {loading?
                <Loading/>
                :
                  myorders ?
                    myorders.length > 0 ?
                      myorders.map((order, i) => {
                        return(
                          <View style={styles.prodinfoparent}>
                            <View style={{flexDirection:'row'}}>
                              <View style={styles.orderid}>
                                <Text style={styles.orderidinfo}>Order No :</Text>
                                <Text style={styles.orderidinfo}>{order.orderID}</Text>
                              </View>
                              <View style={styles.orderid}>
                                <Text style={styles.orderidinfo}>Date : </Text>
                                <Text style={styles.orderidinfo}>{moment(order.createdAt).format("DD/MM/YYYY hh:mm a")}</Text>
                              </View>
                           </View> 
                           <View style={{flexDirection:"row",paddingVertical:15}}>
                              <View style={[{flex:0.7},]}>
                                <Text style={styles.totaldata}>Total Amount</Text>
                                <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.netPayableAmount.toFixed(2)}</Text>
                              </View>
                              <View style={{flex:0.3,justifyContent:"center",alignItems:"center"}}>
                                <Text style={[styles.totaldata,{padding:5,backgroundColor:"#fff"}]}>New Order</Text>
                              </View>
                          </View>   
                          {order.vendorOrders.map((item,i)=>{
                            var position = 0;
                            console.log("item.deliveryStatus[item.deliveryStatus.length - 1].status====>",item.deliveryStatus[item.deliveryStatus.length - 1].status);
                            if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "New Order" || item.deliveryStatus[item.deliveryStatus.length - 1].status === "Verified") {
                              position = 0;
                            } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Packed" || item.deliveryStatus[item.deliveryStatus.length - 1].status === "Inspection" || item.deliveryStatus[item.deliveryStatus.length - 1].status ==="Dispatch Approved" ) {
                              position = 1;
                            } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Dispatch" || item.deliveryStatus[item.deliveryStatus.length - 1].status ===  "Delivery Initiated") {
                              position = 2;
                            } 
                            else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Delivered & Paid") {
                              position = 4;
                            }  
                            console.log("position",position);
                            return (
                              <Card containerStyle={styles.orderstatusmgtop}>
                                <View style={{marginBottom:5}}>
                                  <Text style={[styles.totaldata]}>{item.vendorName}</Text>
                                </View>  
                                  {
                                    item && item.deliveryStatus
                                      && item.deliveryStatus[item.deliveryStatus.length - 1].status !== 'Cancelled' ?
                                      <View style={styles.orderstatus}>
                                        <StepIndicator
                                          customStyles={customStyles}
                                          currentPosition={position}
                                          labels={labels}
                                          stepCount={4}
                                        />
                                      </View>
                                      :
                                      <View style={styles.orderstatus}>
                                        <Text style={styles.ordercancelled}>Order Cancelled</Text>
                                      </View>
                                  }
                                  <View style={styles.flxdata}>
                                  <View style={{ flex: 0.5 }}>
                                    <Text style={styles.totaldata}>Amount </Text>
                                  </View>
                                  <View style={{ flex: 0.5 }}>
                                    <View style={{ flexDirection: "row",}}>
                                      <Text style={styles.totalpriceincart}>: {currency} {item.vendor_afterDiscountTotal && item.vendor_afterDiscountTotal.toFixed(2)}</Text>
                                    </View>
                                  </View>
                                </View>
                                <View style={styles.flxdata}>
                                  <View style={{ flex: 0.5 }}>
                                    <Text style={styles.totaldata}>No Of Products </Text>
                                  </View>
                                  <View style={{ flex: 0.5 }}>
                                    <View style={{ flexDirection: "row",}}>
                                      <Text style={styles.totalpriceincart}>: {item.vendor_numberOfProducts && item.vendor_numberOfProducts}</Text>
                                    </View>
                                  </View>
                                </View>
                              </Card>
                            )
                            })
                          }
                          <View style={styles.orderdetsandcancelbtn}>
                            {order ?
                              <View style={styles.ordercancelstatus}>
                                <View style={styles.ordercancelsstatus}>
                                  <Button
                                    onPress         = {() => navigation.navigate('OrderDetails', { orderid: order._id })}
                                    titleStyle      = {commonStyles.buttonText1}
                                    title           = "ORDER DETAILS"
                                    buttonStyle     = {commonStyles.button}
                                    containerStyle  = {commonStyles.buttonContainer}
                                  />
                                </View>
                                {order.orderStatus && order.orderStatus !== 'Cancelled'  && order.deliveryStatus === "Delivered & Paid" ?
                                  null
                                  :
                                  <View style={styles.orderdetailsstatus}>
                                    <Button
                                      onPress         = {() => cancelorderbtn(order._id)}
                                      titleStyle      = {styles.buttonText}
                                      title           = "CANCEL ORDER"
                                      buttonStyle     = {styles.buttonRED}
                                      containerStyle  = {styles.buttonContainer2}
                                    />
                                  </View>}
                              </View>
                              :
                              <View style={styles.orderstatustxtcancel}></View>
                            }
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
              </View>
            </ScrollView>
          </View>
          <Footer />
          <Modal isVisible={cancelOrderModal}
            onBackdropPress={() => setCancelOrderModal(false)}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
              <View style={{ justifyContent: 'center', backgroundColor: "transparent", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
                Are you sure you want to Cancel order?
              </Text>
              <View style={styles.cancelbtn}>
                <View style={styles.cancelvwbtn}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => setCancelOrderModal(false)}
                      titleStyle={styles.buttonText}
                      title="NO"
                      buttonStyle={styles.buttonRED}
                      containerStyle={styles.buttonContainer2}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.ordervwbtn}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => confirmcancelorderbtn()}
                      titleStyle={styles.buttonText1}
                      title="Yes"
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer2}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </React.Fragment>
      );
    }
})
