import React, { useState,useEffect } from 'react';
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
import {SET_CATEGORY_WISE_LIST}             from '../../redux/productList/types';
import { Alert } from 'react-native';

export const CategoryList = (props)=>{
  const {navigation,boxHeight,showImage,vendor}=props;
  console.log("vendor",vendor);
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const [selected,setSelected]=useState('');
  const dispatch 		= useDispatch();
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
       <TouchableOpacity style={{borderWidth:2,borderRadius:5,borderColor:colors.cartButton,marginTop:showImage === true ? 5 :0}} onPress={()=>{
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
            <ImageBackground  source={item.categoryImage ? {uri : item.categoryImage}:null} style={[styles.sectionImages,{backgroundColor:"#333",height:boxHeight}]} imageStyle={{opacity:0.6,borderRadius: 5,elevation:5}}>
              <Text style={[styles.sectionTitle,{color:item.categoryImage?"#fff":"#333"}]}>{item.category}</Text>
            </ImageBackground>
            :
            <View  style={[styles.sectionImages,{height:boxHeight}]}>
              <Text style={[styles.sectionTitle,{color:item.categoryImage?"#333":"#aaa"}]}>{item.category}</Text>
            </View>}
        </TouchableOpacity>
        :
        showImage === true? 
          <View>
             <TouchableOpacity style={{borderWidth:1,borderRadius:5,borderColor:colors.cartButton }} onPress={()=>{  setSelected(item.category);
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
              <Text style={[styles.sectionTitle,{color:item.sectionImage?"#fff":"#333"}]}>{item.category}</Text>
          </View>  
          :
          <View>
          <TouchableOpacity style={{borderWidth:1,borderRadius:5,borderColor:colors.cartButton }} onPress={()=>{  setSelected(item.category);
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
          <View  style={[styles.sectionImages,{backgroundColor:"#fff",height:boxHeight}]}>
              <Text style={[styles.sectionTitle,{color:item.sectionImage?"#fff":"#333"}]}>{item.category}</Text>
          </View>
             </TouchableOpacity>
       </View>} 
      </View>
    )
  }

  return (
    <View>
        <View style={styles.categoryContainer}>
          {
          categoryList && categoryList.length > 0 ?
            <FlatList
              horizontal                      = {true}
              data={categoryList}
              renderItem={item => _renderlist(item)}
              keyExtractor={item => item._id}
              showsHorizontalScrollIndicator={false}
              // ref={(node) => scroll = node}
              // style={{width: SCREEN_WIDTH + 5, height:'100%'}}
          />:[]} 
        </View>
    </View>
  );
}