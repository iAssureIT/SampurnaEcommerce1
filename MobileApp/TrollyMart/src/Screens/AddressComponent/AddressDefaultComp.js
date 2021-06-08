
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,ActivityIndicator
} from 'react-native';
// import { RadioButton } from 'react-native-paper';
import { Button, Icon}    from "react-native-elements";
import axios              from "axios";
import {HeaderBar3}         from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}             from '../../ScreenComponents/Footer/Footer1.js';
import styles             from '../../AppDesigns/currentApp/styles/ScreenStyles/Addressstyles.js';
import { colors }         from '../../AppDesigns/currentApp/styles/styles.js';
import Loading            from '../../ScreenComponents/Loading/Loading.js';
import AsyncStorage       from '@react-native-async-storage/async-storage';

import { connect,useDispatch,useSelector }      from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {setToast, 
  withCustomerToaster}        from '../../redux/AppState.js';
  import { SET_USER_ADDRESS}          from '../../redux/location/types';
// export default class AddressDefaultComp extends React.Component {
  export const AddressDefaultComp = withCustomerToaster((props)=>{
    const {setToast,navigation,route} = props; 
    const isFocused = useIsFocused();
    const [isChecked,setIsChecked] = useState(false);
    const [checked,setChecked]     = useState('first');
    const [deliveryAddress,setDeliveryAddress]  = useState([]);
    const [addressid,setAddressId]  = useState('');
    const [adddata,setAddData]  = useState('');
    const [selectedindex,setSelectedIndex]  = useState(-1);
    const [user_id,setUserId] = useState('');
    const dispatch = useDispatch();
    const {delivery,disabled}=route.params;
    const store = useSelector(store => ({
      location : store.location,
    }));
    
    useEffect(() => {
      getAddressList()
    },[props,isFocused]); 
  
   

    console.log("store",store)
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
      axios.get('/api/ecommusers/myaddresses',formValues)
        .then((response) => {
          console.log("response",response);
          if (response.data.deliveryAddress.length > 0) {
            var deliveryAddress = response.data.deliveryAddress;
            setDeliveryAddress(deliveryAddress);
          } else {
            navigation.navigate('AddressComponent',{'delivery':delivery});
            setDeliveryAddress([]);
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
    axios.patch('/api/users/delete/address', formValues)
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
      'area'              : adddata.area,
      'city'              : adddata.city,
      'state'             : adddata.state,
      'country'           : adddata.country,
      'pincode'           : adddata.pincode,
      'latlong'           : {
        "lat" : adddata.lat,
        "lng" : adddata.lng
      }
    }
      AsyncStorage.setItem('location',JSON.stringify(address));
      dispatch({
          type: SET_USER_ADDRESS,
          payload:address
      })
  }

  console.log("addressid",addressid);
    return (
      <React.Fragment>
        <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={delivery ? 'Delivery Addresses' : 'My Addresses'}
          navigate={navigation.navigate}
        />
        <View style={styles.addsuperparent}>
          <ScrollView contentContainerStyle={styles.container} style={{marginBottom:50}} keyboardShouldPersistTaps="handled" >
            <View style={styles.padhr15}>
               <View style={styles.addcmpbtn}>
               {!disabled &&<Button
                    onPress={() => navigation.navigate('AddressComponent',{"delivery":delivery})}
                    title={"ADD NEW ADDRESS"}
                    buttonStyle={styles.button1}
                    containerStyle={styles.buttonContainer1}
                    titleStyle={styles.buttonTextEDIT}
                  />}
              </View>
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
                    <TouchableOpacity onPress={() => {selectedaddress(i,item._id,item) }} >
                        <View style={styles.addchkbx}>
                          <View style={styles.nameofcontact}>
                            <Text style={styles.addname}> {item.name}</Text>
                          </View>
                          <View style={styles.chkvw}>
                          </View>
                          <View style={styles.proddeletes}>
                            {!disabled&&<Icon
                              onPress={() => deleteAdress(item._id)}
                              name="delete"
                              type="AntDesign"
                              size={18}
                              color="#ff4444"
                              iconStyle={styles.iconstyle}
                            />}
                          </View>
                        </View>
                        <View style={styles.padhr18}>
                          <Text style={styles.address}>{item.addressLine1+", "+item.addressLine2}</Text>
                          <View style={styles.mobflx}>
                            <Text style={styles.mobileno}>Mobile:</Text>
                            <Text style={styles.mobilenum}>{item.mobileNumber}</Text>
                          </View>
                        </View>

                    </TouchableOpacity>
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
                {
                  addressid!=='' ?
                    <TouchableOpacity >
                      <Button
                        onPress={() => navigation.navigate('OrderSummary', { addData: adddata, user_id: user_id })}
                        title={"CONTINUE"}
                        buttonStyle={styles.button1}
                        containerStyle={styles.buttonContainer1}
                        titleStyle={styles.buttonTextEDIT}
                      />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity >
                      <Button
                        title={"CONTINUE"}
                        buttonStyle={styles.buttondis}
                        containerStyle={styles.buttonContainer1}
                        titleStyle={styles.buttonTextEDIT}
                      />
                    </TouchableOpacity>
                }
              </View>}
                {disabled && <View style={styles.continuebtn}>
                {
                  addressid!=='' ?
                    <TouchableOpacity >
                      <Button
                        onPress={() => navigation.navigate('App')}
                        title={"CONTINUE"}
                        buttonStyle={styles.button1}
                        containerStyle={styles.buttonContainer1}
                        titleStyle={styles.buttonTextEDIT}
                      />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity >
                      <Button
                        title={"CONTINUE"}
                        buttonStyle={styles.buttondis}
                        containerStyle={styles.buttonContainer1}
                        titleStyle={styles.buttonTextEDIT}
                      />
                    </TouchableOpacity>
                }
              </View>}
            </View>
          </ScrollView>
          {!disabled &&<Footer />}
        </View>
      </React.Fragment>
    );
})



