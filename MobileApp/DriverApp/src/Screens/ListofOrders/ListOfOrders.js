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
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const ListOfOrders =()=> {
    const [orderList,setOrderList] = useState([]);
    useEffect(() => {
        getList()
    },[]);

    const getList =()=>{

        setOrderList([
            {
                vendorName       : "Lulu HyperMarket",
                vendorAddress    : "Silicon Oasis",
                vendorDistance   : "0.5 KM",
                customerAddress    : "Silicon Oasis",
                customerDistance   : "0.2 KM"
            },
            {
                vendorName       : "Cjoitaram",
                vendorAddress    : "Silicon Oasis",
                vendorDistance   : "1 KM",
                customerAddress    : "Silicon Oasis",
                customerDistance   : "1.2 KM"
            },
            {
                vendorName       : "Almaya",
                vendorAddress    : "Silicon Oasis",
                vendorDistance   : "1.2 KM",
                customerAddress    : "Silicon Oasis",
                customerDistance   : "3.2 KM"
            },
            {
                vendorName       : "Almadina",
                vendorAddress    : "Silicon Oasis",
                vendorDistance   : "2.3 KM",
                customerAddress    : "Silicon Oasis",
                customerDistance   : "3.2 KM"
            },
            {
                vendorName       : "Lulu HyperMarket",
                vendorAddress    : "Silicon Oasis",
                vendorDistance   : "2.5 KM",
                customerAddress    : "Silicon Oasis",
                customerDistance   : "4.2 KM"
            },
            {
                vendorName       : "Cjoitaram",
                vendorAddress    : "Silicon Oasis",
                vendorDistance   : "2.8 KM",
                customerAddress    : "Silicon Oasis",
                customerDistance   : "2.2 KM"
            },
            {
                vendorName       : "Almaya",
                vendorAddress    : "Silicon Oasis",
                vendorDistance   : "3.2 KM",
                customerAddress    : "Silicon Oasis",
                customerDistance   : "2.2 KM"
            },
            {
                vendorName       : "Almadina",
                vendorAddress    : "Silicon Oasis",
                vendorDistance   : "4.2 KM",
                customerAddress    : "Silicon Oasis",
                customerDistance   : "3.2 KM"
            }
        ])
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
    //   alert('Swipe from left');
    };
    const swipeFromRightOpen = () => {
    //   alert('Swipe from right');
    };
    const _renderlist = ({ item, index })=>{
        return (
            <Card containerStyle={{padding:0}}>
            <Swipeable
                renderLeftActions={LeftSwipeActions}
                renderRightActions={rightSwipeActions}
                onSwipeableRightOpen={swipeFromRightOpen}
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
                }}
                >
                    <View style={{flexDirection:"row",justifyContent:"space-between"}} >
                    <View style={{flex:0.49,borderRightWidth:1}}>
                        <Text>{item.vendorName}</Text>
                        <Text>{item.vendorAddress}</Text>
                        <Text>{item.vendorDistance}</Text>
                    </View>
                    <View style={{flex:0.49}}>
                        <Text>{item.customerAddress}</Text>
                        <Text>{item.customerDistance}</Text>
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