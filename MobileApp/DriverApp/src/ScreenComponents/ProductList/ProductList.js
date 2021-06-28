import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity, Image, FlatList, Alert,StyleSheet, ImageBackground,Platform
} from 'react-native';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/ProductListStyles.js';
import { Icon, Button }       from "react-native-elements";
import axios                  from 'axios';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {withCustomerToaster}  from '../../redux/AppState.js';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import {useDispatch,
        useSelector }         from 'react-redux';
import { getList,
        getCategoryWiseList,
        getCartCount
       }                      from '../../redux/productList/actions';
import { getWishList } 		    from '../../redux/wishDetails/actions';
import { useNavigation }      from '@react-navigation/native';
import { ActivityIndicator }  from 'react-native-paper';
import { getSearchResult } 	  from '../../redux/globalSearch/actions';
import { useIsFocused }       from "@react-navigation/native";
import FastImage              from 'react-native-fast-image';
// import {product}              from '../../ScreenComponents/Product/Product.js'

TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

export const ProductList = withCustomerToaster((props)=>{
  const {setToast,category_ID,loading,section_id,list_type,payload,vendorLocation_id,vendor,onEndReachedThreshold,type} = props; 
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch 		= useDispatch();
  const [productsDetails,setProductDetails]= useState([]);
  const [packsizes,setPacksizes]= useState('');
  const [user_id,setUserId]= useState('');
  const [limit,setLimit]= useState(props.limit);
  // FastImage.preload = (sources: Source[]) =>FastImageViewNativeModule.preload(sources);
  useEffect(() => {
    getData();
  },[props.limit,props.newProducts]);

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    stop_scroll     : store.productList.stop_scroll,
    stop_scroll_search : store.globalSearch .stop_scroll_search,
    location        : store.location,
    userDetails     : store.userDetails
  }));
  const {currency}=store.preferences;
  const {stop_scroll,userDetails,location,stop_scroll_search}=store;
  const getData=async()=>{
    for (var i = 0; i < props.newProducts.length; i++) {
      var availableSizes = [];
      if (props.newProducts[i].size) {
        availableSizes.push(
          {
            "productSize": props.newProducts[i].size * 1,
            "packSize": 1,
          },
          {
            "productSize": props.newProducts[i].size * 2,
            "packSize": 2,
          },
          {
            "productSize": props.newProducts[i].size * 4,
            "packSize": 4,
          },
        )
        props.newProducts[i].availableSizes = availableSizes;
      }
    }
    setProductDetails(props.newProducts);
    // setLimit(props.limit)
    var data =  await AsyncStorage.multiGet(['user_id', 'token']);
    setUserId(data[0][1]);
  }

 

  const handleTypeChange = (value, availablessiz) => {
    const result = availablessiz.filter(product => product.value == value);
    setPacksizes(result[0].size)
  }

  const addToCart=(productid,vendor_ID,vendorName)=>{
    if(user_id){
      const formValues = {
        "user_ID"           : user_id,
        "product_ID"        : productid,
        "vendor_ID"         : vendor_ID,
        "quantity"          : packsizes === "" || 0 ? 1 : packsizes,
        "userLatitude"      : store.location?.address?.latlong?.lat,
        "userLongitude"     : store.location?.address?.latlong?.lng,
        "vendorLocation_id" : vendorLocation_id,
      }
      axios
        .post('/api/carts/post', formValues)
        .then((response) => {
          dispatch(getCartCount(user_id));
          if(response.data.message === "Product added to cart successfully."){
            setToast({text: response.data.message, color: 'green'});
          }else{
            setToast({text: response.data.message, color: colors.warning});
          }
        })
        .catch((error) => {
          setToast({text: 'Product is already in cart.', color: colors.warning});
        })
    }else{
      navigation.navigate('Auth');
      setToast({text: "You need to login first", color: colors.warning});
    }  
  }


  const addToCartWish=(productid,vendor_ID,vendorLocation_id,vendorName)=>{
    if(user_id){
      const formValues = {
        "user_ID"           : user_id,
        "product_ID"        : productid,
        "vendor_ID"         : vendor_ID,
        "quantity"          : packsizes === "" || 0 ? 1 : packsizes,
        "userLatitude"      : store.location?.address?.latlong?.lat,
        "userLongitude"     : store.location?.address?.latlong?.lng,
        "vendorLocation_id" : vendorLocation_id,
      }
      axios
        .post('/api/carts/post', formValues)
        .then((response) => {
          dispatch(getCartCount(user_id));
          if(response.data.message === "Product added to cart successfully."){
            setToast({text: response.data.message, color: 'green'});
          }else{
            setToast({text: response.data.message, color: colors.warning});
          }
        })
        .catch((error) => {
          setToast({text: 'Product is already in cart.', color: colors.warning});
        })
    }else{
      navigation.navigate('Auth');
      setToast({text: "You need to login first", color: colors.warning});
    }  
  }

  const viewall=(limitRange)=>{
    dispatch(getList("view_all",user_id,limitRange));
    navigation.navigate(props.route,{"type":type,"limit":limitRange})
  }

  const onEnd=()=>{
    var limitRange =limit + 10;
    setLimit(limitRange);
    if(type === "Search"){
      dispatch(getSearchResult(props.searchText,user_id,limitRange,true));
    }if(type === "vendor_sub_cat"){
        payload.startRange =limit+1;
        payload.limitRange =limitRange;
        payload.scroll     = true;
        dispatch(getCategoryWiseList(payload));
    }else{
      dispatch(getList(type,user_id,limitRange));
    }
  }

  const refreshControl=()=>{
    setRefresh(true);
    dispatch(getList(type,user_id,limit));
    dispatch(getWishList(user_id));
  }


  const addToWishList = (productid,vendor_id,index) => {
    if(user_id){
      const wishValues = {
        "user_ID"           : user_id,
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
              dispatch(getSearchResult(props.searchText,user_id,limit,true));
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
    var availablessiz = [];
    availablessiz = item.availableSizes ? item.availableSizes.map((a, i) => { return { value: a.productSize === 1000 ? "1 KG" : a.productSize === 2000 ? "2 KG" : a.productSize + " " + item.unit, size: a.packSize } }) : []
    const packsizes = availablessiz && availablessiz.length > 0 ? availablessiz[0].value : '';
    return (
      <View key={index}  style={[styles.productContainer,index%2===1&&{marginLeft:'5%'}]} >
        <TouchableOpacity  disabled={props.disabled}onPress={() => navigation.navigate('SubCatCompView', { productID: item._id ,currency:currency,vendorLocation_id:vendorLocation_id,location:store.location})}>
          <View style={styles.flx5}>
            <View style={styles.flx1}>
              {
                item.productSmallImage && item.productSmallImage.length > 0 ?
                  <FastImage
                    source={{ 
                      uri: item.productSmallImage[0],
                      priority: FastImage.priority.high, 
                      cache: (Platform.OS === 'ios' ? 'default' : FastImage.cacheControl.immutable),
                    }}
                    // LoadingIndicatorComponent={ActivityIndicator}
                    PlaceholderContent={<ActivityIndicator color={colors.theme}/>}
                    style={styles.subcatimg}
                    // resizeMode="stretch"
                    resizeMode={FastImage.resizeMode.stretch}
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
                {userDetails.authService!=="guest" &&<TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => addToWishList(item._id,item.vendor_ID,index)} >
                  <Icon size={22} name={item.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={item.isWish ? colors.heartIcon: colors.theme} />

                </TouchableOpacity>}
              {
                item.discountPercent > 0 ?
                  <Text style={styles.peroff}> {item.discountPercent}% OFF</Text>
                  :
                  null
              }
            </View>
            <View style={[styles.flx1, styles.protxt]}>
              {/* {item.brandNameRlang ?
              <Text numberOfLines={1} style={[styles.brandname, (index % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalBrandName}>{item.brandNameRlang}</Text>
              :  */}
              {props.vendorName && 
                <View style={{justifyContent:'center',alignItems:'center',marginBottom:15}}>
                  <Text style={styles.brandname}>{item.vendorName}</Text>
                </View>
              }
              {item.brand ?
                <Text numberOfLines={1} style={[styles.brandname]}>{item.brand}</Text>
                :
                null
              }
              {/* } */}
              {/* {item.brandNameRlang ?
              <Text numberOfLines={1} style={[styles.nameprod, (index % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalProductName}>{item.productNameRlang}</Text>
              : */}
              <Text numberOfLines={1} style={[styles.nameprod]}>{item.productName}</Text>
              {/* }                        */}
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
                  onPress={() => item.vendor_ID ? addToCart(item._id,item.vendor_ID,item.vendorName) : addToCartWish(item._id,item.vendor_id,item.vendorLocation_id,item.vendorName)}
                  titleStyle={CommonStyles.addBtnText}
                  title="ADD TO CART"
                  buttonStyle={CommonStyles.addBtnStyle}
                  containerStyle={CommonStyles.addBtnContainer}
                  disabled={props.disabled}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <React.Fragment>
        <View style={styles.maintitle}>
          {props.title&&<View style={styles.maintitle}>
            <Text style={styles.title}>{props.title} </Text>
          </View>}

          {props.route &&<View style={styles.viewalltxt}>
            <View style={styles.sizedrpbtn}>
              <Button
                onPress={() => {viewall(20)}}
                titleStyle={styles.buttonText1}
                title="View All"
                buttonStyle={CommonStyles.addBtnStyle}
                containerStyle={styles.buttonContainer2}
              />
            </View>
          </View>}
        </View>
        <FlatList
          data                          = {productsDetails}
          showsVerticalScrollIndicator  = {false}
          // contentContainerStyle         ={{paddingHorizontal:15}}
          renderItem                    = {_renderlist} 
          nestedScrollEnabled           = {true}
          numColumns                    = {2}
          bounces={false}
          keyExtractor                  = {item => item._id.toString()}
          initialNumToRender            = {6}
          ListFooterComponent           = {()=>loading && <ActivityIndicator color={colors.theme}/>}
          onEndReachedThreshold          = {onEndReachedThreshold}
        //   ListEmptyComponent            = {
        //     <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
        //     <Image
        //       source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
        //     />
        //   </View>
        // }
          onEndReached={() => {
            // console.log("distanceFromEnd",distanceFromEnd);
            if(limit > 6 && !stop_scroll && !stop_scroll_search) {
              onEnd();
                  //Call pagination function
            }
          }}
          // getItemLayout={(data, index) => (
          //   {length: 500, offset: 500 * index, index}
          // )}
          /> 
      </React.Fragment>
    );
})

