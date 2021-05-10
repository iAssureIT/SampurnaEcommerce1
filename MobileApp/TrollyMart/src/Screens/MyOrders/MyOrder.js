
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator}    from 'react-native';
import Modal            from "react-native-modal";
import { Button, Icon,Card} from "react-native-elements";
import StepIndicator    from 'react-native-step-indicator';
import {Menu}           from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar5       from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import {Footer}         from '../../ScreenComponents/Footer/Footer1.js';
import styles           from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import { colors }       from '../../AppDesigns/currentApp/styles/styles.js';
import Loading          from '../../ScreenComponents/Loading/Loading.js';
import commonStyles     from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import axios            from 'axios';
import moment           from 'moment';
import AsyncStorage     from '@react-native-async-storage/async-storage';

const labels = ["Order Placed", "Packed", "Out for delivery", "Delivered"];
const customStyles = {
  stepIndicatorSize                 : 25,
  currentStepIndicatorSize          : 30,
  separatorStrokeWidth              : 2,
  currentStepStrokeWidth            : 3,
  stepStrokeCurrentColor            : colors.theme,
  stepStrokeWidth                   : 3,
  stepStrokeFinishedColor           : colors.theme,
  stepStrokeUnFinishedColor         : '#aaaaaa',
  separatorFinishedColor            : colors.theme,
  separatorUnFinishedColor          : '#aaaaaa',
  stepIndicatorFinishedColor        : colors.theme,
  stepIndicatorUnFinishedColor      : '#ffffff',
  stepIndicatorCurrentColor         : '#ffffff',
  stepIndicatorLabelFontSize        : 13,
  currentStepIndicatorLabelFontSize : 13,
  stepIndicatorLabelCurrentColor    : colors.theme,
  stepIndicatorLabelFinishedColor   : '#ffffff',
  stepIndicatorLabelUnFinishedColor : '#aaaaaa',
  labelColor                        : '#999999',
  labelSize                         : 13,
  currentStepLabelColor             : colors.theme,
}
// stepStrokeFinishedColor: 'colors.theme',

export const MyOrder =(props)=>{
  const [isOpen,setOpen]=useState(false);
  const [user_id,setUserId]=useState('');
  const [fullName,setFullName]=useState('');
  const [email,setEmail]=useState('');
  const [mobNumber,setMobNumber]=useState('');
  const [myorders,setMyOrders]=useState([]);
  const [cancelOrderModal,setCancelOrderModal]=useState(false);
  const [cancelOrderId,setCancelOrderId]=useState('');
  const {navigation}=props;
  useEffect(() => {
    getorderlist();
}, [props]);

 const getorderlist=()=>{
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        setUserId(data[1][1]);
        axios.get('/api/ecommusers/' + data[1][1])
          .then((res) => {
            setFullName(res.data.profile.fullName);
            setEmail(res.data.profile.email);
            setMobNumber(res.data.profile.mobile);
          })
          .catch((error) => {
            console.log('error', error)
          });

          axios.get('/api/orders/get/list/' + data[1][1])
          .then((response) => {
            setMyOrders(response.data)
          })
          .catch((error) => {
            console.log('error', error)
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
          <HeaderBar5
            goBack={navigation.goBack}
            navigate={navigation.navigate}
            headerTitle={"My Orders"}
            toggle={() => toggle()}
            openControlPanel={() => openControlPanel()}
          />
          <View style={styles.superparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                  {
                    myorders ?
                      myorders.length > 0 ?
                        myorders.map((item, i) => {
                          // activitysteps(item.deliveryStatus)
                          var position = 0;
                          console.log("item.deliveryStatus[item.deliveryStatus.length - 1].status====>",item.deliveryStatus[item.deliveryStatus.length - 1].status);
                          if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "New Order") {
                            position = 0;
                          } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Packed") {
                            position = 1;
                          } else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Dispatch") {
                            position = 2;
                           } 
                           else if (item.deliveryStatus[item.deliveryStatus.length - 1].status === "Delivered & Paid") {
                            position = 4;
                          }  
                          else {
                             position = 4;
                           }
                          return (
                            <View style={styles.prodinfoparent}>
                              <View style={styles.orderid}><Text style={styles.orderidinfo}>Order ID : {item.orderID}</Text></View>
                              <View style={styles.myorderdets}>
                                {
                                  item.products && item.products.length > 0 ?
                                    item.products.map((pitem, index) => {
                                      return (
                                          <Card key={index} containerStyle={styles.prodorders} wrapperStyle={{flexDirection:"row",flex:1}}>
                                            <View style={{flex:.25}}>
                                            {pitem.productImage.length > 0 ? <Image
                                                style={styles.img15}
                                                source={{ uri: pitem.productImage[0] }}
                                                resizeMode="contain"
                                              />
                                              :
                                              <Image
                                                source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                                                style={styles.img15}
                                                resizeMode="contain"
                                              />
                                              }
                                            </View>
                                            <View style={{flex:.75}}>
                                              <Text style={styles.myorderprodinfo}>{pitem.productName}</Text> 
                                           </View> 
                                          </Card>
                                      );
                                    })
                                    : null
                                }
                              </View>
                              <View style={styles.orderstatusmgtop}>
                                {
                                  item && item.deliveryStatus
                                    && item.deliveryStatus[item.deliveryStatus.length - 1].status !== 'Cancelled' ?
                                    <View style={styles.orderstatus}>
                                      <Text style={styles.orderstatustxt}>Order Status</Text>
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
                              </View>
                              <View style={styles.ordereddates}>
                                <Text style={styles.myordereddate}>Ordered Date : {moment(item.createdAt).format("DD/MM/YYYY hh:mm a")}</Text>
                              </View>

                              <View style={styles.orderdetsandcancelbtn}>
                              {item && item.deliveryStatus
                                && item.deliveryStatus[item.deliveryStatus.length - 1].status !== 'Cancelled' ?
                                <View style={styles.ordercancelstatus}>
                                  <View style={styles.ordercancelsstatus}>
                                    <Button
                                      onPress={() => navigation.navigate('OrderDetails', { orderid: item._id })}
                                      titleStyle={commonStyles.buttonText1}
                                      title="ORDER DETAILS"
                                      buttonStyle={commonStyles.button}
                                      containerStyle={commonStyles.buttonContainer}
                                    />
                                  </View>
                                   {item.deliveryStatus[item.deliveryStatus.length - 1].status === "Delivered & Paid" ?
                                    null
                                    :
                                    <View style={styles.orderdetailsstatus}>
                                      <Button
                                        onPress={() => cancelorderbtn(item._id)}
                                        titleStyle={styles.buttonText}
                                        title="CANCEL ORDER"
                                        buttonStyle={styles.buttonRED}
                                        containerStyle={styles.buttonContainer2}
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
}
