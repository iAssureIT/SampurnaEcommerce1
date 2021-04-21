import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../CommonStyles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
const window = Dimensions.get('window');

export default StyleSheet.create({
  container:{
    borderWidth:1,borderColor:"#d8ab46",fontFamily: 'Montserrat-Regular',backgroundColor:"#121212"
  },
  labelStyle:{
    color:colors.labelStyle
  }
});
