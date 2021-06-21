import React,{useState,useEffect} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Keyboard
}                                 from "react-native";
import {Linking}                  from 'react-native'
import { 
  Header, 
  Icon,
  SearchBar,
  Button 
} from 'react-native-elements';
import axios                from 'axios'; 
import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/HeaderBar2Styles.js';
import {useDispatch,useSelector }      from 'react-redux';
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import { getSearchResult,getSuggestion } 	from '../../redux/globalSearch/actions';
import { SET_SEARCH_CALL,
      SET_SUGGETION_LIST,
      SET_SEARCH_TEXT,
      SET_SERACH_LIST
    } 	from '../../redux/globalSearch/types';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation }      from '@react-navigation/native';

  const HeaderBars2=(props)=>{
    console.log("props",props);
    const [searchText,useSearchText] = useState('');
    const [inAppNotificationsCount,setInAppNotifyCount] = useState(0);
    const [user_id,setUserId] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [list,setList]=useState([])

    const store = useSelector(store => ({
      globalSearch  : store.globalSearch,
      location      : store.location,
      cartCount     : store.productList.cartCount,
    }));
    const {globalSearch,location,cartCount} = store;
   
    useEffect(() => {
      getData()
    },[props]);

    
 
  const getData=()=>{
    useSearchText(globalSearch.searchText);
    getNotificationList();
  }

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

  const getKeywords = (searchText) => {
    useSearchText(searchText);
    if(!globalSearch.search){
      dispatch({type:SET_SEARCH_CALL,payload:true})
    }
    if(searchText && searchText.length >= 2){
      dispatch(getSuggestion({"searchText":searchText}));
    }else if(searchText===""){
      dispatch({type : SET_SUGGETION_LIST, payload  : []});
      dispatch({type : SET_SEARCH_TEXT,    payload  : ''})
      dispatch({type : SET_SERACH_LIST,    payload  : []})
    }
  };

  const updateSearch = () =>{
    useSearchText(searchText);
    dispatch({type:SET_SEARCH_CALL,payload:false});
    dispatch(getSearchResult(searchText,user_id,10));
    Keyboard.dismiss();
  }

    return (
      <View style={styles.header2main}>
        <Header
          statusBarProps={{ barStyle: 'light-content' }}
          backgroundColor={colors.theme}
          placement="left"
          leftContainerStyle={styles.leftside}
          centerContainerStyle={styles.center}
          rightContainerStyle={styles.rightside}
          leftComponent={
            <View style={styles.flxdir}>
                {props.backBtn ?
                  <TouchableOpacity onPress={()=> navigation.goBack()}>
                  <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                    <Icon size={30} name='keyboard-arrow-left' type='MaterialIcons' color='#fff' />
                  </View>
                </TouchableOpacity>
                :
                <TouchableOpacity  onPress={()=> navigation.dispatch(DrawerActions.toggleDrawer())}>
                  <Icon size={25} name='bars' type='font-awesome' color={colors.white} />
                </TouchableOpacity>
              }
            </View>
            
          }
          centerComponent={
              props.headerTitle && props.headerTitle!=="" ?
                <View style={{width:200}}>
                  <Text style={[{fontSize:18,color:'#fff',fontFamily:"Montserrat-SemiBold",textAlign:'center',alignSelf:'center'}]}>{props.headerTitle}</Text>
                </View>  
                :
                <Image
                  resizeMode="contain"
                  source={require("../../AppDesigns/currentApp/images/Logo.png")}
                  style={styles.whitename}
                />
          }
          rightComponent={
              <View style={styles.notificationbell}>
               <TouchableOpacity style={styles.bellIcon} onPress={()=> navigation.navigate('InAppNotification')}>
                <Icon name="bell-o" type="font-awesome"    size={25} color={colors.white} />
                <Text style={styles.notificationText}>{inAppNotificationsCount}</Text>
               </TouchableOpacity> 
                {/* <TouchableOpacity onPress={()=>{Linking.openURL('tel:+91 90280 79487');}} style={{marginLeft:20,justiafyContent:"flex-end"}}>
                  <Icon name="phone" type="font-awesome"  size={25} color={colors.white} />
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => navigation.navigate('CartComponent', { userId: userDetails.user_id })}  style={{marginLeft:20,justiafyContent:"flex-end"}}>
                <Icon name="shopping-cart" type="feather" size={25} color={colors.white} />
                <Text style={styles.footerTitle}>My Cart</Text>
                {
                  cartCount > 0 ?
                    <Text style={styles.notificationText}>{cartCount}</Text>
                  :
                  null
                }
              </TouchableOpacity> */}

                {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate('Stores')}>
                  <Icon size={25} name="store"  type="font-awesome-5" color=colors.theme />
                </TouchableOpacity> */}
              </View>
          }
          containerStyle={styles.container}
        />
        <View style={styles.searchvw}>
          {(globalSearch.search || globalSearch.searchList.length >0) && <Icon size={30} name='keyboard-arrow-left' type='MaterialIcons' color={"#fff"} onPress={()=>  {
              dispatch({type : SET_SUGGETION_LIST, payload  : []});
              dispatch({type : SET_SEARCH_TEXT,    payload  : ''});
              dispatch({type : SET_SERACH_LIST,    payload  : []});
              dispatch({type:SET_SEARCH_CALL,payload:false});
              useSearchText('');
              Keyboard.dismiss();
          } }/>}
          <SearchBar
            placeholder         = 'Search for Product, Brands and More'
            containerStyle      = {[styles.searchContainer,(globalSearch.search || globalSearch.searchList.length >0)?styles.flex09:styles.flex1]}
            inputContainerStyle = {styles.searchInputContainer}
            inputStyle          = {styles.searchInput}
            onChangeText        = {(searchText)=>getKeywords(searchText)}
            onFocus             = {()=>dispatch({type:SET_SEARCH_CALL,payload:true})}
            value               = {searchText}
            onSubmitEditing     = {()=>updateSearch()}
            returnKeyType       = 'search'
          />
          
        </View>
          <TouchableOpacity style={styles.location} onPress={()=>navigation.navigate('LocationMain')}>
              <Icon name="crosshairs-gps" type="material-community" size={20} color={colors.black} iconStyle={{}}/>
              <Text numberOfLines={1} style={{flex:.98,color:colors.black}}>{location?.address.addressLine2}</Text>
          </TouchableOpacity>
      </View>
    );
}
export default HeaderBars2;
