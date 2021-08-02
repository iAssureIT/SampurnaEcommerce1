
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,ActivityIndicator,
} from 'react-native';
import {Icon,Button}    from "react-native-elements";
import axios              from "axios";
import styles             from '../../AppDesigns/currentApp/styles/ScreenStyles/Addressstyles.js';
import { colors }         from '../../AppDesigns/currentApp/styles/styles.js';
import AsyncStorage       from '@react-native-async-storage/async-storage';

import { connect,useDispatch,useSelector }from 'react-redux';
import { useIsFocused }   from '@react-navigation/native';
import {setToast, 
  withCustomerToaster}     from '../../redux/AppState.js';
  import { SET_USER_ADDRESS} from '../../redux/location/types';
import CommonStyles       from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {FormButton}       from '../../ScreenComponents/FormButton/FormButton';
import ActionButton       from 'react-native-action-button';
import SearchSuggetion    from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';


  export const AddressDefaultComp = withCustomerToaster((props)=>{
    const {setToast,navigation,route} = props; 
    const isFocused = useIsFocused();
    const [isChecked,setIsChecked] = useState(false);
    const [deliveryAddress,setDeliveryAddress]  = useState([]);
    const [addressid,setAddressId]  = useState('');
    const [adddata,setAddData]  = useState('');
    const [selectedindex,setSelectedIndex]  = useState(-1);
    const [user_id,setUserId] = useState('');
    const dispatch = useDispatch();
    const {delivery,disabled}=route.params;
    const store = useSelector(store => ({
      location : store.location,
      globalSearch: store.globalSearch
    }));
    
    useEffect(() => {
      getAddressList();
      setSelectedIndex(-1)
    },[props]); 
  
  const getAddressList=()=>{
    AsyncStorage.multiGet(['token', 'user_id'])
    .then((data) => {
      console.log("data[1][1]",data[1][1]);
      setUserId(data[1][1]);
      
      var formValues = {
        "user_id" : data[1][1],
        "latitude"      : store.location?.address?.latlong?.lat,
        "longitude"     : store.location?.address?.latlong?.lng,
      }
      console.log("formValues",formValues);
      axios.post('/api/ecommusers/myaddresses',formValues)
        .then((response) => {
          console.log("response",response);
          if (response.data.deliveryAddress.length > 0) {
            var deliveryAddress = response.data.deliveryAddress;
            setDeliveryAddress(deliveryAddress);
          }else{
            navigation.navigate('AddressComponent',{"delivery":delivery})
          }
        })
        .catch((error) => {
          console.log("error",error);
          if (error.response.status == 401) {
            AsyncStorage.removeItem('user_id');
            AsyncStorage.removeItem('token');
            setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
            navigation.navigate('Auth')
          }else{
            setToast({text: 'Something went wrong.', color: 'red'});
          }  
        })
    });
  }

 
  const deleteAdress=(deliveryAddressID)=>{
    var formValues = {
      user_ID: user_id,
      deliveryAddressID: deliveryAddressID
    }
    axios.patch('/api/ecommusers/delete/address', formValues)
      .then((response) => {
        Alert.alert(
          "Address Deleted",
          "",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
        getAddressList();
      })
      .catch((error) => {
        console.log("error",error);
        if (error.response.status == 401) {
          AsyncStorage.removeItem('user_id');
          AsyncStorage.removeItem('token');
          setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
          navigation.navigate('Auth')
        }else{
          setToast({text: 'Something went wrong.', color: 'red'});
        }  
      })
  }

  // handleDelete = (id) => {
  //   Alert.alert("", "Are you sure you want to delete ?", [
  //     { text: "Cancel" },
  //     {
  //       text: "Delete",
  //       onPress: () => {
  //         this.deleteCompetitor(id);
  //       }
  //     },
  //   ]);
  // };
  const selectedaddress=(index,id,adddata)=>{
    var selectedindex = index;
    setIsChecked(!isChecked);
    setAddressId(id);
    setAddData(adddata);
    setSelectedIndex(selectedindex);
    console.log("adddata",adddata);
    var address = {
      'addressLine1'      : adddata.addressLine1,
      'addressLine2'      : adddata.addressLine2,
      'area'              : adddata.area,
      'city'              : adddata.city,
      'state'             : adddata.state,
      'country'           : adddata.country,
      'pincode'           : adddata.pincode,
      'latlong'           : {
        "lat"               : adddata.latitude,
        "lng"               : adddata.longitude
      }
    }
    console.log("address",address);
      AsyncStorage.setItem('location',JSON.stringify(address));
      dispatch({
          type: SET_USER_ADDRESS,
          payload:address
      })
  }

  console.log("addressid",addressid);
    return (
      <React.Fragment>
        {
        store.globalSearch.search ?
            <SearchSuggetion />
        :
        <View style={styles.addsuperparent}>
          <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
            <View style={{flexDirection:'row',paddingVertical:24,paddingHorizontal:20}}>
              <View style={{flex:0.6}}>
                <Text style={CommonStyles.screenHeader}>My Address</Text>
              </View>
              <View style={{flex:0.6,alignItems:'flex-end'}}>
                <Button
                  buttonStyle={styles.addBtnClass}
                  onPress={()=> navigation.navigate('AddressComponent',{"delivery":delivery})}
                  icon={<View style={styles.addBtnClass}>
                    <Image source={require("../../AppDesigns/currentApp/images/addressNew.png")} style={styles.addBtnImg} />
                  </View>}
                />
              </View>
              
              {/* {!disabled && <ActionButton 
                buttonColor="#fff" 
                style={{marginTop:9,marginRight:-20,padding:0}} 
                // icon={<Icon name="plus-circle-outline" type="material-community" size={30} iconStyle={{elevation:5}} color={colors.cartButton}/>}
                icon={<View style={styles.addBtnClass}>
                  <Image source={require("../../AppDesigns/currentApp/images/addressNew.png")} style={styles.addBtnImg} />
                </View>}
                onPress={()=> navigation.navigate('AddressComponent',{"delivery":delivery})}
              />} */}
            </View>            
            <View style={styles.padhr15}>
              {deliveryAddress ?
                deliveryAddress.length > 0 ?
                deliveryAddress.map((item, i) => {
                  return (
                    <View key={i} 
                    style={[(
                      selectedindex === i ?
                          styles.addcmpchkbxslect
                      :
                          styles.addcmpchkbx
                      )]}>
                    {disabled || item.distance<=1 ?
                      <TouchableOpacity onPress={() => {selectedaddress(i,item._id,item)}} >
                        <View style={{height:24,backgroundColor:colors.cartButton,borderTopLeftRadius:9,borderTopRightRadius:9,flexDirection:"row",justifyContent:'space-between',alignItems:'center',paddingHorizontal:15,borderWidth:2,borderColor:colors.cartButton}}>
                            {/* <Icon name="home" type="material-community" size={10} iconStyle={{elevation:5}} color={colors.white}/> */}
                            <Image
                              resizeMode="contain"
                              source={require("../../AppDesigns/currentApp/images/home_white.png")}
                              style={{height:15,width:15}}
                            />
                            <View style={{flexDirection:'row'}}>
                            {!disabled&&<Icon name="edit" type="font-awesome-5" size={15} iconStyle={{elevation:5,paddingHorizontal:5}} color={"#bbb"}  onPress={()=> navigation.navigate('AddressComponent',{"delivery":delivery,"address":item})}/>}
                            {!disabled&&<Icon name="delete" type="AntDesign" size={15} iconStyle={{elevation:5}} color={"#bbb"}  onPress={() => deleteAdress(item._id)}/>} 
                            </View>  
                        </View>  
                        <View style={styles.addchkbx}>
                          <View style={[styles.nameofcontact]}>
                            <Text style={CommonStyles.label}> {item.name}</Text>
                          </View>
                          <View style={styles.chkvw}>
                          </View>
                        </View>
                        <View style={styles.padhr18}>
                          <Text style={CommonStyles.text}>{item.addressLine1+", "+item.addressLine2}</Text>
                          <View style={styles.mobflx}>
                            <Text style={CommonStyles.text}>Mobile : </Text>
                            <Text style={CommonStyles.text}>{item.mobileNumber}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      :
                      <View style={{borderRadius:15}} >
                         <View style={{height:24,backgroundColor:"#B7B7B7",borderTopLeftRadius:9,borderTopRightRadius:9,flexDirection:"row",justifyContent:'space-between',alignItems:'center',paddingHorizontal:15}}>
                            <Icon name="home" type="material-community" size={10} iconStyle={{elevation:5}} color={colors.textLight}/>
                            {!disabled&&<Icon name="delete" type="AntDesign" size={10} iconStyle={{elevation:5}} color={colors.textLight}  onPress={() => deleteAdress(item._id)}/>}
                        </View>
                        <View style={styles.addchkbx}>
                          <View style={[styles.nameofcontact]}> 
                            <Text style={CommonStyles.label}> {item.name}</Text>
                          </View>
                          <View style={styles.chkvw}>
                          </View>
                        </View>
                        <View style={styles.padhr18}>
                          <Text style={CommonStyles.text}>{item.addressLine1+", "+item.addressLine2}</Text>
                          <View style={styles.mobflx}>
                            <Text style={CommonStyles.text}>Mobile : </Text>
                            <Text style={CommonStyles.text}>{"+"+item.isdCode} {item.mobileNumber}</Text>
                          </View>
                        </View>
                      </View>
                    }
                    </View>
                  )
                })
                :
                <View style={styles.addcmpchkbx}>
                  <View style={styles.addchkbx}>
                    <Text style={styles.addnotfound}>Address Not Found:</Text>
                  </View>
                </View>
              :
                <View style={styles.addcmpchkbx}>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View>
              }
              {delivery && <View style={styles.continuebtn}>
                    <FormButton
                      onPress={() => navigation.navigate('OrderSummary', { addData: adddata, user_id: user_id })}
                      title={"CONTINUE"}
                      disabled={selectedindex===-1?true:false}
                    />
              </View>}
                {disabled && <View style={styles.continuebtn}>
                 <FormButton
                    onPress={() => navigation.navigate('App')}
                    title={"CONTINUE"}
                    disabled={selectedindex===-1?true:false}
                  />
              </View>}
            </View>
          </ScrollView>
        </View>}

        
      </React.Fragment>
    );
})



