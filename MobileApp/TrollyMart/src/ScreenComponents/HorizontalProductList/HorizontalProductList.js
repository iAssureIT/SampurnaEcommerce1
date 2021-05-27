
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native';
import { Header, 
        Button, 
        Icon, 
        SearchBar }         from "react-native-elements";
import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/SimilarProductStyles.js';
import {HeaderBar3}         from '../HeaderBar3/HeaderBar3.js';
import {Footer}             from '../Footer/Footer1.js';
import { colors }           from '../../AppDesigns/currentApp/styles/styles.js';
import axios                from 'axios';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import Counter              from "react-native-counters";
import Modal                from "react-native-modal";
import Carousel             from 'react-native-banner-carousel-updated';
import CommonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { useNavigation }    from '@react-navigation/native';
import Loading              from '../Loading/Loading.js';
import {useSelector,
  useDispatch }         from 'react-redux';

export const HorizontalProductList =(props)=>{
  const navigation = useNavigation();
  const {category_id,user_id,title,currency} =props;
  // const BannerWidth = Dimensions.get('window').width-100;
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
    console.log("props.blockApi",props);
    var payload ={
      "vendorID"          : '',
      "sectionUrl"        : props.section!=="all" ? props.section.replace(/\s/g, '-').toLowerCase() : 'all',
      "categoryUrl"       : props.category!=="all" ? props.category.replace(/\s/g, '-').toLowerCase() : 'all',
      "subCategoryUrl"    : props.subCategory!=="all" ? props.subCategory.replace(/\s/g, '-').toLowerCase() : 'all',
      // "subCategoryUrl"    : e.subCategory[0]?.subCategoryUrl,
      "startRange"        : 0,
      "limitRange"        : 20,
      "user_id"           : store.userDetails.user_id,
      "userLatitude"      : store.location?.coords?.latitude,
      "userLongitude"     : store.location?.coords?.longitude,
    } 
    axios.post(props.blockApi,payload)
      .then((response) => {
        console.log("response",response);
        setProductList(response.data);
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
 

  const _renderlist = ({ item, index })=>{
      return (
          <TouchableOpacity style={{width:160,minHeight:150,marginRight:10,backgroundColor:"#fff"}} onPress={() => navigation.push('SubCatCompView',{productID: item._id,currency:currency })}>
               <View style={styles.flx1}>
                {
                  item.productImage && item.productImage.length >0?
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
                      name={currency}
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
                          <Text style={styles.ogprice}> - {item.discountedPrice.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                          </Text>
                        :
                        <Text style={styles.ogprice}> - {item.originalPrice.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : '' */} {/* item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
                      }
                  </View>
                </View>
              </View>
                </View>
          </TouchableOpacity>  
    )
  }

    return (
      <View style={{paddingHorizontal:0,paddingVertical:15}}>
      <Text style={styles.title}>{props.blockTitle}</Text>
        <View style={styles.proddets}>
          {productList && productList.length > 0 ?
            <FlatList
              horizontal          = {true}
              data                = {productList}
              renderItem          = {item => _renderlist(item)}
              initialNumToRender  = {6}
              keyExtractor        = {item => item._id}
              // style={{width: SCREEN_WIDTH + 5, height:'100%'}}
          />
          :
            <Loading 
              type={'HList'}
              loader={6}
            />
          } 
        </View>
    </View>
    );
  }



