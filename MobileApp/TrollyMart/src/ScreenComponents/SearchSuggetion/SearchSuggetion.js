import React, {useState,useEffect}  from 'react';
import {ScrollView,
        View,
        FlatList, 
        TouchableOpacity,
        Keyboard}                   from 'react-native';
import {Icon }                      from "react-native-elements";
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import {useDispatch,connect }       from 'react-redux';
import Highlighter                  from 'react-native-highlight-words';
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import Loading                      from '../Loading/Loading.js';
import {withCustomerToaster}        from '../../redux/AppState.js';
import { SET_SEARCH_CALL,
        SET_SEARCH_TEXT } 	        from '../../redux/globalSearch/types';
import { getSearchResult } 	        from '../../redux/globalSearch/actions';
import {ProductList}                from'../../ScreenComponents/ProductList/ProductList.js';
import { useNavigation }      from '@react-navigation/native';
TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

const SearchSuggetion = withCustomerToaster((props)=>{
  const {globalSearch,user_id,productList} = props; 
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <React.Fragment>
       {globalSearch.search ?
          <FlatList 
            keyboardShouldPersistTaps='handled'
            data={globalSearch.suggestionList.concat(['','','','','','','','','','','','','','','',''])} 
            renderItem = {({item}) =>
            <TouchableOpacity onPress={()=>{
                dispatch({type:SET_SEARCH_CALL,payload:false});
                dispatch({type:SET_SEARCH_TEXT,payload:''});
                dispatch(getSearchResult(item,user_id,10,true));
                navigation.navigate('SearchList',{"type":'Search',"limit":10})
                Keyboard.dismiss();
                }} style={styles.flatList}>
                <Highlighter
                  highlightStyle={{backgroundColor: '#eee'}}
                  searchWords={[globalSearch.searchText]}
                  textToHighlight={`${item}`}
                  style={styles.flatListText}
                />
              {
                item && item!=='' ? 
                <Icon size={22} name={'external-link'} type='font-awesome' color={"#aaa"} iconStyle={{flex:0.1}} />
                :
                null
              }
          </TouchableOpacity>}
        />
        :
        null
    }
    </React.Fragment>
  );  
})

const mapStateToProps = (store)=>{
  return {
    globalSearch    : store.globalSearch,
    productList     : store.productList,
    user_id         : store.userDetails.user_id ? store.userDetails.user_id : null
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchSuggetion);