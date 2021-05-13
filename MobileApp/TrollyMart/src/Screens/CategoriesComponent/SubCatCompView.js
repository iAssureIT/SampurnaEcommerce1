
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,ActivityIndicator,
  Dimensions
} from 'react-native';
import { Header, 
        Button, 
        Icon, 
        SearchBar }   from "react-native-elements";
import styles         from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import HeaderBar5     from '../../ScreenComponents/HeaderBar5/HeaderBar5.js';
import {Footer}       from '../../ScreenComponents/Footer/Footer1.js';
import { colors }     from '../../AppDesigns/currentApp/styles/styles.js';
import axios          from 'axios';
import AsyncStorage   from '@react-native-async-storage/async-storage';
import Counter        from "react-native-counters";
import Modal          from "react-native-modal";
import Carousel       from 'react-native-banner-carousel-updated';
import {SimilarProducts} from '../../ScreenComponents/SimilarProducts/SimilarProducts.js';
export const SubCatCompView =(props)=>{
  const [isOpen,setOpen]                    = useState(false);
  const [countofprod,setCounterProd]        = useState(1);
  const [wishlisted,setWishListed]          = useState('');
  const [alreadyincarts,setAlreadyInCarts]  = useState(false);
  const [wishlistedproduct,setWishListedProduct] = useState(false);
  const [alreadyinwishlist,setAlreadyInWishlist] = useState(false);
  const [user_id,setUserId]                = useState('');
  const [productdata,setProductData]        = useState([]);
  const [number,setNumber]                = useState('');
  const [addToCart,setAddToCart]          = useState(false);
  const {navigation,route} =props;
  const {productID}=route.params;
  const BannerWidth = Dimensions.get('window').width-100;
  useEffect(() => {
    console.log("useEffect");
    getData();
  },[props]);

  const getData=()=>{
    getProductsView(productID);
    AsyncStorage.multiGet(['user_id', 'token'])
    .then((data) => {
        setUserId(data[0][1]);
        wishlisteddata(data[0][1]);
    })
  }
 
  const wishlisteddata=(user_id)=>{
    axios.get('/api/wishlist/get/userwishlist/'+ user_id)
    .then((response) => {
      var wishprod = response.data;
      let wished = [];
          for(var i=0;i<wishprod.length;i++){
          wished.push({
            'product_ID':  wishprod[i].product_ID,
          })
          if(wished[i].product_ID === productID){
            setWishListedProduct(true);
          } 
        }
    })
    .catch((error) => {
      console.log('error', error);
    })
  }

  const addtowishlist = (productid) => {
    const wishValues = {
      "user_ID": user_id,
      "product_ID": productid,
    }
    console.log("wishValuess==>", wishValues);
    axios.post('/api/wishlist/post', wishValues)
      .then((response) => {
        wishlisteddata(user_id);        
        console.log(" response wishValuess==>", response.data);
        if(response.data.message === "Product removed from wishlist successfully."){
          setAlreadyInCarts(true);
          setWishListedProduct(true);
        }else{
          setWishListed(true);
          setWishListedProduct(true);
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  const getProductsView=(productID)=>{
    axios.get("/api/Products/get/one/" + productID)
      .then((response) => {
        console.log("response.data ProductsView =========>", response.data);
        setProductData(response.data);
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  const onChange=(number, type)=>{
    var carqty = {};
    setCounterProd(parseInt(number));
    setNumber(parseInt(number));
  }

  
  const handlePressAddCart=()=>{
    const formValues = {
      "user_ID": user_id,
      "product_ID": productID,
      "quantity": number === undefined || "" ? 1 : number,
    }
    console.log("formValues addCart =========>", formValues);
    axios
      .post('/api/Carts/post', formValues)
      .then((response) => {
        setAddToCart(true);
      })
      .catch((error) => {
        setAlreadyInCarts(true);
        console.log('error', error);
      })
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
        <HeaderBar5
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
                  //  pageSize={BannerWidth}
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
                {
                  wishlistedproduct ?
                    <TouchableOpacity style={[styles.flx1, styles.wishlisthrtproductview]}
                          onPress={() =>addtowishlist(productID)} >
                      <Icon size={25} name='heart' type='font-awesome' color={colors.theme} />
                    </TouchableOpacity>
                  :
                  
                    <TouchableOpacity style={[styles.flx1, styles.wishlisthrtproductview]}
                          onPress={() =>addtowishlist(productID)} >
                      <Icon size={25} name='heart-o' type='font-awesome' color={colors.theme} />
                    </TouchableOpacity>
                }
   
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
                  <Icon
                    name={productdata.currency}
                    type="font-awesome"
                    size={18}
                    color="#333"
                    iconStyle={styles.rupeeicn}
                  />
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
                    onChange={()=>onChange()} />
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
              </View>
            </View>
            <SimilarProducts category_id={productdata.category_ID} user_id={user_id}/>
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
  }



