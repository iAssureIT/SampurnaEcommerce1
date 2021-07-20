import React,{useEffect,useState,useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Header, Icon, Card, Button }       from 'react-native-elements';
import axios from 'axios';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles';
import {
    useDispatch,
    useSelector }           from 'react-redux';
import {Footer}                     from '../../ScreenComponents/Footer/Footer.js';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import {REACT_APP_BASE_URL} from '@env';
import openSocket           from 'socket.io-client';
const  socket = openSocket(REACT_APP_BASE_URL,{ transports : ['websocket'] });
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const NewOrders =(props)=> {
    const [orderList,setOrderList] = useState([]);
    const isFocused = useIsFocused();
    const ref =useRef(null);
    let row: Array<any> = [];
    let prevOpenedRow;

    const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));
    useEffect(() => {
        var payload={
            "status" : "Ready to Dispatch",
            "user_id" : store.userDetails.user_id
        }
        socket.emit('nearest_vendor_orders',payload);
        socket.on('getVendorOrderList',(response)=>{
            console.log("response",response);
            setOrderList(response);
            if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();

            }
            prevOpenedRow = row[index];
            console.log("index",index);
        })
    },[props,isFocused]);


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
            Approved
        </Text>
        </View>
    );
    };

 
  
    const swipeFromLeftOpen = (order_id,vendor_id,index) => {
       
        var payload = {
            order_id        : order_id,
            vendor_id       : vendor_id,
            userid          : store.userDetails.user_id,
            changeStatus    : "Allocated"
        }
        console.log("payload",payload);
        axios.patch('/api/orders/changevendororderstatus',payload)
        .then(res=>{
            console.log("res",res);
              getList(index);
        })
        .catch(err=>{
            console.log("err",err);
        })
    };;
    const swipeFromRightOpen = () => {
    //   alert('Swipe from right');
    };
    const _renderlist = ({ item, index })=>{
        console.log("index",index);
        return (
            <TouchableOpacity onPress={()=>props.navigation.navigate('OrderSummary',{order_id: item._id,vendor_id: item.vendorOrders.vendor_id})}>
            <Card containerStyle={{padding:0}}>
            <Swipeable
                 ref={ref => row[index] = ref}
                 friction={2}
                 leftThreshold={80}
                 rightThreshold={40}
                 renderLeftActions={LeftSwipeActions}
                onSwipeableLeftOpen={()=>swipeFromLeftOpen(item._id,item.vendorOrders.vendor_id,)}
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
          </TouchableOpacity>  
        )    
    };

    return (
        <View style={{flex:1}}>
            <View style={{flex:1,marginBottom:60}}>
            {orderList  && orderList.length >0?
            <FlatList
                    data={orderList}
                    keyExtractor={(item) => item.id}
                    renderItem={_renderlist} 
                />
                :
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>No Order Found</Text>
                </View>}
            </View>  
            <Footer selected={"0"}/>
        </View>
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
    }
    });