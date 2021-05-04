import React, { useState,useEffect }from 'react';
import {ScrollView,View,Text}       from 'react-native';
import { Header, Button, 
        Icon, SearchBar }           from "react-native-elements";
import SideMenu                     from 'react-native-side-menu';
import {Menu}                       from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar2                   from '../../ScreenComponents/HeaderBar2/HeaderBar2.js';
import {BannerComponent}            from '../../ScreenComponents/BannerComponent/BannerComponent.js';
import {MenuCarouselSection}        from '../../ScreenComponents/Section/MenuCarouselSection.js';
import {ProductList}                from'../../ScreenComponents/ProductList/ProductList.js';
import SearchProducts               from'../Search/SearchProducts.js';
import Footer                       from '../../ScreenComponents/Footer/Footer1.js';
import Notification                 from '../../ScreenComponents/Notification/Notification.js'
import { connect,useDispatch,useSelector }      from 'react-redux';
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import {colors}                     from '../../AppDesigns/currentApp/styles/styles.js';
import Drawer                       from 'react-native-drawer';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import axios                        from "axios";
import {useNavigation}              from '../../config/useNavigation.js';
import {withCustomerToaster}        from '../../redux/AppState.js';
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import { getList } 		              from '../../redux/productList/actions';
import { getWishList } 		          from '../../redux/wishDetails/actions';

export const Dashboard = withCustomerToaster((props)=>{
   console.log("props",props);
  const dispatch 		= useDispatch();
  const {setToast} = props; 
  const navigation = useNavigation();
  const [isOpen,setOpen]= useState(false);
  const [categories,setCategories]= useState([]);
  const [searchProductsDetails,setSearchProductsDetails]= useState([]);
  const [countData,setCountData]= useState([]);
  const [user_id,setUserId]= useState('');
  const [token,setToken]= useState('');
  const store = useSelector(store => ({
    searchText  : store.searchText,
    productList : store.productList,
    wishList    : store.wishDetails.wishList
  }));
  const {searchText,productList,wishList} = store; 

  useEffect(() => {
    console.log("useEffect");
    getData()
  },[]);

  const getData=async()=>{
      var data = await AsyncStorage.multiGet(['user_id', 'token']);
      console.log("data",data);
      setUserId(data[0][1]);
      setToken(data[1][1]);
      countfun(data[0][1]);
      dispatch(getList('featured'));
      dispatch(getList('exclusive'));
      dispatch(getList('discounted'));
      dispatch(getWishList(data[0][1]));
      searchProducts();
  }

  const countfun=(user_id)=>{
    axios.get("/api/Carts/get/count/" + user_id)
    .then((response) => {
      setCountData(response.data);
    })
    .catch((error) => { 
      console.log("error",error);
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
        console.log("error",error);
        navigation.navigate('App')
        setToast({text: 'Something went wrong.', color: 'red'});
      })
  }



  const menu = <Menu navigate={navigation.navigate} isOpen={isOpen}/>;

    return (
      <React.Fragment>
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={isOpen}  onChange={isOpen => setOpen(isOpen)} > 
         <HeaderBar2 
            navigation={navigation}
            toggle={setOpen} 
            openControlPanel={()=>_drawer.open()}
          /> 
          <View style={styles.superparent}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
              <View  style={styles.formWrapper}>
                {props.searchText ?
                  null
                :
                  <BannerComponent />
                }
                {props.searchText ?
                  null
                :
                  <MenuCarouselSection  navigate = {navigation.navigate}/>
                }
                {props.searchText ?
                  <SearchProducts navigate = {navigation.navigate} title={'Search Products'} searchProds={searchProductsDetails}  />
                :
                  (productList.featureList.length > 0 ? 
                    <ProductList navigate = {navigation.navigate} title={'Featured Products'}  newProducts={productList.featureList} type={'featured'} route={'AllFeatureProducts'}  wishList={wishList} userId={user_id} categories={categories}/>
                    : null
                  )
                }
                {props.searchText ? null :
                  (productList.exclusiveList.length > 0  ? 
                    <ProductList navigate = {navigation.navigate} title={'Exclusive Products'}  newProducts={productList.exclusiveList} type={'exclusive'} route={'AllExclusiveProducts'}  wishList={wishList} userId={user_id} categories={categories}/>
                    : null
                  )
                }
                {props.searchText ? null :
                    (productList.discountedList.length > 0  ? 
                    <ProductList navigate = {navigation.navigate} title={'Discounted Products'}  newProducts={productList.discountedList} type={'discounted'} route={'AllDiscountedProducts'}  wishList={wishList} userId={user_id} categories={categories}/>
                    : null
                  )
                }
              </View>  
            </ScrollView>
            <Footer/>
          </View> 
        </SideMenu>
      </React.Fragment>
    );  
})