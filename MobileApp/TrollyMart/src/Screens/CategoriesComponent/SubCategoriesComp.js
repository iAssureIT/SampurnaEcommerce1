import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
// import { Dropdown }     from 'react-native-material-dropdown-v2';
import { Icon, Button } from "react-native-elements";
import Modal            from "react-native-modal";
import {HeaderBar3}     from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}         from '../../ScreenComponents/Footer/Footer1.js';
import Notification     from '../../ScreenComponents/Notification/Notification.js'
import styles           from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import { colors }       from '../../AppDesigns/currentApp/styles/styles.js';
import axios            from 'axios';
import AsyncStorage     from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import {ProductList}    from'../../ScreenComponents/ProductList/ProductList.js';
// import {AppEventsLogger} from 'react-native-fbsdk';    

export const SubCategoriesComp = (props)=>{
  const isFocused = useIsFocused();
  const [productImage,setProductImage]=useState([]);
  const [productsDetails,setProductDetails] = useState([]);
  const [addtocart,setAddToCart] = useState(false);
  const [wishlisted,setWishListed] = useState(false);
  const [alreadyincarts,setAlreadyInCarts] = useState(false);
  const [alreadyinwishlist,setAlreadyInWishList] = useState(false);
  const [userId,setUserId]=useState('');
  const [wished,setWished]=useState('');
  const [packSize,setPackSize]=useState('');
  const {navigation,route}=props;
  const {categoryName,category_ID}=route.params;
  
  console.log("route.params",route.params);
  useEffect(() => {
    console.log("Called");
    getData(category_ID);
 },[props,isFocused]);

 const getData=()=>{
    AsyncStorage.multiGet(['user_id', 'token'])
    .then((data) => {
      console.log("data",data);
      setUserId(data[0][1]);
      wishlisteddata();
     axios.get("/api/products/get/listby/category/"+category_ID)
      .then((response) => {
        console.log("response products",response);
        for (var i = 0; i < response.data.length; i++) {
          var availableSizes = [];
          if (response.data[i].size) {
            availableSizes.push(
              {
                "productSize": response.data[i].size * 1,
                "packSize": 1,
              },
              {
                "productSize": response.data[i].size * 2,
                "packSize": 2,
              },
              {
                "productSize": response.data[i].size * 4,
                "packSize": 4,
              },
            )
            response.data[i].availableSizes = availableSizes;
          }
        }
        setProductDetails(response.data);
      })
      .catch((error) => {
        console.log("error",error)
      })
    })
  }

  
  const wishlisteddata=()=>{
    axios.get('/api/wishlist/get/userwishlist/' + userId)
      .then((response) => {
        var wishprod = response.data;
        let wished = [];
        for (var i = 0; i < wishprod.length; i++) {
          wished.push({
            'product_ID': wishprod[i].product_ID,
          })
          if (wished[i].product_ID) {
            setWished(wished)
          }
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  const handleTypeChange = (value,availablessiz) => {
    const result = availablessiz.filter(product => product.value == value);
    setPackSize(result[0].size);
  }

  const addToCart=(productid)=>{
    const formValues = {
      "user_ID"     : userId,
      "product_ID"  : productid,
      "quantity"    : packsizes === undefined || "" ? 1 :packsizes,
    }
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

  const addtowishlist = (productid) => {
    const wishValues = {
      "user_ID"     : userId,
      "product_ID"  : productid,
    }
    axios.post('/api/wishlist/post', wishValues)
      .then((response) => {
        // AppEventsLogger.logEvent('Add To Wishlist');
        if(response.data.message === "Product removed from wishlist successfully."){
          setAlreadyInWishList(true);
        }else{
          setWishListed(true);
        }
      })
      .catch((error) => {
        setAlreadyInCarts(true);
        console.log('error', error);
      })
  }
      return (
        <React.Fragment>
          <HeaderBar3
            goBack={navigation.goBack}
            headerTitle={categoryName}
            navigate={navigation.navigate}
            // openControlPanel={() => this.openControlPanel.bind(this)}
          />
          <View style={styles.addsuperparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <ProductList navigate = {navigation.navigate} newProducts={productsDetails}   userId={userId}/>
              </View>
            </ScrollView>
            <Modal isVisible={addtocart}
              onBackdropPress={() =>setAddToCart(false)}
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
            <Modal isVisible={wishlisted}
              onBackdropPress={() =>setWishListed(false)}
              coverScreen={true}
              hideModalContentWhileAnimating={true}
              style={{ paddingHorizontal: '5%', zIndex: 999 }}
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
            onBackdropPress={() => setAlreadyInWishList(false)}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ zIndex: 999 }}
            animationOutTiming={500}>
            <View style={styles.modalmainvw}>
              <View style={{ justifyContent: 'center', }}>
                <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20, }}>
                Product remove from wishlist.
              </Text>
              <View style={styles.yesmodalbtn}>
                <Button
                  onPress={() => setAlreadyInWishList(false)}
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
            <View  style={styles.modalmainvw}>
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
            <Footer />
          </View>
        </React.Fragment>
      );
  }



