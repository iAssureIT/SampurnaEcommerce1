
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native';
import { Header, 
        Button, 
        Icon, 
        SearchBar }             from "react-native-elements";
import styles                   from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/HorizontalSecCatList.js';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import axios                    from 'axios';
import AsyncStorage             from '@react-native-async-storage/async-storage';
import Counter                  from "react-native-counters";
import Modal                    from "react-native-modal";
import Carousel                 from 'react-native-banner-carousel-updated';
import CommonStyles         from '../../AppDesigns/currentApp/styles/CommonStyles.js'
import { useNavigation }        from '@react-navigation/native';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import { connect,useDispatch,useSelector }      from 'react-redux';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const HorizontalSecCatList =(props)=>{
  const {user_id,navigation} =props;
  const window = Dimensions.get('window');
  const [productList,setProductList]=useState([]);
  const noImage = require('../../AppDesigns/currentApp/images/noimagesection.jpeg');
  const dispatch = useDispatch();
  useEffect(() => {
    getData();
  },[]);

  const getData=()=>{
    var formValues={
        "section"                 : props.section,
        "category"                : props.category,
        'subCategory'             : props.subCategory,
        "showOnlyBrand"           : props.showOnlyBrand,
        "showOnlySection"         : props.showOnlySection,
        "showOnlyCategory"        : props.showOnlyCategory,
        "showOnlySubCategory"     : props.showOnlySubCategory,
        "numOfRows"               : 1,
        "numOfItemPerRow"         : 6,
        "showCarousel"            : true,
        "displayItemInCarousel"   : 6
    }
    axios.post("/api/sections/get/list",formValues)
      .then((response) => {
        console.log(" setProductList response",response);
        setProductList(response.data);
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
 

  const _renderlist = ({ item, index })=>{
    return (
      <TouchableOpacity  style={[styles.productContainer,{width:wp(40),marginRight:wp(3)}]} 
          onPress={() =>{
              // navigation.navigate('SubCategoriesComp',{category_ID:item._id, categoryName:item.itemName})
              dispatch(getCategoryWiseList(item._id,user_id ? user_id : null,"lowestprice",props.section));
              navigation.navigate("VendorList",{sectionUrl:item.section?.replace(/\s/g, '-').toLowerCase(),section:item.section})
            }  
          }>
            <View style={styles.flx1}>
            {
              item.itemImg?
                <ImageBackground
                  source = {{ uri: item.itemImg }}
                  style={styles.subcatimg1}
                  imageStyle={{borderRadius:15}}
                  resizeMode="cover"
                >
                   <View style={{height:hp(3),backgroundColor:'rgba(0, 0, 0, 0.5)',borderBottomLeftRadius:15,borderBottomRightRadius:15,justifyContent:'center'}}>
                    <Text numberOfLines={2} style={styles.nameprod}>{item.itemName}</Text>
                  </View>
                  </ImageBackground>
                :
                <ImageBackground
                  source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                  style={styles.subcatimg1}
                  imageStyle={{borderRadius:15}}
                  resizeMode="contain"
                >
                 <View style={{height:hp(3),backgroundColor:'rgba(0, 0, 0, 0.5)',borderBottomLeftRadius:15,borderBottomRightRadius:15,justifyContent:'center'}}>
                    <Text numberOfLines={2} style={styles.nameprod}>{item.itemName}</Text>
                  </View>
                  </ImageBackground>
            }
            {
              item.discountPercent > 0 ?
                <Text style={styles.peroff}> {item.discountPercent}% OFF</Text>
                :
                null
            }
           
            </View>
      </TouchableOpacity>  
    )
  }

    return (
      productList && productList.length > 0 ?
        <View style={{marginHorizontal:5,marginBottom:15}}>
          <Text style={{fontSize: RFPercentage(2.5), fontFamily: 'Montserrat-Bold',paddingVertical:5,color:"#000000",textShadowColor: 'rgba(0, 0, 0, 0.4)',textShadowOffset: {width: -1, height: 1},textShadowRadius:2,marginBottom:5}}>{props.blockTitle}</Text>
            <FlatList
              horizontal = {true}
              contentContainerStyle={{backgroundColor:"#F9F4EE",height:hp(18),alignItems:'center'}}
              data={productList}
              renderItem={item => _renderlist(item)}
              keyExtractor={item => item._id}
              // style={{width: SCREEN_WIDTH + 5, height:'100%'}}
          />
        </View>
      :[]
    );
  }



