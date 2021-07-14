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

  export const CardOnDelivery = withCustomerToaster((props)=>{
    const {navigation,route,setToast,order}=props;
    const [transactionNumber,setTransactionNumber] = useState('');
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
            <View style={{paddingVertical:15}}>
                <Input 
                    label          = "Transaction Number"
                    onChangeText    = {(e)=>setTransactionNumber(e)}
                />
            </View>  
            <View style={{paddingHorizontal:15}}> 
                <FormButton
                title       = {'Deliver'}
                  onPress     = {handleSubmit}
                background  = {true}
                // loading     = {btnLoading}
                />
            </View>
        </View>
  );
})
