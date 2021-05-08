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
import { Header, Button, Icon, SearchBar } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/BannerComponentStyles.js';
import { colors, sizes } from '../../AppDesigns/currentApp/styles/styles.js';
import ValidationComponent from "react-native-form-validator";
// import Loading from '../../../AppDesigns/currentApp/styles/ScreenComponentStyles/LoadingStyles.js';


const window = Dimensions.get('window');

export default class  BestSellers extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      BestSellerCarouselData:[
            {
            "BestSellerCarouselImage" : require("../../AppDesigns/currentApp/images/2.png"),
            "BestSellerCarouselTitle" : "Furniture",
            "BestSellerCarouselPrice" : "855"
            },
            {
              "BestSellerCarouselImage" : require("../../AppDesigns/currentApp/images/3.png"),
              "BestSellerCarouselTitle" : "Fashion",
              "BestSellerCarouselPrice" : "85"
            },
            {
              "BestSellerCarouselImage" : require("../../AppDesigns/currentApp/images/4.png"),
              "BestSellerCarouselTitle" : "Kitchen",
              "BestSellerCarouselPrice" : "55"
            },
            {
              "BestSellerCarouselImage" : require("../../AppDesigns/currentApp/images/5.png"),
              "BestSellerCarouselTitle" : "Grocery",
              "BestSellerCarouselPrice" : "5"
            },
            {
              "BestSellerCarouselImage" : require("../../AppDesigns/currentApp/images/6.png"),
              "BestSellerCarouselTitle" : "Electronics",
              "BestSellerCarouselPrice" : "50"
            },
        ]
    };
  }
  

  render() {
      
      return (
        <View>
          <View>
            <Text style={styles.title}>Best Sellers</Text> 
          </View>
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}>
              <View style={{marginTop:30}}>
                <View style={styles.menuWrapper}>
                      {this.state.BestSellerCarouselData.map((BestSellerCarouselData,i)=>{
                        return(
                            <View styles={{}} >
                            <View key={i} >
                              <TouchableOpacity onPress={()=>this.props.navigate('CategoriesComponent')}>
                                <View style={styles.imageMenuWraper} >
                                  <Image
                                  source={BestSellerCarouselData.BestSellerCarouselImage}
                                  style={{height:100,width:'100%'}}
                                  />
                                  <Text style={{color:'#333',textAlign:'center',marginTop:8,fontSize:13,fontFamily:"Montserrat-Regular"}}>{BestSellerCarouselData.BestSellerCarouselTitle}</Text>
                                   <View style={{flexDirection:'row',justifyContent:'center'}}>
                                      <Icon
                                      name="rupee"
                                      type="font-awesome"
                                      size={15}
                                      color="#666"
                                      iconStyle={{marginTop:5,marginRight:3,}}
                                      />
                                      <Text style={{color:'#333',textAlign:'center',marginTop:8,fontSize:13,fontFamily:"Montserrat-Regular"}}>{BestSellerCarouselData.BestSellerCarouselPrice}</Text>
                                  </View>
                                  <Button
                                    onPress={()=>this.props.navigation.navigate('CartComponent')}
                                    title={"ADD TO CART"}
                                    buttonStyle={styles.button1}
                                    containerStyle={styles.buttonContainer1}
                                    icon={
                                        <Icon
                                        name="shopping-cart"
                                        type="feather"
                                        size={25}
                                        color="#fff"
                                        iconStyle={{marginRight:10}}
                                        />
                                      }
                                    />
                                </View>
                              </TouchableOpacity>
                            </View>
                            </View>
                            )
                        })
                       }
                </View>
              </View>
          </ScrollView>
          <View style={{borderWidth:1,borderColor:"#f2f2f2",width:"100%",marginVertical:10}}></View>
        </View>
    
    );
  }
}
