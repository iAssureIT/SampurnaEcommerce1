import React,{useEffect,useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Linking
} from 'react-native';
import Swipeable                        from 'react-native-gesture-handler/Swipeable';
import { Header, Icon, Card, Button }   from 'react-native-elements';
import axios from 'axios';
import CommonStyles                     from '../../AppDesigns/currentApp/styles/CommonStyles';
import {
    useDispatch,
    useSelector }                       from 'react-redux';
import {Footer}                         from '../../ScreenComponents/Footer/Footer.js';
import moment                           from 'moment';
import {colors}                         from '../../AppDesigns/currentApp/styles/styles.js';
import DateTimePickerModal              from "react-native-modal-datetime-picker";
import { useIsFocused } from "@react-navigation/native";
import localization from 'moment/locale/de'
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const CompletedOrders =(props)=> {
    const [orderList,setOrderList] = useState([]);
    const [date,setDate] = useState(new Date());
    const isFocused = useIsFocused()
    const [datePicker,openDatePicker] = useState(false);
    const new_date=props?.route?.params?.new_date;
    useEffect(() => {
        console.log("new_date",new_date);
        if(new_date!==undefined){
            setDate(new Date(new_date));
        }
        getList(date);
    },[props,isFocused]);

    const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));

    const getList =()=>{
        var payload={
            "orderStatus"   : "Delivered",
            "user_id"       : store.userDetails.user_id,
            "deliveryDate"  : moment(date).format()
        }
        console.log("payload",payload);
        axios.post('/api/orders/get/daily/vendor_orders',payload)
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
        getList();
        // handleCustom(prev,date);
      }
    
      const next =()=>{
        var next = new Date(date.setDate(date.getDate() + 1));
        setDate(next);
        getList();
        // handleCustom(next,date);
      }

      const  handleCustom=(date,date1)=>{
        props.dateType(date,date1);
        openDatePicker(false);
        // openDatePicker1(false);
      }




    const _renderlist = ({ item, index })=>{
        return (
            <TouchableOpacity onPress={()=>props.navigation.navigate('OrderSummary',{order_id: item._id,vendor_id: item.vendorOrders[0].vendor_id})}>
                <View style={{}}>
                    <View
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal:8,
                        backgroundColor: 'white',
                        minHeight:100,
                        borderRadius:7,
                        marginHorizontal:20,
                        elevation:2,
                        marginBottom:15
                    }}
                >
                    <View style={{flexDirection:'row',marginBottom:5}}>
                            <View style={{flex:.4}}>
                                <Text style={CommonStyles.completeBlueText}>Order No : {item.orderID}</Text>
                            </View>
                            <View style={{flex:.6,alignItems:'flex-end'}}>
                                <Text style={CommonStyles.completeBlueText}>Date {moment().lang("es").format('DD-MM-YYYY hh:mm')}</Text>
                            </View>    
                    </View> 
                    <View style={{flex:1}}>
                    <View style={{flexDirection:"row",flex:1,height:25}} >
                        <View style={{flex:0.25}}>
                            <Text style={[CommonStyles.boxLine1C]}>Customer Name</Text>
                        </View>
                        <View style={{flex:0.75,flexDirection:"row",flexWrap: 'wrap'}}>
                            <Text style={[CommonStyles.boxLine2C,{fontFamily:"Montserrat-Regular"}]}> : {item.deliveryAddress.name}, </Text>
                            <Text style={[CommonStyles.boxLine2C,{fontFamily:"Montserrat-Regular",textDecorationLine: 'underline',color:'#033554'}]} onPress={() => Linking.openURL(`tel:${item.deliveryAddress.mobileNumber}`)}> {item.deliveryAddress.mobileNumber}</Text>
                        </View>                        
                    </View>
                    <View style={{flexDirection:"row",flex:1}} >
                        <View style={{flex:0.25}}>
                            <Text style={[CommonStyles.boxLine1C]}>Address</Text>
                        </View>
                        <View style={{flex:0.75,flexDirection:"row"}}>
                            <Text numberOfLines={2} style={[CommonStyles.boxLine2C,{fontFamily:"Montserrat-Regular"}]}> : {item.deliveryAddress.addressLine1+" "+item.deliveryAddress.addressLine2}</Text>
                            <TouchableOpacity style={{justifyContent:'flex-end',alignItems:'flex-end'}} onPress={()=>goToMap(item.deliveryAddress.latitude,item.deliveryAddress.longitude)}>
                                <Icon name="map-marker-radius" type="material-community" size={20} color='#fff' iconStyle={{ali:'flex-end'}}/>
                            </TouchableOpacity>
                        </View>                        
                    </View>                     
                </View>



                    {/* <View style={{flexDirection:"row"}} >
                        <Text style={CommonStyles.label}>Client Name:</Text> 
                        <Text style={[CommonStyles.label,{fontFamily:"Montserrat-Regular"}]}> {item.deliveryAddress.name}</Text>
                        <Text style={[CommonStyles.label,{fontFamily:"Montserrat-Regular",textDecorationLine: 'underline',color:colors.cartButton}]} onPress={() => Linking.openURL(`tel:${item.deliveryAddress.mobileNumber}`)}> {item.deliveryAddress.mobileNumber}</Text>
                    </View>
                    <View style={{flexDirection:"row",flex:1}} >
                        <Text style={[CommonStyles.label,{flex:1}]}>Address: <Text numberOfLines={2} style={[CommonStyles.label,{fontFamily:"Montserrat-Regular"}]}> {item.deliveryAddress.addressLine1+" "+item.deliveryAddress.addressLine2}</Text></Text>
                    </View> */}

                    </View>
                </View> 
            </TouchableOpacity>    
        )    
    };

    return (
        <View style={{flex:1,backgroundColor:'#fff'}}>
            <View style={{flexDirection:"row",justifyContent: 'center',alignItems: 'center',marginTop:15}}>
                <TouchableOpacity
                    onPress={() => {previous()}}>
                    <Icon
                    name="caretleft"
                    type="antdesign"
                    color='#033554'
                    size={10}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => openDatePicker(true)}
                    style={{
                    paddingVertical: 5,
                    width:120,
                    borderRadius: 5,
                    backgroundColor: colors.white,
                    alignItems:'center'
                    }}>
                    <Text style={CommonStyles.completeDate}>
                    {moment(date).locale("en", localization).format('DD MMMM YYYY')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {next()}}>
                    <Icon
                    name="caretright"
                    type="antdesign"
                    color='#033554'
                    size={10}
                    />
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',paddingTop:10,marginBottom:15}}>
                    <Text style={CommonStyles.totalcount}>Total Cash Collected : 500 AED</Text>
             </View>   
           {orderList  && orderList.length >0?<FlatList
            data={orderList}
            keyExtractor={(item) => item.id}
            renderItem={_renderlist} 
            style={{marginBottom:60}}
                />
            :
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={CommonStyles.noDataFound}>No Order Found</Text>
            </View>}
            <Footer selected={"3"}/>
            <DateTimePickerModal
            isVisible={datePicker}
            mode="date"
            // onConfirm={(date)=>{setDate(date),handleCustom(date,date1)}}
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