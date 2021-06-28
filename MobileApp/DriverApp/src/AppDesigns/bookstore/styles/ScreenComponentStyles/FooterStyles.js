import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
const window = Dimensions.get('window');

export default StyleSheet.create({

  footer:{
    width:'100%',
    position:'absolute',
    bottom:0,
    height:60,
    flexDirection:'row',
    backgroundColor:'#fff',
    // borderTopWidth:1,
    borderTopColor:'#ccc',
    elevation: 15,
    justifyContent:'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
  },
  outerWrapper:{
   borderWidth:1,borderColor:'#ed3c55',
   backgroundColor:'#ed3c55',padding:10,
   borderRadius:50,
  },
  Wrapper:{
    justifyContent:'center',backgroundColor:"#ed3c55",alignSelf:"center",position:"absolute",zIndex:100,bottom:25,borderWidth:10,borderColor: '#DCDCDC',borderRadius:100,padding:5,
  },
  footerTitle:{
    textAlign:'center',fontFamily:"Montserrat-SemiBold",fontSize:12
  },
  iconOuterWrapper:{
    flex:0.5,backgroundColor:'#fff',borderTopLeftRadius:25,padding:10
  },
  iconOuterWrapper2:{
    flex:0.5,backgroundColor:'#fff',borderTopRightRadius:25,padding:10
  }
 });