import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated
} from 'react-native';
import { Icon,ButtonGroup }  from "react-native-elements";
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/vendorListStyles';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import { useIsFocused }       from "@react-navigation/native";
import {ProductList}          from'../../ScreenComponents/ProductList/ProductList.js';
import {useSelector,
        useDispatch }         from 'react-redux';
import {CategoryList}         from '../../ScreenComponents/CategoryList/CategoryList.js';        
import {MenuCarouselSection}  from '../../ScreenComponents/Section/MenuCarouselSection.js';  
import CommonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import FilterModal            from '../../ScreenComponents/FilterModal/FilterModal.js';  
import {SortModal}            from '../../ScreenComponents/SortModal/SortModal.js';  
import { getCategoryWiseList }from '../../redux/productList/actions.js';
import {STOP_SCROLL,SET_CATEGORY_WISE_LIST}          from '../../redux/productList/types';
import Loading                  from '../../ScreenComponents/Loading/Loading.js';
import SearchSuggetion          from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { Dimensions } from 'react-native';
const scrollY = new Animated.Value(0);
const diffClamp= Animated.diffClamp(scrollY,0,250)
const translateY = diffClamp.interpolate({
  inputRange:[0,180],
  outputRange:[0,-180]
})
const window = Dimensions.get('window');
export const VendorProducts = (props)=>{
  const isFocused = useIsFocused();
  const [productImage,setProductImage]=useState([]);
  const [productsDetails,setProductDetails] = useState([]);
  const [userId,setUserId]=useState('');
  const [wished,setWished]=useState('');
  const [packSize,setPackSize]=useState('');
  const [showFilters,setShowFilters]= useState(false);
  const [selectedIndex, setIndex] = useState();
  const [subCategory,setSubCategory]= useState([]);
  const {navigation,route}=props;
  const [showSort, toggleSort] = useState(false);
  const {vendor,sectionUrl,section,index,vendorLocation_id}=route.params;
  const dispatch 		= useDispatch();
  TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
  
  const filterOptions = [
    "Sub Category",
    "Brand",
    "Size",
  ];

  const store = useSelector(store => ({
    productList : store.productList,
    userDetails : store.userDetails,
    brandList   : store.productList.categoryList.brandList,
    payload     : store.productList.searchPayload,
    globalSearch    : store.globalSearch
  }));
  const {productList,userDetails,brandList,payload,globalSearch} = store;

  useEffect(() => {
    getData();
 },[props]);
 
 const getData=()=>{
    AsyncStorage.multiGet(['user_id', 'token'])
    .then((data) => {
      setUserId(data[0][1]);
        for (var i = 0; i < productList.categoryWiseList.length; i++) {
          var availableSizes = [];
          if (productList.categoryWiseList[i].size) {
            availableSizes.push(
              {
                "productSize": productList.categoryWiseList[i].size * 1,
                "packSize": 1,
              },
              {
                "productSize": productList.categoryWiseList[i].size * 2,
                "packSize": 2,
              },
              {
                "productSize": productList.categoryWiseList[i].size * 4,
                "packSize": 4,
              },
            )
            productList.categoryWiseList[i].availableSizes = availableSizes;
          }
        }
        setProductDetails(productList.categoryWiseList);
    })
  }

  const setCategory =(e)=>{
    var subCategoryArray = e.subCategory.map((a, i)=>{
      return {
          label :a.subCategoryTitle,        
          value :e.categoryUrl+"^"+a.subCategoryUrl,        
      } 
    })
    dispatch({
      type:STOP_SCROLL,
      payload:false
    })
    setSubCategory(subCategoryArray);
    payload.vendor_ID        = vendor.vendor_ID;
    payload.sectionUrl      = sectionUrl;
    payload.categoryUrl     = e.categoryUrl;
    payload.subCategoryUrl  = e.subCategoryUrl ? e.subCategoryUrl : [] ;
    payload.scroll          = false;
    payload.startRange      = 0;
    payload.limitRange      = 10;
    dispatch({
      type : SET_CATEGORY_WISE_LIST,
      payload : []
    })
    dispatch(getCategoryWiseList(payload));
  }

  const sortOptions = [
    {label: 'A -> Z',  sort_order: 'AZ'},
    {label: 'Z -> A',  sort_order: 'ZA'},
    {label: 'Price Low -> High', sort_order: 'PL'},
    {label: 'Price High -> Low',  sort_order: 'PH'},
  ];

  const SortButton = () => (
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
      <Icon color={"#333"} name="sort" />
    </View>
  );
  const FilterButton = () => (
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
      <Icon color={"#333"} name="filter" type="material-community" />
    </View>
  );

  const buttons = [{element: SortButton}, {element: FilterButton}];

const onScroll=(e)=>{
  scrollY.setValue(e.nativeEvent.contentOffset.y);
}

  return (
    <View style={{flex:1}}>
      {globalSearch.search ?
        <SearchSuggetion />
        :
        <View style={styles.container}>
          <Animated.View
            style={{
              transform:[
                {translateY:translateY}
              ],
              elevation:4,
		          zIndex:100,
              position:"absolute"
            }}
          >
           <View style={[styles.block1]}>
            <MenuCarouselSection  
                navigation  = {navigation}   
                showImage   = {true} 
                boxHeight   = {40} 
                selected    = {section}
                index       = {index}
            />
            <View style={{flexDirection:"row"}}>
              <View style={{flex:0.1}}/>
              <View style={{flex:0.9}}>
                <Text style={CommonStyles.headerText}>{vendor.vendorName}</Text>
              </View>  
            {/* <View style={{flex:0.5}}> */}
              {/* <ButtonGroup
              onPress={(index) => {
                if (index === 0) {
                  setIndex(0);
                  toggleSort(true);
                } else {
                  toggleFilters(true);
                  setIndex(1);
                }
              }}
              selectedIndex={selectedIndex}
              buttons={buttons}
              containerStyle={{
                height: 50,
                backgroundColor: '#fff',
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
                borderWidth:0
              }}
              selectedButtonStyle={{backgroundColor: 'transparent'}}
              selectedTextStyle={{color: '#fa6801'}}
            /> */}
            {/* </View> */}
            <TouchableOpacity style={{flex:0.1}} onPress={()=>setShowFilters(true)}>
                <Icon name="filter" type="material-community" color={"#333"}  />
              </TouchableOpacity>
              <TouchableOpacity style={{flex:0.1}} onPress={()=>toggleSort(true)}>
                <Icon name="sort" type="material-community" color={"#333"}  />
              </TouchableOpacity>
            </View>
            <CategoryList 
              navigation  = {navigation}  
              showImage   = {true} 
              boxHeight   = {40} 
              setCategory = {setCategory}
            />
            </View>
          </Animated.View>  
            {productList.categoryWiseList.length ===0 && productList.loading ?
           <View style={{marginTop:400}}>
            <Loading />
           </View> 
            : 
            productList.categoryWiseList && productList.categoryWiseList.length >0 ?
              <ProductList 
                  navigate      = {navigation.navigate} 
                  newProducts   = {productList.categoryWiseList}  
                  userId        = {userId}  
                  loading       = {productList.loading}
                  limit         = {10}
                  payload       = {payload}
                  type          = "vendor_sub_cat"
                  vendorLocation_id = {vendorLocation_id}
                  onEndReachedThreshold = {0.01}
                  onScroll       = {onScroll}
                />
            :
            <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
              <Text style={CommonStyles.noDataFound}>No Product Found</Text>
            </View> 
          } 
        <SortModal
          sortOptions={sortOptions}
          closeModal={() => toggleSort(false)}
          visible={showSort}
        />
        <FilterModal
            filterOptions   = {filterOptions}
            closeModal      = {() => setShowFilters(false)}
            visible         = {showFilters}
            subCategory     = {subCategory}
            brandsArray     = {brandList && brandList.length > 0 ? brandList.map((a, i)=>{return {label :a,value :a}}): []}
            sizeArray       = {[]}
        />
      </View>}
    </View>
  );
}



