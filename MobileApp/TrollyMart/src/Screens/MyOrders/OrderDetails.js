import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
}                       from 'react-native';
import { Icon, Card,Button,Rating,Input } from "react-native-elements";
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
  const [imageLoading,setImageLoading] = useState([]);
  const [modalTerms,setTermsModal] = useState(false);
  const [pageBlockes,setPageBlocks]       = useState([]);

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
        // "status"          		: "New"
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
        "product_id"      		: vendorDetails.products[productIndex]._id,
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
      console.log("formValues",formValues);
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
    axios.post('/api/customerReview/get/single/customer/review',formValues)
    .then(res=>{
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
                            console.log("Data",Data);
                            console.log("state",state);
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

    return (
      <React.Fragment>
        {/* <HeaderBar3
          goBack={navigation.goBack}
          navigate={navigation.navigate}
          headerTitle={"My Orders Details"}
          toggle={() =>toggle()}
          openControlPanel={() => openControlPanel()}
        /> */}
      {loading?
        <Loading/>
        :
        globalSearch.search ?
          <SearchSuggetion />
        :
        <View style={styles.superparent}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <View style={styles.formWrapper}>
              <View style={styles.parent}>

                <View style={[styles.prodinfoparent]}>
                  <View style={{flexDirection:'row'}}>
                    <View style={styles.orderid}>
                      <Text style={styles.orderidinfo}>Order No :</Text>
                      <Text style={styles.orderidinfo}>{order.orderID}</Text>
                    </View>
                    <View style={styles.orderid}>
                      <Text style={styles.orderidinfo}>Date : </Text>
                      <Text style={styles.orderidinfo}>{moment(order.createdAt).format("DD/MM/YYYY hh:mm a")}</Text>
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
                        <View style={{marginBottom:5}}>
                          <Text style={[styles.totaldata]}>{vendor.vendor_id.companyName}</Text>
                        </View> 
                        <View style={styles.orderstatusmgtop}>
                          {
                            vendor && vendor.deliveryStatus
                              && vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status !== 'Cancelled' ?
                              <View style={styles.orderstatus}>
                                <StepIndicator
                                  customStyles={customStyles}
                                  currentPosition={postion1}
                                  labels={labels}
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
                          // console.log("pitem===>", pitem);
                          return (
                            <Card containerStyle={styles.prodorders} wrapperStyle={{flexDirection:"row",flex:1}}>
                              <View style={{flex:0.3}}>
                                {pitem.productImage[0] ?<Image
                                  style={styles.img15}
                                  source={{ uri: pitem.productImage[0] }}
                                  resizeMode="contain"
                                />:
                                <Image
                                  source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                                  style={styles.img15}
                                />
                              }
                              </View>
                              <View style={{flex:0.7,paddingHorizontal:5}}>
                                <Text style={styles.prodinfo}>{pitem.productName}</Text>
                                <Text style={styles.prodinfo}> {pitem.quantity} Pack </Text>
                                <View style={styles.flx4}>
                                  <View style={[styles.flx1, styles.prdet,{marginVertical:5}]}>
                                    <View style={[styles.flxdir]}>
                                      <View style={[styles.flxdir]}>
                                        <Text style={styles.ogprice}>{currency} </Text>
                                        {pitem.discountPercent > 0 &&<Text style={styles.discountpricecut}>{(pitem.originalPrice * pitem.quantity).toFixed(2)}</Text>}
                                      </View>
                                      <View style={[styles.flxdir,{alignItems:"center"}]}>
                                          <Text style={styles.ogprice}> {(pitem.discountedPrice * pitem.quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                          </Text>
                                      </View>
                                      {pitem.discountPercent > 0 &&<View style={[styles.flxdir,{alignItems:"center"}]}>
                                          <Text style={styles.ogprice}>( {pitem.discountPercent} % OFF) <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                                          </Text>
                                      </View>}
                                    </View>
                                    {labels.indexOf(vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status) >= 3 &&
                                        <View style={[styles.flxdir,{alignItems:"center",marginTop:10,flex:1}]}>
                                        {pitem.productStatus ==="Return Requested" ?
                                         <View style={{flex:.5}}>
                                         <Text style={[styles.ogprice,]}>{pitem.productStatus}</Text>
                                       </View>
                                       :
                                      <View style={{flex:.5}}>
                                        <Text style={[styles.ogprice,]} onPress={()=>{setReturnModal(true);setVendorDetails(vendor);setProductIndex(index)}}>Return</Text>
                                      </View>}  
                                      <View style={{flex:.5}}>
                                        {pitem.isReview ?
                                          <Text style={[styles.ogprice,{alignSelf:'flex-end'}]} onPress={()=>{setModal(true);setVendorDetails(vendor);setProductIndex(index);getSingleReview(pitem._id)}}>Edit Review</Text>
                                          :
                                          <Text style={[styles.ogprice,{alignSelf:'flex-end'}]} onPress={()=>{setModal(true);setVendorDetails(vendor);setProductIndex(index)}}>Review</Text>
                                        } 
                                      </View>  
                                    </View>}
                                  </View>
                                </View>
                              </View>  
                            </Card>
                          );
                        })}
                        <View style={styles.totaldetails}>
                          <View style={styles.flxdata}>
                            <View style={{ flex: 0.6,flexDirection:"row" }}>
                              <Text numberOfLines={1} style={styles.totaldata}>{vendor.vendorName}</Text>
                              <Text style={styles.totaldata}>Total</Text>
                            </View>
                            <View style={{ flex: 0.4 }}>
                              <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                <Text style={styles.totalpriceincart}>{currency} {vendor.vendor_afterDiscountTotal && vendor.vendor_afterDiscountTotal.toFixed(2)}</Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.flxdata}>
                            <View style={{ flex: 0.6 }}>
                              <Text style={styles.totaldata}>You Saved </Text>
                            </View> 
                            <View style={{ flex: 0.4 }}>
                              <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                <Text style={styles.totalpriceincart}> - </Text>
                            <Text style={styles.totalpriceincart}>{currency} {vendor.vendor_discountAmount > 1 ? vendor.vendor_discountAmount.toFixed(2) : 0.00}</Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.flxdata}>
                            <View style={{ flex: 0.6 }}>
                              <Text style={styles.totaldata}>Delivery Charges </Text>
                            </View> 
                            <View style={{ flex: 0.4 }}>
                              <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <Text style={styles.totalpriceincart}>{currency} {vendor.vendor_shippingCharges}</Text>
                              </View>
                            </View>
                          </View>
                          <View>
                          </View>
                        </View>
                        {cancelButton(order.createdAt) ?
                            vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status && vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status !== 'Cancelled'  && vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status === "Delivered & Paid" ?
                            null
                            :
                            order.vendorOrders.length>1 && 
                            <View style={[{paddingRight:0,height:30,width:150,alignSelf:'flex-end',marginBottom:15}]}>
                              {vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status && vendor.deliveryStatus[vendor.deliveryStatus.length - 1].status !== 'Cancelled'&&
                                  <Text style={[CommonStyles.linkText,{fontFamily:"Montserrat-Medium",alignSelf:'flex-end'}]} onPress={()=>cancelorderbtn(order._id,vendor.vendor_id._id)}>Cancel this order</Text>
                              }
                              </View>
                            :
                            null
                          }
                      </View>
                      )
                    })
                    :
                    null
                  }
                <View style={styles.prodinfoparent1}>
                  <View style={styles.totaldetails}>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.totaldata}>Final Total Amount </Text>
                      </View>
                      <View style={{ flex: 0.4 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.afterDiscountTotal.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.totaldata}>Total Savings </Text>
                      </View> 
                      <View style={{ flex: 0.4 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincart}> - </Text>
                          <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.discountAmount.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.totaldata}>Total Tax  </Text>
                      </View> 
                      <View style={{ flex: 0.4 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.taxAmount.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.totaldata}>Discount Coupon Amount </Text>
                      </View> 
                      <View style={{ flex: 0.4 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.afterDiscountCouponAmount.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.totaldata}>Total Delivery Charges </Text>
                      </View> 
                      <View style={{ flex: 0.4 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                      <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.shippingCharges.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{borderWidth:0.5,marginVertical:5,borderColor:"#ddd"}} />
                    <View style={styles.flxdata}>
                      <View style={{ flex: 0.6 }}>
                        <Text style={styles.totaldata}>Grand Total</Text>
                      </View>
                      <View style={{ flex: 0.4 }}>
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                          <Text style={styles.totalpriceincart}>{currency} {order.paymentDetails && order.paymentDetails.netPayableAmount.toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {cancelButton(order.createdAt) ?
                    order.orderStatus && order.orderStatus !== 'Cancelled'  && order.deliveryStatus === "Delivered & Paid" ?
                    null
                    :
                     <View style={[styles.orderdetailsstatus,{paddingRight:0,height:40}]}>
                      {order.orderStatus && order.orderStatus !== 'Cancelled'&&
                       <View style={{justifyContent:'center'}}>
                        <Text style={[CommonStyles.linkText,{fontFamily:"Montserrat-Medium",alignSelf:'center'}]} onPress={()=>cancelorderbtn(order._id,'')}>Cancel order before {moment(order.createdAt).add(order.maxDurationForCancelOrder, 'minutes').format('hh:mm')}</Text>
                        </View>
                      }
                      </View>
                    :
                    null
                  }
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
                    titleStyle={styles.buttonText}
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
          style={{ paddingHorizontal: '5%', zIndex: 999 }}
          animationOutTiming={500}>
          <View style={{ backgroundColor: "#fff",borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
          {vendorDetails&&<Card containerStyle={styles.prodorders} wrapperStyle={{flexDirection:"row",flex:1}}>
              <View style={{flex:0.3}}>
                { vendorDetails.products[productIndex].productImage && vendorDetails.products[productIndex].productImage[0] ?<Image
                  style={styles.img15}
                  source={{ uri: vendorDetails.products[productIndex].productImage[0] }}
                  resizeMode="contain"
                />:
                <Image
                  source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                  style={styles.img15}
                />
              }
              </View>
              <View style={{flex:0.7,paddingHorizontal:5}}>
                <Text style={styles.prodinfo}>{vendorDetails.products[productIndex].productName}</Text>
                <View style={styles.flx4}>
                  <View style={[styles.flx1, styles.prdet]}>
                    <View style={[styles.flxdir]}>
                      <View style={[styles.flxdir]}>
                        <Text style={styles.ogprice}>{currency} </Text>
                        {vendorDetails.products[productIndex].discountPercent > 0 &&<Text style={styles.discountpricecut}>{(vendorDetails.products[productIndex].originalPrice * vendorDetails.products[productIndex].quantity).toFixed(2)}</Text>}
                      </View>
                      <View style={[styles.flxdir,{alignItems:"center"}]}>
                          <Text style={styles.ogprice}> {(vendorDetails.products[productIndex].discountedPrice * vendorDetails.products[productIndex].quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                          </Text>
                      </View>
                      {vendorDetails.products[productIndex].discountPercent > 0 &&<View style={[styles.flxdir,{alignItems:"center"}]}>
                          <Text style={styles.ogprice}>( {vendorDetails.products[productIndex].discountPercent} % OFF) <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                          </Text>
                      </View>}
                    </View>
                  </View>
                </View>
              </View>  
            </Card>}
            <Rating
              // showRating
              startingValue={rating}
              onFinishRating={(e)=>setRating(e)}
              style={{ paddingVertical: 10 }}
            />
              <Input
                label   = "Leave a review"   
                // placeholder           = "Leave a review..."
                onChangeText          = {(text)=>setReview(text)}
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
                value                 = {review}
              />
              <View style={{flexDirection:'row',justifyContent:"flex-end",marginBottom:15}}>
                <Icon name="plus" size={15}  type="font-awesome" iconStyle={{paddingHorizontal:5}}  onPress={() => chooseFromLibrary('openCamera','Review')}/>
                <Icon name="image" size={15}  type="font-awesome" onPress={() => chooseFromLibrary('openPicker','Review')}/>
              </View>
              <View style={{flexDirection:"row",marginBottom:15}}>
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
               
             <FormButton 
                onPress    = {()=>submitReview()}
                title       = {'Submit'}
                background  = {true}
              /> 
          </View>
        </Modal>

        <Modal isVisible={returnModal}
          onBackdropPress={() => setReturnModal(false)}
          onRequestClose={() => setReturnModal(false)}
          coverScreen={true}
          hideModalContentWhileAnimating={true}
          style={{ zIndex: 999 }}
          animationOutTiming={500}>
          <View style={{ backgroundColor: "#fff", borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.theme }}>
          {vendorDetails&&<Card containerStyle={styles.prodorders} wrapperStyle={{flexDirection:"row",flex:1}}>
              <View style={{flex:0.3}}>
                { vendorDetails.products[productIndex].productImage && vendorDetails.products[productIndex].productImage[0] ?<Image
                  style={styles.img15}
                  source={{ uri: vendorDetails.products[productIndex].productImage[0] }}
                  resizeMode="contain"
                />:
                <Image
                  source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                  style={styles.img15}
                />
              }
              </View>
              <View style={{flex:0.7,paddingHorizontal:5}}>
                <Text style={styles.prodinfo}>{vendorDetails.products[productIndex].productName}</Text>
                <View style={styles.flx4}>
                  <View style={[styles.flx1, styles.prdet]}>
                    <View style={[styles.flxdir]}>
                      <View style={[styles.flxdir]}>
                        <Text style={styles.ogprice}>{currency} </Text>
                        {vendorDetails.products[productIndex].discountPercent > 0 &&<Text style={styles.discountpricecut}>{(vendorDetails.products[productIndex].originalPrice * vendorDetails.products[productIndex].quantity).toFixed(2)}</Text>}
                      </View>
                      <View style={[styles.flxdir,{alignItems:"center"}]}>
                          <Text style={styles.ogprice}> {(vendorDetails.products[productIndex].discountedPrice * vendorDetails.products[productIndex].quantity).toFixed(2)}<Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                          </Text>
                      </View>
                      {vendorDetails.products[productIndex].discountPercent > 0 &&<View style={[styles.flxdir,{alignItems:"center"}]}>
                          <Text style={styles.ogprice}>( {vendorDetails.products[productIndex].discountPercent} % OFF) <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                          </Text>
                      </View>}
                    </View>
                  </View>
                </View>
              </View>  
            </Card>}
               <View style={[styles.confirmbtn, styles.marginBottom20]}>
              <Text style={[CommonStyles.errorText,{marginBottom:15}]}>All fields are madetory</Text>
              <View style={[styles.inputWrapper]}>
                <View style={styles.inputTextWrapper}>
                  <Dropdown
                  underlineColorAndroid ='transparent'
                    placeholder         = {"Reason for Return..."}
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
              
              <Input
                label   = "Comment"   
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
              <View style={{flexDirection:'row',justifyContent:"flex-end"}}>
                <Icon name="plus" size={15}  type="font-awesome" iconStyle={{paddingHorizontal:5}}  onPress={() => chooseFromLibrary('openCamera','Return')}/>
                <Icon name="image" size={15}  type="font-awesome" onPress={() => chooseFromLibrary('openPicker','Return')}/>
              </View>
              <View style={{flexDirection:"row"}}>
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
              <View style={{paddingVertical:15}}>
                <Text style={CommonStyles.label}>Refunded To:</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <RadioButton
                    style={styles.radiobtn}
                    value="first"
                    status={checked === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => {setChecked('first');setRefund('source')}}
                  />
                  <Text style={styles.free}>The Source (Valid for card payments only)</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <RadioButton
                    style={styles.radiobtn}
                    value="second"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => {setChecked('second');setRefund('credit')}}
                  />
                  <Text style={styles.free}>Add to Credit Points</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',paddingVertical:5}}>
                <RadioButton
                  style={styles.radiobtn}
                  value={checked}
                  status={checkedTerms ? 'checked' : 'unchecked'}
                  onPress={() => {setTermsChecked(true)}}
                />
                <Text style={styles.free}>I agree to <Text style={[CommonStyles.linkText,{fontSize:12}]}  onPress={()=>setTermsModal(true)}>Terms & conditions</Text></Text>
              </View>
             <FormButton 
                onPress    = {()=>submitReturn()}
                title       = {'Submit'}
                background  = {true}
              />
          </View>
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
      </React.Fragment>
    );
  })