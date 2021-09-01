import React,{useEffect,useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Linking,
  RefreshControl
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
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import localization from 'moment/locale/de'
const todoList = [
    { id: '1', text: 'Learn JavaScript' },
    { id: '2', text: 'Learn React' },
    { id: '3', text: 'Learn TypeScript' },
  ];

export const RejectedOrder =(props)=> {
    const [loading,setLoading] =useState(true);
    const [orderList,setOrderList] = useState([]);
    const [date,setDate] = useState(new Date());
    const isFocused = useIsFocused()
    const [datePicker,openDatePicker] = useState(false);
    const [refresh,setRefresh]=useState(false);
    const new_date=props?.route?.params?.new_date;
    useEffect(() => {
        setLoading(true);
        if(new_date!==undefined){
            setDate(new Date(new_date));
            getList(new Date(new_date));
        }else{
            
            getList(date);
        }
    },[props,isFocused,new_date]);

    const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));

      const getList =()=>{
        var payload={
            "user_id"       : store.userDetails.user_id,
            "startDate"  : moment(date).format(),
            "endDate"  : moment(date).format()
        }
        console.log("payload",payload);
        axios.post('/api/orders/get/driver/rejected/vendor_orders',payload)
        .then(res=>{
            setRefresh(false);
            console.log("res1",res);
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
        getList(date);
    }

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
 

    const previous =()=>{
        var prev = new Date(date?.setDate(date?.getDate() - 1));
        setDate(prev);
        getList();
        // handleCustom(prev,date);
      }
    
      const next =()=>{
        var next = new Date(date?.setDate(date?.getDate() + 1));
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
            <TouchableOpacity onPress={()=>props.navigation.navigate('OrderSummary',{order_id: item?._id,vendor_id: item?.vendorOrders[0]?.vendor_id})}>
                <View style={{}}>
                    <View
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal:8,
                        backgroundColor:"#F3C2C2",
                        minHeight:100,
                        borderRadius:7,
                        marginHorizontal:10,
                        elevation:2,
                        marginTop:15,
                        marginBottom:15
                    }}
                >
                    <View style={{flexDirection:'row',marginBottom:5}}>
                            <View style={{flex:.4}}>
                                <Text style={CommonStyles.completeBlueText}>Order No : {item?.orderID}</Text>
                            </View>
                            <View style={{flex:.6,alignItems:'flex-end'}}>
                                <Text style={CommonStyles.completeBlueText}>Date {moment(item?.createdAt).lang("es").format('DD-MM-YYYY hh:mm')}</Text>
                            </View>    
                    </View> 
                    <View style={{flex:1}}>
                    <View style={{flexDirection:"row",flex:1}} >
                        <View style={{flex:0.2}}>
                            <Text style={[CommonStyles.boxLine1C]}>Customer</Text>
                        </View>
                        <View style={{flex:0.8,flexDirection:"row",flexWrap: 'wrap'}}>
                            <Text style={[CommonStyles.boxLine2C,{fontFamily:"Montserrat-Regular"}]}> : {item?.deliveryAddress?.name}, </Text>
                            <Text style={[CommonStyles.boxLine2C,{fontFamily:"Montserrat-Regular",textDecorationLine: 'underline',color:'#033554'}]} onPress={() => Linking.openURL(`tel:${item?.deliveryAddress?.mobileNumber}`)}> {item?.deliveryAddress?.mobileNumber}</Text>
                        </View>                        
                    </View>
                    <View style={{flexDirection:"row",flex:1}} >
                        <View style={{flex:0.2}}>
                            <Text style={[CommonStyles.boxLine1C]}>Address</Text>
                        </View>
                        <View style={{flex:0.8,flexDirection:"row"}}>
                            <View style={{flex:0.8}}>
                                <Text numberOfLines={2} style={[CommonStyles.boxLine2C,{fontFamily:"Montserrat-Regular"}]}> : {item?.deliveryAddress?.addressLine1+" "+item?.deliveryAddress?.addressLine2}</Text>
                            </View>
                            <View style={{flex:0.2}}>
                                <TouchableOpacity style={{}} onPress={()=>goToMap(item?.deliveryAddress?.latitude,item?.deliveryAddress?.longitude)}>
                                    <Icon name="map-marker-radius" type="material-community" size={20} color='#fff' iconStyle={{ali:'flex-end'}}/>
                                </TouchableOpacity>
                            </View>                    
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
        <View style={{flex:1}}>            
         {loading ?
            <Loading />
        :  <View style={{flex:1,backgroundColor:'#fff'}}>            
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
            {/* <View style={{flexDirection:'row',justifyContent:'center',paddingTop:10,marginBottom:15}}>
                    <Text style={CommonStyles.totalcount}>Total Cash Collected : {orderList?.cashCollected>0 ? orderList?.cashCollected : 0} AED</Text>
             </View> */}
             <View style={{flex:1}}>
             {loading ?
                    <Loading />
                :  
                    <View style={{flex:1}}>
                        {orderList  && orderList.length >0?<FlatList
                        data={orderList}
                        keyExtractor={(item) => item.id}
                        renderItem={_renderlist} 
                        style={{marginBottom:60}}
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
                        <Footer selected={''}/>
                    </View>
            }
            </View>          
            <DateTimePickerModal
            isVisible={datePicker}
            mode="date"
            onConfirm={(date)=>{setDate(date)}}
            onCancel={()=>openDatePicker(false)}
        />
        </View>}
            
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