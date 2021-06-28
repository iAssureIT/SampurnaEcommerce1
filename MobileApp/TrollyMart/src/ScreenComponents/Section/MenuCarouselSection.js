import React, { useState,useEffect,useRef } from 'react';
import {Text,View,
      TouchableOpacity,
      Dimensions,
      Image,
      FlatList
    }                           from 'react-native';
import styles                   from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
import Animated                 from "react-native-reanimated";
import { useSelector,
          useDispatch }         from 'react-redux';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import { ScrollView }           from "react-native-gesture-handler";
import {SET_CATEGORY_LIST,
       SET_CATEGORY_WISE_LIST}  from '../../redux/productList/types';
import commonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js';


export const MenuCarouselSection = (props)=>{
  const {navigation,showImage,boxHeight}=props;
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const [selected,setSelected]=useState();
  const dispatch 		= useDispatch();
  const refContainer = useRef(0);
  const [index,setIndex]=useState(0);
  TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
  const section = useSelector(store => store.section.sections)
  useEffect(() => {
   setSelected(props.selected);
   if(props.index){
    setIndex(props.index)
   }
   
  },[props.selected,props.index]);
  if(refContainer.current){
    refContainer.current.scrollToIndex({ animated: true, index: props.index });
  }   
  const xOffset = new Animated.Value(0); 
  const _renderlist = ({ item, index })=>{
    return (
      <View key={index} style={styles.mainrightside}>
        <TouchableOpacity style={{borderRadius:selected===item.section ? 5 :0,borderWidth:selected===item.section ? 2:0,borderColor:colors.cartButton}} 
          onPress={()=>{
              setSelected(item.section);
              navigation.navigate("VendorList",{
                  sectionUrl  : item.sectionUrl,
                  section     : item.section,
                  type        : props.type,
                  index       : index
              });  
              dispatch({
                type     : SET_CATEGORY_LIST,
                payload  : [],
              });
              dispatch({
                type     : SET_CATEGORY_WISE_LIST,
                payload  : [],
              });
          }}>
          {showImage ?
              <Image 
                onPress={()=>navigation.navigate('VendorList',{section_id:item._id})} 
                source={item.sectionImage ? {uri : item.sectionImage}:noImage} 
                style={[styles.sectionImages,{height:boxHeight}]} 
                resizeMode={'cover'}
              />
            :
            <View style={{borderBottomWidth:selected===item.section? 1:0}}>
              <Text style={[styles.sectionTitle,selected===item.section ? {color:"#333"}: {color:"#666"}]}>{item.section}</Text>
            </View>  
          }
        </TouchableOpacity>
        <Text style={[styles.sectionTitle,commonStyles.label]}>{item.section}</Text>
      </View>
    )
  }
  return (
    <View>
      {/* <Text style={styles.title}>List of Sections</Text> */}
        <View style={styles.proddets}>
          {section && section.length > 0 ?
            <FlatList
              horizontal  = {true}
              data={section}
              ref={refContainer}
              renderScrollComponent={props => <ScrollView {...props} />}
              // scrollToIndex={{animated:true,index:6}}
              // onContentSizeChange={() => refContainer?.current?.scrollToEnd()}
              renderItem={item => _renderlist(item)}
              keyExtractor={(item, index) => item._id.toString()}
              showsHorizontalScrollIndicator={false}
              ref={(node) => scroll = node}
              // style={{width: SCREEN_WIDTH + 5, height:'100%'}}
              // getItemLayout={(data, index) => (
              //   {length: 500, offset: 500 * index, index}
              // )}
          />:[]} 
        </View>
    </View>
  );
}