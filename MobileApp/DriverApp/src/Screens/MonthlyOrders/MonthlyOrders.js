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
import { TouchableOpacity } from 'react-native';
import localization from 'moment/locale/de'
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];

export const MonthlyOrders =(props)=> {
    const [orderList,setOrderList] = useState();
    const monthNames  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d           = new Date();
    console.log("localization",localization);
    const [date, setDate] = useState(new Date());
    const [monthNumber, setMonthNumber] = useState(d.getMonth());
    console.log("monthNumber",monthNumber);
    const [month, setMonth] = useState(monthNames[monthNumber]);
    const [year, setYear] = useState(d.getFullYear());
    const [monthNow, setMonthNow] = useState(month);
    const [yearNow, setYearNow] = useState(year);
    const [monthYear, setMonthYear] = useState(month+" "+year);
  
    const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));

    useEffect(() => {
        getList()
    },[]);


    const getList = ()=>{
        var formValues ={
            user_id :store.userDetails.user_id,
            monthyear : year+"-"+(monthNumber+1),
            orderStatus : "Delivered" 
        }
        console.log("formValues",formValues);
        axios.post('/api/orders/get/monthly/vendor_orders',formValues)
        .then(res=>{
            console.log("rushi res",res);
            setOrderList(res.data);
        })
        .catch(err=>{
            console.log('err',err);
        })
    }

    

      const priviousDate = (prev)=>{
        if(monthNumber > 0){
            setMonth(monthNames[monthNumber-1]);
            setMonthNumber(monthNumber-1);
            setMonthYear(monthNames[monthNumber-1]+" "+year);
            // getUserDataMonthWise(year+"-"+("0" + (monthNumber)).slice(-2));
        }else{
            setMonth(monthNames[monthNumber+11]);
            setYear(year-1);
            setMonthYear(monthNames[monthNumber+11]+" "+(year-1));
            setMonthNumber(monthNumber+11);
            // getUserDataMonthWise((year-1)+"-"+("0" + (monthNumber+11)).slice(-2));
        }
      };
    
      const nextDate = (next)=>{
        if(monthNumber < 11){
          if(monthNames[monthNumber] !== monthNow || yearNow !== year ){
              setMonth(monthNames[monthNumber+1]);
              setMonthNumber(monthNumber+1);
              setMonthYear(monthNames[monthNumber+1]+" "+year);
            //   getUserDataMonthWise(year+"-"+("0" + (monthNumber+2)).slice(-2));
          }
          
        }else{
            setMonth(monthNames[monthNumber-11]);
            setYear(year+1);
            setMonthYear(monthNames[monthNumber-11]+" "+(year+1));
            setMonthNumber(monthNumber-11);
            // getUserDataMonthWise((year+1)+"-"+("0" + (monthNumber-11)).slice(-2));
        }
      };
      
    const _renderlist = ({ item, index })=>{
        return (
            <TouchableOpacity onPress={()=>props.navigation.navigate('CompletedOrders',{new_date:item.monthDay})}>
                <Card containerStyle={{flex:1,borderRadius:4}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.5}}>
                            <Text style={CommonStyles.totalcount}>{moment(item.monthDays).locale("en", localization).format("LL")}</Text>
                        </View> 
                        <View style={{flex:0.5,alignItems:"flex-end"}}>
                            <Text style={CommonStyles.completeDate}>{item.numberOfOrders}</Text>
                        </View>     
                    </View>    
                </Card>    
          </TouchableOpacity>  
        )    
    };

    return (
        <View style={{flex:1}}>
            <View style={{flex:1,paddingBottom:130,marginBottom:50,backgroundColor:'#fff'}}>
                <View style={{flexDirection:"row",justifyContent: 'center',alignItems: 'center',marginTop:15}}>
                        <TouchableOpacity
                            onPress={() => {priviousDate()}}>
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
                            backgroundColor:'#fff',
                            alignItems:'center'
                            }}>
                            <Text style={CommonStyles.completeDate}>
                            {monthYear}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {nextDate()}}>
                            <Icon
                            name="caretright"
                            type="antdesign"
                            color='#033554'
                            size={10}
                            />
                        </TouchableOpacity>
                    </View>
                    
                    {/* <TouchableOpacity style={{alignItems:"center",justifyContent:"flex-start",flex:0.3}} onPress={priviousDate}>
                    <Icon size={40} name='chevrons-left' type='feather' color='#333' />
                    </TouchableOpacity>
                    <View style={{alignItems:"center",justifyContent:"center",flex:0.4}}>
                    <Text style={{fontSize:20}}>
                        {monthYear}
                    </Text>               
                </View>
                    {month !== monthNow ?
                    <TouchableOpacity style={{alignItems:"center",justifyContent:"flex-end",flex:0.3}} onPress={nextDate}>
                    <Icon size={40} name='chevrons-right' type='feather' color='#333' />
                    </TouchableOpacity>
                    :
                    <View style={{alignItems:"center",justifyContent:"flex-end",flex:0.3}} onPress={nextDate}>
                    <Icon size={40} name='chevrons-right' type='feather' color='#d1d1d1' />
                    </View>
                    } */}            
                <View style={{justifyContent:'center',alignItems:'center',paddingTop:10}}>
                    <Text style={CommonStyles.totalcount}>Total Deliveries : {orderList?.totalNumberOfOrders}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',paddingTop:10,marginBottom:15}}>
                        <Text style={CommonStyles.totalcount}>Total Cash Collected : {orderList?.cashCollected>0 ? orderList?.cashCollected : 0} AED</Text>
                </View>  
            {orderList  && orderList?.monthDays?.length >0?
                    <View style={{}}>
                        <FlatList
                            data={orderList.monthDays}
                            keyExtractor={(item) => item.id}
                            renderItem={_renderlist} 
                        />
                    </View>
                :
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>No Order Found</Text>
                </View>}
            </View>
        <Footer/>
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