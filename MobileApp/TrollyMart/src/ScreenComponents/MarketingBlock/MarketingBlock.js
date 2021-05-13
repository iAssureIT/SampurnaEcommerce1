import React, 
{ useState,useEffect }  from 'react';
import {
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
}                       from 'react-native';
import styles           from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/BannerComponentStyles.js';
import Carousel         from 'react-native-banner-carousel-updated';
import axios            from 'axios';
import { useNavigation } from  '@react-navigation/native';

const width = Dimensions.get('window').width;

export const MarketingBlock=(props)=>{
  const [images,setImages]=useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    console.log("useEffect");
    getData()
  },[props]);

  const getData=()=>{
    var payload={
        "section"         : props.section,
        "category"        : props.category,
        "subCategory"     : props.subCategory
    }
    axios.post('/api/deals/get/list',payload)
    .then((res)=>{
        console.log("res",res);
        setImages(res.data)
    })
    .catch((error)=>{
      console.log('error1111', error);
    })
 }

 const redirectPage=(item)=>{
     if(item.sectionID){
        navigation.navigate('CategoriesComponent',{section_id:item.sectionID})
     }else if(item.categoryID){
        navigation.navigate('SubCategoriesComp',{category_ID:item.categoryID})
     }
 }

  const renderPage=(item, index)=>{
    var image = item.dealImg ? {uri : item.dealImg} : require("../../AppDesigns/currentApp/images/no_banner_image.png")
    return (
      <TouchableOpacity onPress={()=>redirectPage(item)} key={index}>
        <ImageBackground 
          style={{ width:"100%", height: 180,}} 
          source={image}
          resizeMode={"stretch"}
        >
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.bannerWrapper,{marginBottom:15}]}>
        <Carousel
            autoplay        = {true}
            autoplayTimeout = {10000}
            loop            = {true}
            index           = {0}
          //  pageSize={BannerWidth}
            pageSize        = {width-30 }
            >
          {images.map((image, index) => renderPage(image, index))}
        </Carousel>
    </View>
  );
}
