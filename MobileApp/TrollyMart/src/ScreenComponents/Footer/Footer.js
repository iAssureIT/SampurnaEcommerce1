import React,{useState,useEffect} from "react";
import {
  Text, View, TouchableOpacity,Image
} from "react-native";
import { Icon }                   from 'react-native-elements';
import styles                     from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/FooterStyles.js';
import AsyncStorage               from '@react-native-async-storage/async-storage';
import axios                      from 'axios';
import { connect,
        useDispatch,
        useSelector }             from 'react-redux';
import { getWishList } 		        from '../../redux/wishDetails/actions';
import { useNavigation }          from '@react-navigation/native';
import { SET_SEARCH_CALL,
  SET_SEARCH_TEXT,
  SET_SUGGETION_LIST,
  SET_SERACH_LIST} 	              from '../../redux/globalSearch/types';
import { colors }                 from "../../AppDesigns/currentApp/styles/styles.js";
import { ImageBackground } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign"

export const Footer =(props)=>{
  const navigation = useNavigation();
  // console.log("props",props);
  const dispatch = useDispatch();
  const [inAppNotificationsCount,setInAppNotifyCount] = useState(0);
  const store = useSelector(store => ({
    userDetails  : store.userDetails,
    cartCount     : store.productList.cartCount,
  }));

  const getNotificationList=()=>{
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
          var token = data[0][1];
          var user_id = data[1][1];
          setUserId(user_id);
          if(user_id){
            axios.get('/api/notifications/get/list/Unread/' + user_id)
            .then(notifications => {
                setInAppNotifyCount(notifications.data.length)
            })
            .catch(error => {
                console.log('error', error)
            })
          }
      });
  }

  const {userDetails,cartCount} = store;
  TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
  // console.log("props?.state?.index",props?.state?.index);
    return (
        <ImageBackground source={require("../../AppDesigns/currentApp/images/Footer.png")} style={styles.footer}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => {
                dispatch({type : SET_SUGGETION_LIST, payload  : []});
                dispatch({type : SET_SEARCH_TEXT,    payload  : ''});
                dispatch({type : SET_SERACH_LIST,    payload  : []});
                dispatch({type : SET_SEARCH_CALL,    payload  : false});
                navigation.navigate('Dashboard')}
               } >
                <Icon name={props?.state?.index === 0 ? "home":"home-outline"} type="material-community" size={20} color={props?.state?.index === 0 ? colors.footerText :colors.theme}  />
                <Text style={[styles.footerTitle,{color:props?.state?.index === 0 ? colors.footerText :colors.theme}]}>Home</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => navigation.navigate('MyAccount', { userId: userDetails.user_id })} >
                <Icon name={props?.state?.index === 1 ? "account":"account-outline"} type="material-community" size={20} color={props?.state?.index === 1 ? colors.footerText :colors.theme}  />
                <Text  style={[styles.footerTitle,{color:props?.state?.index === 1 ? colors.footerText :colors.theme}]}>My Account</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.iconOuterWrapper]} >
              <TouchableOpacity  
                 style={{
                  // position: 'absolute',
                  // bottom: 0, // space from bottombar
                  // height: 70,
                  // width: 70,
                  // borderRadius: 100,
                  // backgroundColor: colors.footerColor,
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  // // elevation:5,
                  // borderWidth:5,
                  // // borderRightWidth:1,
                  justifyContent:'center',
                  alignItems:'center',
                  borderColor:"#eee"
                }}
                  onPress={() => navigation.navigate('CartComponent', { userId: userDetails.user_id })} >
                 {/* <Icon name="shopping-cart" type="feather" size={25} color={props?.state?.index === 2 ? colors.footerText :colors.theme}  /> */}
                 <Image source={require("../../AppDesigns/currentApp/images/cart.png")} style={{height:25,width:25}} />
                 <Text  style={[styles.footerTitle,{color:props?.state?.index === 2 ? colors.footerText :colors.theme}]}>My Cart</Text>
                {
                  cartCount > 0 ?
                    <Text style={styles.notificationText}>{cartCount}</Text>
                  :
                  null
                } 
              </TouchableOpacity>
              
            </View>
            {userDetails.authService!=="guest" &&<View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() =>{dispatch(getWishList(userDetails.user_id));navigation.navigate('WishlistComponent')}}>
                <Icon name={props?.state?.index === 3 ? "heart":"heart-outline"} type="material-community" size={20} color={props?.state?.index === 3 ? colors.footerText :colors.theme}  />
                <Text  style={[styles.footerTitle,{color:props?.state?.index === 3 ? colors.footerText :colors.theme}]}>Wishlist</Text>
              </TouchableOpacity>
            </View>}
             <View style={styles.iconOuterWrapper}>
              <TouchableOpacity onPress={() => navigation.navigate('InAppNotification')} >
                <Icon name={props?.state?.index === 4 ? "bell":"bell-outline"} type="material-community" size={20} color={props?.state?.index === 4 ? colors.footerText :colors.theme}  />
                <Text  style={[styles.footerTitle,{color:props?.state?.index === 4 ? colors.footerText :colors.theme}]}>Notification</Text>
                {inAppNotificationsCount >0 &&<Text style={styles.notificationText}>{inAppNotificationsCount}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
    );
}