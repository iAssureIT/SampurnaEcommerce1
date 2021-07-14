import React, { useEffect, useState }  from 'react';
import {
  ScrollView,
  View,
  Image,
  ActivityIndicator,
  Text
} from 'react-native';
import { Button,Icon}            from "react-native-elements";
import {HeaderBar3}         from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}             from '../../ScreenComponents/Footer/Footer.js';
import styles               from '../../AppDesigns/currentApp/styles/ScreenStyles/Wishliststyles.js';
import { colors }           from '../../AppDesigns/currentApp/styles/styles.js';
;
import {withCustomerToaster}from '../../redux/AppState.js';
import { useSelector }      from 'react-redux';
import {ProductList}        from'../../ScreenComponents/ProductList/ProductList.js';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import SearchSuggetion          from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import {FormButton}         from '../../ScreenComponents/FormButton/FormButton';

export const WishlistComponent  = withCustomerToaster((props)=>{
  const {navigation}=props;
  const store = useSelector(store => ({
    wishList      : store.wishDetails.wishList,
    globalSearch  : store.globalSearch,
    loading        : store.wishDetails.loading
  }));
  const {wishList,globalSearch,loading} = store;
  const [user_id,setUserId] = useState('');
  useEffect(() => {
    // getData()
  },[]); 

  console.log("wishList",wishList);
  console.log("loading",loading);
  
    return (
      <React.Fragment>
        <View style={styles.addsuperparent}>
        {
          globalSearch.search ?
          <SearchSuggetion />
          : 
          <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
            <View style={{paddingVertical:24,paddingHorizontal:20}}>
              <Text style={CommonStyles.screenHeader}>My Wishlist</Text>
            </View>
              <View style={{paddingBottom:60}}>
                {loading ?
                  <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                  <ActivityIndicator size="large" color={colors.theme}/>
                </View>
                :
                  wishList && wishList.length > 0 ?
                  wishList.map((item,index)=>{
                    console.log("item",item);
                    return(
                      <View key={index} style={{paddingHorizontal:15}}>
                        <View style={{flexDirection:"row"}}>
                          <Icon name= "map-marker" type = 'material-community' size={18} color= "red" style={{paddingHorizontal:5}}/>
                          <Text style={[CommonStyles.label,{flex:1}]}>{item.areaName}</Text>
                        </View>  
                        <View style=
                        {{
                          // shadowColor: '#000',
                          // borderColor:"#f1f1f1",
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
                            disabled    = {parseInt(item.distance) <= item.maxDistanceRadius ? false :true}
                            marginTop   = {0}
                            paddingBottom  = {0}
                            type           = {'wishlist'}
                        />
                      </View>  
                      </View>
                    )
                  })
                  :
                  <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
                    <Image
                      source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
                    />
                    <View style={{}}>
                      <FormButton
                          onPress={() => navigation.navigate('Dashboard')}
                          // title={"Click Here To Continue Shopping"}
                          title={"Add Products"}
                          background={true}
                      /> 
                  </View> 
                  </View>
              }
              </View>
          </ScrollView>
          }
        </View>
      </React.Fragment>
    );
})