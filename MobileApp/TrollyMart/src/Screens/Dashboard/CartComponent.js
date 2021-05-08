import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,ActivityIndicator,
} from 'react-native';
import { Button, Icon, } from "react-native-elements";
import Modal from "react-native-modal";
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
// import Footer from '../../ScreenComponents/Footer/Footer.js';
import {Footer} from '../../ScreenComponents/Footer/Footer1.js';
import Notification from '../../ScreenComponents/Notification/Notification.js'
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Cartstyles.js';
import { colors } from '../../AppDesigns/currentApp/styles/styles.js';
import axios from 'axios';
import Counter from "react-native-counters";

export default class CartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      isOpen: false,
      starCount: 2.5,
      cartData: '',
      cart: [],
      totalCartPrice: '',
      productData: {},
      productCartData: [],
      vatPercent: 0,
      companyInfo: "",
      totaloriginalprice: 0,
      cartProduct: "",
      startRange: 0,
      limitRange: 10,
      removefromcart: false,
      wishlisted: false,
      loading: false,
      shippingCharges: 0,
      quantityAdded: 0,
      totalIndPrice: 0,
    };
  }
  componentDidMount() {
    const product_ID = this.props.navigation.getParam('product_ID', 'No product_ID');
    const userId = this.props.navigation.getParam('user_ID', 'No user_ID');
    this.getshippingamount(this.state.startRange, this.state.limitRange);
    this.setState({
      product_ID: product_ID,
      userId: userId
    }, () => {
      this.getCartItems(this.state.userId, this.state.product_ID);
      this.getdiscounteddata(this.state.startRange, this.state.limitRange);
    })
  }
  UNSAFE_componentWillReceiveProps() {
    this.getCartItems(this.state.userId, this.state.product_ID);
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
  getshippingamount(startRange, limitRange) {
    axios.get('/api/shipping/get/list-with-limits/' + startRange + '/' + limitRange)
      .then((response) => {
        this.setState({
          minvalueshipping: response.data[0].shippingcosting,
        })
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
  getCartItems() {
    this.setState({ loading: true })
    axios.get('/api/Carts/get/cartproductlist/' + this.state.userId)
      .then((response) => {
        console.log("response",response);
        this.setState({ loading: false })
        if (response.data.length > 0) {
          this.setState({
            subtotalitems: response.data[0].cartItems.length,
            cartData: response.data[0].cartItems,
            subTotal: response.data.subTotal,
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
        this.setState({ loading: false })
        console.log('error', error);
      })
  }
  getCartData() {
    axios.get('/api/Carts/get/cartproductlist/' + this.state.userId)
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            subtotalitems: response.data[0].cartItems.length,
            cartData: response.data[0].cartItems,
            subTotal: response.data.subTotal,
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
        this.setState({ loading: false })
        console.log('error', error);
      })
  }
  DeleteItem() {
    const formValues = {
      "user_ID": this.state.userId,
      "cartItem_ID": this.state.cartitemid,
    }
    axios.patch("/api/carts/remove", formValues)
      .then((response) => {
        this.getCartData(this.state.userId, this.state.product_ID);
        this.setState({
          removefromcart: false,
        })
      })
  }
  DeleteItemfromcart(cartitemid) {
    this.setState({
      removefromcart: true,
      cartitemid: cartitemid,

    })
  }
  addtowishlist = (productid, cartid) => {
    const wishValues = {
      "user_ID": this.state.userId,
      "product_ID": productid,
    }
    axios.post('/api/wishlist/post', wishValues)
      .then((response) => {
        const formValues = {
          "user_ID": this.state.userId,
          "cartItem_ID": cartid,
        }
        axios.patch("/api/carts/remove", formValues)
          .then((response) => {
            this.setState({
              wishlisted: true,
            });
            this.getCartData(this.state.userId, this.state.product_ID);
          })
          .catch((error) => {
            console.log('error', error);
          })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  gettotalcount() {
    var resdata = this.state.cartData;
    // console.log('resdata', resdata[0].subTotal);
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
  onChange(product_ID, number, type) {
    console.log(product_ID, number, type) // 1, + or -
    const quantity = parseInt(number);
    const formValues = {
      "user_ID": this.state.userId,
      "product_ID": product_ID,
      "quantityAdded": quantity,
    }
    axios.patch("/api/carts/quantity", formValues)
      .then((response) => {
        this.getCartData(this.state.userId, this.state.product_ID);
        this.setState({
          incresecartnum: formValues.quantityAdded
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  render() {
    const { navigate, dispatch, goBack } = this.props.navigation;
    return (
      <React.Fragment>
        <HeaderBar5
          goBack={goBack}
          headerTitle={'react-native-material-dropdown-v2'}
          navigate={navigate}
          openControlPanel={() => this.openControlPanel.bind(this)}
        />
        <View style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={styles.formWrapper}>
              <View style={styles.cartdetails}>
                {
                  !this.state.loading ?
                    this.state.cartData && this.state.cartData.length > 0 ?
                      this.state.cartData.map((item, i) => {
                        return (
                          <View key={i}>
                            <View key={i} style={styles.proddetails}>
                              <View style={styles.flxdir}>
                                <View style={styles.flxpd}>
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('SubCatCompView', { productID: item.product_ID })}>
                                    {item.productDetail.productImage.length > 0 ?
                                      <Image
                                        style={styles.imgwdht}
                                        source={{ uri: item.productDetail.productImage[0] }}
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
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('SubCatCompView', { productID: item.product_ID })}>
                                    {console.log("cartcomponent item",item)}
                                    {item.productDetail.productNameRlang ?
                                    <Text style={{fontFamily:'aps_dev_priyanka',fontWeight:'Bold',fontSize:20,flexWrap:'wrap'}}>{item.productDetail.productNameRlang}</Text>
                                    : 
                                    <Text style={styles.productname}>{item.productDetail.productName}</Text>
                                    }
                                    </TouchableOpacity>
                                  <View style={styles.productdets}>
                                    <Icon
                                      name={item.productDetail.currency}
                                      type="font-awesome"
                                      size={12}
                                      color="#666"
                                      iconStyle={styles.iconstyle}
                                    />
                                    <Text style={styles.proddetprice}>{item.productDetail.discountedPrice} Per {item.productDetail.size}  {item.productDetail.unit.toUpperCase()}</Text>
                                  </View>
                                  <Counter start={item.quantity} min={1} max={100}
                                    buttonStyle={{
                                      borderColor: colors.theme,
                                      borderWidth: 1,
                                      borderRadius: 25,
                                      width: 20,
                                      height: 10
                                    }}
                                    buttonTextStyle={{
                                      color: colors.theme,
                                    }}
                                    countTextStyle={{
                                      color: colors.theme,
                                    }}
                                    size={5}
                                    onChange={this.onChange.bind(this, item.productDetail._id)} />
                                </View>
                                <View style={styles.flxmg2}>
                                  <View style={styles.proddeletes}>
                                    <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => this.addtowishlist(item.product_ID, item._id)} >
                                      <Icon size={20} name='heart-o' type='font-awesome' color={colors.theme} />
                                    </TouchableOpacity>
                                    <Icon
                                      onPress={() => this.DeleteItemfromcart(item._id)}
                                      name="delete"
                                      type="AntDesign"
                                      size={20}
                                      color="#ff4444"
                                      iconStyle={styles.iconstyle}
                                    />
                                  </View>
                                  {
                                    item.productDetail.availableQuantity > 0 ?
                                      <View style={styles.productdetsprice}>
                                        <Icon
                                           name={item.productDetail.currency}
                                          type="font-awesome"
                                          size={17}
                                          color="#666"
                                          iconStyle={styles.iconstyle}
                                        />
                                        <Text id={item._id} value={this.state['quantityAdded|' + item._id]} style={styles.proprice}>
                                          {/* {item.productDetail.discountedPrice * item.size } */}
                                          {item.productDetail.size > 0 ?
                                            item.productDetail.discountedPrice * item.quantity
                                            :
                                            item.productDetail.discountedPrice
                                          }
                                        </Text>
                                      </View>
                                      :
                                      <Text style={styles.totaldata}>SOLD OUT</Text>
                                  }
                                </View>
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
                        <Button
                              onPress={() => this.props.navigation.navigate('Dashboard')}
                              title={"Add Products"}
                              buttonStyle={styles.buttonshopping}
                              containerStyle={styles.continueshopping}
                        />
                      </View>
                    :
                    <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                      <ActivityIndicator size="large" color={colors.theme} />
                    </View>
                }
                {
                  this.state.cartData && this.state.cartData.length > 0 && this.state.subtotalitems ?
                    <View style={styles.totaldetails}>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.7 }}>
                          <Text style={styles.totaldata}>Subtotal ({this.state.subtotalitems} Item(s)) </Text>
                        </View>
                        <View style={{ flex: 0.3 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Icon
                               name={this.state.currency}
                              type="font-awesome"
                              size={16}
                              color="#666"
                              iconStyle={styles.iconstyle}
                            />
                            <Text style={styles.totalpriceincart}>{this.state.totaloriginalprice}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.7 }}>
                          <Text style={styles.totaldata}>Discount </Text>
                        </View> 
                        <View style={{ flex: 0.3 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
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
                        <Text style={styles.totalpriceincart}>{this.state.discountvalue > 1 ? this.state.discountvalue : 0.00}</Text>
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
                          </View>
                        </View>
                      </View>
                      <View style={styles.flxdata}>
                        <View style={{ flex: 0.7 }}>
                          <Text style={styles.totaldata}>Grand Total </Text>
                        </View>
                        <View style={{ flex: 0.3 }}>
                          <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Icon
                              name={this.state.currency}
                              type="font-awesome"
                              size={15}
                              color="#666"
                              iconStyle={styles.iconstyle}
                            />
                            {/* <Text style={styles.totalpriceincart}>&nbsp;&nbsp;{this.state.amountofgrandtotal}</Text> */}
                            <Text style={styles.totalpriceincart}>{  this.state.discountdata !== undefined ?
                                this.state.totaloriginalprice && this.state.discountin === "Percent" ?
                                    this.state.totaloriginalprice - (this.state.totaloriginalprice * this.state.discountvalue)/ 100
                                    : this.state.totaloriginalprice - this.state.discountvalue
                                : this.state.totaloriginalprice}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1, marginTop: 10 }}>
                        <Text style={styles.totalsubtxt}>Part of your order qualifies for Free Delivery </Text>
                      </View>
                      <View>
                        {this.state.minvalueshipping <= this.state.totaloriginalprice ?
                          <View>
                            <Button
                              onPress={() => this.props.navigation.navigate('AddressDefaultComp', { userID: this.state.userId })}
                              title={"PROCEED TO CHECKOUT"}
                              buttonStyle={styles.button1}
                              containerStyle={styles.buttonContainer1}
                            />
                            <View style={styles.flxdata}>
                              <View style={{ flex: 1 }}>
                                <Text style={styles.purchasep}>100% Purchase Protection | <Text style={styles.freshnsecuretxt}>Secure Payment </Text></Text>
                              </View>
                            </View>
                          </View>
                          :
                          <View>
                            <Text style={styles.minpurchase}>Minimum order should be ₹{this.state.minvalueshipping} to Checkout & Place Order.
                                 {"\n"}<Text style={styles.minpurchaseadd}>Add more products worth ₹{this.state.minvalueshipping - this.state.totaloriginalprice} to proceed further.</Text> </Text>
                          </View>

                        }
                      </View>

                    </View>
                    :
                    null
                }
              </View>
            </View>
          </ScrollView>
          <Footer />
          <Modal isVisible={this.state.removefromcart}
            onBackdropPress={() => this.setState({ removefromcart: false })}
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
                      onPress={() => this.setState({ removefromcart: false })}
                      titleStyle={styles.buttonText}
                      title="NO"
                      buttonStyle={styles.buttonRED}
                      containerStyle={styles.buttonContainer2}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.ordervwbtn}>
                    <Button
                      onPress={() => this.DeleteItem()}
                      titleStyle={styles.buttonText1}
                      title="Yes"
                      buttonStyle={styles.button1}
                      containerStyle={styles.buttonContainer2}
                    />
                </View>
              </View>
            </View>
          </Modal>

          <Modal isVisible={this.state.wishlisted}
            onBackdropPress={() => this.setState({ wishlisted: false })}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
              <View style={{ justifyContent: 'center', backgroundColor: "transparent", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
                Product is move to wishlist.
                </Text>
              <View style={styles.cancelbtn}>
                <View style={styles.cancelvwbtn}>
                  <TouchableOpacity>
                    <Button
                      onPress={() => this.setState({ wishlisted: false })}
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
        </View>
      </React.Fragment>
    );
  }
}



