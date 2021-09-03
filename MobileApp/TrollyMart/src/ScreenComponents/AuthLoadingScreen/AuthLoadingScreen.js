import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import axios                      from "axios";
import AsyncStorage               from '@react-native-async-storage/async-storage';
import {getUserDetails}           from '../../redux/user/actions';
import { getCartCount } 		              from '../../redux/productList/actions';
import { connect,
        useDispatch,
        useSelector }             from 'react-redux';
import {AppContainer,
  AuthContainer,LocationContainer}        from "../../config/routes.js";
import { SET_USER_ADDRESS}        from '../../redux/location/types';
import { ActivityIndicator } from 'react-native-paper';
import {SET_NETWORK_CONNECTION} from '../../redux/netWork/types'
import NetInfo from '@react-native-community/netinfo';
import codePush               from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';

 export const AuthLoadingScreen=(props)=>{
    const [user_id,setUserId]     = useState(null);
    const [userToken,setUserToken]= useState(null);
    const [location,setLocation]  = useState(null);
    const [loading,setLoading]  = useState(true);
    const [isConncted,setConnected]= useState(true);
    const [isPreConncted,setPrevConnected]= useState(true);
    const dispatch 		            = useDispatch();


  const handleConnectivityChange = (state) => {
    console.log("state",state);
    dispatch({
      type: SET_NETWORK_CONNECTION,
      payload :state.isInternetReachable
    });
    setPrevConnected(isConncted);
    setConnected(state.isInternetReachable);
  }

    useEffect(() => {
      NetInfo.addEventListener(handleConnectivityChange);
      _bootstrapAsync();
    
      // if(!isPreConncted){
      //   codePush.restartApp();
      // }
  }, [isConncted]);

    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('token');
      const user_id   = await AsyncStorage.getItem('user_id');
      var new_loc     = JSON.parse(await AsyncStorage.getItem('location'));
      if(new_loc){
        setLocation(new_loc);
        dispatch({
          type: SET_USER_ADDRESS,
          payload:new_loc
        })
      }
      setUserId(user_id);
      setUserToken(userToken);
      setLoading(false)
      if(user_id&& userToken){
           dispatch(getUserDetails(user_id));
           dispatch(getCartCount(user_id));
          axios.defaults.headers.common['Authorization'] = 'Bearer '+ userToken;
      }
    };
    return (
        loading?
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator/>
          </View>  
        :
        user_id ?
          location ?
            <AppContainer/>
          :
          <LocationContainer/>
        :
        <AuthContainer/>
    );
}