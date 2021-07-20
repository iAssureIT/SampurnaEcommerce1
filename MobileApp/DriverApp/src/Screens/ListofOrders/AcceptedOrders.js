import React,{useEffect,useState,useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity
} from 'react-native';
import Swipeable                                    from 'react-native-gesture-handler/Swipeable';
import { Header, Icon, Card, Input, colors }       from 'react-native-elements';
import axios                                        from 'axios';
import CommonStyles                                 from '../../AppDesigns/currentApp/styles/CommonStyles';
import {
    useDispatch,
    useSelector }                                   from 'react-redux';
import {Footer}                                     from '../../ScreenComponents/Footer/Footer.js';
import { useIsFocused }                             from "@react-navigation/native";
import Modal                                        from "react-native-modal";
import { Dropdown }                                 from 'react-native-material-dropdown-v2';
import moment                                       from 'moment';
import {FormButton}                                 from '../../ScreenComponents/FormButton/FormButton';

const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const AcceptedOrders =(props)=> {
    const [orderList,setOrderList] = useState([]);
    const isFocused = useIsFocused();
    const [getReasons,setGetReasons]=useState([]);
    const [modal,setModal] = useState(false);
    const [reason,setReason]=useState('');
    const [order_id,setOrderId] = useState('');
    const [vendor_id,setVendorId] = useState('');
    const [comment, setComment] = useState('')
    const ref =useRef(null);
    let row: Array<any> = [];
    let prevOpenedRow;
    useEffect(() => {
        getList();
        getReasons_func();
    },[props,isFocused]);
    const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));

    const getList =()=>{
        var payload={
            "status" : "Allocated",
            "user_id" : store.userDetails.user_id
        }
        console.log("payload",payload);
        axios.post('/api/orders/get/nearest_vendor_orders',payload)
        .then(res=>{
            console.log("res",res);
            setOrderList(res.data);
        })
        .catch(err=>{
            console.log("err",err);
        })
    }

    const getReasons_func=()=>{
        axios.get('/api/orderrejectreasons/get/list')
          .then((response) => {
            console.log("getReasons_func",response);
            var array = response.data.map((a, i) => { return { label: a.reasonOfOrderReject, value: a.reasonOfOrderReject } })
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


    const Separator = () => <View style={styles.itemSeparator} />;
    const LeftSwipeActions = () => {
    return (
        <View
        style={{ flex: 1, backgroundColor: '#ccffbd', justifyContent: 'center' }}
        >
        <Text
            style={{
            color: '#40394a',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingHorizontal: 30,
            paddingVertical: 20,
            }}
        >
           Pick Up
        </Text>
        </View>
    );
    };
  
    const swipeFromLeftOpen = (order_id,vendor_id,index) => {
       
        var payload = {
            order_id        : order_id,
            vendor_id       : vendor_id,
            userid          : store.userDetails.user_id,
            changeStatus    : "On the Way"
        }
        console.log("payload",payload);
        axios.patch('/api/orders/changevendororderstatus',payload)
        .then(res=>{
            console.log("res",res);
            if (prevOpenedRow && prevOpenedRow !== row[index]) {
                prevOpenedRow.close();

              }
              prevOpenedRow = row[index];
              console.log("index",index);
              getList();

        })
        .catch(err=>{
            console.log("err",err);
        })
    };;

    const rightSwipeActions = () => {
        return (
            <View
            style={{ flex: 1, backgroundColor:colors.warning, justifyContent: 'center' }}
            >
            <Text
                style={{
                color: '#fff',
                paddingHorizontal: 10,
                fontWeight: '600',
                paddingHorizontal: 30,
                paddingVertical: 20,
                alignSelf:'flex-end'
                }}
            >
               Reject
            </Text>
            </View>
        );
        };
      
        const swipeFromRightOpen = (order_id,vendor_id,index) => {
            setModal(true);
            setOrderId(order_id);
            setVendorId(vendor_id);
            if (prevOpenedRow && prevOpenedRow !== row[index]) {
                prevOpenedRow.close();
              }
              prevOpenedRow = row[index];
        };

       const  handleSubmit=()=>{
            var payload = {
                order_id        : order_id,
                vendor_id       : vendor_id,
                userid          : store.userDetails.user_id,
                changeStatus    : "Allocation Rejected",
                allocationRejectReason : reason,
                allocationRejectDesc : comment,
                reason          : reason
            }
            console.log("payload",payload);
            axios.patch('/api/orders/changevendororderstatus',payload)
            .then(res=>{
                console.log("res",res);
                setModal(false);
                setReason('');
                setComment('');
                setOrderId('');
                setVendorId('');
                getList();
            })
            .catch(err=>{
                console.log("err",err);
            })
        }

        const closeRow=(index)=>{
            if (prevOpenedRow && prevOpenedRow !== row[index]) {
              prevOpenedRow.close();
            }
            prevOpenedRow = row[index];
          }

       
    const _renderlist = ({ item, index })=>{
        return (
            <TouchableOpacity onPress={()=>props.navigation.navigate('OrderSummary',{order_id: item._id,vendor_id: item.vendorOrders.vendor_id})}>
            <Card containerStyle={{padding:0}}>
            <Swipeable
               ref={ref => row[index] = ref}
               friction={2}
               leftThreshold={80}
               rightThreshold={40}
                renderLeftActions={LeftSwipeActions}
                renderRightActions={rightSwipeActions}
                onSwipeableRightOpen={()=>swipeFromRightOpen(item._id,item.vendorOrders.vendor_id,index)}
                onSwipeableLeftOpen={()=>swipeFromLeftOpen(item._id,item.vendorOrders.vendor_id,index)}
            >
                {/* <View
                style={{
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                    backgroundColor: 'white',
                }}
                >
                <Text style={{ fontSize: 24 }} style={{ fontSize: 20 }}>
                    {text}
                </Text>
                </View> */}
                <View
                style={{
                    paddingVertical: 5,
                    paddingHorizontal:5,
                    backgroundColor: 'white',
                    // height:150
                }}
                >
               <View style={{flexDirection:'row',marginBottom:5}}>
                    <View style={{flex:.4}}>
                        <Text style={{}}>Order No{item.orderID}</Text>
                    </View>
                    <View style={{flex:.6,alignItems:'flex-end'}}>
                        <Text>Date {moment().format('DD-MM-YYYY hh:mm')}</Text>
                    </View>    
               </View>         
                <View style={{flexDirection:"row"}} >
                    <View style={{flex:0.46}}>
                        <View style={styles.box1}>
                            <Text style={CommonStyles.text}>From Current Location</Text>
                        </View>    
                        <View style={styles.box1}>
                            <Icon name="map-marker-radius" type="material-community" size={20} color={"#aaa"} />
                            <Text style={[CommonStyles.label]}>{item.vendorOrders.vendorDistance} Km away</Text>
                        </View>
                        <View style={{flexDirection:'row',paddingVertical:5}}>
                            <Icon name="map-marker-radius" type="material-community" size={20} color={"#aaa"} />
                            <Text numberOfLines={3}>{item?.vendorDetails?.locations[0]?.addressLine1+", "+item?.vendorDetails?.locations[0]?.addressLine2}</Text>
                        </View>
                    </View>
                    <View style={{flex:.05,alignItems:'center'}} >
                        <View style={{height:120,width:1,borderWidth:0.3,borderColor:"#eee"}} />
                    </View>
                    <View style={{flex:0.46}}>
                        <View style={styles.box1}>
                            <Text style={CommonStyles.text}>From Vendor Location</Text>
                        </View>    
                        <View style={styles.box1}>
                            <Icon name="map-marker-radius" type="material-community" size={20} color={"#aaa"} />
                            <Text style={[CommonStyles.label]}>{item.vendorOrders.vendorToCustDist} Km away</Text>
                        </View>
                        <View style={styles.box1}>
                            <Icon name="map-marker-radius" type="material-community" size={20} color={"#aaa"} />
                            <Text numberOfLines={3}>{item.deliveryAddress.addressLine1+", "+item.deliveryAddress.addressLine2}</Text>
                        </View>
                    </View>   
                    </View>       
                </View>
            </Swipeable>
            </Card> 
            <Modal isVisible={modal}
                onBackdropPress={() => setModal(false)}
                onRequestClose={() => setModal(false)}
                coverScreen={true}
                hideModalContentWhileAnimating={true}
                style={{ zIndex: 999 }}
                animationOutTiming={500}>
                <View style={{ backgroundColor: "#fff", borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10}}>
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
                <View style={{paddingVertical:15}}>
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
                </View>
                  <View style={{marginVertical:15}}>
                    <FormButton 
                        onPress    = {()=>{handleSubmit()}}
                        title       = {'Submit'}
                        background  = {true}
                    />
                 </View>   
                </View>
            </Modal>
          </TouchableOpacity>
        )    
    };

    return (
        <>
           {orderList  && orderList.length >0?<FlatList
            data={orderList}
            keyExtractor={(item) => item.id}
            renderItem={_renderlist} 
                />
            :
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text>No Order Found</Text>
            </View>}
            <Footer selected={"1"}/>
        </>
    );

    }


    const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemSeparator: {
        flex: 1,
        height: 1,
        backgroundColor: '#444',
    },
    box1:{
        flexDirection:'row',
        paddingVertical:2
    },
    ddStyle:{
        fontFamily:"Montserrat-Regular",
        backgroundColor:"#fff",
        height:50,
      },
    });