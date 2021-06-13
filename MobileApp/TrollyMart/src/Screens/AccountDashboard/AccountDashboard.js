
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

// export default class AccountDashboard extends React.Component{
export const AccountDashboard =(props)=>{
  const {navigation}=props;
  const [loading,setLoading]=useState(true);
  const [user_id,setUserId]=useState('');
  const [fullName,setFullName]= useState('');
  const [email,setEmail]= useState('');
  const [dAddress,setAddress]= useState('');
  const [mobNumber,setMobNumber]= useState('');
  const [profileImage,setProfileImage]= useState('');
  const [companyID,setCompanyID]= useState('');
  const isFocused = useIsFocused();
  useEffect(() => {
    getData();
  },[props,isFocused]);
  
  const getData=()=>{
    AsyncStorage.multiGet(['token', 'user_id'])
    .then((data) => {
      console.log("data",data);
      setUserId(data[1][1]);
      axios.get('/api/ecommusers/'+data[1][1])
      .then((res) => {
        console.log("res",res);
        var dAddress = res.data.deliveryAddress.length>0 ? res.data.deliveryAddress[0].addressLine1+", "+res.data.deliveryAddress[0].addressLine2 : null;
        // setDetails(res);
        setFullName(res.data.profile.fullName);
        setEmail(res.data.profile.email);
        setAddress(dAddress);
        setMobNumber(res.data.profile.mobile);
        setProfileImage(res.data.image);
        setCompanyID(res.data.companyID);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error",error);
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
      <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'Account Dashboard'}
          navigate={navigation.navigate}
      />
      <View style={styles.acdashsuperparent}>
      {loading?
        <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
          <Loading/>
        </View>   
          :
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={styles.acdashparent}>
              <View style={styles.accuserinfo}>
                <View style={styles.padhr15}>
                <Text style={styles.acccontactinfo}>User Information</Text>
                </View>
                  <View style={styles.padhr18}> 
                  
                  <View style={styles.accusermobinfo}>
                    <Text style={styles.accusermob}>Your Name</Text>
                    <Text style={{flex:0.05}}>: </Text>
                    <Text style={styles.accmobnumber}>{fullName}</Text>
                  </View>
                </View>
                  <View style={styles.padhr18}> 
                  <View style={styles.accusermobinfo}>
                    <Text style={styles.accusermob}>Your Address</Text>
                    <Text style={{flex:0.05}}>: </Text>
                    <Text style={styles.accmobnumber}>{dAddress?dAddress:"NA"} </Text> 
                  </View>
                </View>
                <View style={styles.padhr18}>
                <View style={styles.accusermobinfo}>
                  <Text style={styles.accusermob}>Mobile</Text>
                  <Text style={{flex:0.05}}>: </Text>
                  <Text style={styles.accmobnumber}>{mobNumber?mobNumber :"NA"}</Text>
                </View>
                </View>
                <View style={styles.padhr18}>
                <View style={styles.accusermobinfo}>
                  <Text style={styles.accusermob}>Email Id</Text>
                  <Text style={{flex:0.05}}>: </Text>
                  <Text style={styles.accmobnumber}>{email ? email :"NA"}</Text>
                </View>
                </View>
                <View style={styles.acceditbtn}>
                  <View style={styles.acceditbtns}>
                    <TouchableOpacity>
                      <Button
                      onPress={()=>navigation.navigate('AccountInformation')}
                      title={"EDIT Profile"}
                      buttonStyle={styles.button1}
                      titleStyle={styles.buttonTextEDIT}
                      containerStyle={styles.buttonContainerEDIT}
                      />
                  </TouchableOpacity>
                  </View>
                  <View style={styles.acceditbtns}>
                    <TouchableOpacity>
                      <Button
                      onPress={()=>navigation.navigate('ResetPwd')}
                      title={"Reset Password"}
                      buttonStyle={styles.button1}
                      titleStyle={styles.buttonTextEDIT}
                      containerStyle={styles.buttonContainerEDIT}
                      />
                  </TouchableOpacity>
                  </View>
                </View> 
            </View>
            </View>
          </ScrollView>}
            <Footer/>
        </View>
      </React.Fragment>
    );  
}



