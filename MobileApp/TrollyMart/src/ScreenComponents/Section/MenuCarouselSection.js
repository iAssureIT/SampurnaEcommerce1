import React, { useState,useEffect,useRef } from 'react';
import {Text,View,
      TouchableOpacity,
      ImageBackground}        from 'react-native';
import styles                 from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
import axios                  from 'axios';
import Animated               from "react-native-reanimated";


export const MenuCarouselSection = (props)=>{
  console.log("props",props);
  const {navigation}=props;
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const [sectionDetails,setSections]=useState([])
  
  useEffect(() => {
    console.log("useEffect");
    getData()
  },[]);

  const getData=()=>{
    axios.get("/api/sections/get/get_megamenu_list")
    .then((response)=>{     
      setSections(response.data) 
    })
    .catch((error)=>{console.log('error in get_megamenu_list', error);})
  }  

  return (
    <View>
      <Text style={styles.title}>List of Sections</Text>
        <Animated.ScrollView 
          scrollEventThrottle            = {1}  
          horizontal                     = {true} 
          showsHorizontalScrollIndicator = {true} 
          pagingEnabled                  = {true}
          onScroll                       = {Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x: 50},
                },
              },
            ],
            {useNativeDriver: true}, // <-- Add this
          )}
        >
        <View style={styles.proddets}>
          {
            sectionDetails && sectionDetails.map((data, index) => {                                                               
              return (
                <View key={index} style={styles.mainrightside}>
                    <TouchableOpacity onPress={()=>navigation.navigate('CategoriesComponent',{section_id:data._id})}>
                    <ImageBackground onPress={()=>navigation.navigate('CategoriesComponent',{section_id:data._id})} source={data.sectionImage ? {uri : data.sectionImage}:noImage} style={styles.sectionImages}>
                        <Text style={styles.sectionTitle}>{data.section}</Text>
                      </ImageBackground>
                    </TouchableOpacity>
                </View>
                )
            })
          }
        </View>
      </Animated.ScrollView>
    <View style={styles.menuborderstyle}></View>
  </View>
  );
}