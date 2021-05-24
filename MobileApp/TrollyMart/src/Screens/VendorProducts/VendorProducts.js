import React,{useState,useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Icon }               from "react-native-elements";
import {HeaderBar3}           from '../../ScreenComponents/HeaderBar3/HeaderBar3.js';
import {Footer}               from '../../ScreenComponents/Footer/Footer1.js';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenStyles/Categoriesstyles.js';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import { useIsFocused }       from "@react-navigation/native";
import {ProductList}          from'../../ScreenComponents/ProductList/ProductList.js';
import {useSelector,
        useDispatch }         from 'react-redux';
import {CategoryList}         from '../../ScreenComponents/CategoryList/CategoryList.js';        
import {MenuCarouselSection}  from '../../ScreenComponents/Section/MenuCarouselSection.js';  
import CommonStyles           from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import FilterModal            from '../../ScreenComponents/FilterModal/FilterModal.js';  
import { getCategoryWiseList }from '../../redux/productList/actions.js';

export const VendorProducts = (props)=>{
  const isFocused = useIsFocused();
  const [productImage,setProductImage]=useState([]);
  const [productsDetails,setProductDetails] = useState([]);
  const [userId,setUserId]=useState('');
  const [wished,setWished]=useState('');
  const [packSize,setPackSize]=useState('');
  const [showFilters,setShowFilters]= useState(false);
  const [subCategory,setSubCategory]= useState([]);
  const {navigation,route}=props;
  const {vendor,sectionUrl,section}=route.params;
  const dispatch 		= useDispatch();
  console.log("route.params",route.params);

  const filterOptions = [
    "Sub Category",
    "Brand",
    "Size",
  ];

  const store = useSelector(store => ({
    productList : store.productList,
    userDetails : store.userDetails,
  }));
  const {productList,userDetails} = store;

  useEffect(() => {
    getData();
 },[props,isFocused]);
 
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
    setSubCategory(subCategoryArray);
    var payload ={
      "vendorID"          : vendor.vendor_ID,
      "sectionUrl"        : sectionUrl,
      "categoryUrl"       : e.categoryUrl,
      "subCategoryUrl"    : e.subCategory[0]?.subCategoryUrl,
      "startRange"        : 0,
      "limitRange"        : 20
    } 
    dispatch(getCategoryWiseList(payload));
  }



  return (
    <React.Fragment>
      <HeaderBar3
        goBack={navigation.goBack}
        headerTitle={"Product List"}
        navigate={navigation.navigate}
      />
      <View style={styles.addsuperparent}>
        <MenuCarouselSection  
            navigation  = {navigation}   
            showImage   = {true} 
            boxHeight   = {40} 
            selected    = {section}
        />
        <View style={{flexDirection:"row"}}>
          <View style={{flex:0.1}}></View>
          <View style={{flex:0.9}}>
            <Text style={CommonStyles.headerText}>{vendor.vendorName}</Text>
          </View>  
          <TouchableOpacity style={{flex:0.1}} onPress={()=>setShowFilters(true)}>
            <Icon name="filter" type="font-awesome" color={"#333"}  />
          </TouchableOpacity>  
        </View>

        <CategoryList 
          navigation  = {navigation}  
          showImage   = {true} 
          boxHeight   = {40} 
          setCategory = {setCategory}
        />

       <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
          <View style={styles.formWrapper}>
            <ProductList navigate = {navigation.navigate} newProducts={productList.categoryWiseList}  userId={userId}  loading={productList.loading}/>
          </View>
      </ScrollView>

      <Footer/>
     </View>
      <FilterModal
          filterOptions   = {filterOptions}
          closeModal      = {() => setShowFilters(false)}
          visible         = {showFilters}
          subCategory     = {subCategory}
          brandsArray     = {[]}
          modelsArray     = {[]}
          fuelTypesArray  = {[]}
          vendor_id       = {vendor.vendor_ID}
          sectionUrl      = {sectionUrl}
      />
    </React.Fragment>
  );
}



