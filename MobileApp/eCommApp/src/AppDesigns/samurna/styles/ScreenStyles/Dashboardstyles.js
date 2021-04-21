import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
  container:{
    alignItems:'center',
    minHeight:'100%',
    backgroundColor: '#fff',
    padding:15
  },
  marginBottom30:{
    marginBottom:30,
  },
  dashboardtxt:{
    fontFamily:"Montserrat-Regular",
  },
  superparent:{
    flex:1, backgroundColor:'#fff'
  },
  formWrapper:{
    width:'100%',
  },
  formInputView: {
    width:'90%',
  },
  bannerwrap: {
    width:'100%',
  },
  inputWrapper : {
    width:'100%',
    borderColor:'#666',
    borderWidth:1,
    flexDirection:'row',
    borderRadius: 3,
  },

  inputImgWrapper : {
    width:'12%',
    justifyContent:'center',
    alignItems:'center',
    borderRightWidth:1,
    borderColor: colors.textLight,
    marginVertical:5,
  },

  inputTextWrapper : {
    width:'88%',
    justifyContent:'center'
  },
  buttonContainer:{
    width:'100%',
    ...Platform.select({
      ios:{
        justifyContent:'center',
        marginLeft: 40

      },
      android : {
        alignItems:'center'
      }
    })
  },

  button:{
    width:'90%',
    backgroundColor: colors.button,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:4
  },

  buttonText:{
    color: colors.buttonText,
    fontSize: 15,
    fontFamily:"Montserrat-Regular",
  },

  textContainer:{
    height:40,
    paddingLeft:4
  },
  textInputContainer:{
    backgroundColor:'transparent',
    borderBottomColor: "transparent"
  },
  textTitle:{
    fontFamily:"Montserrat-Regular",
    top:0
  },
  textStyle:{
    fontFamily:"Montserrat-Regular",
    backgroundColor:'transparent',
    paddingTop:0,
    marginTop:-6
  },
  textLabel:{
    backgroundColor:'#fff',
    fontFamily:"Montserrat-Regular",
    top:-10,
    // left:-4,
    paddingHorizontal:2
  },

  ddContainer:{
    backgroundColor:'transparent',
    height: 40,
    // fontFamily:"Montserrat-Regular"
    paddingLeft:4
  },
  ddItemText:{
    fontFamily:"Montserrat-Regular"
  },
  ddInputContainer:{
    borderBottomColor: 'transparent',
    // paddingLeft:5
  },
  ddLabelText:{
    backgroundColor:'#fff',
    top:0,
    // left:5,
    fontFamily:"Montserrat-Regular",
    fontSize:15,
    paddingHorizontal:2
  },
  ddStyle:{
    fontFamily:"Montserrat-Regular"
  },
  head: {
    backgroundColor: '#546e7a',
    justifyContent:'center',
  },
  subHeadText: {
    textAlign: 'center',
    color:'#fff',
    paddingVertical:5,
    paddingHorizontal:1,
    fontFamily:"Montserrat-Regular",
    fontSize:12
  },
  text: {
    textAlign: 'center',
    paddingVertical:5,
    paddingHorizontal:2,
    color:'#333',
    fontFamily:"Montserrat-Regular"
  },

});
