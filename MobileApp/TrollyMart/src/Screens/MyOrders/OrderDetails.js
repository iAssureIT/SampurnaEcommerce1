import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,Dimensions
}                       from 'react-native';
import { Icon, Card,Button,Input,Tooltip,CheckBox } from "react-native-elements";
import { Rating, AirbnbRating } from 'react-native-ratings';
import styles           from '../../AppDesigns/currentApp/styles/ScreenStyles/MyOrdersstyles.js';
import { colors }       from '../../AppDesigns/currentApp/styles/styles.js';
import Loading          from '../../ScreenComponents/Loading/Loading.js';
import axios            from 'axios';
import AsyncStorage     from '@react-native-async-storage/async-storage';
import moment           from 'moment';
import {withCustomerToaster}    from '../../redux/AppState.js';
import { connect,
  useDispatch,
  useSelector }             from 'react-redux';
import StepIndicator        from 'react-native-step-indicator';
import CommonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import CountDown            from 'react-native-countdown-component';
import Modal                from "react-native-modal";
import { useIsFocused }     from "@react-navigation/native";
import openSocket           from 'socket.io-client';
import {REACT_APP_BASE_URL} from '@env'
import {FormButton}         from '../../ScreenComponents/FormButton/FormButton';
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { Dropdown }             from 'react-native-material-dropdown-v2';
import { RadioButton }        from 'react-native-paper';
import ImagePicker              		from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS} 	from 'react-native-permissions';
import { RNS3 }                 		from 'react-native-aws3';
import HTML from 'react-native-render-html';
import { NetWorkError } from '../../../NetWorkError.js';
const WATER_IMAGE = require("../../AppDesigns/currentApp/images/star.png")
const window = Dimensions.get('window');
const  socket = openSocket(REACT_APP_BASE_URL,{ transports : ['websocket'] });
  const customStyles = {
    stepIndicatorSize                 : 25,
    currentStepIndicatorSize          : 30,
    separatorStrokeWidth              : 2,
    currentStepStrokeWidth            : 3,
    stepStrokeCurrentColor            : colors.warning,
    stepStrokeWidth                   : 3,
    stepStrokeFinishedColor           : colors.success,
    stepStrokeUnFinishedColor         : '#aaaaaa',
    separatorFinishedColor            : colors.success,
    separatorUnFinishedColor          : '#aaaaaa',
    stepIndicatorFinishedColor        : colors.success,
    stepIndicatorUnFinishedColor      : '#ffffff',
    stepIndicatorCurrentColor         : '#ffffff',
    stepIndicatorLabelFontSize        : 13,
    currentStepIndicatorLabelFontSize : 13,
    stepIndicatorLabelCurrentColor    : colors.warning,
    stepIndicatorLabelFinishedColor   : '#ffffff',
    stepIndicatorLabelUnFinishedColor : '#aaaaaa',
    labelColor                        : '#999999',
    labelSize                         : 13,
    currentStepLabelColor             : colors.warning,
  }
export const OrderDetails = withCustomerToaster((props)=>{
  const {navigation,route,setToast}=props;
  const [isOpen,setOpen]=useState(false);
  const [cancelOrderModal,setCancelOrderModal] =useState(false);
  const [order,setOrder]=useState('');
  const [cancelOrderId,setCancelOrderId]=useState('');
  const [cancelVendorId,setCancelVendorId]=useState('');
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false);
  const [returnModal,setReturnModal]=useState(false);
  const [vendorDetails,setVendorDetails]=useState();
  const [rating,setRating] = useState(1);
  const [review,setReview] = useState('');
  const [productIndex,setProductIndex]=useState('')
  const {orderid}=route.params;
  const isFocused = useIsFocused();
  const [labels,setLabels] = useState([]);
  const [labelsArray,setLabelsArray]= useState([]);
  const [review_id,setReviewId]= useState();
  const [getReasons,setGetReasons]=useState([]);
  const [reason,setReason]=useState('');
  const [checked,setChecked]= useState('first');
  const [checkedTerms,setTermsChecked]   = useState(false);
  const [comment, setComment] = useState('')
  const [refund, setRefund] = useState('source')
  const [returnProductImages, setReturnProductImages] = useState([]);
  const [reviewProductImages, setReviewProductImages] = useState([]);
  const [imageLoading,setImageLoading] = useState(false);
  const [modalTerms,setTermsModal] = useState(false);
  const [pageBlockes,setPageBlocks]       = useState([]);
  const [tooltipSize, setTooltipSize] = useState({ w: 200, h: 200 })

  const store = useSelector(store => ({
    preferences     : store.storeSettings.preferences,
    userDetails     : store.userDetails,
    globalSearch    : store.globalSearch,
    s3Details       : store.s3Details.data
  }));
  const {currency}=store.preferences;
  const {globalSearch,s3Details}=store;

  useEffect(() => {
  
    axios.get('/api/orderstatus/get/list/')
    .then((response) => {
      var array = response.data.map(e=>e.orderStatus);
      console.log("array",array);
      setLabelsArray(response.data.map(e=>e.orderStatus));
      array.splice(2, 1);
      setLabels(array);
    })
    .catch((error) => {
      console.log("error",error);
      if (error.response.status == 401) {
        AsyncStorage.removeItem('user_id');
        AsyncStorage.removeItem('token');
        setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
        navigation.navigate('Auth')
      }else{
        setToast({text: 'Something went wrong2.', color: 'red'});
      }  
    });
    getSingleOrder(orderid);
    getReasons_func();
    getTerms();
}, [props,isFocused]);

const getReasons_func=()=>{
  axios.get('/api/returnreasons/get/list')
    .then((response) => {
      console.log("getReasons_func",response);
      var array = response.data.map((a, i) => { return { label: a.reasonOfReturn, value: a.reasonOfReturn } })
      setGetReasons(array);
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
    });
}


const getTerms=()=>{
  axios.get('/api/pages/get/page_block/terms-and-conditions')
  .then(res=>{
      console.log("res",res);
      setPageBlocks(res.data.pageBlocks)
  })
  .catch(error=>{
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
 

  const getSingleOrder=(orderid)=>{
    setLoading(true);
    socket.emit('room',orderid);
    socket.emit('signle_order',orderid);
    socket.on('getSingleOrder',(response)=>{
      // socket.off('getSingleOrder');
      console.log("response",response);
    // axios.get('/api/orders/get/one/' + orderid)
    //   .then((response) => {
          setOrder(response);
          setLoading(false);
      // })
      // .catch((error) => {
      //   console.log("error",error);
      //   if (error.response.status == 401) {
      //     AsyncStorage.removeItem('user_id');
      //     AsyncStorage.removeItem('token');
      //     setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
      //     navigation.navigate('Auth')
      //   }else{
      //     setToast({text: 'Something went wrong2.', color: 'red'});
      //   }  
      // });
    });
  }


  const confirmCancelOrderBtn = () => {
    var formValues = {
      "type"        : cancelVendorId === "" ? "wholeorder" : "vendororder", //or wholeorder
      "vendor_id"   : cancelVendorId !== "" ? cancelVendorId : "", // if type is vendororder
      "order_id"    : cancelOrderId,
      // "userid"      : store.userDetails.user_id,
    }
    axios.patch('/api/orders/cancel/order', formValues)
      .then((response) => {
        axios.get('/api/orders/get/one/' + cancelOrderId)
          .then((res) => {
            setCancelOrderModal(false);
            setOrder(res.data);
            setToast({text: 'Your order has been cancelled.', color: 'green'});
            var sendData = {
              "event": "4",
              "toUser_id": store.userDetailsuser_id,
              "toUserRole": "user",
              "variables": {
                "Username": res.data.userFullName,
                "orderId": res.data.orderID,
                "orderdate": moment(res.data.createdAt).format('DD-MMM-YY LT'),
              }
            }
            axios.post('/api/masternotifications/post/sendNotification', sendData)
              .then((res) => { })
              .catch((error) => { console.log('notification error: ', error) })
            
          })
          .catch((error) => {
            if (error.response.status == 401) {
              AsyncStorage.removeItem('user_id');
              AsyncStorage.removeItem('token');
              setToast({text: 'Your Session is expired. You need to login again.', color: colors.warning});
              navigation.navigate('Auth')
            }else{
              setToast({text: 'Something went wrong1.', color: 'red'});
            }  
          })
      });
  }



  const cancelButton = (orderDate)=>{
    var min = moment(orderDate).add(order.maxDurationForCancelOrder, 'minutes');
    var duration = moment.duration(min.diff(new Date())).asSeconds();
    if(duration > 0 &&duration < order.maxDurationForCancelOrder*60){
      setTimeout(function(){getSingleOrder(orderid) },  Math.abs(duration) *1000);
      return true;
    }else{
      return false;
    }
  }
  
  const cancelTime = (orderDate)=>{
    var min = moment(orderDate).add(order.maxDurationForCancelOrder, 'minutes');
    var duration = moment.duration(min.diff(new Date())).asSeconds();
    return Math.abs(duration);
}


const cancelorderbtn = (id,vendor_id) => {
  setCancelOrderModal(true);
  setCancelOrderId(id);
  setCancelVendorId(vendor_id);
}


  const submitReview=()=>{
    if(review_id){
      var formValues = {
        "review_id"           : review_id,
        "rating"          		: rating,
        "customerReview"  		: review,
        "reviewProductImages" : reviewProductImages,
        "status"          		: "New"
      }
      axios.patch ('/api/customerReview/patch/customer/review',formValues)
      .then(res=>{
        setModal(false);
        setVendorDetails();
        setProductIndex('');
        setReview('')
        setRating(1);
        setToast({text: res.data.message, color: 'green'});
        getSingleOrder(orderid)
      })
      .catch(err=>{
        console.log("err",err);
      })
    }else{
      var formValues = {
        "customer_id"     		: store.userDetails.user_id,
        "customerName"        : store.userDetails.firstName+" "+store.userDetails.lastName,
        "order_id"        		: orderid,
        "product_id"      		: vendorDetails.products[productIndex].product_ID,
        "vendor_id" 			    : vendorDetails.vendor_id._id,
        "vendorLocation_id"   : vendorDetails.vendorLocation_id,
        "rating"          		: rating,
        "customerReview"  		: review,
        "reviewProductImages" : reviewProductImages,
        "status"          		: "New"
      }
      axios.post('/api/customerReview/post',formValues)
      .then(res=>{
        setModal(false);
        setVendorDetails();
        setProductIndex('');
        setReviewProductImages([]);
        setReview('')
        setRating(1);
        setToast({text: res.data.message, color: 'green'});
        getSingleOrder(orderid)
      })
      .catch(err=>{
        console.log("err",err);
      })
    }
  }


  const submitReturn=()=>{
    if(reason!=='' && comment!==''&&refund!==''&&returnProductImages.length>0){
      var formValues = {
        "user_id"     		    : store.userDetails.user_id,
        "order_id"        		: orderid,
        "product_id"      		: vendorDetails.products[productIndex].product_ID,
        "vendor_id" 			    : vendorDetails.vendor_id._id,
        "vendorLocation_id"   : vendorDetails.vendorLocation_id,
        "reasonForReturn"     : reason,
        "customerComment"  		: comment,
        "refund"              : refund,
        "returnProductImages" : returnProductImages
      }
      // console.log("formValues",formValues);
      axios.patch('/api/orders/patch/returnproduct',formValues)
      .then(res=>{
        console.log("res",res);
        setReturnModal(false);
        setVendorDetails();
        setProductIndex('');
        setRefund('');
        setComment('');
        setReason('');
        setReturnProductImages([])
        setToast({text: res.data.message, color: 'green'});
        getSingleOrder(orderid)
      })
      .catch(err=>{
        console.log("err",err);
      })
    }else{
      setToast({text: "All fields are mandetory", color: colors.red});
    } 
  }

  const getSingleReview=(product_id)=>{
    var formValues = {
      "customer_id"     		: store.userDetails.user_id,
      "order_id"        		: orderid,
      "product_id"      		: product_id
    }
    console.log("formValues",formValues);
    axios.post('/api/customerReview/get/single/customer/review',formValues)
    .then(res=>{
      console.log("res",res);
      // setModal(false);
      // setVendorDetails();
      // setProductIndex('');
      setReviewId(res.data._id)
      setReview(res.data.customerReview)
      setRating(res.data.rating);
      setReviewProductImages(res.data.reviewProductImages)
      // setToast({text: res.data.message, color: 'green'});
    })
    .catch(err=>{
      console.log("err",err);
    })
  }


  const clearReview=()=>{
      setReviewId()
      setReview('')
      setRating(1);
      setReviewProductImages([])
  }



  const chooseFromLibrary = (props,state) => {
    console.log("props",props);
    var openType = props === 'openCamera' ? ImagePicker.openCamera : ImagePicker.openPicker;
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            openType({
              multiple      : true,
              waitAnimationEnd: false,
              includeExif: true,
              forceJpg: true,
            }).then(response => {
            setImageLoading(true);
              response =  props === 'openCamera' ? [response] : response;
              for (var i = 0; i<response.length; i++) {
                  if(response[i].path){
              const file = {
                uri  : response[i].path,
                name : response[i].path.split('/').pop().split('#')[0].split('?')[0],
                type : 'image/jpeg',
              }
                  if(file) {
                      var fileName = file.name; 
                      var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2); 
                      if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){  
                        if(file){
                          RNS3
                          .put(file,s3Details)
                          .then((Data)=>{
                            // console.log("Data",Data);
                            // console.log("state",state);
                            if(state === "Return"){
                              setReturnProductImages([
                                ...returnProductImages,
                                Data.body.postResponse.location,
                              ]);
                            }else if(state === "Review"){
                              setReviewProductImages([
                                ...reviewProductImages,
                                Data.body.postResponse.location,
                              ]);
                            }
                          setImageLoading(false);
                          })
                          .catch((error)=>{
                            setToast({text: 'Something went wrong.', color: 'red'});
                            setImageLoading(false);
                          });
                        }else{       
                            setToast({text: 'File not uploaded.', color: 'red'});
                            setImageLoading(false);
                          }
                      }else{
                          setToast({text: 'Only Upload  images format (jpg,png,jpeg).', color: 'red'});
                          setImageLoading(false);
                      }
                  }
               }    
             }       
             });
            break;
            case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          break;
          case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
        }
      })
      .catch(error => {
        console.log("err",error)
        setImageLoading(false);
      setToast({text: 'Something went wrong.', color: 'red'});
      });
  };


  const tooltipClone = React.cloneElement(
    <View style={{width:"100%"}}>
      <Icon name="close" type="material-community" color="#fff" iconStyle={{alignSelf:"flex-end"}}/>
    { order.vendorOrders && order.vendorOrders.length > 0&&
    order.vendorOrders.map((vendor, i) => {
        return (
          <View style={{paddingVertical:5}}>
              <Text style={[CommonStyles.label,{color:"#fff"}]}>{vendor.vendor_id.companyName}</Text>
              <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                <View style={{flex:.7}}><Text style={[CommonStyles.text,{color:"#fff"}]}>Delivery Charges : </Text></View>
                {/* <View style={{flex:.1}}><Text style={[CommonStyles.text,{color:"#fff",textDecorationLine:'line-through'}]}>{vendor.vendor_shippingCharges}</Text></View> */}
                <View style={{flex:.2}}><Text style={[CommonStyles.text,{color:"#fff",alignSelf:"flex-end"}]}>{vendor.vendor_shippingChargesAfterDiscount} {currency}</Text></View>
              </View>  
          </View> 
        )
    })  
    }
    <View style={{marginTop:30,flexDirection:'row',justifyContent:'space-between'}}>
      <View style={{flex:.7}}><Text style={[CommonStyles.text,{color:"#fff"}]}>Total Delivey Charges :</Text></View>
      {/* <View style={{flex:.1}}><Text style={[CommonStyles.text,{color:"#fff",textDecorationLine:'line-through'}]}>{order?.paymentDetails?.shippingChargesBeforeDiscount}</Text></View> */}
      <View style={{flex:.2}}><Text style={[CommonStyles.text,{color:"#fff",alignSelf:"flex-end"}]}>{order?.paymentDetails?.shippingCharges} {currency}</Text></View>
    </View>  
    </View>,
    { onLayout: (e) => setTooltipSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height }) }
  )

    console.log("vendorDetails",vendorDetails);
    return (
      <React.Fragment>
      {loading?
        <Loading/>
        :
        globalSearch.search ?
          <SearchSuggetion />
        :
        <View style={styles.superparent}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={{paddingVertical:24,paddingHorizontal:6}}>
              <Text style={CommonStyles.screenHeader}>My Orders Details</Text>
            </View>
            <View style={styles.formWrapper}>
              <View style={styles.parent}>
                <View style={[styles.prodinfoparent]}>
                  <View style={{paddingHorizontal:15}}>
                    <View style={{paddingHorizontal:5}}>
                      <View style={{flexDirection:'row'}}>
                        <View style={[styles.orderid]}>
                          <Text style={styles.orderidinfo}>Order ID : {order.orderID}</Text>
                        </View>
                        <View style={styles.orderAmount}>
                          <Text style={styles.orderidinfo}>Total Amount {currency} {order.paymentDetails && order.paymentDetails.netPayableAmount.toFixed(2)} </Text>
                        </View>
                    </View> 
                    <View style={{flexDirection:"row",marginTop:5,justifyContent:'space-between'}}>
                        <View style={[{flex:0.44}]}>
                          <Text numberOfLines={2} style={styles.totaldata}>Address: {order.deliveryAddress.addressLine1+", "+order.deliveryAddress.addressLine2}</Text>
                        </View>
                        <View style={[{flex:0.54,alignItems:'flex-end'}]}>
                          <Text numberOfLines={2} style={styles.totaldata}>Credit points earned &nbsp;{order.paymentDetails.creditPointsEarned}</Text>
                        </View>
                        {/* {positionOrder === 3  &&
                        <View style={{flex:0.3,justifyContent:"center",alignItems:"center"}}>
                          <View style={[styles.vendorStatus,
                                (positionOrder === 0 ? 
                                {backgroundColor:'#017BFE'}
                                :
                                positionOrder === 1 ? 
                                {backgroundColor:colors.warning}
                                :
                                positionOrder === 2 ? 
                                {backgroundColor:"#EB984E"}
                                :
                                positionOrder === 3 ?  
                                {backgroundColor:colors.success}
                                :
                                positionOrder === 4 ?  
                                {backgroundColor:colors.red}
                                :
                                "#eee")
                              ]}>
                          <Text style={[styles.totaldata,{padding:5,color:"#fff"}]}>{order.orderStatus}</Text>
                        </View>
                      </View>} */}
                    </View>
                    <View style={{flexDirection:"row",marginTop:5,justifyContent:'space-between'}}>
                        <View style={[{flex:0.44}]}>
                          <Text numberOfLines={2} style={styles.totaldata}>Date: {moment(order.createdAt).format('MM/DD/YYYY')}</Text>
                        </View>
                        <View style={[{flex:0.54,alignItems:'flex-end'}]}>
                          <Text numberOfLines={2} style={styles.totaldata}>{order.paymentDetails.paymentMethod}</Text>
                        </View>
                    </View>
                  </View>  
                </View>  
                  {/* <View style={styles.addressdetais}>
                    <Text style={styles.addtitle}>Shipping Address <Text style={styles.addressdets}>: {order.deliveryAddress ? order.deliveryAddress.addressLine2+" "+order.deliveryAddress.addressLine1 : "NA"}</Text></Text>
                    <Text style={styles.addtitle}>Mobile Number <Text style={styles.addressdets}>: {order.deliveryAddress ?  order.deliveryAddress.mobileNumber : "NA"}</Text></Text>
                  </View> */}
                  {
                    order && order.vendorOrders.length > 0 ?
                    order.vendorOrders.map((vendor,i)=>{
                      var position = 0;
                      // if (vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status === "New" || vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status === "Verified") {
                      //   position = 0;
                      // } else if (vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status === "Packed" || vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status === "Inspection" || vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status ==="Dispatch Approved" ) {
                      //   position = 1;
                      // } else if (vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status === "Dispatch" || vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status ===  "Delivery Initiated") {
                      //   position = 2;
                      // } 
                      // else if (vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status === "Delivered & Paid") {
                      //   position = 4;
                      // }  
                      var vendorStatus = vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status;
                      console.log("vendorStatus",vendorStatus);
                      if(vendorStatus ===labelsArray[2]){
                        var postion1 = 2;
                      }else{
                        var postion1 = labels.indexOf(vendorStatus)+1;
                      }
                      
                      
                      return(
                      <View style={styles.prodinfoparent1}>
                        <View style={{flexDirection:'row',marginBottom:5}}>
                          <View style={{flex:0.8,alignItems:'flex-start'}}>
                            <Text style={[styles.vendorName]}>{vendor.vendor_id.companyName}</Text>
                          </View>
                           {cancelButton(order.createdAt) ?
                          order.orderStatus && order.orderStatus !== 'Cancelled'  && order.deliveryStatus === "Delivered & Paid" ?
                          null
                          :
                          <View style={[styles.orderdetailsstatus,{paddingRight:0,height:40,alignItems:'flex-end'}]}>
                            {order.orderStatus && order.orderStatus !== 'Cancelled'&&
                            <View style={{justifyContent:'center',paddingRight:5}}>
                              <Text style={styles.cancelOrderText} onPress={()=>cancelorderbtn(order._id,'')}>Cancel this order</Text>
                              </View>
                            }
                            </View>
                          :
                          null
                        }
                        </View> 
                        <View style={styles.orderstatusmgtop}>
                          {
                            vendor && vendor.deliveryStatus
                              && vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status !== 'Cancelled' ?
                              <View style={styles.orderstatus}>
                                <StepIndicator
                                  customStyles={customStyles}
                                  labelTextStyle={{fontSize:13,fontFamily:"Montserrat-Regular",}}
                                  currentPosition={postion1}
                                  labels={labels}
                                  labelStyle={{fontSize:13,fontFamily:"Montserrat-Regular",}}
                                  stepCount={4}
                                />
                              </View>
                              :
                              // <View style={styles.orderstatus}>
                                <Text style={styles.ordercancelled}>{vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status}</Text>
                              // </View>
                          }
                        </View>
                        
                        {vendor.products.map((pitem, index) => {
                          console.log("pitem===>", pitem);
                          return (
                            <View style={[styles.prodorders,{flexDirection:"row",flex:1,alignItems:'center'}]}>
                              <View style={{flex:0.2}}>
                                {pitem.productImage[0] ?<Image
                                  style={styles.img15}
                                  source={{ uri: pitem.productImage[0] }}
                                  resizeMode="contain"
                                />:
                                <Image
                                  source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                                  style={styles.img15}
                                  resizeMode="contain"
                                />
                              }
                              </View>
                              <View style={{flex:0.45,paddingHorizontal:5}}>
                                <Text numberOfLines={2} style={styles.prodinfo}>{pitem.productName}</Text>
                                <Text style={{color:"#B2B2B2",fontFamily:"Montserrat-Medium",fontSize:14,marginTop:7}}>
                                    Quantity 
                                  <Text style={styles.prodinfo}>&nbsp;&nbsp; {pitem.quantity}</Text> 
                                </Text>
                             
                              </View>
                              <View style={{flex:0.35}}>
                                <View style={{flex:1,flexDirection:'row'}}>
                                  <View style={{flex:.5}}>
                                      <Text style={[styles.ogpriceC,{opacity: 0.5}]}>{currency} </Text>
                                  </View> 
                                  <View style={{flex:.5,alignItems:'flex-end'}}>
                                      <Text style={styles.ogprice}> {(pitem.discountedPrice * pitem.quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                      </Text>
                                  </View>
                                </View>
                                <View style={[styles.flx1, styles.prdet,{marginVertical:5}]}>
                                  {labels.indexOf(vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status) >= 3 &&
                                      <View style={[styles.flxdir,{marginTop:10,flex:1}]}>
                                        {pitem.productStatus?
                                        <View style={{flex:.5}}>
                                          <Text style={[styles.ogprice,{fontSize:12,color:colors.cartButton}]}>{pitem.productStatus.split(" ")[1]}</Text>
                                      </View>
                                      :
                                      <View style={{flex:.5}}>
                                        <Text style={[CommonStyles.linkText,{fontSize:12,alignSelf:'center',textDecorationLine:'underline'}]} onPress={()=>{setReturnModal(true);setVendorDetails(vendor);setProductIndex(index)}}>Return</Text>
                                      </View>
                                    }  
                                    <View style={{flex:.5}}>
                                      {pitem.isReview ?
                                        <Text style={[CommonStyles.linkText,{alignSelf:'flex-end',fontSize:12,textDecorationLine:'underline'}]} onPress={()=>{setModal(true);setVendorDetails(vendor);setProductIndex(index);getSingleReview(pitem.product_ID)}}>Feedback</Text>
                                        :
                                        <Text style={[CommonStyles.linkText,{alignSelf:'flex-end',fontSize:12,textDecorationLine:'underline'}]} onPress={()=>{setModal(true);setVendorDetails(vendor);setProductIndex(index);clearReview();}}>Feedback</Text>
                                      } 
                                    </View>  
                                  </View>}
                                </View>
                              </View>  
                            </View>
                          );
                        })}
                        <View style={[styles.totaldetails,{paddingHorizontal:15}]}>
                          <View style={styles.flxdata}>
                              <View style={{ flex: 0.35}}/>
                              <View style={{ flex: 0.35}}>
                                <Text style={styles.totalAmount}>Total</Text>
                              </View>
                              <View style={{flex:0.35,flexDirection:'row'}}>
                                  <View style={{flex:.5}}>
                                      <Text style={[styles.ogpriceC,{opacity: 0.5}]}>{currency} </Text>
                                  </View> 
                                  <View style={{flex:.5,alignItems:'flex-end'}}>
                                      <Text style={styles.ogprice}>{vendor.vendor_afterDiscountTotal && vendor.vendor_afterDiscountTotal.toFixed(2)}</Text>
                                  </View>
                                </View>
                            </View>
                            <View style={styles.flxdata}>
                                <View style={{ flex: 0.35}}/>
                                <View style={{ flex: 0.35}}>
                                  <Text style={styles.totalAmount}>You Save </Text>
                                </View> 
                                <View style={{flex:0.35,flexDirection:'row'}}>
                                  <View style={{flex:.5}}>
                                      <Text style={[styles.ogpriceC,{opacity: 0.5}]}>{currency} </Text>
                                  </View> 
                                  <View style={{flex:.5,alignItems:'flex-end'}}>
                                      <Text style={[styles.ogprice,{color:colors.success}]}>{vendor.vendor_discountAmount > 0 ? vendor.vendor_discountAmount.toFixed(2) : 0.00}</Text>
                                  </View>
                                </View>
                              </View>
                          <View>
                          </View>
                        </View>
                        
                      </View>
                      )
                    })
                    :
                    null
                  }
                <View style={styles.prodinfoparent13}>
                  <View style={styles.totaldetails}>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.57 }}>
                        <Text style={styles.totalAmount}>Final Total </Text>
                      </View>
                      <View style={{ flex: 0.38,flexDirection:'row' }}>
                        <View style={{flex:.5}}>
                            <Text style={[styles.ogpriceC,{opacity: 0.5}]}>{currency} </Text>
                        </View> 
                        <View style={{flex:.45,alignItems:'flex-end'}}>
                            <Text style={styles.ogprice}>{order.paymentDetails && order.paymentDetails.afterDiscountTotal.toFixed(2)}</Text>
                        </View>                        
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.57 }}>
                        <Text style={styles.totalAmount}>Total Savings </Text>
                      </View> 
                      <View style={{ flex: 0.38,flexDirection:'row' }}>
                        <View style={{flex:.5}}>
                            <Text style={[styles.ogpriceC,{opacity: 0.5}]}>{currency} </Text>
                        </View> 
                        <View style={{flex:.45,alignItems:'flex-end'}}>
                            <Text style={styles.ogpriceG1}>{order.paymentDetails && order.paymentDetails.discountAmount.toFixed(2)}</Text>
                        </View>                        
                      </View>
                      {/* <View style={{ flex: 0.35 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincart}> - </Text>
                          <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.discountAmount.toFixed(2)}</Text>
                        </View>
                      </View> */}
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.57 }}>
                        <Text style={styles.totalAmount}>Total VAT</Text>
                      </View> 
                      <View style={{ flex: 0.38,flexDirection:'row' }}>
                        <View style={{flex:.5}}>
                            <Text style={[styles.ogpriceC,{opacity: 0.5}]}>{currency} </Text>
                        </View> 
                        <View style={{flex:.45,alignItems:'flex-end'}}>
                            <Text style={styles.ogprice}>{order.paymentDetails && order.paymentDetails.taxAmount.toFixed(2)}</Text>
                        </View>                        
                      </View>
                      {/* <View style={{ flex: 0.35 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.taxAmount.toFixed(2)}</Text>
                        </View>
                      </View> */}
                    </View>                    
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.totalAmount}>Total Delivery Charges </Text>
                      </View> 
                      <View style={{ flex: 0.4,flexDirection:'row' }}>
                        <View style={{flex:.5}}>
                            <Text style={[styles.ogpriceC,{opacity: 0.5}]}>{currency} </Text>
                        </View> 
                        <View style={{flex:.45,alignItems:'flex-end'}}>
                            <Text style={styles.ogprice}>{order.paymentDetails && order.paymentDetails.shippingCharges.toFixed(2)}</Text>
                        </View>                        
                      </View>
                      {/* <View style={{ flex: 0.35 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.shippingCharges.toFixed(2)}</Text>
                        </View>
                      </View> */}
                      <View style={{flex:0.05,justifyContent:"center",alignItems:"center"}} >
                      <Tooltip 
                        containerStyle={{justifyContent:'flex-start',alignItems:'flex-start'}}
                        width={350} 
                        height={tooltipSize.h + 30}
                        backgroundColor={colors.theme}
                        popover={tooltipClone}>
                          <Icon name="info-circle" type={"font-awesome"} size={17} color={'#A6B7C2'} />
                        </Tooltip>
                    </View>  
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.57 }}>
                        <Text style={styles.totalAmount}>Discount Coupon</Text>
                      </View>
                      <View style={{ flex: 0.38,flexDirection:'row' }}>
                        <View style={{flex:.5}}>
                            <Text style={[styles.ogpriceC,{opacity: 1,color:'#EF9A9A'}]}>{currency} </Text>
                        </View> 
                        <View style={{flex:.45,alignItems:'flex-end'}}>
                            <Text style={styles.ogpriceR}>{order.paymentDetails && order.paymentDetails.afterDiscountCouponAmount.toFixed(2)}</Text>
                        </View>                        
                      </View>
                      {/* <View style={{ flex: 0.35 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.afterDiscountCouponAmount.toFixed(2)}</Text>
                        </View>
                      </View> */}
                    </View>
                    <View style={{marginVertical:5,borderColor:"#ddd"}} />
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.55 }}>
                        <Text style={styles.totalAmountG}>Grand Total</Text>
                      </View>
                      <View style={{ flex: 0.45,flexDirection:'row'}}>
                        <View style={{flex:.5}}>
                            <Text style={[styles.ogpriceG,{opacity: 0.5}]}>{currency} </Text>
                        </View> 
                        <View style={{flex:.5}}>
                            <Text style={styles.totalAmountG}>{order.paymentDetails && order.paymentDetails.netPayableAmount.toFixed(2)}</Text>
                        </View>                        
                      </View>
                      {/* <View style={{ flex: 0.35 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.netPayableAmount.toFixed(2)}</Text>
                        </View>
                      </View> */}
                    </View>
                  </View>
                 
                </View>
              </View>
            </View>
            </View>
          </ScrollView>
        
        </View>}
        <Modal isVisible={cancelOrderModal}
          onBackdropPress={() => setCancelOrderModal(false)}
          coverScreen={true}
          hideModalContentWhileAnimating={true}
          style={{ paddingHorizontal: '5%', zIndex: 999 }}
          animationOutTiming={500}>
          <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
            <View style={{ justifyContent: 'center', backgroundColor: "transparent", width: 60, height: 60, borderRadius: 30, overflow: 'hidden' }}>
              <Icon size={50} name='shopping-cart' type='feather' color='#666' style={{}} />
            </View>
            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
              Are you sure you want to Cancel order?
            </Text>
            <View style={styles.cancelbtn}>
              <View style={styles.cancelvwbtn}>
                <TouchableOpacity>
                  <Button
                    onPress={() => setCancelOrderModal(false)}
                    titleStyle={styles.buttonText1}
                    title="NO"
                    buttonStyle={styles.buttonRED}
                    containerStyle={styles.buttonContainer2}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ordervwbtn}>
                <TouchableOpacity>
                  <Button
                    onPress={() => confirmCancelOrderBtn()}
                    titleStyle={styles.buttonText1}
                    title="Yes"
                    buttonStyle={styles.button1}
                    containerStyle={styles.buttonContainer2}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal isVisible={modal}
          onBackdropPress={() => setModal(false)}
          onRequestClose={() => setModal(false)}
          coverScreen={true}
          hideModalContentWhileAnimating={true}
          style={{ zIndex: 999,marginHorizontal:0,marginBottom:0}}
          animationOutTiming={500}>
          <ScrollView style={{ backgroundColor: "#EBEBEB", borderTopLeftRadius: 15,borderTopRightRadius: 15,paddingBottom: 30,marginTop:150}}>
          <View style={{alignItems:'flex-end',padding:15}}>
              <Text style={CommonStyles.errorText} onPress={()=>setModal(false)}>Close</Text>
            </View>
          {vendorDetails&&<View style={[styles.prodorders],{backgroundColor:'#EBEBEB',flexDirection:"row",flex:1}}>
              <View style={{flex:0.3,marginBottom:20}}>
                <View style={[styles.img151]}>
                  { vendorDetails.products[productIndex].productImage && vendorDetails.products[productIndex].productImage[0] ?<Image
                    style={styles.imgMain}
                    source={{ uri: vendorDetails.products[productIndex].productImage[0] }}
                    resizeMode='stretch'
                  />:
                  <Image
                    source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                    style={styles.img151}
                  />
                }
                </View>
              </View>
              <View style={{flex:0.7,paddingLeft:15,marginBottom:20}}>
                <Text style={styles.vendorName1}>{vendorDetails?.vendorName}</Text>
                <Text style={styles.prodinfo}>{vendorDetails.products[productIndex].productName}</Text>
                <View style={styles.flx4}>
                  <View style={[styles.flx1, styles.prdet]}>
                    <View style={[styles.flxdir]}>                      
                      <View style={[styles.flxdir]}>
                        <Text style={styles.ogpriceModal}> {(vendorDetails.products[productIndex].discountedPrice * vendorDetails.products[productIndex].quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                        </Text>
                        <Text style={[styles.ogpriceModal1]}>{currency} </Text>                        
                      </View>                    
                    </View>
                  </View>
                </View>
              </View>  
            </View>}
            <Rating
              // showRating
              type='custom'
              // ratingImage={WATER_IMAGE}
              // ratingBackgroundColor='#EBEBEB'
              tintColor= '#EBEBEB'
              startingValue={rating}
              onFinishRating={(e)=>setRating(e)}
              style={{ paddingVertical: 10 , marginBottom:10,backgroundColor:'#EBEBEB'}}
            />
              <Input
                label   = "Leave a Feedback."   
                labelStyle = {styles.labelDrop} 
                // placeholder           = "Leave a review..."
                onChangeText          = {(text)=>setReview(text)}
                autoCapitalize        = "none"
                keyboardType          = "email-address"
                inputContainerStyle   = {styles.containerStyle}
                containerStyle        = {{paddingHorizontal:20}}
                placeholderTextColor  = {'#bbb'}
                inputStyle            = {{fontSize: 16}}
                inputStyle            = {{textAlignVertical: "top"}}
                // autoCapitalize        = 'characters'
                multiline             = {true}
                numberOfLines         = {4}
                value                 = {review}
              />
              <View style={{flexDirection:'row',justifyContent:"flex-end",marginHorizontal:20}}>
                <TouchableOpacity 
                    style={{height:34,width:34,elevation:5,marginRight:3,justifyContent:'center',alignItems:'center',backgroundColor:"#fff",borderRadius:50}}
                    onPress={() => chooseFromLibrary('openPicker','Review')}
                  >
                  {/* <Icon name="plus" size={12}  type="font-awesome" iconStyle={{paddingHorizontal:5}}  onPress={() => chooseFromLibrary('openCamera','Return')}/> */}
                  <Icon name="image" size={12}  type="font-awesome" />
                </TouchableOpacity>                
              </View>              
              <View style={{flexDirection:"row",margin:20}}>
                {
                  reviewProductImages && reviewProductImages.length > 0 ?
                  reviewProductImages.map((item,index)=>{
                    return(
                      <Image
                        source={{uri:item}}
                        resizeMode="cover"
                        style={{height:50,width:50,marginRight:15,backgroundColor:"#f1f1f1"}}
                        PlaceholderContent={<ActivityIndicator color={colors.theme}/>}
                      />
                    )
                  })
                  :
                  null
                }
               </View> 
               <View style = {{marginHorizontal:40}}>
                <FormButton 
                  onPress    = {()=>submitReview()}
                  title       = {'Submit'}                  
                  background  = {true}
                /> 
               </View>
             
          </ScrollView>
        </Modal>

        <Modal isVisible={returnModal}
          onBackdropPress={() => setReturnModal(false)}
          onRequestClose={() => setReturnModal(false)}
          coverScreen={false}
          hideModalContentWhileAnimating={true}
          style={{ zIndex: 999,marginHorizontal:0,marginBottom:0,flex:1,paddingBottom:45,}}
          animationOutTiming={500}>
          <ScrollView style={{ backgroundColor: "#EBEBEB", borderTopLeftRadius: 15,borderTopRightRadius: 15,paddingBottom: 30}}>
            <View style={{alignItems:'flex-end',padding:15}}>
              <Text style={CommonStyles.errorText} onPress={()=>setReturnModal(false)}>Close</Text>
            </View>
          {vendorDetails&&<View style={[styles.prodorders],{backgroundColor:'#EBEBEB',flexDirection:"row",flex:1,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}>
              <View style={{flex:0.3,marginBottom:20}}>
                <View style={[styles.img151]}>
                  { vendorDetails.products[productIndex].productImage && vendorDetails.products[productIndex].productImage[0] ?<Image
                    style={styles.imgMain}
                    source={{ uri: vendorDetails.products[productIndex].productImage[0] }}
                    resizeMode='stretch'
                  />:
                  <Image
                    source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                    style={styles.img151}
                  />
                }
                </View>
              </View>
              
              <View style={{flex:0.7,paddingLeft:15,marginBottom:20}}>
              <Text style={styles.vendorName1}>{vendorDetails?.vendorName}</Text>
                <Text style={styles.prodinfo}>{vendorDetails.products[productIndex].productName}</Text>
                <View style={styles.flx4}>
                  <View style={[styles.flx1, styles.prdet]}>
                    <View style={[styles.flxdir]}>                      
                      <View style={[styles.flxdir]}>
                        <Text style={styles.ogpriceModal}> {(vendorDetails.products[productIndex].discountedPrice * vendorDetails.products[productIndex].quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                        </Text>
                        <Text style={[styles.ogpriceModal1]}>{currency} </Text>                        
                      </View>                    
                    </View>
                  </View>
                </View>
              </View>  
            </View>}
               <View style={[styles.marginBL20]}>
               <View style={[styles.labelDrop]}><Text style={{fontSize:13,fontFamily:"Montserrat-Bold",color:'#000000',}}>Reason for Return<Text style={[CommonStyles.errorText,{fontSize:12}]}>*</Text></Text></View>
              <View style={[styles.inputWrapper]}>              
                <View style={styles.inputTextWrapper}>                  
                  <Dropdown
                  underlineColorAndroid ='transparent'
                    // placeholder         = {"Reason for Return..."}
                    onChangeText        = {(value) => setReason(value)}
                    data                = {getReasons}
                    value               = {reason}
                    containerStyle      = {styles.ddContainer}
                    dropdownOffset      = {{ top: 0, left: 0 }}
                    itemTextStyle       = {styles.ddItemText}
                    inputContainerStyle = {styles.ddInputContainer}
                    labelHeight         = {10}
                    tintColor           = {'#FF8800'}
                    labelFontSize       = {15}
                    fontSize            = {15}
                    baseColor           = {'#666'}
                    textColor           = {'#333'}
                    labelTextStyle      = {{ left: 5 }}
                    style               = {styles.ddStyle}
                    disabledLineType    = 'none'
                  />
                </View>
              </View>
              {/* <Text style={styles.tomorroworder}>Your order will be delivered to you by in 60 Minutes.</Text> */}
            </View>           
              <View style={{marginHorizontal:20,}}>
                <View style={[styles.labelDrop]}><Text style={{fontSize:13,fontFamily:"Montserrat-Bold",color:'#000000',}}>Comment<Text style={[CommonStyles.errorText,{fontSize:12}]}>*</Text></Text></View>
                <Input
                  // label   = "Comment"  
                  labelStyle = {styles.labelDrop} 
                  // placeholder           = "Leave a review..."
                  onChangeText          = {(text)=>setComment(text)}
                  autoCapitalize        = "none"
                  keyboardType          = "email-address"
                  inputContainerStyle   = {styles.containerStyle}
                  containerStyle        = {{paddingHorizontal:0}}
                  placeholderTextColor  = {'#bbb'}
                  inputStyle            = {{fontSize: 16}}
                  inputStyle            = {{textAlignVertical: "top"}}
                  // autoCapitalize        = 'characters'
                  multiline             = {true}
                  numberOfLines         = {4}
                  value                 = {comment}
                />
              </View>
              <View style={{flexDirection:'row',justifyContent:"flex-end",marginHorizontal:20}}>
                <TouchableOpacity 
                    style={{height:34,width:34,elevation:5,marginRight:3,justifyContent:'center',alignItems:'center',backgroundColor:"#fff",borderRadius:50}}
                    onPress={() => chooseFromLibrary('openPicker','Return')}
                  >
                  {/* <Icon name="plus" size={12}  type="font-awesome" iconStyle={{paddingHorizontal:5}}  onPress={() => chooseFromLibrary('openCamera','Return')}/> */}
                  <Icon name="image" size={12}  type="font-awesome" />
                </TouchableOpacity>                
              </View>
              <View style={{flexDirection:"row",margin:20}}>
                {
                  returnProductImages && returnProductImages.length > 0 ?
                  returnProductImages.map((item,index)=>{
                    return(
                      <Image
                        source={{uri:item}}
                        resizeMode="cover"
                        style={{height:50,width:50,marginRight:15,backgroundColor:"#f1f1f1"}}
                        PlaceholderContent={<ActivityIndicator color={colors.theme}/>}
                      />
                    )
                  })
                  :
                  null
                }
               </View> 
                <Text style={{fontSize:12,fontFamily:'Montserrat-Regular',color:"#033554",marginHorizontal:20,}}>Refund to :</Text>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => {setChecked('first');setRefund('source')}}>
                  <CheckBox
                    value="first"
                    checkedIcon='dot-circle-o'
                    checkedColor='#033554'                              
                    uncheckedIcon='circle-o'
                    uncheckedColor='#033554'
                    size={10}
                    checked={checked === 'first' ? true : false}
                    disabled={order?.paymentDetails?.paymentMethod === "creditdebitcard" ?false : true}
                    onPress={() => {setChecked('first');setRefund('source')}}
                  />
                  <Text style={styles.free}>The Source (Valid for card payments only)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => {setChecked('second');setRefund('credit')}}>
                  <CheckBox
                    style={styles.radiobtn}
                    value="second"
                    checkedIcon='dot-circle-o'
                    checkedColor='#033554'                              
                    uncheckedIcon='circle-o'
                    uncheckedColor='#033554'
                    size={10}
                    checked={checked === 'second' ? true : false}
                    onPress={() => {setChecked('second');setRefund('credit')}}
                  />
                  <Text style={styles.free}>Add to Credit Points</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}  onPress={()=>setTermsChecked(true)}>
                  <CheckBox
                    style={styles.radiobtn}
                    checkedIcon='dot-circle-o'
                    checkedColor='#033554'                              
                    uncheckedIcon='circle-o'
                    uncheckedColor='#033554'
                    size={10}
                    checked={checkedTerms}
                    onPress={()=>setTermsChecked(!checkedTerms)}
                  />
                  <Text style={styles.free1}>I agree to <Text style={{textDecorationLine:'underline'}} onPress={()=>setTermsModal(true)}>Return Policy</Text></Text>
              </TouchableOpacity>
              <View style = {{marginHorizontal:40,marginBottom:25}}>
                <FormButton 
                    onPress    = {()=>submitReturn()}
                    title       = {'Submit'}
                    background  = {true}
                    disabled    = {!checkedTerms}
                  />
             </View>   
          </ScrollView>
        </Modal>
        <Modal isVisible={modalTerms}
          onBackdropPress={() => setTermsModal(false)}
          onRequestClose={() => setTermsModal(false)}
          coverScreen={true}
          hideModalContentWhileAnimating={true}
          style={{ zIndex: 999 }}
          animationOutTiming={500}>
          <View style={{ backgroundColor: "#fff", borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10}}>
          <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
                {
                    pageBlockes && pageBlockes.length>0?
                        pageBlockes.map((item,index)=>{
                            const result = item.block_id.blockDescription.replace(/<[^>]+>/g, '');
                            return(
                                <View style={{flex:1,paddingHorizontal:15}}>
                                    {result!=="" && <HTML ignoredTags={['br']} html={item.block_id.blockDescription}/>}
                                    {item.block_id.fgImage1 &&<Image
                                        source={{uri:item.block_id.fgImage1}}
                                        style={{height:200,width:"100%"}}
                                        resizeMode={"stretch"}
                                    />}
                                </View>                                    
                            )
                        })
                    :
                    []
                }
            </ScrollView>
          </View>
        </Modal>
        <Modal isVisible={imageLoading}
          coverScreen={true}
          hideModalContentWhileAnimating={true}
          style={{ zIndex: 999 }}
          animationOutTiming={500}>
              <Loading />
        </Modal>
      </React.Fragment>
    );
  })