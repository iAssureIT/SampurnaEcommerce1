import React, {useState,useEffect}  from 'react';
import {ScrollView,
        View,
        FlatList, 
        TouchableOpacity,
        BackHandler,
        RefreshControl,
        Keyboard}                   from 'react-native';
import {Icon }                      from "react-native-elements";
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import {useDispatch,connect,useSelector }   from 'react-redux';
import axios                        from "axios";
import { useIsFocused }             from "@react-navigation/native";
import Highlighter                  from 'react-native-highlight-words';
import HeaderBar2                   from '../../ScreenComponents/HeaderBar2/HeaderBar2.js';
import {BannerComponent}            from '../../ScreenComponents/BannerComponent/BannerComponent.js';
import {MarketingBlock}             from '../../ScreenComponents/MarketingBlock/MarketingBlock.js';
import {MenuCarouselSection}        from '../../ScreenComponents/Section/MenuCarouselSection.js';
import {ProductList}                from'../../ScreenComponents/ProductList/ProductList.js';
import {Footer}                     from '../../ScreenComponents/Footer/Footer.js';
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import {withCustomerToaster}        from '../../redux/AppState.js';
import { getList,getCartCount } 		              from '../../redux/productList/actions';
import { getS3Details } 		       from '../../redux/s3Details/actions';
import { getSectionList } 		      from '../../redux/section/actions';
import { getPreferences } 		      from '../../redux/storeSettings/actions';
import {HorizontalSecCatList}       from '../../ScreenComponents/HorizontalSecCatList/HorizontalSecCatList.js';
import {HorizontalProductList}      from '../../ScreenComponents/HorizontalProductList/HorizontalProductList.js';
import SearchSuggetion              from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { Alert } from 'react-native';
import { NetWorkError } from '../../../NetWorkError.js';


TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

const Dashboard = withCustomerToaster((props)=>{
  console.log("props",props);
  const isFocused             = useIsFocused();
  const dispatch              = useDispatch();
  const {setToast,navigation,productList,wishList,globalSearch,preferences,user_id} = props; 
  const [isOpen,setOpen]      = useState(false);
  const [blocks,setBlocks]    = useState([]);
  const [loading,setLoading]  = useState(true);
  const limit                 = 6;
  const [refreshing,setRefreshing] = useState(false);

  const backAction = () => {
    Alert.alert("Confirmation!", "Are you sure you want to exit app?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  const store = useSelector(store => ({
    userDetails : store.userDetails,
    location : store.location,
    isConnected: store.netWork.isConnected
  }));

    useEffect(() => {
        dispatch(getSectionList());
        dispatch(getPreferences());
        dispatch(getS3Details());
        getBlocks();
        // let canGoBack = navigation.canGoBack();
        // if(!canGoBack){
        //   BackHandler.addEventListener("hardwareBackPress", backAction);
        //   return () =>
        //   BackHandler.removeEventListener("hardwareBackPress", backAction);
        // }
       
    },[store.isConnected]);
   

    console.log("store",store);

  const getBlocks=()=>{
    console.log("call");
    axios.get('/api/pages/get/page_block/homepage')
    .then(res=>{
      setBlocks(res.data.pageBlocks);
      setLoading(false);
      setRefreshing(false);
    })
    .catch((error)=>{
      setLoading(false);
      setRefreshing(false);
      if (error?.response?.status == 401) {
        setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
        navigation.navigate('App')
      }else if(error.message === "Network Error"){
      }else{
        setToast({text: 'Something went wrong.', color: 'red'});
      }  
    })
  }

  const onRefresh =()=>{
    setRefreshing(true);
    dispatch(getSectionList());
    getBlocks();
  }


  return (
    <React.Fragment>
      {!store.isConnected?
      <NetWorkError />
      :<View style={styles.superparent}>
      {loading ?
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <Loading/>
        </View>
        :
        globalSearch.search ?
          <SearchSuggetion />
        :
        <ScrollView 
          contentContainerStyle={[styles.container]} 
          keyboardShouldPersistTaps="handled" refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />} >
          <View  style={[styles.formWrapper]}>
              {globalSearch.searchText ?
                null
              :
                <BannerComponent />
              }
          </View>
          {/* <View style={[styles.tabWrap]}>
              <TouchableOpacity
                onPress = {()=>setValue('lowestprice')}
                style={[(value === "lowestprice" ? styles.activeTabView:styles.tabView),styles.tabBorder,styles.borderRadiusLeft]}
              >
                  <Text style={value === "lowestprice" ? styles.tabText : styles.tabText1}>Lowest Price</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress = {()=>setValue('lowestlocation')}
                style={[(value === "lowestlocation" ? styles.activeTabView:styles.tabView),styles.borderRadiusRight]}
              >
                <Text style={value === "lowestlocation" ? styles.tabText : styles.tabText1}>Lowest Location</Text>
              </TouchableOpacity>
            </View>  */}
            <View  style={[styles.formWrapper]}> 
              {globalSearch.searchText ?
                null
              :
                <MenuCarouselSection
                  navigation  = {navigation} 
                  showImage   = {true}
                  boxHeight   = {80}
                  // index       = {0}
                />
              }
            </View>
          <View  style={[styles.formWrapper,{paddingVertical:5, marginBottom:'18%'}]}> 
            
            {globalSearch.searchText ?
              null
            :
            blocks && blocks.length > 0 ?
              blocks.map((item,index)=>{
                var payload ={
                  "vendorID"          : '',
                  "sectionUrl"        :item.block_id?.blockSettings?.section!=="all" ? item.block_id?.blockSettings?.section?.replace(/\s/g, '-').toLowerCase() : 'all',
                  "categoryUrl"       : item.block_id?.blockSettings?.category!=="all" ? item.block_id?.blockSettings?.category?.replace(/\s/g, '-').toLowerCase() : 'all',
                  "subCategoryUrl"    : item.block_id?.blockSettings?.subCategory!=="all" ? item.block_id?.blockSettings?.subCategory?.replace(/\s/g, '-').toLowerCase() : 'all',
                  // "subCategoryUrl"    : e.subCategory[0]?.subCategoryUrl,
                  "startRange"        : 0,
                  "limitRange"        : 20,
                  "user_id"           : store.userDetails.user_id,
                  "userLatitude"      : store.location?.address?.latlong?.lat,
                  "userLongitude"     : store.location?.address?.latlong?.lng,
                } 
                  return(
                    item.blockComponentName === "DealsBlock" ?
                    <MarketingBlock  
                      navigation  = {navigation}
                      section     = {item.block_id?.dealSettings.section}
                      category    = {item.block_id?.dealSettings.category}
                      subCategory = {item.block_id?.dealSettings.subCategory}
                  />
                  :
                  item.blockComponentName === "SectionCatg" && !item.block_id?.groupSettings?.showOnlySection?
                  <View style={{paddingHorizontal:5}}>
                    <HorizontalSecCatList 
                      blockTitle          = {item.block_id?.blockTitle }
                      section             = {item.block_id?.groupSettings.section}
                      category            = {item.block_id?.groupSettings.category}
                      subCategory         = {item.block_id?.groupSettings.subCategory}
                      subCategory         = {item.block_id?.groupSettings.subCategory}
                      showOnlySection     = {item.block_id?.groupSettings.showOnlySection}
                      showOnlyCategory    = {item.block_id?.groupSettings.showOnlyCategory}
                      showOnlyBrand       = {item.block_id?.groupSettings.showOnlyBrand}
                      showOnlySubCategory = {item.block_id?.groupSettings.showOnlySubCategory}
                      navigation          = {navigation}
                      user_id             = {user_id}
                    />
                  </View>  
                    :
                    item.blockComponentName === "ProductCarousel" && item.block_id ?
                    <HorizontalProductList 
                      blockTitle   = {item.block_id?.blockTitle}
                      blockApi     = {item.block_id?.blockSettings.blockApi}
                      payload      = {payload}
                      currency     = {preferences.currency}
                      addToCart   = {false}
                      setToast    = {setToast}
                    />
                  :
                  null  
                )
                
              })
              :
              null
            } 
          </View>  
        </ScrollView>}
      </View> }
    </React.Fragment>
  );  
})

const mapStateToProps = (store)=>{
  return {
    productList     : store.productList,
    wishList        : store.wishDetails.wishList,
    globalSearch    : store.globalSearch,
    location        : store.location,
    preferences     : store.storeSettings.preferences,
    user_id         : store.userDetails.user_id ? store.userDetails.user_id : null
  }
};


const mapDispatchToProps = (dispatch)=>{
  return {
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);