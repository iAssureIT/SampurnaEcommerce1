import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { Button, Icon, } from "react-native-elements";
import Modal from "react-native-modal";
import axios from "axios";
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import Notification from '../../ScreenComponents/Notification/Notification.js'
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/OrderSummaryStyles.js';
import { colors } from '../../AppDesigns/currentApp/styles/styles.js';
// import {AppEventsLogger} from 'react-native-fbsdk';    

export default class OrderSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      isOpen: false,
      starCount: 2.5,
      shippingtiming: "",
      "startRange": 0,
      "limitRange": 10,
    };
    this.handleTypeChange = this.handleTypeChange.bind(this);
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
  componentDidMount() {
    const product_ID = this.props.navigation.getParam('product_ID', 'No product_ID');
    const user_id = this.props.navigation.getParam('user_id', 'No user_ID');
    const adddata = this.props.navigation.getParam('adddata', 'No adddata');
    this.setState({
      product_ID: product_ID,
      user_ID: user_id,
      adddata: adddata,
      adddataaddType: adddata.addType,
      adddataname: adddata.name,
      adddataaddressLine1: adddata.addressLine1,
      adddataaddressLine2: adddata.addressLine2,
      adddatacity: adddata.city,
      adddatacountry: adddata.country,
      adddatapincode: adddata.pincode,
      adddatamobileNumber: adddata.mobileNumber,
      adddatastate: adddata.state,
    }, () => {
      this.getCartData(this.state.user_ID, this.state.product_ID);
      this.gettimes(this.state.startRange, this.state.limitRange);
      this.getdiscounteddata(this.state.startRange, this.state.limitRange);
    })
  }
  handleTypeChange = (value) => {
    console.log('gettimes ===> ', value);
    this.setState({
      shippingtiming: value,
    });
  }
  gettimes(startRange, limitRange) {
    axios.get('/api/time/get/list-with-limits/' + startRange + '/' + limitRange)
      .then((response) => {
        var array = response.data.map((a, i) => { return { label: a.fromtime + " - " + a.totime, value: a.fromtime + "-" + a.totime } })
        this.setState({
          gettimes: array
        })
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
  getdiscounteddata(startRange, limitRange) {
    axios.get('/api/discount/get/list-with-limits/' + startRange + '/' + limitRange)
        .then((response) => {
            console.log('tableData = ', response.data[0]);
            this.setState({
                discountdata: response.data[0],
                discounttype: response.data[0].discounttype,
                discountin: response.data[0].discountin,
                discountvalue: response.data[0].discountvalue,
            },()=>{
              console.log('discountvalue = ', this.state.discountvalue);
                var amountofgrandtotal =  this.state.discountdata !== undefined ?
                                            this.state.totaloriginalprice && this.state.discountin === "Percent" ?
                                              this.state.totaloriginalprice - (this.state.totaloriginalprice * this.state.discountvalue)/ 100
                                            : this.state.totaloriginalprice - this.state.discountvalue
                                          : this.state.totaloriginalprice
            console.log('amountofgrandtotal = ', amountofgrandtotal);
            this.setState({amountofgrandtotal : amountofgrandtotal})
             })
        })
        .catch((error) => {
            console.log('error', error);
        });
}
  getCartData() {
    this.setState({ loading: true })
    axios.get('/api/Carts/get/cartproductlist/' + userId)
      .then((response) => {
        this.setState({ loading: false })
        if (response.data.length > 0) {
          // console.log("Item size==>", response.data[0].cartItems[0].productDetail);
          this.setState({
            subtotalitems: response.data[0].cartItems.length,
            cartData: response.data[0].cartItems,
            subTotal: response.data.subTotal,
            saving: response.data.saving,
            cartTotal: response.data.cartTotal,
            currency : response.data[0].cartItems[0].productDetail.currency
          }, () => {
            this.gettotalcount();
          })
        } else {
          this.setState({
            cartData: [],
          })
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  gettotalcount() {
    var resdata = this.state.cartData;
    let UserArray = [];
    for (let i = 0; i < resdata.length; i++) {
      var totalprice = resdata[i].subTotal;
      UserArray.push(totalprice);
    }
    let totalAmount = UserArray.reduce(function (prev, current) {
      return prev + +current
    }, 0);
    this.setState({
      totaloriginalprice: totalAmount,
    })
  }
  handleZipChange(value) {
    let x = value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,4})/);
    let y = !x[2] ? x[1] : x[1] + '-' + x[2];
    this.setState({
      zipcode: y,
    });
  }
  paymentmethodspage() {
    // AppEventsLogger.logEvent('Initiate Checkout');
    // this.props.navigation.navigate('PaymentMethod', { cartdata: this.state.cartData, adddata: this.state.adddata, userID: this.state.user_ID, totalamountpay: this.state.totaloriginalprice, shippingtime: this.state.shippingtiming, })
    var amt =   this.state.discountdata !== undefined ?
        this.state.totaloriginalprice && this.state.discountin === "Percent" ?
            this.state.totaloriginalprice - (this.state.totaloriginalprice * this.state.discountvalue)/ 100
            : this.state.totaloriginalprice - this.state.discountvalue
        : this.state.totaloriginalprice;
    this.props.navigation.navigate('PaymentMethod', { cartdata: this.state.cartData, adddata: this.state.adddata, userID: this.state.user_ID, totalamountpay: amt, discount: this.state.discountvalue, shippingtime: this.state.shippingtiming, })
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
    const { navigate, goBack } = this.props.navigation;
    let fromtotimes = this.state.shippingtimes;
    return (
      <React.Fragment>
        <HeaderBar5
          goBack={goBack}
          headerTitle={'Order Summary'}
          navigate={navigate}
        />
        <View style={styles.addsuperparent}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={styles.padhr15}>
              <View style={styles.addcmporder}>
                <View style={styles.orderaddchkbx}>
                  <Text style={styles.addname}>{this.state.adddataname} </Text>
                  <Text style={styles.addoffice}> {this.state.adddataaddType} </Text>
                </View>
                <View style={styles.orderpadhr18}>
                  <Text style={styles.address}> {this.state.adddataaddressLine1}</Text>
                  <View style={styles.mobflx}>
                    <Text style={styles.mobileno}>Mobile:</Text>
                    <Text style={styles.mobilenum}>{this.state.adddatamobileNumber}</Text>
                  </View>
                  <View style={styles.confirmbtn}>
                    <TouchableOpacity >
                      <Button
                        onPress={() => this.props.navigation.navigate('AddressDefaultComp', this.state.user_ID)}
                        title={"Change or Add Address"}
                        buttonStyle={styles.button1}
                        containerStyle={styles.buttonContainer1}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.confirmbtn, styles.marginBottom20]}>
                  <View style={[styles.inputWrapper]}>
                    <View style={styles.inputImgWrapper}></View>
                    <View style={styles.inputTextWrapper}>
                      {/* {console.log("Times in data=>",this.state.gettimes)} */}
                      <Dropdown
                        placeholder={"-- Select Time --"}
                        onChangeText={(value) => this.handleTypeChange(value)}
                        data={this.state.gettimes}
                        value={this.state.shippingtiming}
                        containerStyle={styles.ddContainer}
                        dropdownOffset={{ top: 0, left: 0 }}
                        itemTextStyle={styles.ddItemText}
                        inputContainerStyle={styles.ddInputContainer}
                        labelHeight={10}
                        tintColor={'#FF8800'}
                        labelFontSize={15}
                        fontSize={15}
                        baseColor={'#666'}
                        textColor={'#333'}
                        labelTextStyle={{ left: 5 }}
                        style={styles.ddStyle}
                        disabledLineType='none'
                      />
                    </View>
                  </View>
                  <Text style={styles.tomorroworder}>Your order will be delivered to you by 4pm to 9pm.</Text>
                </View>
              </View>
              <View style={styles.formWrapper}>
                <Text style={styles.totaldata}>You're Buying</Text>
                <View style={styles.cartdetails}>
                  {!this.state.loading ?
                    this.state.cartData && this.state.cartData.length > 0 ?
                      this.state.cartData.map((item, index) => {
                        return (
                          <View key={index} style={styles.proddetails}>
                            <View style={styles.flxdir}>
                              <View style={styles.flxpd}>
                                {
                                  item.productDetail.productImage.length > 0 ?
                                    <Image
                                      source={{ uri: item.productDetail.productImage[0] }}
                                      style={styles.imgwdht}
                                    />
                                    :
                                    <Image
                                      source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                                      style={styles.imgwdht}
                                      resizeMode="contain"
                                    />
                                }
                              </View>
                              <View style={styles.flxmg}>
                                <Text style={styles.productname}>{item.productDetail.productName}</Text>
                                <View style={styles.productdets}>
                                  <Icon
                                    name={item.productDetail.currency}
                                    type="font-awesome"
                                    size={11}
                                    color="#666"
                                    iconStyle={styles.iconstyle}
                                  />
                                  <Text style={styles.proddetprice}>{item.productDetail.discountedPrice * item.quantity}</Text>
                                </View>
                                {/* <Text style={styles.prodqtyunit}>Size: {item.productDetail.size + " " + item.productDetail.unit}</Text> */}
                                <Text style={styles.prodqtyunit}>Qty: {item.quantity + " Pack(s)"}</Text>
                              </View>
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
                  <Text style={styles.totaldata}>Pricing Details </Text>
                  <View style={styles.totaldetails}>
                    <View style={styles.flxdata}>
                      <View style={styles.flx7}>
                        <Text style={styles.totaldata}>Total ({this.state.subtotalitems} Item(s)) </Text>
                      </View>
                      <View style={styles.flx3}>
                        <View style={styles.endrow}>
                          <Icon
                            name={this.state.currency}
                            type="font-awesome"
                            size={15}
                            color="#666"
                            iconStyle={styles.iconstyle}
                          />
                          <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{this.state.totaloriginalprice}</Text>
                        </View>
                      </View>
                    </View>



                    <View style={styles.flxdata}>
                      <View style={styles.flx7}>
                        <Text style={styles.totaldata}>Discount </Text>
                      </View>
                      <View style={styles.flx3}>
                        <View style={styles.endrow}>
                        
                        { 
                          this.state.discountin === "Amount" ? 
                            <Icon
                              name={this.state.currency}
                              type="font-awesome"
                              size={15}
                              color="#666"
                              iconStyle={styles.iconstyle}
                            />
                          : null 
                        }
                        <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{this.state.discountvalue > 1 ? this.state.discountvalue : 0.00}</Text>
                         
                         {
                           this.state.discountin === "Percent" ? 
                              <Icon
                                name="percent"
                                type="font-awesome"
                                size={15}
                                color="#666"
                                iconStyle={styles.iconstyle}
                              /> 
                            : null
                          } 
                         
                         
                          {/* <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{this.state.discountvalue}</Text> */}
                        </View>
                      </View>
                    </View>



                    <View style={styles.orderbrdr}>
                      <View style={styles.flx7}>
                        <Text style={styles.totaldata}>Delivery </Text>
                      </View>
                      <View style={styles.flx3}>
                        <View style={styles.endrow}>
                          <Text style={styles.free}>&nbsp;&nbsp;Free</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.amountpay}>
                      <View style={styles.flx7}>
                        <Text style={styles.totaldata}>Amount Payable </Text>
                      </View>
                      <View style={styles.flx3}>
                        <View style={styles.endrow}>
                          <Icon
                            name={this.state.currency}
                            type="font-awesome"
                            size={15}
                            color="#666"
                            iconStyle={styles.iconstyle}
                          />
                          <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{  this.state.discountdata !== undefined ?
                                            this.state.totaloriginalprice && this.state.discountin === "Percent" ?
                                                    this.state.totaloriginalprice - (this.state.totaloriginalprice * this.state.discountvalue)/ 100
                                                    : this.state.totaloriginalprice - this.state.discountvalue
                                                : this.state.totaloriginalprice}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.margTp20}>
                      <TouchableOpacity >
                        <Button
                          onPress={() => this.paymentmethodspage()}
                          title={"PROCEED TO BUY"}
                          buttonStyle={styles.button1}
                          containerStyle={styles.buttonContainer1}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginBottom: 30 }}>
                      <Text style={styles.securetxt}>Safe & Secure Payments | 100% Authentic Products</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <Footer />
        </View>

        <Modal isVisible={this.state.removewishlistmodal}
          onBackdropPress={() => this.setState({ removewishlistmodal: false })}
          coverScreen={true}
          hideModalContentWhileAnimating={true}
          style={{ paddingHorizontal: '5%', zIndex: 999 }}
          animationOutTiming={500}>
          <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: "#c10000" }}>
            <View style={{ justifyContent: 'center', }}>
              <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
            </View>
            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
              Product is removed from wishlist.
            </Text>
            <View style={styles.yesmodalbtn}>
              <View style={styles.ordervwbtn}>
                <TouchableOpacity>
                  <Button
                    onPress={() => this.setState({ removewishlistmodal: false })}
                    titleStyle={styles.buttonText1}
                    title="OK"
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
