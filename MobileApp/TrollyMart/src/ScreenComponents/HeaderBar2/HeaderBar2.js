import React,{useState,useEffect,useFocusEffect,useRef} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  Alert,
  BackHandler
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
import Modal                      from "react-native-modal";
import { useNavigation }      from '@react-navigation/native';
import { getCartCount} from '../../redux/productList/actions';

  const HeaderBars2=(props)=>{
    // console.log("props",props);
    const [searchText,useSearchText] = useState('');
    const [inAppNotificationsCount,setInAppNotifyCount] = useState(0);
    const [user_id,setUserId] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [list,setList]=useState([]);
    const [modal,setModal]=useState(false);
    const input = useRef();
    const store = useSelector(store => ({
      globalSearch  : store.globalSearch,
      location      : store.location,
      cartCount     : store.productList.cartCount,
    }));
    const {globalSearch,location,cartCount} = store;
   
    useEffect(() => {
      getData();
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    },[globalSearch?.searchText]);


    const backAction = () => {
      console.log("globalSearch?.searchText",globalSearch?.searchText);
      if(globalSearch?.searchText!==""){
        dispatch({type:SET_SEARCH_CALL,payload:false})
        dispatch({type : SET_SUGGETION_LIST, payload  : []});
        dispatch({type : SET_SEARCH_TEXT,    payload  : ''})
        dispatch({type : SET_SERACH_LIST,    payload  : []});
        useSearchText('');
        input.current.blur();
      }  
      return false
    };

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
    console.log("searchText",searchText);
    useSearchText(searchText);
    if(!globalSearch.search){
      dispatch({type:SET_SEARCH_CALL,payload:true})
    }
    if(searchText && searchText.length >= 2){
      dispatch(getSuggestion({"searchText":searchText}));
    }else if(searchText===""){
      dispatch({type:SET_SEARCH_CALL,payload:false})
      dispatch({type : SET_SUGGETION_LIST, payload  : []});
      dispatch({type : SET_SEARCH_TEXT,    payload  : ''})
      dispatch({type : SET_SERACH_LIST,    payload  : []})
    }
  };

  const updateSearch = () =>{
    dispatch({type : SET_SERACH_LIST,    payload  : []})
    dispatch({type:SET_SEARCH_CALL,payload:false});
    dispatch({type:SET_SEARCH_TEXT,payload:''});
    dispatch(getSearchResult(searchText,user_id,10,true));
    navigation.navigate('SearchList',{"type":'Search',"limit":10})
    Keyboard.dismiss();
  }

  const checkCart=()=>{
    if(cartCount > 0){
      setModal(true)
    }else{
      navigation.push('LocationMain')
    }
  }

  const deleteCart=()=>{
    axios.delete('/api/carts/delete/'+user_id)
    .then(res=>{
      setModal(false);
      console.log("res",res);
      dispatch(getCartCount(user_id));
      navigation.push('LocationMain')
    })
    .catch(err=>{
      console.log("err",err);
    })
  }

  console.log()

    return (
      <View style={styles.header2main}>
          {props.backBtn && <TouchableOpacity onPress={()=> navigation.goBack()}>
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
            ref={input}
            placeholder         = 'Search items...'
            containerStyle      = {[styles.searchContainer,(globalSearch.search || globalSearch.searchList.length >0)?{flex:6}:{flex:65}]}
            inputContainerStyle = {styles.searchInputContainer}
            inputStyle          = {styles.searchInput}
            onChangeText        = {(searchText)=>getKeywords(searchText)}
            // onFocus             = {()=>dispatch({type:SET_SEARCH_CALL,payload:true})}
            value               = {searchText}
            onSubmitEditing     = {()=>updateSearch()}
            returnKeyType       = 'search'
            searchIcon          = {<Icon name="search" type="font-awesome" size={15} color={"#000"}/>}
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
          <TouchableOpacity style={styles.location} onPress={()=>checkCart()}>
              <Icon name="crosshairs-gps" type="material-community" size={11} color={colors.black} iconStyle={{marginTop:2.5}}/>
              <Text numberOfLines={2} style={{flex:.98,color:colors.textLight,fontSize:11}}>{location?.address.addressLine2}</Text>
          </TouchableOpacity>
          <Modal isVisible={modal}
        onBackdropPress={() => setModal(false)}
        onRequestClose={() => setModal(false)}
        onDismiss={() =>  setModal(false)}
        coverScreen={true}
        // transparent
        // hideModalContentWhileAnimating={true}
        style={{ paddingHorizontal: '5%', zIndex: 999 }}
        animationInTiming={1} animationOutTiming={1}>
        <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
          {/* <View style={{ justifyContent: 'center', backgroundColor: "transparent", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
            <Icon size={50} name='exclamation-triangle' type='font-awesome' color={colors.warning} style={{}} />
          </View> */}
          <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
            You have added products in cart. If you change the location, cart will get empty.
          </Text>
          <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
          Still you want to change the location?
          </Text>
          <View style={styles.cancelbtn}>
            <View style={styles.cancelvwbtn}>
              <TouchableOpacity>
                <Button
                  onPress={() => setModal(false)}
                  titleStyle={styles.buttonText}
                  title="NO"
                  buttonStyle={styles.buttonRED}
                  containerStyle={styles.buttonContainer2}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.ordervwbtn}>
                <Button
                  onPress={() => {deleteCart()}}
                  titleStyle={styles.buttonText1}
                  title="Yes"
                  buttonStyle={styles.button1}
                  containerStyle={styles.buttonContainer2}
                />
            </View>
          </View>
        </View>
      </Modal>
      </View>
    );
}
export default HeaderBars2;
