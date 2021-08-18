
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableWithoutFeedback,
  ImageBackground,
  TouchableOpacity,
  Image,ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native';
import {Button,Icon}         from "react-native-elements";
// import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/SimilarProductStyles.js';
import styles                from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/ProductListStyles.js';
import axios                from 'axios';
import CommonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { useNavigation }    from '@react-navigation/native';
import Loading              from '../Loading/Loading.js';
import {useSelector,
  useDispatch }             from 'react-redux';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import FastImage              from 'react-native-fast-image';
import {getCartCount}          from '../../redux/productList/actions';


export const HorizontalProductList =(props)=>{
  const navigation = useNavigation();
  const {category_id,user_id,title,currency,setToast} =props;
  const window = Dimensions.get('window');
  const [productList,setProductList]=useState([]);
  const [packsizes,setPacksizes]= useState('');
  const dispatch 		= useDispatch();
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  useEffect(() => {
    getData();
  },[]);

  const store = useSelector(store => ({
    userDetails : store.userDetails,
    location : store.location,
  }));

  const getData=()=>{
    console.log("props.blockApi",props.blockApi);
    console.log("props.payload",props.payload);
    axios.post(props.blockApi,props.payload)
      .then((response) => {
        console.log("getData response",response);
        setProductList(response.data);
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  const addToCart=(productid,vendor_ID)=>{
    if(store.userDetails.user_id){
      const formValues = {
        "user_ID"           : store.userDetails.user_id,
        "product_ID"        : productid,
        "vendor_ID"         : vendor_ID,
        "quantity"          : packsizes === "" || 0 ? 1 : packsizes,
        "userLatitude"      : store.location?.address?.latlong?.lat,
        "userLongitude"     : store.location?.address?.latlong?.lng,
        "vendorLocation_id" : props.payload.vendorLocation_id,
      }
      axios
        .post('/api/carts/post', formValues)
        .then((response) => {
          dispatch(getCartCount(store.userDetails.user_id));
          if(response.data.message === "Product added to cart successfully."){
            setToast({text: response.data.message, color: 'green'});
          }else{
            setToast({text: response.data.message, color: colors.warning});
          }
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


 
  const _renderlist = ({ item, index })=>{
    return (
      <View key={index}  style={[styles.productContainer,{width:(window.width/2)-40,marginRight:20}]} >
        <TouchableWithoutFeedback  onPress={()=>{props.addToCart ? navigation.navigate('SubCatCompView',{productID: item._id }) : navigation.navigate("ProductVendorList",{sectionUrl:item.section?.replace(/\s/g, '-').toLowerCase(),section:item.section,product_id:item._id})}}>
          <View style={styles.flx5}>
            <View style={styles.flx1}>
            {item.discountPercent && item.discountPercent >0?
                <ImageBackground source={require('../../AppDesigns/currentApp/images/offer_tag.png')} style={styles.disCountLabel}>
                    {item.discountPercent && item.discountPercent >0?
                    <ImageBackground source={require('../../AppDesigns/currentApp/images/offer_tag.png')} style={{height:40,width:40}}>
                      <Text style={{fontSize:12,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-SemiBold"}}>{item.discountPercent}%</Text>
                      <Text style={{fontSize:10,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-Regular"}}>OFF</Text>
                    </ImageBackground> :null
                  } 
                  </ImageBackground> :null
              }   
              {
                item.productSmallImage && item.productSmallImage.length > 0 ?
                  <FastImage
                    source={{ 
                      uri: item.productSmallImage[0],
                      priority: FastImage.priority.high, 
                      cache: FastImage.cacheControl.immutable,
                    }}
                    PlaceholderContent={<ActivityIndicator color={colors.theme}/>}
                    style={styles.subcatimg}
                    resizeMode={FastImage.resizeMode.contain}
                  >
                    
                  </FastImage>
                  :
                  <Image
                    source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                    style={styles.subcatimg}
                    resizeMode="contain"
                  />
              }
            </View>
            <View style={[styles.flx1, styles.protxt]}>
              <View style={{flexDirection:'row',flex:1}}>
                  <View style={{flex:.8}}>
                    {/* {item.brand ?
                  
                      <Text numberOfLines={1} style={[styles.productName]}>{item.brand}</Text>
                      :
                      null
                    } */}
                  </View>
                  {props.addToCart &&<View style={{flex:.2}}>
                    <TouchableOpacity 
                      onPress={() =>addToCart(item._id,item.vendor_ID)}
                    style={{height:25,width:25,borderWidth:1,borderRadius:100,marginRight:15,justifyContent:'center',alignItems:"center",borderColor:colors.cartButton}}>
                      <Icon name="plus" type="material-community" size={20} color={colors.cartButton} iconStyle={{alignSelf:'flex-end'}}/>
                    </TouchableOpacity>  
                  </View>}  
                </View>
              <Text numberOfLines={2} style={[styles.nameprod]}>{item.productName}</Text>
            </View>
            <View style={[styles.flx1, styles.prdet]}>
                <View style={[styles.flxdir]}>
                  <View style={[styles.flxdir]}>
                    <Text style={styles.ogpriceC}>{currency} </Text>
                    {item.discountPercent && item.discountPercent >0?<Text style={styles.discountpricecut}>{item.originalPrice}</Text>:null}
                  </View>
                  <View style={[styles.flxdir,{alignItems:"center"}]}>
                    {item.discountPercent > 0 ?
                          <Text style={styles.disprice}>{item.discountedPrice.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                          </Text>
                        :
                        <Text style={styles.ogprice}>{item.originalPrice.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : '' */} {/* item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
                      }
                  </View>
                </View>
              </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

    return (
      <View style={{marginHorizontal:5}}>
      <Text style={{fontSize: 21, fontFamily: 'Montserrat-Bold',color:"#000000",textShadowColor: 'rgba(0, 0, 0, 0.4)',textShadowOffset: {width: -1, height: 1},textShadowRadius:6,marginBottom:5}}>{props.blockTitle}</Text>
        {productList && productList.length > 0 ?
          <FlatList
            horizontal          = {true}
            data                = {productList}
            renderItem          = {item => _renderlist(item)}
            initialNumToRender  = {6}
            keyExtractor        = {item => item._id.toString()}
            style={{}}
            showsHorizontalScrollIndicator={false}
        />
        :
          <Loading 
            type={'HList'}
            loader={6}
          />
        } 
    </View>
    );
  }



