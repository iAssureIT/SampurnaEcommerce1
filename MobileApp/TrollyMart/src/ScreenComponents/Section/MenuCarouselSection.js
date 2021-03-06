import React, { useState,useEffect,useRef } from 'react';
import {Text,View,
      TouchableOpacity,
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
import commonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import {useRoute}               from  '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const MenuCarouselSection = (props)=>{
  const {navigation,showImage,boxHeight}=props;
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const [selected,setSelected]=useState();
  const dispatch 		= useDispatch();
  const flatlistRef = useRef()
  const route = useRoute();
  console.log("route.name",route.name);
  TouchableOpacity.defaultProps = {...(TouchableOpacity.defaultProps || {}), delayPressIn: 0};
  const section = useSelector(store => store.section.sections)
  useEffect(() => {
   setSelected(props.selected);
   console.log("props.index",props.index);
   if(props.index){
    flatlistRef.current.scrollToIndex({ animated: true, index: props.index })
   }
  },[props.selected,props.index]);

  const getItemLayout = (data, index) => ({
    length: 130,
    offset: 130 * index,
    index,
  })
  const _renderlist = ({ item, index })=>{
    return (
      <View key={index} style={styles.mainrightside}>
        <TouchableOpacity style={{borderRadius:selected===item.section ? 8 :0,borderWidth:selected===item.section ? 2:0,borderColor:colors.cartButton}} 
          onPress={()=>{
              setSelected(item.section);
               flatlistRef.current.scrollToIndex({ animated: true, index: index })
              navigation.navigate("VendorList",{
                sectionUrl  : item.sectionUrl,
                section     : item.section,
                type        : props.type,
                index       : index
            });  
            if(route.name === "VendorList"){
                dispatch({
                  type     : SET_CATEGORY_LIST,
                  payload  : [],
                });
                dispatch({
                  type     : SET_CATEGORY_WISE_LIST,
                  payload  : [],
                });
            }
          }}>
          {showImage ?
              item.sectionImage?<Image 
                source={item.sectionImage ? {uri : item.sectionImage}:noImage} 
                style={[styles.sectionImages,{height:hp(boxHeight)}]} 
                resizeMode={'cover'}
              />:
              <View style={[styles.sectionImages,{height:hp(boxHeight),backgroundColor:"#f1f1f1"}]} >
            </View> 
            :
            <View style={{borderBottomWidth:selected===item.section? 1:0}}>
              <Text style={[styles.sectiontitle,selected===item.section ? {color:"#333"}: {color:"#666"}]}>{item.section}</Text>
            </View>  
          }
        </TouchableOpacity>
        <Text style={[styles.sectiontitle,{color:selected===item.section ?colors.cartButton:"#333",fontSize:RFPercentage(props.fontSize)}]}>{item.section}</Text>
      </View>
    )
  }
  return (
    <View>
        <View style={styles.proddets}>
          {section && section.length > 0 ?
            <FlatList
              horizontal  = {true}
              data={section}
              // ref={refContainer}
              renderScrollComponent={props => <ScrollView {...props} />}
              // scrollToIndex={{animated:true,index:6}}
              // onContentSizeChange={() => refContainer?.current?.scrollToEnd()}
              renderItem={item => _renderlist(item)}
              keyExtractor={(item, index) => item._id.toString()}
              showsHorizontalScrollIndicator={false}
              ref={flatlistRef}
              getItemLayout={getItemLayout}
          />:[]} 
        </View>
    </View>
  );
}