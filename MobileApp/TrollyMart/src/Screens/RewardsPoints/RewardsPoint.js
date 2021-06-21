
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button,}     from "react-native-elements";
import axios          from "axios";
import {Menu}         from '../../ScreenComponents/Menu/Menu.js';
import {HeaderBar3}     from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}       from '../../ScreenComponents/Footer/Footer1.js';
import styles         from '../../AppDesigns/currentApp/styles/ScreenStyles/AccountDashboardstyles';
import {colors}       from '../../AppDesigns/currentApp/styles/styles.js';
import Loading        from '../../ScreenComponents/Loading/Loading.js';
import AsyncStorage   from '@react-native-async-storage/async-storage';
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
            console.log("res",res)
            setCreditPoints(res.data);
      })
      .catch((error) => {
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
      {/* <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'Account Dashboard'}
          navigate={navigation.navigate}
      /> */}
      <View style={styles.acdashsuperparent}>
      {loading?
        <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
          <ActivityIndicator/>
        </View>   
          :
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            {creditPoints&&<View style={styles.acdashparent}>
              <View style={styles.accuserinfo}>
                <View style={[styles.padhr15,{backgroundColor:colors.cartButton}]}>
                  <Text style={[CommonStyles.headerText,{color:"#fff"}]}>Total Points :  {creditPoints.totalPoints}</Text>
                </View>
                <View style={[styles.padhr18,{flex:1}]}> 
                    <View style={styles.accusermobinfo}>
                      <View style={{flex:.25}}>
                        <Text style={[CommonStyles.label]}>Order ID</Text>
                      </View>  
                      <View style={{flex:.25}}>
                        <Text style={[CommonStyles.label]}>Start Date</Text>
                      </View>   
                      <View style={{flex:.25}}>
                        <Text style={[CommonStyles.label]}>End Date</Text>
                      </View>    
                      <View style={{flex:.25}}>
                        <Text style={[CommonStyles.label,{alignSelf:"flex-end"}]}>Points</Text>
                        </View>   
                    </View>
                </View>
                {creditPoints.transactions && creditPoints.transactions.length > 0 ?
                creditPoints.transactions.map((item,index)=>{
                    return(
                        <View style={[styles.padhr18,{flex:1}]}> 
                            <View style={styles.accusermobinfo}>
                              <View style={{flex:.25}}>
                                <Text style={[styles.accusermob]}>{item.orderID}</Text>
                              </View>  
                              <View style={{flex:.25}}>
                                <Text style={[styles.accusermob]}>{moment(item.orderDate).format('MM-DD-YYYY')}</Text>
                              </View>   
                              <View style={{flex:.25}}>
                                <Text style={[styles.accusermob]}>{moment(item.orderDate).format('MM-DD-YYYY')}</Text>
                              </View>    
                              <View style={{flex:.25}}>
                                <Text style={[styles.accusermob,{alignSelf:"flex-end"}]}>{item.earnedPoints}</Text>
                                </View>   
                            </View>
                        </View>
                    )
                })
                    
                :
                []
            }
            </View>
            </View>}
          </ScrollView>}
            <Footer/>
        </View>
      </React.Fragment>
    );  
})



