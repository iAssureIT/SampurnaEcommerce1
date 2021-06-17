import React, { useEffect, useState }  from 'react';
import {
  ScrollView,
  View,
  Image,
  ActivityIndicator,
  Text
} from 'react-native';
import { Button}            from "react-native-elements";
import {HeaderBar3}         from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}             from '../../ScreenComponents/Footer/Footer1.js';
import styles               from '../../AppDesigns/currentApp/styles/ScreenStyles/Wishliststyles.js';
import { colors }           from '../../AppDesigns/currentApp/styles/styles.js';
;
import {withCustomerToaster}from '../../redux/AppState.js';
import { useSelector }      from 'react-redux';
import {ProductList}        from'../../ScreenComponents/ProductList/ProductList.js';
import CommonStyles from '../../AppDesigns/currentApp/styles/CommonStyles.js';

export const WishlistComponent  = withCustomerToaster((props)=>{
  const {navigation}=props;
  const store = useSelector(store => ({
    wishList    : store.wishDetails.wishList,
  }));
  const {wishList} = store;
  const [user_id,setUserId] = useState('');
  const [loading,setLoading] = useState(false);
  console.log("wishList",wishList);
    return (
      <React.Fragment>
        <HeaderBar3
          goBack={navigation.goBack}
          headerTitle={'My Wishlist'}
          navigate={navigation.navigate}
          openControlPanel={() =>openControlPanel()}
        />
        <View style={styles.addsuperparent}>
          <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <View style={{marginTop:15}}>
                  {loading ?
                    <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                    <ActivityIndicator size="large" color={colors.theme}/>
                  </View>
                  :
                    wishList && wishList.length > 0 ?
                    wishList.map((item,index)=>{
                      return(
                        <View key={index}>
                          <Text style={[CommonStyles.label,{paddingHorizontal:15}]}>{item.areaName}</Text>
                          <ProductList 
                            navigate    = {navigation.navigate} 
                            newProducts = {item.products}  
                            userId      = {user_id} 
                            categories  = {[]}
                            loading     = {loading}
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
          <Footer />
        </View>
      </React.Fragment>
    );
})