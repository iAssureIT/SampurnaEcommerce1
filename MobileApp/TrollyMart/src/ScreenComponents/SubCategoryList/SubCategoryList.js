
import React, { useState,useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import { connect,useDispatch,useSelector }      from 'react-redux';
import {SET_CATEGORY_WISE_LIST} from '../../redux/productList/types';

export const SubCategoryList =(props)=>{
  const {user_id,navigation,boxHeight} =props;
  const [selected,setSelected]=useState('');
  const [subCategoryList,setSubCategoryList] = useState([])
  // const BannerWidth = Dimensions.get('window').width-100;
  const [productList,setProductList]=useState([]);
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const dispatch = useDispatch();

  const store = useSelector(store => ({
    payload       : store.productList.searchPayload,
    categoryList  : store.productList.categoryList.categoryList,
  }));

  const {payload,categoryList}=store;

  useEffect(() => {
    if(categoryList && categoryList.length>0){
      const index = categoryList.findIndex(e=>e.category === props.category);
      var subCategoryArray = categoryList[index]?.subCategory.map((a, i)=>{
        return {
            label :a.subCategoryTitle,        
            value :categoryList[index]?.categoryUrl+"^"+a.subCategoryUrl,        
        } 
      })
      setSubCategoryList(subCategoryArray)
    }
 },[]);

  const _renderlist = ({ item, i })=>{
    return (
      <View key={i} style={[{paddingHorizontal:15}]}>
       {props.selected ===item.label ? 
       <TouchableOpacity style={{borderRadius:5}} onPress={()=>{
          payload.subCategoryUrl  = item.value.split("^")[1];
          payload.scroll          = false;
          payload.startRange      = 0;
          payload.limitRange      = 10;
          dispatch({
            type : SET_CATEGORY_WISE_LIST,
            payload : []
          })
          dispatch(getCategoryWiseList(payload));
            navigation.push('VendorProducts',
            {
              category:item.category,
              section:props.section,
              index:props.index,
              vendorLocation_id:props.vendorLocation_id,
              vendor:props.vendor
            });
        }}>
              <Text style={[styles.sectionTitle,{color:"#033554",fontSize:16,fontFamily:"Montserrat-Bold",textDecorationLine:'underline'}]}>{item.label}</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={{borderRadius:5}} onPress={()=>{
          payload.subCategoryUrl  = item.value.split("^")[1];
          payload.scroll          = false;
          payload.startRange      = 0;
          payload.limitRange      = 10;
          dispatch({
            type : SET_CATEGORY_WISE_LIST,
            payload : []
          })
          dispatch(getCategoryWiseList(payload));
            navigation.navigate('VendorProducts',
            {
              category:item.category,
              section:props.section,
              index:props.index,
              vendorLocation_id:props.vendorLocation_id,
              vendor:props.vendor
            });
        }}>
            <Text style={[styles.sectionTitle,{color:"#848586",fontSize:11,fontFamily:"Montserrat-Bold"}]}>{item.label}</Text>
          </TouchableOpacity>  
        }
      </View>
    )
  }

    return (
      subCategoryList && subCategoryList.length > 0 ?
          <View style={[styles.proddets,{height:44,alignItems:'center',backgroundColor:"#CDD7DE"}]}>
              <FlatList
                horizontal = {true}
                data={subCategoryList}
                renderItem={item => _renderlist(item)}
                keyExtractor={item => item._id}
                showsHorizontalScrollIndicator={false}
                // style={{width: SCREEN_WIDTH + 5, height:'100%'}}
            /> 
          </View>
      :[]
    );
  }



