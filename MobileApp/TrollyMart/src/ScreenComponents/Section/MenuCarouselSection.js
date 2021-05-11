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


export const MenuCarouselSection = (props)=>{
  const {navigation}=props;
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const [sectionDetails,setSections]=useState([]);
  const SCREEN_WIDTH = Dimensions.get("window").width;

const xOffset = new Animated.Value(0);
  
  useEffect(() => {
    getData()
  },[]);


  const getData=()=>{
    axios.get("/api/sections/get/get_megamenu_list")
    .then((response)=>{     
      setSections(response.data) 
    })
    .catch((error)=>{console.log('error in get_megamenu_list', error);})
  }  


  const _renderlist = ({ item, i })=>{
    return (
      <View key={i} style={styles.mainrightside}>
        <TouchableOpacity onPress={()=>navigation.navigate('CategoriesComponent',{section_id:item._id})}>
        <ImageBackground onPress={()=>navigation.navigate('CategoriesComponent',{section_id:item._id})} source={item.sectionImage ? {uri : item.sectionImage}:noImage} style={styles.sectionImages}>
            <Text style={[styles.sectionTitle,{color:item.sectionImage?"#fff":"#333"}]}>{item.section}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <View>
      <Text style={styles.title}>List of Sections</Text>
        <View style={styles.proddets}>
          {sectionDetails && sectionDetails.length > 0 ?
            <FlatList
              horizontal                      = {true}
              data={sectionDetails}
              renderItem={item => _renderlist(item)}
              keyExtractor={item => item._id}
              // style={{width: SCREEN_WIDTH + 5, height:'100%'}}
          />:[]} 
        </View>
      <View style={styles.menuborderstyle}></View>
    </View>
  );
}