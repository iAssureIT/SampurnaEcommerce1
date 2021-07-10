import React,{useEffect,useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity
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
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';
import DateTimePickerModal                  from "react-native-modal-datetime-picker";
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const CompletedOrders =(props)=> {
    const [orderList,setOrderList] = useState([]);
    const [date,setDate] = useState(new Date())
    useEffect(() => {
        getList()
    },[]);

    const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));

    const getList =()=>{
        var payload={
            "status" : "Delivered",
            "user_id" : store.userDetails.user_id
        }
        console.log("payload",payload);
        axios.post('/api/orders/get/nearest_vendor_orders',payload)
        .then(res=>{
            console.log("res1",res);
            setOrderList(res.data)
        })
        .catch(err=>{
            console.log("err",err);
        })
    }

    const previous =()=>{
        var prev = new Date(date.setDate(date.getDate() - 1));
        setDate(prev);
        handleCustom(prev,date1);
      }
    
      const next =()=>{
        var next = new Date(date.setDate(date.getDate() + 1));
        setDate(next);
        handleCustom(next,date1);
      }

      const  handleCustom=(date,date1)=>{
        props.dateType(date,date1);
        openDatePicker(false);
        // openDatePicker1(false);
      }

    const _renderlist = ({ item, index })=>{
        return (
            <TouchableOpacity onPress={()=>props.navigation.navigate('OrderSummary',{order_id:item._id})}>
                
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
            </TouchableOpacity>    
        )    
    };

    return (
        <View style={{flex:1}}>
            <View style={{flexDirection:"row",justifyContent: 'center',alignItems: 'center',marginTop:15}}>
                <TouchableOpacity
                    onPress={() => {previous()}}>
                    <Icon
                    name="caretleft"
                    type="antdesign"
                    color={colors.layoutColor}
                    size={25}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => openDatePicker(true)}
                    style={{
                    padding: 5,
                    width:200,
                    borderRadius: 5,
                    backgroundColor: colors.white,
                    alignItems:'center'
                    }}>
                    <Text>
                    {moment(date).format('DD MMMM YYYY')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {next()}}>
                    <Icon
                    name="caretright"
                    type="antdesign"
                    color={colors.layoutColor}
                    size={25}
                    />
                </TouchableOpacity>
            </View>
           {orderList  && orderList.length >0?<FlatList
            data={orderList}
            keyExtractor={(item) => item.id}
            renderItem={_renderlist} 
            style={{marginBottom:60}}
                />
            :
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text>No Order Found</Text>
            </View>}
            <Footer selected={"3"}/>
            <DateTimePickerModal
            isVisible={datePicker}
            mode="date"
            onConfirm={(date)=>{setDate(date),handleCustom(date,date1)}}
            onCancel={()=>openDatePicker(false)}
        />
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