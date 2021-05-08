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
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/PopularComponentsStyles.js';
import { colors, sizes } from '../../AppDesigns/currentApp/styles/styles.js';
import ValidationComponent from "react-native-form-validator";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Loading from '../../../AppDesigns/currentApp/styles/ScreenComponentStyles/LoadingStyles.js';

const window = Dimensions.get('window');

export default class PopularComponent extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      poupularImgData:[
        {
          "popImage" : require("../../AppDesigns/currentApp/images/7.png"),
        },
        {
          "popImage" : require("../../AppDesigns/currentApp/images/8.png"),
        },
        {
          "popImage" : require("../../AppDesigns/currentApp/images/9.png"),
        },
        {
          "popImage" : require("../../AppDesigns/currentApp/images/10.png"),
        },
      ] 
    };
  }
  render() {
    return (
      <View style={{marginBottom:"15%"}}>
        <View>
          <Text style={styles.title}>Popular</Text> 
        </View>
        <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap',}}>
          {this.state.poupularImgData.map((poupularImgData,i)=>{
            return(
              <TouchableOpacity key={i}>
                <View  style={[{borderWidth:1,borderColor:'#f1f1f1',backgroundColor:"f1f1f1",width:175,height:100,flexDirection:'row',marginBottom:10,borderRadius:10,},(i%2==0?{marginRight:10}:{})]}>
                  <Image
                    source={poupularImgData.popImage}
                    style={{ height:100,borderRadius:10,width:175}}
                  />
                </View>
              </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
    );
  }
}
