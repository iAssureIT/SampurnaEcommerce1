import React,{useState,useEffect} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image
}                                 from "react-native";
import {Linking}                  from 'react-native'
import { 
  Header, 
  Icon,
  SearchBar,
  Button 
} from 'react-native-elements';
import ValidationComponent  from "react-native-form-validator";
import axios                from 'axios'; 
import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/HeaderBar2Styles.js';
import { connect,useDispatch,useSelector }      from 'react-redux';
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage         from '@react-native-async-storage/async-storage';
import { getSearchResult,getSuggestion } 	from '../../redux/globalSearch/actions';
import { SET_SEARCH_CALL,SET_SUGGETION_LIST} 	from '../../redux/globalSearch/types';
// import {Autocomplete}       from  'react-native-autocomplete-input';
  const HeaderBars2=(props)=>{
    const [searchText,useSearchText] = useState('');
    const [inAppNotificationsCount,setInAppNotifyCount] = useState(0);
    const [user_id,setUserId] = useState('');
    const dispatch = useDispatch();
    const [list,setList]=useState([])
    const{navigation}=props;

    const store = useSelector(store => ({
      globalSearch    : store.globalSearch,
    }));
    const {globalSearch} = store;
   
    useEffect(() => {
      console.log("useEffect");
      getData()
    },[]);

    
 
  const getData=()=>{
    useSearchText(globalSearch.searchText);
    getNotificationList();
  }

  const getNotificationList=()=>{
    AsyncStorage.multiGet(['token', 'user_id'])
      .then((data) => {
        console.log("data",data);
          var token = data[0][1];
          var user_id = data[1][1];
          setUserId(user_id);
          if(user_id){
          console.log("Header user_id",user_id);
            axios.get('/api/notifications/get/list/Unread/' + user_id)
            .then(notifications => {
              console.log("notifications",notifications);
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
    var payload={"searchText":searchText}
    console.log("payload",payload);
    if(searchText && searchText.length >= 2){
      dispatch(getSuggestion(payload));
    }else if(searchText===""){
      dispatch({
        type     : SET_SUGGETION_LIST,
        payload  : []
      });
      // dispatch({type:SET_SEARCH_CALL,payload:false})
      dispatch(getSearchResult(searchText,user_id))
    }
  };

  const updateSearch = (searchText) =>{
    console.log("calling");
    useSearchText(searchText);
    var payload={"searchText":searchText}
    console.log("payload",payload);
    dispatch({type:SET_SEARCH_CALL,payload:false})
    dispatch(getSearchResult(searchText,user_id))
  }

    return (
      <View style={styles.header2main}>
        <Header
          backgroundColor={'transparent'}
          placement="left"
          leftContainerStyle={styles.leftside}
          centerContainerStyle={styles.center}
          rightContainerStyle={styles.rightside}
          leftComponent={
            <View style={styles.flxdir}>
              <View style={{ marginTop: 10,}}>
                <TouchableOpacity  onPress={()=> navigation.toggleDrawer()}>
                  <Icon size={25} name='bars' type='font-awesome' color={colors.theme} />
                </TouchableOpacity>
              </View>
            </View>
          }
          centerComponent={
            <View style={styles.flxdircenter}>
              <Image
                resizeMode="contain"
                source={require("../../AppDesigns/currentApp/images/Logo.png")}
                style={styles.whitename}
              />
            </View>
          }
          rightComponent={
              <View style={styles.notificationbell}>
               <TouchableOpacity style={styles.bellIcon} onPress={()=> navigation.navigate('InAppNotification')}>
                <Icon name="bell-o" type="font-awesome"    size={25} color={colors.theme} />
                <Text style={styles.notificationText}>{inAppNotificationsCount}</Text>
               </TouchableOpacity> 
                <TouchableOpacity onPress={()=>{Linking.openURL('tel:+91 90280 79487');}} style={{marginLeft:20,justiafyContent:"flex-end"}}>
                  <Icon name="phone" type="font-awesome"    size={25} color={colors.theme} />
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate('Stores')}>
                  <Icon size={25} name="store"  type="font-awesome-5" color=colors.theme />
                </TouchableOpacity> */}
              </View>
          }
          containerStyle={styles.rightcnt}
        />
        <View style={styles.searchvw}>
          <SearchBar
            placeholder         = 'Search for Product, Brands and More'
            containerStyle      = {styles.searchContainer}
            inputContainerStyle = {styles.searchInputContainer}
            inputStyle          = {styles.searchInput}
            onChangeText        = {(searchText)=>getKeywords(searchText)}
            onFocus             = {()=>dispatch({type:SET_SEARCH_CALL,payload:true})}
            value               = {searchText}
            onSubmitEditing     = {(searchText)=>updateSearch(searchText)}
            returnKeyType       = 'search'
          />
        </View>

      </View>
    );
}
export default HeaderBars2;
