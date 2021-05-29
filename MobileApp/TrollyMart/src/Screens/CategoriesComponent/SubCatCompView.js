
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,ActivityIndicator,
  Dimensions
} from 'react-native';
import { 
        Button, 
        Icon, 
        Rating }              from "react-native-elements";
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import {HeaderBar3}           from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}               from '../../ScreenComponents/Footer/Footer1.js';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import axios                  from 'axios';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import Counter                from "react-native-counters";
import Modal                  from "react-native-modal";
import Carousel               from 'react-native-banner-carousel-updated';
import {SimilarProducts}      from '../../ScreenComponents/SimilarProducts/SimilarProducts.js';
import {withCustomerToaster}  from '../../redux/AppState.js';

export const SubCatCompView = withCustomerToaster((props)=>{
  const [isOpen,setOpen]                    = useState(false);
  const [countofprod,setCounterProd]        = useState(1);
  const [wishlisted,setWishListed]          = useState('');
  const [alreadyincarts,setAlreadyInCarts]  = useState(false);
  const [wishlistedproduct,setWishListedProduct] = useState(false);
  const [alreadyinwishlist,setAlreadyInWishlist] = useState(false);
  const [user_id,setUserId]                = useState('');
  const [productdata,setProductData]        = useState([]);
  const [number,setNumber]                = useState(1);
  const [addToCart,setAddToCart]          = useState(false);
  const {navigation,route,setToast} =props;
  const {productID,currency}=route.params;

  useEffect(() => {
    console.log("useEffect");
    getData();
  },[props]);

  const getData=()=>{
    AsyncStorage.multiGet(['user_id', 'token'])
    .then((data) => {
        setUserId(data[0][1]);
        getProductsView(productID,data[0][1]);
    })
  }
 
 

  const addToWishList = (productid) => {
    if(user_id){
      const wishValues = {
        "user_ID": user_id,
        "product_ID": productid,
      }
      axios.post('/api/wishlist/post', wishValues)
        .then((response) => {
          getProductsView(productID,user_id);
          setToast({text: response.data.message, color: 'green'});
        })
        .catch((error) => {
          console.log("error",error);
          if (error.response.status == 401) {
            AsyncStorage.removeItem('user_id');
            AsyncStorage.removeItem('token');
            setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
            navigation.navigate('Auth')
          }else{
            setToast({text: 'Something went wrong.', color: 'red'});
          }  
        })
    }else{
      navigation.navigate('Auth');
      setToast({text: "You need to login first", color: colors.warning});
    }
    
  }


  const getProductsView=(productID,user_id)=>{
    axios.get("/api/Products/get/one/"+ productID+"/"+user_id)
      .then((response) => {
        console.log("getProductsView=>",response);
        setProductData(response.data);
      })
      .catch((error) => {
        console.log("error",error);
        if (error.response.status == 401) {
          AsyncStorage.removeItem('user_id');
          AsyncStorage.removeItem('token');
          setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
          navigation.navigate('Auth')
        }else{
          setToast({text: 'Something went wrong2.', color: 'red'});
        }  
      })
  }

  const onChange=(number)=>{
    var carqty = {};
    console.log("number",number)
    setCounterProd(parseInt(number));
    setNumber(parseInt(number));
  }

  
  // const handlePressAddCart=()=>{
  //   const formValues = {
  //     "user_ID": user_id,
  //     "product_ID": productID,
  //     "quantity": number === undefined || "" ? 1 : number,
  //   }
  //   console.log("formValues addCart =========>", formValues);
  //   axios
  //     .post('/api/Carts/post', formValues)
  //     .then((response) => {
  //       setAddToCart(true);
  //     })
  //     .catch((error) => {
  //       setAlreadyInCarts(true);
  //       if (error.response.status == 401) {
  //         AsyncStorage.removeItem('user_id');
  //         AsyncStorage.removeItem('token');
  //         setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
  //         navigation.navigate('Auth')
  //       }else{
  //         setToast({text: 'Something went wrong.', color: 'red'});
  //       }  
  //     })
  // }


  const handlePressAddCart=()=>{
    if(user_id){
      const formValues = {
        "user_ID"     : user_id,
        "product_ID"  : productID,
        "vendor_ID"   : productdata.vendor_ID,
        "quantity"    : number === undefined || "" ? 1 : number,
      }
      console.log("formValues",formValues);
      axios
        .post('/api/carts/post', formValues)
        .then((response) => {
          setToast({text: 'Product is added to cart.', color: 'green'});
        })
        .catch((error) => {
          console.log("error",error);
          setToast({text: 'Product is already in cart.', color: colors.warning});
        })
    }else{
      navigation.navigate('Auth');
      setToast({text: "You need to login first", color: colors.warning});
    }  
  }

  const toggle=()=>{
    let isOpen = !isOpen;
    setOpen(isOpen)
  }


  const openControlPanel = () => {
    _drawer.open()
  }

  const renderImage=(image, index)=>{
    console.log("image",image);
    
  }

    return (
      <React.Fragment>
        <HeaderBar3
          goBack={navigation.goBack}
          navigate={navigation.navigate}
          headerTitle={productdata.productName }
          toggle={() => toggle()}
          // openControlPanel={() => openControlPanel()}
        />
        <View style={styles.prodviewcatsuperparent}>
        {
          productdata && productdata.productName  && productdata.discountedPrice ?
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={styles.formWrapper}>
              <Text numberOfLines={1} style={styles.produrl}></Text>
              <View style={styles.imgvw}>
                {productdata.productImage && productdata.productImage.length>0 ?
                 <Carousel
                    autoplay={false}
                    autoplayTimeout={10000}
                    loop={false}
                    index={0}
                    pageSize={370}
                    >
                    {productdata.productImage.map((image, index) => {
                    console.log("image>>>>>>",image);
                    return (
                      <Image
                      source={{ uri: image}}
                      style={styles.saleimg}
                      resizeMode="contain"
                    />
                    );
                  })}
                  </Carousel>
                  :
                  <Image
                    source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                    style={styles.saleimg}
                    resizeMode="contain"
                  />
                }
                  <TouchableOpacity style={[styles.flx1, styles.wishlisthrtproductview]}
                        onPress={() =>addToWishList(productID)} >
                    <Icon size={25} name={productdata.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={colors.theme} />
                  </TouchableOpacity>
                <View style={styles.prodnameview}>
                  {/* (i % 2 == 0 ? {} : { marginLeft: 12 } */}
                  {productdata.brandNameRlang && productdata.brandNameRlang!=="" ?
                    <Text numberOfLines={1} style={[styles.brandname]} style={styles.regionalBrandName}>{productdata.brandNameRlang}</Text>
                    : 
                    <Text numberOfLines={1} style={[styles.brandname]}>{productdata.brand}</Text>
                  }
                  {productdata.productNameRlang && productdata.productNameRlang !==""?
                    <Text numberOfLines={1} style={[styles.nameprod]} style={styles.regionalProductName}>{productdata.productNameRlang}</Text>
                    :
                    <Text numberOfLines={1} style={[styles.nameprod]}>{productdata.productName}</Text>
                  }
                  {/* <Text numberOfLines={1} style={styles.brandname}>{brand}</Text>
                  <Text numberOfLines={1} style={styles.productname}>{productName}</Text>
                  <Text numberOfLines={1} style={styles.shortDescription}>{shortDescription}</Text> */}
                </View>
                <View style={styles.flxdirview}>
                  {/* <Icon
                    name={productdata.currency}
                    type="font-awesome"
                    size={18}
                    color="#333"
                    iconStyle={styles.rupeeicn}
                  /> */}
                  <Text style={styles.proddetprice}>{currency} </Text>
                  {/* <Text style={styles.rupeetxt}> {discountedPrice}</Text> */}
                  <Text style={styles.proddetprice}>{productdata.discountedPrice}  {productdata.size ? <Text style={styles.packofnos}> - {productdata.size}  {productdata.unit}</Text> : null}</Text>
                </View>
              </View>
              <View style={styles.orderstatus}>
                <View style={styles.kgs}>
                  <Text style={styles.orderstatustxt}>{productdata.size} {productdata.unit !== 'Number' ? productdata.unit : ''}</Text>
                </View>
                <View style={styles.qtys}>
                  <Counter start={1} min={1}
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
                    value={countofprod}
                    onChange={(num)=>onChange(num)} />
                </View>
              </View>
              <View style={styles.detailclr}>
                {productdata.color ? 
                <Text style={styles.detailcolor}>Details: {productdata.color}</Text>
                : null}
                {
                  productdata.productDetails == "-" ?
                    <Text style={styles.detaildetailstxt}>"Product details not available"</Text>
                    :
                    <Text style={styles.detaildetailstxt}>{productdata.productDetails.replace(/<[^>]*>/g, '').replace(/\&nbsp;/g, '')}</Text>
                }
                <View>
                 <Button
                    onPress={() => handlePressAddCart()}
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
                <Rating
                  showRating
                  // onFinishRating={this.ratingCompleted}
                  style={{ paddingVertical: 10 }}
                />
              </View>
            </View>
            <SimilarProducts 
              category_id = {productdata.category_ID} 
              user_id     = {user_id} 
              title       = {"You May Also Like"}
              currency    = {currency}
              navigation  = {navigation}
            />
          </ScrollView>
          :
          <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
              <ActivityIndicator size="large" color={colors.theme} />
        </View>
        }
          <Modal isVisible={wishlisted}
            onBackdropPress={() => setWishListed(false)}
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
                  onPress={() => setWishListed(false)}
                  titleStyle={styles.modalText}
                  title="OK"
                  buttonStyle={styles.button1}
                  containerStyle={styles.buttonContainer1}
                />
              </View>
            </View>
          </Modal>

          <Modal isVisible={alreadyinwishlist}
            onBackdropPress={() => setAlreadyInWishlist(false)}
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
                  onPress={() => setAlreadyInWishlist(false)}
                  titleStyle={styles.modalText}
                  title="OK"
                  buttonStyle={styles.button1}
                  containerStyle={styles.buttonContainer1}
                />
              </View>
            </View>
          </Modal>
          <Modal isVisible={addToCart}
            onBackdropPress={() => setAddToCart(false)}
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
                  onPress={() => setAddToCart(false)}
                  titleStyle={styles.modalText}
                  title="OK"
                  buttonStyle={styles.button1}
                  containerStyle={styles.buttonContainer1}
                />
              </View>
            </View>
          </Modal>
          <Modal isVisible={alreadyincarts}
            onBackdropPress={() => setAlreadyInCarts(false)}
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
                  onPress={() => setAlreadyInCarts(false)}
                  titleStyle={styles.modalText}
                  title="OK"
                  buttonStyle={styles.button1}
                  containerStyle={styles.buttonContainer1}
                />
              </View>
            </View>
          </Modal>
        </View>
        <Footer />
      </React.Fragment>
    );
  })



