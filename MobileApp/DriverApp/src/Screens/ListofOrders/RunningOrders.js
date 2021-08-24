import React,{useEffect,useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  Linking,
  Platform,
  RefreshControl
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
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import { useIsFocused } from "@react-navigation/native";
import {colors}                         from '../../AppDesigns/currentApp/styles/styles.js';
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const RunningOrders =(props)=> {
    const [loading,setLoading] =useState(true);
    const [orderList,setOrderList] = useState([]);
    const isFocused = useIsFocused();
    const [refresh,setRefresh]=useState(false);
    useEffect(() => {
        setLoading(true);
        getList()
    },[props,isFocused]);

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
            setRefresh(false);
            console.log("res",res);
            setLoading(false);
            setOrderList(res.data)
        })
        .catch(err=>{
            setLoading(false);
            console.log("err",err);
        })
    }


    const refreshControl=()=>{
        setRefresh(true);
        getList();
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
            setLoading(false);
            getList();
        })
        .catch(err=>{
            setLoading(false);
            console.log("err",err);
        })
    };
    const swipeFromRightOpen = () => {
    //   alert('Swipe from right');
    };

    const goToMap=(latitude,longitude)=>{
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${latitude},${longitude}`;
        const label = 'Custom Label';
        const url = Platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url); 
      }

    const _renderlist = ({ item, index })=>{
        return (
            <TouchableOpacity onPress={()=>props.navigation.navigate('OrderSummary',{order_id: item._id,vendor_id: item.vendorOrders.vendor_id})}>
                <View containerStyle={{padding:15,}}>
                    <View
                    style={{
                        paddingVertical: 15,
                        paddingHorizontal:10,
                        marginVertical:10,
                        borderRadius:7,
                        backgroundColor: '#033554',
                        color:'#fff',
                        minHeight:100,                        
                    }}
                    >
                <View style={{flexDirection:'row',marginBottom:5}}>
                        <View style={{flex:.3}}>
                            <Text style={CommonStyles.cardTopText}>Order No {item.orderID}</Text>
                        </View>
                        <View style={{flex:.6,alignItems:'flex-end'}}>
                            <Text style={CommonStyles.cardTopText2}>Date {moment(item.createdAt).format('DD-MM-YYYY hh:mm')}</Text>
                        </View>    
                </View> 
                <View style={{flex:1}}>
                    <View style={{flexDirection:"row",flex:1}} >
                        <View style={{flex:0.2}}>
                            <Text style={[CommonStyles.boxLine1W]}>Customer</Text>
                        </View>
                        <View style={{flex:0.8,flexDirection:"row"}}>
                            <Text style={[CommonStyles.boxLine1W,{fontFamily:"Montserrat-Regular"}]}> : {item.deliveryAddress.name}, </Text>
                            {item.deliveryAddress.mobileNumber ?
                                <Text style={[CommonStyles.boxLine1W,{fontFamily:"Montserrat-Regular",textDecorationLine: 'underline',color:'#fff'}]} onPress={() => Linking.openURL(`tel:${item.deliveryAddress.mobileNumber}`)}>{item.deliveryAddress.mobileNumber}</Text>
                                :
                                null
                            }
                        </View>                
                    </View>
                    <View style={{flexDirection:"row",flex:1}} >
                        <View style={{flex:0.2}}>
                            <Text style={[CommonStyles.boxLine1W]}>Address</Text>
                        </View>
                        <View style={{flex:0.67}}>
                            <Text numberOfLines={2} style={[CommonStyles.boxLine1W,{fontFamily:"Montserrat-Regular",marginRight:10}]}> : {item.deliveryAddress.addressLine1+" "+item.deliveryAddress.addressLine2}</Text>                            
                        </View>
                        <View style={{flex:0.13}}>
                            <TouchableOpacity style={{marginHorizontal:10,height:30,width:30}} onPress={()=>goToMap(item.deliveryAddress.latitude,item.deliveryAddress.longitude)}>
                                <Icon name="map-marker-radius" type="material-community" size={20} color='#fff' iconStyle={{ali:'flex-end'}}/>
                            </TouchableOpacity>
                        </View>                    
                    </View>                     
                </View>                 
                </View>
                </View> 
            </TouchableOpacity>    
        )    
    };


    return (        
            <View style={{flex:1}}>
                 {loading ? 
                    <Loading />
                    :
                    <View style={{flex:1,marginBottom:60}}>
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
                            </View>                                            
                        }
                     </View> 
                
                }  
                    <Footer selected={"2"}/>
            </View>
    );
   


    const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemSeparator: {
        flex: 1,
        height: 1,
        backgroundColor: '#444',
    },
    });}