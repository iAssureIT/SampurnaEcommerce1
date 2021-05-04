import React, 
{ useState,useEffect }  from 'react';
import {
  View,
  Dimensions,
  ImageBackground,
}                       from 'react-native';
import styles           from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/BannerComponentStyles.js';
import Carousel         from 'react-native-banner-carousel-updated';
import axios            from 'axios';

const BannerHeight = 230;

export const BannerComponent=()=>{
  const [bannerImages,setBannerImages]=useState([])
  useEffect(() => {
    console.log("useEffect");
    getData()
  },[]);

  const getData=()=>{
    axios.get('/api/bannerimgs/get')
    .then((res)=>{
      console.log('bannerimgs res', res.data);
      setBannerImages(res.data)
    })
    .catch((error)=>{
      console.log('error1111', error);
    })
}

  const renderPage=(image, index)=>{
    console.log("each Banner Images",image.bannerimages)
    var bannerImages = image.bannerimages ? {uri : image.bannerimages} : require("../../AppDesigns/currentApp/images/no_banner_image.png")
    return (
      <View key={index}>
        <ImageBackground 
          style={{ width:"100%", height: 230,}} 
          source={bannerImages}
          // resizeMode={"contain"}
        >
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.bannerWrapper}>
        <Carousel
            autoplay={true}
            autoplayTimeout={10000}
            loop={true}
            index={0}
          //  pageSize={BannerWidth}
            pageSize={360}
        
            >
          {bannerImages.map((image, index) => renderPage(image, index))}
        </Carousel>
    </View>
  );
}
