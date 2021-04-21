import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../CommonStyles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
const window = Dimensions.get('window');

export default StyleSheet.create({

  footer:{
    width:'100%',
    position:'absolute',
    bottom:0,
    height:50,
    flexDirection:'row',
    backgroundColor:'#fff',
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    },
    
    elevation: 24,


    borderColor:'#f1f1f1',
    justifyContent:'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 1,
    // shadowRadius: 5,
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
  },
  outerWrapper:{
   borderWidth:1,borderColor:'#80c21c',
   backgroundColor:'#80c21c',
   padding:10,
   borderRadius:50,
  },
  Wrapper:{
    justifyContent:'center',backgroundColor:"#80c21c",alignSelf:"center",position:"absolute",zIndex:100,bottom:25,borderWidth:10,borderColor: '#DCDCDC',borderRadius:100,padding:5,
  },
  footerTitle:{
    textAlign:'center',fontFamily:"Montserrat-SemiBold",fontSize:12
  },
  iconOuterWrapper:{
    flex:0.5,backgroundColor:'#fff',borderTopLeftRadius:25,padding:10
  },
  notificationText: {

    ...Platform.select({
   ios:{
         position: 'absolute',
         right: 4,
         top: -15,
         borderRadius: 29,
         width: 15,
         height: 15,
         textAlign: 'center',
         color: '#fff',
         fontSize: 12,
         backgroundColor: '#dc3545',
         fontFamily:"Montserrat-Regular",
   },
   android : {
         position: 'absolute',
         right: 18,
         top: -10,
         borderRadius: 9,
         width: 16,
         height: 18,
         textAlign: 'center',
         color: '#fff',
         fontSize: 10,
         paddingTop:2,
         backgroundColor: '#80c21c',
         fontFamily:"Montserrat-SemiBold",

   }
 })
},

  iconOuterWrapper2:{
    flex:0.5,backgroundColor:'#fff',borderTopRightRadius:25,padding:10
  }
 });