
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
import styles                   from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/SimilarProductStyles.js';
import { colors }               from '../../AppDesigns/currentApp/styles/styles.js';
import axios                    from 'axios';
import AsyncStorage             from '@react-native-async-storage/async-storage';
import Counter                  from "react-native-counters";
import Modal                    from "react-native-modal";
import Carousel                 from 'react-native-banner-carousel-updated';
import CommonStyles             from '../../AppDesigns/currentApp/styles/CommonStyles.js';
import { useNavigation }        from '@react-navigation/native';
import { getCategoryWiseList }  from '../../redux/productList/actions.js';
import { connect,useDispatch,useSelector }      from 'react-redux';

export const HorizontalSecCatList =(props)=>{
  const {user_id,navigation} =props;
  // const BannerWidth = Dimensions.get('window').width-100;
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
      <TouchableOpacity style={{width:160,marginRight:10,backgroundColor:"#fff"}} 
          onPress={() =>{
              // navigation.navigate('SubCategoriesComp',{category_ID:item._id, categoryName:item.itemName})
              dispatch(getCategoryWiseList(item._id,user_id ? user_id : null,"lowestprice",props.section));
              navigation.navigate("VendorList",{sectionUrl:item.section?.replace(/\s/g, '-').toLowerCase(),section:item.section})
            }  
          }>
            <View style={styles.flx1}>
            {
              item.itemImg?
                <Image
                  source = {{ uri: item.itemImg }}
                  style={styles.subcatimg}
                  resizeMode="stretch"
                />
                :
                <Image
                  source={require("../../AppDesigns/currentApp/images/notavailable.png")}
                  style={styles.subcatimg}
                />
            }
            {
              item.discountPercent > 0 ?
                <Text style={styles.peroff}> {item.discountPercent}% OFF</Text>
                :
                null
            }
            <View style={[styles.flx1, styles.protxt]}>
              <Text numberOfLines={2} style={styles.nameprod}>{item.itemName}</Text>
            </View>
            <View style={[styles.flx1, styles.prdet]}>
            <View style={[styles.flxdir,{justifyContent:"center",alignItems:"center"}]}>
              <View style={[styles.flxdir]}>
                <Icon
                  name={item.currency}
                  type="font-awesome"
                  size={13}
                  color="#333"
                  iconStyle={{ marginTop: 5, marginRight: 3 }}
                />
                <Text style={styles.discountpricecut}>{item.originalPrice}</Text>
              </View>
              <View style={[styles.flxdir,{marginLeft:10,alignItems:"center"}]}>
                <Icon
                  name={item.currency}
                  type="font-awesome"
                  size={13}
                  color="#333"
                  iconStyle={{ marginTop: 5}}
                />
                {item.discountPercent > 0 ?
                      <Text style={styles.ogprice}>{item.discountedPrice} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : ''} {item.unit !== 'Number' ? item.unit : '' */}</Text>
                      </Text>
                    :
                    <Text style={styles.ogprice}>{item.originalPrice} <Text style={styles.packofnos}>{/* item.size ? '-'+item.size : '' */} {/* item.unit !== 'Number' ? item.unit : '' */}</Text> </Text>
                  }
              </View>
            </View>
          </View>
            </View>
      </TouchableOpacity>  
    )
  }

    return (
      productList && productList.length > 0 ?
        <View style={{}}>
        <Text style={styles.title}>{props.blockTitle}</Text>
          <View style={styles.proddets}>
            
              <FlatList
                horizontal = {true}
                data={productList}
                renderItem={item => _renderlist(item)}
                keyExtractor={item => item._id}
                // style={{width: SCREEN_WIDTH + 5, height:'100%'}}
            />
          </View>
      </View>
      :[]
    );
  }



