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
import FastImage              from 'react-native-fast-image';


TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

export const Product = withCustomerToaster((props)=>{
  const {setToast,category_ID,section_id,product,type,packsizes,limit,index,user_id} = props; 
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch 		= useDispatch();
  const [productsDetails,setProductDetails]= useState([]);
  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    stop_scroll     : store.productList.stop_scroll
  }));

  useEffect(() => {
    // getData();
  },[props]);

  const {currency}=store.preferences;
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




  const addToWishList = (productid,index) => {
    if(user_id){
      const wishValues = {
        "user_ID": user_id,
        "product_ID": productid,
      }
      axios.post('/api/wishlist/post', wishValues)
        .then((response) => {
        
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
        //   }
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

  return (
    <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: product._id ,currency:currency})}>
        <View style={styles.flx5}>
            <View style={styles.flx1}>
            {
                product.productImage && product.productImage.length > 0 ?
                <FastImage
                    source={{ uri: product.productImage[0] }}
                    style={styles.subcatimg}
                    // resizeMode="stretch"
                    resizeMode={FastImage.resizeMode.contain}
                >{product.discountPercent && product.discountPercent >0?
                    <ImageBackground source={require('../../AppDesigns/currentApp/images/offer_tag.png')} style={{height:40,width:40}}>
                        <Text style={{fontSize:12,color:"#fff",alignSelf:"center",fontFamily:"Montserrat-SemiBold"}}>{product.discountPercent}%</Text>
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
                <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => addToWishList(product._id,index)} >
                <Icon size={22} name={product.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={product.isWish ? colors.heartIcon: colors.theme} />

                </TouchableOpacity>
            {
                product.discountPercent > 0 ?
                <Text style={styles.peroff}> {product.discountPercent}% OFF</Text>
                :
                null
            }
            </View>
            <View style={[styles.flx1, styles.protxt]}>
            {product.brandNameRlang ?
            <Text numberOfLines={1} style={[styles.brandname, (index % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalBrandName}>{product.brandNameRlang}</Text>
            : 
            <Text numberOfLines={1} style={[styles.brandname, (index % 2 == 0 ? {} : { marginLeft: 12 })]}>{product.brand}</Text>
            }
            {product.brandNameRlang ?
            <Text numberOfLines={1} style={[styles.nameprod, (index % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalProductName}>{product.productNameRlang}</Text>
            :
            <Text numberOfLines={1} style={[styles.nameprod, (index % 2 == 0 ? {} : { marginLeft: 12 })]}>{product.productName}</Text>
            }                       
            </View>
            <View style={[styles.flx1, styles.prdet]}>
            <View style={[styles.flxdir,{justifyContent:"center",alignItems:"center"}]}>
                <View style={[styles.flxdir]}>
                {/* <Icon
                    name={product.currency}
                    type="font-awesome"
                    size={13}
                    color="#333"
                    iconStyle={{ marginTop: 5, marginRight: 3 }}
                /> */}
                <Text style={styles.ogprice}>{currency} </Text>
                {product.discountPercent && product.discountPercent >0?<Text style={styles.discountpricecut}>{product.originalPrice} - </Text>:null}
                </View>
                <View style={[styles.flxdir,{alignItems:"center"}]}>
                {/* <Icon
                    name={product.currency}
                    type="font-awesome"
                    size={13}
                    color="#333"
                    iconStyle={{ marginTop: 5}}
                /> */}
                {product.discountPercent > 0 ?
                        <Text style={styles.ogprice}>{product.discountedPrice.toFixed(2)} <Text style={styles.packofnos}>{/* product.size ? '-'+product.size : ''} {product.unit !== 'Number' ? product.unit : '' */}</Text>
                        </Text>
                    :
                    <Text style={styles.ogprice}>{product.originalPrice.toFixed(2)} <Text style={styles.packofnos}>{/* product.size ? '-'+product.size : '' */} {/* product.unit !== 'Number' ? product.unit : '' */}</Text> </Text>
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
                onPress={() => addToCart(product._id,product.vendor_ID,product.vendorName)}
                titleStyle={CommonStyles.addBtnText}
                title="ADD TO CART"
                buttonStyle={CommonStyles.addBtnStyle}
                containerStyle={CommonStyles.addBtnContainer}
                />
            </View>
            </View>
        </View>
        </TouchableOpacity>
    );
})

