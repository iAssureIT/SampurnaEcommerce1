import React, { useState,useEffect,useRef,useCallback } from 'react';
import {Text,View,
      TouchableOpacity,
      ImageBackground,
      FlatList
    }                                       from 'react-native';
import styles                               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
import Animated                             from "react-native-reanimated";
import {useDispatch,useSelector }           from 'react-redux';
import { colors, sizes }                    from '../../AppDesigns/currentApp/styles/styles.js';
import { getCategoryWiseList }              from '../../redux/productList/actions.js';
import {
  SET_CATEGORY_WISE_LIST,STOP_SCROLL
} from '../../redux/productList/types';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'

export const CategoryList = (props)=>{
  const {navigation,boxHeight,showImage,vendor}=props;
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const [selected,setSelected]=useState('');
  const dispatch 		= useDispatch();
  const flatlistRef = useRef()
  const store = useSelector(store => ({
    categoryList  : store.productList.categoryList.categoryList,
    payload       : store.productList.searchPayload,
  }));
  const {categoryList,payload}=store;
  useEffect(() => {
      if(categoryList && categoryList.length>0){
        if(props.category!==""){
          setSelected(props.category);
          const index = categoryList.findIndex(e=>e.category === props.category);
          if(index>-1){
            flatlistRef.current.scrollToIndex({ animated: true, index: index })
          }
          var subCategoryArray = categoryList[index]?.subCategory.map((a, i)=>{
            return {
                label :a.subCategoryTitle,        
                value :categoryList[index]?.categoryUrl+"^"+a.subCategoryUrl,        
            } 
          })
        }else{
          setSelected(categoryList[0]?.category);
          var subCategoryArray = categoryList[0]?.subCategory.map((a, i)=>{
            return {
                label :a.subCategoryTitle,        
                value :categoryList[0]?.categoryUrl+"^"+a.subCategoryUrl,        
            } 
          })
        }
        if(props.setSubCategory){
          props.setSubCategory(subCategoryArray);
        }  
      }
   },[props.selected,props.index,props.category,categoryList]);

  const xOffset = new Animated.Value(0); 

  const _renderlist = ({ item, i })=>{
    return (
      <View key={i} style={[styles.mainrightside]}>
       {selected===item.category ? 
       <TouchableOpacity style={{borderRadius:5,marginTop:showImage === true ? 5 :0,backgroundColor:"#fff"}} onPress={()=>{
              setSelected(item.category);
              var subCategoryArray = item.subCategory.map((a, i)=>{
                return {
                    label :a.subCategoryTitle,        
                    value :item.categoryUrl+"^"+a.subCategoryUrl,        
                } 
              })
              if(props.setSubCategory){
                props.setSubCategory(subCategoryArray);
              }
              payload.categoryUrl     = item.categoryUrl;
              payload.subCategoryUrl  = item.subCategoryUrl ? item.subCategoryUrl : [] ;
              payload.scroll          = false;
              payload.startRange      = 0;
              payload.limitRange      = 10;
              dispatch({
                type : SET_CATEGORY_WISE_LIST,
                payload : []
              })
              dispatch({
                type: STOP_SCROLL,
                payload: false,
              });
              dispatch(getCategoryWiseList(payload));
                navigation.push('VendorProducts',
                {
                  vendor            : props.vendor,
                  category          : item.category,
                  section           : props.section,
                  index             : props.index,
                  vendorLocation_id : props.vendorLocation_id,
                });
            }}>
            {showImage === true? 
            <ImageBackground  source={item.categoryImage ? {uri : item.categoryImage}:null} style={[styles.sectionImages,{backgroundColor:"#000",height:boxHeight, shadowColor: '#202020',
            shadowOffset: {width: 0, height: 0},
            shadowRadius: 5,}]} imageStyle={{opacity:0.5,borderRadius: 5,elevation:5}}>
              <Text style={[styles.categoryTitle,{color:item.categoryImage?"#fff":"#707070"}]}>{item.category}</Text>
            </ImageBackground>
            :
            <View  style={[styles.sectionImages,{height:boxHeight,borderWidth:1,borderColor:"#033554"}]}>
              <Text style={[styles.categoryTitle,{color:item.categoryImage?"#333":"#aaa"}]}>{item.category}</Text>
            </View>}
        </TouchableOpacity>
        :
        showImage === true? 
          <View>
             <TouchableOpacity style={{borderWidth:0.5,borderRadius:5,borderColor:"#033554" }} onPress={()=>{  setSelected(item.category);
              var subCategoryArray = item.subCategory.map((a, i)=>{
                return {
                    label :a.subCategoryTitle,        
                    value :item.categoryUrl+"^"+a.subCategoryUrl,        
                } 
              })
              if(props.setSubCategory){
                props.setSubCategory(subCategoryArray);
              }
              payload.categoryUrl     = item.categoryUrl;
              payload.subCategoryUrl  = item.subCategoryUrl ? item.subCategoryUrl : [] ;
              payload.scroll          = false;
              payload.startRange      = 0;
              payload.limitRange      = 10;
              dispatch({
                type : SET_CATEGORY_WISE_LIST,
                payload : []
              })
              dispatch({
                type: STOP_SCROLL,
                payload: false,
              });
              dispatch(getCategoryWiseList(payload));
                navigation.push('VendorProducts',
                {
                  vendor : props.vendor,
                  category:item.category,
                  section:props.section,
                  index:props.index,
                  vendorLocation_id:props.vendorLocation_id,
                });
            }}>
            <ImageBackground  source={item.categoryImage ? {uri : item.categoryImage}:null} style={[styles.sectionImages,{backgroundColor:"#fff",height:boxHeight}]} imageStyle={{borderRadius: 5}}>
                </ImageBackground>
                </TouchableOpacity>
              <Text style={[styles.categoryTitle,{color:item.sectionImage?"#fff":"#707070"}]}>{item.category}</Text>
          </View>  
          :
          <View>
          <TouchableOpacity style={{borderWidth:0.5,borderRadius:5,borderColor:"#033554"}} onPress={()=>{  setSelected(item.category);
           var subCategoryArray = item.subCategory.map((a, i)=>{
             return {
                 label :a.subCategoryTitle,        
                 value :item.categoryUrl+"^"+a.subCategoryUrl,        
             } 
           })
           if(props.setSubCategory){
             props.setSubCategory(subCategoryArray);
           }
           payload.categoryUrl     = item.categoryUrl;
           payload.subCategoryUrl  = item.subCategoryUrl ? item.subCategoryUrl : [] ;
           payload.scroll          = false;
           payload.startRange      = 0;
           payload.limitRange      = 10;
           dispatch({
             type : SET_CATEGORY_WISE_LIST,
             payload : []
           })
           dispatch({
            type: STOP_SCROLL,
            payload: false,
          });
           dispatch(getCategoryWiseList(payload));
             navigation.push('VendorProducts',
             {
              vendor : props.vendor,
               category:item.category,
               section:props.section,
               index:props.index,
               vendorLocation_id:props.vendorLocation_id,
             });
         }}>
          <View  style={[styles.sectionImages,{backgroundColor:"#fff",height:boxHeight,borderColor:"#707070"}]}>
              <Text style={[styles.categoryTitle,{color:item.sectionImage?"#fff":"#707070"}]}>{item.category}</Text>
          </View>
             </TouchableOpacity>
       </View>} 
      </View>
    )
  }

  const getItemLayout = (data, index) => ({
    length: 130,
    offset: 130 * index,
    index,
  })


  return (
    <View>
        <View style={styles.categoryContainer}>
          {
          categoryList && categoryList.length > 0 ?
            <FlatList
              horizontal                      = {true}
              data={categoryList}
              pagingEnabled
              renderItem={item => _renderlist(item)}
              keyExtractor={item => item._id}
              showsHorizontalScrollIndicator={false}
              ref={flatlistRef}
              getItemLayout={getItemLayout}
          />:[]} 
        </View>
    </View>
  );
}