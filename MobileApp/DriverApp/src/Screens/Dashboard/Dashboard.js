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
import {useDispatch,connect }   from 'react-redux';
import axios                        from "axios";
import { useIsFocused }             from "@react-navigation/native";
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import {withCustomerToaster}        from '../../redux/AppState.js';
import { getPreferences } 		      from '../../redux/storeSettings/actions';
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {Footer}                     from '../../ScreenComponents/Footer/Footer.js';
// import SwipeButton                 from '../../ScreenComponents/SwipeButton/SwipeButton';

TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

const Dashboard = withCustomerToaster((props)=>{
  const isFocused             = useIsFocused();
  const dispatch              = useDispatch();
  const {setToast,navigation} = props; 
  const [isOpen,setOpen]      = useState(false);
  const [blocks,setBlocks]    = useState([]);
  const [loading,setLoading]  = useState(true);
  const isActive              = true;
  // const handleToggle = (value) => setToggleState(value);
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


  return (
    <React.Fragment>
        <View style={styles.superparent}>
            <View>
              
            </View>
            <View style={{flex:1,marginBottom:65,justifyContent:'center'}}>
                <View style={{marginTop:5}}>   
                {/* <SwipeButton onToggle={handleToggle} /> */}
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
      marginVertical      : 15,
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