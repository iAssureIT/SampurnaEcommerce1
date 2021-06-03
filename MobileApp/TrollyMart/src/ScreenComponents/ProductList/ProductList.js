import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity, Image, FlatList, Alert,StyleSheet, ImageBackground
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
        getCategoryWiseList } from '../../redux/productList/actions';
import { getWishList } 		    from '../../redux/wishDetails/actions';
import { useNavigation }      from '@react-navigation/native';
import { ActivityIndicator }  from 'react-native-paper';
import { getSearchResult } 	  from '../../redux/globalSearch/actions';
import { useIsFocused }       from "@react-navigation/native";
import FastImage              from 'react-native-fast-image'

TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

export const ProductList = withCustomerToaster((props)=>{
  const {setToast,category_ID,loading,section_id,list_type,payload} = props; 
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch 		= useDispatch();
  const [productsDetails,setProductDetails]= useState([]);
  const [type,setType]= useState('');
  const [packsizes,setPacksizes]= useState('');
  const [user_id,setUserId]= useState('');
  const [limit,setLimit]= useState(props.limit);
  useEffect(() => {
    getData();
  },[props]);

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    stop_scroll     : store.productList.stop_scroll
  }));
  const {currency}=store.preferences;
  const {stop_scroll}=store;
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
    setType(props.type);
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
        "user_ID"     : user_id,
        "product_ID"  : productid,
        "vendor_ID"   : vendor_ID,
        "quantity"    : packsizes === "" || 0 ? 1 : packsizes,
      }
      axios
        .post('/api/Carts/post', formValues)
        .then((response) => {
          setToast({text: response.data.message, color: 'green'});
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
      dispatch(getSearchResult(props.searchText,user_id,limitRange));
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
      var availablessiz = [];
      availablessiz = item.availableSizes ? item.availableSizes.map((a, i) => { return { value: a.productSize === 1000 ? "1 KG" : a.productSize === 2000 ? "2 KG" : a.productSize + " " + item.unit, size: a.packSize } }) : []
      const packsizes = availablessiz && availablessiz.length > 0 ? availablessiz[0].value : '';
      return (
        <View key={index}  style={[styles.productContainer,index%2===1&&{marginLeft:'5%'}]} >
          <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item._id ,currency:currency})}>
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
                  <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => addToWishList(item._id,index)} >
                    <Icon size={22} name={item.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={item.isWish ? colors.heartIcon: colors.theme} />

                  </TouchableOpacity>
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
                    onPress={() => addToCart(item._id,item.vendor_ID,item.vendorName)}
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
          contentContainerStyle         ={{paddingHorizontal:15,paddingBottom:60}}
          renderItem                    = {_renderlist} 
          nestedScrollEnabled           = {true}
          numColumns                    = {2}
          bounces={false}
          keyExtractor                  = {item => item._id.toString()}
          // initialNumToRender            = {6}
          ListFooterComponent           = {()=>loading && <ActivityIndicator color={colors.theme}/>}
          onEndReachedThreshold          = {0.01}
        //   ListEmptyComponent            = {
        //     <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
        //     <Image
        //       source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
        //     />
        //   </View>
        // }
          onEndReached={() => {
            // console.log("distanceFromEnd",distanceFromEnd);
            if(limit > 6 && !stop_scroll) {
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

