
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native';
import {Button}         from "react-native-elements";
// import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/SimilarProductStyles.js';
import styles                from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/ProductListStyles.js';
import axios                from 'axios';
import CommonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { useNavigation }    from '@react-navigation/native';
import Loading              from '../Loading/Loading.js';
import {useSelector,
  useDispatch }         from 'react-redux';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import FastImage              from 'react-native-fast-image';

export const HorizontalProductList =(props)=>{
  const navigation = useNavigation();
  const {category_id,user_id,title,currency} =props;
  const window = Dimensions.get('window');
  const [productList,setProductList]=useState([]);
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  useEffect(() => {
    getData();
  },[]);

  const store = useSelector(store => ({
    userDetails : store.userDetails,
    location : store.location,
  }));

  const getData=()=>{
    var payload ={
      "vendorID"          : '',
      "sectionUrl"        : props.section!=="all" ? props.section?.replace(/\s/g, '-').toLowerCase() : 'all',
      "categoryUrl"       : props.category!=="all" ? props.category?.replace(/\s/g, '-').toLowerCase() : 'all',
      "subCategoryUrl"    : props.subCategory!=="all" ? props.subCategory?.replace(/\s/g, '-').toLowerCase() : 'all',
      // "subCategoryUrl"    : e.subCategory[0]?.subCategoryUrl,
      "startRange"        : 0,
      "limitRange"        : 20,
      "user_id"           : store.userDetails.user_id,
      "userLatitude"      : store.location?.address?.latlong?.lat,
      "userLongitude"     : store.location?.address?.latlong?.lng,
    } 
    axios.post(props.blockApi,payload)
      .then((response) => {
        setProductList(response.data);
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
 
  const _renderlist = ({ item, index })=>{
    return (
      <View key={index}  style={[styles.productContainer,{width:window.width-220,marginRight:20}]} >
        <TouchableWithoutFeedback  onPress={()=>{navigation.navigate("ProductVendorList",{sectionUrl:item.section?.replace(/\s/g, '-').toLowerCase(),section:item.section,product_id:item._id})}}>
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
                      cache: (Platform.OS === 'ios' ? 'default' : FastImage.cacheControl.immutable),
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
                  />
              }
            </View>
            <View style={[styles.flx1, styles.protxt]}>
            {item.brand ?
                <Text numberOfLines={1} style={[styles.brandname]}>{item.brand}</Text>
                :
                null
              }
              <Text numberOfLines={2} style={[styles.nameprod]}>{item.productName}</Text>
            </View>
            <View style={[styles.flx1, styles.prdet]}>
                <View style={[styles.flxdir]}>
                  <View style={[styles.flxdir]}>
                    <Text style={styles.ogprice}>{currency} </Text>
                    {item.discountPercent && item.discountPercent >0?<Text style={styles.discountpricecut}>{item.originalPrice}</Text>:null}
                  </View>
                  <View style={[styles.flxdir,{alignItems:"center"}]}>
                    {item.discountPercent > 0 ?
                          <Text style={styles.ogprice}>{item.discountedPrice.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
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

  console.log("productList",productList);

    return (
      <View style={{marginHorizontal:5}}>
      <Text style={[CommonStyles.headerText,{alignSelf:'flex-start'}]}>{props.blockTitle}</Text>
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



