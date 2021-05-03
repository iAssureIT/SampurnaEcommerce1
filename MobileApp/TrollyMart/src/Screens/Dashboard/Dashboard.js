import React, { useState,useEffect }from 'react';
import {ScrollView,View,Text}       from 'react-native';
import { Header, Button, 
        Icon, SearchBar }           from "react-native-elements";
import SideMenu                     from 'react-native-side-menu';
import {Menu}                         from '../../ScreenComponents/Menu/Menu.js';
import HeaderBar2                   from '../../ScreenComponents/HeaderBar2/HeaderBar2.js';
import {BannerComponent}              from '../../ScreenComponents/BannerComponent/BannerComponent.js';
import {MenuCarouselSection}        from '../../ScreenComponents/Section/MenuCarouselSection.js';
import {ProductList}                from'../../ScreenComponents/ProductList/ProductList.js';
import SearchProducts               from'../Search/SearchProducts.js';
import Footer                       from '../../ScreenComponents/Footer/Footer1.js';
import Notification                 from '../../ScreenComponents/Notification/Notification.js'
import { connect }                  from 'react-redux';
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import {colors}                     from '../../AppDesigns/currentApp/styles/styles.js';
import Drawer                       from 'react-native-drawer';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import axios                        from "axios";
import {useNavigation}              from '../../config/useNavigation.js';
import {withCustomerToaster}        from '../../redux/AppState.js';
import AsyncStorage                 from '@react-native-async-storage/async-storage';

 const Dashboard = withCustomerToaster((props)=>{
  const {setToast} = props; 
  const navigation = useNavigation();
  const [isOpen,setOpen]= useState(false);
  const [exclusiveProducts,setExclusiveProducts]= useState([]);
  const [featuredProducts,setFeaturedProducts]= useState([]);
  const [discountedProducts,setDiscountedProducts]= useState([]);
  const [categories,setCategories]= useState([]);
  const [featuredproductsloading,setFeaturedProductsLoading]= useState(true);
  const [exclusiveprloading,setExclusiveprloading]= useState(true);
  const [discountedprloading,setDiscountedprloading]= useState(true);
  const [searchProductsDetails,setSearchProductsDetails]= useState([]);
  const [countData,setCountData]= useState([]);
  const [wishList,setWishList]= useState([]);
  const [user_id,setUserId]= useState('');
  const [token,setToken]= useState('');

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
      featuredProductData();
      exclusiveProductsData();
      discountedProductsData();
      searchProducts();
      getWishData(data[0][1]);
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

  const featuredProductData=()=>{
    var productType1 = 'featured';
    axios.get("/api/products/get/products/listbytype/"+productType1)
      .then((response)=>{
        setFeaturedProductsLoading(false);
        setFeaturedProducts(response.data);
      })
      .catch((error)=>{
        console.log("error",error);
        navigation.navigate('App')
        setToast({text: 'Something went wrong.', color: 'red'});
      })
  }

  const exclusiveProductsData=()=>{
    var productType2 = 'exclusive';
    axios.get("/api/products/get/products/listbytype/"+productType2)
    .then((response)=>{
      setExclusiveprloading(false)
      setExclusiveProducts(response.data)
    })
    .catch((error)=>{
      console.log("error",error);
      navigation.navigate('App')
      setToast({text: 'Something went wrong.', color: 'red'});
    })
  }

  const discountedProductsData=()=>{
    var productType2 = 'discounted';
    axios.get("/api/products/get/products/listbytype/"+productType2)
    .then((response)=>{
      setDiscountedProducts[response.data];
      setDiscountedprloading(false);
    })
    .catch((error)=>{
      console.log("error",error);
      navigation.navigate('App')
      setToast({text: 'Something went wrong.', color: 'red'});
    })
  }

  const getWishData=(user_id)=>{
    axios.get('/api/wishlist/get/userwishlist/'+user_id)
    .then((response)=>{
      featuredProductData();
      exclusiveProductsData();
      discountedProductsData();
      setWishList(response.data);
    })
    .catch((error)=>{
      console.log("error",error);
      navigation.navigate('App')
      setToast({text: 'Something went wrong.', color: 'red'});
    })
  }

  const { navigate,dispatch } = props.navigation;
  const menu = <Menu navigate={navigate} isOpen={isOpen}/>;

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
                  <MenuCarouselSection  navigate = {navigate}/>
                }
                {props.searchText ?
                  <SearchProducts navigate = {navigate} title={'Search Products'} searchProds={searchProductsDetails}  />
                :
                  (featuredProducts.length > 0 ? 
                    <ProductList navigate = {navigate} title={'Featured Products'}  newProducts={featuredProducts} type={'featured'} getWishData={getWishData} wishList={wishList} userId={user_id} categories={categories}/>
                    : null
                  )
                }
                {props.searchText ? null :
                  (exclusiveProducts.length > 0 ? 
                    <ProductList navigate = {navigate} title={'Exclusive Products'}  newProducts={exclusiveProducts} type={'exclusive'} getWishData={getWishData} wishList={wishList} userId={user_id} categories={categories}/>
                    : null
                  )
                }
                {props.searchText ? null :
                  (exclusiveProducts.length > 0 ? 
                    <ProductList navigate = {navigate} title={'Discounted Products'}  newProducts={discountedProducts} type={'exclusive'} getWishData={getWishData} wishList={wishList} userId={user_id} categories={categories}/>
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

const mapStateToProps = (state) => {
  return {
      searchText: state.searchText,
  }
};
export default connect(mapStateToProps)(Dashboard)
