import React, { useEffect, useState }  from 'react';
import {
  ScrollView,
  View,
  Image,
  ActivityIndicator,
  Text,
  Dimensions,
  RefreshControl
} from 'react-native';
import { Button,Icon}       from "react-native-elements";
import styles               from '../../AppDesigns/currentApp/styles/ScreenStyles/Wishliststyles.js';
import { colors }           from '../../AppDesigns/currentApp/styles/styles.js';
;
import {withCustomerToaster}from '../../redux/AppState.js';
import {ProductList}        from'../../ScreenComponents/ProductList/ProductList.js';
import CommonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import {FormButton}         from '../../ScreenComponents/FormButton/FormButton';
import { NetWorkError }     from '../../../NetWorkError.js';
import { useIsFocused }     from "@react-navigation/native";
import {useDispatch,connect,useSelector }   from 'react-redux';
import { getWishList } 		        from '../../redux/wishDetails/actions';

const window = Dimensions.get('window');

export const WishlistComponent  = withCustomerToaster((props)=>{
  const {navigation}=props;
const isFocused = useIsFocused();
const [refreshing,setRefresh]= useState(false)

  const store = useSelector(store => ({
    wishList      : store.wishDetails.wishList,
    globalSearch  : store.globalSearch,
    loading        : store.wishDetails.loading,
    isConnected: store.netWork.isConnected,
    userDetails : store.userDetails
  }));
  console.log("store",store)
  const {wishList,globalSearch,loading,isConnected,userDetails} = store;
  const [user_id,setUserId] = useState('');
  const dispatch              = useDispatch();
  useEffect(() => {
    // getData()
  },[isConnected,isFocused]); 

  console.log("wishList",wishList);

  const refreshControl=()=>{
    setRefresh(true);
    dispatch(getWishList(userDetails.user_id));
    setRefresh(false);
  }
  
    return (
      <React.Fragment>
        {!isConnected?
        <NetWorkError />
        :
        <View style={[styles.addsuperparent]}>
        {
          globalSearch.search ?
          <SearchSuggetion />
          : 
          loading ?
            <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
            <ActivityIndicator size="large" color={colors.theme}/>
          </View>
          :
          wishList && wishList.length > 0 ?
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshControl}
              />}
          >
            <View style={{paddingVertical:24,paddingHorizontal:20}}>
              <Text style={CommonStyles.screenHeader}>My Wishlist</Text>
            </View>
              <View style={{paddingBottom:60}}>
                  {wishList.map((item,index)=>{
                    console.log("item",item);
                    return(
                      <View key={index} style={{paddingHorizontal:15}}>
                        <View style={{flexDirection:"row"}}>
                          <Icon name= "map-marker" type = 'material-community' size={18} color= "red" style={{paddingHorizontal:5}}/>
                          <Text style={[CommonStyles.label,{flex:1}]}>{item.areaName}</Text>
                        </View>  
                        <View style=
                        {{
                          backgroundColor: '#fff',
                          width: '100%',
                          minHeight: 200,
                          marginTop:5,
                          marginBottom:20,
                          borderRadius:5,
                          shadowColor: '#000',
                          shadowOffset: { width: 1, height: 1 },
                          shadowOpacity:  0.4,
                          shadowRadius: 5,
                          elevation: 5,
                          }}>
                          <ProductList 
                            navigate    = {navigation.navigate} 
                            newProducts = {item.products}  
                            userId      = {user_id} 
                            categories  = {[]}
                            loading     = {loading}
                            disabled      = {parseInt(item.distance) <= item.maxDistanceRadius ? false :true}
                            marginTop     = {0}
                            paddingBottom  = {0}
                            type           = {'wishlist'}
                        />
                      </View>  
                      </View>
                    )
                  })
                }
              </View>
          </ScrollView>
          :
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={{paddingVertical:24,paddingHorizontal:6}}>
              <Text style={CommonStyles.screenHeader}>My Wishlist</Text>
            </View>
            <View style={{height:window.height-230,justifyContent:'center',alignItems:'center'}}>
              <Image
                source={require("../../AppDesigns/currentApp/images/empty_wishlist.png")}
                style={{width:window.width,height:300}}
                resizeMode='contain'
              />
              <View style={{alignItems:'center'}}>
                <Text style={{fontFamily:"Montserrat-SemiBold",fontSize:18,color:"#DC1919",opacity: 1}}>Your Wishlist is empty!</Text>
                <View style={{marginTop:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Icon name="undo-variant" type="material-community" size={15}  color={colors.cartButton}/>
                  <Text style={[CommonStyles.linkText,{textDecoration: "underline",fontFamily:"Montserrat-SemiBold",fontSize:12}]} onPress={() => navigation.navigate('Dashboard')}>Continue shopping</Text>
                </View>
              </View> 
          </View>
        </ScrollView>
          }
        </View>}
      </React.Fragment>
    );
})