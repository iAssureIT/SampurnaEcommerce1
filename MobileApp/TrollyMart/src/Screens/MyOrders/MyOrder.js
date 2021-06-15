
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
import CountDown from 'react-native-countdown-component';
import { connect,
  useDispatch,
  useSelector }                 from 'react-redux';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
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
  const {navigation,setToast}=props;

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
  }));
  const {currency}=store.preferences;
  useEffect(() => {
    getorderlist();
}, [props,isFocused]);

 const getorderlist=()=>{
  setLoading(true)
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        setUserId(data[1][1]);
          axios.get('/api/orders/get/list/' + data[1][1])
          .then((response) => {
            console.log("response",response);
            setMyOrders(response.data);
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

  const confirmCancelOrderBtn = () => {
    var formValues = {
      "type"        : "wholeorder", //or wholeorder
      "vendor_id"   : "", // if type is vendororder
      "order_id"    : cancelOrderId,
      "userid"      : user_id,
    }
    axios.patch('/api/orders/cancel/order', formValues)
      .then((response) => {
        console.log("response",response);
        axios.get('/api/orders/get/one/' + cancelOrderId)
          .then((res) => {
            setCancelOrderModal(false);
            getorderlist();
            setToast({text: 'Your order has been cancelled.', color: 'green'});
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
            axios.post('/api/masternotifications/post/sendNotification', sendData)
              .then((res) => { })
              .catch((error) => { console.log('notification error: ', error) })
            
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
      });
  }
  
  const cancelorderbtn = (id) => {
    setCancelOrderModal(true);
    setCancelOrderId(id);
  }

  const cancelButton = (orderDate)=>{
      var min = moment(orderDate).add(myorders[0].maxDurationForCancelOrder, 'minutes');
      var duration = moment.duration(min.diff(new Date())).asSeconds();
      if(duration > 0 &&duration < myorders[0].maxDurationForCancelOrder*60){
        setTimeout(function(){getorderlist() },  Math.abs(duration) *1000);
        return true;
      }else{
        return false;
      }
  }

  const cancelTime = (orderDate)=>{
    var min = moment(orderDate).add(myorders[0].maxDurationForCancelOrder, 'minutes');
    var duration = moment.duration(min.diff(new Date())).asSeconds();
    return Math.abs(duration);
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
                        var positionOrder = 0;
                        if (order.orderStatus === "New Order" || order.orderStatus === "Verified") {
                          positionOrder = 0;
                        } else if (order.orderStatus === "Packed" || order.orderStatus === "Inspection" || order.orderStatus ==="Dispatch Approved" ) {
                          positionOrder = 1;
                        } else if (order.orderStatus === "Dispatch" || order.orderStatus ===  "Delivery Initiated") {
                          positionOrder = 2;
                        }else if (order.orderStatus === "Delivered & Paid") {
                          positionOrder = 3;
                        } else if (order.orderStatus === "Cancelled") {
                          positionOrder = 4;
                        }
                        return(
                          <View style={[styles.prodinfoparent,]}>
                            <View style={{flexDirection:'row'}}>
                              <View style={[styles.orderid]}>
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
                              {positionOrder === 3  &&
                              <View style={{flex:0.3,justifyContent:"center",alignItems:"center"}}>
                                <View style={[styles.vendorStatus,
                                      (positionOrder === 0 ? 
                                      {backgroundColor:'#017BFE'}
                                      :
                                      positionOrder === 1 ? 
                                      {backgroundColor:colors.warning}
                                      :
                                      positionOrder === 2 ? 
                                      {backgroundColor:"#EB984E"}
                                      :
                                      positionOrder === 3 ?  
                                      {backgroundColor:colors.success}
                                      :
                                      positionOrder === 4 ?  
                                      {backgroundColor:colors.red}
                                      :
                                      "#eee")
                                    ]}>
                                <Text style={[styles.totaldata,{padding:5,color:"#fff"}]}>{order.orderStatus}</Text>
                              </View>
                            </View>}
                          </View>   
                          {order.vendorOrders.map((item,i)=>{
                            var position = 0;
                            if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "New Order" || item.deliveryStatus[item.deliveryStatus.length - 1].status === "Verified") {
                              position = 0;
                            } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Packed" || item.deliveryStatus[item.deliveryStatus.length - 1].status === "Inspection" || item.deliveryStatus[item.deliveryStatus.length - 1].status ==="Dispatch Approved" ) {
                              position = 1;
                            } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Dispatch" || item.deliveryStatus[item.deliveryStatus.length - 1].status ===  "Delivery Initiated") {
                              position = 2;
                            }else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Delivered & Paid") {
                              position = 3;
                            } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Cancelled") {
                              position = 4;
                            }   
                            return (
                              <Card containerStyle={styles.orderstatusmgtop}>
                                <View style={{marginBottom:5}}>
                                  <Text style={[styles.totaldata]}>{item.vendorName}</Text>
                                </View>  
                                  {/* {
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
                                  } */}
                                <View style={{flexDirection:'row'}}>
                                  <View style={{flex:0.6}}>
                                    <View style={styles.flxdata}>
                                      <View style={{ flex: 0.35 }}>
                                        <Text style={styles.totaldata}>Items</Text>
                                      </View>
                                      <View style={{ flex: 0.65 }}>
                                        <View style={{ flexDirection: "row",}}>
                                          <Text style={styles.totalpriceincart}>: {item.vendor_numberOfProducts && item.vendor_numberOfProducts}</Text>
                                        </View>
                                      </View>
                                    </View>
                                    <View style={styles.flxdata}>
                                      <View style={{ flex: 0.35 }}>
                                        <Text style={styles.totaldata}>Amount </Text>
                                      </View>
                                      <View style={{ flex: 0.65 }}>
                                        <View style={{ flexDirection: "row",}}>
                                          <Text style={styles.totalpriceincart}>: {currency} {item.vendor_afterDiscountTotal && item.vendor_afterDiscountTotal.toFixed(2)}</Text>
                                        </View>
                                      </View>
                                    </View>
                                  </View>  
                                  <View style={{flex:.4,justifyContent:'flex-end'}}>
                                    <View style={[styles.vendorStatus,]}>
                                      <Text style={[commonStyles.label,
                                      (position === 0 ? 
                                      {color:'#017BFE',alignSelf:'flex-end'}
                                      :
                                      position === 1 ? 
                                      {color:colors.warning,alignSelf:'flex-end'}
                                      :
                                      position === 2 ? 
                                      {color:"#EB984E",alignSelf:'flex-end'}
                                      :
                                      position === 3 ?  
                                      {color:colors.success,alignSelf:'flex-end'}
                                      :
                                      position === 4 ?  
                                      {color:colors.red,alignSelf:'flex-end'}
                                      :
                                      "#eee")]}>{item.deliveryStatus[item.deliveryStatus.length - 1].status}</Text>
                                    </View>  
                                  </View>
                                </View>  
                              </Card>
                            )
                            })
                          }
                          <View style={styles.orderdetsandcancelbtn}>
                            {order ?
                              <View style={[styles.ordercancelstatus,{justifyContent:"flex-end"}]}>
                                {cancelButton(order.createdAt) ?
                                  order.orderStatus && order.orderStatus !== 'Cancelled'  && order.deliveryStatus === "Delivered & Paid" ?
                                  null
                                  :
                                  <View style={styles.orderdetailsstatus}>
                                    {order.orderStatus && order.orderStatus !== 'Cancelled'&&
                                    <View style={[styles.orderdetailsstatus,{paddingRight:0,height:40,justifyContent:'center'}]}>
                                    {order.orderStatus && order.orderStatus !== 'Cancelled'&&
                                      <View style={{justifyContent:'center'}}>
                                        <Text style={[CommonStyles.linkText,{fontFamily:"Montserrat-Medium",alignSelf:'center'}]} onPress={()=>cancelorderbtn(order._id,'')}>Cancel order before {moment(order.createdAt).add(order.maxDurationForCancelOrder, 'minutes').format('hh:mm')}</Text>
                                      </View>
                                    }
                                    </View>}
                                  </View>
                                  :
                                  null
                                }
                                <View style={[styles.ordercancelsstatus]}>
                                  <Button
                                    onPress         = {() => navigation.navigate('OrderDetails', { orderid: order._id })}
                                    titleStyle      = {commonStyles.buttonText1}
                                    title           = "SHOW DETAILS"
                                    buttonStyle     = {[commonStyles.button,{height:50}]}
                                    containerStyle  = {commonStyles.buttonContainer}
                                  />
                                </View>
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
                      onPress={() => confirmCancelOrderBtn()}
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
