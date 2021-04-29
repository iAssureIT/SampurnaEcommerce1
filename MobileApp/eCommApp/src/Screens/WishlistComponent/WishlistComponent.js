import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import {  Icon,Button} from "react-native-elements";
import Modal from "react-native-modal";
import HeaderBar3 from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import Footer from '../../ScreenComponents/Footer/Footer1.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenStyles/Wishliststyles.js';
import { colors } from '../../AppDesigns/currentApp/styles/styles.js';
import axios from 'axios';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
export default class WishlistComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      isOpen: false,
      starCount: 2.5,
      productImage: [],
      ProductsDetails: '',
      subCategory_ID: '',
      category_ID: '',
      addtocart: false,
      alreadyincarts: false,
      wishlisted: false,
      loading: true,
      products: [],
    };
  }
  componentDidMount(){
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      console.log('hit getWishlistData 1');
      this.getWishlistData()
    })
  }

   UNSAFE_componentWillReceiveProps(nextProps){
    this.getWishlistData();
  }
  getWishlistData() {
    console.log('add to cart wishlist==>');
    this.setState({loading:true})
    AsyncStorage.multiGet(['user_id', 'token'])
    .then((data) => {
      userId = data[0][1];
    this.setState({ userId:userId });
      axios.get('/api/wishlist/get/userwishlist/' + userId)
      .then((response) => {
        console.log('res.data wishlist==>', response.data);
        if(response.data.length > 0){
          response.data.map((a, i) => {
            axios.get('/api/products/get/one/' + a.product_ID)
              .then((res) => {
                console.log('res.data wishlist==>', res.data);
                this.setState({loading:false})
                var products = this.state.products;
                var item = products.find(item => item.product_ID === res.data._id );
                if(item){
                  null
                }else{
                products.push({
                  "productName": res.data.productName,
                  "originalPrice": res.data.originalPrice,
                  "availableQuantity": res.data.availableQuantity,
                  "bestSeller": res.data.bestSeller,
                  "brand": res.data.brand,
                  "category": res.data.category,
                  "currency": res.data.currency,
                  "discountPercent": res.data.discountPercent,
                  "discountedPrice": res.data.discountedPrice,
                  "productCode": res.data.productCode,
                  "productImage": res.data.productImage,
                  "product_ID": res.data._id,
                  "wishlist_ID": a._id
                });
              }
                this.setState({
                  products: products
                })
              })
              .catch((error) => {
                this.setState({loading:false})
                console.log('error', error);
              })
          })
        }else{
          this.setState({loading:false})
        }
        
      })
      .catch((error) => {
        this.setState({loading:false})
        console.log('error', error);
      })
    })
    .catch((error) => {
      this.setState({loading:false})
      console.log('error', error);
    })
  } 
closemodal(){
  this.setState({ addtocart: false });
}
closemodalwishlist(){
  this.setState({ removefromwishlist: false });
}
  removefromwishlist(id) {
    console.log("ididid", id);
    axios.delete('/api/wishlist/delete/' + id)
      .then((response) => {
        this.getWishlistData();
        this.setState({ removefromwishlist: true, products: []})
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  addtocart(wishlist_ID,product_ID) {
    const formValues = {
      "user_ID": this.state.userId,
      "product_ID": product_ID,
      "quantity": 1,
    }
    axios
      .post('/api/Carts/post', formValues)
      .then((response) => {
        axios.delete('/api/wishlist/delete/' + wishlist_ID)
        .then((response) => {
          this.getWishlistData();
          this.setState({ addtocart: true, products: [], })
          console.log("ReMove from cart",response.data)
        })
        .catch((error) => {
          console.log('error', error);
        })
      
      })
      .catch((error) => {
        this.setState({ alreadyincarts: true })
        console.log('error', error);
      })
  }

  toggle() {
    let isOpen = !this.state.isOpen;
    this.setState({
      isOpen
    });
  }


  render() {
    const { navigate,goBack } = this.props.navigation;
      return (
        <React.Fragment>
          <HeaderBar3
            goBack={goBack}
            headerTitle={'My Wishlist'}
            navigate={navigate}
            openControlPanel={() => this.openControlPanel.bind(this)}
          />
          <View style={styles.addsuperparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
               <View style={styles.formWrapper}><View>
                  <View style={styles.proddets}>
                    {!this.state.loading ?
                      this.state.products &&this.state.products.length > 0 ?
                          this.state.products.map((item, i) => {
                        return ( 
                          <View key={i} style={styles.width160}>
                            <TouchableOpacity  onPress={() => this.props.navigation.navigate('SubCatCompView', { productID: item.product_ID })}>
                              <View style={styles.flx5}>
                                <View style={styles.flx1}>
                                 {item.productImage.length> 0 ?
                                      <Image
                                        source={{ uri: item.productImage[0] }}
                                        style={styles.subcatimg}
                                        resizeMode="contain"
                                      />
                                    :
                                      <Image
                                        source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                                        style={styles.subcatimg}
                                      />
                                  }
                                 <TouchableOpacity style={[styles.flx1,styles.wishlisthrt]} onPress={() => this.removefromwishlist(item.wishlist_ID)} >
                                  <Icon size={18} name='close' type='fontAwesome' color='red' style={{}} />
                                 </TouchableOpacity>
                                 {
                                    item.discountPercent > 0 ?
                                      <Text style={styles.peroff}> {item.discountPercent}% OFF</Text> 
                                    :
                                      null
                                 }
                                </View>  
                                <View style={[styles.flx1, styles.protxt]}>
                                  <Text numberOfLines={1} style={[styles.nameprod, (i % 2 == 0 ? {} : { marginLeft: 12 })]}>{item.productName}</Text>
                                </View>
                                <View style={[styles.flx1, styles.prdet]}>
                                <View style={[styles.flxdir,{justifyContent:"center",alignItems:"center"}]}>
                                  <View style={[styles.flxdir]}>
                                    <Icon
                                      name={item.currency}
                                      type="font-awesome"
                                      size={13}
                                      color="#333"
                                      iconStyle={{ marginTop: 5, marginRight: 3 }}
                                    />
                                    <Text style={styles.discountpricecut}>{item.originalPrice}</Text>
                                  </View>
                                  <View style={[styles.flxdir,{marginLeft:10,alignItems:"center"}]}>
                                    <Icon
                                      name={item.currency}
                                      type="font-awesome"
                                      size={15}
                                      color="#333"
                                      iconStyle={{ marginTop: 5}}
                                    />
                                    {
                                        item.discountPercent > 0 ?
                                            <Text style={styles.ogprice}>{item.discountedPrice} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                            </Text>
                                          :
                                          <Text style={styles.ogprice}>{item.originalPrice} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
                                      }
                                  </View>
                                </View>
                              </View>
                                <View style={[styles.flx1,styles.addtocartbtn]}>
                                <Button
                                  titleStyle={styles.buttonText1}
                                  onPress={() => this.addtocart(item.wishlist_ID,item.product_ID)}
                                  title="MOVE TO CART"
                                  buttonStyle={styles.button1}
                                  containerStyle={styles.buttonContainer2}
                                />
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
                          <Button
                              onPress={() => this.props.navigation.navigate('Dashboard')}
                              // title={"Click Here To Continue Shopping"}
                              title={"Add Products"}
                              buttonStyle={styles.buttonshopping}
                              containerStyle={styles.continueshopping}
                          /> 
                        </View>
                      :
                        <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                          <ActivityIndicator size="large" color={colors.theme}/>
                        </View>
                    }
                  </View>
                </View>
              </View>
            </ScrollView>
            <Modal isVisible={this.state.addtocart}
              onBackdropPress={() => this.setState({ addtocart: false })}
              coverScreen={true}
              hideModalContentWhileAnimating={true}
              style={{ paddingHorizontal: '5%', zIndex: 999 }}
              animationOutTiming={500}>
              <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:colors.theme }}>
                <View style={{ justifyContent: 'center', }}>
                  <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
                </View>
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
                  Product is added to cart.
                </Text>
                
                <View style={styles.yesmodalbtn}>
                      <Button
                        onPress={() => this.closemodal()}
                        titleStyle={styles.buttonText1}
                        title="OK"
                        buttonStyle={CommonStyles.addBtnStyle}
                        containerStyle={CommonStyles.buttonContainer}
                      />
                </View>
              </View>
            </Modal>
            <Modal isVisible={this.state.removefromwishlist}
              onBackdropPress={() => this.setState({ removefromwishlist: false })}
              coverScreen={true}
              hideModalContentWhileAnimating={true}
              style={{ paddingHorizontal: '5%', zIndex: 999 }}
              animationOutTiming={500}>
              <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:colors.theme }}>
                <View style={{ justifyContent: 'center', }}>
                  <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
                </View>
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
                  Product remove from Wishlist.
                </Text>
                
                <View style={styles.yesmodalbtn}>
                      <Button
                        onPress={() => this.closemodalwishlist()}
                        titleStyle={styles.buttonText1}
                        title="OK"
                        buttonStyle={CommonStyles.addBtnStyle}
                        containerStyle={CommonStyles.buttonContainer}
                      />
                </View>
              </View>
            </Modal>
            <Modal isVisible={this.state.alreadyincarts}
              onBackdropPress={() => this.setState({ alreadyincarts: false })}
              coverScreen={true}
              hideModalContentWhileAnimating={true}
              style={{ paddingHorizontal: '5%', zIndex: 999 }}
              animationOutTiming={500}>
              <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10,borderWidth:2,borderColor:colors.theme }}>
                <View style={{ justifyContent: 'center', }}>
                  <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
                </View>
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
                  Product already in Cart.
                </Text>
                <View style={styles.yesmodalbtn}>
                      <Button
                        onPress={() => this.setState({ alreadyincarts: false })}
                        titleStyle={styles.buttonText1}
                        title="OK"
                        buttonStyle={CommonStyles.addBtnStyle}
                        containerStyle={CommonStyles.buttonContainer}
                      />
                </View>
              </View>
            </Modal>
         
            <Footer />
          </View>
        </React.Fragment>
      );
    }
}
