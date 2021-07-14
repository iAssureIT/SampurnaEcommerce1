
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
import {STOP_SCROLL,SET_CATEGORY_WISE_LIST}          from '../../redux/productList/types';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import {Footer}               from '../../ScreenComponents/Footer/Footer.js';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import axios                  from 'axios';
import {CategoryList}    from '../../ScreenComponents/CategoryList/CategoryList.js';
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
  const section = props.route.params?.section;
  const [user_id,setUserId]                = useState('');
  const [productdata,setProductData]        = useState([]);
  const [productReview,setProductReview]   = useState([]);
  const [number,setNumber]                = useState(1);
  const [loading,setLoading]          = useState(true);
  const [variants,setvariants]        = useState([]);
  const [productList,setProdctList] = useState([]);
  const [sizeIndex,setSizeIndex] = useState(-1);
  const [colorIndex,setColorIndex] = useState(-1);
  const dispatch 		= useDispatch();
  const isFocused = useIsFocused();
  const {navigation,route,setToast} =props;
  const {productID,currency,vendorLocation_id,index,vendor_id}=route.params;


  const store = useSelector(store => ({
    location:store.location
  }));
  const {location} = store;

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

  const setCategory =(e)=>{
    var subCategoryArray = e.subCategory.map((a, i)=>{
      return {
          label :a.subCategoryTitle,        
          value :e.categoryUrl+"^"+a.subCategoryUrl,        
      } 
    })
    dispatch({
      type:STOP_SCROLL,
      payload:false
    })
    setSubCategory(subCategoryArray);
    payload.vendor_ID        = vendor.vendor_ID;
    payload.sectionUrl      = sectionUrl;
    payload.categoryUrl     = e.categoryUrl;
    payload.subCategoryUrl  = e.subCategoryUrl ? e.subCategoryUrl : [] ;
    payload.scroll          = false;
    payload.startRange      = 0;
    payload.limitRange      = 10;
    dispatch({
      type : SET_CATEGORY_WISE_LIST,
      payload : []
    })
    dispatch(getCategoryWiseList(payload));
  }

  const addToWishList = (productid,vendor_ID,sectionUrl) => {
    if(user_id){
      const wishValues = {
        "user_ID": user_id,
        "product_ID": productid,
        "userDelLocation"   : {
          "lat"               : location?.address?.latlong?.lat, 
          "long"              : location?.address?.latlong?.lng,
          "delLocation"       : location?.address?.addressLine2
        },
        "vendor_id"          : vendor_ID,
        "vendorLocation_id"  : vendorLocation_id,
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
    var formValues = {
      "user_id"           : user_id,
      "product_id"        : productID,
      "vendor_id"         : vendor_id
    }
    console.log("formValues",formValues);
    axios.post("/api/products/get/one",formValues)
      .then((response) => {
        console.log("productdata response",response);
        var product = response.data.products.filter(e=>e._id === productID );
        var sizeIndex =  response.data.variants.findIndex(e=>e.size === product[0].size);
        setProductData(product[0]);
        setProdctList(response.data.products);
        setvariants(response.data.variants);
        setSizeIndex(sizeIndex);
        var colorIndex = response.data.variants[sizeIndex].color.findIndex(e=>e === product[0].color);
        console.log("colorIndex",colorIndex);
        setColorIndex(colorIndex);
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
        console.log("response",response);
        console.log("response",response);
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

  const filterProductSize  =(index,size)=>{
    setSizeIndex(index);
    var product = productList.filter(e=>e.size === size);
    setProductData(product[0]);
    var colorIndex = variants[index].color.findIndex(e=>e === product[0].color)
    setColorIndex(colorIndex);
  }


  const filterProductColor  =(index,color)=>{
    setColorIndex(index);
    var product = productList.filter(e=>e.color === color);
    setProductData(product[0]);
  }


    return (
      <View style={{backgroundColor:"#fff",flex:1}}>
        <View style={styles.prodviewcatsuperparent}>
        {loading ?
          <Loading/>
          :
          productdata && productdata.productName  && productdata.discountedPrice ?
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={[styles.vendorNameBox,{}]}>
                <Text numberOfLines={1} style={[styles.vendorName,{}]}>Vendor - {productdata.vendorName}</Text>
            </View> 
            
            <View style={styles.formWrapper}>  
              {/* <MenuCarouselSection
                    navigation  = {navigation} 
                    showImage   = {true}
                    selected    = {section}
                    boxHeight   = {40}
                    index       = {index}
                />                          */}
                {/* <CategoryList
                  navigation  = {navigation}
                  showImage = {true}
                  boxHeight = {30}
                  setCategory = {setCategory}
                /> */}
              <View >
              {/* {productdata.discountPercent && productdata.discountPercent >0?
                  <ImageBackground source={require('../../AppDesigns/currentApp/images/offer_tag.png')} style={styles.disCountLabel}>
                    <Text style={{fontSize:12,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-SemiBold"}}>{productdata.discountPercent}%</Text>
                    <Text style={{fontSize:10,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-Regular"}}>OFF</Text>
                  </ImageBackground> :null
                }  */}
                <View style={{flex:1,flexDirection:'row',}}>
                    <View style={styles.qtys}>
                      <Counter start={1} min={1}
                        buttonStyle={{
                          borderColor: colors.theme,
                          borderWidth: 1,
                          borderRadius: 25,
                          width: 33,
                          height: 33
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
                    <View style={styles.addBTN}>
                      <Button
                          onPress={() => handlePressAddCart()}
                          title={"ADD TO CART"}
                          buttonStyle={CommonStyles.addBtnStyle1}
                          // containerStyle={CommonStyles.addBtnContainer1}
                          // icon={
                          //   <Icon
                          //     name="shopping-cart"
                          //     type="feather"
                          //     size={25}
                          //     color="#fff"
                          //     iconStyle={styles.mgrt10}
                          //   />
                          // }
                        /> 
                    </View>
                </View>
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
                          cache: FastImage.cacheControl.immutable,
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
                  {/* <TouchableOpacity style={[styles.flx1, styles.wishlisthrtproductview]}
                        onPress={() =>addToWishList(productID,productdata.vendor_ID,productdata.section.replace(/\s/g, '-'))} >
                    <Icon size={25} name={productdata.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={colors.red} />
                  </TouchableOpacity> */}
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
              {/* <View style={styles.orderstatus}>
                <View style={styles.kgs}>
                  <Text style={styles.orderstatustxt}>{productdata.size} {productdata.unit !== 'Number' ? productdata.unit : ''}</Text>
                </View>                
              </View> */}
              <View style={{flexDirection:'row',marginLeft:30,}}>
                 <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex:1}}>{
                  variants && variants.length > 0?
                  variants.map((item,index)=>{
                    return(
                        <TouchableOpacity 
                            style={{minWidth:60,height:28,marginTop:5,marginRight:5,borderRadius:4,justifyContent:'center',alignItems:'center',borderWidth:sizeIndex === index ? 1 :0.5,paddingHorizontal:5}}
                            onPress={()=>filterProductSize(index,item.size)}
                            >
                            <Text style={{fontSize:9}}>{item.size}</Text>
                        </TouchableOpacity> 
                    )
                  })
                  :
                  null
                }
                 </ScrollView>
              </View>
              <View style={{flexDirection:'row',marginLeft:30}}>
                 <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex:1}}>{
                  sizeIndex >=0 && variants[sizeIndex].color && variants[sizeIndex].color.length > 0 ?
                  variants[sizeIndex].color.map((color,index)=>{
                      return(
                        <TouchableOpacity 
                          style={{minWidth:60,height:28,marginTop:5,marginRight:5,justifyContent:'center',alignItems:'center',borderWidth:colorIndex === index ? 1 :0.5,paddingHorizontal:5,backgroundColor:color.toLowerCase()}}
                          onPress={()=>filterProductColor(index,color)}
                          >
                          {/* <Text>{color}</Text> */}
                        </TouchableOpacity>  
                      )
                    })
                    :
                    []
                }
                 </ScrollView>
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



