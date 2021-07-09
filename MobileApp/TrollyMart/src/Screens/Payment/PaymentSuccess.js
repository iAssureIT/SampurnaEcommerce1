
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button,Card}       from "react-native-elements";
import axios            from "axios";
import {Menu}           from '../../ScreenComponents/Menu/Menu.js';
import {HeaderBar3}     from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}         from '../../ScreenComponents/Footer/Footer.js';
import styles           from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import {colors}         from '../../AppDesigns/currentApp/styles/styles.js';
import Loading          from '../../ScreenComponents/Loading/Loading.js';
import AsyncStorage     from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { useSelector }        from 'react-redux';
import moment      from 'moment';
import { withCustomerToaster } from '../../redux/AppState.js';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { ActivityIndicator } from 'react-native-paper';
// export default class AccountDashboard extends React.Component{
export const RewardsPoint =withCustomerToaster((props)=>{
  const {navigation,setToast}=props;
  const [loading,setLoading]=useState(true);
  const isFocused = useIsFocused();
  const [user_id,setUserId]=useState();
  const [creditPoints,setCreditPoints] =useState();
  useEffect(() => {
    getData();
  },[props]);

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
  }));
  const {currency}=store.preferences;
  
  const getData=()=>{
    setLoading(true);
    AsyncStorage.multiGet(['token', 'user_id'])
    .then((data) => {
      setUserId(data[1][1]);
      setLoading(false);
      axios.get('/api/creditpoints/get/'+data[1][1])
      .then((res) => {
            // console.log("res",res)
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
      <View style={styles.acdashsuperparent}>
      {loading?
        <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
          <ActivityIndicator/>
        </View>   
          :
          <ScrollView contentContainerStyle={[styles.container]} keyboardShouldPersistTaps="handled" >
            <View style={{paddingHorizontal:15,paddingTop:15}}>
            <Text style={[styles.creditTitle]}>My Credit Points</Text>
            </View>
            {creditPoints&&<View style={styles.acdashparent}>
              <View style={[styles.accuserinfo]}>
                <View style={[styles.padhr15,styles.cardCredit,{paddingBottom:10}]}>
                  <View style={{flex:.5}}>
                    <Text style={[styles.headerText1]}>Total Credit Points </Text>                    
                  </View>
                  <View style={{flex:.5}}>
                    <Text style={[styles.headerText1],{fontWeight:'bold',alignSelf:"flex-end"}}>{creditPoints.totalPoints} Points</Text>                    
                  </View>                
                  <Text style={[styles.headerText2]}>Current Balance :  {creditPoints.totalPoinsValue} {currency}</Text>
                </View>
                {creditPoints.transactions && creditPoints.transactions.length > 0 ?
                creditPoints.transactions.map((item,index)=>{
                  if(item!==null){
                    return(
                        <View style={[styles.padhr18,styles.cardCredit,{flex:1}]}> 
                            <View style={styles.accusermobinfo}>
                            <View style={{flex:.3}}>
                                <Text style={[styles.accusermob,{fontSize:12,fontFamily:"Montserrat-Regular",color:'#000'}]}>{moment(item.orderDate).format('MM-DD-YYYY')}</Text>
                              </View> 
                              <View style={{flex:.5,paddingHorizontal:5}}>
                               <Text style={[styles.accusermob,{fontSize:12,color:'#000',fontWeight:'bold'}]}>{item.typeOfTransaction ? item.typeOfTransaction:""}</Text>
                                <Text style={[styles.accusermob,{fontSize:11}]}>{item.orderID ? item.orderID:""}</Text>
                                <Text style={[styles.accusermob,{fontSize:11}]}>{moment(item.expiryDate).format('MM-DD-YYYY')}</Text>
                              </View>  
                              <View style={{flex:.2}}>
                                <Text style={[styles.accusermob,{alignSelf:"flex-end",color:'#3E9D5E',fontSize:16,fontWeight:'bold'}]}><Text>+</Text> {item.earnedPoints}</Text>
                                </View>   
                            </View>
                        </View>
                    )
                  }
                })
                    
                :
                []
            }
            </View>
            </View>}
          </ScrollView>}
           
        </View>
      </React.Fragment>
    );  
})