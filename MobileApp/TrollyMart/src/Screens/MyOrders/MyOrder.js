
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator}        from 'react-native';
import Modal                from "react-native-modal";
import { Button, Icon,Card} from "react-native-elements";
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
  useSelector }             from 'react-redux';
import CommonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import openSocket           from 'socket.io-client';
import {REACT_APP_BASE_URL} from '@env';
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { NetWorkError } from '../../../NetWorkError.js';
const window = Dimensions.get('window');

const  socket = openSocket(REACT_APP_BASE_URL,{ transports : ['websocket'] });
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
  const [myorders,setMyOrders]=useState([]);
  const [cancelOrderModal,setCancelOrderModal]=useState(false);
  const [cancelOrderId,setCancelOrderId]=useState('');
  const [loading,setLoading]=useState(true);
  const isFocused = useIsFocused();
  const {navigation,setToast}=props;

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    userDetails     : store.userDetails,
    globalSearch    : store.globalSearch
  }));
  const {currency}=store.preferences;
  const {user_id}=store.userDetails;
  const {globalSearch}=store;
  useEffect(() => {
    getorderlist();
    socket.on('getUserOrderList',(response)=>{
      console.log("response",response);
      //    axios.get('/api/orders/get/list/' + data[1][1])
      // .then((response) => {
      setMyOrders(response);
      setLoading(false);
    })
    socket.on('connect_error', err => setLoading(false))
}, [props,isFocused]);

 const getorderlist=()=>{
  setLoading(true)
    socket.emit('room',user_id);
    socket.emit('userOrderList',user_id);
    socket.on('getUserOrderList',(response)=>{
      console.log("response",response);
      //    axios.get('/api/orders/get/list/' + data[1][1])
      // .then((response) => {
      setMyOrders(response);
      setLoading(false);
    })
    // socket.off('getUserOrderList');
      // .catch((error) => {
      //   console.log("error",error);
      //   setLoading(false);
      //   if (error.response.status == 401) {
      //     AsyncStorage.removeItem('user_id');
      //     AsyncStorage.removeItem('token');
      //     setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
      //     navigation.navigate('Auth')
      //   }else{
      //     setToast({text: 'Something went wrong.', color: 'red'});
      //   }  
      // });
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
          <View style={styles.superparent}>
            {globalSearch.search ?
                <SearchSuggetion />
              :
              <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
                <View style={{paddingVertical:24,paddingHorizontal:6}}>
                  <Text style={CommonStyles.screenHeader}>My Orders</Text>
                </View>
              <View style={styles.formWrapper}>
                {loading?
                <Loading/>
                :
                  myorders ?
                    myorders.length > 0 ?
                      myorders.map((order, i) => {
                        var positionOrder = 0;
                        if (order.orderStatus === "New" || order.orderStatus === "Verified") {
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
                        <View style={[styles.prodinfoparent]}>
                          <View style={{paddingHorizontal:0}}>                            
                            <View style={{paddingHorizontal:20}}>
                            <View style={{marginBottom:20}}><Text>Delivered</Text></View>
                              <View style={{flexDirection:'row'}}>
                                <View style={[styles.orderid]}>
                                  <Text style={styles.orderidinfo}>Order ID : {order.orderID}</Text>
                                </View>
                                <View style={styles.orderAmount}>
                                  <Text style={styles.orderidinfo}>Total Amount {currency} {order.paymentDetails && order.paymentDetails.netPayableAmount.toFixed(2)} </Text>
                                </View>
                            </View>                             
                            <View style={{flexDirection:"row",marginTop:5,justifyContent:'space-between'}}>
                                <View style={[{flex:0.44}]}>
                                  <Text numberOfLines={2} style={styles.totaldata}>Address: {order.deliveryAddress.addressLine1+", "+order.deliveryAddress.addressLine2}</Text>
                                </View>
                                <View style={[{flex:0.54,alignItems:'flex-end'}]}>
                                  <Text numberOfLines={2} style={styles.totaldata}>Credit points earned {order.paymentDetails.creditPointsEarned}</Text>
                                </View>
                                {/* {positionOrder === 3  &&
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
                              </View>} */}
                            </View>  
                            <View style={{flexDirection:"row",marginTop:5,justifyContent:'space-between'}}>
                                <View style={[{flex:0.44}]}>
                                  <Text numberOfLines={2} style={styles.totaldata}>Date: {moment(order.createdAt).format('MM/DD/YYYY')}</Text>
                                </View>
                                <View style={[{flex:0.54,alignItems:'flex-end'}]}>
                                  <Text numberOfLines={2} style={styles.totaldata}>{order.paymentDetails.paymentMethod}</Text>
                                </View>
                            </View> 
                           </View>  
                          <View style={{borderWidth:1,marginHorizontal:6,padding:5,borderRadius:5,borderColor:"#D4D4D4",marginTop:15}}>
                            {order.vendorOrders.map((item,i)=>{
                              var position = 0;
                              if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "New"){
                                position = 0;
                              } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Processing" || item.deliveryStatus[item.deliveryStatus.length - 1].status === "Ready to Dispatch" || item.deliveryStatus[item.deliveryStatus.length - 1].status === "On the Way") {
                                position = 1;
                              } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Dispatch" || item.deliveryStatus[item.deliveryStatus.length - 1].status ===  "Delivery Initiated") {
                                position = 2;
                              }else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Delivered") {
                                position = 3;
                              } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Cancelled") {
                                position = 4;
                              }   
                              return (
                                <View style={styles.orderstatusmgtop}>
                                  <View style={{flexDirection:'row'}}>
                                    <Text style={[styles.vendorName,{flex:0.8}]}>{item.vendorName}</Text>
                                      
                                  </View>  
                                  <View style={{flexDirection:'row',marginVertical:30}}>
                                      <View style={{flex:0.7,borderRightWidth:0.5,borderColor:"#0000004F",paddingHorizontal:15}}>
                                          <Text style={styles.totalpriceincart}>No Of Products : {item.vendor_numberOfProducts && item.vendor_numberOfProducts}</Text>
                                          <Text style={styles.totalpriceincart}>Amount : {item.vendor_afterDiscountTotal && item.vendor_afterDiscountTotal.toFixed(2)} {currency}</Text>
                                      </View>
                                      <View style={{flex:0.49,paddingHorizontal:15}}>
                                      <View style={{alignSelf:'center',marginTop:12,justifyContent:'center',alignItems:'center',borderRadius:2,
                                       backgroundColor: position === 0 ? 
                                        colors.info
                                        :
                                        position === 1 ? 
                                       colors.warning
                                        :
                                        position === 2 ? 
                                        "#EB984E"
                                        :
                                        position === 3 ?  
                                        colors.success
                                        :
                                        position === 4 ?  
                                        colors.danger
                                        :
                                        "#eee"
                                      }}>
                                        <Text style={[styles.statusLabel]}>{item.deliveryStatus[item.deliveryStatus.length - 1].status}</Text>
                                      </View>
                                      </View>
                                  </View>  
                                </View>
                              )
                              })
                            }
                          </View>  
                          <View style={styles.orderdetsandcancelbtn}>
                            {order ?
                              <View style={[styles.ordercancelstatus]}>
                                {cancelButton(order.createdAt) ?
                                  order.orderStatus && order.orderStatus !== 'Cancelled'  && order.deliveryStatus === "Delivered & Paid" ?
                                  null
                                  :
                                  <View style={styles.orderdetailsstatus}>
                                    {order.orderStatus && order.orderStatus !== 'Cancelled'&&
                                    <View style={[styles.orderdetailsstatus,{paddingRight:0,height:40}]}>
                                        <Text style={[CommonStyles.linkText,{fontFamily:"Montserrat-Medium",fontSize:13,color:colors.danger,textDecorationLine:'underline'}]} onPress={()=>cancelorderbtn(order._id,'')}>Cancel before {moment(order.createdAt).add(order.maxDurationForCancelOrder, 'minutes').format('LT')}</Text>
                                    </View>}
                                  </View>
                                  :
                                  <View style={styles.orderdetailsstatus} />
                                }
                                  <View style={[styles.ordercancelsstatus]}>
                                    <Button
                                      onPress         = {() => navigation.navigate('OrderDetails', { orderid: order._id })}
                                      titleStyle      = {styles.buttonText}
                                      title           = "Show Details"
                                      buttonStyle     = {[styles.button]}
                                      containerStyle  = {styles.buttonContainer}
                                    />
                                  </View>                                  
                              </View>
                              :
                              <View style={styles.orderstatustxtcancel}></View>
                            }
                          </View>
                          </View>
                          {/* <View style={{borderWidth:0.5,marginVertical:15,borderColor:"#999"}}/> */}
                          <Image
                            source={require("../../AppDesigns/currentApp/images/order_sepration.png")}
                            // resizeMode="contain"
                            style={{width:"100%",marginTop:15}}
                          />
                        </View>
                        ) 
                      })
                      
                      :
                      <View style={{height:window.height-230,justifyContent:'center',alignItems:'center'}}>
                        <Image
                          source={require("../../AppDesigns/currentApp/images/empty-order.png")}
                          style={{width:window.width,height:300}}
                          resizeMode='contain'
                        />
                        <View style={{alignItems:'center'}}>
                          <Text style={{fontFamily:"Montserrat-SemiBold",fontSize:18,color:"#DC1919",opacity: 1}}>No Orders Yet</Text>
                          <View style={{marginTop:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Icon name="undo-variant" type="material-community" size={15}  color={colors.cartButton}/>
                            <Text style={[CommonStyles.linkText,{textDecorationLine: "underline",fontFamily:"Montserrat-SemiBold",fontSize:12}]} onPress={() => navigation.navigate('Dashboard')}>Continue shopping</Text>
                          </View>
                        </View> 
                      </View> 
                    :

                    <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                      <ActivityIndicator size="large" color={colors.theme} />
                    </View>
                }
              </View>
            </ScrollView>}
          </View>
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
