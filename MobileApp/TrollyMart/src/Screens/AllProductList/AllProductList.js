import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {  Icon,Button}          from "react-native-elements";
import Modal                    from "react-native-modal";
import {HeaderBar3}               from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}                   from '../../ScreenComponents/Footer/Footer.js';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenStyles/Wishliststyles.js';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import axios                    from 'axios';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import AsyncStorage             from '@react-native-async-storage/async-storage';
;
import {withCustomerToaster}    from '../../redux/AppState.js';
import { connect,useDispatch,useSelector }  from 'react-redux';
import {ProductList}            from'../../ScreenComponents/ProductList/ProductList.js';
import { useIsFocused } from "@react-navigation/native";
import {FormButton}         from '../../ScreenComponents/FormButton/FormButton';
import { NetWorkError } from '../../../NetWorkError.js';
export const AllProductList  = withCustomerToaster((props)=>{
  const {navigation,route}=props;
  const {type}=route.params;
  const store = useSelector(store => ({
    productList : store.productList,
  }));
  const {productList} = store;
  const [loading,setLoading] = useState(props.loading);
  const [user_id,setUserId] = useState('');
  const listType = type+"List";
  const isFocused = useIsFocused();
  useEffect(() => {
  },[props]);
  
  const capitalize=(str)=>{
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
      <React.Fragment>
        <View style={styles.addsuperparent}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <View style={{marginTop:15}}>
                  {!loading ?
                    productList.allProductList && productList.allProductList.length > 0 ?
                      <ProductList 
                        navigate        = {navigation.navigate} 
                        newProducts     = {productList.allProductList}  
                        userId          = {user_id} 
                        categories      = {[]}
                        limit           = {props.limit}
                        type            = {type}
                        loading         = {productList.loading}
                    />
                    :
                    <View style={{ flex: 1, alignItems: 'center', marginTop: '10%' }}>
                      <Image
                        source={require("../../AppDesigns/currentApp/images/noproduct.jpeg")}
                      />

                      <FormButton
                          onPress={() => navigation.navigate('Dashboard')}
                          // title={"Click Here To Continue Shopping"}
                          title={"Add Products"}
                          background={true}
                      /> 
                    </View>
                    :
                    <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                      <ActivityIndicator size="large" color={colors.theme}/>
                    </View>
                }
                </View>
            </View>
          </ScrollView>
        </View>
      </React.Fragment>
    );
})