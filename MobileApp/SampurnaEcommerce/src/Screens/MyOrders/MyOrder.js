
import React from 'react';
import {
  ScrollView,Text,View,TouchableOpacity,Image,Alert,AsyncStorage,ActivityIndicator
} from 'react-native';
import Modal from "react-native-modal";
import { Button, Icon,} from "react-native-elements";
import StepIndicator from 'react-native-step-indicator';
import Menu from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import { colors } from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import axios from 'axios';
import moment from 'moment';
const labels = ["Order Placed", "Packed", "Out for delivery", "Delivered"];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013',
}
// stepStrokeFinishedColor: '#ed3c55',

export default class MyOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      isOpen: false,
      cancelordermodal: false,
    };
  }
  componentDidMount() {
    this.getorderlist();
  }
  getorderlist() {
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        this.setState({ user_id: data[1][1] })
        axios.get('/api/ecommusers/' + data[1][1])
          .then((res) => {
            this.setState({
              fullName: res.data.profile.fullName,
              email: res.data.profile.email,
              mobNumber: res.data.profile.mobile,
            })

          })
          .catch((error) => {
            console.log('error', error)
          });
        axios.get('/api/orders/get/list/' + data[1][1])
          .then((response) => {
            // console.log("response LIst:==>>>", response.data);
            var myorders = response.data
            this.setState({ myorders: myorders })
          })
          .catch((error) => {
            console.log('error', error)
          });
      });
  }
  componentWillReceiveProps(nextProps) {
    this.getorderlist();
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  displayValidationError = (errorField) => {
    let error = null;
    if (this.state[errorField]) {
      error = <View style={{ width: '100%' }}>
        <Text style={{ color: '#dc3545' }}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }

  toggle() {
    let isOpen = !this.state.isOpen;
    this.setState({
      isOpen
    });
  }

  closeControlPanel = () => {
    this._drawer.close()
  }

  openControlPanel = () => {
    this._drawer.open()
  }
  confirmcancelorderbtn = () => {
    var formValues = {
      "orderID": this.state.cancelorderid,
      "userid": this.state.user_id,
    }
    console.log("formValues==>", formValues);
    axios.patch('/api/orders/get/cancelOrder', formValues)
      .then((response) => {
        // console.log("response cancel order==>", response.data);
        axios.get('/api/orders/get/one/' + this.state.cancelorderid)
          .then((res) => {
            // console.log("res cancel order==>", res.data);
            this.setState({
              cancelordermodal: false,
            });
            this.getorderlist();
            Alert.alert(
              "Your order has been cancelled."
            );
            // =================== Notification OTP ==================
            var sendData = {
              "event": "4",
              "toUser_id": this.state.user_id,
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
            // =================== Notification ==================
           
            
          })
          .catch((error) => {
          })
      });
  }
  cancelorderbtn = (id) => {
    this.setState({
      cancelordermodal: true,
      cancelorderid: id,
    });
  }

  handleZipChange(value) {
    let x = value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,4})/);
    let y = !x[2] ? x[1] : x[1] + '-' + x[2];
    this.setState({
      zipcode: y,
    });
  }

  handleDelete = (id) => {
    Alert.alert("", "Are you sure you want to delete ?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          this.deleteCompetitor(id);
        }
      },
    ]);
  };
  render() {
    const { navigate, dispatch, goBack } = this.props.navigation;
    if (this.props.loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <React.Fragment>
          <HeaderBar5
            goBack={goBack}
            navigate={navigate}
            headerTitle={"My Orders"}
            toggle={() => this.toggle.bind(this)}
            openControlPanel={() => this.openControlPanel.bind(this)}
          />
          <View style={styles.superparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <View style={styles.parent}>
                  {
                    this.state.myorders ?
                      this.state.myorders.length > 0 ?
                        this.state.myorders.map((item, i) => {
                          // this.activitysteps(item.deliveryStatus)
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
                                      // console.log("pitem===>", item.createdAt);
                                      return (
                                        <View >
                                          <View style={styles.prodorders}>
                                            <View style={styles.flx3}>
                                              <View style={styles.imgvw}>
                                                <Image
                                                  style={styles.img15}
                                                  source={{ uri: pitem.productImage[0] }}
                                                />
                                              </View>
                                              <Text style={styles.myorderprodinfo}>{pitem.productName}</Text>
                                            </View>
                                          </View>

                                        </View>

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
                                      onPress={() => this.props.navigation.navigate('OrderDetails', { orderid: item._id })}
                                      titleStyle={styles.buttonText}
                                      title="ORDER DETAILS"
                                      buttonStyle={styles.buttonGreen}
                                      containerStyle={styles.buttonContainer2}
                                    />
                                  </View>
                                  {
                                    item.deliveryStatus[item.deliveryStatus.length - 1].status === "Delivered & Paid" ?
                                    null
                                    :
                                    <View style={styles.orderdetailsstatus}>
                                      <Button
                                        onPress={() => this.cancelorderbtn(item._id)}
                                        titleStyle={styles.buttonText}
                                        title="CANCEL ORDER"
                                        buttonStyle={styles.buttonRED}
                                        containerStyle={styles.buttonContainer2}
                                      />
                                    </View>
                                  }
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
                        <ActivityIndicator size="large" color="#ed3c55" />
                      </View>
                  }


                </View>
              </View>
            </ScrollView>

          </View>
          <Footer />
          <Modal isVisible={this.state.cancelordermodal}
            onBackdropPress={() => this.setState({ cancelordermodal: false })}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: "#ed3c55" }}>
              <View style={{ justifyContent: 'center', backgroundColor: "transparent", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
                Are you sure you want to Cancel this order?
              </Text>
              <View style={styles.cancelbtn}>
                <View style={styles.cancelvwbtn}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => this.setState({ cancelordermodal: false })}
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
                      onPress={() => this.confirmcancelorderbtn()}
                      titleStyle={styles.buttonText1}
                      title="Yes"
                      buttonStyle={styles.buttonGreen}
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
}
