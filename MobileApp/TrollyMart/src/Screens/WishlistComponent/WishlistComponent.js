import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {  Icon,Button}          from "react-native-elements";
import Modal                    from "react-native-modal";
import {HeaderBar3}               from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                   from '../../ScreenComponents/Footer/Footer1.js';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/Wishliststyles.js';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import axios                    from 'axios';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import AsyncStorage             from '@react-native-async-storage/async-storage';
;
import {withCustomerToaster}    from '../../redux/AppState.js';
import { connect,useDispatch,useSelector }  from 'react-redux';
import {ProductList}            from'../../ScreenComponents/ProductList/ProductList.js';

export const WishlistComponent  = withCustomerToaster((props)=>{
  const {navigation}=props;
  const store = useSelector(store => ({
    searchText  : store.searchText,
    productList : store.productList,
    wishList    : store.wishDetails.wishList
  }));
  const {searchText,productList,wishList} = store;
  console.log("store WishlistComponent",wishList);
  const [isOpen,setOpen] = useState(false);
  const [productImage,setProductImage] = useState([]);
  const [addtocart,setAddToCart] = useState(false);
  const [alreadyincarts,setAlreadyInCarts] = useState(false);
  const [loading,setLoading] = useState(false);
  const [products,setProducts] = useState([]);
  const [user_id,setUserId] = useState('');
  const [removefromwishlist,setRemoveFromWishList] = useState(false);
  

  const closemodal =()=>{
    setAddToCart(false)
  }

  const closemodalwishlist=()=>{
    setRemoveFromWishList(false)
  }

  const removefromwishlist_func = (id)=> {
    console.log("ididid", id);
    axios.delete('/api/wishlist/delete/' + id)
      .then((response) => {
        console.log("response",response);
        getWishlistData();
        setRemoveFromWishList(true);
        setProducts([])
      })
      .catch((error) => {
        console.log("error",error);
        navigation.navigate('App')
        setToast({text: 'Something went wrong.', color: 'red'});
      })
  }

  const addToCart = (wishlist_ID,product_ID)=> {
    const formValues = {
      "user_ID": this.state.user_id,
      "product_ID": product_ID,
      "quantity": 1,
    }
    axios
      .post('/api/Carts/post', formValues)
      .then((response) => {
        axios.delete('/api/wishlist/delete/' + wishlist_ID)
        .then((response) => {
          getWishlistData();
          setAddToCart(true);
          setProducts([]);
        })
        .catch((error) => {
          console.log("error",error);
          navigation.navigate('App')
          setToast({text: 'Something went wrong.', color: 'red'});
        })
      })
      .catch((error) => {
        setAlreadyInCarts(true)
        navigation.navigate('App')
        setToast({text: 'Something went wrong.', color: 'red'});
      })
  }

  const toggle = ()=>{
    let isOpen = !this.state.isOpen;
    setOpen(isOpen);
  }
    return (
      <React.Fragment>
        <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'My Wishlist'}
          navigate={navigation.navigate}
          openControlPanel={() =>openControlPanel()}
        />
        <View style={styles.addsuperparent}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <View style={{marginTop:15}}>
                  {!loading ?
                    wishList && wishList.length > 0 ?
                      <ProductList navigate = {navigation.navigate} newProducts={wishList}  userId={user_id} categories={[]}/>
                    :
                    <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
                      <Image
                        source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
                      />
                      <Button
                          onPress={() => navigation.navigate('Dashboard')}
                          // title={"Click Here To Continue Shopping"}
                          title={"Add Products"}
                          buttonStyle={styles.buttonshopping}
                          containerStyle={styles.continueshopping}
                      /> 
                    </View>
                    :
                    <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                      <ActivityIndicator size="large" color={colors.theme}/>
                    </View>
                }
                </View>
            </View>
          </ScrollView>
          <Footer />
        </View>
      </React.Fragment>
    );
})