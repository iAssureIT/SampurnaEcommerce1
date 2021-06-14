import React, { useState,useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import styles             from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/SimilarProductStyles.js';
import axios              from 'axios';
import { useNavigation }  from '@react-navigation/native';

export const SimilarProducts =(props)=>{
  // const navigation = useNavigation();
  const {category_id,user_id,title,currency,navigation} =props;
  // const BannerWidth = Dimensions.get('window').width-100;
  const [productList,setProductList]=useState([]);
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  useEffect(() => {
    getData();
  },[props]);

  const getData=()=>{
    var formValues = {
      
    }
    axios.get("/api/products/get/similarproducts",formValues)
      .then((response) => {
        setProductList(response.data);
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
 

  const _renderlist = ({ item, index })=>{
      return (
          <TouchableOpacity style={{width:150,marginRight:10,height:230,backgroundColor:"#fff"}} onPress={() => navigation.push('SubCatCompView',{productID: item._id })}>
               <View style={styles.flx1}>
                {
                  item.productImage && item.productImage.length > 0 ?
                    <Image
                      source={{ uri: item.productImage[0] }}
                      style={styles.subcatimg}
                      resizeMode="stretch"
                    />
                    :
                    <Image
                      source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                      style={styles.subcatimg}
                    />
                }
                {
                  item.discountPercent > 0 ?
                    <Text style={styles.peroff}> {item.discountPercent}% OFF</Text>
                    :
                    null
                }
                <View style={[styles.flx1, styles.protxt]}>
                  <Text numberOfLines={2} style={styles.nameprod}>{item.productName}</Text>
                </View>
                <View style={[styles.flx1, styles.prdet]}>
                <View style={[styles.flxdir,{justifyContent:"center",alignItems:"center"}]}>
                  <View style={[styles.flxdir]}>
                    {/* <Icon
                      name={item.currency}
                      type="font-awesome"
                      size={13}
                      color="#333"
                      iconStyle={{ marginTop: 5, marginRight: 3 }}
                    /> */}
                     <Text style={styles.ogprice}>{currency} </Text>
                    <Text style={styles.discountpricecut}>{item.originalPrice}</Text>
                  </View>
                  <View style={[styles.flxdir,{alignItems:"center"}]}>
                    {/* <Icon
                      name={item.currency}
                      type="font-awesome"
                      size={13}
                      color="#333"
                      iconStyle={{ marginTop: 5}}
                    /> */}
                    {item.discountPercent > 0 ?
                          <Text style={styles.ogprice}> - {item.discountedPrice} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                          </Text>
                        :
                        <Text style={styles.ogprice}> - {item.originalPrice} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : '' */} {/* item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
                      }
                  </View>
                </View>
              </View>
                </View>
          </TouchableOpacity>  
    )
  }

    return (
      <View style={{paddingHorizontal:10}}>
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



