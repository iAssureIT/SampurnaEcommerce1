import React,{useEffect,useState,useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  RefreshControl
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Header, Icon, Card, Button }   from 'react-native-elements';
import axios                            from 'axios';
import CommonStyles                     from '../../AppDesigns/currentApp/styles/CommonStyles';
import {
    useDispatch,
    useSelector }                       from 'react-redux';
import {Footer}                         from '../../ScreenComponents/Footer/Footer.js';
import moment                           from 'moment';
import Loading                          from '../../ScreenComponents/Loading/Loading.js';
import { TouchableOpacity }             from 'react-native';
import { useIsFocused }                 from "@react-navigation/native";
import {REACT_APP_BASE_URL}             from '@env';
import openSocket                       from 'socket.io-client';
import { ActivityIndicator } from 'react-native';

const  socket = openSocket(REACT_APP_BASE_URL,{ transports : ['websocket'] });
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const NewOrders =(props)=> {
    const [loading,setLoading] =useState(true);
    const [orderList,setOrderList] = useState([]);
    const isFocused = useIsFocused();
    const ref =useRef(null);
    const [refresh,setRefresh]=useState(false);
    let row: Array<any> = [];
    let prevOpenedRow;

    const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));
    useEffect(() => {
        setLoading(true);
       getList();
    },[props,isFocused]);


    const Separator = () => <View style={styles.itemSeparator} />;
    const LeftSwipeActions = (key) => {
    return (
        <View
        style={{ flex: 1, backgroundColor: '#226E1B',borderRadius:7 ,justifyContent: 'center' }}
        key = {key}
        >
        <Text
            style={{
                color: '#fff',
                fontSize:25,
                paddingHorizontal: 10,
                fontFamily: "Montserrat-Bold",
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

    const getList=()=>{
        setOrderList([]);
        var payload={
            "status" : "Processing",
            "user_id" : store.userDetails.user_id
        }
        socket.emit('nearest_vendor_orders',payload);
        socket.on('getVendorOrderList',(response)=>{
            console.log("response",response);
            setOrderList(response);
            setLoading(false);
            setRefresh(false);
        })
    }


    const refreshControl=()=>{
        setRefresh(true);
        getList();
    }
 
  
    const swipeFromLeftOpen = (order_id,vendor_id) => {
        setLoading(true);
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
              getList();
        })
        .catch(err=>{
            setLoading(false);
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
            <Card containerStyle={{padding:0,borderRadius:7,marginHorizontal:0}}>
            <Swipeable
                 ref={ref => row[index] = ref}
                 friction={2}
                 leftThreshold={80}
                 rightThreshold={40}
                 renderLeftActions={LeftSwipeActions}
                 onSwipeableClose={LeftSwipeActions}
                onSwipeableLeftOpen={()=>swipeFromLeftOpen(item._id,item.vendorOrders.vendor_id)}
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
                <View style={CommonStyles.card1}>
                    <View style={CommonStyles.cardTop}>
                            <View style={{flex:.4}}>
                                <Text style={CommonStyles.cardTopText}>Order No {item.orderID}</Text>
                            </View>
                            <View style={{flex:.6,alignItems:'flex-end'}}>
                                <Text style={CommonStyles.cardTopText2}>Date {moment(item?.createdAt).format('DD-MM-YYYY hh:mm')}</Text>
                            </View>    
                    </View>         
                    <View style={CommonStyles.cardBottom}>
                        <View style={CommonStyles.CardBS1}>
                            <View style={styles.box1}>
                                <Text style={CommonStyles.boxLine1}>From Current Location</Text>
                            </View>                            
                            <View style={styles.box1}>
                                {/* <Icon name="map-marker-radius" type="material-community" size={20} color={"#aaa"} /> */}
                                <Text style={CommonStyles.boxLine1} numberOfLines={1}>Vendor: <Text style={{fontFamily:"Montserrat-SemiBold"}}>{item?.vendorDetails?.companyName}</Text></Text>
                            </View>
                            <View style={styles.box1}>
                                {/* <Icon name="map-marker-radius" type="material-community" size={20} color={"#aaa"} /> */}
                                <Text style={CommonStyles.boxLine1} numberOfLines={3}>{item?.vendorDetails?.locations[0]?.addressLine1+", "+item?.vendorDetails?.locations[0]?.addressLine2}</Text>
                            </View>
                            <View style={styles.box1_L}>
                                <Text style={[CommonStyles.boxLine1]}>Pickup point :</Text>                                
                                <Text style={[CommonStyles.boxLine2]}>
                                    <Icon name="map-marker-radius" type="material-community" size={10} color={"#033554"} />
                                    {item.vendorOrders.vendorDistance} Km away
                                </Text>
                            </View>
                        </View>
                        {/* <View style={{flex:.5,backgroundColor:'green'}} >
                            <View style={{height:120,width:1,borderWidth:0.3,borderColor:"#eee"}} />
                        </View> */}
                        <View style={CommonStyles.CardBS2}>
                            <View style={styles.box1}>
                                <Text style={CommonStyles.boxLine1}>From Vendor Location</Text>
                            </View>                            
                            <View style={styles.box1}>
                                {/* <Icon name="map-marker-radius" type="material-community" size={20} color={"#aaa"} /> */}
                                <Text style={CommonStyles.boxLine1} numberOfLines={3}>Address:{item.deliveryAddress.addressLine1+", "+item.deliveryAddress.addressLine2}</Text>
                            </View>
                            <View style={styles.box1_L}>
                                <Text style={[CommonStyles.boxLine1]}>Delivery point:</Text>                                
                                <Text style={[CommonStyles.boxLine2]}>
                                    <Icon name="map-marker-radius" type="material-community" size={10} color={"#033554"} />
                                    {item.vendorOrders.vendorToCustDist} Km away
                                </Text>
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
            {loading ?
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Loading />
                </View> 
                :
                <View style={{flex:1,marginBottom:60}}>
                    <View style={{flex:1}}>
                        {orderList  && orderList.length >0?
                        <FlatList
                            data={orderList}
                            keyExtractor={(item) => item.id}
                            renderItem={_renderlist} 
                            refreshControl={
                                <RefreshControl
                                refreshing={refresh}
                                onRefresh={() => refreshControl()}
                                />
                            } 
                        />
                        :
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={CommonStyles.noDataFound}>No Order Found</Text>
                        </View>}
                    </View>
                </View>  
            }
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
    },
    box1_L:{
        paddingVertical:2,
    },
    
    });