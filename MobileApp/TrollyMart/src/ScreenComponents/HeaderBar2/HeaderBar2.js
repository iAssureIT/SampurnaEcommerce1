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
    // console.log("props",props);
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
    dispatch(getSearchResult(searchText,user_id,10,true));
    Keyboard.dismiss();
  }

    return (
      <View style={styles.header2main}>
          {props?.scene?.route?.state && props?.scene?.route?.state?.index !==0  && <TouchableOpacity onPress={()=> navigation.goBack()}>
          <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center',height:40}}>
            <Icon size={25} name='arrow-left' type='material-community' color='#fff' />
          </View>
        </TouchableOpacity>}
        <View style={styles.searchvw}>
          {(globalSearch.search || globalSearch.searchList.length >0) && <Icon size={30} name='keyboard-arrow-left' type='MaterialIcons' color={"#fff"} iconStyle={{flex:0.5}} onPress={()=>  {
              dispatch({type : SET_SUGGETION_LIST, payload  : []});
              dispatch({type : SET_SEARCH_TEXT,    payload  : ''});
              dispatch({type : SET_SERACH_LIST,    payload  : []});
              dispatch({type:SET_SEARCH_CALL,payload:false});
              useSearchText('');
              Keyboard.dismiss();
          } }/>}
          <SearchBar
            placeholder         = 'Search items...'
            containerStyle      = {[styles.searchContainer,(globalSearch.search || globalSearch.searchList.length >0)?{flex:6}:{flex:65}]}
            inputContainerStyle = {styles.searchInputContainer}
            inputStyle          = {styles.searchInput}
            onChangeText        = {(searchText)=>getKeywords(searchText)}
            onFocus             = {()=>dispatch({type:SET_SEARCH_CALL,payload:true})}
            value               = {searchText}
            onSubmitEditing     = {()=>updateSearch()}
            returnKeyType       = 'search'
            onClear              ={()=>{ 
              dispatch({type : SET_SUGGETION_LIST, payload  : []});
              dispatch({type : SET_SEARCH_TEXT,    payload  : ''});
              dispatch({type : SET_SERACH_LIST,    payload  : []});
              dispatch({type:SET_SEARCH_CALL,payload:false});
              useSearchText('');
              Keyboard.dismiss();
            }}
          />
          
        </View>
          <TouchableOpacity style={styles.location} onPress={()=>navigation.navigate('LocationMain')}>
              <Icon name="map-marker" type="material-community" size={11} color={colors.black} iconStyle={{marginTop:2.5}}/>
              <Text numberOfLines={2} style={{flex:.98,color:colors.textLight,fontSize:11}}>{location?.address.addressLine2}</Text>
          </TouchableOpacity>
      </View>
    );
}
export default HeaderBars2;
