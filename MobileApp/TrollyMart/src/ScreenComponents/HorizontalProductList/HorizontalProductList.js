
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
// import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/SimilarProductStyles.js';
import styles                from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/ProductListStyles.js';
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
import FastImage              from 'react-native-fast-image';
  // import {ProductList1}    from'../ProductList/ProductList.js';

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
 

  // const _renderlist = ({ item, index })=>{
  //     return (
  //         <TouchableOpacity style={styles.container} 
  //         onPress={()=>{navigation.navigate("VendorList",{sectionUrl:item.section?.replace(/\s/g, '-').toLowerCase(),section:item.section})}}>
  //         {/* onPress={()=>navigation.navigate('VendorList',{section_id:item.section_ID})}> */}
  //              <View style={styles.flx1}>
  //               {
  //                 item.productImage && item.productImage.length >0?
  //                   <Image
  //                     source={{ uri: item.productImage[0] }}
  //                     style={styles.subcatimg}
  //                     resizeMode="stretch"
  //                   />
  //                   :
  //                   <Image
  //                     source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
  //                     style={styles.subcatimg}
  //                   />
  //               }
  //               {
  //                 item.discountPercent > 0 ?
  //                   <Text style={styles.peroff}> {item.discountPercent}% OFF</Text>
  //                   :
  //                   null
  //               }
  //               <View style={[styles.flx1, styles.protxt]}>
  //                 <Text numberOfLines={2} style={styles.nameprod}>{item.productName}</Text>
  //               </View>
  //               <View style={[styles.flx1, styles.prdet]}>
  //               <View style={[styles.flxdir,{justifyContent:"center",alignItems:"center"}]}>
  //                 <View style={[styles.flxdir]}>
  //                   {/* <Icon
  //                     name={currency}
  //                     type="font-awesome"
  //                     size={13}
  //                     color="#333"
  //                     iconStyle={{ marginTop: 5, marginRight: 3 }}
  //                   /> */}
  //                   <Text style={styles.ogprice}>{currency} </Text>
  //                   <Text style={styles.discountpricecut}>{item.originalPrice}</Text>
  //                 </View>
  //                 <View style={[styles.flxdir,{alignItems:"center"}]}>
  //                   {/* <Icon
  //                     name={item.currency}
  //                     type="font-awesome"
  //                     size={13}
  //                     color="#333"
  //                     iconStyle={{ marginTop: 5}}
  //                   /> */}
  //                   {item.discountPercent > 0 ?
  //                         <Text style={styles.ogprice}> - {item.discountedPrice.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
  //                         </Text>
  //                       :
  //                       <Text style={styles.ogprice}> - {item.originalPrice.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : '' */} {/* item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
  //                     }
  //                 </View>
  //               </View>
  //             </View>
  //               </View>
  //         </TouchableOpacity>  
  //   )
  // }


  const addToWishList = (productid,index) => {
    if(user_id){
      const wishValues = {
        "user_ID": user_id,
        "product_ID": productid,
      }
      axios.post('/api/wishlist/post', wishValues)
        .then((response) => {
          if(type){
            productsDetails[index].isWish =true;
          }else{
            dispatch(getWishList(user_id));
            if(category_ID){
              var payload ={
                "sectionID"         : section_id,
                "categoryID"        : "",
                "subcategoryID"     : "",
                "limit"             : "",
              } 
              dispatch(getCategoryWiseList(payload));
              // dispatch(getCategoryWiseList(category_ID,user_id ? user_id : null,list_type,section_id));
            } 
            if(props.searchText){
              dispatch(getSearchResult(props.searchText,user_id,limit));
            } 
          }
          setToast({text: response.data.message, color: 'green'});
        })
        .catch((error) => {
          console.log('error', error);
        })
    }else{
      navigation.navigate('Auth');
      setToast({text: "You need to login first", color: colors.warning});
    }
  } 
  

  const _renderlist = ({ item, index })=>{
    return (
      <View key={index}  style={[styles.productContainer,{width:window.width-215,marginRight:15}]} >
        <TouchableOpacity   onPress={()=>{navigation.navigate("VendorList",{sectionUrl:item.section?.replace(/\s/g, '-').toLowerCase(),section:item.section})}}>
          <View style={styles.flx5}>
            <View style={styles.flx1}>
              {
                
                item.productImage && item.productImage.length > 0 ?
                  <FastImage
                    source={{ uri: item.productImage[0] }}
                    style={styles.subcatimg}
                    // resizeMode="stretch"
                    resizeMode={FastImage.resizeMode.contain}
                  >{item.discountPercent && item.discountPercent >0?
                      <ImageBackground source={require('../../AppDesigns/currentApp/images/offer_tag.png')} style={{height:40,width:40}}>
                          <Text style={{fontSize:12,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-SemiBold"}}>{item.discountPercent}%</Text>
                          <Text style={{fontSize:10,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-Regular"}}>OFF</Text>
                       </ImageBackground> :null
                    }    
                  </FastImage>
                  :
                  <Image
                    source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                    style={styles.subcatimg}
                  />
              }
                {/* <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => addToWishList(item._id,index)} >
                  <Icon size={22} name={item.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={item.isWish ? colors.heartIcon: colors.theme} />

                </TouchableOpacity> */}
              {
                item.discountPercent > 0 ?
                  <Text style={styles.peroff}> {item.discountPercent}% OFF</Text>
                  :
                  null
              }
            </View>
            <View style={[styles.flx1, styles.protxt]}>
              {item.brandNameRlang ?
              <Text numberOfLines={1} style={[styles.brandname, (index % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalBrandName}>{item.brandNameRlang}</Text>
              : 
              <Text numberOfLines={1} style={[styles.brandname, (index % 2 == 0 ? {} : { marginLeft: 12 })]}>{item.brand}</Text>
              }
              {item.brandNameRlang ?
              <Text numberOfLines={1} style={[styles.nameprod, (index % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalProductName}>{item.productNameRlang}</Text>
              :
              <Text numberOfLines={1} style={[styles.nameprod, (index % 2 == 0 ? {} : { marginLeft: 12 })]}>{item.productName}</Text>
              }                       
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
                 {item.discountPercent && item.discountPercent >0?<Text style={styles.discountpricecut}>{item.originalPrice} - </Text>:null}
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
                        <Text style={styles.ogprice}>{item.discountedPrice.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                        </Text>
                      :
                      <Text style={styles.ogprice}>{item.originalPrice.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : '' */} {/* item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
                    }
                </View>
              </View>
            </View>
            <View style={styles.addtocartbtn}>
              {/*availablessiz && availablessiz.length > 0 ? 
                  <View style={styles.inputTextWrapper}>
                  <Dropdown
                      onChangeText    = {(value) => handleTypeChange(value, availablessiz)}
                      data            = {availablessiz}
                      value           = {packsizes}
                      containerStyle  = {styles.ddContainer}
                      inputContainerStyle = {styles.ddInputContainer}
                      // dropdownPosition={- 5}
                      baseColor       = {'white'}
                      labelFontSize   ={10}
                      rippleCentered  ={true}
                      dropdownOffset  = {{ top:0, left: 0, bottom: 0 }}
                      itemTextStyle   = {styles.ddItemText}
                      disabledLineType= 'none'
                      underlineColor  = 'transparent'
                      style           = {{height:30,
                                          backgroundColor:"#fff",
                                          borderWidth:1,
                                          borderColor:colors.theme,
                                          borderRadius:5
                                        }}
                    /> 
                  </View>
              : null */}
            <View style={styles.sizedrpbtn}>
              <Button
                  onPress={()=>{navigation.navigate("VendorList",{sectionUrl:item.section?.replace(/\s/g, '-').toLowerCase(),section:item.section})}}
                  titleStyle={CommonStyles.addBtnText}
                  title="ADD TO CART"
                  buttonStyle={CommonStyles.addBtnStyle}
                  containerStyle={CommonStyles.addBtnContainer}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

    return (
      <View style={{paddingHorizontal:0,paddingVertical:15}}>
      <Text style={styles.title}>{props.blockTitle}</Text>
        {productList && productList.length > 0 ?
          <FlatList
            horizontal          = {true}
            data                = {productList}
            renderItem          = {item => _renderlist(item)}
            initialNumToRender  = {6}
            keyExtractor        = {item => item._id}
            // style={{width: SCREEN_WIDTH + 5, height:'100%'}}
        />
        // <ProductList 
        //   horizontal  = {true}
        //   navigate    = {navigation.navigate} 
        //   // title       = {'Exclusive Products'}  
        //   newProducts = {productList} 
        //   // type        = {'exclusive'} 
        //   route       = {'VendorList'}  
        //   // wishList    = {wishList} 
        //   userId      = {user_id} 
        //   limit       = {6}
        //   // loading     = {productList.loading}
        // />
        :
          <Loading 
            type={'HList'}
            loader={6}
          />
        } 
    </View>
    );
  }



