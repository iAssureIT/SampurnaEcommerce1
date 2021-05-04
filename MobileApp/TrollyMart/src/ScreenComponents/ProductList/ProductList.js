import React ,{useState,useEffect} from 'react';
import {
  Text, View, 
  TouchableOpacity, Image, FlatList, Alert
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
import {useNavigation}        from '../../config/useNavigation.js';
import { connect,useDispatch,useSelector }from 'react-redux';
import { getList } 		              from '../../redux/productList/actions';
import { getWishList } 		          from '../../redux/wishDetails/actions';

export const ProductList = withCustomerToaster((props)=>{
  const {setToast} = props; 
  const dispatch 		= useDispatch();
  const [productImg,setProductImg]= useState([]);
  const [newProducts,setNewProducts]= useState([]);
  const [productsDetails,setProductDetails]= useState([]);
  const [wished,setWished]= useState([]);
  const [type,setType]= useState('');
  const [addtocart,setAddtocart]= useState(false);
  const [wishlisted,setWishlisted]= useState(false);
  const [alreadyincarts,setAlreadyincarts]= useState(false);
  const [wishlistedproduct,setWishlistedproduct]= useState(false);
  const [wishlistedalready,setWishlistedalready]= useState(false);
  const [wishlistremove,setWishlistremove]= useState(false);
  const [packsizes,setPacksizes]= useState('');
  const [user_id,setUserId]= useState('');
  const [token,setToken]= useState('');
  const navigation = useNavigation();

  useEffect(() => {
    console.log("useEffect");
    getData()
  },[]);

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
    console.log("data",data);
    setUserId(data[0][1]);
    setToken(data[1][1]);
    let wished = [];
    for (var i = 0; i < props.wishList.length; i++) {
      wished.push({
        'product_ID': props.wishList[i].product_ID,
      })
      if (wished[i].product_ID) {
        setWished(wished)
      }
    }
  }

 

  const handleTypeChange = (value, availablessiz) => {
    const result = availablessiz.filter(product => product.value == value);
    setPacksizes(result[0].size)
  }

  const addToCart=(productid)=>{
    const formValues = {
      "user_ID": props.userId,
      "product_ID": productid,
      "quantity": packsizes === "" || 0 ? 1 : packsizes,
    }
    console.log("formValues addtocart==>", formValues);
    axios
      .post('/api/Carts/post', formValues)
      .then((response) => {
        console.log("response",response);
        setAddtocart(true);
        setToast({text: 'Product is added to cart.', color: 'green'});
      })
      .catch((error) => {
        setAlreadyincarts(true);
        console.log("error",error);
        // navigation.navigate('App')
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
        console.log("response check",response);
          dispatch(getList('featured'));
          dispatch(getList('exclusive'));
          dispatch(getList('discounted'));
          dispatch(getWishList(user_id));
          setToast({text: response.data.message, color: 'green'});
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  const removefromwishlist_func = (id)=> {
    console.log("ididid", id);
    axios.delete('/api/wishlist/delete/' + id)
      .then((response) => {
        setToast({text: response.data.message, color: 'green'});
        dispatch(getList('featured'));
        dispatch(getList('exclusive'));
        dispatch(getList('discounted'));
        dispatch(getWishList(data[0][1]));
      })
      .catch((error) => {
        console.log("error",error);
        navigation.navigate('App')
        setToast({text: 'Something went wrong.', color: 'red'});
      })
  }

  const _renderlist = ({ item, i })=>{
    var x = wished && wished.length > 0 ? wished.filter((abc) => abc.product_ID === item._id) : [];
    console.log("xxxxxxxxxxxxxxx",x);
    var productid = ''; 
    var y = x.map((wishli, i) => { productid = wishli.product_ID });
    console.log("productid",productid);
    console.log("item",item._id);
    console.log("item",productid === item._id);
    var availablessiz = [];
    availablessiz = item.availableSizes ? item.availableSizes.map((a, i) => { return { value: a.productSize === 1000 ? "1 KG" : a.productSize === 2000 ? "2 KG" : a.productSize + " " + item.unit, size: a.packSize } }) : []
    const packsizes = availablessiz.length > 0 ? availablessiz[0].value : '';
   
    return (
      <View key={i}  style={styles.mainrightside} >
        <TouchableOpacity onPress={() => navigation.navigate('SubCatCompView', { productID: item._id })}>
          <View style={styles.flx5}>
            <View style={styles.flx1}>
              {
                item.productImage.length > 0 ?
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
              {
                productid === item._id ?
                  <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => removefromwishlist_func(item._id)} >
                    <Icon size={22} name='heart' type='font-awesome' color={colors.theme} />
                  </TouchableOpacity>
                  :

                  <TouchableOpacity style={[styles.flx1, styles.wishlisthrt]} onPress={() => addToWishList(item._id)} >
                    <Icon size={22} name='heart-o' type='font-awesome' color={colors.theme} />
                  </TouchableOpacity>
              }
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
              {availablessiz.length > 0 ? 
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
          <View style={styles.maintitle}>
            <Text style={styles.title}>{props.title} </Text>
          </View>
          <View style={styles.viewalltxt}>
            <View style={styles.sizedrpbtn}>
              <Button
                onPress={() => viewallfeatureprod()}
                titleStyle={styles.buttonText1}
                title="View All"
                buttonStyle={CommonStyles.addBtnStyle}
                containerStyle={styles.buttonContainer2}
              />
            </View>
          </View>
        </View>
        <View style={styles.proddets}>
          {productsDetails &&
            <FlatList
              data={productsDetails}
              showsVerticalScrollIndicator={false}
              renderItem={_renderlist} 
              nestedScrollEnabled={true}
              numColumns={2}
              // nestedScrollEnabled
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
        </View> 
      </React.Fragment>
    );
})