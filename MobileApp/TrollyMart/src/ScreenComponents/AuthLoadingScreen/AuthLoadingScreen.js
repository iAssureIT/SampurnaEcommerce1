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


 export const AuthLoadingScreen=(props)=>{
    const {navigation}=props;
    const [isLoading,setLoading]=useState(true);
    const [user_id,setUserId]= useState(null);
    const [userToken,setUserToken]= useState(null);
    const dispatch 		= useDispatch();
    useEffect(() => {
      _bootstrapAsync();
  }, []);

    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('token');
      const user_id = await AsyncStorage.getItem('user_id');
      console.log("user_id",user_id);
      console.log("userToken",userToken);
      setUserId(user_id);
      setUserToken(userToken);
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
            console.log("result",result);
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log('This feature is not available (on this device / in this context)');
              break;
            case RESULTS.DENIED:
              console.log('The permission has not been requested / is denied but requestable');
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              console.log('The permission is denied and not requestable anymore');
              break;
            }
          })
          .catch(error => {
            console.log("error=>",error);
          });
          setLoading(false)
          
        if(user_id&& userToken){
          var axios1= axios.defaults.headers.common['Authorization'] = 'Bearer '+ userToken;
          console.log("axios",axios1);
            dispatch(getUserDetails(user_id));
        }
    };

    return (
      <AppContainer />
    );
}