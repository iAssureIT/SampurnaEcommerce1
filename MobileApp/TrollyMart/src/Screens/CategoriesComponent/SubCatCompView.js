
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,ActivityIndicator,
  ImageBackground,
  Dimensions
} from 'react-native';
import { 
        Button, 
        Icon, 
        Rating,
        Avatar }              from "react-native-elements";
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import {Footer}               from '../../ScreenComponents/Footer/Footer.js';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import axios                  from 'axios';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import Counter                from "react-native-counters";
import Carousel               from 'react-native-banner-carousel-updated';
import {SimilarProducts}      from '../../ScreenComponents/SimilarProducts/SimilarProducts.js';
import {withCustomerToaster}  from '../../redux/AppState.js';
import CommonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {getCartCount}         from '../../redux/productList/actions';
import {useDispatch,useSelector } from 'react-redux';
import Loading from '../../ScreenComponents/Loading/Loading.js';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-elements/dist/card/Card';
import {HorizontalSecCatList}       from '../../ScreenComponents/HorizontalSecCatList/HorizontalSecCatList.js';
import {HorizontalProductList}      from '../../ScreenComponents/HorizontalProductList/HorizontalProductList.js';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import { SET_CATEGORY_LIST }  from '../../redux/productList/types.js';
export const SubCatCompView = withCustomerToaster((props)=>{
  const [countofprod,setCounterProd]        = useState(1);
  const [user_id,setUserId]                = useState('');
  const [productdata,setProductData]        = useState([]);
  const [productReview,setProductReview]   = useState([]);
  const [number,setNumber]                = useState(1);
  const [loading,setLoading]          = useState(true);
  const dispatch 		= useDispatch();
  const isFocused = useIsFocused();
  const {navigation,route,setToast} =props;
  const {productID,currency,vendorLocation_id,location,index}=route.params;


  const store = useSelector(store => ({
    productList : store.productList,
  }));
  const {productList,userDetails,brandList,payload,globalSearch} = store;

  useEffect(() => {
    setLoading(true);
    getData();
  },[props]);

  const getData=()=>{
    AsyncStorage.multiGet(['user_id', 'token'])
    .then((data) => {
        setUserId(data[0][1]);
        getProductsView(productID,data[0][1]);
        getProductReview(productID);
    })
  }

  const addToWishList = (productid,vendor_ID,sectionUrl) => {
    if(user_id){
      const wishValues = {
        "user_ID": user_id,
        "product_ID": productid,
      }
      axios.post('/api/wishlist/post', wishValues)
        .then((response) => {
          getProductsView(productID,user_id);
          setToast({text: response.data.message, color: 'green'});
          var payload ={
            "vendor_ID"         : vendor_ID,
            "sectionUrl"        : sectionUrl,
            "startRange"        : 0,
            "limitRange"        : 8,
          } 
          dispatch(getCategoryWiseList(payload));
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
    axios.get("/api/products/get/one/"+ productID+"/"+user_id)
      .then((response) => {
        console.log("productdata response",response);
        setProductData(response.data);
        setLoading(false);
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
  }

  const getProductReview=(productID)=>{
    axios.get("/api/customerReview/get/list/"+productID)
      .then((response) => {
        setProductReview(response.data);
        setLoading(false);
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
  }

  const onChange=(number)=>{
    var carqty = {};
    setCounterProd(parseInt(number));
    setNumber(parseInt(number));
  }


  const handlePressAddCart=()=>{
    if(user_id){
      const formValues = {
        "user_ID"           : user_id,
        "product_ID"        : productID,
        "vendor_ID"         : productdata.vendor_ID,
        "quantity"          : number === "" || 0 ? 1 : number,
        "userLatitude"      : location?.address?.latlong?.lat,
        "userLongitude"     : location?.address?.latlong?.lng,
        "vendorLocation_id" : vendorLocation_id,
      }
      axios
        .post('/api/carts/post', formValues)
        .then((response) => {
          dispatch(getCartCount(user_id));
          setToast({text: response.data.message, color: 'green'});
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


    return (
      <View style={{backgroundColor:"#fff",flex:1}}>
        <View style={styles.prodviewcatsuperparent}>
        {loading ?
          <Loading/>
          :
          productdata && productdata.productName  && productdata.discountedPrice ?
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={styles.formWrapper}>
              <Text numberOfLines={1} style={[CommonStyles.subHeaderText,{paddingVertical:15}]}>Vendor - {productdata.vendorName}</Text>
              <View style={styles.imgvw}>
              {productdata.discountPercent && productdata.discountPercent >0?
                  <ImageBackground source={require('../../AppDesigns/currentApp/images/offer_tag.png')} style={styles.disCountLabel}>
                    <Text style={{fontSize:12,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-SemiBold"}}>{productdata.discountPercent}%</Text>
                    <Text style={{fontSize:10,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-Regular"}}>OFF</Text>
                  </ImageBackground> :null
                } 
                {productdata.productImage && productdata.productImage.length>0 ?
                 <Carousel
                    autoplay={true}
                    autoplayTimeout={10000}
                    loop={false}
                    index={0}
                    pageSize={370}
                    >
                     
                    {productdata.productImage.map((image, index) => {
                    return (
                      <FastImage
                        source={{ 
                          uri: image,
                          priority: FastImage.priority.high, 
                          cache: (Platform.OS === 'ios' ? 'default' : FastImage.cacheControl.immutable),
                        }}
                        style={styles.saleimg}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    );
                  })}
                  </Carousel>
                  :
                  <Image
                    source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                    style={styles.saleimg}
                    resizeMode="contain"
                  />
                }
                  <TouchableOpacity style={[styles.flx1, styles.wishlisthrtproductview]}
                        onPress={() =>addToWishList(productID,productdata.vendor_ID,productdata.section.replace(/\s/g, '-'))} >
                    <Icon size={25} name={productdata.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={colors.red} />
                  </TouchableOpacity>
                <View style={styles.prodnameview}>
                  {/* (i % 2 == 0 ? {} : { marginLeft: 12 } */}
                  {/* {productdata.brandNameRlang && productdata.brandNameRlang!=="" ?
                    <Text numberOfLines={1} style={[styles.brandname]} style={styles.regionalBrandName}>{productdata.brandNameRlang}</Text>
                    :  */}
                    <Text  style={[styles.brandname]}>{productdata.brand}</Text>
                  {/* } */}
                  {/* {productdata.productNameRlang && productdata.productNameRlang !==""?
                    <Text numberOfLines={1} style={[styles.nameprod]} style={styles.regionalProductName}>{productdata.productNameRlang}</Text>
                    : */}
                    <Text style={[styles.nameprod]}>{productdata.productName}</Text>
                  {/* } */}
                  {/* <Text numberOfLines={1} style={styles.brandname}>{brand}</Text>
                  <Text numberOfLines={1} style={styles.productname}>{productName}</Text>
                  <Text numberOfLines={1} style={styles.shortDescription}>{shortDescription}</Text> */}
                </View>
                <View style={styles.flxdirview}>
                  <Text style={styles.proddetprice}>{currency} </Text>
                  <Text style={styles.discountpricecut}> {productdata.originalPrice.toFixed()}</Text>
                  <Text style={styles.proddetprice}> {productdata.discountedPrice.toFixed(2)}  {productdata.size ? <Text style={styles.packofnos}> - {productdata.size}  {productdata.unit}</Text> : null}</Text>
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
                    buttonStyle={CommonStyles.addBtnStyle}
                    containerStyle={CommonStyles.addBtnContainer}
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
                <HorizontalProductList 
                    blockTitle   = {"You May Also Like"}
                    blockApi     = {"/api/products/get/similar_products"}
                    payload      = {{
                      product_ID      : productdata._id,
                      vendor_ID       : productdata.vendor_ID,
                      category_ID     : productdata.category_ID,
                      section_ID      : productdata.section_ID,
                      user_ID         : user_id,
                      vendorLocation_id : vendorLocation_id
                    }}
                    currency    = {currency}
                    addToCart   = {true}
                    setToast    = {setToast}
                  />
                {/* <SimilarProducts 
                  productdata = {productdata} 
                  user_id     = {user_id} 
                  title       = {"You May Also Like"}
                  currency    = {currency}
                  navigation  = {navigation}
                /> */}

               <HorizontalSecCatList 
                  blockTitle          = "All Sub Categories"
                  section             = {productdata.section_ID}
                  category            = {productdata.category_ID}
                  subCategory         = 'all'
                  showOnlySection     = {false}
                  showOnlyCategory    = {false}
                  showOnlyBrand       = {false}
                  showOnlySubCategory = {true}
                  navigation          = {navigation}
                  user_id             = {user_id}
                />
                <View>
                  {productReview && productReview.length >0 ?
                    productReview.map((item,index)=>{
                      return(
                        <Card containerStyle={{backgroundColor:"#fff",marginHorizontal:0}} wrapperStyle={{flexDirection:"row",flex:1}}>
                          <View style={{flex:0.25,alignItems:'center'}}>
                          <Avatar
                            size="small"
                            overlayContainerStyle={{backgroundColor: '#ddd'}}
                            rounded
                            title={item.customerName.charAt(0)}
                            activeOpacity={0.7}
                          />
                              <Text>{item.customerName.split(' ')[0]}</Text>
                          </View>  
                          <View style={{flex:0.75}}>
                            <View style={{flexDirection:'row'}}>
                              <Rating
                                // showRating
                                startingValue={item.rating}
                                // onFinishRating={(e)=>setRating(e)}
                                style={{alignSelf:"flex-start"}}
                                imageSize={20}
                                readonly
                              />
                              <Text style={[CommonStyles.label,{paddingLeft:5}]}>{item.rating}</Text>
                            </View>  
                            <Text style={[CommonStyles.label,{marginTop:5}]}>{item.customerReview}</Text>
                          </View>  
                      </Card>
                      )
                    })
                    :
                    []
                  }   
               </View> 
              </View>
            </View>
          </ScrollView>
          :
          <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
              <ActivityIndicator size="large" color={colors.theme} />
        </View>
        }
        </View>
    </View>
  );
})



