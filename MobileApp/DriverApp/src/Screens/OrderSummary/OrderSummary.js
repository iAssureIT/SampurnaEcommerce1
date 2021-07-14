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
      console.log("response",response);
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
          axios.patch('/api/orders/deliver/vendor_order',formValues)
          .then(res=>{
            console.log("res",res)
                setToast({text:res.data.message,color:'green'})
              navigation.navigate('RunningOrders')
          })
          .catch()
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
    if(e!==""){
      var returnAmount =e - order.vendorOrders[0].vendor_netPayableAmount;
      setReturnAmount(returnAmount);
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
            <View style={{flexDirection:"row",justifyContent:'center',paddingVertical:15 }}>
              <Text>Order Details for #{order.orderID}</Text>
            </View>  
            <View style={{borderRadius:15,borderWidth:1,margin:15,minHeight:100,padding:15}}>
                <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>
                  <Text>Order No {order.orderID}</Text>
                  <Text>Date :{moment(order.createdAt).format('DD-MM-YYYY hh:mm')}</Text>
                </View> 
                <View style={{justifyContent:'space-between'}}>
                  <Text>Vendor : {order?.vendorOrders[0]?.vendorName}</Text>
                  <Text>Deliver To : {order?.deliveryAddress?.name} <Text style={{fontFamily:"Montserrat-Regular",textDecorationLine: 'underline',color:colors.cartButton}} onPress={() => Linking.openURL(`tel:${order?.deliveryAddress?.mobileNumber}`)}>{order?.deliveryAddress?.mobileNumber}</Text></Text>
                  <Text>Delivery Addrees : {order?.deliveryAddress?.addressLine1+", "+order?.deliveryAddress?.addressLine2}</Text>
                </View> 
                {order?.vendorOrders && order?.vendorOrders?.length>0 && order?.vendorOrders[0]?.products.map((item,index)=>{
                    return(
                      <View key={index}>
                        <View key={index} style={styles.proddetails}>
                          <View style={styles.flxdir}>
                            <View style={[styles.flxpd]}>
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
                            <View style={styles.flxmg}>
                                {item.productNameRlang ?
                                <Text style={{fontFamily:'aps_dev_priyanka',fontWeight:'Bold',fontSize:20,flexWrap:'wrap'}}>{item.productNameRlang}</Text>
                                : 
                                <Text style={styles.productname}>{item.productName}</Text>
                                }
                              <View style={[styles.flx1, styles.prdet,{marginVertical:10}]}>
                                <View style={[styles.flxdir]}>
                                  <View style={[styles.flxdir]}>
                                    <Text style={styles.ogprice}>{currency} </Text>
                                  </View>
                                  <View style={[styles.flxdir,{alignItems:"center"}]}>
                                      <Text style={styles.ogprice}> {(item.discountedPrice * item.quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                      </Text>
                                  </View>
                                </View>
                                <View style={[styles.flxdir,{alignItems:"center"}]}>
                                  <Text style={[styles.ogprice]}>Qty : {item.quantity}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                  </Text>
                              </View>
                              </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    )
                  })}
                  <View style={[styles.flxdata,{paddingVertical:15}]}>
                  <View style={{ flex: 0.6 }}>
                    <Text style={styles.totaldata}>Totals</Text>
                  </View> 
                  <View style={{ flex: 0.35 }}>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincart}>{currency} {order.vendorOrders[0]?.vendor_netPayableAmount?.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>  
            </View> 
            {order?.vendorOrders[0]?.orderStatus === "On the Way" && <View style={{borderRadius:15,borderWidth:1,margin:15,minHeight:100,padding:15}}>
              <View style={[styles.tabWrap]}>
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
              </View>
              <View style={{flexDirection:"row",paddingTop:15,justifyContent:'space-between'}}>
                <View style={{flex:0.5}}>
                    <Text style={CommonStyles.label}>Amount Receivable</Text>
                </View>
                <View style={{flex:0.5,alignItems:'center'}}>
                    <Text style={CommonStyles.label}>AED {order.vendorOrders[0]?.vendor_netPayableAmount?.toFixed(2)}</Text>
                   
                </View>        
             </View>
              {
                paymentMethod === "Cash On Delivery" ?
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
                :
                paymentMethod === "Card On Delivery" ?
                <View style={{paddingVertical:15}}>
                  <FormInput 
                      label          = "Transaction Number"
                      onChangeText    = {handleChange('transactionNumber')}
                      required        = {true}
                      name            = "transactionNumber"
                      errors          = {errors}
                      touched         = {touched}
                      // iconName        = {'email'}
                      iconType        = {'material-community'}
                      autoCapitalize  = "none"
                      keyboardType    = "email-address"
                      value           = {values.transactionNumber}
                  />
                </View>
                :
                null
              }
                <View style={{paddingHorizontal:15}}> 
                  <FormButton
                    title       = {'Deliver'}
                    onPress     = {handleSubmit}
                    background  = {true}
                  // loading     = {btnLoading}
                  />
              </View>
            </View> }
            {order.vendorOrders[0].orderStatus === "Delivered" &&
              <View style={{borderRadius:15,borderWidth:1,margin:15,padding:15}}>
                <Text style={CommonStyles.text}>Payment Mode : <Text style={CommonStyles.label}>{order.vendorOrders[0].paymentDetails.modeOfPayment}</Text></Text>
                <Text style={CommonStyles.text}>Amount Paid  :  <Text style={CommonStyles.label}>{order.vendorOrders[0].paymentDetails.amountPaid} {order.vendorOrders[0].paymentDetails.currency}</Text></Text>
                {order.vendorOrders[0].paymentDetails.modeOfPayment === "Card On Delivery" &&<Text style={CommonStyles.text}>Transaction Number  :  <Text style={CommonStyles.label}>{order.vendorOrders[0].paymentDetails.transactionNumber}</Text></Text>}
              </View>  
            }
        </ScrollView>
      </View>  
    );
  }
}
