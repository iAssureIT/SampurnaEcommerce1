
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import axios                    from "axios";
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import AsyncStorage             from '@react-native-async-storage/async-storage';
import { useIsFocused }         from "@react-navigation/native";
import { useSelector }          from 'react-redux';
import moment                   from 'moment';
import { withCustomerToaster }  from '../../redux/AppState.js';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { ActivityIndicator }    from 'react-native-paper';
import SearchSuggetion          from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { NetWorkError } from '../../../NetWorkError.js';
import { colors } from '../../AppDesigns/currentApp/styles/styles';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const RewardsPoint =withCustomerToaster((props)=>{
  const {navigation,setToast}=props;
  const [loading,setLoading]=useState(true);
  const isFocused = useIsFocused();
  const [user_id,setUserId]=useState();
  const [creditPoints,setCreditPoints] =useState();
  useEffect(() => {
    getData();
  },[props,isFocused]);

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    globalSearch    : store.globalSearch
  }));
  console.log("preferences",store.preferences);
  const {currency}=store.preferences;
  
  const getData=()=>{
    setLoading(true);
    AsyncStorage.multiGet(['token', 'user_id'])
    .then((data) => {
      setUserId(data[1][1]);
      setLoading(false);
      axios.get('/api/creditpoints/get/'+data[1][1])
      .then((res) => {
            console.log("res",res)
            setCreditPoints(res.data);
      })
      .catch((error) => {
        console.log("error",error)
        setLoading(false);
        if (error.response.status == 401) {
          setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
          AsyncStorage.removeItem('user_id');
          AsyncStorage.removeItem('token');
          navigation.navigate('Auth');
        }else{
          setToast({text: 'Something went wrong.', color: 'red'});
        }  
      })
    });
  }
   

  return (
    <React.Fragment>
      {loading?
        <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
          <ActivityIndicator/>
        </View>   
          :
          store.globalSearch.search ?
              <SearchSuggetion />
          :
          <ScrollView contentContainerStyle={[styles.container]} style={{flex:1,backgroundColor:"#fff"}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} >
            <View style={{paddingVertical:24,paddingHorizontal:20}}>
              <Text style={CommonStyles.screenHeader}>My Credit Points</Text>
            </View>
            {creditPoints&&<View style={styles.acdashparent}>
                <View style={[styles.cardCredit,{paddingTop:0}]}>
                  <View style={{flexDirection:'row',flex:1}}>
                    <View style={{flex:0.5}}>
                     <Text style={[styles.headerText1]}>Total Points </Text> 
                    </View> 
                    <View style={{flex:0.5}}>
                      <Text style={[styles.headerText1,{fontFamily:"Montserrat-Bold",alignSelf:"flex-end"}]}>{creditPoints.totalPoints ? creditPoints?.totalPoints?.toFixed(2) : 0} Points</Text>                    
                      </View>
                  </View>
                  <View style={{flexDirection:'row',flex:1}}>
                    <View style={{flex:0.5}}>
                      <Text style={[styles.headerText2]}>Current Balance</Text>
                    </View> 
                    <View style={{flex:0.5}}>
                    <Text style={[styles.headerText2,{fontFamily:"Montserrat-Bold",alignSelf:"flex-end"}]}>{creditPoints.totalPointsValue ? creditPoints.totalPointsValue : 0+" "} {currency}</Text>
                     </View>
                  </View>
                </View>
                <View style={{borderWidth:0.3,width:280,borderColor:"#ddd",alignSelf:'center'}} />
                {creditPoints.transactions && creditPoints.transactions.length > 0 ?
                creditPoints.transactions.map((item,index)=>{
                  if(item!==null){
                    return(
                        <View style={[,styles.cardCredit]}> 
                            <View style={styles.accusermobinfo}>
                              <View style={{flex:.3}}>
                                <Text style={[styles.accusermob,{fontSize:RFPercentage(1.8),fontFamily:"Montserrat-Medium",color:'#000'}]}>{moment(item.transactionDate).format('MM/DD/YYYY')}</Text>
                              </View> 
                              <View style={{flex:.5,paddingHorizontal:5}}>
                               <Text style={[styles.accusermob,{fontSize:RFPercentage(1.8),color:'#000',fontFamily:"Montserrat-Medium"}]}>{item.typeOfTransaction ? item.typeOfTransaction:""}</Text>
                                <Text style={[styles.accusermob,{fontSize:RFPercentage(1.7)}]}>{item.orderID ? "#"+item.orderID:""}</Text>
                                <Text style={[styles.accusermob,{fontSize:RFPercentage(1.7)}]}>{moment(item.expiryDate).format('DD/MM/YYYY')} Expiry</Text>
                              </View>  
                              <View style={{flex:.2,justifyContent:'center'}}>
                                <Text style={[styles.accusermob,{alignSelf:"flex-end",color:Math.sign(item?.earnedPoints) === 1 ? colors.success:colors.danger,fontSize:RFPercentage(2.2),fontFamily:"Montserrat-Medium"}]}>{Math.sign(item?.earnedPoints) === 1 && <Text>+</Text>}{Math.sign(item?.earnedPoints).toFixed(2)}</Text>
                                </View>   
                            </View>
                            <View style={{borderWidth:0.3,width:280,borderColor:"#ddd",marginTop:hp(2),alignSelf:'center'}} />
                        </View>
                    )
                  }
                })
                    
                :
                <View style={{alignSelf:'center',height:350,justifyContent:'center'}}>
                  <Text style={styles.noPointsText}>Sorry Your Credit Points is 0</Text>
                </View>
            }
            </View>}
          </ScrollView>}
      </React.Fragment>
    );  
})



