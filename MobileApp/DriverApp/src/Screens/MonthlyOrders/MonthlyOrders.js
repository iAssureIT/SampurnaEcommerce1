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
    const [orderList,setOrderList] = useState([
        {
            date : "1st July",
            orders : 36
        },
        {
            date : "2nd July",
            orders : 15
        },
        {
            date : "3rd July",
            orders : 36
        },
        {
            date : "4th July",
            orders : 10
        },{
            date : "5th July",
            orders : 36
        },
        {
            date : "6th July",
            orders : 35
        },
        {
            date : "7th July",
            orders : 17
        },
        {
            date : "8th July",
            orders : 12
        },{
            date : "9th July",
            orders : 26
        }
    ]);
    const monthNames  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d           = new Date();
    console.log("localization",localization);
    const [date, setDate] = useState(new Date());
    const [monthNumber, setMonthNumber] = useState(d.getMonth());
    const [month, setMonth] = useState(monthNames[monthNumber]);
    const [year, setYear] = useState(d.getFullYear());
    const [monthNow, setMonthNow] = useState(month);
    const [yearNow, setYearNow] = useState(year);
    const [monthYear, setMonthYear] = useState(month+" "+year);
    useEffect(() => {
        // getList()
    },[]);

    const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));

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
            <TouchableOpacity onClick={()=>props.navigation.navigate('OrderSummery')}>
                <Card containerStyle={{flex:1}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.5}}>
                            <Text>{item.date}</Text>
                        </View> 
                        <View style={{flex:0.5,alignItems:"flex-end"}}>
                            <Text>{item.orders}</Text>
                        </View>     
                    </View>    
                </Card>    
          </TouchableOpacity>  
        )    
    };

    return (
        <>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={{alignItems:"center",justifyContent:"flex-start",flex:0.3}} onPress={priviousDate}>
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
                }
            </View>
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text>Total Deliveries : 639</Text>
            </View>    
           {orderList  && orderList.length >0?<FlatList
            data={orderList}
            keyExtractor={(item) => item.id}
            renderItem={_renderlist} 
                />
            :
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text>No Order Found</Text>
            </View>}
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
    box1:{
        flexDirection:'row',
        paddingVertical:2
    }
    });