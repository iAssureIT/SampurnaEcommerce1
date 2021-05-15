import React,{useState,useEffect} from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    Text
}                       from 'react-native';
import axios            from "axios";
import AsyncStorage     from '@react-native-async-storage/async-storage';
import {getUserDetails} from '../../redux/user/actions';

import { connect,
        useDispatch,
        useSelector }   from 'react-redux';
import { request,
        check,
        PERMISSIONS,
        RESULTS }       from 'react-native-permissions';
import {AppContainer} from "../../config/routes.js";
import { AuthContext }  from "../../config/authContext";
import Geolocation from 'react-native-geolocation-service';
import { SET_USER_ADDRESS}          from '../../redux/location/types';

 export const AuthLoadingScreen=(props)=>{
    const {navigation}=props;
    const [isLoading,setLoading]=useState(true);
    const [user_id,setUserId]= useState(null);
    const [userToken,setUserToken]= useState(null);
    const [location,setLocation]= useState(null);
    const dispatch 		= useDispatch();
    useEffect(() => {
      _bootstrapAsync();
  }, []);

    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('token');
      const user_id = await AsyncStorage.getItem('user_id');
      var new_loc = JSON.parse(await AsyncStorage.getItem('location'));
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
      <AppContainer location={location}/>
    );
}