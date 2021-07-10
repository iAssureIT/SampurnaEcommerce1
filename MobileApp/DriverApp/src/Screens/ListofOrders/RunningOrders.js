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
import moment from 'moment';
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const RunningOrders =(props)=> {
    const [orderList,setOrderList] = useState([]);
    useEffect(() => {
        getList()
    },[]);

    const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));

    const getList =()=>{
        var payload={
            "status" : "On the Way",
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
            {
               props.status === "Ready to Dispatch"?
                "Approved"
                :
              props.status === "Approved" ?
                 "On the Way"
                 :
                "Delivered"
            }
        </Text>
        </View>
    );
    };
  
    const swipeFromLeftOpen = (order_id,vendor_id) => {
        var payload = {
            order_id        : order_id,
            vendor_id       : vendor_id,
            userid          : store.userDetails.user_id
        }
        if(props.status === "Ready to Dispatch"){
             payload.changeStatus   = "On the Way";
        }else if(props.status === "Approved"){
            payload.changeStatus   = "On the Way";
        }else if(props.status === "On the Way"){
            payload.changeStatus   = "Delivered";
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
    };
    const swipeFromRightOpen = () => {
    //   alert('Swipe from right');
    };
    const _renderlist = ({ item, index })=>{
        return (
            <Card containerStyle={{padding:0}}>
                <View
                style={{
                    paddingVertical: 5,
                    paddingHorizontal:5,
                    backgroundColor: 'white',
                    height:100
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
                   <Text style={CommonStyles.label}>Client Name:</Text>
                   <Text style={[CommonStyles.label,{fontFamily:"Montserrat-Regular"}]}> {item.deliveryAddress.name}</Text>
                   <Text style={[CommonStyles.label,{fontFamily:"Montserrat-Regular",textDecorationLine: 'underline',color:colors.cartButton}]}> {item.deliveryAddress.mobileNumber}</Text>
                </View>
                <View style={{flexDirection:"row"}} >
                   <Text style={CommonStyles.label}>Address: <Text numberOfLines={2} style={[CommonStyles.label,{fontFamily:"Montserrat-Regular"}]}> {item.deliveryAddress.addressLine1+" "+item.deliveryAddress.addressLine2}</Text></Text>
                </View>
                </View>
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
            <Footer selected={"2"}/>
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