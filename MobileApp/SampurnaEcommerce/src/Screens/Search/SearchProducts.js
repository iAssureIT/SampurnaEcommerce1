import React from 'react';
import {
  Text, View, TouchableOpacity, Image,AsyncStorage,ActivityIndicator,
} from 'react-native';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-material-dropdown';
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/FeatureProductComponentStyles.js';
import { Icon, Button } from "react-native-elements";
import axios from 'axios';
// import {AppEventsLogger} from 'react-native-fbsdk';    

export default class SearchProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productImg: [],
      newProducts: [],
      addtocart: false,
      wishlisted: false,
      packsizes: ""
    };
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }
  componentDidMount(){
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        this.setState({ user_id: data[1][1] })
      })
    if (this.props.searchProds) {
    for (var i = 0; i < this.props.searchProds.length; i++) {
      var availableSizes = [];
      if (this.props.searchProds[i].size) {
        availableSizes.push(
          {
            "productSize": this.props.searchProds[i].size * 1,
            "packSize": 1,
          },
          {
            "productSize": this.props.searchProds[i].size * 2,
            "packSize": 2,
          },
          {
            "productSize": this.props.searchProds[i].size * 4,
            "packSize": 4,
          },
        )
        this.props.searchProds[i].availableSizes = availableSizes;
      }
    }
  }else{
    null
  }
    this.setState({
      ProductsDetails: this.props.searchProds,
    })
  }
  componentWillReceiveProps(nextProps) {
    var searchlength = nextProps.searchProds; 
    // console.log('searchlength ===> ', searchlength);
    if (searchlength && nextProps.searchProds.length) {
    for (var i = 0; i < nextProps.searchProds.length; i++) {
      var availableSizes = [];
      if (nextProps.searchProds[i].size) {
        availableSizes.push(
          {
            "productSize": nextProps.searchProds[i].size * 1,
            "packSize": 1,
          },
          {
            "productSize": nextProps.searchProds[i].size * 2,
            "packSize": 2,
          },
          {
            "productSize": nextProps.searchProds[i].size * 4,
            "packSize": 4,
          },
        )
        nextProps.searchProds[i].availableSizes = availableSizes;
      }
    }
  }
    this.setState({
      ProductsDetails: nextProps.searchProds,
      type: nextProps.type
    })
  }
  handleTypeChange = (value,availablessiz) => {
    const result = availablessiz.filter(product => product.value == value);
    // console.log("result =========>", result);
    this.setState({
      packsizes: result[0].size,
    });
  }
  addtocart(productid) {
    const formValues = {
      "user_ID": this.state.user_id,
      "product_ID": productid,
      "quantity": this.state.packsizes === "" || 0 ? 1 :this.state.packsizes,
    }
    // console.log("formValues =========>", formValues);
    axios
      .post('/api/Carts/post', formValues)
      .then((response) => {
        // AppEventsLogger.logEvent('Add To Cart');
        this.setState({
          addtocart: true,
        });
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  addtowishlist = (productid) => {
    const wishValues = {
      "user_ID": this.state.user_id,
      "product_ID": productid,
    }
    console.log("wishValuess==>", wishValues);
    axios.post('/api/wishlist/post', wishValues)
      .then((response) => {
        // AppEventsLogger.logEvent('Add To Wishlist');
        this.setState({
          wishlisted: true,
        });
      })
      .catch((error) => {
        console.log('error', error);
      })
  }




  render() {
    return (
      <React.Fragment>
        <View style={styles.maintitle}>
          <Text style={styles.title}>Search Products </Text>  
        </View>
        <View style={styles.featurelistwrap}>
          <View style={styles.proddets}>
            { this.state.ProductsDetails  ?
              this.state.ProductsDetails && this.state.ProductsDetails.length > 0 ?
              this.state.ProductsDetails.map((item, i) => {
                var availablessiz = [];
                // var availablessiz =  
                // item && item.availableSizes && item.availableSizes.length ? 
                //  item.availableSizes.map((a, i) =>
                //  ({ label: a.packSize + " Pack", value: a.packSize }) )
                // : [];
                availablessiz = item.availableSizes ? item.availableSizes.map((a, i) => { return { value: a.productSize === 1000 ? "1 KG" :a.productSize === 2000 ? "2 KG" :  a.productSize +" "+ item.unit !== 'Number' ? item.unit : '' , size : a.packSize } }) : [] 
                // console.log("availablessiz",availablessiz)
                const packsizes = availablessiz.length > 0 ? availablessiz[0].value : '';
                // console.log("availablessiz =========>", availablessiz);
                return (
                  <View key={i} style={styles.mainrightside}>
                    <TouchableOpacity onPress={() => this.props.navigate('SubCatCompView', { productID: item._id })}>
                      <View style={styles.flx5}>

                        <View style={styles.flx1}>
                          {
                            item.productImage.length > 0 ?
                              <Image
                                source={{ uri: item.productImage[0] }}
                                style={styles.subcatimg}
                              />
                              :
                              <Image
                                source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                                style={styles.subcatimg}
                              />
                          }
                          <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => this.addtowishlist(item._id)} >
                            <Icon size={22} name='heart-o' type='font-awesome' color='#ed3c55' style={{ backgroundColor: "red" }} />
                          </TouchableOpacity>

                          {
                            item.discountPercent > 0 ?
                              <Text style={styles.peroff}> {item.discountPercent}% OFF</Text>
                              :
                              null
                          }
                        </View>
                        <View style={[styles.flx1, styles.protxt]}>
                        {item.brandNameRlang ?
                        <Text numberOfLines={1} style={[styles.brandname, (i % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalBrandName}>{item.brandNameRlang}</Text>
                        : 
                        <Text numberOfLines={1} style={[styles.brandname, (i % 2 == 0 ? {} : { marginLeft: 12 })]}>{item.brand}</Text>
                        }
                        {item.productName ?
                        <Text numberOfLines={1} style={[styles.nameprod, (i % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalProductName}>{item.productNameRlang}</Text>
                        :
                        <Text numberOfLines={1} style={[styles.nameprod, (i % 2 == 0 ? {} : { marginLeft: 12 })]}>{item.productName}</Text>
                        }                          
                        {/* <Text numberOfLines={1} style={[styles.shortDescription]}>{item.shortDescription}</Text> */}
                        </View>
                        <View style={[styles.flx1, styles.prdet]}>
                          <View style={[styles.flxdir]}>
                            <Icon
                              name="rupee"
                              type="font-awesome"
                              size={14}
                              color="#333"
                              iconStyle={{ marginTop: 3, marginRight: 3 }}
                            />
                            {/* <Text style={styles.ogprice}>{item.originalPrice} - <Text style={styles.packofnos}>{item.size} {item.unit}</Text> </Text> */}
                            {
                              item.discountPercent > 0 ?
                                <Text style={styles.discountedpricedata}>
                                  <Text style={styles.discountpricecut}>{item.originalPrice}</Text>
                                  <Text style={styles.ogprice}> {item.discountedPrice} {item.size !== 'Number' ?  item.size && item.unit ? <Text style={styles.packofnos}> - {item.size} {item.unit}</Text> : null : ''}
                                  </Text>
                                </Text>
                                :
                                <Text style={styles.ogprice}>{item.originalPrice} {item.size !== 'Number' ?  <Text style={styles.packofnos}>- {item.size} {item.unit}</Text> : ''} </Text>
                            }
                          </View>
                        </View>
                        <View style={styles.addtocartbtn}>
                        {availablessiz.length > 0 ?
                          <View style={styles.addbtn}>
                            <View style={[styles.inputWrapper]}>
                              <View style={styles.inputImgWrapper}></View>
                              <View style={styles.inputTextWrapper}>
                                  <Dropdown
                                    onChangeText={(value) => this.handleTypeChange(value,availablessiz)}
                                    data={availablessiz}
                                    value={packsizes}
                                    containerStyle={styles.ddContainer}
                                    dropdownOffset={{ top: 0, left: 0, bottom: 0 }}
                                    itemTextStyle={styles.ddItemText}
                                    inputContainerStyle={{ borderBottomColor: 'transparent', padding: 0 }}
                                  />
                              </View>
                            </View>
                          </View>
                        : null}
                         <View style={styles.sizedrpbtn}>
                            <Button
                              onPress={() => this.addtocart(item._id)}
                              titleStyle={styles.buttonText1}
                              title="Add"
                              buttonStyle={styles.buttonGreen}
                              containerStyle={styles.buttonContainer2}
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
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
            <View style={{ flex: 1, alignItems: 'center', marginTop: '40%' }}>
              <ActivityIndicator size="large" color="#ed3c55" />
          </View>
            }
          </View>
          <Modal isVisible={this.state.addtocart}
            onBackdropPress={() => this.setState({ addtocart: false })}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:"#ed3c55" }}>
              <View style={{ justifyContent: 'center', }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
                Product is added to cart.
              </Text>
              <View style={styles.yesmodalbtn}>
                <Button
                  onPress={() => this.setState({ addtocart: false })}
                  titleStyle={styles.modalText}
                  title="OK"
                  buttonStyle={styles.modalGreen1}
                  containerStyle={styles.buttonContainer1}
                />
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.wishlisted}
            onBackdropPress={() => this.setState({ wishlisted: false })}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:"#ed3c55" }}>
              <View style={{ justifyContent: 'center', }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20, }}>
                Product is added to wishlist.
                </Text>
              <View style={styles.yesmodalbtn}>
                <Button
                  onPress={() => this.setState({ wishlisted: false })}
                  titleStyle={styles.modalText}
                  title="OK"
                  buttonStyle={styles.modalGreen1}
                  containerStyle={styles.buttonContainer1}
                />
              </View>
            </View>
          </Modal>
        </View>
      </React.Fragment>
    );
  }
}