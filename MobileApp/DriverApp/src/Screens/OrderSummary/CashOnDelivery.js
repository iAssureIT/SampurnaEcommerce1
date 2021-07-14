import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,ActivityIndicator,
} from 'react-native';
import { Dropdown }             from 'react-native-material-dropdown-v2';
import { Button, Icon,Input }   from "react-native-elements";
import Modal                    from "react-native-modal";
import axios                    from "axios";
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/OrderSummaryStyles.js';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import {withCustomerToaster}    from '../../redux/AppState.js';
import { connect,
  useDispatch,
  useSelector }                 from 'react-redux';
  import commonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
  import {FormButton}           from '../../ScreenComponents/FormButton/FormButton';
import { SafeAreaView }         from 'react-native';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {FormInput}              from '../../ScreenComponents/FormInput/FormInput';
// import {AppEventsLogger} from 'react-native-fbsdk';    

  export const CashOnDelivery = withCustomerToaster((props)=>{
    const {navigation,route,setToast,order}=props;
    const [amountReceive,setAmountReceive] = useState(0);
    const [returnAmount,setReturnAmount] = useState(0);
    useEffect(() => {
        
  }, [props]);


  const amountPaid = (e) =>{
    console.log("e",e);
    setAmountReceive(e);
    var returnAmount = e - order.vendorOrders[0].vendor_afterDiscountTotal;
    setReturnAmount(returnAmount);
  }

    return (
        <View style={{}}>
            <View style={{flexDirection:"row",paddingTop:15,justifyContent:'space-between'}}>
                <View style={{flex:0.5}}>
                    <Text style={CommonStyles.label}>Amount Receivable</Text>
                </View>
                <View style={{flex:0.5,alignItems:'center'}}>
                    <Text style={CommonStyles.label}>AED 46</Text>
                   
                </View>        
            </View>
            <View style={{flexDirection:"row",justifyContent:'space-between',paddingTop:15}}>
                <View style={{flex:0.5}}>
                    <Text style={CommonStyles.text}>Amount Paid</Text>
                    <Input 
                         keyboardType    = "numeric"
                         onChangeText    = {(e)=>amountPaid(e)}
                    />
                </View>
                <View style={{flex:0.5,alignItems:'center'}}>
                    <Text style={CommonStyles.text}>Return Amount</Text>
                    <Text style={[CommonStyles.headerTextx  ,{marginTop:15}]}>{returnAmount}</Text>
                </View>        
            </View>
            <View style={{paddingHorizontal:15}}> 
                <FormButton
                title       = {'Deliver'}
                //   onPress     = {handleSubmit}
                background  = {true}
                // loading     = {btnLoading}
                />
            </View>
        </View>
  );
})
