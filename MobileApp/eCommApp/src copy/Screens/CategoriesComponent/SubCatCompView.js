
import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,ActivityIndicator,

} from 'react-native';
import { Header, Button, Icon, SearchBar } from "react-native-elements";
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import HeaderBar5 from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import { colors } from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Counter from "react-native-counters";
import Modal from "react-native-modal";
// import {AppEventsLogger} from 'react-native-fbsdk';    

export default class SubCatCompView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      isOpen: false,
      starCount: 2.5,
      productID: '',
      countofprod: '',
      productName: '',
      productUrl: '',
      discountedPrice: '',
      originalPrice: '',
      color: '',
      discountPercent: '',
      productDetails: '',
      featureList: '',
      wishlisted: '',
      alreadyincarts: false,
      wishlistedproduct: false,
      alreadyinwishlist: false,
      productImage: [],
      currency:""
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {

    const productID = this.props.navigation.getParam('productID', 'No productID');
    // console.log('productID-------------------------->', productID);
    this.setState({
      productID: productID
    }, () => {
      this.getProductsView(this.state.productID);
    })

    AsyncStorage.multiGet(['user_id', 'token'])
      .then((data) => {
        userId = data[0][1],
          this.setState({
            userId: userId,
          }, () => {
            console.log('userId', this.state.userId)
            this.wishlisteddata(this.state.userId);
            
          })
      })
    })
  }
  componentWillUnmount () {
    this.focusListener.remove()
    
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    this.getProductsView(nextProps.productID);
    this.wishlisteddata(this.state.userId);
  }

  wishlisteddata(userId){
    axios.get('/api/wishlist/get/userwishlist/'+ userId)
    .then((response) => {
      
      var wishprod = response.data;
      let wished = [];
        
          for(var i=0;i<wishprod.length;i++){
          wished.push({
            'product_ID':  wishprod[i].product_ID,
          })
          if(wished[i].product_ID === this.state.productID){
            this.setState({ wishlistedproduct: true })
          } 
          // console.log('wished After for=======>', wished);
          // console.log('wished After for=======>', this.state.productID);
        }
    })
    .catch((error) => {
      console.log('error', error);
    })
  }
  addtowishlist = (productid) => {
    const wishValues = {
      "user_ID": this.state.userId,
      "product_ID": productid,
    }
    console.log("wishValuess==>", wishValues);
    axios.post('/api/wishlist/post', wishValues)
      .then((response) => {
        this.wishlisteddata(this.state.userId);        
        console.log(" response wishValuess==>", response.data);
        if(response.data.message === "Product removed from wishlist successfully."){
          this.setState({
            alreadyinwishlist: true,
            wishlistedproduct: false, 
          });
        }else{
          this.setState({
            wishlisted: true,
             wishlistedproduct: true, 
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  getProductsView(productID) {
    // console.log(" ProductsView =========>", productID);

    axios.get("/api/Products/get/one/" + productID)
      .then((response) => {
        // AppEventsLogger.logEvent('View Content', response.data.originalPrice, response.data.productName);
        

        // console.log("response.data ProductsView =========>", response.data);
        this.setState({
          productdata: response.data,
          brand: response.data.brand,
          brandNameRlang: response.data.brandNameRlang,
          productName: response.data.productName,
          productNameRlang : response.data.productNameRlang,
          shortDescription: response.data.shortDescription,
          productUrl: response.data.productUrl,
          discountedPrice: response.data.discountedPrice,
          originalPrice: response.data.originalPrice,
          color: response.data.color,
          size: response.data.size,
          unit: response.data.unit,
          discountPercent: response.data.discountPercent,
          productDetails: response.data.productDetails,
          featureList: response.data.featureList,
          productImage: response.data.productImage,
          currency : response.data.currency
        })
      })
      .catch((error) => {
        // console.log('error', error);
      })
  }
  onChange(number, type) {
    // console.log(id, number, type) // 1, + or -
    // console.log("number ==>", number)
    // console.log("type ==>", type)
    var carqty = {};
    this.setState({
      number: parseInt(number),
      plusminustype: type
    });
  }
  handlePressAddCart() {
    // console.log("this.state.number addCart =========>", this.state.number === undefined || "" ? 1: this.state.number);
    const formValues = {
      "user_ID": this.state.userId,
      "product_ID": this.state.productID,
      "quantity": this.state.number === undefined || "" ? 1 : this.state.number,
    }
    console.log("formValues addCart =========>", formValues);
    axios
      .post('/api/Carts/post', formValues)
      .then((response) => {
        this.setState({
          addtocart: true,
        });
        // this.props.navigation.navigate('CartComponent', { user_ID: this.state.userId, product_ID: this.state.productID });
      })
      .catch((error) => {
        this.setState({ alreadyincarts: true })
        console.log('error', error);
      })
  }



  updateMenuState(isOpen) {
    this.setState({ isOpen });
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

  renderPage(item, index) {
    return (
      <View key={index}>
        <ImageBackground
          style={styles.prodimg}
          source={{ uri: item.productImage }}
          resizeMode={"stretch"}
        >
        </ImageBackground>
      </View>
    );
  }

  searchUpdated(text) {
    this.setState({ searchText: text });
  }


  render() {
    console.log("this.state.",this.state)
    const { navigate, dispatch, goBack } = this.props.navigation;
    return (
      <React.Fragment>
        <HeaderBar5
          goBack={goBack}
          navigate={navigate}
          headerTitle={this.state.productName}
          toggle={() => this.toggle.bind(this)}
          openControlPanel={() => this.openControlPanel.bind(this)}
        />
        <View style={styles.prodviewcatsuperparent}>
        {
          this.state.productName  && this.state.discountedPrice ?

        
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={styles.formWrapper}>

              <Text numberOfLines={1} style={styles.produrl}></Text>
              <View style={styles.imgvw}>
                {this.state.productImage.length > 0 ?
                  <Image
                    source={{ uri: this.state.productImage[0] }}
                    style={styles.saleimg}
                    resizeMode="contain"
                  />
                  :
                  <Image
                    source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                    style={styles.saleimg}
                  />
                }
                {
                  this.state.wishlistedproduct ?
                    <TouchableOpacity style={[styles.flx1, styles.wishlisthrtproductview]}
                          onPress={() => this.addtowishlist(this.state.productID)} >
                      <Icon size={25} name='heart' type='font-awesome' color='#ed3c55' />
                    </TouchableOpacity>
                  :
                  
                    <TouchableOpacity style={[styles.flx1, styles.wishlisthrtproductview]}
                          onPress={() => this.addtowishlist(this.state.productID)} >
                      <Icon size={25} name='heart-o' type='font-awesome' color='#ed3c55' />
                    </TouchableOpacity>
                }
   
                <View style={styles.prodnameview}>
                  {/* (i % 2 == 0 ? {} : { marginLeft: 12 } */}
                  {this.state.brandNameRlang ?
                    <Text numberOfLines={1} style={[styles.brandname]} style={styles.regionalBrandName}>{this.state.brandNameRlang}</Text>
                    : 
                    <Text numberOfLines={1} style={[styles.brandname]}>{item.brand}</Text>
                  }
                  {this.state.productNameRlang ?
                    <Text numberOfLines={1} style={[styles.nameprod]} style={styles.regionalProductName}>{this.state.productNameRlang}</Text>
                    :
                    <Text numberOfLines={1} style={[styles.nameprod]}>{this.state.productName}</Text>
                  }
                  {/* <Text numberOfLines={1} style={styles.brandname}>{this.state.brand}</Text>
                  <Text numberOfLines={1} style={styles.productname}>{this.state.productName}</Text>
                  <Text numberOfLines={1} style={styles.shortDescription}>{this.state.shortDescription}</Text> */}
                </View>
                <View style={styles.flxdirview}>
                  <Icon
                    name={this.state.currency}
                    type="font-awesome"
                    size={18}
                    color="#333"
                    iconStyle={styles.rupeeicn}
                  />
                  {/* <Text style={styles.rupeetxt}> {this.state.discountedPrice}</Text> */}
                  <Text style={styles.proddetprice}>{this.state.discountedPrice}  {this.state.size ? <Text style={styles.packofnos}> - {this.state.size}  {this.state.unit}</Text> : null}</Text>
                </View>
              </View>
              <View style={styles.orderstatus}>
                <View style={styles.kgs}>
                  <Text style={styles.orderstatustxt}>{this.state.size} {this.state.unit !== 'Number' ? this.state.unit : ''}</Text>
                </View>
                <View style={styles.qtys}>
                  <Counter start={1} min={1}
                    buttonStyle={{
                      borderColor: '#ed3c55',
                      borderWidth: 1,
                      borderRadius: 25,
                      width: 20,
                      height: 10
                    }}
                    buttonTextStyle={{
                      color: '#ed3c55',
                    }}
                    countTextStyle={{
                      color: '#ed3c55',
                    }}
                    size={5}
                    value={this.state.countofprod}
                    onChange={this.onChange.bind(this)} />
                </View>
              </View>
              <View style={styles.detailclr}>
                {this.state.color ? 
                <Text style={styles.detailcolor}>Details: {this.state.color}</Text>
                : null}
                {
                  this.state.productDetails == "-" ?
                    <Text style={styles.detaildetailstxt}>"Product details not available"</Text>
                    :
                    <Text style={styles.detaildetailstxt}>{this.state.productDetails.replace(/<[^>]*>/g, '').replace(/\&nbsp;/g, '')}</Text>
                }
                <View>
                  <Button
                    onPress={() => this.handlePressAddCart()}
                    title={"ADD TO CART"}
                    buttonStyle={styles.button1}
                    containerStyle={styles.buttonContainer1}
                    icon={
                      <Icon
                        name="shopping-cart"
                        type="feather"
                        size={25}
                        color="#fff"
                        iconStyle={styles.mgrt10}
                      />
                    }
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          :
          <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
              <ActivityIndicator size="large" color="#ed3c55" />

          {/* <BouncingPreloader
              icons={[
                require("../../AppDesigns/currentApp/images/bellpaper.png"),
                require("../../AppDesigns/currentApp/images/carrot.png"),
                require("../../AppDesigns/currentApp/images/mangooo.png"),
                require("../../AppDesigns/currentApp/images/tomato.png"),
              ]}
              leftRotation="-680deg"
              rightRotation="360deg"
              speed={2000} /> */}
        </View>
        }
          <Modal isVisible={this.state.wishlisted}
            onBackdropPress={() => this.setState({ wishlisted: false })}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ zIndex: 999 }}
            animationOutTiming={500}>
            <View style={styles.modalmainvw}>
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

          <Modal isVisible={this.state.alreadyinwishlist}
            onBackdropPress={() => this.setState({ alreadyinwishlist: false })}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ zIndex: 999 }}
            animationOutTiming={500}>
            <View style={styles.modalmainvw}>
              <View style={{ justifyContent: 'center', }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20, }}>
                Product is remove from wishlist.
              </Text>
              <View style={styles.yesmodalbtn}>
                <Button
                  onPress={() => this.setState({ alreadyinwishlist: false })}
                  titleStyle={styles.modalText}
                  title="OK"
                  buttonStyle={styles.modalGreen1}
                  containerStyle={styles.buttonContainer1}
                />
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.addtocart}
            onBackdropPress={() => this.setState({ addtocart: false })}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming={500}>
            <View style={styles.modalmainvw}>
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
          <Modal isVisible={this.state.alreadyincarts}
            onBackdropPress={() => this.setState({ alreadyincarts: false })}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ zIndex: 999 }}
            animationOutTiming={500}>
            <View style={styles.modalmainvw}>
              <View style={{ justifyContent: 'center', }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20, }}>
                Product is already to Cart.
              </Text>
              <View style={styles.yesmodalbtn}>
                <Button
                  onPress={() => this.setState({ alreadyincarts: false })}
                  titleStyle={styles.modalText}
                  title="OK"
                  buttonStyle={styles.modalGreen1}
                  containerStyle={styles.buttonContainer1}
                />
              </View>
            </View>
          </Modal>
        </View>
        <Footer />
      </React.Fragment>
    );

  }
}



