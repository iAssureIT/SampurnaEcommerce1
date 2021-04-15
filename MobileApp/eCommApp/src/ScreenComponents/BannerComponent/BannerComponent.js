import React from 'react';
import {
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/BannerComponentStyles.js';
import ValidationComponent from "react-native-form-validator";
import Carousel from 'react-native-banner-carousel';
import axios from 'axios';

const BannerHeight = 230;
 
// const BannerImages = [
//   {
//     bannerimages : require("../../AppDesigns/currentApp/images/no_banner_image.png"),
//   },
//   {
//     bannerimages : require("../../AppDesigns/currentApp/images/no_banner_image.png"),
//   },
//   {
//     bannerimages : require("../../AppDesigns/currentApp/images/no_banner_image.png"),
//   },
//   {
//     bannerimages : require("../../AppDesigns/currentApp/images/no_banner_image.png"),
//   },
//   // {
//   //   imageSource : require("../../AppDesigns/currentApp/images/OrganicBanner.jpg"),
//   // },

// ];

export default class BannerComponent extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      BannerImages : [
        // {
        //   bannerimages : require("../../AppDesigns/currentApp/images/no_banner_image.png"),
        // },
        // {
        //   bannerimages : require("../../AppDesigns/currentApp/images/no_banner_image.png"),
        // },
        // {
        //   bannerimages : require("../../AppDesigns/currentApp/images/no_banner_image.png"),
        // },
        // {
        //   bannerimages : require("../../AppDesigns/currentApp/images/no_banner_image.png"),
        // }      
      ]
      
    };
  }

  componentDidMount(){
    axios.get('/api/bannerimgs/get')
    .then((res)=>{
      console.log('bannerimgs res', res.data);
      this.setState({
        BannerImages : res.data
      })
    })
    .catch((error)=>{
      console.log('error', error);
    })
  }

  
  renderPage(image, index) {
    console.log("each Banner Images",image.bannerimages)
    var Bannerimages = image.bannerimages ? {uri : image.bannerimages} : require("../../AppDesigns/currentApp/images/no_banner_image.png")
        return (
            <View key={index}>
                <ImageBackground 
                  style={{ width:"100%", height: 230,}} 
                  // source={{uri : image.bannerimages}}
                  source={{ uri: image.bannerimages }}
                  // resizeMode={"contain"}
                >
                </ImageBackground>
            </View>
        );
    }

  render() {


    return (
     
        <View style={styles.bannerWrapper}>
            <Carousel
               autoplay
               autoplayTimeout={5000}
               loop
               index={0}
              //  pageSize={BannerWidth}
               pageSize={360}
               >
              {this.state.BannerImages.map((image, index) => this.renderPage(image, index))}
            </Carousel>
        </View>
    
    );
  }
}
