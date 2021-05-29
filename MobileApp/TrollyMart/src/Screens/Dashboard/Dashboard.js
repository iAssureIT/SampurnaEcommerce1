import React, {useState,useEffect}  from 'react';
import {ScrollView,
        View,
        FlatList, 
        TouchableOpacity,
        Keyboard}                   from 'react-native';
import {Icon }                      from "react-native-elements";
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import {useDispatch,connect }   from 'react-redux';
import axios                        from "axios";
import { useIsFocused }             from "@react-navigation/native";
import Highlighter                  from 'react-native-highlight-words';
import HeaderBar2                   from '../../ScreenComponents/HeaderBar2/HeaderBar2.js';
import {BannerComponent}            from '../../ScreenComponents/BannerComponent/BannerComponent.js';
import {MarketingBlock}             from '../../ScreenComponents/MarketingBlock/MarketingBlock.js';
import {MenuCarouselSection}        from '../../ScreenComponents/Section/MenuCarouselSection.js';
import {ProductList}                from'../../ScreenComponents/ProductList/ProductList.js';
import {Footer}                     from '../../ScreenComponents/Footer/Footer1.js';
import styles                       from '../../AppDesigns/currentApp/styles/ScreenStyles/Dashboardstyles.js';
import Loading                      from '../../ScreenComponents/Loading/Loading.js';
import {withCustomerToaster}        from '../../redux/AppState.js';
import { getList } 		              from '../../redux/productList/actions';
import { getSectionList } 		      from '../../redux/section/actions';
import { getPreferences } 		      from '../../redux/storeSettings/actions';
import { SET_SEARCH_CALL,
        SET_SEARCH_TEXT } 	          from '../../redux/globalSearch/types';
import { getSearchResult } 	        from '../../redux/globalSearch/actions';
import {HorizontalSecCatList}       from '../../ScreenComponents/HorizontalSecCatList/HorizontalSecCatList.js';
import {HorizontalProductList}      from '../../ScreenComponents/HorizontalProductList/HorizontalProductList.js';
import { Alert } from 'react-native';

TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};

export const Dashboard = withCustomerToaster((props)=>{
  const isFocused             = useIsFocused();
  const dispatch              = useDispatch();
  const {setToast,navigation,productList,wishList,globalSearch,preferences,user_id} = props; 
  const [isOpen,setOpen]      = useState(false);
  const [blocks,setBlocks]    = useState([]);
  const [loading,setLoading]  = useState(true);
  const limit                 = 6;
  // const store = useSelector(store => ({
  //   productList     : store.productList,
  //   wishList        : store.wishDetails.wishList,
  //   globalSearch    : store.globalSearch,
  //   location        : store.location,
  //   preferences     : store.storeSettings.preferences
  // }));
    useEffect(() => {
      dispatch(getSectionList());
      dispatch(getPreferences());
      getBlocks();
    },[]);

    useEffect(() => {
      if(isFocused){
        dispatch(getList('featured',user_id,limit));
        dispatch(getList('exclusive',user_id,limit));
        dispatch(getList('discounted',user_id,limit));
      }  
    },[isFocused]);

  const getBlocks=()=>{
    axios.get('/api/pages/get/page_block/homepage')
    .then(res=>{
      console.log("getBlocks res=>",res);
      setBlocks(res.data.pageBlocks);
      setLoading(false)
    })
    .catch(error=>{
      console.log("error",error);
      if (error.response.status == 401) {
        setToast({text: 'Your Session is expired. You need to login again.', color: 'warning'});
        navigation.navigate('App')
      }else{
        setToast({text: 'Something went wrong.', color: 'red'});
      }  
    })
  }


  return (
    <React.Fragment>
      <HeaderBar2 
        navigation={navigation}
        toggle={setOpen} 
        openControlPanel={()=>_drawer.open()}
      /> 
      <View style={styles.superparent}>
      {loading ?
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <Loading/>
        </View>
        :
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
          <View  style={[styles.formWrapper,{paddingHorizontal:15,paddingVertical:5, marginBottom:'18%'}]}> 
            {globalSearch.searchText ?
              null
            :
              <MenuCarouselSection
                navigation  = {navigation} 
                showImage   = {true}
                boxHeight   = {80}
              />
            }
            {globalSearch.searchText ?
              null
            :
            blocks && blocks.length > 0 ?
              blocks.map((item,index)=>{
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
                    <HorizontalSecCatList 
                      blockTitle          = {item.block_id?.blockTitle}
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
                    :
                    item.blockComponentName === "ProductCarousel" ?
                    <HorizontalProductList 
                      blockTitle   = {item.block_id?.blockTitle}
                      blockApi     = {item.block_id?.blockSettings.blockApi}
                      section      = {item.block_id?.blockSettings.section}
                      category     = {item.block_id?.blockSettings.category}
                      subCategory  = {item.block_id?.blockSettings.subCategory}
                      currency     = {preferences.currency}
                    />
                  :
                  null  
                )
                
              })
              :
              null
            } 
            {globalSearch.searchText ?
              <ProductList 
                  navigate    = {navigation.navigate} 
                  title       = {'Search Products'}  
                  newProducts = {globalSearch.searchList} 
                  searchText     = {globalSearch.searchText}
                  userId         = {user_id} 
                  limit          = {20}
                  loading        = {productList.loading}
                  />
            :
            <View>
              {productList.featuredList && productList.featuredList && productList.featuredList.length > 0 ? 
                <ProductList 
                  navigate    = {navigation.navigate} 
                  title       = {'Featured Products'}  
                  newProducts = {productList.featuredList} 
                  type        = {'featured'} 
                  route       = {'AllProductList'}  
                  wishList    = {wishList} 
                  userId      = {user_id} 
                  limit       = {6}
                  loading     = {productList.loading}
                  />
                : null}
                
              {productList.exclusiveList && productList.exclusiveList.length > 0  ? 
                <ProductList 
                  navigate    = {navigation.navigate} 
                  title       = {'Exclusive Products'}  
                  newProducts = {productList.exclusiveList} 
                  type        = {'exclusive'} 
                  route       = {'AllProductList'}  
                  wishList    = {wishList} 
                  userId      = {user_id} 
                  limit       = {6}
                  loading     = {productList.loading}
                />
                : null}

              {productList.discountedList && productList.discountedList.length > 0  ? 
                <ProductList 
                  navigate    = {navigation.navigate} 
                  title       = {'Discounted Products'}  
                  newProducts = {productList.discountedList} 
                  type        = {'discounted'} 
                  route       = {'AllProductList'}  
                  wishList    = {wishList} 
                  userId      = {user_id} 
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