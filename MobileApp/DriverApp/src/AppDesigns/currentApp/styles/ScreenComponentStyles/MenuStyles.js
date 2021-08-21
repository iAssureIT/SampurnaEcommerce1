import { StyleSheet, Dimensions } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
  bgImage:{
    // flex:1,
    width:null,
    height:window.height,
    alignItems:'center',
    padding:10, 
    opacity:1,
    borderBottomWidth:2,
    borderColor:'#fff'
  },
  container:{
    // flex:1,
    width:'100%',
    height:'100%',
    // backgroundColor:'red',
  },
  imageOuterCircle:{
    height:100,
    width:100,
    backgroundColor:'transparent',
    borderRadius:100/2,
    borderWidth:2,
    borderColor:colors.primary,
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
    marginBottom:10,
  },
  headText:{
    fontSize:17,
    color: colors.buttonText,
    fontFamily:"Montserrat-SemiBold",
  },
  menuWrapper:{
    // backgroundColor:'#ff0',
    width:'100%',
    alignItems:'center',
    marginTop:40
  },
  menu:{
    flexDirection: 'row',
    // borderBottomWidth:1,
    alignItems:'center',
    justifyContent:'flex-start',
    marginBottom:10,
    // borderColor: colors.textLight,
    // paddingVertical:32,
    padding:13,
    width:'100%',
  },
  menuText:{
    color: '#033554',
    // flex:0.8,
    width:'88%',
    fontSize: 16,
    alignSelf:'flex-start',
    marginHorizontal:10,
    fontFamily:"Montserrat-Regular",
  },
  menuTextSelected:{
    color: '#fff',
    // flex:0.8,
    width:'88%',
    fontSize: 16,
    alignSelf:'flex-start',
    marginHorizontal:10,
    fontFamily:"Montserrat-Regular",
  },
  iconContainer:{
    // flex:0.2,
    width:25,
    alignItems:'flex-start'
  },
  userName:{
    color:'#033554',
    fontSize:16,
    fontFamily:"segoe-ui",
    fontWeight:'bold',
  },
   ddContainer:{
    backgroundColor:'#eee',
    height: 'auto',
    borderWidth:1,
    borderRadius:50,
    marginTop:20,
    borderColor:"#aaa"
    // fontFamily:"Montserrat-Regular"
  },
  ddItemText:{
    fontFamily:"Montserrat-Regular",
     backgroundColor:'#eee',
  },
  ddInputContainer:{
    borderBottomColor: 'transparent',
    paddingLeft:5,
    height:30,

  },
  ddLabelText:{
    backgroundColor:'#eee',
    top:-5,
    left:5,
    fontFamily:"Montserrat-Regular",
    fontSize:15,
    paddingHorizontal:5
  },
  ddStyle:{
    fontFamily:"Montserrat-Regular"
  },
});