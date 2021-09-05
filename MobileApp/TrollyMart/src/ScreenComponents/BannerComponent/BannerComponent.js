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
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const BannerWidth = Dimensions.get('window').width-10;

export const BannerComponent=()=>{
  const [bannerImages,setBannerImages]=useState([])
  useEffect(() => {
    getData()
  },[]);

  const getData=()=>{
    axios.get('/api/bannerimgs/get')
    .then((res)=>{
      setBannerImages(res.data)
    })
    .catch((error)=>{
      // console.log('error', error);
    })
}

  const renderPage=(image, index)=>{
    var bannerImages = image.bannerimages ? {uri : image.bannerimages} : require("../../AppDesigns/currentApp/images/no_banner_image.png")
    return (
      <View key={index}>
        <ImageBackground 
          style={{ width:"100%", height: hp(18),borderRadius:5}} 
          imageStyle={{borderRadius:15}}
          source={bannerImages}
          resizeMode={"stretch"}
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
            pageSize={BannerWidth}
            pageIndicatorStyle={{width:20,height:2,backgroundColor:"#aaa"}}
            activePageIndicatorStyle={{width:20,height:2,backgroundColor:"#fff"}}
            pageIndicatorOffset={30}
        
            >
          {bannerImages.map((image, index) => renderPage(image, index))}
        </Carousel>
    </View>
  );
}
