import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity, Image, FlatList, Alert,SafeAreaView
} from 'react-native';
import Modal                  from "react-native-modal";
import { Dropdown }           from 'react-native-material-dropdown-v2';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/ProductListStyles.js';
import { Icon, Button }       from "react-native-elements";
import axios                  from 'axios';
import { colors }             from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {withCustomerToaster}  from '../../redux/AppState.js';
import AsyncStorage           from '@react-native-async-storage/async-storage';

import { connect,
        useDispatch,
        useSelector }         from 'react-redux';
import { getList } 		        from '../../redux/productList/actions';
import { getWishList } 		    from '../../redux/wishDetails/actions';
import { useNavigation }                from '@react-navigation/native';
export const ProductList = withCustomerToaster((props)=>{
  const {setToast} = props; 
  const navigation = useNavigation();
  const dispatch 		= useDispatch();
  const [productImg,setProductImg]= useState([]);
  const [newProducts,setNewProducts]= useState([]);
  const [productsDetails,setProductDetails]= useState([]);
  const [wished,setWished]= useState([]);
  const [type,setType]= useState('');
  const [addtocart,setAddtocart]= useState(false);
  const [wishlisted,setWishlisted]= useState(false);
  const [wishlistedproduct,setWishlistedproduct]= useState(false);
  const [wishlistedalready,setWishlistedalready]= useState(false);
  const [wishlistremove,setWishlistremove]= useState(false);
  const [packsizes,setPacksizes]= useState('');
  const [user_id,setUserId]= useState('');
  const [token,setToken]= useState('');
  

  useEffect(() => {
    getData()
  },[props.newProducts]);

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
    var data =  await AsyncStorage.multiGet(['user_id', 'token']);
    setUserId(data[0][1]);
    setToken(data[1][1]);
  }

 

  const handleTypeChange = (value, availablessiz) => {
    const result = availablessiz.filter(product => product.value == value);
    setPacksizes(result[0].size)
  }

  const addToCart=(productid)=>{
    const formValues = {
      "user_ID"     : props.userId,
      "product_ID"  : productid,
      "quantity"    : packsizes === "" || 0 ? 1 : packsizes,
    }
    axios
      .post('/api/Carts/post', formValues)
      .then((response) => {
        setAddtocart(true);
        setToast({text: 'Product is added to cart.', color: 'green'});
      })
      .catch((error) => {
        console.log("error",error);
        setToast({text: 'Product is already in cart.', color: colors.warning});
      })
  }

  const viewallfeatureprod=()=>{
    navigation.navigate(props.route)
  }

  const addToWishList = (productid) => {
    const wishValues = {
      "user_ID": user_id,
      "product_ID": productid,
    }
    axios.post('/api/wishlist/post', wishValues)
      .then((response) => {
        dispatch(getList('featured',user_id));
        dispatch(getList('exclusive',user_id));
        dispatch(getList('discounted',user_id));
        dispatch(getWishList(user_id));
        setToast({text: response.data.message, color: 'green'});
      })
      .catch((error) => {
        console.log('error', error);
      })
  }


  const _renderlist = ({ item, i })=>{
    var availablessiz = [];
    availablessiz = item.availableSizes ? item.availableSizes.map((a, i) => { return { value: a.productSize === 1000 ? "1 KG" : a.productSize === 2000 ? "2 KG" : a.productSize + " " + item.unit, size: a.packSize } }) : []
    const packsizes = availablessiz && availablessiz.length > 0 ? availablessiz[0].value : '';
    return (
      <View key={i}  style={styles.mainrightside} >
        <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item._id })}>
          <View style={styles.flx5}>
            <View style={styles.flx1}>
              {
                item.productImage && item.productImage.length > 0 ?
                  <Image
                    source={{ uri: item.productImage[0] }}
                    style={styles.subcatimg}
                    resizeMode="contain"
                  />
                  :
                  <Image
                    source={require("../../AppDesigns/currentApp/images/notavailable.jpg")}
                    style={styles.subcatimg}
                  />
              }
                <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => addToWishList(item._id)} >
                  <Icon size={22} name={item.isWish ? 'heart' : 'heart-o'} type='font-awesome' color={colors.theme} />
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
              <Text numberOfLines={1} style={[styles.brandname, (i % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalBrandName}>{item.brandNameRlang}</Text>
              : 
              <Text numberOfLines={1} style={[styles.brandname, (i % 2 == 0 ? {} : { marginLeft: 12 })]}>{item.brand}</Text>
              }
              {item.brandNameRlang ?
              <Text numberOfLines={1} style={[styles.nameprod, (i % 2 == 0 ? {} : { marginLeft: 12 })]} style={styles.regionalProductName}>{item.productNameRlang}</Text>
              :
              <Text numberOfLines={1} style={[styles.nameprod, (i % 2 == 0 ? {} : { marginLeft: 12 })]}>{item.productName}</Text>
              }                       
            </View>
            <View style={[styles.flx1, styles.prdet]}>
              <View style={[styles.flxdir,{justifyContent:"center",alignItems:"center"}]}>
                <View style={[styles.flxdir]}>
                  <Icon
                    name={item.currency}
                    type="font-awesome"
                    size={13}
                    color="#333"
                    iconStyle={{ marginTop: 5, marginRight: 3 }}
                  />
                  <Text style={styles.discountpricecut}>{item.originalPrice}</Text>
                </View>
                <View style={[styles.flxdir,{marginLeft:10,alignItems:"center"}]}>
                  <Icon
                    name={item.currency}
                    type="font-awesome"
                    size={13}
                    color="#333"
                    iconStyle={{ marginTop: 5}}
                  />
                  {item.discountPercent > 0 ?
                        <Text style={styles.ogprice}>{item.discountedPrice} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                        </Text>
                      :
                      <Text style={styles.ogprice}>{item.originalPrice} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : '' */} {/* item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
                    }
                </View>
              </View>
            </View>
            <View style={styles.addtocartbtn}>
              {availablessiz && availablessiz.length > 0 ? 
              <View style={styles.addbtn}>
                <View style={[styles.inputWrapper]}>
                  <View style={styles.inputImgWrapper}></View>
                  <View style={styles.inputTextWrapper}>
                    <Dropdown
                      onChangeText={(value) => handleTypeChange(value, availablessiz)}
                      data={availablessiz}
                      value={packsizes}
                      containerStyle={styles.ddContainer}
                      dropdownOffset={{ top: 0, left: 0, bottom: 0 }}
                      itemTextStyle={styles.ddItemText}
                      inputContainerStyle={{ borderBottomColor: 'transparent', padding: 0 }}
                    />
                  </View>
                </View>
              </View>
              : null }
              <View style={styles.sizedrpbtn}>
              <Button
                  onPress={() => addToCart(item._id, packsizes)}
                  titleStyle={CommonStyles.addBtnText}
                  title="Add"
                  buttonStyle={CommonStyles.addBtnStyle}
                  containerStyle={CommonStyles.addBtnClor}
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
                onPress={() => viewallfeatureprod()}
                titleStyle={styles.buttonText1}
                title="View All"
                buttonStyle={CommonStyles.addBtnStyle}
                containerStyle={styles.buttonContainer2}
              />
            </View>
          </View>}
        </View>
        <SafeAreaView style={styles.proddets}>
          {productsDetails &&
            <FlatList
              data={productsDetails}
              showsVerticalScrollIndicator={false}
              renderItem={_renderlist} 
              nestedScrollEnabled={true}
              numColumns={2}
              keyExtractor={item => item._id}
              nestedScrollEnabled
              // refreshControl={
              //     <RefreshControl
              //       refreshing={this.state.refresh}
              //       onRefresh={() => this.onRefresh()}
              //     />
              // } 
              /> 
          }
          {/* <View style={{height:100,backgroundColor:"#ff0",flex:.5}}>
            </View>*/}
        </SafeAreaView> 
      </React.Fragment>
    );
})