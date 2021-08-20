import React, 
{ useState,useEffect }  from 'react';
import {
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
}                       from 'react-native';
import styles           from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/BannerComponentStyles.js';
import Carousel         from 'react-native-banner-carousel-updated';
import axios            from 'axios';
import { useNavigation } from  '@react-navigation/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width-10;

export const MarketingBlock=(props)=>{
  const [images,setImages]=useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    getData()
  },[]);

  const getData=()=>{
    var payload={
        "section"         : props.section,
        "category"        : props.category,
        "subCategory"     : props.subCategory
    }
    axios.post('/api/deals/get/list',payload)
    .then((res)=>{
        setImages(res.data)
    })
    .catch((error)=>{
      console.log('error', error);
    })
 }

 const redirectPage=(item)=>{
    //  if(item.sectionID){
    //     navigation.navigate('CategoriesComponent',{section_id:item.sectionID})
    //  }else if(item.categoryID){
    //     navigation.navigate('SubCategoriesComp',{category_ID:item.categoryID})
    //  }
    navigation.navigate("VendorList",{sectionUrl:item.section?.replace(/\s/g, '-').toLowerCase(),section:item.section})
 }

  const renderPage=(item, index)=>{
    var image = item.dealImg ? {uri : item.dealImg} : require("../../AppDesigns/currentApp/images/no_banner_image.png")
    return (
      <TouchableOpacity onPress={()=>redirectPage(item)} key={index}>
        <ImageBackground 
          style={{ width:"100%", height: hp(20)}} 
          imageStyle={{borderRadius:8}}
          source={image}
          resizeMode={"stretch"}
        >
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    images && images.length >0 ?<SafeAreaView>
        <View style={[styles.bannerWrapper]}>
            <Carousel
                autoplay        = {true}
                autoplayTimeout = {10000}
                loop            = {true}
                index           = {0}
            //  pageSize={BannerWidth}
                pageSize        = {width}
                >
            {images.map((image, index) => renderPage(image, index))}
            </Carousel>
        </View>
    </SafeAreaView> :null
  );
}
