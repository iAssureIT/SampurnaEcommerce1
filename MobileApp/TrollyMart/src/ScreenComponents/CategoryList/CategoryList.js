import React, { useState,useEffect,useRef } from 'react';
import {Text,View,
      TouchableOpacity,
      Dimensions,
      ImageBackground,
      FlatList
    }                         from 'react-native';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
import axios                  from 'axios';
import Animated               from "react-native-reanimated";
import { connect,useDispatch,useSelector }      from 'react-redux';
import { colors, sizes } from '../../AppDesigns/currentApp/styles/styles.js';
import { useIsFocused }       from "@react-navigation/native";
export const CategoryList = (props)=>{
  const {navigation,showImage,boxHeight}=props;
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const [selected,setSelected]=useState('');
  const isFocused = useIsFocused();
  const store = useSelector(store => ({
    categoryList  : store.productList.categoryList.categoryList,
  }));
  const {categoryList}=store;


  useEffect(() => {
    if(categoryList && categoryList.length >0){
      props.setCategory(categoryList[0])
      setSelected(categoryList[0]?.category);
    }
   },[categoryList && categoryList.length>0 ?categoryList[0]?.category : '']);
  const xOffset = new Animated.Value(0); 
  const _renderlist = ({ item, i })=>{
    return (
      <View key={i} style={styles.mainrightside}>
        <TouchableOpacity style={{borderWidth:selected===item.category ? 2:0,borderRadius:10,borderColor:colors.cartButton }} onPress={()=>{props.setCategory(item);setSelected(item.category)}}>
          {showImage ?
              <ImageBackground  source={item.sectionImage ? {uri : item.sectionImage}:null} style={[styles.sectionImages,{backgroundColor:"#fff",height:boxHeight}]} imageStyle={{opacity:0.6}}>
              <Text style={[styles.sectionTitle,{color:item.sectionImage?"#fff":"#333"}]}>{item.category}</Text>
            </ImageBackground>
            :
            <View style={{borderBottomWidth:selected===item.section? 1:0}}>
              <Text style={[styles.sectionTitle,selected===item.category ? {color:"#333"}: {color:"#666"}]}>{item.category}</Text>
            </View>  
          }
        </TouchableOpacity>
      </View>
    )
  }


  const onViewableItemsChanged = (e) => {
    // // Get the first viewable item
    // const firstViewableItem = viewableItems[0].key;
  
    // // Get its index into the items
    // const index = this.state.items.findIndex(item => item.key === firstViewableItem);
  
    // // If the index is a multiple of the number of items displayable on the screen
    // // by checking for a reminder on the modulo operation
    // if ((index % NB_ITEMS_SCREEN) === 0) {
  
    //   // get page
    //   const currentPage = index / NB_ITEMS_SCREEN;
    //   if (currentPage !== this.state.currentPage) {
    //     // Do something and update currentPage in this.state
    //   }
    // }
  }


  return (
    <View>
      {/* <Text style={styles.title}>List of Sections</Text> */}
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
      {/* <View style={styles.menuborderstyle}></View> */}
    </View>
  );
}