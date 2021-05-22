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

export const MenuCarouselSection = (props)=>{
  const {navigation,showImage}=props;
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const [selected,setSelected]=useState();
  const store = useSelector(store => ({
    section  : store.section.sections,
  }));
  const {section}=store;
  console.log("section",section)
  useEffect(() => {
   setSelected(props.selected)
  },[props]);
  const xOffset = new Animated.Value(0); 
  const _renderlist = ({ item, i })=>{
    return (
      <View key={i} style={styles.mainrightside}>
        <TouchableOpacity style={{borderWidth:selected===item.section ? 2:0,borderRadius:10,borderColor:colors.theme }} onPress={()=>{navigation.navigate("VendorList",{sectionUrl:item.sectionUrl,section:item.section,type:props.type});}}>
          {showImage ?
              <ImageBackground onPress={()=>navigation.navigate('VendorList',{section_id:item._id})} source={item.sectionImage ? {uri : item.sectionImage}:noImage} style={styles.sectionImages} imageStyle={{opacity:0.6}}>
              <Text style={[styles.sectionTitle,{color:item.sectionImage?"#fff":"#333"}]}>{item.section}</Text>
            </ImageBackground>
            :
            <View style={{borderBottomWidth:selected===item.section? 1:0}}>
              <Text style={[styles.sectionTitle,selected===item.section ? {color:"#333"}: {color:"#666"}]}>{item.section}</Text>
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
        <View style={styles.proddets}>
          {section && section.length > 0 ?
            <FlatList
              horizontal                      = {true}
              data={section}
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