import React,{useEffect,useState} from 'react';
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
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const AcceptedOrders =(props)=> {
    const [orderList,setOrderList] = useState([]);
    useEffect(() => {
        getList()
    },[]);

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
            setOrderList(res.data)
        })
        .catch(err=>{
            console.log("err",err);
        })
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
  
    const swipeFromLeftOpen = (order_id,vendor_id) => {
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
            getList();
        })
        .catch(err=>{
            console.log("err",err);
        })
    };;
    const _renderlist = ({ item, index })=>{
        return (
            <Card containerStyle={{padding:0}}>
            <Swipeable
                renderLeftActions={props.status !== "Delivered"&&LeftSwipeActions}
                // renderRightActions={rightSwipeActions}
                // onSwipeableRightOpen={swipeFromRightOpen}
                onSwipeableLeftOpen={()=>props.status !== "Delivered"&&swipeFromLeftOpen(item._id,item.vendorOrders.vendor_id,)}
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
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                    backgroundColor: 'white',
                    height:160
                }}
                >
                <View style={{flexDirection:"row",justifyContent:"space-between"}} >
                    <View style={{flex:0.49,borderRightWidth:1}}>
                        <Text style={CommonStyles.label}>Vendor</Text>
                        <Text>{item.vendorDetails.companyName}</Text>
                        <Text>{item.vendorDetails.locations[0].addressLine2}</Text>
                        <Text style={[CommonStyles.label]}>{item.vendorDetails.locations[0].vendorDist} Km</Text>
                    </View>
                    <View style={{flex:0.49}}>
                        <Text style={CommonStyles.label}>Delivery</Text>
                        <Text>{item.deliveryAddress.addressLine1+", "+item.deliveryAddress.addressLine2}</Text>
                         <Text style={[CommonStyles.label]}>{item.vendorDetails.locations[0].vendorToCustDist} Km</Text>
                    </View>   
                    </View>       
                </View>
            </Swipeable>
            </Card> 
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
    });