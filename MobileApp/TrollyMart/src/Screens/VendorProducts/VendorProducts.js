import React,{useState,useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Image
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
import { NetWorkError } from '../../../NetWorkError.js';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';


const window = Dimensions.get('window');
const VendorProducts = (props)=>{
  const isFocused = useIsFocused();
  const [productsDetails,setProductDetails] = useState([]);
  const [userId,setUserId]=useState('');
  const [showFilters,setShowFilters]= useState(false);
  const [subCategory,setSubCategory]= useState([]);
  const {navigation,route}=props;
  const [showSort, toggleSort] = useState(false);
  const [refreshing,setRefresh]= useState(false)
  const {vendor,sectionUrl,section,index,vendorLocation_id,category}=route.params;
  const dispatch = useDispatch();

  TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
  
  const filterOptions = [
    "Sub Category",
    "Brand",
  ];


  const {productList,brandList,payload,globalSearch} = props;
  const HEADER_HEIGHT = 185;
  var scrollY = new Animated.Value(0);
  var diffClampScrollY= Animated.diffClamp(scrollY,0,HEADER_HEIGHT);
  var headerY= Animated.interpolate(diffClampScrollY,{
    inputRange:[0,HEADER_HEIGHT],
    outputRange:[0,-HEADER_HEIGHT]
  })
    // var diffClamp= Animated.diffClamp(scrollY,0,185)
    // var translateY = diffClamp.interpolate({
    //   inputRange:[0,185],
    //   outputRange:[0,-185]
    // })

  useEffect(() => {
    getData();
 },[props,isFocused]);



 const refreshControl=()=>{
  setRefresh(true);
  dispatch(getCategoryWiseList(payload));
  setRefresh(false);
}
 
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
      {/* <Icon color={"#333"} name="sort" /> */}
      <Image
      resizeMode="contain"
      source={require("../../AppDesigns/currentApp/images/sort.png")}
      style={{height:50,width:80}}
      />
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
  // Animated.event([
  //   {nativeEvent: {contentOffset: {y: scrollY}}},
  // ])
}

// console.log("translateY",translateY);

  return (
    <View style={{flex:1}}>
      {!props.isConnected?
      <NetWorkError/>
      :
      globalSearch.search ?
        <SearchSuggetion />
        :
        <View style={styles.container} >
          <Animated.View
            style={{
              transform:[
                {translateY:headerY}
              ],
              height: HEADER_HEIGHT,
              elevation:1000,
		          zIndex:1000,
              position:"absolute",
              backgroundColor:"#fff"
            }}
            
          >
           {/* <View style={[styles.block1]}> */}
             <View style={{elevation:5,backgroundColor:"#fff"}}>
                <View style={{backgroundColor:"#EEEEEE",marginTop:3,height:20}}>
                    <Text numberOfLines={1} style={[{paddingHorizontal:5,fontWeight:"bold",fontSize:14,color:"#333"}]}>{vendor?.vendorName ? vendor?.vendorName : vendor?.companyName}</Text>
                </View> 
                <View style={{height:70}}>
                  <MenuCarouselSection  
                      navigation  = {navigation}   
                      showImage   = {true} 
                      boxHeight   = {40} 
                      selected    = {section}
                      index       = {index}
                  />
                </View>  
            </View>         
            <View style={{height:60,marginTop:2}}>
              <CategoryList 
                navigation          = {navigation}  
                showImage           = {false} 
                boxHeight           = {30} 
                setSubCategory      = {setSubCategory}
                category            = {category? category : ''}
                vendorLocation_id   = {vendorLocation_id}
                vendor              = {vendor}
                // setCategory = {setCategory}
              />
            </View>
            <View style={{marginTop:2,height:40}}>
              <View style={{justifyContent:"flex-end",flexDirection:'row',flex:1}}>
                <TouchableOpacity style={{width:30,height:26,elevation:1,marginRight:10,justifyContent:'center',alignItems:'center',borderRadius:4,borderWidth:0.5,borderColor:"#f1f1f1"}} onPress={()=>setShowFilters(true)}>
                  <Image
                    resizeMode="contain"
                    source={require("../../AppDesigns/currentApp/images/filter.png")}
                    style={{height:25,width:25}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{width:30,height:26,elevation:1,marginRight:5,justifyContent:'center',alignItems:'center',borderRadius:4,borderColor:"#f1f1f1"}} onPress={()=>toggleSort(true)}>
                  {/* <Icon name="sort" type="material-community" color={"#333"} size={20} /> */}
                  <Image
                  resizeMode="contain"
                  source={require("../../AppDesigns/currentApp/images/sort.png")}
                  style={{height:17,width:17}}
                  />
                </TouchableOpacity>
              </View>  
            </View>
           {/* </View> */}
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
                  marginTop             = {HEADER_HEIGHT}
                  paddingBottom         = {250}
                  category              = {category}
                  subCategory           = {subCategory}
                  vendor                = {vendor}
                  onScroll              = {onScroll}
                />
            :
            <View style={{height:window.height,justifyContent:"center",alignItems:'center'}}>
              <Image 
                source={require('../../AppDesigns/currentApp/images/No-Products-Available.png')}
                style={{height:300,width:300}}
                resizeMode="contain"
              />
              <Text style={CommonStyles.noDataFound}>No Product Available</Text>
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
            section         = {section}
            vendorLocation_id = {vendorLocation_id}
            brandsArray     = {brandList && brandList.length > 0 ? brandList.map((a, i)=>{return {label :a,value :a}}): []}
            // sizeArray       = {[]}
        />
      </View>}
    </View>
  );
}

const mapStateToProps = (store)=>{
  console.log("store",store);
  return {
    productList     : store.productList,
    userDetails     : store.userDetails,
    brandList       : store.productList.categoryList.brandList,
    payload         : store.productList.searchPayload,
    globalSearch    : store.globalSearch,
    isConnected     : store?.netWork?.isConnected
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(VendorProducts);


