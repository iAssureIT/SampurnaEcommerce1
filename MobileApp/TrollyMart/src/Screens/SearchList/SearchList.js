import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native';
import styles                     from '../../AppDesigns/currentApp/styles/ScreenStyles/Wishliststyles.js';
import productStyles              from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/ProductListStyles.js';
import { colors }                 from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles               from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {withCustomerToaster}      from '../../redux/AppState.js';
import {useSelector,useDispatch } from 'react-redux';
import SearchSuggetion            from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import Loading                    from '../../ScreenComponents/Loading/Loading.js';
import FastImage                  from 'react-native-fast-image';
import { getSearchResult } 	      from '../../redux/globalSearch/actions';
import axios                      from 'axios';
import {getCartCount}             from '../../redux/productList/actions';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const SearchList  = withCustomerToaster((props)=>{
  const [limit,setLimit]   = useState(10);
  const dispatch 		  = useDispatch();
  const {navigation,route,setToast}=props;
  const {type}=route.params;

  const store = useSelector(store => ({
    productList         : store.productList,
    globalSearch        : store.globalSearch,
    userDetails         : store.userDetails,
    preferences         : store.storeSettings.preferences,
    location            : store.location,
    stop_scroll_search  : store.globalSearch.stop_scroll_search,
  }));
  const {currency}=store.preferences;
  const {globalSearch,userDetails,stop_scroll_search,location} = store;
  console.log("globalSearch",globalSearch);

  const onEnd=()=>{
    var limitRange =limit + 10;
    setLimit(limitRange);
    dispatch(getSearchResult(props.searchText,userDetails.userDetails?.user_id,limitRange,true));
  }

    const addToCartWish=(productid,vendor_ID,vendorLocation_id,vendorName)=>{
      if(userDetails?.user_id){
        const formValues = {
          "user_ID"           : userDetails?.user_id,
          "product_ID"        : productid,
          "vendor_ID"         : vendor_ID,
          "quantity"          :  1,
          "userLatitude"      : store.location?.address?.latlong?.lat,
          "userLongitude"     : store.location?.address?.latlong?.lng,
          "vendorLocation_id" : vendorLocation_id,
        }
        console.log("formValues",formValues);
        axios
          .post('/api/carts/post', formValues)
          .then((response) => {
            dispatch(getCartCount(userDetails?.user_id));
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

    const addToWishList = (productid,vendor_id,vendorLocation_id,index) => {
      if(userDetails?.user_id){
        const wishValues = {
          "user_ID"           : userDetails?.user_id,
          "product_ID"        : productid,
          "userDelLocation"   : {
            "lat"               : location?.address?.latlong?.lat, 
            "long"              : location?.address?.latlong?.lng,
            "delLocation"       : location?.address?.addressLine2
          },
          "vendor_id"          : vendor_id,
          "vendorLocation_id"  : vendorLocation_id,
        }
        axios.post('/api/wishlist/post', wishValues)
          .then((response) => {
            if(type){
              globalSearch.searchList[index].isWish =!globalSearch.searchList[index].isWish;
            }else{
              if(props.searchText){
                dispatch(getSearchResult(props.searchText,userDetails?.user_id,limit,true));
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
        <View key={index}  style={[productStyles.productContainer,{marginLeft:'5%'}]} >
          <TouchableOpacity style={{opacity:item.availableQuantity === 0  ? 0.5:1,backgroundColor: 'white',borderRadius:20,}} disabled={item.availableQuantity === 0 ?  true : false} onPress={() => 
            {navigation.navigate('SubCatCompView', { 
                productID           : item._id,
                currency            : currency,
                vendorLocation_id   : item.vendorLocation_id,
                location            : store.location,
                index               : index,
                vendor_id           : item.vendor_ID,
                category            : props.category,
                vendor              : {vendorName: item.vendorName}
                });
              }
            }>
            <View style={[productStyles.flx5,{paddingHorizontal:wp(2.6)}]}>
                {userDetails.authService!=="guest" &&
                  <TouchableOpacity style={[productStyles.wishlisthrt]} onPress={() => addToWishList(item._id,item.vendor_ID,item.vendorLocation_id,index)} disabled={item.availableQuantity === 0 ? true : false}>
                    <Image
                      source={item.isWish ? {uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/heartF.png'} : {uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/wishlistE.png'}}                  
                      style={{ width: hp(2.5), height: hp(2.5) }}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                }
                {
                  item.productImage && item.productImage.length > 0 ?
                    <FastImage
                      source={{ 
                        uri: item.productImage[0],
                        priority: FastImage.priority.high, 
                        cache: FastImage.cacheControl.immutable,
                      }}
                      // LoadingIndicatorComponent={ActivityIndicator}
                      PlaceholderContent={<ActivityIndicator color={colors.theme}/>}
                      style={productStyles.subcatimg}
                      // resizeMode="stretch"
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    :
                    <FastImage
                      source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                      PlaceholderContent={<ActivityIndicator color={colors.theme}/>}
                      style={productStyles.subcatimg}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                }
                  {item.availableQuantity === 0 &&
                    <Image 
                      source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/soldout1.png'}}
                      style={productStyles.soldout}
                    />}
            
                  <View style={[productStyles.textWrapper, productStyles.protxt]}>
                    <View style={{justifyContent:'flex-start',alignItems:'flex-start'}}>
                      <Text style={productStyles.brandname}>{item.vendorName}</Text>
                    </View>
                    <View style={{flexDirection:'row',flex:1}}>
                      <View style={{flex:1,backgroundColor:"#fff"}}>
                         {item.availableQuantity === 0 
                         ?
                         <View style={{height:30}} />
                          :
                          <View style={{flex:.2,alignSelf:'flex-end',paddingVertical:2}}>
                            <TouchableOpacity 
                            disabled={item.availableQuantity === 0 ? true : false}
                              onPress={() => 
                                addToCartWish(item._id,item.vendor_ID,item.vendorLocation_id,item.vendorName)
                            }
                            style={{justifyContent:'center',alignItems:"center",
                            shadowColor: "#00000059",
                            shadowOffset: {
                              width: -2,
                              height:2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            }}>
                              <Image
                                resizeMode="contain"
                                source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/addtocarticon@2x.png'}}
                                style={{height:hp(3.5),width:hp(3.5)}}
                              />
                            </TouchableOpacity>  
                          </View>}
                      </View>
                       
                    </View>
                  </View>
                  <View style={[productStyles.productStyles, styles.prdet]}>
                    <Text numberOfLines={2} style={[productStyles.nameprod]} ellipsizeMode='middle'>{item.productName}</Text>
                    <View style={[productStyles.flxdir,{justifyContent:'flex-start',alignContent:'flex-start'}]}>
                      <View style={[productStyles.flxdir]}>
                        <Text style={productStyles.ogpriceC}>{currency} </Text>
                        {item.discountPerproductStylescent && item.discountPercent >0?<Text style={productStyles.discountpricecut}>{item.originalPrice}</Text>:null}
                      </View>
                      <View style={[productStyles.flxdir12]}>
                        {item?.discountPercent > 0 ?
                              <Text style={productStyles.disprice}>{item?.discountedPrice?.toFixed(2)} <Text style={productStyles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                              </Text>
                            :
                            <Text style={productStyles.ogprice}>{item?.originalPrice?.toFixed(2)} <Text style={productStyles.packofnos}>{/* item.size ? '-'+item.size : '' */} {/* item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
                          }
                      </View>
                    </View>
                  </View>
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <React.Fragment>
        <View style={styles.addsuperparent}>
        {globalSearch.search ?
            <SearchSuggetion />
              :<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <View style={{marginTop:hp(2),marginBottom:hp(8)}}>
                {
                    globalSearch.searchList.length ===0 ?
                    <Loading />
                    :
                     globalSearch.searchList && globalSearch.searchList.length > 0 ?
                    <FlatList
                      data                          = {globalSearch.searchList}
                      showsVerticalScrollIndicator  = {false}
                      contentContainerStyle         ={{paddingVertical:15,marginTop:props.marginTop,paddingBottom:props.paddingBottom,backgroundColor:"#fff"}}
                      renderItem                    = {_renderlist} 
                      nestedScrollEnabled           = {true}
                      numColumns                    = {2}
                      bounces                       = {false}
                      keyExtractor                  = {item => item?._id?.toString()}
                      initialNumToRender            = {6}
                      ListFooterComponent           = {()=>globalSearch.loading && <ActivityIndicator color={colors.theme}/>}
                      onEndReachedThreshold         = {0.5}
                      scrollEventThrottle           = {16}
                      bounces={false}
                      ListEmptyComponent            = {
                        <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
                          <Image source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/noproduct.png'}}/>
                       </View>
                      }
                      onEndReached={() => {
                        if(!stop_scroll_search) {
                          onEnd();
                        }
                      }}
                      getItemLayout={(data, index) => (
                        {length:200, offset: 200 * index, index}
                      )}
                      /> 
                    :
                    <View style={{justifyContent:"center",alignItems:'center',marginTop:'40%'}}>
                    <Image 
                      source = {{uri:'https://prodtrollymart.s3.us-east-2.amazonaws.com/icons/mobile/No-Products-Available.png'}}
                      style={{height:300,width:300}}
                      resizeMode="contain"
                    />
                    <Text style={CommonStyles.noDataFound}>No Results Found</Text>
                  </View> 
                }
                </View>
            </View>
          </ScrollView>}
         
        </View>
      </React.Fragment>
    );
})