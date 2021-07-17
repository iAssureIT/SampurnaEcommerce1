import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated
}                             from 'react-native';
import { Icon }               from "react-native-elements";
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/vendorListStyles.js';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import { useIsFocused }       from "@react-navigation/native";
import {ProductList}          from'../../ScreenComponents/ProductList/ProductList.js';
import { connect,useDispatch} from 'react-redux';
import {CategoryList}         from '../../ScreenComponents/CategoryList/CategoryList.js';        
import {MenuCarouselSection}  from '../../ScreenComponents/Section/MenuCarouselSection.js';  
import CommonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import FilterModal            from '../../ScreenComponents/FilterModal/FilterModal.js';  
import {SortModal}            from '../../ScreenComponents/SortModal/SortModal.js';  
import Loading                from '../../ScreenComponents/Loading/Loading.js';
import SearchSuggetion        from '../../ScreenComponents/SearchSuggetion/SearchSuggetion.js';
import { Dimensions }         from 'react-native';
import { colors }             from '../../AppDesigns/currentApp/styles/styles';

const scrollY = new Animated.Value(0);
const diffClamp= Animated.diffClamp(scrollY,0,135)
const translateY = diffClamp.interpolate({
  inputRange:[0,135],
  outputRange:[0,-135]
})
// console.log("diffClamp",diffClamp);
const window = Dimensions.get('window');
const VendorProducts = (props)=>{
  const isFocused = useIsFocused();
  const [productsDetails,setProductDetails] = useState([]);
  const [userId,setUserId]=useState('');
  const [showFilters,setShowFilters]= useState(false);
  const [subCategory,setSubCategory]= useState([]);
  const {navigation,route}=props;
  const [showSort, toggleSort] = useState(false);
  const {vendor,sectionUrl,section,index,vendorLocation_id,category}=route.params;
  const dispatch 		= useDispatch();

  TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
  
  const filterOptions = [
    "Sub Category",
    "Brand",
  ];

  const {productList,brandList,payload,globalSearch} = props;

  useEffect(() => {
    getData();
 },[props,isFocused]);
 
 const getData= async ()=>{
    var user_id = await  AsyncStorage.getItem('user_id') 
    setUserId(user_id);
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
      // console.log("productList.categoryWiseList",productList.categoryWiseList);
      setProductDetails(productList.categoryWiseList);
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
            <CategoryList 
              navigation      = {navigation}  
              showImage       = {true} 
              boxHeight       = {30} 
              setSubCategory = {setSubCategory}
              category       = {category? category : ''}
              // setCategory = {setCategory}
            />
            <View style={{flexDirection:"row",marginTop:2,alignItems:'center'}}>
              <View style={{paddingVertical:2,flex:0.7}}>
                  <Text numberOfLines={1} style={[CommonStyles.label,{paddingHorizontal:5,fontWeight:"bold"}]}>{vendor?.vendorName}</Text>
              </View> 
              <View style={{justifyContent:"flex-end",flexDirection:'row',flex:0.3}}>
                <TouchableOpacity style={{width:26,height:24,elevation:1,marginRight:5,justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:"#f1f1f1"}} onPress={()=>setShowFilters(true)}>
                    <Icon name="filter" type="material-community" color={"#333"} size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={{width:26,height:24,elevation:1,marginRight:5,justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:"#f1f1f1"}} onPress={()=>toggleSort(true)}>
                  <Icon name="sort" type="material-community" color={"#333"} size={20} />
                </TouchableOpacity>
              </View>  
            </View>
           </View>
          </Animated.View>  
            {productList.categoryWiseList.length ===0 && productList.loading ?
              <View style={{marginTop:400}}>
                <Loading />
              </View> 
            : 
            productList.categoryWiseList && productList.categoryWiseList.length >0 ?
            isFocused && 
              <ProductList 
                  navigate              = {navigation.navigate} 
                  newProducts           = {productList.categoryWiseList}  
                  userId                = {userId}  
                  loading               = {productList.loading}
                  limit                 = {10}
                  payload               = {payload}
                  type                  = "vendor_sub_cat"
                  vendorLocation_id     = {vendorLocation_id}
                  onEndReachedThreshold = {0.01}
                  onScroll              = {onScroll}
                  marginTop             = {160}
                  paddingBottom         = {250}
                  category              = {category}
                  subCategory           = {subCategory}
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
            category        = {category}
            brandsArray     = {brandList && brandList.length > 0 ? brandList.map((a, i)=>{return {label :a,value :a}}): []}
            // sizeArray       = {[]}
        />
      </View>}
    </View>
  );
}

const mapStateToProps = (store)=>{
  return {
    productList     : store.productList,
    userDetails     : store.userDetails,
    brandList       : store.productList.categoryList.brandList,
    payload         : store.productList.searchPayload,
    globalSearch    : store.globalSearch
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(VendorProducts);


