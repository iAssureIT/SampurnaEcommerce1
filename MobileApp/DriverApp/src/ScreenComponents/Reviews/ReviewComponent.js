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
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/ReviewComponentsStyles';
import { colors, sizes } from '../../AppDesigns/currentApp/styles/styles.js';
import ValidationComponent from "react-native-form-validator";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Loading from '../../../AppDesigns/currentApp/styles/ScreenComponentStyles/LoadingStyles.js';

const window = Dimensions.get('window');

export default class ReviewComponent extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  render() {
    return (
      <View style={{marginBottom:"15%"}}>
       <View style={{flexDirection:'row',marginTop:16}}>
          <Icon
              name="rate-review"
              type="MaterialIcons"
              size={25}
              color="#c10000"
              iconStyle={{marginRight:10,}}
              />
          <Text style={{fontSize:13,fontFamily:"Montserrat-SemiBold",color:"#333",}}>Top Reviews</Text>
        </View>
        <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap',marginTop:10}}>
          <Icon
            name="user-circle-o"
            type="font-awesome"
            size={16}
            color="#666"
            iconStyle={{marginRight:10,marginTop:3}}
            />
          <Text style={{fontSize:13,fontFamily:"Montserrat-SemiBold",color:"#333",marginRight:10,}}>Priya Shah</Text>
          <Text style={{fontSize:12,fontFamily:"Montserrat-Regular",color:"#666",}}>3 May 2019</Text>
        </View>
        <View style={{flexDirection:'row',marginTop:10}}>
           <Icon
              name="star"
              type="font-awesome"
              size={25}
              color="#FFA500"
              iconStyle={{marginRight:10,}}
              />
              <Icon
              name="star"
              type="font-awesome"
              size={25}
              color="#FFA500"
              iconStyle={{marginRight:10,}}
              />
              <Icon
              name="star-o"
              type="font-awesome"
              size={25}
              color="#666"
              iconStyle={{marginRight:10,}}
              />
              <Icon
              name="star-o"
              type="font-awesome"
              size={25}
              color="#666"
              iconStyle={{marginRight:10,}}
              />
              <Icon
              name="star-o"
              type="font-awesome"
              size={25}
              color="#666"
              iconStyle={{marginRight:10,}}
              />
        </View>
        <View style={{marginTop:10}}>
          <Text style={{fontSize:13,fontFamily:"Montserrat-Regular",color:"#666"}}>Very nice saree 12 people foud this helpful</Text>
        </View>
      </View>
    );
  }
}
