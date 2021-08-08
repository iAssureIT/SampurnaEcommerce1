import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity, Image, FlatList,ImageBackground,RefreshControl
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
  console.log("props",props);
  console.log("vendorLocation_id",vendorLocation_id);
  const {setToast,category_ID,loading,section_id,list_type,payload,vendorLocation_id,vendor,onEndReachedThreshold,type,subCategory} = props; 
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch 		= useDispatch();
  const [productsDetails,setProductDetails]= useState([]);
  const [packsizes,setPacksizes]= useState('');
  const [user_id,setUserId]= useState('');
  const [limit,setLimit]= useState(props.limit);
  const [refreshing,setRefresh]= useState(false);
  // FastImage.preload = (sources: Source[]) =>FastImageViewNativeModule.preload(sources);
  useEffect(() => {
    getData();
  },[props.limit,props.newProducts,isFocused]);

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
    setProductDetails(props.newProducts);
    // setLimit(props.limit)
    var data =  await AsyncStorage.multiGet(['user_id', 'token']);
    setUserId(data[0][1]);
  }

 

  const addToCart=(productid,vendor_ID)=>{
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
      console.log("formValues",formValues);
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
      console.log("formValues",formValues);
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
            productsDetails[index].isWish =!productsDetails[index].isWish;
            if(type === 'wishlist'){
              dispatch(getWishList(user_id));
            }
          }else{
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

  const getCategoryList=(item)=>{
    var payload ={
        "vendor_ID"         : item.vendor_id?item.vendor_id:item.vendor_ID,
        "sectionUrl"        : item.section?.replace(/\s/g, '-').toLowerCase(),
        "startRange"        : 0,
        "limitRange"        : 10,
    } 
    console.log("payload",payload);
    dispatch(getCategoryWiseList(payload));
}

  const _renderlist = ({ item, index })=>{
    return (
      <View key={index}  style={[styles.productContainer,{marginLeft:'5%',}]} >
        <TouchableOpacity style={{opacity:item.availableQuantity === 0 ? 0.5:1,backgroundColor: 'white',borderRadius:20,}} disabled={item.availableQuantity === 0 ?  true : props.disabled ? props.disabled : false} onPress={() => 
          {navigation.navigate('SubCatCompView', { 
              productID           : item._id,
              currency            : currency,
              vendorLocation_id   : vendorLocation_id ? vendorLocation_id : item.vendorLocation_id,
              location            : store.location,
              index               : index,
              vendor_id           : item.vendor_id?item.vendor_id:item.vendor_ID,
              category            : props.category,
              subCategory         : subCategory,
              vendor              : props.vendor
              });
              getCategoryList(item)
            }
          }>
          <View style={[styles.flx5,{paddingHorizontal:10}]}>
              {item.discountPercent && item.discountPercent >0?
                  <ImageBackground source={require('../../AppDesigns/currentApp/images/offer_tag.png')} style={styles.disCountLabel}>
                    <Text style={{fontSize:12,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-SemiBold"}}>{item.discountPercent}%</Text>
                    <Text style={{fontSize:10,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-Regular"}}>OFF</Text>
                  </ImageBackground> :null
                } 
              {userDetails.authService!=="guest" &&
              
              <TouchableOpacity style={[styles.textWrapper, styles.wishlisthrt]} onPress={() => addToWishList(item._id,item.vendor_ID,index)} disabled={item.availableQuantity === 0 ? true : false}>
                <Image
                  source={item.isWish ? require('../../AppDesigns/currentApp/images/heartF.png'):require('../../AppDesigns/currentApp/images/wishlistE.png')}                  
                  style={{ width: 22, height: 22 }}
                  resizeMode='contain'
                />
                {/* <Icon size={22} name={item.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={item.isWish ? colors.heartIcon: colors.heartIcon} /> */}
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
                    style={styles.subcatimg}
                    // resizeMode="stretch"
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
                {item.availableQuantity === 0 &&
                  <Image 
                    source={require("../../AppDesigns/currentApp/images/soldout1.png")}
                    style={styles.soldout}
                  />}
          
                <View style={[styles.textWrapper, styles.protxt]}>
                  {props.vendorName && 
                    <View style={{justifyContent:'flex-start',alignItems:'flex-start',marginBottom:15}}>
                      <Text style={styles.brandname}>{item.vendorName}</Text>
                    </View>
                  }
                  <View style={{flexDirection:'row',flex:1,marginVertical:5}}>
                    <View style={{flex:1,paddingRight:2}}>
                      {/* {item.brand ?
                    
                        <Text numberOfLines={1} style={[styles.productName]}>{item.brand}</Text>
                        :
                       null
                      } */}
                       {item.availableQuantity === 0 
                       ?
                       <View style={{height:30}} />
                        :
                        <View style={{flex:.2,alignSelf:'flex-end',marginBottom:5}}>
                          <TouchableOpacity 
                          disabled={props.disabled}
                            onPress={() => vendorLocation_id ?
                              item.vendor_ID ? 
                              addToCart(item._id,item.vendor_ID) 
                                : 
                                addToCartWish(item._id,item.vendor_id,item.vendorLocation_id,item.vendorName)
                            :
                            item.vendor_ID ? 
                              addToCartWish(item._id,item.vendor_ID,item.vendorLocation_id,item.vendorName)
                              :
                              addToCartWish(item._id,item.vendor_id,item.vendorLocation_id,item.vendorName)
                          }
                          style={{height:25,width:25,borderWidth:2,borderRadius:100,justifyContent:'center',alignItems:"center",borderColor:props.disabled ? colors.textLight : colors.cartButton}}>
                            <Icon name="plus" type="entypo" size={20} color={props.disabled ? colors.textLight : colors.cartButton} iconStyle={{alignSelf:'flex-end',fontWeight:"bold"}}/>
                          </TouchableOpacity>  
                        </View>}
                      <Text numberOfLines={2} style={[styles.nameprod]}>{item.productName}</Text>
                    </View>
                     
                  </View>
                  {/* <Text numberOfLines={2} style={[styles.nameprod]}>{item.productName}</Text> */}
                  {/* }                        */}
                </View>
                <View style={[styles.textWrapper, styles.prdet]}>
                  <View style={[styles.flxdir,{justifyContent:'flex-start',alignContent:'flex-start'}]}>
                    <View style={[styles.flxdir]}>
                      <Text style={styles.ogpriceC}>{currency} </Text>
                      {item.discountPercent && item.discountPercent >0?<Text style={styles.discountpricecut}>{item.originalPrice}</Text>:null}
                    </View>
                    <View style={[styles.flxdir12]}>
                      {item?.discountPercent > 0 ?
                            <Text style={styles.disprice}>{item?.discountedPrice?.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                            </Text>
                          :
                          <Text style={styles.ogprice}>{item?.originalPrice?.toFixed(2)} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : '' */} {/* item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
                        }
                    </View>
                  </View>
                </View>
            <View style={styles.addtocartbtn}>
            <View style={styles.sizedrpbtn}>
              {/* <Button
                  onPress={() => vendorLocation_id ?
                      item.vendor_ID ? 
                       addToCart(item._id,item.vendor_ID) 
                        : 
                        addToCartWish(item._id,item.vendor_id,item.vendorLocation_id,item.vendorName)
                    :
                    item.vendor_ID ? 
                      addToCartWish(item._id,item.vendor_ID,item.vendorLocation_id,item.vendorName)
                      :
                      addToCartWish(item._id,item.vendor_id,item.vendorLocation_id,item.vendorName)
                  }
                  titleStyle={CommonStyles.addBtnText}
                  title="ADD TO CART"
                  buttonStyle={CommonStyles.addBtnStyle}
                  containerStyle={CommonStyles.addBtnContainer}
                  disabled={props.disabled}
                /> */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  console.log("productsDetails",productsDetails);

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
          contentContainerStyle         ={{paddingVertical:15,marginTop:props.marginTop,paddingBottom:props.paddingBottom}}
          renderItem                    = {_renderlist} 
          nestedScrollEnabled           = {true}
          numColumns                    = {2}
          bounces={false}
          keyExtractor                  = {item => item?._id?.toString()}
          initialNumToRender            = {6}
          ListFooterComponent           = {()=>loading && <ActivityIndicator color={colors.theme}/>}
          onEndReachedThreshold          = {onEndReachedThreshold}
          onScroll={(e)=>props.onScroll(e)}
          ListEmptyComponent            = {
            <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
            <Image
              source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
            />
          </View>
        }
          onEndReached={() => {
            // console.log("distanceFromEnd",distanceFromEnd);
            if(limit > 6 && !stop_scroll && !stop_scroll_search) {
              onEnd();
                  //Call pagination function
            }
          }}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={refreshControl}
          //   />}
          getItemLayout={(data, index) => (
            {length:200, offset: 200 * index, index}
          )}
          /> 
      </React.Fragment>
    );
})

