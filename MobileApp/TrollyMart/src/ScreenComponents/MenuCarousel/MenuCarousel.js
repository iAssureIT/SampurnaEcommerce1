import React from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Alert
} from 'react-native';
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselStyles.js';
import { colors, sizes } from '../../AppDesigns/currentApp/styles/styles.js';
import ValidationComponent from "react-native-form-validator";
import Loading from '../../../AppDesigns/currentApp/styles/ScreenComponentStyles/LoadingStyles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';


const window = Dimensions.get('window');

export default class MenuCarousel extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuCarouselData:[
          {
            "menuCarouselImage" : require("../../AppDesigns/currentApp/images/2.png"),
            "menuCarouselTitle" : "Top Offers"
          },
          {
            "menuCarouselImage" : require("../../AppDesigns/currentApp/images/3.png"),
            "menuCarouselTitle" : "Mobiles"
          },
          {
            "menuCarouselImage" : require("../../AppDesigns/currentApp/images/4.png"),
            "menuCarouselTitle" : "Women's Fashion"
          },
          {
            "menuCarouselImage" : require("../../AppDesigns/currentApp/images/5.png"),
            "menuCarouselTitle" : "Men's Fashion"
          },
          {
            "menuCarouselImage" : require("../../AppDesigns/currentApp/images/6.png"),
            "menuCarouselTitle" : "Electronics"
          },
        ] 
      
    };
  }
  

  render() {
      
      return (
        <View>
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false} >
              <View style={styles.menuWrapper}>
                    {this.state.menuCarouselData.map((menuCarouselData,i)=>{
                      return(
                          <View key={i}>
                            <TouchableOpacity onPress={()=>this.props.navigate('CategoriesComponent')}>
                               <View style={styles.imageMenuWraper} >
                                    <Image
                                    source={menuCarouselData.menuCarouselImage}
                                    style={{ height:80,borderRadius:5,width: 120,}}
                                    />
                               </View>
                               <Text style={{color:'#333',textAlign:'center',marginTop:8,fontSize:13,fontFamily:"Montserrat-Regular",flexWrap: 'wrap'}}>{menuCarouselData.menuCarouselTitle}</Text>
                            </TouchableOpacity>
                          </View>
                          )
                      })
                     }
              </View>
          </ScrollView>
          <View style={{borderWidth:1,borderColor:"#f2f2f2",width:"100%",marginVertical:10}}></View>
        </View>
    
    );
  }
}
