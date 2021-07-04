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
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const ListOfOrders =(props)=> {
    const [orderList,setOrderList] = useState([]);
    useEffect(() => {
        getList()
    },[]);

    const getList =()=>{
        var payload={
            "status" : props.status,
            "latitude":25.2143,
            "longitude":55.4284
        }
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
            Approved
        </Text>
        </View>
    );
    };
    const rightSwipeActions = () => {
    return (
        <View
        style={{
            backgroundColor: '#ff8303',
            justifyContent: 'center',
            alignItems: 'flex-end',
        }}
        >
        <Text
            style={{
            color: '#1b1a17',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingHorizontal: 30,
            paddingVertical: 20,
            }}
        >
            Reject
        </Text>
        </View>
    );
    };
    const swipeFromLeftOpen = () => {
      alert('Swipe from left');
    };
    const swipeFromRightOpen = () => {
    //   alert('Swipe from right');
    };
    const _renderlist = ({ item, index })=>{
        return (
            <Card containerStyle={{padding:0}}>
            <Swipeable
                renderLeftActions={LeftSwipeActions}
                // renderRightActions={rightSwipeActions}
                // onSwipeableRightOpen={swipeFromRightOpen}
                onSwipeableLeftOpen={swipeFromLeftOpen}
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
            <FlatList
            data={orderList}
            keyExtractor={(item) => item.id}
            renderItem={_renderlist} 
                />
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