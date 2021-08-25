import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,ActivityIndicator,
  Linking
} from 'react-native';
import { Button, Icon,Input }   from "react-native-elements";
import Modal                    from "react-native-modal";
import axios                    from "axios";
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/OrderSummaryStyles.js';
import {withCustomerToaster}    from '../../redux/AppState.js';
import { connect,
  useDispatch,
  useSelector }                 from 'react-redux';
import {FormButton}           from '../../ScreenComponents/FormButton/FormButton';
import moment from 'moment';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {Formik}                 from 'formik';
import * as Yup                 from 'yup';
import { FormInput } from '../../ScreenComponents/FormInput/FormInput.js';
import {colors}                         from '../../AppDesigns/currentApp/styles/styles.js';

// import {AppEventsLogger} from 'react-native-fbsdk';    

const ValidationSchema = Yup.object().shape({
  transactionNumber: Yup.string().required('This field is required'),
});


  export const OrderSummary = withCustomerToaster((props)=>{
    const {navigation,route,setToast}=props;
    const [loading,setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [order, setOrder] = useState('');
    const [paymentMethod,setPaymentMethod] =useState('');
    const dispatch = useDispatch();
    console.log("route.params",route.params);
    const {order_id,vendor_id}=route.params;
    useEffect(() => {
      getorders(order_id,vendor_id);;
  }, [props]);

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    userDetails     : store.userDetails
  }));
  const {currency}=store.preferences;

  const getorders=(order_id,vendor_id)=>{
    var formValues  = {
      "order_id"      : order_id,
      "vendor_id"     : vendor_id
  }
  console.log("formValues",formValues);
    axios.post('/api/orders/get/single/vendor_order',formValues)
    .then((response) => {
      console.log("rushi response",response);
      setOrder(response.data);
      setLoading(false);
      setPaymentMethod(response.data.paymentDetails.paymentMethod);
    })
    .catch((error) => {
      console.log("error",error);
      setLoading(false);
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

  return (
    <React.Fragment>
       <Formik
        onSubmit={(values,fun) => {
          setLoading(true);
          let {transactionNumber} = values;
          var formValues  = {
            "order_id"          : order._id,
            "vendor_id"         : order.vendorOrders[0].vendor_id,
            "user_id"           : store.userDetails.user_id,    
            "paymentDetails"    : { 
                "modeOfPayment"     : paymentMethod,
                "amountPaid"        : order.vendorOrders[0].vendor_netPayableAmount,
                "currency"          : "AED",
                "deliveryPerson_id" : store.userDetails.user_id,
                "transactionNumber" : transactionNumber
            }
          }          
          console.log("formValues",formValues);
          if(amountPaid === ''){
            axios.patch('/api/orders/deliver/vendor_order',formValues)
          .then(res=>{
            console.log("res",res)
            setLoading(false);
                setToast({text:res.data.message,color:'green'})
              navigation.navigate('RunningOrders')
          })
          .catch()
          }else{
            setToast({text:'Please enter Amount Paid.',color:'red'});
          }
          
        }}
        validationSchema={paymentMethod === "Card On Delivery" ? ValidationSchema :null}
        initialValues={{
          transactionNumber : '',
        }}
        enableReinitialize
        >
        {(formProps) => (
          <FormBody
            btnLoading={btnLoading}
            navigation={navigation}
            dispatch={dispatch}
            loading={loading}
            setLoading={setLoading}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            order={order}
            currency={currency}
            {...formProps}
          />
        )}
      </Formik>
    </React.Fragment>
  );
  })

  const FormBody = (props) => {
    const {
      handleChange,
      handleSubmit,
      errors,
      touched,
      btnLoading,
      setFieldValue,
      setLoading,
      loading,
      navigation,
      dispatch,
      values,
      order,
      paymentMethod,
      setPaymentMethod,
      currency,
    } = props;

    const [amountReceive,setAmountReceive] = useState(0);
    const [returnAmount,setReturnAmount] = useState(0);


  const amountPaid = (e) =>{
    console.log("parseInt(e)",isNaN(e));
    setAmountReceive(e);
    var totalAmt= order.vendorOrders[0].vendor_netPayableAmount;
    if(e!==""){
      if(e > totalAmt || e === totalAmt){
        var returnAmount =e - totalAmt;
        setReturnAmount(returnAmount);
      }else{
        setToast({text: 'Received amount is not enough.', color: 'red'});
      }
      
    }else{
      setReturnAmount(0);
    }
  }

  console.log("order",order);

  if(loading){
    return <ActivityIndicator />
  }else{
    return (
      <View style={{flex:1}}>
          <ScrollView style={{backgroundColor:"#fff"}}>
            {/* <View style={{flexDirection:"row",justifyContent:'center',paddingVertical:15 }}>
              <Text>Order Details for #{order.orderID}</Text>
            </View>   */}
            <View style={{margin:20,minHeight:100}}>
                <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>
                  <Text style={styles.boxLine1B}>Order No: {order.orderID}</Text>
                  <Text style={styles.boxLine1B}>Date: {moment(order.createdAt).format('DD-MM-YYYY hh:mm')}</Text>
                </View> 
                <View style={{justifyContent:'space-between',marginTop:10}}>
                  <Text style={styles.boxLine2B}>Vendor: <Text style={styles.boxLine2_AnsB}>{order?.vendorOrders[0]?.vendorName}</Text></Text>
                  <Text style={styles.boxLine2B}>Deliver To: <Text style={styles.boxLine2_AnsB}>{order?.deliveryAddress?.name}, </Text>
                  <Text style={{fontFamily:"Montserrat-Regular",textDecorationLine: 'underline',color:colors.cartButton}} onPress={() => Linking.openURL(`tel:${order?.deliveryAddress?.mobileNumber}`)}>{order?.deliveryAddress?.mobileNumber!=="undefined" ? order?.deliveryAddress?.mobileNumber :""}</Text></Text>
                  <Text style={styles.boxLine2B}>Delivery Addrees: <Text style={styles.boxLine2_AnsB}>{order?.deliveryAddress?.addressLine1+", "+order?.deliveryAddress?.addressLine2}</Text></Text>
                </View>
                <View style={{flexDirection:'row',flex:1,marginTop:15}}>
                    <View style={{flex:0.65}}>
                      <Text style={styles.tableHeader}>Product Name</Text>
                    </View>
                    <View style={{flexDirection:'row',flex:0.35}}>
                      <View style={{flex:0.4}}>
                        <Text style={[styles.tableHeader,{textAlign:'right'}]}>Qty</Text>
                      </View>
                      <View style={{flex:0.6}}>
                        <Text style={[styles.tableHeader,{textAlign:'right'}]}>Amount</Text>
                      </View>
                    </View>
                </View>
                {order?.vendorOrders && order?.vendorOrders?.length>0 && order?.vendorOrders[0]?.products.map((item,index)=>{
                    return(
                      <View key={index} style={{marginTop:10}}>
                        <View key={index} style={styles.proddetails}>
                          <View style={styles.flxdir}>
                            <View style={[styles.flxpd]}>
                              <View style={{flex:0.3,justifyContent:'center'}}>
                                {item.productImage.length > 0 ?
                                  <Image
                                    style={styles.imgwdht}
                                    source={{ uri: item.productImage[0] }}
                                  />
                                  :
                                  <Image
                                    style={styles.imgwdht}
                                    source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                                  />
                                }
                              </View>
                              <View style={{flex:0.65,justifyContent:'center'}}>
                                <Text style={styles.productname}>{item.productName}</Text>
                                {/* {item.productNameRlang ?
                                  <Text style={{fontFamily:'aps_dev_priyanka',fontSize:13,flexWrap:'wrap'}}>{item.productNameRlang}</Text>
                                  : 
                                  <Text style={styles.productname}>{item.productName}</Text>
                                } */}
                              </View>
                            </View>
                            <View style={styles.flxmg}>
                                {/* {item.productNameRlang ?
                                <Text style={{fontFamily:'aps_dev_priyanka',fontWeight:'Bold',fontSize:20,flexWrap:'wrap'}}>{item.productNameRlang}</Text>
                                : 
                                <Text style={styles.productname}>{item.productName}</Text>
                                } */}
                                <View style={{flex:0.4,alignItems:"center",justifyContent:'center'}}>
                                    <Text style={[styles.productname]}>{item.quantity}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                    </Text>
                                </View>
                                <View style={{flex:0.6,alignItems:'flex-end',justifyContent:'center'}}>
                                  {/* <View style={[styles.flxdir]}>
                                    <Text style={styles.ogprice}>{currency} </Text>
                                  </View> */}
                                  <Text style={styles.productname}> {(item.discountedPrice * item.quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                  </Text>                                
                                </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    )
                  })}
                  <View style={[styles.flxdata,{paddingVertical:25,marginTop:15}]}>
                  <View style={{ flex: 0.6 }}>
                    <Text style={styles.totaldata}>Total Amount</Text>
                  </View> 
                  <View style={{ flex: 0.35 }}>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totaldata}>{currency} {order.vendorOrders[0]?.vendor_netPayableAmount?.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>  
            </View> 
            {order?.vendorOrders[0]?.orderStatus === "On the Way" && <View style={{borderRadius:4,backgroundColor:'#E5EAEE',minHeight:100,padding:15,marginBottom:20}}>
              {(paymentMethod === "Cash On Delivery" ||paymentMethod === "Card On Delivery") && <View style={[styles.tabWrap]}>
                <TouchableOpacity
                  onPress = {()=>{setPaymentMethod('Cash On Delivery')}}
                  style={[(paymentMethod === "Cash On Delivery" ? styles.activeTabView:styles.tabView),styles.tabBorder,styles.borderRadiusLeft]}
                >
                    <Text style={paymentMethod === "Cash On Delivery" ? styles.tabText : styles.tabText1}>Cash On Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress = {()=>{setPaymentMethod("Card On Delivery")}}
                  style={[(paymentMethod === "Card On Delivery" ? styles.activeTabView:styles.tabView),styles.borderRadiusRight]}
                >
                  <Text style={paymentMethod === "Card On Delivery" ? styles.tabText : styles.tabText1}>Card On Delivery</Text>
                </TouchableOpacity>
              </View>}
              <View style={{flexDirection:"row",paddingTop:15,justifyContent:'space-between'}}>
                <View style={{flex:0.6}}>
                    <Text style={styles.deliveryText1}>Amount Receivable</Text>
                </View>
                <View style={{flex:0.4,flexDirection:"row",alignItems:'center'}}>
                    <View style={{flex:0.5}}>
                      <Text style={styles.deliveryText2}>AED &nbsp;&nbsp; : </Text>
                    </View>
                    <View style={{flex:0.5,justifyContent: 'flex-end'}}>
                      <Text style={[styles.deliveryText2,{alignSelf:'flex-end'}]}>{order.vendorOrders[0]?.vendor_netPayableAmount?.toFixed(2)}</Text>                
                    </View>            
                </View>        
             </View>
              {
                paymentMethod === "Cash On Delivery" ?
                <View style={{flex:1,justifyContent:'space-between',paddingTop:30}}>
                  <View style={{flex:1,flexDirection:"row"}}>
                    <View style={{flex:0.8}}>
                      <Text style={styles.deliveryText1}>Amount Paid</Text>
                    </View>
                    <View style={{flex:0.2}}>
                      <Input 
                            keyboardType    = "numeric"
                            inputContainerStyle= {styles.containerStyle1}
                            inputStyle = {styles.inputAmount}
                            onChangeText    = {(e)=>amountPaid(e)}
                        />
                    </View>                      
                  </View>
                  <View style={{flex:1,flexDirection:"row",alignItems:'center'}}>
                    <View style={{flex:0.76}}>
                      <Text style={styles.deliveryText1}>Return Amount </Text>
                    </View>
                    <View style={{flex:0.24,flexDirection:"row"}}>
                      <Text style={[styles.deliveryText2,{flex:0.2}]}>:</Text>
                      <Text style={[styles.inputAmount,{flex:0.8,textAlign:'right'}]}>{returnAmount.toFixed(2)}</Text>
                    </View>               
                  </View>        
              </View>
                :
                paymentMethod === "Card On Delivery" ?
                <View style={{flex:1,flexDirection:"row",marginTop:15}}>
                  <View style={{flex:0.5}}>
                    <Text style={styles.deliveryText1}>Authorization Code</Text>
                  </View>
                  <View style={{flex:0.5}}>
                    <FormInput 
                        // label          = "Transaction Number"
                        onChangeText    = {handleChange('transactionNumber')}
                        // required        = {true}
                        name            = "transactionNumber"
                        errors          = {errors}
                        touched         = {touched}
                        // iconName        = {'email'}
                        iconType        = {'material-community'}
                        autoCapitalize  = "none"
                        keyboardType    = "email-address"
                        inputContainerStyle = {styles.containerStyle23}
                        inputStyle          = {styles.inputAmount}
                        value           = {values.transactionNumber}
                    />
                  </View>
                </View>               
                :
                null
              }
                <View style={{paddingHorizontal:15,marginHorizontal:25,marginTop:30}}> 
                  <FormButton
                    title       = {'Deliver'} 
                    titleStyle      = {styles.btnText}                  
                    onPress     = {handleSubmit}
                    background  = {true} 
                  // loading     = {btnLoading}
                  />
              </View>
            </View> }
            {order.vendorOrders[0].orderStatus === "Delivered" &&
              <View>
                <View style={{flexDirection:'row',justifyContent:'center',marginBottom:15}}>
                  <Text style={CommonStyles.completeBlueTextB}>Paid by {order.vendorOrders[0].paymentDetails.modeOfPayment}</Text>
                </View>
                <View style={{borderRadius:4,backgroundColor:'#E5EAEE',minHeight:100,padding:15,marginBottom:20}}>
                  <View style={{flexDirection:"row",paddingTop:15,justifyContent:'space-between'}}>
                    <View style={{flex:0.6}}>
                        <Text style={styles.deliveryText1}>Amount Receivable</Text>
                    </View>
                    <View style={{flex:0.4,flexDirection:"row",alignItems:'center'}}>
                        <View style={{flex:0.5}}>
                          <Text style={styles.deliveryText2}>AED &nbsp;&nbsp; : </Text>
                        </View>
                        <View style={{flex:0.5,justifyContent: 'flex-end'}}>
                          <Text style={[styles.deliveryText2,{alignSelf:'flex-end'}]}>{order.vendorOrders[0]?.vendor_netPayableAmount?.toFixed(2)}</Text>                
                        </View>            
                    </View>        
                  </View>                  
                  {order.vendorOrders[0].paymentDetails.modeOfPayment === "Card On Delivery" &&
                    <View style={{flex:1,flexDirection:"row",marginTop:15}}>
                      <View style={{flex:0.5}}>
                        <Text style={styles.deliveryText1}>Transaction Number</Text>
                      </View>
                      <View style={{flex:0.5}}>
                        <Text style={[styles.deliveryText1,{textAlign:'right'}]}>{order.vendorOrders[0].paymentDetails.transactionNumber}</Text>
                      </View>
                    </View>
                  }
                </View>
              </View>                
            }
        </ScrollView>
      </View>  
    );
  }
}
