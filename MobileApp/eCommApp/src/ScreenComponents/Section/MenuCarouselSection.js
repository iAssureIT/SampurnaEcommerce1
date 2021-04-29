import React from 'react';
import {Text,View,TouchableOpacity,Image,ScrollView,Animated,ImageBackground} from 'react-native';
import styles               from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/MenuCarouselSectionStyles.js';
import ValidationComponent  from "react-native-form-validator";
import axios                from 'axios';
import { colors,projectName }           from '../../AppDesigns/currentApp/styles/styles.js';
export default class MenuCarousel extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      sections : [],
      noImage  : require('../../AppDesigns/currentApp/images/noimagesection.jpeg')
    };
  }
  componentDidMount(){
    console.log("projectName",projectName);
    axios.get("/api/sections/get/get_megamenu_list")
      .then((response)=>{      
        this.setState({
          sectionDetails  : response.data,                                                                             
        },() =>{
          console.log("sectionDetails",this.state.sectionDetails)
        }
        );                   
      })
      .catch((error)=>{console.log('error in get_megamenu_list', error);})
}  
  componentWillReceiveProps(nextProps){
    this.setState({
      sections:nextProps.sections
    },()=>{
    });
  }
  
  render() {
      return (
        <View>
          <View>
            <Text style={styles.title}>List of Sections</Text> 
          </View>
          <Animated.ScrollView   scrollEventThrottle={1}  horizontal={true} showsHorizontalScrollIndicator={true} pagingEnabled={true}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {x: 50},
                  },
                },
              ],
              {useNativeDriver: true}, // <-- Add this
            )}
          >
             <View  style={styles.proddets}>
             {
                this.state.sectionDetails && this.state.sectionDetails.map((data, index) => {                                                               
                  console.log("data.sectionImg===>>",data.sectionImage);  
                  return (
                        <View key={index} style={styles.mainrightside}>
                           <TouchableOpacity onPress={()=>this.props.navigate('CategoriesComponent',{section_id:data._id})}>
                            <ImageBackground onPress={()=>this.props.navigate('CategoriesComponent',{section_id:data._id})} source={data.sectionImage ? {uri : data.sectionImage}:this.state.noImage} style={styles.sectionImages}>
                                <Text style={styles.sectionTitle}>{data.section}</Text>
                              </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    )
                })
              }
              </View>
              </Animated.ScrollView>
        <View style={styles.menuborderstyle}></View>
    </View>
    
    );
  }
}