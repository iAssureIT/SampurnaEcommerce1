import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions
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
import SearchSuggetion      from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';


const window = Dimensions.get('window');
export const SearchList  = withCustomerToaster((props)=>{
  // console.log("props",props);
  const {navigation,route}=props;
  const {type}=route.params;
  const store = useSelector(store => ({
    productList : store.productList,
    globalSearch : store.globalSearch
  }));
  const {productList,globalSearch} = store;
  const [loading,setLoading] = useState(props.loading);
  const [user_id,setUserId] = useState('');
  const listType = type+"List";
  const isFocused = useIsFocused();
console.log("globalSearch",globalSearch);
  
  const capitalize=(str)=>{
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
      <React.Fragment>
        <View style={styles.addsuperparent}>
        {globalSearch.search ?
            <SearchSuggetion />
              :<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View style={styles.formWrapper}>
                <View style={{marginTop:15,marginBottom:60}}>
                {
                    globalSearch.searchList.length ===0 && productList.loading ?
                    <Loading />
                    :
                   globalSearch.searchList && globalSearch.searchList.length > 0 ?
                      <ProductList 
                        navigate        = {navigation.navigate} 
                        newProducts     = {globalSearch.searchList} 
                        userId          = {user_id} 
                        categories      = {[]}
                        limit           = {props.limit}
                        type            = {'Search'}
                        loading         = {productList.loading}
                        vendorName      = {true}
                        onEndReachedThreshold = {0.5}
                        marginTop       = {0}
                        paddingBottom   = {0}
                    />
                    :
                    <View style={{justifyContent:"center",alignItems:'center',marginTop:'40%'}}>
                    <Image 
                      source={require('../../AppDesigns/currentApp/images/No-Products-Available.png')}
                      style={{height:300,width:300}}
                      resizeMode="contain"
                    />
                    <Text style={CommonStyles.noDataFound}>No Results Found</Text>
                  </View> 
                }
                </View>
            </View>
          </ScrollView>}
         
        </View>
      </React.Fragment>
    );
})