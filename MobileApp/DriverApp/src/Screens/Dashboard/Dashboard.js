import React, {useState,useEffect}  from 'react';
import {ScrollView,
        View,
        FlatList, 
        TouchableOpacity,
        StyleSheet,
        Text,
        Keyboard}                   from 'react-native';
import {Icon }                      from "react-native-elements";
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import {useDispatch,connect }   from 'react-redux';
import axios                        from "axios";
import { useIsFocused }             from "@react-navigation/native";
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import {withCustomerToaster}        from '../../redux/AppState.js';
import { getSectionList } 		      from '../../redux/section/actions';
import { getPreferences } 		      from '../../redux/storeSettings/actions';
import {colors}             from '../../AppDesigns/currentApp/styles/styles.js';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';

TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

const Dashboard = withCustomerToaster((props)=>{
  const isFocused             = useIsFocused();
  const dispatch              = useDispatch();
  const {setToast,navigation,productList,wishList,globalSearch,preferences,user_id} = props; 
  const [isOpen,setOpen]      = useState(false);
  const [blocks,setBlocks]    = useState([]);
  const [loading,setLoading]  = useState(true);
  const limit                 = 6;
    useEffect(() => {
        dispatch(getSectionList());
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
            <View style={{flex:1,marginBottom:65,justifyContent:'center'}}>
                <View style={{flexDirection:"row",justifyContent:'space-between',marginTop:5}}>   
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('OrdersView')}>
                        <Icon size={30} name='list' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>New Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.HorizontalBoxRight} onPress={()=>navigation.navigate('MyOrder')}>
                        <Icon size={30} name='list' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>Accepted Orders</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:"row",justifyContent:'space-between'}}>         
                    <TouchableOpacity style={styles1.HorizontalBoxLeft} onPress={()=>navigation.navigate('WishlistComponent')}>
                        <Icon size={30} name='list' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>Total Orders</Text>
                        <Text style={[CommonStyles.label]}>Delivered Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.HorizontalBoxRight} onPress={()=>navigation.navigate('CartComponent', { userId: userDetails.user_id })}>
                        <Icon size={30} name='list' type='font-awesome' color={colors.theme} style={styles1.iconStyle}/>
                        <Text style={[CommonStyles.label]}>Total Monthly</Text>
                        <Text style={[CommonStyles.label]}>Orders</Text>
                    </TouchableOpacity>
                </View>   
            </View>
        </View>
    </React.Fragment>
  );  
})

const styles1 = StyleSheet.create({
  HorizontalBoxLeft: {
      height              : 50,
      alignItems          : "center",
      justifyContent      : 'center',
      backgroundColor     : "#fff",
      flex                : 0.47,
      height              : 150,
      marginLeft          : 15,
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
      marginBottom:15
      // width               :50
  }
});

const mapStateToProps = (store)=>{
  return {
    productList     : store.productList,
    wishList        : store.wishDetails.wishList,
    globalSearch    : store.globalSearch,
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