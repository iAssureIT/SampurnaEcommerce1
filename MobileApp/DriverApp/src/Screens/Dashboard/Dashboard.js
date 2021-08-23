import React, {useState,useEffect}  from 'react';
import {ScrollView,
        View,
        FlatList, 
        TouchableOpacity,
        StyleSheet,
        Image,
        Text,
        Keyboard}                   from 'react-native';
import {Icon }                      from "react-native-elements";
import Swipeable                    from 'react-native-gesture-handler/Swipeable';
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import {useDispatch,connect,useSelector }   from 'react-redux';
import axios                        from "axios";
import { useIsFocused }             from "@react-navigation/native";
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import {withCustomerToaster}        from '../../redux/AppState.js';
import { getPreferences } 		      from '../../redux/storeSettings/actions';
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {Footer}                     from '../../ScreenComponents/Footer/Footer.js';
import SwipeButton                 from '../../ScreenComponents/SwipeButton/SwipeButton';
import Modal                from "react-native-modal";
import { Alert } from 'react-native';
import CodePush from 'react-native-code-push';
TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

const Dashboard = withCustomerToaster((props)=>{
  const isFocused             = useIsFocused();
  const dispatch              = useDispatch();
  const {setToast,navigation} = props; 
  const [isOpen,setOpen]      = useState(false);
  const [blocks,setBlocks]    = useState([]);
  const [loading,setLoading]  = useState(true);
  const [modal,setModal] = useState(false)
  const isActive              = true;
  const [time,setTime] = useState(5);
  var i = 0;
  
  const handleToggle = (value) => {
    setModal(value);
    interval(time);    
    return () => clearInterval(interval);
  }

  const store = useSelector(store => ({
        userDetails     : store.userDetails,
      }));

  const interval =(time)=>{
    // console.log("time",time)
    i =setInterval(() => {
      if(time === 0){
        var formValues ={
          user_id :store.userDetails.user_id,
          locationLink : "https://qaadmin.knock-knockeshop.com"
        }
        console.log("formValues",formValues);
        axios.post('/api/entitymaster/post/sos',formValues)
        .then(res=>{
            setOrderList(res.data);
        })
        .catch(err=>{
            console.log('err',err);
        })
        clearInterval(i);
        setModal(false);
        setTime(5);
      }else{
        clearInterval(i);
        interval(time-1);
        setTime(time-1);
      }
    }, 1000);
  }

  const limit                 = 6;
    useEffect(() => {
        dispatch(getPreferences());
        getBlocks();
    },[]);

    // useEffect(() => {
    //   if(isFocused){
    //     dispatch(getList('featured',user_id,limit));
    //     dispatch(getList('exclusive',user_id,limit));
    //     dispatch(getList('discounted',user_id,limit));
    //   }  
    // },[isFocused]);

  const getBlocks=()=>{
    axios.get('/api/pages/get/page_block/homepage')
    .then(res=>{
      setBlocks(res.data.pageBlocks);
      setLoading(false)
    })
    .catch(error=>{
      console.log("error",error);
      if (error.response.status == 401) {
        setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
        navigation.navigate('App')
      }else{
        setToast({text: 'Something went wrong.', color: 'red'});
      }  
    })
  }

  const closeSOS = ()=>{
    // CodePush.restartApp()
    navigation.push('App');
  }

  return (
    <React.Fragment>
        <View style={styles.superparent}>
            <View style={{marginTop:20,alignItems:'center',marginBottom:10}}>
              <SwipeButton onToggle={handleToggle}/>
            </View>
            <View style={{flex:1,marginBottom:65,justifyContent:'center'}}>
                <View style={{marginTop:5}}>   
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('NewOrders')}>
                        <View style={styles.iconBox}>
                          <Image
                              resizeMode="contain"
                              source={require("../../AppDesigns/currentApp/images/NewOrders.png")}
                              style={styles.imgBox}
                              />
                        </View>                        
                        <Text style={[styles.boxTitle]}>New Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('AcceptedOrders')}>
                        <View style={styles.iconBox}>
                          <Image
                            resizeMode="contain"
                            source={require("../../AppDesigns/currentApp/images/AcceptedOrders.png")}
                            style={styles.imgBox}
                            />
                        </View>
                        <Text style={[styles.boxTitle]}>Accepted Orders</Text>
                    </TouchableOpacity>                      
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('CompletedOrders')}>
                        <View style={styles.iconBox}>
                          <Image
                              resizeMode="contain"
                              source={require("../../AppDesigns/currentApp/images/TotalOrders.png")}
                              style={styles.imgBox}
                              />
                        </View>
                        <Text style={[styles.boxTitle]}>Total Orders</Text>
                        <Text style={[styles.boxTitle]}>Delivered Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('MonthlyOrders')}>
                        <View style={styles.iconBox}>
                          <Image
                              resizeMode="contain"
                              source={require("../../AppDesigns/currentApp/images/TotalMonthly.png")}
                              style={styles.imgBox}
                              />
                        </View>
                        <Text style={[styles.boxTitle]}>Total Monthly</Text>
                        <Text style={[styles.boxTitle]}>Orders</Text>
                    </TouchableOpacity>
                </View>   
            </View>
        </View>
        <Modal isVisible={modal}
          coverScreen={false}
          backdropColor="white"
          hideModalContentWhileAnimating={true}
          style={{ zIndex: 999}}
          animationOutTiming={500}>
              <View style={{justifyContent:"center",alignItems:"center"}}>
                <View style={{height:250,width:250,borderRadius:250,borderWidth:2,borderColor:"#E81D27",backgroundColor:"#fff",justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:140,fontFamily:"Montserrat-SemiBold",color:"#033554"}}>{time}</Text>
                </View> 
                <View style={{alignItems:'center',marginTop:30}}> 
                  <Text style={{color: "#E81D27",fontSize:20,fontFamily:"Montserrat-Bold"}}>Alert Will Be Sent After The</Text>
                  <Text style={{color: "#E81D27",fontSize:20,fontFamily:"Montserrat-Bold"}}>Countdown</Text>
              </View>
              <TouchableOpacity style={styles1.closeButton} onPress={()=>closeSOS()}>
                  <Icon name="close" type="font-awesome" size={30} color="#fff" />
              </TouchableOpacity>
              <View style={{alignItems:'center'}}>
                <Text style={{color: "#000",fontSize:14,fontFamily:"Montserrat-Regular"}}>Cancel</Text>
              </View> 
             </View> 
        </Modal>
        <Footer/>
    </React.Fragment>
  );  
})

const styles1 = StyleSheet.create({
  HorizontalBoxLeft: {
      height              : 75,
      alignItems          : 'flex-start',
      paddingLeft         : 50,
      justifyContent      : 'center',
      backgroundColor     : "#fff",
      marginLeft          : 54,
      marginRight         : 25,
      borderRadius        : 7,
      marginVertical      : 10,
      elevation: 5
  },
  HorizontalBoxRight: {
      height              : 50,
      alignItems          : "center",
      justifyContent      : 'center',
      backgroundColor     : "#fff",
      flex                : 0.47,
      height              : 150,
      marginRight         : 15,
      marginVertical      : 15,
      elevation: 5
  },
  iconStyle:{
      color:'#033554',
      // width               :50
  },
  closeButton:{
    height:64,width:64,borderRadius:100,backgroundColor:"#033554",marginTop:30,justifyContent:'center',alignItems:'center'
  }
});

const mapStateToProps = (store)=>{
  return {
    location        : store.location,
    preferences     : store.storeSettings.preferences,
    user_id         : store.userDetails.user_id ? store.userDetails.user_id : null
  }
};


const mapDispatchToProps = (dispatch)=>{
  return {
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);