import React, { Component, useEffect, useState } from "react";
import {Text, View } from "react-native";
import { ScrollView, Dimensions } from 'react-native';
import axios from "axios";
import Loading from '../Loading/Loading.js';
import HTML from 'react-native-render-html';
import styles from './styles.js';
import {HeaderBar3} from "../HeaderBar3/HeaderBar3.js";
import {Footer}             from '../../ScreenComponents/Footer/Footer.js';
import { NetWorkError } from '../../../NetWorkError.js';
import { useSelector }      from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
var moment = require('moment');
import AsyncStorage                 from '@react-native-async-storage/async-storage';

export const InAppNotification =(props)=> {
    const [inAppNotifications,setInAppNotifications]=useState('');
    const [user_id,setUserId]=useState('');
    const [loading,setLoading]=useState(true);
    const store = useSelector(store => ({
        isConnected: store.netWork.isConnected
      }));
    useEffect(()=>{
        AsyncStorage.multiGet(['token', 'user_id'])
        .then((data) => {
          var token = data[0][1]
          var user_id = data[1][1]
          setUserId(user_id)
          axios.get('/api/notifications/get/allList/' + user_id)
          .then(notifications => {
              setInAppNotifications(notifications.data);
              setLoading(false)
          })
          .catch(error => {
            console.log('error', error)
          })
              
          axios.patch('/api/notifications/patch/list/Read/'+user_id)
          .then(res => {
          })
          .catch(error => {
            //   console.log('error1', error)
          })
        })
    },[])


        return (
            !store.isConnected?
            <NetWorkError />
            :
            <View style={{flex:1,backgroundColor:"#f1f1f1"}}>
                <ScrollView  contentContainerStyle={{}}  style={{flex:1}} keyboardShouldPersistTaps="handled" >
                    {/* <HeaderBar3
                        goBack={goBack}
                        headerTitle={'Notifications'}
                        navigate={navigate}
                        /> */}
                    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
                        {!loading?
                        inAppNotifications && inAppNotifications.length > 0 ?
                                inAppNotifications.map((data, index) => {
                                    return (
                                    <View style={{flexDirection:'row',marginBottom:5,borderWidth:1,borderColor:'#aaa',borderRadius:5,shadowRadius: 5,}}>
                                        <View style={[styles.packageIndex]}>
                                            <Text style={styles.dateText}>{moment(data?.createdAt).format('DD')}</Text>
                                            <Text style={{fontSize: RFPercentage(1.8),alignSelf:"center",fontFamily:"Montserrat-Regular"}}>{moment(data?.createdAt).format('MMM')}</Text>
                                        </View>
                                        <View style={{flex:.8,flexDirection:'row',borderLeftWidth:1,borderColor:'#ccc',paddingLeft:wp(4),}}>
                                            <View style={{flex: 1,fontFamily:"Montserrat-Regular"}}>
                                                <HTML  baseFontStyle={styles.htmlText1} html={data?.notifBody}  />
                                            </View>                                    
                                        </View>
                                    </View>     

                                    )
                                })
                                :
                                <View style={{ paddingHorizontal: 0, borderBottomWidth: 1, borderColor: '#eee', paddingVertical: hp(2.5) }}>
                                    <View style={{ flex: 1, paddingHorizontal: wp(5), marginTop: hp(2), alignSelf: 'center', justifyContent: 'center', alignItem: 'center' }}>
                                        <Text style={{ fontFamily: 'Montserrat-SemiBold', color: '#333', fontSize: RFPercentage(2.5) }}>You have no notifications</Text>
                                    </View>

                                </View>
                            :
                            <Loading />
                        }
                    </View>
                </ScrollView>
            </View>    
        );
}