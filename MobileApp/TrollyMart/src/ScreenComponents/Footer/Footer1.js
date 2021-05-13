import React,{useState,useEffect} from "react";
import {
  Text, View, TouchableOpacity,
} from "react-native";
import { Icon, SearchBar }              from 'react-native-elements';
import styles                           from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/FooterStyles1.js';
import AsyncStorage                     from '@react-native-async-storage/async-storage';
import axios                            from 'axios';
import { connect,
        useDispatch,
        useSelector }                   from 'react-redux';
import { getWishList } 		              from '../../redux/wishDetails/actions';
import {withCustomerToaster}            from '../../redux/AppState.js';
import { useNavigation }                from '@react-navigation/native';
import { getSearchResult,getSuggestion } 	from '../../redux/globalSearch/actions';

export const Footer =(props)=>{
  const navigation = useNavigation();
  const [cartCount,setCartCount]=useState(0);
  const dispatch = useDispatch();
  const store = useSelector(store => ({
    userDetails  : store.userDetails,
  }));
  const {userDetails} = store;

  useEffect(() => {
    getData()
  },[props]);

  const getData=()=>{
    if(userDetails.user_id){
      axios.get("/api/Carts/get/count/" + userDetails.user_id)
      .then((response) => {
        setCartCount(response.data);
      })
      .catch((error) => {
        console.log("error",error);
       })
    }
  }

    return (
      <View>
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => navigation.push('Dashboard')} >
                <Icon name="home" type="feather" size={15} color="#666" />
                <Text style={styles.footerTitle}>Home</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => navigation.navigate('CartComponent', { userId: userDetails.user_id })} >
                <Icon name="shopping-cart" type="feather" size={15} color="#666" />
                <Text style={styles.footerTitle}>My Cart</Text>
                {
                  cartCount > 0 ?
                    <Text style={styles.notificationText}>{cartCount}</Text>
                  :
                  null
                }
                
              </TouchableOpacity>
            </View>
            <View style={styles.iconOuterWrapper2}>
              <TouchableOpacity onPress={() =>{dispatch(getWishList(userDetails.user_id));navigation.navigate('WishlistComponent')}}>
                <Icon name="heart-o" type="font-awesome" size={18} color="#666" />
                <Text style={styles.footerTitle}>Wishlist</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.iconOuterWrapper2}>
              <TouchableOpacity onPress={() => navigation.navigate('MyOrder')} >
                <Icon name="shopping-bag" type="feather" size={15} color="#666" />
                <Text style={styles.footerTitle}>My Orders</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

    );
}