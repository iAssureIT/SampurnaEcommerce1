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

import { connect,
        useDispatch,
        useSelector }             from 'react-redux';
import {AppContainer,
        LocationContainer}        from "../../config/routes.js";
import { SET_USER_ADDRESS}        from '../../redux/location/types';
import { ActivityIndicator } from 'react-native-paper';

 export const AuthLoadingScreen=(props)=>{
    const {navigation}=props;
    const [user_id,setUserId]     = useState(null);
    const [userToken,setUserToken]= useState(null);
    const [location,setLocation]  = useState(null);
    const [loading,setLoading]  = useState(true);
    const dispatch 		            = useDispatch();
    useEffect(() => {
      _bootstrapAsync();
  }, []);

    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('token');
      const user_id   = await AsyncStorage.getItem('user_id');
      var new_loc     = JSON.parse(await AsyncStorage.getItem('location'));
      console.log("new_loc",new_loc);
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
        var axios1= axios.defaults.headers.common['Authorization'] = 'Bearer '+ userToken;
        console.log("axios",axios1);
          dispatch(getUserDetails(user_id));
      }
    };
    return (
      loading?
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator/>
      </View>  
      :
      location ?
      <AppContainer/>
      :
      <LocationContainer />
    );
}