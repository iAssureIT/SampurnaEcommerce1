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

export const WishlistComponent  = withCustomerToaster((props)=>{
  const {navigation}=props;
  const store = useSelector(store => ({
    wishList      : store.wishDetails.wishList,
    globalSearch  : store.globalSearch
  }));
  const {wishList,globalSearch} = store;
  const [user_id,setUserId] = useState('');
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    // getData()
  },[]); 

  
    return (
      <React.Fragment>
        {/* <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'My Wishlist'}
          navigate={navigation.navigate}
          openControlPanel={() =>openControlPanel()}
        /> */}
        
        <View style={styles.addsuperparent}>
        {
          globalSearch.search ?
          <SearchSuggetion />
          : 
          <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <View style={{marginTop:15,paddingBottom:60}}>
                  {loading ?
                    <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                    <ActivityIndicator size="large" color={colors.theme}/>
                  </View>
                  :
                    wishList && wishList.length > 0 ?
                    wishList.map((item,index)=>{
                      return(
                        <View key={index} style={{paddingHorizontal:15}}>
                          <View style={{flexDirection:"row",paddingTop:15,}}>
                            <Icon name= "crosshairs-gps" type = 'material-community' size={18} color= "black" style={{paddingHorizontal:5}}/>
                            <Text style={[CommonStyles.label,{flex:1}]}>{item.areaName}</Text>
                          </View>  
                          <ProductList 
                            navigate    = {navigation.navigate} 
                            newProducts = {item.products}  
                            userId      = {user_id} 
                            categories  = {[]}
                            loading     = {loading}
                            disabled    = {parseInt(item.distance) <= item.maxDistanceRadius ? false :true}
                        />
                        </View>
                      )
                    })
                    :
                    <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
                      <Image
                        source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
                      />
                      <Button
                          onPress={() => navigation.navigate('Dashboard')}
                          // title={"Click Here To Continue Shopping"}
                          title={"Add Products"}
                          buttonStyle={styles.buttonshopping}
                          containerStyle={styles.continueshopping}
                      /> 
                    </View>
                }
                </View>
            </View>
          </ScrollView>
          }
          <Footer selected={"2"} />
        </View>
      </React.Fragment>
    );
})