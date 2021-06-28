import React,{useState,useEffect} from "react";
import {
  Text, View, TouchableOpacity,
} from "react-native";
import { Icon, SearchBar }                from 'react-native-elements';
import styles                             from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/FooterStyles1.js';
import AsyncStorage                       from '@react-native-async-storage/async-storage';
import axios                              from 'axios';
import { connect,
        useDispatch,
        useSelector }                     from 'react-redux';
import { getWishList } 		                from '../../redux/wishDetails/actions';
import {withCustomerToaster}              from '../../redux/AppState.js';
import { useNavigation }                  from '@react-navigation/native';
import { SET_SEARCH_CALL,
  SET_SEARCH_TEXT,
  SET_SUGGETION_LIST,
  SET_SERACH_LIST} 	          from '../../redux/globalSearch/types';
import { colors } from "../../AppDesigns/currentApp/styles/styles.js";

export const Footer =(props)=>{
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const store = useSelector(store => ({
    userDetails  : store.userDetails,
    cartCount     : store.productList.cartCount,
  }));
  const {userDetails,cartCount} = store;
  TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

    return (
      <View>
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => {
                dispatch({type : SET_SUGGETION_LIST, payload  : []});
                dispatch({type : SET_SEARCH_TEXT,    payload  : ''});
                dispatch({type : SET_SERACH_LIST,    payload  : []});
                dispatch({type : SET_SEARCH_CALL,    payload  : false});
                navigation.navigate('Dashboard')}
               } >
                <Icon name="home" type="feather" size={15} color={props.selected && props.selected === "0" ? colors.cartButton :"#aaa"}  />
                <Text style={[styles.footerTitle,{color:props.selected && props.selected === "0" ? colors.cartButton :"#aaa"}]}>Home</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => navigation.navigate('CartComponent', { userId: userDetails.user_id })} >
                <Icon name="shopping-cart" type="feather" size={15} color={props.selected && props.selected === "1" ? colors.cartButton :"#aaa"}  />
                <Text  style={[styles.footerTitle,{color:props.selected && props.selected === "1" ? colors.cartButton :"#aaa"}]}>My Cart</Text>
                {
                  cartCount > 0 ?
                    <Text style={styles.notificationText}>{cartCount}</Text>
                  :
                  null
                }
                
              </TouchableOpacity>
            </View>
            {userDetails.authService!=="guest" &&<View style={styles.iconOuterWrapper2}>
              <TouchableOpacity onPress={() =>{dispatch(getWishList(userDetails.user_id));navigation.navigate('WishlistComponent')}}>
                <Icon name="heart-o" type="font-awesome" size={18} color={props.selected && props.selected === "2" ? colors.cartButton :"#aaa"}  />
                <Text  style={[styles.footerTitle,{color:props.selected && props.selected === "2" ? colors.cartButton :"#aaa"}]}>Wishlist</Text>
              </TouchableOpacity>
            </View>}
            <View style={styles.iconOuterWrapper2}>
              <TouchableOpacity onPress={() => navigation.navigate('MyOrder')} >
                <Icon name="shopping-bag" type="feather" size={15} color={props.selected && props.selected === "3" ? colors.cartButton :"#aaa"}  />
                <Text  style={[styles.footerTitle,{color:props.selected && props.selected === "3" ? colors.cartButton :"#aaa"}]}>My Orders</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

    );
}