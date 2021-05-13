import React, { useState,useEffect }from 'react';
import {ScrollView,View,Text,FlatList, TouchableOpacity,Keyboard}       from 'react-native';
import { Header, Button, 
        Icon, SearchBar }           from "react-native-elements";
import SideMenu                     from 'react-native-side-menu';
import {Menu}                       from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar2                   from '../../ScreenComponents/HeaderBar2/HeaderBar2.js';
import {BannerComponent}            from '../../ScreenComponents/BannerComponent/BannerComponent.js';
import {MarketingBlock}             from '../../ScreenComponents/MarketingBlock/MarketingBlock.js';
import {MenuCarouselSection}        from '../../ScreenComponents/Section/MenuCarouselSection.js';
import {ProductList}                from'../../ScreenComponents/ProductList/ProductList.js';
import SearchProducts               from'../Search/SearchProducts.js';
import {Footer}                       from '../../ScreenComponents/Footer/Footer1.js';
import Notification                 from '../../ScreenComponents/Notification/Notification.js'
import { connect,useDispatch,useSelector }      from 'react-redux';
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import {colors}                     from '../../AppDesigns/currentApp/styles/styles.js';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import axios                        from "axios";
// 
import {withCustomerToaster}        from '../../redux/AppState.js';
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import { getList } 		              from '../../redux/productList/actions';
import { getWishList } 		          from '../../redux/wishDetails/actions';
import { useIsFocused }             from "@react-navigation/native";
import { SET_SEARCH_CALL,SET_SEARCH_TEXT,SET_SUGGETION_LIST,SET_SERACH_LIST} 	        from '../../redux/globalSearch/types';
import { getSearchResult } 	from '../../redux/globalSearch/actions';
import Highlighter from 'react-native-highlight-words';
export const Dashboard = withCustomerToaster((props)=>{
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {setToast,navigation} = props; 
  // 
  const [isOpen,setOpen]= useState(false);
  const [categories,setCategories]= useState([]);
  const [searchProductsDetails,setSearchProductsDetails]= useState([]);
  const [countData,setCountData]= useState([]);
  const [user_id,setUserId]= useState('');
  const [limit,setLimit]= useState(6);
  const [token,setToken]= useState('');

  const store = useSelector(store => ({
    productList     : store.productList,
    wishList        : store.wishDetails.wishList,
    globalSearch    : store.globalSearch,
  }));

  const {productList,wishList,globalSearch} = store;
  useEffect(() => {
    dispatch({type : SET_SUGGETION_LIST, payload  : []});
    dispatch({type : SET_SEARCH_TEXT,    payload  : ''});
    dispatch({type : SET_SERACH_LIST,    payload  : []});
    dispatch({type:SET_SEARCH_CALL,payload:false});
    getData();
  },[props,isFocused]);

  const getData=async()=>{
      var data = await AsyncStorage.multiGet(['user_id', 'token']);
      setUserId(data[0][1]);
      setToken(data[1][1]);
      dispatch(getList('featured',data[0][1],limit));
      dispatch(getList('exclusive',data[0][1],limit));
      dispatch(getList('discounted',data[0][1],limit));
      if(data[0][1]){
        countfun(data[0][1]);
        dispatch(getWishList(data[0][1]));
      }
      searchProducts();
  }

  const countfun=(user_id)=>{
    axios.get("/api/Carts/get/count/" + user_id)
    .then((response) => {
      setCountData(response.data);
    })
    .catch((error) => { 
      navigation.navigate('App')
      setToast({text: 'Something went wrong.', color: 'red'});
    })
  }

  const searchProducts=()=>{
    axios.get("/api/products/get/searchproducts/" + props.searchText)
      .then((response) => {
        setSearchProductsDetails([])
      })
      .catch((error) => {
        navigation.navigate('App')
        setToast({text: 'Something went wrong.', color: 'red'});
      })
  }



  const menu = <Menu navigate={navigation.navigate} isOpen={isOpen}/>;

    return (
      <React.Fragment>
       
         <HeaderBar2 
            navigation={navigation}
            toggle={setOpen} 
            openControlPanel={()=>_drawer.open()}
          /> 
          <View style={styles.superparent}>
          {
            globalSearch.search ?
              globalSearch.loading ?
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Loading/>
              </View>
              :
              <FlatList 
                keyboardShouldPersistTaps='handled'
                data={globalSearch.suggestionList.concat(['','','','','','','','','','','','','','','',''])} 
                // keyExtractor = {(item)=>item}
                renderItem = {({item}) =>
                  <TouchableOpacity onPress={()=>{
                      dispatch({type:SET_SEARCH_CALL,payload:false});
                      dispatch({type:SET_SEARCH_TEXT,payload:item});
                      dispatch(getSearchResult(item,user_id,10));
                      Keyboard.dismiss();
                     }} style={styles.flatList}>
                       <Highlighter
                        highlightStyle={{backgroundColor: '#eee'}}
                        searchWords={[globalSearch.searchText]}
                        textToHighlight={`${item}`}
                        style={styles.flatListText}
                      />
                      {/* <Text style={styles.flatListText}>{`${item}`}</Text>  */}
                      {
                        item && item!=='' ? 
                        <Icon size={22} name={'external-link'} type='font-awesome' color={"#aaa"} iconStyle={{flex:0.1}} />
                        :
                        null
                      }
                  </TouchableOpacity> }
            />
            :
            <ScrollView contentContainerStyle={[styles.container]} keyboardShouldPersistTaps="handled" >
              <View  style={[styles.formWrapper]}>
                  {globalSearch.searchText ?
                    null
                  :
                    <BannerComponent />
                  }
              </View>
             <View  style={[styles.formWrapper,{padding:15}]}> 
                {globalSearch.searchText ?
                  null
                :
                  <MenuCarouselSection  navigation = {navigation}/>
                }
                {globalSearch.searchText ?
                  null
                :
                  <MarketingBlock  
                    navigation  = {navigation}
                    section     = 'Home'
                    category    = 'All'
                    subCategory = 'All'
                  />
                }
                {globalSearch.searchText ?
                  // <SearchProducts navigate = {navigation.navigate} title={'Search Products'} searchProds={searchProductsDetails}  />
                  <ProductList 
                      navigate    = {navigation.navigate} 
                      title       = {'Search Products'}  
                      newProducts = {globalSearch.searchList} 
                      // type        = {'featured'} 
                      // route       = {'AllProductList'}  
                      // wishList    = {wishList} 
                      searchText     = {globalSearch.searchText}
                      userId         = {user_id} 
                      categories     = {categories} 
                      limit          = {20}
                      loading        = {productList.loading}
                      />
                :
                <View>
                  {productList.featuredList && productList.featuredList.length > 0 ? 
                    <ProductList 
                      navigate    = {navigation.navigate} 
                      title       = {'Featured Products'}  
                      newProducts = {productList.featuredList} 
                      type        = {'featured'} 
                      route       = {'AllProductList'}  
                      wishList    = {wishList} 
                      userId      = {user_id} 
                      categories  = {categories} 
                      limit={6}
                      loading     = {productList.loading}
                      />
                    : null}
                    {globalSearch.searchText ?
                      null
                    :
                    <MarketingBlock  
                      navigation  = {navigation}
                      section     = 'All'
                      category    = 'Men'
                      subCategory = 'All'
                    />
                    }
                  {productList.exclusiveList.length > 0  ? 
                    <ProductList 
                      navigate    = {navigation.navigate} 
                      title       = {'Exclusive Products'}  
                      newProducts = {productList.exclusiveList} 
                      type        = {'exclusive'} 
                      route       = {'AllProductList'}  
                      wishList    = {wishList} 
                      userId      = {user_id} 
                      categories  = {categories} 
                      limit       = {6}
                      loading     = {productList.loading}
                    />
                    : null}
                    {globalSearch.searchText ?
                      null
                    :
                    <MarketingBlock  
                      navigation  = {navigation}
                      section     = 'All'
                      category    = 'Men'
                      subCategory = 'All'
                    />
                    }
                  {productList.discountedList.length > 0  ? 
                    <ProductList 
                      navigate    = {navigation.navigate} 
                      title       = {'Discounted Products'}  
                      newProducts = {productList.discountedList} 
                      type        = {'discounted'} 
                      route       = {'AllProductList'}  
                      wishList    = {wishList} 
                      userId      = {user_id} 
                      categories  = {categories} 
                      limit       = {6}
                      loading     = {productList.loading}
                      />
                    : null}
                  </View>  
                }
              </View>  
            </ScrollView>}
            <Footer/>
          </View> 
      </React.Fragment>
    );  
})