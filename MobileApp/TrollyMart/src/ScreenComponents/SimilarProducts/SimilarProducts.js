import React, { useState,useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  ActivityIndicator,
  Image,
  FlatList
} from 'react-native';
import styles                from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/ProductListStyles.js';
import axios              from 'axios';
import FastImage         from 'react-native-fast-image';
import { colors } from '../../AppDesigns/currentApp/styles/styles';

export const SimilarProducts =(props)=>{
  const {user_id,title,currency,navigation,productdata} =props;
  const [productList,setProductList]=useState([]);
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  useEffect(() => {
    getData();
  },[props]);

  const getData=()=>{
    var formValues = {
      product_ID     : productdata._id,
      vendor_ID      : productdata.vendor_ID,
      category_ID    : productdata.category_ID,
      section_ID     : productdata.section_ID,
      user_ID        : user_id
    }
    axios.post("/api/products/get/similar_products",formValues)
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
        <TouchableWithoutFeedback   onPress={() => navigation.navigate('SubCatCompView',{productID: item._id })}>
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
                    source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/notavailable.png'}}
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

    return (
      <View style={{marginTop:15}}>
      <Text style={styles.title}>{title}</Text>
        <View style={styles.proddets}>
          {productList && productList.length > 0 ?
            <FlatList
              horizontal = {true}
              data={productList}
              renderItem={item => _renderlist(item)}
              keyExtractor={item => item._id}
              // style={{width: SCREEN_WIDTH + 5, height:'100%'}}
          />:[]} 
        </View>
      <View style={styles.menuborderstyle}></View>
    </View>
    );
  }



