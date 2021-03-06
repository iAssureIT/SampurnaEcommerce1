
import React, { useState,useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,ActivityIndicator,
  ImageBackground,
  Dimensions,
  Share
} from 'react-native';
import { 
        Button, 
        Icon, 
        Rating,
        Avatar }              from "react-native-elements";
import Stars                  from 'react-native-stars';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import {Footer}               from '../../ScreenComponents/Footer/Footer.js';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import axios                  from 'axios';
import {CategoryList}         from '../../ScreenComponents/CategoryList/CategoryList.js';
import {SubCategoryList}      from '../../ScreenComponents/SubCategoryList/SubCategoryList.js';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import Counter                from "react-native-counters";
import Carousel               from 'react-native-banner-carousel-updated';
import {SimilarProducts}      from '../../ScreenComponents/SimilarProducts/SimilarProducts.js';
import {withCustomerToaster}  from '../../redux/AppState.js';
import CommonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {getCartCount}         from '../../redux/productList/actions';
import {useDispatch,useSelector } from 'react-redux';
import Loading                from '../../ScreenComponents/Loading/Loading.js';
import { useIsFocused }       from '@react-navigation/native';
import FastImage              from 'react-native-fast-image';
import { Card }               from 'react-native-elements/dist/card/Card';
import {HorizontalProductList} from '../../ScreenComponents/HorizontalProductList/HorizontalProductList.js';
import { getCategoryWiseList } from '../../redux/productList/actions.js';
import { Dropdown }            from 'react-native-material-dropdown-v2-fixed';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { NetWorkError } from '../../../NetWorkError.js';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const window = Dimensions.get('window');
const STAR_IMAGE = require('../../AppDesigns/currentApp/images/star.png')


export const SubCatCompView = withCustomerToaster((props)=>{
  const {navigation,route,setToast} =props;
  const {productID,currency,vendorLocation_id,index,vendor_id,subCategory,vendor}=route.params;
  console.log("props",props);
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
  const [tab,selectedTab] = useState(0);
  

  const [category,setCategory]= useState(route?.params?.category);

  const [sizes,setSizes] = useState([])
  const scroll =useRef()
  console.log("subCategory",subCategory);
  const store = useSelector(store => ({
    location:store.location,
    payload     : store.productList.searchPayload,
    globalSearch    : store.globalSearch,
    isConnected     : store?.netWork?.isConnected,
    userDetails : store.userDetails
  }));
  const {location,payload,globalSearch,isConnected,userDetails} = store;

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
        "userDelLocation"   : {
          "lat"               : location?.address?.latlong?.lat, 
          "long"              : location?.address?.latlong?.lng,
          "delLocation"       : location?.address?.addressLine2
        },
        "vendor_id"          : vendor_ID,
        "vendorLocation_id"  : vendorLocation_id,
      }
      console.log("wishValues",wishValues);
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
      "vendor_id"         : vendor_id,
      "vendorLocation_id"   : vendorLocation_id
    }
    console.log("formValues",formValues);
    axios.post("/api/products/get/one",formValues)
      .then((response) => {
        console.log("response getProductsView",response);
        var product = response.data.products.filter(e=>e._id === productID );
        console.log("product",product);
        if(product && product.length>0 && response.data.variants && response.data.variants.length >0){
          var sizeIndex_temp =  response.data.variants.findIndex(e=>e.size === product[0].size);
          console.log("sizeIndex_temp",sizeIndex_temp);
          setProductData(product[0]);
          setProdctList(response.data.products);
          setvariants(response.data.variants);
          var sizes = response.data.variants.map((e,i)=>{return{"label":e.size,"value":i+"^"+e.size}})
          setSizes(sizes);
          setSizeIndex(sizeIndex_temp);
          if(sizeIndex_temp){
            var colorIndex = response.data.variants[sizeIndex_temp].color.findIndex(e=>e === product[0].color);
            console.log("colorIndex",colorIndex);
            setColorIndex(colorIndex);
          }
        }
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

  // const Parent : FC<ParentProps> = props => {
    // const scrollRef = useRef<ScrollView>();

    // const onFabPress = () => {
    //     scrollRef.current?.scrollTo({
    //         y : 0,
    //         animated : true
    //     });
    // }

  const getProductReview=(productID)=>{
    axios.get("/api/customerReview/get/list/"+productID)
      .then((response) => {
        console.log("getProductReview",response.data);
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

 
  const minusIcon = (isDisabled) => {
    return <Icon name='minus' type='feather' size={20} color={isDisabled? colors.cartButton : "#fff"} />
  };
  
  const plusIcon = (isPlusDisabled) => {
    return <Icon name='plus' type='feather' size={20} color={"#fff"} />
  };
  const handlePressAddCart=()=>{
    if(user_id){
      const formValues = {
        "user_ID"           : user_id,
        "product_ID"        : productdata._id,
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
          setToast({text: 'Something went wrong. Please try again later', color: colors.warning});
        })
    }else{
      navigation.navigate('Auth');
      setToast({text: "You need to login first", color: colors.warning});
    }  
  }

  const filterProductSize  =(value)=>{
    var index = value.split("^")[0];
    var size = value.split("^")[1];
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

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:'https://devwebsite.knock-knockeshop.com/product-detail/'+productdata.vendor_ID+'/'+productdata.vendorLocation_id+'/'+productdata._id,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderAccessory=()=>{
    return (
        <View style={styles.accessory}>
            <View style={styles.triangleContainer}>
                <View style={[styles.triangle]} />
            </View>
        </View>
    );
}

console.log("productdata",productdata);

    return (
      <View style={{backgroundColor:"#fff",flex:1}}>
         {!isConnected?
          <NetWorkError/>
          :
         globalSearch.search ?
          <SearchSuggetion />
          :
         <View style={styles.prodviewcatsuperparent}>
        {loading ?
          <Loading/>
          :
          productdata && productdata.productName  && productdata.discountedPrice ?
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" ref={scroll} showsVerticalScrollIndicator={false} >
              <View style={{backgroundColor:"#EEEEEE",marginTop:3,height:hp(2.5)}}>
                    <Text numberOfLines={1} style={[{paddingHorizontal:5,fontSize:RFPercentage(1.6),color:"#333"}]}>{vendor?.vendorName ? vendor?.vendorName : vendor?.companyName}</Text>
                </View> 
                <CategoryList
                  navigation        = {navigation}
                  showImage         = {true}
                  boxHeight         = {hp(4)}
                  // setSubCategory    = {setSubCategory}
                  section           = {productdata.section}
                  setCategory         = {setCategory}
                  index             = {index}
                  vendorLocation_id = {vendorLocation_id}
                  category          = {category ? category : productdata.category}
                  vendor            = {vendor}
                  goProductList     = {true}
                />
                <SubCategoryList
                  navigation        = {navigation}
                  showImage         = {true}
                  boxHeight         = {hp(4)}
                  subCategoryList   =  {subCategory}
                  selected          = {productdata.subCategory}
                  section           = {productdata.section.replace(/\s/g, '-')}
                  category          = {category ? category : productdata.category}
                  vendorLocation_id ={vendorLocation_id}
                  vendor            = {vendor}
                />
            <View style={styles.formWrapper}> 
            <View >
              <View style={{flex:1,flexDirection:'row',}}>
                  <View style={styles.qtys}>
                    <Counter start={1} min={1}
                      minusIcon={minusIcon} 
                      plusIcon={plusIcon} 
                      max={productdata.availableQuantity}
                      buttonStyle={{
                        borderColor: colors.cartButton,
                        borderWidth: 1,
                        borderRadius: hp(3),
                        minWidth: hp(4),
                        minHeight: hp(4),
                        backgroundColor: colors.cartButton,
                      }}
                      buttonTextStyle={{
                        color: '#fff',
                        fontSize:RFPercentage(2.5)
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
                        title={"Add To Cart"}
                        buttonStyle={[CommonStyles.addBtnStyle1,{backgroundColor:colors.cartButton}]}
                        titleStyle={{fontFamily:'Montserrat-Regular',fontSize:RFPercentage(1.9)}}
                      /> 
                  </View>
                </View>
                {productdata.productImage && productdata.productImage.length>0 ?
                  <View>
                      <Carousel
                        autoplay={false}
                        autoplayTimeout={10000}
                        loop={false}
                        index={0}
                        pageSize={window.width}
                        pageIndicatorStyle={{width:20,height:3,backgroundColor:"#eee"}}
                        activePageIndicatorStyle={{width:20,height:3,backgroundColor:"#999"}}
                        pageIndicatorOffset={30}
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
                        >                          
                        </FastImage>
                        );
                      })}
                      </Carousel>
                      {userDetails.authService !== "guest" ?
                        <TouchableOpacity style={[styles.wishlisthrtproductview]}
                          onPress={() =>addToWishList(productID,productdata.vendor_ID,productdata.section.replace(/\s/g, '-'))} >
                          <Icon size={hp(2)} name={productdata.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={productdata.isWish ? "#DC1919":"#707070" } iconStyle={{alignSelf:'center'}}/>
                        </TouchableOpacity>
                        :
                          null
                        }
                        <TouchableOpacity style={[styles.share,{top:userDetails.authService==='guest'?hp(4): hp(8)}]}
                          onPress={() =>onShare()} > 
                          <Image
                          resizeMode="contain"
                          source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/shareNEW.png'}}
                          style={{height:hp(2),width:hp(2),alignSelf:'center'}}
                          />
                          {/* <Icon size={15} name="share-alt" type='font-awesome-5'  color={"#707070"} iconStyle={{backgroundColor:"#E6E6E6",borderRadius:50}} /> */}
                        </TouchableOpacity>
                    </View>                 
                    :
                    <View style={styles.saleimg}>
                      <ImageBackground
                        source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                        style={styles.saleimgNo}
                        resizeMode='center'>                      
                      </ImageBackground>
                      <TouchableOpacity style={[styles.wishlisthrtproductview]}
                        onPress={() =>addToWishList(productID,productdata.vendor_ID,productdata.section.replace(/\s/g, '-'))} >
                        <Icon size={hp(2)} name={productdata.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={productdata.isWish ? "#DC1919":"#707070" } iconStyle={{alignSelf:'center'}}/>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.share,{top:userDetails.authService==='guest'?hp(4): hp(8)}]}
                        onPress={() =>onShare()} >
                          <Image
                            resizeMode="contain"
                            source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/shareNEW.png'}}
                            style={{height:hp(2),width:hp(2),alignSelf:'center'}}
                            />
                        {/* <Icon size={15} name="share-alt" type='font-awesome-5'  color={"#707070"} iconStyle={{backgroundColor:"#E6E6E6",borderRadius:50}} /> */}
                      </TouchableOpacity>
                    </View>
                }
                <View style={{ flex:1,backgroundColor:'#fff',flexDirection: "row"}}>
                    <View style={styles.prodnameview12}>
                        <Text  style={[styles.brandname]}>{productdata.brand}</Text>
                        <Text style={[styles.nameprod]}>{productdata.productName}</Text>
                    </View>
                    <View style={{ flex:0.2,justifyContent:'center',marginRight:5, alignItems:'flex-end'}}>                        
                      <Text style={styles.starAvg}><Image
                        source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/star.png'}}
                        style={styles.starimg}
                        resizeMode="contain"
                      />&nbsp;{productReview.avgRating}<Text style={{fontSize:RFPercentage(1.6),fontFamily:"Montserrat-Regular"}}>({productReview?.reviewlist?.length})</Text></Text>
                    </View>
                </View>
                
                <View style={[styles.flxdirview,{alignItems:'flex-end'}]}>
                  <Text style={styles.prodcurrency}>{currency} </Text>
                  {productdata.discountPercent > 0 && <Text style={styles.discountpricecut}> {productdata.originalPrice.toFixed()}</Text>}
                  <Text style={styles.proddetprice}> {productdata.discountedPrice.toFixed(2)}&nbsp;</Text>
                  {productdata.discountPercent > 0 && <Text style={styles.discountPercent}> {productdata.discountPercent}%</Text>}
                </View>
                <View style={{height:hp(7),width:wp(30),marginLeft:wp(7.5)}}>
                  <Text style={{color: "#000000",opacity: 0.5,fontSize:RFPercentage(1.7)}}>Size</Text>
                  <Dropdown
                    onChangeText        = {(value) => filterProductSize(value)}
                    data                = {sizes}
                    value               = {sizes[sizeIndex]?.label}
                    containerStyle      = {styles.ddContainer}
                    dropdownOffset      = {{ top: hp(9.5), left: 0 }}
                    itemTextStyle       = {styles.ddItemText}
                    inputContainerStyle = {styles.ddInputContainer}
                    labelHeight         = {10}
                    tintColor           = {'#FF8800'}
                    labelFontSize       = {RFPercentage(2.2)}
                    fontSize            = {RFPercentage(1.8)}
                    baseColor           = {'#666'}
                    textColor           = {'#333'}
                    labelTextStyle      = {{ left: 5 }}
                    style               = {styles.ddStyle}
                    disabledLineType    = 'none'
                    underlineColor      ='transparent'
                    // renderAccessory={<Icon name="user" type="font-awesome"/>}
                  />
                </View>  
              </View>
              <View style={{marginLeft:wp(7.5)}}>
              <Text style={{color: "#000000",opacity: 0.5,fontSize:RFPercentage(1.7)}}>Colour</Text>
                <View style={{flexDirection:'row'}}>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex:1}}>{
                    sizeIndex >=0 && variants[sizeIndex]?.color && variants[sizeIndex]?.color.length > 0 ?
                    variants[sizeIndex]?.color.map((color,index)=>{
                        return(
                          <TouchableOpacity 
                            style={{width:hp(2.5),height:hp(2),marginTop:5,marginRight:5,justifyContent:'center',alignItems:'center',borderWidth:colorIndex === index ? 1 :0.5,paddingHorizontal:5,backgroundColor:color.toLowerCase()}}
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
              </View>    
              <View style={{marginTop:hp(2),flexDirection:'row'}}>
                {/* <Icon color="#5B8E7E" name="clipboard-arrow-left" type="material-community" size={15}/> */}
                <Image
                      source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/return.png'}}
                      style={styles.saleimgRe}
                      resizeMode='contain'
                    />
                {productdata.productReturnable &&  productdata.productReturnable === "returnable" ?
                  <Text style={{color:"#000000",fontSize:RFPercentage(1.8),fontFamily:"Montserrat-SemiBold"}}>&nbsp;&nbsp;Product return available.</Text>
                  :
                  <Text style={{color:"#000000",fontSize:RFPercentage(1.8),fontFamily:"Montserrat-SemiBold"}}>&nbsp;&nbsp;This item is non-returnable.</Text>
                }
              </View>
              <View style={{flexDirection:'row',height:hp(4),marginTop:hp(1.5)}}>
                  <TouchableOpacity style={{flex:0.5,height:"100%",justifyContent:'center',alignItems:'center',backgroundColor:tab === 0 ? "#EEEEEE" :"#fff",borderTopRightRadius:4,borderTopLeftRadius:4}} onPress={()=>selectedTab(0)}>
                      <Text style={{color:colors.cartButton,fontFamily:"Montserrat-SemiBold",fontSize:RFPercentage(1.8)}}>Product Details</Text>

                  </TouchableOpacity>  
                  <TouchableOpacity style={{flex:0.5,height:"100%",justifyContent:'center',alignItems:'center',backgroundColor:tab === 1 ? "#EEEEEE" :"#fff",borderTopRightRadius:4,borderTopLeftRadius:4}} onPress={()=>selectedTab(1)}>
                      <Text style={{color:colors.cartButton,fontFamily:"Montserrat-SemiBold",fontSize:RFPercentage(1.8)}}>Feedbacks</Text>
                  </TouchableOpacity>  
              </View>
              <View style={{backgroundColor:"#EEEEEE",paddingVertical:5}}>
                {tab === 0 ?
                  productdata.productDetails ?
                  <Text style={styles.detaildetailstxt}>{productdata.productDetails}</Text>
                  :
                  <Text style={{fontsize:RFPercentage(1.8),alignSelf:'center',color:"#333"}}>No details found.</Text>
                :                
                productReview.reviewlist && productReview.reviewlist.length >0 ?  
                 <View style={{backgroundColor:"#fff",}}>
                    <View style={{ flex:1,flexDirection:'row',backgroundColor:"#EEEEEE",}}>
                      <View style={{ flex:1,flexDirection:'row',borderBottomWidth:1,borderColor:'#fff', height:60}}>
                        <View style={{ flex: 0.5,paddingLeft:15,justifyContent:'center'}}>
                          <Text>
                          <Stars
                            half={true}
                            default={5}
                            update={(e)=>{this.setState({stars: e})}}
                            spacing={4}
                            starSize={RFPercentage(2.2)}
                            display={productReview.avgRating}
                            count={5}
                            fullStar={require('../../AppDesigns/currentApp/images/star.png')}
                            // emptyStar={require('./images/starEmpty.png')}
                            // halfStar={require('./images/starHalf.png')}
                            />
                            {/* <Rating
                                // showRating
                                type='custom'
                                ratingImage={STAR_IMAGE}
                                ratingBackgroundColor='#EEEEEE'
                                startingValue={5}
                                // onFinishRating={(e)=>setRating(e)}
                                style={{alignSelf:"flex-start",backgroundColor:'#EEEEEE'}}                                
                                imageSize={14}
                                readonly
                              /> */}
                              <Text style={styles.ratingNumber}>&nbsp;&nbsp;{productReview.avgRating}</Text>
                          </Text>
                        </View>                        
                        <View style={{ flex: 0.5, alignItems:'flex-end',paddingRight:15,justifyContent:'center'}}>
                          <Text style={styles.ratingD1T2}>Based on {productReview.reviewlist.length} ratings</Text>
                        </View>                        
                      </View>                                        
                    </View>
                    <View style={{ flex:1,flexDirection:'row',height:hp(5.2),backgroundColor:"#EEEEEE",}}>
                      <Text style={styles.ratingD1T3}>There are {productReview.reviewlist.length} ratings and 2 customer reviews</Text>
                    </View>
                    {productReview.reviewlist.map((item,index)=>{
                      return(                        
                        <Card containerStyle={{backgroundColor:"#EEEEEE",marginHorizontal:0,margin:0,borderWidth:0,paddingHorizontal:0,marginBottom:10}} wrapperStyle={{flexDirection:"row",flex:1}}>
                          <View style={{flex:0.25,alignItems:'center'}}>
                          <Avatar
                            size="small"
                            overlayContainerStyle={{backgroundColor: '#ddd'}}
                            rounded
                            title={item.customerName.charAt(0)}
                            activeOpacity={0.7}
                          />
                          </View>  
                          <View style={{flex:0.65}}>
                            <Text style={{color:'#000',fontSize:RFPercentage(2.5)}}>{item.customerName.split(' ')[0]}</Text>
                            <Text style={[CommonStyles.label,{marginTop:5,fontSize:RFPercentage(1.7)}]}>{item.customerReview}</Text>
                          </View>
                          <View style={{flex:0.5,alignItems:'flex-end',marginRight:5}}>
                            <Text style={styles.date}>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
                            <View style={{flexDirection:'row'}}>
                              <Text>
                              <Stars
                                half={true}
                                default={2.5}
                                update={(val)=>{this.setState({stars: val})}}
                                spacing={4}
                                starSize={RFPercentage(2.2)}
                                display={item.rating}
                                count={5}
                                fullStar={require('../../AppDesigns/currentApp/images/star.png')}
                                // emptyStar={require('./images/starEmpty.png')}
                                // halfStar={require('./images/starHalf.png')}
                            />
                              <Text style={[CommonStyles.label,{fontSize:RFPercentage(2.2)}]}>&nbsp;&nbsp;{item.rating}</Text>
                              </Text>                              
                            </View>  
                          </View>    
                      </Card>
                      )
                    })}
                  </View>                  
                    :
                    <Text style={{fontSize:RFPercentage(1.8),alignSelf:'center',color:"#333"}}>No review added.</Text>
                  }
                 
              </View>  
              <TouchableOpacity 
                style={{ flex:1,backgroundColor:'#fff',flexDirection: "row", justifyContent: 'center' }}
                onPress={()=>scroll.current.scrollTo(0)}
              >
                  <Text style={styles.backText}>Back To Top</Text>                  
              </TouchableOpacity>
              <View style={{borderBottomWidth:0.5,borderColor:'#6E6E6E',width:"80%",alignSelf:'center'}} />
              <View style={styles.detailclr}>
                <HorizontalProductList 
                    // blockTitle   = {"You May Also Like"}
                    blockApi     = {"/api/products/get/similar_products"}
                    payload      = {{
                      product_ID        : productdata._id,
                      vendor_ID         : productdata.vendor_ID,
                      category_ID       : productdata.category_ID,
                      section_ID        : productdata.section_ID,
                      user_ID           : user_id,
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

               {/* <HorizontalSecCatList 
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
                /> */}
                <View>
                  
               </View> 
              </View>
            </View>
          </ScrollView>
          :
          <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
              <ActivityIndicator size="large" color={colors.theme} />
        </View>
        }
        </View>}
    </View>
  );
})


